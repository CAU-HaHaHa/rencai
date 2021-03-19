from flask import Blueprint, request, session
from flaskapp.create_flask import app
from models.person import Person
import tools.valid as valid
from mysql.create_db import db
from models.corporation import Corporation
from tools.mail.sendvalidcheck import Sendcheck
import json

blue_print_name = "/corporation"
person_blueprint = Blueprint(blue_print_name, __name__)


@person_blueprint.route('/structure/retrieve', methods=['GET', 'POST'])
def structure_retrieve():
    try:
        if request.method == 'GET':
            raise Exception("method must be post")
        corporation_id = request.form.get('corporation_id')
        if not corporation_id:
            raise Exception("corporation_id must not be empty")
        msg = db.session.query(Corporation.corporation_id, Corporation.structure). \
            filter(Corporation.corporation_id == corporation_id).first()
        if not msg:
            raise Exception("corporation_id must not be empty")

        return dict(
            status=0,
            message="success",
            data=json.loads(msg.structure[1:-1])
        )


    except Exception as e:
        return dict(
            status=0,
            message=str(e),
            data="none"
        )


@person_blueprint.route('/structure/update', methods=['GET', 'POST'])
def structure_update():
    try:
        if request.method == 'GET':
            raise Exception("method must be post")
        corporation_id = request.form.get('corporation_id')
        structure = request.form.get('structure')
        msg_cor = Corporation.query.filter(Corporation.corporation_id == corporation_id).first()
        if not msg_cor:
            raise Exception("corporation_id is not exist")
        try:
            json.loads(structure[1:-1])
        except:
            raise Exception("structure is not valid")

        msg_cor.structure = structure
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


@person_blueprint.route('/update', methods=['GET', 'POST'])
def update():
    try:
        if request.method == 'GET':
            raise Exception("method must be post")
        corporation_id = request.form.get('corporation_id')
        name = request.form.get('name')
        email = request.form.get('email')
        tel = request.form.get('tel')
        website = request.form.get('website')
        location = request.form.get('location')
        requirementinfo = request.form.get('requirementinfo')

        if not corporation_id:
            raise Exception("corporation_id must not be empty")

        msg_cor = Corporation.query.filter(Corporation.corporation_id == corporation_id).first()
        if not msg_cor:
            raise Exception("corporation_id is not exist")

        if name:
            msg_cor.name = name
        if email:
            msg_cor.email = email
        if tel:
            msg_cor.tel = tel
        if location:
            msg_cor.location = location
        if website:
            msg_cor.website = website
        if requirementinfo:
            msg_cor.requirementinfo = requirementinfo

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


@person_blueprint.route('/retrieve', methods=['GET', 'POST'])
def retrieve():
    try:
        if request.method == 'GET':
            raise Exception("method must be post")
        corporation_id = request.form.get('corporation_id')
        if not corporation_id:
            raise Exception("corporation_id must not be empty")
        retrieve_list = ["name", "email", "tel", "website",
                         "location", "requirementinfo"]
        querylist = Corporation.get_obj(retrieve_list)
        msg = db.session.query(*querylist). \
            filter(Corporation.corporation_id == corporation_id).first()
        if not msg:
            raise Exception("corporation_id is not exist")

        return dict(
            status=1,
            message="success",
            data=dict(zip(retrieve_list, msg))
        )
    except Exception as e:
        return dict(
            status=0,
            message=str(e),
            data="none"
        )


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
        with open("static/default_structure.txt") as file:
            structure = file.readlines()[0]

        corporation = Corporation(
            name=name,
            registeredcapital=registeredcapital,
            legalrepresentative=legalrepresentative,
            tel=tel,
            email=email,
            website=website,
            location=location,
            structure=structure
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
