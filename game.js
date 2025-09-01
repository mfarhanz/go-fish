let dayColors = ['#075359', '#0f0530']; // top and bottom
let nightColors = ['#19014d', '#05010f']; // darker blues
let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight;
let progress = 0; // 0 = day, 1 = night
let direction = 1; // 1 = day→night, -1 = night→day
const duration = 120000; // 2 minutes
let facingLeft = false;
let isDay = false;
let pos = {
    x: screenWidth / 2,
    y: screenHeight / 2
};
let velocity = {
    x: 0,
    y: 0
};
let targetVelocity = {
    x: 0,
    y: 0
};
let fishWidth;
let fishHeight;
let bubbleInterval;
let fishAnimationFrameId;
let fishBlurTimeout;
let velocityInterval;
let reelUpTimeout;
let dropLineTimeout;
const fictionFirstParts = [
    "Cor", "Fin", "Bub", "Mar", "Shel", "Ree", "Tide", "Peb", "Glim", "Whis",
    "Nim", "Blip", "Echo", "Wave", "Drip", "Mist", "Sal", "Aqua", "Gush", "Flo",
    "Dart", "Zin", "Nauti", "Sun", "Ray", "Deep", "Squid", "Kel", "Shad", "Foam",
    "Zep", "Lum", "Vee", "Splo", "Mur", "Twi", "Yin", "Glow", "Zip", "Noo",
    "Creek", "Tumb", "Rill", "Dew", "Vapor", "Swish", "Snub", "Flit", "Puff", "Gill",
    "Brim", "Brook", "Curl", "Fizz", "Snib", "Thal", "Quiv", "Loam", "Brack", "Murk"
];

const fictionSecondParts = [
    "al", "na", "bles", "lin", "ly", "o", "ish", "ette", "bit", "on",
    "drop", "er", "ia", "fin", "tail", "gle", "boo", "zy", "zor", "ean",
    "ish", "el", "ith", "an", "ul", "il", "or", "ous", "ax", "ex",
    "in", "ess", "iff", "oon", "ur", "ev", "ath", "ic", "os", "ix",
    "iff", "een", "ir", "is", "ay", "ash", "ithy", "ixy", "ivy", "une",
    "oth", "yne", "eph", "ald", "isk", "orp", "und", "ell", "osk", "aph"
];

const descriptiveFirstParts = [
    "Slick", "Bright", "Tiny", "Sandy", "Silent", "Briny", "Glow", "Swift", "Jelly",
    "Slippy", "Cloud", "Crabby", "Snappy", "Frosty", "Mossy", "Inky", "Twinkly", "Blue",
    "Lazy", "Rapid", "Curly", "Chubby", "Dizzy", "Wiggly", "Puffy", "Glimmer", "Zesty", "Drifty",
    "Frilly", "Swirly", "Misty", "Shadow", "Greedy", "Lucky", "Odd", "Twitchy", "Noisy", "Loopy",
    "Cauterized", "Voltaic", "Binary", "Explosive", "Redundant", "Neutralizing", "Vengeful", "Tactical",
    "Frigid", "Gritty", "Intense", "Hostile", "Agonized", "Effervescent", "Distilled", "Enigmatic",
    "Irradiated", "Searing", "Punctual", "Oblivious", "Refined", "Slicked", "Cascading", "Overcharged",
    "Rapid-Fire", "Synthetic", "Lucid", "Erratic", "Prime", "Phasebound", "Brutal", "Deranged"
];

const descriptiveSecondParts = [
    "Crab", "Poke", "Bloop", "Bubble", "Kick", "Hug", "Swirl", "Dancer", "Whale", "Shrimp",
    "Sting", "Swoop", "Claw", "Slap", "Slime", "Dart", "Reef", "Rock", "Sinker", "Rider",
    "Diver", "Chomp", "Shimmer", "Snapper", "Stream", "Whisk", "Doodle", "Boop", "Skipper", "Tidal",
    "Gurgle", "Net", "Hook", "Seeker", "Flip", "Bouncer",
    "Torrent", "Breaker", "Specter", "Spire", "Gleam", "Lure", "Crest", "Snare", "Pulse", "Tracer",
    "Vortex", "Howler", "Rift", "Vapor", "Echo", "Flare", "Tremor", "Surge", "Veil", "Harpoon"
];

