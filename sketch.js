var PLAY = 1;
var END = 0;
var gameState = PLAY;

var mario, mario_running, mario_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var coinsGroup, coinImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;
var backgroundImg
var score=0;
var jumpSound, collidedSound,coinSound;

var gameOver, restart;


function preload(){
  jumpSound = loadSound("jump.mp3")
  collidedSound = loadSound("collided.wav")
  coinSound = loadSound("collectcoin.mp3")
  backgroundImg = loadImage("backgroundImg.png")
  sunAnimation = loadImage("sun.png");
  
  mario_running = loadAnimation("mario_2.png","mario_1.png","mario_3.png");
  mario_collided = loadAnimation("mario_collided.png");
  
  groundImage = loadImage("ground.png");
  
  cloudImage = loadImage("cloud.png");
  
  coinImage = loadImage("coin.png")

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  sun = createSprite(width-50,100,10,10);
  sun.addAnimation("sun", sunAnimation);
  sun.scale = 0.1
  
  mario = createSprite(50,height-70,20,50);
  
  
  mario.addAnimation("running", mario_running);
  mario.addAnimation("collided", mario_collided);
  mario.setCollider('circle',0,0,350)
  mario.scale = 0.6;
  
  invisibleGround = createSprite(width/2,height-10,width,125);  
  invisibleGround.shapeColor = "#f4cbaa";
  
  ground = createSprite(width/2,height,width,2);
  ground.addImage("ground",groundImage);
  ground.x = width/2
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
  
 
  // invisibleGround.visible =false

  cloudsGroup = new Group();
  coinsGroup = new Group();
  obstaclesGroup = new Group();
  console.log("Hello" +5);
  mario.debug=true
  
  mario.setCollider("rectangle",0,0,mario.width,mario.height);
 

  score = 0;
  
}

function draw() {
  //mario.debug = true;
  background(backgroundImg);
  textSize(20);
  fill("black")
  text("Score: "+ score,30,50);
  
  
  if (gameState===PLAY){
    //score = score + Math.round(getFrameRate()/60);
    
    ground.velocityX = -(6 + 3*score/100);
    
    if((touches.length > 0 || keyDown("SPACE")) && mario.y  >= height-120) {
      jumpSound.play( )
      mario.velocityY = -13;
       touches = [];
    }
    
    mario.velocityY = mario.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    mario.collide(invisibleGround);
   
    spawnObstacles();
    spawnClouds();
    spawnCoins();

    if(obstaclesGroup.isTouching(mario)){
      console.log("hyy")
        collidedSound.play()
        gameState = END;
    }
    if(coinsGroup.isTouching(mario)){
      //coinSound.play()
      score = score + Math.round(getFrameRate()/60);
   }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    mario.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    coinsGroup.setVelocityXEach(0);
    
    //change the mario animation
    mario.changeAnimation("collided",mario_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    coinsGroup.setLifetimeEach(-1);
    
    if(touches.length>0 || keyDown("SPACE") || mousePressedOver(restart)) {      
      reset();
      touches = []
    }
  }
  
  
  drawSprites();
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,height-95,20,30);
    obstacle.setCollider('circle',0,0,45)
    // obstacle.debug = true
  
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,4));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    //obstacle.scale = 0.5;
    obstacle.lifetime = 400;
    obstacle.depth = mario.depth;
    mario.depth +=1;
    obstacle.debug=true
    obstacle.setCollider("rectangle",0,0,obstacle.width,obstacle.height)
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  
}

}
  
function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(100,220));
    cloud.addImage(cloudImage);
    cloud.scale = 0.3;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 400;
    
    //adjust the depth
    cloud.depth = mario.depth;
    mario.depth = mario.depth+1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }

}

function spawnCoins() {
    //write code here to spawn the coins
    if (frameCount % 60 === 0) {
      var coin = createSprite(width+20,height-120,40,10);
      coin.y = Math.round(random(420,500));
      coin.addImage(coinImage);
      coin.scale = 0.04;
      coin.velocityX = -6;
      
       //assign lifetime to the variable
      coin.lifetime = 600;
      
      //adjust the depth
      coin.depth = mario.depth;
      mario.depth = mario.depth+1;
      
      //add each coin to the group
      coinsGroup.add(coin);
    }
  
   
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  coinsGroup.destroyEach();
  
  mario.changeAnimation("running",mario_running);
  
  score = 0;
}







