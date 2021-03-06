/**
 *T节点
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

    /**
     * 定义开关站对象
     */
    function TStationNode(){
        var me=this;

        me.StationNode_constructor();
        /**
         * 设置填充色
         * @type {null}
         */
        me.fillColor="#FFFFFF";
        /**
         * 绘制颜色
         */
        me.strokeColor="#ff0000";//363636
         
    }


    //指定类的继承关系
    var p = createjs.extend(TStationNode, PsdbCanvas.StationNode);
    /**
     * 绘制图形
     */
    p.drawNodeGraphics=function(shape){
    	var me=this,
	        x=0-me.width/2,
	        y=0-me.height/2;
    	var shape=me.createDrawShape();
	    if(me.fillColor){
		   	 if(me.disabled){
		   		 shape.graphics.beginFill("#cccccc");
		   	 }else{
		   		 shape.graphics.beginFill(me.fillColor);	 
		   	 }
	    }
	    var r=me.width/2;
	    shape.graphics.drawCircle(x+r,y+r,r-2);
	    shape.graphics.endFill();
	    
	    shape.graphics.setStrokeStyle(4);
	    shape.graphics.beginStroke(me.strokeColor);
	    shape.graphics.drawCircle(x+r,y+r,r-2);
	    shape.graphics.endStroke();
    };
    /**
     * 绘制图形
     */
    /*p.drawNode=function(){
    	var me=this,
	       // shape= new PsdbCanvas.PsdbShape(me).set({cursor:me.cursor}),
	        x=0-me.width/2,
	        y=0-me.height/2;
    	var shape=me.createDrawShape();
	    if(me.fillColor){
		   	 if(me.disabled){
		   		 shape.graphics.beginFill("#cccccc");
		   	 }else{
		   		 shape.graphics.beginFill(me.fillColor);	 
		   	 }
	    }
	    var c= new PsdbCanvas.PsdbContainer();
	    var r=me.width/2;
	    shape.graphics.drawCircle(x+r,y+r,r-2);
	    shape.graphics.endFill();
	    
	    shape.graphics.setStrokeStyle(4);
	    shape.graphics.beginStroke(me.strokeColor);
	    shape.graphics.drawCircle(x+r,y+r,r-2);
	    shape.graphics.endStroke();
	    c.addChild(shape);
	    return c;
    };*/


    //添加前缀创，创建父类的构造函数Stage_constructor
    PsdbCanvas.TStationNode = createjs.promote(TStationNode, "StationNode");
})();