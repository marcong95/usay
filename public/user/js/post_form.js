$(document).ready(function() {
    $.validator.setDefaults({
        submitHandler: function() {
            $.ajax({
                url: "/user/post_form",
                type: "post",
                data: $("#postForm").serialize(),
                dataType: "json",
                success: function(data){
                    if(data.done){
                        location.href = "/user/index";
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
    $("#postForm").validate({
        rules: {
            content: {
                required: true
            }
        },
        messages: {
            content: {
                required: "分享内容不能为空"
            }
        }
    });
});