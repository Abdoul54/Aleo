import json
from datetime import datetime
import logging
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import JavascriptException
from . import database

# Charger la configuration à partir d'un fichier JSON
with open('config.json') as config_file:
    config = json.load(config_file)

# Configurer les journaux
logging.basicConfig(filename='Logs/scraping.log', level=logging.INFO)


def initialize_driver():
    # Configurer les options de Chrome
    chrome_options = Options()
    # Exécuter Chrome en mode headless
    chrome_options.add_argument("--headless")

    # Définir le chemin du pilote Chrome en fonction de la configuration
    chrome_driver_path = config['chrome_driver_path']

    # Initialiser Chrome Driver
    driver = webdriver.Chrome(
        executable_path=chrome_driver_path, options=chrome_options)
    return driver


def scrape(driver, *cities):
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
                print(f"Scraping {'properties' if Category == 'Property' else Category.lower()}s in {city}")
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
                            type = type_element.text
                            price_element = driver.execute_script(
                                f"return document.querySelector('#__next > div > main > div > div:nth-child(6) > div.sc-1lz4h6h-0.gzFzOo > div > div.sc-1nre5ec-1.fzpnun.listing > div:nth-child({i}) > a > div.sc-ibbrkc-0.sc-jejop8-9.feyxCM.hjXlHz > div:nth-child(1) > div > span > div > span:nth-child(1)');")

                            data.append(
                                {
                                    "Category": Category,
                                    "Title": title,
                                    "Price": int(price_element.text.replace(',', '')) if price_element is not None else 'Not Specified',
                                    "link": link,
                                    "image": image,
                                    "localisation": localisation,
                                    "type": type,
                                    "platform": "www.avito.ma"
                                })
                        else:
                            continue
                    except JavascriptException:
                        break
                database.Insert(data)
                print(f"Finished scraping {'properties' if Category == 'Property' else Category.lower()}s in {city}")
        except Exception as e:
            logging.error(
                f"{datetime.now()}:\nAn error occurred while scraping {'properties' if Category == 'Property' else Category.lower()}s: {e}")
    driver.quit()  # Fermer Chrome Driver
    print("Scraping completed successfully")



    def scrape_user(driver, city, Category):
        nonlocal checked_users

        # Your scraping logic for each user goes here
        # ...

        # Add the current user information to the checked_users list
        checked_users.append({
            'user': {'city': city, 'category': Category},
            'message': f"Scraping {Category}s in {city}"
        })

    def scrape(driver, *cities):
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
                    # Call the modified scrape_user function with the current city and Category
                    scrape_user(driver, city, Category)
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
                                type = type_element.text
                                price_element = driver.execute_script(
                                    f"return document.querySelector('#__next > div > main > div > div:nth-child(6) > div.sc-1lz4h6h-0.gzFzOo > div > div.sc-1nre5ec-1.fzpnun.listing > div:nth-child({i}) > a > div.sc-ibbrkc-0.sc-jejop8-9.feyxCM.hjXlHz > div:nth-child(1) > div > span > div > span:nth-child(1)');")

                                data.append(
                                    {
                                        "Category": Category,
                                        "Title": title,
                                        "Price": int(price_element.text.replace(',', '')) if price_element is not None else 'Not Specified',
                                        "link": link,
                                        "image": image,
                                        "localisation": localisation,
                                        "type": type,
                                        "platform": "www.avito.ma"
                                    })
                            else:
                                continue
                        except JavascriptException:
                            break
                    database.Insert(data)

            except Exception as e:
                # Handle any exceptions and add error messages to checked_users if needed
                checked_users.append({
                    'user': {'city': city, 'category': Category},
                    'message': f"Error occurred while scraping {Category}s in {city}: {str(e)}"
                })
        driver.quit()