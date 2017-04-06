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
         * 场景中的节点或通道是否可编辑
         */
        this.editAble=true;
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
        /**
         * 坐标类型。设置坐标类型是像素坐标还是经纬度坐标。默认是像素坐标.
         * PIXEL:像素坐标
         * LONLAT：经纬度坐标
         */
        this.csysType = 'PIXEL',//LONLAT

        /**
         * 初始化场景
         */
        this.initPsdbBaseScene();

    }

    //指定类的继承关系
    var p = createjs.extend(PsdbBaseScene, PsdbCanvas.PsdbContainer);
    
    PsdbBaseScene._MOUSE_EVENTS = ["beforemousedown","aftermousedown","drawchnnel"];
    
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
        //存储线路断面
        me.sections=new Array();
        
        me.nodeItems= new PsdbCanvas.PsdbContainer();
        me.channelItems= new PsdbCanvas.PsdbContainer();
        me.sectionItems=new PsdbCanvas.PsdbContainer();
        //存放场景中节点和连线
        me.items= new PsdbCanvas.PsdbContainer();
        me.items.addChild(me.channelItems);
        me.items.addChild(me.nodeItems);
        me.items.addChild(me.sectionItems);

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
     * 获取场景编辑状态
     */
    p.getEditAble=function(){
    	return this.editAble;
    };
    /**
     * 设置场景编辑状态
     */
    p.setEditAble=function(editAble){
    	var me=this;
        me.editAble=editAble;
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
     * 设置坐标类型。设置坐标类型是像素坐标还是经纬度坐标。默认是像素坐标.
     * @param type ：PIXEL:像素坐标，LONLAT：经纬度坐标
     */
    p.setCsysType = function(type){
        var me=this;
        me.csysType=type;
    };
    /**
     * 判断是否为经纬度坐标类型
     * @returns {boolean}
     */
    p.isLonlatCsysType=function(){
        var me=this;
        if(me.csysType=="LONLAT"){
            return true;
        }
        return false;
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
                //if(node.getVisible()){
            	me.addSceneChild(node);
                node.initNodeEvent();
            	node.load();	
                //}
                //me.updateScene();
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
            //me.updateScene();
        }

    };
    /**
     * 添加线路断面
     */
    p.addSection = function(section){
    	var me=this;
        if(!section){
            return;
        }
        if(section instanceof PsdbCanvas.PsdbLineSection){
        	section.scene=me;
            me.sections.push(section);
            me.addSceneChild(section);
            section.load();
        }

    };
    p.getSections = function(){
    	return this.sections;
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
            channels=me.channels,
            nodeItems=me.nodeItems,
            channelItems=me.channelItems;
        if(!child){
            return;
        }
        if(child instanceof PsdbCanvas.PsdbNode){
        	me.nodeItems.addChild(child.container);
        }else if(child instanceof PsdbCanvas.PsdbChannel){
        	me.channelItems.addChild(child.container);
        }else if(child instanceof PsdbCanvas.PsdbLineSection){
        	me.sectionItems.addChild(child);
        }
       /* me.items.addChild(child.container);
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
        }*/

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
     * item ：node或者channel
     * unreload ：true表示不重新加载场景中的内容，只刷新场景中元素的属性状态
     *            false：如果item不为空，刷新item以及相连的通道，如果item为空重新加载场景中的所有元素并刷新元素的状态。
     */
    p.updateScene=function(item,unreload){
        var me=this,
            channels=me.channels,
            nodes=me.nodes;
        if(!me.currentStage||!nodes){
            return;
        }
        
        if(unreload){
        	me.currentStage.updateStage();
        	return;
        }
        
        if(item&&item instanceof PsdbCanvas.PsdbNode){
        	var nodeChannels=item.channels;
        	item.refresh();
        	for(var i=0;i<nodeChannels.length;i++){
        		nodeChannels[i].refresh();
        		nodeChannels[i].load();
            }
            me.currentStage.updateStage();
            return;
        }
        if(item&&item instanceof PsdbCanvas.PsdbChannel){
        	item.refresh();
        	item.load();
            me.currentStage.updateStage();
            return;
        }
        
        if(me.isLonlatCsysType()){
            for(var n=0;n<nodes.length;n++){
                nodes[n].refresh();
                // nodes[n].pressMoveHandler=drawLine;
            }
        }
        for(var i=0;i<channels.length;i++){
        	var channel=channels[i];
        	if(channel.getVisible()){
        		
        		/*channel.nodeA.refresh();
        		channel.nodeB.refresh();*/
        		
        		channel.refresh();
            	channel.load();
        	}
        }
        me.currentStage.updateStage();
    };
    /**
     * 移除指定的通道或者节点
     */
    p.removeChild = function(n){
        var me=this,
            channels=me.channels,
            nodes=me.nodes,
            sections=me.sections;
        if(!n){
            return;
        }
        if(n instanceof PsdbCanvas.PsdbNode){
        	PsdbCanvas.removeArrayValue(nodes,n);
        	for(var l= 0;l<channels.length;l++){
                 var line=channels[l];
                 if((line.nodeA&&line.nodeA==n)||(line.nodeB&&line.nodeB==n)){
                	 PsdbCanvas.removeArrayValue(channels,line);
                	 me.items.removeChild(line.container);
                     l--;
                 }
            }
        	me.nodeItems.removeChild(n.container);
        }
        //删除通道
        if(n instanceof PsdbCanvas.PsdbChannel){
        	n.nodeA.removeChannel(n);
        	n.nodeB.removeChannel(n);
        	PsdbCanvas.removeArrayValue(channels,n);
        	
        	me.channelItems.removeChild(n.container);
        }
        //删除断面
        if(n instanceof PsdbCanvas.PsdbChannel){
        	PsdbCanvas.removeArrayValue(sections,n);
        	me.sectionItems.removeChild(n);
        }
        
        //删除节点的同事删除选中集合中的节点
        //PsdbCanvas.removeArrayValue(me.selectsChild,n);
        //me.items.removeChild(n.container);
    };
    /**
     * 移除所有的节点和通道
     */
    p.removeAllChilds = function(){
    	var me=this;
    	//me.items.removeAllChildren();
    	me.nodeItems.removeAllChildren();
        me.channelItems.removeAllChildren();
        me.sectionItems.removeAllChildren();
    	me.channels=new Array();
    	me.nodes=new Array();
    	me.sections=new Array();
    	me.selectsChild=new Array();
    };
    /**
     * 移除所有选中的节点
     */
    p.removeSelectChilds = function(){
    	var me=this,
		    selects=me.getSelectsChild();
		if(!selects||selects.length<1){
			return;
		}
	    for(var i=0,len=selects.length;i<len;i++){
	    	var child=selects[i];
	    	me.removeChild(child);
	    }
	    me.selectsChild=new Array();
    };
    /**
     * 删除选中节点，同时删除与该节点相连的线条
     * @param
     *//*
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
        //me.updateScene();
    };*/

    /**
     * 删除线条
     * @param l
     *//*
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
     * @param n 需要添加的节点
     * @param selectSingle 是否只添加一个，值为true表示只选择一个
     * @existUnselect 存在是否要取消选中
     */
    p.addselectsChild = function(n,selectSingle,existUnselect){
        var me=this,
            selects=me.selectsChild;
        if(selectSingle){
            me.clearSelects(n);
            selects.length=0;
            selects.push(n);
            n.addSelectedStyle();
            n.isSelected=true;	
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
                n.addSelectedStyle();
                n.isSelected=true;
            }else{
            	if(existUnselect){
            		me.clearItemSelect(n);
            	}
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
     * 清除传入节点或通道的选中状态
     */
    p.clearItemSelect = function(n){
    	var me=this;
    	
    	if(n&&n instanceof PsdbCanvas.PsdbNode){
             n.clearSelectedStyle();
             PsdbCanvas.removeArrayValue(me.selectsChild,n);
             n.isSelected=false;
    	}else if(n&&n instanceof PsdbCanvas.PsdbChannel){
            n.clearSelectedStyle();
            PsdbCanvas.removeArrayValue(me.selectsChild,n);
            n.isSelected=false;
    	}
    };
    /**
     * 清除所有选中节点的选中状态
     */
    p.clearAllSelect = function(){
    	var me=this,
    	    selects=me.getSelectsChild();
    	for(var i=0,len=selects.length;i<len;i++){
    		me.clearItemSelect(selects[i]);
    	}
    },
    /**
     * 清除除指定选中项外其它选中项目
     * @param n 指定选中项
     */
    p.clearSelects = function(n){
        var me=this,
            channels=me.channels,
            nodes=me.nodes;
        if(channels&&channels.length>0){
            for(var i=0;i<channels.length;i++){
                var channel=channels[i];
                if(n.id!=channel.id){
//                    channel.isSelected=false;
//                    channel.clearSelectedStyle();
                	me.clearItemSelect(channel);
                }
            }
        }
        if(nodes&&nodes.length>0){
            for(var i=0;i<nodes.length;i++){
                var node=nodes[i];
                if(n.id!=node.id){
                    /*node.isSelected=false;
                    node.selectShape.alpha=0;
                    node.removeAnchorPoint();*/
                	me.clearItemSelect(node);
                }
            }
            //me.selectsChild.length=0;
        }
        me.updateScene(null,true);
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
        if(!me.drawLineModel){
        	return;
        }
        
        me.tempContainer.removeAllChildren();
        if(nodes.length!=2||!me.drawLineModel){
            me.clearLinkNodes();
            me.updateScene(null,true);
            return;
        }
        me.dispatchEvent({type:"drawchnnel",scene:me,nodeA:nodes[0],nodeB:nodes[1]});
       // me.dispatchEvent({type:"drawchnnel",nodeObj:{scene:me,nodeA:nodes[0],nodeB:nodes[1]}});
        /*var channel=new PsdbCanvas.StraightChannel(nodes[0],nodes[1]);
        var line=new PsdbCanvas.PsdbLine(nodes[0],nodes[1]);
        line.setStrokColor("#0b56e0");
        channel.add(line);
        me.addChannel(channel);*/
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
        
        var r=10,x1=node.x*scale,y1=node.y*scale,
            x2=x-me.x,y2=y-me.y,x3=0,y3=0;
        var d=Math.abs(Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2)));
        if(d<r){
        	r=d*0.5;
        }
        if(d!=0){
        	y3=y1+((y2-y1)/d)*(d-r);
            x3=x1+((x2-x1)/d)*(d-r);
        }
        linkShape.graphics.lineTo(x3,y3);
        linkShape.graphics.endStroke();
        me.tempContainer.addChild(linkShape);
    };
    /**
     * 绘制选择区域
     * @param x 选择区域的起始x坐标值
     * @param y 选择区域的起始y坐标值
     * @returns {{x: number, y: number, w: number, h: number}}
     */
    p.drawSelectArea = function(x,y){
        var me=this,
            scale=me.scale,
            md_x=me.md_x,
            md_y=me.md_y,
            w=x-md_x,
            h=y-md_y;
        me.tempContainer.removeAllChildren();
        var selectAreaShape= new PsdbCanvas.PsdbShape(this);
        selectAreaShape.alpha=0.3;
        selectAreaShape.graphics.clear();
        selectAreaShape.graphics.beginFill("#878787");

        selectAreaShape.graphics.drawRect(md_x,md_y,w,h);
        selectAreaShape.graphics.endFill();
        me.tempContainer.addChild(selectAreaShape);
        return {
            x :md_x,
            y :md_y,
            w :w,
            h :h
        };
    };


    p.initSceneEvent = function(){
        var me=this,
            bg=me.backgroundContainer;
        me.addEventListener("mousedown", function (evt) {
            me.dispatchEvent({type:"beforemousedown",evt:evt,nativeEvent:e});
            var e=evt.nativeEvent;
            me.offset = {x:me.x - evt.stageX, y:me.y - evt.stageY};
            me.md_x=evt.stageX-me.x,
            me.md_y=evt.stageY-me.y;
            //定义鼠标右键事件
            if (e.button==0){
            	//鼠标左键的时候清除选中状态
            	if(!evt.target.owerCt||!evt.target.owerCt.isSelected){
                    me.clearSelects(me);
                }
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
                if(e.shiftKey){ //e.shiftKey=true按下shift键盘
           		    me.selectAreaObj=me.drawSelectArea(evt.stageX-me.x,evt.stageY-me.y);
           		    //地图中添加
                    e.stopPropagation();
           	    }else{
           	        //计算当前移动的偏移量
                    me.x =evt.stageX+ me.offset.x;
                    me.y =evt.stageY+ me.offset.y;
                    bg.x=-me.x;
                    bg.y=-me.y;
           	    }
                if(!me.isLonlatCsysType()){
                	 me.updateScene();
                }
            }
            evt.stopPropagation();
        });
        me.addEventListener("pressup", function (evt) {
        	evt.preventDefault();
            var e=evt.nativeEvent;
            //e.shiftKey=true按下shift键盘
            if(e.button==0&&me.selectAreaObj){
            	evt.preventDefault();
                var nodes=me.nodes,
                    w_x=me.selectAreaObj.x+ me.selectAreaObj.w,
                    h_y=me.selectAreaObj.y+ me.selectAreaObj.h;
                if(!me.selectAreaObj){
                    return;
                }
                for(var i= 0,len=nodes.length;i<len;i++){
                    var node=nodes[i],
                        nx=node.x*me.scale,
                        ny=node.y*me.scale;
                    if(nx<w_x&&nx>me.selectAreaObj.x&&
                        ny<h_y&&ny>me.selectAreaObj.y){
                        me.addselectsChild(node);
                        node.addSelectedStyle();
                    }
                }
               // alert(me.selectsChild.length);
                me.selectAreaObj=null;
                me.tempContainer.removeAllChildren();
                me.updateScene();
              //地图中添加
                e.stopPropagation();
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