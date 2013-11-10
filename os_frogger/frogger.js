
var WIDTH                 = 900
  , HEIGHT                = 500

  , WINDOW_WIDTH          = window.innerWidth
  , WINDOW_HEIGHT         = window.innerHeight

  , FROG_SPEED            = 0.2
  , FROG_FILL             = '#66cc00' //new Gradient({ endX:0, endY:80, colorStops:[[1, "#339900"], [0, "#66cc00"]] }); //'#00cc00';
  , FROG_LEGS_FILL        = '#66cc00'
  , FROG_WIDTH            = 30
  , FROG_HEIGHT           = 30
  , FROG_DEATH_MESSAGES   = ["SPLAT!","OUCH, THAT ONE HURT","...AND YOU'RE DEAD","BEEEEEEEP! OUTTA THE WAY!","YEP, YOU ARE DEAD"]
  , FROG_SAFE_MESSAGES    = ["BOOM-SHAK-A-LACKA!","GOOOOAAAAALLLLLLLL!","ONE SMALL STEP FOR FROG...","SCORE!","YOU MADE IT!","YOU'RE SAFE"]

  , CAR_DEFAULT_SPEED     = 0.1
  , CAR_SIZE              = 15
  , CAR_FILL              = '#a9a9a9'
  , CAR_EXPLODE           = 'rgba(240,195,96,0.5)'
  , CAR_FILL_OPACITY      = 1
  , CAR_STROKE            = '#464646'
  , CAR_STROKE_OPACITY    = 0.25
  , CAR_STROKE_WIDTH      = 2

  , PLAIN_CAR_WIDTH       = 80
  , PLAIN_CAR_HEIGHT      = 20
  , PLAIN_CAR_SPEED       = 0.08
  , TRUCK_WIDTH           = 110
  , TRUCK_HEIGHT          = 20
  , TRUCK_SPEED           = 0.06
  , RACECAR_WIDTH         = 80
  , RACECAR_HEIGHT        = 20
  , RACECAR_SPEED         = .12

  , FROG_WATER_HEIGHT     = 230
  , FROG_RECEIVER_HEIGHT  = 25
  , FROG_RECEIVER_SPACE   = 5
  , FROG_RECEIVER_TOTAL_HEIGHT = FROG_RECEIVER_SPACE + FROG_RECEIVER_HEIGHT

  , NUM_FROG_RECEIVERS    = 5 // "Lilys"

  , POINTS_FOR_SAFE_FROG  = 100
  , POINTS_FOR_CLEARED_LEVEL = 250
  , POINTS_INITIAL = 0
  , LIVES_INITIAL = 100

  , GAME_BG_COLOR         = '#222'
  , EVENT_NORTH = 0
  , EVENT_EAST = 1
  , EVENT_SOUTH = 2
  , EVENT_WEST = 3
  , EVENT_NONE = 4
  , dbidToPid = {};


NodesCollided = function(obj1, obj2){
    //     ^       ^
    //  <--F--> <--C-->
    //     ^       ^

    if (obj1.x + obj1.w < obj2.x) {
      return false;
    }
    
    
    //     ^
    // <-- C -->
    //     ^
    //     ^
    // <-- F -->
    //     ^
    if (obj1.y + obj1.h < obj2.y) {
      return false;
    }
    
    
    //     ^       ^
    //  <--C--> <--F-->
    //     ^       ^
    if (obj1.x > obj2.x + obj2.w) {
      return false;
    }
    
    //     ^
    // <-- F -->
    //     ^
    //     ^
    // <-- C -->
    //     ^
    if (obj1.y > obj2.y + obj2.h){
      return false;
    }

    return true;
}

