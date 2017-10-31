var Game = function(){
    this.gameCanvas = $("#game-canvas");
    this.ctx = this.gameCanvas[0].getContext("2d");

    this.players = ["Pumpkin-Clown-icon-50.png", "Pumpkin-Dictator-icon-50.png", "Pumpkin-Jack-icon-50.png", "Pumpkin-Robot-icon-50.png", "Pumpkin-Sir-icon-50.png", "Pumpkin-Vader-icon-50.png"];
    this.roads = [];
    this.points = 0;
}

$(window).resize(function(){
    $("#game-canvas")[0].width = $(window).width();
    $("#game-canvas")[0].height = $(window).height();
});
$(window).resize();

var player = function(game, x, y){
    this.x = x;
    this.y = y;

    this.playerVelocity = 0;

    this.width = 50;
    this.height = 50;

    this.playerSrc = "images/pumpkins/"+game.players[Math.floor(Math.random()*game.players.length)];

    this.playerImg = new Image();
    this.playerImg.src = this.playerSrc;
    this.changed = false;
}

var road = function(x, y){
    this.x = x;
    this.y = y;

    this.src = "images/road-200.png";

    this.roadImg = new Image();
    this.roadImg.src = this.src;
}

var roadManager = function(){
    this.roads = [];
    this.generate = function () {
        for (var y=0; y<$(window).height(); y++){
            this.roads.push(new road($(window).width()/2-100, y));
            y += 199;
        }
    }

    this.render = function(){
        for (var r in this.roads){
            this.roads[r].y += 3;
        }

        if (this.roads[0].y > 1){
            this.roads.splice(0, 0, new road($(window).width()/2-100, this.roads[0].y-200));
        } if (this.roads[this.roads.length-1].y > $(window).height() ){
            this.roads.splice(this.roads.length-1, 1);
        }
    }

    this.generate();
}

var roadObject = function(){
    this.obstacleBool = (Math.floor(Math.random()*3)) ? true : false;

    this.obstacleNum = this.obstacleBool ? 1 : 0;

    this.y = -100;
    this.x = $(window).width()/2 + Math.floor(Math.random()*150) - 120;

    this.image = ["images/candy-cane-icon.png", "images/candy-icon.png"][this.obstacleNum];

    this.myImg = new Image();
    this.myImg.src = this.image;

    this.checkHit = function(x, y){
        if (Math.abs(this.x-x) < 35 && Math.abs(this.y-y) < 35){
            return true;
        } else {
            return false;
        }
    }
}

var roadObjectManager = function(game){
    this.roadObjects = [];
    this.game = game;

    this.render = function(){
        var objectProbability = !(Math.floor(Math.random()*30) ? true : false);

        objectProbability ? this.roadObjects.push(new roadObject()) : 0; // add a road object if true or don't do anything if false
    }
}

var render  = function(game, player, roadInst, roadObjMan){
    game.ctx.fillStyle = "#000000"
    game.ctx.fillRect(0, 0, $(window).width(), $(window).height());

    for (r in roadInst.roads){
        game.ctx.drawImage(roadInst.roads[r].roadImg, roadInst.roads[r].x, roadInst.roads[r].y);
    }

    roadInst.render();

    for (var roadO in roadObjMan.roadObjects){
        game.ctx.drawImage(roadObjMan.roadObjects[roadO].myImg, roadObjMan.roadObjects[roadO].x, roadObjMan.roadObjects[roadO].y, 50, 50);
        roadObjMan.roadObjects[roadO].y += 3;

        if (roadObjMan.roadObjects[roadO].y > $(window).height()){
            roadObjMan.roadObjects.splice(roadO, 1);
        }
    }

    for (var roadO in roadObjMan.roadObjects) {
        if (roadObjMan.roadObjects[roadO].checkHit(player.x, player.y)) {
            if (!roadObjMan.roadObjects[roadO].obstacleBool) {
                $("#candies").html(game.points);
                $("#game-over").css({"opacity":1, "z-index":10});
                return 0;
            } else {
                game.points += 1;
            }

            roadObjMan.roadObjects.splice(roadO, 1);
        }
    }
    roadObjMan.render();

    game.ctx.drawImage(player.playerImg, player.x, player.y);

    if (player.x + player.playerVelocity < $(window).width()/2+100-50 && player.x + player.playerVelocity > $(window).width()/2-100 ){
        player.x += player.playerVelocity;

        //game.points += 1;

    }

    game.ctx.fillStyle = "#ffffff"
    game.ctx.font = "30px Arial";
    game.ctx.fillText(game.points, 50, 50);

    requestAnimationFrame(function() { render(game, player, roadInst, roadObjMan) });
}

var eventManager = function(player){
    this.player = player;

    $(window).on("keydown", function(event){
        //alert(event.which);
        if (event.which == 39){
            p.playerVelocity = 3;
        } else if (event.which == 37){
            p.playerVelocity = -3;
        }
    });

    $(window).on("keyup", function (event) {
        this.player.playerVelocity = 0;
    })
}

var p;

$(".play-button").click(function () {
    var game = new Game();
    p = new player(game, $(window).width()/2, $(window).height()*0.8);

    var evv = new eventManager(p);
    var roadObjMan = new roadObjectManager(game);

    $("#game-over").css({"opacity":0, "z-index":-10});
    $("#message-screen").hide();
    render(game, p, new roadManager(), roadObjMan);
})
