/**
 * 定义换流站
 * Created by ZW on 2015/9/16.
 */

// namespace:
this.PsdbCanvas = this.PsdbCanvas||{};

(function(){
    "use strict";


    function ConvertorSubstationNode(){
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
    var p = createjs.extend(ConvertorSubstationNode, PsdbCanvas.StationNode);
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
	     shape.graphics.drawCircle(x+r,y+r,r);
	     shape.graphics.endFill();
	     
	     shape.graphics.beginStroke(me.strokeColor);
	     shape.graphics.drawCircle(x+r,y+r,r);
	     shape.graphics.endStroke();
	     
	     shape.graphics.beginStroke(me.strokeColor);
	     shape.graphics.moveTo((x+r)-Math.sin(45*(Math.PI/180))*r,(y+r)-Math.sin(45*(Math.PI/180))*r);
	     shape.graphics.lineTo((x+r)+Math.sin(45*(Math.PI/180))*r,(y+r)+Math.sin(45*(Math.PI/180))*r);
	     shape.graphics.endStroke();
	     
	     shape.graphics.beginStroke(me.strokeColor);
	     shape.graphics.moveTo((x+r)-r*(2/3),(y+r)+r/3);
	     shape.graphics.lineTo(x+r,(y+r)+r/3);
	     shape.graphics.endStroke();
	     
	     shape.graphics.beginStroke(me.strokeColor);
	     shape.graphics.moveTo(x+r,(y+r)-r/3);
	     shape.graphics.bezierCurveTo((x+r)+r*(1/4),(y+r)+r*(1/5),(x+r)+r*(1/3),(y+r)-r*(3/4),(x+r)+r*(2/3),(y+r)-r/3);
	     shape.graphics.endStroke();
    };
    /**
     * 绘制图形
     */
   /* p.drawNode=function(){
    	 var me=this,
	         //shape= new PsdbCanvas.PsdbShape(me).set({cursor:me.cursor}),
	         x=0-me.width/2,
	         y=0-me.height/ 2;
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
	     shape.graphics.drawCircle(x+r,y+r,r);
	     shape.graphics.endFill();
	     
	     shape.graphics.beginStroke(me.strokeColor);
	     shape.graphics.drawCircle(x+r,y+r,r);
	     shape.graphics.endStroke();
	     
	     shape.graphics.beginStroke(me.strokeColor);
	     shape.graphics.moveTo((x+r)-Math.sin(45*(Math.PI/180))*r,(y+r)-Math.sin(45*(Math.PI/180))*r);
	     shape.graphics.lineTo((x+r)+Math.sin(45*(Math.PI/180))*r,(y+r)+Math.sin(45*(Math.PI/180))*r);
	     shape.graphics.endStroke();
	     
	     shape.graphics.beginStroke(me.strokeColor);
	     shape.graphics.moveTo((x+r)-r*(2/3),(y+r)+r/3);
	     shape.graphics.lineTo(x+r,(y+r)+r/3);
	     shape.graphics.endStroke();
	     
	     shape.graphics.beginStroke(me.strokeColor);
	     shape.graphics.moveTo(x+r,(y+r)-r/3);
	     shape.graphics.bezierCurveTo((x+r)+r*(1/4),(y+r)+r*(1/5),(x+r)+r*(1/3),(y+r)-r*(3/4),(x+r)+r*(2/3),(y+r)-r/3);
	     shape.graphics.endStroke();
	     c.addChild(shape);
	    return c;
       
    };*/


    //添加前缀创，创建父类的构造函数Stage_constructor
    PsdbCanvas.ConvertorSubstationNode = createjs.promote(ConvertorSubstationNode, "StationNode");
})();