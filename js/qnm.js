var qsdata = {}
layui.use(['element', 'table', 'form'], function () {
    var element = layui.element
    var table = layui.table
    var form = layui.form
    var $ = layui.jquery
    var user = layui.data('user')
    if (user.username == null)
        window.location.href = "../"
    table.render({
        elem: '#qns',
        title: '问题概要',
        toolbar: true,
        page: true,
        defaultToolbar: ['print', 'exports'],
        height: 'full-50',
        url: 'https://devmeteor.cn:8080/adminGetQuestionnaireList?id=' + user.id + '&username=' + user.username + '&token=' + user.token + '&type=0',
        cols: [[
            { field: 'obj_id', title: 'obj_id', hide: true },
            { field: 'title', title: '标题', edit: 'text' },
            { field: 'des', title: '描述', edit: 'text' },
            { field: 'sender', title: '发送者', width: 80 },
            {
                field: 'receiver', title: '接收对象', width: 90, templet: function (d) {
                    // var receiver = JSON.parse(d.receiver)
                    // var receiverText = "" //最终返回值
                    // if (receiver.institute.length != 0)
                    //     receiverText += "学院：" + receiver.institute + "<br>"
                    // if (receiver.classes.length != 0)
                    //     receiverText += "班级：" + receiver.classes + "<br>"
                    // if (receiver.students.length != 0)
                    //     receiverText += "学号：" + receiver.students + "<br>"
                    switch (d.type) {
                        case 0: return user.name
                        case 1: return '全员'
                    }
                }
            },
            {
                field: 'type', title: '问卷类型', width: 90, templet: function (d) {
                    switch (d.type) {
                        case 0: return '定向'
                        case 1: return '全员'
                    }
                }
            },
            {
                field: 'timestamp', title: '发送时间', templet: function (d) {
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
            { toolbar: '#qnsOperation', title: '操作', width: 120 }
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
            if (res.code == 10004)
                return { code: 0, data: res.data.list, count: res.data }
            return { code: 500 }
        }
    })
    table.render({
        elem: '#qs',
        title: '暂无数据',
        data: [],
        toolbar: true,
        defaultToolbar: ['print', 'exports'],
        height: 'full-50',
        cols: [[
            { field: 'id', title: '序号', width: 60 },
            { field: 'question', title: '问题' },
            {
                field: 'type', title: '问题类型', width: 90, templet: function (d) {
                    switch (d.type) {
                        case 0: return '填空'
                        case 1: return '单选'
                        case 2: return '多选'
                    }
                }
            },
            { field: 'des', title: '问题描述/选项' }
        ]]
    })

    table.on('tool(qns)', function (e) {
        var data = e.data
        if (e.event == 'detail') {
            qsdata = data
            table.reload('qs', { data: JSON.parse(data.questions), title: data.title })
        } else if (e.event == 'delete') {
            layer.confirm('删除问卷将会同时删除所有用户提交的该问卷的答案，请确保在删除前对重要的问卷答案进行备份，确认删除？', function (index) {
                $.ajax({
                    type: 'DELETE',
                    url: 'https://devmeteor.cn:8080/adminDeleteQuestionnaire/' + data.obj_id + '?username=' + user.username + '&token=' + user.token,
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
                            qsdata = {}
                            table.reload('qs', { data: [] })
                            table.reload('qns', { url: 'https://devmeteor.cn:8080/adminGetQuestionnaireList?id=' + user.id + '&username=' + user.username + '&token=' + user.token + '&type=0' })
                        }
                    },
                    error(e) {
                        layer.msg('删除失败，请重试')
                    }
                })
            })
        }
    })
    table.on('tool(qs)', function (e) {
        var data = e.data
        if (e.event == 'detail') {
            var type = ''
            switch (data.type) {
                case 0:
                    type = '填空'
                    break
                case 1:
                    type = '单选'
                    break
                case 2:
                    type = '多选'
                    break
            }
            layer.open({
                title: "详情",
                content: "序号：" + data.id + "<br>问题：" + data.question + "<br>问题类型：" + type + "<br>问题描述/选项：" + data.des
            })
        } else if (e.event == 'delete') {
            if (qsdata.questions.length <= 1) {
                layer.msg('问卷中至少要有1个问题')
                return
            }
            qsdata.questions.splice(data.id - 1, 1)
            for (i = 0; i < qsdata.questions.length; i++)
                qsdata.questions[i].id = i + 1
            table.reload('qs', { data: qsdata.questions })
        }
    })
    table.on('edit(qns)', function (obj) {
        var value = obj.value
            , data = obj.data
            , field = obj.field
        $.ajax({
            type: 'PUT',
            url: 'https://devmeteor.cn:8080/adminUpdateQuestionnaire?obj_id=' + data.obj_id + '&field=' + field + '&value=' + value + '&username=' + user.username + '&token=' + user.token,
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
                    layer.msg('修改成功')
                }
            },
            error: function () {
                layer.msg('修改失败')
            }
        })
    })
    form.on('switch(top)', function (obj) {
        var isTop = obj.elem.checked
        var objId = obj.othis[0].parentNode.parentNode.parentNode.firstChild.firstChild.innerText
        $.ajax({
            type: 'PUT',
            url: 'https://devmeteor.cn:8080/adminSetQuestionnaireTop?obj_id=' + objId + '&top=' + isTop + '&id=' + user.id + '&username=' + user.username + '&token=' + user.token,
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
                }
            },
            error: function () {
                layer.msg('操作失败')
            }
        })
    })
})