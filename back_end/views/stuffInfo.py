from flask import Blueprint, request, session
from flaskapp.create_flask import app
from mysql.create_db import db
from models.person import Person
import tools.login_check as login_check

blue_print_name = "/StuffInfo"
user_blueprint = Blueprint(blue_print_name, __name__)


@user_blueprint.route('/', methods=['GET', 'POST'])
@login_check.is_admin_login
def stuffInfo():
    try:
        if request.method == "POST":
            raise Exception("method must be get")
        retrieve_list = ["user_id", "username", "password", "name", "sex",
                         "identitycard", "tags", "edubackground", "eduschool",
                         "briefintro", "tel", "email", "politicsstatus", "address",
                         "postcode", "workaddress"]
        querylist = Person.get_obj(retrieve_list)
        msg = db.session.query(*querylist)
        return_msg = []
        for line in msg:
            temp = zip(retrieve_list, line)
            return_msg.append(dict(temp))

        return dict(
            status=1,
            message="success",
            data=return_msg
        )
    except Exception as e:
        return dict(
            status=0,
            message=str(e),
            data="none"
        )


app.register_blueprint(blueprint=user_blueprint, url_prefix=blue_print_name)
