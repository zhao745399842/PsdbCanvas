/**
 * Created by ww on 2015/8/25.
 */

this.PsdbCanvas = this.PsdbCanvas||{};

(function() {
    "use strict";

    var scriptName = "PsdbCanvas.js";
    
    PsdbCanvas.apply = function(o, c, defaults){
        // no "this" reference for friendly out of scope calls
        if(defaults){
            Ext.apply(o, defaults);
        }
        if(o && c && typeof c == 'object'){
            for(var p in c){
                o[p] = c[p];
            }
        }
        return o;
    };
    
    PsdbCanvas.apply(PsdbCanvas,{
    	
    	isDefined : function(v){
            return typeof v !== 'undefined';
        },
        
        applyIf : function(o, c){
            if(o){
                for(var p in c){
                    if(!Ext.isDefined(o[p])){
                        o[p] = c[p];
                    }
                }
            }
            return o;
        },
        removeArrayValue : function(array,val) {
        	var index = array.indexOf(val);
        	if (index > -1) {
        		array.splice(index, 1);
        	}
        }
    });

    PsdbCanvas.getScriptLocation = (function() {
        var r = new RegExp("(^|(.*?\\/))(" + scriptName + ")(\\?|$)"),
            s = document.getElementsByTagName('script'),
            src, m, l = "";
        for(var i=0, len=s.length; i<len; i++) {
            src = s[i].getAttribute('src');
            if(src) {
                var m = src.match(r);
                if(m) {
                    l = m[1];
                    break;
                }
            }
        }
        return (function() { return l; });
    })();


    var jsFile = [
       // "core/dom/JqDomObject.js",
        //***************核心********************************
        "core/createjs/easeljs-0.8.1.combined.js",
        "core/createjs/tweenjs-NEXT.combined.js",
        "core/baseClass/PsdbPoint.js",
        "core/baseClass/PsdbStage.js",
        "core/baseClass/PsdbContainer.js",
        "core/baseClass/PsdbShape.js",
        "core/baseClass/PsdbAlarm.js",



        "core/baseClass/PsdbAnchorPoint.js",
        "core/anchor/NodeAnchorPoint.js",
        "core/anchor/LineAnchorPoint.js",

        "core/text/PsdbText.js",
        "core/text/PsdbTextBox.js",
        "core/baseClass/PsdbBaseScene.js",
        "core/baseClass/PsdbNode.js",
        "core/baseClass/PsdbLine.js",
        "core/baseClass/PsdbChannel.js",


        "core/channel/StraightChannel.js",
        "core/channel/FoldChannel.js",

        "core/node/RectNode.js",
        "core/node/StationNode.js",


        //*********************************************

        "station/PowerPlantSubstationNode.js",
        "station/TransformerSubstationNode.js",
        "station/WindSubStationNode.js",
        "station/ConvertorSubstationNode.js",
        
        "acline/AcLine.js",
        "acline/DcLine.js",
        "scene/PsdbScene.js"
    ];

    var jsTags = "";
    var host = PsdbCanvas.getScriptLocation();
    for(var i = 0, len = jsFile.length; i < len; i++) {
        jsTags += "<script src='"+ host + jsFile[i] +"'></script>";
    }

    document.write(jsTags);
})();
