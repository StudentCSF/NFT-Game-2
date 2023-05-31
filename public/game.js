import { handleGameApiPost, SIGNER } from "./main.js";
import { ethers } from "https://cdn-cors.ethers.io/lib/ethers-5.5.4.esm.min.js"

const CONTRACT_ADDRESS = '0xb2Fbda96A8A0fd389a0E90aeA00C84Dccf0B4d29';
const CONTRACT_ABI = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": false, "internalType": "bool", "name": "approved", "type": "bool" }], "name": "ApprovalForAll", "type": "event" }, { "inputs": [], "name": "buyOneLife", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "_tokenUrl", "type": "string" }], "name": "mintItem", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "", "type": "uint256" }], "name": "Received", "type": "event" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256[]", "name": "ids", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "safeBatchTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "id", "type": "uint256" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "operator", "type": "address" }, { "internalType": "bool", "name": "approved", "type": "bool" }], "name": "setApprovalForAll", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256[]", "name": "ids", "type": "uint256[]" }, { "indexed": false, "internalType": "uint256[]", "name": "values", "type": "uint256[]" }], "name": "TransferBatch", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "id", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "TransferSingle", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "string", "name": "value", "type": "string" }, { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" }], "name": "URI", "type": "event" }, { "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "stateMutability": "payable", "type": "receive" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "id", "type": "uint256" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address[]", "name": "accounts", "type": "address[]" }, { "internalType": "uint256[]", "name": "ids", "type": "uint256[]" }], "name": "balanceOfBatch", "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "address", "name": "operator", "type": "address" }], "name": "isApprovedForAll", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "smartContractBalance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" }], "name": "supportsInterface", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_tokenId", "type": "uint256" }], "name": "uri", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }];

const GAME_CONFIG = {
    width: 800,
    height: 600,
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000, x: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const DEFAULT_PLAYER_URL = "assets/alienBeige_stand.png";

const START_GAME_TEXT = 'Начать игру';
const GAME_OVER_TEXT = 'Игра окончена';
const REGAME_TEXT = 'Начать игру заново';
const BUY_LIFE_TEXT = 'Купить одну жизнь и продолжить игру';

const BASE_SPEED = -5;
const MAX_SPEED = -15;
const JUMP_HEIGHT = -400;
const ACCELERATION = -0.1;

const SCORE_PERIOD = 30;

const FLIES_START_APPEREANCE_SCORE = 10;

const DEFAULT_LIFES_COUNT = 1;

const LOCAL_Y_SCORE = 10;
const DEPLOY_Y_SCORE = LOCAL_Y_SCORE - 200;
const LOCAL_OFFSET = 0;
const DEPLOY_OFFSET = -100;
const LOCAL_Y_GO = 300;
const DEPLOY_Y_GO = LOCAL_Y_GO - 200;

const LIFE_COST = ethers.utils.parseEther('0.001');

var authenticatedUser;

var game;

var platforms;
var cursors;
var cactuses;
var lifes;
var flies;

var playerUrl;
var player;

var currentSpeed;

var rank;

var score;
var time;
var scoreText;

var highScore;
var highScoreText;

var gameOver;
var gameOverElement;

var initStart = true;

var actualYScore;

var actualYGO;

var regameElement;

var startGameElement;

var actualOffset;

var baseLifesCount;
var lifesCount;

var canFlyGo;
var canCactusGo;

var buyLifeElement;

var bought;

var canUpdateHighScore = true;

async function initPlayer() {
    if (!authenticatedUser) {
        playerUrl = DEFAULT_PLAYER_URL;
        highScore = localStorage.getItem('high-score') == null ? 0 : localStorage.getItem('high-score');
        baseLifesCount = DEFAULT_LIFES_COUNT;
        rank = -1;
    } else {
        const userAddress = authenticatedUser.authData.moralis['address'];
        const playerData = await handleGameApiPost('playerUrl', {
            address: userAddress
        });
        if (playerData) {
            console.log('e result');
            console.log(playerData.highScore);
            playerUrl = playerData.playerUrl;
            rank = playerData.rank;
            highScore = playerData.highScore;
            baseLifesCount = playerData.lifesCount;
        } else {
            playerUrl = DEFAULT_PLAYER_URL;
            highScore = 0;
            baseLifesCount = DEFAULT_LIFES_COUNT;
            rank = 'none';
        }
    }
}

function initVars() {
    if (window.location.host == '127.0.0.1:5500') {
        actualYScore = LOCAL_Y_SCORE;
        actualYGO = LOCAL_Y_GO;
        actualOffset = LOCAL_OFFSET;
    } else {
        actualYScore = DEPLOY_Y_SCORE;
        actualYGO = DEPLOY_Y_GO
        actualOffset = DEPLOY_OFFSET;
    }
}

initVars();

const REMOVE_CANVAS = true;

export async function startGame(authUser) {
    let wasUser = authenticatedUser;
    authenticatedUser = authUser;
    await initPlayer();
    if ((!wasUser && authUser || wasUser && !authUser) && game) {
        game.destroy(REMOVE_CANVAS);
        game = null;
    }
    if (!game) {
        game = new Phaser.Game(GAME_CONFIG);
    }
    initStart = true;
}

async function preload() {
    this.load.image('background', 'assets/bg_desert.png');
    this.load.image('ground', 'assets/sandCenter_rounded.png');
    this.load.image('cactus', 'assets/cactus.png');
    this.load.image('life', 'assets/heart.png');
    this.load.image('fly1', 'assets/flyFly1.png');
    this.load.image('fly2', 'assets/flyFly2.png');
    this.load.image('player', playerUrl);
}

async function create() {
    this.add.image(400, 300, 'background');
    if (initStart) {
        startGameElement = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY + actualOffset,
            START_GAME_TEXT,
            { fontSize: '48px', fill: '#F00' })
            .setOrigin(0.5)
            .setPadding(10)
            .setFontStyle('bold')
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', function () {
                initStart = false;
                startGameElement.setVisible(false);
            }, this);
    }

    let init, dinit;

    cactuses = this.physics.add.staticGroup();
    cactuses.create(Math.random() * 300 + 100 + GAME_CONFIG.width, 532, 'cactus')
        .setScale(0.7)
        .refreshBody();

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
        platforms.create(i, 579, 'ground')
            .setScale(0.67)
            .refreshBody();
    }

    lifesCount = baseLifesCount;
    lifes = this.physics.add.staticGroup();
    let lifeX = 30;
    let lifeY = 80;
    let lifeStepX = 60;
    for (let i = 0; i < lifesCount; i++) {
        lifes.create(lifeX, lifeY, 'life');
        lifeX += lifeStepX;
    }

    flies = this.physics.add.staticGroup();
    flies.create(Math.random() * 300 + 100 + GAME_CONFIG.width, 512, 'fly1')
        .setScale(0.7)
        .refreshBody();

    player = this.physics.add.sprite(50, 400, 'player')
        .setScale(0.7)
        .refreshBody();

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(player, cactuses, collisionHandler);
    this.physics.add.collider(player, flies, collisionHandler);

    cursors = this.input.keyboard.createCursorKeys();

    currentSpeed = BASE_SPEED;

    scoreText = this.add.text(16, actualYScore, 'Счет: 0', { fontSize: '32px', fill: '#FFF' });

    highScoreText = this.add.text(416, actualYScore, 'Лучший счет: ' + highScore, { fontSize: '32px', fill: '#FFF' });

    canFlyGo = false;
    canCactusGo = true;

    gameOver = false;
    score = 0;
    time = SCORE_PERIOD;
}

