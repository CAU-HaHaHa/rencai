from flask import url_for, redirect, session
from functools import wraps
from flaskapp.create_flask import app


def is_user_login(func):
    @wraps(func)
    def check_user_login(*args, **kwargs):
        debug = app.config['SERVER_INI'].get("debug")
        if debug:
            return func(*args, **kwargs)

        user_type = session.get('user_type')
        if user_type == 3:
            return func(*args, **kwargs)
        elif user_type == 1:
            return dict(
                status=0,
                message="hr can not enter hr page",
                data="none"
            )
        elif user_type == 2:
            return func(*args, **kwargs)
        else:
            return dict(
                status=0,
                message="user type error",
                data="none"
            )

    return check_user_login


def is_hr_login(func):
    @wraps(func)
    def check_hr_login(*args, **kwargs):
        debug = app.config['SERVER_INI'].get("debug")
        if debug:
            return func(*args, **kwargs)

        user_type = session.get('user_type')
        if user_type == 3:
            return func(*args, **kwargs)
        elif user_type == 2:
            return dict(
                status=0,
                message="user can not enter hr page",
                data="none"
            )
        elif user_type == 1:
            return func(*args, **kwargs)
        else:
            return dict(
                status=0,
                message="user type error",
                data="none"
            )

    return check_hr_login



def is_admin_login(func):
    @wraps(func)
    def check_hr_login(*args, **kwargs):
        debug = app.config['SERVER_INI'].get("debug")
        if debug:
            return func(*args, **kwargs)

        user_type = session.get('user_type')
        if user_type == 3:
            return func(*args, **kwargs)
        else:
            return dict(
                status=0,
                message="you are not login in root account",
                data="none"
            )
    return check_hr_login