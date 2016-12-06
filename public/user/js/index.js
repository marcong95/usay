var postId = "";
var userId = "";
var page = {
    records: null,
    currentPage: 1,
    pageSize: 8,
    totalPages: null,
    isEnd: false
};

$(document).ready(function(){
    renderPosts();
})

//获取下一页的数据
function nextPage(){
    var posts = [1, 2, 3, 4, 5];
    for(var i=0, len=posts.length; i<len; i++) {
        var postStr = getPostStr(posts[i]);
        $("#post_list").append(postStr);
    }
    renderPosts();
}

//渲染新增的分享
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

function toSearch(){
    console.log("heh");
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
							<a href="/user/user_view?userId=" class="from">姓名</a><span>回复</span><a href="/user/user_view?userId=" class="to">姓名</a><span>:</span><a href="javascript:void(0)" onclick="toReply(this, \'ta\')">这是一个示例文本这是一个示例文本本这是一个示例文本本这是一个示例文本本这是一个示例文本。</a> \
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