
var page = {
    records: null,
    currentPage: 10,
    pageSize: 8,
    totalPages: 100,
    isEnd: false
};

$(document).ready(function(){
    renderPosts();
    showPagination("#m_pag", page);
    checkSession(function(){renderList()}, function(){})
})

//获取某页的数据
function toPage(currentPage){
    page.currentPage = currentPage;
    var posts = [1, 2, 3, 4, 5];
    var html = "";
    for(var i=0, len=posts.length; i<len; i++) {
        var userStr = getPostStr(posts[i]);
        html += userStr;
    }
    $("#post_list").html(html);
    renderPosts();
    showPagination("#m_pag", page);
    checkSession(function(){renderList()}, function(){})
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
    var postStr = '<li class="list-group-item post-item"> \
				<h1 class="author"> \
					<a href="/user/user_view"><img src="../../../common/images/picture/test2.jpg"> \
					分享者姓名 \
                    </a> \
                    <small>2016年11月11日 15:30:00</small> \
				</h1> \
				<div class="content"> \
					<a class="detail" href="/user/post_view">文本。这是一个示例文本。</a> \
					<div class="picture"> \
						<img src="../../../common/images/picture/test2.jpg" width="32%"><img src="../../../common/images/picture/test2.jpg" width="32%"><img src="../../../common/images/picture/test2.jpg" width="32%"><img src="../../../common/images/picture/test2.jpg" width="32%"><img src="../../../common/images/picture/test2.jpg" width="32%"><img src="../../../common/images/picture/test2.jpg" width="32%"> \
					</div> \
				</div> \
				<div class="bottom" data-postId="123"> \
					<div class="like-list"> \
						<span class="like-start glyphicon glyphicon-heart-empty"></span><a href="#">姓名,</a><a href="#">姓名</a> \
					</div> \
					<ul class="comment-list"> \
						<li class="comment-list-item"> \
							<a href="/user/user_view?userId=" class="from">姓名</a><span>:</span><a href="javascript:void(0)" onclick="toDelete(this)">示例文本本这是一个示例文本本这是一个示例文本本这是一个示例文本。</a> \
						</li> \
						<li class="comment-list-item"> \
							<a href="/user/user_view?userId=" class="from">姓名</a><span>回复</span><a href="/user/user_view?userId=" class="to">姓名</a><span>:</span><a href="javascript:void(0)" onclick="toReply(this, \"ta\")">这是一个示例文本这是一个示例文本本这是一个示例文本本这是一个示例文本本这是一个示例文本。</a> \
						</li> \
					</ul> \
                    <div class="operation"> \
                        <div class="operation-list f-cb"> \
    <a href="javascript:void(0)" class="toComment operation-list-item link-no-decaration glyphicon glyphicon-comment" role="button"></a> \
        <a href="javascript:void(0)" class="toUpvote operation-list-item link-no-decaration op-right glyphicon glyphicon-heart" role="button"></a> \
    <a href="javascript:void(0)" class="toFavorite operation-list-item link-no-decaration op-right glyphicon glyphicon-thumbs-up" role="button"></a> \
                        </div> \
                        <div class="say-input temp-hide"> \
                          <div class="input-group"> \
                            <input type="text" class="toSay form-control" placeholder="输入评论内容..."> \
                            <a class="input-group-addon say" data-to=""><i class="glyphicon glyphicon-share-alt"></i></a> \
                          </div> \
                        </div> \
                    </div> \
				</div> \
			</li>';
    return postStr;
}
