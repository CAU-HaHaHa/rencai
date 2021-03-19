from flask import Blueprint, request, session
from flaskapp.create_flask import app
from mysql.create_db import db
from models.recuritpost import Recruitpost
import tools.login_check as login_check
from models.corporation import Corporation
from models.person import Person
from models.applylist import Applylist

blue_print_name = "/RecruitpostInfo"
user_blueprint = Blueprint(blue_print_name, __name__)


@user_blueprint.route('/SubmitInfo', methods=['GET', 'POST'])
@login_check.is_user_login
def SubmitInfo():
    try:
        if request.method == "GET":
            raise Exception("method must be post")
        recruitpost_id = request.form.get('recruitpost_id')
        user_id = request.form.get('user_id')

        if not all([user_id, recruitpost_id]):
            raise Exception("user_id, recruitpost_id must not be empty")

        msg_user = db.session.query(Person.user_id, Person.name). \
            filter(Person.user_id == user_id).first()
        if not msg_user:
            raise Exception("user is not available in person form")

        msg_re = db.session.query(Recruitpost.recruitpost_id). \
            filter(Recruitpost.recruitpost_id == recruitpost_id).first()
        if not msg_re:
            raise Exception("recruitpost_id is not available in recruitpost form")

        msg_user = db.session.query(Applylist.user_id, Applylist.recruitpost_id). \
            filter(Applylist.user_id == user_id, Applylist.recruitpost_id == recruitpost_id).first()
        if msg_user:
            raise Exception("already register")

        stafflist = Applylist(
            recruitpost_id=recruitpost_id,
            user_id=user_id,
            description="",
            get_offer=0
        )
        stafflist.save()

        return dict(
            status=1,
            message="success",
            data="none"
        )
    except Exception as e:
        return dict(
            status=0,
            message=str(e),
            data="none"
        )


@user_blueprint.route('/', methods=['GET', 'POST'])
@login_check.is_user_login
def recruitpostInfo():
    try:
        if request.method == "POST":
            raise Exception("method must be get")
        retrieve_list = ["recruitpost_id", "corporation_id", "department", "posttype",
                         "number", "description", "isposted", "registerdate"]
        querylist = Recruitpost.get_obj(retrieve_list)
        msg = db.session.query(*querylist, Corporation.corporation_id, Corporation.name). \
            filter(Recruitpost.corporation_id == Corporation.corporation_id)

        return_list = ["recruitpost_id", "corporation_id", "department", "posttype",
                       "number", "description", "isposted", "registerdate", "corporation_name"]
        return_msg = []

        for line in msg:
            line = list(line)
            del line[8]
            temp = zip(return_list, line)
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
