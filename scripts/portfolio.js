let _status = 0;

function createCanvasDirections(partToShow) {
  /*input: a string, one of the following options: left, right, top, bottom. Marks which part of the canvas 
    we want to show.
    Based in the current left (currentLeft) and top (currentTop) position, produces the strings 
    to be added to @keyframes rule in the movePage() function.
    output: an array of two strings, the first one to be used with the from keyword, and the
    second one with the to keyword.*/
  let fromString, toString;
  // If the canvas is positioned so that the middle part is displayed
  if (partToShow === 'stay') {
    fromString = 'visibility: visible;';
    toString = 'visibility: visible;'
    console.log('currentCanvas: ' + currentLeft + ' ' + currentTop);
    return [fromString, toString];}
  if (currentLeft === -winWidth && currentTop === -winHeight) {
    switch (partToShow) {
      // Producing strings based on direction, while resetting current left and top positions
      case 'left':
        fromString = 'left: ' + currentLeft + 'px;';
        currentLeft = 0;
        toString = 'left: ' + currentLeft + 'px;';
        break;
      case 'top':
        fromString = 'top: ' + currentTop + 'px;';
        currentTop = 0;
        toString = 'top: ' + currentTop + 'px;';
        break;
      case 'right':
        fromString = 'left: ' + currentLeft + 'px;';
        currentLeft = -(winWidth * 2);
        toString = 'left: ' + currentLeft + 'px;';
        break;
      case 'bottom':
        fromString = 'top: ' + currentTop + 'px;';
        currentTop = -(winHeight * 2);
        toString = 'top: ' + currentTop + 'px;';
        break;
    }
    // If the canvas is currently positioned so that the top or bottom part is displayed
  } else if (currentLeft === -winWidth) {
    if (currentTop === 0) {
      if (partToShow === 'bottom') {
        fromString = 'top: ' + currentTop + 'px;';
        currentTop = -winHeight;
        toString = 'top: ' + currentTop + 'px';
      }
    } else if (currentTop === -(winHeight * 2)) {
      if (partToShow === 'top') {
        fromString = 'top: ' + currentTop + 'px;';
        currentTop = -winHeight;
        toString = 'top: ' + currentTop + 'px';
      }
    }
    // If the canvas is currently positioned so that the left or right part is displayed
  } else if (currentTop === -winHeight) {
    if (currentLeft === 0) {
      if (partToShow === 'right') {
        fromString = 'left: ' + currentLeft + 'px;';
        currentLeft = -winWidth;
        toString = 'left: ' + currentLeft + 'px;';
      }
    } else if (currentLeft === -(winWidth * 2)) {
      if (partToShow === 'left') {
        fromString = 'left: ' + currentLeft + 'px;';
        currentLeft = -winWidth;
        toString = 'left: ' + currentLeft + 'px;';
      }
    }
  }
  console.log('currentCanvas: ' + currentLeft + ' ' + currentTop);
  return [fromString, toString];
}

function createContentOutDirections(partToShow) {
  /*input: a string, one of the following options: left, right, top, bottom. Marks which part of the canvas 
    we want to show.
    Based on the input, produces the strings to be added to @keyframes rule in the movePage() function, in order to move
    the current content out of the display.
    output: an array of two strings, the first one to be used with the from keyword, and the
    second one with the to keyword.*/
  if (partToShow === 'stay') {return ['border:none', 'border:none'];}
  let fromString, toString;
  if (partToShow === 'left') {
    fromString = 'left: 0px;';
    toString = 'left: ' + winWidth + 'px;';
  } else if (partToShow === 'right') {
    fromString = 'left: 0px;';
    toString = 'left: ' + -winWidth + 'px;';
  } else if (partToShow === 'top') {
    fromString = 'top: 0px;';
    toString = 'top: ' + winHeight + 'px;';
  } else if (partToShow === 'bottom') {
    fromString = 'top: 0px;';
    toString = 'top: ' + -winHeight + 'px;';
  }
  return [fromString, toString];
}

