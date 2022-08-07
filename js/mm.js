layui.use(['element', 'table', 'form', 'layer'], function () {
    var element = layui.element
    var table = layui.table
    var form = layui.form
    var layer = layui.layer
    var $ = layui.jquery
    var user = layui.data('user')
    if (user.username == null)
        window.location.href = "../"
    table.render({
        elem: '#ms',
        title: '班级成员管理',
        height: 'full-50',
        toolbar: true,
        page:true,
        defaultToolbar: ['print', 'exports'],
        url: 'https://devmeteor.cn:8080/adminGetMemberList?class_id=' + user.id + '&username=' + user.username + '&token=' + user.token,
        cols: [[
            { field: 'openid', title: 'id',width:80 },
            { field: 'name', title: '姓名(未绑定教务平台则为QQ昵称)' },
            { field: 'studentid', title: '学号(为空表示没有绑定教务平台)' },
            { field: 'is_cadre', title: '是否为班干部', templet: '#is_cadre', width: 120, unresize: true },
            { toolbar: '#operation', title: '操作', width: 120, unresize: true }
        ]],
        parseData: function (res) {
            if (res.code == 10004)
                return { code: 0, data: res.data.list, count: res.data }
            return { code: 500 }
        }
    })

    table.on('tool(ms)', function (e) {
        var data = e.data
        if (e.event == 'delete') {
            layer.confirm('确认移出本班？', function (index) {
                $.ajax({
                    type: 'DELETE',
                    url: 'https://devmeteor.cn:8080/adminDeleteMember/' + e.data.openid + '?username=' + user.username + '&token=' + user.token,
                    success: function (e) {
                        layer.msg('已移出')
                        layer.close(index)
                        table.reload('ms', { url: 'https://devmeteor.cn:8080/adminGetMemberList?class_id=' + user.id + '&username=' + user.username + '&token=' + user.token })
                    },
                    error(e) {
                        layer.msg('操作失败，请重试')
                    }
                })
            })
        }
    })

    form.on('switch(is_cadre)', function (obj) {
        var is_cadre = obj.elem.checked
        var openid = obj.othis[0].parentNode.parentNode.parentNode.firstChild.firstChild.innerText
        $.ajax({
            type: 'PUT',
            url: 'https://devmeteor.cn:8080/adminSetCadre?openid=' + openid + '&class_id=' + user.id + '&is_cadre=' + is_cadre + '&username=' + user.username + '&token=' + user.token,
            success: function (e) {
                if (e.code == 50003) {
                    layer.msg(e.msg)
                    table.reload('ms', { url: 'https://devmeteor.cn:8080/adminGetMemberList?class_id=' + user.id + '&username=' + user.username + '&token=' + user.token })
                } else
                    layer.msg('设置成功')
            },
            error: function () {
                layer.msg('设置失败')
                table.reload('ms', { url: 'https://devmeteor.cn:8080/adminGetMemberList?class_id=' + user.id + '&username=' + user.username + '&token=' + user.token })
            }
        })
    })

    $('#addMember').click(function () {
        if ($('#openid')[0].value == '')
            layer.msg('请输入用户的openid')
        else {
            $.ajax({
                type: 'GET',
                url: 'https://devmeteor.cn:8080/adminGetMemberInfoBeforeAdd',
                data: {
                    class_id: user.id,
                    openid: $('#openid')[0].value,
                    username: user.username,
                    token: user.token
                },
                dataType: 'json',
                success: function (e) {
                    if (e.code == 10004) {
                        layer.confirm('请确认用户信息：<br>姓名：' + e.data.name + '<br>学号：' + e.data.studentid, function (index) {
                            $.ajax({
                                type: 'POST',
                                url: 'https://devmeteor.cn:8080/adminConfirmAddMember',
                                data: {
                                    openid: $('#openid')[0].value,
                                    class_id: user.id,
                                    username: user.username,
                                    token: user.token
                                },
                                contentType: 'application/x-www-form-urlencoded',
                                success: function (e) {
                                    layer.msg('添加成功')
                                    $('#openid')[0].value = ''
                                    table.reload('ms', { url: 'https://devmeteor.cn:8080/adminGetMemberList?class_id=' + user.id + '&username=' + user.username + '&token=' + user.token })
                                },
                                error: function () {
                                    layer.msg('添加失败，请重试')
                                }
                            })
                        })
                    } else {
                        layer.msg(e.msg)
                        $('#openid')[0].value = ''
                    }
                }
            })
        }
    })
})