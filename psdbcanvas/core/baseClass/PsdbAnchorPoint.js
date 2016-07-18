/**
 * Created by ww on 2015/8/5.
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
     * 类PsdbAnchorPoint的构造方法。
     * @constructor
     */
    function PsdbAnchorPoint(){

        /**
         * 父类createjs.Container 的构造函数
         */
        this.PsdbContainer_constructor();
        /**
         * 节点id，为一个唯一的标识符
         * @type {null}
         */
        this.id=null;
        /**
         * 节点名
         * @type {string}
         */
        this.name='PsdbAnchorPoint';
        /**
         * 节点名
         * @type {string}
         */
        this.type='PsdbAnchorPoint';

        /**
         * 指定光标移入事鼠标的样式，默认为小手
         * @type {string}
         */
        this.cursor="pointer";

        if(!this.id){
            this.id="AnchorPoint_"+this.id;
        }
    }

    //指定类的继承关系
    var p = createjs.extend(PsdbAnchorPoint, PsdbCanvas.PsdbContainer);

    p.removeAll =function(){
        var me=this;
        me.removeAllChildren();

    };
    /**
     * 绘制节点，此方法子类需要实现
     */
    p.drawAnchorPoint=function(){
        return null;
    };
    /**
     * 绘制节点
     */
    p.load=function(){

        var me=this,
            node= null;
        var  point=me.drawAnchorPoint();
    };
    //添加前缀创，创建父类的构造函数Container_constructor
    PsdbCanvas.PsdbAnchorPoint = createjs.promote(PsdbAnchorPoint, "PsdbContainer");
})();

