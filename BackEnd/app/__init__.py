from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'])
# Import routes module
from app import routes