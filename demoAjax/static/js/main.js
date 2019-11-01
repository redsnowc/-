new BindFormEvent({
    inputRules: {
        username: {
            selector: "#username",
            tmp: "username",
            ajaxUrl: "/checkUser",
            ajaxErrorMsg: "用户名已存在",
            ajaxDataKey: "username",
            required: true,
        },
        password: {
            selector: "#password",
            tmp: "password",
            pwdComplex: true,
            required: true,
        },
        repeat_password: {
            selector: "#repeat_password",
            required: true,
            equalTo: "#password",
            equalToMsg: "密码输入不一致",
            emptyMsg: "确认密码不能为空"
        },
        name: {
            selector: "#name",
            tmp: "real_name",
            required: true
        },
        id_card: {
            selector: "#id_card",
            tmp: "id_card",
            required: true,
            ajaxUrl: "/checkUser",
            ajaxDataKey: "id_card",
            ajaxErrorMsg: "身份证已存在"
        },
        email: {
            selector: "#email",
            tmp: "email",
            required: true,
            ajaxUrl: "/checkUser",
            ajaxDataKey: "email",
            ajaxErrorMsg: "邮箱已存在"
        },
        phone: {
            selector: "#phone",
            tmp: "phone",
            required: true,
            ajaxUrl: "/checkUser",
            ajaxDataKey: "phone",
            ajaxErrorMsg: "电话号码已存在"
        }


    },
    formSelector: "#myForm",
    btnSelector: ".button"
});