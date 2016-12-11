var userId = "";
var postId = "";
$(document).ready(function(){
    renderPosts();
    checkSession(function(){renderList()}, function(){})
})

//渲染新增的分享
function renderPosts(){
    $(".operation .toComment").each(function(){
        var bottom = $(this).closest(".bottom");
        var input = $(bottom).find(".say-input");
        var postId = $(bottom).attr("data-postid");
        $(this).bind("click", function(){
            $(bottom).find(".say").attr("data-to", "");
            $(bottom).find(".toSay").attr("placeholder", "输入评论内容...");
            checkSession(function(){
                $(".operation .to-show").removeClass("to-show");
                input.addClass("to-show");
                input.find(".toSay").focus();
            });
        });
        input.find(".say").bind("click", function(){
            var toSay = $(bottom).find(".toSay");
            var content = toSay.val();
            var toArr = $(bottom).find(".say").attr("data-to").split(":");
            var toId = toArr[0];
            var toName = toArr[1];
            var to = "";
            if(toId){
               to = '<span>回复</span><a href="/user/user_view?userId='+toId+'" class="to">'+toName+'</a>'
            }
            var say = '<li class="comment-list-item"> \
                        <a href="/user/user_view" class="from">'+ $("#username").val() +'</a>'+to+'<span>:</span> \
                            <a href="javascript:void(0)" onclick="toDelete(this)">'
                        + content +
                      '</a></li>';
             checkSession(function(){
                 ajaxSay(
                    content,
                    postId,
                    toId,
                    function(){
                        $(bottom).find(".comment-list").append(say);
                    }
                );
                toSay.val("");
                $(bottom).find(".to-show").removeClass("to-show");
            });
        });
    });
    $(".operation .toFavorite").on("click", function(){
        var bottom = $(this).closest(".bottom");
        var postId = $(bottom).attr("data-postid");
        var oper = $(this).attr("data-oper");
        var that = this;
        checkSession(function(){
                ajaxFavorite(
                    postId,
                    oper,
                    function(todo){
                        $(that).attr("data-oper", todo)
                        if(todo == "del"){
                            $(that).addClass("active")
                        }else{
                            $(that).removeClass("active")
                        }
                    }
                )
            }
        );
    });
    
    $(".operation .toUpvote").on("click", function(){
        var bottom = $(this).closest(".bottom");
        var postId = $(bottom).attr("data-postid");
        var like = '<a href="#">我,</a>';
        var oper = $(this).attr("data-oper");
        var that = this;
        checkSession(function(){
                ajaxUpvote(
                    postId,
                    oper,
                    function(todo){
                        $(that).attr("data-oper", todo)
                        if(todo == "del"){
                            $(that).addClass("active")
                            $(bottom).find(".like-start").after(like);
                        }else{
                            $(that).removeClass("active")
                        }
                    }
                )
            }
        );
    });
}

/*当用户登录时，渲染列表*/
function renderList(){
    var postIds = $(".bottom").map(function(i, elem){ return $(elem).attr("data-postid")});
    if(postIds.length > 0){
        ajaxGetStatus(postIds, function(status){
            status.forEach(function(e, i){
                if(e.favorite || e.upvote){
                    var t = $(".bottom[data-postid=" + e.postId +  "]");
                    if(e.favorite){
                        t.find(".toFavorite").addClass("active")
                        t.find(".toFavorite").attr("data-oper", "del")
                    }
                    if(e.upvote)
                        t.find(".toUpvote").addClass("active")
                        t.find(".toUpvote").attr("data-oper", "del")
                }
                
            })
        })
    }
}

function toReply(elem, toId, toName) {
    var bottom = $(elem).closest(".bottom");
    $(bottom).find(".toComment").click();
    $(bottom).find(".say").attr("data-to", toId+':'+toName);
    $(bottom).find(".toSay")[0].placeholder = "回复:"+ toName;
}

function toDelete(elem, commentId) {
    var sure = confirm("删除", "删除评论？");
    if(sure){
        var bottom = $(elem).closest(".bottom");
        var postId = $(bottom).attr("data-postid");
        checkSession(function(){
            ajaxDelSay(
                commentId,
                postId,
                function(){
                    $(elem).closest(".comment-list-item").remove();
                }
            )
        });
    }
}
