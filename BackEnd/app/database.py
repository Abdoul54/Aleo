from pymongo import MongoClient
import requests, re
def ConnectDB():
  client = MongoClient('mongodb://localhost:27017/mydb?directConnection=true')
  db = client['Scrape']
  return db, client
    
def getPost():  
  return list(ConnectDB()[0].Posts.find())

def findPost(Category, q):
  regex = re.compile(q, re.IGNORECASE)
  cursor = ConnectDB()[0].Posts.find(
        {"$or": [
            {"Title": {"$regex": regex}},
            {"localisation": {"$regex": regex}},
            {"type": {"$regex": regex}}
        ]}
  )
  posts = [post for post in cursor if post['Category'] == Category]

  return list(posts)

def DisconnectDB():
    ConnectDB()[1].close()

def check():
  for post in ConnectDB()[0].Posts.find():
    status = requests.get(post['Link']).status_code
    if str(status)[0] == '4':
      ConnectDB()[0].Posts.delete_one({'Link':post['Link']})
  
