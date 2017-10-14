$(document).ready(function(){
	
document.body.onmousedown = function() { return false; } //so page is unselectable

	//Canvas stuff
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();
	var mx, my;
    var pic = new Image();
	var bgpic = new Image(); //background image of ocean
    var balls=[];  
    var gamescreen; //game-screen to create difference screen
	var blowupcounter; //counter for blowup animation for new fish
	var fish=[]; //array of fish
    var detectiondistance;
	var r; //radius
	var pause;
	var fishpic = new RotatingObject("fishleft.png","fishright.png",0,0,362,262); // fishimage , left facing version and right facing version
    var needles=[]; //array of hoos
	var playerDirection; // which way fish faces ( which image it chooses)
    var introcounter;
    var offscreendistance;
    var createNewfish;
	var newfishboolean; // yes or no to declare new fish
	var maxPop; //maximum population for fish in ocean
	var done;
	var instructionspage= new Image;
	var blowuppics=[];
	var counterFORballs;  //off screen counter
	var counterFORneedles; //off screen counter
	var linespeed;
	var linex=[]; //for gamescreen 2 animation
    var intropics=[];
	var intromusic = new Audio("audio/intromusic.mp3");
	var hookimage= new Image(); //image for hook/needle
    var select1 = new Audio("audio/plop.mp3");      //sound for selecting buttons in intro screen
	var oceansounds = new Audio("audio/waves.mp3");
    for(var i=1;i<9;i++){
		var newintropics = new Object('introimages/intro' + i + '.jpg',0,0);
        intropics.push(newintropics);
    }
	for(var i=1;i<6;i++){
        var newblowuppics = new Object('blowupimages/blowup' + i + '.png',250,100);
        blowuppics.push(newblowuppics);
    }
    
	/////////////////////////////////
	////////////////////////////////
	////////	GAME INIT
	///////	Runs this code right away, as soon as the page loads.
	//////	Use this code to get everything in order before your game starts 
	//////////////////////////////
	/////////////////////////////
	function init()
	{
    gamescreen = 0;
    detectiondistance=200;
	hookimage.src = "Imghook.png";
    r=5;
	counterFORneedles=0;
	counterFORballs=0;
	maxPop=10;
	pause=false;
	instructionspage.src = "instructionspage.jpg";
	done=false;
	playerDirection=true;
    introcounter=1;
	fish.push(new CreateFish((w/2)-30,0,90.5,65.5));
	fish[fish.length-1].getFitness();
	fish.push(new CreateFish((w/3)-30,0,90.5,65.5));
    fish[fish.length-1].getFitness();
    createNewfish=false;
    pic.src="startpic.jpg";   
    offscreendistance=-25;    
	linespeed=1;
	bgpic.src= "oceanpic.jpg";
	newfishboolean=false;
	//////////
	///STATE VARIABLES
	
	//////////////////////
	///GAME ENGINE START
	//	This starts your game/program
	//	"paint is the piece of code that runs over and over again, so put all the stuff you want to draw in here
	//	"60" sets how fast things should go
	//	Once you choose a good speed for your program, you will never need to update this file ever again.

	if(typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(paint, 60);
	}

	init();	
	
    

	
	
	
	///////////////////////////////////////////////////////
	//////////////////////////////////////////////////////
	////////	Main Game Engine
	////////////////////////////////////////////////////
	///////////////////////////////////////////////////
    function Object(img,x,y, widthz, heightz){   //function declaring images,x,y,w,h positions and values respectively
        this.init = function(){         //this.init is a function in order to be called on eventually to reset all these vals
            this.Sprite = new Image;
            this.Sprite.src=img;
            this.X = x;
            this.Y  = y;
            this.W = widthz;
            this.H = heightz
            this.VelY = 0;
        }
        
        this.init();
    }
	
	function RotatingObject(img,img2,x,y, widthz, heightz){   //to translate object or rotate the position  
		Object.apply(this, [img,x,y, widthz, heightz]);       //javascript built in command "apply"
        this.init();                                            //init function is called upon from previous function
        
        this.SpriteF = new Image();                         //img2 exists in parameters as of now
        this.SpriteF.src=img2;
        
        this.getImage = function(flipped){                  //getImage locates if flip should be true or false
            if (flipped){
                return this.SpriteF;                        //if true then choose img1
            } else {
                return this.Sprite;                         //if false then choose img2
            }
        }
	}
    function random(min, max) {  //random number generator for RANGE , pulls in max and min finds difference
      var num = Math.floor(Math.random()*(max-min)) + min;
      return num;
    }
    function rand(x){  //random number generator 
        return Math.floor((Math.random() * x) + 1); 
    }
   
    function Ball(){
        this.x = random(0,200);   
        this.y = random(h,h + 100);
        this.velX = 5;
        this.velY =5;
        this.colour ='rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')';
        this.size = random(r,r+20);
		this.offcounter=0;
		this.checkOff= false;
        this.angle= random(-15,15); // choose angle between
        this.draw = function(){
            ctx.beginPath();
            ctx.fillStyle = this.colour;
            ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
    
    function needle(){
		this.x = random(100,w); //continue to create needles
		this.y = random(h,h + 100);
		this.velX = 5;
        this.velY = 5;
		this.width = random(15,20);
		this.height = 40;
		this.offcounter=0;
		this.checkOff= false;
		this.draw = function(){
			ctx.fillStyle = "black";
			ctx.drawImage(hookimage,this.x,this.y,this.width,this.height);
		}
    }
        
    function CreateFish(X,Y,WIDTH,HEIGHT){
        this.chrome=[0,0]; //energy levels good and bad
        this.fitness;
        this.getFitness = function(){  //get the fitness for fish if declared a new CreateFish
			var result;
			result = this.chrome[0] + this.chrome[1];
			this.fitness = result //fitness value of original fish
        }
		this.check = false;
		this.done= false;
		this.needlecounter=0;
		this.ballcounter=0;
        this.x=X;
        this.y=Y;
        this.width=WIDTH;
        this.height=HEIGHT;
        this.draw = function(){
            ctx.drawImage(fishpic.getImage(playerDirection), this.x, this.y, this.width, this.height); //draw fish 
        }
    }   

	function triggered(){ //chooses to move fish in the direction of left or right along x axis. moves based on fitness values
		for(var i=0;i < fish.length; i++){ 
				var chance = fish[i].fitness; //Math.floor((Math.random() * 10) + 1);
				console.log(chance);
				if(chance > 0){ //random moving 
					fish[i].x += 20;
					playerDirection = true;
				}else{
					fish[i].x -= 20;
					playerDirection = false;
				}
		}
	}
		
	
	function breed(){
		var p1 = rand(fish.length); //parent one is a random fish in the array of fish
		var p2 = rand(fish.length); //parent one is a random fish in the array of fish
		console.log("P1: " + p1);
		console.log("P1: " + p2);
		/*
		while(p1 == p2){
			p2= rand(fish.length-1);
		}*/
		
		blowupanimation(); //blow up animation for new fish on screen
		fish.push(new CreateFish((w/2)-30,0,90.5,65.5)); //new fish at these x,y values
		console.log("New fish Created");
		
		for(var i =0;i < fish[0].chrome.length;i++){ //new fish created will have values based on previous fish's performance
			fish[fish.length-1].chrome[i] = (fish[p1].chrome[i] + fish[p2].chrome[i] + fish[i].ballcounter + fish[i].needlecounter)/4 + Math.random();
		}
		
		if(fish[fish.length-1].chrome[0] < 0.1) fish[fish.length-1].chrome[0] =0.1; // restrictions, chrome values cannot be less than 0.1
		if(fish[fish.length-1].chrome[1] < 0.1) fish[fish.length-1].chrome[1] =0.1; // restrictions, chrome values cannot be less than 0.1
		
		fish[fish.length-1].getFitness();  //get new fish's fitness values, run it through test
		console.log(fish[i].chrome);
		//Bubble Sort
		var temp; //temporary variable
        var swapped; //boolean variable
        do {
            swapped = false;
            for (var i=0; i < fish.length-1; i++) {
                if (fish[i].chrome < fish[i+1].chrome) { //order the fish based on if the values are out of order
                    temp = fish[i];
                    fish[i] = fish[i+1]; //swap values 
                    fish[i+1] = temp; //set over written fish's values to temp that was stored before swap
                    swapped = true; //swap is true and process finishes, loops again
                }
            }
        } while (swapped);
        
        if(fish.length > maxPop){ //if the length of the fish's array becomes greater than the max pop in the array(ocean)
            fish.splice(Math.floor(fish.length/3)); //cut the a third of the list that contains the lower values , since now sorted
        }
		
	}
	
    
    function paint(){
		if(gamescreen==0){
            intro();
			intromusic.play(); //audio for intro )
        }
        if(gamescreen == 1){
			for(var i=0;i<10;i++)oceansounds.play();  //music (graphics and audio)

            ctx.drawImage(pic,0,0,w,h); //opacity selection for button press (graphics)
            if(gamescreen == 1 && mx > 145 && mx < 515 && my > 280 && my < 350){
                ctx.globalAlpha=0.5;
                ctx.fillStyle='white';
                ctx.fillRect(142,290,373,60);
                ctx.globalAlpha=1;
                select1.play();
            }
			for(var i = 0; i < 1; i++){								//rectangle across title screen
				linex.push(0);
				ctx.fillStyle = "rgba(255, 255, 255, 0.1)";		//opacity
				ctx.fillRect(linex[i],0,600,480);
				linex[i] += 60 * linespeed;						//move right
				if(linex[i] > w || linex[i] + 400 < 0){			//if line is off canvas
					linespeed= linespeed *-1;						//reverse direction
				}
			}
        }
        if(gamescreen == 2){
			ctx.fillStyle = 'lightblue';
            ctx.fillRect(0,0, w, h);
			ctx.drawImage(instructionspage,0,0,w,h);
		}
        if(gamescreen == 3){
			if(pause){
				return;
			}
            ctx.fillStyle = 'lightblue';
            ctx.fillRect(0,0, w, h);
			ctx.drawImage(bgpic,0,0,w,h);
			ctx.fillStyle = 'lightblue';
            ctx.fillRect(590,440, 100, 100);
			ctx.fillStyle = 'white';
			ctx.fillText("PAUSE",595,465); //pause text
			ctx.fillStyle = 'black';			
			ctx.font="12px arial";
			ctx.fillText("Fish# " + fish.length,590,20);
			
			ctx.fillStyle = 'purple';
			ctx.globalAlpha=0.5;
			ctx.fillRect(100,375,450,150);
			ctx.globalAlpha=1;
			
			ctx.fillStyle = 'white';
			ctx.fillText("Good Energy",100,375); //text (titles) for values at bottom of screen
			ctx.fillText("Bad Energy",200,375);
			ctx.fillText("Balls",300,375);
			ctx.fillText("Hooks",400,375);
			ctx.fillText("Fitness",500,375);
			
            while(balls.length < 50) { //create only 50 balls and push them into array
                var ballpusher = new Ball();
                balls.push(ballpusher);
            }
			
            while(needles.length < 50){ //create only 50 needles and push them into array
				var needlepusher = new needle();
				needles.push(needlepusher);
			}
			
            for(var i = 0; i < balls.length; i++) { //displaying balls and movement by drawing 
                balls[i].draw();
                //balls[i].x += balls[i].velX * Math.cos(balls[i].angle * Math.PI / 180);  
                balls[i].y -= balls[i].velY;//* Math.sin(balls[i].angle * Math.PI / 180); // movement along y-axis
            }
			
			for(var i=0;i<needles.length;i++){ //displaying needles movement by drawing
				needles[i].draw();
				needles[i].y -= needles[i].velY;  //movement along y axis
			}
            for(var i=0;i < fish.length ; i++){   //displaying ai fish by drawing function
                fish[i].draw();	   
            }

            for(var i=0; i < balls.length;i++){ //collision detection for balls with fish
				for(var j=0;j<fish.length;j++){	
					if(balls[i].x - r > fish[j].x && balls[i].x < fish[j].x + fish[j].width){  //collision with ai
						if(balls[i].y > fish[j].y && balls[i].y < fish[j].y + fish[j].height){
							balls[i].y = offscreendistance; //change position of ball if collision with ai fish
							fish[j].check = true;
							fish[j].fitness+=20;   //increase fitness value for fish if ball is encountered
							if(fish[j].check == true){
								fish[j].ballcounter++; //count up how many balls it has encountered
								triggered();
								fish[j].check = false;	
							}
						}
					}
				}
            }
			for(var i=0; i < needles.length;i++){   //collision detection for balls with fish
				for(var j=0;j<fish.length;j++){	
					if(needles[i].x - r > fish[j].x && needles[i].x < fish[j].x + fish[j].width){  //collision with ai
						if(needles[i].y > fish[j].y && needles[i].y < fish[j].y + fish[j].height){
							needles[i].y = offscreendistance; //change position of ball if collision with ai fish
							fish[j].check = true;
							fish[j].fitness-=20; //decrease fitness val for needles
							if(fish[j].check == true){
								fish[j].needlecounter++;  //count up how many needles it has encountered
								triggered();
								fish[j].check = false;
							}
						}
					}
				}
            }
			for(var i = 0; i< 1;i++){
				console.log("Balls: " + fish[i].ballcounter);
				console.log("Needles: " + fish[i].needlecounter);
				console.log("Fitness Calc: " + fish[i].fitness);
				console.log("");
			}
			
			for(var i=0; i < balls.length;i++){ // off screen counter for balls
				if(balls[i].y < 0 && balls[i].y > -100){
					counterFORballs+=1;
					balls[i].y = -100;
				}
			}
			for(var i=0; i < needles.length;i++){ // off screen counter for needles
				if(needles[i].y < 0 && needles[i].y > -100){
					counterFORneedles+=1;
					needles[i].y = -100;
				}
			}
			
			if(counterFORballs >= 50){
				for(var i=0; i < balls.length;i++){
					balls[i].y = random(h,h + 100);
				}
				for(var i=0;i<fish.length; i++){
					fish[i].x=10000;  //move old fish way off screen so it does not collect any hooks or food
					fish[i].width=20;   //shrink size just as a safety precaution
					fish[i].length=20;
				}	
				createNewfish=true;
				if(createNewfish == true){ //breed a new fish if needed because parents/ parent has finished their fitness test.
					breed();
					createNewFish=false;
					console.log(createNewFish);
				}
				counterFORballs = 0;
			}
			
			if(counterFORneedles >= 50){   //if 50 needles/hooks are off screen
				for(var i=0; i < needles.length;i++){
					needles[i].y = random(h,h + 100); //move hooks back down
				}
			
				counterFORneedles = 0; //set back to zero because all hooks are on screen again
			}
			
			console.log("Counterballs: " + counterFORballs);
			console.log("Counterneedles: " + counterFORneedles);
			
			
			console.log("# OF FISH: " + fish.length);
			
			for(var i =0 ; i < fish.length-1; i ++){  //displaying chrome values, and fitness on screen
				ctx.fillStyle= 'white';
				ctx.fillText(round2(fish[i].chrome[0]), 100, 395 + (i*14));
				ctx.fillText(round2(fish[i].chrome[1]), 200, 395 + (i*14));
				ctx.fillText(round2(fish[i].needlecounter), 300,395 + (i*14));
				ctx.fillText(round2(fish[i].ballcounter), 400,395 + (i*14));
				ctx.fillText(round2(fish[i].fitness), 500 ,395 + (i*14));
			}
			
			
		}
		
	}////////////////////////////////////////////////////////////////////////////////END PAINT/ GAME ENGINE
	function round2(d){   //rounds numbers 
		return Math.floor(d*100)/100;
	}
	
	
	var bCount=0;                       //animation for blow up effect when needle collides
    function blowupanimation(){
        if(blowupcounter <= 5){
           ctx.drawImage(blowuppics[blowupcounter].Sprite, blowuppics[blowupcounter].X + test.X, blowuppics[blowupcounter].Y + test.Y,80,80);
            if(bCount <= 0) {
                blowupcounter++;
				bCount = 2;
            }else bCount--;
        }else{    
            ctx.drawImage(blowuppics[4].Sprite, blowuppics[4].X, blowuppics[4].Y,80,80);
        }
        setTimeout(intro,120);      
    }
	
	var sCount = 0;   //animation for intro to game
    function intro(){
        if(introcounter <= 7){ //7 pics in sequence
           ctx.drawImage(intropics[introcounter].Sprite, intropics[introcounter].X, intropics[introcounter].Y,w,h);
			if(sCount <= 0) {
				introcounter++;
				sCount = 0.1;
			}else sCount--;
        }else{    
            ctx.drawImage(intropics[7].Sprite, intropics[7].X, intropics[7].Y,w,h);
        }
        
       setTimeout(intro,100000000/120);
    }
	////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////
	/////	MOUSE LISTENER 
	//////////////////////////////////////////////////////
	/////////////////////////////////////////////////////
	





	/////////////////
	// Mouse Click
	///////////////
	canvas.addEventListener('click', function (evt){
		if(gamescreen==0 && mx> 0 && my>0){ //beginning screen with animation for panesart
            gamescreen=1; 
            intropics=[];
		}else if(gamescreen == 1 && mx > 145 && mx < 515 && my > 280 && my < 350){ //advanced if start button is pressed
            gamescreen=2;
        }else if(gamescreen == 2 && mx> 0 && my > 0){	//click anywhere on screen to advance
            gamescreen=3;
        }
		
		if(gamescreen ==3 && mx > 600 && my > 440){  //pause button
			pause= !pause;
		}
		
	      
	}, false);

	
	

	canvas.addEventListener ('mouseout', function(){pause = true;}, false);
	canvas.addEventListener ('mouseover', function(){pause = false;}, false);

      	canvas.addEventListener('mousemove', function(evt) {
        	var mousePos = getMousePos(canvas, evt);

		mx = mousePos.x;
		my = mousePos.y;

      	}, false);


	function getMousePos(canvas, evt) 
	{
	        var rect = canvas.getBoundingClientRect();
        	return {
          		x: evt.clientX - rect.left,
          		y: evt.clientY - rect.top
        		};
      	}
      

	///////////////////////////////////
	//////////////////////////////////
	////////	KEY BOARD INPUT
	////////////////////////////////



	window.addEventListener('keydown', function(evt){
		var key = evt.keyCode;
		
	//p 80
	//r 82
	//1 49 
	//2 50
    //left = 37
    //right = 39
		if (key == 37){ //left
            //playerDirection = true;
			/*for(var i=0;i<balls.length;i++){
                //balls[i].x -= balls[i]. velX; 
            }*/
        }
        if (key == 39){ //right
            //playerDirection = false;
			/*for(var i=0;i<balls.length;i++){
                balls[i].x += balls[i].velX;  
				
            }*/
        }
			if(key == 82){ //restart when R is pressed
				init();
				gamescreen =1;
			}
	}, false);




})