async function reward() {
    const rewardData = await handleGameApiPost('reward', {
        address: authenticatedUser.authData.moralis['address'],
        rank: rank,
        score: score
    });
    console.log(rewardData);
    if (rewardData && rewardData.rewardUrl) {
        const contract = await new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, SIGNER);
        let mintResult;
        try {
            mintResult = await contract.mintItem(rewardData.rewardUrl);
        } catch (e) {
            mintResult = false;
            canUpdateHighScore = false;
        }
        console.log(mintResult);
        if (mintResult) {
            alert("Вы выиграли новый NFT!\nОн скоро проинициализируется.\nДля его использования нужно будет просто перезагрузить страницу.\nНе переживайте, если у Вас будет старый NFT в игре.\nЗначит надо просто подольше подождать.\nПожалуйста, проявите терпение :)");
            return 1;
        } else {
            return null;
        }
    } else {
        console.log('no result');
        return null;
    }
}

function collisionHandler() {
    lifesCount--;
    lifes.getChildren()[lifesCount].setVisible(false);
    for (let num in cactuses.getChildren()) {
        let x = Math.random() * 300 + 100 + GAME_CONFIG.width;
        cactuses.getChildren()[num].x = x + cactuses.getChildren()[num].body.width / 2;
        cactuses.getChildren()[num].body.x = x;
        canCactusGo = true;
    }
    for (let num in flies.getChildren()) {
        let x = Math.random() * 300 + 100 + GAME_CONFIG.width;
        flies.getChildren()[num].x = x + flies.getChildren()[num].body.width / 2;
        flies.getChildren()[num].body.x = x;
        canFlyGo = false;
    }
}

