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

    function BaseLine(){
    	
    	this.PsdbLine_constructor();
        
        /**
         * 线路属性
         */
        this.lineObje  = {
        	 lineId  : "",
        	 lname   : "",
        	 inservice:'T'
        };
        /**
         * 线路id
         */
       
        this.lineId="";
        /**
         * 线路名
         */
        this.lname="";
        /**
         * 通道id
         */
	    this.channelId ="";
	    /**
	     * 是否在运行,值为T(表示当前线路为可运行)或F（表示当前线路为不可运行的）
	     */
	    this.inservice ="T";
	    
	    
        this.modified =null;
        
        this.typp ="";
	    this.defaultStrokeColor='#0b56e0';
        /**
         * 交流初始默认颜色
         */
        this.strokeColor = this.defaultStrokeColor;

    }

    //指定类的继承关系
    var p = createjs.extend(BaseLine, PsdbCanvas.PsdbLine);
    /**
     * 使用默认颜色
     */
    p.useDefaultStrokeColor = function(color){
    	var me=this;
    	if(color){
    		me.setStrokColor("color");
    	}else{
    		me.setStrokColor(me.defaultStrokeColor);
    	}
    }; 
    /**
     * 设置默认线条颜色
     * @param color
     */
    p.setDefaultStrokeColor=function(color){
       var me=this;
        if(color){
            me.defaultStrokeColor=color;
        }
    };
    /**
     * 设置线路是否为在运行状态：inservice的值为T:表示在运行（样式为默认样式）
     * color为不可用状态的线条颜色
     */
    p.setInservice = function(inservice,color){
    	var me=this;
    	if(inservice&&inservice=='T'){
    		me.useDefaultStrokeColor();
    		me.setDashedPattern(false);
    	}else{
    		me.setStrokColor(color?color:'#696969');
        	me.setDashedPattern(true);
    	}
    	me.inservice=inservice;
    };
    /**
     * 获取当前线路的运行状态
     */
    p.getInservice = function(){
    	var me=this;
    	return me.inservice;
    };
    //添加前缀创，创建父类的构造函数Stage_constructor
    PsdbCanvas.BaseLine = createjs.promote(BaseLine, "PsdbLine");
})();