Frog = function(root, player, x, y) {

  this.isAlive = true;
    this.speed = FROG_SPEED; // TODO: temporary, just so they will be noticed.
    this.initial_points = 0;
    this.points = 0;
  this.animatePosition = 1;

    this.initialize = function(root, player, x, y) {

        this.node = new Rectangle(FROG_WIDTH, FROG_HEIGHT);
        this.node.w = FROG_WIDTH;
        this.node.h = FROG_HEIGHT;
        this.node.x = x - FROG_WIDTH/2;
        this.node.y = y - FROG_HEIGHT/2;        
        this.node.zIndex = 1;

        // Reset the x/y since frog position is relative to the node wrapper:
        x = 0;
        y = FROG_HEIGHT;
        var xPart = FROG_WIDTH/10;
        var yPart = FROG_HEIGHT/10;
                
    this.frog = new Path([
        ['moveTo',           [x+4*xPart,y-yPart*9]],
      ['quadraticCurveTo', [x+5*xPart,y-FROG_HEIGHT,  x+6*xPart,y-yPart*9]],
      ['quadraticCurveTo', [x+9*xPart,y-yPart*4,  x+6*xPart,y-yPart*2]],
      ['quadraticCurveTo', [x+5*xPart,y-yPart,    x+4*xPart,y-yPart*2]],
      ['quadraticCurveTo', [x+1*xPart,y-yPart*4,  x+4*xPart,y-yPart*9]],
    ],{
      fill: this.player.color,
      fillOpacity:1
    });
    
    this.frogRightArm = new Path([
      ['moveTo', [x+7*xPart,y-yPart*4]],
      ['lineTo', [x+9*xPart,y-yPart*6]],
      ['lineTo', [x+8*xPart,y-yPart*7]],
      ['lineTo', [x+8*xPart,y-yPart*6]],
      ['lineTo', [x+6*xPart,y-yPart*4]],
      ['lineTo', [x+7*xPart,y-yPart*4]],
    ],{
      fill: this.player.color,
      fillOpacity:1
    });
    
    this.frogLeftArm = new Path([
      ['moveTo', [x+3*xPart,y-yPart*4]],
      ['lineTo', [x+xPart,y-yPart*6]],
      ['lineTo', [x+2*xPart,y-yPart*7]],
      ['lineTo', [x+2*xPart,y-yPart*6]],
      ['lineTo', [x+4*xPart,y-yPart*4]],
      ['lineTo', [x+3*xPart,y-yPart*4]],
    ],{
      fill: this.player.color,
      fillOpacity:1
    });

    this.frogLegs = new Path([
      ['moveTo', [x+6*xPart,y-yPart*3]],
      ['lineTo', [x+7*xPart,y-yPart]],
      ['lineTo', [x+6*xPart,y]],
      ['lineTo', [x+7*xPart,y]],      
      ['lineTo', [x+9*xPart,y-yPart*2]],
      ['lineTo', [x+8*xPart,y-yPart*3]],
      ['lineTo', [x+7*xPart,y-yPart*4]],

      ['moveTo', [x+4*xPart,y-yPart*3]],
      ['lineTo', [x+3*xPart,y-yPart]],
      ['lineTo', [x+4*xPart,y]],
      ['lineTo', [x+3*xPart,y]],
      ['lineTo', [x+xPart,y-yPart*2]],
      ['lineTo', [x+2*xPart,y-yPart*3]],
      ['lineTo', [x+3*xPart,y-yPart*4]],
    ],{
      fill: this.player.color,
      fillOpacity:1
    });

    this.frog.fillOpacity = 1;

    this.node.append(this.frog);
    this.node.append(this.frogRightArm);
    this.node.append(this.frogLeftArm);
    this.node.append(this.frogLegs);

    this.root.append(this.node);
  } 

  this.up = function() {
    if(this.node.y > -3 && player.moveCounter > 0) {
      this.node.y -= this.node.h*this.speed;
      player.moveCounter -= this.node.h*this.speed;
    }
  }
  
  this.down = function() {
    if (this.node.y < HEIGHT && player.moveCounter > 0){
      this.node.y += this.node.h*this.speed;
      player.moveCounter -= this.node.h*this.speed;
    }
  }
  
  this.moveLeft = function() {
    if (this.node.x > 0 && player.moveCounter > 0){
      this.node.x -= this.node.w*this.speed;
      player.moveCounter -= this.node.w*this.speed;
    }
  }
  
  this.moveRight = function() { 
    if (this.node.x < WIDTH && player.moveCounter > 0){
      this.node.x += this.node.w*this.speed;
      player.moveCounter -= this.node.w*this.speed;
    }
  }

  this.runOver = function() {
    this.frog.animateTo('fillOpacity', 0, 200, 'sine');
    this.frogRightArm.animateTo('fillOpacity', 0, 200, 'sine');
    this.frogLeftArm.animateTo('fillOpacity', 0, 200, 'sine');
    this.frogLegs.animateTo('fillOpacity', 0, 200, 'sine');
  }
  
  this.destroy = function(){
    this.node.removeSelf();
  }

  this.handleMove = function(){

    if (this.animatePosition==1){
      this.frogRightArm.y -= 3;
      this.frogLeftArm.y += 3;
      this.frogLegs.y += 4;
      this.animatePosition = 0;
    }else{
      this.frogRightArm.y += 3;
      this.frogLeftArm.y -= 3;
      this.frogLegs.y -= 4;
      this.animatePosition = 1;
    }

  }

  this.animate = function(t, dt){
    if(this.player.moveCounter == 0) {
      this.player.keyState = EVENT_NONE;
    } else if (this.player.keyState == EVENT_NORTH){

      this.handleMove();
      this.up();

    } else if (this.player.keyState == EVENT_SOUTH){

      this.handleMove();
      this.down();

    } else if (this.player.keyState == EVENT_WEST){

      this.handleMove();
      this.moveLeft();

    } else if (this.player.keyState == EVENT_EAST){

      this.handleMove();
      this.moveRight();

    }
  }

    this.player = player;
    this.root = root;
    this.initialize(root, player, x, y);
}


