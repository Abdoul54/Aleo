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

@app.route('/api/admin/delete', methods=['GET'])
def delete_data():
    pass