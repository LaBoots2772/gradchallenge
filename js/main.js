// getting the width and height of the window
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

// width and height ratios to work on all screen sizes
const WR = WIDTH / 1536;
const HR = HEIGHT / 750;

// initializing Phaser
var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO);

// global variables
var hole = 1;
var par;
// set par after each hole
const TOTAL_PAR = [2, 5, 9, 13, 18, 23, 24, 28, 32];
var strokes;
// score on each hole
var strokesDisp = [];
// array to display the score
var allScores = [];
// total score
var total = 0;
const SCORE_GAP = 48 * HR

// constants for every hole
const TEEBOX = [0, WIDTH / 18];
var groundLevel = 7 * HEIGHT / 8;

// power and angle of ball
var power;
var truePower;
var angle;
var radianValue;
var vY;
var vX;

// x and y position of ball;
var positionX = [];
var positionY = [];

// initial powerup boolean values
var powerupBool = false;
var laserBool = false;
var gumBool = false;
var reboostBool = null;
var dropBool = null;
var iceBool = null;

// total number of powerups
var powerupLimit = 7;

// multiples for powerups
var bXM;
var bYM;
var vXM;
var vYM;
var gravM;

// ball went in water on previous shot
var inWater = false;

// array of all platforms
var plat;

// text displayed on the screen
var disptextI; // score info
var disptextQ; // ball info

// practice mode
var prac = false;

// multiple to velocity and gravity for mobile
var mobileMult;

// if on a mobile device or not
var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
if (isMobile) {
	groundLevel = 135 * HEIGHT / 160;
	mobileMult = 0.5;
} else {
	mobileMult = WR;
}

