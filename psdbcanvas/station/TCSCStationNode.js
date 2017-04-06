/**
 * 可控串补站
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
    function TCSCStationNode(){
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
    var p = createjs.extend(TCSCStationNode, PsdbCanvas.StationNode);
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
	    
	    //shape.graphics.setStrokeStyle(1);
	    shape.graphics.beginStroke(me.strokeColor);
	    shape.graphics.drawCircle(x+r,y+r,r);
	    shape.graphics.endStroke();
	    
	    shape.graphics.beginStroke(me.strokeColor);
       
	    shape.graphics.moveTo(x,y+r);
        shape.graphics.lineTo(x+r*(3/4),y+r);
        shape.graphics.moveTo(x+r*(3/4),y+r/4);
        shape.graphics.lineTo(x+r*(3/4),y+r*(7/4));
       
       
        shape.graphics.moveTo(x+r*(5/4),y+r);
        shape.graphics.lineTo(x+r*2,y+r);
        shape.graphics.moveTo(x+r*(5/4),y+r/4);
        shape.graphics.lineTo(x+r*(5/4),y+r*(7/4));
       
        shape.graphics.moveTo((x+r)+Math.sin(45*(Math.PI/180))*r,(y+r)-Math.sin(45*(Math.PI/180))*r);
	    shape.graphics.lineTo((x+r)-Math.sin(45*(Math.PI/180))*r,(y+r)+Math.sin(45*(Math.PI/180))*r);
      
        shape.graphics.endStroke();
    };
    /**
     * 绘制图形
     */
    /*p.drawNode=function(){
    	var me=this,
	       // shape= new PsdbCanvas.PsdbShape(me).set({cursor:me.cursor}),
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
	    
	    //shape.graphics.setStrokeStyle(1);
	    shape.graphics.beginStroke(me.strokeColor);
	    shape.graphics.drawCircle(x+r,y+r,r);
	    shape.graphics.endStroke();
	    
	    shape.graphics.beginStroke(me.strokeColor);
        
	    shape.graphics.moveTo(x,y+r);
        shape.graphics.lineTo(x+r*(3/4),y+r);
        shape.graphics.moveTo(x+r*(3/4),y+r/4);
        shape.graphics.lineTo(x+r*(3/4),y+r*(7/4));
        
        
        shape.graphics.moveTo(x+r*(5/4),y+r);
        shape.graphics.lineTo(x+r*2,y+r);
        shape.graphics.moveTo(x+r*(5/4),y+r/4);
        shape.graphics.lineTo(x+r*(5/4),y+r*(7/4));
        
        shape.graphics.moveTo((x+r)+Math.sin(45*(Math.PI/180))*r,(y+r)-Math.sin(45*(Math.PI/180))*r);
	    shape.graphics.lineTo((x+r)-Math.sin(45*(Math.PI/180))*r,(y+r)+Math.sin(45*(Math.PI/180))*r);
       
        shape.graphics.endStroke();
	    c.addChild(shape);
	    return c;
    };*/


    //添加前缀创，创建父类的构造函数Stage_constructor
    PsdbCanvas.TCSCStationNode = createjs.promote(TCSCStationNode, "StationNode");
})();