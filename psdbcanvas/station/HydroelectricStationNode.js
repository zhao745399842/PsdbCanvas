/**
 * 核电站
 * Created by zw on 2015/8/5.
 */


/**
 * 定义全局命名空间0.
 * @type {{}|*}
 */
// namespace:
this.PsdbCanvas = this.PsdbCanvas||{};

(function(){
    "use strict";


    function HydroelectricStationNode(){
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
        me.strokeColor="#00FF00";//363636
    }


    //指定类的继承关系
    var p = createjs.extend(HydroelectricStationNode, PsdbCanvas.StationNode);
    /**
     * 绘制图形
     */
    p.drawNodeGraphics=function(shape){
    	var me=this,
	        x=0-me.width/2,
	        y=0-me.height/2;
    	if(me.fillColor){
        	if(me.disabled){
	    		 shape.graphics.beginFill("#cccccc");
	    	}else{
	    		 shape.graphics.beginFill(me.fillColor);	 
	    	}
        }
        var r=me.width/2;
        shape.graphics.drawRect(x,y,me.width,me.height);
        shape.graphics.endFill();
        shape.graphics.beginStroke(me.strokeColor);
        shape.graphics.drawRect(x,y,me.width,me.height);
        shape.graphics.endStroke();

        shape.graphics.beginStroke(me.strokeColor);
        shape.graphics.moveTo(x+me.width,y);
        shape.graphics.lineTo(x,y+me.height);
        shape.graphics.endStroke();
    };
    /**
     * 绘制图形
     */
   /* p.drawNode=function(){
        var me=this,
           // shape= new PsdbCanvas.PsdbShape(me).set({cursor:me.cursor}),
            x=0-me.width/2,
            y=0-me.height/ 2,
            image=me.image;
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
        shape.graphics.drawRect(x,y,me.width,me.height);
        shape.graphics.endFill();
        shape.graphics.beginStroke(me.strokeColor);
        shape.graphics.drawRect(x,y,me.width,me.height);
        shape.graphics.endStroke();

        shape.graphics.beginStroke(me.strokeColor);
        shape.graphics.moveTo(x+me.width,y);
        shape.graphics.lineTo(x,y+me.height);
        shape.graphics.endStroke();
        c.addChild(shape);
        return c;
    };*/


    //添加前缀创，创建父类的构造函数Stage_constructor
    PsdbCanvas.HydroelectricStationNode = createjs.promote(HydroelectricStationNode, "StationNode");
})();