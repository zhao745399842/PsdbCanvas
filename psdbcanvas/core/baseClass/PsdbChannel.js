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

        this.nodeA=nodeA;

        this.nodeB=nodeB;
        /**
         * 线条索引，用于连个节点之间存在多条连线时标记当前连线的索引
         * @type {number}
         */
        this.lineIndex =0;
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
         * 初始化通道
         */
        this.initPsdbChannel();

        this.initChannelEvent();
    }
    //指定类的继承关系
    var p = createjs.extend(PsdbChannel, createjs.EventDispatcher);

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
        if(!me.id){
        	me.id="channel"+me.container.id;	
        }
        me.container.cursor="pointer";

        me.container.addChild(me.items);

        me.container.addChild(me.selectShapeContainer);
       // me.container.addChild(me.textContainer);


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
            lines[i].scene=me.scene;
            lines[i].load();
        }
        if(!me.selectShape){
            /**
             * 鼠标选中时，显示选中状态的背景方块
             * @type {PsdbCanvas.PsdbShape}
             */
            me.selectShape=new PsdbCanvas.PsdbShape(me);
            me.selectShape.alpha=0;
            me.selectShapeContainer.addChild(me.selectShape);
        }
        if(lines.length==1){
            lineWidth=lines[0].lineWidth+5;
        }else{
            lineWidth=(lines[0].lineWidth+lines[0].bundleGap)*(lines.length-1);
        }
        me.selectShapeWidth=lineWidth;
        me.drawSelectShape("#00FF00",lineWidth);

        //通道加载的时候设置通道上的标注的文字的位置，跟随通道的移动而移动
        if(me.commentWidget){
            var referLinePoints=me.getTextReferLine();
            //通过参照直线，设置倾斜度
            me.commentWidget.setRotationByReferLine(referLinePoints[0],referLinePoints[2]);
            //设置位置
            me.commentWidget.resetLocation(referLinePoints[1].getX(),referLinePoints[1].getY());
        }
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
    p.setSelectedStyle=function(){
        var me=this;
        me.selectShape.alpha=0.5;
    };
    p.clearSelectedStyle=function(){
        var me=this;
        me.selectShape.alpha=0;
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
     */
    p.setCommentWidgetVisible = function(visible){
    	var me=this,
    	    commentWidget=me.getCommentWidget();
		if(commentWidget){
			commentWidget.setVisible(visible);
		}
    };
    
    
    /**
     * 给通道设置标注（标注的位置为初始标注，标注会跟随通道的移动而发生改变，在load方法中直线设置标注位置动态改变）
     * @param text
     * @param font
     * @param color
     * @returns {null|*}
     */
    p.setCommentText = function(texts,x,y, font, color){
        var me=this,
            text_x = 0,text_y= 0,
            cornerPoints=me.getCornerPoints();

        if(!texts||texts.length<0){
            return null;
        }
        
        var referLinePoints=me.getTextReferLine();

        if(!referLinePoints[1]||referLinePoints[1].length<1){
            return;
        }
        if(x&&y){
            text_x = x,text_y= y;
        }else{
            text_x = referLinePoints[1].getX()+20,text_y= referLinePoints[1].getY()-10;
        }
        /*if(me.commentWidget){
            me.container.removeChild(me.commentWidget.container);
        }*/
        
        if(!me.commentWidget){
        	me.commentWidget = new PsdbCanvas.PsdbTextBox(me,text_x,text_y);
        	//距离x轴和y轴的距离只与初始创建的时候一样
        	me.commentWidget.x_distance=text_x-referLinePoints[1].getX();
            me.commentWidget.y_distance=text_y-referLinePoints[1].getY();
        	me.container.addChild(me.commentWidget.container);
        }
        
        //创建文字框
        //me.commentWidget = new PsdbCanvas.PsdbTextBox(me,text_x,text_y);
        me.commentWidget.setValues(texts);
        me.commentWidget.setFont(font);
        me.commentWidget.setColor(color);
        me.commentWidget.setTextAlign("left");
        //设置初始位置与指定基准点之间在x轴和y轴之间的距离
        /*me.commentWidget.x_distance=text_x-referLinePoints[1].getX();
        me.commentWidget.y_distance=text_y-referLinePoints[1].getY();*/
        //设置初始基准点
        me.commentWidget.setReferPoint(referLinePoints[1].getX(),referLinePoints[1].getY());
        //通过参照直线，设置倾斜度
        me.commentWidget.setRotationByReferLine(referLinePoints[0],referLinePoints[2]);

        //me.container.addChild(me.commentWidget.container);
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
                scene.addselectsChild(me);
                me.setSelectedStyle();
                me.isSelected=true;
                scene.updateScene();
            }else if(e.button==2){
                $(scene.currentStage.canvas).unbind();
                $(scene.currentStage.canvas).bind('contextmenu',function(el){
                    el.preventDefault();
                    $('#psdb_LineMenu').menu('show', {
                        left: el.pageX,
                        top: el.pageY
                    });
                    $('#psdb_LineMenu').menu({
                        onClick:function(item){
                            scene.removeChild(me);
                            scene.updateScene();
                        }
                    });

                });
                evt.stopPropagation();
            }
            evt.stopPropagation();
        });


        me.container.addEventListener("pressmove", function (evt) {
            evt.stopPropagation();
        });
        /**
         * 鼠标移入事件
         *  1.当鼠标移入时，显示选中背景
         */
        me.container.addEventListener("mouseover", function (evt) {
            var scene=me.scene;
            me.setSelectedStyle();
            scene.updateScene();
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
                scene.updateScene();
            }
            evt.stopPropagation();
        });
    };

    //添加前缀创，创建父类的构造函数PsdbContainer_constructor
    PsdbCanvas.PsdbChannel = createjs.promote(PsdbChannel, "EventDispatcher");
})();