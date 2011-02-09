   serialize: function(theform,type,thisel) {
    var mime=true;
    var boundary='------CLEAR.jsFormBoundary'+CLEAR.trueName;
    var header='Content-Type: multipart/form-data; boundary='+boundary;





    if (mime){
     str = '';
     str = boundary+'\nContent-Disposition: form-data; name="ajaxrequest"\n\nTRUE\n';
     if (type=='FORM'){
      str = str + boundary+'\nContent-Disposition: form-data; name="ajax.clicked"\n\nform\n';
     } else {
      str = str + boundary+'\nContent-Disposition: form-data; name="ajax.clicked"\n\n'+thisel.name+'\n';
     }
    } else {
     if (type=='FORM'){
      var str = 'ajaxrequest=TRUE&ajax.clicked=form&';
     } else {
      var str = 'ajaxrequest=TRUE&ajax.clicked='+encodeURIComponent(thisel.name)+'&';
     }
    }


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
        if(mime){
         str = str + boundary+'\nContent-Disposition: form-data; name="'+el[i].name+'"\n\n'+els[j]+'\n';
        } else {
         str = str + el[i].name + "=" + encodeURIComponent(els[j]) + '&';
        }
       }
      } else if (el[i].type === 'submit' || el[i].type === 'image'){
        if(!(disabled)){
         if(mime){
          str = str + boundary+'\nContent-Disposition: form-data; name="'+el[i].name+'"\n\n'+el[i].value+'\n';
         } else {
          str = str + el[i].name + "=" + encodeURIComponent(el[i].value) + '&';
         }
         if (el[i].type === 'image'){
          if(mime){
           str = str + boundary+'\nContent-Disposition: form-data; name="'+el[i].name+'.x"\n\n'+el[i].x+'\n';
           str = str + boundary+'\nContent-Disposition: form-data; name="'+el[i].name+'.y"\n\n'+el[i].y+'\n';
          } else {
           str = str + el[i].name + ".x=" + encodeURIComponent(el[i].x) + '&';
           str = str + el[i].name + ".y=" + encodeURIComponent(el[i].y) + '&';
          }
         } else {
          if(mime){
           str = str + boundary+'\nContent-Disposition: form-data; name="'+el[i].name+'.x"\n\nERROR'+'\n';
           str = str + boundary+'\nContent-Disposition: form-data; name="'+el[i].name+'.y"\n\nERROR'+'\n';
          } else {
           str = str + el[i].name + ".x=ERROR&";
           str = str + el[i].name + ".y=ERROR&";
          }
         }
        }
      } else {
       if (el[i].type == 'file'){
        if(mime){
         QWERTY=el[i]

if (el[i].files){

         str = str + boundary+'\nContent-Disposition: form-data; name="'+el[i].name+'"; filename="'+el[i].value+'"\nContent-Type: '+el[i].files[0].type+'\n\nThis is a Text File with some contents\n';
} else {
 // no files property so we degrade
         var temp=el[i].value.split('\\');
         var v=temp[temp.length-1];
         str = str + boundary+'\nContent-Disposition: form-data; name="'+el[i].name+'"; filename="'+v+'"\n\nThis is a Text File with some contents\n';
}
        } else {
         str = str + el[i].name + "=" + encodeURIComponent(el[i].value) + '&';
        }
       } else {
        if(mime){
         str = str + boundary+'\nContent-Disposition: form-data; name="'+el[i].name+'"\n\n'+el[i].value+'\n';
        } else {
         str = str + el[i].name + "=" + encodeURIComponent(el[i].value) + '&';
        }
       }
      }
     }
     el[i].isclicked=false;
    }
    if(mime){
     return str+boundary+'--\n';
    } else {
     return str.substring(0,str.length-1);
    }
   },