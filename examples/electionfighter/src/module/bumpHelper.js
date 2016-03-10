var bumpHelper = {

  setup: function bump_helper_setup (viz, bumpResponseConfig) {

  	if(bumpResponseConfig === undefined) {
  		bumpResponseConfig = {} ;
  	}
 
    var bumpResponse = { // action config object

      perform: bumpHelper.perform,
      // transition: bumpHelper.deliver, 
      element: viz.player,
      viz: viz,
      // audio: audio,
      sourceType: bumpResponseConfig.sourceType || 'enemy',
      type_check: responseHelper.type_check,
      onSwitch: true,
      performSwitch: false,
      remove_overlap: responseHelper.remove_overlap,

    } ; 

    return bumpResponse ;
    
  },

  collision_check: function bump_helper_collision_check(response) { 

  	if(response === undefined) {
  		response = this ;
  	}

    var col = {
      item: [response.element.item, response.viz.enemy.item],
      width: response.viz.width,
      height: response.viz.height,
    } ;

    collisionDetect.pixelwise(col) ;
    
    // console.log('hitHelper collision_check', 'col', col) ;

    return col.collision.count > 0 ;

  },

	perform: function bump_helper_player_bump(response) {

		if(response === undefined) {
			response = this ;
		}

    response.remove_overlap() ;

    if(response.element.item.image.sourceCollisionImage !== undefined) { // player is in an attack frame
      return ;
    }

    // var xBump = response.element.config.xMove + 1 ;

    // while(bumpHelper.collision_check(response)) {
    //   response.element.item.x -= xBump ;          
    // }

    response.viz.audio.bump.play() ;

    if(response.element.state === 'j' || response.element.state === 'r') {
      response.element.item.remove_transition('x') ;          
    }

    response.element.item.remove_transition('image') ;

    var bumpDuration = 75 ;
    var bumpTransition = step_transition_func('image', bumpDuration)(response.element.sprite.hit[0]) ;
    bumpTransition.end = function() {
      response.element.item.image = response.element.sprite.rest[0] ;
    }

    response.element.item.add_transition(bumpTransition) ;

    var hit = response.element.item.responseSet.hit ;

    hit.healthbar.health -= hit.healthdrop * 0.1 ;
    transitionHelper.update_end_value.call(hit.healthbar.item, 'width', hit.healthbar.health, hit.health_transition) ;
    // } else if(response.viz.player.state === 'r') {
    //   response.viz.player.state = 'l' ;
    //   response.viz.player.callback() ;
    // }

	},
	
} ;