import re
from datetime import datetime
from sqlalchemy import or_, and_
from linkpreview import link_preview

from app import db
from app.models import Post

def get_posts():
    """Get all posts from the database"""
    posts = Post.query.all()
    return [post.to_dict() for post in posts]

def find_post(category, q, min_price=None, max_price=None, type_filter=None, localization_filter=None):
    """Find posts based on search criteria"""
    query = Post.query.filter(Post.category == category)
    
    # Apply text search
    if q:
        search_pattern = f"%{q}%"
        query = query.filter(
            or_(
                Post.title.ilike(search_pattern),
                Post.localisation.ilike(search_pattern),
                Post.type.ilike(search_pattern)
            )
        )
    
    # Apply price filters
    if min_price is not None and max_price is not None:
        try:
            min_price, max_price = int(min_price), int(max_price)
            query = query.filter(Post.price.between(min_price, max_price))
        except (ValueError, TypeError):
            pass
    elif min_price is not None:
        try:
            min_price = int(min_price)
            query = query.filter(Post.price >= min_price)
        except (ValueError, TypeError):
            pass
    elif max_price is not None:
        try:
            max_price = int(max_price)
            query = query.filter(Post.price <= max_price)
        except (ValueError, TypeError):
            pass
    
    # Apply type filter
    if type_filter:
        query = query.filter(Post.type == type_filter)
    
    # Apply localization filter
    if localization_filter:
        query = query.filter(Post.localisation.ilike(f"%{localization_filter}%"))
    
    posts = query.all()
    return [post.to_dict() for post in posts]

def delete_post(id):
    """Delete a post by ID"""
    post = Post.query.filter_by(id=id).first()
    if post:
        db.session.delete(post)
        db.session.commit()
        return True
    return False

def remove_outdated_posts():
    """Remove posts marked as outdated"""
    outdated_posts = Post.query.filter_by(outdate=True).all()
    count = len(outdated_posts)
    
    for post in outdated_posts:
        db.session.delete(post)
    
    db.session.commit()
    return count

def outdated_posts_count():
    """Count posts marked as outdated"""
    return Post.query.filter_by(outdate=True).count()

def check_outdated_posts(category):
    """Check for outdated posts by category"""
    avito_title_prefix = 'Vente et achat en ligne partout au Maroc à vendre - Avito'
    posts = Post.query.filter_by(category=category).all()
    updated_count = 0
    
    for post in posts:
        try:
            if link_preview(post.link).title.startswith(avito_title_prefix):
                post.outdate = True
                updated_count += 1
        except Exception as e:
            print(f"Error checking post {post.id}: {e}")
    
    db.session.commit()
    return updated_count

def post_counter():
    """Count posts by category"""
    total_posts = Post.query.count()
    vehicles = Post.query.filter_by(category='Vehicle').count()
    properties = Post.query.filter_by(category='Property').count()
    jobs = Post.query.filter_by(category='Job').count()
    outdated = outdated_posts_count()
    
    return {
        "Posts": total_posts,
        "Vehicles": vehicles,
        "Properties": properties,
        "Jobs": jobs,
        "outDatedPosts": outdated
    }

def insert_posts(posts_data):
    """Insert new posts, skipping duplicates"""
    inserted_count = 0
    
    for post_data in posts_data:
        # Check if post exists
        existing = Post.query.filter_by(link=post_data['link']).first()
        if not existing:
            new_post = Post(
                category=post_data['category'],
                title=post_data['title'],
                price=post_data.get('price', 0),
                link=post_data['link'],
                image=post_data.get('image'),
                localisation=post_data.get('localisation'),
                type=post_data.get('type'),
                platform=post_data.get('platform'),
                outdate=False,
                scraped_at=datetime.now()
            )
            db.session.add(new_post)
            inserted_count += 1
    
    if inserted_count > 0:
        db.session.commit()
        
    return inserted_count