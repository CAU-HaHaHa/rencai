from flask import Blueprint, request, session
from flaskapp.create_flask import app
from models.person import Person
import tools.valid as valid
from mysql.create_db import db
from models.corporation import Corporation
from tools.mail.sendvalidcheck import Sendcheck

blue_print_name = "/corporation"
person_blueprint = Blueprint(blue_print_name, __name__)


@person_blueprint.route('/create', methods=['GET', 'POST'])
def create():
    status = 0
    try:
        if request.method == 'GET':
            raise Exception("method must be post")

        name = request.form.get('name')
        registeredcapital = request.form.get('registeredCapital')
        legalrepresentative = request.form.get('legalRepresentative')
        tel = request.form.get('telephone')
        email = request.form.get('email')
        website = request.form.get('webAddress')
        location = request.form.get('address')

        if not all([name]):
            raise Exception('required information is not complete:'
                            'name')
        corporationlist = Corporation.query
        if corporationlist.filter(Corporation.name == name, Corporation.is_register == 1).first():
            status = 3
            raise Exception('corporation is already in use, do not register again')
        if corporationlist.filter(Corporation.name == name, Corporation.is_register == 0).first():
            status = 2
            raise Exception('corporation is checked now, please waiting')
        if not valid.checkPhone(tel):
            raise Exception('phone number is not valid')
        if not valid.checkEmail(email):
            raise Exception('email is not valid')
        try:
            registeredcapital = int(registeredcapital)
        except:
            raise Exception("registeredcapital must be a int type")

        corporation = Corporation(
            name=name,
            registeredcapital=registeredcapital,
            legalrepresentative=legalrepresentative,
            tel=tel,
            email=email,
            website=website,
            location=location
        )
        corporation.save()
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


app.register_blueprint(blueprint=person_blueprint, url_prefix=blue_print_name)
