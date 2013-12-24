(function($){
  var methods = {
	// "CONST" stuff
	pluginPrefix				: 'sneaky-odometrize'
	,defaultOptions				: {
		value			: 0
		,digitsCount	: 5
		,hideIndex		: []
		,animationSpeed	: 200
	}
	
	// methods
	
	/**
	 * Initialization method. Sets up all stuff.
	 * 
	 * @param {Object} @optional options Config object. Is not required, but handy.
	 * @returns {jQuery} obj Returns itself
	 */
	,init						: function( options ){
	    options = options || {};
		// set options
		options = methods._applyIf(
			options
			,methods.defaultOptions
		);
		
		// set options on element
		for ( var optionsName in options ){
			this.data( optionsName, options[optionsName] );
		}
		
		// render things
		this.addClass( methods.getOuterClass() );
		this.html( methods.getInnerOdometerHtml() );
		
		// set theme
		this.addClass( methods.pickThemeByName(options.theme) );
		
		// begin the job, set html with passed (or default) options
		this.sneakyOdometrize('updateHtml');
		
	    return this;
	}
	
	,incValue	: function(value){
		var queue
			,currentValue;
		
		if ( this.sneakyOdometrize('isAnimating') ){
			queue = this.data('queue') || [];
			queue.push({
				fn		: 'incValue'
				,args	: [value]
			});
			
			this.data('queue', queue);			
			return this;
		}
		
	    currentValue = parseInt( this.data('value'), 10 );

	    this.data( 'prevValue', currentValue );
	    this.data( 'value', currentValue + (value || 1) );
	    
	    this.sneakyOdometrize('updateHtml');
		
		return this;
	}
	
	,setValue	: function(value){
		if ( this.sneakyOdometrize('isAnimating') ){		
			return this;
		}
		
	    this.data( 'prevValue', parseInt( this.data('value'), 10 ) );
	    this.data( 'value', value );
		
		this.sneakyOdometrize('updateHtml');
		
		return this;
	}
	
	,updateHtml	: function(noAnimate){
	    var digits = this.sneakyOdometrize('zeroizeMe');
	    
	    if ( !this.data('spansReady') ){
			this.sneakyOdometrize('spanizeMe', digits.length);
	    }

	    this.sneakyOdometrize('updateEachSpan', digits, noAnimate);
		
		return this;
	}

	,updateEachSpan	: function(digits, noAnimate){
		var digit
			,diff
			,k
			,oldDigit
			,$span
			,spanOuterHeight
			,oneDigitContainerHeight
			,$nextSpan
			,$digitSpans
			,$clonedDigit
			,digitHtml	= this.sneakyOdometrize('getSpanDigitHtml')
			,cloneContainerHtml	= this.sneakyOdometrize('getSpanDigitCloneContainerHtml')
			,$spans		= this.sneakyOdometrize('getDigitContainers')
			,me			= this
			,animations	= 0
			,animationSpeed = this.sneakyOdometrize('getAnimationSpeed')
			,easing		= 'swing';

		if ( $spans.length < digits.length){
			this.sneakyOdometrize('spanizeMe', digits.length - $spans.length, true);
			$spans	= this.sneakyOdometrize('getDigitContainers');
		}

		for ( var i = 0, l = digits.length; i < l; i++ ){
			diff = 0;
			k = 1;
			digit = digits[i];
			$span = $( $spans.get(i) );
			oldDigit = $span.data('value') || 0;
			oneDigitContainerHeight = $span.outerHeight();

			if (digit !== oldDigit){
				$nextSpan = $span;
				
				diff = digit - oldDigit;
				diff = (diff < 0) ? ( 10 - Math.abs(diff) ) : diff;

				while (k <= diff){
					$clonedDigit = $(digitHtml);
					$clonedDigit.addClass( methods.getAbstractCloneClass() );
					$clonedDigit.html( oldDigit + k < 10 ? ( oldDigit + k ) : ( (oldDigit + k) % 10 ) );
					$nextSpan.prepend( $clonedDigit );

					k++;
				}
				
				$digitSpans = $nextSpan.find( '.' + methods.getDigitClass() );
				$nextSpan.css({
					top: -$nextSpan.outerHeight() + oneDigitContainerHeight
				});

				$nextSpan.data('value', digit);
				
				if (!noAnimate){
					easing = !!this.data('queue') ? 'linear' : 'swing';
					
					this.sneakyOdometrize('incAnimations');					
					$nextSpan.animate(
						{
							top: 0
						}
						,animationSpeed
						,easing
						,function() {
							me.sneakyOdometrize('decAnimations');
							methods.clearClones( $(this) );
							me.sneakyOdometrize('proceedQueue');
						}
					);
				}else{
					$nextSpan.css({top: 0});
					methods.clearClones($digitContainer);
					me.sneakyOdometrize('proceedQueue');
				}
				
			}
	    }
		
		return this;
	}
	
	,clearClones	: function($where){
		$where.find( '.' + methods.getDigitClass() + ':gt(0)' ).remove();
		$where.find( '.' + methods.getDigitClass() ).removeClass( methods.getAbstractCloneClass() );
	}
	
	,incAnimations	: function(){
		var animations = parseInt( this.data('animations') || 0, 10 );
		
		animations++;
		this.data('animations', animations);
		
		return this;
	}
	
	,decAnimations	: function(){
		var animations = parseInt( this.data('animations') || 0, 10 );
		
		animations--;
		animations = animations >= 0 ? animations : 0;
		this.data('animations', animations);
		
		return this;
	}
	
	,isAnimating	: function(){
		return !!this.data('animations');
	}
	
	,proceedQueue	: function(){
		if ( this.sneakyOdometrize('isAnimating') ){
			return this;
		}
		
		if ( this.data('stopAnimation') ){
			this.data( 'queue', [] );
			return this;
		}
		
		var queue		= this.data('queue') || []
			,firstTask	= queue.splice(0, 1);
		
		if ( firstTask[0] ){
			this.sneakyOdometrize( [firstTask[0].fn, firstTask[0].args] );
		}
		
		return this;
	}
	
	/**
	 * Create span for each digit
	 * sets spanReady flag to true
	 * @param {Number} count - Digits count
	 * @param {Boolean} append - Whether to clear ot nor
	 */
	,spanizeMe	: function(count, append){
	    var spanHtml	= this.sneakyOdometrize('getSpanHtml')
			,hideIndex	= this.data('hideIndex')
			,$odometer	= this.sneakyOdometrize('getOdometer')
			,$containers;
			
		if (!append){
			$odometer.html('');
		}

	    for ( var i = 0; i < count; i++ ){
			$odometer.prepend( spanHtml );
	    }
		var $spans = this.sneakyOdometrize('getSpanContainers');

		$spans.each(function(index){
			var checkIndex	= $spans.length - index - 1
				,$span		= $spans.eq(index);
				
			if ( index >= 0 && $.inArray(checkIndex, hideIndex) >= 0 ){
				$span.addClass( methods.getHiddenClass() );
			}else if( $span.hasClass( methods.getHiddenClass() ) ){
				$span.removeClass( methods.getHiddenClass() );
			}
		});
		
		if ( this.data('markLast') === true ){
			$containers = this.find('.' + methods.getContainerClass() );
			$containers.removeClass( methods.getLastMarkClass() );
			$containers.addClass('ololo-class');
			$containers.filter('*:visible').last().addClass( methods.getLastMarkClass() );
		}
		
	    this.data('spansReady', true);
		
		return this;
	}
	
	/**
	 * 
	 * @param {Number} value @optional
	 * @returns {Array}
	 */
	,zeroizeMe	: function(value){
	    var currentValue	= parseInt( value || this.data('value'), 10 )
		,divider
		,digits				= []
		,zeroes				= []
		,digit
		,z					= this.data('digitsCount')
		,$spans				= this.sneakyOdometrize('getSpanContainers')
		,valueDigitsCount;
		
		if ( !$.isNumeric(currentValue) ){
			$.error( 'Type mismatch in jQuery.sneakyOdomerize.methods.zeroizeMe' );
			return [];
		}
		
				
		digits = String(currentValue).split(''); 
		valueDigitsCount = digits.length;
		
		if ($spans && $spans.length > valueDigitsCount){
			valueDigitsCount = $spans.length;
		}
		
		z = z >= valueDigitsCount ? z : valueDigitsCount;
	    z = z || 1;		
		
	    for (z--; z >= 0; z-- ){
			if ( digits[z] ){
				digits[z] = parseInt( digits[z] );
			}else{
				zeroes.push(0);
			}
	    }
		
		digits = zeroes.concat(digits);
		
	    return digits;
	}
	
	,pickThemeByName		: function(themeName){
		themeName = themeName || 'default';
		
		var themes = {
			'default'	: methods.pluginPrefix + '-theme-default'
			,dark		: methods.pluginPrefix + '-theme-dark'
		};
		
		return themes[themeName];
	}
	
	/**
         * Copies all properties of config to object if they don't exist.
		 * @private
         * @param {Object} object The receiver
         * @param {Object} config The source
         * @return {Object} returns obj
         */
	,_applyIf				: function(object, config) {
		var property;

		if (object) {
			for (property in config) {
				if (object[property] === undefined) {
					object[property] = config[property];
				}
			}
		}

		return object;
	}
	
	// jQuery objects (plugin components) getters
	//##########################################################################
	,getOdometer	: function(){
		return this.children('.' + methods.getOdometerClass() );
	}
	
	,getSpanDigits	: function(){
		return this.find('span.sneaky-odometrize-digit:not(.' + methods.getAbstractCloneClass() +', .sneaky-odometrize-helper)');
	}

	,getSpanContainers	: function(){
		return this.sneakyOdometrize('getOdometer').children('span.sneaky-odometrize-container');
	}

	,getDigitContainers	: function(){
		return this.find('.sneaky-odometrize-container > .sneaky-odometrize-digit-container:not(.sneaky-odometrize-clone)');
	}
	
	// HTML getters
	//##########################################################################
	,getSpanHtml	: function(){
		return '<span class="' + methods.getContainerClass() + '">'
					+ '<span class="' + methods.getDigitContainerClass() + '-helper-shadow"></span>'
					+'<span class="' + methods.getDigitContainerClass() + '">'
						+ methods.getSpanDigitHtml()
					+'</span>'
					+ '<span class="' + methods.getDigitContainerClass() + '-helper-background"></span>'
					+ this.sneakyOdometrize('getHelperHtml')
				+'<span>';
	}

	,getHelperHtml	: function(){
		return '<span class="' + methods.getDigitClass() + ' ' + methods.getHelperClass() + '">0</span>';
	}

	,getSpanDigitHtml	: function(){
		return '<span class="' + methods.getDigitClass() + '">0</span>';
	}

	,getSpanDigitCloneContainerHtml	: function(){
		return '<span class="' + methods.getDigitContainerClass() + '"></span>';
	}
	
	,getInnerOdometerHtml				: function(){
		return '<div class="' + methods.getOdometerClass() + '">0</div>';
	}
	
	//class getters
	//##########################################################################
	,getOuterClass	: function(){
		return methods.pluginPrefix + '-odometer-outer';
	}
	
	,getOdometerClass: function(){
		return methods.pluginPrefix + '-odometer';
	}
	
	,getContainerClass	: function(){
		return methods.pluginPrefix + '-container';
	}
	
	,getDigitContainerClass	: function(){
		return methods.pluginPrefix + '-digit-container';
	}
	
	,getDigitClass	: function(){
		return methods.pluginPrefix + '-digit';
	}
	
	,getHelperClass	: function(){
		return methods.pluginPrefix + '-helper';
	}
	
	,getLastMarkClass	: function(){
		return methods.pluginPrefix + '-last-mark';
	}
	
	,getHiddenClass	: function(){
		return methods.pluginPrefix + '-hidden';
	}
	
	,getAbstractCloneClass	: function(){
		return methods.pluginPrefix + '-clone';
	}
	
	
	// options getters
	//##########################################################################
	,getAnimationSpeed		: function(){
		return this.data('animationSpeed');
	}
	
  };

    $.fn.sneakyOdometrize = function( method ){
		var callArgs;

		if ( $.isArray(method) && method.length > 1){
			callArgs = method[1];
			method = method[0];
		}else{
			callArgs = Array.prototype.slice.call( arguments, 1 );
		}

        if ( methods[method] ) {
            return methods[ method ].apply( this, callArgs);
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
          $.error( 'Method ' +  method + ' doesn\'t exist for jQuery.sneakyOdomerize' );
            return false;
        }
    };

})(jQuery);