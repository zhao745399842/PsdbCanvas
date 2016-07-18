/**
 * 电压变电站
 * Created by ZW on 2015/9/16.
 */




/**
 * 定义全局命名空间0.
 * @type {{}|*}
 */
// namespace:
this.PsdbCanvas = this.PsdbCanvas||{};

(function(){
    "use strict";


    function TransformerSubstationNode(){
        var me=this;

        me.StationNode_constructor();
        /**
         * 设置填充色
         * @type {null}
         */
        me.fillColor="#B3EE3A";
        /**
         * 厂站图形圆圈的个数
         * @type {number}
         */
        me.circleNum = 3;
    }


    //指定类的继承关系
    var p = createjs.extend(TransformerSubstationNode, PsdbCanvas.StationNode);

    /**
     * 绘制图形
     */
    p.drawNode=function(){
    	var me=this,
	        shape= new PsdbCanvas.PsdbShape(me).set({cursor:me.cursor}),
	        x=me.x-me.offset.x-me.width/2,
	        y=me.y-me.offset.y-me.height/ 2,
	        image=me.image;
	    if(me.fillColor){
	        shape.graphics.beginFill(me.fillColor);
	    }
	    var c= new PsdbCanvas.PsdbContainer();
	    var r=me.width/2;
	    shape.graphics.drawCircle(x+r,y+r,r);
	    shape.graphics.endFill();
	    for(var i=1;i<=me.circleNum;i++){
	        shape.graphics.beginStroke("#363636");
	        shape.graphics.drawCircle(x+r,y+r,r*(i/me.circleNum));
	        shape.graphics.endStroke();
	    }
	    c.addChild(shape);
	    return c;
    };


    //添加前缀创，创建父类的构造函数Stage_constructor
    PsdbCanvas.TransformerSubstationNode = createjs.promote(TransformerSubstationNode, "StationNode");
})();