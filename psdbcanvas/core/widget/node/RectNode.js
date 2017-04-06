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


    function RectNode(){
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
    }


    //指定类的继承关系
    var p = createjs.extend(RectNode, PsdbCanvas.PsdbNode);

    /**
     * 绘制图形
     */
    p.drawNode=function(){
        var me=this,
            shape= new PsdbCanvas.PsdbShape(me).set({cursor:me.cursor}),
            x=me.x-me.offset.x-me.width/2,
            y=me.y-me.offset.y-me.height/ 2,
            image=me.image;
        if(me.fillColor){
            shape.graphics.beginFill(me.fillColor);
        }
        var c= new PsdbCanvas.PsdbContainer();
        if(me.showImage&&image){
            if(!me.width){
                me.width=image.width;
            }
            if(!me.height){
               me.height=image.height;
            }
            var scaleX=me.width/image.width,
                scaleY=me.height/image.height;
            var bitmap = new createjs.Bitmap(image);
            x=me.x-me.offset.x-(image.width*scaleX)/2,
            y=me.y-me.offset.y-(image.height*scaleY)/2;
            bitmap.x=x;
            bitmap.y=y;
            bitmap.scaleX=scaleX,
            bitmap.scaleY=scaleY;
            c.addChild(bitmap);
        }else{
            shape.graphics.drawRect(x-5,y-5,me.width+10,me.height+10);
            shape.graphics.endFill();
            c.addChild(shape);
        }
        return c;
    };
    p.setImage = function (url,scene) {
        var me=this;
        if (null == url){
            throw new Error("Node.setImage(): 参数Image对象为空!");
        }
        me.showImage=true;
        var image=new Image();
        image.src=url;
        image.onload=function(){
            me.image=image;
        };
    };

    //添加前缀创，创建父类的构造函数Stage_constructor
    PsdbCanvas.RectNode = createjs.promote(RectNode, "PsdbNode");
})();