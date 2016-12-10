$(document).ready(function(){
    $(".search-input .search").bind("focus", function(){
        if(document.body.clientWidth < 380){
            var search_input = $(this).closest(".search-input");
            search_input.addClass("on-focus");
            search_input.width(document.body.clientWidth-88);
        }
    });
    $(".search-input .search").bind("blur", function(){
        var self = this;
        setTimeout(function(){console.log("ok");
            if(document.body.clientWidth < 380){
                var search_input = $(self).closest(".search-input");
                search_input.removeClass("on-focus");
                search_input.width(164);
            }
        });
    });
});

function ajaxSay(content, postId, userId, callback) {
    if(userId == '') userId = null;
    $.ajax({
        url: "/ajax/user/comment",
        type: "post",
        data: {content: content, postId: postId, userId: userId},
        dataType: "json",
        success: function(data){
            if(data.done){
                callback(data);
            }else{
                alert(data.msg)
            }
        },
        error:function(err, data){
            // alert("访问异常");
            console.error('访问异常');
        }
    });
}
function ajaxDelSay(commentId, postId, callback) {
    $.ajax({
        url: "/ajax/user/uncomment",
        type: "post",
        data: {commentId: commentId, postId:postId},
        dataType: "json",
        success: function(data){
            if(data.done){
                callback(data);
            }else{
                alert(data.msg)
            }
        },
        error:function(err, data){
            // alert("访问异常");
            console.error('访问异常');
        }
    });
}
function ajaxFavorite(postId, oper, callback) {
    $.ajax({
        url: "/ajax/user/favorite",
        type: "post",
        data: {postId: postId, oper: oper},
        dataType: "json",
        success: function(data){
            if(data.done){
                callback(data.todo);
            }else{
            }
        },
        error:function(err, data){
            // alert("访问异常");
            console.error('访问异常');
        }
    });
}
function ajaxUpvote(postId, oper, callback){
    $.ajax({
        url: "/ajax/user/upvote",
        type: "post",
        data: {postId: postId, oper: oper},
        dataType: "json",
        success: function(data){
            if(data.done){
                callback(data.todo);
            }else{
            }
        },
        error:function(err, data){
            // alert("访问异常");
            console.error('访问异常');
        }
    });
}

function ajaxFollow(postId, userId, callback) {
    $.ajax({
        url: "/ajax/user/upvote",
        type: "post",
        data: {postId: postId, oper: oper},
        dataType: "json",
        success: function(data){
            if(data.done){
                callback();
            }else{
            }
        },
        error:function(err, data){
            // alert("访问异常");
            
            console.error('访问异常');
        }
    });
}
function ajaxCancelFollow(userId, callback){
    callback();
}

function ajaxGetStatus(postIds, callback) {
    var postIdStr = postIds.toArray().join();
    $.ajax({
        url: "/ajax/user/postsStatus",
        type: "get",
        data: {postIds: postIdStr},
        dataType: "json",
        success: function(data){
            if(data.done){
                callback(data.status);
            }else{
            }
        },
        error:function(err, data){
            // alert("访问异常");
            
            console.error('访问异常');
        }
    });
}

function checkSession(cb, cb2){
    $.ajax({
        url: "/user/login/check",
        type: "get",
        data: {},
        dataType: "json",
        success: function(data){
            if(data.done){
                cb();
            }else{
                if(cb2){
                    cb2();
                }else{
                    location.href = "/user/login?url="+encodeURI(location.href);
                }
            }
        },
        error:function(err, data){
            // alert("访问异常");
            console.error('访问异常');
        }
    }); 
}
function queryUrl(key){
    var seg = location.search.replace(/^\?/,'').split('&');  
     for(var i=0, len=seg.length; i<len; i++) {  
         if (!seg[i]) { continue; }  
         s = seg[i].split('=');  
         if(s[0] == key) return s[1];  
     }  
     return null;  
}
function showPagination(target, page){
    if(page.totalPages < 2) return;
    var lis = "";
    var len = 9;
    if($("body").width() < 768){
        len = 5;
    }
    var temp = (len-1)/2;
    if(page.currentPage-temp<1){
        temp = page.currentPage-1;
    }else if(page.currentPage+4 > page.totalPages){
        temp = len-1-page.totalPages+page.currentPage;
    }
    for(var i=0; i<len; i++){
        if(i==0 && page.currentPage-temp > 1){
            var t = page.currentPage-10;
            if(t < 1){
                t = 1;
            }
            lis += '<li><a href="javascript:toPage('+t+')">&laquo;</a></li>';
        }
        if(i-temp == 0){
            lis += '<li class="active"><a href="javascript:toPage('+(page.currentPage+i-temp)+')">'+(page.currentPage+i-temp)+'</a></li>';
        }else{
            lis += '<li><a href="javascript:toPage('+(page.currentPage+i-temp)+')">'+(page.currentPage+i-temp)+'</a></li>';
        }
        if(i==len-1 && (page.currentPage+i-temp < page.totalPages)){
            var t = page.currentPage+10;
            if(t > page.totalPages)
                t = page.totalPages;
            lis += '<li><a href="javascript:toPage('+ t +')">&raquo;</a></li>';
        }
    }
    $(target).html(lis);
}