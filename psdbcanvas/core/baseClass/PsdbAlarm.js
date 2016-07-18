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
     */
    function PsdbAlarm(target){
        /**
         * 父类createjs.Container 的构造函数
         */
        this.PsdbContainer_constructor();
        this.target=target;
        /**
         * 初始化警报控件
         */
        this.initPsdbAlarm();
    }
    //指定类的继承关系
    var p = createjs.extend(PsdbAlarm, PsdbCanvas.PsdbContainer);

    p.initPsdbAlarm = function(){
        var me=this;
        /**
         * 警告图像
         * @type {PsdbCanvas.PsdbShape}
         */
        me.alarmShape=new PsdbCanvas.PsdbShape(me);
        me.alarmBox=new PsdbCanvas.PsdbShape(me);
        me.alarmText=new PsdbCanvas.PsdbText("警告","13px Arial","#FFF");
        /**
         * 一个集合用于存放线路。
         * @type {PsdbCanvas.PsdbContainer}
         */
        me.items=new PsdbCanvas.PsdbContainer();

        me.items.addChild(me.alarmShape);
        me.items.addChild(me.alarmBox);
        me.items.addChild(me.alarmText);

        me.addChild(me.items);
        // me.drawalarmShape();
        me.drawAlarmBox();
    };
    /**
     * 绘制节点选中时的背景方块
     */
    p.drawalarmShape=function(){
        var me=this,
            target=me.target,
            alarmShape=me.alarmShape;
        alarmShape.alpha=0;
        alarmShape.graphics.clear();
        alarmShape.graphics.beginFill("#ff6600");
        alarmShape.graphics.drawRect(target.x-target.offset.x-target.width/2-10,target.y-target.offset.y-target.height/2-10,target.width+20,target.height+20);
        alarmShape.graphics.endFill();
        createjs.Tween.get(alarmShape,{loop: true}).to({alpha:0.9}, 700).to({alpha:0}, 700);
    };
    p.drawAlarmBox = function(){
        var me=this,
            target=me.target,
            alarmBox=me.alarmBox;
        var x=target.x,
            y=target.y-target.height-10;

        me.alarmText.setTextLocation(x,y);

        alarmBox.x=me.alarmText.x;
        alarmBox.y=me.alarmText.y;
        alarmBox.alpha=0;
        alarmBox.graphics.clear();
        alarmBox.graphics.beginFill("#ff6633");
        alarmBox.graphics.drawRect(-15,-3,30,20);
        alarmBox.graphics.endFill();

        createjs.Tween.get(alarmBox,{loop: true}).to({alpha:0.9}, 700).to({alpha:0}, 700);
        createjs.Tween.get(me.alarmText,{loop: true}).to({alpha:0.9}, 700).to({alpha:0}, 700);
    };

    //添加前缀创，创建父类的构造函数Container_constructor
    PsdbCanvas.PsdbAlarm = createjs.promote(PsdbAlarm, "PsdbContainer");
})();