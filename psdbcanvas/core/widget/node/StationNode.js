/**
 * Created by ww on 2015/8/5.
 */


/**
 * 定义全局命名空间0.
 * @type {{}|*}
 */
// namespace:
this.PsdbCanvas = this.PsdbCanvas||{};

(function(){
    "use strict";


    function StationNode(){
        var me=this;

        me.PsdbNode_constructor();
        /**
         * 设置填充色
         * @type {null}
         */
        me.fillColor=null;
        /**
         * 绘制颜色
         */
        me.strokeColor=null;//363636
        /**
         *  图片对象
         * @type {Image}
         */
        me.image=null;
        /**
         * 线宽
         * @type {number}
         */
        me.lineWidth = 0.5; // 线宽
        /**
         * 是否为虚线模式
         */
        me.dashedPattern = false; // 虚线
        /**
         * 节点id
         */
        me.nid ="";
        me.stnId="493";
        me.modified =null;
        
    }
    //指定类的继承关系
    var p = createjs.extend(StationNode, PsdbCanvas.PsdbNode);
    //添加前缀创，创建父类的构造函数Stage_constructor
    PsdbCanvas.StationNode = createjs.promote(StationNode, "PsdbNode");
    /**
     * 实现父类中的drawNode方法，绘制节点
     */
    p.drawNode=function(){
    	var me=this;
    	me._drawNodeContainer= new PsdbCanvas.PsdbContainer();
    	me._drawNodeContainer.cache(0-me.width/2-3,0-me.height/2-3,me.width+5,me.height+5);
    	me.flushNodeShape();
    	return me._drawNodeContainer;
    };
    /**
     * 刷新节点的shape
     */
    p.flushNodeShape=function(){
    	var me=this;
    	if(me._drawNodeContainer){
    		//me._drawNodeContainer.cache(0-me.width/2-3,0-me.height/2-3,me.width+3,me.height+3);
    		
    		me._drawNodeContainer.removeAllChildren();
        	var shape=me.createDrawShape();
        	me._drawNodeContainer.addChild(shape);
        	me.drawNodeGraphics(shape);
        	
        	me._drawNodeContainer.updateCache();
    	}
    };
    /**
     * 创建绘制shape
     */
    p.createDrawShape=function(){
    	var me=this;
    	var shape= new PsdbCanvas.PsdbShape(me).set({cursor:me.cursor});
	    if(me.dashedPattern){
	    	shape.graphics.setStrokeDash([2, 1],0);
	    }
	    shape.graphics.setStrokeStyle(me.lineWidth);
	    return shape;
    };
    /**
     * 绘制节点
     */
    p.drawNodeGraphics = function(shape){
    	
    };
    /**
     * 设置虚线模式
     * @param v boolean类型
     */
    p.setDashedPattern=function(v){
    	var me=this;
    	if(v){
    		me.dashedPattern=true;
    	}else{
    		me.dashedPattern=false;
    	}
    };
    /**
     * 重新设置节点的绘制样式
     */
    p.resetDrawNodeStyle = function(strokeColor,fillColor,dashedPattern,width,height){
    	var me=this;
    	if(strokeColor){
    		me.strokeColor=strokeColor;
    	}
    	me.fillColor=fillColor||"#FFFFFF";
    	
    	if(width){
    		me.width=width;
    	}
    	if(height){
    		me.height=height;
    	}
    	me.setDashedPattern(dashedPattern);
    	me.flushNodeShape();
    };
})();