function createContentInDirections(partToShow) {
  /*input: a string, one of the following options: left, right, top, bottom. Marks which part of the canvas 
    we want to show.
    Based on the input, produces the strings to be added to @keyframes rule in the movePage() function, in order to move
    the relevant content into the display.
    output: an array of two strings, the first one to be used with the from keyword, and the
    second one with the to keyword.*/
  if (partToShow === 'stay') {return ['border:none', 'border:none'];}
  let fromString, toString;
  if (partToShow === 'left') {
    fromString = 'left: ' + -winWidth + 'px;';
    toString = 'left: 0px;';
  } else if (partToShow === 'right') {
    fromString = 'left: ' + winWidth + 'px;';
    toString = 'left: 0px;';
  } else if (partToShow === 'top') {
    fromString = 'top: ' + -winHeight + 'px;';
    toString = 'top: 0px;';
  } else if (partToShow === 'bottom') {
    fromString = 'top: ' + winHeight + 'px;';
    toString = 'top: 0px;';
  }
  return [fromString, toString];
}

function movePage(partToShow, contentOutContainerId, contentInContainerId, animated=true) {
  /*input: 
    partToShow: a string, one of the following options: left, right, top, bottom. Marks which part of the canvas 
    we want to show.
    contentOutContainerId: id of content-container to move out and remove
    contentInContainerId: id of content-container to move in and set to be displayed
    Creates a new style sheet that uses animation to remove the current content-container and replace it with the relevant one.
    Also moves the canvas together with the content to create a smooth transition between parts of the page.*/

  // Remove any stylesheet created earlier
  let toRemove = document.getElementById('moveCanvas');
  if (toRemove) {
    toRemove.parentNode.removeChild(toRemove);
  }
  // Cloning existing canvas
  let previousCanvas = document.getElementById('canvas-image');
  let nextCanvas = previousCanvas.cloneNode(true);
  // Copying image from existing canvas to new one
  //nextCanvas.getContext('2d').drawImage(previousCanvas, 0, 0);
  // Replacing existing canvas with new one
  previousCanvas.parentNode.replaceChild(nextCanvas, previousCanvas);
  // Creating arrays of strings to insert into @keyframes rules
  let canvasDirections = createCanvasDirections(partToShow);
  let contentOutDirections = createContentOutDirections(partToShow);
  let contentInDirections = createContentInDirections(partToShow);
  let displayProp = (animated) ? 'block' : 'none';
  // Creating stylesheet
  let style = document.createElement('style');
  style.type = 'text/css';
  style.id = 'moveCanvas';
  let keyframes ='\
    @-webkit-keyframes canvasMove {from {' +
    canvasDirections[0] +
    '} to {' +
    canvasDirections[1] +
    '} }\
    @-moz-keyframes canvasMove {from {' +
    canvasDirections[0] +
    '} to {' +
    canvasDirections[1] +
    '} }\
    @keyframes canvasMove {from {' +
    canvasDirections[0] +
    '} to {' +
    canvasDirections[1] +
    '} }\
    @-webkit-keyframes containerOutMove {from {' +
    contentOutDirections[0] +
    '} to {' +
    contentOutDirections[1] +
    ' display: none;} }\
    @-moz-keyframes containerOutMove {from {' +
    contentOutDirections[0] +
    '} to {' +
    contentOutDirections[1] +
    ' display: none;} }\
    @keyframes containerOutMove {from {' +
    contentOutDirections[0] +
    '} to {' +
    contentOutDirections[1] +
    ' display: none;} }\
    @-webkit-keyframes containerInMove {from {' +
    contentInDirections[0] +
    '} to {' +
    contentInDirections[1] +
    ' display: block;} }\
    @-moz-keyframes containerInMove {from {' +
    contentInDirections[0] +
    '} to {' +
    contentInDirections[1] +
    ' display: block;} }\
    @keyframes containerInMove {from {' +
    contentInDirections[0] +
    '} to {' +
    contentInDirections[1] +
    ' display: block;} }\
canvas, #canvas-image {\
        position: absolute;\
        animation-name: canvasMove;\
        -webkit-animation-name: canvasMove;\
        -moz-animation-name: canvasMove;\
        animation-duration: 1s;\
        -webkit-animation-duration: 1s;\
        -moz-animation-duration: 1s;\
        animation-timing-function: ease-in\
        -webkit-animation-timing-function: ease-in\
        -moz-animation-timing-function: ease-in\
        animation-fill-mode: forwards;\
        -webkit-animation-fill-mode: forwards;\
        -moz-animation-fill-mode: forwards;\
        width: 300vw;\
        height: 300vh;\
        left: ' +
    currentLeft +
    'px;\
        top: ' +
    currentTop +
    'px;\
    }\
    #' +
    contentOutContainerId +
    ' {\
        position: absolute;\
        display: ' + displayProp + ';\
        animation-name: containerOutMove;\
        -webkit-animation-name: containerOutMove;\
        -moz-animation-name: containerOutMove;\
        animation-duration: 1s;\
        -webkit-animation-duration: 1s;\
        -moz-animation-duration: 1s;\
        animation-timing-function: ease-in\
        -webkit-animation-timing-function: ease-in\
        -moz-animation-timing-function: ease-in\
        animation-fill-mode: forwards;\
        -webkit-animation-fill-mode: forwards;\
        -moz-animation-fill-mode: forwards;\
        width: 100vw;\
        height: 100vh;\
    }\
    #' +
    contentInContainerId +
    ' {\
        position: absolute;\
        display : block;\
        animation-name: containerInMove;\
        -webkit-animation-name: containerInMove;\
        -moz-animation-name: containerInMove;\
        animation-duration: 1s;\
        -webkit-animation-duration: 1s;\
        -moz-animation-duration: 1s;\
        animation-timing-function: ease-in\
        -webkit-animation-timing-function: ease-in\
        -moz-animation-timing-function: ease-in\
        animation-fill-mode: forwards;\
        -webkit-animation-fill-mode: forwards;\
        -moz-animation-fill-mode: forwards;\
        width: 100vw;\
        height: 100vh;\
    }';
  // Insert keyframes variable to style sheet
  style.innerHTML = keyframes;
  // Add stylesheet to head
  document.getElementsByTagName('head')[0].appendChild(style);
}

