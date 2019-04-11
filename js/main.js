//setting height and width to whole window
const height = window.innerHeight;
const width = window.innerWidth;

// for number values to fit all screen
const hr = height / 750;
const wr = width / 1536;

//initializing Phaser
var game = new Phaser.Game(width, height, Phaser.AUTO);

//hole
var hole = 1;
//par
var par;
//set par for each hole
const totalpar = [2, 5, 9, 13, 18, 23, 24, 28, 32];
//strokes
var strokes;
//score on hole
var strokesdisp = [];
//for displaying score
var allscores = [];
const scoregap = 48 * hr
//total score
var total = 0;

//constants for every hole
const teebox = [0, width / 18];
var groundlevel = 7 * height / 8;

//power and angle of ball
var power;
var truepower;
var angle;
var radianvalue;
var vY;
var vX;

//x and y position of ball;
var positionx = [];
var positiony = [];

//initial powerup boolean values
var powerupbol = false;
var laserbol = false;
var gumbol = false;
var reboostbol = null;
var dropballbol = null;
var icebol = null;
//total number of powerups
var poweruplimit = 7;

//multiples for powerups
var bXM;
var bYM;
var vXM;
var vYM;
var gravM;

//if ball went in water on previous shot
var inwater = false;

//allplatforms
var plat;

//text displayed on screen
//score Information
var disptextI;
//ball Information
var disptextQ;

//practice mode
var prac = false;

//multipe to velocity and gravity for mobile
var mobilemult;

//if on a mobile device or not
var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
if (isMobile) {
	groundlevel = 135 * height / 160;
	mobilemult = 0.5;
} else {
	mobilemult = wr;
}

//checks if user is using a firefox or safari brower
var sUsrAg = navigator.userAgent;
var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

if (isChrome || sUsrAg.match('CriOS')) {
	window.alert("A Firefox or Safari browser is required to run this game")
} else if (height < width) {
	if (sUsrAg.indexOf("Firefox") > -1) {
		everything();
	} else if (sUsrAg.indexOf("Safari") > -1) {
		everything();
	} else {
		window.alert("A Firefox or Safari browser is required to run this game")
	}
} else {
	if (isChrome == false) {
		window.alert("Please Rotate and Refresh to Play!")
	}
}

