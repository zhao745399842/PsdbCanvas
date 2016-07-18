/**
 * 定义全局命名空间
 * @type {{}|*}
 */
// namespace:
this.PsdbCanvas = this.PsdbCanvas||{};

(function(){
    "use strict";

    function JqDomObject(){
        this.createNodeMenue();
    }
    var p = JqDomObject.prototype;

    p.createNodeMenue= function(){
        $("body").append(
            '<div id="psdb_sceneMenu" class="easyui-menu" style="width:120px; height: 150px ">'+
                '<div>'+
                    '<span><b>新建</b></span>'+
                    '<div style="width:150px; height: 75px;">'+
                    '<div><b>发电厂</b></div>'+
                    '<div>变电站</div>'+
                    '<div>风电</div>'+
                '</div>'+
                '</div>'+
                '<div class="menu-sep"></div>'+
                '<div>粘贴</div>'+
                '<div class="menu-sep"></div>'+
                '<div>全选</div>'+
                '<div class="menu-sep"></div>'+
                '<div>保存</div>'+
                '<div class="menu-sep"></div>'+
                '<div>标注</div>'+
                '</div>'
        );
    };
    PsdbCanvas.JqDomObject = JqDomObject;
})();
