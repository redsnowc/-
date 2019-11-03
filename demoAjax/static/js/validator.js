class Validator {
    constructor(options) {
        this.$ = Zepto;
        this.$el = this.$(options.selector);
        this.tmp = options.tmp;
        this.pattern = options.pattern || this._patternTmp(this.tmp);
        this.required = options.required;
        this.emptyMsg = options.emptyMsg || (this._msgTmp(this.tmp) ? this._msgTmp(this.tmp).empty : "");
        this.errorMsg = options.errorMsg || options.equalToMsg || (this._msgTmp(this.tmp) ? this._msgTmp(this.tmp).error : "");
        this.checkboxErrorMsg = options.checkboxErrorMsg;
        this.selectErrorMsg = options.selectErrorMsg;
        // this.radioErrorMsg = options.radioErrorMsg;
        this.ajaxUrl = options.ajaxUrl;
        this.ajaxDataKey = options.ajaxDataKey;
        this.ajaxErrorMsg = options.ajaxErrorMsg;
        this.$equalTo = this.$(options.equalTo);
        this.sign = !this.required;
        this.pwdComplex = options.pwdComplex || false;
        this.type = options.type || "input";
        // this.radioName = options.radioName;
        this.$messageEl = this._createMessageEl();
        this.$equalEl = null;
        this.$equalElMsgEl = null;

        this._equalInit();
        this._checkedRadio();
    }

    /*
    * @inner 创建消息提示元素
    * @return {object} $messageEl 消息提示元素
    * */
    _createMessageEl() {
        if (this.type === "radio") return null;
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
    * @inner 验证失败显示消息并更新标记
    * @return {bool} 验证失败返回 false
    * */
    _filed($el, msg) {
        this.$messageEl.text(msg);
        this.$messageEl.show();
        $el.addClass("_error");
        this.sign = false;
        return false;
    }

    /*
    * @inner 验证成功显示消息并更新标记
    * @return {bool} 验证成功返回 true
    * */
    _succeed($el) {
        this.$messageEl.text("");
        this.$messageEl.hide();
        $el.removeClass("_error");
        this.sign = true;
        return true;
    }


    /*
    * @inner 处理空值错误
    * @return {bool} 验证失败返回 false 验证通过返回 true
    * */
    _empty() {
        if (!this.$el.val()) {
            return this._filed(this.$el, this.emptyMsg);
        } else {
            return this._succeed(this.$el);
        }
    }

    /*
    * @inner 处理正则验证错误
    * @return {bool} 验证失败返回 false 验证通过返回 true
    * */
    _error() {
        this._equalPattern();
        if (!this.pattern.test(this.$el.val())) {
            return this._filed(this.$el, this.errorMsg);

        } else {
            return this._succeed(this.$el);
        }
    }

    /*
    * ajax 请求服务器验证
    * 服务器端只能返回 {code: 0} or {code: 1}
    * */
    _ajax() {
        this.$.ajax({
            type: "POST",
            url: "/checkUser",
            data: JSON.stringify({[this.ajaxDataKey]: this.$el.val()}),
            dataType: "json",
            success: data => {
                if (data.code) {
                    this._filed(this.$el, this.ajaxErrorMsg);
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
    * @inner 验证可键盘输入的表单元素
    * */
    _verifyInput() {
        if (this.required) {
            if (this._empty()) {
                this._error()
            }
        } else {
            if (this.$el.val()) {
                this._error();
            } else {
                this._succeed(this.$el);
            }
        }
        if (this.ajaxUrl) {
            this._ajax();
        }
    }

    /*
    * @inner 验证 checkbox
    * */
    _verifyCheckBox() {
        if (this.type !== "checkbox") return;
        if (!this.$el.prop("checked")) {
            this._filed(this.$el, this.checkboxErrorMsg);
        } else {
            this._succeed(this.$el);
        }
    }

    /*
    * @inner 验证 radio
    * */
    _verifySelect() {
        if (this.type !== "select") return;
        if (!this.$el.val()) {
            this._filed(this.$el, this.selectErrorMsg);
        } else {
            this._succeed(this.$el);
        }
    }

    /*
    * @inner 为 equalTo 元素绑定自定义属性
    * */
    _equalInit() {
        if (this.$equalTo.length) {
            this.$equalTo.data("equal", this.$el.attr("id"));
            this.$equalTo.data("equalMsg", this.errorMsg);
        }
    }

    /*
    * @inner 生成 equalTo 正则
    * */
    _equalPattern() {
        if (this.$equalTo.length) {
            this.pattern = new RegExp(`^${this.$equalTo.val()}$`);
        }
    }

    /*
    * @inner 处理相等验证
    * */
    _verifyEqual() {
        if (this.$el.data("equal")) {
            if (!this.$equalEl) {
                const selector = this.$el.data("equal");
                this.$equalEl = this.$("#" + selector);
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

    /*
    * 执行验证
    * */
    verify() {
        if (this.type === "input") {
            this._verifyInput();
            this._verifyEqual();
            this._createPwdComplexNotion();
        } else if (this.type === "checkbox") {
            this._verifyCheckBox();
        } else if (this.type === "select") {
            this._verifySelect();
        }
    }

    /*
    * @inner 处理 radio 验证
    * */
    _checkedRadio() {
        if (this.type === "radio") {
            this.$el.prop("checked", true);
            this.sign = true;
        }
    }

    /*
    * 生成密码复杂性提示
    * */
    _createPwdComplexNotion() {
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


    /*
    * @inner 根据 tmp 选择正则模板
    * @return {regex} 正则
    * */
    _patternTmp() {
        const patterns = {
            username: /^[a-zA-Z]\w{5,17}$/, // 长度6-18，字母开头，字母、数字、下划线组成
            password: /^[\w!@#$%^&*~\-+=.,]{6,20}$/, // 长度6-20，包含特殊字符
            real_name: /^[\u4e00-\u9fa5]{2,15}$|^[a-zA-Z\s]{3,30}$/, // 中文姓名长度2-15，英文姓名长度3-30，英文可包含空格
            id_card: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/, // 15或18位身份证号，最后一位可能是X或x
            email: /^[a-zA-Z0-9]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/, // 邮箱验证
            phone: /^1[3456789]\d{9}$/, // 手机号
        };
        if (this.tmp) {
            return patterns[this.tmp];
        }
    }

    /*
    * @inner 根据 tmp 选择字段验证提示信息
    * @return {object} 字段验证信息对象
    * */
    _msgTmp() {
        const messages = {
            username: {
                empty: "用户名不能为空",
                error: "用户名需使用字母、数字、下划线组成(长度6-18)，第一个字符不能是数字"
            },
            password: {
                empty: "密码不能为空",
                error: "密码由数字、字母、下划线及特殊符号组成(长度6-20)"
            },
            real_name: {
                empty: "姓名不能为空",
                error: "姓名只能是中文(长度2-15)或英文(长度3-30)"
            },
            id_card: {
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

        if (this.tmp) {
            return messages[this.tmp];
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

    /*
    * @inner 执行初始化操作，实例化 Validator，并生成对应的标记，禁用按钮
    * */
    _init() {
        for (let i in this.inputRules) {
            this.validators[i] = new Validator(this.inputRules[i]);
            this.validatorSign[i] = this.validators[i].sign;
            this.$btn.attr({disabled: "disabled"});
            this.$btn.addClass("_disabled");
        }
    }

    /*
    * @inner 绑定事件
    * */
    _bindEvent() {
        this.$formEl.on("input blur", "input, select", e => {
            const validator = this.validators[e.target.id];
            if (validator) {
                validator.verify();
                this.validatorSign[e.target.id] = validator.sign;
                this._switchBtn();
            }
        })
    }

    /*
    * @inner 根据标记切换按钮可用状态
    * */
    _switchBtn() {
        if (Object.values(this.validatorSign).includes(false)) {
            this.$btn.attr({disabled: "disabled"});
            this.$btn.addClass("_disabled");
        } else {
            this.$btn.removeAttr("disabled");
            this.$btn.removeClass("_disabled");
        }
    }
}



