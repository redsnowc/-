# 建立 user 模型
from werkzeug.security import generate_password_hash, check_password_hash

from .base import db


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(18), nullable=False, unique=True)
    password_hash = db.Column(db.String(128), nullable=False)
    name = db.Column(db.String(30), nullable=False)
    id_card = db.Column(db.String(18), nullable=False, unique=True)
    email = db.Column(db.String(80), nullable=False, unique=True)
    phone = db.Column(db.String(11), nullable=False, unique=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)



