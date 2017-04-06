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

    function DcLine(){

        this.BaseLine_constructor();
        
	    /**
	     * 线类型
	     */
	    this.typp ="DC";
	    
	    this.defaultStrokeColor='#1FA752';
        /**
         * 直流初始默认颜色
         */
        this.strokeColor = this.defaultStrokeColor;
        //this.initDcLine();

    }

    //指定类的继承关系
    var p = createjs.extend(DcLine, PsdbCanvas.BaseLine);
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
        	me.setDashedPattern(false);
    	}
    	me.inservice=inservice;
    };
    //添加前缀创，创建父类的构造函数Stage_constructor
    PsdbCanvas.DcLine = createjs.promote(DcLine, "BaseLine");
})();
