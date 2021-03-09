from flask_ini import create_app
from flask_script import Manager
from mysql.create_db import db
from flask import render_template

sever_ini = "start.ini"
app = create_app(sever_ini)


# python main.py runserver
@app.route('/')
def hello_world():
    db.create_all()
    return render_template('welcome.html')


def main():
    manage = Manager(app=app)
    # 45.76.99.155
    app.run(threaded=True, host='127.0.0.1', port=5000)
    manage.run()


if __name__ == "__main__":
    main()
