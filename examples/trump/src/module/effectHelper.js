var effectHelper = { // effect module for creating effects i.e. compositions of transitions

	flash: function effect_flash (frameDuration, Nstep, inertSwitch, item) {

		if(item === undefined) { // assume that "this" corresponds to the element item object
			item = this ;
		}

		if(inertSwitch === true || inertSwitch === 'inert' || inertSwitch === 'on') {
			var inertSwitch = true ;
		} else {
			inertSwitch = false ;
		}

		if(inertSwitch) {
			item.inert = true ;
		}

		// console.log('effect flash', 'frameDuration', frameDuration, 'Nstep', Nstep) ;
		var create_transition = step_transition_func('render', frameDuration) ;
		// console.log('effect flash 5') ;
		var blank = function () {} ;
		var valueList = [blank, drawHelper.image] ;
		var loopConfig = {
			Nstep: Nstep,
			position: 0,
			frameDur: frameDuration,
		} ;
		// console.log('effect flash 12') ;

		if(inertSwitch) {
			var callback = function() {
				item.inert = false ;
			} ;
		} else {
			var callback = undefined ;
		}

		var loop = animate_loop (loopConfig, valueList, create_transition, callback) ;

		item.add_transition(loop.animation[0]) ;

		// console.log('effect flash', 'loop', loop) ;

		return loop ;

	},

	shake: function effect_shake(item, xKey, yKey) {

		if(item === undefined) {
			item = this ;
		}

		if(xKey === undefined) {
			xKey = 'x' ;
		}

		if(yKey === undefined) {
			yKey = 'y' ;
		}

		var xShakeMove = [1, -1, -1, 1] ; // [-20, 20, -50, 50, -25, 25, -30, 30] ;
		var yShakeMove = [1, -1, 1, -1] ; // [-75, 75, 50, -50, -40, 40, 25, -25] ;

		var damping = 5 ;
		var dampingFactor = 1 ;
		var Nstep = 9 ;

		xTransition = new Array(Nstep) ;
		yTransition = new Array(Nstep) ;

		for (kstep = 0 ; kstep < Nstep - 1 ; kstep++) {
			xTransition[kstep] = item.transitionSet[xKey](Math.round(Math.random() * xShakeMove[(kstep + $Z.iter) % xShakeMove.length] * damping)) ;
			yTransition[kstep] = item.transitionSet[yKey](Math.round(Math.random() * yShakeMove[(kstep + $Z.iter * 3) % xShakeMove.length] * damping)) ;
			damping *= dampingFactor ;
		}

		xTransition[kstep] = item.transitionSet[xKey](0) ;
		yTransition[kstep] = item.transitionSet[yKey](0) ;

		xTransition = transition_sequence(xTransition)[0] ;
		yTransition = transition_sequence(yTransition)[0] ;

		// console.log('xTransition', xTransition, 'yTransition', yTransition) ;

		var replacementSwitch = true ;
		item.add_transition([xTransition, yTransition]) ;

	},

	image: {

		binary_opacity_filter: function effect_image_binary_opacity_filter (canvas, threshold)	 {

			var context = canvas.getContext('2d') ;
			var image   = context.getImageData (0, 0, canvas.width, canvas.height) ;
			var data    = image.data ;
			var Npel    = data.length / 4 ;
			var offset  = 0 ;
			var opacity = new Array(Npel) ;

			for (var kpel = 0 ; kpel < Npel ; kpel++) {
			  if (data[offset + 3] > 0) {
			    opacity[Npel] = data[offset + 3] ;
			  }
			  offset += 4 ;
			}

			// console.log('opacity', opacity) ;
			if(threshold === undefined) {
				threshold = 68 ;
			}
			offset = 0 ;
			for (var kpel = 0 ; kpel < Npel ; kpel++) {
			  if (data[offset + 3] < threshold) {
			    data[offset + 3] = 0 ;
			  } else {
			    data[offset + 3] = 255 ;
			  }
			  offset += 4 ;
			}    
			context.putImageData(image, 0, 0) ;

		},

		fade: function effect_image_fade(fadeConfig, item) {			

			if(item === undefined) {
				item = this ;
			}

			if(fadeConfig.opacity === undefined) {
				var thresh = 0.5 ;
				if(item.opacity < thresh) {
					fadeConfig.opacity = 0 ;
				} else {
					fadeConfig.opacity = 1 ;
				}
			}

			var newTransition = effectHelper.image.fade_transition(fadeConfig) ;

			// console.log('fade', 'newTransition', newTransition) ;

			item.add_transition(newTransition) ;

		}, // end fade

		fade_transition: function effect_helper_image_fade_transition(fadeConfig) {

			if(fadeConfig.replacementSwitch === undefined) {
				fadeConfig.replacementSwitch = true ;
			}

			var defaultFadeDuration = 1000 ;
			if(fadeConfig.duration === undefined) {
				fadeConfig.duration = defaultFadeDuration ;
			}

			var newTransition = $Z.transition.linear_transition_func('opacity', fadeConfig.duration)(fadeConfig.opacity) ;

			if( fadeConfig.end !== undefined) {
				newTransition.end = fadeConfig.end ;
			}

			if( fadeConfig.child !== undefined) {
				newTransition.child = fadeConfig.child ;
			}

			return newTransition ;

		},

	}, // end image


} ; // end effectHelper