// Fish stuff
let fish = document.getElementById('fish');
let fishingLine = document.getElementById("fishing-line");
let fishingHook = document.getElementById("fishing-hook");

// Buttons
const playBtn = document.getElementById('play-btn');
const rulesBtn = document.getElementById('rules-btn');
const backBtn = document.getElementById('back-btn');
const goBtn = document.getElementById('go-btn');
const backToSplashBtn = document.getElementById('back-to-splash-btn');
const difficultyButtons = document.querySelectorAll('#difficulty-toggle .toggle-btn-2');
const botToggleBtn = document.getElementById('bot-toggle');
const botNamingToggleBtn = document.getElementById('bot-naming-toggle');
const soundToggleBtn = document.getElementById("sound-toggle-btn");
let menuBtn = document.getElementById('menu-btn');
let closeMenuBtn = document.getElementById('close-menu-btn');
let soundToggleMenuBtn = document.getElementById("toggle-sound");
let infoToggleBtn = document.getElementById("toggle-info");
let quitGameBtn = document.getElementById("quit-game");

// Screens
const startScreen = document.getElementById('start-screen');
const rulesScreen = document.getElementById('rules-screen');
const optionsScreen = document.getElementById('options-screen');
let gameScreen = document.getElementById('game-screen');
let menuPopup = document.getElementById('menu-popup');
let fishingLineContainer = document.getElementById("fishing-line-container");
const botNamingContainer = document.getElementById('bot-naming-style-container');

// Sliders
const playerSlider = document.getElementById('player-slider');

// Labels
const playerCount = document.getElementById('player-count');

// Variables
let PLAYER_VS_AI = true; // default value
let DIFFICULTY = 1; // default value
let PLAYER_COUNT = 4; // default starting value
let PLAYER = 0;
let MEMORIES = {};
let HANDS = {};
let SETS = {};
let PLAYERS_REF = [];
let GAME_OVER = false;
let GAME_START = false;
let SOUND_FX = true;
let SHOW_INFO = true;
let BOT_NAME_STYLE = 0;
let DECK;

function updateGradient(timestampStart) {
    const now = performance.now();
    const elapsed = now - timestampStart;
    progress = Math.min(elapsed / duration, 1);
    // Interpolate each gradient color
    const topColor = interpolateColor(dayColors[0], nightColors[0], progress);
    const bottomColor = interpolateColor(dayColors[1], nightColors[1], progress);

    // Update background
    document.body.style.background = `linear-gradient(to bottom, ${topColor} 0%, ${bottomColor} 100%)`;

    if (progress < 1) {
        requestAnimationFrame(() => updateGradient(timestampStart));
    } else {
        // Once done, flip direction and start reverse transition
        [dayColors, nightColors] = [nightColors, dayColors]; // swap colors
        setTimeout(() => {
            requestAnimationFrame((ts) => updateGradient(performance.now()));
        }, 1000); // optional pause before reversing
    }
}

// Helper to interpolate between two colors in hex format
function interpolateColor(color1, color2, factor) {
    if (arguments.length < 3)
        factor = 0.5;
    const c1 = color1.match(/\w\w/g).map(c => parseInt(c, 16));
    const c2 = color2.match(/\w\w/g).map(c => parseInt(c, 16));
    const result = c1.map((c, i) => Math.round(c + factor * (c2[i] - c)));
    return '#' + result.map(c => c.toString(16).padStart(2, '0')).join('');
}

function toggleDayNight() {
    const dayGradient = "linear-gradient(to bottom, #075359 0%, #0f0530 100%)";
    const nightGradient = "linear-gradient(to bottom, #011c30 0%, #000814 100%)";
    document.body.style.background = isDay ? nightGradient : dayGradient;
    isDay = !isDay;
}

