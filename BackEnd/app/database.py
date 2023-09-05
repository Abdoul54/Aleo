from datetime import datetime
import logging, re, os
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import JavascriptException
from pymongo import MongoClient
from linkpreview import link_preview
from bson.objectid import ObjectId
from dotenv import load_dotenv

def ConnectDB():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    dotenv_path = os.path.join(script_dir, '..', '.env')
    load_dotenv(dotenv_path)
    client = MongoClient(os.environ.get('MONGODB_URI'))
    db = client['Scrape']
    return db, client
    
def getPost():  
  return list(ConnectDB()[0].Posts.find())

import re

def findPost(category, q, min_price = None, max_price = None, type_filter = None, localization_filter = None):
    regex = re.compile(q, re.IGNORECASE)
    
    filter_query = {
        "$or": [
            {"title": {"$regex": regex}},
            {"localisation": {"$regex": regex}},
            {"type": {"$regex": regex}}
        ],
        "category": category
    }
    
    if min_price is not None and str(min_price).isdigit():
        min_price = int(min_price)
        filter_query["price"] = {"$gte": min_price}
        
    if max_price is not None and str(max_price).isdigit():
        max_price = int(max_price)
        filter_query["price"] = {"$lte": max_price}
        
    if min_price is not None and max_price is not None and str(min_price).isdigit() and str(max_price).isdigit():
        min_price, max_price = int(min_price), int(max_price)
        filter_query["price"] = {"$gte": min_price, "$lte": max_price}
        
    if type_filter:
        filter_query["type"] = type_filter
        
    if localization_filter:
        filter_query["localisation"] = re.compile(localization_filter, re.IGNORECASE)
    
    cursor = ConnectDB()[0].Posts.find(filter_query)
    
    return list(cursor)

def DisconnectDB():
    ConnectDB()[1].close()

def removePosts():
    for post in ConnectDB()[0].Posts.find():
        try:
            if post.get('outdate', False):
                ConnectDB()[0].Posts.delete_one({'link': post['link']})
        except Exception as e:
            print(f"Error while deleting post: {e}")

def outdatedPosts():
    return ConnectDB()[0].Posts.count_documents({"outdate":True})

def checkerV():
    avito_title_prefix = 'Vente et achat en ligne partout au Maroc à vendre - Avito'

    # Use a projection to fetch only the necessary fields 'link' and 'title'
    cursor = ConnectDB()[0].Posts.find({'category': 'Vehicle'}, {'link': 1, 'title': 1})

    for post in cursor:
        try:
            if link_preview(post['link']).title.startswith(avito_title_prefix):
                ConnectDB()[0].Posts.update_one(
                    {'_id': post['_id']},
                    {'$set': {'outdate': True}}
                )

        except Exception as e:
            print(e)

    print('Properties Checked!')

def checkerP():
    avito_title_prefix = 'Vente et achat en ligne partout au Maroc à vendre - Avito'

    # Use a projection to fetch only the necessary fields 'link' and 'title'
    cursor = ConnectDB()[0].Posts.find({'category': 'Property'}, {'link': 1, 'title': 1})

    for post in cursor:
        try:
            if link_preview(post['link']).title.startswith(avito_title_prefix):
                post['outdate'] = True
        except Exception as e:
            print(e)

    print('Properties Checked!')

def checkerJ():
    avito_title_prefix = 'Vente et achat en ligne partout au Maroc à vendre - Avito'

    # Use a projection to fetch only the necessary fields 'link' and 'title'
    cursor = ConnectDB()[0].Posts.find({'category': 'Job'}, {'link': 1, 'title': 1})

    for post in cursor:
        try:
            if link_preview(post['link']).title.startswith(avito_title_prefix):
                post['outdate'] = True
        except Exception as e:
            print(e)

    print('Properties Checked!')


def postCounter():
    db = ConnectDB()[0]
    Posts = db.Posts.count_documents({})
    Vehicles = db.Posts.count_documents({"category":"Vehicle"})
    Properties = db.Posts.count_documents({"category":"Property"})
    Jobs = db.Posts.count_documents({"category":"Job"})
    return {"Posts":Posts,"Vehicles":Vehicles,"Properties":Properties,"Jobs":Jobs,"outDatedPosts":outdatedPosts()}

def deletePost(id):
    db = ConnectDB()[0]
    res = db.Posts.delete_one({"_id": ObjectId(id)})
    return res.deleted_count > 0