// only run the game when device is in landscape
if (HEIGHT < WIDTH) {
	// hide the "rotate and refresh message"
	document.getElementById('orientation-message').style.display = 'none';

	var GameState = {
		preload: function () {
			// all asset names
			const ALL_ASSETS = ['ipage', 'background', 'ground', 'green', 'egg', 'cup', 'flag', 'arrow', 'scorecard', 'scorecardbg', 'custombg', 'mainmenu', 'startbutton',
				'practicebutton', 'customize', 'information', 'playagain', 'nextholebutton', 'plusbutton', 'minusbutton', 'launchbutton', 'activatebutton',
				'homebutton', 'backbutton', 'redobutton', 'water', 'sand', 'powerup', 'blackcircle', 'roundrectangle', '8-ball', 'basketball', 'blackball', 'blueball',
				'bowlingball', 'darkblueball', 'greenball', 'pinkball', 'purpleball', 'redball', 'soccerball', 'tennisball', 'volleyball', 'whiteball', 'character1',
				'character1-flipped', 'character2', 'character2-flipped', 'character3', 'character3-flipped', 'character4', 'character4-flipped', 'character5', 'character5-flipped',
				'character6', 'character6-flipped', 'superball', 'laserball', 'minus1', 'gumball', 'bouncyball', 'mulligan', 'iceball', 'reboost', 'dropball'
			]

			// all asset files
			const ALL_FILES = ['assets/iPage.png', 'assets/background.png', 'assets/ground.png', 'assets/green.png', 'assets/egg.png', 'assets/cup.png', 'assets/flag.png',
				'assets/arrow.png', 'assets/scoreCard.jpg', 'assets/scoreCardBg.jpg', 'assets/customBg.png', 'assets/mainMenu.jpg', 'assets/startButton.png',
				'assets/practice.png', 'assets/customize.png', 'assets/information.png', 'assets/playAgain.png', 'assets/nextHoleButton.png',
				'assets/plus.png', 'assets/minus.png', 'assets/launch.png', 'assets/activateButton.png', 'assets/home.png', 'assets/backButton.png', 'assets/redo.png',
				'assets/water.png', 'assets/sand.png', 'assets/powerup.png', 'assets/blackCircle.png', 'assets/roundRectangle.png', 'assets/8-ball.png', 'assets/basketball.png',
				'assets/blackBall.png', 'assets/blueBall.png', 'assets/bowlingBall.png', 'assets/darkBlueBall.png', 'assets/greenBall.png', 'assets/pinkBall.png',
				'assets/purpleBall.png', 'assets/redBall.png', 'assets/soccerBall.png', 'assets/tennisBall.png', 'assets/volleyBall.png', 'assets/whiteBall.png',
				'assets/character1.png', 'assets/character1-flipped.png', 'assets/character2.png', 'assets/character2-flipped.png', 'assets/character3.png', 'assets/character3-flipped.png',
				'assets/character4.png', 'assets/character4-flipped.png', 'assets/character5.png', 'assets/character5-flipped.png', 'assets/character6.png', 'assets/character6-flipped.png',
				'assets/superBall.png', 'assets/laserBall.png', 'assets/minus1.png', 'assets/gumBall.png', 'assets/bouncyBall.png', 'assets/mulligan.png', 'assets/iceBall.png',
				'assets/reboost.png', 'assets/instantStop.png'
			]

			// loading all assets
			for (var i = 0; i < ALL_ASSETS.length; i++) {
				game.load.image(ALL_ASSETS[i], ALL_FILES[i]);
			}
		},

		create: function () {
			// setting initial values
			strokes = 0;
			power = 75;
			angle = 45;

			// all sprites appear off screen unless changed in hole function
			// background
			background = game.add.sprite(2 * WIDTH, 2 * HEIGHT, 'background');
			background.anchor.setTo(0.5, 0.5);
			background.visible = false;

			// flag
			flag = game.add.sprite(2 * WIDTH, 2 * HEIGHT, 'flag');
			flag.anchor.setTo(0, 1);

			// hole # on flag
			flagtext = game.add.text(2 * WIDTH, 2 * HEIGHT, '', {
				font: 'Calibri',
				fontSize: 50 * WR,
				fill: '#000000'
			});
			flagtext.anchor.setTo(0.5, 0.5);

			// all ground/platforms
			floor1 = game.add.sprite(2 * WIDTH, 2 * HEIGHT, 'ground');
			floor1.anchor.setTo(0, 0);

			floor2 = game.add.sprite(2 * WIDTH, 2 * HEIGHT, 'ground');
			floor2.anchor.setTo(0, 0);

			floor3 = game.add.sprite(2 * WIDTH, 2 * HEIGHT, 'ground');
			floor3.anchor.setTo(0, 0);

			ground1 = game.add.sprite(2 * WIDTH, 2 * HEIGHT, 'ground');
			ground1.anchor.setTo(0, 0);

			ground2 = game.add.sprite(2 * WIDTH, 2 * HEIGHT, 'ground');
			ground2.anchor.setTo(0, 0);

			ground3 = game.add.sprite(2 * WIDTH, 2 * HEIGHT, 'ground');
			ground3.anchor.setTo(0, 0);

			ground4 = game.add.sprite(2 * WIDTH, 2 * HEIGHT, 'ground');
			ground4.anchor.setTo(0, 0);

			ground5 = game.add.sprite(2 * WIDTH, 2 * HEIGHT, 'ground');
			ground5.anchor.setTo(0, 0);

			// green
			green = game.add.sprite(2 * WIDTH, 2 * HEIGHT, 'green');
			green.anchor.setTo(0.5, 0);
			green.width = 310 * WR;
			green.height = 10 * HR;

			// cup
			cup = game.add.sprite(2 * WIDTH, 2 * HEIGHT, 'cup');
			cup.anchor.setTo(0, 1);

			// sand
			sand1 = game.add.sprite(2 * WIDTH, 2 * HEIGHT, 'sand');
			sand1.anchor.setTo(0, 0);
			sand2 = game.add.sprite(2 * WIDTH, 2 * HEIGHT, 'sand');
			sand2.anchor.setTo(0, 0);

			// water
			water1 = game.add.sprite(2 * WIDTH, 2 * HEIGHT, 'water');
			water1.anchor.setTo(0, 0);
			water2 = game.add.sprite(2 * WIDTH, 2 * HEIGHT, 'water');
			water2.anchor.setTo(0, 0);

			// hidden egg
			hidenegg = game.add.sprite(2 * WIDTH, 2 * HEIGHT, 'egg');
			hidenegg.anchor.setTo(0.5, 0);

			// ball
			ball = game.add.sprite(2 * WIDTH, 2 * HEIGHT, ballselection[bsel]);
			ball.anchor.setTo(0.5, 1);
			ball.width = 28 * WR;
			ball.height = 28 * HR;
			ball.visible = false;

			// easter egg
			egg = game.add.sprite(2 * WIDTH, 2 * HEIGHT, 'ground');
			egg.alpha = 0.96;
			egg.anchor.setTo(0, 0);

			// arrow
			arrow = game.add.sprite(2 * WIDTH, 2 * HEIGHT, 'arrow');
			arrow.angle = -angle;
			arrow.height = 100 * HR;
			arrow.width = 143 * WR * power / 100;
			arrow.anchor.setTo(0, 0.5);
			arrow.x = ball.x + ball.height / 2 * Math.cos(45 * Math.PI / 180);
			arrow.y = ball.y - ball.height / 2 - ball.height / 2 * Math.sin(45 * Math.PI / 180);

			// score info text
			disptextI = game.add.text(10 * WR, 5 * HR);
			disptextI.setText('Hole: ' + hole + '\nPar: 2\nStrokes: 0');
			disptextI.font = 'Comic Sans MS';
			disptextI.fontSize = 40 * HR;
			disptextI.fill = '#000000';
			// ball qualities text
			disptextQ = game.add.text(null, groundLevel + 5 * HR, 'Power: 75\nAngle: 45', {
				font: 'Comic Sans MS',
				fontSize: 27 * HR,
				fill: '#000000'
			});

			disptextI.anchor.setTo(0, 0);
			disptextQ.anchor.setTo(0, 0);

			// +/- buttons for angle and power and launch
			powerplus = game.add.sprite(disptextQ.x + 138 * WR, disptextQ.y + 2 * HR, 'plusbutton');
			powerminus = game.add.sprite(powerplus.x + powerplus.width + 9 * WR, powerplus.y, 'minusbutton');
			angleplus = game.add.sprite(powerplus.x, powerplus.y + powerplus.height + 7 * HR, 'plusbutton');
			angleminus = game.add.sprite(powerminus.x, angleplus.y, 'minusbutton');

			// launch button
			launchbutton = game.add.sprite(powerminus.x + 45 * WR, (HEIGHT - groundLevel) / 2 + groundLevel, 'launchbutton');
			launchbutton.anchor.setTo(0, 0.5);
			launchbutton.height = 805 / 10 * HR;
			launchbutton.width = launchbutton.height;
			launchbutton.inputEnabled = true;
			launchbutton.events.onInputDown.add(launchlistener, this);

			// powerupbutton
			powerupbutton = game.add.sprite(null, null, 'powerup');
			powerupbutton.anchor.setTo(0.5, 0.5);
			powerupbutton.height = launchbutton.height;
			powerupbutton.width = powerupbutton.height;
			powerupbutton.x = launchbutton.x + launchbutton.width / 2 + powerupbutton.width + 7 * WR;
			powerupbutton.y = (HEIGHT - groundLevel) / 2 + groundLevel;
			powerupbutton.inputEnabled = true;
			powerupbutton.events.onInputDown.add(disppulistener, this);

			// activate button
			activatebutton = game.add.sprite(null, null, 'activatebutton');
			activatebutton.anchor.setTo(0.5, 0.5);
			activatebutton.height = launchbutton.height;
			activatebutton.width = powerupbutton.height;
			activatebutton.x = powerupbutton.x + launchbutton.width + 7 * WR;
			activatebutton.y = (HEIGHT - groundLevel) / 2 + groundLevel;
			activatebutton.inputEnabled = true;
			activatebutton.events.onInputDown.add(activatepu, this);
			activatebutton.visible = false;

			// small circle to show limit
			poweruplimitbg = game.add.sprite(null, null, 'blackcircle');
			poweruplimitbg.anchor.setTo(0.7, 0.3);
			poweruplimitbg.height = 30 * HR;
			poweruplimitbg.width = poweruplimitbg.height;
			poweruplimitbg.x = powerupbutton.x + powerupbutton.width / 2 - 3 * WR;
			poweruplimitbg.y = powerupbutton.y - powerupbutton.height / 2 + 3 * HR;

			// powerup text
			poweruptext = game.add.text(null, null, '', {
				font: 'Comic Sans MS',
				fontSize: 50 * HR,
				fill: '#000000'
			});
			poweruptext.anchor.setTo(0.5, 0.5);
			poweruptext.x = WIDTH / 2;
			poweruptext.y = HEIGHT / 13;

			// powerup limit
			poweruplimittext = game.add.text(null, null, '7', {
				font: 'Comic Sans MS',
				fontSize: 25 * HR,
				fill: '#ffffff'
			});
			poweruplimittext.anchor.setTo(0.5, 0.5);
			poweruplimittext.fontWeight = 'bold'
			poweruplimittext.x = poweruplimitbg.x - 5 * WR;
			poweruplimittext.y = poweruplimitbg.y + 9 * HR;

			// bg display power ups
			powerupdispbg = game.add.sprite(null, 60 * HR, 'roundrectangle');
			powerupdispbg.anchor.setTo(0, 0.5);
			powerupdispbg.height = 6 * 805 / 40 * HR;
			powerupdispbg.x = WIDTH / 6;
			powerupdispbg.width = 2 * WIDTH / 3;
			powerupdispbg.alpha = 0.85;
			powerupdispbg.visible = false;

			// superball
			superball = game.add.sprite(null, null, 'superball');
			superball.anchor.setTo(0.5, 0.5);
			superball.height = 100.625 * WR;
			superball.width = superball.height;
			superball.y = powerupdispbg.y;
			superball.inputEnabled = true;
			superball.events.onInputDown.add(superballlistener, this);
			superball.visible = false;

			// bouncyball
			bouncyball = game.add.sprite(null, null, 'bouncyball');
			bouncyball.anchor.setTo(0.5, 0.5);
			bouncyball.height = superball.height;
			bouncyball.width = superball.height;
			bouncyball.y = powerupdispbg.y;
			bouncyball.inputEnabled = true;
			bouncyball.events.onInputDown.add(bouncyballlistener, this);
			bouncyball.visible = false;

			// sticky ball
			gumball = game.add.sprite(null, null, 'gumball');
			gumball.anchor.setTo(0.5, 0.5);
			gumball.height = superball.height;
			gumball.width = superball.height;
			gumball.y = powerupdispbg.y;
			gumball.inputEnabled = true;
			gumball.events.onInputDown.add(gumballlistener, this);
			gumball.visible = false;

			// ice ball
			iceball = game.add.sprite(null, null, 'iceball');
			iceball.anchor.setTo(0.5, 0.5);
			iceball.height = superball.height;
			iceball.width = superball.height;
			iceball.y = powerupdispbg.y;
			iceball.inputEnabled = true;
			iceball.events.onInputDown.add(iceballlistener, this);
			iceball.visible = false;

			// laserball
			laserball = game.add.sprite(null, null, 'laserball');
			laserball.anchor.setTo(0.5, 0.5);
			laserball.height = superball.height;
			laserball.width = superball.height;
			laserball.y = powerupdispbg.y;
			laserball.inputEnabled = true;
			laserball.events.onInputDown.add(laserballlistener, this);
			laserball.visible = false;

			// reboost
			reboost = game.add.sprite(null, null, 'reboost');
			reboost.anchor.setTo(0.5, 0.5);
			reboost.height = superball.height;
			reboost.width = superball.height;
			reboost.y = powerupdispbg.y;
			reboost.inputEnabled = true;
			reboost.events.onInputDown.add(reboostlistener, this);
			reboost.visible = false;

			// dropball
			dropball = game.add.sprite(null, null, 'dropball');
			dropball.anchor.setTo(0.5, 0.5);
			dropball.height = superball.height;
			dropball.width = superball.height;
			dropball.y = powerupdispbg.y;
			dropball.inputEnabled = true;
			dropball.events.onInputDown.add(dropballlistener, this);
			dropball.visible = false;

			// mulligan
			mulligan = game.add.sprite(null, null, 'mulligan');
			mulligan.anchor.setTo(0.5, 0.5);
			mulligan.height = superball.height;
			mulligan.width = superball.height;
			mulligan.y = powerupdispbg.y;
			mulligan.inputEnabled = true;
			mulligan.events.onInputDown.add(mulliganlistener, this);
			mulligan.visible = false;

			// -1
			minus1 = game.add.sprite(null, null, 'minus1');
			minus1.anchor.setTo(0.5, 0.5);
			minus1.height = superball.height;
			minus1.width = superball.height;
			minus1.y = powerupdispbg.y;
			minus1.inputEnabled = true;
			minus1.events.onInputDown.add(minus1listener, this);
			minus1.visible = false;

			// setting up display for powerups
			superball.x = powerupdispbg.x + powerupdispbg.width / 2;
			iceball.x = superball.x + 110 * WR;
			laserball.x = superball.x - 110 * WR;
			dropball.x = superball.x + 110 * 2 * WR;
			bouncyball.x = superball.x - 110 * 2 * WR;
			gumball.x = superball.x + 110 * 3 * WR;
			reboost.x = superball.x - 110 * 3 * WR;
			mulligan.x = superball.x + 110 * 4 * WR;
			minus1.x = superball.x - 110 * 4 * WR;

			// reload page button
			homebutton = game.add.sprite(null, null, 'homebutton');
			homebutton.anchor.setTo(1, 0);
			homebutton.width = 50 * WR;
			homebutton.x = WIDTH - 70 * WR;
			homebutton.height = homebutton.width;
			homebutton.y = homebutton.height / 5;
			homebutton.inputEnabled = true;
			homebutton.events.onInputDown.add(resetlistener, this);

			// previous position button (practice only)
			redobutton = game.add.sprite(69 * WR, 44 * HR, 'redobutton');
			redobutton.anchor.setTo(0, 0);
			redobutton.height = 40 * HR;
			redobutton.width = redobutton.height;
			redobutton.inputEnabled = true;
			redobutton.events.onInputDown.add(redolistener, this);
			redobutton.visible = false;

			// scorecard background
			scorecardbg = game.add.sprite(0, 0, 'scorecardbg');
			scorecardbg.anchor.setTo(0, 0);
			scorecardbg.width = WIDTH;
			scorecardbg.height = HEIGHT;
			scorecardbg.visible = false;

			// scorecard
			scorecard = game.add.sprite(WIDTH / 2, HEIGHT / 2, 'scorecard');
			scorecard.anchor.setTo(0.5, 0.5);
			scorecard.height = 700 * HR;
			scorecard.width = 660 * WR;
			scorecard.visible = false;

			// next hole button
			button = game.add.sprite(scorecard.x + scorecard.width / 2 + 75 * WR, scorecard.y, 'nextholebutton');
			button.anchor.setTo(0, 0.5);
			button.width = 250 * WR;
			button.height = 250 * HR;
			button.inputEnabled = true;
			button.visible = false;
			button.events.onInputDown.add(listener, this);

			// next hole text
			disptextNext = game.add.text(button.x + button.width / 2, button.height / 2 + button.y + 30 * HR, 'Next Hole', {
				font: 'Comic Sans MS',
				fontSize: 60 * WR,
				fill: '#000000'
			});
			disptextNext.visible = false;
			disptextNext.anchor.setTo(0.5, 0.5);

			// score display
			score1 = game.add.text(scorecard.x + 85 * WR, scorecard.y - 155 * HR, '');
			score2 = game.add.text(score1.x, score1.y + SCORE_GAP, '');
			score3 = game.add.text(score1.x, score1.y + 2 * SCORE_GAP, '');
			score4 = game.add.text(score1.x, score1.y + 3 * SCORE_GAP, '');
			score5 = game.add.text(score1.x, score1.y + 4 * SCORE_GAP, '');
			score6 = game.add.text(score1.x, score1.y + 5 * SCORE_GAP, '');
			score7 = game.add.text(score1.x, score1.y + 6 * SCORE_GAP, '');
			score8 = game.add.text(score1.x, score1.y + 7 * SCORE_GAP, '');
			score9 = game.add.text(score1.x, score1.y + 8 * SCORE_GAP, '');
			score10 = game.add.text(score1.x, score1.y + 9 * SCORE_GAP, '');

			// all in an array for for loops
			allScores = [score1, score2, score3, score4, score5, score6, score7, score8, score9, score10]
			for (var i = 0; i < allScores.length; i++) {
				allScores[i].anchor.setTo(0.5, 0)
				allScores[i].font = 'Calibri',
					allScores[i].fontSize = 50 * HR,
					allScores[i].fontWeight = 'normal',
					allScores[i].fill = '#000000'
			}

			// +/- par text
			parScore = game.add.text(scorecard.x + 143 * WR, null, '', {
				font: 'Calibri'
			});
			parScore.anchor.setTo(1, 0);

			// main menu screen
			cover = game.add.sprite(0, 0, 'mainmenu');
			cover.anchor.setTo(0, 0);
			cover.width = WIDTH;
			cover.height = HEIGHT;

			// information button
			information = game.add.sprite(null, null, 'information');
			information.anchor.setTo(1, 0);
			information.width = homebutton.height;
			information.height = homebutton.height;
			information.x = WIDTH - 6 * WR;
			information.y = homebutton.y;
			information.inputEnabled = true;
			information.events.onInputDown.add(infolistener, this);

			// start button
			startbutton = game.add.sprite(WIDTH / 2, HEIGHT / 2, 'startbutton');
			startbutton.anchor.setTo(0.5, 0.5);
			startbutton.width = 425 * WR;
			startbutton.height = 425 * HR;
			startbutton.inputEnabled = true;
			startbutton.events.onInputDown.add(mainlistener, this);

			// practice button
			practicebutton = game.add.sprite(WIDTH / 4, HEIGHT / 2, 'practicebutton');
			practicebutton.anchor.setTo(0.5, 0.5);
			practicebutton.width = 250 * WR;
			practicebutton.height = 250 * HR;
			practicebutton.inputEnabled = true;
			practicebutton.events.onInputDown.add(practicelistener, this);

			// customize button
			customize = game.add.sprite(3 * WIDTH / 4, HEIGHT / 2, 'customize');
			customize.anchor.setTo(0.5, 0.5);
			customize.width = 250 * WR;
			customize.height = 250 * HR;
			customize.inputEnabled = true;
			customize.events.onInputDown.add(customizelistener, this);

			// play again / reload page button
			playagain = game.add.sprite(scorecard.x + scorecard.width - 85 * WR, scorecard.y, 'playagain');
			playagain.anchor.setTo(0.5, 0.5);
			playagain.visible = false;
			playagain.width = 400 * WR;
			playagain.height = 300 * HR;
			playagain.inputEnabled = true;
			playagain.events.onInputDown.add(resetlistener, this);

			// info page
			ipage = game.add.sprite(0, 0, 'ipage');
			ipage.anchor.setTo(0, 0);
			ipage.width = WIDTH;
			ipage.height = HEIGHT;
			ipage.visible = false;

			// player
			character = game.add.sprite(2 * WIDTH, 2 * HEIGHT, characterselection[charsel]);
			character.anchor.setTo(0.5, 0.5);
			flipcharacter = game.add.sprite(2 * WIDTH, 2 * HEIGHT, flipcharacterselection[charsel]);
			flipcharacter.anchor.setTo(0.5, 0.5);
			character.visible = false;
			flipcharacter.visible = false;
			character.width = 100 * WR;
			character.height = 171 * HR;
			flipcharacter.width = 100 * WR;
			flipcharacter.height = 171 * HR;

			// all customizations
			customizations();

			// physics
			game.physics.startSystem(Phaser.Physics.ARCADE);
			game.physics.enable(ball, Phaser.Physics.ARCADE);

			// gravity
			game.physics.arcade.gravity.y = 400 * HR;

			// setting qualities for all platforms
			plat = [floor1, floor2, floor3, ground1, ground2, ground3, ground4, ground5];
			for (var i = 0; i < plat.length; i++) {
				game.physics.enable(plat[i], Phaser.Physics.ARCADE);
				plat[i].body.allowGravity = false;
				plat[i].body.immovable = true;
				plat[i].body.moves = false;
				plat[i].body.collideWorldBounds = true;
			}

			// setting qualities for ball
			ball.body.allowGravity = true;
			ball.body.immovable = false;
			ball.body.moves = true;
			ball.body.collideWorldBounds = true;
			ball.body.bounce = true;
			ball.body.bounce = new Phaser.Point(0.4, 0.4);

			// input keys
			SpaceBar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
			W = game.input.keyboard.addKey(Phaser.Keyboard.W);
			S = game.input.keyboard.addKey(Phaser.Keyboard.S);
			A = game.input.keyboard.addKey(Phaser.Keyboard.A);
			D = game.input.keyboard.addKey(Phaser.Keyboard.D);
			E = game.input.keyboard.addKey(Phaser.Keyboard.E);
			Q = game.input.keyboard.addKey(Phaser.Keyboard.Q);

			// running hole
			gameplay();

			// starting position of ball
			positionX.push(ball.x);
			positionY.push(ball.y);
		},

		update: function () {
			// collision between ball and platforms
			for (var i = 0; i < plat.length; i++) {
				game.physics.arcade.collide(plat[i], ball);
			}

			// launch values
			truePower = 6 * power;
			radianValue = angle * Math.PI / 180;
			vY = -truePower * Math.sin(radianValue);
			vX = truePower * Math.cos(radianValue);

			// input
			const MOUSE = game.input.activePointer;

			// mobile buttons
			if (isMobile &&
				MOUSE.isDown &&
				MOUSE.x <= angleplus.x + angleplus.width / 2 &&
				MOUSE.x >= angleplus.x - angleplus.width / 2 &&
				MOUSE.y >= angleplus.y - angleplus.height / 2 &&
				MOUSE.y <= angleplus.y + angleplus.height / 2 &&
				ball.body.velocity.x == 0) {
				angleup();
			}
			if (isMobile &&
				MOUSE.isDown &&
				MOUSE.x <= angleminus.x + angleminus.width / 2 &&
				MOUSE.x >= angleminus.x - angleminus.width / 2 &&
				MOUSE.y >= angleminus.y - angleminus.height / 2 &&
				MOUSE.y <= angleminus.y + angleminus.height / 2 &&
				ball.body.velocity.x == 0) {
				angledown();
			}
			if (isMobile &&
				MOUSE.isDown &&
				MOUSE.x <= powerplus.x + powerplus.width / 2 &&
				MOUSE.x >= powerplus.x - powerplus.width / 2 &&
				MOUSE.y >= powerplus.y - powerplus.height / 2 &&
				MOUSE.y <= powerplus.y + powerplus.height / 2 &&
				ball.body.velocity.x == 0) {
				powerup();
			}
			if (isMobile &&
				MOUSE.isDown &&
				MOUSE.x <= powerminus.x + powerminus.width / 2 &&
				MOUSE.x >= powerminus.x - powerminus.width / 2 &&
				MOUSE.y >= powerminus.y - powerminus.height / 2 &&
				MOUSE.y <= powerminus.y + powerminus.height / 2 &&
				ball.body.velocity.x == 0) {
				powerdown();
			}

			// computer buttons
			if (
				(A.isDown || (MOUSE.isDown &&
					MOUSE.x >= angleplus.x &&
					MOUSE.x <= angleplus.x + angleplus.width &&
					MOUSE.y >= angleplus.y &&
					MOUSE.y <= angleplus.y + angleplus.height)) &&
				ball.body.velocity.x == 0 && isMobile == false
			) {
				angleup();
			}
			if (
				(D.isDown || (MOUSE.isDown &&
					MOUSE.x >= angleminus.x &&
					MOUSE.x <= angleminus.x + angleminus.width &&
					MOUSE.y >= angleminus.y &&
					MOUSE.y <= angleminus.y + angleminus.height)) &&
				ball.body.velocity.x == 0 && isMobile == false
			) {
				angledown();
			}
			if (
				(W.isDown || (MOUSE.isDown &&
					MOUSE.x >= powerplus.x &&
					MOUSE.x <= powerplus.x + powerplus.width &&
					MOUSE.y >= powerplus.y &&
					MOUSE.y <= powerplus.y + powerplus.height)) &&
				ball.body.velocity.x == 0 && isMobile == false
			) {
				powerup();
			}
			if (
				(S.isDown || (MOUSE.isDown &&
					MOUSE.x >= powerminus.x &&
					MOUSE.x <= powerminus.x + powerminus.width &&
					MOUSE.y >= powerminus.y &&
					MOUSE.y <= powerminus.y + powerminus.height)) &&
				ball.body.velocity.x == 0 && isMobile == false
			) {
				powerdown();
			}

			if (SpaceBar.isDown && ball.body.velocity.x == 0) {
				launch();
			}

			// flipping character
			if (angle > 90 && ball.visible == true) {
				character.visible = false;
				flipcharacter.visible = true;
			}
			if ((angle < 90 || angle > 270) && ball.visible == true) {
				character.visible = true;
				flipcharacter.visible = false;
			}

			// makes ball stop, found value by logging velocity
			if (Math.abs(ball.body.velocity.y + 1.9047619047619049 * mobileMult) < Math.pow(10, -10) || // normal
				Math.abs(ball.body.velocity.y + 2.962962962962963 * mobileMult) < Math.pow(10, -10) || // bouncy ball
				Math.abs(ball.body.velocity.y + 2.5925925925925926 * mobileMult) < Math.pow(10, -10) || // super ball
				(isMobile && Math.abs(ball.body.velocity.y + 1.78888888888 * mobileMult) < 0.05) || // laser ball
				(!isMobile && Math.abs(ball.body.velocity.y + 1.78888888888) < 0.05))
				stop();

			// arrow direction
			arrow.angle = -angle;
			arrow.height = character.width;
			arrow.width = (character.height - 30 * HR) * power / 100;
			arrow.x = ball.x + ball.height / 2 * Math.cos(angle * Math.PI / 180);
			arrow.y = ball.y - ball.height / 2 - ball.height / 2 * Math.sin(angle * Math.PI / 180);

			// show powerups
			if (E.isDown && game.time.totalElapsedSeconds() > 0.35) {
				game.time.reset();
				disppulistener();
			}
			// to activate * powerup's
			if ((dropBool == 2 || (reboostBool == 2 || reboostBool == 1)) && Q.isDown) {
				activatepu();
			}

			// par
			if (hole == 1) {
				par = TOTAL_PAR[0];
			} else {
				par = TOTAL_PAR[hole - 1] - TOTAL_PAR[hole - 2];
			}

			// displays scorecard screen
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
				for (var i = 0; i < allScores.length; i++) {
					allScores[i].visible = true;
				}
				parScore.visible = true;
			}

			// checks for ball collision with bottom of hole
			if (ball.x >= cup.x && ball.x <= cup.x + cup.width && ball.y == floor3.y) {
				strokesDisp.push(strokes);
				if (prac == false) {
					showscorecard();
					newhole();
				}
				reset();
				stop();
			}

			// power max and min
			if (laserBool == false) {
				power = Math.min(100, Math.max(1, power));
			} else {
				power = Math.min(100, Math.max(100, power));
			}

			// collision with all sides and edge of screen
			for (var i = 0; i < plat.length; i++) {
				// top
				if (ball.x >= plat[i].x && ball.x <= plat[i].x + plat[i].width && ball.y == plat[i].y) {
					// gumball must be enabled for ball to stick
					if (gumBool == true) {
						stop();
						ball.body.moves = false;
						ball.y = ball.y - 1 * HR;
					}
					angle = Math.min(180, Math.max(0, angle));
					updateTextQ();
				}

				// left
				if (ball.x >= WIDTH - ball.width / 2 ||
					(ball.x == plat[i].x - ball.width / 2 &&
						ball.y >= plat[i].y - ball.height / 2 &&
						ball.y <= plat[i].y + plat[i].height + ball.height / 2)) {

					if (gumBool == true) {
						stop();
						ball.body.moves = false;
						ball.x = ball.x - 1 * WR;
						updateTextQ();
					}
					else if (laserBool == true) { // ball falls
						// sets it to false and everything back to normal
						laserBool = false;
						ball.body.bounce = new Phaser.Point(0.4, 0.4);
						game.physics.arcade.gravity.y = 350 * HR;
						ball.body.velocity.setTo(0.001, 30 * HR);
					}
				}
				// right
				if (ball.x <= ball.width / 2 ||
					(ball.x == plat[i].x + plat[i].width + ball.width / 2 &&
						ball.y >= plat[i].y - ball.height / 2 &&
						ball.y <= plat[i].y + plat[i].height + ball.height / 2)
				) {
					if (gumBool == true) {
						stop();
						ball.body.moves = false;
						ball.x = ball.x + 2 * WR;
					}
					else if (laserBool == true) {
						laserBool = false;
						ball.body.bounce = new Phaser.Point(0.4, 0.4);
						game.physics.arcade.gravity.y = 350 * HR;
						ball.body.velocity.setTo(0.001, 30 * HR);
					}
				}
				// bottom
				if (ball.y <= ball.height ||
					(ball.y == plat[i].y + plat[i].height + ball.height &&
						ball.x >= plat[i].x &&
						ball.x <= plat[i].x + plat[i].width)
				) {
					if (gumBool == true) {
						stop();
						ball.body.moves = false;
						ball.y = ball.y + 2 * HR;
					}
					else if (laserBool == true) {
						laserBool = false;
						ball.body.bounce = new Phaser.Point(0.4, 0.4);
						game.physics.arcade.gravity.y = 350 * HR;
						ball.body.velocity.setTo(0.001, 30 * HR);
					}
				}

				// new min and max angles when ball sticks
				// top
				if (ball.y == plat[i].y - 1 * HR && ball.body.velocity.y == 0 && ball.body.velocity.x == 0) {
					angle = Math.min(180, Math.max(0, angle));
				} else if (
					(ball.y == ball.height + 2 * HR || ball.y == plat[i].y + plat[i].height + ball.height + 2 * HR) &&
					ball.body.velocity.y == 0 &&
					ball.body.velocity.x == 0
				) {
					// bottom
					angle = Math.min(360, Math.max(180, angle));
				} else if (
					ball.x == WIDTH - (Math.round(ball.width / 2) + 1 * WR) ||
					(ball.x == plat[i].x - (Math.round(ball.width / 2) + 1 * WR) &&
						ball.body.velocity.y == 0 &&
						ball.body.velocity.x == 0)
				) {
					// left
					angle = Math.min(270, Math.max(90, angle));
				} else if (
					Math.round(ball.x) == Math.round(ball.width / 2) + 2 * WR ||
					(ball.x == plat[i].x + plat[i].width + (Math.round(ball.width / 2) + 2 * WR) &&
						ball.body.velocity.y == 0 &&
						ball.body.velocity.x == 0)
				) {
					// right
					angle = Math.min(180, Math.max(-90, angle));
				}
			}

			// checks for ball collision with water hazard
			const WATER = [water1, water2];
			for (var i = 0; i < WATER.length; i++) {
				if (ball.x >= WATER[i].x && ball.x <= WATER[i].x + WATER[i].width && ball.y == WATER[i].y) {
					// powerup must be disabled
					if (iceBool != 1) {
						ball.body.moves = true;
						ball.body.velocity.setTo(0.001, 0);
						ball.y = ball.y + 10 * HR;
						game.physics.arcade.gravity.y = 50 * HR;
					}
				}

				// checks for collision with bottom of hazard
				if (
					ball.x >= WATER[i].x &&
					ball.x <= WATER[i].x + WATER[i].width &&
					ball.y >= WATER[i].y + WATER[i].height
				) {
					redolistener();
					inWater = true;
					strokes++;
					updateTextI();
					stop();
				}
			}

			// checks for ball collision with sandtraps
			const SAND = [sand1, sand2]
			for (var i = 0; i < SAND.length; i++) {
				if (ball.x >= SAND[i].x && ball.x <= SAND[i].x + SAND[i].width && ball.y == SAND[i].y) {
					stop();
					ball.y = SAND[i].y;
					ball.body.moves = false;
				}
			}

			// checks for collision with easteregg
			if (ball.x >= egg.x && ball.x <= egg.x + egg.width && ball.y <= egg.y + egg.height && ball.y >= egg.y) {
				egg.visible = false;
				strokes = 0;
				updateTextI();
			} else {
				egg.visible = true;
			}

			// checks if ball is on green and sets angle to 0 or 180
			if (
				ball.y == groundLevel &&
				ball.x >= green.x - green.width / 2 &&
				ball.x <= green.x + green.width / 2 &&
				ball.body.velocity.y == 0 &&
				ball.y == groundLevel
			) {
				ball.body.moves = false;
				ball.y = ball.y - 1 * HR;
				if (ball.x > flag.x) {
					angle = 180;
				} else if (ball.x < flag.x) {
					angle = 0;
				}
				updateTextQ();
			}

			// checks for bug when ball goes below ground
			if (ball.y > groundLevel + 3 * cup.height / 2) {
				redolistener();
				arrow.visible = true;
			}

			// if in practice mode
			if (prac == true) {
				// powerup display changes
				powerupdispbg.x = WIDTH / 4;
				powerupdispbg.width = 6 * WIDTH / 9;

				poweruptext.x = powerupdispbg.x + powerupdispbg.width / 2;
				// reset all button positions
				superball.x = powerupdispbg.x + powerupdispbg.width / 2;
				iceball.x = superball.x + 125 * WR;
				laserball.x = superball.x - 125 * WR;
				dropball.x = superball.x + 250 * WR;
				reboost.x = superball.x - 250 * WR;
				gumball.x = superball.x + 375 * WR;
				bouncyball.x = superball.x - 375 * WR;
			} else {
				powerupdispbg.x = WIDTH / 6;
				powerupdispbg.width = 2 * WIDTH / 3;
			}

			// if mobile
			if (isMobile) {
				// ball a little smaller
				ball.width = 25 * WR;
				ball.height = 25 * HR;
				disptextQ.fontWeight = 'bold'
				disptextQ.lineSpacing = -3 * HR;
				disptextQ.x = WIDTH / 2 - 68 * WR;
				disptextQ.y = (HEIGHT - groundLevel) / 2 + groundLevel - disptextQ.height / 2;
				disptextQ.fontSize = 37 * WR

				// bigger buttons
				powerplus.anchor.setTo(0.5, 0.5);
				powerminus.anchor.setTo(0.5, 0.5);
				angleplus.anchor.setTo(0.5, 0.5);
				angleminus.anchor.setTo(0.5, 0.5);

				powerminus.x = disptextQ.x - 72 * WR
				powerminus.y = (HEIGHT - groundLevel) / 2 + groundLevel;
				powerminus.width = 110 * WR;
				powerminus.height = 110 * WR;

				powerplus.x = powerminus.x - 119 * WR
				powerplus.y = powerminus.y
				powerplus.width = powerminus.height
				powerplus.height = powerminus.width

				angleplus.x = disptextQ.x + 232 * WR
				angleplus.y = powerminus.y
				angleplus.width = powerminus.width
				angleplus.height = powerminus.height

				angleminus.x = angleplus.x + 116 * WR
				angleminus.y = powerplus.y
				angleminus.width = powerplus.width
				angleminus.height = powerplus.height

				launchbutton.x = WIDTH / 4 - 54 * WR;
				launchbutton.height = 120 * WR;
				launchbutton.width = launchbutton.height;

				powerupbutton.x = 3 * WIDTH / 4 + 14 * WR;
				powerupbutton.width = launchbutton.height;
				powerupbutton.height = launchbutton.height;

				activatebutton.x = powerupbutton.x + 121 * WR
				activatebutton.height = angleplus.height;
				activatebutton.width = angleplus.height;
				poweruplimitbg.height = 40 * HR;
				poweruplimitbg.width = 40 * HR;
				poweruplimitbg.x = powerupbutton.x + powerupbutton.width / 2 - 10 * WR;
				poweruplimitbg.y = powerupbutton.y - powerupbutton.height / 2 + 10 * HR;
				poweruplimittext.x = poweruplimitbg.x - 7 * WR;
				poweruplimittext.y = poweruplimitbg.y + 11 * HR;
				poweruplimittext.fontSize = 31 * HR;
			} else {
				// buttons to computer settings
				disptextQ.x = 10 * WR;
				powerplus.anchor.setTo(0, 0);
				powerminus.anchor.setTo(0, 0);
				angleplus.anchor.setTo(0, 0);
				angleminus.anchor.setTo(0, 0);

				powerplus.width = 35 * WR;
				powerplus.height = 35 * HR;
				powerminus.width = powerplus.width;
				powerminus.height = powerplus.height;
				angleplus.width = powerplus.width;
				angleplus.height = powerplus.height;
				angleminus.width = powerplus.width;
				angleminus.height = powerplus.height;

				powerplus.x = disptextQ.x + WIDTH / 12 + 13 * WR
				powerplus.y = disptextQ.y + 2 * HR
				powerminus.x = powerplus.x + powerplus.width + 9 * WR
				powerminus.y = powerplus.y
				angleplus.x = powerplus.x
				angleplus.y = powerplus.y + powerplus.height + 7 * HR
				angleminus.x = powerminus.x
				angleminus.y = angleplus.y

				launchbutton.x = powerminus.x + 45 * WR;
				powerupbutton.x = launchbutton.x + launchbutton.width / 2 + powerupbutton.width + 7 * WR;
				activatebutton.x = powerupbutton.x + launchbutton.width + 7 * WR;
				poweruplimitbg.height = 30 * HR;
				poweruplimitbg.width = 30 * HR;
				poweruplimitbg.x = powerupbutton.x + powerupbutton.width / 2 - 3 * WR;
				poweruplimitbg.y = powerupbutton.y - powerupbutton.height / 2 + 3 * HR;
				poweruplimittext.x = poweruplimitbg.x - 5 * WR;
				poweruplimittext.y = poweruplimitbg.y + 9 * HR;
				poweruplimittext.fontSize = 25 * HR;
			}

			// starts the next hole
			function newhole() {
				if (hole == 0)
					hole1();
				else if (hole == 1)
					hole2();
				else if (hole == 2)
					hole3();
				else if (hole == 3)
					hole4();
				else if (hole == 4)
					hole5();
				else if (hole == 5)
					hole6();
				else if (hole == 6)
					hole7();
				else if (hole == 7)
					hole8();
				else if (hole == 8)
					hole9();
				else if (hole == 9) {
					hole = 10;
					showscorecard();
				}
			}
		}
	};

	// phaser
	game.state.add('GameState', GameState);
	game.state.start('GameState');
}