//runs everything
function everything() {
	var GameState = {
		preload: function () {

			//all asset names
			const allassets = ['ipage', 'background', 'ground', 'green', 'egg', 'cup', 'flag', 'arrow', 'scorecard', 'scorecardbg', 'custombg', 'mainmenu', 'startbutton',
				'practicebutton', 'customize', 'information', 'playagain', 'nextholebutton', 'plusbutton', 'minusbutton', 'launchbutton', 'activatebutton',
				'homebutton', 'backbutton', 'redobutton', 'water', 'sand', 'powerup', 'blackcircle', 'roundrectangle', '8ball', 'basketball', 'blackball', 'blueball',
				'bowlingball', 'darkblueball', 'greenball', 'pinkball', 'purpleball', 'redball', 'soccerball', 'tennisball', 'volleyball', 'whiteball', 'character1',
				'character1flip', 'character2', 'character2flip', 'character3', 'character3flip', 'character4', 'character4flip', 'character5', 'character5flip',
				'character6', 'character6flip', 'superball', 'laserball', 'minus1', 'gumball', 'bouncyball', 'mulligan', 'iceball', 'reboost', 'dropball'
			]

			//all asset files
			const allfiles = ['assets/ipage.png', 'assets/background.png', 'assets/ground.png', 'assets/green.png', 'assets/egg.png', 'assets/cup.png', 'assets/flag1.png',
				'assets/arrow.png', 'assets/scorecard.jpg', 'assets/scorecardgreen.jpg', 'assets/custombg.png', 'assets/mainmenu.jpg', 'assets/startbutton.png',
				'assets/practice.png', 'assets/customize.png', 'assets/information.png', 'assets/playagain.png', 'assets/nextholebutton.png',
				'assets/plus.png', 'assets/minus.png', 'assets/launch.png', 'assets/activatebutton.png', 'assets/home.png', 'assets/backbutton.png', 'assets/redo.png',
				'assets/water.png', 'assets/sand.png', 'assets/powerup.png', 'assets/blackcircle.png', 'assets/roundrectangle.png', 'assets/8ball.png', 'assets/basketball.png',
				'assets/blackball.png', 'assets/blueball.png', 'assets/bowlingball.png', 'assets/darkblueball.png', 'assets/greenball.png', 'assets/pinkball.png',
				'assets/purpleball.png', 'assets/redball.png', 'assets/soccerball.png', 'assets/tennisball.png', 'assets/volleyball.png', 'assets/whiteball.png',
				'assets/character1.png', 'assets/character1flip.png', 'assets/character2.png', 'assets/character2flip.png', 'assets/character3.png', 'assets/character3flip.png',
				'assets/character4.png', 'assets/character4flip.png', 'assets/character5.png', 'assets/character5flip.png', 'assets/character6.png', 'assets/character6flip.png',
				'assets/superball.png', 'assets/laserball.png', 'assets/-1.png', 'assets/gumball.png', 'assets/bouncyball.png', 'assets/mulligan.png', 'assets/iceball.png',
				'assets/reboost.png', 'assets/instantstop.png'
			]

			//loading all assets
			for (var i = 0; i < allassets.length; i++) {
				game.load.image(allassets[i], allfiles[i]);
			}
		},

		create: function () {
			//setting initial values
			strokes = 0;
			//default power and angle values
			power = 75;
			angle = 45;

			//all sprites appear off screen unless changed in hole function
			//background
			background = game.add.sprite(2 * width, 2 * height, 'background');
			background.anchor.setTo(0.5, 0.5);
			background.visible = false;

			//flag
			flag = game.add.sprite(2 * width, 2 * height, 'flag');
			flag.anchor.setTo(0, 1);

			//hole # on flag
			flagtext = game.add.text(2 * width, 2 * height, '', {
				font: 'Calibri',
				fontSize: 50 * wr,
				fill: '#000000'
			});
			flagtext.anchor.setTo(0.5, 0.5);

			//all ground/platforms
			floor1 = game.add.sprite(2 * width, 2 * height, 'ground');
			floor1.anchor.setTo(0, 0);

			floor2 = game.add.sprite(2 * width, 2 * height, 'ground');
			floor2.anchor.setTo(0, 0);

			floor3 = game.add.sprite(2 * width, 2 * height, 'ground');
			floor3.anchor.setTo(0, 0);

			ground1 = game.add.sprite(2 * width, 2 * height, 'ground');
			ground1.anchor.setTo(0, 0);

			ground2 = game.add.sprite(2 * width, 2 * height, 'ground');
			ground2.anchor.setTo(0, 0);

			ground3 = game.add.sprite(2 * width, 2 * height, 'ground');
			ground3.anchor.setTo(0, 0);

			ground4 = game.add.sprite(2 * width, 2 * height, 'ground');
			ground4.anchor.setTo(0, 0);

			ground5 = game.add.sprite(2 * width, 2 * height, 'ground');
			ground5.anchor.setTo(0, 0);

			//green
			green = game.add.sprite(2 * width, 2 * height, 'green');
			green.anchor.setTo(0.5, 0);
			green.width = 310 * wr;
			green.height = 10 * hr;

			//cup
			cup = game.add.sprite(2 * width, 2 * height, 'cup');
			cup.anchor.setTo(0, 1);

			//sand
			sand1 = game.add.sprite(2 * width, 2 * height, 'sand');
			sand1.anchor.setTo(0, 0);
			sand2 = game.add.sprite(2 * width, 2 * height, 'sand');
			sand2.anchor.setTo(0, 0);

			//water
			water1 = game.add.sprite(2 * width, 2 * height, 'water');
			water1.anchor.setTo(0, 0);
			water2 = game.add.sprite(2 * width, 2 * height, 'water');
			water2.anchor.setTo(0, 0);

			//hidden egg
			hidegg = game.add.sprite(2 * width, 2 * height, 'egg');
			hidegg.anchor.setTo(0.5, 0);

			//ball
			ball = game.add.sprite(2 * width, 2 * height, ballselection[bsel]);
			ball.anchor.setTo(0.5, 1);
			ball.width = 28 * wr;
			ball.height = 28 * hr;
			ball.visible = false;

			//easter egg
			egg = game.add.sprite(2 * width, 2 * height, 'ground');
			egg.alpha = 0.96;
			egg.anchor.setTo(0, 0);

			//arrow
			arrow = game.add.sprite(2 * width, 2 * height, 'arrow');
			arrow.angle = -angle;
			arrow.height = 100 * hr;
			arrow.width = 143 * wr * power / 100;
			arrow.anchor.setTo(0, 0.5);
			arrow.x = ball.x + ball.height / 2 * Math.cos(45 * Math.PI / 180);
			arrow.y = ball.y - ball.height / 2 - ball.height / 2 * Math.sin(45 * Math.PI / 180);

			//score info text
			disptextI = game.add.text(10 * wr, 5 * hr);
			disptextI.setText('Hole: ' + hole + '\nPar: 2\nStrokes: 0');
			disptextI.font = 'Comic Sans MS';
			disptextI.fontSize = 40 * hr;
			disptextI.fill = '#000000';
			//ball qualities text
			disptextQ = game.add.text(null, groundlevel + 5 * hr, 'Power: 75\nAngle: 45', {
				font: 'Comic Sans MS',
				fontSize: 27 * hr,
				fill: '#000000'
			});

			disptextI.anchor.setTo(0, 0);
			disptextQ.anchor.setTo(0, 0);

			// +/- buttons for angle and power and launch
			powerplus = game.add.sprite(disptextQ.x + 138 * wr, disptextQ.y + 2 * hr, 'plusbutton');
			powerminus = game.add.sprite(powerplus.x + powerplus.width + 9 * wr, powerplus.y, 'minusbutton');
			angleplus = game.add.sprite(powerplus.x, powerplus.y + powerplus.height + 7 * hr, 'plusbutton');
			angleminus = game.add.sprite(powerminus.x, angleplus.y, 'minusbutton');

			//launch button
			launchbutton = game.add.sprite(powerminus.x + 45 * wr, (height - groundlevel) / 2 + groundlevel, 'launchbutton');
			launchbutton.anchor.setTo(0, 0.5);
			launchbutton.height = 805 / 10 * hr;
			launchbutton.width = launchbutton.height;
			launchbutton.inputEnabled = true;
			launchbutton.events.onInputDown.add(launchlistener, this);

			//powerupbutton
			powerupbutton = game.add.sprite(null, null, 'powerup');
			powerupbutton.anchor.setTo(0.5, 0.5);
			powerupbutton.height = launchbutton.height;
			powerupbutton.width = powerupbutton.height;
			powerupbutton.x = launchbutton.x + launchbutton.width / 2 + powerupbutton.width + 7 * wr;
			powerupbutton.y = (height - groundlevel) / 2 + groundlevel;
			powerupbutton.inputEnabled = true;
			powerupbutton.events.onInputDown.add(disppulistener, this);

			//activate button
			activatebutton = game.add.sprite(null, null, 'activatebutton');
			activatebutton.anchor.setTo(0.5, 0.5);
			activatebutton.height = launchbutton.height;
			activatebutton.width = powerupbutton.height;
			activatebutton.x = powerupbutton.x + launchbutton.width + 7 * wr;
			activatebutton.y = (height - groundlevel) / 2 + groundlevel;
			activatebutton.inputEnabled = true;
			activatebutton.events.onInputDown.add(activatepu, this);
			activatebutton.visible = false;

			//small circle to show limit
			poweruplimitbg = game.add.sprite(null, null, 'blackcircle');
			poweruplimitbg.anchor.setTo(0.7, 0.3);
			poweruplimitbg.height = 30 * hr;
			poweruplimitbg.width = poweruplimitbg.height;
			poweruplimitbg.x = powerupbutton.x + powerupbutton.width / 2 - 3 * wr;
			poweruplimitbg.y = powerupbutton.y - powerupbutton.height / 2 + 3 * hr;

			//powerup text
			poweruptext = game.add.text(null, null, '', {
				font: 'Comic Sans MS',
				fontSize: 50 * hr,
				fill: '#000000'
			});
			poweruptext.anchor.setTo(0.5, 0.5);
			poweruptext.x = width / 2;
			poweruptext.y = height / 13;

			//powerup limit
			poweruplimittext = game.add.text(null, null, '7', {
				font: 'Comic Sans MS',
				fontSize: 25 * hr,
				fill: '#ffffff'
			});
			poweruplimittext.anchor.setTo(0.5, 0.5);
			poweruplimittext.fontWeight = 'bold'
			poweruplimittext.x = poweruplimitbg.x - 5 * wr;
			poweruplimittext.y = poweruplimitbg.y + 9 * hr;

			//bg display power ups
			powerupdispbg = game.add.sprite(null, 60 * hr, 'roundrectangle');
			powerupdispbg.anchor.setTo(0, 0.5);
			powerupdispbg.height = 6 * 805 / 40 * hr;
			powerupdispbg.x = width / 6;
			powerupdispbg.width = 2 * width / 3;
			powerupdispbg.alpha = 0.85;
			powerupdispbg.visible = false;

			//superball
			superball = game.add.sprite(null, null, 'superball');
			superball.anchor.setTo(0.5, 0.5);
			superball.height = 100.625 * wr;
			superball.width = superball.height;
			superball.y = powerupdispbg.y;
			superball.inputEnabled = true;
			superball.events.onInputDown.add(superballlistener, this);
			superball.visible = false;

			//bouncyball
			bouncyball = game.add.sprite(null, null, 'bouncyball');
			bouncyball.anchor.setTo(0.5, 0.5);
			bouncyball.height = superball.height;
			bouncyball.width = superball.height;
			bouncyball.y = powerupdispbg.y;
			bouncyball.inputEnabled = true;
			bouncyball.events.onInputDown.add(bouncyballlistener, this);
			bouncyball.visible = false;

			//sticky ball
			gumball = game.add.sprite(null, null, 'gumball');
			gumball.anchor.setTo(0.5, 0.5);
			gumball.height = superball.height;
			gumball.width = superball.height;
			gumball.y = powerupdispbg.y;
			gumball.inputEnabled = true;
			gumball.events.onInputDown.add(gumballlistener, this);
			gumball.visible = false;

			//ice ball
			iceball = game.add.sprite(null, null, 'iceball');
			iceball.anchor.setTo(0.5, 0.5);
			iceball.height = superball.height;
			iceball.width = superball.height;
			iceball.y = powerupdispbg.y;
			iceball.inputEnabled = true;
			iceball.events.onInputDown.add(iceballlistener, this);
			iceball.visible = false;

			//laserball
			laserball = game.add.sprite(null, null, 'laserball');
			laserball.anchor.setTo(0.5, 0.5);
			laserball.height = superball.height;
			laserball.width = superball.height;
			laserball.y = powerupdispbg.y;
			laserball.inputEnabled = true;
			laserball.events.onInputDown.add(laserballlistener, this);
			laserball.visible = false;

			//reboost
			reboost = game.add.sprite(null, null, 'reboost');
			reboost.anchor.setTo(0.5, 0.5);
			reboost.height = superball.height;
			reboost.width = superball.height;
			reboost.y = powerupdispbg.y;
			reboost.inputEnabled = true;
			reboost.events.onInputDown.add(reboostlistener, this);
			reboost.visible = false;

			//dropball
			dropball = game.add.sprite(null, null, 'dropball');
			dropball.anchor.setTo(0.5, 0.5);
			dropball.height = superball.height;
			dropball.width = superball.height;
			dropball.y = powerupdispbg.y;
			dropball.inputEnabled = true;
			dropball.events.onInputDown.add(dropballlistener, this);
			dropball.visible = false;

			//mulligan
			mulligan = game.add.sprite(null, null, 'mulligan');
			mulligan.anchor.setTo(0.5, 0.5);
			mulligan.height = superball.height;
			mulligan.width = superball.height;
			mulligan.y = powerupdispbg.y;
			mulligan.inputEnabled = true;
			mulligan.events.onInputDown.add(mulliganlistener, this);
			mulligan.visible = false;

			//-1
			minus1 = game.add.sprite(null, null, 'minus1');
			minus1.anchor.setTo(0.5, 0.5);
			minus1.height = superball.height;
			minus1.width = superball.height;
			minus1.y = powerupdispbg.y;
			minus1.inputEnabled = true;
			minus1.events.onInputDown.add(minus1listener, this);
			minus1.visible = false;

			//setting up display for powerups
			superball.x = powerupdispbg.x + powerupdispbg.width / 2;
			iceball.x = superball.x + 110 * wr;
			laserball.x = superball.x - 110 * wr;
			dropball.x = superball.x + 110 * 2 * wr;
			bouncyball.x = superball.x - 110 * 2 * wr;
			gumball.x = superball.x + 110 * 3 * wr;
			reboost.x = superball.x - 110 * 3 * wr;
			mulligan.x = superball.x + 110 * 4 * wr;
			minus1.x = superball.x - 110 * 4 * wr;

			//reload page button
			homebutton = game.add.sprite(null, null, 'homebutton');
			homebutton.anchor.setTo(1, 0);
			homebutton.width = 50 * wr;
			homebutton.x = width - 70 * wr;
			homebutton.height = homebutton.width;
			homebutton.y = homebutton.height / 5;
			homebutton.inputEnabled = true;
			homebutton.events.onInputDown.add(resetlistener, this);

			//previous position button (practice only)
			redobutton = game.add.sprite(69 * wr, 44 * hr, 'redobutton');
			redobutton.anchor.setTo(0, 0);
			redobutton.height = 40 * hr;
			redobutton.width = redobutton.height;
			redobutton.inputEnabled = true;
			redobutton.events.onInputDown.add(redolistener, this);
			redobutton.visible = false;

			//scorecard background
			scorecardbg = game.add.sprite(0, 0, 'scorecardbg');
			scorecardbg.anchor.setTo(0, 0);
			scorecardbg.width = width;
			scorecardbg.height = height;
			scorecardbg.visible = false;

			//scorecard
			scorecard = game.add.sprite(width / 2, height / 2, 'scorecard');
			scorecard.anchor.setTo(0.5, 0.5);
			scorecard.height = 700 * hr;
			scorecard.width = 660 * wr;
			scorecard.visible = false;

			//next hole button
			button = game.add.sprite(scorecard.x + scorecard.width / 2 + 75 * wr, scorecard.y, 'nextholebutton');
			button.anchor.setTo(0, 0.5);
			button.width = 250 * wr;
			button.height = 250 * hr;
			button.inputEnabled = true;
			button.visible = false;
			button.events.onInputDown.add(listener, this);

			//next hole text
			disptextNext = game.add.text(button.x + button.width / 2, button.height / 2 + button.y + 30 * hr, 'Next Hole', {
				font: 'Comic Sans MS',
				fontSize: 60 * wr,
				fill: '#000000'
			});
			disptextNext.visible = false;
			disptextNext.anchor.setTo(0.5, 0.5);

			//score display
			score1 = game.add.text(scorecard.x + 85 * wr, scorecard.y - 155 * hr, '');
			score2 = game.add.text(score1.x, score1.y + scoregap, '');
			score3 = game.add.text(score1.x, score1.y + 2 * scoregap, '');
			score4 = game.add.text(score1.x, score1.y + 3 * scoregap, '');
			score5 = game.add.text(score1.x, score1.y + 4 * scoregap, '');
			score6 = game.add.text(score1.x, score1.y + 5 * scoregap, '');
			score7 = game.add.text(score1.x, score1.y + 6 * scoregap, '');
			score8 = game.add.text(score1.x, score1.y + 7 * scoregap, '');
			score9 = game.add.text(score1.x, score1.y + 8 * scoregap, '');
			score10 = game.add.text(score1.x, score1.y + 9 * scoregap, '');

			//all in an array for for loops
			allscores = [score1, score2, score3, score4, score5, score6, score7, score8, score9, score10]
			for (var i = 0; i < allscores.length; i++) {
				allscores[i].anchor.setTo(0.5, 0)
				allscores[i].font = 'Calibri',
					allscores[i].fontSize = 50 * hr,
					allscores[i].fontWeight = 'normal',
					allscores[i].fill = '#000000'
			}

			// +/- par text
			parScore = game.add.text(scorecard.x + 143 * wr, null, '', {
				font: 'Calibri'
			});
			parScore.anchor.setTo(1, 0);

			//main menu screen
			cover = game.add.sprite(0, 0, 'mainmenu');
			cover.anchor.setTo(0, 0);
			cover.width = width;
			cover.height = height;

			//information button
			information = game.add.sprite(null, null, 'information');
			information.anchor.setTo(1, 0);
			information.width = homebutton.height;
			information.height = homebutton.height;
			information.x = width - 6 * wr;
			information.y = homebutton.y;
			information.inputEnabled = true;
			information.events.onInputDown.add(infolistener, this);

			//start button
			startbutton = game.add.sprite(width / 2, height / 2, 'startbutton');
			startbutton.anchor.setTo(0.5, 0.5);
			startbutton.width = 425 * wr;
			startbutton.height = 425 * hr;
			startbutton.inputEnabled = true;
			startbutton.events.onInputDown.add(mainlistener, this);

			//practice button
			practicebutton = game.add.sprite(width / 4, height / 2, 'practicebutton');
			practicebutton.anchor.setTo(0.5, 0.5);
			practicebutton.width = 250 * wr;
			practicebutton.height = 250 * hr;
			practicebutton.inputEnabled = true;
			practicebutton.events.onInputDown.add(practicelistener, this);

			//customize button
			customize = game.add.sprite(3 * width / 4, height / 2, 'customize');
			customize.anchor.setTo(0.5, 0.5);
			customize.width = 250 * wr;
			customize.height = 250 * hr;
			customize.inputEnabled = true;
			customize.events.onInputDown.add(customizelistener, this);

			//play again / reload page button
			playagain = game.add.sprite(scorecard.x + scorecard.width - 85 * wr, scorecard.y, 'playagain');
			playagain.anchor.setTo(0.5, 0.5);
			playagain.visible = false;
			playagain.width = 400 * wr;
			playagain.height = 300 * hr;
			playagain.inputEnabled = true;
			playagain.events.onInputDown.add(resetlistener, this);

			//info page
			ipage = game.add.sprite(0, 0, 'ipage');
			ipage.anchor.setTo(0, 0);
			ipage.width = width;
			ipage.height = height;
			ipage.visible = false;

			//player
			character = game.add.sprite(2 * width, 2 * height, characterselection[charsel]);
			character.anchor.setTo(0.5, 0.5);
			flipcharacter = game.add.sprite(2 * width, 2 * height, flipcharacterselection[charsel]);
			flipcharacter.anchor.setTo(0.5, 0.5);
			character.visible = false;
			flipcharacter.visible = false;
			character.width = 100 * wr;
			character.height = 171 * hr;
			flipcharacter.width = 100 * wr;
			flipcharacter.height = 171 * hr;

			//all customizations
			customizations();

			//physics
			game.physics.startSystem(Phaser.Physics.ARCADE);
			game.physics.enable(ball, Phaser.Physics.ARCADE);

			//gravity
			game.physics.arcade.gravity.y = 400 * hr;

			//setting qualities for all platforms
			plat = [floor1, floor2, floor3, ground1, ground2, ground3, ground4, ground5];
			for (var i = 0; i < plat.length; i++) {
				game.physics.enable(plat[i], Phaser.Physics.ARCADE);
				plat[i].body.allowGravity = false;
				plat[i].body.immovable = true;
				plat[i].body.moves = false;
				plat[i].body.collideWorldBounds = true;
			}

			//setting qualities for ball
			ball.body.allowGravity = true;
			ball.body.immovable = false;
			ball.body.moves = true;
			ball.body.collideWorldBounds = true;
			ball.body.bounce = true;
			ball.body.bounce = new Phaser.Point(0.4, 0.4);

			//input keys
			SpaceBar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
			W = game.input.keyboard.addKey(Phaser.Keyboard.W);
			S = game.input.keyboard.addKey(Phaser.Keyboard.S);
			A = game.input.keyboard.addKey(Phaser.Keyboard.A);
			D = game.input.keyboard.addKey(Phaser.Keyboard.D);
			E = game.input.keyboard.addKey(Phaser.Keyboard.E);
			Q = game.input.keyboard.addKey(Phaser.Keyboard.Q);

			//running hole
			gameplay();

			//starting position of ball
			positionx.push(ball.x);
			positiony.push(ball.y);
		},

		update: function () {
			//collision between ball and platforms
			for (var i = 0; i < plat.length; i++) {
				game.physics.arcade.collide(plat[i], ball);
			}

			//launch values
			truepower = 6 * power;
			radianvalue = angle * Math.PI / 180;
			vY = -truepower * Math.sin(radianvalue);
			vX = truepower * Math.cos(radianvalue);

			//input
			const mouse = game.input.activePointer;

			//mobile buttons
			if (isMobile &&
				mouse.isDown &&
				mouse.x <= angleplus.x + angleplus.width / 2 &&
				mouse.x >= angleplus.x - angleplus.width / 2 &&
				mouse.y >= angleplus.y - angleplus.height / 2 &&
				mouse.y <= angleplus.y + angleplus.height / 2 &&
				ball.body.velocity.x == 0) {
				angleup();
			}
			if (isMobile &&
				mouse.isDown &&
				mouse.x <= angleminus.x + angleminus.width / 2 &&
				mouse.x >= angleminus.x - angleminus.width / 2 &&
				mouse.y >= angleminus.y - angleminus.height / 2 &&
				mouse.y <= angleminus.y + angleminus.height / 2 &&
				ball.body.velocity.x == 0) {
				angledown();
			}
			if (isMobile &&
				mouse.isDown &&
				mouse.x <= powerplus.x + powerplus.width / 2 &&
				mouse.x >= powerplus.x - powerplus.width / 2 &&
				mouse.y >= powerplus.y - powerplus.height / 2 &&
				mouse.y <= powerplus.y + powerplus.height / 2 &&
				ball.body.velocity.x == 0) {
				powerup();
			}
			if (isMobile &&
				mouse.isDown &&
				mouse.x <= powerminus.x + powerminus.width / 2 &&
				mouse.x >= powerminus.x - powerminus.width / 2 &&
				mouse.y >= powerminus.y - powerminus.height / 2 &&
				mouse.y <= powerminus.y + powerminus.height / 2 &&
				ball.body.velocity.x == 0) {
				powerdown();
			}

			//computer buttons
			if (
				(A.isDown || (mouse.isDown &&
					mouse.x >= angleplus.x &&
					mouse.x <= angleplus.x + angleplus.width &&
					mouse.y >= angleplus.y &&
					mouse.y <= angleplus.y + angleplus.height)) &&
				ball.body.velocity.x == 0 && isMobile == false
			) {
				angleup();
			}
			if (
				(D.isDown || (mouse.isDown &&
					mouse.x >= angleminus.x &&
					mouse.x <= angleminus.x + angleminus.width &&
					mouse.y >= angleminus.y &&
					mouse.y <= angleminus.y + angleminus.height)) &&
				ball.body.velocity.x == 0 && isMobile == false
			) {
				angledown();
			}
			if (
				(W.isDown || (mouse.isDown &&
					mouse.x >= powerplus.x &&
					mouse.x <= powerplus.x + powerplus.width &&
					mouse.y >= powerplus.y &&
					mouse.y <= powerplus.y + powerplus.height)) &&
				ball.body.velocity.x == 0 && isMobile == false
			) {
				powerup();
			}
			if (
				(S.isDown || (mouse.isDown &&
					mouse.x >= powerminus.x &&
					mouse.x <= powerminus.x + powerminus.width &&
					mouse.y >= powerminus.y &&
					mouse.y <= powerminus.y + powerminus.height)) &&
				ball.body.velocity.x == 0 && isMobile == false
			) {
				powerdown();
			}

			if (SpaceBar.isDown && ball.body.velocity.x == 0) {
				launch();
			}

			//flipping character
			if (angle > 90 && ball.visible == true) {
				character.visible = false;
				flipcharacter.visible = true;
			}
			if ((angle < 90 || angle > 270) && ball.visible == true) {
				character.visible = true;
				flipcharacter.visible = false;
			}

			//makes ball stop, found value by logging velocity
			//console.log(ball.body.velocity.y);
			//normal
			if (ball.body.velocity.y == -1.9047619047619049 * mobilemult) {
				stop();
			} else if (ball.body.velocity.y == -2.962962962962963 * mobilemult) {
				//bouncy ball
				stop();
			} else if (ball.body.velocity.y == -2.5925925925925926 * mobilemult) {
				//superball
				stop();
			} else if (ball.body.velocity.y == -1.6666666666666665 * mobilemult) {
				//laserball
				stop();
			}

			//arrow direction
			arrow.angle = -angle;
			arrow.height = character.width;
			arrow.width = (character.height - 30 * hr) * power / 100;
			arrow.x = ball.x + ball.height / 2 * Math.cos(angle * Math.PI / 180);
			arrow.y = ball.y - ball.height / 2 - ball.height / 2 * Math.sin(angle * Math.PI / 180);


			//show powerups
			if (E.isDown && game.time.totalElapsedSeconds() > 0.35) {
				game.time.reset();
				disppulistener();
			}
			//to activate * powerup's
			if ((dropballbol == 2 || (reboostbol == 2 || reboostbol == 1)) && Q.isDown) {
				activatepu();
			}

			//par
			if (hole == 1) {
				par = totalpar[0];
			} else {
				par = totalpar[hole - 1] - totalpar[hole - 2];
			}

			//displays scorecard screen
			function showscorecard() {
				ball.visible = false;
				character.visible = false;
				flipcharacter.visible = false;
				scorecardbg.visible = true;
				scorecard.visible = true;
				information.visible = false;
				updateScorecard();
				if (hole < 10) {
					button.visible = true;
					disptextNext.visible = true;
				} else if (hole == 10) {
					button.visible = false;
					disptextNext.visible = false;
					playagain.visible = true;
				}
				for (var i = 0; i < allscores.length; i++) {
					allscores[i].visible = true;
				}
				parScore.visible = true;
			}

			//checks for ball collision with bottom of hole
			if (ball.x >= cup.x && ball.x <= cup.x + cup.width && ball.y == floor3.y) {
				strokesdisp.push(strokes);
				if (prac == false) {
					showscorecard();
					newhole();
				}
				reset();
				stop();
			}

			//power max and min
			if (laserbol == false) {
				power = Math.min(100, Math.max(1, power));
			} else {
				power = Math.min(100, Math.max(100, power));
			}

			//collision with all sides and edge of screen
			for (var i = 0; i < plat.length; i++) {
				//top
				if (ball.x >= plat[i].x && ball.x <= plat[i].x + plat[i].width && ball.y == plat[i].y) {
					//gumball must be enabled for ball to stick
					if (gumbol == true) {
						stop();
						ball.body.moves = false;
						ball.y = ball.y - 1 * hr;
					}
					angle = Math.min(180, Math.max(0, angle));
					updateTextQ();
				}

				//left
				if (
					ball.x >= width - ball.width / 2 ||
					(ball.x == plat[i].x - ball.width / 2 &&
						ball.y >= plat[i].y - ball.height / 2 &&
						ball.y <= plat[i].y + plat[i].height + ball.height / 2)
				) {
					if (gumbol == true) {
						stop();
						ball.body.moves = false;
						ball.x = ball.x - 1 * wr;
						updateTextQ();
					}
					//ball falls
					if (laserbol == true) {
						//sets it to false and everything back to normal
						laserbol = false;
						ball.body.bounce = new Phaser.Point(0.4, 0.4);
						game.physics.arcade.gravity.y = 350 * hr;
						ball.body.velocity.setTo(0.001, 30 * hr);
					}
				}
				//right
				if (
					ball.x <= ball.width / 2 ||
					(ball.x == plat[i].x + plat[i].width + ball.width / 2 &&
						ball.y >= plat[i].y - ball.height / 2 &&
						ball.y <= plat[i].y + plat[i].height + ball.height / 2)
				) {
					if (gumbol == true) {
						stop();
						ball.body.moves = false;
						ball.x = ball.x + 2 * wr;
					}

					if (laserbol == true) {
						laserbol = false;
						ball.body.bounce = new Phaser.Point(0.4, 0.4);
						game.physics.arcade.gravity.y = 350 * hr;
						ball.body.velocity.setTo(0.001, 30 * hr);
					}
				}
				//bottom
				if (
					ball.y <= ball.height ||
					(ball.y == plat[i].y + plat[i].height + ball.height &&
						ball.x >= plat[i].x &&
						ball.x <= plat[i].x + plat[i].width)
				) {
					if (gumbol == true) {
						stop();
						ball.body.moves = false;
						ball.y = ball.y + 2 * hr;
					}

					if (laserbol == true) {
						laserbol = false;
						ball.body.bounce = new Phaser.Point(0.4, 0.4);
						game.physics.arcade.gravity.y = 350 * hr;
						ball.body.velocity.setTo(0.001, 30 * hr);
					}
				}

				//new min and max angles when ball sticks
				//top
				if (ball.y == plat[i].y - 1 * hr && ball.body.velocity.y == 0 && ball.body.velocity.x == 0) {
					angle = Math.min(180, Math.max(0, angle));
				} else if (
					(ball.y == ball.height + 2 * hr || ball.y == plat[i].y + plat[i].height + ball.height + 2 * hr) &&
					ball.body.velocity.y == 0 &&
					ball.body.velocity.x == 0
				) {
					//bottom
					angle = Math.min(360, Math.max(180, angle));
				} else if (
					ball.x == width - (Math.round(ball.width / 2) + 1 * wr) ||
					(ball.x == plat[i].x - (Math.round(ball.width / 2) + 1 * wr) &&
						ball.body.velocity.y == 0 &&
						ball.body.velocity.x == 0)
				) {
					//left
					angle = Math.min(270, Math.max(90, angle));
				} else if (
					Math.round(ball.x) == Math.round(ball.width / 2) + 2 * wr ||
					(ball.x == plat[i].x + plat[i].width + (Math.round(ball.width / 2) + 2 * wr) &&
						ball.body.velocity.y == 0 &&
						ball.body.velocity.x == 0)
				) {
					//right
					angle = Math.min(180, Math.max(-90, angle));
				}
			}

			//checks for ball collision with water hazard
			const water = [water1, water2];
			for (var i = 0; i < water.length; i++) {
				if (ball.x >= water[i].x && ball.x <= water[i].x + water[i].width && ball.y == water[i].y) {
					//powerup must be disabled
					if (icebol != 1) {
						ball.body.moves = true;
						ball.body.velocity.setTo(0.001, 0);
						ball.y = ball.y + 10 * hr;
						game.physics.arcade.gravity.y = 50 * hr;
					}
				}

				//checks for collision with bottom of hazard
				if (
					ball.x >= water[i].x &&
					ball.x <= water[i].x + water[i].width &&
					ball.y >= water[i].y + water[i].height
				) {
					redolistener();
					inwater = true;
					strokes++;
					updateTextI();
					stop();
				}
			}

			//checks for ball collision with sandtraps
			const sands = [sand1, sand2]
			for (var i = 0; i < sands.length; i++) {
				if (ball.x >= sands[i].x && ball.x <= sands[i].x + sands[i].width && ball.y == sands[i].y) {
					stop();
					ball.y = sands[i].y;
					ball.body.moves = false;
				}
			}

			//checks for collision with easteregg
			if (ball.x >= egg.x && ball.x <= egg.x + egg.width && ball.y <= egg.y + egg.height && ball.y >= egg.y) {
				egg.visible = false;
				strokes = 0;
				updateTextI();
			} else {
				egg.visible = true;
			}

			//checks if ball is on green and sets angle to 0 or 180
			if (
				ball.y == groundlevel &&
				ball.x >= green.x - green.width / 2 &&
				ball.x <= green.x + green.width / 2 &&
				ball.body.velocity.y == 0 &&
				ball.y == groundlevel
			) {
				ball.body.moves = false;
				ball.y = ball.y - 1 * hr;
				if (ball.x > flag.x) {
					angle = 180;
				} else if (ball.x < flag.x) {
					angle = 0;
				}
				updateTextQ();
			}

			//checks for bug when ball goes below ground
			if (ball.y > groundlevel + 3 * cup.height / 2) {
				redolistener();
				arrow.visible = true;
			}

			//if in practice mode
			if (prac == true) {
				//powerup display changes
				powerupdispbg.x = width / 4;
				powerupdispbg.width = 6 * width / 9;

				poweruptext.x = powerupdispbg.x + powerupdispbg.width / 2;
				//reset all button positions
				superball.x = powerupdispbg.x + powerupdispbg.width / 2;
				iceball.x = superball.x + 125 * wr;
				laserball.x = superball.x - 125 * wr;
				dropball.x = superball.x + 250 * wr;
				reboost.x = superball.x - 250 * wr;
				gumball.x = superball.x + 375 * wr;
				bouncyball.x = superball.x - 375 * wr;
			} else {
				powerupdispbg.x = width / 6;
				powerupdispbg.width = 2 * width / 3;
			}

			//if mobile
			if (isMobile) {
				//ball a little smaller
				ball.width = 25 * wr;
				ball.height = 25 * hr;
				disptextQ.fontWeight = 'bold'
				disptextQ.lineSpacing = -3 * hr;
				disptextQ.x = width / 2 - 68 * wr;
				disptextQ.y = (height - groundlevel) / 2 + groundlevel - disptextQ.height / 2;
				disptextQ.fontSize = 37 * wr

				//bigger buttons
				powerplus.anchor.setTo(0.5, 0.5);
				powerminus.anchor.setTo(0.5, 0.5);
				angleplus.anchor.setTo(0.5, 0.5);
				angleminus.anchor.setTo(0.5, 0.5);

				powerminus.x = disptextQ.x - 72 * wr
				powerminus.y = (height - groundlevel) / 2 + groundlevel;
				powerminus.width = 110 * wr;
				powerminus.height = 110 * wr;

				powerplus.x = powerminus.x - 119 * wr
				powerplus.y = powerminus.y
				powerplus.width = powerminus.height
				powerplus.height = powerminus.width

				angleplus.x = disptextQ.x + 232 * wr
				angleplus.y = powerminus.y
				angleplus.width = powerminus.width
				angleplus.height = powerminus.height

				angleminus.x = angleplus.x + 116 * wr
				angleminus.y = powerplus.y
				angleminus.width = powerplus.width
				angleminus.height = powerplus.height

				launchbutton.x = width / 4 - 54 * wr;
				launchbutton.height = 120 * wr;
				launchbutton.width = launchbutton.height;

				powerupbutton.x = 3 * width / 4 + 14 * wr;
				powerupbutton.width = launchbutton.height;
				powerupbutton.height = launchbutton.height;

				activatebutton.x = powerupbutton.x + 121 * wr
				activatebutton.height = angleplus.height;
				activatebutton.width = angleplus.height;
				poweruplimitbg.height = 40 * hr;
				poweruplimitbg.width = 40 * hr;
				poweruplimitbg.x = powerupbutton.x + powerupbutton.width / 2 - 10 * wr;
				poweruplimitbg.y = powerupbutton.y - powerupbutton.height / 2 + 10 * hr;
				poweruplimittext.x = poweruplimitbg.x - 7 * wr;
				poweruplimittext.y = poweruplimitbg.y + 11 * hr;
				poweruplimittext.fontSize = 31 * hr;
			} else {
				//buttons to computer settings
				disptextQ.x = 10 * wr;
				powerplus.anchor.setTo(0, 0);
				powerminus.anchor.setTo(0, 0);
				angleplus.anchor.setTo(0, 0);
				angleminus.anchor.setTo(0, 0);

				powerplus.width = 35 * wr;
				powerplus.height = 35 * hr;
				powerminus.width = powerplus.width;
				powerminus.height = powerplus.height;
				angleplus.width = powerplus.width;
				angleplus.height = powerplus.height;
				angleminus.width = powerplus.width;
				angleminus.height = powerplus.height;

				powerplus.x = disptextQ.x + width / 12 + 13 * wr
				powerplus.y = disptextQ.y + 2 * hr
				powerminus.x = powerplus.x + powerplus.width + 9 * wr
				powerminus.y = powerplus.y
				angleplus.x = powerplus.x
				angleplus.y = powerplus.y + powerplus.height + 7 * hr
				angleminus.x = powerminus.x
				angleminus.y = angleplus.y

				launchbutton.x = powerminus.x + 45 * wr;
				powerupbutton.x = launchbutton.x + launchbutton.width / 2 + powerupbutton.width + 7 * wr;
				activatebutton.x = powerupbutton.x + launchbutton.width + 7 * wr;
				poweruplimitbg.height = 30 * hr;
				poweruplimitbg.width = 30 * hr;
				poweruplimitbg.x = powerupbutton.x + powerupbutton.width / 2 - 3 * wr;
				poweruplimitbg.y = powerupbutton.y - powerupbutton.height / 2 + 3 * hr;
				poweruplimittext.x = poweruplimitbg.x - 5 * wr;
				poweruplimittext.y = poweruplimitbg.y + 9 * hr;
				poweruplimittext.fontSize = 25 * hr;
			}

			//starts the next hole
			function newhole() {
				if (hole == 0) {
					hole1();
				} else if (hole == 1) {
					hole2();
				} else if (hole == 2) {
					hole3();
				} else if (hole == 3) {
					hole4();
				} else if (hole == 4) {
					hole5();
				} else if (hole == 5) {
					hole6();
				} else if (hole == 6) {
					hole7();
				} else if (hole == 7) {
					hole8();
				} else if (hole == 8) {
					hole9();
				} else if (hole == 9) {
					hole = 10;
					showscorecard();
				}
			}
		}
	};

	//phaser
	game.state.add('GameState', GameState);
	game.state.start('GameState');
}

