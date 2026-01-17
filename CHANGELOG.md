# Changelog

All notable changes to **Etherius's VFX: Situational Effects** will be documented in this file.

## [Upcoming] - Future Enhancements
### Planned
- **Daggerheart Integration**: System support and development for Daggerheart.
- **Token-Level Feedback**: Visual effects centered on character tokens for healing and damage.
- **Status Overlays**: Persistent screen effects for conditions like Poisoned, Frightened, or Charmed.
- **Damage Type VFX**: Tailored overlays for Fire, Frost, Necrotic, and more.

## [1.0.0] - 2026-01-17

### Added
- **Downed VFX**: Initial release featuring blood splatter and vignette overlays when reaching 0 HP.
- **World Default Syncing**: GMs can now set global defaults that automatically apply to new players, ensuring a consistent world aesthetic.
- **Cross-Client Sync**: Integrated socket logic allowing players to see each other's "Downed" effects based on their personal preferences.
- **Compatibility**: Confirmed support and optimized performance for **Monk's Common Display**.
- **Test Button**: Added a "Test Downed Effect" menu button in settings for instant visual previews.
- **Solo DM Mode**: A specialized setting for the lonely preppers out there. Toggle this to see the effects for every character on the map while you play with yourself, regardless of assignment.

### Changed
- **Code Architecture**: Refined the module to be entirely self-contained, significantly reducing the risk of conflicts with other active modules.
- **User Interface**: Polished setting hints and labels for better clarity while injecting a bit of developer personality.

### Bugs Slain
- **Dumb little Bugs**: Nothing crazy, just a bunch of dumb bugs I had to fight through to get here.
- **Spelling Horrors**: Corrected several typos in the settings menu that were an offense to the English.