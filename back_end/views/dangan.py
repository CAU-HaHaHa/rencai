from flask import Blueprint, request, session
from flaskapp.create_flask import app
from mysql.create_db import db
from models.person import Person
from models.performance import Performance
from models.corporation import Corporation
from models.stafftrack import Stafftrack
from models.hr import Hr
from models.stafflist import Stafflist
from models.resignlist import Resignlist
import tools.login_check as login_check


blue_print_name = "/dangan"
user_blueprint = Blueprint(blue_print_name, __name__)

@user_blueprint.route('/hrlizhi/delete', methods=['GET', 'POST'])
@login_check.is_hr_login
def hrlizhi_delete():
    try:
        if request.method == "GET":
            raise Exception("method must be post")
        user_id = request.form.get('u_id')
        flag = request.form.get('flag')
        if not all([user_id, flag]):
            raise Exception("u_id, flag must not be empty")
        if flag not in ["1", "0"]:
            raise Exception("flag must be 0 or 1")
        flag = int(flag)

        res = Resignlist.query.filter(Resignlist.user_id == user_id).first()
        if not res:
            raise Exception("u_id is not exist")
        db.session.delete(res)
        if flag == 1:
            res = Stafflist.query.filter(Stafflist.user_id == user_id).first()
            corporation_id = res.corporation_id
            arrivetime = res.hiredate
            dutytype = res.dutytype
            description = res.description
            db.session.delete(res)
            stafftrack = Stafftrack(
                corporation_id=corporation_id,
                user_id=user_id,
                arrivetime=arrivetime,
                dutytype=dutytype,
                description=description
            )
            stafftrack.save()
        db.session.commit()
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


@user_blueprint.route('/hrlizhi', methods=['GET', 'POST'])
@login_check.is_hr_login
def hrlizhi():
    try:
        if request.method == "GET":
            raise Exception("method must be post")
        corporation_id = request.form.get('co_id')
        if not corporation_id:
            raise Exception("co_id must not be empty")
        retrieve_list_resignlist = ["resignlist_id", "user_id", "description", "registerdate"]
        querylist_resignlist = Resignlist.get_obj(retrieve_list_resignlist)
        retrieve_list_stafflist = ["corporation_id", "user_id", "dutytype", "department", "user_name"]
        querylist_stafflist = Stafflist.get_obj(retrieve_list_stafflist)
        msg = db.session.query(*querylist_resignlist, *querylist_stafflist). \
            filter(Stafflist.corporation_id == corporation_id). \
            filter(Stafflist.user_id == Resignlist.user_id).all()
        retrieve_list = ["resignlist_id", "user_id", "description", "registerdate",
                         "corporation_id", "dutytype", "department", "user_name"]
        return_msg = []
        for line in msg:
            line = list(line)
            line[3] = line[3].strftime('%Y-%m-%d')  # 日期项
            del line[5]  # 删除重复的uid
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

@user_blueprint.route('/jixiao/insert', methods=['GET', 'POST'])
@login_check.is_hr_login
def jixiao_insert():
    status = 0
    try:
        if request.method == "GET":
            raise Exception("method must be post")
        corporation_id = request.form.get('corporation_id')
        value = request.form.get('value')
        user_id = request.form.get('user_id')
        post = request.form.get('post')
        description = request.form.get('description')
        department = request.form.get('department')
        hr_id = request.form.get('hr_id')
        if not all([value, post, description, department, hr_id]):
            raise Exception("all values must not be empty: value，"
                            "post, description, department, hr_id")
        if not user_id:
            user_id = session.get("user_id", "")
        if user_id == "":
            raise Exception("user id must be set as: 1, through log in 2, through form post. "
                            "while the form have fhe first priority")
        if not corporation_id:
            corporation_id = session.get("corporation_id", "")
        if corporation_id == "":
            raise Exception("corporation_id id must be set as: 1, through log in 2, through form post. "
                            "while the form have fhe first priority")
        try:
            corporation_id = int(corporation_id)
            value = int(value)
            user_id = int(user_id)
            hr_id = int(hr_id)
        except:
            raise Exception("corporation_id, value, user_id, hr_id must be int type of value")
        if value < 0 or value > 10:
            status = 2
            raise Exception("value must in between 0 and 10, include")

        have_corporation_id = db.session.query(Corporation.corporation_id). \
            filter(Corporation.corporation_id == corporation_id).first()
        if not have_corporation_id:
            status = 3
            raise Exception("corporation id is not valid")
        have_user_id = db.session.query(Person.user_id). \
            filter(Person.user_id == user_id).first()
        if not have_user_id:
            status = 3
            raise Exception("user id is not valid")
        have_hr_id = db.session.query(Hr.hr_id). \
            filter(Hr.hr_id == hr_id).first()
        if not have_hr_id:
            status = 3
            raise Exception("hr id is not valid")
        performance = Performance(corporation_id=corporation_id,
                                  user_id=user_id,
                                  hr_id=hr_id,
                                  value=value,
                                  description=description,
                                  department=department,
                                  post=post)
        performance.save()
        return dict(
            status=1,
            message="success",
            data="none"
        )
    except Exception as e:
        return dict(
            status=status,
            message=str(e),
            data="none"
        )


@user_blueprint.route('/performance/dataSource', methods=['GET', 'POST'])
@login_check.is_hr_login
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
            line = list(line)
            line[6] = line[6].strftime('%Y-%m-%d')
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
@login_check.is_hr_login
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
            line = list(line)
            line[6] = line[6].strftime('%Y-%m-%d')
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
