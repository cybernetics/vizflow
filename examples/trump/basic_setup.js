function basic_setup () {
  var spriteImageIndex = 0 ; 
  var dur              = 17 * 4 ;
  var vizWidth         = 240 ;
  var vizHeight        = 320 ;

  var vizCanvas = create_canvas(vizWidth, vizHeight) ; 
  place_viz(vizCanvas) ;
  var vizContext = create_context(vizCanvas) ;
  
  var buttonSize      = 50 ;
  var buttonTileCount = 2 ;
  var buttonRowIndex  = 0 ;
  var buttonOffsetX   = 0 ;
  var buttonOffsetY   = 0 ;
  var buttonPadX      = 0 ;
  var buttonPad       = 10 ;
  var buttonImageUrl  = 'button.png' ;
  var buttonCanvas    = image2canvas(buttonImageUrl) ;
  var buttonConfig    = {
    context: buttonCanvas.getContext('2d'),
    tileCount: buttonTileCount,
    rowIndex: buttonRowIndex,
    tileWidth: buttonSize,
    tileHeight: buttonSize,
    offsetX: buttonOffsetX,
    offsetY: buttonOffsetY,
    padX: buttonPadX,
    bgColor: [0, 255, 0],
    tilePadXl: 0,
    tilePadXr: 0,
  } ;  
  var button          = get_sprite (buttonConfig) ;
  var buttonData      = button[0].getContext('2d').getImageData(0, 0, buttonSize, buttonSize) ; // ImageData object
  var Nbutton         = 4 ;
  var buttonY         = buttonPad ;
  var buttonX         = [] ;

  for(var kButton = 0 ; kButton < Nbutton ; kButton++) {
    buttonX.push(kButton * (buttonPad + buttonSize) + buttonPad * 0.5) ;
  }  

  var uiWidth         = vizWidth ;
  var uiHeight        = buttonSize + buttonPad * 2 ;
  var uiY             = vizHeight - uiHeight ;
  var uiX             = 0 ;
  var uiCanvas        = create_canvas (uiWidth, uiHeight) ;
  var uiContext       = create_context (uiCanvas) ;
  var hiddenUICanvas  = create_canvas (uiWidth, uiHeight) ;
  var hiddenUIContext = create_context (hiddenUICanvas) ;

  for(var kButton = 0 ; kButton < Nbutton ; kButton++) {

    uiContext.drawImage(button[0], buttonX[kButton], buttonY) ; // draw visible button

    var imagek     = image2index(buttonData, kButton) ; // ImageData object

    var tempCanvas = create_canvas(buttonSize, buttonSize) ;

    tempCanvas
      .getContext('2d')
      .clearRect(0, 0, tempCanvas.width, tempCanvas.height) ;
    tempCanvas
      .getContext('2d')
      .putImageData(imagek, 0, 0) ;

    hiddenUIContext.drawImage(tempCanvas, buttonX[kButton], buttonY) ; // draw color-indexed button for color picking

  }

  var hiddenCanvas  = create_canvas(vizWidth, vizHeight) ;
  var hiddenContext = hiddenCanvas.getContext('2d') ;
  hiddenContext.drawImage(hiddenUICanvas, uiX, uiY) ; // draw ui

  var output = {
    height: vizHeight, 
    width: vizWidth,
    dur: dur,
    canvas: vizCanvas, 
    context: vizCanvas.getContext ('2d'),
    hiddenCanvas: hiddenCanvas,
    hiddenContext: hiddenContext,
    button: button,
    buttonX: buttonX,
    buttonY: buttonY,
    uiY: uiY,
  } ;

  return output ;
  
}