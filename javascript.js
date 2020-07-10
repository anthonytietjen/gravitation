var mainIcon;
var positionMarkerVertical;
var positionMarkerHorizontal;
var contentPane;
var xLocationLabel;
var yLocationLabel;
var sounds_AntiGravity_Start;
var Sounds_Laser;

var useGravity = true;
var wrapEdges = false;

var gravityStrength = 10;
var gravityStepSize = 1;
var moveStepSize = 4;

var laserIsBeingFired = false;

var currentKeyPressed = "";

var keys = {
	Left : 37,
	Right : 39,
	Up : 38,
	Down : 40,
	Enter : 13,
	Space : 32,
	g : 71,
	LeftControl : 17,
	BackSpace : 8,
	s : 83,
	d : 68,
	f : 70,
	e : 69,
	w : 87
}

var keyCodeLeft = 37;
var keyCodeRight = 39;
var keyCodeUp = 38;
var keyCodeDown = 40;
var keyCodeEnter = 13;
var keyCodeSpace = 32;
var keyCodeG = 71;
var keyCodeLeftControl = 17;
var keyCodeBackSpace = 8;
var keyCodeS = 83;
var keyCodeD = 68;
var keyCodeF = 70;
var keyCodeE = 69;

var timerAntiGravityCountDown;
var antiGravityTimeout = "5"; // seconds

function init(){
	// Get references to all the controls that are used
	mainIcon = document.getElementById('MainIcon');
	positionMarkerVertical = document.getElementById('PositionMarkerVertical');
	positionMarkerHorizontal = document.getElementById('PositionMarkerHorizontal');
	laserBeamVertical = document.getElementById('LaserBeamVertical');
	laserBeamHorizontal = document.getElementById('LaserBeamHorizontal');
	contentPane = document.getElementById('ContentPane');
	currentKeyPressedLabel = document.getElementById('CurrentKeyPressedLabel');
	antiGravityStatusLabel = document.getElementById('AntiGravityStatusLabel');
	wrapEdgesStatusLabel = document.getElementById('WrapEdgesStatusLabel');
	xLocationLabel = document.getElementById('XLocationLabel');
	yLocationLabel = document.getElementById('YLocationLabel');
	gamePane = document.getElementById('GamePane');
	sounds_AntiGravity_Start = document.getElementById("Sounds_AntiGravity_Start");
	sounds_Laser = document.getElementById("Sounds_Laser");
	
	// Size the postion markers according to the size of the player icon
	positionMarkerHorizontal.style.width = mainIcon.clientWidth;
	positionMarkerVertical.style.height = mainIcon.clientHeight;
	
	// Default HUD display
	updateAntiGravityStatusLabel();
	updateWrapEdgesStatusLabel();
	
	// Default position
	setKeyPressed(keyCodeEnter); // Reset position
	
	// Start the timer that detects movement and applies gravity
	startProcessPositionTimer();
	
	// Show the game
	gamePane.style.visibility = '';
}

function startProcessPositionTimer(){
	setInterval(function(){processPosition()}, gravityStrength);
}

function processPosition(){

	// If a laser is not being fired,
	if(!laserIsBeingFired){
	
		// If antigravity is not turned on and the user is not pressing Up
		if(useGravity && currentKeyPressed != keyCodeUp){
			
			if(getCurrentTop() < (contentPane.clientHeight - mainIcon.clientHeight)){
				move("down", gravityStepSize);
			}

		}
	
		// Move in the direction specified
		movementHandler(currentKeyPressed);
	
	}
	
}

function movementHandler(keyCode){
	
	if(keyCode == keyCodeLeft){
		move("left", moveStepSize);
	}
	else if(keyCode == keyCodeRight){
		move("right", moveStepSize);
	}
	else if(keyCode == keyCodeUp){
		move("up", moveStepSize);
	}
	else if(keyCode == keyCodeDown){
		move("down", moveStepSize);
	}
}