function spawnBubble() {
    const container = document.getElementById('bubble-container');
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');

    // Random size
    const size = Math.random() * 50 + 10; // 10px to 40px
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;

    // Random horizontal position
    const left = Math.random() * 100; // full 0%–100%
    bubble.style.left = `calc(${left}% - ${size / 2}px)`; // center bubble on X

    // Random animation duration and delay
    const duration = Math.random() * 5 + 4; // 4s to 9s
    bubble.style.animationDuration = `${duration}s`;

    // 🌈 Random hue and blur together
    const hue = Math.floor(Math.random() * 360);
    const blur = Math.random() * 3 + 0.5; // blur between 0.5px and 3.5px
    bubble.style.filter = `hue-rotate(${hue}deg) blur(${blur}px)`;

    container.appendChild(bubble);

    // Remove the bubble after it finishes
    setTimeout(() => {
        container.removeChild(bubble);
    }, duration * 1000);
}

function spawnSeagrass() {
    const container = document.getElementById('seagrass-container');
    const numBlades = 100;

    for (let i = 0; i < numBlades; i++) {
        const blade = document.createElement('div');
        blade.classList.add('grass-blade');

        const left = Math.random() * 100;
        const duration = Math.random() * 5 + 5; // 5s to 10s
        const delay = Math.random() * 5;

        const height = Math.random() * 60 + 30; // 60vh to 80vh
        const width = Math.random() * 9 + 6; // 6px to 12px

        blade.style.left = `${left}%`;
        blade.style.height = `${height}vh`;
        blade.style.width = `${width}px`;
        blade.style.animationDuration = `${duration}s`;
        blade.style.animationDelay = `${delay}s`;

        container.appendChild(blade);
    }
}

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomVelocity() {
    // speed between -1.5 and 1.5 px/frame
    return (Math.random() * 3) - 1.5;
}

function updateVelocity() {
    // New random velocity every 2-4 seconds
    targetVelocity.x = randomVelocity();
    targetVelocity.y = randomVelocity();
    if (Math.random() < 0.3) {
        // 30% chance to pause (hover)
        targetVelocity.x = 0;
        targetVelocity.y = 0;
    }
}

// Smoothly approach target velocity
function lerp(a, b, t) {
    return a + (b - a) * t;
}

function animateFish() {
    // Smooth velocity changes
    velocity.x = lerp(velocity.x, targetVelocity.x, 0.05);
    velocity.y = lerp(velocity.y, targetVelocity.y, 0.05);

    // Update position
    pos.x += velocity.x;
    pos.y += velocity.y;

    // Keep fish inside viewport bounds with some padding
    const padding = 50;
    if (pos.x < padding) {
        pos.x = padding;
        velocity.x = Math.abs(velocity.x);
    } else if (pos.x > screenWidth - padding) {
        pos.x = screenWidth - padding;
        velocity.x = -Math.abs(velocity.x);
    }
    if (pos.y < padding) {
        pos.y = padding;
        velocity.y = Math.abs(velocity.y);
    } else if (pos.y > screenHeight - padding) {
        pos.y = screenHeight - padding;
        velocity.y = -Math.abs(velocity.y);
    }

    // Move the fish element
    fish.style.left = `${pos.x}px`;
    fish.style.top = `${pos.y}px`;

    // Flip fish only if direction changed
    if (velocity.x < 0 && facingLeft) {
        fish.style.transform = 'scaleX(1)';
        facingLeft = false;
    } else if (velocity.x > 0 && !facingLeft) {
        fish.style.transform = 'scaleX(-1)';
        facingLeft = true;
    }

    fishAnimationFrameId = requestAnimationFrame(animateFish);
}

function startFishBlurCycle() {
    const blurDuration = 3000; // ms to fully blur/unblur
    const stayBlurred = 4000 + Math.random() * 3000; // how long it stays blurred
    const nextDelay = 10000 + Math.random() * 10000; // time before next blur
    // 🌟 Generate a random width between 160 and 260 (2:1 ratio maintained)
    const aspectRatio = fishWidth / fishHeight;
    const minWidth = fishWidth - 200;
    const maxWidth = fishWidth - 100;
    const randomWidth = Math.floor(Math.random() * (maxWidth - minWidth + 1)) + minWidth;
    // Calculate height to maintain aspect ratio
    const randomHeight = Math.floor(randomWidth / aspectRatio);

    // Blur the fish (simulate swimming away)
    fish.style.filter = 'blur(3px)';
    fish.style.opacity = '0.3';
    fish.style.width = `${randomWidth}px`;
    fish.style.height = `${randomHeight}px`;

    fishBlurTimeout = setTimeout(() => {
        // Return to normal
        fish.style.filter = 'blur(0px)';
        fish.style.opacity = '0.7';
        fish.style.width = `${fishWidth}px`;
        fish.style.height = `${fishHeight}px`;
    }, blurDuration + stayBlurred);

    // Queue up the next cycle
    setTimeout(startFishBlurCycle, nextDelay);
}