CarFactory = {

  makeCar: function(type,x,y,direction,color){
    switch(type){
      case "TRUCK":
        return this._makeTruck(x,y,direction,color);
        break;
      case "RACECAR":
        return this._makeRaceCar(x,y,direction,color);
        break;
      case "PLAINCAR":
        return this._makePlainCar(x,y,direction,color);
        break;
      case "TREELOG":
        return this._makeLog(x,y,direction,color);
        break;
    }
  },

  _makeCarWrapper: function(x,y,w,h){
    var wrapper = new Rectangle(w, h);
        wrapper.x = x;
        wrapper.y = y;
        wrapper.w = w;
        wrapper.h = h;
        return wrapper;
  },
  
  _makeTruck: function(x, y, direction,color){
    var base_w = TRUCK_WIDTH
      , base_h = TRUCK_HEIGHT
      , car = this._makeCarWrapper(x,y,base_w,base_h);

    // update w and x based on direction
    var w = (direction=="LEFT") ? base_w : -base_w;
    var h = base_h;

    x = (direction=="LEFT") ? 0 : base_w;

    var hPart = h/8,
     wPart = w/11;

    var path1 = new Path([
        ['moveTo', [x   ,0]],
        ['lineTo', [x+1*wPart  ,0]],
        ['quadraticCurveTo', [x+1*wPart,hPart,x+2*wPart,hPart]],
        ['lineTo', [x+3*wPart  ,2*hPart]],
        ['quadraticCurveTo', [x+3*wPart  ,1*hPart,x+4*wPart  ,0]],

        ['lineTo', [x+2*w/11  ,hPart]],
        ['lineTo', [x+2*w/11  ,0]],
        ['lineTo', [x+4*w/11  ,0]],
        ['lineTo', [x+4*w/11  ,hPart]],
        ['lineTo', [x+5*w/11  ,hPart]],
        ['lineTo', [x+5*w/11  ,0]],
        ['lineTo', [x+w   ,0]],
        ['lineTo', [x+w   ,h]],
        ['lineTo', [x+5*w/11  ,h]],
        ['lineTo', [x+5*w/11  ,7*hPart]],
        ['lineTo', [x+4*w/11  ,7*hPart]],
        ['lineTo', [x+4*w/11  ,h]],
        ['lineTo', [x+2*w/11  ,h]],
        ['lineTo', [x+2*w/11  ,7*hPart]],
        ['lineTo', [x     ,6*hPart]],
        ['lineTo', [x     ,2*hPart]]
        ],{
          fill: color
        })

    path1.w = w;
    path1.h = h;
    car.append(path1)
    return car;
  },
  
  _makeRaceCar: function(x, y, direction,color){
    var base_w = RACECAR_WIDTH
      , base_h = RACECAR_HEIGHT
      , car = this._makeCarWrapper(x,y,base_w,base_h)

    // Reinitialize w / h / x, based on direction
    var w = (direction=="LEFT") ? base_w : -base_w;
    var h = base_h;

    x = (direction=="LEFT") ? 0 : base_w;

    //Car body
    var path1 = new Path([
        ['moveTo', [x+0,h]],
        ['lineTo', [x+15*w/120,h]],
        ['lineTo', [x+15*w/120,55*h/70]],
        ['lineTo', [x+100*w/120,55*h/70]],
        ['lineTo', [x+100*w/120,h]],
        ['lineTo', [x+w,h]],
        ['lineTo', [x+w,0]],
        ['lineTo', [x+100*w/120,0]],
        ['lineTo', [x+100*w/120,15*h/70]],
        ['lineTo', [x+15*w/120,15*h/70]],
        ['lineTo', [x+15*w/120,0]],
        ['lineTo', [x+0,0]]
      ],{
        fill:color
      });

    car.append(path1);

    //Bottom Left Tire
    var path2 = new Path([
        ['moveTo', [x+w/6,55*h/70]],
        ['lineTo', [x+w/3,55*h/70]],
        ['lineTo', [x+w/3,65*h/70]],
        ['lineTo', [x+w/6,65*h/70]],
      ],{
        fill:"#000"
      });

    car.append(path2);

    //Top Left Tire
    var path3 = new Path([
        ['moveTo', [x+w/6,5*h/70]],
        ['lineTo', [x+w/3,5*h/70]],
        ['lineTo', [x+w/3,15*h/70]],
        ['lineTo', [x+w/6,15*h/70]]
    ],{
      fill:"#000"
    });

    car.append(path3);

    //Top Right Tire
    var path4 = new Path([
        ['moveTo', [x+7*w/12,15*h/70]],
        ['lineTo', [x+7*w/12,0]],
        ['lineTo', [x+3*w/4,0]],
        ['lineTo', [x+3*w/4,15*h/70]]
    ],{
      fill:"#000"
    });

    car.append(path4)

    //Bottom Right Tire
    var path5 = new Path([
        ['moveTo', [x+7*w/12,55*h/70]],
        ['lineTo', [x+3*w/4,55*h/70]],
        ['lineTo', [x+3*w/4,h]],
        ['lineTo', [x+7*w/12,h]]
    ],{
      fill:"#000"
    });

    car.append(path5)

    //Racing Strip
    var path6 = new Path([
        ['moveTo', [x+0,3*h/7]],
        ['lineTo', [x+w,3*h/7]],
        ['lineTo', [x+w,4*h/7]],
        ['lineTo', [x+0,4*h/7]]
    ],{
      fill:"#2E3192"
    });

    car.append(path6)

    //Windshield
    var path7 = new Path([
        ['moveTo', [x+w/2,2*h/7]],
        ['lineTo', [x+2*w/3,2*h/7]],
        ['lineTo', [x+2*w/3,5*h/7]],
        ['lineTo', [x+w/2,5*h/7]]
    ],{
      fill:"#000"
    });

    car.append(path7)

    return car
  },

    // Bittle car
  _makePlainCar: function(x, y, direction,color){
    var base_w = PLAIN_CAR_WIDTH
      , base_h = PLAIN_CAR_HEIGHT
      , car = this._makeCarWrapper(x,y,base_w,base_h);

    // Reinitialize w / h / x, based on direction
    var w = (direction=="LEFT") ? base_w : -base_w
      , h = base_h;

    x = (direction=="LEFT") ? 0 : base_w;

    var wPart = w/7
      , hPart = h/8;

    //Car body
    var path1 = new Path([
      ['moveTo', [x,5*hPart]],
      ['quadraticCurveTo', [x+0.5*wPart,4.5*hPart, x+1*wPart,4*hPart]],
      ['quadraticCurveTo', [x+w/2,0, x+6*wPart,4*hPart]],
      ['lineTo', [x+w,4*hPart]],
      ['lineTo', [x+w,7*hPart]],
      ['lineTo', [x+6*wPart,7*hPart]],
      ['lineTo', [x+6*wPart,8*hPart]],
      ['lineTo', [x+4*wPart,8*hPart]],
      ['lineTo', [x+4*wPart,7*hPart]],
      ['lineTo', [x+3*wPart,7*hPart]],
      ['lineTo', [x+3*wPart,8*hPart]],
      ['lineTo', [x+1*wPart,8*hPart]],
      ['lineTo', [x+1*wPart,7*hPart]],
      ['lineTo', [x,7*hPart]],
      ['lineTo', [x,5*hPart]]
    ],{
      fill: color
    });

    car.append(path1);
    return car;
  },

  _makeLog: function(x, y, direction,color){
    var base_w = PLAIN_CAR_WIDTH
      , base_h = PLAIN_CAR_HEIGHT
      , car = this._makeCarWrapper(x,y,base_w,base_h);

    // Reinitialize w / h / x, based on direction
    var w = (direction=="LEFT") ? base_w : -base_w
      , h = base_h;

    x = (direction=="LEFT") ? 0 : base_w;

    var wPart = w/7
      , hPart = h/8;

    //Car body
    var path1 = new Path([
      ['moveTo', [x,0]],
      ['lineTo', [x+7*wPart,0]],
      ['quadraticCurveTo', [x+6*wPart,h/2, x+7*wPart,h]],
      ['lineTo', [x,h]],
      ['quadraticCurveTo', [x-wPart,h/2, x,0]]
    ],{
      fill: "#8b4513"
    });

    car.append(path1);

    //End of log
    var path2 = new Path([
        ['moveTo', [x+5*wPart,0]],
        ['lineTo', [x+w,0]],
        ['quadraticCurveTo', [x+8*wPart,h/2, x+w,h]],
        ['lineTo', [x+7*wPart,h]],
      ['quadraticCurveTo', [x+6*wPart,h/2, x+7*wPart,0]],
      ],{
        fill:"#cd853f"
      });

    car.append(path2);
    return car;
  }
}

