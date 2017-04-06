/**
 * Created by ww on 2015/10/9.
 */
this.PsdbCanvas = this.PsdbCanvas||{};

(function(){
    "use strict";

    /**
     * 线路通道，一个通道里包含一条或者多条线路，(对一组线路进行统一管理)
     * 继承容器类（PsdbCanvas.PsdbContainer）
     * @param
     * @constructor 调用父类的构造函数
     */
    function PsdbChannel(nodeA,nodeB,id){

        this.EventDispatcher_constructor();

        this.id=id,
        this.channelId="",

        this.nodeA=nodeA;

        this.nodeB=nodeB;
        /**
         * 线条索引，用于连个节点之间存在多条连线时标记当前连线的索引
         * @type {number}
         */
        this.lineIndex =0;
        this.defaultSelectShapeAlpha=0;
        /**
         * 背景颜色
         */
        this.backgroundColor="#FFFFFF";
        /**
         * 是否为虚线模式
         */
        this.backgroundDashedPattern = false; // 虚线
        /**
         * 背景透明度
         */
        this.backgroundAlpha=0.3;
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
        /**is
         * 是否在通道显示数据流向箭头，
         * 默认为false不显示
         * @type {boolean}
         */
        this.isShowDataFlowArrow=false;
        /**
         * 标记通道中是否始终显示一根线
         */
        this.singleLine=false;
        /**
         * 数据流向箭头指向的节点，必须是当前通道相连的节点中的一个
         * @type {null}
         */
        this.arrayDirectionNode=null;
        /**
         * 初始化通道
         */
        this.initPsdbChannel();

        this.initChannelEvent();
    }
    //指定类的继承关系
    var p = createjs.extend(PsdbChannel, createjs.EventDispatcher);
    PsdbChannel._MOUSE_EVENTS = ["mousedown","mouseout","mouseover","pressmove","pressup"];
    p.initPsdbChannel=function(){
        var me=this;
        /**
         * 。
         * @type {PsdbCanvas.PsdbContainer}
         */
        me.container=new PsdbCanvas.PsdbContainer();
        /**
         * 一个集合用于存放线路。
         * @type {PsdbCanvas.PsdbContainer}
         */
        me.items=new PsdbCanvas.PsdbContainer();
        /**
         * 数组，存放当前通道中的线条对象
         * @type {Array}
         */
        me.lines=new Array();
        /**
         * 存放通道选中时的背景通道图图形
         * @type {PsdbCanvas.PsdbContainer}
         */
        me.selectShapeContainer=new PsdbCanvas.PsdbContainer();

        /**
         * 选中时的背景图像
         * @type {PsdbCanvas.PsdbShape}
         */
        me.selectShape=null;
        /**
         * 通道背景图形
         * @type {PsdbCanvas.PsdbShape}
         */
        me.backgroundShape=new PsdbCanvas.PsdbShape(me);
        
        me.linkFlg=me.container.id;
        /**
         * 场景
         * @type {null}
         */
        me.scene=null;
        /**
         * 记录当前通道选中背景的宽度
         * @type {number}
         */
        me.selectShapeWidth=0;
        /**
         * 文字组件，存放PsdbCanvas.PsdbTextBox的对象
         * @type {PsdbCanvas.PsdbTextBox}
         */
        me.commentWidget=null;
        /**
         * 数据流箭头组件
         * @type {PsdbCanvas.PsdbContainer}
         */
        me.dataFlowArrowWidget=null;
        if(!me.id){
        	me.id="channel"+me.container.id;	
        }
        me.container.cursor="pointer";
        me.container.addChild(me.backgroundShape);
        me.container.addChild(me.items);

        me.container.addChild(me.selectShapeContainer);
       // me.container.addChild(me.textContainer);
        if(me.nodeA){
        	me.nodeA.addChannel(me);
        }
        if(me.nodeB){
        	me.nodeB.addChannel(me);
        }
    };

    /**
     * 将线路添加到通道里面
     * @param line 线路PsdbLine及其子类
     */
    p.add = function(line){
        var me=this,
            items=me.items;
        if(!line){
            return;
        }
        if(line instanceof PsdbCanvas.PsdbLine){
            line.channel=me;
            //line.scene=me.scene;
            me.lines.push(line);
            items.addChild(line.container);
            me.setLineIndex(line);
        }
    };
    /**
     * 移除指定线路
     * @param line
     */
    p.remove = function(line){
        var me=this,
            items=me.items;
        if(!line){
            return;
        }
        if(line instanceof PsdbCanvas.PsdbLine){
            PsdbCanvas.removeArrayValue(me.lines,line);
            items.removeChild(line.container);
        }
    };
     /**
     * 移除所有线路
     */
    p.removeAll = function(){
    	var me=this;
        me.items.removeAllChildren();
        me.lines=new Array();
    };
    /**
     * 获取当前通道中的线条数组
     * @returns {Array}
     */
    p.getLines =function(){
        return this.lines;
    };
    /**
     * 通过线条的lineId获取线条对象
     */
    p.getLineById = function(lineId){
    	var me=this,
    	    lines=me.getLines(),
    	    result=null;
    	if(!lines||lines.length<1){
    		return result;
    	}
    	for(var i=0,len=lines.length;i<len;i++){
    		var line=lines[i];
    		if(line.lineId===lineId){
    			result=line;
    		}
    	}
    	return result;
    };
    /**
     * 绘制通道选中时的背景
     */
    p.drawSelectShape=function(color,width){
        var me=this,
            selectShape=me.selectShape,
            points=me.getCornerPoints();

        selectShape.graphics.clear();
        selectShape.graphics.beginStroke(color);
        selectShape.graphics.setStrokeStyle(width);
        selectShape.graphics.moveTo(me.nodeA.x,me.nodeA.y);

        if(points&&points.length>0){

            for(var i= 0,len=points.length;i<len;i++){
                selectShape.graphics.lineTo(points[i].x,points[i].y);
            }
        }

        selectShape.graphics.lineTo(me.nodeB.x,me.nodeB.y);
        selectShape.graphics.endStroke();
        return selectShape;
    };
    /**
     * 绘制背景形状
     */
    p.drawBackgroundShape=function(color,width){
        var me=this,
            backgroundShape=me.backgroundShape,
	        points=me.getCornerPoints();
        
        backgroundShape.graphics.clear();
        color=me.backgroundColor;//color||"#FFFFFF";
        backgroundShape.alpha=me.backgroundAlpha;
        if(me.backgroundDashedPattern){
        	backgroundShape.graphics.setStrokeDash([12,10], 5);
        }
        
        backgroundShape.graphics.beginStroke(color);
        backgroundShape.graphics.setStrokeStyle(width);
        backgroundShape.graphics.moveTo(me.nodeA.x,me.nodeA.y);
	
	    if(points&&points.length>0){
	
	        for(var i= 0,len=points.length;i<len;i++){
	        	backgroundShape.graphics.lineTo(points[i].x,points[i].y);
	        }
	    }
	
	    backgroundShape.graphics.lineTo(me.nodeB.x,me.nodeB.y);
	    backgroundShape.graphics.endStroke();
	    return backgroundShape;
	};
	/**
	 * 设置背景色
	 */
	p.setBackgroundStyle=function(color,alpha,dashedPattern){
		var me=this;
		me.backgroundColor=color||"#FFFFFF";
		me.backgroundAlpha=alpha||0.3;
		me.backgroundDashedPattern=dashedPattern||false;
	};
    /**
     * 加载通道中的线条
     */
    p.load = function(){
        var me=this,
            lines=me.getLines(),
            lineWidth=0;
        if(!lines||lines.length<1){
            return;
        }
        for(var i=0;i<lines.length;i++){
        	//如果singleLine为true只显示一条线
        	if(me.singleLine){
        		if(lines.length==1||i==(lines.length%2)){
        			lines[i].setVisible(true);	
        		}else{
        			lines[i].setVisible(false);
        		}
        	}else{
        		lines[i].setVisible(true);
        	}
            lines[i].scene=me.scene;
            lines[i].load();
        }
        if(!me.selectShape){
            /**
             * 鼠标选中时，显示选中状态的背景方块
             * @type {PsdbCanvas.PsdbShape}
             */
            me.selectShape=new PsdbCanvas.PsdbShape(me);
            me.selectShape.alpha=me.defaultSelectShapeAlpha;
            me.selectShapeContainer.addChild(me.selectShape);
        }
        
        if(lines.length==1){
            lineWidth=lines[0].lineWidth+5;
        }else{
            lineWidth=(lines[0].lineWidth+lines[0].bundleGap)*(lines.length-1);
        }
        me.selectShapeWidth=lineWidth;
        me.drawSelectShape("#00FF00",lineWidth);
        me.drawBackgroundShape(null,lineWidth);
        //通道加载的时候设置通道上的标注的文字的位置，跟随通道的移动而移动
        if(me.commentWidget){
            //设置位置
            me.commentWidget.resetLocation(me.getTextReferLine(),false);
        }

        if(me.isShowDataFlowArrow){
            if(!me.dataFlowArrowWidget){
                me.dataFlowArrowWidget=new PsdbCanvas.PsdbDataFlowArrow(me,me.arrayDirectionNode);
                me.dataFlowArrowWidget.show();
                me.container.addChild(me.dataFlowArrowWidget);
            }
            var referLinePoints=me.getTextReferLine();
            //通过参照直线，设置倾斜度
            me.dataFlowArrowWidget.setRotationByReferLine(referLinePoints[0],referLinePoints[2]);
            //设置位置
            me.dataFlowArrowWidget.resetLocation(referLinePoints[1].getX(),referLinePoints[1].getY());
        }
    };
    /**
     * 设置通道是否显示
     */
    p.setVisible = function(visible){
    	var me=this;
    	me.container.visible=visible;
    };
    /**
     * 获取通道的显示状态
     */
    p.getVisible = function(){
    	return this.container.visible;
    };

    /**
     * 设置是否需要显示数据流箭头
     * @param isShow 值为true显示箭头
     * @param arrayDirectionNode 箭头指向的节点
     */
    p.showDataFlowArrow = function(isShow,arrayDirectionNode){
        var me=this;
        if(isShow){
            if(arrayDirectionNode){
                me.isShowDataFlowArrow=true;
                me.arrayDirectionNode=arrayDirectionNode;
            }
        }else{
            me.isShowDataFlowArrow=false;
            me.container.removeChild(me.dataFlowArrowWidget);
            me.dataFlowArrowWidget=null;
        }
    };
    p.refresh = function(){
    };
    /**
     *
     * @param _points
     * @param h
     * @returns {Array}
     */
    p.getNewPoints=function(_points,h){
        var  result = new Array();
        var  x0,y0,x1,y1,x2,y2,a1,a2,b1,b2,c1,c2,la,lb,x,y;
        //计算第一个端点的偏移
        if (_points.length > 0)
        {
            x0 = _points[0].x;
            y0 = _points[0].y;
            x1 = _points[1].x;
            y1 = _points[1].y;
            a1 = x1 - x0;
            a2 = y1 - y0;
            la = Math.sqrt(a1 * a1 + a2 * a2);
            if (Math.abs(a1) < 0.0001)
            {
                c2 = 0;
                c1 = 1;
            }
            else
            {
                var t = -1 * a2 / a1;
                c2 = 1 / Math.sqrt(1 + t * t);
                c1 = t * c2;
            }

            if (a1 * c2 - a2 * c1 > 0)
            {
                c1 = -1 * c1;
                c2 = -1 * c2;
            }
            x = x0 + h * c1;
            y = y0 + h * c2;
            result.push({x:x,y:y});
            //计算非端点的偏移

            for (var i = 1; i < _points.length - 1; i++)
            {
                x0 = _points[i - 1].x;
                y0 = _points[i - 1].y;
                x1 = _points[i].x;
                y1 = _points[i].y;
                x2 = _points[i + 1].x;
                y2 = _points[i + 1].y;

                a1 = x1 - x0;
                a2 = y1 - y0;
                b1 = x2 - x1;
                b2 = y2 - y1;
                la = Math.sqrt(a1 * a1 + a2 * a2);
                lb = Math.sqrt(b1 * b1 + b2 * b2);

                var theta = 0.5 * Math.acos(-1 * (a1 * b1 + a2 * b2) / (la * lb));
                var den = b1 * la + a1 * lb;
                do
                {
                    if (Math.abs(den) < 0.00001) //如果分母非常小
                    {
                        c2 = 0;
                        c1 = 1 / Math.sin(theta);
                    }
                    else
                    {
                        var t = -1 * (b2 * la + a2 * lb) / den;
                        c2 = 1 / (Math.sin(theta) * Math.sqrt(1 + t * t));
                        c1 = t * c2;

                    }
                    theta = 2 * Math.PI - theta;

                }
                while (a1 * c2 - a2 * c1 > 0);

                c1 = h * c1;
                c2 = h * c2;

                x = c1 + x1;
                y = c2 + y1;
                result.push({x:x,y:y});
            }

            //计算第二个端点的偏移

            x0 = _points[_points.length - 2].x;
            y0 = _points[_points.length - 2].y;
            x1 = _points[_points.length - 1].x;
            y1 = _points[_points.length - 1].y;
            a1 = x1 - x0;
            a2 = y1 - y0;
            la = Math.sqrt(a1 * a1 + a2 * a2);
            if (Math.abs(a1) < 0.0001)
            {
                c2 = 0;
                c1 = 1;
            }
            else
            {
                var t = -1 * a2 / a1;
                c2 = 1 / Math.sqrt(1 + t * t);
                c1 = t * c2;
            }

            if (a1 * c2 - a2 * c1 > 0)
            {
                c1 = -1 * c1;
                c2 = -1 * c2;
            }
            x = x1 + h * c1;
            y = y1 + h * c2;
            result.push({x:x,y:y});
        }
        return result;
    };

    /**
     * 获取通道的拐点坐标
     * 需要子类实现此方法
     * @returns {Array} 返回坐标数组 [{x:1,y:2},{x:3,y:6},..]
     */
    p.getCornerPoints = function(){

    };
    /**
     * 给通道添加一组拐点，可以是一个也可以是多个拐点
     * 需要子类实现此方法
     * @param points  数组 为一直
     */
    p.setCornerPoints = function(points){

    };
    /**
     * 给通道添加一组拐点，可以是一个也可以是多个拐点
     * 需要子类实现此方法
     * @param points  数组 存储经纬度点
     */
    p.setLonLatCornerPoints= function(points){

    };
    /**
     *  返回所有点的坐标，包括初始A、B节点和所有拐点的坐标，
     *  初始A、B节点为第一个和最后一个
     * @returns {Array}
     */
    p.getAllPoints = function(){
        var me=this,
            nodeA=me.nodeA,
            nodeB=me.nodeB,
            points=new Array(),
            cornerPoints=me.getCornerPoints();
        points.push({x:nodeA.x,y:nodeA.y});
        if(cornerPoints&&cornerPoints.length>0){
            for(var i= 0,len=cornerPoints.length;i<len;i++ ){
                points.push({x:cornerPoints[i].x,y:cornerPoints[i].y});//开始拐点坐标
            }
        }
        points.push({x:nodeB.x,y:nodeB.y});

        return points;
    };
    /**
     * 获取通道中线条路径坐标点
     * @param line
     * @returns {Array}
     */
    p.getLinePath = function(line){
        var me=this,
            nodeB=me.nodeB,
            nodeA=me.nodeA,
            path=new Array(),
            bundlegap= 0,
            points=new Array(),
            cornerPoints=null;
        if(!line){
            return;
        }

        points=me.getAllPoints();

        if(me.lines.length%2==0){

            if(line.lineIndex>0){
                bundlegap=line.bundleGap * (line.lineIndex-0.5);
            }else{
                bundlegap=line.bundleGap * (line.lineIndex+0.5);
            }
        }else{
            bundlegap=line.bundleGap * (line.lineIndex);
        }

        var ps=me.getNewPoints(points,bundlegap);

        for(var i= 0,len=ps.length;i<len;i++){

            if(i==0){
                path.push({x:nodeA.x,y:nodeA.y});
                path.push({x:ps[i].x,y:ps[i].y});
            }else if(i==len-1){
                path.push({x:ps[i].x,y:ps[i].y});
                path.push({x:nodeB.x,y:nodeB.y});
            }else{
                path.push({x:ps[i].x,y:ps[i].y});
            }
        }

        return path;
    };

    /**
     * 指定线条获取当前线条lineIndex
     * @param line
     */
    p.setLineIndex=function(line){
        var me=this,
            lines=me.lines,
            //linkFlg=line.linkFlg,//连接标记，用于标记当前连线连接的节点,生成规则：nodeA.id+'_'+nodeB.id;
            count= lines.length,
            centerIndex= 0;

        if(count<=1){
            return;
        }
        if(count%2==0){
            centerIndex=count/2;
            for(var i= 0,len=lines.length;i<len;i++){
               if(i<centerIndex){
                   lines[i].lineIndex=centerIndex-i;
               }else{
                   lines[i].lineIndex=centerIndex-i-1;
               }
            }
        }else{
            centerIndex=Math.floor(count/2);
            for(var i= 0,len=lines.length;i<len;i++){
                lines[i].lineIndex=centerIndex-i;
            }
        }
    };
    /**
     * 添加选择样式，unselected为true表示只添加样式
     */
    p.addSelectedStyle=function(){
        var me=this;
        me.selectShape.alpha=0.5;
    };
    p.clearSelectedStyle=function(){
        var me=this;
        me.selectShape.alpha=me.defaultSelectShapeAlpha;
    };
    /**
     * 获取文本参照线，返回直线上的三个点，
     * 第一个点为起点坐标，第二个点为直线中心点坐标，第三个点为终点坐标
     * @returns {PsdbCanvas.PsdbPoint}
     */
    p.getTextReferLine = function(){
        var me=this,
            points=me.getAllPoints(),
            result=new Array(),
            a, b,count;
        if(!points||points.length<1){
            return;
        }
        count=points.length;
        a=count%2,b=Math.floor(count/2);
        if(a==0){
           // console.log("######################"+points[b-1].x+"^^"+points[b-1].y+"b="+b+" count="+count);
            result.push(new PsdbCanvas.PsdbPoint(points[b-1].x,points[b-1].y));
            result.push(new PsdbCanvas.PsdbPoint((points[b-1].x+points[b].x)/2,(points[b-1].y+points[b].y)/2));
            result.push(new PsdbCanvas.PsdbPoint(points[b].x,points[b].y));
        }else{
            result.push(new PsdbCanvas.PsdbPoint(points[b].x,points[b].y));
            result.push(new PsdbCanvas.PsdbPoint((points[b].x+points[b+1].x)/2,(points[b].y+points[b+1].y)/2));
            result.push(new PsdbCanvas.PsdbPoint(points[b+1].x,points[b+1].y));
        }
        return result;
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
			commentWidget.setVisible(visible);
			if(!visible&&clear){
    			commentWidget.removeAll();
    		}
		}
    };
    
    
    /**
     * 给通道设置标注（标注的位置为初始标注，标注会跟随通道的移动而发生改变，在load方法中直线设置标注位置动态改变）
     * @param d : 文本框到通道的垂直距离
     * @param l ：文本框到通道基准点的直线距离（通道基准点，为通道中一段直线的中间点坐标）
     * @param text
     * @param font
     * @param color
     * @returns {null|*}
     */
    p.setCommentText = function(texts,d,l,font, color){
        var me=this,
            text_x = 0,text_y= 0,
            cornerPoints=me.getCornerPoints();
        var referLinePoints=me.getTextReferLine();

        if(!referLinePoints[1]||referLinePoints[1].length<1){
            return;
        }
        if(!d){
            d = 10;
        }
        if(!me.commentWidget){
        	me.commentWidget = new PsdbCanvas.PsdbChannelTextBox(me,referLinePoints,d,l);
        	me.container.addChild(me.commentWidget.container);
        }
        me.commentWidget.setValues(texts);
        me.commentWidget.setFont(font);
        me.commentWidget.setColor(color);
        me.commentWidget.setTextAlign("left");
       
        return me.commentWidget;
    };
    /**
     * 初始化事件
     * @param stage  舞台对象
     */
    p.initChannelEvent=function(){
        var me=this,
            scene=me.scene;
        /**
         * 鼠标按下事件
         * 1.鼠标按下时记录当前移动目标的偏移量
         */
        me.container.addEventListener("mousedown", function (evt) {
            var scene=me.scene;
            //定义鼠标右键事件
            var e=evt.nativeEvent;
            if (e.button==0){
                //scene.addselectsChild(me);
            	if(!e.ctrlKey){
                	scene.addselectsChild(me,true);
                }else{
                	scene.addselectsChild(me,false,true);
                }
                //me.addSelectedStyle();
                //me.isSelected=true;
                scene.updateScene(null,true);
            }
            me.dispatchEvent({type:"mousedown",evt:evt,nativeEvent:evt.nativeEvent});
            e.stopPropagation();
        });


        me.container.addEventListener("pressmove", function (evt) {
        	me.dispatchEvent({type:"pressmove",evt:evt,nativeEvent:evt.nativeEvent});
            evt.stopPropagation();
        });
        me.container.addEventListener("pressup", function (evt) {
            var e=evt.nativeEvent;
            me.dispatchEvent({type:"pressup",evt:evt,nativeEvent:evt.nativeEvent});
        });
        /**
         * 鼠标移入事件
         *  1.当鼠标移入时，显示选中背景
         */
        me.container.addEventListener("mouseover", function (evt) {
            var scene=me.scene;
            me.addSelectedStyle();
            scene.updateScene(null,true);
            me.dispatchEvent({type:"mouseover",evt:evt,nativeEvent:evt.nativeEvent});
            evt.stopPropagation();
        });
        /**
         * 鼠标离开事件
         *  1.如果节点状态为非选中状态则隐藏选中背景
         */
        me.container.addEventListener("mouseout", function (evt) {
            var scene=me.scene;
            if(!me.isSelected){
                me.clearSelectedStyle();
                scene.updateScene(null,true);
            }
            me.dispatchEvent({type:"mouseout",evt:evt,nativeEvent:evt.nativeEvent});
            evt.stopPropagation();
        });
    };

    //添加前缀创，创建父类的构造函数PsdbContainer_constructor
    PsdbCanvas.PsdbChannel = createjs.promote(PsdbChannel, "EventDispatcher");
})();