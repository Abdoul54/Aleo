from flask import request
from . import app, database
from bson import ObjectId
import json
class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return super().default(o)


@app.route('/api/posts', methods=['GET'])
def get_posts():
    results = database.getPost()
    return json.dumps(results, cls=JSONEncoder)

@app.route('/api/search/<category>/<q>', methods=['GET'])
def findposts(category, q):
    min_price = request.args.get('minPrice')
    max_price = request.args.get('maxPrice')
    type_filter = request.args.get('type')
    localization_filter = request.args.get('localisation')

    results = database.findPost(category, q, min_price, max_price, type_filter, localization_filter)
    
    return json.dumps(results, cls=JSONEncoder)

@app.route('api/admin/scrape/update', method=['GET'])
def send(msg):
    return 
@app.route('/api/scrape', methods=['POST'])
def start_scraping():
    checked_users = []

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
        data = []
        for Category in Categories:
            try:
                for city in cities:
                    if Category == 'Vehicle':
                        url = f'https://www.avito.ma/fr/{city}/v%C3%A9hicules-%C3%A0_vendre'
                    elif Category == 'Property':
                        url = f'https://www.avito.ma/fr/{city}/immobilier-%C3%A0_vendre'
                    elif Category == 'Job':
                        url = f'https://www.avito.ma/fr/{city}/emploi_et_services-%C3%A0_vendre'
                    
                    # Call the modified scrape_user function with the current city and Category
                    scrape_user(driver, city, Category)
                    driver.get(url)
                    # Your logic to process the user goes here
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

    # Initialize driver and call the scrape function
    driver = initialize_driver()  # Replace with your driver initialization logic
    scrape(driver, 'City1', 'Category1', 'City2', 'Category2')  # Replace with your desired cities and categories

    return jsonify(checked_users)
@app.route('/api/admin/delete', methods=['GET'])
def delete_data():
    pass