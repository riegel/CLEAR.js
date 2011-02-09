/*global
  window: false,
  self: false,
  document: false,
  XMLHttpRequest: false,
  navigator: false,
  setTimeout: false,
  status: false,
  console: false,
  ActiveXObject: false,
  escape: false
  encodeURIComponent: false
*/
var CLEAR,AJAXready,onAJAX,afterAJAX;

Array.prototype.has=function(v){
 for (var i=0;i<this.length;i++){ if (this[i].toLowerCase()==v.toLowerCase()){return true;} }
 return false;
};



function writeHTML(div,content){
 CLEAR.f.$(div).innerHTML=content;
}






if(typeof AJAXready   != "function") {AJAXready=function(){};}
if(typeof onAJAX      != "function") {onAJAX=function(){};   }
if(typeof afterAJAX   != "function") {afterAJAX=function(){};}
if(typeof expiredAJAX != "function") {expiredAJAX=function(){CLEAR.f.dialog('Expired Link','The AJAX you attempted to run is requesting a link that has expired.<br>To handle expired links add a function called expiredAJAX(element) to your application.');};}
if(typeof writeHTML   != "function") {writeHTML=function(div,content){CLEAR.f.$(div).innerHTML=content;};}




( function() {
 var i,trueName = '';
 for (i = 0; i < 16; i++) { 
  trueName += String.fromCharCode(Math.floor(Math.random() * 26) + 97); 
 }
 if (typeof CLEAR === 'object'){
  window[trueName] = CLEAR;
 } else {
  window[trueName] = {};
  CLEAR = window[trueName];
 }
 CLEAR.loaded=false;
 CLEAR.trueName=trueName;
 CLEAR.f = function() {
  return {





   init : function(target) {
    var k = document.getElementsByTagName('SCRIPT');
    for (var i = 0; i < k.length; i++) {
     if (k[i].src.match(target)) {
      // Next we load any script arguments passed into CLEAR.a
      CLEAR.a = {};
      if (k[i].innerHTML) {
       CLEAR.a = CLEAR.f.parseJson(k[i].innerHTML);
      }
      CLEAR.f.houseKeep();
      // At this point I can get all my passed arguments with CLEAR.a.color etc...
      k[i].parentNode.removeChild(k[i]);
      CLEAR.f.ajaxForms(CLEAR.a.forms);
      CLEAR.f.ajaxAnchors(CLEAR.a.anchors);
      CLEAR.f.ajaxDivs(CLEAR.a.anchors);
      CLEAR.f.ajaxInputs(CLEAR.a.inputs);
      CLEAR.loaded=true;
      CLEAR.f.report('info','AJAX Ready!');



      if (typeof CLEAR.a.onload === 'function'){ CLEAR.a.onload(CLEAR.a);}
      break;
     }
    }
   },





   setvalue: function (nm,v) {
    var i,n=document.getElementsByName(nm);
    for (i=0; i < n.length; i++) {
     if (n[i].type == 'hidden' || n[i].type == 'text' || n[i].type == 'password' || n[i].type == 'textarea'){ n[i].value=v[0]; }
     if (n[i].type == 'checkbox' && n[i].nodeName == 'INPUT' ){
      if ( v.has(n[i].value) ) {
       n[i].checked=true;
      } else {
       n[i].checked=false;
      }
     }
     if (n[i].nodeName == 'SELECT'){
      var z, inputArray=document.getElementsByTagName('option');
      for (z=0; z < inputArray.length; z++) {
       if (v.has(inputArray[z].value) ){
        inputArray[z].selected=true;
       } else {
        inputArray[z].selected=false;
       }
      }
     }
     if (n[i].type == 'radio' && n[i].nodeName == 'INPUT'){
      if ( v.has(n[i].value) ) {
       n[i].checked=true;
      } else {
       n[i].checked=false;
      }
     }
    }
   },





   getvalue: function (nm) {
    var i,n=document.getElementsByName(nm);
    var v=[];
    for (i=0; i < n.length; i++) {
     if (n[i].type == 'hidden' || n[i].type == 'text' || n[i].type == 'password' || n[i].type == 'textarea'){ return n[i].value; }
     if (n[i].type == 'radio' && n[i].nodeName == 'INPUT' && n[i].checked){ return n[i].value; }
     if (n[i].type == 'checkbox' && n[i].nodeName == 'INPUT' && n[i].checked){ v.push(n[i].value); }
     if (n[i].nodeName == 'SELECT'){
      var z, inputArray=n[i].getElementsByTagName('option');
      for (z=0; z < inputArray.length; z++) {
       if (inputArray[z].selected){
        v.push(inputArray[z].value);
       }
      }
     }
    }
    return v;
   },





   report: function (t,m) {
    if (typeof console != "undefined") {
     if (t.toLowerCase() == 'error') {console.error(m);}
     if (t.toLowerCase() == 'info')  {console.info(m); }
     if (t.toLowerCase() == 'log')   {console.log(m);  }
    } else {
     if (t.toLowerCase() == 'error') {window.status='ERROR: '+m;}
    }
    return true;
   },





   parseJson : function(json) {
    this.parseJson.data = json;
    if ( typeof json !== 'string') {
     return {"err":"trying to parse a non-string JSON object"};
    }
    try {
     var f = Function(['var document,top,self,window,parent,Number,Date,Object,Function,',
     'Array,String,Math,RegExp,Image,ActiveXObject;',
     'return (' , json.replace(/<\!--.+-->/gim,'').replace(/\bfunction\b/g,'function­') , ');'].join(''));
     return f();
    } catch (e) {
     return {"err":"trouble parsing JSON object; running with defaults"};
    }
   },





   houseKeep : function() {
    var defaults = {
     "forms" : "AJAX",
     "anchors" : "AJAX",
     "inputs" : "AJAX",
     "debug" : false,
     "onload" : AJAXready,
     "useAIM" : false,
     "loadingID" : "processing",
     "loadingHTML" : "loading...",
     "hrefmethod" : "GET"
    };
    for (var d in defaults) {
      if (CLEAR.a[d] === undefined) {
       CLEAR.a[d] = defaults[d];
     }
    }
    CLEAR.p = [];
   },





   ajaxRequest: function(){
    var activexmodes=["Msxml2.XMLHTTP", "Microsoft.XMLHTTP"]; //activeX versions to check for in IE
    if (window.ActiveXObject){ //Test for support for ActiveXObject in IE first (as XMLHttpRequest in IE7 is broken)
     for (var i=0; i<activexmodes.length; i++){
      try{
       return new ActiveXObject(activexmodes[i]);
      }
      catch(e){
       CLEAR.f.report('ActiveXObject Error',{"ActiveXObject ERROR":e});
      }
     }
    }
    else if (window.XMLHttpRequest){
     // if Mozilla, Safari etc
     return new XMLHttpRequest();
    } else {
     return false;
    }
   },





   serialize: function(theform,type,thisel) {
    var str = "";
    var el2 = theform.elements;
    var el  = [];
    var i   = 0;
    var els,disabled,ajax;
    for(i = 0; i < el2.length; i++){el.push(el2[i]);}
    var temp=theform.getElementsByTagName('input');
    for(i = 0; i < temp.length; i++){if (temp[i].type === 'image'){el.push(temp[i]);}}
    for(i = 0; i < el.length; i++){
     if ((el[i].type === 'image' || el[i].type === 'submit') && !(el[i].isclicked) ) {disabled=true;} else {disabled=false;}
     if ((el[i].type === 'image' || el[i].type === 'submit') && el[i].isclicked ) {window.status=el[i].value+' in process...'; window.waiting=window.status;}
     if (el[i].type=='button') {disabled=true;}

     if (type.toLowerCase() === "inputs" && el[i] != thisel){ajax=el[i].getAttribute('hold') || el[i].getAttribute('data-hold'); if (ajax === ''){ajax=false;} else {ajax=true;}} else {ajax=true;}

     if(((el[i].type === 'radio' || el[i].type === 'checkbox') && el[i].checked) || (el[i].type != 'radio' && el[i].type != 'checkbox') && (el[i].type != 'reset')   && ajax              ){
      if(el[i].type === 'select-multiple'){
       els=CLEAR.f.getvalue(el[i].name);
       for(var j = 0; j < els.length; j++){
        str = str + el[i].name + "=" + encodeURIComponent(els[j]) + '&';
       }
      } else if (el[i].type === 'submit' || el[i].type === 'image'){
        if(!(disabled)){
         str = str + el[i].name + "=" + encodeURIComponent(el[i].value) + '&';
         if (el[i].type === 'image'){
          str = str + el[i].name + ".x=" + encodeURIComponent(el[i].x) + '&';
          str = str + el[i].name + ".y=" + encodeURIComponent(el[i].y) + '&';
         } else {
          str = str + el[i].name + ".x=ERROR&";
          str = str + el[i].name + ".y=ERROR&";
         }
        }
      } else {
       str = str + el[i].name + "=" + encodeURIComponent(el[i].value) + '&';
      }
     }
     el[i].isclicked=false;
    }
    return str.substring(0,str.length-1);
   },





   ajaxInputs: function(c,evt,url) {
    if (typeof evt == 'undefined'){evt='change';}
    var event,q,input;
    var theaction=null;
    var themethod=null;
    var ev,x;
    for (q=0; q<3; q++)
    {
     if (q === 0){
      input=document.getElementsByTagName('select');
     } else if (q==1){
      input=document.getElementsByTagName('input');
     } else {
      input=document.getElementsByTagName('textarea');
     }



     for (i=0; i<input.length; i++)
     {
      if (input[i].className.indexOf(c) != -1 || input[i].getAttribute(c) !== null || input[i].getAttribute('data-'+c) !== null)
      {



       if (typeof url == 'undefined' && input[i].form !== null){
        theaction=input[i].form.action;
        themethod=input[i].form.method;
       } else if (typeof url == 'undefined'){
        theaction=null;
        themethod=null;
       } else {
        theaction=url;
        themethod='POST';
       }
       if (theaction !== null) {
        CLEAR.f.debug('ajax added to input... "'+input[i].name+'" '+input[i].form.action);
        event=evt;
        ev=false;
        if (input[i].getAttribute(c)){
         ev=input[i].getAttribute(c);
        }
        if (input[i].getAttribute('data-'+c)){
         ev=input[i].getAttribute('data-'+c);
        }
        if (ev != '') {
         event=ev.split(' ');
        } else {
         event=event.split(' ');
        }
        for (x=0; x < event.length; x++) {
         // Trigger the change for IE using the onclick to blur unblur the object
         if (navigator.appName == 'Microsoft Internet Explorer' && (input[i].type == 'radio' || input[i].type == 'checkbox') ){
          CLEAR.f.observe(input[i],'click',CLEAR.f.forceOnChange);
         }
         CLEAR.f.observe(input[i],event[x],CLEAR.f.inputEvent(input[i],theaction,themethod));
        }
       }
      }
     }
    }
   },





   identifythis: function(el){
    return function(e) {
     el.savestate=el.disabled;
     if(typeof e !== 'undefined'){
      if (el.type === "image" || el.type === "anchor"){
       // We need to get the x,y coords of where on the element the click occurred.
       var x=0,y=0,l=0,t=0;
       if (e.pageX || e.pageY){
        x = e.pageX;
        y = e.pageY;
       } else if (e.clientX || e.clientY){
        x = e.clientX + document.body.scrollLeft + el.scrollLeft; 
        y = e.clientY + document.body.scrollTop + el.scrollTop;
       }
       var eltemp=el;
       if (eltemp.offsetParent) {
        do {
         l += eltemp.offsetLeft;
         t += eltemp.offsetTop;
        } while (eltemp = eltemp.offsetParent );
       }
       el.x=parseInt(x-l,10);
       el.y=parseInt(y-t,10);
       el.l=parseInt(l,10);
       el.t=parseInt(t,10);
      }
     }
     el.isclicked=true;
    };
   },





   inputEvent: function(el,theaction,themethod){
    return function (e){
     CLEAR.f.$(el).event=e;
     CLEAR.f.doAJAX(el,theaction,themethod,'ajaxrequest=TRUE&ajax.clicked='+encodeURIComponent(el.name)+'&'+CLEAR.f.serialize(el.form,'INPUTS',el));
    };
   },





   forceOnChange: function(){
    this.blur();
    this.focus();
   },





   ajaxForms: function(c) {
    // this keeps track of the element that was clicked
    var inputArray =  document.getElementsByTagName('input');
    for (i=0; i < inputArray.length; i++) {
     if (inputArray[i].type == "submit" || inputArray[i].type == "image") {
      inputArray[i].isclicked=false;
      CLEAR.f.observe(inputArray[i],'click',CLEAR.f.identifythis(inputArray[i]));
     }
    }
    // keeps track of the element clicked
    var inputArray =  document.getElementsByTagName('button');
    for (i=0; i < inputArray.length; i++) {
     if (inputArray[i].type == "submit" || inputArray[i].type == "image") {
      inputArray[i].isclicked=false;
      CLEAR.f.observe(inputArray[i],'click',CLEAR.f.identifythis(inputArray[i]));
     }
    }




    var forms= document.getElementsByTagName('form');
    for (i=0; i<forms.length; i++){
     if (forms[i].className.indexOf(c) != -1 || forms[i].getAttribute(c) !== null || forms[i].getAttribute('data-'+c) !== null ){
      CLEAR.f.debug('ajax added to form... '+forms[i].action);
//    CLEAR.f.observe(forms[i],'submit',CLEAR.f.submitEvent(forms[i]));
      forms[i].onsubmit=CLEAR.f.submitEvent(forms[i]);
     }
    }
   },





   submitEvent: function(el){
    return function(e){
     CLEAR.f.$(el).event=e;
     return CLEAR.f.runForm(el);
    };
   },





   hrefEvent: function(el){
    return function(e){
     var i;
     i=CLEAR.f.identifythis(el);
     el.type="anchor";
     i(e);
     CLEAR.f.$(el).event=e;
     CLEAR.f.doAJAX(el,el.href,CLEAR.a.hrefmethod,'ajaxrequest=TRUE&ajax.clicked=anchor');
     return false;
    };
   },





   ajaxAnchors: function(c){
    CLEAR.f.ajaxElements(c,'a','click');
   },


   ajaxDivs: function(c){
    CLEAR.f.ajaxElements(c,'div','dblclick');
   },


   ajaxElements: function(c,theKind,theDefault) {
    var event;
    var ev;
    var divArray =  document.getElementsByTagName(theKind);
    for (i=0; i < divArray.length; i++)
    {
     if (divArray[i].className.indexOf(c) != -1 || divArray[i].getAttribute(c) !== null || divArray[i].getAttribute('data-'+c) !== null){
      event=theDefault;
      ev=false;
      if (divArray[i].getAttribute(c)){
       ev=divArray[i].getAttribute(c);
      }
      if (divArray[i].getAttribute('data-'+c)){
       ev=divArray[i].getAttribute('data-'+c);
      }
      if (ev != '') {
       event=ev.split(' ');
      } else {
       event=event.split(' ');
      }
      for (x=0; x < event.length; x++) {
       if (event[x]=='click'){
        divArray[i].onclick=CLEAR.f.hrefEvent(divArray[i]);
       } else {
        CLEAR.f.observe(divArray[i],event[x],CLEAR.f.dataHrefEvent(divArray[i]));
       }

      }
     }
    }
   },





   dataHrefEvent: function(el){
    return function(e){
     var i;
     var href;
     i=CLEAR.f.identifythis(el);
     el.type="div";
     i(e);
     CLEAR.f.$(el).event=e;
     if (el.getAttribute('href')){
      href=el.getAttribute('href');
     } else if (el.getAttribute('data-href')){
      href=el.getAttribute('data-href');
     } else {
      return false;
     }
     CLEAR.f.doAJAX(el,href,'POST','ajaxrequest=TRUE&ajax.clicked='+el.id+'&ajax.innerHTML='+encodeURIComponent(el.innerHTML));
     return false;
    };
   },




   runOverlay: function(url,id){
    id=CLEAR.f.$(id);
    if (typeof id == 'undefined') {id=document;}
    CLEAR.f.doAJAX(id,url,'GET','ajaxrequest=TRUE&ajax.clicked=overlay');
    return false;
   },





   runAnchor: function (id){
    id=CLEAR.f.$(id);
    CLEAR.f.doAJAX(id,id.href,'GET','ajaxrequest=TRUE&ajax.clicked=anchor');
    return false;
   },





   runForm: function(elem){
    var proc=true , el=CLEAR.f.$(elem);
    if (el){
       // Ok we first scan the form to see if it has any file elements. If so then we need an alternate plan
       var getEls=el.elements;
       var hasfilefield=false;
       var hasAjaxRequest=false;
       var hff;
       for (i=0; i < getEls.length; i++) {
         if (getEls[i].name=='ajaxrequest') {hasAjaxRequest=true;}
         if (getEls[i].type=='file') {
          if (getEls[i].value != ""){
           hasfilefield=true;
           hff=getEls[i];
          }
         }
       }
       if(typeof CLEAR.a.useAIM == "undefined") {CLEAR.a.useAIM=false;}
       if (hasfilefield || CLEAR.a.useAIM){
        proc=CLEAR.f.processing(true,el);
        if (proc === false){return proc;}
        if (hasAjaxRequest===false){
         var newdiv = document.createElement("input");
         newdiv.setAttribute('type','hidden');
         newdiv.setAttribute('name','ajaxrequest');
         newdiv.setAttribute('value','error');
         el.insertBefore(newdiv,el.firstChild);
        }
        el.action=el.action.replace('?ajaxrequest=IFRAME','')+'?ajaxrequest=IFRAME';
        CLEAR.f.AIM.submit(el);
        // The AIM method doesn't actually submit the form, it simply creates a new target
        // that is why we end this with return true, the browser will do the submission
        return true;
       } else {
        CLEAR.f.doAJAX(el,el.action,el.method,'ajaxrequest=TRUE&ajax.clicked=form&'+CLEAR.f.serialize(el,'FORM',el));
        return false;
       }
    }
   },





   AIM: {
    frame : function(f,c) {
     var n = 'f' + Math.floor(Math.random() * 99999);
     var d = document.createElement('DIV');
     d.innerHTML = '<iframe style="display:none;" src="about:blank" id="'+n+'" name="'+n+'" onload="CLEAR.f.AIM.loaded(\''+f.id+'\',\''+n+'\')"></iframe>';
     document.body.appendChild(d);
     var i = document.getElementById(n);
     if (c && typeof(c.onComplete) == 'function') {i.onComplete = c.onComplete;}
     return n;
    },
    form : function(f, name) {f.setAttribute('target', name);},
    submit : function(f, c) {
     // Added By Terry Riegel
     document.getElementsByName('ajaxrequest')[0].value="IFRAME";
     CLEAR.f.AIM.form(f, CLEAR.f.AIM.frame(f,c));
     if (c && typeof(c.onStart) == 'function') {
      return c.onStart();
     } else {
      return true;
     }
    },
    loaded : function(f,id) {
     var i = document.getElementById(id);
     var d;
     if (typeof i.contentDocument != "undefined" && i.contentDocument) {
      d = i.contentDocument;
     } else if (typeof i.contentWindow != "undefined" && i.contentWindow) {
      d = i.contentWindow.document;
     } else {
      d = window.frames[id].document;
     }
     if (typeof d != "undefined" && d.location.href == "about:blank") {
      return;
     }
     if (f === '') {} else {
      var tf=CLEAR.f.$(f);
      if(typeof tf == "object"){
       CLEAR.f.processing(false,tf);
      } else {
       CLEAR.f.processing(false);
      }
     }
     if (window.waiting == window.status) {window.status='Done.'; window.waiting=false;}
     var q='NOCONTENT';
     try {
      var x=d.body.getElementsByTagName("pre");
      if (x.length == 1) {q=x[0].innerHTML.replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&");} else {q=d.body.innerHTML;}
      eval(q);
     } catch (e){
      e.script=q;
      CLEAR.f.error(q,'IFRAME',{"JAVASCRIPT ERROR":e});
     }
     CLEAR.f.debug('AIM RESPONSE: '+q);
     setTimeout(function(){CLEAR.f.$(id).parentNode.removeChild(CLEAR.f.$(id));},15000);
    }
   },





   doAJAX: function(element,action,method,params){
    params=params+'&CLEAR_RANDOM='+Math.random();
    var proc=true;
    var ajax;
    var U;
    proc=CLEAR.f.processing(true,element);
    if (proc === false && element && element.event){
     element.event.cancelBubble = true;
     if (element.event.stopPropagation) {element.event.stopPropagation();}
     return proc;
    }
    ajax = new CLEAR.f.ajaxRequest();
    if (method.toLowerCase() === 'post'){
     ajax.open(method,action+'?ajaxrequest=TRUE',true); // add the ajaxrequest=TRUE so expired links can be handled properly
     ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded;");
//   below doesn't work in IE6
//   ajax.setRequestHeader("Request-type", "XMLhttpRequest/post;");
     ajax.send(params);
    } else {
     if(action.replace('?','')==action){U='?';} else {U='&';}
     ajax.open(method,action+U+params,true);
//   ajax.setRequestHeader("Request-type", "XMLhttpRequest/get");
     ajax.send(null);
    }
    ajax.onreadystatechange=(function(ajax) {
     // We create a closure here to retain the variable ajax.
     return function(){
      if (ajax.readyState==4){ //if request has completed
       // Ok we got a response, lets turn things off
       CLEAR.f.processing(false,element);
       if (window.waiting === window.status) {window.status='Done.'; window.waiting=false;}
       if (ajax.status==200){ //if request was successful (versus "page not found" etc)
        try {
         eval(ajax.responseText);
        } catch (e) {
         e.script=ajax.responseText;
         CLEAR.f.error(ajax.responseText,ajax.status,{"JAVASCRIPT ERROR":e});
        }
       } else {
        if (ajax.status !== 0){
         CLEAR.f.error(ajax.responseText,ajax.status,{"doAJAX unexpected response":ajax.status});
        }
       }
      CLEAR.f.debug('AJAX RESPONSE: '+ajax.responseText);
      }
     };
    })(ajax);
   },





   error: function(t,s,e){
    if (t === ''){t='ERROR Retrieving XHR Request.';}
    if (t === 'NOCONTENT'){t='ERROR Retrieving IFRAME Request.';}
    var t1,t0;
    t1 ='<pre>'+t.replace(/</g,'&lt;').replace(/\\n/g,'<br>').replace(/\\\//g,'/').replace(/\\\"/g,'"').replace(/\\\'/g,"'")+'</pre>';
    if (CLEAR.f.left(t,10) === '//CLEAR.js'){
     CLEAR.f.report('Javascript Error',e);
     t0='javascript error ('+s+').';
    } else if (t.indexOf("<!-- Engine:") == -1) {
     t0='';
     t1=t;
    } else if(status != '200'){
     t0='expecting AJAX response recieved html instead ('+s+').';
    } else {
     t0='Server status 200 expected, server status recieved was:'+s;
    }
    CLEAR.f.dialog(t0,t1);
   },





   left: function (str, n){
    if (n <= 0){return "";}
    if (n > String(str).length) {return str;}
    return String(str).substring(0,n);
   },
   right: function(str, n){
    if (n <= 0){ return "";}
    if (n > String(str).length) {return str;}
    var iLen = String(str).length;
    return String(str).substring(iLen, iLen - n);
   },





   dialog: function(f,t){
    var browserDims = CLEAR.f.getDimensions();
    var y  = (browserDims.height - 300);
    var x = (browserDims.width - 300);
    var w;
    w = document.createElement('DIV');
    w.style.zIndex=100000000;
    w.style.position='absolute';
    w.style.top='150px';
    w.style.left='150px';
    w.style.backgroundColor='#A0B0B1';
    w.style.width=x+'px';
    w.style.height=y+'px';
    w.style.overflow='auto';
    w.style.padding='10px';
    w.style.border='5px solid #ddd';
    w.style.mozBorderRadius='10px';
    w.style.webkitBorderRadius='10px';
    w.style.borderRadius='10px';
    w.style.mozBoxSizing='border-box';
    w.style.webkitBoxSizing='border-box';
    w.style.boxSizing='border-box';
    if (t === ''){t = '--empty--';}
    if (f != ''){
     w.innerHTML = '<div style="background-color: #bbbbbb; height: 15px; font-family: Verdana; font-size: 10px;">'+f+'</div><div style="background-color: #ffffff;" id="CLEAR_ERROR">'+t+'</div>';
     document.body.appendChild(w);
    } else {
     w.innerHTML = '<div style="margin:0;padding:0;border:none;background-color: #ffffff;width:'+(x-30)+'px; height:'+(y-30)+'px; overflow: none;" id="CLEAR_ERROR"></div><div style="position: absolute; left: -15px; top: -15px; background-color: #ddd; border: none; padding: 5px;border-bottom-right-radius: 10px;moz-border-radius-bottomright: 10px;webkit-border-bottom-right-radius: 10px;">(x)</div>';
     document.body.appendChild(w);
     var iframe = new CLEAR.f.IFrame(CLEAR.f.$("CLEAR_ERROR"),x-30,y-30);
     iframe.doc.body.innerHTML='<div style="padding: 0; margin:0; border: none;">'+t+'</div>';
    }
    CLEAR.f.observe(w,'click',function(){document.body.removeChild(w);});
    return true;
   },





   observe: function( obj, type, fn ) {
    if (!(obj['observing'+type])){
     if ( obj.attachEvent ) {
      obj['e'+type+fn] = fn;
      obj[type+fn] = function(){obj['e'+type+fn]( window.event );};
      obj.attachEvent( 'on'+type, obj[type+fn] );
     } else {
      obj.addEventListener( type, fn, false );
     }
     obj['observing'+type]=true;
    }
   },
   unobserve: function( obj, type, fn ) {
    if ( obj.detachEvent ) {
     obj.detachEvent( 'on'+type, obj[type+fn] );
     obj[type+fn] = null;
    } else {
     obj.removeEventListener( type, fn, false );
    }
   },





   $: function () {
    var elements = [];
    for (var i = 0; i < arguments.length; i++) {
     var element = arguments[i];
     if (typeof element == 'string'){element = document.getElementById(element);}
     if (arguments.length == 1) {return element;}
     elements.push(element);
    }
    return elements;
   },





   getDimensions: function() {
    var intH = 0, intW = 0;
    if(self.innerHeight) {
     intH = window.innerHeight;
     intW = window.innerWidth;
    } else {
     if(document.documentElement && document.documentElement.clientHeight) {
      intH = document.documentElement.clientHeight;
      intW = document.documentElement.clientWidth;
     } else {
      if(document.body) {
       intH = document.body.clientHeight;
       intW = document.body.clientWidth;
      }
     }
    }
    return {
     height: parseInt(intH, 10),
     width: parseInt(intW, 10)
    };
   },





   processing: function(i,el){
    if (i){
     if(typeof onAJAX == "function") {return onAJAX(el);}
    } else {
     if(typeof afterAJAX == "function") {return afterAJAX(el);}
    }
   },





   debug: function(t) {
    if (typeof CLEAR.a.debug == "undefined" || !(CLEAR.a.debug) ) {} else {CLEAR.f.report('log',t.replace(/\\n/g,'\r\n').replace(/\\\//g,'/').replace(/\\\"/g,'"').replace(/\\\'/g,"'"));}
    if (typeof CLEAR.onscreendebug == "undefined" || CLEAR.onscreendebug !== true) {} else {CLEAR.f.dialog('DEBUG',t);}
   },





   IFrame: function(parentElement,x,y){
    var iframe = document.createElement("iframe");
    iframe.style.width=(x)+"px";
    iframe.style.height=(y)+"px";
    iframe.style.border="none";
    iframe.frameborder="0";
    iframe.marginwidth="0";
    iframe.marginheight="0";
    if(parentElement === null){parentElement = document.body;}
    parentElement.appendChild(iframe);
    iframe.doc = null;
    if(iframe.contentDocument){
     iframe.doc = iframe.contentDocument;
    } else {
     if(iframe.contentWindow){
      iframe.doc = iframe.contentWindow.document;
     } else {
      if(iframe.document) {iframe.doc = iframe.document;}
     }
     if(iframe.doc === null){throw "Document not found, append the parent element to the DOM before creating the IFrame";}
    }
    iframe.doc.open();
    iframe.doc.close();
    return iframe;
   },





   noop: {
   }
  };
 }();
 var thisScript = /^https?:\/\/[^\/]*\/apps\/clear\/clear.js[^\/]*$/;
 CLEAR.f.observe(window,'load',function(){CLEAR.f.init(thisScript); });
})();






