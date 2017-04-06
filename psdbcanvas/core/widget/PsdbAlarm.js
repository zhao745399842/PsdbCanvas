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
         * 使警告框使用闪烁效果
         */
        this.twinkle=false;
        /**
         * 警告框背景色
         */
        this.bgcolor="#ff6633";
        /**
         * 警告框中的文字
         */
        this.text="警告";
        /**
         * 字体及大小
         */
        this.font="13px Arial";
        /**
         * 文本颜色
         */
        this.textColor="#FFF";
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
        //PsdbCanvas.PsdbText
        /**
         * 警告文字
         */
        me.alarmText=new PsdbCanvas.PsdbText(me.text,me.font,me.textColor);
        /**
         * 一个集合用于存放线路。
         * @type {PsdbCanvas.PsdbContainer}
         */
        me.items=new PsdbCanvas.PsdbContainer();

        me.items.addChild(me.alarmShape);
        me.items.addChild(me.alarmBox);
        me.items.addChild(me.alarmText);

        me.addChild(me.items);
        me.initAlarmEvent();
    };
    /**
     * 绘制警告框
     * bgcolor ：背景色
     * text ： 警告信息
     * font ： 字体，大小 "13px Arial";
     * textColor：文字颜色
     */
    p.show = function(text,bgcolor,font,textColor){
    	var me=this;
    	me.visible=true;
    	/**
         * 警告框背景色
         */
        me.bgcolor=bgcolor||me.bgcolor;
        /**
         * 警告框中的文字
         */
        me.text=text||me.text;
        /**
         * 字体及大小
         */
        me.font=font||me.font;
        /**
         * 文本颜色
         */
        me.textColor=textColor||me.textColor;
        me.drawAlarmBox();
        return me;
    };
    p.hidden = function(){
    	this.visible=false;
    };
    /**
     * 绘制警告框
     */
    p.drawAlarmBox = function(){
        var me=this,
            target=me.target,
            alarmBox=me.alarmBox,
            tLength=me.text.length,
            w=tLength*13+5;
        
        var tx=0,//target.x-target.offset.x,//当前中心点的坐标等于当前坐标减去偏移量
            ty=0,//target.y-target.offset.y,
            x=tx,
            y=ty-target.height-15;
        
        me.alarmText.text=me.text;
        me.alarmText.setTextLocation(x,y);
        
        //var bx=-15,by=-3,bw=me.text.length*8,bh=20;
        var bx=-w/2,by=-3,bw=w,bh=20;
        alarmBox.shadow=new createjs.Shadow("#000000", 5, 5, 10);
        alarmBox.x=me.alarmText.x;
        alarmBox.y=me.alarmText.y;
        alarmBox.alpha=0.8;
        alarmBox.graphics.clear();
        alarmBox.graphics.beginFill(me.bgcolor);
        alarmBox.graphics.drawRect(bx,by,bw,bh);
       // alarmBox.graphics.endFill();

        //alarmBox.graphics.beginFill(me.bgcolor);
        alarmBox.graphics.moveTo(bx+bw/3,by+bh);
        alarmBox.graphics.lineTo(bx+(bw)/2,by+bh+5);
        //alarmBox.graphics.lineTo(target.x,by+bh+5);
        //alarmBox.graphics.moveTo(pointB.x,pointB.y);
        alarmBox.graphics.lineTo(bx+(bw/3*2),by+bh);
        alarmBox.graphics.endFill();
        //设置显示效果
        me.setShowTwinkle(me.twinkle);
        
    };
    /**
     * 设置提示框出现闪烁效果
     */
    p.setShowTwinkle=function(twinkle){
    	var me=this;
    	if(!twinkle){
    		createjs.Tween.get(me.alarmBox,{loop: false}).to({alpha:0.8});
            createjs.Tween.get(me.alarmText,{loop: false}).to({alpha:0.8});
            return;
    	}
    	createjs.Tween.get(me.alarmBox,{loop: true}).to({alpha:0.9}, 700).to({alpha:0}, 700);
        createjs.Tween.get(me.alarmText,{loop: true}).to({alpha:0.9}, 700).to({alpha:0}, 700);
        return me;
    };
    p.initAlarmEvent = function(){
    	var me=this;
    	 me.addEventListener("pressup", function (evt) {
             var e=evt.nativeEvent;
             //alert("dd");
             //e.stopPropagation();
         });
    };
    //添加前缀创，创建父类的构造函数Container_constructor
    PsdbCanvas.PsdbAlarm = createjs.promote(PsdbAlarm, "PsdbContainer");
})();