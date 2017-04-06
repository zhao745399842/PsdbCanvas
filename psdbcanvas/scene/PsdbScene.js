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
    function PsdbScene(stage){
        /**
         * 父类createjs.Container 的构造函数
         */
        this.PsdbBaseScene_constructor(stage);
        /**
         * 是否使用背景
         * @type {boolean}
         */
        this.useBackground=true;
        /**
         * 背景色
         * @type {string}
         */
        this.backgroundColor="#C6E2FF";
        /**
         * 设置缩放比例
         * @type {number}
         */
        this.scale=1;
        /**
         * .
         * 节点是否可编辑（是否显示编辑描点）
         * @type {boolean}
         */
        this.nodeEdit=false;
        /**
         * 当前是否为画线模式，true表示是
         * @type {boolean}
         */
        this.drawLineModel=false;
        /**
         * 单选和多选，值为true表示表示单选模式，值为false表示未多选模式
         * @type {boolean}
         */
        this.selectSingle=false;
        
    }

    //指定类的继承关系
    var p = createjs.extend(PsdbScene, PsdbCanvas.PsdbBaseScene);
    
    //添加前缀创，创建父类的构造函数Container_constructor
    PsdbCanvas.PsdbScene = createjs.promote(PsdbScene, "PsdbBaseScene");
})();