from flask import Blueprint, request, session
from flaskapp.create_flask import app
from mysql.create_db import db
from models.person import Person
from models.rewardandpulishment import Rewardandpulishment
from models.corporation import Corporation
from models.hr import Hr
import tools.login_check as login_check

blue_print_name = "/reward"
user_blueprint = Blueprint(blue_print_name, __name__)

@user_blueprint.route('/search', methods=['GET', 'POST'])
@login_check.is_admin_login
def search():
    try:
        if request.method == "POST":
            raise Exception("method must be get")
        user_id = request.values.get("user_id", "")
        if user_id == "":
            raise Exception("applylist_id must not be empty")
        retrieve_list = ["rnp_id", "corporation_id", "user_id", "user_name",
                         "user_depart", "user_job", "hr_id", "rew_or_pun",
                         "reward_pun_name", "description", "registerdate"]
        querylist = Rewardandpulishment.get_obj(retrieve_list)
        msg = db.session.query(*querylist)\
            .filter(Rewardandpulishment.user_id == user_id)\
            .order_by(Rewardandpulishment.registerdate.desc())

        return_msg = []
        for line in msg:
            temp = zip(retrieve_list, line)
            return_msg.append(dict(temp))
        return dict(
            status=1,
            message=return_msg,
            data="none"
        )
    except Exception as e:
        return dict(
            status=0,
            message=str(e),
            data="none"
        )

@user_blueprint.route('/add', methods=['GET', 'POST'])
@login_check.is_admin_login
def add():
    status = 0
    try:
        if request.method == "GET":
            raise Exception("method must be post")
        crop_id = request.form.get('corp_id')
        user_id = request.form.get('user_id')
        user_name = request.form.get('user_name')
        department = request.form.get('department')
        dutytype = request.form.get('dutytype')
        hr_id = request.form.get('hr_id')
        rewardTpye = request.form.get('rewardTpye')
        rewardName = request.form.get('rewardName')
        description = request.form.get('description')
        rewardTime = request.form.get('rewardTime')
        if not all([crop_id, user_id, user_name, department, dutytype,
                    hr_id, rewardTpye, rewardName, description, rewardTime]):
            raise Exception("all values must not be empty")
        try:
            crop_id = int(crop_id)
            user_id = int(user_id)
            hr_id = int(hr_id)
            rewardTpye = int(rewardTpye)
        except:
            raise Exception("crop_id, user_id, hr_id, rewardTpye must be int type of value")
        have_corporation_id = db.session.query(Corporation.corporation_id). \
            filter(Corporation.corporation_id == crop_id).first()
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
        if rewardTpye not in [0, 1]:
            raise Exception("rewardTpye must be 0 or 1")
        rewardTime = rewardTime + " 00:00:00"

        rewardandpulishment = Rewardandpulishment(
            corporation_id=crop_id,
            user_id=user_id,
            hr_id=hr_id,
            user_name=user_name,
            user_depart=department,
            user_job=dutytype,
            rew_or_pun=rewardTpye,
            reward_pun_name=rewardName,
            description=description,
            registerdate=rewardTime
        )
        rewardandpulishment.save()
        return dict(
            status=0,
            message="success",
            data="none"
        )

    except Exception as e:
        return dict(
            status=0,
            message=str(e),
            data="none"
        )


app.register_blueprint(blueprint=user_blueprint, url_prefix=blue_print_name)
