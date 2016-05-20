$(document).ready(comeon);

function comeon(){
	$('#odometer1').sneakyOdometrize({
		markLast			: true
		,hideIndex			: []
		,animationSpeed		: 1000
	});
	
	$('#odometer2').sneakyOdometrize({
		markLast			: false
		,digitsCount		: 7
		,value				: 666
		,hideIndex			: []
		,animationSpeed		: 300
	});
	
	$('#odometer3').sneakyOdometrize({
		markLast			: false
		,digitsCount		: 4
		,hideIndex			: [2]
		,animationSpeed		: 1500
	});
	
}

$(document).on('click', 'button[data-type=timer]', function(){
	var $this = $(this)
		,attr = $(this).attr('data-interval');
	
	if ( attr !== 0 && !attr ){
		attr = setInterval(function(){
			$('#odometer1').sneakyOdometrize('incValue');
		}, 1000);
		
		$(this).attr('data-interval', attr);
	}else{
		clearInterval(attr);
		$(this).attr('data-interval', '');
	}
});

$(document).on('click', 'button[data-action]', onActionButtonClick);

var controllers = {
	odometer1		: {
		getIncValue		: function(){
			return 1;
		}
		,getSetValue		: function(){
			return Math.floor( Math.random() * 10000 );
		}
	}
	,odometer2		: {
		getIncValue		: function(){
			return 459;
		}
		,getSetValue		: function(){
			return Math.floor( Math.random() * 100000 );
		}
	}
	,odometer3	: {
		getIncValue		: function(){
			return 5;
		}
		,getSetValue		: function(){
			return Math.floor( Math.random() * 100 );
		}
	}
};


function onActionButtonClick(){
	var $button		= $(this)
		,action		= $button.attr('data-action')
		,odometerId	= 'odometer' + $button.attr('data-index')
		,methodGetter = 'get' + action.replace(
				/(^.)/gim
				,function(w){
					return w.toUpperCase();
				}
			);
	
	if ( controllers[odometerId] ){
		$('#' + odometerId).sneakyOdometrize(
				action
				,controllers[odometerId][methodGetter]()
		);
	}
	
}