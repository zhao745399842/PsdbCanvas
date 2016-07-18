/**
 * 定义发电厂
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


    function PowerPlantSubstationNode(){
        var me=this;

        me.StationNode_constructor();
        /**
         * 设置填充色
         * @type {null}
         */
        me.fillColor="#ff0000";
        
         
    }


    //指定类的继承关系
    var p = createjs.extend(PowerPlantSubstationNode, PsdbCanvas.StationNode);

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
	    shape.graphics.drawRect(x,y,me.width,me.height);
	    shape.graphics.endFill();
	    shape.graphics.beginStroke("#363636");
	    shape.graphics.drawRect(x,y,me.width,me.height);
	    shape.graphics.endStroke();
	    shape.graphics.beginStroke("#363636");
	
	    shape.graphics.moveTo(x,y+ (me.height)/2);
	    shape.graphics.lineTo(x+(me.width),y+ (me.height)/2);
	    shape.graphics.endStroke();
	    c.addChild(shape);
	    return c;
    	
       
    };


    //添加前缀创，创建父类的构造函数Stage_constructor
    PsdbCanvas.PowerPlantSubstationNode = createjs.promote(PowerPlantSubstationNode, "StationNode");
})();