//runs the current hole
function gameplay() {
	//run hole
	if (hole == 1) {
		hole1();
	} else if (hole == 2) {
		hole2();
	} else if (hole == 3) {
		hole3();
	} else if (hole == 4) {
		hole4();
	} else if (hole == 5) {
		hole5();
	} else if (hole == 6) {
		hole6();
	} else if (hole == 7) {
		hole7();
	} else if (hole == 8) {
		hole8();
	} else if (hole == 9) {
		hole9();
	}
}

//ball stops and character moves to new ball location
function stop() {
	ball.body.velocity.setTo(0, 0);
	ball.body.moves = false;
	updateTextQ();
	gumbol = false;
	if (powerupbol == false) {
		poweruptext.setText('');
	}
	activatebutton.visible = false;
	character.x = ball.x - character.width / 2 - ball.width / 2;
	character.y = ball.y - character.height / 2;
	flipcharacter.x = ball.x + flipcharacter.width / 2 + ball.width / 2;
	flipcharacter.y = ball.y - flipcharacter.height / 2;
	arrow.visible = true;
	arrow.x = ball.x + ball.height / 2 * Math.cos(angle * Math.PI / 180);
	arrow.y = ball.y - ball.height / 2 - ball.height / 2 * Math.sin(angle * Math.PI / 180);
}

