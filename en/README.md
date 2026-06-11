# Trash King in Germany

English version of the lightweight browser management game.

You play as an international student living in a wealthy German apartment district. Each day produces organic waste, packaging, recyclables, and residual waste. You have limited actions, limited money, suspicious neighbors, and a growing need to unlock real trash-disposal freedom.

## How to Run

Open `en/index.html` directly in a browser.

When published through GitHub Pages, the English version will be available at:

```text
https://lumosnox-bamboo.github.io/de-trash-king/en/
```

The Chinese version remains at:

```text
https://lumosnox-bamboo.github.io/de-trash-king/
```

## Files

```text
en/
├── index.html   # English page structure, status panels, actions, logs, and modal container
├── style.css    # Responsive layout and game styling
├── game.js      # English game configuration, state, actions, random events, saves, and rendering
└── README.md    # English version notes
```

## Implemented

- Separate English entry page under `en/`.
- Separate `localStorage` key, so English saves do not overwrite Chinese saves.
- Easy and Hard modes.
- Four trash types with German category names.
- Daily random events, daily opportunity events, bottle storage, bottle redemption, fines, unlocks, win and loss conditions.
- Randomized outside-bin timing game, bottle-search mini game, and sorting mini game.
- Responsive layout for desktop and mobile browsers.

## Tuning

Most balance values are in `en/game.js` inside `GAME_CONFIG`.

Daily event text and effects are in `DAILY_EVENTS`.
