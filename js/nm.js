layui.use(['element', 'table', 'form'], function () {
    var table = layui.table
    var element = layui.element
    var form = layui.form
    var $ = layui.jquery
    var user = layui.data('user')
    if (user.username == null)
        window.location.href = "../"
    table.render({
        elem: '#ns',
        title: '通知管理',
        height: 'full-50',
        toolbar: true,
        defaultToolbar: ['print', 'exports'],
        page: true,
        limits: [10, 20, 30],
        url: 'https://devmeteor.cn:8080/adminGetNoticeList?id=' + user.id + '&username=' + user.username + '&token=' + user.token + '&type=0',
        cols: [[
            { field: 'obj_id', title: 'obj_id', hide: true },
            {
                field: 'cate', title: '分类', width: 60, templet: function (d) {
                    switch (d.cate) {
                        case 1: return '课程'
                        case 2: return '考试'
                        case 3: return '放假'
                        case 4: return '其他'
                    }
                }
            },
            { field: 'title', title: '标题', edit: 'text' },
            {
                field: 'detail', title: '正文',width:80, templet: function (d) {
                    return '<form class="layui-form"><input hidden="true" name="objId" value='+d.obj_id+'><textarea name="detail" required lay-verify="required" autocomplete="off" style="background-color:transparent;border:0px;width:50px;height:28px;overflow:hidden">' + d.detail + '</textarea><button class="layui-btn layui-btn-xs layui-btn-normal" lay-submit lay-filter="saveDetail" style="margin-left:20px">保存</button></form>'
                }
            },
            { field: 'sender', title: '发送者', width: 80 },
            {
                field: 'receiver', title: '接收对象', width: 90, templet: function (d) {
                    var receiver = JSON.parse(d.receiver)
                    var receiverText = ""
                    if (receiver.institute.length != 0)
                        receiverText += "学院：" + receiver.institute + "<br>"
                    if (receiver.classes.length != 0)
                        receiverText += "班级：" + receiver.classes + "<br>"
                    if (receiver.students.length != 0)
                        receiverText += "学号：" + receiver.students + "<br>"
                    switch (d.type) {
                        case 0: return receiverText
                        case 1: return '全员'
                    }
                }
            },
            {
                field: 'type', title: '通知类型', width: 90, templet: function (d) {
                    switch (d.type) {
                        case 0: return '定向'
                        case 1: return '全员'
                    }
                }
            },
            {
                field: 'timestamp', title: '发送时间', width: 180, sort: true, templet: function (d) {
                    var date = new Date(d.timestamp)
                    var year = date.getFullYear()
                    var month = date.getMonth() + 1
                    var day = date.getDate()
                    var h = date.getHours()
                    var m = date.getMinutes()
                    return year + "年" + month + "月" + day + "日 " + (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m)
                }
            },
            { field: 'top_level', title: '是否置顶', templet: '#setTop', width: 120, unresize: true },
            { toolbar: '#operation', title: '操作', width: 120 }
        ]],
        parseData: function (res) {
            if (res.code == 40004) {
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
            if (res.code == 10004) {
                var list = res.data.list
                for (var i in list) {
                    list[i].detail = parseJsonArray(list[i].detail)
                }
                return { code: 0, data: list, count: res.data.total }
            }
            return { code: 500 }
        }
    })

    var parseJsonArray = function (s) {
        try {
            var json = JSON.parse(s)
            var res = ''
            for (var i = 0; i < json.length; i++) {
                res += json[i].content
                if (i != json.length - 1)
                    res += '\n'
            }
            return res
        } catch (e) {
            return s
        }
    }

    table.on('tool(ns)', function (e) {
        var data = e.data
        if (e.event == 'detail') {
            var cate = ''
            switch (data.cate) {
                case 1:
                    cate = '课程'
                    break
                case 2:
                    cate = '考试'
                    break
                case 3:
                    cate = '放假'
                    break
                case 4:
                    cate = '其他'
                    break
            }
            layer.open({
                title: "详情",
                content: "分类：" + cate + "<br>标题：" + data.title + "<br>正文：" + data.detail
            })
        } else if (e.event == 'delete') {
            layer.confirm('确认删除？', function (index) {
                $.ajax({
                    type: 'DELETE',
                    url: 'https://devmeteor.cn:8080/adminDeleteNotice/' + data.obj_id + '?username=' + user.username + '&token=' + user.token,
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
                        } else {
                            layer.msg('已删除')
                            layer.close(index)
                            table.reload('ns', { url: 'https://devmeteor.cn:8080/adminGetNoticeList?id=' + user.id + '&username=' + user.username + '&token=' + user.token + '&type=0' })
                        }
                    },
                    error() {
                        layer.msg('删除失败，请重试')
                    }
                })
            })
        }
    })
    table.on('edit(ns)', function (obj) {
        var value = obj.value
            , data = obj.data
            , field = obj.field
        $.ajax({
            type: 'PUT',
            url: 'https://devmeteor.cn:8080/adminUpdateNotice?obj_id=' + data.obj_id + '&field=' + field + '&value=' + value + '&username=' + user.username + '&token=' + user.token,
            success: function (e) {
                if (e != null && e.code == 40004) {
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
                } else {
                    layer.msg('修改成功')
                }
            },
            error: function () {
                layer.msg('修改失败')
            }
        })
    })

    form.on('submit(saveDetail)',function(data){
        var content=data.field.detail.split('\n')
        var des=[]
        for(var i in content)
            des.push({type:1,content:content[i]})
        var detail=encodeURIComponent(JSON.stringify(des))
        $.ajax({
            type: 'PUT',
            url: 'https://devmeteor.cn:8080/adminUpdateNotice?obj_id=' + data.field.objId + '&field=detail&value=' + detail + '&username=' + user.username + '&token=' + user.token,
            success: function (e) {
                if (e != null && e.code == 40004) {
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
                } else {
                    layer.msg('修改成功')
                    table.reload('ns', { url: 'https://devmeteor.cn:8080/adminGetNoticeList?id=' + user.id + '&username=' + user.username + '&token=' + user.token + '&type=0' })
                }
            },
            error: function () {
                layer.msg('修改失败')
            }
        })
        return false
    })

    form.on('switch(top)', function (obj) {
        var isTop = obj.elem.checked
        var objId = obj.othis[0].parentNode.parentNode.parentNode.firstChild.firstChild.innerText
        $.ajax({
            type: 'PUT',
            url: 'https://devmeteor.cn:8080/adminSetNoticeTop?obj_id=' + objId + '&top=' + isTop + '&id=' + user.id + '&username=' + user.username + '&token=' + user.token,
            success: function (e) {
                if (e != null && e.code == 40004) {
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
                } else {
                    layer.msg(e.msg)
                    if (e.code == 60001)
                        table.reload('ns', { url: 'https://devmeteor.cn:8080/adminGetNoticeList?id=' + user.id + '&username=' + user.username + '&token=' + user.token + '&type=0' })
                }
            },
            error: function () {
                layer.msg('操作失败')
                table.reload('ns', { url: 'https://devmeteor.cn:8080/adminGetNoticeList?id=' + user.id + '&username=' + user.username + '&token=' + user.token + '&type=0' })
            }
        })
    })
})