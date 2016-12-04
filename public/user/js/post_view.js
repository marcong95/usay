var userId = "";
var postId = "";
$(document).ready(function(){
    renderPosts();
})

//渲染分享
function renderPosts(){
    $(".operation .toComment").each(function(){
        var bottom = $(this).closest(".bottom");
        var input = $(bottom).find(".say-input");
        $(this).bind("click", function(){
            checkSession();
            $(".operation .to-show").removeClass("to-show");
            input.addClass("to-show");
            $(bottom).find(".say").attr("data-to", "");
            $(bottom).find(".toSay").attr("placeholder", "输入评论内容...");
            input.find(".toSay").focus();
        });
        input.find(".say").bind("click", function(){
            var toSay = $(bottom).find(".toSay");
            var text = toSay.val();
            var to = $(bottom).find(".say").attr("data-to")?('<span>回复</span><a href="/user/user_view?userId=" class="to">'+$(bottom).find(".say").attr("data-to")+'</a>'):'';
            var say = '<li class="comment-list-item"> \
                        <a href="#" class="from">姓名</a>'+to+'<span>:</span> \
                            <a href="javascript:void(0)" onclick="toDelete(this)">'
                        + text +
                      '</a></li>';
            ajaxSay(
                postId,
                userId,
                function(){
                    $(bottom).find(".comment-list").append(say);
                }
            );
            toSay.val("");
            $(bottom).find(".to-show").removeClass("to-show");
        });
    });
    $(".operation .toFavorite").on("click", function(){
        checkSession();
        var bottom = $(this).closest(".bottom");
        var like = '<a href="#">我,</a>';
        ajaxFavorite(
            postId,
            function(){
                $(bottom).find(".like-start").after(like);
            }
        );
    });
    
    $(".operation .toUpvote").on("click", function(){
        checkSession();
        ajaxUpvote(
            postId,
            function(){}
        );
    });
}

function toReply(elem, to) {
    var bottom = $(elem).closest(".bottom");
    $(bottom).find(".toComment").click();
    $(bottom).find(".say").attr("data-to", to);
    $(bottom).find(".toSay").attr("placeholder", "回复:"+ to);
}

function toDelete(elem) {
    var sure = confirm("删除", "删除评论？");
    if(sure){
        $(elem).closest(".comment-list-item").remove();
    }
}
