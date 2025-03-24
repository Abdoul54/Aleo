import os
import logging
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.common.exceptions import JavascriptException

from app.database import insert_posts

# Configure logging
logging.basicConfig(filename='scraping.log', level=logging.INFO)

def scrape_avito(*cities):
    """Scrape posts from Avito website"""
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    
    # Get chrome driver path from environment variables
    chrome_driver_path = os.environ.get('CHROMEDRIVER_PATH')
    
    # Initialize Chrome Driver
    service = Service(executable_path=chrome_driver_path)
    driver = webdriver.Chrome(service=service, options=chrome_options)
    
    all_data = []
    categories = ['Vehicle', 'Property', 'Job']
    
    for category in categories:
        try:
            for city in cities:
                if category == 'Vehicle':
                    url = f'https://www.avito.ma/fr/{city}/v%C3%A9hicules-%C3%A0_vendre'
                elif category == 'Property':
                    url = f'https://www.avito.ma/fr/{city}/immobilier-%C3%A0_vendre'
                elif category == 'Job':
                    url = f'https://www.avito.ma/fr/{city}/emploi_et_services-%C3%A0_vendre'
                
                driver.get(url)
                category_data = []
                
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
                            localisation = localisation_element.text if localisation_element else ""
                            image = image_element.get_attribute('src') if image_element else ""
                            type_value = type_element.text if type_element else ""
                            
                            price_element = driver.execute_script(
                                f"return document.querySelector('#__next > div > main > div > div:nth-child(6) > div.sc-1lz4h6h-0.gzFzOo > div > div.sc-1nre5ec-1.fzpnun.listing > div:nth-child({i}) > a > div.sc-ibbrkc-0.sc-jejop8-9.feyxCM.hjXlHz > div:nth-child(1) > div > span > div > span:nth-child(1)');")

                            price = 0
                            if price_element is not None:
                                try:
                                    price = int(price_element.text.replace(',', ''))
                                except (ValueError, TypeError):
                                    price = 0
                                    
                            category_data.append({
                                "category": category,
                                "title": title,
                                "price": price,
                                "link": link,
                                "image": image,
                                "localisation": localisation,
                                "type": type_value,
                                "platform": "www.avito.ma",
                                "outdate": False,
                                "scraped_at": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                            })
                        else:
                            continue
                    except JavascriptException:
                        break
                
                all_data.extend(category_data)
                
        except Exception as e:
            logging.error(
                f"{datetime.now()}:\nAn error occurred while scraping {category.lower()}s: {e}")
    
    driver.quit()
    
    # Insert the scraped data
    inserted_count = insert_posts(all_data)
    
    logging.info(f"{datetime.now()}: Scraping completed successfully. Added {inserted_count} new posts.")
    return f"Scraping completed. Added {inserted_count} new posts."