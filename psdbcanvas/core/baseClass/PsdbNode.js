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
         * 设置缩放比例
         * @type {number}
         */
        this.scale=1;
        /**
         * 指定光标移入事鼠标的样式，默认为小手
         * @type {string}
         */
        this.cursor="pointer";
        /**
         * 标记节点是否可编辑
         * @type {boolean}
         */
        this.editable=true;
        /**
         * 标记节点是否可用，默认为false可以
         */
        this.disabled=false;
        
        /* *//**
         * 定义文本的显示位置，值为“ top、down、left、right”
         * @type {string}
         *//*
         this.textAlign="down";*/
        //this.stopemove=true;
        this.initPsdbNode();
    }

    var p = createjs.extend(PsdbNode, createjs.EventDispatcher);

    //PsdbNode._MOUSE_EVENTS = ["click","dblclick","mousedown","mouseout","mouseover","pressmove","pressup","rollout","rollover"];
    PsdbNode._MOUSE_EVENTS = ["mousedown","mouseout","mouseover","pressmove","pressup"];
    /**
     * 初始化节点
     */
    p.initPsdbNode=function(){
        var me=this;
        
        /**
         * 标记name时否显示
         */
        me.nameVisible=true;
        /**
         * 标记标注是否显示
         */
        me.commentWidgetVisible=true;
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
         * 存储与当前node相连的所有通道
         */
        me.channels=new Array();
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
         * 定义提示标记容器，存放提示框，标记框，警告框等
         */
        me.markContainer=new PsdbCanvas.PsdbContainer();
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

        /**
         * 是一个容器，存放节点的图形
         */
        me.node=null;//存放节点图形
        /**
         * 节点的缩略显示，一般只显示与节点相同样式的一个点。节点显示的状态下缩略图为隐藏模式
         */
        me.thumbnailNode=null;
        /**
         * 显示缩略图标
         */
        me.showThumbnailNode=false;
        if(!me.id){
            me.id="node_"+me.container.id;
        }
        me.container.cursor=me.cursor;
        me.container.addChild(me.markContainer);
        //me.initNodeEvent();
    };
    /**
     *  设置 设置当前绘制节点的中心点坐标
     * @param x
     * @param y
     */
    p.setLocation=function(x,y){
        var me=this,
            o = me.container;
        me.initX= x;
        me.initY= y;
        o.x=x;
        o.y=y;
        me.x=x;
        me.y=y;
    };
    /**
     * 设置经纬度坐标.
     * 地图中使用
     */
    p.setLonLatLocation=function(x,y){
        var me=this,
            scene=me.scene;
        //if(scene&&scene.isLonlatCsysType()){
        me.lon=x;
        me.lat=y;
        var point=PsdbCanvas.lonLatToPixel(x,y);
        me.setLocation(point.x,point.y);
        return;
        // }
        // me.setLocation(x,y);
    };
    /**
     * 放回节点的中心点坐标.如果是经纬度模式将经纬度转换为坐标模式
     */
    p.getLocation = function(){
        var me=this,
            scene=me.scene;
        if(scene&&scene.isLonlatCsysType()){
            return PsdbCanvas.lonLatToPixel(me.lon,me.lat);
        }
        return new PsdbCanvas.PsdbPoint(me.x,me.y);
    };
    /**
     * 属性节点
     */
    p.refresh = function(){
        var me=this,
            scene=me.scene,
            o=me.container;
        if(scene&&scene.isLonlatCsysType()){
            var point=PsdbCanvas.lonLatToPixel(me.lon,me.lat);
            me.setLocation(point.x,point.y);
        }
    };
    /**
     * 刷新当前坐标对应的经纬度
     */
    p.refreshLonLat = function(){
        var me=this,
            scene=me.scene;
        if(scene&&scene.isLonlatCsysType()){
            var lonlat=PsdbCanvas.pixelTolonLat(me.x,me.y);
            me.lon=lonlat.x;
            me.lat=lonlat.y;
        }
    };
    /**
     * 设置缩放比例
     * @param v
     */
    p.setScale=function(v){
        var me=this;
        if(v&&v>0){
            me.container.scaleX=v;
            me.container.scaleY=v;
        }
    };
    p.getScale= function(){
    	return this.scale;
    };
    /**
     *给节点添加相连的通道
     */
    p.addChannel = function(channel){
    	var me=this,
    	    channels=me.channels,
    	    addFlg=true;
    	if(channel&&channel instanceof PsdbCanvas.PsdbChannel){
    		for(var i=0,len=channels.length;i<len;i++){
    			var c=channels[i];
    			if(channel==c){
    				addFlg=false;
    				break;
    			}
    		}
    		if(addFlg){
    			channels.push(channel);
    		}
    	}
    },
    /**
     * 移除通道
     */
    p.removeChannel = function(channel){
    	var me=this,
	        channels=me.channels;
    	if(channels&&channels.length>0){
    		if(channel&&channel instanceof PsdbCanvas.PsdbChannel){
    			PsdbCanvas.removeArrayValue(channels,channel);	
    		}
    	}
    };
    /**
     * 获取与节点相连的通道
     */
    p.getChannels = function(){
    	var me=this;
    	return me.channels;
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
    p.setAlarm=function(show,text,twinkle,bgcolor,font,textColor){
        var me=this;
        if(show){
            if(!me.alarmBox){
                me.alarmBox=new PsdbCanvas.PsdbAlarm(me);
                me.markContainer.addChild(me.alarmBox);
                //me.alarmBox.show("目标","#3300ff").setShowTwinkle(true);
            }
            text=text||"警告";
            //text,bgcolor,font,textColor
            me.alarmBox.show(text,bgcolor,font,textColor).setShowTwinkle(twinkle);
        }else{
            if(me.alarmBox){
                me.markContainer.removeChild(me.alarmBox);
                me.alarmBox=null;
            }
        }
    };
    /**
     * 设置提示消息
     * @param
     * show ：是否显示提示框
     * bgcolor ：背景色
     * text ： 警告信息
     * font ： 字体，大小 "13px Arial";
     * textColor：文字颜色，
     * twinkle ：是否闪烁
     */
    p.setPrompt=function(show,text,bgcolor,font,textColor,twinkle){
        var me=this;
        if(show){
            if(!me.promptBox){
                me.promptBox=new PsdbCanvas.PsdbAlarm(me);
                me.markContainer.addChild(me.promptBox);
            }

            me.promptBox.show(text,bgcolor,font,textColor).setShowTwinkle(twinkle);
            //me.alarmBox.show("目标","#3300ff").setShowTwinkle(true);
        }else{
            if(me.promptBox){
                me.markContainer.removeChild(me.promptBox);
                me.promptBox=null;
            }
        }
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
            //node= me.node,
            container=me.container;
        //me.setTextLocation();
        me.node=me.drawNode();
        if(me.node){
        	me.thumbnailNode=null;
        	me.thumbnailNode=me.drawThumbnailNode();
            me.drawSelectShape();
            container.addChild(me.selectShape);
            container.addChild(me.node);
            container.addChild(me.thumbnailNode);
            container.setChildIndex(me.selectShape,0);
            container.setChildIndex(me.node,1);
            container.setChildIndex(me.thumbnailNode,2);
            
            me.setThumbnailNodeVisible(me.showThumbnailNode);
        }
    };
    /**
     * 设置节点是否显示
     */
    p.setVisible = function(visible){
        var me=this;
        me.container.visible=visible;
    };
    /**
     * 获取节点的显示状态
     */
    p.getVisible = function(){
        return this.container.visible;
    };
    p.realLoad=function(){
        var me=this,
            childs=me.container.children;
        me.container.removeChild(me.node);
        me.container.removeChild(me.selectShape);
        /*for(var i=0;i<childs.length;i++){
         var child=childs[i];
         if(child.type&&(child.type=="PsdbAnchorPoint"||child.type=="PsdbTextBox")){
         continue;
         }
         me.container.removeChild(child);
         }*/
        me.load();
    };
   p.drawThumbnailNode = function(){
	   /*var me=this,
	       thumbnailNode=me.thumbnailNode;*/
	   var me=this,
	       shape= new PsdbCanvas.PsdbShape(me).set({cursor:me.cursor}),
	       x=0-me.width/4,
	       y=0-me.height/4;
	   if(me.strokeColor){
		   	 if(me.disabled){
		   		 shape.graphics.beginStroke("#cccccc");
		   	 }else{
		   		 shape.graphics.beginStroke(me.strokeColor);	 
		   	 }
	   }
	   shape.graphics.setStrokeStyle(0.7);
	   var c= new PsdbCanvas.PsdbContainer();
	   var r=me.width/6;
	   shape.graphics.drawCircle(x+r,y+r,r);
	   shape.graphics.endStroke();
	   c.addChild(shape);
	   //c.cache(x,y-r,3*r,3*r);
	   return c;
   };
   /**
    * 设置缩略图是否显示
    */
   p.setThumbnailNodeVisible=function(visible){
	   var me=this,
	       thumbnailNode=me.thumbnailNode;
	   if(thumbnailNode){
		   me.showThumbnailNode=visible;
		   thumbnailNode.setVisible(visible);
		   me.node.setVisible(!visible);
	   }
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
        
        selectShape.graphics.beginLinearGradientFill(["#FFF","#000"], [0, 1], 0, 0, 0-me.width, 0-me.width);
        selectShape.graphics.setStrokeStyle(5).beginLinearGradientStroke(["#FFF","#000"], [0, 1],  0, 0, 0, 120);
        //selectShape.graphics.beginFill("#ccffff");
        selectShape.graphics.drawRect(0-me.width/2-10,0-me.height/2-10,me.width+20,me.height+20);
        selectShape.graphics.endFill();
        
        //selectShape.cache(0-me.width/2-10,0-me.height/2-10,me.width+20,me.height+20);
        /*selectShape.graphics.beginLinearGradientFill(["#FFF","#000"], [0, 1], me.x, me.y, me.x-me.width, me.y-me.width);
        selectShape.graphics.setStrokeStyle(5).beginLinearGradientStroke(["#FFF","#000"], [0, 1],  me.x, me.y, 0, 120);
        //selectShape.graphics.beginFill("#ccffff");
        selectShape.graphics.drawRect(me.x-me.offset.x-me.width/2-10,me.y-me.offset.y-me.height/2-10,me.width+20,me.height+20);
        selectShape.graphics.endFill();*/
    };
    /**
     * 添加选中显示状态
     */
    p.addSelectedStyle=function(){
        var me=this;
        me.selectShape.alpha=0.5;
        
        if(!me.nameVisible){
        	me.getNameWidget().setVisible(true);
        }
        if(me.getCommentWidget()&&!me.commentWidgetVisible){
        	me.getCommentWidget().setVisible(true);
        }
       // me.isSelected=true;
    };
    /**
     * 清除选中显示状态
     */
    p.clearSelectedStyle=function(){
        var me=this;
        //me.isSelected=false;
        me.selectShape.alpha=0;
        me.removeAnchorPoint();
        if(!me.nameVisible){
        	me.getNameWidget().setVisible(false);
        }
        if(me.getCommentWidget()&&!me.commentWidgetVisible){
        	me.getCommentWidget().setVisible(false);
        }
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
            x=0,//当前中心点的坐标等于当前坐标减去偏移量
            y=0;
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
     * 设置标注组件是否可见
     */
    p.setNameWidgetVisible = function(visible){
        var me=this,
            widget=me.getNameWidget();
        if(widget){
        	if(visible){
        		me.nameVisible=true;
        	}else{
        		me.nameVisible=false;
        	}
        	widget.setVisible(visible);
        }
    };
    /**
     * 获取标注组件
     */
    p.getCommentWidget = function(){
        return this.commentWidget;
    };
    /**
     * 设置标注组件是否可见
     * 如果visible为false，clear为true是隐藏commentWidget的同时清除commentWidget中数据
     */
    p.setCommentWidgetVisible = function(visible,clear){
        var me=this,
            commentWidget=me.getCommentWidget();
        if(commentWidget){
        	if(visible){
        		me.commentWidgetVisible=true;
        	}else{
        		me.commentWidgetVisible=false;
        		if(clear){
        			commentWidget.removeAll();
        		}
        	}
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
            x=0,//-me.offset.x,//当前中心点的坐标等于当前坐标减去偏移量
            y=0;//-me.offset.y;
        /*if(!texts||texts.length<0){
         return null;
         }*/
        if(!me.commentWidget){
            me.commentWidget = new PsdbCanvas.PsdbTextBox(me,me.width,me.height);
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
            if(!e.ctrlKey){
            	scene.addselectsChild(me,true);
            }else{
            	scene.addselectsChild(me,false,true);
            }
            
            var o = me.container;
            o.offset = {x: o.x - evt.stageX*scale, y: o.y - evt.stageY*scale};
            me.addAnchorPoint();
            scene.updateScene(me,true);
            me.dispatchEvent({type:"mousedown",evt:evt,nativeEvent:e});
            //地图中添加
            e.stopPropagation();
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
                scene.drawNodeLine(me,evt.stageX,evt.stageY);
                //如果stopemove=true当前节点禁止移动
                if(!scene.getEditAble()||me.stopemove){
                    evt.stopPropagation();
                    return;
                }
                //计算当前移动的偏移量
                o.x = evt.stageX*scale + o.offset.x;
                o.y = evt.stageY*scale + o.offset.y;
                me.x=o.x;
                me.y=o.y;
                me.offset.x=0,me.offset.y=0;
                //me.pressMoveHandler(me,evt);
                me.refreshLonLat();
                scene.updateScene(me);
            }
            me.dispatchEvent({type:"pressmove",evt:evt,nativeEvent:e});
            evt.stopPropagation();
            e.stopPropagation();
        });
        me.container.addEventListener("pressup", function (evt) {
            var e=evt.nativeEvent;
            scene.createNodeslink();
            me.dispatchEvent({type:"pressup",evt:evt,nativeEvent:e});
            e.stopPropagation();
        });
        /**
         * 鼠标移入事件
         *  1.当鼠标移入时，显示选中背景
         */
        me.container.addEventListener("mouseover", function (evt) {
        	me.addSelectedStyle();
            scene.pushLinkNodes(me);
            scene.updateScene(me,true);
            
            me.dispatchEvent({type:"mouseover",evt:evt,nativeEvent:evt.nativeEvent});
            evt.stopPropagation();
        });

        /**
         * 鼠标离开事件
         *  1.如果节点状态为非选中状态则隐藏选中背景
         */
        me.container.addEventListener("mouseout", function (evt) {
            if(!me.isSelected){
                me.clearSelectedStyle();
                scene.updateScene(me,true);
            }
            scene.popLinkNodes();
            
            me.dispatchEvent({type:"mouseout",evt:evt,nativeEvent:evt.nativeEvent});
            evt.stopPropagation();
        });
    };
    PsdbCanvas.PsdbNode = createjs.promote(PsdbNode, "EventDispatcher");
    //PsdbCanvas.PsdbNode = PsdbNode;
})();

