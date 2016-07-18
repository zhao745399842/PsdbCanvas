/**
 * Created by zw on 2015/8/6.
 */

/**
 * 定义全局命名空间0.
 * @type {{}|*}
 */
// namespace:
this.PsdbCanvas = this.PsdbCanvas||{};

(function(){
    "use strict";

    function StraightLine(nodeA,nodeB,text,dashedPattern){

        this.PsdbLine_constructor(nodeA,nodeB);
        
        this.initStraightLine();
        /**
         * 厂站属性
         */
        this.acline  = {
        	 lineId  : "",
        	 lname: ""
        };
        this.modified =null;
        this.initStraightLineEvent();
    }

    //指定类的继承关系
    var p = createjs.extend(StraightLine, PsdbCanvas.PsdbLine);

    /**
     * 初始化连线
     */
    p.initStraightLine=function(){
        var me=this;
        //连接标记，用于标记当前连线连接的节点
        me.linkFlg=me.nodeA.id+'_'+me.nodeB.id;
    };
    
    /**
     * 更新station厂站属性
     */
    p.updateAcline = function(obj){
    	var me=this,
    	    acline=me.acline;
    	PsdbCanvas.apply(acline,obj);
    };
    
    /**
     * 获取厂站属性
     */
    p.get= function(name){
        return this.acline[name];
    };
    /**
     * 设置厂站属性
     */
    p.set = function(name, value){
        var encode = Ext.isPrimitive(value) ? String : Ext.encode;
        if(encode(this.acline[name]) == encode(value)) {
            return;
        }        
        this.dirty = true;
        if(!this.modified){
            this.modified = {};
        }
        if(this.modified[name] === undefined){
            this.modified[name] = this.data[name];
        }
        this.acline[name] = value;
    },

    /**
     * 获取当前所画线条的实际路径，由四个点确定
     * 第一个点表示开始坐标，第二个点表示开始拐点处坐标，
     * 第三个点表示结束拐点处的坐标，第四个点表示结束坐标
     * @returns {Array}
     *   返回一个包含四个路径点的数组。
     */
    p.getLinePath = function(){
        var me=this,
            nodeB=me.nodeB,
            nodeA=me.nodeA,
            path=new Array();
        //A、B连线相对于X轴的弧度值
        var radian = Math.atan2(nodeA.y - nodeB.y, nodeA.x - nodeB.x),
            //A侧不弯曲状态下拐点坐标
            breakPoint_A = {x: nodeA.x + this.bundleOffset * Math.cos(radian - Math.PI), y: nodeA.y + this.bundleOffset * Math.sin(radian - Math.PI)},
            //B侧不弯曲状态下拐点坐标
            breakPoint_B = {x: nodeB.x + this.bundleOffset * Math.cos(radian), y: nodeB.y +this.bundleOffset * Math.sin(radian)},

            i = radian - Math.PI / 2,
            j = radian - Math.PI / 2,
            //k = d * this.bundleGap / 2 - this.bundleGap / 2,
            l = this.bundleGap * (me.lineIndex);//this.nodeIndex,
            //依据线条的个数，以及线条之间的间距，实际确定拐点的坐标
        var reality_breakPoint_B = {x: breakPoint_B.x + l * Math.cos(i), y: breakPoint_B.y + l * Math.sin(i)},
            reality_breakPoint_A = {x: breakPoint_A.x + l * Math.cos(j), y: breakPoint_A.y + l * Math.sin(j)};

        path.push({x:nodeA.x,y:nodeA.y});// 开始坐标
        path.push(reality_breakPoint_A);//开始拐点坐标

        if(me.anchorPointContainer.getCount()>0){
            var points=me.anchorPointContainer.getChilds();
            for(var i= 0,len=points.length;i<len;i++ ){
                path.push({x:points[i].anchaX,y:points[i].anchaY});//开始拐点坐标
            }

        }

        path.push(reality_breakPoint_B);//结束拐点坐标
        path.push({x:nodeB.x,y:nodeB.y});//结束坐标

        return path;
    };
    p.getPointIndex=function(x,y){
        var me=this,
            linePath=me.linePath,
            datumMark=null,
            result=0;//基准点

        var getPointCoord=function(x,y,pointA,pointC){
            var radianAC=(pointC.y-pointA.y)/(pointC.x-pointA.x),
                radianAD=(y-pointA.y)/(x-pointA.x),
                lenAD=(y-pointA.y)/Math.sin(radianAD),
                lenAB=lenAD*Math.cos(radianAD-radianAC);

            var coordX=pointA.x+(lenAB*Math.cos(radianAC)),
                coordY=pointA.y+(lenAB*Math.sin(radianAC));

            return {x:coordX,y:coordY};
        };
        if(me.anchorPointContainer.getCount()>0){
            var points=me.anchorPointContainer.getChilds(),
                ps=new Array();
            ps.push({anchaX:linePath[1].x,anchaY:linePath[1].y});
            for(var p= 0,len=points.length;p<len;p++ ){
                ps.push(points[p]);
            }
            ps.push({anchaX:linePath[linePath.length-2].x,anchaY:linePath[linePath.length-2].y});

            for(var i= 0,len=ps.length-1;i<len;i++ ){
                var pointA={x:ps[i].anchaX,y:ps[i].anchaY},
                    pointC={x:ps[i+1].anchaX,y:ps[i+1].anchaY},
                    pointB={x:x,y:y};
                    //pointB=getPointCoord(x,y,pointA,pointC);
                var r1=(pointB.y-pointA.y)/(pointB.x-pointA.x),
                    r2=(pointC.y-pointA.y)/(pointC.x-pointA.x);
                if(Math.abs(Math.abs(r1)-Math.abs(r2))<0.2){
                    if(pointC.x>pointA.x){
                       if((pointB.x<=pointA.x)||(pointB.x>=pointC.x)){
                           continue;
                       }
                    }else{
                        if((pointB.x>=pointA.x)||(pointB.x<=pointC.x)){
                            continue;
                        }
                    }

                    if(pointC.y>pointA.y){
                        if((pointB.y<=pointA.y)||(pointB.y>=pointC.y)){
                            continue;
                        }
                    }else{
                        if((pointB.y>=pointA.y)||(pointB.y<=pointC.y)){
                            continue;
                        }
                    }
                    datumMark=ps[i+1];
                    break;
                }
            }

        }


        /*for(var i= 1,len=linePath.length-2;i<len;i++){
           var pointA=linePath[i],
               pointC=linePath[i+1],
               pointB=getPointCoord(x,y,pointA,pointC);

           var r1=(pointB.y-pointA.y)/(pointB.x-pointA.x),
               r2=(pointC.y-pointA.y)/(pointC.x-pointA.x);
           if((Math.abs(r1)-Math.abs(r2))<0.1){
               datumMark=pointC;
               break;
           }
        }*/
        //如何基准点存在
        if(datumMark){
            result=me.anchorPointContainer.getChildIndex(datumMark);
            if(!result){
                result=me.anchorPointContainer.getCount();
            }
        }
        return result;
    };


    p.addAnchorPoint=function(x,y){
        var me=this,
            scene=me.scene;
        if(!me.editable){
            return;
        }
        var anchorPoint=new PsdbCanvas.LineAnchorPoint(x,y,me);
        anchorPoint.load();
        var pointIndex=me.getPointIndex(x,y);
        me.anchorPointContainer.addChild(anchorPoint);
        me.anchorPointContainer.setChildIndex(anchorPoint,pointIndex);

        scene.updateScene();
    };

    p.initStraightLineEvent=function(){
        var me=this;
        me.container.addEventListener("dblclick", function (evt) {
            var scene=me.scene,
                scale=scene.scale;
            if(me.editable){
                me.addAnchorPoint((evt.stageX-scene.x)/scale,(evt.stageY-scene.y)/scale);
            }
        });
    };


    //添加前缀创，创建父类的构造函数Stage_constructor
    PsdbCanvas.StraightLine = createjs.promote(StraightLine, "PsdbLine");
})();