function toggleWrapEdges(){
	wrapEdges = !wrapEdges;
	updateWrapEdgesStatusLabel();
}
function updateWrapEdgesStatusLabel(){
	wrapEdgesStatusLabel.innerHTML = (wrapEdges) ? "On" : "Off";
	contentPane.className = (wrapEdges) ? "contentPaneWrapEdgesYes" : "contentPaneWrapEdgesNo";
}

function fireLaser(direction){
	if(!laserIsBeingFired){
		alignPositionMarkers();
	
		var doFireHorizontalLaserBeam;
		var doFireVerticalLaserBeam;
		
		sounds_Laser.play();
		
		// Determine the origination points of the laser
		originationPointHorizontal = (mainIcon.style.left.replace('px', '')*1) + (mainIcon.clientWidth / 2);
		originationPointVertical = (mainIcon.style.top.replace('px', '')*1) + (mainIcon.clientHeight / 2);
		
		// Default to not show either beam
		doFireHorizontalLaserBeam = false;
		doFireVerticalLaserBeam = false;
		
		// Tell the timer that the laser is being fired so it won't move the player until the laser stops
		laserIsBeingFired = true; // Global variable
		
		// Position the lasers
		if(!direction){
			laserBeamHorizontal.style.width = 'auto';
			laserBeamVertical.style.height = 'auto';
			laserBeamHorizontal.style.right = '0px';
			laserBeamHorizontal.style.left = '0px';
			laserBeamVertical.style.bottom = '0px';
			laserBeamVertical.style.top = '0px';
			laserBeamVertical.style.left = getCurrentLeft() + (mainIcon.clientWidth / 2) - (laserBeamVertical.clientWidth / 2);
			laserBeamHorizontal.style.top = getCurrentTop() + (mainIcon.clientHeight / 2) - (laserBeamHorizontal.clientHeight / 2);
	
			doFireHorizontalLaserBeam = true;
			doFireVerticalLaserBeam = true;
		}
		else if(direction == "left"){
			// Vertical position
			laserBeamHorizontal.style.top = getCurrentTop() + (mainIcon.clientHeight / 2) - (laserBeamHorizontal.clientHeight / 2);
			
			// Horizontal position
			laserBeamHorizontal.style.left = '0px';
			laserBeamHorizontal.style.right = '';
			laserBeamHorizontal.style.width = originationPointHorizontal;
			
			doFireHorizontalLaserBeam = true;
		}
		else if(direction == "right"){
			// Vertical position
			laserBeamHorizontal.style.top = getCurrentTop() + (mainIcon.clientHeight / 2) - (laserBeamHorizontal.clientHeight / 2);
			
			// Horizontal position
			laserBeamHorizontal.style.left = '';
			laserBeamHorizontal.style.right = '0px';
			laserBeamHorizontal.style.width = contentPane.clientWidth - originationPointHorizontal;
			
			doFireHorizontalLaserBeam = true;
		}
		else if(direction == "up"){
			// Horizontal position
			laserBeamVertical.style.left = getCurrentLeft() + (mainIcon.clientWidth / 2) - (laserBeamVertical.clientWidth / 2);
			
			// Vertical position
			laserBeamVertical.style.bottom = '';
			laserBeamVertical.style.top = '0px';
			laserBeamVertical.style.height = originationPointVertical;
			
			doFireVerticalLaserBeam = true;
		}	else if(direction == "down"){
			// Horizontal position
			laserBeamVertical.style.left = getCurrentLeft() + (mainIcon.clientWidth / 2) - (laserBeamVertical.clientWidth / 2);
			
			// Vertical position
			laserBeamVertical.style.bottom = '0px';
			laserBeamVertical.style.top = '';
			laserBeamVertical.style.height = contentPane.clientHeight - originationPointVertical;
			
			doFireVerticalLaserBeam = true;
		}
		
		// Fire vertical laser
		if(doFireVerticalLaserBeam){
			laserBeamVertical.style.backgroundColor = "red";
			laserBeamVertical.style.display = "block";
			setTimeout(function(){laserBeamVertical.style.backgroundColor = "pink";}, 100);
			setTimeout(function(){laserBeamVertical.style.backgroundColor = "#FFDDDD";}, 200);
			setTimeout(
				function(){
					laserBeamVertical.style.display = "none";
					laserIsBeingFired = false;
					},
					300
			);
		}
		
		// Fire horizontal laser
		if(doFireHorizontalLaserBeam){
			laserBeamHorizontal.style.backgroundColor = "red";
			laserBeamHorizontal.style.display = "block";
			setTimeout(function(){laserBeamHorizontal.style.backgroundColor = "pink";}, 100);
			setTimeout(function(){laserBeamHorizontal.style.backgroundColor = "#FFDDDD";}, 200);
			setTimeout(
				function(){
					laserBeamHorizontal.style.display = "none";
					laserIsBeingFired = false;
				},
				300
			);
		}
	}
}

