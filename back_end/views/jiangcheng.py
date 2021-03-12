from flask import Blueprint, request, session
from flaskapp.create_flask import app
from mysql.create_db import db
from models.stafflist import Stafflist
import tools.login_check as login_check

blue_print_name = "/jiangcheng"
user_blueprint = Blueprint(blue_print_name, __name__)


@user_blueprint.route('/search', methods=['GET', 'POST'])
@login_check.is_admin_login
def search():
    try:
        if request.method == "POST":
            raise Exception("method must be get")
        corp_id = request.values.get("corp_id", "")
        uid = request.values.get("id", "")
        name = request.values.get("name", "")
        dep = request.values.get("dep", "")
        duty = request.values.get("duty", "")
        page_size = int(request.values.get("page_size", 10000))
        page_num = int(request.values.get("page_num", 0))

        retrieve_list = ["stafflist_id", "corporation_id", "user_or_hr", "user_id", "hr_id",
                         "user_name", "transferreason", "lastcorporation_id", "hiredate",
                         "dutytype", "department", "jobnumber", "description"]

        querylist = Stafflist.get_obj(retrieve_list)
        querylist = db.session.query(*querylist)
        querylist = querylist.filter(Stafflist.user_or_hr == 0)

        if corp_id != "":
            querylist = querylist.filter(Stafflist.corporation_id == int(uid))
        if uid != "":
            querylist = querylist.filter(Stafflist.user_id == int(uid))
        if name != "":
            querylist = querylist.filter(Stafflist.user_name.like("%{}%".format(name)))
        if dep != "":
            querylist = querylist.filter(Stafflist.department.like("%{}%".format(dep)))
        if duty != "":
            querylist = querylist.filter(Stafflist.dutytype.like("%{}%".format(duty)))


        return_msg = []
        for line in querylist:
            temp = zip(retrieve_list, line)
            return_msg.append(dict(temp))
        return_msg = return_msg[page_num * page_size:page_num * page_size + page_size]

        return dict(
            status=1,
            message="success",
            data=return_msg,
            numbers=len(return_msg)
        )
    except Exception as e:
        return dict(
            status=0,
            message=str(e),
            data="none"
        )


app.register_blueprint(blueprint=user_blueprint, url_prefix=blue_print_name)
