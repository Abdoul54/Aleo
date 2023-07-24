from flask import request
from . import app, database
from bson import ObjectId
import json
class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return super().default(o)

#gets all the posts
@app.route('/api/posts', methods=['GET'])
def get_posts():
    results = database.getPost()
    return json.dumps(results, cls=JSONEncoder)

#search
@app.route('/api/search/<category>/<q>', methods=['GET'])
def findposts(category, q):
    min_price = request.args.get('minPrice')
    max_price = request.args.get('maxPrice')
    type_filter = request.args.get('type')
    localization_filter = request.args.get('localisation')

    results = database.findPost(category, q, min_price, max_price, type_filter, localization_filter)
    
    return json.dumps(results, cls=JSONEncoder)


#scrapes posts
@app.route('/api/admin/scrape', methods=['GET'])
def scrape_data():
    res = database.scrape('Rabat')
    return res

#deletes a post by id
@app.route('/api/admin/delete/<id>', methods=['GET'])
def delete_data(id):
    return {"deleted":database.deletePost(id)}

#returns num of posts
@app.route('/api/admin/posts/count', methods=['GET'])
def countPosts():
    return database.postCounter()

#removes the removable posts
@app.route('/api/admin/posts/remove', methods=['GET'])
def checkPosts():
    return database.removePosts()

#returns number of removable posts
@app.route('/api/admin/posts/404', methods=['GET'])
def checkCounterPosts():
    database.checkerJ()
    database.checkerV()
    database.checkerP()