function startFishingLineCycle() {
    function reelUp() {
        const totalDuration = 5000; // Total time to reel up
        const steps = 3; // Number of pulls
        const stepDuration = totalDuration / steps;

        let currentStep = 0;
        const initialHeight = fishingLine.offsetHeight;
        const heightPerStep = initialHeight / steps;

        function pullStep() {
            if (currentStep < steps) {
                const newHeight = initialHeight - (heightPerStep * currentStep);
                fishingLine.style.height = `${newHeight}px`;
                currentStep++;
                // Add a bit of randomness to simulate human reeling
                const randomDelay = stepDuration * (0.8 + Math.random() * 0.4);
                setTimeout(pullStep, randomDelay);
            } else {
                fishingLine.style.height = "0px";
                // Hide the hook a bit after it's fully reeled in
                setTimeout(() => {
                    fishingHook.style.opacity = "0";
                }, 3000);
            }
        }

        pullStep();
    }

    function dropLine() {
        // Set a new random X position (e.g., between 10% and 90%)
        const randomX = Math.random() * 80 + 10;
        const randomHeight = Math.random() * (85 - 25) + 25;
        fishingHook.style.left = `${randomX}%`;
        fishingLine.style.left = `${randomX}%`;
        // Reset opacity first (in case hidden)
        fishingHook.style.opacity = "1";
        // Gradually grow the line (and hook follows)
        requestAnimationFrame(() => {
            fishingLine.style.height = `${randomHeight}vh`; // animate to full height
        });
    }

    function cycle() {
        const timeBeforeReelUp = Math.random() * 11000 + 7000; // 7s–18s random wait
        const timeBeforeDrop = Math.random() * 7000 + 14000; // 14s delay after reeling up

        reelUpTimeout = setTimeout(() => {
            reelUp();

            dropLineTimeout = setTimeout(() => {
                dropLine();
                // Repeat
                cycle();
            }, timeBeforeDrop); // Delay before dropping again (1.5s)
        }, timeBeforeReelUp);
    }

    cycle();
}

// Update screen dimensions on resize
window.addEventListener('resize', () => {
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
});

function fadeSwitch(hideEl, showEl) {
    // Add 'fade' class if not present
    hideEl.classList.add('fade');
    showEl.classList.add('fade');

    // Fade out the current element
    hideEl.classList.add('hidden');

    // After fade out completes
    setTimeout(() => {
        hideEl.style.display = 'none';

        // Show the new screen and fade it in
        showEl.style.display = 'block';

        // Force reflow so opacity transition triggers
        void showEl.offsetWidth;

        showEl.classList.remove('hidden');
    }, 400); // Matches the CSS transition time (0.4s)
}

function onClickPlayer(event) {
    if (!GAME_START)
        return;
    const avatar = event.currentTarget;
	 console.log(PLAYERS_REF[avatar.avatarId]);
    // console.log(`Avatar clicked: ID = ${avatar.avatarId}`);
}

function generateRandomName() {
    if (BOT_NAME_STYLE == 0) {
        const first = fictionFirstParts; // from your first scheme
        const second = fictionSecondParts;
        return getRandomItem(first) + getRandomItem(second);
    } else {
        const first = descriptiveFirstParts; // from your second scheme
        const second = descriptiveSecondParts;
        return getRandomItem(first) + getRandomItem(second);
    }
}

