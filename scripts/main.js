Hooks.once("init", function() {
  CONFIG.debug.hooks = true;
});


Hooks.on("dnd5e.applyDamage", (actor, amount, options) => {
  const newHP = actor.system.attributes.hp.value;
  if(newHP <= 0){
    triggerRedVignette();
  }
});


function triggerRedVignette() {
  // Check if the element already exists to prevent stacking
    if (document.getElementById('vignette-death-flash')) return;

    const vignette = document.createElement('div');
    vignette.id = 'vignette-death-flash';
    document.body.appendChild(vignette);

    // Shake the canvas board specifically (behind UI)
    const board = document.getElementById('board');
    if (board) board.classList.add('board-shake');

    // Trigger the CSS transition
    requestAnimationFrame(() => {
        vignette.classList.add('fade-out');
    });
    
    // Cleanup once the 4s transition is done
    setTimeout(() => {
        const existingVignette = document.getElementById('vignette-death-flash');
        if (existingVignette) {
            existingVignette.remove();
            console.log("Death vignette removed successfully.");
        }
        if (board) board.classList.remove('board-shake');
    }, 4000);
}