Car = function(root, x, y, speed, direction, color, type) {

  this.initialize = function(root, x, y, speed, direction, color, type) {
    this.speed = speed;
    this.direction = direction;

    this.node = CarFactory.makeCar(type,x, y, direction,color);
    this.root.append(this.node);
  }

  this.destroy = function() {
    this.root.unregister(this);
    this.node.removeSelf();
  }

  this.animate = function(t, dt) {

    if (this.direction=="LEFT"){
      this.node.x -= this.speed;

      if((this.node.x + this.node.w)<10){
        this.destroy();
      }

    } else {
      this.node.x += this.speed;
      if((this.node.x)>WIDTH){
        this.destroy();
      }
    }

  }


  this.root = root;
  this.speed = speed;
  this.initialize(root, x, y, speed, direction, color, type);

}

// handles one row of cars
CarDispatcher = function(root, x, y, speed, direction,type) {
  this.speed = CAR_DEFAULT_SPEED;
  this.space_between_cars = 150;
  this.carColor = [Math.floor(Math.random()*255),Math.floor(Math.random()*255),Math.floor(Math.random()*255),1.0];

  this.initialize = function(root, x, y, speed, direction,type) {
    speedMax = 2;
    if(root.scoreboard) {
      speedMax = root.scoreboard.level;
    }

    this.speed = Math.floor(Math.random()*speedMax+1); 
    this.space_between_cars = Math.random()*50+180;
    this.y = y;
    this.x = x;
    this.direction = direction; // LEFT or RIGHT
    this.max_cars = 3;
    this.cars = new Array();
  }

  this.new_car = function() {
    var car = new Car(this, this.x, this.y, this.speed, this.direction, this.carColor,type);
    this.cars.push(car);
    this.num_cars = this.cars.length;
  }

  this.append = function(obj){
    this.root.append(obj);
  }

  this.unregister = function(car){
    this.cars.deleteFirst(car);
  }
  
  this.destroy = function(){
      for(var i=0;i<this.cars.length;i++){
      this.cars[i].node.removeSelf();
    }
  }
  
  this.animate = function(t, dt) {
    for(var i=0;i<this.cars.length;i++){
      this.cars[i].animate(t, dt);
    }

    // If there's no cars, add one
    if (this.cars.length==0){
      this.new_car();
    }
    
  // if the cur number of cars isn't the max, see if we're ready to add one:
    if(this.cars.length!=this.max_cars){
    
      // get the last car that was added
      var last_car = this.cars[this.cars.length-1];
      
      // If cars are moving to the left, and the top right corner of the car is more than the required space between cars away from the right side of canvas,
      // then add another car
    if (this.direction=="LEFT" && last_car.node.x+last_car.node.w < (WIDTH-this.space_between_cars)){
        this.new_car();
        
      // opposite of above condition, for cars moving to the right.  If there is enough spacing add another car
      } else if (this.direction=="RIGHT" && last_car.node.x > this.space_between_cars){
        this.new_car();
      }
      }
      
  }

  this.root = root;
  this.initialize(root, x, y, speed, direction,type);
}

