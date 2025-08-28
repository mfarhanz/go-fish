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
    const duration = Math.random() * 5 + 5;   // 5s to 10s
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

  requestAnimationFrame(animateFish);
}

function startFishBlurCycle() {
  const blurDuration = 3000; // ms to fully blur/unblur
  const stayBlurred = 4000 + Math.random() * 3000; // how long it stays blurred
  const nextDelay = 10000 + Math.random() * 10000; // time before next blur
  // 🌟 Generate a random width between 160 and 260 (2:1 ratio maintained)
  const randomWidth = Math.floor(Math.random() * (260 - 160 + 1)) + 160;
  const randomHeight = Math.floor(randomWidth / 2);
  
  // Blur the fish (simulate swimming away)
  fish.style.filter = 'blur(3px)';
  fish.style.opacity = '0.3';
  fish.style.width = `${randomWidth}px`;
  fish.style.height = `${randomHeight}px`;

  setTimeout(() => {
    // Return to normal
    fish.style.filter = 'blur(0px)';
    fish.style.opacity = '0.7';
	 fish.style.width = '360px';
    fish.style.height = '180px';
  }, blurDuration + stayBlurred);

  // Queue up the next cycle
  setTimeout(startFishBlurCycle, nextDelay);
}

function startFishingLineCycle() {
  function reelUp() {
    fishingLine.style.height = "0px";
    setTimeout(() => {
		fishingHook.style.opacity = "0";
		}, 4000);
  }

  function dropLine() {
    // Set a new random X position (e.g., between 10% and 90%)
	  const randomX = Math.random() * 80 + 10;
	  fishingLine.style.left = `${randomX}%`;
	  fishingHook.style.left = `${randomX}%`;

	  // Reset opacity first (in case hidden)
	  fishingHook.style.opacity = "1";

	  // Gradually grow the line (and hook follows)
	  requestAnimationFrame(() => {
		 fishingLine.style.height = "300px"; // animate to full height
	  });
  }

  function cycle() {
    const waitTime = Math.random() * 8000 + 4000; // 4s–12s wait

    setTimeout(() => {
      reelUp();

      setTimeout(() => {
        dropLine();

        // Repeat
        cycle();
      }, 10000); // Delay before dropping again (1.5s)
    }, waitTime);
  }

  cycle();
}

// Update screen dimensions on resize
window.addEventListener('resize', () => {
  screenWidth = window.innerWidth;
  screenHeight = window.innerHeight;
});

document.addEventListener('click', (event) => {
  const isBackgroundClick = !event.target.closest('#start-screen');
  if (!isBackgroundClick) return;
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
  document.body.appendChild(gameScreen);
  // Add event listeners
  menuBtn = document.getElementById("menu-btn");
  menuPopup = document.getElementById("menu-popup");
  closeMenuBtn = document.getElementById("close-menu-btn");
  soundToggleBtn = document.getElementById("toggle-sound");
  infoToggleBtn = document.getElementById("toggle-info");
  quitGameBtn = document.getElementById("quit-game");
  
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
	  }, { once: true });
	});

	// --- Sounds toggle ---
	soundToggleBtn.addEventListener("click", () => {
	  SOUND_FX = !SOUND_FX;
	  soundToggleBtn.textContent = `Sounds: ${SOUND_FX ? "On" : "Off"}`;
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

	  // Remove fish with fade out then delete
	  // fish.style.transition = "opacity 1s ease";
	  // fish.style.opacity = 0;
	  // setTimeout(() => {
		 // fish.remove();
	  // }, 500);

	  // Stop bubbles
	  if (bubbleInterval) {
		 clearInterval(bubbleInterval);
		 bubbleInterval = null;
	  }

	  // Hide menu popup
	  menuPopup.classList.remove("active");

	  // After transition, hide game-screen and show splash
	  setTimeout(() => {
		 gameScreen.remove();
		 startScreen.style.display = "block";
		 startScreen.style.opacity = 1;

		 // Respawn fish
		 fish = document.createElement("div");
		 fish.id = "fish";
		 document.body.appendChild(fish);
		 // 🔁 Re-apply its functionality
		 updateVelocity();                              			// Give it an initial movement vector
		 velocityInterval = setInterval(updateVelocity, 2500); 	// Change direction periodically
		 animateFish();                                 			// Start animation loop
		 setTimeout(startFishBlurCycle, 8000);          			// Resume blur/zoom cycle

		 // Restart bubbles
		 bubbleInterval = setInterval(spawnBubble, 500);
	  }, 500);
	});
}

let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight;

let pos = { x: screenWidth / 2, y: screenHeight / 2 };
let velocity = { x: 0, y: 0 };
let targetVelocity = { x: 0, y: 0 };
let facingLeft = false;

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
const botToggle = document.getElementById('bot-toggle');
let menuBtn = document.getElementById('menu-btn');
let closeMenuBtn = document.getElementById('close-menu-btn');
let soundToggleBtn = document.getElementById("toggle-sound");
let infoToggleBtn = document.getElementById("toggle-info");
let quitGameBtn = document.getElementById("quit-game");

// Screens
const startScreen = document.getElementById('start-screen');
const rulesScreen = document.getElementById('rules-screen');
const optionsScreen = document.getElementById('options-screen');
let gameScreen = document.getElementById('game-screen');
let menuPopup = document.getElementById('menu-popup');

// Sliders
const playerSlider = document.getElementById('player-slider');

// Labels
const playerCount = document.getElementById('player-count');

// Variables
let PLAYER_VS_AI = true; // default value
let DIFFICULTY = 1; // default value
let PLAYER_COUNT = 4; // default starting value
let MEMORIES = {};
let HANDS = {};
let SETS = {};
let GAME_OVER = false;
let PLAYER = 0;
let SOUND_FX = true;
let SHOW_INFO = true;

spawnSeagrass(); // Call once when game loads
let bubbleInterval = setInterval(spawnBubble, 500); // Spawn one bubble every 0.5s (adjust as needed)
updateVelocity();
let velocityInterval = setInterval(updateVelocity, 2500);
animateFish();
setTimeout(startFishBlurCycle, 8000);	// Start the cycle once after initial delay
startFishingLineCycle();

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

botToggle.addEventListener('click', () => {
  const isPlayingWithBots = botToggle.textContent === 'Yes';

  if (isPlayingWithBots) {
    botToggle.textContent = 'No';
    botToggle.classList.add('false');
	 PLAYER_VS_AI = false;
  } else {
    botToggle.textContent = 'Yes';
    botToggle.classList.remove('false');
	 PLAYER_VS_AI = true;
  }
});

goBtn.addEventListener('click', () => {
  // Remove the fish from view
  fish = document.getElementById('fish');
  if (fish) {
    // Start fading out
    fish.style.opacity = '0';

    // Wait for the transition to complete, then remove
    fish.addEventListener('transitionend', () => {
      if (fish && fish.parentNode) {
        fish.remove();
      }
    }, { once: true }); // ensures it runs only once
	 
	 // Stop spawning new bubbles
    clearInterval(bubbleInterval);
	 
	 // Stop fish updates
	 clearInterval(velocityInterval);
	 
	 const oldGameScreen = document.getElementById("game-screen");
    if (oldGameScreen) oldGameScreen.remove();

    setupGameScreen();
	 // Fade out current widgets
    fadeSwitch(optionsScreen, gameScreen);
  }
});


