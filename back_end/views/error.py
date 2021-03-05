from flaskapp.create_flask import app


@app.errorhandler(404)
def page_not_found(e):
    return "404"