FrogReceiver = function(root,x,y,w,h){
  isEmpty: true;
  
  this.initialize = function(x,y,w,h) {
    this.isEmpty=true;
    
    this.node =  new Path([
        ['moveTo', [x, y]],
        ['lineTo', [x, y-h]],
        ['lineTo', [x+w,y-h]],
        ['lineTo', [x+w,y]],
        ['bezierCurveTo', [x+w,y-h, x,y-h, x,y]],
      ], {
        //stroke: '#fff',
          fill: '#60511d'
      });
      
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.root.append(this.node);
    }

  this.holdFrog = function(frog){
    this.isEmpty=false;
    this.frog = frog;

    // remove the frog from the canvas;
    this.frog.destroy();

    var x = this.x
      , y = this.y
      , xPart = this.w/10
      , yPart = this.h/6;

    this.star =  new Path([
        ['moveTo', [x+5*xPart, y]],
        ['lineTo', [x+xPart, y]],
        ['lineTo', [x+3*xPart, y-yPart]],
        ['lineTo', [x+2*xPart, y-4*yPart]],
        ['lineTo', [x+4*xPart, y-3*yPart]],
        ['lineTo', [x+5*xPart, y-5*yPart]],
        ['lineTo', [x+6*xPart, y-3*yPart]],
        ['lineTo', [x+8*xPart, y-4*yPart]],
        ['lineTo', [x+7*xPart, y-yPart]],
        ['lineTo', [x+9*xPart, y]],
        ['lineTo', [x+5*xPart, y]]
    ], {
        fill: '#cccc00'
    });

    this.node.fill = "#816d28";
    this.root.append(this.star);
  }

  this.destroy = function(){
    if(this.frog){
      this.frog.destroy();
    }
    if(this.star){
      this.star.removeSelf();
    }
    this.node.removeSelf();
  }

  this.root = root;
  this.initialize(x,y,w,h);
}


Scoreboard = function(root){
  
  this.initialize = function(root){
    this.scores = [];
    this.lives = [];
    this.level = 1;
    
    this.scoreDiv = document.getElementById("score");
    this.livesDiv = document.getElementById("lives");
    this.levelDiv = document.getElementById("level");
  }
  
  this.scoreSafeFrog = function(pid){
    this.scores[pid] += POINTS_FOR_SAFE_FROG;
    this.updateStats();
  }

  this.scoreKilledFrog = function(pid){
    this.lives[pid] -= 1;
    if (this.lives[pid]==0){
      this.updateStats();
      this.root.endGame();
    }
    this.updateStats();
  }

  this.scoreFinishedLevel = function(pid){
    this.scores[pid] += POINTS_FOR_SAFE_FROG;
    this.scores[pid] += POINTS_FOR_CLEARED_LEVEL;
    this.level += 1;
  }

  this.updateStats = function(){

    scoresTxt = "Scores:<br/>";
    livesTxt = "Lives:<br/>";
    for(var i=0; i< this.lives.length; i++) {
      scoresTxt += root.players[i].name + ": " + this.scores[i] + "pts<br/>";
      livesTxt += root.players[i].name + ": x" + this.lives[i] + "<br/>";
    }
    this.scoreDiv.innerHTML = scoresTxt;
    this.livesDiv.innerHTML = livesTxt;

    this.levelDiv.innerHTML = this.level;
  }

  this.root = root;
  this.initialize(root);
}

