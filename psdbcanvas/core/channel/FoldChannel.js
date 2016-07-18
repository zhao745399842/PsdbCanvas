/**
 * Created by ww on 2015/10/14.
 */

/**
 * 定义全局命名空间0.
 * @type {{}|*}
 */
// namespace:
this.PsdbCanvas = this.PsdbCanvas||{};

(function(){
    "use strict";

    function FoldChannel(nodeA,nodeB,id){

        this.PsdbChannel_constructor(nodeA,nodeB,id);
    }

    //指定类的继承关系
    var p = createjs.extend(FoldChannel, PsdbCanvas.PsdbChannel);

    /**
     * 实现父类中的getCornerPoints接口，获取通道的拐点坐标
     * @returns {Array} 返回坐标数组
     */
    p.getCornerPoints = function(){
        var me=this,
            nodeA=me.nodeA,
            nodeB=me.nodeB,
            path=new Array();

        path.push({x:nodeA.x,y:nodeB.y});//开始拐点坐标
        return path;
    };

    //添加前缀创，创建父类的构造函数PsdbChannel_constructor
    PsdbCanvas.FoldChannel= createjs.promote(FoldChannel, "PsdbChannel");
})();

