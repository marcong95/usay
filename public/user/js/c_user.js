var postId = "";
var userId = "";
var page = {
    records: null,
    currentPage: 88,
    pageSize: 8,
    totalPages: 100,
    isEnd: false
};

$(document).ready(function(){
    renderUsers();
    toPage(1);
    showPagination("#m_pag", page);
})

//获取某页的数据
function toPage(currentPage){
    page.currentPage = currentPage;
    var users = [1, 2, 3, 4, 5];
    var html = "";
    for(var i=0, len=users.length; i<len; i++) {
        var userStr = getUserStr(users[i]);
        html += userStr;
    }
    $("#user_list").html(html);
    renderUsers();
    showPagination("#m_pag", page);
}

//渲染新增的用户
function renderUsers(){
    $(".post-item .cancel-collect").each(function(){
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
                分享者姓名<a href="#" class="cancel-collect link-no-decaration glyphicon glyphicon-star" data-userId="123"></a> \
                <small>有志者，事竟成</small> \
            </h1> \
        </li>';
    return userStr;
}