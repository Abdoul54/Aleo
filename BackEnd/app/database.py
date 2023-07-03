from pymongo import MongoClient
import re
from linkpreview import link_preview

def InsertDB(post):
  ConnectDB()[0].Posts.insert_one(post)
def ConnectDB():
  client = MongoClient('mongodb://localhost:27017/mydb?directConnection=true')
  db = client['Scrape']
  return db, client
    
def getPost():  
  return list(ConnectDB()[0].Posts.find())

import re

def findPost(category, q, min_price = None, max_price = None, type_filter = None, localization_filter = None):
    regex = re.compile(q, re.IGNORECASE)
    
    filter_query = {
        "$or": [
            {"Title": {"$regex": regex}},
            {"localisation": {"$regex": regex}},
            {"type": {"$regex": regex}}
        ],
        "Category": category
    }
    
    if min_price is not None and str(min_price).isdigit():
        min_price = int(min_price)
        filter_query["Price"] = {"$gte": min_price}
        
    if max_price is not None and str(max_price).isdigit():
        max_price = int(max_price)
        filter_query["Price"] = {"$lte": max_price}
        
    if min_price is not None and max_price is not None and str(min_price).isdigit() and str(max_price).isdigit():
        min_price, max_price = int(min_price), int(max_price)
        filter_query["Price"] = {"$gte": min_price, "$lte": max_price}
        
    if type_filter:
        filter_query["type"] = type_filter
        
    if localization_filter:
        filter_query["localisation"] = localization_filter
    
    cursor = ConnectDB()[0].Posts.find(filter_query)
    
    return list(cursor)

def DisconnectDB():
    ConnectDB()[1].close()

def check():
  for post in ConnectDB()[0].Posts.find():
    try:
      preview = link_preview(post['link'])
      if preview.title is None:
        ConnectDB()[0].Posts.delete_one({'link':post['link']})
    except Exception as e:
      print(e)
