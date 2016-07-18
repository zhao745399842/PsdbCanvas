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

    function DcLine(text,dashedPattern){

        this.PsdbLine_constructor();
        /**
         * 厂站属性
         */
        this.lineObje  = {
        	 lineId  : "",
        	 lname   : ""
        };
        /**
         * 直流初始默认颜色
         */
        this.strokeColor = '#1FA752';
        this.modified =null;

        this.initDcLine();

    }

    //指定类的继承关系
    var p = createjs.extend(DcLine, PsdbCanvas.PsdbLine);

    /**
     * 初始化连线
     */
    p.initDcLine=function(){
        var me=this;
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
    PsdbCanvas.DcLine = createjs.promote(DcLine, "PsdbLine");
})();
