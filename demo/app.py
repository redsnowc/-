import json
import click

from flask import Flask, render_template, request, redirect, url_for
from datetime import timedelta
from flask_migrate import Migrate

from forms.auth import UserForm
from libs.helpers import create_database_uri
from model import User
from model.base import db


app = Flask(__name__)
app.secret_key = "secret key"
app.config["SQLALCHEMY_DATABASE_URI"] = create_database_uri()
app.config["SEND_FILE_MAX_AGE_DEFAULT"] = timedelta(seconds=1)
db.init_app(app)


@app.cli.command()
def initdb():
    db.create_all()
    click.echo("Initialized database.")


migrate = Migrate(app, db)


@app.route("/", methods=["GET", "POST"])
def index():
    form = UserForm(request.form)
    if request.method == "POST" and form.validate():
        username = form.username.data
        password = form.password.data
        name = form.name.data
        id_card = form.id_card.data
        email = form.email.data
        phone = form.phone.data
        user = User(username=username, name=name, id_card=id_card, email=email, phone=phone)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        return redirect(url_for(".index"))
    return render_template("index.html", form=form)


@app.route("/checkUser", methods=["POST"])
def check_username():
    if request.method == "POST":
        data = json.loads(request.get_data().decode('utf-8'))
        print(data.keys())
        print(User.__dict__[list(data.keys())[0]])
        print(data)
        if User.query.filter(User.__dict__[list(data.keys())[0]] == data[list(data.keys())[0]]).first():
            print(1)
            return json.dumps({"code": 1})
        print(2)
        return json.dumps({"code": 0})


