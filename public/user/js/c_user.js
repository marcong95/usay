
var pageInfo = {
    currentPage: 1,
    pageSize: 10,
    totalPages: 1
};

$(document).ready(function(){
    renderUsers();
    showPagination("#m_pag", pageInfo);
})

//获取某页的数据
function toPage(currentPage){
    pageInfo.currentPage = currentPage;
    var users = [1, 2, 3, 4, 5];
    var html = "";
    for(var i=0, len=users.length; i<len; i++) {
        var userStr = getUserStr(users[i]);
        html += userStr;
    }
    $("#user_list").html(html);
    renderUsers();
    showPagination("#m_pag", pageInfo);
}

//渲染新增的用户
function renderUsers(){
    $(".post-item .delFollow").each(function(){
        var userId = $(this).attr("data-userid");
        var user = $(this).closest(".post-item");
        $(this).bind("click", function(){
            ajaxCancelFollow(userId, function(){
               user.remove();
            });
        });
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
                分享者姓名<a href="#" class="delFollow flr link-no-decaration glyphicon glyphicon-star" data-userId="123"></a> \
                <small>有志者，事竟成</small> \
            </h1> \
        </li>';
    return userStr;
}