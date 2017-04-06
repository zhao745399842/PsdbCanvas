/**
 * Created by zw on 2015/8/5.
 * 定义一个容器类继承自createjs.Container
 *
 *  定义线路断面
 */

/**
 * 定义全局命名空间
 * @type {{}|*}
 */
// namespace:
this.PsdbCanvas = this.PsdbCanvas||{};

(function(){
    "use strict";

    /**
     * 定义线路断面类继承自createjs.Container
     * 断面是一条二次贝塞尔曲线
     * @constructor
     * point1 ：二次贝塞尔曲线的起始点
     * point2 ：二次贝塞尔曲线的控制点
     * point3 ：二次贝塞尔曲线的锚点
     */
    function PsdbLineSection(point1,point2,point3){
        /**
         * 父类createjs.Container 的构造函数
         */
        this.Container_constructor();
        /**
         * 断面名称
         */
        this.name="";
        /**
         * 断面的x坐标
         */
        this.x=0;
        /**
         * 断面的y坐标
         */
        this.y=0;
        /**
         * 断面的起始点
         */
        this.b_point=point1;
        /**
         * 断面的控制点
         */
        this.c_point=point2;
        /**
         * 断面的锚点
         */
        this.a_point=point3;
        /**
         * 设置填充色
         * @type {null}
         */
        this.fillColor="#FF0000";
        /**
         * 绘制颜色
         */
        this.strokeColor="#ff0000";//363636
        /**
         * 线宽
         * @type {number}
         */
        this.lineWidth = 7; // 线宽
        /**
         * 是否为虚线模式
         */
        this.dashedPattern = false; // 虚线
        /**
         * 断面所处场景
         */
        this.scene=null;
        this.initLineSection();
       
    }


    //指定类的继承关系
    var p = createjs.extend(PsdbLineSection, createjs.Container);

    p.initLineSection = function(){
    	var me=this;
    	
    	me.container= new PsdbCanvas.PsdbContainer();
    	/**
    	 * 断面的图形Shape
    	 */
    	me.lineSectionShape=new PsdbCanvas.PsdbShape(me);
    	/**
    	 * 选中图形
    	 */
    	me.selectShape=new PsdbCanvas.PsdbShape(me);
    	
    	me.addChild(me.lineSectionShape);
    	me.addChild(me.selectShape);
    	if(me.c_point){
    		me.x=me.c_point.getX(),
    		me.y=me.c_point.getY();
    	}
    	
        me.initSectionEvents();
    };
    /**
     * 加载断面
     */
    p.load=function(){
    	var me=this;
    	me.drawLineSection();
    	me.drawSelectShape();
//        /me.addChild(shaper);
    };
    /**
     * 绘制断面
     */
    p.drawLineSection = function(){
    	var me=this,
	    	b_point=me.b_point,
	    	c_point=me.c_point,
	    	a_point=me.a_point;
        
    	var shape=me.lineSectionShape;
    	//shape.clear();
    	shape.graphics.setStrokeStyle(me.lineWidth,"round");
    	shape.graphics.beginStroke(me.strokeColor);
    	//shape.graphics.beginFill(me.fillColor);
    	
    	shape.graphics.bezierCurveTo(c_point.getX(),c_point.getY(),a_point.getX(),a_point.getY(),b_point.getX(),b_point.getY());
    	shape.graphics.endStroke();


    	//shape.graphics.endFill();
    	return shape;
    };
    /**
     * 绘制选中时样式
     */
    p.drawSelectShape=function(){
    	var me=this,
	    	b_point=me.b_point,
	    	c_point=me.c_point,
	    	a_point=me.a_point;
	    
		var shape=me.selectShape;
		shape.alpha=0;
		//shape.clear();
		shape.graphics.setStrokeStyle(me.lineWidth+5,"round");
		shape.graphics.beginStroke("#00FF00");
		//shape.graphics.beginFill(me.fillColor);
		
		shape.graphics.bezierCurveTo(c_point.getX(),c_point.getY(),a_point.getX(),a_point.getY(),b_point.getX(),b_point.getY());
		shape.graphics.endStroke();

    };
    /**
     * 添加选中样式
     */
    p.addSelectedStyle=function(){
    	var me=this;
    	me.selectShape.alpha=0.8;
    },
    /**
     * 清除选中样式
     */
    p.clearSelectedStyle=function(){
    	var me=this;
    	me.selectShape.alpha=0;
    },
    /**
     * 初始化事件
     */
    p.initSectionEvents=function(){
    	var me=this,
            scene=me.scene;
    	/**
         * 鼠标按下事件
         * 1.鼠标按下时记录当前移动目标的偏移量
         */
        me.addEventListener("mousedown", function (evt) {
            //定义鼠标右键事件
            /*var e=evt.nativeEvent,
                scale=1/scene.scale;
            //if (e.button==0){
            if(!e.ctrlKey){
            	scene.addselectsChild(me,true);
            }else{
            	scene.addselectsChild(me,false,true);
            }
            
            var o = me.container;
            o.offset = {x: o.x - evt.stageX*scale, y: o.y - evt.stageY*scale};
            me.addAnchorPoint();
            scene.updateScene(me,true);
            me.dispatchEvent({type:"mousedown",evt:evt,nativeEvent:e});
            //地图中添加
            e.stopPropagation();*/
        });
        /**
         * 鼠标按下移动事件
         *  1.移动当前节点
         */
        me.addEventListener("pressmove", function (evt) {
            /*var e=evt.nativeEvent,
                scale=1/scene.scale;
            if (e.button==0){
                var o = me.container;
                scene.drawNodeLine(me,evt.stageX,evt.stageY);
                //如果stopemove=true当前节点禁止移动
                if(!scene.getEditAble()||me.stopemove){
                    evt.stopPropagation();
                    return;
                }
                //计算当前移动的偏移量
                o.x = evt.stageX*scale + o.offset.x;
                o.y = evt.stageY*scale + o.offset.y;
                me.x=o.x;
                me.y=o.y;
                me.offset.x=0,me.offset.y=0;
                //me.pressMoveHandler(me,evt);
                me.refreshLonLat();
                scene.updateScene(me);
            }
            me.dispatchEvent({type:"pressmove",evt:evt,nativeEvent:e});
            evt.stopPropagation();
            e.stopPropagation();*/
        });
        me.addEventListener("pressup", function (evt) {
           /* var e=evt.nativeEvent;
            scene.createNodeslink();
            me.dispatchEvent({type:"pressup",evt:evt,nativeEvent:e});
            e.stopPropagation();*/
        });
        /**
         * 鼠标移入事件
         *  1.当鼠标移入时，显示选中背景
         */
        me.addEventListener("mouseover", function (evt) {
        	me.addSelectedStyle();
            //scene.pushLinkNodes(me);
        	me.scene.updateScene(me,true);
            
            evt.stopPropagation();
        });

        /**
         * 鼠标离开事件
         *  1.如果节点状态为非选中状态则隐藏选中背景
         */
        me.addEventListener("mouseout", function (evt) {
            if(!me.isSelected){
                me.clearSelectedStyle();
                me.scene.updateScene(me,true);
            }
            //scene.popLinkNodes();
            
            evt.stopPropagation();
        });
    };
    //添加前缀创，创建父类的构造函数Container_constructor
    PsdbCanvas.PsdbLineSection = createjs.promote(PsdbLineSection, "Container");
})();