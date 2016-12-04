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
    nextPage();
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

}

function toSearch(){
    console.log("heh");
}

//每个分享的模板
function getPostStr(post) {
    var postStr = '<li class="list-group-item post-item"> \
				<h1 class="author">11月11日</h1> \
				<div class="content"> \
					<a class="detail" href="/user/post_view">这是一个示例文本。这是一个示例文本。这是一个示例文本。这是一个示例文本。这是一个示例文本。</a> \
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