from flask import Blueprint, request, session
from flaskapp.create_flask import app
from models.person import Person
import tools.valid as valid
from mysql.create_db import db
<<<<<<< HEAD
=======

>>>>>>> temp
"""
本程序包含以下路由：
/person/create, post方法, 创建员工
/person/retrieve, get方法, 检索员工
    /person/retrieve/all, 检索全部员工
/person/update, post方法, 修改信息
/person/delete, get方法, 删除信息
"""

<<<<<<< HEAD

blue_print_name = "/person"
person_blueprint = Blueprint(blue_print_name, __name__)

=======
blue_print_name = "/person"
person_blueprint = Blueprint(blue_print_name, __name__)


>>>>>>> temp
@person_blueprint.route('/create/', methods=['GET', 'POST'])
def create():
    """
    CRUD中的C，create操作，新增一个用户，要求方式为POST形式，用户被添加到Person表中
    其中username, password, name, identitycard为必填，其他判断内容详见代码
    :return: 字典形式，详情请看/views/demo.py介绍
    """
    if request.method == 'GET':
        return dict(
            status=0,
<<<<<<< HEAD
            message="method must be get",
=======
            message="method must be post",
>>>>>>> temp
            data="none"
        )
    try:
        # 获取用户填写的信息
        username = request.form.get('username')
        password = request.form.get('password')
        name = request.form.get('name')
        sex = request.form.get('sex')
        identitycard = request.form.get('identitycard')
        tags = request.form.get('tags')
        edubackground = request.form.get('edubackground')
        briefintro = request.form.get('briefintro')
        tel = request.form.get('tel')
        email = request.form.get('email')
        politicsstatus = request.form.get('politicsstatus')
        address = request.form.get('address')
        postcode = request.form.get('postcode')
        workaddress = request.form.get('workaddress')

        # 定义个变量来控制过滤用户填写的信息
        flag = True
        msg = ""
        # 必要信息为用户名、密码、姓名、身份证号
        if flag and not all([username, password, name, identitycard]):
            msg, flag = '必要信息不完整：用户名、密码、姓名、身份证号', False
        # 判断用户名是长度是否大于16
        if flag and len(username) > 20:
            msg, flag = '用户名长度不能大于20', False

        if flag:
            # 核对输入的用户是否已经被注册了
            u = Person.query.filter(Person.username == username).first()
            # 判断用户名是否已经存在
            if u:
                flag = False
                msg = '用户名已经存在'
        if flag:
            res = valid.checkIdcard(identitycard)
            # 判断身份证合法性
            if res != "验证通过!":
                flag = False
                msg = res

        # 如果上面的检查有任意一项没有通过就返回注册页面,并提示响应的信息
        if not flag:
<<<<<<< HEAD
            return dict(
                status=0,
                message=msg,
                data="none"
            )
=======
            raise Exception(msg)

>>>>>>> temp
        # 上面的验证全部通过后就开始创建新用户
        person = Person(username=username, password=username, name=name, sex=sex,
                        identitycard=identitycard, tags=tags, edubackground=edubackground,
                        briefintro=briefintro, tel=tel, email=email,
                        politicsstatus=politicsstatus, address=address,
                        postcode=postcode, workaddress=workaddress)
        # 保存注册的用户
        person.save()
        return dict(
            status=1,
            message="success",
            data="none"
        )
    except Exception as e:
        return dict(
            status=0,
            message="internal error:" + str(e),
            data="none"
        )

<<<<<<< HEAD
# 下面的函数正在测试
@person_blueprint.route('/retrieve/all', methods=['GET', 'POST'])
def insert():
    try:
        msg = db.session.query(Person.user_id, Person.name,).all()
    except Exception as e:
        msg = e
    return str(msg)
=======

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
                            "eg, person/create_random_data?number=10")
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
                identitycard =str(random.randint(0, 10000000)),
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
                            " url = \"person/retrieve?select=name,tags\""
                            "use url = person/create_random_data?number=10 to generate data")

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

>>>>>>> temp

app.register_blueprint(blueprint=person_blueprint, url_prefix=blue_print_name)
