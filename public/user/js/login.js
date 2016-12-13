
var targetUrl = "";
$(function(){
    targetUrl = queryUrl("url");
    if(!targetUrl){
        targetUrl = "/user/index";
    }else{
        targetUrl = decodeURIComponent(targetUrl)
    }
});
$().ready(function() {
    $.validator.setDefaults({
        submitHandler: function() {
            // issue: ajax request repeatable
            // issue: ajax request has not timeout mechanism
            $.ajax({
                url: "/user/login",
                type: "post",
                data: $("#loginForm").serialize(),
                dataType: "json",
                success: function(data){
                    if(data.done){
                        location.href = targetUrl;
                    }else{
                        $("#tip").html(data.msg);
                        $(".return-tip").removeClass("hidden");
                        setTimeout(function(){
                            $(".return-tip").addClass("hidden");
                        }, 3000);
                    }
                },
                error:function(err, data){
                    // alert("访问异常");
                    console.error('访问异常: ' + err);
                }
            });
        }
    });
    // validate signup form on keyup and submit
    $("#loginForm").validate({
        rules: {
            username: {
                required: true,
                maxlength: 15,
            },
            password: {
                required: true,
                minlength: 6,
                maxlength: 20,
            }
        },
        messages: {
            username: {
                required: "请填写用户名",
                maxlength: "用户名长度不能大于15"
            },
            password: {
                required: "请填写确认密码",
                minlength: "密码长度不能小于6",
                maxlength: "密码长度不能大于20",
            }
        }
    });
});