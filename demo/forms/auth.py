from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField
from wtforms.validators import Length, DataRequired, Email, ValidationError, EqualTo
from model import User


class UserForm(FlaskForm):
    username = StringField(validators=[DataRequired(message="用户名不能为空"), Length(6, 18)])
    password = PasswordField(validators=[DataRequired(message="密码不能为空"), Length(6, 20), EqualTo('repeat_password')])
    repeat_password = PasswordField(validators=[DataRequired(message="请重复密码")])
    name = StringField(validators=[DataRequired(message="姓名不能为空"), Length(3, 30)])
    id_card = StringField(validators=[DataRequired(message="身份证不能为空")])
    email = StringField(validators=[DataRequired(message="邮箱不能为空"), Email()])
    phone = StringField(validators=[DataRequired(message="手机号不能为空"), Length(11, 11)])


    def validate_username(self, filed):
        if User.query.filter(User.username == filed.data).first():
            raise ValidationError("用户名已存在")

    # def validate_name(self, filed):
    #     if User.query.filter(User.name == filed.data).first():
    #         raise ValidationError("姓名已存在")

    def validate_id_card(self, filed):
        if len(filed.data) != 15 and len(filed.data) != 18:
            raise ValidationError("身份证输入有误")

    def validate_id_card(self, filed):
        if User.query.filter(User.id_card == filed.data).first():
            raise ValidationError("身份证已存在")

    def validate_email(self, filed):
        if User.query.filter(User.email == filed.data).first():
            raise ValidationError("邮箱已存在")

    def validate_phone(self, filed):
        if User.query.filter(User.phone == filed.data).first():
            raise ValidationError("手机号已存在")


