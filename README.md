CLEAR.js
===
*lightweight, unobtrusive, case hardened AJAX library for HTML/OS*

An "invisible" AJAX Library. Add AJAX to any link, form, or form element on any HTML page

With your normal forms, elements, or links...

    <form action="doform">
    <input type="text" name="myname">
    <input type="text" name="myemail">
    <a href="page.html">Link</a>

Simply add AJAX...

    <form action="doform" AJAX>
    <input type="text" name="myname" AJAX>
    <input type="text" name="myemail" AJAX="mousedown">
    <a href="page.html" AJAX>Link</a>

Your HTML/OS pages look like this

    <<
    expand file="/system/clearimage/DLL.lib" /expand
    >>
    <!doctype html>
    <html lang="en">
     <head>
      <meta charset="utf-8">
      <title>CLEAR.js Page</title>
      <script src="/apps/clear/clear.js"></script>
     </head>
     <body>
      <a href="doit" AJAX>Link</a>
      <div id="thehtmlelement">Hello World!</a>
     </body>
    </html>
    <<overlay doit
     writeHTML('thehtmlelement','Hello AJAX World!')
     endOVERLAY()
    >>

####Requires clear Image App Manager

Get the App Manager <a href="http://clearimageonline.com/home/appmanager.bb">here</a>.

Setup a free server to test over at <a href="http://learnhtmlos.org">http://learnhtmlos.org</a>