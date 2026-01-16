Hooks.once("init", function() {
    CONFIG.debug.hooks = true;
});

Hooks.on("preUpdateActor", (actor, update, options, userId) => {
    // 1. Use V13 foundry.utils to check the incoming change
    const newHP = foundry.utils.getProperty(update, "system.attributes.hp.value");

    // 2. Only proceed if HP is actually being changed in this update
    if (newHP !== undefined) {
        const currentHP = actor.system.attributes.hp.value;

        // 3. Logic: Was healthy (>0) and is now falling to 0 or less
        if (currentHP > 0 && newHP <= 0) {
            
            // 4. Scope: Only trigger for the player actually assigned to this actor
            if (actor.assigned?.id === game.user.id) {
                triggerDeathEffect();
            }
        }
    }
});

function triggerRedVignette() {
  // 1. Create and Add Vignette
  const vignette = document.createElement('div');
  vignette.id = 'vignette-death-flash';
  document.getElementById('board').appendChild(vignette);

  // 2. Add the Shake class to the body or canvas
  document.getElementById('board').classList.add('shake-impact');

  // 3. Trigger the fade-out
  requestAnimationFrame(() => {
    vignette.classList.add('fade-out');
  });

  // 4. Cleanup
  setTimeout(() => {
    vignette.remove();
    document.getElementById('board').classList.remove('shake-impact'); // Remove shake class so it can be re-added later
  }, 3000);
}