// Functions to initiate movement and animation
function moveLeft() {
  // Move page left
  movePage('left', 'main-container', 'contact-container');
  _status = 4;
  console.log(_status);
}

function moveRight() {
  movePage('right', 'main-container', 'work-container');
  _status = 2;
  console.log(_status);
}

function moveUp() {
  movePage('top', 'main-container', 'about-container');
  _status = 1;
  console.log(_status);
}

function moveDown() {
  movePage('bottom', 'main-container', 'blog-container');
  _status = 3;
  console.log(_status);
}

function moveBackFromLeft() {
  movePage('right', 'contact-container', 'main-container');
  _status = 0;
  console.log(_status);
}

function moveBackFromRight() {
  movePage('left', 'work-container', 'main-container');
  _status = 0;
  console.log(_status);
}

function moveBackFromUp() {
  movePage('bottom', 'about-container', 'main-container');
  _status = 0;
  console.log(_status);
}

function moveBackFromDown() {
  movePage('top', 'blog-container', 'main-container');
  _status = 0;
  console.log(_status);
}

function resize() {
  redraw();

  switch (_status) {
    case 0:
      movePage('stay','phantom', 'main-container', false);
      break;
    case 1:
      movePage('stay','main-container', 'about-container', false);
      break;
    case 2:
      movePage('stay','main-container', 'work-container', false);
      break;
    case 3:
      movePage('stay','main-container', 'blog-container', false);
      break;
    case 4:
      movePage('stay','main-container', 'contact-container', false);
      break;
  }
}