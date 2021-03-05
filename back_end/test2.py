from flask import Flask
from mysql.create_db import db
import mysql.mysql_config as config
from flask_script import Manager

import os
for i in os.listdir("models"):
    if os.path.splitext(i)[1] == ".py":
        __import__("models."+os.path.splitext(i)[0])
import models.testmodel

app = Flask(__name__)
app.config.from_object(config)
db.init_app(app)

#python test2.py runserver

@app.route('/')
def hello_world():
    db.create_all()
    return 'Hello, World!'

manage = Manager(app=app)
manage.run()


