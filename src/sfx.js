const SFX = {
  sounds: {},
  
  load(name, path) {
    const audio = new Audio(path);
    audio.preload = 'auto';
    audio.load();
    this.sounds[name] = audio;
  },

  play(name, options = {}) {
    const original = this.sounds[name];
    if (!original) return;

    // Clone to allow overlapping sounds (e.g., multiple clicks at once)
    const sound = original.cloneNode();

    sound.play().catch(e => {
      // Avoid crash if autoplay is blocked
      console.warn(`Error playing audio: ${name}`, e);
    });
  }
};


const soundMap = {
  askPlayer: 'ask.wav',
  askPlayerFail: 'ask_fail.wav',
  speechBubble: 'bubble.wav',
  cardClick: 'card_click.wav',
  cardToNPC1: 'card_npc_1.wav',
  cardToNPC2: 'card_npc_2.wav',
  cardSuccess1: 'card_take1.wav',
  cardSuccess2: 'card_take2.wav',
  cardSuccess3: 'card_take3.wav',
  cardSuccess4: 'card_take4.wav',
  cardToPlayer1: 'card1.wav',
  cardToPlayer2: 'card2.wav',
  cardToPlayer3: 'card3.wav',
  cardToPlayer4: 'card4.wav',
  cardToPlayer5: 'card5.wav',
  cardToDeck1: 'deck1.wav',
  cardToDeck2: 'deck2.wav',
  cardToDeck3: 'deck3.wav',
  cardToDeck4: 'deck4.wav',
  cardFlip: 'flip.wav',
  gameOver: 'gameover.wav',
  removeCard1: 'remove1.wav',
  removeCard2: 'remove2.wav',
  removeCard3: 'remove3.wav',
  cardSetNPC: 'set1.wav',
  cardSetPlayer: 'set2.wav',
  pauseGame: 'pause.wav',
  playerClick: 'avatar_click.wav',
  playerSoundA: 'blip1.wav',
  playerSoundB: 'blip2.wav',
  playerSoundC: 'blip3.wav',
  playerSoundD: 'blip4.wav',
  playerSoundE: 'blip5.wav',
  playerSoundF: 'blip6.wav',
  playerSoundG: 'blip7.wav',
  playerSoundH: 'blip8.wav',
  playerSoundI: 'blip9.wav',
  playerSoundJ: 'blip10.wav',
  playerSoundK: 'blip11.wav',
  playerSoundL: 'blip12.wav',
  playerSoundM: 'blip13.wav',
  playerSoundN: 'blip14.wav',
  playerSoundO: 'blip15.wav',
  playerSoundP: 'blip16.wav',
  playerSoundQ: 'blip17.wav',
  playerSoundR: 'blip18.wav',
  playerSoundS: 'blip19.wav',
  playerSoundT: 'blip20.wav',
  playerSoundU: 'blip21.wav',
  playerSoundV: 'blip22.wav',
  playerSoundW: 'blip23.wav',
  playerSoundX: 'blip24.wav',
  playerSoundY: 'blip25.wav',
  playerSoundZ: 'blip26.wav',
  createGame: 'start1.wav',
  startGame: 'start2.wav',
};

for (const [name, file] of Object.entries(soundMap)) {
  SFX.load(name, `./assets/sfx/${file}`);
}
