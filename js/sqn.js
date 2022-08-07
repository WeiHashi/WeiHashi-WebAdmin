var ques = []
layui.use(['element', 'form', 'table', 'layer'], function () {
    var $ = layui.jquery
    var element = layui.element
    var form = layui.form
    var table = layui.table
    var layer = layui.layer
    var user = layui.data('user')
    if (user.username == null)
        window.location.href = "../"
    table.render({
        elem: '#qs'
        , title: '题目'
        , toolbar: true
        , data: ques
        , cols: [[
            { field: 'id', title: '序号', width: 80, sort: true }
            , { field: 'question', title: '问题', width: 160 }
            , {
                field: 'type', title: '问题类型', width: 120, templet: function (d) {
                    switch (d.type) {
                        case 0: return '填空'
                        case 1: return '单选'
                        case 2: return '多选'
                    }
                }
            }
            , { field: 'des', title: '问题描述/选项', width: 240 }
            , { toolbar: '#operation', title: '操作', width: 120 }
        ]]
    });

    table.on('tool(qs)', function (e) {
        var data = e.data
        if (e.event == 'detail') {
            layer.open({
                title: "详情",
                content: "序号：" + data.id + "<br>问题：" + data.question + "<br>问题类型：" + data.type + "<br>问题描述/选项：" + data.des
            })
        } else if (e.event == 'delete') {
            ques.splice(data.id - 1, 1)
            for (i = 0; i < ques.length; i++)
                ques[i].id = i + 1
            table.reload('qs', { data: ques })
        }
    })

    $('#resetq').click(function () {
        $('#qdes')[0].style.display = ''
        $('#addqo')[0].style.display = 'none'
        $('#qo')[0].style.display = 'none'
    })

    form.on('radio(qtype)', function (data) {
        $('#qdes')[0].style.display = 'none'
        $('#addqo')[0].style.display = 'none'
        $('#qo')[0].style.display = 'none'
        if (data.elem.value == '填空')
            $('#qdes')[0].style.display = ''
        else if (data.elem.value == '单选'||data.elem.value=='多选') {
            $('#qo')[0].style.display = ''
            $('#addqo')[0].style.display = ''
            $('#addqo').click(function () {
                var qonum = $('#qo').children().length
                if (qonum < 10) {
                    var oName = String.fromCharCode(qonum + 65)
                    var newOp = "<div class=\"layui-form-item\"><label class=\"layui-form-label\">" + oName + "</label><div class=\"layui-input-inline\"><input type=\"text\" name=\"title\" placeholder=\"请输入选项\"autocomplete=\"off\" class=\"layui-input\"></div><div class=\"layui-form-mid layui-word-aux\"><a style=\"font-size:12px;color:red\" class=\"qodel\" id=\"qodel" + oName + "\">删除</a></div></div>"
                    $('#qo').append(newOp)
                    $('.qodel').click(function () {
                        $(this)[0].parentNode.parentNode.remove()
                        qonum = $('#qo').children().length
                        if (qonum > 0) {
                            for (i = 0; i < qonum; i++) {
                                $('#qo')[0].children[i].children[0].innerText = String.fromCharCode(i + 65)
                            }
                        }
                    })
                } else {
                    layer.msg('最多只能添加10个选项')
                }
            })
        }
    });

    form.on('submit(addq)', function (data) {
        if (data.field.qtype == '填空') {
            if (data.field.content == '') {
                layer.msg('请填写问题描述')
                return false
            } else {
                ques.push({ id: ques.length + 1, question: $('#qtitle')[0].value, type: 0, des: data.field.content })
            }
        } else if (data.field.qtype == '单选'||data.field.qtype=='多选') {
            var fqonum = $('#qo').children().length
            if (fqonum < 2) {
                layer.msg('至少要有两个选项')
                return false
            }
            for (i = 0; i < fqonum; i++) {
                if ($('#qo')[0].children[i].children[1].children[0].value == '') {
                    layer.msg('请将选项填写完整')
                    return false
                }
            }
            var fqo = []
            for (i = 0; i < fqonum; i++) {
                fqo.push($('#qo')[0].children[i].children[1].children[0].value)
            }
            ques.push({ id: ques.length + 1, question: $('#qtitle')[0].value, type: data.field.qtype=='单选'?1:2, des: fqo })
        }
        $('#resetq').click()
        table.reload('qs', { data: ques })
        layer.msg('已添加')
        return false
    })

    form.on('submit(sendqn)', function (data) {
        if (ques.length == 0) {
            layer.msg('请添加问题')
            return false
        }
        for (i = 0; i < ques.length; i++)
            delete ques[i].LAY_TABLE_INDEX
        var top = data.field.top != null
        $.ajax({
            type: 'POST',
            url: 'https://devmeteor.cn:8080/adminAddQuestionnaire?id=' + user.id + '&top=' + top + '&username=' + user.username + '&token=' + user.token + '&type=0',
            data: JSON.stringify({
                title: data.field.title,
                des: data.field.content,
                questions: JSON.stringify(ques)
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
            error: function (e) {
                layer.msg('发布失败，请重试')
            }
        })
        return false
    })
})