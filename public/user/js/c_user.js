
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
                    for(var i=0, len=posts.length; i<len; i++) {
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
function getUserStr(user) {
    var userStr = 
        '<li class="list-group-item post-item"> \
            <h1 class="author"> \
                <a href="/user/user_view?userId=123"><img src="../../../common/images/picture/test2.jpg"></a> \
                分享者姓名<a href="#" class="delFollow flr link-no-decoration glyphicon glyphicon-star" data-userId="123"></a> \
                <small>有志者，事竟成</small> \
            </h1> \
        </li>';
    return userStr;
}