//resets ball and player
function reset() {
	ball.x = teebox[0] + character.width + ball.width / 2;
	ball.y = groundlevel;
	power = 75;
	angle = 45;
	strokes = 0;
	updateTextI();
	updateTextQ();
}

//listeners for buttons
function mainlistener() {
	ball.visible = true;
	character.visible = true;
	background.visible = true;
	homebutton.visible = true;
	cover.visible = false;
	startbutton.visible = false;
	practicebutton.visible = false;
	customize.visible = false;
}

function practicelistener() {
	updateTextI();

	//prompt for what hole user wants to practice
	var phole = parseInt(prompt('Please Enter Hole Number (1-9)'));

	if (isNaN(phole)) {
		phole = parseInt(prompt('That is not a number. Please enter a number from 1 to 9', ''));
	}
	if (phole > 9) {
		phole = parseInt(prompt('Your number (' + phole + ') is above 9. Please enter a number from 1 to 9', ''));
	}
	if (phole < 1) {
		phole = parseInt(prompt('Your number (' + phole + ') is less than 1. Please enter a number from 1 to 9', ''));
	}
	if (phole > 0 && phole <= 9) {
		//start practice mode
		prac = true;
		//unlimited powerups in practice mode
		poweruplimittext.setText('∞');
		homebutton.visible = true;
		redobutton.visible = true;
		//moving home button
		homebutton.x = 58 * wr;
		homebutton.y = 44 * hr;
		homebutton.height = redobutton.height;
		homebutton.width = homebutton.height;
		disptextI.fontSize = 30 * hr;
		disptextI.lineSpacing = -5 * hr;
		hole = phole;
		if (hole == 1) {
			par = totalpar[0];
		} else {
			par = totalpar[hole - 1] - totalpar[hole - 2];
		}
		//more spaces for mobile
		if (isMobile) {
			disptextI.setText('Practice     Hole: ' + hole + '\n                   Par: ' + par + '\nBest: 0       Strokes: 0');
		} else {
			disptextI.setText('Practice      Hole: ' + hole + '\n               Par: ' + par + '\nBest: 0      Strokes: 0');
		}
		gameplay();
		mainlistener();
	}
}


