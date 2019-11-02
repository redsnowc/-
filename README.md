# From Validator
结合 Zepto 实现的一个使用相对简单且具有一定扩展性的可自定义表单验证组件

- 支持 ajax 服务器端验证
- 支持 `select` 、`checkbox` 、`radio` 验证
- 支持密码复杂性显示
- 可自定义正则、错误信息
- 可执行两两相等验证

## 使用方法

### 1. 引入文件

```html
<script src="static/js/zepto.js"></script>
<script src="static/js/validator.js"></script>
```

### 2. 实例化

```javascript
new BindFormEvent({
    inputRules: {
        // key 值必须和 ID 名相同
        username: {
            selector: "#username",
            tmp: "username",
            ajaxUrl: "/checkUser",
            ajaxErrorMsg: "用户名已存在",
            ajaxDataKey: "username",
            required: false
        },
        // 更多其它表单元素
        ...
    },
    formSelector: "#myForm", // 表单按钮初始不可用，只有校验全部通过才会恢复
    btnSelector: "#formBtn"
});
```

实例接受三个参数
- `inputRules`: 需要验证的表单对象
- `formSelector`: 表单选择器
- `btnSelector`: 表单按钮选择器


#### 2.1 inputRules

`inputRules` 是一个对象，其中包含一系列需要验证的表单元素具体配置，其中的每一个对象需要接受一些选项参数，下面列出具体的选项参数及其意义。

- `selector`: 表单元素选择器，只能是 ID (**key 值也必须等于 ID 名**) (**必填**)
- `type`: 指定表单元素的类型，可选的值有:
  - `input` 默认
  - `checkbox`
  - `select`
  - `radio`
- `temp`: 指定一个内置模板，若指定模板则使用模板内置的正则及错误提示信息，可选模板如下
  - `username`: 用户昵称，默认为长度 6 - 18，字母开头，可包含字母、数字下划线
  - `password`: 密码，默认为长度 6 - 20，包含特殊字符、大小写字母及数字
  - `real_name`: 中文名长度 2 - 15，英文名长度 3 - 30，英文名可包含空格
  - `id_card`: 身份证号，15 - 18位，最后一位可能是 X 或 x
  - `email`: 邮箱验证
  - `phone`: 手机号 (内地)
- `pattern`: 指定正则，若指定了正则，其优先级高于内置模板正则，(**若未指定模板，则该项为必选**)
- `required`: 指定是否是必填项 `true` or `false` (**必填**)
- `emptyMsg`: 表单元素为空时提示信息，若指定，其优先级高于内置模板空值提示 (**若未指定模板，则该项为必选**)
- `errorMsg`: 表单元素验证失败时提示信息，若指定，其优先级高于内置模板失败提示 (**若未指定模板，则该项为必选**)
- `checkboxErrorMsg`: type = checkbox 时未勾选提示信息 (**指定 type 为 checkbox，则该项为必选**)
- `selectErrorMsg:`: type = select 时未选择提示信息 (**指定 type 为 select，则该项为必选**) 
- `ajaxUrl`: 服务器验证地址
- `ajaxDataKey`: 传递给校验数据给服务器时的 key 值 (**指定 ajaxUrl，则该项为必选**)
- `ajaxErrorMsg`: 服务器校验失败提示信息 (**指定 ajaxUrl，则该项为必选**)
- `equalTo`: 选择器，指定该表单元素需要相等的元素选择器，例如确认密码需要等于密码
- `pwdComplex`: 是否需要密码复杂性提示，若指定为 true 则开启

## 示例

- [ajax 请求验证示例](https://github.com/redsnowc/FromValidator/tree/master/demoAjax)



