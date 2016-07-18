/**
 * Created by zw on 2015/8/5.
 * 定义一个容器类继承自createjs.PsdbContainer
 *  是一个基本场景
 * 需要后续扩展
 */


// namespace:
this.PsdbCanvas = this.PsdbCanvas||{};

(function(){
    "use strict";

    /**
     * 定义一个容器类继承自createjs.Container
     * @constructor
     */
    function PsdbBaseScene(stage){
        /**
         * 父类createjs.Container 的构造函数
         */
        this.PsdbContainer_constructor();
        /**
         * 存储当前舞台对象
         */
        this.currentStage=stage;

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
         * 节点是否可编辑（是否显示编辑描点）
         * @type {boolean}
         */
        this.nodeEdit=true;
        /**
         * 当前是否为画线模式，true表示是
         * @type {boolean}
         */
        this.drawLineModel=false;
        /**
         * 单选和多选，值为true表示表示单选模式，值为false表示未多选模式
         * @type {boolean}
         */
        this.selectSingle=true;

        /**
         * 初始化场景
         */
        this.initPsdbBaseScene();

    }

    //指定类的继承关系
    var p = createjs.extend(PsdbBaseScene, PsdbCanvas.PsdbContainer);
    /**
     * 初始化场景
     */
    p.initPsdbBaseScene= function(){
        var me=this;
        //存储当前容器中存放的线条
        //me.lines=new Array();
        //联线通道
        me.channels=new Array();
        //存储当前容器中存放的节点
        me.nodes=new Array();
        //存放场景中节点和连线
        me.items= new PsdbCanvas.PsdbContainer();
        //存放临时对象，例如手动绘制节点连线时的动态路径线
        me.tempContainer=new PsdbCanvas.PsdbContainer();
        //存放背景
        me.backgroundContainer= new PsdbCanvas.PsdbContainer();
        //存放选中的节点和连线
        me.selectsChild=new Array();
        //存放手动绘制节点连线时，需要连接的两个节点，绘制完成后，清空
        me.linkNodes=new Array();
        //初始化舞台背景
        me.initBackground();

        me.addChild(me.backgroundContainer);
        me.addChild(me.items);
        me.addChild(me.tempContainer);
        //初始化场景事件系统
        me.initSceneEvent();
    };

    /**
     * 初始化场景背景
     */
    p.initBackground =function(){
        var me=this;
        if(!me.useBackground){
            return;
        }
        me.setBackgroundColor(me.backgroundColor);
        me.backgroundContainer.addChild(me.bg);
    };
    /**
     * 设置当前模式是否为画线模式
     * @param b true或false
     */
    p.setDrawLineModel = function(b){
        this.drawLineModel=b;
    };
    /**
     * 设置背景色
     * @param color
     */
    p.setBackgroundColor = function(color){
        var me=this;
        me.backgroundColor=color;
        me.drawBackground(me.currentStage.canvas.width,me.currentStage.canvas.height);

    };
    /**
     * 设置背景图图片（后续完善）
     * @param url
     */
    p.setBackgroundImage = function(url){
        var me=this;
        if (null == url){
            throw new Error("Node.setImage(): 参数Image对象为空!");
        }
        var image=new Image();
        image.src=url;
        image.onload=function(){
            me.image=image;
        };
    };
    /**
     * 绘制背景使用颜色绘制背景
     */
    p.drawBackground= function(width,height){
        var me=this;
        if(!me.bg){
            me.bg=new createjs.Shape();
        }
        me.bg.graphics.clear();
        me.bg.graphics.beginFill(me.backgroundColor);
        me.bg.graphics.drawRect(0,0,width,height);
        me.bg.graphics.endFill();
    };
    /**
     * 设置场景大小
     * @param width
     * @param height
     */
    p.setSize = function(width,height){
        var me=this;
        me.drawBackground(width,height);
        me.currentStage.updateStage();
    };
    /**
     * 将节点加入到场景中，并且绘制节点
     * @param node
     */
    p.addNode=function(node){
        var me=this;

        if(node&&node.container){
            var addNodeToScenn=function(){
                node.scene=me;
                node.editable=me.nodeEdit;
                me.nodes.push(node);
                me.addSceneChild(node);
                node.initNodeEvent();
                node.load();
                me.updateScene();
            };
            //判断当前节点是否接收的图片
            if(node.showImage){
                var update=true;
                createjs.Ticker.addEventListener("tick", function(event){
                    if(update&&node.image){
                        addNodeToScenn();
                        update=false;
                    }
                });
            }else{
                addNodeToScenn();
            }
        }
    };
    
    p.getNodes = function(){
    	return this.nodes;
    };

    /**
     * 添加通道
     * @param g
     */
    p.addChannel =function(channel){
        var me=this;
        if(!channel){
            return;
        }
        if(channel instanceof PsdbCanvas.PsdbChannel){
            channel.scene=me;
            //line.initLineEvent();
            me.channels.push(channel);
            me.addSceneChild(channel);
            //me.setLineIndex(line);
            me.updateScene();
        }

    };
    /**
     * 获取场景中所有通道
     */
    p.getChannels = function(){
    	var me=this;
    	return me.channels;
    };
    /**
     * 根据通道id查找通道
     */
    p.getChannelById = function(id){
    	var me=this,
    	    channels=me.channels,
    	    result=null;
    	
    	if(channels&&channels.length>0){
        	for(var i=0,len=channels.length;i<len;i++){
        		var channel=channels[i];
        		if(channel.id==id){
        			result=channel;
        			break;
        		}
        	}
        }
    	return result;
    };
    /**
     * 给场景中添加子项目
     * @param child
     */
    p.addSceneChild=function(child){
        var me=this,
            nodes=me.nodes,
            channels=me.channels;
        if(!child||!child.container){
            return;
        }
        me.items.addChild(child.container);
        var index=0;
        if(channels){
            //设置线条的存放位置
            for(var n= 0,len=channels.length;n<len;n++){
                me.items.setChildIndex(channels[n].container,index);
                index++;
            }
        }
        if(nodes){
            for(var i= 0,len=nodes.length;i<len;i++){
                me.items.setChildIndex(nodes[i].container,index);
                index++;
            }
        }

    };

    /**
     * 设置缩放比例
     * @param v
     */
    p.setScale=function(v){
        var me=this;
        if(v&&v>0){
            me.scale=v;
            me.items.scaleX=v;
            me.items.scaleY=v;
            me.updateScene();
        }
    };
    p.getScale= function(){
    	return this.scale;
    };
    /**
     * 更新场景
     */
    p.updateScene=function(){
        var me=this,
            channels=me.channels,
            nodes=me.nodes;
        if(!me.currentStage||!nodes){
            return;
        }
        var drawLine=function(thiz,evt){
            if(!channels){
                return;
            }
            for(var i=0;i<channels.length;i++){
                channels[i].load();
            }
        };

        for(var i=0;i<channels.length;i++){
            channels[i].load();
        }
        for(var n=0;n<nodes.length;n++){
            nodes[n].pressMoveHandler=drawLine;
        }
        me.currentStage.updateStage();
    };
    p.removeChild = function(n){
        var me=this,
            channels=me.channels,
            nodes=me.nodes;
        if(!n){
            return;
        }
        var removeByValue=function(arr, val) {
            for(var i=0; i<arr.length; i++) {
                if(arr[i] == val) {
                    arr.splice(i, 1);
                    break;
                }
            }
        };
        if(n instanceof PsdbCanvas.PsdbNode){
            removeByValue(nodes,n);
        }
        if(n instanceof PsdbCanvas.PsdbChannel){
            removeByValue(channels,n);
        }
        me.items.removeChild(n.container);
    };
    /**
     * 移除所有的节点和通道
     */
    p.removeAllChild = function(){
    	var me=this;
    	me.items.removeAllChildren();
    	me.channels=new Array();
    	me.nodes=new Array();
    	me.updateScene();
    };
    /**
     * 删除选中节点，同时删除与该节点相连的线条
     * @param
     */
    p.deleteNodes = function(){
        var me=this,
            channels=me.channels,
            nodes=me.nodes,
            selects=me.getSelectsChild();
        if(!selects||selects.length<1){
            return;
        }
        for(var i= 0 ;i<selects.length;i++){
            var n=selects[i];
            for(var l= 0;l<channels.length;l++){
                var line=channels[l];
                if((line.nodeA&&line.nodeA==n)||(line.nodeB&&line.nodeB==n)){
                    channels.splice(l, 1);
                    me.items.removeChild(line.container);
                    l--;
                }
            }
            selects.splice(i, 1);
            PsdbCanvas.removeArrayValue(nodes,n);
            me.items.removeChild(n.container);
            i--;
        }
        me.updateScene();
    };

    /**
     * 删除线条
     * @param l
     */
    p.deleteLine = function(l){
        var me=this;
        if(!l){
            return;
        }
        me.items.removeChild(l.container);
        me.updateScene();
    };

    /**
     * 将选中的节点或连线添加到selectsChild中
     * @param n
     */
    p.addselectsChild = function(n){
        var me=this,
            selects=me.selectsChild;
        if(me.selectSingle){
            me.clearSelects(n);
            selects.length=0;
            selects.push(n);
        }else{
            var flg=true;
            for(var i= 0,len=selects.length;i<len;i++){
                if(n.id===selects[i].id){
                    flg=false;
                    break;
                }
            }
            if(flg){
                selects.push(n);
            }
        }
    };

    /**
     * 获取选中的节点或线路
     * @returns {Array|*}
     */
    p.getSelectsChild = function(){
        return this.selectsChild;
    };
    /**
     * 清除选中项目
     * @param n
     */
    p.clearSelects = function(n){
        var me=this,
            channels=me.channels,
            nodes=me.nodes;
        if(channels&&channels.length>0){
            for(var i=0;i<channels.length;i++){
                var channel=channels[i];
                if(n.id!=channel.id){
                    channel.isSelected=false;
                    channel.clearSelectedStyle();
                }
            }
        }
        if(nodes&&nodes.length>0){
            for(var i=0;i<nodes.length;i++){
                var node=nodes[i];
                if(n.id!=node.id){
                    node.isSelected=false;
                    node.selectShape.alpha=0;
                    node.removeAnchorPoint();
                }
            }
        }
        me.updateScene();
    };
    p.pushLinkNodes = function(node){
        var me=this,
            flg=true,
            nodes=me.linkNodes;
        if(!me.drawLineModel){
            return;
        }
        for(var i= 0,len=nodes.length;i<len;i++){
            if(node.id===nodes[i].id){
                flg=false;
                break;
            }
        }
        if(flg){
            nodes.push(node);
        }
    };
    p.popLinkNodes= function(){
        var me=this;
        if(!me.drawLineModel){
            return;
        }
        this.linkNodes.pop();
    };
    p.clearLinkNodes= function(){
        var me=this,
            nodes=me.linkNodes;

        for(var i= 0,len=nodes.length;i<len;i++){
            nodes.pop();
        }
    };

    p.createNodeslink = function(){
        var me=this,
            nodes=me.linkNodes;
        me.tempContainer.removeAllChildren();
        if(nodes.length!=2||!me.drawLineModel){
            me.clearLinkNodes();
            me.updateScene();
            return;
        }
        var channel=new PsdbCanvas.StraightChannel(nodes[0],nodes[1]);
        var line=new PsdbCanvas.PsdbLine(nodes[0],nodes[1]);
        line.setStrokColor("#0b56e0");

        channel.add(line);
        me.addChannel(channel);
        me.clearLinkNodes();

    };
    /**
     * 绘制节点连线
     */
    p.drawNodeLine = function(node,x,y){
        var me=this;
        if(!me.drawLineModel){
			node.stopemove=false;
            return;
        }
        me.pushLinkNodes(node);
        node.stopemove=true;
        me.tempContainer.removeAllChildren();
        me.drawNodePathLine(node,x,y);
        //node.stopemove=false;
        me.updateScene();
    };
    /**
     * 鼠标右键绘制节点连线时的临时路径线
     * @param node 节点
     * @param x  鼠标移动的相对x坐标
     * @param y  鼠标移动的相对y坐标
     */
    p.drawNodePathLine = function(node,x,y){
        var me=this,
            scale=me.scale;
        var linkShape= new PsdbCanvas.PsdbShape(this);
        linkShape.graphics.clear();
        linkShape.graphics.beginStroke("#878787");
        linkShape.graphics.moveTo(node.x*scale,node.y*scale);
        linkShape.graphics.lineTo((x*scale-me.x),(y*scale-me.y));
        linkShape.graphics.endStroke();
        me.tempContainer.addChild(linkShape);
    };


    p.initSceneEvent = function(){
        var me=this,
            scale=me.scale,
            bg=me.backgroundContainer;
        me.addEventListener("mousedown", function (evt) {
            me.dispatchEvent({type:"beforemousedown",evt:evt,nativeEvent:e});
            //定义鼠标右键事件
            var e=evt.nativeEvent;
            var o = me;
            o.offset = {x: o.x - evt.stageX * scale, y: o.y - evt.stageY * scale};
            if(!evt.target.owerCt||!evt.target.owerCt.isSelected){
                me.clearSelects(me);
            }
            me.dispatchEvent({type:"aftermousedown",evt:evt,nativeEvent:e});
            evt.stopPropagation();
        });
        /**
         * 鼠标按下移动事件
         *  1.移动当前节点
         */
        me.addEventListener("pressmove", function (evt) {
            var e=evt.nativeEvent;
            if (e.button==0){
                var o = me;
                //计算当前移动的偏移量
                o.x = (evt.stageX*scale+ o.offset.x);
                o.y = (evt.stageY*scale + o.offset.y);
                bg.x=-o.x;
                bg.y=-o.y;
                me.updateScene();
            }
            evt.stopPropagation();
        });
        me.addEventListener("mouseup", function (evt) {
            //定义鼠标右键事件
            var e=evt.nativeEvent;
            if (e.button==0) {
               // me.cursor="default";
            }
            evt.stopPropagation();
        });
    };
    //添加前缀创，创建父类的构造函数Container_constructor
    PsdbCanvas.PsdbBaseScene = createjs.promote(PsdbBaseScene, "PsdbContainer");
})();