function listener() {
	ball.visible = true;
	information.visible = true;
	button.visible = false;
	scorecard.visible = false;
	scorecardbg.visible = false;
	disptextNext.visible = false;
	for (var i = 0; i < allscores.length; i++) {
		allscores[i].visible = false;
	}
	parScore.visible = false;
}

//reload page
function resetlistener() {
	location.reload();
}

//to show info screen
function infolistener() {
	game.physics.arcade.gravity.y = 1000;
	ball.body.velocity.setTo(0, 0);
	character.visible = false;
	flipcharacter.visible = false;
	ball.visible = false;
	ipage.visible = true;
	mainbutton.visible = true;
}

//launches ball using button
function launchlistener() {
	if (ball.body.velocity.x == 0) {
		launch();
	}
}

//launch
function launch() {
	inwater = false;
	icebol = icebol / 2;
	if (reboostbol != 1) {
		positionx.push(ball.x);
		positiony.push(ball.y);
		strokes++;
	}
	reboostbol = reboostbol / 2;
	hideallpowerups();
	ball.y = ball.y - 1 * hr;
	ball.body.moves = true;
	arrow.visible = false;

	//if no powerups, set to default
	if (powerupbol == false) {
		bXM = 1;
		bYM = 1;
		vXM = 1;
		vYM = 1;
		gravM = 1;
	} else if ((powerupbol = true)) {
		poweruplimit--;
	}
	//launch physics with adjustable values for powerups
	ball.body.bounce = new Phaser.Point(0.4 * bXM, 0.4 * bYM);
	ball.body.velocity.setTo(mobilemult * vX * vXM, mobilemult * vY * vYM);
	game.physics.arcade.gravity.y = mobilemult * 400 * gravM;
	powerupbol = false;
	updateTextI();
}

function angleup() {
	//if ball is on green, set angle to 180 or 0
	if (
		ball.x >= green.x - green.width / 2 &&
		ball.x <= green.x + green.width / 2 &&
		ball.body.velocity.x == 0 &&
		ball.y == groundlevel - 1 * hr
	) {
		angle = 180;
	} else {
		//70% speed
		angle = angle + 0.7;
	}
	updateTextQ();
}

function angledown() {
	if (
		ball.x >= green.x - green.width / 2 &&
		ball.x <= green.x + green.width / 2 &&
		ball.body.velocity.x == 0 &&
		ball.y == groundlevel - 1 * hr
	) {
		angle = 0;
	} else {
		angle = angle - 0.7;
	}
	updateTextQ();
}

function powerup() {
	power = power + 0.6;
	updateTextQ();
}

function powerdown() {
	power = power - 0.6;
	updateTextQ();
}


//updates the information shown on screen
function updateTextI() {
	if (prac == false) {
		disptextI.setText('Hole: ' + hole + '\nPar: ' + par + '\nStrokes: ' + strokes);
		poweruplimittext.setText(poweruplimit);
	} else if ((prac = true && strokesdisp.length > 0)) {
		if (isMobile) {
			disptextI.setText(
				'Practice     Hole: ' +
				hole +
				'\n                   Par: ' +
				par +
				'\nBest: ' +
				Math.min.apply(null, strokesdisp) +
				'       Strokes: ' +
				strokes
			)
		} else {
			disptextI.setText(
				'Practice      Hole: ' +
				hole +
				'\n               Par: ' +
				par +
				'\nBest: ' +
				Math.min.apply(null, strokesdisp) +
				'      Strokes: ' +
				strokes
			);
		}

	} else if ((prac = true && strokesdisp.length == 0)) {
		if (isMobile) {
			disptextI.setText(
				'Practice     Hole: ' +
				hole +
				'\n                   Par: ' +
				par +
				'\nBest: ' +
				strokes +
				'       Strokes: ' +
				strokes
			)
		} else {
			disptextI.setText(
				'Practice      Hole: ' +
				hole +
				'\n               Par: ' +
				par +
				'\nBest: ' +
				strokes +
				'      Strokes: ' +
				strokes
			)
		};
	}
};

//updates characteristics of shot shown on screen
function updateTextQ() {
	disptextQ.setText('Power: ' + Math.round(power) + '\nAngle: ' + Math.round(angle));
}

//updates score card with score and par
function updateScorecard() {
	var i = strokesdisp.length - 1;
	if (hole != 10) {
		total = total + strokesdisp[i];
	}
	console.log(total)
	console.log(strokesdisp[i])
	sw = total - totalpar[i];

	//different colors if over or under par
	if (total > totalpar[i]) {
		parScore.addColor('#228B22', 0);
		parScore.fontSize = 20 * hr;
		parScore.setText('+' + sw);
	} else if (total < totalpar[i]) {
		parScore.addColor('#ff0000', 0);
		parScore.fontSize = 20 * hr;
		parScore.setText(sw);
	} else if (total == totalpar[i]) {
		parScore.addColor('#000000', 0);
		parScore.fontSize = 21 * hr;
		parScore.setText('E');
	}
	if (strokesdisp.length < 9) {
		parScore.fontSize = 25 * hr;
		parScore.y = scorecard.y - 152 * hr + 48 * hr * i;
	} else {
		parScore.y = scorecard.y + 310 * hr;
	}

	//score on each hole shown on scorecard
	if (strokesdisp.length >= 9) {
		scorecolor();
		score9.setText(strokesdisp[8])
		score10.setText(total)
		if (total - totalpar[i] > 0) {
			score10.addColor('#228B22', 0);
		} else if (total - totalpar[i] == 0) {
			score10.addColor('#000000', 0);
		} else if (total - totalpar[i] < 0) {
			score10.addColor('#ff0000', 0);
		}
	} else if (strokesdisp.length >= 8) {
		scorecolor();
		score8.setText(strokesdisp[7])
	} else if (strokesdisp.length >= 7) {
		scorecolor();
		score7.setText(strokesdisp[6])
	} else if (strokesdisp.length >= 6) {
		scorecolor();
		score6.setText(strokesdisp[5])
	} else if (strokesdisp.length >= 5) {
		scorecolor();
		score5.setText(strokesdisp[4])
	} else if (strokesdisp.length >= 4) {
		scorecolor();
		score4.setText(strokesdisp[3])
	} else if (strokesdisp.length >= 3) {
		scorecolor();
		score3.setText(strokesdisp[2])
	} else if (strokesdisp.length >= 2) {
		scorecolor();
		score2.setText(strokesdisp[1])
	} else if (strokesdisp.length >= 1) {
		score1.setText(strokesdisp[0])
		if (strokesdisp[i] - totalpar[i] > 0) {
			score1.addColor('#228B22', 0);
		} else if (strokesdisp[i] - totalpar[i] == 0) {
			score1.addColor('#000000', 0);
		} else if (strokesdisp[i] - totalpar[i] < 0) {
			score1.addColor('#ff0000', 0);
		}
	}

	//sets color of number on scorecard
	function scorecolor() {
		for (var i = 1; i < allscores.length - 1; i++) {
			if (strokesdisp[i] - (totalpar[i] - totalpar[i - 1]) > 0) {
				allscores[i].addColor('#228B22', 0);
			} else if (strokesdisp[i] - (totalpar[i] - totalpar[i - 1]) == 0) {
				allscores[i].addColor('#000000', 0);
			} else if (strokesdisp[i] - (totalpar[i] - totalpar[i - 1]) < 0) {
				allscores[i].addColor('#ff0000', 0);
			}
		}
	}
}

//move to previous position
function redolistener() {
	ball.body.moves = false;
	ball.x = positionx[positionx.length - 1];
	ball.y = positiony[positiony.length - 1];
	ball.body.velocity.setTo(0, 0);
	character.x = ball.x - character.width / 2 - ball.width / 2;
	character.y = ball.y - character.height / 2;
	flipcharacter.x = ball.x + flipcharacter.width / 2 + ball.width / 2;
	flipcharacter.y = ball.y - flipcharacter.height / 2;
	arrow.visible = true;
	arrow.x = ball.x + ball.height / 2 * Math.cos(angle * Math.PI / 180);
	arrow.y = ball.y - ball.height / 2 - ball.height / 2 * Math.sin(angle * Math.PI / 180);
}

//when display powerup button is pressed
function disppulistener() {
	if (poweruplimit > 0 || prac == true) {
		if (powerupdispbg.visible == false) {
			showallpowerups();
		} else if (powerupdispbg.visible == true) {
			hideallpowerups();
		}
		updateTextI();
	}
}

//displays all powerups
function showallpowerups() {
	if (ball.body.velocity.x == 0) {
		//and all other buttons
		powerupdispbg.visible = true;
		//not availible when score=0 or in practice mode
		if (strokes > 0 && prac == false) {
			minus1.visible = true;
			mulligan.visible = true;
		}
		superball.visible = true;
		reboost.visible = true;
		dropball.visible = true;
		bouncyball.visible = true;
		gumball.visible = true;
		iceball.visible = true;
		laserball.visible = true;
	}
}

