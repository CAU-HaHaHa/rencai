from flask import Blueprint, request, session
from flaskapp.create_flask import app
from mysql.create_db import db
from models.corporation import Corporation
import tools.login_check as login_check

blue_print_name = "/CorpInfo"
user_blueprint = Blueprint(blue_print_name, __name__)


@user_blueprint.route('/', methods=['GET', 'POST'])
@login_check.is_user_login
def corpInfo():
    try:
        if request.method == "POST":
            raise Exception("method must be get")
        retrieve_list = ["corporation_id", "name", "registeredcapital", "legalrepresentative",
                         "registrationdate", "tel", "email", "website",
                         "location", "requirementinfo", "structure", "overall_depart",
                         "otherinfo", "is_register", "is_delete"]

        querylist = Corporation.get_obj(retrieve_list)
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
