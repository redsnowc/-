from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField
from wtforms.validators import Length, DataRequired, Email, ValidationError, EqualTo
from model import User


class UserForm(FlaskForm):
    username = StringField(validators=[DataRequired(), Length(6, 18)])
    password = PasswordField(validators=[DataRequired(), Length(6, 20), EqualTo('repeat_password')])
    repeat_password = PasswordField(validators=[DataRequired()])
    name = StringField(validators=[DataRequired(), Length(3, 30)])
    id_num = StringField(validators=[DataRequired()])
    email = StringField(validators=[DataRequired(), Email()])
    phone = StringField(validators=[DataRequired(), Length(11, 11)])


    def validate_username(self, filed):
        if User.query.filter(User.username == filed.data).first():
            raise ValidationError("用户名已存在")

    # def validate_name(self, filed):
    #     if User.query.filter(User.name == filed.data).first():
    #         raise ValidationError("姓名已存在")

    def validate_id_num(self, filed):
        if len(filed.data) != 15 and len(filed.data) != 18:
            raise ValidationError("身份证输入有误")

    def validate_id_num(self, filed):
        if User.query.filter(User.id_num == filed.data).first():
            raise ValidationError("身份证已存在")

    def validate_email(self, filed):
        if User.query.filter(User.email == filed.data).first():
            raise ValidationError("邮箱已存在")

    def validate_phone(self, filed):
        if User.query.filter(User.phone == filed.data).first():
            raise ValidationError("手机号已存在")


