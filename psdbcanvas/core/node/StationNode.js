/**
 * Created by ww on 2015/8/5.
 */


/**
 * 定义全局命名空间0.
 * @type {{}|*}
 */
// namespace:
this.PsdbCanvas = this.PsdbCanvas||{};

(function(){
    "use strict";


    function StationNode(){
        var me=this;

        me.PsdbNode_constructor();
        /**
         * 设置填充色
         * @type {null}
         */
        me.fillColor=null;
        /**
         *  图片对象
         * @type {Image}
         */
        me.image=null;
        
        /**
         * 厂站属性
         */
        me.station  = {
             stnId  : 493,
             stnName: ""
        };
        me.modified =null;
        
        me.initStationNodeEvent();
        
    }

    //指定类的继承关系
    var p = createjs.extend(StationNode, PsdbCanvas.PsdbNode);
    
    /**
     * 更新station厂站属性
     */
    p.updateStation = function(obj){
    	var me=this,
    	    station=me.station;
    	PsdbCanvas.apply(station,obj);
    };
    
    /**
     * 获取厂站属性
     */
    p.get= function(name){
        return this.station[name];
    };
    /**
     * 设置厂站属性
     */
    p.set = function(name, value){
        var encode = Ext.isPrimitive(value) ? String : Ext.encode;
        if(encode(this.station[name]) == encode(value)) {
            return;
        }        
        this.dirty = true;
        if(!this.modified){
            this.modified = {};
        }
        if(this.modified[name] === undefined){
            this.modified[name] = this.data[name];
        }
        this.station[name] = value;
    },
    /**
     * 获取标注内容
     */
    p.getCommentText = function(){
    	var me=this,
    	    texts=new Array;
		if(me.station){
			//设置标注组件可见
			me.setCommentWidgetVisible(true);
			texts.push("gridId:"+(me.station.gridId?me.station.gridId:""));
			texts.push("manager:"+(me.station.manager?me.station.manager:""));
			texts.push("note1:"+(me.station.note1?me.station.note1:""));
		}
		return texts;
    },
    p.initStationNodeEvent = function(){
        var me=this;
        me.addEventListener('mousedown',function(o){
            var e=o.nativeEvent,
                evt= o.evt,
                scene=o.currentTarget.scene;
            if(e.button==2){
                $(scene.currentStage.canvas).unbind();
                $(scene.currentStage.canvas).bind('contextmenu',function(el){
                    el.preventDefault();
                    $('#psdb_nodeMenu').menu('show', {
                        left: el.pageX,
                        top: el.pageY
                    });
                    $('#psdb_nodeMenu').menu({
                        onClick:function(item){
                        	if(item.id=="psdb_nodeMenu_7"){
                        		me.expendNextStation();
                        	}else if(item.id=="psdb_nodeMenu_4"){
                        		scene.deleteNodes();	
                        	}else if(item.id=="psdb_nodeMenu_8"){
                        		me.setCommentText(me.getCommentText(),"12px Arial","#8BC11A");
                        		scene.updateScene();
                        	}else if(item.id=="psdb_nodeMenu_9"){
                        		//设置标注组件不可见
                        		me.setCommentWidgetVisible(false);
                        		scene.updateScene();
                        	}
                            
                        }
                    });
                });
                evt.stopPropagation();
            }
        });
    };
    
    p.expendNextStation = function(){
    	var me=this,
    	    scene=me.scene;
    	$.ajax({
   	     type: 'POST',
   	     url: basePath+"topo/graph/topo/getAdjacentStation.do" ,
   	     data: {
   	    	 "stnId":me.get("stnId")
   	     },
   	     success: function(data){
   	    	 var lines=data.lines,
   	    	     stations=data.stations;
   	    	 if(stations&&stations.length>0){
   	    		 var x=me.x,y=me.y,z=stations.length*60,
   	    		     b=-(z/2);
   	    		 for(var i=0,len=stations.length;i<len;i++){
   	    			 var n=stations[i];
   	    			 var node=scene.createNode(x+b,y+70,n);
   	    			 if(!node){
   	    				 b=b-60;
   	    				 continue;
   	    			 }
   	    			 for(var l=0,len=lines.length;l<len;l++){
   	    				 var line=lines[l];
   	    				 if(line.stn1Id==n.stnId||line.stn2Id==n.stnId){
   	    					scene.createLine(me,node,line);
   	    				 }
   	    			 }
   	    			 b=b+60;
   	    		 }
   	    	 }
   	     }
   	});
    };

    //添加前缀创，创建父类的构造函数Stage_constructor
    PsdbCanvas.StationNode = createjs.promote(StationNode, "PsdbNode");
})();