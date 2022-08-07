layui.use(['element', 'table'], function () {
    var element = layui.element
    var table = layui.table
    var $ = layui.jquery
    var user = layui.data('user')
    if (user.username == null)
        window.location.href = "../"
    table.render({
        elem: '#qns',
        title: '问题概要',
        toolbar: true,
        page:true,
        defaultToolbar: ['print', 'exports'],
        height: 'full-50',
        initSort: { field: 'timestamp', type: 'desc' },
        url: 'https://devmeteor.cn:8080/adminGetQuestionnaireList?id=' + user.id + '&username=' + user.username + '&token=' + user.token + '&type=0',
        cols: [[
            { field: 'obj_id', title: 'obj_id', hide: true },
            { field: 'title', title: '标题' },
            { field: 'des', title: '描述' },
            {
                field: 'timestamp', title: '发送时间', sort: true, templet: function (d) {
                    var date = new Date(d.timestamp)
                    var year = date.getFullYear()
                    var month = date.getMonth() + 1
                    var day = date.getDate()
                    var h = date.getHours()
                    var m = date.getMinutes()
                    return year + "年" + month + "月" + day + "日 " + (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m)
                }
            },
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
                return { code: 0, count: res.data.total, data: res.data.list }
            return { code: 500 }
        }
    })

    table.on('tool(qns)', function (e) {
        var data = e.data
        if (e.event == 'detail') {
            var col = [{ field: 'openid', title: 'openid',hide:true },{field:'name',title:'姓名'}]
            var questions = JSON.parse(data.questions)
            for (i = 0; i < questions.length; i++) {
                var question = questions[i]
                col.push({ field: question.id, title: question.question, minWidth: 150 })
            }
            col.push({
                field: 'timestamp', title: '填写时间', minWidth: 120, templet: function (d) {
                    var date = new Date(d.timestamp)
                    var year = date.getFullYear()
                    var month = date.getMonth() + 1
                    var day = date.getDate()
                    var h = date.getHours()
                    var m = date.getMinutes()
                    return year + "年" + month + "月" + day + "日 " + (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m)
                }
            })
            col.push({ toolbar: '#qsOperation', title: '操作', width: 120 })
            table.render({
                elem: '#qs',
                url: 'https://devmeteor.cn:8080/adminGetQuestionnaireCollection?qid=' + data.obj_id + '&id=' + user.id + '&username=' + user.username + '&token=' + user.token,
                title: data.title,
                toolbar: true,
                page:true,
                cols: [col],
                height: 'full-50',
                parseData: function (res) {
                    var formated = []
                    for (i = 0; i < res.data.list.length; i++) {
                        contentArr=JSON.parse(res.data.list[i].content)
                        var content = {}
                        content.obj_id = res.data.list[i].obj_id
                        content.qid = res.data.list[i].questionnaire_id
                        content.openid = res.data.list[i].openid
                        content.name=res.data.list[i].name
                        content.timestamp = res.data.list[i].timestamp
                        for(var i in contentArr){
                            content[i]=contentArr[i]
                        }
                        formated.push(content)
                    }
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
                        return { code: 0, count: res.data.total, data: formated }
                    return { code: 500 }
                }
            })
        }
    })
    table.on('tool(qs)', function (e) {
        var data = e.data
        if (e.event == 'detail') {
            var content = "姓名：" + data['openid'] + "<br>"
            for (key in data) {
                if (key == 'timestamp') {
                    var date = new Date(data[key])
                    var year = date.getFullYear()
                    var month = date.getMonth() + 1
                    var day = date.getDate()
                    var h = date.getHours()
                    var m = date.getMinutes()
                    content += "填写时间：" + (year + "年" + month + "月" + day + "日 " + (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m)) + "<br>"
                    continue
                }
                if (key == 'openid' || key == 'obj_id' || key == 'qid')
                    continue
                content += '问题'+key + "：" + data[key] + "<br>"
            }
            layer.open({
                title: "详情",
                content: content
            })
        } else if (e.event == 'delete') {
            layer.confirm('确认删除？', function (index) {
                $.ajax({
                    type: 'DELETE',
                    url: 'https://devmeteor.cn:8080/adminDeleteQuestionnaireCollection/' + data.obj_id + '?id=' + user.id + '&username=' + user.username + '&token=' + user.token,
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
                            table.reload('qs', {
                                url: 'https://devmeteor.cn:8080/adminGetQuestionnaireCollection?qid=' + data.qid + '&id=' + user.id + '&username=' + user.username + '&token=' + user.token
                            })
                        }
                    },
                    error(e) {
                        layer.msg('删除失败，请重试')
                    }
                })
            })
        }
    })
})