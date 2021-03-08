from flask_ini import create_app
from flask_script import Manager
from mysql.create_db import db

sever_ini = "start.ini"
app = create_app(sever_ini)

"""
# python main.py runserver
@app.route('/')
def hello_world():
    db.create_all()
    return 'Hello, World!'
"""

@app.route('/test')
def hello_world():

    return app.config["SERVER_INI"]

def main():

    manage = Manager(app=app)
    app.run(threaded=True)
    manage.run()


if __name__ == "__main__":
    main()
