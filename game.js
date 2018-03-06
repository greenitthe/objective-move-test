var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

var keys = {};

var world0 = new World("sky.png");
//Entity Array, should contain character at the 0 index
var entityStack = [];
var colliderStack = [];
var characterStack = [];
characterStack.push(new Character(defaultMovement, defaultCollision, "cactusChar", 100, 100, 32, 32, false, "ellensExampleCactus.png", staticDraw));

function defaultMovement() {
  speed = 5;
  //left
  if (keys[97] || keys[65]) {
    //console.log("left");
    this.x -= boundMovement(0,this,speed);
	}
	//right
	if (keys[100] || keys[68]) {
    //console.log("right");
    this.x += boundMovement(1,this,speed);
	}
  //up
  if (keys[87]) {
    //console.log("up");
    this.y -= boundMovement(2,this,speed);
  }
  //down
  if (keys[83]) {
    //console.log("down");
    this.y += boundMovement(3,this,speed);
  }
  console.log(this.name + ": " + this.x, ",", this.y)
}

function defaultCollision() {

}

function staticDraw() {
  ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
}

function boundMovement(direction, entity, amount) {
  //0=left
  if (direction == 0) {
    if (entity.x - amount <= world0.minX) {
      return entity.x;
    }
  }
  //1=right
  if (direction == 1) {
    if (entity.x + entity.width + amount >= world0.maxX) {
      return world0.maxX - entity.x - entity.width;
    }
  }
  //2=up
  if (direction == 2) {
    if (entity.y - amount <= world0.minY) {
      return entity.y;
    }
  }
  //3=down
  if (direction == 3) {
    if (entity.y + entity.height + amount >= world0.maxY) {
      return world0.maxY - entity.y - entity.height;
    }
  }

  return amount;
}

/**
Entity = a drawable element that can be placed into the world
x, y = INT coords
absPos = BOOL whether positioned absolutely on the screen
eImage = STR location to image source for entity
drawStyle = FUNC function dictating how the entity should be drawn
**/
function Entity(name,x,y,width,height,absPos,eImage,drawStyle) {
  this.name = name;
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.absolutePosition = absPos;

  this.image = new Image();
  this.image.src = eImage;
  this.draw = drawStyle;
}
/**
Collider = an entity that does something on collision with other things
collide = FUNC dictates how the entity responds when something collides
**/
function Collider(collFunc,name,x,y,width,height,absPos,eImage,drawStyle) {
  Entity.call(this,name,x,y,width,height,absPos,eImage,drawStyle);

  this.collide = collFunc;
}

/**
Character = an entity that can move and be controlled by the player
move = FUNC dictates how a Character moves
**/
function Character(charMove,collFunc,name,x,y,width,height,absPos,eImage,drawStyle) {
  Collider.call(this,collFunc,name,x,y,width,height,absPos,eImage,drawStyle);

  this.move = charMove;
}

function World(bgImagePath) {
  this.xOffset = 0;
  this.yOffset = 0;
	this.minX = 0;
	this.minY = 0;
	this.maxX = canvas.width;
	this.maxY = canvas.height;

  this.bgImage = new Image();
  this.bgImage.src = bgImagePath;
  this.draw = function () {
    var ptrn = ctx.createPattern(this.bgImage, 'repeat');
    ctx.fillStyle = ptrn;
    ctx.fillRect(this.minX, this.minY, this.maxX, this.maxY);
  }
}

function clear() {
  ctx.setTransform(1,0,0,1,0,0);//reset the transform matrix as it is cumulative
  ctx.clearRect(0, 0, canvas.width, canvas.height);//clear the viewport AFTER the matrix is reset
}

function mainLoop() {
  clear();
  world0.draw();
  entityStack.forEach(function(item) {
    item.draw();
  });
  colliderStack.forEach(function(item) {
    item.draw();
  });
  characterStack.forEach(function(item) {
    item.draw();
    if (Object.keys(keys).length > 0) {
      item.move();
    }
  });
  window.requestAnimationFrame(mainLoop);
}

mainLoop();


$(document).keydown( function(e)
{
  //console.log("keypress: " + e.which);
  e.preventDefault();
  e.stopPropagation();
  keys[e.which] = true;
});

$(document).keyup( function(e)
{
  e.preventDefault();
  e.stopPropagation();
  delete keys[e.which];
});
