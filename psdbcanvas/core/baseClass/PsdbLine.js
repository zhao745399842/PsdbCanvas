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

    function PsdbLine(){
        this.EventDispatcher_constructor();

        /**
         * 线条id是一个唯一的标示
         * @type {null}
         */
        this.id=null;
        /**
         * 线路id在一个场景中唯一
         */
       
        this.lineId="";
        /**
         * 线条名
         * @type {string}
         */
        this.name="PsdbLine";
        /**
         * 线宽
         * @type {number}
         */
        this.lineWidth = 0.9; // 线宽
        /**
         * 是否为虚线模式
         */
        this.dashedPattern = false; // 虚线
        /**
         * 折线拐角处的长度
         * @type {number}
         */
        this.bundleOffset = 50;
        /**
         * 线条之间的间隔
         * @type {number}
         */
        this.bundleGap = 4;
        /**
         *  文本偏移量（向下3个像素）
         * @type {number}
         */
        this.textOffsetY = 3;
        /**
         * 绘制线条颜色
         * @type {string}
         */
        this.strokeColor = '0,200,255';
        /**
         * 线条索引，用于连个节点之间存在多条连线时标记当前连线的索引
         * @type {number}
         */
        this.lineIndex =0;
        /**
         * 是否显示箭头，默认为false显示
         * @type {boolean}
         */
        this.showArrow=false;
        /**
         * 指定光标移入事鼠标的样式，默认为小手
         * @type {string}
         */
        this.cursor="pointer";
        /**
         * 标记当前节点是否为选中状态
         * @type {boolean}
         */
        this.isSelected=false;
        /**
         * 标记连线是否可编辑
         * @type {boolean}
         */
        this.editable=true;
        /**
         * 标记是否显示
         */
        this.visible=true;

        this.initPsdbLine();
    }


    //指定原型
    var p = createjs.extend(PsdbLine, createjs.EventDispatcher);
    /**
     * 初始化连线参数
     */
    p.initPsdbLine=function(){
        var me=this;


        /**
         * private
         * 存放PsdbCanvas.PsdbShape对象用于绘制图形
         * @type {PsdbCanvas.PsdbShape}
         */
        me.shape=new PsdbCanvas.PsdbShape(this);
        /**
         * private
         * 定义线条容器
         * @type {PsdbCanvas.PsdbContainer}
         */
        me.container= new PsdbCanvas.PsdbContainer();
        /**
         * 存放线条中的所有容器
         * @type {PsdbCanvas.PsdbContainer}
         */
        me.lineContainer=new PsdbCanvas.PsdbContainer();

        /**
         * private
         *当节当前连线所在的场景点被添加到场景中时这个值会被赋值
         * @type {PsdbCanvas.PsdbScene}
         */
        me.scene=null;
        /**
         *  当前线条所属通道
         * @type {PsdbCanvas.PsdbChannel}
         */
        me.channel=null;

        /**
         *存放线条的路径
         * @type {Array}
         */
        me.linePath=new Array();

        if(!me.id){
            me.id="line_"+me.shape.id;
        }
        me.container.cursor=me.cursor;
        me.container.addChild(me.lineContainer);

    };
    /**
     * 创建连线
     * @param shape
     * @returns {*}
     */
    p.createLine = function(shape){
        var me=this,
            linePath=me.linePath=me.getLinePath();
        //var linePath=me.linePath;
        if(!linePath){
            return null;
        }

        var x=linePath[0].x+(linePath[3].x/2-linePath[0].x/2);
        var y=linePath[0].y+(linePath[3].y/2-linePath[0].y/2);
        //me.setTextLocation(x,y);
        //shape.shadow=new createjs.Shadow("#000000", 5, 5, 10);
        shape.graphics.moveTo(linePath[0].x,linePath[0].y);
        for(var i=1;i<linePath.length-1;i++){
            shape.graphics.lineTo(linePath[i].x,linePath[i].y);
        }
        shape.graphics.lineTo(linePath[linePath.length-1].x,linePath[linePath.length-1].y);
        shape.graphics.endStroke();
        if(me.showArrow){
            me.createArrow(linePath[linePath.length-3],linePath[linePath.length-2],shape);
        }
        return shape;
    };

    p.createArrow=function(pointA,pointB,shape){
        var me=this,
            arrowLength=20,
            arrowRadian=Math.PI/ 7,//箭头相对于直线的夹角
            //直线相对于x轴的夹角
            ab_radian = Math.atan2(pointB.y - pointA.y, pointB.x - pointA.x);

        var arrowUpPoint={x:pointB.x-arrowLength*Math.cos(arrowRadian+ab_radian),y:pointB.y-arrowLength*Math.sin(arrowRadian+ab_radian)},
            arrowDownPoint={x:pointB.x-arrowLength*Math.cos(arrowRadian-ab_radian),y:pointB.y+arrowLength*Math.sin(arrowRadian-ab_radian)};
        shape.graphics.beginStroke(me.strokeColor);
        shape.graphics.moveTo(pointB.x,pointB.y);
        shape.graphics.lineTo(arrowDownPoint.x,arrowDownPoint.y);
        shape.graphics.moveTo(pointB.x,pointB.y);
        shape.graphics.lineTo(arrowUpPoint.x,arrowUpPoint.y);
        //shape.graphics.lineTo(arrowDownPoint.x,arrowDownPoint.y);


    };
    /**
     * 绘制线条
     */
    p.drawLine=function(){
        var me=this,
            shape=me.shape;

        shape.graphics.clear();

        //如果虚线模式为true则采用虚线模式
        if(me.dashedPattern){
            shape.graphics.setStrokeDash([6, 6], 0);
        }
        shape.graphics.beginStroke(me.strokeColor);
        shape.graphics.setStrokeStyle(me.lineWidth);
        //获取画线条路径
        me.createLine(shape);
        return shape;
    };

   
    /**
     * 加载线条
     */
    p.load=function(){
        var me=this,
            line= null,
            container=me.lineContainer;

        //me.setTextLocation();
        line= me.drawLine();
        if(line){
            container.addChild(line);
        }
    };
    /**
     * 获取当前所画线条的实际路径
     * @returns {Array}
     */
    p.getLinePath = function(){
        var me=this,
            path=new Array();

        path=me.channel.getLinePath(me);
        return path;
    };

    /**
     * 设置线条颜色
     * @param color
     */
    p.setStrokColor=function(color){
       var me=this;
        if(color){
            me.strokeColor=color;
        }
    };
    /**
     * 设置线条宽度
     * @param w
     */
    p.setLineWidth=function(w){
        this.lineWidth=w;
    };
    /**
     * 设置虚线模式
     * @param v boolean类型
     */
    p.setDashedPattern=function(v){
        this.dashedPattern=v;
    };
    /**
     * 设置线路是否显示
     */
    p.setVisible=function(visible){
    	var me=this;
    	me.visible=visible;
    	me.container.visible=visible;
    };
    /**
     * 获取线路的显示状态
     */
    p.getVisible=function(){
    	var me=this;
    	return me.visible;
    },
    /**
     * 初始化事件
     * @param stage  舞台对象
     */
    p.initLineEvent=function(){
        var me=this,
            scene=me.scene;
    };
    PsdbCanvas.PsdbLine = createjs.promote(PsdbLine, "EventDispatcher");
})();