function Player(root, id, name, color) {
  this.initialize = function(game) {
    this.addNewFrog(true);
    this.keyState = EVENT_NONE;
    this.moveCounter = 0;
    this.id = id; // TODO: use this somewhere
    this.name = name;
    this.color = color;
    this.disabled = false;
  }

  this.addNewFrog = function(shouldwait){
    var context = this.game;
    var player = this;
    player.moveCounter = 0;
    player.keyState = EVENT_NONE;
    context.paused = true;
    setTimeout(function(){
      if(player.frog) {
        player.frog.destroy();
      }
      player.frog = new Frog(context, player, HEIGHT-10, 428); // 428 - optimal height for RANKS
      context.scoreboard.updateStats();
      context.paused = false;
    },shouldwait?1000:0)
  }

  this.recordDeadFrog = function(){
    this.frog.runOver();
    this.game.scoreboard.scoreKilledFrog(this.id);
    if (this.game.scoreboard.lives[this.id]!=0){
      this.game.showMessage(this.name + ": " + FROG_DEATH_MESSAGES[Math.floor(Math.random()*FROG_DEATH_MESSAGES.length)],1000);

      // if disabled - don't renew frog
      if(this.disabled == false) {
        this.addNewFrog(false);
      }
    }
  }

  this.recordSafeFrog = function(){
    this.game.scoreboard.scoreSafeFrog(this.id);
    
    this.game.frogsLeft -= 1;

    if (this.game.frogsLeft==0){
      this.game.showMessage("Nice Job...Starting Level " + (this.game.scoreboard.level+1),1000);
      this.game.nextLevel();
    } else {
      this.game.showMessage(this.name + ", " + FROG_SAFE_MESSAGES[Math.floor(Math.random()*FROG_SAFE_MESSAGES.length)],1000);
      this.addNewFrog(false);
    }
  }


  this.game = root;
  this.initialize(this.game);

}
FroggerGame = Klass(CanvasNode, {
  paused: false,

  initialize : function(canvasElem) {
    CanvasNode.initialize.call(this);
    this.canvas = new Canvas(canvasElem);
    this.canvas.frameDuration = 35;
    this.canvas.append(this);
    this.canvas.fixedTimestep = true;
    this.canvas.clear = false;
    this.players = [];

    // setup the background
    this.setupBg();
    this.setupMessage();
    
    this.user = null; // Put fbUser here
    
    // number of frogs + targets at the top for frogs to reach
    this.numFrogs = NUM_FROG_RECEIVERS;
    
    // show the get ready message while we start things...:
    this.showMessage("Get Ready...",1000);
    
    // Initialize a new game
    this.startGame();

    // Add the scoreboard
    this.scoreboard = new Scoreboard(this);
  },

  setupBg : function() {
    this.bg = new Rectangle(WIDTH, HEIGHT);
    this.bg.fill = GAME_BG_COLOR;
    this.bg.zIndex = -1000;
    this.append(this.bg);

    var water = new Rectangle(WIDTH,260);
    water.fill = new Gradient({ endX:0, endY:25, colorStops:[[1, "#4169e1"], [0, "#4169e1"]] });
    water.y = 0;
    this.append(water);


    var middleGrass = new Rectangle(WIDTH,50);
    middleGrass.fill = new Gradient({ endX:0, endY:50, colorStops:[[1, "#FFB90F"], [0, "#FF7F00"]] });
    middleGrass.y = FROG_RECEIVER_TOTAL_HEIGHT + 210;
    this.append(middleGrass);

    var bottomGrass = new Rectangle(WIDTH,80);
    bottomGrass.fill = new Gradient({ endX:0, endY:80, colorStops:[[1, "#228B22"], [0, "#4e601d"]]});
    bottomGrass.y = FROG_RECEIVER_TOTAL_HEIGHT + 390;
    this.append(bottomGrass);
  },

  setupMessage : function() {
    // Setup the basic message box we'll use for telling the user stuff
    this.message = document.getElementById("message");
    this.message.style.top = (FROG_RECEIVER_TOTAL_HEIGHT + 255) + "px";
    this.message.style.left = WINDOW_WIDTH/2-150 + "px";
  },
  
  showMessage : function(message,duration){
    this.message.innerHTML = message;
    this.message.style.display = "block";
    var context = this;
    setTimeout(function(){
      var msg = document.getElementById("message");
      msg.style.display = "none";
    },duration)
  },
    
  startGame: function() {

    this.carDispatchers = [];
    this.logDispatchers = [];
    this.frogReceivers = [];
    this.frogsLeft = this.numFrogs; // Number of lilys left

    // Add The frog receivers at the top:
    for (var f=0,ff=this.numFrogs;f<ff;f++){
      this.frogReceivers.push(new FrogReceiver(this,
                      (WIDTH/this.numFrogs)*f, 
                      FROG_RECEIVER_HEIGHT, 
                      (WIDTH/this.numFrogs),  
                      FROG_RECEIVER_HEIGHT)); 
    }

    for(var i=0;i<this.players.length;i++){
      this.players[i].addNewFrog(true);
    }
    
    
    // Instantiate the Car Dispatchers on top (not actually drawn on canvas, just placeholders where the cars come from)
    //this.logDispatchers.push(new CarDispatcher(this, WIDTH, FROG_RECEIVER_TOTAL_HEIGHT , RACECAR_SPEED, "LEFT","TREELOG"));
    this.logDispatchers.push(new CarDispatcher(this, WIDTH, FROG_RECEIVER_TOTAL_HEIGHT + 30, RACECAR_SPEED, "LEFT","TREELOG"));
    this.logDispatchers.push(new CarDispatcher(this, -100, FROG_RECEIVER_TOTAL_HEIGHT + 60, RACECAR_SPEED, "RIGHT","TREELOG"));
    this.logDispatchers.push(new CarDispatcher(this, WIDTH, FROG_RECEIVER_TOTAL_HEIGHT + 90,TRUCK_SPEED, "LEFT","TREELOG"));
    this.logDispatchers.push(new CarDispatcher(this, -100, FROG_RECEIVER_TOTAL_HEIGHT + 120,TRUCK_SPEED, "RIGHT","TREELOG"));
    this.logDispatchers.push(new CarDispatcher(this, -100, FROG_RECEIVER_TOTAL_HEIGHT + 150,PLAIN_CAR_SPEED, "RIGHT","TREELOG"));
    this.logDispatchers.push(new CarDispatcher(this, WIDTH, FROG_RECEIVER_TOTAL_HEIGHT + 180,PLAIN_CAR_SPEED, "LEFT","TREELOG"));
    // Instantiate the Car Dispatchers (not actually drawn on canvas, just placeholders where the cars come from)
    this.carDispatchers.push(new CarDispatcher(this, -100, FROG_RECEIVER_TOTAL_HEIGHT + 270,TRUCK_SPEED, "RIGHT","PLAINCAR"));
    this.carDispatchers.push(new CarDispatcher(this, WIDTH, FROG_RECEIVER_TOTAL_HEIGHT + 300,RACECAR_SPEED, "LEFT","PLAINCAR"));
    this.carDispatchers.push(new CarDispatcher(this, WIDTH, FROG_RECEIVER_TOTAL_HEIGHT + 330,PLAINCAR_SPEED, "LEFT","PLAINCAR"));
    this.carDispatchers.push(new CarDispatcher(this, -100, FROG_RECEIVER_TOTAL_HEIGHT + 360,RACECAR_SPEED, "RIGHT","PLAINCAR"));

    // Start the animation
        this.addFrameListener(this.animate);
  },

  cleanUpCanvas : function() {
    for(var i=0;i<this.carDispatchers.length;i++){
      this.carDispatchers[i].destroy();
    }
    for(var i=0;i<this.logDispatchers.length;i++){
      this.logDispatchers[i].destroy();
    }
    for(var i=0;i<this.frogReceivers.length;i++){
      this.frogReceivers[i].destroy();
    }
    for(var i=0;i<this.players.length;i++){
      this.players[i].frog.destroy();
    }
  },

  endGame : function() {
    var context = this;
    
    this.showMessage("GAME OVER!",5000);
    
    this.removeFrameListener(this.animate);
    this.cleanUpCanvas();
    this.canvas.removeAllChildren();
    
    // Show link to start new game:
    //document.getElementById("startOver").style.display = "block";
  },

  nextLevel : function(){
    // Score the Completed Level
    this.scoreboard.scoreFinishedLevel();

    // stop the animation madness
    this.removeFrameListener(this.animate);
    
    // clear the canvas
    this.cleanUpCanvas();

    // Restart the Game and the animation
    this.startGame();
  },
  
    key : function(state) {
      for(var i=0;i<this.players.length;i++) {
        this.players[i].keyState = state;
    }
  },

    animate: function(t, dt){
    if (this.paused){
      return false;
    }
    
    for(var i=0;i<this.players.length;i++) {
      this.players[i].frog.animate(t, dt);
    }
    for(var i=0;i<this.logDispatchers.length;i++){
        this.logDispatchers[i].animate(t, dt);
    }

    // Check every player
    for(var i=0;i<this.players.length;i++) {
       // The if event doesn't get entered unless the frog breaks the y-axis of the water
        if ((this.players[i].frog.node.y<FROG_WATER_HEIGHT) &&
         (this.players[i].frog.node.y>FROG_RECEIVER_HEIGHT)) {

          var isSafe = false;
          
          // Check all logs to see if its on a log
          for(var j=0;j<this.logDispatchers.length;j++) {
            var logs = this.logDispatchers[j].cars;
            // Check every log on the row
            for(var c=0,cc=logs.length;c<cc;c++) {

              // if on a log
              if (NodesCollided(logs[c].node,this.players[i].frog.node)){
                  isSafe = true;
                  // update x based on direction
                  if (logs[c].direction == "LEFT") {
                    this.players[i].frog.node.x -= logs[c].speed;
                  } else {
                    this.players[i].frog.node.x += logs[c].speed;
                  }
                  break;
              }
            }
        }
        if (!isSafe) {
          this.players[i].recordDeadFrog();
        }
      }
    }
    

      for(var i=0;i<this.carDispatchers.length;i++){
        this.carDispatchers[i].animate(t, dt);
        
        // Check if the frog got hit by any of the cars
        var cars = this.carDispatchers[i].cars;
        for(var c=0,cc=cars.length;c<cc;c++){
        for(var j=0;j<this.players.length;j++) {
          if (NodesCollided(cars[c].node,this.players[j].frog.node)){
            this.players[j].recordDeadFrog();
            break;
          }
        }
      }
    }
      
      // The if event doesn't get entered unless the frog breaks the y-axis plane of the receivers at the top
    for(var i=0;i<this.players.length;i++) {
      if (this.players[i].frog && this.players[i].frog.node.y<FROG_RECEIVER_HEIGHT + 5){
        for(var r=0,rr=this.frogReceivers.length;r<rr;r++){
            if(NodesCollided(this.players[i].frog.node,this.frogReceivers[r])){
            if (this.frogReceivers[r].isEmpty){
                this.frogReceivers[r].holdFrog(this.players[i].frog);
                this.players[i].recordSafeFrog();
              break;
            } else {
                this.players[i].recordDeadFrog();
              break;
            }
          }
        }
      }
    }
    

  }

})

