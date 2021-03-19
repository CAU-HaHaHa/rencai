from flask import Blueprint, request, session
from flaskapp.create_flask import app
from mysql.create_db import db
from models.corporation import Corporation
import tools.login_check as login_check
from models.recuritpost import Recruitpost

blue_print_name = "/recuit"
user_blueprint = Blueprint(blue_print_name, __name__)


@user_blueprint.route('/add', methods=['GET', 'POST'])
@login_check.is_user_login
def add():
    try:
        if request.method == "GET":
            raise Exception("method must be post")

        corporation_id = request.form.get('corporation_id')
        department = request.form.get('department')
        posttype = request.form.get('posttype')
        number = request.form.get('number')
        description = request.form.get('description')
        if not all([corporation_id, department, posttype, number, description]):
            raise Exception("corporation_id, department, posttype, number, description must not be empty")

        have_corporation = db.session.query(Corporation.corporation_id). \
            filter(Corporation.corporation_id == corporation_id).first()
        if not have_corporation:
            raise Exception("corporation id is not exist")

        recruitpost = Recruitpost(
            corporation_id=corporation_id,
            department=department,
            number=number,
            description=description,
            posttype=posttype
        )
        recruitpost.save()
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


app.register_blueprint(blueprint=user_blueprint, url_prefix=blue_print_name)