function move(direction, stepSize){
	
	if (!direction){
		mainIcon.style.left = (contentPane.clientWidth / 2) - (mainIcon.clientWidth / 2);
		mainIcon.style.top = (contentPane.clientHeight / 4) - (mainIcon.clientHeight);
		
		positionMarkerVertical.style.display = 'none';
		positionMarkerHorizontal.style.display = 'none';
	}
	else if(direction == "up"){
		mainIcon.style.top = getCurrentTop() - (stepSize);
		// Wrap to other side of screen if needed
		if(getCurrentTop() < 0 - mainIcon.clientHeight){
			if (wrapEdges){
				mainIcon.style.top = contentPane.clientHeight;
			}
			else{
				//positionMarkerHorizontal.style.display = 'block';
			}
		}
		else{
			positionMarkerHorizontal.style.display = 'none';
		}
	}
	else if(direction == "down"){
		mainIcon.style.top = getCurrentTop() + (stepSize);
		
		// Wrap to other side of screen if needed
		if(getCurrentTop() > contentPane.clientHeight){
			if (wrapEdges){
				mainIcon.style.top = 0 - mainIcon.clientHeight;
			}
			else{
				//positionMarkerHorizontal.style.display = 'block';
			}
		}
		else{
			positionMarkerHorizontal.style.display = 'none';
		}
	}
	else if(direction == "right"){
		mainIcon.style.left = getCurrentLeft() + (stepSize);
		
		// Wrap to other side of screen if needed
		if (getCurrentLeft() > contentPane.clientWidth){
			if (wrapEdges){
				mainIcon.style.left = 0 - mainIcon.clientWidth;
			}
			else{
				//positionMarkerVertical.style.display = 'block';
			}
		}
		else{
			positionMarkerVertical.style.display = 'none';
		}
	}
	else if(direction == "left"){
		mainIcon.style.left = getCurrentLeft() - (stepSize);
		
		// Wrap to other side of screen if needed
		if (getCurrentLeft() < (0 - mainIcon.clientWidth)){
			if (wrapEdges){
				mainIcon.style.left = contentPane.clientWidth;
			}
			else{
				//positionMarkerVertical.style.display = 'block';
			}
		}
		else{
			positionMarkerVertical.style.display = 'none';
		}
	}
	
	if (
		(getCurrentLeft() < (0 - mainIcon.clientWidth)) || 
		(getCurrentLeft() > contentPane.clientWidth) ||
		(getCurrentTop() > contentPane.clientHeight) || 
		(getCurrentTop() < 0 - mainIcon.clientHeight))
	{
		alignPositionMarkers();
	}
	
	// Can't update position labels on screen with the timer because it slows it way down
	//xLocationLabel.value = mainIcon.style.left;
	//yLocationLabel.value = mainIcon.style.top;
	
}

