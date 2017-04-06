/**
 *
 * Created by zw on 2015/8/5.
 * 舞台对象，用于创建一个舞台
 * 基础类，继承createjs中的createjs.Stage类
 * 用于后续扩展
 *
 * For example:
 *  var stage=new PsdbCanvas.MyStage("canvas");
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
     * @param canv     *
     as  为一个canvas标签的id或者是一个通过document.getElementById('canvas')获取到的一个canvas对象
     * @constructor 调用父类的构造函数
     */
    function PsdbStage(canvas){

        this.Stage_constructor(canvas);

        this.enableMouseOver(5);

        /**
         * 值为true是表示当鼠标离开画布是鼠标移动事件继续进行
         * @type {boolean}
         */
        this.mouseMoveOutside = true; // keep tracking the mouse even when it leaves the canvas
        /**
         * 设置该容器的孩子是否独立支持鼠标/指针交互事件。
         * 如果为false,孩子节点将不在支持鼠标事件。
         * @type {boolean}
         */
        this.mouseChildren=true;
        /**
         * 是否使用背景
         * @type {boolean}
         */
        this.useBackground=true;
        /*document.oncontextmenu=function(){
            return false;
        }*/
        //new PsdbCanvas.JqDomObject();
        this.initObjectEvent();
    }
    //指定类的继承关系
    var p = createjs.extend(PsdbStage, createjs.Stage);
    /**
     * 设置舞台超图对象
     */
    p.setSuperMap=function(map){
        if(map){
            PsdbCanvas.setSuperMap(map);
        }
    };
    /**
     * 刷新舞台
     */
    p.updateStage=function(compositeOperation){
        var me=this;
        me.update(compositeOperation);
    };
    /**
     * 初始化事件
     */
    p.initObjectEvent=function(stage){
        var me=this;
        
        //createjs.Ticker.setFPS(50);
        //createjs.Ticker.framerate= 0;
        //createjs.Ticker.addEventListener("tick", me);

        /*me.addEventListener("mouseenter", function (evt) {
            //鼠标进入之前
            me.dispatchEvent ("beforemouseenter");
            //鼠标进入之后
            me.dispatchEvent ("aftermouseenter",evt);
        });*/

       /* me.addEventListener("aftermouseenter", function (evt) {
            alert("你好@@@");
        });*/
        /*var updateStage=function(){
        	me.updateStage();
        	window.requestAnimationFrame(updateStage);
        };
        window.requestAnimationFrame(updateStage);*/
    };



    //添加前缀创，创建父类的构造函数Stage_constructor
    PsdbCanvas.PsdbStage = createjs.promote(PsdbStage, "Stage");
})();
