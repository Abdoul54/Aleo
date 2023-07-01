from app import app
from . import database
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
    print(category,q)
    results = database.findPost(category,q)
    
    return json.dumps(results, cls=JSONEncoder)