init = function() {
    var c = E.canvas(WIDTH, HEIGHT)
    var d = E('div', { id: 'screen' })
    
  // remove the canvas container from the DOM, so we can insert a new one if they play again
  var screenDiv = document.getElementById("screen");
  if (screenDiv) document.body.removeChild(screenDiv);
  
  //document.getElementById("startOver").style.display = "none";

    d.appendChild(c)
    document.body.appendChild(d) 
    
    FG = new FroggerGame(c)
    openRoom("123");

    if (document.addEventListener)
    {
        document.addEventListener("keypress", Ignore,  false)
        document.addEventListener("keydown",  KeyDown, false)
        document.addEventListener("keyup",    KeyUp,   false)
    }
    else if (document.attachEvent)
    {
        document.attachEvent("onkeypress", Ignore)
        document.attachEvent("onkeydown",  KeyDown)
        document.attachEvent("onkeyup",    KeyUp)
    }
    else
    {
        document.onkeypress = Ignore
        document.onkeydown  = KeyDown
        document.onkeyup    = KeyUp;
    }

    function Ignore(e) {
        if (e.preventDefault) e.preventDefault()
        if (e.stopPropagation) e.stopPropagation()
    }
    function KeyUp(e) {
        //OnKey(0,e)
    }
    function KeyDown(e) {
        OnKey(1,e)
    }
    
    function OnKey(state, e)
    {
        if (e.preventDefault) e.preventDefault()
        if (e.stopPropagation) e.stopPropagation()
        var KeyID = (window.event) ? event.keyCode : e.keyCode;
        switch(KeyID)
        {
            case 37:
                FG.key(EVENT_WEST);
                break;
            case 38:
                FG.key(EVENT_NORTH);
                break;
            case 39:
                FG.key(EVENT_EAST);
                break;
            case 40:
                FG.key(EVENT_SOUTH);
                break;
            default:
              FG.key(EVENT_NONE);
        }
        
    }
}

