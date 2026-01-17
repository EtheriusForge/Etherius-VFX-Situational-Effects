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

    const vfxSettings = [
        { 
            key: "enableDownedEffects", 
            name: "--- \"Downed\" Effect ---", 
            type: Boolean, 
            def: true, 
            hint: "Configure the VFX that occur when you fall to 0 HP. (Unchecking this will remove all effects that occur when your character is downed, but other players will still see them if they choose to do so.)" 
        },
        { 
            key: "enableShake", 
            name: "Enable Screen Shake", 
            type: Boolean, 
            def: true, 
            hint: "Should the map shake when a player hits 0 HP?" 
        },
        { 
            key: "enableDeathVignette", 
            name: "Enable Blood Vignette", 
            type: Boolean, 
            def: true, 
            hint: "The vignette flashes and fades away when your character hits 0 HP." 
        },
        { 
            key: "deathVignetteColor", 
            name: "Blood Vignette Color", 
            type: String, 
            def: "#8b0000", 
            hint: "Enter the hex code for the color of the flashing vignette. This will trigger when taking damage (currently only when a player falls to 0 HP)." 
        },
        { 
            key: "enableDeathBlood", 
            name: "Enable Blood Flash", 
            type: Boolean, 
            def: true, 
            hint: "Should blood flash on your screen when your character hits 0 HP?" 
        },
        { 
            key: "bloodColor", 
            name: "Blood Splatter Color", 
            type: String, 
            def: "#8b0000", 
            colorPicker: true, 
            hint: "Enter the hex code for the color of your character's blood. Default is Red." 
        },
        { 
            key: "fadeDuration", 
            name: "Fade Duration (ms)", 
            type: Number, 
            def: 4000, 
            hint: "(1s = 1000ms)" 
        },
        { 
            key: "seeAllDeaths", 
            name: "Show All Player Deaths", 
            type: Boolean, 
            def: false, 
            hint: "If enabled, you will see the effect when ANY player character hits 0 HP. The blood and vignette will use that player's chosen colors." 
        }
    ];


    vfxSettings.forEach(s => {
        // GM global changes
        game.settings.register(MID, `worldDefault${s.key.charAt(0).toUpperCase() + s.key.slice(1)}`, {
            name: `[Defaults] ${s.name}`,
            hint: `(ONLY DM CAN SEE AND CHANGE) Sets the initial value for new players. ${s.hint}`,
            scope: "world",
            config: true,
            type: s.type,
            default: s.def,
            restricted: true 
        });
    });

    vfxSettings.forEach(s => {
        // user changes
        game.settings.register(MID, s.key, {
            name: s.name,
            hint: s.hint,
            scope: "client",
            config: true,
            type: s.type,
            default: s.def 
        });
    });

    game.settings.register(MID, "debugMode", {
        name: "Debug Mode",
        hint: "If you're seeing this, yell at Etherius. He forgot to hide it before sharing the module.",
        scope: "client",
        config: false,
        type: Boolean,
        default: false
    });

    // Hidden flag for first-time sync
    game.settings.register(MID, "hasInitialized", {
        scope: "client",
        config: false,
        type: Boolean,
        default: false
    });

    // Preview button section
    game.settings.registerMenu(MID, "testEffectMenu", {
        name: "Test \"Downed\" Effect",
        label: " Test", 
        hint: "Click this to preview how the vignette and blood will look on your screen. (You must save to see any recent changes reflected.)",
        icon: "fas fa-eye",
        config: true,
        type: TestDeathVignetteEffectProxy, 
        restricted: false 
    });

    /* // SOCIALS & COMMUNITY SECTION
    // Uncomment this section when your socials are ready to go live!
    
    Hooks.on("renderSettingsConfig", (app, html, data) => {
        const socialButtons = `
            <div class="form-group etherius-socials">
                <label>Connect with Etherius</label>
                <div class="form-fields">
                    <a href="https://www.patreon.com/Etherius" target="_blank" class="etherius-btn patreon" title="Support on Patreon">
                        <i class="fab fa-patreon"></i>
                    </a>
                    <a href="https://discord.gg/yourlink" target="_blank" class="etherius-btn discord" title="Join the Discord">
                        <i class="fab fa-discord"></i>
                    </a>
                    <a href="https://twitter.com/yourhandle" target="_blank" class="etherius-btn twitter" title="Follow on X">
                        <i class="fab fa-x-twitter"></i>
                    </a>
                </div>
                <p class="notes">Join the community for updates, polls, and to share your feedback!</p>
            </div>`;
        
        // Injects the buttons into your module's setting section
        html.find('[data-category="on-screen-effects"]').append(socialButtons);
    });
    */


};