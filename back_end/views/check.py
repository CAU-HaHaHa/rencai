from flask import Blueprint, request, session, render_template
from flaskapp.create_flask import app
from mysql.create_db import db
from models.recuritpost import Recruitpost
from datetime import datetime
from models.person import Person
from models.applylist import Applylist
from tools.transform import idcard2ages

blue_print_name = "/check"
user_blueprint = Blueprint(blue_print_name, __name__)


@user_blueprint.route('/personemail', methods=['GET', 'POST'])
def show():
    try:
        if request.method == "POST":
            raise Exception("method must be get")
        valid = request.values.get('valid', "")
        if valid == "":
            raise Exception("激活验证失败")
        person = Person.query.filter(Person.emailcheck == valid).first()
        return_msg = "激活成功"
        if not person:
            raise Exception("激活验证失败")
        if person.emailstate == 1:
            return_msg = "邮箱已经被激活了"
        person.emailstate = 1
        db.session.commit()
        return render_template("checkemail.html", status=1, msg=return_msg,
                               location="http://" + app.config['SERVER_INI']["server_ip"])
    except Exception as e:
        return render_template("checkemail.html", status=0, msg=str(e),
                               location="http://" + app.config['SERVER_INI']["server_ip"])


app.register_blueprint(blueprint=user_blueprint, url_prefix=blue_print_name)
