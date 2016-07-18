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

    function AcLine(text,dashedPattern){

        this.PsdbLine_constructor();

       /* this.nodeA=nodeA;
        this.nodeB=nodeB;*/
        /**
         * 厂站属性
         */
        this.lineObje  = {
        	 lineId  : "",
        	 lname   : ""
        };
        /**
         * 交流初始默认颜色
         */
        this.strokeColor = '#0b56e0';
        this.modified =null;

        this.initAcLine();

    }

    //指定类的继承关系
    var p = createjs.extend(AcLine, PsdbCanvas.PsdbLine);

    /**
     * 初始化连线
     */
    p.initAcLine=function(){
        var me=this;
        //连接标记，用于标记当前连线连接的节点
    };
    /**
     * 更新station厂站属性
     */
    p.updateline = function(obj){
    	var me=this,
    	    line=me.lineObje;
    	PsdbCanvas.apply(line,obj);
    };
    
    /**
     * 获取厂站属性
     */
    p.get= function(name){
        return this.lineObje[name];
    };
    /**
     * 设置厂站属性
     */
    p.set = function(name, value){
        /*var encode = Ext.isPrimitive(value) ? String : Ext.encode;
        if(encode(this.lineObje[name]) == encode(value)) {
            return;
        }   */     
        this.dirty = true;
        if(!this.modified){
            this.modified = {};
        }
        if(this.modified[name] === undefined){
            this.modified[name] = this.data[name];
        }
        this.acline[name] = value;
    },


    //添加前缀创，创建父类的构造函数Stage_constructor
    PsdbCanvas.AcLine = createjs.promote(AcLine, "PsdbLine");
})();
