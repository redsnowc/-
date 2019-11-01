# From Validator
结合 Zepto 实现的一个使用相对简单且具有一定扩展性的可自定义表单验证组件

- 支持 ajax 服务器端验证
- 支持 `select`、`checkbox` 、`radio` 验证
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
    ...
})
```
实例接受三个参数
- `inputRules`: 需要验证的表单对象
- `formSelector`: 表单选择器
- `btnSelector`: 表单按钮选择器

一个简单的示例
```javascript
// 实例化
new BindFormEvent({
    // 接受需要验证的表单对象
    inputRules: {
        // key 值须与 ID 相同
        username: {
            // 表单 ID 选择器
            selector: "#username",
            // 使用内置模板
            tmp: "username",
            // ajax 请求地址
            ajaxUrl: "/checkUser",
            // ajax 验证失败信息
            ajaxErrorMsg: "用户名已存在",
            // 传递给服务器数据的 key
            ajaxDataKey: "username",
            // 是否是必填项
            required: false
        }
    },
    // 表单选择器
    formSelector: "#myForm",
    // 表单按钮选择器
    btnSelector: "#formBtn"
});
```



