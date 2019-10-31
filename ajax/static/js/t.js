class Validator {
    constructor(options) {
        this.$ = Zepto;
        this.$el = this.$(options.selector);
        this.$messageEl = this._createMessageEl();
        this.type = options.type;
        this.pattern = options.pattern || this._patternTmp(this.type);
        this.required = options.required || false;
        this.emptyMessage = options.emptyMessage || this._messagesTmp(this.type).empty;
        this.errorMessage = options.errorMessage || options.equalToMessage || this._messagesTmp(this.type).error;
        this.ajaxUrl = options.ajaxUrl;
        this.ajaxDataKey = options.ajaxDataKey;
        this.ajaxErrorMessage = options.ajaxErrorMessage;
        this.$equalTo = this.$(options.equalTo);
        this.sign = !this.required;
        this.pwdComplex = options.pwdComplex || false;


        this.test = 0;

        if (this.$equalTo.length) {
            this.$equalTo.data("equal", this.$el.attr("id"));
            this.$equalTo.data("equalMsg", this.errorMessage);
        }
    }

    /*
    * @inner 根据 type 选择正则模板
    * @return {regex} 正则
    * */
    _patternTmp() {
        const patterns = {
            username: /^[a-zA-Z]\w{5,17}$/, // 长度6-18，字母开头，字母、数字、下划线组成
            password: /^[\w!@#$%^&*~\-+=.,]{6,20}$/, // 长度6-20，包含特殊字符
            realName: /^[\u4e00-\u9fa5]{2,15}$|^[a-zA-Z\s]{3,30}$/, // 中文姓名长度2-15，英文姓名长度3-30，英文可包含空格
            idCard: /^[1-9][0-9]{14}$|^[1-9][0-9]{16}([0-9]|[xX])$/, // 15或18位身份证号，最后一位可能是X或x
            email: /^[a-zA-Z0-9]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/, // 邮箱验证
            phone: /^1[3456789]\d{9}$/, // 手机号
        };
        if (this.type) {
            return patterns[this.type];
        }
    }

    /*
    * @inner 根据 type 选择字段验证提示信息
    * @return {object} 字段验证信息对象
    * */
    _messagesTmp() {
        const messages = {
            username: {
                empty: "用户名不能为空",
                error: "用户名需使用字母、数字、下划线组成(长度6-18)，第一个字符不能是数字"
            },
            password: {
                empty: "密码不能为空",
                error: "密码由数字、字母、下划线及特殊符号组成(长度6-20)"
            },
            passwordRepeat: {
                empty: "确认密码不能为空",
                error: "两次密码输入不一致"
            },
            realName: {
                empty: "姓名不能为空",
                error: "姓名只能是中文(长度2-15)或英文(长度3-30)"
            },
            idCard: {
                empty: "身份证号码不能为空",
                error: "请正确填写身份证号"
            },
            email: {
                empty: "邮箱不能为空",
                error: "请正确填入邮箱"
            },
            phone: {
                empty: "手机号不能为空",
                error: "请正确填写手机号"
            }
        };

        if (this.type) {
            return messages[this.type];
        }
    }

    /*
    * @inner 创建消息提示元素
    * @return {object} $messageEl 消息提示元素
    * */
    _createMessageEl() {
        let $messageEl = null;
        const $next = this.$el.next();
        if (!$next.length) {
            $messageEl = this.$("<span class='_message'></span>");
            $messageEl.hide();
            this.$el.after($messageEl);
            return $messageEl;
        }
        return $messageEl = $next;
    }

    /*
    * @inner 处理空值错误
    * */
    _empty() {
        if (!this.$el.val()) {
            this.$messageEl.text(this.emptyMessage);
            this.$messageEl.show();
            this.$el.addClass("_error");
            this.sign = false;
            return false;
        } else {
            this.$messageEl.text("");
            this.$messageEl.hide();
            this.$el.removeClass("_error");
            this.sign = true;
            return true;
        }
    }

    /*
    * @inner 处理正则验证错误
    * */
    _error() {
        this._equalPattern();
        if (!this.pattern.test(this.$el.val())) {
            this.$messageEl.text(this.errorMessage);
            this.$messageEl.show();
            this.$el.addClass("_error");
            this.sign = false;
            return false;
        } else {
            this.$messageEl.text("");
            this.$messageEl.hide();
            this.$el.removeClass("_error");
            this.sign = true;
            return true;
        }
    }

    /*
    * 生成 equalTo 时的正则
    * */
    _equalPattern() {
        if (this.$equalTo.length) {
            this.pattern = new RegExp(`^${this.$equalTo.val()}$`);
        }
    }

    /*
    * ajax 请求服务器验证
    * */
    _ajax() {
        this.$.ajax({
            type: "POST",
            url: "/checkUser",
            data: JSON.stringify({[this.ajaxDataKey]: this.$el.val()}),
            dataType: "json",
            success: data => {
                if (data.code) {
                    this.$messageEl.text(this.ajaxErrorMessage);
                    this.$el.addClass("_error");
                    this.$messageEl.show();
                    this.sign = false;
                } else {
                    this.sign = true;
                }
            },
            error: error => {
                console.log(error);
            }
        });
    }

    /*
    * 执行验证
    * */
    verify() {
        if (this.required) {
            if (this._empty()) {
                this._error()
            }
        } else {
            if (this.$el.val()) {
                this._error();
            } else {
                this.sign = true;
                this.$messageEl.text("");
                this.$messageEl.hide();
                this.$el.removeClass("_error");
            }
        }
        if (this.ajaxUrl) {
            this._ajax();
        }

    }

    /*
    * 验证相等
    * */
    verifyEqual() {
        if (this.$el.data("equal")) {
            if (!this.$equalEl) {
                this.selector = this.$el.data("equal");
                this.$equalEl = this.$("#" + this.selector);
                this.$equalElMsgEl = this.$equalEl.next();
            }
            if ((this.$el.val() !== this.$equalEl.val()) && this.$equalEl.val()) {
                this.$equalElMsgEl.text(this.$el.data("equalMsg"));
                this.$equalElMsgEl.show();
                this.$equalEl.addClass("_error");
                this.sign = false;
            } else if (this.$equalEl.val()) {
                this.$equalElMsgEl.text("");
                this.$equalElMsgEl.hide();
                this.$equalEl.removeClass("_error");
                this.sign = true;
            }
        }
    }

    createPwdComplexNotion () {
        if (!this.pwdComplex) return;
        let $complexNation = this.$("<span class='_complexNotion'></span>"),
            $simple = this.$("<span class='_simple'></span>"),
            $medium = this.$("<span class='_medium'></span>"),
            $complex = this.$("<span class='_complex'></span>");

        if (!this.$messageEl.next().length) {
            $complexNation.append([$simple, $medium, $complex]);
            this.$messageEl.after($complexNation);
        }

        if (this.sign) {
            this.$("._complexNotion").show();
            if (
                /(?=.{6,20})(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*/.test(this.$el.val()) || // 大写、小写、数字
                /(?=.{6,20})(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z\d]).*/.test(this.$el.val()) || // 大写、小写、特殊字符
                /(?=.{6,20})(?=.*[a-z])(?=.*[^a-zA-Z\d])(?=.*\d).*/.test(this.$el.val()) || //小写、数字、特殊字符
                /(?=.{6,20})(?=.*[^a-zA-Z\d])(?=.*[A-Z])(?=.*\d).*/.test(this.$el.val()) // 大写、数字、特殊字符
            ) {
                this.$("._complex").css("background-color", "green");
                this.$("._medium").css("background-color", "orange");
            } else if (
                 /(?=.{6,20})(?=.*[A-Z])(?=.*[a-z]).*/.test(this.$el.val()) || // 大写、小写
                /(?=.{6,20})(?=.*[A-Z])(?=.*\d).*/.test(this.$el.val()) || // 大写、数字
                /(?=.{6,20})(?=.*[A-Z])(?=.*[^A-Za-z\d]).*/.test(this.$el.val()) || // 大写、符号
                /(?=.{6,20})(?=.*[a-z])(?=.*\d).*/.test(this.$el.val()) || // 小写、数字
                /(?=.{6,20})(?=.*[a-z])(?=.*[^A-Za-z\d]).*/.test(this.$el.val()) || // 小写、符号
                /(?=.{6,20})(?=.*[0-9])(?=.*[^A-Za-z\d]).*/.test(this.$el.val()) // 数字、符号
            ) {
                this.$("._complex").css("background-color", "#778899");
                this.$("._medium").css("background-color", "orange");
            } else {
                this.$("._complex").css("background-color", "#778899");
                this.$("._medium").css("background-color", "#778899");
            }
        } else {
            this.$("._complexNotion").hide();
        }

    }
}

class BindFormEvent {
    constructor(options) {
        this.$ = Zepto;
        this.inputRules = options.inputRules;
        this.$formEl = this.$(options.formSelector);
        this.$btn = this.$(options.btnSelector);
        this.validators = {};
        this.validatorSign = {};


        this._init();

        this._bindEvent();
    }

    _init() {
        for (let i in this.inputRules) {
            this.validators[i] = new Validator(this.inputRules[i]);
            this.validatorSign[i] = this.validators[i].sign;
            this.$btn.attr({disabled: "disabled"});
            this.$btn.addClass("_disabled");
        }
    }

    _bindEvent() {
        this.$formEl.on("input blur", "input", e => {
            const validator = this.validators[e.target.id];
            if (validator) {
                validator.verify();
                validator.createPwdComplexNotion();
                validator.verifyEqual();
                this.validatorSign[e.target.id] = validator.sign;
                if (Object.values(this.validatorSign).includes(false)) {
                    this.$btn.attr({disabled: "disabled"});
                    this.$btn.addClass("_disabled");
                } else {
                    this.$btn.removeAttr("disabled");
                    this.$btn.removeClass("_disabled");
                }
            }
        })
    }
}


new BindFormEvent({
    inputRules: {
        username: {
            selector: "#username",
            type: "username",
            ajaxUrl: "/checkUser",
            ajaxErrorMessage: "用户名已存在",
            ajaxDataKey: "username",
            required: false,
        },
        password: {
            selector: "#password",
            type: "password",
            pwdComplex: true,
            required: true,
        },
        repeat_password: {
            selector: "#repeat_password",
            type: "passwordRepeat",
            required: true,
            equalTo: "#password",
            equalToMessage: "密码输入不一致"
        },
        name: {
            selector: "#name",
            type: "realName",
            required: true
        },
        id_card: {
            selector: "#id_card",
            type: "idCard",
            required: true,
            ajaxUrl: "/checkUser",
            ajaxDataKey: "id_card",
            ajaxErrorMessage: "身份证已存在"
        },
        email: {
            selector: "#email",
            type: "email",
            required: true,
            ajaxUrl: "/checkUser",
            ajaxDataKey: "email",
            ajaxErrorMessage: "邮箱已存在"
        },
        phone: {
            selector: "#phone",
            type: "phone",
            required: true,
            ajaxUrl: "/checkUser",
            ajaxDataKey: "phone",
            ajaxErrorMessage: "电话号码已存在"
        }


    },
    formSelector: "#myForm",
    btnSelector: ".button"
});

