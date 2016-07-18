/**
 * Created by zw on 2015/8/6.
 */

/**
 * 定义全局命名空间0.
 * @type {{}|*}
 */
// namespace:
this.PsdbCanvas = this.PsdbCanvas||{};

(function(){
    "use strict";

    function FoldLine(nodeA,nodeB,text,dashedPattern){

        this.PsdbLine_constructor(nodeA,nodeB);

      /*  this.nodeA=nodeA;
        this.nodeB=nodeB;*/

        this.initFoldLine();

    }

    //指定类的继承关系
    var p = createjs.extend(FoldLine, PsdbCanvas.PsdbLine);

    /**
     * 初始化连线
     */
    p.initFoldLine=function(){
        var me=this;
        //连接标记，用于标记当前连线连接的节点
        me.linkFlg=me.nodeA.id+'_'+me.nodeB.id;
    };

    /**
     * 获取当前所画线条的实际路径，由四个点确定
     * 第一个点表示开始坐标，第二个点表示开始拐点处坐标，
     * 第三个点表示结束拐点处的坐标，第四个点表示结束坐标
     * @returns {Array}
     *   返回一个包含四个路径点的数组。
     */
    p.getLinePath = function(){
        var me=this,
            nodeA=me.nodeA,
            nodeB=me.nodeB,
            path=new Array();

        path.push({x:nodeA.x,y:nodeA.y});// 开始坐标
        path.push({x:nodeA.x,y:nodeB.y});//开始拐点坐标
        path.push({x:nodeB.x,y:nodeB.y});//结束拐点坐标
        path.push({x:nodeB.x,y:nodeB.y});//结束坐标

        return path;
    };


    //添加前缀创，创建父类的构造函数Stage_constructor
    PsdbCanvas.FoldLine= createjs.promote(FoldLine, "PsdbLine");
})();
