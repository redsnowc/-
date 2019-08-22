# 建立 user 模型
from model.base import db


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(18), nullable=False, unique=True)
    password = db.Column(db.String(20), nullable=False)
    name = db.Column(db.String(30), nullable=False)
    id_num = db.Column(db.String(18), nullable=False, unique=True)
    email = db.Column(db.String(80), nullable=False, unique=True)
    phone = db.Column(db.String(11), nullable=False, unique=True)

