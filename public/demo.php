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
  <script src="http://clearjs.org/apps/clear/clear.js"></script>
 </head>
 <body>
  <a href="demo.php">RELOAD</a><hr>
  <form action="demo.php" method="post" data-AJAX>
   <input type="text" name="myname" data-AJAX>
   <input type="submit" name="mybutton" value="submit">
  </form>
  <hr><a href="demo.php" data-AJAX>Try this (AJAX)</a> | <a href="demo.php">Try this (NOAJAX)</a>
  <div id="message">Message Area</div><hr>
 </body>
</html>