function movePlayer(dbid, move) {

  var player = FG.players[dbidToPid[dbid]];
  if(!player) {
    return;
  }
  player.keyState = move;
  player.moveCounter = 30;
}

function addPlayer(dbid, name, color){
  if(dbid in dbidToPid) {
    pid = dbidToPid[dbid];
    if(FG.players[pid].disabled == true) {
      FG.players[pid].name = name;
      FG.players[pid].disabled = false;
      FG.players[pid].addNewFrog();
      FG.scoreboard.scores[pid] = POINTS_INITIAL;
      FG.scoreboard.lives[pid] = LIVES_INITIAL;
    } else {
      alert("Tried to join as a player which is already playing!");
    }

  } else {
    pid = FG.players.length;
    dbidToPid[dbid] = pid;
    FG.players.push(new Player(FG, pid, name, "#"+color));
    FG.scoreboard.scores.push(POINTS_INITIAL);
    FG.scoreboard.lives.push(LIVES_INITIAL);
  }
}

function updatePlayer(dbid, playerName, playerColor) {
  pid = dbidToPid[dbid];
  FG.players[pid].name = playerName;
  FG.players[pid].color = "#" + playerColor;
}

function removePlayer(dbid){
    pid = dbidToPid[dbid];
    if(pid) {
      FG.players[pid].disabled = true;
      FG.players[pid].recordDeadFrog();
    }
  }

window.onload = init;