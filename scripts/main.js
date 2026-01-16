Hooks.once("init", function() {
  CONFIG.debug.hooks = true;

  // settings
    // game.settings.register("on-screen-effects", "enableShake", {
    //     name: "Enable Screen Shake",
    //     hint: "Should the map shake when a player hits 0 HP?",
    //     scope: "client",      
    //     config: true,         
    //     type: Boolean,
    //     default: true
    // });

});

// original, fails when applying damage through character sheet
// Hooks.on("dnd5e.applyDamage", (actor) => {
//   const currentUserId = game.user.id;
//   const isOwner = actor.ownership[currentUserId] === 3;
//   console.log(game.user.isGM);
//   console.log(game.user.id);
//   console.log("game.user.id");

//   if (isOwner && game.user.isGM) {
//     const newHP = actor.system.attributes.hp.value;
//     if(newHP <= 0){
//       triggerRedVignette();
//     }
//   }
// });

Hooks.on("updateActor", (actor) => {
  const currentUserId = game.user.id;
  const isOwner = actor.ownership[currentUserId] === 3;

  if (isOwner && game.user.isGM) {
    const newHP = actor.system.attributes.hp.value;
    if(newHP <= 0){
      triggerRedVignette();
    }
  }
});



function triggerRedVignette() {
  // check
    if (document.getElementById('vignette-death-flash')) return;

    // main container
    const vignette = document.createElement('div');
    vignette.id = 'vignette-death-flash';

    // blood images
    const leftBlood = document.createElement('img');
    leftBlood.src = 'modules/on-screen-effects/assets/bloodEffectLeft.png';
    leftBlood.classList.add('death-blood-splatter', 'blood-left');

    const rightBlood = document.createElement('img');
    rightBlood.src = 'modules/on-screen-effects/assets/bloodEffectRight.png';
    rightBlood.classList.add('death-blood-splatter', 'blood-right');

    // add to vignette then body
    const interfaceLayer = document.getElementById('interface');
    vignette.appendChild(leftBlood);
    vignette.appendChild(rightBlood);
    interface.appendChild(vignette);

    // shake
    const board = document.getElementById('board');
    if (board) board.classList.add('board-shake');

    // fade out
    requestAnimationFrame(() => {
        vignette.classList.add('fade-out');
    });
    
    // cleanup
    setTimeout(() => {
        const existingVignette = document.getElementById('vignette-death-flash');
        if (existingVignette) {
            existingVignette.remove();
        }
        if (board) board.classList.remove('board-shake');
    }, 4000);
}