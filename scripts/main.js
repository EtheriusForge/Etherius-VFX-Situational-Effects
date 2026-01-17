import { registerSettings } from "./settings.js";

const MID = "on-screen-effects";


Hooks.once("init", function() {
  CONFIG.debug.hooks = true;
  registerSettings();
});

Hooks.once("ready", () => {
  game.socket.on(`module.${MID}`, (data) => {
      const seeAll = game.settings.get(MID, "seeAllDeaths");
      
      if (!game.user.isGM && seeAll && data.action === "triggerDeathVignette" && data.userId !== game.user.id) {
          triggerDeathVignette(data.bloodColor, data.vignetteColor);
      }
  });
});

Hooks.on("updateActor", (actor) => {
  const currentUserId = game.user.id;
  const isOwner = actor.ownership[currentUserId] === 3;
  const debugMode = game.settings.get(MID, "debugMode");
  const downedEffectEnabled = game.settings.get(MID, "enableDownedEffects");

  if ((isOwner && !game.user.isGM) || debugMode) {
    const newHP = actor.system.attributes.hp.value;
    if(newHP !== undefined && newHP <= 0){
      const bColor = game.settings.get(MID, "bloodColor");
      const vColor = game.settings.get(MID, "deathVignetteColor");

      if(downedEffectEnabled){
      triggerDeathVignette(bColor, vColor);
      }

      game.socket.emit(`module.${MID}`, {
          action: "triggerDeathVignette",
          userId: game.user.id,
          bloodColor: bColor,      
          vignetteColor: vColor    
      });
    }
  }
});

export function triggerDeathVignette(socketBloodColor = null, socketVignetteColor = null) {
  const MID = "on-screen-effects";
  if (document.getElementById('vignette-death-flash')) return;

  // 2. Retrieve current user settings
  const bloodColor = socketBloodColor ?? game.settings.get(MID, "bloodColor");
  const vignetteColor = socketVignetteColor ?? game.settings.get(MID, "deathVignetteColor");

  const duration = game.settings.get(MID, "fadeDuration");
  const doShake = game.settings.get(MID, "enableShake");
  const vignetteEnabled = game.settings.get(MID, "enableDeathVignette");
  const bloodEnabled = game.settings.get(MID, "enableDeathBlood");

  // 3. Create Main Container
  const vignette = document.createElement('div');
  vignette.id = 'vignette-death-flash';
  
  // Apply dynamic styling for the vignette background and transition
  if(vignetteEnabled){
    vignette.style.background = `radial-gradient(circle, rgba(0,0,0,0) 25%, ${vignetteColor}B3 100%)`;
    vignette.style.boxShadow = `inset 0 0 150px 80px ${vignetteColor}E6`;
  }
  vignette.style.transition = `opacity ${duration}ms ease-out`;
  
  // 4. Create and Tint Blood Splatters
  if(bloodEnabled){
    const leftBlood = document.createElement('img');
    leftBlood.src = `modules/${MID}/assets/bloodEffectLeft.png`;
    leftBlood.classList.add('death-blood-splatter');
    leftBlood.style.setProperty('--blood-tint', bloodColor);

    const rightBlood = document.createElement('img');
    rightBlood.src = `modules/${MID}/assets/bloodEffectRight.png`;
    rightBlood.classList.add('death-blood-splatter');
    rightBlood.style.setProperty('--blood-tint', bloodColor);

    vignette.appendChild(leftBlood);
    vignette.appendChild(rightBlood);
  }
  
  // 5. Append to #interface for Monk's Common Display compatibility
  const interfaceLayer = document.getElementById('interface');
  (interfaceLayer || document.body).appendChild(vignette);

  // 6. Handle Screen Shake
  const board = document.getElementById('board');
  if (board && doShake) board.classList.add('board-shake');

  // 7. Trigger the Animation
  requestAnimationFrame(() => {
      vignette.classList.add('fade-out');
  });
  
  // 8. Robust Cleanup
  setTimeout(() => {
      const existingVignette = document.getElementById('vignette-death-flash');
      if (existingVignette) {
          existingVignette.remove();
      }
      if (board) board.classList.remove('board-shake');
  }, duration);
}
