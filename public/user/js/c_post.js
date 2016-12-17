var pageInfo = {
    currentPage: 1,
    pageSize: 10,
    totalPages: 1
};

$(document).ready(function(){
    renderPosts();    
    if(totalPages){
        pageInfo.totalPages = totalPages;
    }
    showPagination("#m_pag", pageInfo);
})

//获取某页的数据
function toPage(currentPage){
    pageInfo.currentPage = currentPage;
    checkSession(function(){
        $.ajax({
            url: "/ajax/user/getFavoritesList",
            type: "get",
            data: {currentPage: pageInfo.currentPage, pageSize: pageInfo.pageSize, search: $("#search").val()},
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
                }else{
                }
            },
            error:function(err, data){
                // alert("访问异常");

                console.error('访问异常');
            }
        });
    });
}

function toSearch(){
    toPage(1);
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