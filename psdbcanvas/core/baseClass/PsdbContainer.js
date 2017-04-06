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
    function PsdbContainer(){
        /**
         * 父类createjs.Container 的构造函数
         */
        this.Container_constructor();

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
    }


    //指定类的继承关系
    var p = createjs.extend(PsdbContainer, createjs.Container);

    /**
     * 获取容器中包含子节点的个数
     * @returns {*}
     */
    p.getCount= function(){
        var me=this;
        if(me.children.length>0){
            return me.children.length;
        }
        return 0;
    };
    /**
     * 返回容积中包含的所有孩子
     * @returns {*}
     */
    p.getChilds=function(){
        var me=this;
        if(me.children.length>0){
            return me.children;
        }
        return [];
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
     * 设置容器是否显示
     */
    p.setVisible=function(visible){
    	var me=this;
    	me.visible=visible;
    };
    //添加前缀创，创建父类的构造函数Container_constructor
    PsdbCanvas.PsdbContainer = createjs.promote(PsdbContainer, "Container");
})();