function renderPlayers() {
    const positions = [];
    const namePositions = [];

    const playerContainer = document.createElement("div");
    playerContainer.id = "player-container";

    const isHumanPlayer = PLAYER_VS_AI;

    // === POSITION LOGIC ===
    const total = PLAYER_COUNT;
    let index = 0;

    const nPos = { // preset naming positioning styles
        l: {
            top: "58%",
            left: "4%",
            right: "auto",
            bottom: "auto"
        }, // LEFT
        r: {
            top: "58%",
            left: "auto",
            right: "6%",
            bottom: "auto"
        }, // RIGHT
        tl: {
            top: "20%",
            left: "20%",
            right: "auto",
            bottom: "auto"
        }, // TOP LEFT
        tr: {
            top: "20%",
            left: "auto",
            right: "23%",
            bottom: "auto"
        }, // TOP RIGHT
        bl: {
            top: "auto",
            left: "20%",
            right: "auto",
            bottom: "5%"
        }, // BOTTOM LEFT
        br: {
            top: "auto",
            left: "auto",
            right: "23%",
            bottom: "5%"
        }, // BOTTOM RIGHT
        t: {
            top: "20%",
            left: "46%",
            right: "auto",
            bottom: "auto"
        }, // TOP
        b: {
            top: "auto",
            left: "46%",
            right: "auto",
            bottom: "4%"
        } // BOTTOM
    };

    const aPos = { // preset avatar positioning styles
        l: {
            top: "50%",
            left: "5%",
            transform: "translateY(-50%)"
        },
        r: {
            top: "50%",
            right: "5%",
            transform: "translateY(-50%)"
        },
        tl: {
            top: "5%",
            left: "25%",
            transform: "translateX(-50%)"
        },
        tr: {
            top: "5%",
            right: "25%",
            transform: "translateX(50%)"
        },
        bl: {
            bottom: "10%",
            left: "25%",
            transform: "translateX(-50%)"
        },
        br: {
            bottom: "10%",
            right: "25%",
            transform: "translateX(50%)"
        },
        t: {
            top: "5%",
            left: "50%",
            transform: "translateX(-50%)"
        },
        b: {
            bottom: "10%",
            left: "50%",
            transform: "translateX(-50%)"
        },
    };

    if (total === 2) {
        if (isHumanPlayer) {
            positions.push(aPos.t); // Other player
            namePositions.push(nPos.t);
        } else {
            positions.push(aPos.l, aPos.r);
            namePositions.push(nPos.l, nPos.r);
        }
    } else if (total === 3) {
        if (!isHumanPlayer) {
            positions.push(aPos.t);
            namePositions.push(nPos.t);
        }
        positions.push(aPos.r, aPos.l);
        namePositions.push(nPos.r, nPos.l);
    } else if (total === 4) {
        if (!isHumanPlayer) {
            positions.push(aPos.b);
            namePositions.push(nPos.b);
        }
        positions.push(aPos.l, aPos.t, aPos.r);
        namePositions.push(nPos.l, nPos.t, nPos.r);
    } else if (total === 5) {
        if (!isHumanPlayer) {
            positions.push(aPos.b);
            namePositions.push(nPos.b);
        }
        positions.push(aPos.l, aPos.tl, aPos.tr, aPos.r);
        namePositions.push(nPos.l, nPos.tl, nPos.tr, nPos.r);
    } else if (total === 6) {
        if (!isHumanPlayer) {
            positions.push(aPos.br);
            namePositions.push(nPos.br);
        }
        positions.push(aPos.bl, aPos.l, aPos.tl, aPos.tr, aPos.r);
        namePositions.push(nPos.bl, nPos.l, nPos.tl, nPos.tr, nPos.r);
    }

    if (PLAYER_VS_AI) {
        PLAYERS_REF.push(null); // Index 0 is null if there's a human player
    }

    // === CREATE PLAYER ELEMENTS ===
    for (let i = 0; i < positions.length; i++) {
        const avatarImg = document.createElement("img");
        avatarImg.classList.add("player-avatar");

        // Pick a random avatar
        const avatarNumber = Math.floor(Math.random() * 20) + 1; // 1 to 20
        const avatar = `./assets/avatars/av${avatarNumber}.png`;
        avatarImg.src = avatar;
        avatarImg.alt = `Player ${i}`;

        // Assign ID
        const id = PLAYER_VS_AI ? i + 1 : i;
        avatarImg.dataset.id = id; // Optional for HTML-side use
        avatarImg.avatarId = id; // JS-side custom property

        // Apply positioning
        const style = positions[i];
        Object.assign(avatarImg.style, style);

        // Generate a random color
        const hue = Math.floor(Math.random() * 360);
        const borderColor = `hsl(${hue}, 100%, 60%)`;
        const shadowColor = `hsla(${hue}, 100%, 60%, 0.7)`;
        // Apply border and shadow
        avatarImg.style.border = `3px solid ${borderColor}`;
        avatarImg.style.boxShadow = `0 0 30px ${shadowColor}`;

        // Add click event listener
        avatarImg.addEventListener("click", onClickPlayer);

        playerContainer.appendChild(avatarImg);
        PLAYERS_REF.push(avatarImg);

        // === Add name label ===
        const nameLabel = document.createElement("div");
        nameLabel.classList.add("player-name");
        nameLabel.textContent = generateRandomName();

        // Apply the specific label positioning (only up to 6 positions)
        Object.assign(nameLabel.style, namePositions[i] || {});

        playerContainer.appendChild(nameLabel);
    }

    gameScreen.appendChild(playerContainer);
}

