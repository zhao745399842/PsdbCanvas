/**
 * Created by zw on 2015/8/5.
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
     * 类PsdbMap的构造方法。
     * @constructor
     */
    function PsdbMap(){
    	/**
    	 * 存放键的数组(遍历用到) 
    	 */    
        this.keys = new Array();     
        /** 
         * 存放数据
         **/    
        this.data = new Object();   

    }

    //指定类的继承关系
    var p = PsdbMap.prototype;

    /**   
     * 放入一个键值对   
     * @param {String} key   
     * @param {Object} value   
     */    
    p.put = function(key, value) {     
        if(this.data[key] == null){     
            this.keys.push(key);     
        }     
        this.data[key] = value;     
    };     
         
    /**   
     * 获取某键对应的值   
     * @param {String} key   
     * @return {Object} value   
     */    
    p.get = function(key) {     
        return this.data[key];     
    };     
         
    /**   
     * 删除一个键值对   
     * @param {String} key   
     */    
    p.remove = function(key) { 
        var index = this.keys.indexOf(key);
    	if (index > -1) {
    		this.keys.splice(index, 1);
    		this.data[key] = null; 
    	}
    };  
    
    p.removeAll = function(){
    	this.keys = new Array();     
        this.data = new Object();   
    };
         
    /**   
     * 遍历Map,执行处理函数   
     *    
     * @param {Function} 回调函数 function(key,value,index){..}   
     */    
    p.each = function(fn){     
        if(typeof fn != 'function'){     
            return;     
        }     
        var len = this.keys.length;     
        for(var i=0;i<len;i++){     
            var k = this.keys[i];     
            var result=fn(k,this.data[k],i);
            if(result){
            	break;
            }
        }     
    };     
         
    /**   
     * 获取键值数组(类似Java的entrySet())   
     * @return 键值对象{key,value}的数组   
     */    
    p.entrys = function() {     
        var len = this.keys.length;     
        var entrys = new Array(len);     
        for (var i = 0; i < len; i++) {     
            entrys[i] = {     
                key : this.keys[i],     
                value : this.data[i]     
            };     
        }     
        return entrys;     
    };     
         
    /**   
     * 判断Map是否为空   
     */    
    p.isEmpty = function() {     
        return this.keys.length == 0;     
    };     
         
    /**   
     * 获取键值对数量   
     */    
    p.size = function(){     
        return this.keys.length;     
    };     
         
    /**   
     * 重写toString    
     */    
    p.toString = function(){     
        var s = "{";     
        for(var i=0;i<this.keys.length;i++,s+=','){     
            var k = this.keys[i];     
            s += k+"="+this.data[k];     
        }     
        s+="}";     
        return s;     
    };     
    //添加前缀创，创建父类的构造函数Container_constructor
    PsdbCanvas.PsdbMap = PsdbMap;
})();

