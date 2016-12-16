var pageInfo = {
    currentPage: 1,
    pageSize: 10,
    totalPages: 1
};

$(document).ready(function(){
    renderPosts();
    toPage(1);
    showPagination("#m_pag", pageInfo);
    $(".toFollow").bind("click", function(){
        var userId = $(this).attr("data-userid");
        var oper = $(this).attr("data-oper");
        var that = this;
        checkSession(function(){
                ajaxFollow(
                    userId,
                    oper,
                    function(todo){
                        if(todo == "del"){
                            $(that).addClass("active")
                        }else{
                            $(that).removeClass("active")
                        }
                        $(that).attr("data-oper", todo)
                    }
                )
            }
        );
    });
    checkSession(function(){renderPage()}, function(){})
})

//获取某页的数据
function toPage(currentPage){
    var userId = queryUrl("userid");
    pageInfo.currentPage = currentPage;
    $.ajax({
        url: "/ajax/user/getListByUserId?userid="+encodeURIComponent(userId),
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
                    var userStr = getPostStr(posts[i], data.isMe);
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
        var that = this;
        checkSession(function(){
                ajaxDelPost(
                    postId,
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

/*当用户登录时，渲染页面*/
function renderPage(){
    if($(".toFollow").length < 0){
        return;
    }
    var userId = $(".toFollow").attr("data-userid");
    var oper = "state";
    ajaxFollow(
            userId,
            oper,
            function(todo){
                if(todo == "del"){
                    $(".toFollow").addClass("active")
                }else{
                    $(".toFollow").removeClass("active")
                }
                $(".toFollow").attr("data-oper", todo)
            }
        )
}

//每个分享的模板
function getPostStr(post, isMe) {
    var imgStr = "";
    if(post.images){
        for(let i=0, len=post.images.length; i<len; i++){ 
            var image = post.images[i];
            imgStr += '<img src="' + image.url +'" width="32%">';
        }
    }
    var delStr = "";
    if(isMe){
        delStr = '<a href="javascript:void(0)" class="delPost flr a-active link-no-decoration glyphicon glyphicon-trash" data-postid="'
        +post._id+
        '"></a>'
    }
    var postStr = 
        '<li class="list-group-item post-item"> \
        <h1 class="author">'
        +post.created+delStr+
        '</h1>\
        <div class="content">\
            <a href="/user/post_view?postId='
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