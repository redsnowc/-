// 基础函数
// 获取元素
function getElem(selector) {
    return document.querySelector(selector);
}

function getElemAll(selector) {
    return document.querySelectorAll(selector);
}

// 表单验证对象
// 尝试将表单验证写成一个具有一定复用性的对象
let validator = {
    // 正则表达式(默认)
    patterns: {
        username: /^[a-zA-Z]\w{5,17}$/, // 长度6-18，字母开头，字母、数字、下划线组成
        password: /^[\w!@#$%^&*~\-+=.,]{6,20}$/, // 长度6-20，包含特殊字符
        realName: /^[\u4e00-\u9fa5]{2,15}$|^[a-zA-Z\s]{3,30}$/, // 中文姓名长度2-15，英文姓名长度3-30，英文可包含空格
        id: /^[1-9][0-9]{14}$|^[1-9][0-9]{16}([0-9]|[xX])$/, // 15或18位身份证号，最后一位可能是X或x
        email: /^[a-zA-Z0-9]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/, // 邮箱验证
        phone: /^1[3456789]\d{9}$/, // 手机号
    },

    // 表单提示信息(默认)
    formMessages: {
        username: ["用户名不能为空", "用户名需使用字母、数字、下划线组成(长度6-18)，第一个字符不能是数字"],
        password: ["密码不能为空", "密码由数字、字母、下划线及特殊符号组成(长度6-20)"],
        passwordRepeat: ["确认密码不能为空", "两次密码输入不一致"],
        realName: ["姓名不能为空", "姓名只能是中文(长度2-15)或英文(长度3-30)"],
        id: ["身份证号码不能为空", "请正确填写身份证号"],
        email: ["邮箱不能为空", "请正确填入邮箱"],
        phone: ["手机号不能为空", "请正确填写手机号"],
    },

    // 验证标记
    validatorSign: {
        signDefault: function (elem) {
            validator.validatorSign[elem.getAttribute("id")] = false;
        },
        signTrue: function (elem) {
            validator.validatorSign[elem.getAttribute("id")] = true;
        }
    },

    // 验证是否为空
    verifyEmpty: function (elem, kind, messageElem, customizeEmptyMessage) {
        let message;

        if (customizeEmptyMessage) {
            message = customizeEmptyMessage;
        } else {
            message = validator.formMessages[kind][0];

        }

        if (!elem.value) {
            messageElem.innerHTML = message;
            messageElem.style.color = "red";
            validator.validatorSign.signDefault(elem);
            return true;
        } else {
            return false;
        }
    },

    // 通用表单验证通过
    verifyDone: function (elem, messageElem, customizeDoneMessage) {
        let message;

        if (customizeDoneMessage) {
            message = customizeDoneMessage;
        } else {
            message = "ok";
        }

        messageElem.innerHTML = message;
        messageElem.style.color = "green";
        validator.validatorSign.signTrue(elem);
    },

    // 通用表单验证失败
    verifyFailed: function (elem, kind, messageElem, customizeRegex, customizeFailedMessage) {
        let message,
            regex;

        if (customizeFailedMessage) {
            message = customizeFailedMessage;
        } else {
            message = validator.formMessages[kind][1];
        }

        if (customizeRegex) {
            regex = customizeRegex;
        } else {
            regex = validator.patterns[kind];
        }

        if (!regex.test(elem.value)) {
            messageElem.innerHTML = message;
            messageElem.style.color = "red";
            validator.validatorSign.signDefault(elem);
            return true;
        } else {
            return false;
        }
    },

    // 创建表单提示信息元素
    addMessageElem: function (elem) {
        let parentElem = elem.parentNode,
            messageElem = document.createElement("span");
        messageElem.className = "message";
        parentElem.appendChild(messageElem);
        return messageElem;
    },

    // 通用表单验证
    commonValidator: function (selector, kind, customizeEmptyMessage, customizeFailedMessage, customizeDoneMessage, customizeRegex) {
        /*
            selector: 元素选择器
            kind: 表单验证种类
            customize**Message: 用户自定义提示信息
            customizeRegex: 自定义正则表达式
        */
        let elem = getElem(selector);
        // elem.style.marginBottom = "5px";

        if (!elem.nextElementSibling) {
            validator.addMessageElem(elem);
        }
        let messageElem = elem.nextElementSibling;

        if (validator.verifyEmpty(elem, kind, messageElem, customizeEmptyMessage)) {
        } else {
            if (validator.verifyFailed(elem, kind, messageElem, customizeRegex, customizeFailedMessage)) {
            } else {
                validator.verifyDone(elem, messageElem, customizeDoneMessage);
            }
        }
    },

    // 密码复杂性提示
    passwordComplex: function (passwordElem) {
        let passwordMessage = passwordElem.nextElementSibling,
            complexNotion = document.createElement("span"),
            simple = document.createElement("span"),
            medium = document.createElement("span"),
            complex = document.createElement("span");

        if (!passwordMessage.nextElementSibling) {
            complexNotion.className = "complexNotion";
            simple.className = "simple";
            medium.className = "medium";
            complex.className = "complex";
            complexNotion.appendChild(simple);
            complexNotion.appendChild(medium);
            complexNotion.appendChild(complex);
            passwordElem.parentNode.appendChild(complexNotion);
        }

        if (validator.validatorSign[passwordElem.getAttribute("id")]) {
            passwordMessage.style.display = "none";
            getElem(".complexNotion").style.display = "inline-block";
            // console.log(passwordElem.value);
            if (
                /(?=.{6,20})(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*/.test(passwordElem.value) || // 大写、小写、数字
                /(?=.{6,20})(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z\d]).*/.test(passwordElem.value) || // 大写、小写、特殊字符
                /(?=.{6,20})(?=.*[a-z])(?=.*[^a-zA-Z\d])(?=.*\d).*/.test(passwordElem.value) || //小写、数字、特殊字符
                /(?=.{6,20})(?=.*[^a-zA-Z\d])(?=.*[A-Z])(?=.*\d).*/.test(passwordElem.value) // 大写、数字、特殊字符
            ) {
                getElem(".complex").style.background = "green";
                getElem(".medium").style.background = "orange";
            } else if (
                /(?=.{6,20})(?=.*[A-Z])(?=.*[a-z]).*/.test(passwordElem.value) || // 大写、小写
                /(?=.{6,20})(?=.*[A-Z])(?=.*\d).*/.test(passwordElem.value) || // 大写、数字
                /(?=.{6,20})(?=.*[A-Z])(?=.*[^A-Za-z\d]).*/.test(passwordElem.value) || // 大写、符号
                /(?=.{6,20})(?=.*[a-z])(?=.*\d).*/.test(passwordElem.value) || // 小写、数字
                /(?=.{6,20})(?=.*[a-z])(?=.*[^A-Za-z\d]).*/.test(passwordElem.value) || // 小写、符号
                /(?=.{6,20})(?=.*[0-9])(?=.*[^A-Za-z\d]).*/.test(passwordElem.value) // 数字、符号
            ) {
                getElem(".medium").style.background = "orange";
                getElem(".complex").style.background = "#778899";
            } else {
                getElem(".complex").style.background = "#778899";
                getElem(".medium").style.background = "#778899";
            }
        } else {
            passwordMessage.style.display = "inline-block";
            getElem(".complexNotion").style.display = "none";
        }
    }
};

