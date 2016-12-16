
var pageInfo = {
    currentPage: 1,
    pageSize: 10,
    totalPages: 1
};
var user = "";
$(document).ready(function(){
    if(totalPages){
        pageInfo.totalPages = totalPages;
    }
    renderPosts();
    showPagination("#m_pag", pageInfo);
    checkSession(function(){renderList()}, function(){})
})

//获取某页的数据
function toPage(currentPage){
    pageInfo.currentPage = currentPage;
    $.ajax({
        url: "/ajax/post/getList",
        type: "get",
        data: {currentPage: pageInfo.currentPage, pageSize: pageInfo.pageSize},
        dataType: "json",
        success: function(data){
            if(data.done){
                pageInfo = data.pageInfo;
                var posts = data.list;
                var html = "";
                for(var i=0, len=posts.length; i<len; i++) {
                    var userStr = getPostStr(posts[i]);
                    html += userStr;
                }
                $("#post_list").html(html);
                renderPosts();
                showPagination("#m_pag", pageInfo);
                checkSession(function(){renderList()}, function(){})
            }else{
            }
        },
        error:function(err, data){
            // alert("访问异常");
            
            console.error('访问异常');
        }
    });

}

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
        var oper = $(this).attr("data-oper");
        var that = this;
        checkSession(function(){
                ajaxUpvote(
                    postId,
                    oper,
                    function(todo){
                        $(that).attr("data-oper", todo)
                        if(todo == "del"){
                            var div = $(bottom).find(".like-list")
                            var html = "";
                            var like =  '<span class="like-start glyphicon glyphicon-heart-empty"></span>';
                            if($(div).find(".like-start").length==0){
                               $(div).html(like)
                               html += '<a href="/user/user_view" class="me">我</a>';
                            }else{
                                html += '<a href="/user/user_view" class="me">,我</a>';
                            }
                           $(div).append(html)
                            $(that).addClass("active")
                        }else{
                            var div = $(bottom).find(".like-list")
                            $(div).find(".me").remove()
                            if($(div).find("a").length==0){
                               div.html("")
                            }
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
                    if(e.upvote){
                        t.find(".toUpvote").addClass("active")
                        t.find(".toUpvote").attr("data-oper", "del")
                    }
                }
                
            })
        })
    }
}


function toSearch(){
    console.log("heh");
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
//每个分享的模板
function getPostStr(post) {
    var imgStr = '';
    if(post.images){
        for(let i=0, len=post.images.length; i<len; i++){ 
            var image = post.images[i];
            imgStr += '<img src="'+ image.url+'" width="32%">';
        }
    }
    var upvoteStr = "";
    if(post.upvoters.length){
        upvoteStr += '<span class="like-start glyphicon glyphicon-heart-empty"></span>'
        for(let i=0, len=post.upvoters.length; i<len; i++){ 
            var upvoter = post.upvoters[i].from;
            if(i==0){
                if(me && me._id == upvoter._id){
                    upvoteStr+= '<a href="/user/user_view" class="me">我</a>' 
                 }else{
                    upvoteStr+= '<a href="/user/user_view?userId=' +upvoter._id +'">'+upvoter.name+'</a>'
                 }
             }else{
                if(me && me._id == upvoter._id){
                     upvoteStr+= '<a href="/user/user_view" class="me">,我</a>'
                }else{
                     upvoteStr+='<a href="/user/user_view?userId=' +upvoter._id +'">,'+upvoter.name+'</a>'
                }
             }
        }
    }
    
    var commentStr = "";
    if(post.comments.length){
         for(let i=0, len=post.comments.length; i<len; i++){ 
             var comment = post.comments[i];
             commentStr += 
                    '<li class="comment-list-item">'+
                        '<a href="/user/user_view?userId='+ comment.from._id+'" class="from">'+ comment.from.name+'</a>'
                        + (comment.to._id?'<span>回复</span><a href="/user/user_view?userId='+ comment.to._id+'" class="to">'+ comment.to.name+'</a>':'') + 
                        '<span>:</span><a href="javascript:void(0)" onclick="'
                        + ((user && comment.from._id == user._id)?('toDelete(this, \''+ comment._id + '\')'):('toReply(this, \''+ comment.from._id+'\', \''+ comment.from.name+'\')'))+'">'
                        + comment.content+
                        '</a> \
                    </li>'
        }
    }
    var postStr = 
        '<li class="list-group-item post-item"> \
        <h1 class="author"> \
            <a href="/user/user_view?userId='
            + post.poster._id+
            '"><img src="'
            + post.poster.avatar+
            '">'
            + (post.poster.nickname?(post.poster.nickname+"("+post.poster.username+")"):post.poster.username)+
            '</a> \
            <small>'
            + post.created+
            '</small> \
        </h1> \
        <div class="content"> \
            <a class="detail" href="/user/post_view?postId='+ post._id+'">'
            + post.content+
            '</a> \
            <div class="picture">'
                +imgStr+
            '</div> \
        </div> \
        <div class="bottom" data-postId="'
        + post._id+
        '"> \
            <div class="like-list">'
                +upvoteStr+
            '</div> \
            <ul class="comment-list">'
                +commentStr+
            '</ul> \
            <div class="operation"> \
                <div class="operation-list f-cb"> \
<a href="javascript:void(0)" class="toComment operation-list-item link-no-decaration glyphicon glyphicon-comment" role="button"  title="评论"></a> \
<a href="javascript:void(0)" class="toFavorite operation-list-item link-no-decaration op-right glyphicon glyphicon-heart" role="button" data-oper="add" title="收藏"></a> \
<a href="javascript:void(0)" class="toUpvote operation-list-item link-no-decaration op-right glyphicon glyphicon-thumbs-up" role="button"  data-oper="add" title="点赞"></a> \
                </div> \
                <div class="say-input temp-hide"> \
                  <div class="input-group"> \
                    <input type="text" class="toSay form-control" placeholder="输入评论内容...">\
                    <a class="input-group-addon say" data-to=""><i class="glyphicon glyphicon-share-alt" title="发送"></i></a> \
                  </div> \
                </div> \
            </div> \
        </div> \
    </li>';
    return postStr;
}
