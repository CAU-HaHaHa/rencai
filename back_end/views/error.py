from flaskapp.create_flask import app


@app.errorhandler(404)
def page_not_found(e):
    return dict(
            status=0,
            message=str(e),
            data="none"
        )


@app.errorhandler(500)
def page_not_found(e):
    return dict(
            status=0,
            message=str(e),
            data="none"
        )
