//Make sure jQuery has been loaded before app.js
if (typeof jQuery === "undefined") {
  throw new Error("AdminLTE requires jQuery");
}

(function($, window, document, undefined){
    var defaults={
        //lPosition: "fixed",
        lTop: "50px",
        lBottom: '0px',
        lWidth: "200px",
        lShow: false,
        lLayer: true,
        lLayerClick: true,
        lCloseBtn: true,
        lRelayEle: undefined,
        lCallback: undefined
    };
    function RightLayer($ele, opts, callback){
        this.$ele = $ele;
        this.options = opts = $.extend(defaults, opts || {});
        this.init();            
        if(callback){
            callback();
        }
    };
    RightLayer.prototype = {
        init: function() {
            var This = this;
            this.$ele.css("position", "fixed");
            this.$ele.css("overflow-y", "scroll");
            this.$ele.css("margin-right", "-20px");
            this.$ele.css("top", this.options.lTop);
            this.$ele.css("bottom", this.options.lBottom);
            this.$ele.css("width", this.options.lWidth);
            this.$ele.css("right", "-" + this.options.lWidth);

            if(this.options.lCloseBtn){
                var btn = $('<div class="title" style="position:absolute; top:0; left:0;  width:100%; height:35px;"><i class="fa fa-remove" style="position:absolute; top:0; left:0; padding: 0 10px; color:#fff; display: block; width: 35px; height: 100%; line-height: 35px; text-align: center;cursor: pointer;"></i></div>');
                this.$ele.append(btn);
                btn.bind('click', function() {
                    This.hide();
                });
            }
            if(this.options.lLayer){
                This.layer = this.$ele.find(".layer");
                This.layer.addClass("top-layer");
                if(this.options.lLayerClick){
                    This.layer.bind('click', function() {
                        This.hide();
                    });
                }
            }
            if(this.options.lShow){
                This.show();
            };
        },
        show:function() {
            if(this.options.lRelayEle){
                var widt = this.options.lRelayEle.width();
                if(widt > 768) widt = 768;
                this.$ele.css("width", widt+20+"px");
            }
            this.$ele.animate({"right": "0"});           
            if(this.layer){
                this.layer.css("display", "block");
            }
        },
        hide: function() {
            this.$ele.animate({"right": "-" + this.$ele.css("width")});
            if(this.layer){
                this.layer.css("display", "none");
            }
        },
        callback: function(){
            this.options.callback();
        }
    }
    $.fn.RightLayer = function(opts, callback) {
        var options = $.extend(defaults, opts || {});
        return new RightLayer($(this), options, callback);
    }
})(jQuery, window, document);
