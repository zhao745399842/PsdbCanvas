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
     * 类NodeAnchorPoint的构造方法。
     * @constructor
     */
    function NodeAnchorPoint(node){

        this.PsdbAnchorPoint_constructor();
        /**
         * 对应节点
         */
        this.node=node;
        this.node_width=node.width;
        this.node_height=node.height;
        this.shape_width=8;
        this.shape_height=8;

        this.shape_north_left=new PsdbCanvas.PsdbShape().set({cursor:"nw-resize",type:"shape_north_left"});
        this.shape_north_center=new PsdbCanvas.PsdbShape().set({cursor:"n-resize",type:"shape_north_center"});
        this.shape_north_right=new PsdbCanvas.PsdbShape().set({cursor:"ne-resize",type:"shape_north_right"});

        this.shape_west_center=new PsdbCanvas.PsdbShape().set({cursor:"w-resize",type:"shape_west_center"});
        this.shape_east_center=new PsdbCanvas.PsdbShape().set({cursor:"e-resize",type:"shape_east_center"});

        this.shape_south_left=new PsdbCanvas.PsdbShape().set({cursor:"sw-resize",type:"shape_south_left"});
        this.shape_south_center=new PsdbCanvas.PsdbShape().set({cursor:"s-resize",type:"shape_south_center"});
        this.shape_south_right=new PsdbCanvas.PsdbShape().set({cursor:"se-resize",type:"shape_south_right"});

        this.initAnchorEvent();
    }


    //指定类的继承关系
    var p = createjs.extend(NodeAnchorPoint, PsdbCanvas.PsdbAnchorPoint);

    /**
     * 绘制节点的八个描点
     */
    p.drawAnchorPoint=function(){
        var me=this,
            nodeX =me.node.x,
            nodeY=me.node.y,
            width=me.node.width,
            height=me.node.height;

        var shape_north_left=me.drawShape(nodeX-width/2-me.shape_width,nodeY-height/2-me.shape_height,me.shape_north_left),
            shape_north_center=me.drawShape(nodeX-me.shape_width/2,nodeY-height/2-me.shape_height,me.shape_north_center),
            shape_north_right=me.drawShape(nodeX+width/2,nodeY-height/2-me.shape_height,me.shape_north_right),

            shape_west_center=me.drawShape(nodeX-width/2-me.shape_width,nodeY-me.shape_height/2,me.shape_west_center),
            shape_east_center=me.drawShape(nodeX+width/2,nodeY-me.shape_height/2,me.shape_east_center),

            shape_south_left=me.drawShape(nodeX-width/2-me.shape_width,nodeY+height/2,me.shape_south_left),
            shape_south_center=me.drawShape(nodeX-me.shape_width/2,nodeY+height/2,me.shape_south_center),
            shape_south_right=me.drawShape(nodeX+width/2,nodeY+height/2,me.shape_south_right);


            me.addChild(shape_north_left),
            me.addChild(shape_north_center),
            me.addChild(shape_north_right),
            me.addChild(shape_west_center),
            me.addChild(shape_east_center),
            me.addChild(shape_south_left),
            me.addChild(shape_south_center),
            me.addChild(shape_south_right);
    };
    /**
     * 绘制描点
     * @param x 绘制描点的x轴坐标
     * @param y  绘制描点的y轴坐标
     * @param shape 对象PsdbCanvas.PsdbShape的一个实例
     * @returns {PsdbCanvas.PsdbShape}
     */
    p.drawShape=function(x,y,shape){
        var me=this;
        shape.graphics.beginStroke("#000000");
        shape.graphics.setStrokeStyle(2);

        shape.graphics.drawRect(x,y,me.shape_width,me.shape_height);
        shape.graphics.endStroke();
        shape.alpha=0.8;
        shape.graphics.beginFill("#66ffff");
        shape.graphics.drawRect(x,y,me.shape_width,me.shape_height);
        shape.graphics.endFill();

        return shape;
    };

    /**
     * 重新加载当前节点
     * @param newNodeWidth 节点新的宽度
     * @param newNodeHeight 节点新的高度
     */
    p.realLoad=function(newNodeWidth,newNodeHeight){
        var me=this;
        me.node.setSize(newNodeWidth,newNodeHeight);
        me.node.realLoad();
        me.node.scene.updateScene();

    };

    /**
     * 拖动上左、上右、下左、下右的描点
     * @param offsetX  在x轴方向的拉伸量
     * @param offsetY  在y轴方向的拉伸量
     * @returns {boolean}
     */

    p.dragCornerAnchor=function(offsetX,offsetY){
        var me=this,
            newNodeWidth=me.node_width-2*offsetX,
            newNodeHeight=me.node_height-2*offsetY;
        if(newNodeHeight<me.shape_height*2){
            return false;
        }

        me.shape_north_left.x=offsetX,
        me.shape_north_left.y=offsetY,
        me.shape_north_center.y=offsetY,
        me.shape_north_right.x=-offsetX,
        me.shape_north_right.y=offsetY,
        //*****中间
        me.shape_west_center.x=offsetX,
        me.shape_east_center.x=-offsetX,
        //****下部
        me.shape_south_left.x=offsetX,
        me.shape_south_left.y=-offsetY,

        me.shape_south_center.y=-offsetY,

        me.shape_south_right.x=-offsetX,
        me.shape_south_right.y=-offsetY;
        me.realLoad(newNodeWidth,newNodeHeight);
        return true;
    };
    /**
     * 拖动上中和下中的描点
     * @param offsetY  在y轴方向的拉伸量
     * @returns {boolean}
     */
    p.dragNorthAndsouthCenterAnchor = function(offsetY){
        var me=this,
            newNodeHeight=me.node_height-2*offsetY;
        if(newNodeHeight<-me.shape_height){
            return false;
        }
        me.shape_north_left.y=offsetY,
        me.shape_north_center.y=offsetY,

        me.shape_north_right.y=offsetY,

        me.shape_south_left.y=-offsetY,

        me.shape_south_center.y=-offsetY,

        me.shape_south_right.y=-offsetY;
        me.realLoad(me.node.width,newNodeHeight);
        return true;
    };
    /**
     * 拖动左中和右中的描点
     * @param offsetX  在x轴方向的拉伸量
     * @returns {boolean}
     */
    p.dragWestAanEastCenterAnchor = function(offsetX){
        var me=this,
            newNodeWidth=me.node_width-2*offsetX;
        if(newNodeWidth<-me.shape_height){
            return false;
        }
        me.shape_north_left.x=offsetX,
        me.shape_west_center.x=offsetX,
        me.shape_east_center.x=-offsetX,
        me.shape_north_right.x=-offsetX,
        me.shape_south_left.x=offsetX,
        me.shape_south_right.x=-offsetX;
        me.realLoad(newNodeWidth,me.node.height);
        return true;
    };
    /**
     * 当鼠标拖动节点的描点的时候改变节点的形状
     * @param x 描点拖动的x轴方向拉伸量
     * @param y 描点拖动的y轴方向的拉伸量
     * @param target 当前被拖动的描点
     * @returns {boolean}
     */
    p.changeNodeShapes=function(x,y,target){
        var me=this;

        //拖动左上节点
        if(target.type=="shape_north_left"){
            return me.dragCornerAnchor(x,y);
        }else if(target.type=="shape_north_center"){
            return me.dragNorthAndsouthCenterAnchor(y);
        }else if(target.type=="shape_north_right"){
            return me.dragCornerAnchor(-x,y);
        }else if(target.type=="shape_west_center"){
            return me.dragWestAanEastCenterAnchor(x);
        }else if(target.type=="shape_east_center"){
            return me.dragWestAanEastCenterAnchor(-x);
        }else if(target.type=="shape_south_center"){
            return me.dragNorthAndsouthCenterAnchor(-y);
        }else if(target.type=="shape_south_right"){
            return me.dragCornerAnchor(-x,-y);
        }else if(target.type=="shape_south_left"){
            return me.dragCornerAnchor(x,-y);
        }

    };
    p.initAnchorEvent=function(){
        var me=this,
            scale=1/me.node.scene.scale;
        /**
         * 鼠标按下事件
         * 1.鼠标按下时记录当前移动目标的偏移量
         * 2.阻止当前事件向下传递
         */
        me.addEventListener("mousedown", function (evt) {
            //定义鼠标右键事件
            var e=evt.nativeEvent;
            if (e.button==0){
                var o=evt.target;
                if(o.type){
                    o.offset = {x: o.x - evt.stageX*scale, y: o.y - evt.stageY*scale};
                }
                evt.stopPropagation();
            }
        });
        /**
         * 鼠标按下移动事件
         * 1.鼠标按下移动时改变节点的形状
         * 2.阻止当前事件向下传递
         */
        me.addEventListener("pressmove", function (evt) {
            var o = evt.target;
            var e=evt.nativeEvent;
            if (e.button==0){
                //计算当前移动的偏移量
                var x=evt.stageX*scale+ o.offset.x,
                    y=evt.stageY*scale + o.offset.y;
                me.changeNodeShapes(x, y,o);
                evt.stopPropagation();
            }
        });
    };
    //添加前缀创，创建父类的构造函数Stage_constructor
    PsdbCanvas.NodeAnchorPoint = createjs.promote(NodeAnchorPoint, "PsdbAnchorPoint");
})();

