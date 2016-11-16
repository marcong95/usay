$(document).ready(function() {
    $.validator.setDefaults({
        submitHandler: function() {
            $.ajax({
                url: "/user/reg",
                type: "post",
                data: $("#regForm").serialize(),
                dataType: "json",
                success: function(data){
                    if(data.done){
                        location.href = data.url;
                    }else{
                        $("#tip").html(data.msg);
                        $(".return-tip").removeClass("hidden");
                        setTimeout(function(){
                            $(".return-tip").addClass("hidden");
                        }, 3000);
                    }
                },
                error:function(err, data){
                    alert("访问异常");
                }
            });
        }
    });
    // validate signup form on keyup and submit
    $("#regForm").validate({
        rules: {
            username: {
                required: true,
                maxlength: 15,
            },
            password: {
                required: true,
                minlength: 6,
                maxlength: 20,
            },
            confirm_password: {
                required: true,
                equalTo: "#password"
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
            },
            confirm_password: {
                required: "请填写确认密码",
                equalTo: "确认密码不匹配"
            }
        }
    });
});