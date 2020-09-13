let player;
let bullets = [];
let obstacles = [];
let keys = [];
let score = 0;
let lives = 3;

function game(){
    var canvas = document.getElementById("space");
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.canvasW = 1500;
    this.canvasH = 900;
    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);

    player = new Player();
    for(let i = 0; i < 6; i++){
        obstacles.push(new Obstacle());
    }
    render();
}

function keyDown(i){
    keys[i.keyCode] = true;
}
function keyUp(i){
    keys[i.keyCode] = false;
    if (i.keyCode == 32){
        bullets.push(new Bullet(player.angle));
    }
}
function collision(ax, ay, r1, bx, by, r2){
    let dx = ax - bx;
    let dy = ay - by;
 
    if ((r1 + r2) > Math.sqrt((dx **2) + (dy **2))){
        return true;
    }
}
 
function Player(){
    this.x = canvasW / 2;
    this.y = canvasH / 2;
    this.vertX = this.x;
    this.vertY = this.y;
    this.velX = 0;
    this.velY = 0;
    this.radius = 15;
    this.isMoving = false;
    this.speed = 0.1;
    this.rotateSpeed = 0.001;
    this.angle = 0;
    this.visible = true;

    this.draw = function(){
        ctx.beginPath();
        let vertAngle = ((Math.PI * 2) / 3);
        let radians = this.angle * 180 / Math.PI;
        this.vertX = this.x - this.radius * Math.cos(radians);
        this.vertY = this.y - this.radius * Math.sin(radians);
        for (let i = 0; i < 3; i++){
            ctx.lineTo(this.x - this.radius * Math.cos(vertAngle * i + radians), this.y - this.radius * Math.sin(vertAngle * i + radians));
        }
        ctx.closePath();
        ctx.fill();
    }
    this.move = function(){
        this.x -= this.velX;
        this.y -= this.velY;
        
        let radians = this.angle * 180 / Math.PI;
        if (this.isMoving){
            this.velX += Math.cos(radians) * this.speed;
            this.velY += Math.sin(radians) * this.speed;
        }        
        if (this.x < this.radius){
            this.x = canvas.width;
        }
        if (this.x > canvas.width){
            this.x = this.radius;
        }
        if (this.y < this.radius){
            this.y = canvas.height;
        }
        if (this.y > canvas.height){
            this.y = this.radius;
        }
        this.velX *= 0.99;
        this.velY *= 0.99;
    }
    this.rotate = function(dir){
        this.angle += this.rotateSpeed * dir;
    }
}

function Obstacle(x,y,radius,size,collisionRadius){
    this.x = x || Math.random() * canvasW;
    this.y = y || Math.random() * canvasH;
    this.radius = radius || 50;
    this.size = size || 1;
    this.collisionRadius = collisionRadius || 47;
    this.speed = 5;
    this.angle = Math.random();

    this.draw = function(){
        ctx.fillStyle = "grey";
        ctx.beginPath();
        let vertAngle = 1;
        let radians = this.angle * 180 / Math.PI;
        for(let i = 0; i < 6; i++){
            ctx.lineTo(this.x - this.radius * Math.cos(vertAngle * i + radians), this.y - this.radius * Math.sin(vertAngle * i + radians));
        }
        ctx.closePath();
        ctx.fill();
    }
    this.move = function(){
        let radians = this.angle * 180 / Math.PI;
        this.x += Math.cos(radians) * this.speed;
        this.y += Math.sin(radians) * this.speed;
        if (this.x < this.radius){
            this.x = canvas.width;
        }
        if (this.x > canvas.width){
            this.x = this.radius;
        }
        if (this.y < this.radius){
            this.y = canvas.height;
        }
        if (this.y > canvas.height){
            this.y = this.radius;
        }
    }
}

function Bullet(angle){
    this.x = player.vertX;
    this.y = player.vertY;
    this.height = 5;
    this.width = 5;
    this.speed = 5;
    this.angle = angle;

    this.draw = function(){
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(this.x,this.y,this.width,this.height);
    }
    this.move = function(){
        let radians = this.angle * 180 / Math.PI;
        this.x -= Math.cos(radians) * this.speed;
        this.y -= Math.sin(radians) * this.speed;
    }
}
 
function render(){
    player.isMoving = (keys[38]);
    if (keys[39]){
        player.rotate(1);
    }
    if (keys[37]){
       player.rotate(-1);
    }
    
    ctx.clearRect(0, 0, canvasW, canvasH);
    ctx.fillStyle = 'white';
    ctx.font = '30px Lucida Console';
    ctx.fillText("SCORE : " + score.toString(), 1250, 50);
    ctx.fillStyle = 'white';
    ctx.font = '30px Lucida Console';
    ctx.fillText("LIVES : " + lives.toString(), 1250, 100);

    if(lives <= 0){
        window.removeEventListener("keydown", keyDown);
        window.removeEventListener("keyup", keyUp);
        player.visible = false;
        ctx.fillStyle = 'white';
        ctx.font = '70px Lucida Console';
        ctx.fillText("GAME OVER", canvasW / 2 - 150, canvasH / 2);
    }
    if (obstacles.length != 0){
        for(let i = 0; i < obstacles.length; i++){
            if(collision(player.x, player.y, player.radius, obstacles[i].x, obstacles[i].y, obstacles[i].collisionRadius)){
                player.x = canvasW / 2;
                player.y = canvasH / 2;
                player.velX = 0;
                player.velY = 0;
                lives -= 1;
            }
        }
    }else if (obstacles.length == 0){
        player.x = canvasW / 2;
        player.y = canvasH / 2;
        player.velX = 0;
        player.velY = 0;
        for(let i = 0; i < 8; i++){
            let obstacle = new Obstacle();
            obstacle.speed += 1;
            obstacles.push(obstacle);
        }
    }
    for(let i = 0; i < obstacles.length; i++){
        for(let j = 0; j < bullets.length; j++){
            if(collision(bullets[j].x, bullets[j].y, bullets[j].width, obstacles[i].x, obstacles[i].y, obstacles[i].collisionRadius)){
                if(obstacles[i].size == 1){
                    obstacles.push(new Obstacle(obstacles[i].x - 5, obstacles[i].y - 5, 30, 2, 27));
                    obstacles.push(new Obstacle(obstacles[i].x + 5, obstacles[i].y + 5, 30, 2, 27));
                } else if(obstacles[i].size == 2){
                    obstacles.push(new Obstacle(obstacles[i].x - 5, obstacles[i].y - 5, 20, 3, 17));
                    obstacles.push(new Obstacle(obstacles[i].x + 5, obstacles[i].y + 5, 20, 3, 17));
                }
                obstacles.splice(i,1);
                bullets.splice(j,1);
                score += 10;
                break;
            }
        }
    }
    if(player.visible){
        player.draw();
        player.move();
    }
    if (obstacles.length != 0){
        for(let i = 0; i < obstacles.length; i++){
            obstacles[i].draw();
            obstacles[i].move();
        }
    }
    if (bullets.length != 0){
        for(let i = 0; i < bullets.length; i++){
            bullets[i].draw();
            bullets[i].move();
        }
    }
    requestAnimationFrame(render);
}
