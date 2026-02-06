import { registerSettings } from "./settings.js";

const MID = "on-screen-effects";


Hooks.once("init", function () {
  //CONFIG.debug.hooks = false;
  console.log("Etherius VFX Launching");
  registerSettings();
});

/*
*
* READY HOOK
*
*/

Hooks.once("ready", async () => {

  // check if this is player's first time
  const alreadySetup = game.settings.get(MID, "hasInitialized");

  if (!alreadySetup) {
    console.log("Etherius's VFX | First-time setup: Syncing player settings to GM defaults.");

    // keys to copy from the GM to the player
    const keysToSync = [
      "enableDownedEffects",
      "enableShake",
      "enableDeathVignette",
      "deathVignetteColor",
      "enableDeathBlood",
      "bloodColor",
      "fadeDuration",
      "seeAllDeaths"
    ];

    for (let key of keysToSync) {
      const worldKey = `worldDefault${key.charAt(0).toUpperCase() + key.slice(1)}`;
      const gmValue = game.settings.get(MID, worldKey);

      await game.settings.set(MID, key, gmValue);
    }

    //never run for this player again
    await game.settings.set(MID, "hasInitialized", true);
  }

});


/*
*
* UPDATE ACTOR HOOK
*
*/

// monitor actor updates 
Hooks.on("updateActor", (actor, unused, updateData) => {
  const currentUserId = game.user.id;
  const isOwner = actor.ownership[currentUserId] === 3;
  const debugMode = game.settings.get(MID, "debugMode");
  const downedEffectEnabled = game.settings.get(MID, "enableDownedEffects");
  const seeAll = game.settings.get(MID, "seeAllDeaths");

  // restrict execution to character owner or debug session
  if ((isOwner && !game.user.isGM) || debugMode || seeAll ) {
    // hp paths
    const currentHP = foundry.utils.getProperty(actor, "system.attributes.hp.value");
    //console.log(currentHP + "aaaaaaa");
    const previousHP = foundry.utils.getProperty(updateData, "dnd5e.hp.value")
      ?? foundry.utils.getProperty(updateData, "system.attributes.hp.value");
    //console.log(previousHP + "aaaaaaa");

    // only when transitioning from positive hp to zero/negative
    if (previousHP !== undefined && previousHP > 0 && currentHP <= 0) {

      const characterFlags = actor.getFlag(MID, "downedEffect");
      const vColor = characterFlags?.vignetteColor || "#8b0000";
      const bColor = characterFlags?.bloodColor || "#8b0000";

      if (downedEffectEnabled) {
          triggerDeathVignette(bColor, vColor);
      }
      
    }
  }
});

/*
*
* CLOSE CONFIG SETTINGS HOOK
*
*/

Hooks.on("closeSettingsConfig", async (app, html) => {
    const actor = game.user.character;
    if (!actor) return;

    // Grab the current settings
    const currentAppearance = {
        vignetteColor: game.settings.get(MID, "deathVignetteColor"),
        bloodColor: game.settings.get(MID, "bloodColor")
    };

    // Store them in the Actor's flags
    await actor.setFlag(MID, "downedEffect", currentAppearance);
    
    console.log(`Etherius VFX | Appearance synced to character: ${actor.name}`);
});


/*
*
* CHAT MESSAGE HOOK
*
*/

//pls ignore this, it's an inside joke with my DnD group
Hooks.on("chatMessage", (chatLog, message, chatData) => {
    
    if (message.toLowerCase().trim() === "talos is coming") {
        const secretVignette = "#ffffff"; 
        const secretBlood = "#FFFFFF";

        triggerDeathVignette(secretVignette, secretBlood);
    }
});


/*
*
* TRIGGER DOWNED EFFECT
*
*/

export function triggerDeathVignette(socketBloodColor = null, socketVignetteColor = null) {
  const MID = "on-screen-effects";
  
  // clean
  const oldVignette = document.getElementById('vignette-death-flash');
  if (oldVignette) oldVignette.remove();

  // prepare effects based on settings
  const bloodColor = socketBloodColor ?? game.settings.get(MID, "bloodColor");
  const vignetteColor = socketVignetteColor ?? game.settings.get(MID, "deathVignetteColor");
  const duration = game.settings.get(MID, "fadeDuration");
  const doShake = game.settings.get(MID, "enableShake");
  const vignetteEnabled = game.settings.get(MID, "enableDeathVignette");
  const bloodEnabled = game.settings.get(MID, "enableDeathBlood");
  

  const vignette = document.createElement('div');
  vignette.id = 'vignette-death-flash';
  
  
  vignette.style.opacity = "1"; 
  vignette.style.pointerEvents = "none";
  vignette.style.zIndex = "5"; 

  if (vignetteEnabled) {
    vignette.style.background = `radial-gradient(circle, rgba(0,0,0,0) 25%, ${vignetteColor}B3 100%)`;
    vignette.style.boxShadow = `inset 0 0 150px 80px ${vignetteColor}E6`;
  }
  vignette.style.transition = `opacity ${duration}ms ease-out`;

  if (bloodEnabled) {
    // Left Blood
    const leftBlood = document.createElement('img');
    leftBlood.src = `modules/${MID}/assets/bloodEffectLeft.png`;
    leftBlood.classList.add('death-blood-splatter');
    leftBlood.style.setProperty('--blood-tint', bloodColor);
    vignette.appendChild(leftBlood);

    // Right Blood
    const rightBlood = document.createElement('img');
    rightBlood.src = `modules/${MID}/assets/bloodEffectRight.png`;
    rightBlood.classList.add('death-blood-splatter');
    rightBlood.style.setProperty('--blood-tint', bloodColor);
    vignette.appendChild(rightBlood);
  }

  
  const interfaceLayer = document.getElementById('interface');

  (interfaceLayer || document.body).appendChild(vignette); 

  const board = document.getElementById('board');
  if (board && doShake) board.classList.add('board-shake');

  
  setTimeout(() => {
    vignette.style.opacity = "0";
  }, 50);

  // cleanup
  setTimeout(() => {
    if (vignette.parentNode) vignette.remove();
    if (board) board.classList.remove('board-shake');
  }, duration + 100);
}