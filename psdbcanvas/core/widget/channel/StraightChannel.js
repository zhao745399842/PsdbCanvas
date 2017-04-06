/**
 * Created by ww on 2015/10/14.
 */

/**
 * 定义全局命名空间0.
 * @type {{}|*}
 */
// namespace:
this.PsdbCanvas = this.PsdbCanvas||{};

(function(){
    "use strict";

    function StraightChannel(nodeA,nodeB,id){

        this.PsdbChannel_constructor(nodeA,nodeB,id);


        this.initStraightChannel();
        this.initStraightChannelEvent();
        /**
         * 通道id
         */
        this.pid="";

    }

    //指定类的继承关p系
    var p = createjs.extend(StraightChannel, PsdbCanvas.PsdbChannel);
    StraightChannel._MOUSE_EVENTS = ["mousedown","mouseout","mouseover","pressmove","pressup","anchorchange"];
    /**
     * 初始化通道
     */
    p.initStraightChannel=function(){
        var me=this;
        /**
         * 存放线条上的描点对象
         * @type {PsdbCanvas.PsdbContainer}
         */
        me.anchorPointContainer =new PsdbCanvas.PsdbContainer();

        me.container.addChild(me.anchorPointContainer);
    };
    /**
     *
     */
    p.refresh = function(){
        var me=this,
            scene=me.scene;
        if(scene&&scene.isLonlatCsysType()){
            if(me.anchorPointContainer.getCount()>0) {
                var points = me.anchorPointContainer.getChilds();
                for(var i= 0,len=points.length;i<len;i++){
                    points[i].refresh();
                }
            }
        }
    };
    /***
     * 添加拐点处的描点
     * @param x
     * @param y
     */
    p.addAnchorPoint=function(x,y,index){
        var me=this,
            scene=me.scene,
            scale=scene.scale;
        if(!me.editable){
            return;
        }
        var anchorPoint=new PsdbCanvas.LineAnchorPoint(x,y,me);
        anchorPoint.load();
        var pointIndex=null;
        if(index){
        	pointIndex=index;
        }else{
        	pointIndex=me.getPointIndex(x,y);	
        }
    	//pointIndex=me.getPointIndex(x,y);
        me.anchorPointContainer.addChild(anchorPoint);
        me.anchorPointContainer.setChildIndex(anchorPoint,pointIndex);
        /*if(!unUpdate){
        	scene.updateScene(me);
        }*/
    };
    /**
     * 获取描点的数组
     * @returns {Array}
     */
    p.getAnchorPoints=function(){
        var me=this,
            points=new Array();
        points=me.anchorPointContainer.getChilds();
        //添加进去的点顺序会被重设所有出来应该反转
        return points;
    };
    p.getPointIndex=function(x,y){
        var me=this,
            datumMark=null,
            result=0;//基准点
        ////鼠标双击的点（x,y）到直线AC的垂足坐标
        var getPointCoord=function(x,y,pointA,pointC){
            //使用直线的斜截式y=kx+b; 推导出垂足的坐标
            var k, b,k2,b2,x2,y2,acy,acx;
            //pointA.y=k*pointA.x+b;
            //pointC.y=k*pointC.x+b;
            //y=(-1/k)*x+b;
            acy=pointC.y-pointA.y;
            acx=pointC.x-pointA.x;

            //小于0.0001近似认为直线AC与x轴垂直
            if(Math.abs(acx)<=0.0001){
                return {x:pointC.x,y:y};
            }
            //小于0.0001近似认为直线AC与y轴垂直
            if(Math.abs(acy)<=0.0001){
                return {x:x,y:pointC.y};
            }
            //k=(pointC.y-pointA.y)/(pointC.x-pointA.x);
            k=acy/acx;
            b=pointA.y-(k*pointA.x);
            k2=-1/k;
            b2=y-(k2*x);
            /* y2=k*x2+b;
             y2=k2*x2+b2;
             k*x2-k2*x2+b-b2=0;
             k*x2-k2*x2=b2-b;*/
            x2=(b2-b)/(k-k2);
            y2=k*x2+b;
            return {x:x2,y:y2};
        };

        if(me.anchorPointContainer.getCount()>0){
            var points=me.anchorPointContainer.getChilds(),
                ps=new Array();

            ps.push({anchaX:me.nodeA.x,anchaY:me.nodeA.y});

            for(var p= 0,len=points.length;p<len;p++ ){
                ps.push(points[p]);
            }

            ps.push({anchaX:me.nodeB.x,anchaY:me.nodeB.y});

            for(var i= 0,len=ps.length-1;i<len;i++ ){
                var pointA={x:ps[i].anchaX,y:ps[i].anchaY},
                    pointC={x:ps[i+1].anchaX,y:ps[i+1].anchaY},
                //鼠标双击的点（x,y）到直线AC的垂足坐标
                    pointB=getPointCoord(x,y,pointA,pointC);
                //鼠标双击点到直线AC的距离
                var d=Math.sqrt(Math.pow((x-pointB.x),2)+Math.pow((y-pointB.y),2));

                if(d<=me.selectShapeWidth/2){

                    if(pointB.x>pointA.x&&pointB.x>pointC.x){
                        continue;
                    }

                    if(pointB.x<pointA.x&&pointB.x<pointC.x){
                        continue;
                    }

                    if(pointB.y>pointA.y&&pointB.y>pointC.y){
                        continue;
                    }

                    if(pointB.y<pointA.y&&pointB.y<pointC.y){
                        continue;
                    }
                    datumMark=ps[i+1];
                    //break;
                }

            }

        }
        //如果基准点存在
        if(datumMark){
            result=me.anchorPointContainer.getChildIndex(datumMark);
        }
        return result;
    };
    /**
     * 实现父类中的getCornerPoints接口，获取通道的拐点坐标
     * @returns {Array} 返回坐标数组
     */
    p.getCornerPoints = function(){
        var me=this,
            anchors=me.getAnchorPoints(),
            points=new Array();
        if(anchors&&anchors.length>0){

            for(var i= 0,len=anchors.length;i<len;i++ ){
                points.push({x:anchors[i].anchaX,y:anchors[i].anchaY});//开始拐点坐标
            }
        }
        //拐点在设置的时候是按照反序加进来的，所有获取的时候需要反转
        return points;
    };
    /**
     * 给通道添加一组拐点，可以是一个也可以是多个拐点
     * 需要子类实现此方法
     * @param points  数组 存储PsdbPoint对象的数组
     */
    p.setCornerPoints = function(points){
        var me=this;
        if(!points||points.length<1){
            return;
        }
        for(var i= 0,len=points.length;i<len;i++){
            var point=points[i];

            if(point&&point instanceof PsdbCanvas.PsdbPoint){
                me.addAnchorPoint(point.getX(),point.getY(),i);
            }
        }
        me.clearSelectedStyle();
    };
    /**
     * 给通道添加一组拐点，可以是一个也可以是多个拐点
     *
     * @param points  数组 存储PsdbPoint对象的数组.存储的是经纬度
     */
    p.setLonLatCornerPoints = function(points){
        var me=this,
            scene=me.scene,
            newPoints=new Array();
        if(!points||points.length<1){
            return;
        }
        if(scene&&scene.isLonlatCsysType()){
            for(var i= 0,len=points.length;i<len;i++){
                var point=points[i];
                newPoints.push(PsdbCanvas.lonLatToPixel(point.x,point.y));
            }
            me.setCornerPoints(newPoints);
        }else{
            me.setCornerPoints(points);
        }

    };
    /**
     * 设置通道选中样式，重写了父类中的方法
     */
    p.addSelectedStyle=function(){
        var me=this;
        me.selectShape.alpha=0.5;
        if(me.editable&&me.anchorPointContainer){
            var points=me.anchorPointContainer.getChilds();
            for(var i= 0,len=points.length;i<len;i++){
                points[i].anchorShape.alpha=0.5;
            }
        }
    };
    /**
     * 清除通道选中样式，重写了父类中的方法
     */
    p.clearSelectedStyle=function(){
        var me=this;
        if(me.selectShape){
        	me.selectShape.alpha=me.defaultSelectShapeAlpha;
        }
        if(me.editable&&me.anchorPointContainer){
            var points=me.anchorPointContainer.getChilds();
            for(var i= 0,len=points.length;i<len;i++){
                points[i].anchorShape.alpha=0;
            }
        }
    };
  
    /**
     * 初始化事件
     * @param stage  舞台对象
     */
    p.initStraightChannelEvent=function() {
        var me = this;
        me.container.addEventListener("dblclick", function (evt) {
            var scene=me.scene,
                scale=scene.scale;
            if(scene.getEditAble()&&me.editable){
                me.addAnchorPoint((evt.stageX-scene.x)/scale,(evt.stageY-scene.y)/scale);
                scene.updateScene(me);
                me.dispatchEvent({type:"anchorchange",evt:evt});
            }
            me.dispatchEvent({type:"afterdblclick",evt:evt});
            //超图中添加
            evt.nativeEvent.stopPropagation();
        });
       /* me.addEventListener("anchorchange", function (evt) {
            var scene=me.scene;
            alert("dd");
        });*/
    };

    //添加前缀创，创建父类的构造函数PsdbChannel_constructor
    PsdbCanvas.StraightChannel= createjs.promote(StraightChannel, "PsdbChannel");
})();

