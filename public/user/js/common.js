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
})