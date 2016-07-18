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
     * 类PsdbNode的构造方法。
     * @constructor
     */
    function PsdbNode(){

        this.EventDispatcher_constructor();
        /**
         * 节点id，为一个唯一的标识符
         * @type {null}
         */
        this.id=null;
        /**
         * 节点名
         * @type {string}
         */
        this.name='PsdbNode';
        /**
         * 中心点的x轴坐标
         * @type {number}
         */
        this.x = 0;
        /**
         * 中心点的y轴坐标
         * @type {number}
         */
        this.y = 0;
        /**
         * 当前绘制图形的宽度
         * @type {number}
         */
        this.width=0;
        /**
         * 当前绘制图形的高度
         * @type {number}
         */
        this.height=0;
        /**
         * 指定光标移入事鼠标的样式，默认为小手
         * @type {string}
         */
        this.cursor="pointer";
        /**
         * 警告框
         */
        this.alarm=true,
        /**
         * 标记节点是否可编辑
         * @type {boolean}
         */
        this.editable=true;
       /* *//**
         * 定义文本的显示位置，值为“ top、down、left、right”
         * @type {string}
         *//*
        this.textAlign="down";*/
        //this.stopemove=true;
        this.initPsdbNode();
    }

    var p = createjs.extend(PsdbNode, createjs.EventDispatcher);

    /**
     * 初始化节点
     */
    p.initPsdbNode=function(){
        var me=this;
        /**
         * 鼠标选中时，显示选中状态的背景方块
         * @type {PsdbCanvas.PsdbShape}
         */
        me.selectShape=new PsdbCanvas.PsdbShape(me);
        /**
         * 存放PsdbCanvas.PsdbShape对象用于绘制图形
         * @type {PsdbCanvas.PsdbShape}
         */
        me.shape=null;
        /**
         * 记录偏移量
         * @type {{x: number, y: number}}
         */
        me.offset={
            x :0,//x轴坐标的偏移量
            y :0//y轴坐标的偏移量
        };
        /**
         * initX与initY为初始状态下状态下的当前图形的中心点的坐标系
         * @type {number}
         */
        me.initX = 0;
        /**
         * initX与initY为初始状态下状态下的当前图形的中心点的坐标系
         * @type {number}
         */
        me.initY = 0;
        /**
         * 文字组件，是PsdbCanvas.PsdbText的一个对象,用于存放节点名称
         * @type {PsdbCanvas.PsdbText}
         */
        me.nameWidget=null;
        /**
         * 文字组件，是PsdbCanvas.PsdbText的一个对象,用于存放标注
         * @type {PsdbCanvas.PsdbText}
         */
        me.commentWidget=null;
        /**
         * 节点的描点对象
         * @type {PsdbCanvas.NodeAnchorPoint}
         */
        me.anchorPoint=null;
        /**
         * 定义节点容器。可在节点容器中加入节点元素
         * @type {PsdbCanvas.PsdbContainer}
         */
        me.container= new PsdbCanvas.PsdbContainer();
        /**
         * 当前节点所在的场景，当节点被添加到场景中时这个值会被赋值
         * @type {PsdbCanvas.PsdbScene}
         */
        me.scene=null;
        /**
         * 标记当前节点是否为选中状态
         * @type {boolean}
         */
        me.isSelected=false;
        if(!me.id){
            me.id="node_"+me.container.id;
        }
        me.container.cursor=me.cursor;
        //me.initNodeEvent();
    };
    /**
     *  设置 设置当前绘制节点的中心点坐标
     * @param x
     * @param y
     */
    p.setLocation=function(x,y){
        var me=this;
        //指定坐标
        me.x=x;
        me.y=y;
        me.initX= me.x;
        me.initY= me.y;
    };
    /**
     * 放回节点的中心点坐标
     */
    p.getLocation = function(){
    	var me=this;
    	return PsdbCanvas.PsdbPoint(me.x,me.y);
    };
    /**
     * 设置当前绘制图形的宽高（绘制图形都是矩形，可在其至上绘制其他图形）
     * @param w
     * @param h
     */
    p.setSize=function(w,h){
        this.width=w;
        this.height=h;
    };
    /**
     * 设置是否显示警告框
     * @param alarm
     */
    p.setAlarm=function(alarm){
        this.alarm=alarm||false;
    };
    /**
     * 获取绘制图的初始坐标
     * @returns {{x: number, y: number}}
     */
    p.getInitCoordinate = function(){
        var me=this,
            initX= 0,initY=0;
        //初始坐标为绘制图形的中心点
        initX= me.initX;
        initY= me.initY;

        return {
            x:initX,
            y:initY
        };
    };
    /**
     * 绘制节点，此方法子类需要实现
     */
    p.drawNode=function(){
        return null;
    };
    /**
     * 绘制节点
     */
    p.load=function(){

        var me=this,
            node= null,
            container=me.container;
        //me.setTextLocation();
        node=me.drawNode();
        if(node){
            me.drawSelectShape();
            container.addChild(me.selectShape);
            container.addChild(node);
            container.setChildIndex(me.selectShape,0);
            container.setChildIndex(node,1);
            if(me.alarm){
                var alarm=new PsdbCanvas.PsdbAlarm(me);
                container.addChild(alarm);
            }
        }
    };
    p.realLoad=function(){
        var me=this,
            childs=me.container.children;
        for(var i=0;i<childs.length;i++){
            var child=childs[i];
            if(child.type&&(child.type=="PsdbAnchorPoint"||child.type=="PsdbText")){
                continue;
            }
            me.container.removeChild(child);
        }
        me.load();
    };


    /**
     * 绘制节点选中时的背景方块
     */
    p.drawSelectShape=function(){
        var me=this,
            selectShape=me.selectShape;
        selectShape.graphics.clear();
        if(me.isSelected){
            selectShape.alpha=0.5;
        }else{
            selectShape.alpha=0;
        }
        selectShape.graphics.beginLinearGradientFill(["#FFF","#000"], [0, 1], me.x, me.y, me.x-me.width, me.y-me.width);
        selectShape.graphics.setStrokeStyle(5).beginLinearGradientStroke(["#FFF","#000"], [0, 1],  me.x, me.y, 0, 120);
        //selectShape.graphics.beginFill("#ccffff");
        selectShape.graphics.drawRect(me.x-me.offset.x-me.width/2-10,me.y-me.offset.y-me.height/2-10,me.width+20,me.height+20);
        selectShape.graphics.endFill();
    };
    p.setSelectedStyle=function(){
        var me=this;
        me.selectShape.alpha=0.5;
        me.isSelected=true;
    };
    p.clearSelectedStyle=function(){
        var me=this;
        me.selectShape.alpha=0;
    };
    /**
     * 获取节点名组件
     */
    p.getNameWidget = function(){
    	return this.nameWidget;
    };
    /**
     * 给节点设置名称文本
     * @param text
     * @param font
     * @param color
     * @returns {null|*}
     */
    p.setNameText = function(text, font, color){
        var me=this,
            x=me.x-me.offset.x,//当前中心点的坐标等于当前坐标减去偏移量
            y=me.y-me.offset.y;;
        if(!text){
            return null;
        }
        if(me.nameWidget){
            me.container.removeChild(me.nameWidget.container);
        }
        me.nameWidget = new PsdbCanvas.PsdbTextBox(me,x-me.width/2+10,y+me.height/2+20);
        me.nameWidget.setFont(font);
        me.nameWidget.setColor(color);
        me.nameWidget.setTextAlign("center");
        me.nameWidget.setValues([text]);
        me.container.addChild(me.getNameWidget().container);
        return me.nameWidget;
    };
    /**
     * 获取标注组件
     */
    p.getCommentWidget = function(){
    	return this.commentWidget;
    };
    /**
     * 设置标注组件是否可见
     */
    p.setCommentWidgetVisible = function(visible){
    	var me=this,
    	    commentWidget=me.getCommentWidget();
		if(commentWidget){
			commentWidget.setVisible(visible);
		}
    };
    /**
     * 给节点设置标注一组文本
     * @param texts 数组，标注的文本
     * @param font
     * @param color
     * @returns {null|*}
     */
    p.setCommentText = function(texts, font, color){
        var me=this,
            x=me.x-me.offset.x,//当前中心点的坐标等于当前坐标减去偏移量
            y=me.y-me.offset.y;
        if(!texts||texts.length<0){
            return null;
        }
        if(!me.commentWidget){
        	me.commentWidget = new PsdbCanvas.PsdbTextBox(me,x-100,y-me.height/2-40);
        	me.container.addChild(me.getCommentWidget().container);
        }
        me.commentWidget.setValues(texts);
        me.commentWidget.setFont(font);
        me.commentWidget.setColor(color);
        me.commentWidget.setTextAlign("left");
        return me.commentWidget;
    };
    /**
     * 给节点添加锚点。用于改变节点的形状和大小
     */
    p.addAnchorPoint = function(){
        var me=this;
        if(!me.editable){
            return;
        }
        if(me.isSelected&&!me.anchorPoint){
            me.anchorPoint=new PsdbCanvas.NodeAnchorPoint(me);
            me.anchorPoint.load();
            me.container.addChild(me.anchorPoint);
        }else{
            me.container.addChild(me.anchorPoint);
        }
    };
    p.removeAnchorPoint=function(){
        var me=this;
        if(me.anchorPoint){
            me.container.removeChild(me.anchorPoint);
        }
    };
    /**
     *节点拖动移动时处理的方法，在场景中被重写
     * @param evt
     */
    p.pressMoveHandler=function(thiz,evt){};
    /**
     * 将节点添加到场景中时初始化事件
     */
    p.initNodeEvent=function(){
        var me=this,
            scene=me.scene;
            
        /**
         * 鼠标按下事件
         * 1.鼠标按下时记录当前移动目标的偏移量
         */
        me.container.addEventListener("mousedown", function (evt) {
            //定义鼠标右键事件
            var e=evt.nativeEvent,
                scale=1/scene.scale;
            //if (e.button==0){
            scene.addselectsChild(me);
            var o = me.container;
            me.setSelectedStyle();
            o.offset = {x: o.x - evt.stageX*scale, y: o.y - evt.stageY*scale};
            me.addAnchorPoint();
            scene.updateScene();
            me.dispatchEvent({type:"mousedown",evt:evt,nativeEvent:e});
        });
        /**
         * 鼠标按下移动事件
         *  1.移动当前节点
         */
        me.container.addEventListener("pressmove", function (evt) {
            var e=evt.nativeEvent,
                scale=1/scene.scale;
            if (e.button==0){
                var o = me.container;
                scene.drawNodeLine(me,evt.stageX*scale,evt.stageY*scale);
                //如果stopemove=true当前节点禁止移动
                if(me.stopemove){
                    evt.stopPropagation();
                    return;
                }

                //计算当前移动的偏移量
                o.x = (evt.stageX*scale + o.offset.x);
                o.y = (evt.stageY*scale + o.offset.y);
                me.x=me.initX+ o.x;
                me.y=me.initY+ o.y;
                me.offset.x= o.x,me.offset.y= o.y;
                me.pressMoveHandler(me,evt);
                scene.updateScene();
            }
            evt.stopPropagation();
        });
        me.container.addEventListener("pressup", function (evt) {
            var e=evt.nativeEvent;
            scene.createNodeslink();
        });
        /**
         * 鼠标移入事件
         *  1.当鼠标移入时，显示选中背景
         */
        me.container.addEventListener("mouseover", function (evt) {
            me.selectShape.alpha=0.5;
            scene.pushLinkNodes(me);
            scene.updateScene();
            evt.stopPropagation();
        });

        /**
         * 鼠标离开事件
         *  1.如果节点状态为非选中状态则隐藏选中背景
         */
        me.container.addEventListener("mouseout", function (evt) {
            if(!me.isSelected){
                //me.selectShape.alpha=0;
                me.clearSelectedStyle();
                scene.updateScene();
            }
            scene.popLinkNodes();
            evt.stopPropagation();
        });
    };
    PsdbCanvas.PsdbNode = createjs.promote(PsdbNode, "EventDispatcher");
    //PsdbCanvas.PsdbNode = PsdbNode;
})();

