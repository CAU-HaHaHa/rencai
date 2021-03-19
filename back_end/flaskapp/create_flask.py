from flask import Flask
import os
from flask_cors import CORS

# 配置返回页面
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
templates_dir = os.path.join(BASE_DIR, 'templates')

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
static_dir = os.path.join(BASE_DIR, 'static')
app = Flask(__name__, template_folder=templates_dir, static_folder=static_dir)
CORS(app, resources={r"/*": {"origins": "*"}})
