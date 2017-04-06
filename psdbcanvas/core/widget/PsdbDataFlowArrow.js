/**
 * Created by zw on 2015/8/5.
 * 定义一个容器类继承自createjs.Container
 *
 * 需要后续扩展
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
     * 定义一个容器类继承自createjs.Container
     * @constructor
     * @param target 作用对象，为通道
     * @param arrayDirectionNode箭头指向的节点，是通道相连的节点中的一个
     */
    function PsdbDataFlowArrow(target,arrayDirectionNode){
        /**
         * 父类createjs.Container 的构造函数
         */
        this.PsdbContainer_constructor();
        
        this.target=target;
        /**
         * 记录偏移量
         * @type {{x: number, y: number}}
         */
        this.offset={
            x : 0 ,//x轴坐标的偏移量
            y : 0//y轴坐标的偏移量
        };
        /**
         * initX与initY为初始状态下状态下的当前图形的中心点的坐标系
         * @type {number}
         */
        this.initX = this.x;
        /**
         * initX与initY为初始状态下状态下的当前图形的中心点的坐标系
         * @type {number}
         */
        this.initY = this.y;
        /**
         * 使警告框使用闪烁效果
         */
        this.twinkle=false;
        /**
         * 警告框背景色
         */
        this.bgcolor="#ff6633";
        /**
         * 箭头指向，指向一个节点
         * @type {PsdbNode}
         */
        this.arrayDirectionNode=arrayDirectionNode;
        /**
         * 指定基准点（主要用于通道的标注，）
         * @type {PsdbCanvas.PsdbPoint}
         */
        this.referPoint=new PsdbCanvas.PsdbPoint(this.x,this.y);
        /**
         * 初始化警报控件
         */
        this.initPsdbDataFlowArrow();
    }
    //指定类的继承关系
    var p = createjs.extend(PsdbDataFlowArrow, PsdbCanvas.PsdbContainer);

    p.initPsdbDataFlowArrow = function(){
        var me=this;

        /**
         * 箭头图形
         * @type {PsdbCanvas.PsdbShape}
         */
        me.arrowShape=new PsdbCanvas.PsdbShape(me);
        /**
         * 一个集合用于存放组件
         * @type {PsdbCanvas.PsdbContainer}
         */
        me.items=new PsdbCanvas.PsdbContainer();

        me.items.addChild(me.arrowShape);

        me.addChild(me.items);
    };
    /**
     * 绘制警告框
     * bgcolor ：背景色
     * text ： 警告信息
     * font ： 字体，大小 "13px Arial";
     * textColor：文字颜色
     */
    p.show = function(bgcolor,font,textColor){
    	var me=this;
    	me.visible=true;
    	/**
         * 警告框背景色
         */
        me.bgcolor=bgcolor||me.bgcolor;
        me.drawAlarmBox();
        return me;
    };
    p.hidden = function(){
    	this.visible=false;
    };
    /**
     *  设置 设置当前绘制节点的中心点坐标
     * @param x
     * @param y
     */
    p.setLocation=function(x,y){
        var me=this;
        me.x=x;
        me.y=y;
        me.initX= me.x;
        me.initY= me.y;
    };
    /**
     * 设置箭头指向的节点
     * @param node
     */
    p.setArrayDirectionNode=function(node){
        this.arrayDirectionNode=node;
    };
    /**
     * 指定基准点，
     * @param x
     * @param y
     */
    p.setReferPoint=function(x,y){
        var me=this;
        me.referPoint.setXY(x,y);
    };
    /**
     * 重新设置当前控件的的位置，在通道移动的时候设置跟随通道移动
     */
    p.resetLocation=function(move_x,move_y,isUpdateScene){
        var me=this,
            o = me.container,
            parent=me.parent,
            scene=parent.scene;
            //scale=1/scene.scale;
        //计算当前移动的偏移量
        if(me.referPoint.getX()==move_x&& me.referPoint.getY()==move_y){
            return;
        }
        var x = move_x,
            y = move_y;
        me.setLocation(x,y);
        me.setReferPoint(move_x,move_y);
        if(isUpdateScene){
            scene.updateScene();
        }
    },
    /**
     * 设置显箭头的旋转角度
     * @param color
     */
    p.setRotation=function(rotation){
        var me=this;
        if(rotation){
            me.rotation=rotation;
        }
    };
    /**
     * 参照直线的倾斜度设置箭头的倾斜度
     * @param pointA (PsdbCanvas.PsdbPoint对象) 直线上一点A
     * @param pointB (PsdbCanvas.PsdbPoint对象) 直线上的yi点B
     * @param points (PsdbCanvas.PsdbPoint对象) 直线上的通道上的所有点
     */
    p.setRotationByReferLine = function(pointA,pointB){
        var me=this,
            arrayDirectionNode=me.arrayDirectionNode,//节点
            points=me.target.getAllPoints(),
            angleAB=0;

        if(arrayDirectionNode&&arrayDirectionNode.x==points[0].x &&arrayDirectionNode.y==points[0].y){
            angleAB=Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x);
        }else{
            angleAB=Math.atan2(pointB.y - pointA.y, pointB.x - pointA.x);
        }
        me.setRotation((angleAB/Math.PI)*180+90);
    };
    /**
     * 绘制警告框
     */
    p.drawAlarmBox = function(){
        var me=this,
            target=me.target,
            lines=target.lines,
            arrowShape=me.arrowShape,
            rw=0;//参照点的x坐标和有坐标

        /*for(var i= 0,len=lines.length;i<len;i++){
            rw=rw+lines[i].bundleGap;
        }*/
        rw=7;
        //arrowShape.shadow=new createjs.Shadow("#000000", 5, 5, 10);

        arrowShape.alpha=0.8;
        arrowShape.graphics.clear();
        arrowShape.graphics.beginFill(me.bgcolor);
        arrowShape.graphics.moveTo(0,0);
        arrowShape.graphics.lineTo(-rw,rw);
        arrowShape.graphics.lineTo(rw,rw);
        arrowShape.graphics.lineTo(0,0);

        arrowShape.graphics.moveTo(-rw/2,rw);
        arrowShape.graphics.lineTo(-rw/2,rw*2.5);
        arrowShape.graphics.lineTo(0,rw*2);
        arrowShape.graphics.lineTo(rw/2,rw*2.5);
        arrowShape.graphics.lineTo(rw/2,rw/2);

        arrowShape.graphics.endFill();
        //设置显示效果
        //me.setShowTwinkle(true);
        
    };
    /**
     * 设置提示框出现闪烁效果
     */
    p.setShowTwinkle=function(twinkle){
    	var me=this;
    	if(!twinkle){
    		createjs.Tween.get(me.arrowShape,{loop: false}).to({alpha:0.8});
            return;
    	}
    	createjs.Tween.get(me.arrowShape,{loop: true}).to({alpha:0.9}, 700).to({alpha:0}, 700);
        return me;
    };

    //添加前缀创，创建父类的构造函数Container_constructor
    PsdbCanvas.PsdbDataFlowArrow = createjs.promote(PsdbDataFlowArrow, "PsdbContainer");
})();