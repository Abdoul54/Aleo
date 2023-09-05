from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins="*")
# Import routes module
from app import routes