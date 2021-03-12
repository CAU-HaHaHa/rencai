from flask_ini import create_app
from flask_script import Manager
from mysql.create_db import db
from flask import render_template, session
from tools.readini import get_server_ini

sever_ini = "start.ini"
app = create_app(sever_ini)
ini = get_server_ini(sever_ini)


# python main.py runserver
@app.route('/')
def hello_world():
    debug = app.config['SERVER_INI'].get("debug", "")
    user_type = session.get("user_type", "")
    return render_template('welcome.html', server_ip="http://" + ini["server_ip"], debug=debug,
                           user_type=user_type)


def main():
    manage = Manager(app=app)
    # 45.76.99.155
    app.run(threaded=True, host=ini["host_ip"], port=ini["host_port"])
    manage.run()


if __name__ == "__main__":
    main()
