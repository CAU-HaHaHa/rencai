from flaskapp.create_flask import app


@app.errorhandler(404)
def page_not_found(e):
    return dict(
            status=0,
            message="url not found, please check your address",
            data="none"
        )
