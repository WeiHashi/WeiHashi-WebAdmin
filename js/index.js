document.getElementById('cy').textContent=new Date().getFullYear()
layui.use(['layer', 'form'], function () {
    var layer = layui.layer
    var form = layui.form
    var $ = layui.jquery
    var verifyCode = new GVerify({
        id: "codePic",
        type: "blend"
    });
    form.on('submit(login)', function (data) {
        if (verifyCode.validate(data.field.code)) {
            $.ajax({
                type: 'GET',
                url: 'https://devmeteor.cn:8080/adminLogin',
                data: {
                    username: data.field.username,
                    password: data.field.password
                },
                success: function (e) {
                    layer.msg(e.msg)
                    if (e.code == 40001) {
                        layui.data('user', {
                            key: 'username',
                            value: data.field.username
                        })
                        layui.data('user', {
                            key: 'token',
                            value: e.data.token
                        })
                        setTimeout(() => {
                            if (e.data.type == 0)
                                window.location.href = 'classAdmin.html'
                        }, 1000);
                    }
                }
            })
        } else {
            layer.msg('验证码错误')
        }
        return false
    })
});