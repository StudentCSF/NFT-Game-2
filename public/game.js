const GAME_CONFIG = {
    width: 800,
    height: 600,
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000, x: 1e-12 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const SCORE_RARITY_MAP = {
    1: 'demo',
    10: 'unusual',
    11: 'rare',
    50000: 'unique',
    100000: 'epic',
    500000: 'mythical',
    1000000: 'legendary'
}

const RARITY_SCORE_MAP = {
    'demo': 1,
    'unusual': 10,
    'rare': 11,
    'unique': 50000,
    'epic': 100000,
    'mythical': 500000,
    'legendary': 1000000
}

var user;

const DEFAULT_PLAYER_URL = "assets/alienBeige_stand.png";
const BASE_SPEED = -5;
const MAX_SPEED = -15;

var platforms;
var playerUrl;
var player;
var cursors;
var cactuses;

var jumpHeight = -400;

var currentSpeed;
var acceleration = -0.1;

var rank = -1;

var score = 0;
var scorePeriod = 30;
var time = scorePeriod;
var scoreText;

var highScore;
var highScoreText;

var gameOver = false;
var gameOverText;

var initStart = true;

var localYScore = 10;
var deployYScore = localYScore - 200;
var actualYScore;

var localYGO = 300;
var deployYGO = localYGO - 200;
var actualYGO;

var regameText;

var startText;

var emptyByte = '0x00000000000000000000000000000000000000000000000000000000';

var localOffset = 0;
var deployOffset = -100;
var actualOffset;

function initVars() {
    if (window.location.host == '127.0.0.1:5500') {
        actualYScore = localYScore;
        actualYGO = localYGO;
        actualOffset = localOffset;
    } else {
        actualYScore = deployYScore;
        actualYGO = deployYGO
        actualOffset = deployOffset;
    }
}

initVars();


export function startGame(auth_user) {
    user = auth_user;
    new Phaser.Game(GAME_CONFIG);
}

async function preload() {
    this.load.image('background', 'assets/bg_desert.png');
    this.load.image('ground', 'assets/sandCenter_rounded.png');
    this.load.image('cactus', 'assets/cactus.png');
    this.load.image('default_player', DEFAULT_PLAYER_URL);
}

async function create() {
    this.add.image(400, 300, 'background');
    if (initStart) {
        startText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + actualOffset, 'Start game', { fontSize: '48px', fill: '#F00' })
            .setOrigin(0.5)
            .setPadding(10)
            .setFontStyle('bold')
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', function () {
                initStart = false;
                startText.setVisible(false);
            }, this);
    }

    let init, dinit;

    cactuses = this.physics.add.staticGroup();
    cactuses.create(Math.random() * 100 + GAME_CONFIG.width, 532, 'cactus').setScale(0.7).refreshBody();
    for (let c in cactuses.getChildren()) {
        cactuses.getChildren()[c].body.x += 10;
        cactuses.getChildren()[c].body.y += 10;
        cactuses.getChildren()[c].body.width -= 20;
        cactuses.getChildren()[c].body.height -= 10;
    }

    platforms = this.physics.add.staticGroup();
    init = 21;
    dinit = init * 2;
    for (let i = init; i < GAME_CONFIG.width + dinit; i += dinit) {
        platforms.create(i, 579, 'ground').setScale(0.67).refreshBody();
    }

    if (user) {
        player = this.physics.add.sprite(50, 400, 'player').setScale(0.7).refreshBody();
    } else {
        player = this.physics.add.sprite(50, 400, 'default_player').setScale(0.7).refreshBody();
    }
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(player, cactuses);

    cursors = this.input.keyboard.createCursorKeys();

    currentSpeed = BASE_SPEED;

    scoreText = this.add.text(16, actualYScore, 'Score: 0', { fontSize: '32px', fill: '#FFF' });

    highScore = localStorage.getItem('high-score') == null ? 0 : localStorage.getItem('high-score');

    highScoreText = this.add.text(416, actualYScore, 'High Score: ' + highScore, { fontSize: '32px', fill: '#FFF' });
}

async function reward() {
    var rew = 0;
    for (let key in SCORE_RARITY_MAP) {
        if (score >= key && key > rew) {
            rew = key;
        }
    }
    rew_rar = SCORE_RARITY_MAP[rew];
    if (RARITY_SCORE_MAP[rew_rar] <= RARITY_SCORE_MAP[rank]) return;
    if (rew_rar != undefined) {
        let rew_params = {
            rew_rar: rew_rar
        }

        let res = await Moralis.Cloud.run('reward', rew_params);

        var sendOptions = {
            contractAddress: contractAddress,
            abi: contractAbi,
            functionName: res.fname,
            params: res.params
        };

        await Moralis.enableWeb3();

        try {
            var contract = await Moralis.executeFunction(sendOptions);
        } catch (e) {
            console.log(e);
            return;
        }
        contract.wait();
        alert("Вы выиграли новый NFT!\nОн скоро проинициализируется.\nДля его использования нужно будет просто перезагрузить страницу.\nНе переживайте, если у Вас будет старый NFT в игре.\nЗначит надо просто подольше подождать.\nПожалуйста, проявите терпение :)");
    }
}

async function update() {
    if (initStart || gameOver || !player) {
        return;
    }
    for (let i in cactuses.getChildren()) {
        gameOver = player.body.touching.right || player.body.touching.down && cactuses.getChildren()[i].body.touching.up;
        if (gameOver) {
            highScore = localStorage.getItem('high-score');
            if (highScore == null || score > highScore) {
                highScore = score;
                localStorage.setItem('high-score', highScore);
                highScoreText.setText('High Score: ' + highScore);
            }
            gameOverText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + actualOffset, 'Game over.', { fontSize: '48px', fill: '#000' })
                .setOrigin(0.5)
                .setPadding(10);

            if (user) {
                await reward();
                await initPlayerUrl();
            }
            regameText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + actualOffset + 100, 'Restart game', { fontSize: '48px', fill: '#F00' })
                .setOrigin(0.5)
                .setPadding(10)
                .setFontStyle('bold')
                .setInteractive({ useHandCursor: true })
                .on('pointerdown', function () {
                    score = 0;
                    gameOver = false;
                    this.scene.restart();
                }, this);

            return;
        }
    }
    time--;
    if (time == 0) {
        score++;
        time = scorePeriod;

        scoreText.setText('Score: ' + score);
    }
    if (currentSpeed < MAX_SPEED) {
        currentSpeed = MAX_SPEED;
    }
    else if (currentSpeed > MAX_SPEED) {
        currentSpeed += acceleration / 60;
    }

    for (let i in cactuses.getChildren()) {
        cactuses.getChildren()[i].x += currentSpeed;
        cactuses.getChildren()[i].body.x += currentSpeed;
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(jumpHeight);
    }

    for (let i in cactuses.getChildren()) {
        if (cactuses.getChildren()[i].body.x < -cactuses.getChildren()[i].width) {
            let newX = Math.random() * 100 + GAME_CONFIG.width;
            cactuses.getChildren()[i].body.x += newX;
            cactuses.getChildren()[i].x += newX;
        }
    }
}