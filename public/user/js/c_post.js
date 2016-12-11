var pageInfo = {
    currentPage: 1,
    pageSize: 10,
    totalPages: 1
};

$(document).ready(function(){
    renderPosts();
    showPagination("#m_pag", pageInfo);
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
    showPagination("#m_pag", pageInfo);
}

//渲染新增的分享
function renderPosts(){
    $(".post-item .delFavorite").bind("click", function(){
        var postId = $(this).attr("data-postid");
        var post = $(this).closest(".post-item");
        var oper = "del";
        var that = this;
        checkSession(function(){
                ajaxFavorite(
                    postId,
                    oper,
                    function(){
                       post.remove();
                    }
                )
            }
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
						<img src="../../../common/images/picture/test2.jpg" width="32%"> \
					</div> \
				</div> \
				<div class="bottom"> \
                    <div class="show"> \
                        <div class="show-list f-cb"> \
                <span class="show-list-item"><i class="glyphicon glyphicon-comment"></i>3</span> \
                <span class="show-list-item"><i class="glyphicon glyphicon-heart"></i>4</span> \
                <span class="show-list-item"><i class="glyphicon glyphicon-thumbs-up"></i>5</span> \
                        </div> \
                    </div> \
				</div> \
			</li>';
    return postStr;
}