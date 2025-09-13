let mouseX = 0, mouseY = 0;
let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight;
let mouseHoldIntervalId = null;

let gradientUpdateCtr = 0; // 0 = day, 1 = night
const GRADIENT_UPDATE_DURATION = 120000; // 2 minutes
let dayGradientColors = ['#075359', '#0f0530']; // top and bottom
let nightGradientColors = ['#19014d', '#05010f']; // darker blues

let isDay = false;
let isMouseDown = false;
let isFishFacingLeft = false;

let fishWidth;
let fishHeight;
let bubbleIntervalId;
let velocityIntervalId;
let fishAnimationFrameId;
let fishCycleController;
let fishingCycleController;
let fishPosition = {
    x: screenWidth / 2,
    y: screenHeight / 2
};
let fishVelocity = {
    x: 0,
    y: 0
};
let targetFishVelocity = {
    x: 0,
    y: 0
};

let cardBackDesignSrc;
const SUITS = ['C', 'D', 'H', 'S'];
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const NAMING_IMAGINARY_FIRST_PTS = [
    "Cor", "Fin", "Bub", "Mar", "Shel", "Ree", "Tide", "Peb", "Glim", "Whis",
    "Nim", "Blip", "Echo", "Wave", "Drip", "Mist", "Sal", "Aqua", "Gush", "Flo",
    "Dart", "Zin", "Nauti", "Sun", "Ray", "Deep", "Squid", "Kel", "Shad", "Foam",
    "Zep", "Lum", "Vee", "Splo", "Mur", "Twi", "Yin", "Glow", "Zip", "Noo",
    "Creek", "Tumb", "Rill", "Dew", "Vapor", "Swish", "Snub", "Flit", "Puff", "Gill",
    "Brim", "Brook", "Curl", "Fizz", "Snib", "Thal", "Quiv", "Loam", "Brack", "Murk"
];

const NAMING_IMAGINARY_SECOND_PTS = [
    "al", "na", "bles", "lin", "ly", "o", "ish", "ette", "bit", "on",
    "drop", "er", "ia", "fin", "tail", "gle", "boo", "zy", "zor", "ean",
    "ish", "el", "ith", "an", "ul", "il", "or", "ous", "ax", "ex",
    "in", "ess", "iff", "oon", "ur", "ev", "ath", "ic", "os", "ix",
    "iff", "een", "ir", "is", "ay", "ash", "ithy", "ixy", "ivy", "une",
    "oth", "yne", "eph", "ald", "isk", "orp", "und", "ell", "osk", "aph"
];

const NAMING_DESCRIPTIVE_FIRST_PTS = [
    "Slick", "Bright", "Tiny", "Sandy", "Silent", "Briny", "Glow", "Swift", "Jelly",
    "Slippy", "Cloud", "Crabby", "Snappy", "Frosty", "Mossy", "Inky", "Twinkly", "Blue",
    "Lazy", "Rapid", "Curly", "Chubby", "Dizzy", "Wiggly", "Puffy", "Glimmer", "Zesty", "Drifty",
    "Frilly", "Swirly", "Misty", "Shadow", "Greedy", "Lucky", "Odd", "Twitchy", "Noisy", "Loopy",
    "Cauterized", "Voltaic", "Binary", "Explosive", "Redundant", "Neutralizing", "Vengeful", "Tactical",
    "Frigid", "Gritty", "Intense", "Hostile", "Agonized", "Effervescent", "Distilled", "Enigmatic",
    "Irradiated", "Searing", "Punctual", "Oblivious", "Refined", "Slicked", "Cascading", "Overcharged",
    "Rapid-Fire", "Synthetic", "Lucid", "Erratic", "Prime", "Phasebound", "Brutal", "Deranged"
];

const NAMING_DESCRIPTIVE_SECOND_PTS = [
    "Crab", "Poke", "Bloop", "Bubble", "Kick", "Hug", "Swirl", "Dancer", "Whale", "Shrimp",
    "Sting", "Swoop", "Claw", "Slap", "Slime", "Dart", "Reef", "Rock", "Sinker", "Rider",
    "Diver", "Chomp", "Shimmer", "Snapper", "Stream", "Whisk", "Doodle", "Boop", "Skipper", "Tidal",
    "Gurgle", "Net", "Hook", "Seeker", "Flip", "Bouncer",
    "Torrent", "Breaker", "Specter", "Spire", "Gleam", "Lure", "Crest", "Snare", "Pulse", "Tracer",
    "Vortex", "Howler", "Rift", "Vapor", "Echo", "Flare", "Tremor", "Surge", "Veil", "Harpoon"
];

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
	 
// DOM References
let fish = document.getElementById('fish');
let fishingLine = document.getElementById("fishing-line");
let fishingHook = document.getElementById("fishing-hook");

// Buttons
const playBtn = document.getElementById('play-btn');
const rulesBtn = document.getElementById('rules-btn');
const rulesToSplashBtn = document.getElementById('rules-to-splash');
const goBtn = document.getElementById('go-btn');
const optionsToSplashBtn = document.getElementById('options-to-splash');
const difficultyBtns = document.querySelectorAll('#difficulty-toggle .toggle-btn');
const botToggleBtn = document.getElementById('bot-toggle');
const botNamingToggleBtn = document.getElementById('bot-naming-toggle');
const soundToggleBtn = document.getElementById("sound-toggle-btn");
let menuBtn = document.getElementById('menu-btn');
let closeMenuBtn = document.getElementById('close-menu-btn');
let soundToggleMenuBtn = document.getElementById("toggle-sound");
let oppInfoToggleMenuBtn = document.getElementById("toggle-opp-info");
let matchLogsToggleMenuBtn = document.getElementById("toggle-log");
let quitGameMenuBtn = document.getElementById("quit-game");
let askPlayerBtn;

// Screens/Containers
const startScreen = document.getElementById('start-screen');
const rulesScreen = document.getElementById('rules-screen');
const optionsScreen = document.getElementById('options-screen');
let gameScreen = document.getElementById('game-screen');
let menuSubwindow = document.getElementById('menu-subwindow');
const botToggleContainer = document.getElementById('bot-toggle-row');
let fishingLineContainer = document.getElementById("fishing-line-container");
const botNamingContainer = document.getElementById('bot-naming-container');
let cardDeckContainer;

// Sliders
const playerSlider = document.getElementById('player-slider');

// Labels
const playerCount = document.getElementById('player-count');

// Inputs
const playerNameInput = document.getElementById('player-name-input');

// Variables
let gameOver = false;
let gameStart = false;
let gamePaused = false;
let gameQuitted = false;
let soundFx = true;
let playerVsAI = true;
let showOpponentInfo = false;
let logMode = false;
let userIsAsking = false;
let PLAYER = 0;
let DIFFICULTY = 1;
let PLAYER_COUNT = 4; // default starting value
let botNamingStyle = 0;
let currentGameSessionId = 1;
let MEMORIES = {};
let HANDS = {};
let SETS = {};
let DECK = [];
let DECK_REF = [];
let HANDS_REF = [];
let PLAYERS_REF = [];
let PLAYER_LABELS_REF = [];
let userChosenRank;
let userChosenPlayer;
let infoFontStyle = 'color: blue;';
let successFontStyle = 'color: green;';
let logFontStyle = 'color: gray; font-style: italic;';

