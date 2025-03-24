from app import db
from datetime import datetime
import uuid
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

class Post(db.Model):
    __tablename__ = 'posts'
    
    id = sa.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    category = sa.Column(sa.String(50), nullable=False)
    title = sa.Column(sa.String(255), nullable=False)
    price = sa.Column(sa.Integer, default=0)
    link = sa.Column(sa.String(512), unique=True, nullable=False)
    image = sa.Column(sa.String(512))
    localisation = sa.Column(sa.String(100))
    type = sa.Column(sa.String(100))
    platform = sa.Column(sa.String(100))
    outdate = sa.Column(sa.Boolean, default=False)
    scraped_at = sa.Column(sa.DateTime, default=datetime.now)
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'category': self.category,
            'title': self.title,
            'price': self.price,
            'link': self.link,
            'image': self.image,
            'localisation': self.localisation,
            'type': self.type,
            'platform': self.platform,
            'outdate': self.outdate,
            'scraped_at': self.scraped_at.strftime('%Y-%m-%d %H:%M:%S') if self.scraped_at else None
        }