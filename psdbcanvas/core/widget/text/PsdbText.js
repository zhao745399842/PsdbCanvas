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
    function PsdbText(text, font, color){
        /**
         * 父类createjs.Container 的构造函数
         */
        this.Text_constructor(text, font, color);
        this.type="PsdbText";

        this.text=text;
        this.font=font;
        this.color=color;
        this.textAlign="center";
    }


    //指定类的继承关系
    var p = createjs.extend(PsdbText, createjs.Text);

    p.setTextLocation=function(x,y){
        var me=this;
        //指定坐标
        me.x=x;
        me.y=y;
    };
    /**
     * 设置字体
     * @param font
     */
    p.setFont = function(font){
        var me=this;
        if(font){
            this.font=font;
        }
    };

    /**
     * 设置颜色
     * @param color
     */
    p.setColor = function(color){
        var me=this;
        if(color){
            this.color=color;
        }
    };
    /**
     * 设置显示文字的对齐方式
     * @param color
     */
    p.setTextAlign = function(textAlign){
        var me=this;
        if(textAlign){
            this.textAlign=textAlign;
        }
    };
    /**
     * 设置显示文字的旋转角度
     * @param color
     */
    p.setRotation = function(rotation){
        var me=this;
        if(rotation){
            this.rotation=rotation;
        }
    };
    //添加前缀创，创建父类的构造函数Container_constructor
    PsdbCanvas.PsdbText = createjs.promote(PsdbText, "Text");
})();