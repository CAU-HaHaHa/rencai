from flask import Blueprint, request, session
from flaskapp.create_flask import app
from mysql.create_db import db
from models.person import Person
from models.performance import Performance

blue_print_name = "/dangan"
user_blueprint = Blueprint(blue_print_name, __name__)


@user_blueprint.route('/performance/dataSource', methods=['GET', 'POST'])
def performance_dataSource():
    try:
        if request.method == "POST":
            raise Exception("method must be get")
        retrieve_list = ["performance_id", "corporation_id", "user_id",
                         "hr_id", "value", "description", "registerdate", "department", "post"]
        querylist = Performance.get_obj(retrieve_list)
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


@user_blueprint.route('/performance/newdataSource', methods=['GET', 'POST'])
def newdataSource_dataSource():
    try:
        if request.method == "POST":
            raise Exception("method must be get")
        retrieve_list = ["performance_id", "corporation_id", "user_id",
                         "hr_id", "value", "description", "registerdate", "department", "post"]
        querylist = Performance.get_obj(retrieve_list)
        msg = db.session.query(*querylist)

        tempmessage = dict()
        for line in msg:
            user_id = line[retrieve_list.index("user_id")]
            if tempmessage.get(user_id, 0) == 0:
                tempmessage[user_id] = line
            else:
                history_date = tempmessage[user_id][retrieve_list.index("registerdate")]
                new_date = line[retrieve_list.index("registerdate")]
                if new_date > history_date:
                    tempmessage[user_id] = line

        return_msg = []

        for line in tempmessage.values():
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
