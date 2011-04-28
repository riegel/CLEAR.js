<?php
 $ajaxrequest = $_POST['ajaxrequest'] || $ajaxrequest = $_GET['ajaxrequest'];
 $a=$_POST['myname'];
 if ($ajaxrequest=="TRUE") {
  $ajaxrequest=NULL;
  echo "//clear\n";
  echo "CLEAR.f.$('message').innerHTML='This Was deliverd via AJAX! Hello \"<b>$a</b>\"';\n";
  exit();
 }
?>


<!-- Engine: Custom PERL or PHP or Python or ??? -->
<!doctype html>
<html lang="en">
 <head>
  <meta charset="utf-8">
  <title>PHP Demo</title>
  <link rel="stylesheet" href="/apps/clear/demonstration/style.css" type="text/css" media="screen" />
  <link rel="shortcut icon" type="image/x-icon" href="/apps/clear/demonstration/images/favicon.ico"/>
  <link rel="icon" type="image/png" href="/apps/clear/demonstration/images/favicon.png"/>
  <script src="http://clearjs.org/apps/clear/clear.js"></script>
 </head>
 <body>
  <div id="page-container">
   <div id="demo">
    <a href="http://clearjs.org">Home</a><br>&nbsp;<br>
    <h1>PHP Demo</h1>
    <i>I don't code using PHP but this should give a simple example.</i><br>
    <form action="demo.php" method="post" data-AJAX>
     <input type="text" name="myname" data-AJAX>
     <input type="submit" name="mybutton" value="submit">
    </form>
    <br><a href="demo.php" data-AJAX>Try this (AJAX)</a> | <a href="demo.php">Try this (NOAJAX)</a><br>&nbsp;<br>
    <div id="message">Message Area</div>
   </div>
  </div>
 </body>
</html>