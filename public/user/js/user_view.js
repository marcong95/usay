var pageInfo = {
    currentPage: 1,
    pageSize: 10,
    totalPages: 1
};

$(document).ready(function(){
    renderPosts();
    toPage(1);
    showPagination("#m_pag", pageInfo);
})

//获取某页的数据
function toPage(currentPage){
    pageInfo.currentPage = currentPage;
    $.ajax({
        url: "/ajax/user/getListByUserId",
        type: "get",
        data: {currentPage: pageInfo.currentPage, pageSize: pageInfo.pageSize},
        dataType: "json",
        success: function(data){
            if(data.done){
                pageInfo = data.pageInfo;
                var posts = data.list;
                var user = data.user;
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
}

//渲染新增的分享
function renderPosts(){
    $(".post-item .delPost").bind("click", function(){
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

//每个分享的模板
function getPostStr(post) {
    var imgStr = "";
    if(post.images){
        for(let i=0, len=post.images.length; i<len; i++){ 
            var image = post.images[i];
            imgStr += '<img src="' + image.url +'" width="32%">';
        }
    }
    var postStr = 
        '<li class="list-group-item post-item"> \
        <h1 class="author">'
        +post.created+
        '<a href="javascript:void(0)" class="delFavorite flr a-active link-no-decaration glyphicon glyphicon-trash" data-postid="'
        +post._id+
        '"></a></h1>\
        <div class="content">\
            <a href="/user/post_view?id='
        +post._id+
        '">\
        <span class="detail">'
        +post.content+
        '</span>\
        <div class="picture">'
            + imgStr +
           '</div> \
        </div> \
        </a> \
        <div class="bottom">\
            <div class="show">\
                <div class="show-list f-cb">\
        <span class="show-list-item"><i class="glyphicon glyphicon-comment"></i>'
         + (post.comments?post.comments.length:"0")+
        '</span>\
        <span class="show-list-item"><i class="glyphicon glyphicon-heart"></i>'
         + (post.upvotes?post.upvotes.length:"0")+
        '</span>\
        <span class="show-list-item"><i class="glyphicon glyphicon-thumbs-up"></i>'
        + (post.favourites?post.favourites.length:"0")+
        '</span>\
                </div>\
            </div>\
        </div>\
    </li>';
    return postStr;
}