function renderCardDeck() {
    const cardDeckContainer = document.createElement("div");
    cardDeckContainer.id = "card-deck-container";

    // Choose a card back design randomly or set one explicitly
    const backDesign = `./assets/cards/designs/back${Math.floor(Math.random() * 4) + 1}.png`;

    for (let i = 0; i < 52; i++) {
        const card = document.createElement("img");
        card.src = backDesign;
        card.classList.add("card-back");

        // Slight random rotation
        const range = Math.floor(Math.random() * (20 - 4 + 1)) + 4; // Random number between 4 and 20
        const rotation = (Math.random() * range - range / 2).toFixed(10);

        // Slight z-index offset so cards stack without full overlap
        card.style.transform = `rotate(${rotation}deg)`;
        card.style.zIndex = i;

        cardDeckContainer.appendChild(card);
    }

    gameScreen.appendChild(cardDeckContainer);
}

function setupGameScreen() {
    // Create game screen from template
    gameScreen = document.createElement("div");
    gameScreen.id = "game-screen";
    gameScreen.style.display = "none";
    // gameScreen.style.opacity = 0;
    gameScreen.innerHTML = `
     <button id="menu-btn" class="glow-btn menu-icon">☰</button>
     <div id="menu-popup" style="display: none;">
       <button id="close-menu-btn" class="glow-btn close-btn">✖</button>
       <div class="menu-content">
         <button class="glow-btn menu-option" id="toggle-sound">Sounds: ${SOUND_FX ? "On" : "Off"}</button>
         <button class="glow-btn menu-option" id="toggle-info">Show Info: ${SHOW_INFO ? "On" : "Off"}</button>
         <button class="glow-btn menu-option" id="quit-game">Quit Game</button>
       </div>
     </div>
   `;

    renderPlayers();
    renderCardDeck();

    document.body.appendChild(gameScreen);
    // Add event listeners
    menuBtn = document.getElementById("menu-btn");
    menuPopup = document.getElementById("menu-popup");
    closeMenuBtn = document.getElementById("close-menu-btn");
    soundToggleMenuBtn = document.getElementById("toggle-sound");
    infoToggleBtn = document.getElementById("toggle-info");
    quitGameBtn = document.getElementById("quit-game");

    setTimeout(() => {
        const startGameBtn = document.createElement("div");
        startGameBtn.id = "start-game-btn";
        startGameBtn.textContent = "Start Game";
        startGameBtn.classList.add("title");
        gameScreen.appendChild(startGameBtn);

        // Delay the class change by a tick so transition can apply
        requestAnimationFrame(() => {
            startGameBtn.classList.add("fade-in");
        });

        startGameBtn.addEventListener("click", () => {
            startGameBtn.classList.remove("fade-in");
            startGameBtn.classList.add("fade-out");
            GAME_START = true;
            // Wait for fade-out animation to complete before removing
            setTimeout(() => {
                startGameBtn.remove(); // Remove from DOM itself
            }, 500);
            // (Optional) Start the game logic here later
        });
    }, 1000); // Show after 1 second


    menuBtn.addEventListener('click', () => {
        menuPopup.style.display = 'block';
        menuPopup.style.opacity = '0';
        menuBtn.classList.add('menu-open'); // Apply glow
        requestAnimationFrame(() => {
            menuPopup.style.opacity = '1';
        });
    });

    closeMenuBtn.addEventListener('click', () => {
        menuPopup.style.opacity = '0';
        menuPopup.addEventListener('transitionend', () => {
            menuPopup.style.display = 'none';
            menuBtn.classList.remove('menu-open'); // Remove glow
        }, {
            once: true
        });
    });

    // --- Sounds toggle ---
    soundToggleMenuBtn.addEventListener("click", () => {
        SOUND_FX = !SOUND_FX;
        soundToggleMenuBtn.textContent = `Sounds: ${SOUND_FX ? "On" : "Off"}`;
    });

    // --- Info toggle ---
    infoToggleBtn.addEventListener("click", () => {
        SHOW_INFO = !SHOW_INFO;
        infoToggleBtn.textContent = `Show Info: ${SHOW_INFO ? "On" : "Off"}`;
    });

    // --- Quit game ---
    quitGameBtn.addEventListener("click", () => {
        // Fade out game screen
        gameScreen.classList.remove("active");
        gameScreen.style.opacity = 0;

        // Stop bubbles
        if (bubbleInterval) {
            clearInterval(bubbleInterval);
            bubbleInterval = null;
        }

        // Hide menu popup
        menuPopup.classList.remove("active");
		  
		  // Clearing game counters/trackers/flags
			Object.keys(MEMORIES).forEach(key => delete MEMORIES[key]);
			Object.keys(HANDS).forEach(key => delete HANDS[key]);
			Object.keys(SETS).forEach(key => delete SETS[key]);
			PLAYERS_REF.length = 0;
			GAME_START = false;
			PLAYER = 0;

        // After transition, hide game-screen and show splash
        setTimeout(() => {
            gameScreen.remove();
            startScreen.style.display = "block";
            startScreen.style.opacity = 1;

            // Respawn fish
            const existingFish = document.getElementById("fish");
            if (existingFish) {
                existingFish.remove();
            }
            const fishNumber = Math.floor(Math.random() * 15) + 1;
            fish = document.createElement("div");
            fish.id = "fish";
            fish.style.background = `url('./assets/fish/fish${fishNumber}.png') no-repeat center/contain`;
            // Custom sizes for specific fishes
            switch (fishNumber) {
            case 8:
                fishWidth = 272;
                fishHeight = 162;
                break;
            case 9:
                fishWidth = 600;
                fishHeight = 201;
                break;
            case 10:
                fishWidth = 727;
                fishHeight = 220;
                break;
            case 12:
                fishWidth = 400;
                fishHeight = 400;
                break;
            case 13:
                fishWidth = 848;
                fishHeight = 423;
                break;
            default:
                fishWidth = 360;
                fishHeight = 180;
                break;
            }
            fish.style.width = `${fishWidth}px`;
            fish.style.height = `${fishHeight}px`;
            document.body.appendChild(fish);
            // 🔁 Re-apply its functionality
            updateVelocity(); // Give it an initial movement vector
            velocityInterval = setInterval(updateVelocity, 2500); // Change direction periodically
            animateFish(); // Start animation loop
            setTimeout(startFishBlurCycle, 8000); // Resume blur/zoom cycle

            // Respawn fishing line and hook
            // 🧹 Clean up any existing fishing line/hook
            const existingLineContainer = document.getElementById("fishing-line-container");
            if (existingLineContainer) {
                existingLineContainer.remove();
            }
            fishingLineContainer = document.createElement("div");
            fishingLineContainer.id = "fishing-line-container";
            fishingLine = document.createElement("div");
            fishingLine.id = "fishing-line";
            fishingHook = document.createElement("div");
            fishingHook.id = "fishing-hook";
            fishingLine.appendChild(fishingHook);
            fishingLineContainer.appendChild(fishingLine);
            document.body.appendChild(fishingLineContainer);
            // Restart fishing line cycle
            startFishingLineCycle();

            // Restart bubbles
            bubbleInterval = setInterval(spawnBubble, 500);
        }, 500);
    });
}