//hides all powerups
function hideallpowerups() {
	powerupdispbg.visible = false;
	superball.visible = false;
	reboost.visible = false;
	dropball.visible = false;
	laserball.visible = false;
	minus1.visible = false;
	mulligan.visible = false;
	bouncyball.visible = false;
	iceball.visible = false;
	gumball.visible = false;
}

//to activate powerup
function activatepu() {
	if (ball.body.velocity.y != 0) {
		if (reboostbol == 2 || reboostbol == 1) {
			launch();
			reboostbol = null;
			activatebutton.visible = false;
		} else if (dropballbol == 2) {
			ball.body.velocity.setTo(0, 0);
			dropballbol = null;
			activatebutton.visible = false;
		}
	}
}

//superball qualities
function superballlistener() {
	hideallpowerups();
	poweruptext.setText('Power-Up: Super Ball');

	bXM = 1;
	bYM = 0.35 / 0.4;
	vXM = 7 / 4;
	vYM = 7 / 4;
	gravM = 1.5;

	powerupbol = true;
	//to disable other powerups
	gumbol = false;
	laserbol = false;
	reboostbol = null;
	dropballbol = null;
	activatebutton.visible = false;
}

//bouncy ball qualities
function bouncyballlistener() {
	hideallpowerups();
	poweruptext.setText('Power-Up: Bouncy Ball');

	bXM = 0.85 / 0.4;
	bYM = 0.8 / 0.4;
	vXM = 0.98;
	vYM = 1.05;
	gravM = 1;

	powerupbol = true;
	//to disable other powerups
	gumbol = false;
	laserbol = false;
	reboostbol = null;
	dropballbol = null;
	activatebutton.visible = false;
}

//gumball qualities
function gumballlistener() {
	ball.y = ball.y - 1;
	gumbol = true;

	hideallpowerups();
	poweruptext.setText('Power-Up: Gum Ball');

	bXM = 0 / 0.4;
	bYM = 0 / 0.4;
	vXM = 1;
	vYM = 1;
	gravM = 1;

	powerupbol = true;
	laserbol = false;
	reboostbol = null;
	dropballbol = null;
	activatebutton.visible = false;
}

//ice ball qualities
function iceballlistener() {
	icebol = 2;
	hideallpowerups();
	poweruptext.setText('Power-Up: Ice Ball');

	bXM = 1;
	bYM = 1;
	vXM = 1;
	vYM = 1;
	gravM = 1;

	powerupbol = true;
	//to disable other powerups
	gumbol = false;
	laserbol = false;
	reboostbol = null;
	dropballbol = null;
	activatebutton.visible = false;
}

//laserball qualities
function laserballlistener() {
	laserbol = true;
	power = 100;
	updateTextQ();
	hideallpowerups();
	poweruptext.setText('Power-Up: Laser Ball');

	bXM = 1;
	bYM = 1;
	vXM = 1.5;
	vYM = 1.2;
	gravM = 0.2;

	powerupbol = true;
	//to disable other powerups
	gumbol = false;
	reboostbol = null;
	dropballbol = null;
	activatebutton.visible = false;
}

//reboost qualities
function reboostlistener() {
	activatebutton.visible = true;
	reboostbol = 2;
	hideallpowerups();
	poweruptext.setText('Power-Up: Reboost *');

	bXM = 1;
	bYM = 1;
	vXM = 1;
	vYM = 1;
	gravM = 1;

	powerupbol = true;
	//to disable other powerups
	gumbol = false;
	laserbol = false;
	dropballbol = null;
}

//dropball qualities
function dropballlistener() {
	activatebutton.visible = true;
	dropballbol = 2;
	hideallpowerups();
	poweruptext.setText('Power-Up: Drop Ball *');

	bXM = 1;
	bYM = 1;
	vXM = 1;
	vYM = 1;
	gravM = 1;

	powerupbol = true;
	//to disable other powerups
	gumbol = false;
	laserbol = false;
	reboostbol = null;
}

//not an onlaunch powerups
//-1
function minus1listener() {
	poweruplimit--;
	hideallpowerups();
	strokes--;
	updateTextI();
	poweruptext.setText('Power-Up: -1');

	bXM = 1;
	bYM = 1;
	vXM = 1;
	vYM = 1;
	gravM = 1;

	//to disable other powerups
	gumbol = false;
	laserbol = false;
	reboostbol = null;
	dropballbol = null;
	activatebutton.visible = false;
}

//mulligan powerup
function mulliganlistener() {
	poweruplimit--;
	hideallpowerups();
	redolistener();
	if (inwater == true) {
		strokes = strokes - 2;
	} else {
		strokes--;
	}
	updateTextI();
	poweruptext.setText('Power-Up: Mulligan');
	inwater = false;

	bXM = 1;
	bYM = 1;
	vXM = 1;
	vYM = 1;
	gravM = 1;

	//to disable other powerups
	gumbol = false;
	laserbol = false;
	reboostbol = null;
	dropballbol = null;
	activatebutton.visible = false;
}

//characteristics all holes share
function defhole() {
	if (hole == 1) {
		par = totalpar[0];
	} else {
		par = totalpar[hole - 1] - totalpar[hole - 2];
	}

	//background
	background.x = width / 2;
	background.y = height / 2;
	background.height = height;
	background.width = width;

	//player
	character.width = 100 * wr;
	character.height = 171 * hr;
	character.x = teebox[0] + character.width / 2;
	character.y = groundlevel - character.height / 2;
	flipcharacter.width = 100 * wr;
	flipcharacter.height = 171 * hr;
	flipcharacter.x = teebox[1] + flipcharacter.width / 2 + 3 * ball.width / 2;
	flipcharacter.y = groundlevel - flipcharacter.height / 2;

	//green
	green.width = 310 * wr;
	green.anchor.setTo(0.5, 0);
	green.x = width - green.width / 2;
	green.y = groundlevel;

	//cup
	cup.height = 40 * hr;
	cup.width = 70 * wr;
	cup.y = groundlevel + 36 * hr;

	//flag
	flag.x = green.x - green.width / 2 + cup.width / 2 + Math.random() * (green.width - flag.width - cup.width / 2);
	flag.y = groundlevel;
	flag.width = 103 * wr;
	flag.height = 200 * hr;

	//flag #
	flagtext.setText(hole);
	flagtext.x = flag.x + 6 * flag.width / 16;
	flagtext.y = flag.y - 6 * flag.height / 8 + 5 * hr;

	//ground
	floor1.height = height - groundlevel;
	floor1.x = 0;
	floor1.y = groundlevel;

	floor2.height = height - groundlevel;
	floor2.y = groundlevel;
	floor3.width = cup.width;
	floor3.y = cup.y - 1 * hr;
	floor3.height = height - floor3.y;

	//ball
	ball.x = character.x + character.width / 2 + ball.width / 2;
	ball.y = groundlevel;
	ball.width = 28 * wr;
	ball.height = 28 * hr;
	ball.body.moves = false;

	//set values from hole position
	cup.x = flag.x - cup.width / 2 + 5 * wr;
	floor3.x = cup.x;
	floor1.width = cup.x;
	floor2.x = cup.x + cup.width;
	floor2.width = width - floor2.x;
}

function hole1() {
	hole = 1;
	defhole();

	//sand
	sand1.width = 3 * ball.width;
	sand1.height = 10 * hr;
	sand1.x = width / 2 + 20 * wr;
	sand1.y = groundlevel;

	//water
	water1.width = 5 * ball.width / 2;
	water1.height = 35 * hr;
	water1.x = width / 4;
	water1.y = groundlevel;

	//everything else off screen
	ground1.x = 2 * width;
	ground1.y = null;
	ground1.width = null;
	ground1.height = null;

	ground2.x = 2 * width;
	ground2.y = null;
	ground2.width = null;
	ground2.height = null;

	ground3.x = 2 * width;
	ground3.y = null;
	ground3.width = null;
	ground3.height = null;

	ground4.x = 2 * width;
	ground4.y = null;
	ground4.width = null;
	ground4.height = null;

	ground5.x = 2 * width;
	ground5.y = null;
	ground5.width = null;
	ground5.height = null;

	sand2.x = 2 * width;
	sand2.y = null;
	sand2.width = null;
	sand2.height = null;

	water2.x = 2 * width;
	water2.y = null;
	water2.width = null;
	water2.height = null;

	egg.x = 2 * width;
	egg.y = null;
	egg.width = null;
	egg.height = null;

	hidegg.x = 2 * width;
	hidegg.y = null;
	hidegg.width = null;
	hidegg.height = null;
}

function hole2() {
	hole = 2;
	defhole();

	ground1.width = floor3.width;
	ground1.height = height / 2 - 100 * hr;
	ground1.x = width / 2 - ground1.width / 2;
	ground1.y = groundlevel - ground1.height;

	//sand
	sand1.x = ground1.x - sand1.width - 30 * wr;
	sand1.width = 90 * wr;
	sand1.height = 10 * hr;
	sand1.y = groundlevel;

	//water
	water1.x = ground1.x + ground1.width + 30 * wr;
	water1.y = groundlevel;
	water1.height = 50 * hr;
	water1.width = 80 * wr;

	//everything else off screen
	ground2.x = 2 * width;
	ground2.y = null;
	ground2.width = null;
	ground2.height = null;

	ground3.x = 2 * width;
	ground3.y = null;
	ground3.width = null;
	ground3.height = null;

	ground4.x = 2 * width;
	ground4.y = null;
	ground4.width = null;
	ground4.height = null;

	ground5.x = 2 * width;
	ground5.y = null;
	ground5.width = null;
	ground5.height = null;

	sand2.x = 2 * width;
	sand2.y = null;
	sand2.width = null;
	sand2.height = null;

	water2.x = 2 * width;
	water2.y = null;
	water2.width = null;
	water2.height = null;

	egg.x = 2 * width;
	egg.y = null;
	egg.width = null;
	egg.height = null;

	hidegg.x = 2 * width;
	hidegg.y = null;
	hidegg.width = null;
	hidegg.height = null;
}

function hole3() {
	hole = 3;
	defhole();

	ground1.width = width / 6;
	ground1.height = 2 * groundlevel / 9;
	ground1.x = width / 6;
	ground1.y = groundlevel - ground1.height;

	ground2.width = width / 7;
	ground2.height = 2 * ground1.height;
	ground2.x = ground1.x + ground1.width;
	ground2.y = groundlevel - ground2.height;

	ground3.width = width / 7;
	ground3.height = 3 * ground1.height;
	ground3.x = ground2.x + ground2.width;
	ground3.y = groundlevel - ground3.height;

	ground4.height = (ground1.height - ground2.height) / 2 + ground2.height;
	ground4.x = ground3.x + ground3.width;
	ground4.width = green.x - green.width / 2 - ground4.x;
	ground4.y = groundlevel - ground4.height;

	water1.width = 70 * wr;
	water1.x = width - water1.width;
	water1.y = groundlevel;
	water1.height = 35 * hr;

	//everything else off screen
	ground5.x = 2 * width;
	ground5.width = 0;
	ground5.height = 0;
	ground5.y = 0;

	sand1.x = 2 * width;
	sand1.y = null;
	sand1.width = null;
	sand1.height = null;

	sand2.x = 2 * width;
	sand2.y = null;
	sand2.width = null;
	sand2.height = null;

	water2.x = 2 * width;
	water2.y = null;
	water2.width = null;
	water2.height = null;

	egg.x = 2 * width;
	egg.y = null;
	egg.width = null;
	egg.height = null;

	hidegg.x = 2 * width;
	hidegg.y = null;
	hidegg.width = null;
	hidegg.height = null;
}

