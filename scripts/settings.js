import { triggerDeathVignette } from "./main.js";

//const ApplicationV2 = foundry?.applications?.api?.HandlebarsApplicationV2 || class {};
const MID = "on-screen-effects";

// death vignette test
export class TestDeathVignetteEffectProxy extends foundry.applications.api.ApplicationV2 {
    constructor(options={}) {
        super(options);
        triggerDeathVignette();
    }
    render(options={}) { return this; }
}

//settings
export const registerSettings = function() {
    const MID = "on-screen-effects";

    game.settings.register(MID, "enableDownedEffects", {
        name: "--- \"Downed\" Effect ---",
        hint: "Configure the VFX that occur when you fall to 0 HP. (Unchecking this will remove all effects that occur when your character is downed, but other players will still see them if they chose to do so.)",
        scope: "client",
        config: true,
        type: Boolean,
        default: true
    });

    game.settings.register(MID, "enableShake", {
        name: "Enable Screen Shake",
        hint: "Should the map shake when a player hits 0 HP?",
        scope: "client",      
        config: true,         
        type: Boolean,
        default: true
    });

    game.settings.register(MID, "enableDeathVignette", {
        name: "Enable Blood Vignette",
        hint: "The vignette flashes and fades away when your character hits 0 HP.",
        scope: "client",
        config: true,
        type: Boolean,
        default: true
    });

    game.settings.register(MID, "deathVignetteColor", {
        name: "Blood Vignette Color",
        hint: "Enter the hex code of the color that the flashing vignette will be. This will flash occaisonally flash when taking damage. (Currently only when a player falls to 0 HP)",
        scope: "client",
        config: true,
        type: String,
        default: "#8b0000"
    });

    game.settings.register(MID, "enableDeathBlood", {
        name: "Enable Blood Flash",
        hint: "Should blood flash on your screen when your character hits 0 HP?",
        scope: "client",
        config: true,
        type: Boolean,
        default: true
    });

    game.settings.register("on-screen-effects", "bloodColor", {
        name: "Blood Splatter Color",
        hint: "Enter the hex code of the color of your character's blood. Default is Red.",
        scope: "client",
        config: true,
        type: String,
        colorPicker: true, 
        default: "#8b0000"
    });

        game.settings.register(MID, "fadeDuration", {
        name: "Fade Duration (ms)",
        hint: "(1s = 1000ms)",
        scope: "client",
        config: true,
        type: Number,
        default: 4000
    });

    // see when other people go down
    game.settings.register(MID, "seeAllDeaths", {
        name: "Show All Player Deaths",
        hint: "If enabled, you will see the effect when ANY player character hits 0 HP. The blood and vignette will have the player's chosen colors.",
        scope: "client",
        config: true,
        type: Boolean,
        default: false
    });

    // for testing stuff, don't forget to hide it       loser
    game.settings.register(MID, "debugMode", {
        name: "Debug Mode",
        hint: "If you're seeing this, yell at Etherius. He forgot to hide it before sharing the module.",
        scope: "client",
        config: true,
        type: Boolean,
        default: false
    });


    // preview button section
    game.settings.registerMenu(MID, "testEffectMenu", {
        name: "Test \"Downed\" Effect",
        label: " Test", 
        hint: "Click this to preview how the vignette and blood will look on your screen, as well as the fadeout time. (You must save to see any recent changes reflected.)",
        icon: "fas fa-eye",
        config: true,
        type: TestDeathVignetteEffectProxy, 
        restricted: false 
    });
    
};