function updateGradient(timestampStart) {
    const now = performance.now();
    const elapsed = now - timestampStart;
    gradientUpdateCtr = Math.min(elapsed / GRADIENT_UPDATE_DURATION, 1);
    // Interpolate each gradient color
    const topColor = interpolateColor(dayGradientColors[0], nightGradientColors[0], gradientUpdateCtr);
    const bottomColor = interpolateColor(dayGradientColors[1], nightGradientColors[1], gradientUpdateCtr);

    // Update background
    document.body.style.background = `linear-gradient(to bottom, ${topColor} 0%, ${bottomColor} 100%)`;

    if (gradientUpdateCtr < 1) {
        requestAnimationFrame(() => updateGradient(timestampStart));
    } else {
        // Once done, flip direction and start reverse transition
        [dayGradientColors, nightGradientColors] = [nightGradientColors, dayGradientColors]; // swap colors
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

function choice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function delayAbortable(ms, signal) {
    return new Promise((resolve, reject) => {
        if (signal?.aborted) {
            return reject(new DOMException('Aborted', 'AbortError'));
        }

        const timeoutId = setTimeout(resolve, ms);

        if (signal) {
            signal.addEventListener('abort', () => {
                clearTimeout(timeoutId);
                reject(new DOMException('Aborted', 'AbortError'));
            }, {
                once: true
            });
        }
    });
}

function randomVelocity() {
    // speed between -1.5 and 1.5 px/frame
    return (Math.random() * 3) - 1.5;
}

function updateVelocity() {
    // New random velocity every 2-4 seconds
    targetFishVelocity.x = randomVelocity();
    targetFishVelocity.y = randomVelocity();
    if (Math.random() < 0.3) {
        // 30% chance to pause (hover)
        targetFishVelocity.x = 0;
        targetFishVelocity.y = 0;
    }
}

// Smoothly approach target velocity
function lerp(a, b, t) {
    return a + (b - a) * t;
}

function desc(a, b) {
    return b - a;
}

function animateFish() {
    // Smooth velocity changes
    fishVelocity.x = lerp(fishVelocity.x, targetFishVelocity.x, 0.05);
    fishVelocity.y = lerp(fishVelocity.y, targetFishVelocity.y, 0.05);

    // Update position
    fishPosition.x += fishVelocity.x;
    fishPosition.y += fishVelocity.y;

    // Keep fish inside viewport bounds with some padding
    const padding = 50;
    if (fishPosition.x < padding) {
        fishPosition.x = padding;
        fishVelocity.x = Math.abs(fishVelocity.x);
    } else if (fishPosition.x > screenWidth - padding) {
        fishPosition.x = screenWidth - padding;
        fishVelocity.x = -Math.abs(fishVelocity.x);
    }
    if (fishPosition.y < padding) {
        fishPosition.y = padding;
        fishVelocity.y = Math.abs(fishVelocity.y);
    } else if (fishPosition.y > screenHeight - padding) {
        fishPosition.y = screenHeight - padding;
        fishVelocity.y = -Math.abs(fishVelocity.y);
    }

    // Move the fish element
    fish.style.left = `${fishPosition.x}px`;
    fish.style.top = `${fishPosition.y}px`;

    // Flip fish only if direction changed
    if (fishVelocity.x < 0 && isFishFacingLeft) {
        fish.style.transform = 'scaleX(1)';
        isFishFacingLeft = false;
    } else if (fishVelocity.x > 0 && !isFishFacingLeft) {
        fish.style.transform = 'scaleX(-1)';
        isFishFacingLeft = true;
    }

    fishAnimationFrameId = requestAnimationFrame(animateFish);
}

function startFishBlurCycle() {
    const controller = new AbortController();
    const {
        signal
    } = controller;

    (async() => {
        try {
            while (true) {
                const blurDuration = 3000;
                const stayBlurred = 4000 + Math.random() * 3000;
                const nextDelay = 10000 + Math.random() * 10000;

                const aspectRatio = fishWidth / fishHeight;
                const minWidth = fishWidth - 200;
                const maxWidth = fishWidth - 100;
                const randomWidth = Math.floor(Math.random() * (maxWidth - minWidth + 1)) + minWidth;
                const randomHeight = Math.floor(randomWidth / aspectRatio);

                fish.style.filter = 'blur(3px)';
                fish.style.opacity = '0.3';
                fish.style.width = `${randomWidth}px`;
                fish.style.height = `${randomHeight}px`;

                await delayAbortable(blurDuration + stayBlurred, signal);

                fish.style.filter = 'blur(0px)';
                fish.style.opacity = '0.7';
                fish.style.width = `${fishWidth}px`;
                fish.style.height = `${fishHeight}px`;

                await delayAbortable(nextDelay, signal);
            }
        } catch (err) {
            if (err.name !== 'AbortError') {
                throw err;
                // Optional cleanup here
            }
        }
    })();

    return controller;
}

function startFishingLineCycle() {
    const controller = new AbortController();
    const {
        signal
    } = controller;

    async function reelUp() {
        const totalDuration = 5000;
        const steps = 3;
        const stepDuration = totalDuration / steps;

        const initialHeight = fishingLine.offsetHeight;
        const heightPerStep = initialHeight / steps;

        for (let i = 0; i < steps; i++) {
            const newHeight = initialHeight - (heightPerStep * i);
            fishingLine.style.height = `${newHeight}px`;

            const randomDelay = stepDuration * (0.8 + Math.random() * 0.4);
            await delay(randomDelay);
        }

        fishingLine.style.height = "0px";

        // Wait a bit before hiding the hook
        await delay(3000);
        fishingHook.style.opacity = "0";
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

    async function cycle(signal) {
        try {
            while (true) {
                const timeBeforeReelUp = Math.random() * 11000 + 7000;
                const timeBeforeDrop = Math.random() * 7000 + 14000;

                await delayAbortable(timeBeforeReelUp, signal);
                await reelUp();

                await delayAbortable(timeBeforeDrop, signal);
                await dropLine();
            }
        } catch (err) {
            if (err.name !== 'AbortError') {
                throw err;
            }
        }
    }

    cycle(signal);

    // Return controller so caller can abort when needed
    return controller;
}

function fadedScreenSwitch(current, target) {
    // Add 'fade' class if not present
    current.classList.add('screen-fade-in');
    target.classList.add('screen-fade-in');

    // Fade out the current element
    current.classList.add('screen-fade-out');

    // After fade out completes
    setTimeout(() => {
        current.style.display = 'none';

        // Show the new screen and fade it in
        target.style.display = 'block';

        // Force reflow so opacity transition triggers
        void target.offsetWidth;

        target.classList.remove('screen-fade-out');
    }, 400); // Matches the CSS transition time (0.4s)
}

function logMessage(...args) {
    if (logMode) {
        console.log(...args);
    }
}

function debounce(fn, delay = 500) {
    let inDebounce = false;
    return function (...args) {
        if (inDebounce)
            return;
        inDebounce = true;
        fn.apply(this, args);
        setTimeout(() => inDebounce = false, delay);
    };
}

/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function initStateBuffers(n) {
    for (let i = 0; i < n; i++) {
        // Only create memories if AI players exist or multiple players
        if (!playerVsAI || i !== 0) {
            MEMORIES[i] = {};
            for (let j = 0; j < n; j++) {
                if (j !== i) {
                    MEMORIES[i][j] = new Set(); // JS version of set
                }
            }
        }
        SETS[i] = [];
    }
}

function getMostNeededCards(player = null) {
    /**
     * Get the set of card ranks that the current player (PLAYER) believes they need the most,
     * based on the type of cards they have the fewest of.
     *
     * @return {string[]} - Array of ranks
     */
    const counter = {};

    for (const card of HANDS[player !== null ? player : PLAYER]) {
        // Extract the rank — handles '10' specifically
        const rank = card[1] !== '0' ? card[0] : '10';

        if (counter[rank]) {
            counter[rank]++;
        } else {
            counter[rank] = 1;
        }
    }

    const minCount = Math.min(...Object.values(counter));
    const fewestCardsByRank = Object.keys(counter).filter(rank => counter[rank] === minCount);

    return fewestCardsByRank;
}

/**
 * Checks if a player's hand is empty. If it is, give them up to four cards from the deck (if available).
 * Supports a single player ID or an array of player IDs.
 *
 * @param {number|number[]} player - The player ID or array of player IDs.
 */
async function checkIfEmptyHand(player) {
    if (HANDS[player] && HANDS[player].length === 0) {
        const n = Math.min(4, DECK.length);
        const cond = playerVsAI && player === 0;
        if (n === 0)
            return;
        logMessage(`${PLAYERS_REF[player].playerName} takes ${n} cards from the top of the deck since their hand is empty.`);
        for (let i = 0; i < n; i++) {
            await takeCardFromDeck(player);
        }
    }
}

async function deleteVisualCard(playerId, indices) {
    if (playerId === undefined || !Array.isArray(indices) || indices.length === 0)
        return;

    // Sort in descending order to avoid index shift while splicing
    const sortedIndices = [...indices].sort(desc);

    for (const index of sortedIndices) {
        const card = HANDS_REF[playerId][index];
        if (!card)
            continue;

        // Animate the card getting deleted
        card.classList.add('card-remove');
        // card.style.transition = "opacity 0.3s ease, transform 0.3s ease";
        // card.style.opacity = 0;
        // card.style.transform = "scale(0.3) rotate(-30deg) translateY(-50px)";

        // Remove from DOM after animation
        card.addEventListener("transitionend", () => {
            card.remove();
        }, {
            once: true
        });

        // Remove from HANDS_REF
        HANDS_REF[playerId].splice(index, 1);
    }

    // Re-fan the remaining hand
    positionPlayerHand(playerId);
}

/**
 * Check and create any sets (four cards of the same rank) for the current player (PLAYER) if possible.
 * Updates the global SETS object.
 */
async function checkForSets() {
    const index = {};
    const toRemove = [];
    const removedRanks = [];

    HANDS[PLAYER].forEach((card, i) => {
        const rank = card.split('of')[0];
        if (!index[rank]) {
            index[rank] = [i];
        } else {
            index[rank].push(i);
        }
    });
    for (const rank in index) {
        const places = index[rank];
        if (places.length >= 4) {
            const setIndices = places.slice(0, 4);
            toRemove.push(...setIndices); // Collect all for later

            if (!SETS[PLAYER])
                SETS[PLAYER] = [];
            SETS[PLAYER].push(rank);
            removedRanks.push(rank);
            showFloatingText(PLAYER, "+SET!");
            await delay(300);
            const name = playerVsAI && PLAYER === 0 ? "You" : `Player${PLAYER}`;
            highlightSuccess(`${name} made a set of ${rank}s!`);
        }
    }
    // Nothing to remove?
    if (toRemove.length === 0)
        return;

    // Sort descending to avoid index shift
    const sortedIndices = [...toRemove].sort((a, b) => b - a);
    // Delete visual cards
    deleteVisualCard(PLAYER, sortedIndices);
    // Remove from logical HAND
    sortedIndices.forEach(i => HANDS[PLAYER].splice(i, 1));

    return removedRanks;
}

/**
 * Get the player that the current player thinks might be the best to ask for a card, based on memory.
 * @param {string[]} cards - The current player's card ranks (e.g., ["5", "K", "A"])
 * @returns {[number, string[]] | null} - A tuple: [opponentId, matchingRanks] or null if no match found
 */
function getMostFavourablePlayer(cards) {
    const playerMemory = MEMORIES[PLAYER];
    const cardSet = new Set(cards);

    for (const opp in playerMemory) {
        const memorySet = playerMemory[opp];
        const common = [...memorySet].filter(rank => cardSet.has(rank));
        if (common.length > 0) {
            return [parseInt(opp), common];
        }
    }

    return null;
}

function forgetRanks(ranks) {
    if (!Array.isArray(ranks) || ranks.length === 0)
        return;
    for (const memories of Object.values(MEMORIES)) {
        for (const rank of ranks) {
            for (const playerId in memories) {
                memories[playerId].delete(rank);
            }
        }
    }
}

/**
 * Update the current memories of all players based on the current player’s guess,
 * the response, and each player's memory strength.
 *
 * @param {string} card - The card rank being asked for (e.g., "5", "K")
 * @param {number} giver - The ID of the player being asked
 */
function updateMemories(card, giver) {
    for (const [player, memories] of Object.entries(MEMORIES)) {
        let shouldUpdatePlayerMem,
        shouldUpdateGiverMem;

        if (DIFFICULTY === 0) {
            shouldUpdatePlayerMem = Math.random() < 0.2;
            shouldUpdateGiverMem = Math.random() < 0.2;
        } else if (DIFFICULTY === 2) {
            shouldUpdatePlayerMem = Math.random() < 0.9;
            shouldUpdateGiverMem = Math.random() < 0.9;
        } else {
            shouldUpdatePlayerMem = Math.random() <= 0.5;
            shouldUpdateGiverMem = Math.random() <= 0.5;
        }

        const playerId = parseInt(player);

        if (shouldUpdatePlayerMem) {
            if (playerId !== PLAYER && memories[PLAYER]) {
                memories[PLAYER].add(card); // `memories[PLAYER]` is assumed to be a Set
            }
        }

        if (shouldUpdateGiverMem) {
            if (playerId !== giver && memories[giver]) {
                memories[giver].delete(card); // Safe even if the card isn't in the Set
            }
        }
    }
}

function showDetails() {
    logMessage('%cEveryone\'s hands:', logFontStyle);

    for (const playerId in HANDS) {
        logMessage(`%c${PLAYERS_REF[playerId].playerName}:`, logFontStyle, `${HANDS[playerId].join(', ')}`);
    }

    logMessage('%cEveryone\'s memories:', logFontStyle);
    for (const playerId in MEMORIES) {
        const mem = MEMORIES[playerId];
        const formatted = Object.entries(mem)
            .map(([k, v]) => `${k}: [${[...v].join(', ')}]`)
            .join(', ');
        logMessage(`%c${PLAYERS_REF[playerId].playerName}:`, logFontStyle, `${formatted}`);
    }
}

function highlightInfo(msg) {
    logMessage(`%c${msg}`, infoFontStyle);
}

function highlightSuccess(msg) {
    logMessage(`%c${msg}`, successFontStyle);
}

function checkSession(fn) {
    return async function (sessionId, ...args) {
        if (sessionId !== currentGameSessionId) {
            logMessage("Function aborted due to outdated session");
            return;
        }
        await waitUntilToggled(() => !gamePaused, 300);
        return fn.apply(this, [sessionId, ...args]);
    };
}

// Validate selection before allowing to proceed
function isValidUserSelection() {
    const players = Array.from({
        length: PLAYER_COUNT
    }, (_, i) => i).filter(i => i !== PLAYER);

    return (
        RANKS.includes(userChosenRank) &&
        players.includes(userChosenPlayer));
}

async function handleUserTurn(sessionId) {
    askPlayerBtn.classList.remove('hidden');
    askPlayerBtn.style.animation = '';
    await delay(500);
    requestAnimationFrame(() => {
        askPlayerBtn.classList.add("fade-in");
    });
    userIsAsking = true;
    userChosenRank = null;
    userChosenPlayer = null;

    toggleAvatarClickStyle(true);
    toggleCardClickListeners(true);

    logMessage('Waiting for ${{PLAYERS_REF[PLAYER].playerName}} to choose card and player...');
    askPlayerBtn.addEventListener('click', onClickAsk);
    await waitUntilToggled(() => !userIsAsking);

    toggleAvatarClickStyle(false);
    toggleCardClickListeners(false);
    askPlayerBtn.style.animation = "none";
    await delay(0);
    askPlayerBtn.classList.add("grow-and-fade-out");
    await delay(2000);
    askPlayerBtn.classList.add('hidden');
    askPlayerBtn.classList.remove('fade-in');
    askPlayerBtn.classList.remove("grow-and-fade-out");

    logMessage(`${PLAYERS_REF[PLAYER].playerName} asks {PLAYERS_REF[userChosenPlayer].playerName} for ${userChosenRank}s`);
    await guessPlayerOrGoFish(sessionId, userChosenPlayer, userChosenRank, `Hey ${PLAYERS_REF[userChosenPlayer].playerName}, got any ${userChosenRank}s?`);
}

const guessPlayerOrGoFish = checkSession(async function (sessionId, player, card, guess) {
    const cond = playerVsAI && PLAYER === 0;
    await showSpeechBubble(PLAYER, guess);
    if (await takeCardFromPlayer(player, card)) {
        await showSpeechBubble(player, 'Damn!');
        highlightSuccess(`${PLAYERS_REF[PLAYER].playerName} took all ${card}s from ${PLAYERS_REF[player].playerName}!`);
        updateMemories(card, player);
        forgetRanks(await checkForSets());
        await checkIfEmptyHand(PLAYER);
        await showSpeechBubble(PLAYER, "My turn again!");
        highlightInfo(`${PLAYERS_REF[PLAYER].playerName} gets to play again`);
        showDetails();
        await play(sessionId); // recursive call for extra turn
    } else {
        logMessage(`${PLAYERS_REF[player].playerName} doesn't have any ${card}s for ${PLAYERS_REF[PLAYER].playerName}. `
             + `${PLAYERS_REF[PLAYER].playerName} takes a card from the top of the deck.`);
        await showSpeechBubble(player, 'Go Fish!');
        await takeCardFromDeck(PLAYER);
        updateMemories(card, player);
        forgetRanks(await checkForSets());
        await checkIfEmptyHand(PLAYER);
        showDetails();
    }
});

const play = checkSession(async function (sessionId) {
    const delayMs = playerVsAI ? 500 : 500;
    await delay(delayMs);
    const cond = playerVsAI && PLAYER === 0;
    await checkIfEmptyHand(PLAYER);
    if (HANDS[PLAYER] && HANDS[PLAYER].length === 0) {
        await showSpeechBubble(PLAYER, "I am just a spectator now!");
        logMessage(`${PLAYERS_REF[PLAYER].playerName} has no cards left, and the deck has ${DECK.length} card(s). Player's turn is skipped.`);
        return;
    }

    if (cond) {
        await handleUserTurn(sessionId);
    } else {
        const cardsByRank = getMostNeededCards();
        if (!playerVsAI) {
            logMessage(`${PLAYERS_REF[PLAYER].playerName} is looking for any cards in the set: ${cardsByRank}`);
        }

        const playerToAsk = getMostFavourablePlayer(cardsByRank);

        if (!playerToAsk) {
            logMessage(`${PLAYERS_REF[PLAYER].playerName} doesn't know who the best person to ask is.`);
            await showSpeechBubble(PLAYER, "Hmmmmm...");

            const players = Object.keys(MEMORIES[PLAYER]).map(Number);
            const chosenPlayer = players[Math.floor(Math.random() * players.length)];
            const chosenCard = cardsByRank[Math.floor(Math.random() * cardsByRank.length)];

            logMessage(`${PLAYERS_REF[PLAYER].playerName} has decided to ask ${PLAYERS_REF[chosenPlayer].playerName} for ${chosenCard}s`);
            await guessPlayerOrGoFish(sessionId, chosenPlayer, chosenCard, `Hey ${PLAYERS_REF[chosenPlayer].playerName}, got any ${chosenCard}s?`);
        } else {
            const cond2 = playerVsAI && playerToAsk[0] === 0;
            const chosenCard = playerToAsk[1][Math.floor(Math.random() * playerToAsk[1].length)];

            logMessage(`${PLAYERS_REF[PLAYER].playerName} believes ${PLAYERS_REF[playerToAsk[0]].playerName} has the cards they need...`);
            logMessage(`${PLAYERS_REF[PLAYER].playerName} has decided to ask ${PLAYERS_REF[playerToAsk[0]].playerName} for ${chosenCard}s`);

            // bots can still be 'forgetful' sometimes, so need to check both cases
            await guessPlayerOrGoFish(sessionId, playerToAsk[0], chosenCard, `${PLAYERS_REF[playerToAsk[0]].playerName}, give me your ${chosenCard}s!`);

            // await showSpeechBubble(PLAYER, `${PLAYERS_REF[playerToAsk[0]].playerName}, give me your ${chosenCard}s!`);
            // await takeCardFromPlayer(playerToAsk[0], chosenCard)
            // await showSpeechBubble(playerToAsk[0], 'Damn!');
            // highlightSuccess(`${PLAYERS_REF[PLAYER].playerName} took all ${chosenCard}s from ${PLAYERS_REF[playerToAsk[0]].playerName}!`);
            // updateMemories(chosenCard, playerToAsk[0]);
            // forgetRanks(await checkForSets());
            // await checkIfEmptyHand(PLAYER);
            // await showSpeechBubble(PLAYER, "My turn again!");
            // highlightInfo(`${PLAYERS_REF[PLAYER].playerName} gets to play again`);
            // showDetails();
            // await play(sessionId); // recursive call for extra turn
        }
    }
});

const showWinner = checkSession(function (sessionId) {
    if (!gameOver || gameQuitted)
        return;
    const mostSets = Math.max(...Object.values(SETS).map(v => v.length));
    const winners = Object.entries(SETS)
        .filter(([_, v]) => v.length === mostSets)
        .map(([k]) => k);

    const winNames = winners.map(id => PLAYERS_REF[id].playerName);
    const winMsg = (winNames.length > 1 ? "The winners are " : "The winner is ") + winNames.join(' and ') + (winNames.length > 1 ? "!! It's a tie!" : "!!");
    highlightSuccess(winMsg);

    logMessage("%c\nGame results (sets made by players):", logFontStyle);
    for (const s in SETS) {
        logMessage(`%c${PLAYERS_REF[s].playerName}: ${SETS[s]}`, logFontStyle);
    }
});

const gameLoop = checkSession(async function (sessionId) {
    highlightPlayerLabel(PLAYER, true);

    await play(sessionId);

    logMessage(`%cCards remaining in DECK: ${DECK.length}`, logFontStyle);
    logMessage("%cCurrent players sets:", logFontStyle);
    for (const s in SETS) {
        const playerName = PLAYERS_REF[s].playerName;
        logMessage(`%c${playerName}: ${SETS[s]}`, logFontStyle);
    }
    logMessage('\n');
    highlightPlayerLabel(PLAYER, false);

    PLAYER = (PLAYER + 1) % PLAYER_COUNT;
    const allEmpty = DECK.length === 0 && Object.values(HANDS).every(hand => hand.length === 0);
    if (allEmpty) {
        gameOver = true;
        return;
    }

    await gameLoop(sessionId); // recursive call
});

function toggleCardClickListeners(toggle) {
    const hand = HANDS_REF[PLAYER];
    if (toggle) {
        hand.forEach(card => {
            card.addEventListener('click', onClickCard);
        });
    } else {
        hand.forEach(card => {
            card.removeEventListener('click', onClickCard);
        });
    }
}

function toggleAvatarClickStyle(toggle) {
    if (toggle) {
        // Enable glow-hover on all avatars except the current player
        Object.values(PLAYERS_REF).forEach(avatar => {
            if (avatar.avatarId !== PLAYER) {
                logMessage(avatar.avatarId);
                avatar.classList.add('glow');
            }
        });
    } else {
        // Remove glow-hover once selection is made
        Object.values(PLAYERS_REF).forEach(avatar => {
            avatar.classList.remove('glow');
        });
    }
}

function resetHandPosition(player) {
    HANDS_REF[player].forEach(card => {
        // Restore original rotation
        const angle = card.dataset.angle || "0";
        card.style.transform = `rotate(${angle}deg)`;
        card.style.zIndex = card.dataset.z || "0";
    });
}

function onClickAsk() {
    if (isValidUserSelection()) {
        askPlayerBtn.removeEventListener('click', onClickAsk);
        userIsAsking = false;
    } else {
        // Shake the button or flash to indicate invalid
        askPlayerBtn.classList.add('vertical-shake');
        askPlayerBtn.addEventListener('animationend', () => {
            askPlayerBtn.classList.remove('vertical-shake');
        }, {
            once: true
        });
    }
}

async function onClickCard(event) {
    if (!gameStart || !(playerVsAI && PLAYER === 0))
        return;

    const clickedCard = event.currentTarget;
    resetHandPosition(PLAYER);

    // Raise clicked card by adding translateY and scale to the original rotation
    const angle = clickedCard.dataset.angle || "0";
    clickedCard.style.transform = `rotate(${angle}deg) translateY(-20px) scale(1.05)`;
    clickedCard.style.zIndex = "888"; // bring on top
    userChosenRank = clickedCard.cardValue.split('of')[0];
}

async function onClickPlayer(event) {
    if (!gameStart || !(playerVsAI && PLAYER === 0))
        return;

    const clickedAvatar = event.currentTarget;
    const playerId = clickedAvatar.avatarId;

    if (playerId === PLAYER)
        return; // ignore self-click

    userChosenPlayer = playerId;
    clickedAvatar.classList.add('tilt-shake');
    clickedAvatar.addEventListener('animationend', () => {
        clickedAvatar.classList.remove('tilt-shake');
    }, {
        once: true
    });
}

function generateRandomName() {
    if (botNamingStyle == 0) {
        const first = NAMING_IMAGINARY_FIRST_PTS; // from your first scheme
        const second = NAMING_IMAGINARY_SECOND_PTS;
        return choice(first) + choice(second);
    } else {
        const first = NAMING_DESCRIPTIVE_FIRST_PTS; // from your second scheme
        const second = NAMING_DESCRIPTIVE_SECOND_PTS;
        return choice(first) + choice(second);
    }
}

function renderPlayers() {
    const positions = [];
    const namePositions = [];

    const playerContainer = document.createElement("div");
    playerContainer.id = "player-container";

    const isHumanPlayer = playerVsAI;

    // === POSITION LOGIC ===
    const total = PLAYER_COUNT;
    let index = 0;

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

    // === USER PLAY AREA (only if human player) ===
    if (playerVsAI) {
        const userArea = document.createElement("div");
        userArea.classList.add("user-play-area");

        // Choose position based on PLAYER_COUNT
        let userStyle;
        if (PLAYER_COUNT === 6) {
            userStyle = {
                bottom: "5%",
                right: "25%",
                transform: "translateX(50%)"
            };
        } else {
            userStyle = {
                bottom: "5%",
                left: "50%",
                transform: "translateX(-50%)"
            };
        }

        // Set size and appearance
        Object.assign(userArea.style, userStyle);
        // Object.assign(userArea.style, {
        // position: "absolute",
        // width: "600px",
        // height: "200px",
        // zIndex: 900,
        // ...userStyle
        // });

        // Assign ID and Name
        const playerName = playerNameInput.value.trim();
        userArea.id = "user-play-area";
        userArea.dataset.id = 0; // For consistency
        userArea.avatarId = 0;
        userArea.playerName = playerName === '' ? 'Player' : playerName;

        // Add click event listener
        userArea.addEventListener("click", onClickPlayer);

        playerContainer.appendChild(userArea);
        PLAYERS_REF.push(userArea);
        PLAYER_LABELS_REF.push(null); // just a hack to avoid running highlightPlayerLabel on user player on their turn
    }

    // === CREATE NPC PLAYER ELEMENTS ===
    for (let i = 0; i < positions.length; i++) {
        const avatarImg = document.createElement("img");
        avatarImg.classList.add("player-avatar");

        // Pick a random avatar
        const avatarNumber = Math.floor(Math.random() * 20) + 1; // 1 to 20
        const avatar = `./assets/avatars/av${avatarNumber}.png`;
        avatarImg.src = avatar;
        avatarImg.alt = `Player ${i}`;

        // Assign ID and Name
        const id = playerVsAI ? i + 1 : i;
        const playerName = generateRandomName();
        avatarImg.dataset.id = id; // Optional for HTML-side use
        avatarImg.avatarId = id; // JS-side custom property
        avatarImg.playerName = playerName; // JS-side custom property

        // Apply positioning
        const {
            transform,
            ...rest
        } = positions[i]; // Destructure to separate transform
        Object.assign(avatarImg.style, rest); // Apply all other styles
        avatarImg.style.setProperty('--base-transform', transform);

        // Generate a random color
        const hue = Math.floor(Math.random() * 360);
        const borderColor = `hsl(${hue}, 100%, 60%)`;
        const shadowColor = `hsla(${hue}, 100%, 60%, 0.7)`;
        // Apply border and shadow
        avatarImg.style.setProperty('--border-color', borderColor);
        avatarImg.style.setProperty('--glow-color', shadowColor);

        // Add click event listener
        avatarImg.addEventListener("click", onClickPlayer);

        playerContainer.appendChild(avatarImg);
        PLAYERS_REF.push(avatarImg);

        // === Add name label ===
        const nameLabel = document.createElement("div");
        nameLabel.classList.add("player-name");
        nameLabel.textContent = playerName;

        // Apply the specific label positioning (only up to 6 positions)
        Object.assign(nameLabel.style, namePositions[i] || {});

        playerContainer.appendChild(nameLabel);
        PLAYER_LABELS_REF.push(nameLabel);
    }

    gameScreen.appendChild(playerContainer);
}

// for debugging
function reorderAlternating(arr) {
    const CHAR_ORDER = ['A', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'J', 'K', 'Q'];

    // Step 1: Create 13 sublists based on first character
    const sub = Array(13).fill(null).map(() => []);

    for (const str of arr) {
        const idx = CHAR_ORDER.indexOf(str[0]);
        if (idx === -1)
            throw new Error(`Unexpected starting char in string: ${str}`);
        sub[idx].push(str);
    }

    // Sanity check: each sublist should have exactly 4 elements
    for (let s of sub) {
        if (s.length !== 4) {
            throw new Error(`A group has length != 4: ${JSON.stringify(s)}`);
        }
    }

    // Step 2: Rebuild `arr` following the described pattern
    let k = 0;

    for (let i = 0; i < 7; i++) {
        if (i < 6) {
            // Interleave two groups: sub[2*i] and sub[2*i + 1]
            for (let j = 0; j < 4; j++) {
                arr[k++] = sub[2 * i][j];
                arr[k++] = sub[2 * i + 1][j];
            }
        } else {
            // Last group: only sub[12]
            for (let j = 0; j < 4; j++) {
                arr[k++] = sub[2 * i][j];
            }
        }
    }
}

function renderCardDeck() {
    cardDeckContainer = document.createElement("div");
    cardDeckContainer.id = "card-deck-container";

    // Choose a card back design randomly or set one explicitly
    cardBackDesignSrc = `./assets/cards/designs/back${Math.floor(Math.random() * 4) + 1}.png`;

    // create the actual deck of card strings
    for (const rank of RANKS) {
        for (const suit of SUITS) {
            DECK.push(`${rank}of${suit}`);
        }
    }

    shuffle(DECK); // shuffles DECK in-place

    for (let i = 0; i < 52; i++) {
        const card = document.createElement("img");
        card.src = cardBackDesignSrc;
        card.cardValue = DECK[i]; // Assign each deck card its corresponding actual value in DECK
        card.classList.add("card-back");

        // Slight random rotation
        const range = Math.floor(Math.random() * (16 - 2 + 1)) + 2; // Random degree between (+-)2 and (+-)16
        const rotation = (Math.random() * range - range / 2).toFixed(2);

        // Slight z-index offset so cards stack without full overlap
        card.style.transform = `rotate(${rotation}deg)`;
        card.style.zIndex = i;

        DECK_REF.push(card); // Store card in global deck array
        cardDeckContainer.appendChild(card);
    }

    gameScreen.appendChild(cardDeckContainer);
}

// Utility to wait for a CSS transition to end
function waitForTransitionEnd(element) {
    return new Promise(resolve => {
        element.addEventListener("transitionend", resolve, {
            once: true
        });
    });
}

async function showSpeechBubble(playerId, message, duration = 1500) {
    const avatar = PLAYERS_REF[playerId];
    if (!avatar || !gameScreen)
        return;

    const bubble = document.createElement("div");
    bubble.className = "speech-bubble";
    bubble.textContent = message;

    // Position using bounding rect like your floating text
    const avatarRect = avatar.getBoundingClientRect();
    const gameRect = gameScreen.getBoundingClientRect();

    const x = avatarRect.left - gameRect.left + avatarRect.width / 2;
    const y = avatarRect.top - gameRect.top - 40; // above avatar

    bubble.style.left = `${x}px`;
    bubble.style.top = `${y}px`;

    gameScreen.appendChild(bubble);

    // Wait for the display duration
    await delay(duration);

    // Start fading out
    bubble.classList.add("fade-out");

    // Wait for transition to complete before removing
    await waitForTransitionEnd(bubble);
    bubble.remove();
}

function highlightPlayerLabel(player, glow) {
    const label = PLAYER_LABELS_REF[player];
    if (!label)
        return;

    if (glow) {
        label.classList.add('glow');
    } else {
        label.classList.remove('glow');
    }
}

function showFloatingText(playerId, text, type = "gain") {
    const avatar = PLAYERS_REF[playerId];
    if (!avatar)
        return;

    const textEl = document.createElement("div");
    textEl.textContent = text;
    textEl.classList.add("floating-text");
    textEl.classList.add(type); // 'gain' or 'loss'

    // Position over avatar
    const avatarRect = avatar.getBoundingClientRect();
    const gameRect = gameScreen.getBoundingClientRect();
    const x = avatarRect.left - gameRect.left + avatarRect.width / 2;
    const y = avatarRect.top - gameRect.top;

    textEl.style.left = `${x}px`;
    textEl.style.top = `${y}px`;

    gameScreen.appendChild(textEl);

    // Animate with delay before removing
    setTimeout(() => {
        textEl.classList.add("remove");
        // textEl.style.opacity = "0";
        // textEl.style.transform = "translate(-50%, -60px)";
    }, 10); // slight delay to ensure CSS transition applies

    setTimeout(() => {
        gameScreen.removeChild(textEl);
    }, 5000);
}

function positionPlayerHand(playerId) {
    const hand = HANDS_REF[playerId];
    if (!hand || hand.length === 0)
        return;

    const avatar = PLAYERS_REF[playerId];
    const gameRect = gameScreen.getBoundingClientRect();

    if (playerVsAI && playerId === 0) {
        // === Human player: Horizontal arc-fan inside user area ===
        const area = document.getElementById("user-play-area");
        if (!area)
            return;

        const areaRect = area.getBoundingClientRect();
        const cardWidth = 128;
        const cardHeight = 180;
        const overlap = 20;
        const total = hand.length;
        const maxSpread = areaRect.width - cardWidth;
        const spacing = Math.min((cardWidth - overlap), maxSpread / (total - 1 || 1));

        // Arc config
        const fanRadius = total * 80; // Lower = more curve/arc
        const maxAngle = 40; // Total degrees spread across all cards
        const angleStep = total > 1 ? maxAngle / (total - 1) : 0;
        const centerX = areaRect.left - gameRect.left + areaRect.width / 2;

        for (let i = 0; i < total; i++) {
            const card = hand[i];

            const angle = -maxAngle / 2 + i * angleStep; // From -angle to +angle
            const radians = angle * (Math.PI / 180);

            // Fan the cards along an arc path
            const x = centerX + fanRadius * Math.sin(radians) - cardWidth / 2;
            const y = areaRect.top - gameRect.top + (areaRect.height - cardHeight) / 2 + fanRadius * (1 - Math.cos(radians));

            card.style.left = `${x}px`;
            card.style.top = `${y}px`;
            card.style.transform = `rotate(${angle}deg)`;
            card.style.zIndex = i;
            card.dataset.angle = angle;
            card.dataset.z = i;
        }
    } else {
        // === NPCs: Original vertical fan + small cards ===
        const avatarRect = avatar.getBoundingClientRect();
        // Center Y aligned to avatar
        const centerY = avatarRect.top - gameRect.top + avatarRect.height / 2 - 14; // 14 = half card height (28)
        const centerX = avatarRect.left - gameRect.left + avatarRect.width + 5; // right side of avatar + small padding

        const total = hand.length;
        const fanSpread = Math.min(15, total * 6); // Max 15 degrees
        const startAngle = -fanSpread / 2;
        const overlap = 12; // tighter spacing for smaller cards

        for (let i = 0; i < total; i++) {
            const angle = startAngle + i * (fanSpread / (total - 1 || 1));
            const offsetY = (i - total / 2) * overlap;
            const card = hand[i];

            card.style.left = `${centerX}px`;
            card.style.top = `${centerY + offsetY}px`;
            card.style.transform = `rotate(${angle}deg)`;
            card.style.zIndex = i;
        }
    }
}

async function flipCardToFace(card, cvalue) {
    if (!card)
        return;

    // Start half-flip
    card.style.transform += " rotateY(90deg)";
    await delay(300); // Wait for half the flip

    // Determine which image to show
    if (typeof cvalue === "string") {
        card.src = `./assets/cards/deck/${cvalue}.png`;
    } else {
        card.src = cardBackDesignSrc;
    }

    // Complete the flip
    card.style.transform = card.style.transform.replace("rotateY(90deg)", "rotateY(0deg)");

}

function updateOpponentCardVisibility(playerId) {
    if (playerVsAI && playerId === 0)
        return;

    for (let i = 0; i < HANDS_REF[playerId]?.length; i++) {
        const cardRef = HANDS_REF[playerId][i];
        const cardValue = HANDS[playerId][i];
        if (showOpponentInfo) {
            flipCardToFace(cardRef, cardValue);
        } else {
            flipCardToFace(cardRef); // No value = flip to back
        }
    }
}

async function dealCardFromDeck(playerId) {
    takeCardFromDeck(playerId); // no need to await here - for smooth 'dealing' animation
    await delay(200); // Wait between each card (remove this line if you want all cards to be dealt immediately)
}

const dealInitialHands = checkSession(async function (sessionId, cardCount = 5) {
    const totalPlayers = PLAYER_COUNT;
    for (let currentCard = 0; currentCard < cardCount; currentCard++) {
        for (let currentPlayer = 0; currentPlayer < totalPlayers; currentPlayer++) {
            dealCardFromDeck(currentPlayer);
        }
    }

    // Final delay for the last card animation to finish (plus small buffer)
    await delay(550);
});

async function takeCardFromDeck(playerId) {
    const cardDeckContainer = document.getElementById("card-deck-container");
    if (DECK_REF.length === 0)
        return;

    const card = DECK_REF.shift();
    const avatar = PLAYERS_REF[playerId];
    if (!avatar)
        return;

    const gameRect = gameScreen.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect(); // Get position BEFORE removing

    // Remove from deck container and move to game screen
    cardDeckContainer.removeChild(card);
    gameScreen.appendChild(card);

    // Set absolute positioning
    const startLeft = cardRect.left - gameRect.left;
    const startTop = cardRect.top - gameRect.top;

    card.style.left = `${startLeft}px`;
    card.style.top = `${startTop}px`;
    card.style.width = `${cardRect.width}px`;
    card.style.height = `${cardRect.height}px`;
    card.style.willChange = "transform, top, left, width, height";
    card.classList.add("card-take");
    // card.style.position = "absolute";
    // card.style.zIndex = 1000;
    // card.style.transition = "transform 0.5s ease, left 0.5s ease, top 0.5s ease, width 0.5s ease, height 0.5s ease";

    // Compute target position
    const avatarRect = avatar.getBoundingClientRect();
    const targetX = avatarRect.left - gameRect.left + 50;
    const targetY = avatarRect.top - gameRect.top + 120;

    // Animate in the next frame
    requestAnimationFrame(() => {
        card.style.left = `${targetX}px`;
        card.style.top = `${targetY}px`;
        // Apply different sizes for human player
        if (playerVsAI && playerId === 0) {
            card.classList.add("user");
            // card.style.width = `128px`;
            // card.style.height = `180px`;
        } else {
            card.classList.add("bot");
            // card.style.width = `32px`;
            // card.style.height = `45px`;
        }
    });

    // Wait for animation to finish
    await delay(250);

    // Update player's hand
    if (!HANDS_REF[playerId]) {
        HANDS_REF[playerId] = [];
        HANDS[playerId] = [];
    }
    cardValue = DECK.shift();
    HANDS_REF[playerId].push(card);
    HANDS[playerId].push(cardValue);
    card.style.willChange = "";

    // Fan out the cards
    positionPlayerHand(playerId);

    // === If human player, flip to reveal ===
    if ((playerVsAI && playerId === 0) || showOpponentInfo) {
        flipCardToFace(card, cardValue);
    }
}

async function takeCardFromPlayer(player, rank) {
    // Get hand sizes BEFORE the transfer
    const fromHandBefore = HANDS[player]?.length ?? 0;
    const toHandBefore = HANDS[PLAYER]?.length ?? 0;
    // Try taking cards
    const success = await animateTakingCardFromPlayer(player, rank);
    // Only show floating text if cards were actually taken
    if (success) {
        const fromHandAfter = HANDS[player]?.length ?? 0;
        const toHandAfter = HANDS[PLAYER]?.length ?? 0;

        const takenCount = toHandAfter - toHandBefore;
        const lostCount = fromHandBefore - fromHandAfter;

        // Sanity check (should be equal, but just in case)
        const numCards = Math.min(takenCount, lostCount);

        if (numCards > 0) {
            showFloatingText(PLAYER, `+${numCards} x ${rank}`, 'gain');
            showFloatingText(player, `-${numCards} x ${rank}`, 'loss');
        }
    }
    return success;
}

async function animateTakingCardFromPlayer(player, rank) {
    const giverHand = HANDS[player];
    const giverHandRef = HANDS_REF[player];
    const receiverHand = HANDS[PLAYER];
    const receiverHandRef = HANDS_REF[PLAYER];

    if (!giverHand || !giverHandRef || !receiverHand || !receiverHandRef)
        return false;

    // Collect matching cards
    const cardsToTake = [];
    for (let i = giverHand.length - 1; i >= 0; i--) {
        const cardValue = giverHand[i];
        const cardRank = cardValue.split('of')[0];
        if (cardRank === rank) {
            cardsToTake.push({
                card: giverHandRef[i],
                cardValue
            });
            giverHand.splice(i, 1);
            giverHandRef.splice(i, 1);
        }
    }

    if (!cardsToTake.length)
        return false;

    positionPlayerHand(player); // Re-fan cards of giver

    const gameRect = gameScreen.getBoundingClientRect();

    for (const {
        card,
        cardValue
    }
        of cardsToTake) {
        const cardRect = card.getBoundingClientRect();
        const startLeft = cardRect.left - gameRect.left;
        const startTop = cardRect.top - gameRect.top;

        gameScreen.appendChild(card);
        card.style.left = `${startLeft}px`;
        card.style.top = `${startTop}px`;
        card.style.width = `${cardRect.width}px`;
        card.style.height = `${cardRect.height}px`;
        card.classList.add("card-take");
        // card.style.position = "absolute";
        // card.style.zIndex = 1000;
        // card.style.transition = "transform 0.5s ease, left 0.5s ease, top 0.5s ease, width 0.5s ease, height 0.5s ease";

        // Determine target:
        let targetX,
        targetY,
        finalWidth,
        finalHeight;
        if (playerVsAI && PLAYER === 0) {
            // Player takes from NPC (already works)
            const area = document.getElementById("user-play-area");
            const areaRect = area.getBoundingClientRect();
            targetX = areaRect.left - gameRect.left + areaRect.width / 2 - 64;
            targetY = areaRect.top - gameRect.top + areaRect.height / 2 - 90;
            finalWidth = 128;
            finalHeight = 180;
        } else {
            // NPC takes from player (new case)
            const avatar = PLAYERS_REF[PLAYER];
            const avatarRect = avatar.getBoundingClientRect();
            targetX = avatarRect.left - gameRect.left + 50;
            targetY = avatarRect.top - gameRect.top + 120;
            finalWidth = 32;
            finalHeight = 45;
        }

        requestAnimationFrame(() => {
            card.style.left = `${targetX}px`;
            card.style.top = `${targetY}px`;
            card.style.width = `${finalWidth}px`;
            card.style.height = `${finalHeight}px`;
        });

        await delay(500);

        // Collect card into receiver hand
        receiverHand.push(cardValue);
        receiverHandRef.push(card);
        // card.style.willChange = "";

        positionPlayerHand(PLAYER); // Refan cards of current player/receiver

        // Flip logic
        if (playerVsAI) {
            if (PLAYER === 0) {
                // 🂠 Player takes card from NPC: Flip to show front
                await new Promise(res => {
                    const onEnd = (e) => {
                        if ((e.propertyName === "left" || e.propertyName === "top") && e.target === card) {
                            card.removeEventListener("transitionend", onEnd);
                            res();
                        }
                    };
                    card.addEventListener("transitionend", onEnd);
                });

                card.style.transition = "transform 0.3s";
                flipCardToFace(card, cardValue);
                // card.style.transform += " rotateY(90deg)";
                // await delay(300);
                // card.src = `./assets/cards/deck/${cardValue}.png`;
                // card.style.transform = card.style.transform.replace("rotateY(90deg)", "rotateY(0deg)");

            } else if (player === 0) {
                // 🂠 NPC takes card from player: Flip to show back
                await new Promise(res => {
                    const onEnd = (e) => {
                        if ((e.propertyName === "left" || e.propertyName === "top") && e.target === card) {
                            card.removeEventListener("transitionend", onEnd);
                            res();
                        }
                    };
                    card.addEventListener("transitionend", onEnd);
                });

                card.style.transition = "transform 0.3s";
                flipCardToFace(card);
                // card.style.transform += " rotateY(90deg)";
                // await delay(300);
                // card.src = cardBackDesignSrc; // Your card back image path
                // card.style.transform = card.style.transform.replace("rotateY(90deg)", "rotateY(0deg)");
            }
        }
    }

    return true;
}

function waitUntilToggled(flagFn, interval = 1000) {
    return new Promise(resolve => {
        const check = setInterval(() => {
            logMessage(`--waited ${interval}ms--`);
            if (flagFn()) {
                clearInterval(check);
                resolve();
            }
        }, interval);
    });
}

function createSets() {
    function randomNumSets() {
        return Math.floor(Math.random() * 5); // 0 to 4 sets
    }

    function getRandomRank(usedRanks) {
        let rank;
        do {
            rank = RANKS[Math.floor(Math.random() * RANKS.length)];
        } while (usedRanks.has(rank));
        usedRanks.add(rank);
        return rank;
    }

    // Initialize or update the SETS object with random values
    for (const playerId of Object.keys(SETS)) {
        const numSets = randomNumSets();
        const used = new Set(); // Avoid duplicate ranks per player
        SETS[playerId] = [];

        for (let i = 0; i < numSets; i++) {
            SETS[playerId].push(getRandomRank(used));
        }
    }
}

async function setupGameScreen() {
    currentGameSessionId++; // 🔄 Invalidate any pending operations from older games
    // Create game screen from template
    gameScreen = document.createElement("div");
    gameScreen.id = "game-screen";
    gameScreen.style.display = "none";
    gameScreen.innerHTML = `
     <button id="menu-btn" class="glow-btn icon transparent">☰</button>
     <div id="menu-subwindow" class= "translucent-light" style="display: none;">
       <button id="close-menu-btn" class="glow-btn icon-small transparent">✖</button>
       <div class="menu-content">
         <button class="glow-btn menu-option" id="toggle-sound">Sounds: ${soundFx ? "On" : "Off"}</button>
         <button class="glow-btn menu-option" id="toggle-opp-info">Show All Cards: ${showOpponentInfo ? "Yes" : "No"}</button>
			<button class="glow-btn menu-option" id="toggle-log">Allow Logging: ${logMode ? "Yes" : "No"}</button>
         <button class="glow-btn menu-option" id="quit-game">Quit Game</button>
       </div>
     </div>
   `;

    renderPlayers();
    renderCardDeck();

    document.body.appendChild(gameScreen);
    // Add event listeners
    menuBtn = document.getElementById("menu-btn");
    menuSubwindow = document.getElementById("menu-subwindow");
    closeMenuBtn = document.getElementById("close-menu-btn");
    soundToggleMenuBtn = document.getElementById("toggle-sound");
    oppInfoToggleMenuBtn = document.getElementById("toggle-opp-info");
    matchLogsToggleMenuBtn = document.getElementById("toggle-log");
    quitGameMenuBtn = document.getElementById("quit-game");

    await delay(1000); // wait one second before showing start button

    const startGameBtn = document.createElement("div");
    startGameBtn.classList.add("floating-text-btn");
    startGameBtn.classList.add("title");
    startGameBtn.textContent = "Start Game";
    askPlayerBtn = document.createElement("div");
    askPlayerBtn.classList.add('floating-text-btn');
    askPlayerBtn.classList.add('title');
    askPlayerBtn.classList.add('hidden');
    askPlayerBtn.textContent = "Ask!";
    gameScreen.appendChild(askPlayerBtn);
    gameScreen.appendChild(startGameBtn);
    // Delay the class change by a tick so transition can apply
    requestAnimationFrame(() => {
        startGameBtn.classList.add("fade-in");
    });

    gameQuitted = false;

    startGameBtn.addEventListener("click", async() => {
        const sessionId = currentGameSessionId;

        startGameBtn.style.animation = "none";
        startGameBtn.textContent = `${PLAYERS_REF[PLAYER].playerName} takes the first turn!`;
        await delay(0);
        startGameBtn.classList.add("grow-and-fade-out");
        await delay(2000); // Wait for fade-out animation to complete before removing
        startGameBtn.remove(); // Remove from DOM itself

        initStateBuffers(PLAYER_COUNT);
        await dealInitialHands(sessionId, PLAYER_COUNT <= 4 ? 7 : 5);

        gameStart = true;
        gameOver = false;

        await gameLoop(sessionId); // ✅ Guaranteed to run after all cards are dealt
        // await waitUntilToggled(() => gameOver); // 👈 Wait until game ends
        // Game over: show final results
        // createSets();
        // console.log(SETS);
        showWinner(sessionId);
    }, {
        once: true
    });

    menuBtn.addEventListener('click', () => {
        gamePaused = true;
        menuSubwindow.style.display = 'block';
        menuSubwindow.style.opacity = '0';
        menuBtn.classList.add('menu-open'); // Apply glow
        requestAnimationFrame(() => {
            menuSubwindow.style.opacity = '1';
        });
    });

    closeMenuBtn.addEventListener('click', () => {
        menuSubwindow.style.opacity = '0';
        menuSubwindow.addEventListener('transitionend', () => {
            menuSubwindow.style.display = 'none';
            menuBtn.classList.remove('menu-open'); // Remove glow
            gamePaused = false; // ✅ resume game
        }, {
            once: true
        });
    });

    // --- Sounds toggle ---
    soundToggleMenuBtn.addEventListener("click", () => {
        soundFx = !soundFx;
        soundToggleMenuBtn.textContent = `Sounds: ${soundFx ? "On" : "Off"}`;
    });

    // --- Info toggle ---
    oppInfoToggleMenuBtn.addEventListener("click", () => {
        showOpponentInfo = !showOpponentInfo;
        oppInfoToggleMenuBtn.textContent = `Show All Cards: ${showOpponentInfo ? "Yes" : "No"}`;
        for (let playerId = 0; playerId < PLAYER_COUNT; playerId++) {
            updateOpponentCardVisibility(playerId);
        }
    });

    // --- Logging toggle ---
    matchLogsToggleMenuBtn.addEventListener("click", () => {
        logMode = !logMode;
        matchLogsToggleMenuBtn.textContent = `Allow Logging: ${logMode ? 'Yes' : "No"}`;
    });

    // --- Quit game ---
    quitGameMenuBtn.addEventListener("click", async() => {
        // Fade out game screen
        gameScreen.classList.remove("active");
        gameScreen.style.opacity = 0;

        // Stop bubbles
        if (bubbleIntervalId) {
            clearInterval(bubbleIntervalId);
            bubbleIntervalId = null;
        }

        // Hide menu popup
        menuSubwindow.classList.remove("active");

        // Clearing game counters/trackers/flags
        gameStart = false;
        gameOver = true;
        gamePaused = false;
        gameQuitted = true;
        userIsAsking = false;
        Object.keys(MEMORIES).forEach(key => delete MEMORIES[key]);
        Object.keys(HANDS).forEach(key => delete HANDS[key]);
        Object.keys(SETS).forEach(key => delete SETS[key]);
        PLAYER_LABELS_REF.length = 0;
        PLAYERS_REF.length = 0;
        HANDS_REF.length = 0;
        DECK_REF.length = 0;
        DECK.length = 0;
        PLAYER = Math.floor(Math.random() * PLAYER_COUNT); // Set to a different player to start next game

        // Remove references created in game-screen
        askPlayerBtn = null;

        // After transition, hide game-screen and show splash
        await delay(500);
        gameScreen.remove();
        startScreen.style.display = "block";
        startScreen.style.opacity = 1;

        // Restart bubbles
        bubbleIntervalId = setInterval(spawnBubble, 500);

        // 🧹 Clean up any existing fishing line/hook
        const existingLineContainer = document.getElementById("fishing-line-container");
        if (existingLineContainer) {
            existingLineContainer.remove();
        }
        // Respawn fishing line and hook
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
        fishingCycleController = startFishingLineCycle();

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
        velocityIntervalId = setInterval(updateVelocity, 2500); // Change direction periodically
        animateFish(); // Start animation loop
        await delay(8000);
        if (fishCycleController) {
            fishCycleController.abort(); // still safe to do if its aborted
        }
        fishCycleController = startFishBlurCycle(); // Resume blur/zoom cycle
    });
}

// Begin background gradient transition after 1s delay
setTimeout(() => {
    requestAnimationFrame((ts) => updateGradient(performance.now()));
}, 1000);
spawnSeagrass(); // Call once when game loads
bubbleIntervalId = setInterval(spawnBubble, 500); // Spawn one bubble every 0.5s (adjust as needed)
updateVelocity();
velocityIntervalId = setInterval(updateVelocity, 2500);
animateFish();
setTimeout(() => {
    fishCycleController = startFishBlurCycle(); // Start the cycle once after initial delay
}, 8000);
fishingCycleController = startFishingLineCycle();

// Update screen dimensions on resize
window.addEventListener('resize', () => {
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
});

document.addEventListener('mousedown', (event) => {
    const isBackgroundClick = !event.target.closest('#start-screen');
    const isInGameScreen = !!event.target.closest('#game-screen');
    // Ignore clicks inside #start-screen or #game-screen
    if (!isBackgroundClick || isInGameScreen)
        return;

    isMouseDown = true;
    mouseX = event.clientX;
    mouseY = event.clientY;
    mouseHoldIntervalId = setInterval(() => {
        const dx = mouseX - fishPosition.x;
        const dy = mouseY - fishPosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance === 0)
            return;

        const speed = 2; // pixels per frame
        targetFishVelocity.x = (dx / distance) * speed;
        targetFishVelocity.y = (dy / distance) * speed;
    }, 30); // update ~33 times per second
});

document.addEventListener('mousemove', (event) => {
    if (!isMouseDown)
        return;
    mouseX = event.clientX;
    mouseY = event.clientY;
});

document.addEventListener('mouseup', () => {
    if (!isMouseDown)
        return;
    isMouseDown = false;
    clearInterval(mouseHoldIntervalId);
    mouseHoldIntervalId = null;
    // After releasing, go back to normal random wandering
    updateVelocity();
});

// Show Rules
rulesBtn.addEventListener('click', () => {
    fadedScreenSwitch(startScreen, rulesScreen);
});

// Go Back to Splash
rulesToSplashBtn.addEventListener('click', () => {
    fadedScreenSwitch(rulesScreen, startScreen);
});

// Show Match Options
playBtn.addEventListener('click', () => {
    fadedScreenSwitch(startScreen, optionsScreen);
});

// Back from Match Options
optionsToSplashBtn.addEventListener('click', () => {
    fadedScreenSwitch(optionsScreen, startScreen);
});

// Player slider update
playerSlider.addEventListener('input', () => {
    PLAYER_COUNT = parseInt(playerSlider.value);
    playerCount.textContent = playerSlider.value;
});

difficultyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        difficultyBtns.forEach(b => b.classList.remove('active'));
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

// Expand input as user types
playerNameInput.addEventListener('input', () => {
    const parentHasClass = botToggleContainer.classList.contains('with-input'); // check if needed?
    if (!parentHasClass)
        return;
    const length = playerNameInput.value.length;
    const minWidth = 250; // Minimum width in px
    const charWidth = 14; // Rough pixel width estimate per char with font-size: 1.4rem
    playerNameInput.style.width = `${Math.max(minWidth, length * charWidth)}px`;
});

botToggleBtn.addEventListener('click', () => {
    playerVsAI = !playerVsAI;
    botToggleBtn.textContent = playerVsAI ? 'Yes' : 'No';
    botToggleBtn.classList.toggle('false', !playerVsAI);
    if (playerVsAI) {
        botToggleBtn.classList.add('active');
        botToggleContainer.classList.add('with-input');
    } else {
        botToggleBtn.classList.remove('active');
        botToggleContainer.classList.remove('with-input');
        // get rid of the element.style set above in the event handler, so it reverts to css styles for width
        playerNameInput.style.width = '';
    }
});

botNamingToggleBtn.addEventListener("click", (e) => {
    const classic = botNamingToggleBtn.querySelector(".naming-imaginary");
    const descriptive = botNamingToggleBtn.querySelector(".naming-descriptive");

    // Check where user clicked
    const clickedDescriptive = e.target.classList.contains("naming-descriptive");
    const clickedClassic = e.target.classList.contains("naming-imaginary");

    if (!clickedDescriptive && !clickedClassic)
        return; // Ignore empty clicks

    if (clickedDescriptive && botNamingStyle !== 1) {
        botNamingStyle = 1;
        classic.classList.remove("active");
        descriptive.classList.add("active");
    } else if (clickedClassic && botNamingStyle !== 0) {
        botNamingStyle = 0;
        descriptive.classList.remove("active");
        classic.classList.add("active");
    }
});

soundToggleBtn.addEventListener("click", () => {
    soundFx = !soundFx;
    const iconPath = soundFx
         ? "./assets/misc/speaker.png"
         : "./assets/misc/speakeroff.png";
    soundToggleBtn.style.backgroundImage = `url('${iconPath}')`;
});

goBtn.addEventListener('click', debounce(() => {
        // Stop spawning new bubbles and fishing line
        clearInterval(bubbleIntervalId);
        if (fishingCycleController) {
            fishingCycleController.abort();
        }
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
            clearInterval(velocityIntervalId);
            if (fishCycleController) {
                fishCycleController.abort();
            }
        }
        const oldGameScreen = document.getElementById("game-screen");
        if (oldGameScreen) {
            oldGameScreen.remove();
        }
        setupGameScreen();
        // Fade out current widgets
        fadedScreenSwitch(optionsScreen, gameScreen);
    }));