function hole4() {
	hole = 4;
	defhole();

	ground1.x = width / 8;
	ground1.width = floor3.width;
	ground1.height = height / 2 - 100 * hr;
	ground1.y = groundlevel - ground1.height;

	ground2.height = 13 * ground1.height / 8;
	ground2.width = ground1.width;
	ground2.x = 7 * width / 32;
	ground2.y = 0;

	ground3.height = 11 * ground1.height / 8;
	ground3.width = ground1.width;
	ground3.x = 13 * width / 32;
	ground3.y = 0;

	ground4.width = ground1.width;
	ground4.height = height / 4;
	ground4.x = 13 * width / 32;
	ground4.y = groundlevel - ground4.height;

	ground5.height = groundlevel - 2 * ball.height;
	ground5.width = ground1.width;
	ground5.x = 2 * width / 3;
	ground5.y = 0;

	//everything else off screen
	sand1.x = 2 * width;
	sand1.y = null;
	sand1.width = null;
	sand1.height = null;

	sand2.x = 2 * width;
	sand2.y = null;
	sand2.width = null;
	sand2.height = null;

	water1.x = 2 * width;
	water1.y = null;
	water1.width = null;
	water1.height = null;

	water2.x = 2 * width;
	water2.y = null;
	water2.width = null;
	water2.height = null;

	egg.x = 2 * width;
	egg.y = null;
	egg.width = null;
	egg.height = null;

	hidegg.x = 2 * width;
	hidegg.y = null;
	hidegg.width = null;
	hidegg.height = null;
}

function hole5() {
	hole = 5;
	defhole();

	ground1.x = 5 * width / 12;
	ground1.y = 0;
	ground1.width = cup.width;
	ground1.height = groundlevel - 5 * ball.height / 2;

	ground2.height = 15 * height / 32;
	ground2.x = 7 * width / 12;
	ground2.y = groundlevel - ground2.height;
	ground2.width = cup.width;

	sand1.x = ground2.x + 8 * wr;
	sand1.y = ground2.y;
	sand1.width = ground2.width - 16 * wr;
	sand1.height = 10;

	water1.width = 75 * wr;
	water1.x = ground1.x - water1.width;
	water1.y = groundlevel;
	water1.height = 35 * hr;

	water2.x = ground2.x + ground2.width + ball.width;
	water2.y = groundlevel;
	water2.width = 75 * wr;
	water2.height = 35 * hr;

	//everything else off screen
	ground3.x = 2 * width;
	ground3.y = null;
	ground3.width = null;
	ground3.height = null;

	ground4.x = 2 * width;
	ground4.y = null;
	ground4.width = null;
	ground4.height = null;

	ground5.x = 2 * width;
	ground5.y = null;
	ground5.width = null;
	ground5.height = null;

	sand2.x = 2 * width;
	sand2.y = null;
	sand2.width = null;
	sand2.height = null;

	egg.x = 2 * width;
	egg.y = null;
	egg.width = null;
	egg.height = null;

	hidegg.x = 2 * width;
	hidegg.y = null;
	hidegg.width = null;
	hidegg.height = null;
}

function hole6() {
	hole = 6;
	defhole();

	ground1.x = width / 3 + 40 * wr;
	ground1.y = 80 * hr;
	ground1.width = 80 * wr;
	ground1.height = groundlevel - ground1.y;

	ground2.width = 180 * wr;
	ground2.x = ground1.x - ground2.width;
	ground2.y = height / 2 + 10 * hr;
	ground2.height = 70 * hr;

	ground3.x = 0;
	ground3.y = height / 3 - 40 * hr;
	ground3.width = 230 * wr;
	ground3.height = ground2.height;

	ground4.x = width / 2;
	ground4.y = 0;
	ground4.width = ground1.width;
	ground4.height = groundlevel - 100 * hr;

	ground5.x = ground4.x + 3 * ground4.width;
	ground5.height = height / 4;
	ground5.y = groundlevel - ground5.height;
	ground5.width = 60 * wr;

	sand1.x = ground4.x;
	sand1.y = groundlevel;
	sand1.width = ground4.width;
	sand1.height = 10 * hr;

	water1.x = ground1.x + 10 * wr;
	water1.y = ground1.y;
	water1.width = ground1.width - 20 * wr;
	water1.height = 40 * hr;

	//everything else off screen
	sand2.x = 2 * width;
	sand2.y = null;
	sand2.width = null;
	sand2.height = null;

	water2.x = 2 * width;
	water2.y = null;
	water2.width = null;
	water2.height = null;

	egg.x = 2 * width;
	egg.y = null;
	egg.width = null;
	egg.height = null;

	hidegg.x = 2 * width;
	hidegg.y = null;
	hidegg.width = null;
	hidegg.height = null;
}

function hole7() {
	hole = 7;
	defhole();

	egg.height = 5 * ball.height / 4;
	egg.y = groundlevel - egg.height;

	ground1.height = 4 * height / 7;
	ground1.x = width / 4;
	ground1.y = egg.y - ground1.height;
	ground1.width = cup.width;

	egg.x = ground1.x;
	egg.width = ground1.width;

	hidegg.x = egg.x + egg.width / 2;
	hidegg.y = egg.y;
	hidegg.width = 7 * egg.width / 16;
	hidegg.height = egg.height;

	water2.x = width / 7;
	water2.y = groundlevel;
	water2.width = 7 * ball.width / 2;
	water2.height = 35 * hr;

	sand2.x = 5 * width / 12;
	sand2.y = groundlevel;
	sand2.width = 3 * ball.width;
	sand2.height = 10 * wr;

	water1.x = width / 2;
	water1.y = groundlevel;
	water1.width = 3 * ball.width;
	water1.height = 35 * hr;

	//everything else off screen
	ground2.x = 2 * width;
	ground2.y = null;
	ground2.width = null;
	ground2.height = null;

	ground3.x = 2 * width;
	ground3.y = null;
	ground3.width = null;
	ground3.height = null;

	ground4.x = 2 * width;
	ground4.y = null;
	ground4.width = null;
	ground4.height = null;

	ground5.x = 2 * width;
	ground5.y = null;
	ground5.width = null;
	ground5.height = null;

	sand1.x = 2 * width;
	sand1.y = null;
	sand1.width = null;
	sand1.height = null;
}

function hole8() {
	hole = 8;
	defhole();

	ground1.height = height / 4;
	ground1.x = width / 3;
	ground1.y = groundlevel - ground1.height;
	ground1.width = 2 * ball.width;

	ground2.x = ground1.x;
	ground2.y = 0;
	ground2.width = ground1.width;
	ground2.height = ground1.y - 5 * ball.height / 2;

	sand1.x = ground1.x + 8 * wr;
	sand1.y = ground1.y;
	sand1.width = ground1.width - 16 * wr;
	sand1.height = 10 * hr;

	water1.width = 5 * ball.width / 2;
	water1.x = ground1.x - water1.width - ball.width;
	water1.y = groundlevel;
	water1.height = 35 * hr;

	sand2.width = 2 * ball.width;
	sand2.x = water1.x - 5 * ball.width / 2 - sand2.width;
	sand2.y = groundlevel;
	sand2.height = 10 * hr;

	water2.x = 3 * width / 5 + 3 * ball.width / 2;
	water2.y = groundlevel;
	water2.width = 5 * ball.width / 2;
	water2.height = 35 * hr;

	//everything else off screen
	ground3.x = 2 * width;
	ground3.y = null;
	ground3.width = null;
	ground3.height = null;

	ground4.x = 2 * width;
	ground4.y = null;
	ground4.width = null;
	ground4.height = null;

	ground5.x = 2 * width;
	ground5.y = null;
	ground5.width = null;
	ground5.height = null;

	egg.x = 2 * width;
	egg.y = null;
	egg.width = null;
	egg.height = null;

	hidegg.x = 2 * width;
	hidegg.y = null;
	hidegg.width = null;
	hidegg.height = null;
}

function hole9() {
	hole = 9;
	defhole();

	ground1.height = height / 4;
	ground1.x = width / 6;
	ground1.y = groundlevel - ground1.height;
	ground1.width = width / 8;

	ground2.height = height / 2 - ball.height;
	ground2.x = ground1.x + ground1.width;
	ground2.y = groundlevel - ground2.height;
	ground2.width = ground1.width;

	ground3.x = width / 2;
	ground3.y = 0;
	ground3.width = cup.width;
	ground3.height = groundlevel - 3 * ball.height;

	sand1.width = 5 * ball.width / 2;
	sand1.x = ground2.x - sand1.width - 3 * ball.width / 2;
	sand1.y = ground1.y;
	sand1.height = 10 * hr;

	sand2.x = 2 * width / 3;
	sand2.y = groundlevel;
	sand2.width = 3 * ball.width;
	sand2.height = 10 * hr;

	water1.width = 2 * ball.width;
	water1.x = ground2.x - sand1.width - ball.width + ground2.width;
	water1.y = ground2.y;
	water1.height = 35 * hr;

	water2.x = ground3.x;
	water2.y = groundlevel;
	water2.width = ground3.width;
	water2.height = 35 * hr;

	//everything else off screen
	ground4.x = 2 * width;
	ground4.y = null;
	ground4.width = null;
	ground4.height = null;

	ground5.x = 2 * width;
	ground5.y = null;
	ground5.width = null;
	ground5.height = null;

	egg.x = 2 * width;
	egg.y = null;
	egg.width = null;
	egg.height = null;

	hidegg.x = 2 * width;
	hidegg.y = null;
	hidegg.width = null;
	hidegg.height = null;
}

//customizations

var custom = false;

var ballselection = ['whiteball', 'blackball', 'blueball', 'darkblueball', 'redball', 'greenball', 'pinkball', 'purpleball', 'volleyball',
	'soccerball', 'basketball', 'tennisball', 'bowlingball', '8ball'
];

var characterselection = ['character1', 'character2', 'character3', 'character4', 'character5', 'character6'];
var flipcharacterselection = ['character1flip', 'character2flip', 'character3flip', 'character4flip', 'character5flip', 'character6flip'];

var allballs;
var allchars;

//ball choice
var bsel = 0;
//background choice
var charsel = 0;


