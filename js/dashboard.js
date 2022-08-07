layui.use('element', function () {
    var $ = layui.jquery
    var user = layui.data('user')
    if (user.username == null)
        top.location.href = "../"
    $.ajax({
        type: 'GET',
        url: 'https://devmeteor.cn:8080/adminGetOverview',
        data: {
            class_id: user.id,
            username: user.username,
            token: user.token
        },
        dataType: 'json',
        success: function (e) {
            if (e.code == 40004) {
                layui.data('user', {
                    key: 'username',
                    remove: true
                })
                layui.data('user', {
                    key: 'token',
                    remove: true
                })
                layui.data('user', {
                    key: 'name',
                    remove: true
                })
                layui.data('user', {
                    key: 'institute',
                    remove: true
                })
                layui.data('user', {
                    key: 'id',
                    remove: true
                })
                top.location.href = "../"
            }
            if (e.code == 10004) {
                var data = e.data
                for (key in data)
                    $("#" + key).html(data[key])
            }
        }
    })
})