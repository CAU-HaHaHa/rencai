from flask_ini import create_app
from flask_script import Manager
from mysql.create_db import db
app = create_app()


# python main.py runserver
@app.route('/')
def hello_world():
<<<<<<< HEAD
    db.create_all()
=======
    # db.create_all()
>>>>>>> temp
    return 'Hello, World!'


def main():
    manage = Manager(app=app)
    app.run(threaded=True)
    manage.run()


if __name__ == "__main__":
    main()
