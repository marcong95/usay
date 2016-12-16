
var pageInfo = {
    currentPage: 1,
    pageSize: 10,
    totalPages: 1
};

$(document).ready(function(){
    renderUsers();    
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
            url: "/ajax/user/getFollowedList",
            type: "get",
            data: {currentPage: pageInfo.currentPage, pageSize: pageInfo.pageSize},
            dataType: "json",
            success: function(data){
                if(data.done){
                    pageInfo = data.pageInfo;
                    var users = data.list;
                    var html = "";
                    for(var i=0, len=users.length; i<len; i++) {
                        var userStr = getUserStr(users[i]);
                        html += userStr;
                    }
                    $("#post_list").html(html);
                    renderUsers();
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

//渲染新增的用户
function renderUsers(){
    $(".post-item .delFollow").bind("click", function(){
        var userid = $(this).attr("data-userid");
        var user = $(this).closest(".post-item");
        var oper = "del";
        var that = this;
        checkSession(function(){
                ajaxFollow(
                    userid,
                    oper,
                    function(){
                       user.remove();
                    }
                )
            }
        );
    });
}

function toSearch(){
    console.log("heh");
}

//每个用户的模板
function getUserStr(follower) {
    var name = "";
    if(follower.nickname){
        name += follower.nickname+'('+ follower.username+')';
    }else{
        name += follower.username;
    }
    var userStr = 
        '<li class="list-group-item post-item">\
        <h1 class="author">\
            <a href="#"><img src="'+ follower.avatar+'"></a>'
            + name +
            '<a href="javascript:void(0)" class="delFollow flr a-active link-no-decoration glyphicon glyphicon-trash" data-userid="'+ follower._id+'"></a>\
            <small>'+ (follower.bio?follower.bio:'个性签名...') + '</small>\
        </h1>\
    </li>';
    return userStr;
}