function alignPositionMarkers(){

	// Top / Bottom
	//if(positionMarkerHorizontal.style.display == "block"){
		if((getCurrentTop() + mainIcon.clientHeight) < 0){
			positionMarkerHorizontal.style.bottom = '';
			positionMarkerHorizontal.style.top = '0px';
			positionMarkerHorizontal.style.display = 'block';
		} else if(getCurrentTop() > contentPane.clientHeight){
			positionMarkerHorizontal.style.top = '';
			positionMarkerHorizontal.style.bottom = '0px';
			positionMarkerHorizontal.style.display = 'block';
		} else {
			positionMarkerHorizontal.style.display = 'none';
		}
	//}
	
	// Left / Right
	//if(positionMarkerVertical.style.display == "block"){
		if((getCurrentLeft() + mainIcon.clientWidth) < 0){
			positionMarkerVertical.style.right = '';
			positionMarkerVertical.style.left = '0px';
			positionMarkerVertical.style.display = 'block';
		} else if(getCurrentLeft() > contentPane.clientWidth){
			positionMarkerVertical.style.left = '';
			positionMarkerVertical.style.right = '0px';
			positionMarkerVertical.style.display = 'block';
		} else {
			positionMarkerVertical.style.display = 'none';
		}
	//}

	positionMarkerVertical.style.top = getCurrentTop();
	positionMarkerHorizontal.style.left = getCurrentLeft();
}

function getCurrentTop(){
	currentTop = mainIcon.style.top.replace("px", "") * 1;
	
	if(!currentTop){
		currentTop = mainIcon.clientTop;
	}
	
	return currentTop;
}

function getCurrentLeft(){
	currentLeft = mainIcon.style.left.replace("px", "") * 1;

	if(!currentLeft){
		currentLeft = mainIcon.clientLeft;
	}
	
	return currentLeft;
}

function setKeyPressed(keyCode){
	//console.log(keyCode);
	
	if(currentKeyPressed != keyCode){
		currentKeyPressed = keyCode;
		
		mainIcon.style.border = "0px";
	
		// Move to start position
		if(keyCode == keyCodeEnter){
			move(null, null);
		}
		else if(keyCode == keyCodeSpace){
			fireLaser();
		}
		// If they hit G, and antiGravity is not already in effect
		else if (keyCode == keyCodeG && useGravity){
			sounds_AntiGravity_Start.play();
		
			// Turn on antigravity
			useGravity = false;
			
			mainIcon.className = (useGravity) ? '' : 'AntiGravityInEffect';
			
			//clearInterval(timerAntiGravityCountDown);
			
			// Update the label
			updateAntiGravityStatusLabel();
			
			// Start ticking down on the anti gravity clock
			//timerAntiGravityCountDown = setInterval(countDownAntiGravity, 1000);
			
		}
		// Wrap Edges
		else if (keyCode == keys.w){
			toggleWrapEdges();
		}
		// Fire laser
		else if(keyCode == keys.s){
			fireLaser("left")
		}
		else if(keyCode == keys.d){
			fireLaser("down")
		}
		else if(keyCode == keys.f){
			fireLaser("right")
		}
		else if(keyCode == keys.e){
			fireLaser("up")
		}
		else if (keyCode == keys.Up){
			//mainIcon.style.borderBottom = "7px dotted red";
		}
		else if (keyCode == keys.Down){
			//mainIcon.style.borderTop = "7px dotted red";
		}
		else if (keyCode == keys.Left){
			//mainIcon.style.borderRight = "7px dotted red";
		}
		else if (keyCode == keys.Right){
			//mainIcon.style.borderLeft = "7px dotted red";
		}
		
		currentKeyPressedLabel.innerHTML = currentKeyPressed;
	}
	//keyPressHandler(keyCode);
}

function updateAntiGravityStatusLabel(){
	antiGravityStatusLabel.innerHTML = useGravity ? "Off" : antiGravityTimeout;
}

function countDownAntiGravity(){
	if(antiGravityStatusLabel.innerHTML == "1"){
		// Stop the countdown timer
		clearInterval(timerAntiGravityCountDown);
		
		// Tell it to use gravity again
		useGravity = true;
		
		// Take away the visual style from the player icon
		mainIcon.className = '';
		
		// Update the anti gravity gravity label
		updateAntiGravityStatusLabel();
	}
	// Show the countdown timer status
	else{
		antiGravityStatusLabel.innerHTML = (antiGravityStatusLabel.innerHTML*1) - 1;
	}
}