async function update() {
    if (initStart || gameOver || !player) {
        return;
    }
    let isNewHighScore = false;
    gameOver = lifesCount == 0;
    if (gameOver) {
        gameOverElement = this.add.text(this.cameras.main.centerX,
            this.cameras.main.centerY + actualOffset - 100,
            GAME_OVER_TEXT,
            { fontSize: '48px', fill: '#000' })
            .setOrigin(0.5)
            .setPadding(10);

        if (authenticatedUser) {
            await reward();
            await initPlayer();
        }

        if (canUpdateHighScore && (highScore == null || score > highScore)) {
            highScore = score;
            if (authenticatedUser) {
                isNewHighScore = await handleGameApiPost('/score', {
                    address: authenticatedUser.authData.moralis['address'],
                    highScore: highScore
                })
            } else {
                localStorage.setItem('high-score', highScore);
            }
            highScoreText.setText('Лучший счет: ' + highScore);
        }
        canUpdateHighScore = true;

        regameElement = this.add.text(this.cameras.main.centerX,
            this.cameras.main.centerY + actualOffset + 100,
            REGAME_TEXT,
            { fontSize: '48px', fill: '#F00' })
            .setOrigin(0.5)
            .setPadding(10)
            .setFontStyle('bold')
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', function () {
                score = 0;
                gameOver = false;
                this.scene.restart();
            }, this);

        if (authenticatedUser) {
            buyLifeElement = this.add.text(this.cameras.main.centerX,
                this.cameras.main.centerY + actualOffset,
                BUY_LIFE_TEXT,
                { fontSize: '36px', fill: '#F00' })
                .setOrigin(0.5)
                .setPadding(10)
                .setFontStyle('bold')
                .setInteractive({ useHandCursor: true })
                .on('pointerdown', async function () {
                    const contract = await new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, SIGNER);
                    const buyResult = await contract.buyOneLife({ value: LIFE_COST });
                    if (buyResult) {
                        console.log(buyResult);
                        bought = true;
                        lifes.getChildren()[0].setVisible(true);
                        lifesCount = 1;
                        gameOver = false;
                    } else {
                        alert('Покупка жизни не удалась. Придется перезапустить игру :(')
                        score = 0;
                        this.scene.restart();
                    }
                }, this);
        }

    } else {
        if (bought) {
            bought = false;
            regameElement.setVisible(false);
            gameOverElement.setVisible(false);
            buyLifeElement.setVisible(false);
        }

        time--;
        if (time == 0) {
            score++;
            time = SCORE_PERIOD;

            scoreText.setText('Счет: ' + score);
        }
        if (currentSpeed < MAX_SPEED) {
            currentSpeed = MAX_SPEED;
        }
        else if (currentSpeed > MAX_SPEED) {
            currentSpeed += ACCELERATION / 60;
        }

        if (cursors.up.isDown && player.body.touching.down) {
            player.setVelocityY(JUMP_HEIGHT);
        }

        for (let i in cactuses.getChildren()) {
            if (cactuses.getChildren()[i].body.x < -cactuses.getChildren()[i].width) {
                let newX = Math.random() * 300 + 100 + GAME_CONFIG.width;
                cactuses.getChildren()[i].body.x += newX;
                cactuses.getChildren()[i].x += newX;
            }
        }
        for (let i in flies.getChildren()) {
            if (flies.getChildren()[i].body.x < -flies.getChildren()[i].width) {
                let newX = Math.random() * 300 + 100 + GAME_CONFIG.width;
                flies.getChildren()[i].body.x += newX;
                flies.getChildren()[i].x += newX;
            }
        }

        if (canCactusGo) {
            for (let i in cactuses.getChildren()) {
                cactuses.getChildren()[i].x += currentSpeed;
                cactuses.getChildren()[i].body.x += currentSpeed;
            }
        }

        if (canFlyGo) {
            for (let i in flies.getChildren()) {
                flies.getChildren()[i].x += currentSpeed;
                flies.getChildren()[i].body.x += currentSpeed;
            }
        }

        canFlyGo = score > FLIES_START_APPEREANCE_SCORE &&
            (cactuses.getChildren()[0].x < GAME_CONFIG.width / 2 && flies.getChildren()[0].x > GAME_CONFIG.width
                || flies.getChildren()[0].x < GAME_CONFIG.width);

        canCactusGo = score <= FLIES_START_APPEREANCE_SCORE
            || cactuses.getChildren()[0].x < GAME_CONFIG.width
            || flies.getChildren()[0].x < GAME_CONFIG.width / 2 && cactuses.getChildren()[0].x > GAME_CONFIG.width
            || cactuses.getChildren()[0].x > GAME_CONFIG.width && flies.getChildren()[0].x > GAME_CONFIG.width && !canFlyGo;
    }
}