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
        this.selectSingle=true;
        
        this.initPsdbSceneEvents();
    }

    //指定类的继承关系
    var p = createjs.extend(PsdbScene, PsdbCanvas.PsdbBaseScene);

    p.createNode = function(x,y,n){
        var me=this,
            nodes=me.nodes,
            createflg=true,
            result=null;
        if(!n){
        	return result;
        }
        for(var i=0,len=nodes.length;i<len;i++){
        	var nod=nodes[i];
        	if(nod.get("stnId")==n.stnId){
        		createflg=false;
        		result=nod;
        		break;
        	}
        }
        if(!createflg){
        	return result;
        }
        //1:火电厂,2:垃圾电厂,3:生物质能电厂,4:燃气电厂,5:核电厂,6:水电站
        //7:蓄能电站,8:风电场,9:变电站,10:开关站,11:换流站,12:串补站,15:T接站	,16:太阳能
        //17:牵引站
        var type=n.typeId;
        if(type=='8'){//风电
        	result=new PsdbCanvas.WindSubStationNode();
            //result.fillColor="#9400D3";
           
        }else if(type=='9'){//变电站
        	result=new PsdbCanvas.TransformerSubstationNode();
            //result.fillColor="#B3EE3A";
            result.circleNum=3;
        }else if(type=='11'){//换流站
        	result=new PsdbCanvas.ConvertorSubstationNode();
            //result.fillColor="#6959CD";
        }else{//发电站
        	result=new PsdbCanvas.PowerPlantSubstationNode();
            //result.fillColor="#ff0000";
        }
        result.updateStation(n);
        result.setLocation(x,y);
        result.setSize(20,20);
        if(result.get("stnName")){
        	result.setNameText(n.stnName, "20px Arial", "#000000");
        }
        me.addNode(result);
        return result;
    };
    p.createLine = function(nodeA,nodeB,l){
        var me=this,
            lines=me.lines,
            result=null,
            createflg=true,
            channels=me.channels;
        
        var addLineToChannel=function(channel,l){
        	var line=null;
        	if(l.lineType&&l.lineType=='DC'){
        		line=new PsdbCanvas.DcLine();
        	}else{
        		line=new PsdbCanvas.AcLine();
        	}
        	
        	line.updateline(l);
            channel.add(line);
            return line;
        };
        var pathId=l.pathId;
        var channel=me.getChannelById(pathId);
        if(!channel){
        	//var channel=new PsdbCanvas.FoldChannel(nodeA,nodeB);
        	channel=new PsdbCanvas.StraightChannel(nodeA,nodeB,pathId);
        	
        	result=addLineToChannel(channel,l);
        	me.addChannel(channel);
        }else{
        	for(var i=0,len=channel.lines.length;i<len;i++){
            	var lin=channel.lines[i];
            	if(lin.get("lineId")==l.lineId){
            		createflg=false;
            		result=lin;
            		break;
            	}
            }
            if(createflg){
            	result=addLineToChannel(channel,l);
                me.updateScene();
            }
        }
        return result;
    };
    
    p.showLineCommentText=function(){
    	var me=this,
    	    channels=me.getChannels();
    	if(!channels||channels.length<1){
    		return;
    	}
    	for(var i=0,len=channels.length;i<len;i++){
    		var channel=channels[i],
    		    lines=channel.getLines(),
    		    texts=new Array();
    		for(var l=0,llen=lines.length;l<llen;l++){
    			var line=lines[l],lineObje=line.lineObje;
    			texts.push(lineObje.lname+"　"+lineObje.lineId);
    		}
    		channel.setCommentText(texts,null,null,"12px Arial", "#EA81E0");
    		channel.setCommentWidgetVisible(true);
    	}
    	
    	//me.updateScene();
    };
    p.hiddenLineCommentText=function(){
    	var me=this,
    	    channels=me.getChannels();
		if(!channels||channels.length<1){
			return
		}
		for(var i=0,len=channels.length;i<len;i++){
			var channel=channels[i];
			channel.setCommentWidgetVisible(false);
		}
    };
    
    /**
     * 对站点进行标注
     */
    p.showCommentText = function(){
    	var me=this,
    	    nodes=me.getNodes();
    	if(!nodes||nodes.length<1){
    		return;
    	}
    	for(var i=0,len=nodes.length;i<len;i++){
    		var node=nodes[i];
    		node.setCommentText(node.getCommentText(),"12px Arial","#8BC11A");
    		node.setCommentWidgetVisible(true);
    	}
    	me.showLineCommentText();
    };
    /**
     * 隐藏标注
     */
    p.hiddenCommentText = function(){
    	var me=this,
		    nodes=me.getNodes();
		if(!nodes||nodes.length<1){
			return
		}
		for(var i=0,len=nodes.length;i<len;i++){
			var node=nodes[i];
			node.setCommentWidgetVisible(false);
		}
		me.hiddenLineCommentText(false);
    };
    p.initPsdbSceneEvents = function(){
        var me=this;
        me.addEventListener("aftermousedown", function (o) {
            var e=o.nativeEvent,
                scale=me.scale,
                evt= o.evt;
            if(e.button==2){
                $(me.currentStage.canvas).unbind();
                $(me.currentStage.canvas).bind('contextmenu',function(el){
                    el.preventDefault();
                    $('#psdb_sceneMenu').menu('show', {
                        left: el.pageX,
                        top: el.pageY
                    });
                    $('#psdb_sceneMenu').menu({
                        onClick:function(item){
                            me.createNode((evt.stageX-me.x)/scale,(evt.stageY-me.y)/scale);
                            if(item.id=="scene_label_01"){
                            	me.showCommentText();
                            	me.updateScene();
                            }else if(item.id=="scene_unlabel_01"){
                            	me.hiddenCommentText();
                            	me.updateScene();
                            }
                        }
                    });
                });
            }

        });
    };
    
    //添加前缀创，创建父类的构造函数Container_constructor
    PsdbCanvas.PsdbScene = createjs.promote(PsdbScene, "PsdbBaseScene");
})();