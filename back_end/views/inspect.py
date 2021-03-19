from flask import Blueprint, request, session, render_template, redirect
from flaskapp.create_flask import app
from mysql.create_db import db
from models.corporation import Corporation
from models.hr import Hr
import tools.login_check as login_check

blue_print_name = "/inspect"
user_blueprint = Blueprint(blue_print_name, __name__)


@user_blueprint.route('/corporation', methods=['GET', 'POST'])
@login_check.is_admin_login
def corporation():
    retrieve_list = ["corporation_id", "name", "registeredcapital", "legalrepresentative", "tel",
                     "email", "website", "location"]
    querylist = Corporation.get_obj(retrieve_list)
    msg = db.session.query(*querylist)
    corporationlist = msg.filter(Corporation.is_register == 0)
    return render_template("inspect/corporation.html", cor_list=corporationlist)


@user_blueprint.route('/corporation_accept', methods=['GET', 'POST'])
@login_check.is_admin_login
def corporation_accept():
    corporation_id = request.values.get("corporation_id")
    try:
        if corporation_id:
            cor = Corporation.query.filter(Corporation.corporation_id == corporation_id).first()
            cor.is_register = 1
            db.session.commit()
    except:
        pass
    return redirect("/inspect/corporation")


@user_blueprint.route('/corporation_decline', methods=['GET', 'POST'])
@login_check.is_admin_login
def corporation_decline():
    corporation_id = request.values.get("corporation_id")
    try:
        if corporation_id:
            res = Corporation.query.filter(Corporation.corporation_id == corporation_id).first()
            db.session.delete(res)
            db.session.commit()
    except:
        pass
    return redirect("/inspect/corporation")


@user_blueprint.route('/hr', methods=['GET', 'POST'])
@login_check.is_admin_login
def hr():
    retrieve_list = ["hr_id", "corporation_id", "name", "sex", "identitycard"]
    querylist = Hr.get_obj(retrieve_list)
    msg = db.session.query(*querylist)
    hrlist = msg.filter(Hr.is_register == 0)
    return render_template("inspect/hr.html", hr_list=hrlist)


@user_blueprint.route('/hr_accept', methods=['GET', 'POST'])
@login_check.is_admin_login
def hr_accept():
    hr_id = request.values.get("hr_id")
    try:
        if hr_id:
            h = Hr.query.filter(Hr.hr_id == hr_id).first()
            h.is_register = 1
            db.session.commit()
    except:
        pass
    return redirect("/inspect/hr")


@user_blueprint.route('/hr_decline', methods=['GET', 'POST'])
@login_check.is_admin_login
def hr_decline():
    hr_id = request.values.get("hr_id")
    try:
        if hr_id:
            res = Hr.query.filter(Hr.hr_id == hr_id).first()
            db.session.delete(res)
            db.session.commit()
    except:
        pass
    return redirect("/inspect/hr")




app.register_blueprint(blueprint=user_blueprint, url_prefix=blue_print_name)