//in create
function customizations() {
	//customize screen background
	custombg = game.add.sprite(0, 0, 'custombg');
	custombg.anchor.setTo(0, 0);
	custombg.width = width;
	custombg.height = height;
	custombg.visible = false;

	//button to go back to main customizations page
	backbutton = game.add.sprite(null, null, 'backbutton');
	backbutton.anchor.setTo(0, 0);
	backbutton.width = 3 * homebutton.width / 2;
	backbutton.x = backbutton.width / 15;
	backbutton.height = backbutton.width;
	backbutton.y = backbutton.height / 15;
	backbutton.inputEnabled = true;
	backbutton.events.onInputDown.add(backlistener, this);
	backbutton.visible = false;

	//button to go to main menu (w/o refresh)
	mainbutton = game.add.sprite(null, null, 'backbutton');
	mainbutton.anchor.setTo(0, 0);
	mainbutton.width = backbutton.width;
	mainbutton.x = backbutton.width / 15;
	mainbutton.height = backbutton.width;
	mainbutton.y = backbutton.height / 15;
	mainbutton.inputEnabled = true;
	mainbutton.events.onInputDown.add(mainbuttonlistener, this);
	mainbutton.visible = false;

	//ball display
	dispball = game.add.sprite(width / 3, height / 2, ballselection[bsel]);
	dispball.anchor.setTo(0.5, 0.5);
	dispball.width = 325 * wr;
	dispball.height = 325 * hr;
	dispball.inputEnabled = true;
	dispball.visible = false;
	dispball.events.onInputDown.add(ballcustoms, this);

	//character display
	dispchar = game.add.sprite(2 * width / 3, height / 2, characterselection[charsel]);
	dispchar.anchor.setTo(0.5, 0.5);
	dispchar.width = 10 * character.width / 3;
	dispchar.height = 10 * character.height / 3;
	dispchar.inputEnabled = true;
	dispchar.visible = false;
	dispchar.events.onInputDown.add(charcustoms, this);

	//individual customizations

	//characters
	char1 = game.add.sprite(1 * (width - 6 * character.width) / 4, height / 4, characterselection[0]);
	char2 = game.add.sprite(
		2 * (width - 6 * character.width) / 4 + 2 * character.width,
		height / 4,
		characterselection[1]
	);
	char3 = game.add.sprite(
		3 * (width - 6 * character.width) / 4 + 4 * character.width,
		height / 4,
		characterselection[2]
	);
	char4 = game.add.sprite(1 * (width - 6 * character.width) / 4, 3 * height / 4, characterselection[3]);
	char5 = game.add.sprite(
		2 * (width - 6 * character.width) / 4 + 2 * character.width,
		3 * height / 4,
		characterselection[4]
	);
	char6 = game.add.sprite(
		3 * (width - 6 * character.width) / 4 + 4 * character.width,
		3 * height / 4,
		characterselection[5]
	);

	allchars = [char1, char2, char3, char4, char5, char6];
	allcharslisteners = [char1f, char2f, char3f, char4f, char5f, char6f];

	for (var s = 0; s < allchars.length; s++) {
		allchars[s].anchor.setTo(0, 0.5);
		allchars[s].width = 2 * character.width;
		allchars[s].height = 2 * character.height;
		allchars[s].inputEnabled = true;
		allchars[s].visible = false;
		allchars[s].events.onInputDown.add(allcharslisteners[s], this);
	}


	//balls
	ball1 = game.add.sprite(width / 8 + 0 * width / 4, height / 8 + 0 * height / 4, ballselection[0]);
	ball2 = game.add.sprite(width / 8 + 1 * width / 4, height / 8 + 0 * height / 4, ballselection[1]);
	ball3 = game.add.sprite(width / 8 + 2 * width / 4, height / 8 + 0 * height / 4, ballselection[2]);
	ball4 = game.add.sprite(width / 8 + 3 * width / 4, height / 8 + 0 * height / 4, ballselection[3]);

	ball5 = game.add.sprite(width / 8 + 0 * width / 4, height / 8 + 1 * height / 4, ballselection[4]);
	ball6 = game.add.sprite(width / 8 + 1 * width / 4, height / 8 + 1 * height / 4, ballselection[5]);
	ball7 = game.add.sprite(width / 8 + 2 * width / 4, height / 8 + 1 * height / 4, ballselection[6]);
	ball8 = game.add.sprite(width / 8 + 3 * width / 4, height / 8 + 1 * height / 4, ballselection[7]);

	ball9 = game.add.sprite(width / 8 + 0 * width / 4, height / 8 + 2 * height / 4, ballselection[8]);
	ball10 = game.add.sprite(width / 8 + 1 * width / 4, height / 8 + 2 * height / 4, ballselection[9]);
	ball11 = game.add.sprite(width / 8 + 2 * width / 4, height / 8 + 2 * height / 4, ballselection[10]);
	ball12 = game.add.sprite(width / 8 + 3 * width / 4, height / 8 + 2 * height / 4, ballselection[11]);

	ball13 = game.add.sprite(width / 4 + 0 * width / 4, height / 8 + 3 * height / 4, ballselection[12]);
	ball14 = game.add.sprite(width / 4 + 2 * width / 4, height / 8 + 3 * height / 4, ballselection[13]);

	allballs = [ball1, ball2, ball3, ball4, ball5, ball6, ball7, ball8, ball9, ball10, ball11, ball12, ball13, ball14];
	allballslisteners = [ball1f, ball2f, ball3f, ball4f, ball5f, ball6f, ball7f, ball8f, ball9f, ball10f, ball11f, ball12f, ball13f, ball14f];

	for (var s = 0; s < allballs.length; s++) {
		allballs[s].anchor.setTo(0.5, 0.5);
		allballs[s].width = 150 * wr;
		allballs[s].height = 150 * hr;
		allballs[s].inputEnabled = true;
		allballs[s].visible = false;

		allballs[s].events.onInputDown.add(allballslisteners[s], this);
	}
}

//when customize button is pressed
function customizelistener() {
	custombg.visible = true;

	mainbutton.visible = true;
	practicebutton.visible = false;
	startbutton.visible = false;
	homebutton.visible = false;

	dispball.visible = true;
	dispchar.visible = true;
}

//when display ball is pressed
function ballcustoms() {
	dispball.visible = false;
	dispchar.visible = false;

	for (var s = 0; s < allballs.length; s++) {
		allballs[s].visible = true;
	}

	backbutton.visible = true;
	mainbutton.visible = false;
}

//when display background is pressed
function charcustoms() {
	dispchar.visible = false;
	dispball.visible = false;

	for (var s = 0; s < allchars.length; s++) {
		allchars[s].visible = true;
	}

	backbutton.visible = true;
	mainbutton.visible = false;
}

//when back button is pressed
function backlistener() {
	dispball.visible = true;
	dispchar.visible = true;

	for (var s = 0; s < allballs.length; s++) {
		allballs[s].visible = false;
	}
	for (var s = 0; s < allchars.length; s++) {
		allchars[s].visible = false;
	}
	backbutton.visible = false;
	mainbutton.visible = true;
}

//when main menu button is pressed
function mainbuttonlistener() {
	mainbutton.visible = false;
	information.visible = true;
	ipage.visible = false;
	if (custombg.visible == true) {
		character.visible = false;
		flipcharacter.visible = false;
		ball.visible = false;
		custombg.visible = false;
		backbutton.visible = false;
		practicebutton.visible = true;
		startbutton.visible = true;
		dispball.visible = false;
		dispchar.visible = false;
	}
	if (practicebutton.visible == false) {
		character.visible = true;
		flipcharacter.visible = true;
		ball.visible = true;
		homebutton.visible = true;
	}
}

//applied to all ball customizations
function allballcustoms() {
	// creating new ball
	ball = game.add.sprite(ball.x, ball.y, ballselection[bsel]);
	ball.anchor.setTo(0.5, 1);
	ball.width = 28 * wr;
	ball.height = 28 * hr;
	game.physics.enable(ball, Phaser.Physics.ARCADE);
	ball.body.allowGravity = true;
	ball.body.immovable = false;
	ball.body.moves = true;
	ball.body.collideWorldBounds = true;
	ball.body.bounce = true;
	ball.body.bounce = new Phaser.Point(0.4, 0.4);
	ball.visible = false;

	//display ball shows customization
	dispball = game.add.sprite(width / 3, height / 2, ballselection[bsel]);
	dispball.anchor.setTo(0.5, 0.5);
	dispball.width = 325 * wr;
	dispball.height = 325 * hr;
	dispball.inputEnabled = true;
	dispball.events.onInputDown.add(ballcustoms, this);
	dispball.visible = true;
	custom = true;
	backlistener();
}

//applied to all character customizations
function allcharcustoms() {
	//player
	character.x = 2 * width;
	flipcharacter.x = 2 * width;

	//creating new characters
	character = game.add.sprite(
		ball.x - character.width / 2 - ball.width / 2,
		ball.y - character.height / 2,
		characterselection[charsel]
	);
	flipcharacter = game.add.sprite(
		ball.x + flipcharacter.width / 2 + ball.width / 2,
		character.y,
		flipcharacterselection[charsel]
	);
	character.visible = false;
	flipcharacter.visible = false;
	character.anchor.setTo(0.5, 0.5);
	flipcharacter.anchor.setTo(0.5, 0.5);
	character.width = 100 * wr;
	character.height = 171 * hr;
	flipcharacter.width = 100 * wr;
	flipcharacter.height = 171 * hr;

	//setting display character to custom
	dispchar = game.add.sprite(2 * width / 3, height / 2, characterselection[charsel]);
	dispchar.anchor.setTo(0.5, 0.5);
	dispchar.width = 10 * character.width / 3;
	dispchar.height = 10 * character.height / 3;
	dispchar.inputEnabled = true;
	dispchar.events.onInputDown.add(charcustoms, this);
	dispchar.visible = true;
	custom = true;
	backlistener();
}

//listeners for each ball
function ball1f() {
	bsel = 0;
	allballcustoms();
}

function ball2f() {
	bsel = 1;
	allballcustoms();
}

function ball3f() {
	bsel = 2;
	allballcustoms();
}

function ball4f() {
	bsel = 3;
	allballcustoms();
}

function ball5f() {
	bsel = 4;
	allballcustoms();
}

function ball6f() {
	bsel = 5;
	allballcustoms();
}

function ball7f() {
	bsel = 6;
	allballcustoms();
}

function ball8f() {
	bsel = 7;
	allballcustoms();
}

function ball9f() {
	bsel = 8;
	allballcustoms();
}

function ball10f() {
	bsel = 9;
	allballcustoms();
}

function ball11f() {
	bsel = 10;
	allballcustoms();
}

function ball12f() {
	bsel = 11;
	allballcustoms();
}

function ball13f() {
	bsel = 12;
	allballcustoms();
}

function ball14f() {
	bsel = 13;
	allballcustoms();
}

//listeners for each character
function char1f() {
	charsel = 0;
	allcharcustoms();
}

function char2f() {
	charsel = 1;
	allcharcustoms();
}

function char3f() {
	charsel = 2;
	allcharcustoms();
}

function char4f() {
	charsel = 3;
	allcharcustoms();
}

function char5f() {
	charsel = 4;
	allcharcustoms();
}

function char6f() {
	charsel = 5;
	allcharcustoms();
}