def Insert(data):
    try:
        # Se connecter à la base de données MongoDB
        db = ConnectDB()[0]

        # Supprimer les articles existants
        data = [item for item in data if len(
            list(db.Posts.find({"link": {"$eq": item['link']}}))) == 0]
        # Insérer les données dans la collection
        db.Posts.insert_many(data)
        print("Data inserted successfully")

        # Fermer la connexion à la base de données
        DisconnectDB()
    except Exception as e:
        logging.error(
            f"{datetime.now()}:\nAn error occurred while saving data to the database: {e}")


""" Scraping section"""

# Configurer les journaux
logging.basicConfig(filename='scraping.log', level=logging.INFO)

def scrape(*cities):
    chrome_options = Options()
    # Exécuter Chrome en mode headless
    chrome_options.add_argument("--headless")

    # Définir le chemin du pilote Chrome en fonction de la configuration
    chrome_driver_path = "C:/Program Files (x86)/chromedriver.exe"

    # Initialiser Chrome Driver
    driver = webdriver.Chrome(
        executable_path=chrome_driver_path, options=chrome_options)
    data = []
    Categories = ['Vehicle', 'Property', 'Job']
    url = ''
    for Category in Categories:
        try:
            for city in cities:
                if Category == 'Vehicle':
                    url = f'https://www.avito.ma/fr/{city}/v%C3%A9hicules-%C3%A0_vendre'
                elif Category == 'Property':
                    url = f'https://www.avito.ma/fr/{city}/immobilier-%C3%A0_vendre'
                elif Category == 'Job':
                    url = f'https://www.avito.ma/fr/{city}/emploi_et_services-%C3%A0_vendre'
                driver.get(url)
                for i in range(1, 31):
                    try:
                        title_element = driver.execute_script(
                            f"return document.querySelector('#__next > div > main > div > div:nth-child(6) > div.sc-1lz4h6h-0.gzFzOo > div > div.sc-1nre5ec-1.fzpnun.listing >  div:nth-child({i}) > a > div.sc-ibbrkc-0.sc-jejop8-9.feyxCM.hjXlHz >     div:nth-child(1) > h3 > span');")
                        link_element = driver.execute_script(
                            f"return document.querySelector('#__next > div > main > div > div:nth-child(6) > div.sc-1lz4h6h-0.gzFzOo > div > div.sc-1nre5ec-1.fzpnun.listing > div:nth-child({i}) > a')")
                        localisation_element = driver.execute_script(
                            f"return document.querySelector('#__next > div > main > div > div:nth-child(6) > div.sc-1lz4h6h-0.gzFzOo > div > div.sc-1nre5ec-1.fzpnun.listing > div:nth-child({i}) > a > div.sc-ibbrkc-0.sc-jejop8-9.feyxCM.hjXlHz > div:nth-child(2) > div > div:nth-child(2) > span');")
                        image_element = driver.execute_script(
                            f"return document.querySelector('#__next > div > main > div > div:nth-child(6) > div.sc-1lz4h6h-0.gzFzOo > div > div.sc-1nre5ec-1.fzpnun.listing > div:nth-child({i}) > a > div.sc-jejop8-4.gLljJq > div > div > img')")
                        type_element = driver.execute_script(
                            f"return document.querySelector('#__next > div > main > div > div:nth-child(6) > div.sc-1lz4h6h-0.gzFzOo > div > div.sc-1nre5ec-1.fzpnun.listing > div:nth-child({i}) > a > div.sc-ibbrkc-0.sc-jejop8-9.feyxCM.hjXlHz > div:nth-child(2) > p')")
                        if title_element is not None:
                            title = title_element.text
                            link = link_element.get_attribute('href')
                            localisation = localisation_element.text
                            image = image_element.get_attribute('src')
                            typeV = type_element.text
                            price_element = driver.execute_script(
                                f"return document.querySelector('#__next > div > main > div > div:nth-child(6) > div.sc-1lz4h6h-0.gzFzOo > div > div.sc-1nre5ec-1.fzpnun.listing > div:nth-child({i}) > a > div.sc-ibbrkc-0.sc-jejop8-9.feyxCM.hjXlHz > div:nth-child(1) > div > span > div > span:nth-child(1)');")

                            data.append(
                                {
                                    "category": Category,
                                    "title": title,
                                    "price": int(price_element.text.replace(',', '')) if price_element is not None else 0,
                                    "link": link,
                                    "image": image,
                                    "localisation": localisation,
                                    "type": typeV,
                                    "platform": "www.avito.ma",
                                    "outdated": False,
                                    "scraped_at":datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                                })
                        else:
                            continue
                    except JavascriptException:
                        break
                Insert(data)
        except Exception as e:
            logging.error(
                f"{datetime.now()}:\nAn error occurred while scraping {Category.lower()}s: {e}")
    driver.quit()
    print("Scraping completed successfully")
    return 'Done'
