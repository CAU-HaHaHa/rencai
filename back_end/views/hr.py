from flask import Blueprint, request, session
from flaskapp.create_flask import app
import tools.valid as valid
from models.corporation import Corporation
from models.hr import Hr


blue_print_name = "/hr"
person_blueprint = Blueprint(blue_print_name, __name__)


@person_blueprint.route('/create', methods=['GET', 'POST'])
def create():
    status = 0
    try:
        if request.method == 'GET':
            raise Exception("method must be post")

        name = request.form.get('name')  # 公司名称
        username = request.form.get('username')
        password = request.form.get('password')
        realName = request.form.get('realName')
        sex = request.form.get('sex')
        idCard = request.form.get('idCard')  # 身份证

        if not all([name, username, password, realName, sex, idCard]):
            raise Exception('required information is not complete:'
                            'name, username, password, realName, sex, idCard')
        corporationlist = Corporation.query
        if corporationlist.filter(Corporation.name == name, Corporation.is_register == 0).first():
            status = 2
            raise Exception('corporation is checkint now, please waiting')

        corporationobj = corporationlist.filter(Corporation.name == name).first()
        if not corporationobj:
            status = 3
            raise Exception('corporation is not exist')

        hrlist = Hr.query
        if hrlist.filter(Hr.username == username, Hr.is_register == 0).first():
            status = 4
            raise Exception('your hr account is checking now, please waiting')
        if hrlist.filter(Hr.username == username, Hr.is_register == 1).first():
            status = 5
            raise Exception('hr account is already exist, do not register again')
        if sex not in ["男", "女"]:
            raise Exception("sex value must be 男 or 女")
        if sex == "男":
            sex = 1
        else:
            sex = 0

        if valid.checkIdcard(idCard) != "验证通过!":
            raise Exception("id card is not valid")

        hr = Hr(
            name=realName,
            corporation_id=corporationobj.corporation_id,
            username=username,
            password=password,
            sex=sex,
            identitycard=idCard
        )
        hr.save()
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