// runs the current hole
function gameplay() {
	// run hole
	if (hole == 1)
		hole1();
	else if (hole == 2)
		hole2();
	else if (hole == 3)
		hole3();
	else if (hole == 4)
		hole4();
	else if (hole == 5)
		hole5();
	else if (hole == 6)
		hole6();
	else if (hole == 7)
		hole7();
	else if (hole == 8)
		hole8();
	else if (hole == 9)
		hole9();
}

// ball stops and character moves to new ball location
function stop() {
	ball.body.velocity.setTo(0, 0);
	ball.body.moves = false;
	updateTextQ();
	gumBool = false;
	if (powerupBool == false) {
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

// resets ball and player
function reset() {
	ball.x = TEEBOX[0] + character.width + ball.width / 2;
	ball.y = groundLevel;
	power = 75;
	angle = 45;
	strokes = 0;
	updateTextI();
	updateTextQ();
}

// listeners for buttons
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

	// prompt for what hole user wants to practice
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
		// start practice mode
		prac = true;
		// unlimited powerups in practice mode
		poweruplimittext.setText('∞');
		homebutton.visible = true;
		redobutton.visible = true;
		// moving home button
		homebutton.x = 58 * WR;
		homebutton.y = 44 * HR;
		homebutton.height = redobutton.height;
		homebutton.width = homebutton.height;
		disptextI.fontSize = 30 * HR;
		disptextI.lineSpacing = -5 * HR;
		hole = phole;
		if (hole == 1) {
			par = TOTAL_PAR[0];
		} else {
			par = TOTAL_PAR[hole - 1] - TOTAL_PAR[hole - 2];
		}
		// more spaces for mobile
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
	for (var i = 0; i < allScores.length; i++) {
		allScores[i].visible = false;
	}
	parScore.visible = false;
}

// reload page
function resetlistener() {
	location.reload();
}

// to show info screen
function infolistener() {
	game.physics.arcade.gravity.y = 1000;
	ball.body.velocity.setTo(0, 0);
	character.visible = false;
	flipcharacter.visible = false;
	ball.visible = false;
	ipage.visible = true;
	mainbutton.visible = true;
}

// launches ball using button
function launchlistener() {
	if (ball.body.velocity.x == 0) {
		launch();
	}
}

// launch
function launch() {
	inWater = false;
	iceBool = iceBool / 2;
	if (reboostBool != 1) {
		positionX.push(ball.x);
		positionY.push(ball.y);
		strokes++;
	}
	reboostBool = reboostBool / 2;
	hideallpowerups();
	ball.y = ball.y - 1 * HR;
	ball.body.moves = true;
	arrow.visible = false;

	// if no powerups, set to default
	if (powerupBool == false) {
		bXM = 1;
		bYM = 1;
		vXM = 1;
		vYM = 1;
		gravM = 1;
	} else if ((powerupBool = true)) {
		powerupLimit--;
	}
	// launch physics with adjustable values for powerups
	ball.body.bounce = new Phaser.Point(0.4 * bXM, 0.4 * bYM);
	ball.body.velocity.setTo(mobileMult * vX * vXM, mobileMult * vY * vYM);
	game.physics.arcade.gravity.y = mobileMult * 400 * gravM;
	powerupBool = false;
	updateTextI();
}

function angleup() {
	// if ball is on green, set angle to 180 or 0
	if (
		ball.x >= green.x - green.width / 2 &&
		ball.x <= green.x + green.width / 2 &&
		ball.body.velocity.x == 0 &&
		ball.y == groundLevel - 1 * HR
	) {
		angle = 180;
	} else {
		// 70% speed
		angle = angle + 0.7;
	}
	updateTextQ();
}

function angledown() {
	if (
		ball.x >= green.x - green.width / 2 &&
		ball.x <= green.x + green.width / 2 &&
		ball.body.velocity.x == 0 &&
		ball.y == groundLevel - 1 * HR
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

// updates the information shown on screen
function updateTextI() {
	if (prac == false) {
		disptextI.setText('Hole: ' + hole + '\nPar: ' + par + '\nStrokes: ' + strokes);
		poweruplimittext.setText(powerupLimit);
	} else if ((prac = true && strokesDisp.length > 0)) {
		if (isMobile) {
			disptextI.setText(
				'Practice     Hole: ' +
				hole +
				'\n                   Par: ' +
				par +
				'\nBest: ' +
				Math.min.apply(null, strokesDisp) +
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
				Math.min.apply(null, strokesDisp) +
				'      Strokes: ' +
				strokes
			);
		}

	} else if ((prac = true && strokesDisp.length == 0)) {
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

// updates characteristics of shot shown on screen
function updateTextQ() {
	disptextQ.setText('Power: ' + Math.round(power) + '\nAngle: ' + Math.round(angle));
}

// updates score card with score and par
function updateScorecard() {
	var i = strokesDisp.length - 1;
	if (hole != 10) {
		total = total + strokesDisp[i];
	}
	sw = total - TOTAL_PAR[i];

	// different colors if over or under par
	if (total > TOTAL_PAR[i]) {
		parScore.addColor('#228B22', 0);
		parScore.fontSize = 20 * HR;
		parScore.setText('+' + sw);
	} else if (total < TOTAL_PAR[i]) {
		parScore.addColor('#ff0000', 0);
		parScore.fontSize = 20 * HR;
		parScore.setText(sw);
	} else if (total == TOTAL_PAR[i]) {
		parScore.addColor('#000000', 0);
		parScore.fontSize = 21 * HR;
		parScore.setText('E');
	}
	if (strokesDisp.length < 9) {
		parScore.fontSize = 25 * HR;
		parScore.y = scorecard.y - 152 * HR + 48 * HR * i;
	} else {
		parScore.y = scorecard.y + 310 * HR;
	}

	// score on each hole shown on scorecard
	if (strokesDisp.length >= 9) {
		scorecolor();
		score9.setText(strokesDisp[8])
		score10.setText(total)
		if (total - TOTAL_PAR[i] > 0) {
			score10.addColor('#228B22', 0);
		} else if (total - TOTAL_PAR[i] == 0) {
			score10.addColor('#000000', 0);
		} else if (total - TOTAL_PAR[i] < 0) {
			score10.addColor('#ff0000', 0);
		}
	} else if (strokesDisp.length >= 8) {
		scorecolor();
		score8.setText(strokesDisp[7])
	} else if (strokesDisp.length >= 7) {
		scorecolor();
		score7.setText(strokesDisp[6])
	} else if (strokesDisp.length >= 6) {
		scorecolor();
		score6.setText(strokesDisp[5])
	} else if (strokesDisp.length >= 5) {
		scorecolor();
		score5.setText(strokesDisp[4])
	} else if (strokesDisp.length >= 4) {
		scorecolor();
		score4.setText(strokesDisp[3])
	} else if (strokesDisp.length >= 3) {
		scorecolor();
		score3.setText(strokesDisp[2])
	} else if (strokesDisp.length >= 2) {
		scorecolor();
		score2.setText(strokesDisp[1])
	} else if (strokesDisp.length >= 1) {
		score1.setText(strokesDisp[0])
		if (strokesDisp[i] - TOTAL_PAR[i] > 0) {
			score1.addColor('#228B22', 0);
		} else if (strokesDisp[i] - TOTAL_PAR[i] == 0) {
			score1.addColor('#000000', 0);
		} else if (strokesDisp[i] - TOTAL_PAR[i] < 0) {
			score1.addColor('#ff0000', 0);
		}
	}

	// sets color of number on scorecard
	function scorecolor() {
		for (var i = 1; i < allScores.length - 1; i++) {
			if (strokesDisp[i] - (TOTAL_PAR[i] - TOTAL_PAR[i - 1]) > 0) {
				allScores[i].addColor('#228B22', 0);
			} else if (strokesDisp[i] - (TOTAL_PAR[i] - TOTAL_PAR[i - 1]) == 0) {
				allScores[i].addColor('#000000', 0);
			} else if (strokesDisp[i] - (TOTAL_PAR[i] - TOTAL_PAR[i - 1]) < 0) {
				allScores[i].addColor('#ff0000', 0);
			}
		}
	}
}

// move to previous position
function redolistener() {
	ball.body.moves = false;
	ball.x = positionX[positionX.length - 1];
	ball.y = positionY[positionY.length - 1];
	ball.body.velocity.setTo(0, 0);
	character.x = ball.x - character.width / 2 - ball.width / 2;
	character.y = ball.y - character.height / 2;
	flipcharacter.x = ball.x + flipcharacter.width / 2 + ball.width / 2;
	flipcharacter.y = ball.y - flipcharacter.height / 2;
	arrow.visible = true;
	arrow.x = ball.x + ball.height / 2 * Math.cos(angle * Math.PI / 180);
	arrow.y = ball.y - ball.height / 2 - ball.height / 2 * Math.sin(angle * Math.PI / 180);
}

// when display powerup button is pressed
function disppulistener() {
	if (powerupLimit > 0 || prac == true) {
		if (powerupdispbg.visible == false) {
			showallpowerups();
		} else if (powerupdispbg.visible == true) {
			hideallpowerups();
		}
		updateTextI();
	}
}

// displays all powerups
function showallpowerups() {
	if (ball.body.velocity.x == 0) {
		// and all other buttons
		powerupdispbg.visible = true;
		// not availible when score=0 or in practice mode
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

// hides all powerups
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

// to activate powerup
function activatepu() {
	if (ball.body.velocity.y != 0) {
		if (reboostBool == 2 || reboostBool == 1) {
			launch();
			reboostBool = null;
			activatebutton.visible = false;
		} else if (dropBool == 2) {
			ball.body.velocity.setTo(0, 0);
			dropBool = null;
			activatebutton.visible = false;
		}
	}
}

// superball qualities
function superballlistener() {
	hideallpowerups();
	poweruptext.setText('Power-Up: Super Ball');

	bXM = 1;
	bYM = 0.35 / 0.4;
	vXM = 7 / 4;
	vYM = 7 / 4;
	gravM = 1.5;

	powerupBool = true;
	// to disable other powerups
	gumBool = false;
	laserBool = false;
	reboostBool = null;
	dropBool = null;
	activatebutton.visible = false;
}

// bouncy ball qualities
function bouncyballlistener() {
	hideallpowerups();
	poweruptext.setText('Power-Up: Bouncy Ball');

	bXM = 0.85 / 0.4;
	bYM = 0.8 / 0.4;
	vXM = 0.98;
	vYM = 1.05;
	gravM = 1;

	powerupBool = true;
	// to disable other powerups
	gumBool = false;
	laserBool = false;
	reboostBool = null;
	dropBool = null;
	activatebutton.visible = false;
}

// gumball qualities
function gumballlistener() {
	ball.y = ball.y - 1;
	gumBool = true;

	hideallpowerups();
	poweruptext.setText('Power-Up: Gum Ball');

	bXM = 0 / 0.4;
	bYM = 0 / 0.4;
	vXM = 1;
	vYM = 1;
	gravM = 1;

	powerupBool = true;
	laserBool = false;
	reboostBool = null;
	dropBool = null;
	activatebutton.visible = false;
}

// ice ball qualities
function iceballlistener() {
	iceBool = 2;
	hideallpowerups();
	poweruptext.setText('Power-Up: Ice Ball');

	bXM = 1;
	bYM = 1;
	vXM = 1;
	vYM = 1;
	gravM = 1;

	powerupBool = true;
	// to disable other powerups
	gumBool = false;
	laserBool = false;
	reboostBool = null;
	dropBool = null;
	activatebutton.visible = false;
}

// laserball qualities
function laserballlistener() {
	laserBool = true;
	power = 100;
	updateTextQ();
	hideallpowerups();
	poweruptext.setText('Power-Up: Laser Ball');

	bXM = 1;
	bYM = 1;
	vXM = 1.5;
	vYM = 1.2;
	gravM = 0.2;

	powerupBool = true;
	// to disable other powerups
	gumBool = false;
	reboostBool = null;
	dropBool = null;
	activatebutton.visible = false;
}

// reboost qualities
function reboostlistener() {
	activatebutton.visible = true;
	reboostBool = 2;
	hideallpowerups();
	poweruptext.setText('Power-Up: Reboost *');

	bXM = 1;
	bYM = 1;
	vXM = 1;
	vYM = 1;
	gravM = 1;

	powerupBool = true;
	// to disable other powerups
	gumBool = false;
	laserBool = false;
	dropBool = null;
}

// dropball qualities
function dropballlistener() {
	activatebutton.visible = true;
	dropBool = 2;
	hideallpowerups();
	poweruptext.setText('Power-Up: Drop Ball *');

	bXM = 1;
	bYM = 1;
	vXM = 1;
	vYM = 1;
	gravM = 1;

	powerupBool = true;
	// to disable other powerups
	gumBool = false;
	laserBool = false;
	reboostBool = null;
}

// not an onlaunch powerups
// -1
function minus1listener() {
	powerupLimit--;
	hideallpowerups();
	strokes--;
	updateTextI();
	poweruptext.setText('Power-Up: -1');

	bXM = 1;
	bYM = 1;
	vXM = 1;
	vYM = 1;
	gravM = 1;

	// to disable other powerups
	gumBool = false;
	laserBool = false;
	reboostBool = null;
	dropBool = null;
	activatebutton.visible = false;
}

// mulligan powerup
function mulliganlistener() {
	powerupLimit--;
	hideallpowerups();
	redolistener();
	if (inWater == true) {
		strokes = strokes - 2;
	} else {
		strokes--;
	}
	updateTextI();
	poweruptext.setText('Power-Up: Mulligan');
	inWater = false;

	bXM = 1;
	bYM = 1;
	vXM = 1;
	vYM = 1;
	gravM = 1;

	// to disable other powerups
	gumBool = false;
	laserBool = false;
	reboostBool = null;
	dropBool = null;
	activatebutton.visible = false;
}

// characteristics all holes share
function defhole() {
	if (hole == 1) {
		par = TOTAL_PAR[0];
	} else {
		par = TOTAL_PAR[hole - 1] - TOTAL_PAR[hole - 2];
	}

	// background
	background.x = WIDTH / 2;
	background.y = HEIGHT / 2;
	background.height = HEIGHT;
	background.width = WIDTH;

	// player
	character.width = 100 * WR;
	character.height = 171 * HR;
	character.x = TEEBOX[0] + character.width / 2;
	character.y = groundLevel - character.height / 2;
	flipcharacter.width = 100 * WR;
	flipcharacter.height = 171 * HR;
	flipcharacter.x = TEEBOX[1] + flipcharacter.width / 2 + 3 * ball.width / 2;
	flipcharacter.y = groundLevel - flipcharacter.height / 2;

	// green
	green.width = 310 * WR;
	green.anchor.setTo(0.5, 0);
	green.x = WIDTH - green.width / 2;
	green.y = groundLevel;

	// cup
	cup.height = 40 * HR;
	cup.width = 70 * WR;
	cup.y = groundLevel + 36 * HR;

	// flag
	flag.x = green.x - green.width / 2 + cup.width / 2 + Math.random() * (green.width - flag.width - cup.width / 2);
	flag.y = groundLevel;
	flag.width = 103 * WR;
	flag.height = 200 * HR;

	// flag #
	flagtext.setText(hole);
	flagtext.x = flag.x + 6 * flag.width / 16;
	flagtext.y = flag.y - 6 * flag.height / 8 + 5 * HR;

	// ground
	floor1.height = HEIGHT - groundLevel;
	floor1.x = 0;
	floor1.y = groundLevel;

	floor2.height = HEIGHT - groundLevel;
	floor2.y = groundLevel;
	floor3.width = cup.width;
	floor3.y = cup.y - 1 * HR;
	floor3.height = HEIGHT - floor3.y;

	// ball
	ball.x = character.x + character.width / 2 + ball.width / 2;
	ball.y = groundLevel;
	ball.width = 28 * WR;
	ball.height = 28 * HR;
	ball.body.moves = false;

	// set values from hole position
	cup.x = flag.x - cup.width / 2 + 5 * WR;
	floor3.x = cup.x;
	floor1.width = cup.x;
	floor2.x = cup.x + cup.width;
	floor2.width = WIDTH - floor2.x;
}

function hole1() {
	hole = 1;
	defhole();

	// sand
	sand1.width = 3 * ball.width;
	sand1.height = 10 * HR;
	sand1.x = WIDTH / 2 + 20 * WR;
	sand1.y = groundLevel;

	// water
	water1.width = 5 * ball.width / 2;
	water1.height = 35 * HR;
	water1.x = WIDTH / 4;
	water1.y = groundLevel;

	// everything else off screen
	ground1.x = 2 * WIDTH;
	ground1.y = null;
	ground1.width = null;
	ground1.height = null;

	ground2.x = 2 * WIDTH;
	ground2.y = null;
	ground2.width = null;
	ground2.height = null;

	ground3.x = 2 * WIDTH;
	ground3.y = null;
	ground3.width = null;
	ground3.height = null;

	ground4.x = 2 * WIDTH;
	ground4.y = null;
	ground4.width = null;
	ground4.height = null;

	ground5.x = 2 * WIDTH;
	ground5.y = null;
	ground5.width = null;
	ground5.height = null;

	sand2.x = 2 * WIDTH;
	sand2.y = null;
	sand2.width = null;
	sand2.height = null;

	water2.x = 2 * WIDTH;
	water2.y = null;
	water2.width = null;
	water2.height = null;

	egg.x = 2 * WIDTH;
	egg.y = null;
	egg.width = null;
	egg.height = null;

	hidenegg.x = 2 * WIDTH;
	hidenegg.y = null;
	hidenegg.width = null;
	hidenegg.height = null;
}

function hole2() {
	hole = 2;
	defhole();

	ground1.width = floor3.width;
	ground1.height = HEIGHT / 2 - 100 * HR;
	ground1.x = WIDTH / 2 - ground1.width / 2;
	ground1.y = groundLevel - ground1.height;

	// sand
	sand1.x = ground1.x - sand1.width - 30 * WR;
	sand1.width = 90 * WR;
	sand1.height = 10 * HR;
	sand1.y = groundLevel;

	// water
	water1.x = ground1.x + ground1.width + 30 * WR;
	water1.y = groundLevel;
	water1.height = 50 * HR;
	water1.width = 80 * WR;

	// everything else off screen
	ground2.x = 2 * WIDTH;
	ground2.y = null;
	ground2.width = null;
	ground2.height = null;

	ground3.x = 2 * WIDTH;
	ground3.y = null;
	ground3.width = null;
	ground3.height = null;

	ground4.x = 2 * WIDTH;
	ground4.y = null;
	ground4.width = null;
	ground4.height = null;

	ground5.x = 2 * WIDTH;
	ground5.y = null;
	ground5.width = null;
	ground5.height = null;

	sand2.x = 2 * WIDTH;
	sand2.y = null;
	sand2.width = null;
	sand2.height = null;

	water2.x = 2 * WIDTH;
	water2.y = null;
	water2.width = null;
	water2.height = null;

	egg.x = 2 * WIDTH;
	egg.y = null;
	egg.width = null;
	egg.height = null;

	hidenegg.x = 2 * WIDTH;
	hidenegg.y = null;
	hidenegg.width = null;
	hidenegg.height = null;
}

function hole3() {
	hole = 3;
	defhole();

	ground1.width = WIDTH / 6;
	ground1.height = 2 * groundLevel / 9;
	ground1.x = WIDTH / 6;
	ground1.y = groundLevel - ground1.height;

	ground2.width = WIDTH / 7;
	ground2.height = 2 * ground1.height;
	ground2.x = ground1.x + ground1.width;
	ground2.y = groundLevel - ground2.height;

	ground3.width = WIDTH / 7;
	ground3.height = 3 * ground1.height;
	ground3.x = ground2.x + ground2.width;
	ground3.y = groundLevel - ground3.height;

	ground4.height = (ground1.height - ground2.height) / 2 + ground2.height;
	ground4.x = ground3.x + ground3.width;
	ground4.width = green.x - green.width / 2 - ground4.x;
	ground4.y = groundLevel - ground4.height;

	water1.width = 70 * WR;
	water1.x = WIDTH - water1.width;
	water1.y = groundLevel;
	water1.height = 35 * HR;

	// everything else off screen
	ground5.x = 2 * WIDTH;
	ground5.width = 0;
	ground5.height = 0;
	ground5.y = 0;

	sand1.x = 2 * WIDTH;
	sand1.y = null;
	sand1.width = null;
	sand1.height = null;

	sand2.x = 2 * WIDTH;
	sand2.y = null;
	sand2.width = null;
	sand2.height = null;

	water2.x = 2 * WIDTH;
	water2.y = null;
	water2.width = null;
	water2.height = null;

	egg.x = 2 * WIDTH;
	egg.y = null;
	egg.width = null;
	egg.height = null;

	hidenegg.x = 2 * WIDTH;
	hidenegg.y = null;
	hidenegg.width = null;
	hidenegg.height = null;
}

function hole4() {
	hole = 4;
	defhole();

	ground1.x = WIDTH / 8;
	ground1.width = floor3.width;
	ground1.height = HEIGHT / 2 - 100 * HR;
	ground1.y = groundLevel - ground1.height;

	ground2.height = 13 * ground1.height / 8;
	ground2.width = ground1.width;
	ground2.x = 7 * WIDTH / 32;
	ground2.y = 0;

	ground3.height = 11 * ground1.height / 8;
	ground3.width = ground1.width;
	ground3.x = 13 * WIDTH / 32;
	ground3.y = 0;

	ground4.width = ground1.width;
	ground4.height = HEIGHT / 4;
	ground4.x = 13 * WIDTH / 32;
	ground4.y = groundLevel - ground4.height;

	ground5.height = groundLevel - 2 * ball.height;
	ground5.width = ground1.width;
	ground5.x = 2 * WIDTH / 3;
	ground5.y = 0;

	// everything else off screen
	sand1.x = 2 * WIDTH;
	sand1.y = null;
	sand1.width = null;
	sand1.height = null;

	sand2.x = 2 * WIDTH;
	sand2.y = null;
	sand2.width = null;
	sand2.height = null;

	water1.x = 2 * WIDTH;
	water1.y = null;
	water1.width = null;
	water1.height = null;

	water2.x = 2 * WIDTH;
	water2.y = null;
	water2.width = null;
	water2.height = null;

	egg.x = 2 * WIDTH;
	egg.y = null;
	egg.width = null;
	egg.height = null;

	hidenegg.x = 2 * WIDTH;
	hidenegg.y = null;
	hidenegg.width = null;
	hidenegg.height = null;
}

function hole5() {
	hole = 5;
	defhole();

	ground1.x = 5 * WIDTH / 12;
	ground1.y = 0;
	ground1.width = cup.width;
	ground1.height = groundLevel - 5 * ball.height / 2;

	ground2.height = 15 * HEIGHT / 32;
	ground2.x = 7 * WIDTH / 12;
	ground2.y = groundLevel - ground2.height;
	ground2.width = cup.width;

	sand1.x = ground2.x + 8 * WR;
	sand1.y = ground2.y;
	sand1.width = ground2.width - 16 * WR;
	sand1.height = 10;

	water1.width = 75 * WR;
	water1.x = ground1.x - water1.width;
	water1.y = groundLevel;
	water1.height = 35 * HR;

	water2.x = ground2.x + ground2.width + ball.width;
	water2.y = groundLevel;
	water2.width = 75 * WR;
	water2.height = 35 * HR;

	// everything else off screen
	ground3.x = 2 * WIDTH;
	ground3.y = null;
	ground3.width = null;
	ground3.height = null;

	ground4.x = 2 * WIDTH;
	ground4.y = null;
	ground4.width = null;
	ground4.height = null;

	ground5.x = 2 * WIDTH;
	ground5.y = null;
	ground5.width = null;
	ground5.height = null;

	sand2.x = 2 * WIDTH;
	sand2.y = null;
	sand2.width = null;
	sand2.height = null;

	egg.x = 2 * WIDTH;
	egg.y = null;
	egg.width = null;
	egg.height = null;

	hidenegg.x = 2 * WIDTH;
	hidenegg.y = null;
	hidenegg.width = null;
	hidenegg.height = null;
}

function hole6() {
	hole = 6;
	defhole();

	ground1.x = WIDTH / 3 + 40 * WR;
	ground1.y = 80 * HR;
	ground1.width = 80 * WR;
	ground1.height = groundLevel - ground1.y;

	ground2.width = 180 * WR;
	ground2.x = ground1.x - ground2.width;
	ground2.y = HEIGHT / 2 + 10 * HR;
	ground2.height = 70 * HR;

	ground3.x = 0;
	ground3.y = HEIGHT / 3 - 40 * HR;
	ground3.width = 230 * WR;
	ground3.height = ground2.height;

	ground4.x = WIDTH / 2;
	ground4.y = 0;
	ground4.width = ground1.width;
	ground4.height = groundLevel - 100 * HR;

	ground5.x = ground4.x + 3 * ground4.width;
	ground5.height = HEIGHT / 4;
	ground5.y = groundLevel - ground5.height;
	ground5.width = 60 * WR;

	sand1.x = ground4.x;
	sand1.y = groundLevel;
	sand1.width = ground4.width;
	sand1.height = 10 * HR;

	water1.x = ground1.x + 10 * WR;
	water1.y = ground1.y;
	water1.width = ground1.width - 20 * WR;
	water1.height = 40 * HR;

	// everything else off screen
	sand2.x = 2 * WIDTH;
	sand2.y = null;
	sand2.width = null;
	sand2.height = null;

	water2.x = 2 * WIDTH;
	water2.y = null;
	water2.width = null;
	water2.height = null;

	egg.x = 2 * WIDTH;
	egg.y = null;
	egg.width = null;
	egg.height = null;

	hidenegg.x = 2 * WIDTH;
	hidenegg.y = null;
	hidenegg.width = null;
	hidenegg.height = null;
}

function hole7() {
	hole = 7;
	defhole();

	egg.height = 5 * ball.height / 4;
	egg.y = groundLevel - egg.height;

	ground1.height = 4 * HEIGHT / 7;
	ground1.x = WIDTH / 4;
	ground1.y = egg.y - ground1.height;
	ground1.width = cup.width;

	egg.x = ground1.x;
	egg.width = ground1.width;

	hidenegg.x = egg.x + egg.width / 2;
	hidenegg.y = egg.y;
	hidenegg.width = 7 * egg.width / 16;
	hidenegg.height = egg.height;

	water2.x = WIDTH / 7;
	water2.y = groundLevel;
	water2.width = 7 * ball.width / 2;
	water2.height = 35 * HR;

	sand2.x = 5 * WIDTH / 12;
	sand2.y = groundLevel;
	sand2.width = 3 * ball.width;
	sand2.height = 10 * WR;

	water1.x = WIDTH / 2;
	water1.y = groundLevel;
	water1.width = 3 * ball.width;
	water1.height = 35 * HR;

	// everything else off screen
	ground2.x = 2 * WIDTH;
	ground2.y = null;
	ground2.width = null;
	ground2.height = null;

	ground3.x = 2 * WIDTH;
	ground3.y = null;
	ground3.width = null;
	ground3.height = null;

	ground4.x = 2 * WIDTH;
	ground4.y = null;
	ground4.width = null;
	ground4.height = null;

	ground5.x = 2 * WIDTH;
	ground5.y = null;
	ground5.width = null;
	ground5.height = null;

	sand1.x = 2 * WIDTH;
	sand1.y = null;
	sand1.width = null;
	sand1.height = null;
}

function hole8() {
	hole = 8;
	defhole();

	ground1.height = HEIGHT / 4;
	ground1.x = WIDTH / 3;
	ground1.y = groundLevel - ground1.height;
	ground1.width = 2 * ball.width;

	ground2.x = ground1.x;
	ground2.y = 0;
	ground2.width = ground1.width;
	ground2.height = ground1.y - 5 * ball.height / 2;

	sand1.x = ground1.x + 8 * WR;
	sand1.y = ground1.y;
	sand1.width = ground1.width - 16 * WR;
	sand1.height = 10 * HR;

	water1.width = 5 * ball.width / 2;
	water1.x = ground1.x - water1.width - ball.width;
	water1.y = groundLevel;
	water1.height = 35 * HR;

	sand2.width = 2 * ball.width;
	sand2.x = water1.x - 5 * ball.width / 2 - sand2.width;
	sand2.y = groundLevel;
	sand2.height = 10 * HR;

	water2.x = 3 * WIDTH / 5 + 3 * ball.width / 2;
	water2.y = groundLevel;
	water2.width = 5 * ball.width / 2;
	water2.height = 35 * HR;

	// everything else off screen
	ground3.x = 2 * WIDTH;
	ground3.y = null;
	ground3.width = null;
	ground3.height = null;

	ground4.x = 2 * WIDTH;
	ground4.y = null;
	ground4.width = null;
	ground4.height = null;

	ground5.x = 2 * WIDTH;
	ground5.y = null;
	ground5.width = null;
	ground5.height = null;

	egg.x = 2 * WIDTH;
	egg.y = null;
	egg.width = null;
	egg.height = null;

	hidenegg.x = 2 * WIDTH;
	hidenegg.y = null;
	hidenegg.width = null;
	hidenegg.height = null;
}

function hole9() {
	hole = 9;
	defhole();

	ground1.height = HEIGHT / 4;
	ground1.x = WIDTH / 6;
	ground1.y = groundLevel - ground1.height;
	ground1.width = WIDTH / 8;

	ground2.height = HEIGHT / 2 - ball.height;
	ground2.x = ground1.x + ground1.width;
	ground2.y = groundLevel - ground2.height;
	ground2.width = ground1.width;

	ground3.x = WIDTH / 2;
	ground3.y = 0;
	ground3.width = cup.width;
	ground3.height = groundLevel - 3 * ball.height;

	sand1.width = 5 * ball.width / 2;
	sand1.x = ground2.x - sand1.width - 3 * ball.width / 2;
	sand1.y = ground1.y;
	sand1.height = 10 * HR;

	sand2.x = 2 * WIDTH / 3;
	sand2.y = groundLevel;
	sand2.width = 3 * ball.width;
	sand2.height = 10 * HR;

	water1.width = 2 * ball.width;
	water1.x = ground2.x - sand1.width - ball.width + ground2.width;
	water1.y = ground2.y;
	water1.height = 35 * HR;

	water2.x = ground3.x;
	water2.y = groundLevel;
	water2.width = ground3.width;
	water2.height = 35 * HR;

	// everything else off screen
	ground4.x = 2 * WIDTH;
	ground4.y = null;
	ground4.width = null;
	ground4.height = null;

	ground5.x = 2 * WIDTH;
	ground5.y = null;
	ground5.width = null;
	ground5.height = null;

	egg.x = 2 * WIDTH;
	egg.y = null;
	egg.width = null;
	egg.height = null;

	hidenegg.x = 2 * WIDTH;
	hidenegg.y = null;
	hidenegg.width = null;
	hidenegg.height = null;
}

// customizations

var custom = false;

var ballselection = ['whiteball', 'blackball', 'blueball', 'darkblueball', 'redball', 'greenball', 'pinkball', 'purpleball', 'volleyball',
	'soccerball', 'basketball', 'tennisball', 'bowlingball', '8-ball'
];

var characterselection = ['character1', 'character2', 'character3', 'character4', 'character5', 'character6'];
var flipcharacterselection = ['character1-flipped', 'character2-flipped', 'character3-flipped', 'character4-flipped', 'character5-flipped', 'character6-flipped'];

var allballs;
var allchars;

// ball choice
var bsel = 0;
// background choice
var charsel = 0;


// in create
function customizations() {
	// customize screen background
	custombg = game.add.sprite(0, 0, 'custombg');
	custombg.anchor.setTo(0, 0);
	custombg.width = WIDTH;
	custombg.height = HEIGHT;
	custombg.visible = false;

	// button to go back to main customizations page
	backbutton = game.add.sprite(null, null, 'backbutton');
	backbutton.anchor.setTo(0, 0);
	backbutton.width = 3 * homebutton.width / 2;
	backbutton.x = backbutton.width / 15;
	backbutton.height = backbutton.width;
	backbutton.y = backbutton.height / 15;
	backbutton.inputEnabled = true;
	backbutton.events.onInputDown.add(backlistener, this);
	backbutton.visible = false;

	// button to go to main menu (w/o refresh)
	mainbutton = game.add.sprite(null, null, 'backbutton');
	mainbutton.anchor.setTo(0, 0);
	mainbutton.width = backbutton.width;
	mainbutton.x = backbutton.width / 15;
	mainbutton.height = backbutton.width;
	mainbutton.y = backbutton.height / 15;
	mainbutton.inputEnabled = true;
	mainbutton.events.onInputDown.add(mainbuttonlistener, this);
	mainbutton.visible = false;

	// ball display
	dispball = game.add.sprite(WIDTH / 3, HEIGHT / 2, ballselection[bsel]);
	dispball.anchor.setTo(0.5, 0.5);
	dispball.width = 325 * WR;
	dispball.height = 325 * HR;
	dispball.inputEnabled = true;
	dispball.visible = false;
	dispball.events.onInputDown.add(ballcustoms, this);

	// character display
	dispchar = game.add.sprite(2 * WIDTH / 3, HEIGHT / 2, characterselection[charsel]);
	dispchar.anchor.setTo(0.5, 0.5);
	dispchar.width = 10 * character.width / 3;
	dispchar.height = 10 * character.height / 3;
	dispchar.inputEnabled = true;
	dispchar.visible = false;
	dispchar.events.onInputDown.add(charcustoms, this);

	// individual customizations

	// characters
	char1 = game.add.sprite(1 * (WIDTH - 6 * character.width) / 4, HEIGHT / 4, characterselection[0]);
	char2 = game.add.sprite(
		2 * (WIDTH - 6 * character.width) / 4 + 2 * character.width,
		HEIGHT / 4,
		characterselection[1]
	);
	char3 = game.add.sprite(
		3 * (WIDTH - 6 * character.width) / 4 + 4 * character.width,
		HEIGHT / 4,
		characterselection[2]
	);
	char4 = game.add.sprite(1 * (WIDTH - 6 * character.width) / 4, 3 * HEIGHT / 4, characterselection[3]);
	char5 = game.add.sprite(
		2 * (WIDTH - 6 * character.width) / 4 + 2 * character.width,
		3 * HEIGHT / 4,
		characterselection[4]
	);
	char6 = game.add.sprite(
		3 * (WIDTH - 6 * character.width) / 4 + 4 * character.width,
		3 * HEIGHT / 4,
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


	// balls
	ball1 = game.add.sprite(WIDTH / 8 + 0 * WIDTH / 4, HEIGHT / 8 + 0 * HEIGHT / 4, ballselection[0]);
	ball2 = game.add.sprite(WIDTH / 8 + 1 * WIDTH / 4, HEIGHT / 8 + 0 * HEIGHT / 4, ballselection[1]);
	ball3 = game.add.sprite(WIDTH / 8 + 2 * WIDTH / 4, HEIGHT / 8 + 0 * HEIGHT / 4, ballselection[2]);
	ball4 = game.add.sprite(WIDTH / 8 + 3 * WIDTH / 4, HEIGHT / 8 + 0 * HEIGHT / 4, ballselection[3]);

	ball5 = game.add.sprite(WIDTH / 8 + 0 * WIDTH / 4, HEIGHT / 8 + 1 * HEIGHT / 4, ballselection[4]);
	ball6 = game.add.sprite(WIDTH / 8 + 1 * WIDTH / 4, HEIGHT / 8 + 1 * HEIGHT / 4, ballselection[5]);
	ball7 = game.add.sprite(WIDTH / 8 + 2 * WIDTH / 4, HEIGHT / 8 + 1 * HEIGHT / 4, ballselection[6]);
	ball8 = game.add.sprite(WIDTH / 8 + 3 * WIDTH / 4, HEIGHT / 8 + 1 * HEIGHT / 4, ballselection[7]);

	ball9 = game.add.sprite(WIDTH / 8 + 0 * WIDTH / 4, HEIGHT / 8 + 2 * HEIGHT / 4, ballselection[8]);
	ball10 = game.add.sprite(WIDTH / 8 + 1 * WIDTH / 4, HEIGHT / 8 + 2 * HEIGHT / 4, ballselection[9]);
	ball11 = game.add.sprite(WIDTH / 8 + 2 * WIDTH / 4, HEIGHT / 8 + 2 * HEIGHT / 4, ballselection[10]);
	ball12 = game.add.sprite(WIDTH / 8 + 3 * WIDTH / 4, HEIGHT / 8 + 2 * HEIGHT / 4, ballselection[11]);

	ball13 = game.add.sprite(WIDTH / 4 + 0 * WIDTH / 4, HEIGHT / 8 + 3 * HEIGHT / 4, ballselection[12]);
	ball14 = game.add.sprite(WIDTH / 4 + 2 * WIDTH / 4, HEIGHT / 8 + 3 * HEIGHT / 4, ballselection[13]);

	allballs = [ball1, ball2, ball3, ball4, ball5, ball6, ball7, ball8, ball9, ball10, ball11, ball12, ball13, ball14];
	allballslisteners = [ball1f, ball2f, ball3f, ball4f, ball5f, ball6f, ball7f, ball8f, ball9f, ball10f, ball11f, ball12f, ball13f, ball14f];

	for (var s = 0; s < allballs.length; s++) {
		allballs[s].anchor.setTo(0.5, 0.5);
		allballs[s].width = 150 * WR;
		allballs[s].height = 150 * HR;
		allballs[s].inputEnabled = true;
		allballs[s].visible = false;

		allballs[s].events.onInputDown.add(allballslisteners[s], this);
	}
}

// when customize button is pressed
function customizelistener() {
	custombg.visible = true;

	mainbutton.visible = true;
	practicebutton.visible = false;
	startbutton.visible = false;
	homebutton.visible = false;

	dispball.visible = true;
	dispchar.visible = true;
}

// when display ball is pressed
function ballcustoms() {
	dispball.visible = false;
	dispchar.visible = false;

	for (var s = 0; s < allballs.length; s++) {
		allballs[s].visible = true;
	}

	backbutton.visible = true;
	mainbutton.visible = false;
}

// when display background is pressed
function charcustoms() {
	dispchar.visible = false;
	dispball.visible = false;

	for (var s = 0; s < allchars.length; s++) {
		allchars[s].visible = true;
	}

	backbutton.visible = true;
	mainbutton.visible = false;
}

// when back button is pressed
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

// when main menu button is pressed
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

// applied to all ball customizations
function allballcustoms() {
	// creating new ball
	ball = game.add.sprite(ball.x, ball.y, ballselection[bsel]);
	ball.anchor.setTo(0.5, 1);
	ball.width = 28 * WR;
	ball.height = 28 * HR;
	game.physics.enable(ball, Phaser.Physics.ARCADE);
	ball.body.allowGravity = true;
	ball.body.immovable = false;
	ball.body.moves = true;
	ball.body.collideWorldBounds = true;
	ball.body.bounce = true;
	ball.body.bounce = new Phaser.Point(0.4, 0.4);
	ball.visible = false;

	// display ball shows customization
	dispball = game.add.sprite(WIDTH / 3, HEIGHT / 2, ballselection[bsel]);
	dispball.anchor.setTo(0.5, 0.5);
	dispball.width = 325 * WR;
	dispball.height = 325 * HR;
	dispball.inputEnabled = true;
	dispball.events.onInputDown.add(ballcustoms, this);
	dispball.visible = true;
	custom = true;
	backlistener();
}

// applied to all character customizations
function allcharcustoms() {
	// player
	character.x = 2 * WIDTH;
	flipcharacter.x = 2 * WIDTH;

	// creating new characters
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
	character.width = 100 * WR;
	character.height = 171 * HR;
	flipcharacter.width = 100 * WR;
	flipcharacter.height = 171 * HR;

	// setting display character to custom
	dispchar = game.add.sprite(2 * WIDTH / 3, HEIGHT / 2, characterselection[charsel]);
	dispchar.anchor.setTo(0.5, 0.5);
	dispchar.width = 10 * character.width / 3;
	dispchar.height = 10 * character.height / 3;
	dispchar.inputEnabled = true;
	dispchar.events.onInputDown.add(charcustoms, this);
	dispchar.visible = true;
	custom = true;
	backlistener();
}

// listeners for each ball
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

// listeners for each character
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