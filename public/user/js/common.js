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
    $.ajax({
        url: "/ajax/user/comment",
        type: "post",
        data: {content: content, postId: postId, userId: userId, oper: "add"},
        dataType: "json",
        success: function(data){
            if(data.done){
                callback(data);
            }else{
                callback(data);
            }
        },
        error:function(err, data){
            // alert("访问异常");
            console.error('访问异常');
        }
    });
}

function ajaxFavorite(postId, callback) {
   // $.ajax();
    callback();
}
function ajaxUpvote(postId, callback){
    $.ajax({
        url: "/ajax/user/upvote",
        type: "post",
        data: {postId: postId, oper: "add"},
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

function ajaxFollow(postId, userId, callback) {
   // $.ajax();
    callback();
}
function ajaxCancelFollow(userId, callback){
    callback();
}


function checkSession(callback){
    $.ajax({
        url: "/user/login/check",
        type: "get",
        data: {},
        dataType: "json",
        success: function(data){
            if(data.done){
                callback();
            }else{
                location.href = "/user/login?url="+encodeURI(location.href);
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