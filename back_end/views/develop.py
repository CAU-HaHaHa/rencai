from flask import Blueprint, request, session
from flaskapp.create_flask import app
from models.person import Person
import tools.valid as valid
from mysql.create_db import db
from tools.mail.sendvalidcheck import Sendcheck

blue_print_name = "/develop"
person_blueprint = Blueprint(blue_print_name, __name__)


@person_blueprint.route('/send', methods=['GET', 'POST'])
def send():
    mail = request.values.get("mail", "")
    config = app.config['SERVER_INI']
    config["to_mail"] = mail
    sender = Sendcheck(config)
    mes = sender.send()
    return mes


@person_blueprint.route('/', methods=['GET', 'POST'])
def default():
    return dict(
        status=0,
        message="this module only use for develop.  "
                "please use /develop/create_random_data or develop/retrieve_sql"
                " or develop/delete_data",
        data="none"
    )


@person_blueprint.route('/delete_data', methods=['GET', 'POST'])
def delete_data():
    try:
        db.session.query(Person).delete()
        db.session.commit()
    except Exception as e:
        return dict(
            status=0,
            message=str(e),
            data="none"
        )
    return dict(
        status=1,
        message="delete success",
        data="none"
    )


@person_blueprint.route('/create_random_data', methods=['GET', 'POST'])
def create_random_data():
    """
    产生随机数据person，仅做测试使用
    """
    try:
        if request.method == 'POST':
            raise Exception("method must be get")

        number = request.values.get("number", "")
        if number == "":
            raise Exception("please check out how to use create random data,"
                            "eg, develop/create_random_data?number=10")
        number = int(number)
        if number > 20 or number < 0:
            raise Exception("number must in between 0 to 20")
        import random
        for i in range(number):
            newperson = Person(
                username=str(random.randint(0, 10000000)),
                password=str(random.randint(0, 10000000)),
                name=str(random.randint(0, 10000000)),
                sex=random.randint(0, 1),
                identitycard=str(random.randint(0, 10000000)),
                tags=str(random.randint(0, 10000000)),
                edubackground=str(random.randint(0, 10000000)),
                briefintro=str(random.randint(0, 10000000)),
                tel=str(random.randint(0, 10000000)),
                email=str(random.randint(0, 10000000)),
                politicsstatus=str(random.randint(0, 10000000)),
                address=str(random.randint(0, 10000000)),
                postcode=str(random.randint(0, 10000000)),
                workaddress=str(random.randint(0, 10000000))
            )
            db.session.add(newperson)
        db.session.commit()


    except Exception as e:
        return dict(
            status=0,
            message=str(e),
            data="none"
        )
    return dict(
        status=1,
        message="create successfully",
        data="none"
    )


@person_blueprint.route('/retrieve_sql', methods=['GET', 'POST'])
def retrieve():
    """
    CRUD中的R，retrieve操作，查询用户，要求方式为GET形式
    该函数仅做测试使用，实际项目中这种用法将会十分危险
    使用方法：
        url = "person/retrieve?select=name,tags"
    :return: 字典形式，详情请看/views/demo.py介绍
    """
    try:
        if request.method == 'POST':
            raise Exception("method must be get")

        select = request.values.get("select", "")
        if select == "":
            raise Exception("please check out how to use retrieve, eg,"
                            " url = \"develop/retrieve?select=name,tags\""
                            "use url = develop/create_random_data?number=10 to generate data")

        select_list = select.split(",")
        querylist = Person.get_obj(select_list)
        msg = db.session.query(*querylist).all()

    except Exception as e:
        return dict(
            status=0,
            message=str(e),
            data="none"
        )
    ret = dict(
        status=0,
        message="success",
        data=str(msg)
    )
    return str(ret)


app.register_blueprint(blueprint=person_blueprint, url_prefix=blue_print_name)
