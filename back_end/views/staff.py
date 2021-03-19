from flask import Blueprint, request, session
from flaskapp.create_flask import app
from mysql.create_db import db
from models.recuritpost import Recruitpost
import tools.login_check as login_check
from models.performance import Performance
from models.hr import Hr
from models.corporation import Corporation

blue_print_name = "/staff"
user_blueprint = Blueprint(blue_print_name, __name__)


@user_blueprint.route('/jixiaoCheck', methods=['GET', 'POST'])
@login_check.is_user_login
def jixiaoCheck():
    try:
        if request.method == "GET":
            raise Exception("method must be post")

        user_id = request.form.get('uid')

        if not all([user_id]):
            raise Exception("uid must not be empty")

        retrieve_list = ["performance_id", "corporation_id", "user_id",
                         "hr_id", "value", "description", "registerdate", "department", "post"]
        querylist = Performance.get_obj(retrieve_list)
        msg = db.session.query(*querylist, Hr.hr_id, Hr.name,
                               Corporation.corporation_id, Corporation.name). \
            filter(Performance.user_id == user_id). \
            filter(Performance.hr_id == Hr.hr_id). \
            filter(Performance.corporation_id == Corporation.corporation_id). \
            order_by(Performance.registerdate.desc())

        retrieve_list = ["performance_id", "corporation_id", "user_id",
                         "hr_id", "value", "description", "registerdate",
                         "department", "post", "hr_name", "corporation_id"]

        return_msg = []
        for line in msg:
            line = list(line)
            line[6] = line[6].strftime('%Y-%m-%d')
            del line[9]
            del line[10]
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