// Begin background gradient transition after 1s delay
setTimeout(() => {
    requestAnimationFrame((ts) => updateGradient(performance.now()));
}, 1000);
spawnSeagrass(); // Call once when game loads
bubbleInterval = setInterval(spawnBubble, 500); // Spawn one bubble every 0.5s (adjust as needed)
updateVelocity();
velocityInterval = setInterval(updateVelocity, 2500);
animateFish();
setTimeout(startFishBlurCycle, 8000); // Start the cycle once after initial delay
startFishingLineCycle();

document.addEventListener('click', (event) => {
    const isBackgroundClick = !event.target.closest('#start-screen');
    if (!isBackgroundClick)
        return;
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // Calculate direction from fish to mouse
    const dx = mouseX - pos.x;
    const dy = mouseY - pos.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    // Normalize and scale
    const speed = 2; // pixels per frame — tweak as needed
    const vx = (dx / distance) * speed;
    const vy = (dy / distance) * speed;

    // Set temporary target velocity toward mouse
    targetVelocity.x = vx;
    targetVelocity.y = vy;

    // After a few seconds, let it go back to random wandering
    setTimeout(updateVelocity, 3000);
});

// Show Rules
rulesBtn.addEventListener('click', () => {
    fadeSwitch(startScreen, rulesScreen);
});

