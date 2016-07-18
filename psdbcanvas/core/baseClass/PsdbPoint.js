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
     * 类PsdbPoint的构造方法。
     * @constructor
     */
    function PsdbPoint(x,y){
        /**
         * 节点id，为一个唯一的标识符
         * @type {null}
         */
        this.x=x;
        /**
         * 节点id，为一个唯一的标识符
         * @type {null}
         */
        this.y=y;

    }

    //指定类的继承关系
    var p = PsdbPoint.prototype;

    p.setX= function(x){
      this.x=x;
    };
    p.getX= function(){
        return this.x;
    };

    p.setXY=function(x,y){
        this.x=x;
        this.y=y;
    };

    p.setY= function(y){
        this.y=y;
    };
    p.getY= function(){
        return this.y;
    };
    //添加前缀创，创建父类的构造函数Container_constructor
    PsdbCanvas.PsdbPoint = PsdbPoint;
})();

