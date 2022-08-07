document.getElementById('cy').textContent=new Date().getFullYear()
layui.use(['element', 'layer'], function () {
    var element = layui.element;
    var layer = layui.layer
    var $ = layui.jquery;
    var user = layui.data('user')
    if (user.username == null)
        window.location.href = "./"
    $.ajax({
        type: 'GET',
        url: 'https://devmeteor.cn:8080/adminGetInfo',
        data: {
            username: user.username,
            token: user.token,
            type: 0
        },
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
                window.location.href = "./"
            }
            else {
                layui.data('user', {
                    key: 'name',
                    value: e.data.name
                })
                layui.data('user', {
                    key: 'institute',
                    value: e.data.institute
                })
                layui.data('user', {
                    key: 'id',
                    value: e.data.id
                })
                user = layui.data('user')
                $('#dboard').attr('src', 'subpages/dashboard.html');
                $('#className').text(e.data.name)
            }
        }
    })

    element.on('tab', function (e) {
        document.getElementById(this.getAttribute('lay-id')).click()
    })
    $("#dashboard").click(function () {
        element.tabChange('tab', 'dashboard')
        $('#dboard').attr('src', $('#dboard').attr('src'));
    })
    $("#sendNotice").click(function () {
        if ($(".layui-tab-title li[lay-id='sendNotice']").length > 0) {
            element.tabChange('tab', 'sendNotice')
            return
        }
        element.tabAdd('tab', { title: '发布通知', content: "<iframe src='subpages/sn.html' width='100%' height='100%' frameborder='0' scrolling='auto'></iframe>", id: 'sendNotice' })
        element.tabChange('tab', 'sendNotice')
    })
    $('#SQn').click(function () {
        if ($(".layui-tab-title li[lay-id='SQn']").length > 0) {
            element.tabChange('tab', 'SQn')
            return
        }
        element.tabAdd('tab', { title: '发布问卷', content: "<iframe src='subpages/sqn.html' width='100%' height='100%' frameborder='0' scrolling='auto'></iframe>", id: 'SQn' })
        element.tabChange('tab', 'SQn')
    })
    $('#NM').click(function () {
        if ($(".layui-tab-title li[lay-id='NM']").length > 0) {
            element.tabChange('tab', 'NM')
            $('#nm').attr('src', $('#nm').attr('src'));
            return
        }
        element.tabAdd('tab', { title: '通知管理', content: "<iframe src='subpages/nm.html' id='nm' width='100%' height='100%' frameborder='0' scrolling='auto'></iframe>", id: 'NM' })
        element.tabChange('tab', 'NM')
    })
    $('#QnM').click(function () {
        if ($(".layui-tab-title li[lay-id='QnM']").length > 0) {
            element.tabChange('tab', 'QnM')
            $('#qnm').attr('src', $('#qnm').attr('src'));
            return
        }
        element.tabAdd('tab', { title: '问卷管理', content: "<iframe src='subpages/qnm.html' id='qnm' width='100%' height='100%' frameborder='0' scrolling='auto'></iframe>", id: 'QnM' })
        element.tabChange('tab', 'QnM')
    })
    $('#QnR').click(function () {
        if ($(".layui-tab-title li[lay-id='QnR']").length > 0) {
            element.tabChange('tab', 'QnR')
            $('#qnr').attr('src', $('#qnr').attr('src'));
            return
        }
        element.tabAdd('tab', { title: '问卷回收', content: "<iframe src='subpages/qnr.html' id='qnr' width='100%' height='100%' frameborder='0' scrolling='auto'></iframe>", id: 'QnR' })
        element.tabChange('tab', 'QnR')
    })
    $('#MM').click(function () {
        if ($(".layui-tab-title li[lay-id='MM']").length > 0) {
            element.tabChange('tab', 'MM')
            $('#mm').attr('src', $('#mm').attr('src'));
            return
        }
        element.tabAdd('tab', { title: '成员管理', content: "<iframe src='subpages/mm.html' id='mm' width='100%' height='100%' frameborder='0' scrolling='auto'></iframe>", id: 'MM' })
        element.tabChange('tab', 'MM')
    })
    $('#BI').click(function () {
        layer.open({
            title: '账户信息',
            content: "用户名：" + user.username + "<br>班级id："+user.id+"<br>班级名称：" + user.name + "<br>归属学院：" + user.institute
        })
    })
    $('#CP').click(function () {
        layer.open({
            title: '修改密码',
            content: '<div class="layui-form-item"><label class="layui-form-label" style="width:auto;padding-left:0px">原密码</label><div class="layui-input-block" style="margin-left:60px"><input type="text" id="inOrigin" required lay-verify="required" placeholder="请输入原密码" autocomplete="off" class="layui-input"></div></div><div class="layui-form-item"><label class="layui-form-label" style="width:auto;padding-left:0px">新密码</label><div class="layui-input-block"  style="margin-left:60px"><input type="password" id="inPassword" required lay-verify="required" placeholder="请输入新密码"autocomplete="off" class="layui-input"></div></div>',
            yes: function () {
                var origin = $('#inOrigin').prop('value')
                var password = $('#inPassword').prop('value')
                if (origin == '' || password == '')
                    layer.msg('未填写完整')
                else {
                    $.ajax({
                        type: 'PUT',
                        url: 'https://devmeteor.cn:8080/adminUpdatePassword?username=' + user.username + '&origin=' + origin + '&new=' + password + "&token=" + user.token + "&type=0",
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
                                window.location.href = "./"
                            } else
                                layer.msg(e.msg)
                        },
                        error: function () {
                            layer.msg('修改失败')
                        }
                    })
                }
            }
        })
    })
    $('#logout').click(function () {
        $.ajax({
            type: 'PUT',
            url: 'https://devmeteor.cn:8080/adminLogout?username=' + user.username + "&token=" + user.token + "&type=0",
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
                    window.location.href = "./"
                } else {
                    layer.msg('已退出')
                    setTimeout(() => {
                        location.replace('./')
                    }, 1000);
                }
            },
            error: function () {
                layer.msg('操作失败')
            }
        })
    })

    $('.site-tree-mobile').click(function () {
        $('body')[0].classList.add('site-mobile')
    })

    $('.site-mobile-shade').click(function () {
        $('body')[0].classList.remove('site-mobile')
    })

});