// Go Back to Splash
backBtn.addEventListener('click', () => {
    fadeSwitch(rulesScreen, startScreen);
});

// Show Match Options
playBtn.addEventListener('click', () => {
    fadeSwitch(startScreen, optionsScreen);
});

// Back from Match Options
backToSplashBtn.addEventListener('click', () => {
    fadeSwitch(optionsScreen, startScreen);
});

// Player slider update
playerSlider.addEventListener('input', () => {
    PLAYER_COUNT = parseInt(playerSlider.value);
    playerCount.textContent = playerSlider.value;
});

difficultyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        difficultyButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const selectedDifficulty = btn.textContent.trim();
        if (selectedDifficulty === "Easy") {
            DIFFICULTY = 0;
        } else if (selectedDifficulty === "Medium") {
            DIFFICULTY = 1;
        } else if (selectedDifficulty === "Hard") {
            DIFFICULTY = 2;
        }
    });
});

botToggleBtn.addEventListener('click', () => {
    PLAYER_VS_AI = !PLAYER_VS_AI;
    botToggleBtn.textContent = PLAYER_VS_AI ? 'Yes' : 'No';
    botToggleBtn.classList.toggle('false', !PLAYER_VS_AI);
});

botNamingToggleBtn.addEventListener("click", (e) => {
    const classic = botNamingToggleBtn.querySelector(".classic-label");
    const descriptive = botNamingToggleBtn.querySelector(".descriptive-label");

    // Check where user clicked
    const clickedDescriptive = e.target.classList.contains("descriptive-label");
    const clickedClassic = e.target.classList.contains("classic-label");

    if (!clickedDescriptive && !clickedClassic)
        return; // Ignore empty clicks

    if (clickedDescriptive && BOT_NAME_STYLE !== 1) {
        BOT_NAME_STYLE = 1;
        classic.classList.remove("active");
        descriptive.classList.add("active");
    } else if (clickedClassic && BOT_NAME_STYLE !== 0) {
        BOT_NAME_STYLE = 0;
        descriptive.classList.remove("active");
        classic.classList.add("active");
    }
});

soundToggleBtn.addEventListener("click", () => {
    SOUND_FX = !SOUND_FX;
    const iconPath = SOUND_FX
         ? "./assets/misc/speaker.png"
         : "./assets/misc/speakeroff.png";
    soundToggleBtn.style.backgroundImage = `url('${iconPath}')`;
});

goBtn.addEventListener('click', () => {
    // Stop spawning new bubbles
    clearInterval(bubbleInterval);
    // Remove the fish from view
    if (fish) {
        // Start fading out
        fish.style.opacity = '0';

        // Wait for the transition to complete, then remove
        fish.addEventListener('transitionend', () => {
            if (fish && fish.parentNode) {
                fish.remove();
            }

            if (fishingLineContainer && fishingLineContainer.parentNode) {
                fishingLineContainer.remove();
            }
        }, {
            once: true
        }); // ensures it runs only once

        // Stop fish updates
        cancelAnimationFrame(fishAnimationFrameId);
        clearInterval(velocityInterval);
        clearTimeout(fishBlurTimeout);
        clearTimeout(reelUpTimeout);
        clearTimeout(dropLineTimeout);

    }
    const oldGameScreen = document.getElementById("game-screen");
    if (oldGameScreen)
        oldGameScreen.remove();
    setupGameScreen();
    // Fade out current widgets
    fadeSwitch(optionsScreen, gameScreen);
});
