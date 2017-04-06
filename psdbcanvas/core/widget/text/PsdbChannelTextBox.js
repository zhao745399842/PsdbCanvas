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
    function PsdbChannelTextBox(parent,referLinePoints,d_distance,l_distance){
        /**
         * 父类createjs.Container 的构造函数
         */
        this.PsdbTextBox_constructor(parent,referLinePoints[1].getX(),referLinePoints[1].getY());
        /**
         * x轴方向文字组件距离基准点（referPoint）在x轴方向的距离
         * @type {number}
         */
        this.x_distance=0;
        /**
         * y轴方向文字组件距离基准点（referPoint）在y轴方向的距离
         * @type {number}
         */
        this.y_distance=0;

        /**
         * 文本组件与基准点连线在x轴方向的夹角
         */
        this.angle_distance=0;
        /**
         * 文本框到通道的距离
         */
        this.d_distance=d_distance;
        /**
         * 基准点到文本框的长度
         */
        this.l_distance=l_distance;
        /**
         * 文本参照线，直线上的三个点，
         * 第一个点为起点坐标，第二个点为直线中心点坐标，第三个点为终点坐标
         */
        this.referLinePoints=referLinePoints;
        this.inItPsdbChannelTextBox();
        this.initPsdbChannelTextBoxEvent();
    }


    //指定类的继承关系
    var p = createjs.extend(PsdbChannelTextBox, PsdbCanvas.PsdbTextBox);
    
    p.inItPsdbChannelTextBox=function(){
    	var me=this,
    	    angle=0,
    	    referLinePoints=me.referLinePoints;
    	me.setReferPoint(referLinePoints[1].getX(),referLinePoints[1].getY());
    	angle=me.setRotationByReferLine(referLinePoints[0],referLinePoints[2]);
    	me.updateReferParam(angle);
    };
    
    /**
     * 指定基准点，
     * @param x
     * @param y
     */
    p.setReferPoint=function(x,y){
        var me=this;
        me.referPoint.setXY(x,y);
    };
   
    /**
     * 参照直线的倾斜度设置文本框的倾斜度
     * @param pointA (PsdbCanvas.PsdbPoint对象) 直线上一点A
     * @param pointB (PsdbCanvas.PsdbPoint对象) 直线上的yi点B
     */
    p.setRotationByReferLine = function(pointA,pointB){
    	var me=this,
	        angleAB=0,
	        angle=0,
	        result=0;
        
        angleAB=Math.atan2(pointB.y - pointA.y, pointB.x - pointA.x);
        result=(angleAB/Math.PI)*180;
        //console.log("====================:"+result);
        if(Math.abs(result)>90){
        	angle=result-180;
        }else{
        	angle=result;
        }
        me.setRotation(angle);
        me.angle_distance=angle;
        return angle;
    };
    /**
     * 重新设置PsdbChannelTextBox的位置，在通道移动的时候设置字体跟随通道移动
     * 在通道中使用
     */
    p.resetLocation=function(referLinePoints,isUpdateScene){
    	var me=this,
	        scene=parent.scene,
	        move_x=referLinePoints[1].getX(),
	        move_y=referLinePoints[1].getY();
	    //计算当前移动的偏移量
	    if(me.referPoint.getX()==move_x&& me.referPoint.getY()==move_y){
	        return;
	    }
	    var angle=me.setRotationByReferLine(referLinePoints[0],referLinePoints[2]);
	    me.setReferPoint(move_x,move_y);//设置基准点
	    me.referLinePoints=referLinePoints;//设置基准线
	    me.updateReferParam(angle);
	    if(isUpdateScene){
	        scene.updateScene(null,true);
	    }
    },
    /**
     * 在通道中更新参照参数
     */
    p.updateReferParam = function(angle){
    	var me=this;
    	if(me.d_distance){
    		var h=0,w=0;
    		//计算文本框到基准线垂足点的x轴方向的距离
    	    h=me.d_distance*Math.cos(2*Math.PI/360*angle);
    	    //计算文本框到基准线垂足点的y轴方向的距离。d_distance为文本框到基准线的距离
    	    w=me.d_distance*Math.sin(2*Math.PI/360*angle);
    	    var move_x=me.referPoint.getX(),
	            move_y=me.referPoint.getY(),
	            hx=move_x,
		    	hy=move_y;
    	    if(me.l_distance){
    	    	//计算基准线上，基准点到垂足之间的距离
    		    var fl=me.l_distance*me.l_distance-me.d_distance*me.d_distance;
    		    if(me.x_distance==0){
        	    	hx=move_x;
        	    	hy=move_y;
        	    }else if(me.x_distance>0){
        	    	//得到垂足的x轴坐标
        	     	hx= move_x+Math.sqrt(fl)*Math.cos(2*Math.PI/360*angle);
        	       //得到垂足的y轴坐标
        	     	hy= move_y+Math.sqrt(fl)*Math.sin(2*Math.PI/360*angle);
        	    }else{
        	     	hx= move_x-Math.sqrt(fl)*Math.cos(2*Math.PI/360*angle);
        	        hy= move_y-Math.sqrt(fl)*Math.sin(2*Math.PI/360*angle);
        	    }
    	    }
    	    var x =hx+w,
	            y =hy-h;
    	    /*if(angle<0){
	        	me.container.rotation=180;
	        }*/
	        me.setLocation(x,y);
	        
    	}
    },
    /**
     * 初始化事件系统
     */
    p.initPsdbChannelTextBoxEvent = function(){
        var me=this,
            parent=me.parent;

        /**
         * 鼠标按下事件
         * 1.鼠标按下时记录当前移动目标的偏移量
         * 2.阻止当前事件向下传递
         */
        me.container.addEventListener("mousedown", function (evt) {
            //定义鼠标右键事件
            var o=me.container,
                scene=parent.scene,
                scale=1/scene.scale;
            me.offset = {x: o.x - evt.stageX*scale, y: o.y - evt.stageY*scale};
            evt.stopPropagation();
            //超图中添加
            evt.nativeEvent.stopPropagation();
        });
        /**
         * 鼠标按下移动事件
         * 1.鼠标按下移动时改变节点的形状
         * 2.阻止当前事件向下传递
         */
        me.container.addEventListener("pressmove", function (evt) {
            var o = me.container,
                scene=parent.scene,
                scale=1/scene.scale;
            //计算当前移动的偏移量
            var mx=(evt.stageX*scale + me.offset.x),
                my= (evt.stageY*scale + me.offset.y);
            
            me.setLocation(mx,my);
            if(parent instanceof PsdbCanvas.PsdbChannel){
            	//me.updateReferParam(me.referLinePoints,me.angle_distance);
               if(Math.abs(me.angle_distance)<90){
               	    me.x_distance=mx- me.referPoint.getX();
                    me.y_distance=my- me.referPoint.getY();
               }else{
               	    me.x_distance=me.referPoint.getX()-mx;
                    me.y_distance=me.referPoint.getY()-my;
               }
               if(me.referLinePoints){
               	//计算当前移动到的点到通道的距离
                   var a,b,c,referLinePoints=me.referLinePoints;
                   a=referLinePoints[2].getY()-referLinePoints[0].getY();//A=Y2-Y1
                   b=referLinePoints[0].getX()-referLinePoints[2].getX();//B=X1-X2
                   c=referLinePoints[2].getX()*referLinePoints[0].getY()-referLinePoints[0].getX()*referLinePoints[2].getY();//C=X2*Y1-X1)Y2
                   me.d_distance=(a*mx+b*my+c)/Math.sqrt(a*a+b*b);//使用点到直线的距离公式计算距离
               }
               me.l_distance=Math.abs(Math.sqrt(me.x_distance*me.x_distance+me.y_distance*me.y_distance));
            }
            
            scene.updateScene(null,true);
            evt.stopPropagation();
        });


    };

    //添加前缀创，创建父类的构造函数Container_constructor
    PsdbCanvas.PsdbChannelTextBox = createjs.promote(PsdbChannelTextBox, "PsdbTextBox");
})();