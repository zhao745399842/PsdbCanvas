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
    function PsdbTextBox(parent,x,y){
        /**
         * 父类createjs.Container 的构造函数
         */
        this.EventDispatcher_constructor();
        /**
         * 中心点的x轴坐标
         * @type {number}
         */
        this.x = x;
        /**
         * 中心点的y轴坐标
         * @type {number}
         */
        this.y = y;
        /**
         * 当前绘制图形的宽度
         * @type {number}
         */
        this.width = 0;
        /**
         * 当前绘制图形的高度
         * @type {number}
         */
        this.height = 0;
        /**
         * 是否可见，默认可见
         */
        this.visible = true;
        /**
         * 指定光标移入事鼠标的样式，默认为小手
         * @type {string}
         */
        this.cursor = "pointer";
        /**
         * 字体
         */
        this.font="15px Arial";
        /**
         * 颜色
         */
        this.color="#000000";
        /**
         * 显示文字的对齐方式，center、left、right
         * @type {string}
         */
        this.textAlign="center";
        /**
         * 显示文字的旋转角度
         * @type {number}
         */
        this.rotation=0;
        /**
         * 指定父类
         */
        this.parent=parent;
        this.type="PsdbTextBox";
        /**
         * 指定基准点（主要用于通道的标注，）
         * @type {PsdbCanvas.PsdbPoint}
         */
        this.referPoint=new PsdbCanvas.PsdbPoint(this.x,this.y);

        this.initPsdbTextBox();

        this.initPsdbTextBoxEvent();
    }


    //指定类的继承关系
    var p = createjs.extend(PsdbTextBox, createjs.EventDispatcher);

    p.initPsdbTextBox = function(){

        var me=this;
        /**
         * 记录偏移量
         * @type {{x: number, y: number}}
         */
        me.offset={
            x : 0 ,//x轴坐标的偏移量
            y : 0//y轴坐标的偏移量
        };
        /**
         * initX与initY为初始状态下状态下的当前图形的中心点的坐标系
         * @type {number}
         */
        me.initX = me.x;
        /**
         * initX与initY为初始状态下状态下的当前图形的中心点的坐标系
         * @type {number}
         */
        me.initY = me.y;

        /**
         * 一个集合用于存放PsdbText对象集。
         * @type {PsdbCanvas.PsdbContainer}
         */
        me.items = new PsdbCanvas.PsdbContainer();
        /**
         * 主容器
         * @type {PsdbCanvas.PsdbContainer}
         */
        me.container = new PsdbCanvas.PsdbContainer();

        me.container.addChild(me.items);
        //设置当前显示位置
        me.setLocation(me.x,me.y);
        me.setVisible(me.visible);
    };
    
    /**
     * 设置值
     * @param values 数组 Array();
     */
    p.setValues=function(values){
        var me=this,
            h=0;
        me.items.removeAllChildren();
        if(values&&values.length<1){
            return;
        }
        for(var i= 0,len=values.length;i<len;i++){
            var text= new PsdbCanvas.PsdbText(values[i], me.font,me.color);
            text.textBaseline = "alphabetic";
            text.textAlign=me.textAlign;
            text.setTextLocation(0,h);
            me.items.addChild(text);
            h=h+16;
        }
    };
    /**
     * 清除所有标注记录
     */
    p.removeAll = function(){
    	var me=this;
    	me.items.removeAllChildren();
    };
    /**
     * 设置PsbTextBox的可见性
     */
    p.setVisible=function(visible){
    	var me=this;
    	me.visible=visible;
    	me.container.visible=visible;
    };
    /**
     *  设置 设置当前绘制节点的中心点坐标
     * @param x
     * @param y
     */
    p.setLocation=function(x,y){
        var me=this,
            o=me.container;
        me.x=x;
        me.y=y;
        me.initX= me.x;
        me.initY= me.y;
        o.x=x, o.y=y;
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
     * 刷新文字的显示样式
     */
    p.flushTextStyle = function(){
        var me=this,
            textCs=me.items.getChilds();
        if(textCs&&textCs.length>0){
            for(var i= 0,len=textCs.length;i<len;i++){
                var textC=textCs[i];
                textC.setFont(me.font);
                textC.setColor(me.color);
                textC.setTextAlign(me.textAlign);
                //textC.setRotation(me.rotation);
            }
        }
    };
    /**
     * 设置字体
     * @param font
     */
    p.setFont = function(font){
        var me=this;
        if(font){
            me.font=font;
            me.flushTextStyle();
        }
    };

    /**
     * 设置颜色
     * @param color
     */
    p.setColor = function(color){
        var me=this;
        if(color){
            me.color=color;
            me.flushTextStyle();
        }
    };
    /**
     * 设置显示文字的对齐方式
     * @param color
     */
    p.setTextAlign = function(textAlign){
        var me=this;
        if(textAlign){
            me.textAlign=textAlign;
            me.flushTextStyle();
        }
    };
    /**
     * 设置显示文字框的旋转角度
     * @param color
     */
    p.setRotation=function(rotation){
        var me=this;
        if(rotation){
            /*me.rotation=rotation;
            me.flushTextStyle();*/

            me.container.rotation=rotation;
        }
    };
    /**
     * 初始化事件系统
     */
    p.initPsdbTextBoxEvent = function(){
        var me=this,
            parent=me.parent;

        /**
         * 鼠标按下事件
         * 1.鼠标按下时记录当前移动目标的偏移量
         * 2.阻止当前事件向下传递
         */
        me.container.addEventListener("mousedown", function (evt) {
            //定义鼠标右键事件
            var o=me.container,
                scene=parent.scene,
                scale=1/scene.scale;
            me.offset = {x: o.x - evt.stageX*scale, y: o.y - evt.stageY*scale};
            evt.stopPropagation();
            //超图中添加
            evt.nativeEvent.stopPropagation();
        });
        /**
         * 鼠标按下移动事件
         * 1.鼠标按下移动时改变节点的形状
         * 2.阻止当前事件向下传递
         */
        me.container.addEventListener("pressmove", function (evt) {
            var o = me.container,
                scene=parent.scene,
                scale=1/scene.scale;
            //计算当前移动的偏移量
            var mx=(evt.stageX*scale + me.offset.x),
                my= (evt.stageY*scale + me.offset.y);
            
            me.setLocation(mx,my);
            scene.updateScene(null,true);
            evt.stopPropagation();
        });


    };

    //添加前缀创，创建父类的构造函数Container_constructor
    PsdbCanvas.PsdbTextBox = createjs.promote(PsdbTextBox, "EventDispatcher");
})();