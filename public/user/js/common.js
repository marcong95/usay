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

function ajaxSay(postId, userId, callback) {
   // $.ajax();
    callback();
}

function ajaxFavorite(postId, callback) {
   // $.ajax();
    callback();
}
function ajaxUpvote(postId, callback){
    $.ajax({
        url: "/ajax/user/upvote",
        type: "post",
        data: {postId: postId},
        dataType: "json",
        success: function(data){
            debugger;
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


function checkSession(){
    var username = $("#username").val();
    if(!username){
        location.href = "/user/login?url=" + encodeURI(location.pathname);
    }
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