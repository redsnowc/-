let elements = {
    username: getElem("#username"),
    password: getElem("#password"),
    repeat_password: getElem("#repeat_password"),
    name: getElem("#name"),
    id_num: getElem("#id_num"),
    email: getElem("#email"),
    phone: getElem("#phone"),
    form: getElem("#myForm"),
    btn: getElem(".button")
};

function ajaxValidator(URL, data, method, elem, message) {
    ajax.ajax({
        URL: URL,
        data: data,
        method: method,
        success: function (data) {
            if (data.code === 1) {
                elem.parentNode.lastElementChild.innerHTML = message;
                elem.parentNode.lastElementChild.style.color = "red";
                validator.validatorSign.signDefault(elem);
            }
        }
    })
}


// elements.form.addEventListener("input", function (event) {
//     switch (event.target.id) {
//         case "username":
//                 validator.commonValidator("#username", "username");
//                 ajaxValidator("/checkUser", {username: elements.username.value}, "POST", elements.username, "用户名已存在");
//                 $.ajax({
//                     type: "POST",
//                     url: "/checkUser",
//                     data: JSON.stringify({username: elements.username.value}),
//                     success: function (data) {
//                         console.log(data);
//                     }
//                 });
//             break;
//         case "password":
//                 validator.commonValidator("#password", "password");
//                 validator.passwordComplex(elements.password);
//                 validator.commonValidator("#repeat_password", "passwordRepeat", null, null, null, new RegExp("^" + elements.password.value + "$"));
//             break;
//         case "repeat_password":
//                 validator.commonValidator("#repeat_password", "passwordRepeat", null, null, null, new RegExp("^" + elements.password.value + "$"));
//             break;
//         case "name":
//             validator.commonValidator("#name", "realName");
//             break;
//         case "id_num":
//             validator.commonValidator("#id_num", "id");
//             ajaxValidator("/checkUser", {id_card: elements.id_num.value}, "POST", elements.id_num, "身份证已存在");
//             break;
//         case "email":
//             validator.commonValidator("#email", "email");
//             ajaxValidator("/checkUser", {email: elements.email.value}, "POST", elements.email, "邮箱已存在");
//             break;
//         case "phone":
//             validator.commonValidator("#phone", "phone");
//             ajaxValidator("/checkUser", {phone: elements.phone.value}, "POST", elements.phone, "手机号已存在");
//     }
// });

// elements.btn.onclick = function (event) {
//     // 二次验证
//     // validator.commonValidator("#username", "username");
//     // validator.commonValidator("#password", "password");
//     // validator.commonValidator("#repeat_password", "passwordRepeat", null, null, null, new RegExp("^" + elements.password.value + "$"));
//     // validator.commonValidator("#name", "realName");
//     // validator.commonValidator("#id_num", "id");
//     // validator.commonValidator("#email", "email");
//     // validator.commonValidator("#phone", "phone");
//     for (let i in validator.validatorSign) {
//         if (validator.validatorSign[i] === false) {
//             event.preventDefault();
//             return false
//         }
//     }
// };