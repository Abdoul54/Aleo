from flask import Blueprint, request, jsonify

from app import database
from app.scraper import scrape_avito

# Create blueprint for the API
api_bp = Blueprint('api', __name__, url_prefix='/api')

# Get all posts
@api_bp.route('/posts', methods=['GET'])
def get_posts():
    results = database.get_posts()
    return jsonify(results)

# Search for posts
@api_bp.route('/search/<category>/<q>', methods=['GET'])
def find_posts(category, q):
    min_price = request.args.get('minPrice')
    max_price = request.args.get('maxPrice')
    type_filter = request.args.get('type')
    localization_filter = request.args.get('localisation')

    results = database.find_post(
        category, 
        q, 
        min_price, 
        max_price, 
        type_filter, 
        localization_filter
    )
    
    return jsonify(results)

# Scrape posts
@api_bp.route('/admin/scrape', methods=['GET'])
def scrape_data():
    city = request.args.get('city', 'Rabat')
    result = scrape_avito(city)
    return jsonify({"message": result})

# Delete a post by ID
@api_bp.route('/admin/delete/<id>', methods=['DELETE'])
def delete_post(id):
    deleted = database.delete_post(id)
    return jsonify({"deleted": deleted})

# Get post counts
@api_bp.route('/admin/posts/count', methods=['GET'])
def count_posts():
    return jsonify(database.post_counter())

# Remove outdated posts
@api_bp.route('/admin/posts/remove', methods=['DELETE'])
def remove_outdated_posts():
    removed_count = database.remove_outdated_posts()
    return jsonify({"removed": removed_count})

# Check for outdated posts
@api_bp.route('/admin/posts/check', methods=['GET'])
def check_posts():
    jobs_checked = database.check_outdated_posts('Job')
    vehicles_checked = database.check_outdated_posts('Vehicle')
    properties_checked = database.check_outdated_posts('Property')
    
    return jsonify({
        "jobs_checked": jobs_checked,
        "vehicles_checked": vehicles_checked,
        "properties_checked": properties_checked
    })