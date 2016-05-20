<!DOCTYPE html>
<?php
$path = '/var/www/vhosts/feeldeeng.v.shared.ru/httpdocs/include';
set_include_path(get_include_path() . PATH_SEPARATOR . $path);
require 'htmlInserts.inc';
?>
<html>
    <head>
        <title>Odometer Plugin</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <link rel="stylesheet" href="css/styles.css">
        <link rel="stylesheet" href="bs_bloknotus/css/bootstrap.min.css">
        <link rel="stylesheet" href="bs_bloknotus/css/bootstrap-theme.min.css">
		<link rel="stylesheet" href="/css/myplugins/sneaky-odometrize/sneaky-odometrize-1.0.css">

        <script type="text/javascript" src="/js/vendor/jquery/203.js"></script>
        <script type="text/javascript" src="bs_bloknotus/js/bootstrap.min.js"></script>        
        <script type="text/javascript" src="/js/myplugins/sneaky-odometrize-1.0.js"></script>

		<script type="text/javascript" src="js/main.js"></script>
        <meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' name='viewport' />
        <meta name="viewport" content="width=device-width" />
    </head>
    <body>
        <p>
            This is a jQuery-plugin to setup a counter-like thing.
        </p>
        <div class="size-1 preview">
			<p class="caption">Odometer size 1 16px font</p>
			<pre>
{
	markLast	: true
	,hideIndex	: []
	,animationSpeed : 1000
}
			</pre>
			<div id="odometer1">				
			</div>
			<div>
				<button class="btn btn-default" data-action="incValue" data-index="1">inc value</button>
				<button class="btn btn-default" data-action="setValue" data-index="1">set value</button>
				<button class="btn btn-default" data-type="timer">start/stop timer-counter</button>
			</div>
        </div>

		<div class="size-2 preview">
			<p class="caption">Odometer size 2 30px</p>
			<pre>
{
	markLast : false
	,digitsCount : 7
	,value : 666
	,hideIndex : []
	,animationSpeed : 300
}
			</pre>
			<div id="odometer2">				
			</div>
			<div>
				<button class="btn btn-default" data-action="incValue" data-index="2">inc value</button>
				<button class="btn btn-default" data-action="setValue" data-index="2">set value</button>
			</div>
        </div>
		
		<div class="size-3 preview">
			<p class="caption">Odometer size 3 10px</p>
			<p class="caption">Little sizes need tweaking. @TODO later</p>
			<pre>
{
	markLast : false
	,digitsCount : 4
	,hideIndex : [2]
	,animationSpeed : 1500
}
			</pre>
			<div id="odometer3">				
			</div>
			<div>
				<button class="btn btn-default" data-action="incValue" data-index="3">inc value</button>
				<button class="btn btn-default" data-action="setValue" data-index="3">set value</button>
			</div>
        </div>
    </body>
</html>