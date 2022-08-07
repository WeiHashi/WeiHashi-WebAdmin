layui.use(['element', 'form'], function () {
    var $ = layui.jquery
    var element = layui.element
    var form = layui.form
    var user = layui.data('user')
    if (user.username == null)
        window.location.href = "../"
    form.on('submit(sn)', function (data) {
        var top = (data.field.top != null && data.field.top != false)
        var des=[]
        var content=data.field.content.split('\n')
        for(var i in content)
            des.push({type:1,content:content[i]})
        $.ajax({
            type: 'POST',
            url: 'https://devmeteor.cn:8080/adminAddNotice?id=' + user.id + '&top=' + top + '&username=' + user.username + '&token=' + user.token + '&type=0',
            data: JSON.stringify({
                title: data.field.title,
                detail: JSON.stringify(des),
                cate: data.field.cate
            }),
            contentType: 'application/json',
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
                    window.top.location.href = "../"
                } else {
                    if (e.code == 60002)
                        layer.msg(e.msg)
                    else
                        layer.msg('已发布')
                    setTimeout(() => {
                        location.reload()
                    }, 1000);
                }
            },
            error: function () {
                layer.msg('发布失败，请重试')
            }
        })
        return false
    })
})