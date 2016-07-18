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
    function PsdbShape(owerCt){
        /**
         * 父类createjs.Container 的构造函数
         */
        this.Shape_constructor();

        this.type="PsdbShape";
        /**
         * 指定父类
         */
        this.owerCt=owerCt;
    }


    //指定类的继承关系
    var p = createjs.extend(PsdbShape, createjs.Shape);



    //添加前缀创，创建父类的构造函数Container_constructor
    PsdbCanvas.PsdbShape = createjs.promote(PsdbShape, "Shape");
})();