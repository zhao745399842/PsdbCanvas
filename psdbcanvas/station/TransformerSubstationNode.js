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


    function TransformerSubstationNode(circleNum,fillColor){
        var me=this;

        me.StationNode_constructor();
        /**
         * 设置填充色
         * @type {null}
         */
        me.fillColor=fillColor||"#FFFFFF";
        //me.fillColor="#7CFC00";
        /**
         * 厂站图形圆圈的个数
         * @type {number}
         */
        me.circleNum = circleNum||3;
        /**
         * 绘制颜色
         */
        me.strokeColor="#363636";//363636
    }


    //指定类的继承关系
    var p = createjs.extend(TransformerSubstationNode, PsdbCanvas.StationNode);
    /**
     * 绘制图形
     */
    p.drawNodeGraphics=function(shape){
    	var me=this,
	        x=0-me.width/2,
	        y=0-me.height/ 2;
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
	    for(var i=1;i<=me.circleNum;i++){
	        shape.graphics.beginStroke(me.strokeColor);
	        shape.graphics.drawCircle(x+r,y+r,r*(i/me.circleNum));
	        shape.graphics.endStroke();
	    }
    };
    

    //添加前缀创，创建父类的构造函数Stage_constructor
    PsdbCanvas.TransformerSubstationNode = createjs.promote(TransformerSubstationNode, "StationNode");
})();