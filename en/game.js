"use strict";

const STORAGE_KEY = "trashKingEnSaveV1";

const GAME_CONFIG = {
  maxLogs: 80,
  maxFineCount: 14,
  maxBottles: 36,
  pointerGameChance: 0.45,
  bottleGameChance: 0.5,
  compressGameChance: 0.5,
  winDay: 90,
  bottleRoutes: [
    {
      id: "supermarket",
      name: "Supermarket Back Door",
      text: "Strong Pfand energy, but also heavy competition.",
      successBonus: 0.08,
      minBottles: 2,
      maxBottles: 7,
      treasureBonus: 0.02
    },
    {
      id: "park",
      name: "Park Benches",
      text: "Easy route, steady returns, nothing too wild.",
      successBonus: 0,
      minBottles: 1,
      maxBottles: 5,
      treasureBonus: 0.08
    },
    {
      id: "station",
      name: "Near the Station",
      text: "More bottles, but a higher chance of coming back empty-handed.",
      successBonus: -0.08,
      minBottles: 3,
      maxBottles: 10,
      treasureBonus: 0.04
    }
  ],
  compressPieces: [
    {
      label: "Flatten Cardboard",
      text: "Break boxes down and flatten them.",
      effect: { trashReduce: { recycling: 260, packaging: 80 }, storedDaysReduce: { recycling: 1 } }
    },
    {
      label: "Compress Yellow Bags",
      text: "Squeeze the air out of packaging waste.",
      effect: { trashReduce: { packaging: 260 }, storedDaysReduce: { packaging: 1 } }
    },
    {
      label: "Tie Organic Bag",
      text: "Contain the smell, but organic waste cannot be compressed much.",
      effect: { trashReduce: { bio: 80 }, storedDaysReduce: { bio: 1 } }
    },
    {
      label: "Resort Mixed Junk",
      text: "Pull recyclable things out of residual waste.",
      effect: { trashReduce: { residual: 180 }, trashAdd: { recycling: 60 }, storedDaysReduce: { residual: 1 } }
    },
    {
      label: "Find Spare Bags",
      text: "Storage gets easier, and today's building-bin quota increases.",
      effect: { indoorLimit: 160 }
    },
    {
      label: "Overdo It",
      text: "You uncover a pile of tiny forgotten trash.",
      effect: { trashAdd: { residual: 120 } }
    },
    {
      label: "Move Bottle Corner",
      text: "Move the bottle bag somewhere less annoying.",
      effect: { storedDaysReduce: { packaging: 1, recycling: 1 }, indoorLimit: 80 }
    },
    {
      label: "Clear Old Flyers",
      text: "Flyers are light, but they take up space.",
      effect: { trashReduce: { recycling: 160 }, trashAdd: { residual: 40 } }
    }
  ],
  messages: {
    noOutsideBin: [
      "You circle two blocks and only find a Hausverwaltung warning sign. No usable bin.",
      "The outside bins are locked like they are guarding state secrets. No usable bin today.",
      "You find a bin, but the label says residents only. Common sense wins.",
      "The corner bin was just emptied. It is clean in a spiritually devastating way.",
      "A window opens upstairs. You decide your neighbor relations are worth more than this attempt."
    ],
    noWalkBottles: [
      "You take a walk and only collect wet shoes and German neighborhood silence.",
      "The route looks professionally cleared. Only bottle caps remain.",
      "You spot a bottle, then realize it has no deposit.",
      "People are still drinking their Club-Mate. You arrived too early.",
      "The bins are suspiciously clean. There may be hidden competition."
    ],
    bottleFull: [
      "The bottle bag is full. Any more and it will become a smell-based problem.",
      "Your bottle corner has hit capacity. Go redeem deposits first.",
      "Bottle storage is full. More bottles would only create new life pressure."
    ]
  },
  streetFindChances: {
    outsideBin: 0.18,
    walk: 0.12
  },
  streetFinds: [
    { name: "a few coins", minMoney: 0.3, maxMoney: 1.8, weight: 45 },
    { name: "a second-hand book with a bookmark", minMoney: 1.2, maxMoney: 4.5, weight: 26 },
    { name: "usable small furniture", minMoney: 4, maxMoney: 11, weight: 14 },
    { name: "a crumpled banknote", moneyChoices: [5, 10], weight: 10 },
    { name: "an unwanted but decent desk lamp", minMoney: 3, maxMoney: 8, weight: 5 }
  ],
  opportunityChance: 0.68,
  opportunities: [
    {
      title: "Help a Neighbor Move Boxes",
      text: "A neighbor has stacked cardboard boxes by the door. Helping may earn money, or just move the box problem into your room.",
      actionCost: 1,
      outcomes: [
        { weight: 45, label: "Grateful neighbor", money: [5, 9], trashAdd: { recycling: 180 } },
        { weight: 35, label: "More boxes than expected", money: [2, 5], trashAdd: { recycling: 360, packaging: 120 } },
        { weight: 20, label: "Only a danke", trashAdd: { recycling: 220 } }
      ]
    },
    {
      title: "Sperrmuell Treasure Hunt",
      text: "Bulky waste is sitting by the road. You might find something valuable, or just drag junk home.",
      actionCost: 1,
      outcomes: [
        { weight: 35, label: "Sellable small furniture", money: [8, 18], trashAdd: { residual: 120 } },
        { weight: 45, label: "Some recyclable materials", money: [1, 4], trashAdd: { recycling: 160 } },
        { weight: 20, label: "Only trouble came home", trashAdd: { residual: 320 } }
      ]
    },
    {
      title: "Trash Room Door Is Unlocked",
      text: "The building trash room door is not fully shut. Rare chance, but keep it quiet.",
      actionCost: 1,
      outcomes: [
        { weight: 50, label: "Route figured out", indoorLimit: 650 },
        { weight: 30, label: "A little extra room", indoorLimit: 250 },
        { weight: 20, label: "The door makes a noise", indoorLimit: 150, outsideRiskBonus: 0.08 }
      ]
    },
    {
      title: "Classmate Asks for Food Delivery",
      text: "A classmate offers a small errand fee, but the packaging and leftovers stay with you.",
      actionCost: 1,
      outcomes: [
        { weight: 50, label: "Errand fee paid", money: [4, 8], trashAdd: { packaging: 180, bio: 80 } },
        { weight: 30, label: "They added drinks", money: [5, 9], bottles: [1, 3], trashAdd: { packaging: 260 } },
        { weight: 20, label: "Last-minute lowball", money: [1, 3], trashAdd: { packaging: 220, bio: 120 } }
      ]
    },
    {
      title: "Pfand Route Planning",
      text: "You map out a possible bottle route. Returns depend on luck.",
      actionCost: 1,
      outcomes: [
        { weight: 35, label: "Great route", bottles: [5, 10] },
        { weight: 45, label: "Normal haul", bottles: [2, 5] },
        { weight: 20, label: "Already picked clean", bottles: [0, 1] }
      ]
    },
    {
      title: "Sorting Obsession Kicks In",
      text: "You suddenly want to reopen, flatten, and sort everything at home.",
      actionCost: 1,
      outcomes: [
        { weight: 45, label: "Very successful sorting", trashReduce: { packaging: 320, recycling: 260, residual: 120 } },
        { weight: 35, label: "A little space recovered", trashReduce: { packaging: 180, recycling: 120 } },
        { weight: 20, label: "It gets messier", trashAdd: { residual: 100 }, trashReduce: { packaging: 80 } }
      ]
    },
    {
      title: "Paid Online Survey",
      text: "Someone posts a paid survey in the student group. Not much money, but no need to go outside.",
      actionCost: 0,
      outcomes: [
        { weight: 60, label: "Survey accepted", money: [1, 3] },
        { weight: 25, label: "Bonus reward", money: [4, 7] },
        { weight: 15, label: "No payout after all" }
      ]
    },
    {
      title: "Hallway Briefly Empty",
      text: "You check through the peephole. The hallway is unusually quiet.",
      actionCost: 0,
      outcomes: [
        { weight: 55, label: "Safer today", indoorLimit: 220, outsideRiskBonus: -0.06 },
        { weight: 30, label: "Just a feeling", indoorLimit: 80 },
        { weight: 15, label: "Next door suddenly opens", outsideRiskBonus: 0.08 }
      ]
    }
  ],
  bottleTypes: {
    small: { label: "Small bottle", value: 0.25 },
    large: { label: "Large bottle", value: 0.25 },
    glass: { label: "Glass bottle", value: 0.08 }
  },
  modes: {
    easy: {
      label: "Easy",
      dailyActions: 5,
      startingMoney: 20,
      indoorSafeRange: [300, 500],
      fineRange: [4, 9],
      outsideFindChance: 0.7,
      indoorOverRisk: 0.18,
      capacityMultiplier: 1,
      unlockPriceMultiplier: 1.6
    },
    hard: {
      label: "Hard",
      dailyActions: 3,
      startingMoney: 8,
      indoorSafeRange: [150, 300],
      fineRange: [8, 16],
      outsideFindChance: 0.45,
      indoorOverRisk: 0.3,
      capacityMultiplier: 0.9,
      unlockPriceMultiplier: 2.4
    }
  },
  garbageTypes: {
    bio: {
      name: "Organic Waste",
      german: "Bioabfall",
      color: "#2d8a55",
      baseDaily: 250,
      variance: 120,
      maxCapacity: 1800,
      maxDays: 3,
      unlockPrice: 35,
      bioPenaltyMultiplier: 1.35
    },
    packaging: {
      name: "Packaging",
      german: "Verpackung",
      color: "#d8ad1e",
      baseDaily: 180,
      variance: 100,
      maxCapacity: 2500,
      maxDays: 6,
      unlockPrice: 45,
      bioPenaltyMultiplier: 1
    },
    recycling: {
      name: "Recyclables",
      german: "Recycling",
      color: "#2878c7",
      baseDaily: 120,
      variance: 80,
      maxCapacity: 2200,
      maxDays: 7,
      unlockPrice: 40,
      bioPenaltyMultiplier: 1
    },
    residual: {
      name: "Residual Waste",
      german: "Restmüll",
      color: "#73777d",
      baseDaily: 160,
      variance: 90,
      maxCapacity: 1600,
      maxDays: 5,
      unlockPrice: 50,
      bioPenaltyMultiplier: 1
    }
  }
};

const DAILY_EVENTS = [
  {
    name: "Eating Out Today",
    text: "Organic waste -60%, packaging -30%.",
    apply(daily) {
      daily.trashMultiplier.bio *= 0.4;
      daily.trashMultiplier.packaging *= 0.7;
    }
  },
  {
    name: "Friends Visit",
    text: "Packaging +300g, residual waste +200g, recyclables +150g.",
    apply(daily) {
      daily.trashAdd.packaging += 300;
      daily.trashAdd.residual += 200;
      daily.trashAdd.recycling += 150;
    }
  },
  {
    name: "Big Home-Cooked Meal",
    text: "Organic waste +500g, packaging +100g.",
    apply(daily) {
      daily.trashAdd.bio += 500;
      daily.trashAdd.packaging += 100;
    }
  },
  {
    name: "Too Busy, Ordered Takeout",
    text: "Packaging +450g, residual waste +120g, organic waste -100g.",
    apply(daily) {
      daily.trashAdd.packaging += 450;
      daily.trashAdd.residual += 120;
      daily.trashAdd.bio -= 100;
    }
  },
  {
    name: "Neighbors Are Extra Alert",
    text: "Outside disposal detection risk +15% today.",
    apply(daily) {
      daily.outsideRiskBonus += 0.15;
    }
  },
  {
    name: "Rainy Day",
    text: "Actions -1 today, bottle-walk returns reduced.",
    apply(daily) {
      daily.actionsModifier -= 1;
      daily.walkBottlePenalty += 0.25;
    }
  },
  {
    name: "Nearby Event Just Ended",
    text: "Outside-bin chance +20%, bottle-find chance +25%.",
    apply(daily) {
      daily.outsideFindBonus += 0.2;
      daily.bottleFindBonus += 0.25;
    }
  },
  {
    name: "Room Cleanup Day",
    text: "Residual waste +500g, recyclables +250g.",
    apply(daily) {
      daily.trashAdd.residual += 500;
      daily.trashAdd.recycling += 250;
    }
  },
  {
    name: "Frugal Day",
    text: "All trash -20%, money +0.5 EUR.",
    apply(daily) {
      Object.keys(GAME_CONFIG.garbageTypes).forEach((type) => {
        daily.trashMultiplier[type] *= 0.8;
      });
      daily.moneyAdd += 0.5;
    }
  },
  {
    name: "Building Manager Patrol",
    text: "Building-bin safe quota reduced, overstuffing is riskier.",
    apply(daily) {
      daily.indoorLimitMultiplier *= 0.65;
      daily.indoorRiskBonus += 0.18;
    }
  },
  {
    name: "Someone Is Moving Out",
    text: "Outside-bin chance +10%, valuable-find chance +25%.",
    apply(daily) {
      daily.outsideFindBonus += 0.1;
      daily.streetFindBonus += 0.25;
    }
  },
  {
    name: "Exam Week",
    text: "Actions -1, recyclables +220g, packaging +120g.",
    apply(daily) {
      daily.actionsModifier -= 1;
      daily.trashAdd.recycling += 220;
      daily.trashAdd.packaging += 120;
    }
  },
  {
    name: "Part-Time Tip",
    text: "Money +2-6 EUR.",
    apply(daily) {
      daily.moneyAdd += randomMoney(2, 6);
    }
  },
  {
    name: "Bought Too Much on Sale",
    text: "Packaging +260g, organic waste +180g, money -1.5 EUR.",
    apply(daily) {
      daily.trashAdd.packaging += 260;
      daily.trashAdd.bio += 180;
      daily.moneyAdd -= 1.5;
    }
  },
  {
    name: "Landlord Group Chat Bombardment",
    text: "Building and outside disposal detection risks both rise.",
    apply(daily) {
      daily.indoorRiskBonus += 0.12;
      daily.outsideRiskBonus += 0.1;
    }
  },
  {
    name: "Neighborhood Flea Market",
    text: "Books and small furniture sell for more.",
    apply(daily) {
      daily.streetFindBonus += 0.12;
      daily.streetFindMoneyMultiplier += 0.55;
    }
  },
  {
    name: "Pfand Lucky Day",
    text: "Bottle-find chance +35%.",
    apply(daily) {
      daily.bottleFindBonus += 0.35;
    }
  },
  {
    name: "Neighbor Gives Extra Bread",
    text: "Money +1 EUR, but organic waste +160g.",
    apply(daily) {
      daily.moneyAdd += 1;
      daily.trashAdd.bio += 160;
    }
  },
  {
    name: "Free Corner on Basement Noticeboard",
    text: "Valuable-find chance +18%, but residual waste +120g.",
    apply(daily) {
      daily.streetFindBonus += 0.18;
      daily.trashAdd.residual += 120;
    }
  },
  {
    name: "Neighbor Is Away",
    text: "Building and outside disposal detection risks go down.",
    apply(daily) {
      daily.indoorRiskBonus -= 0.12;
      daily.outsideRiskBonus -= 0.12;
    }
  },
  {
    name: "Hausmeister Is in a Good Mood",
    text: "Building-bin safe quota rises, detection risk drops.",
    apply(daily) {
      daily.indoorLimitMultiplier *= 1.25;
      daily.indoorRiskBonus -= 0.1;
    }
  },
  {
    name: "Gelber Sack Pickup Day",
    text: "Packaging -250g, outside-bin chance +10%.",
    apply(daily) {
      daily.trashAdd.packaging -= 250;
      daily.outsideFindBonus += 0.1;
    }
  },
  {
    name: "Free Canteen Dinner",
    text: "Organic waste -40%, money +1 EUR.",
    apply(daily) {
      daily.trashMultiplier.bio *= 0.6;
      daily.moneyAdd += 1;
    }
  },
  {
    name: "Weekend Binge-Watching",
    text: "Actions +1, packaging +180g, residual waste +90g.",
    apply(daily) {
      daily.actionsModifier += 1;
      daily.trashAdd.packaging += 180;
      daily.trashAdd.residual += 90;
    }
  },
  {
    name: "Long Pfand Machine Queue",
    text: "Redeeming bottles is mentally expensive today. Actions -1.",
    apply(daily) {
      daily.actionsModifier -= 1;
    }
  },
  {
    name: "Trash Sorting Lecture Pays Off",
    text: "All trash -10%, building detection risk drops.",
    apply(daily) {
      Object.keys(GAME_CONFIG.garbageTypes).forEach((type) => {
        daily.trashMultiplier[type] *= 0.9;
      });
      daily.indoorRiskBonus -= 0.08;
    }
  },
  {
    name: "Fridge Cleanup Goes Badly",
    text: "Organic waste +420g, residual waste +80g.",
    apply(daily) {
      daily.trashAdd.bio += 420;
      daily.trashAdd.residual += 80;
    }
  },
  {
    name: "Sperrmuell Day",
    text: "Valuable-find chance +30%, outside-bin chance +10%.",
    apply(daily) {
      daily.streetFindBonus += 0.3;
      daily.outsideFindBonus += 0.1;
    }
  },
  {
    name: "Neighbor Says Hello First",
    text: "Outside disposal risk drops today, but social pressure adds packaging +60g.",
    apply(daily) {
      daily.outsideRiskBonus -= 0.1;
      daily.trashAdd.packaging += 60;
    }
  }
];

let state = null;
let minigameTimer = null;
let minigameState = null;
let bottleSearchState = null;
let compressGameState = null;

const elements = {};

document.addEventListener("DOMContentLoaded", () => {
  cacheElements();
  bindEvents();
  updateStartButtons();
  render();
});

function cacheElements() {
  elements.startScreen = document.getElementById("startScreen");
  elements.gameScreen = document.getElementById("gameScreen");
  elements.continueButton = document.getElementById("continueButton");
  elements.resetButton = document.getElementById("resetButton");
  elements.dayValue = document.getElementById("dayValue");
  elements.modeValue = document.getElementById("modeValue");
  elements.moneyValue = document.getElementById("moneyValue");
  elements.actionsValue = document.getElementById("actionsValue");
  elements.bottlesValue = document.getElementById("bottlesValue");
  elements.finesValue = document.getElementById("finesValue");
  elements.dailySummary = document.getElementById("dailySummary");
  elements.opportunityPanel = document.getElementById("opportunityPanel");
  elements.goalValue = document.getElementById("goalValue");
  elements.limitStreakValue = document.getElementById("limitStreakValue");
  elements.garbageCards = document.getElementById("garbageCards");
  elements.logList = document.getElementById("logList");
  elements.resultPanel = document.getElementById("resultPanel");
  elements.modalBackdrop = document.getElementById("modalBackdrop");
  elements.modalTitle = document.getElementById("modalTitle");
  elements.modalBody = document.getElementById("modalBody");
  elements.modalCloseButton = document.getElementById("modalCloseButton");
}

function bindEvents() {
  document.querySelectorAll("[data-new-mode]").forEach((button) => {
    button.addEventListener("click", () => startNewGame(button.dataset.newMode));
  });

  document.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => handleAction(button.dataset.action));
  });

  elements.continueButton.addEventListener("click", continueGame);
  elements.resetButton.addEventListener("click", resetGame);
  elements.opportunityPanel.addEventListener("click", (event) => {
    if (event.target.closest("[data-accept-opportunity]")) acceptDailyOpportunity();
  });
  elements.modalCloseButton.addEventListener("click", closeModal);
  elements.modalBackdrop.addEventListener("click", (event) => {
    if (event.target === elements.modalBackdrop) closeModal();
  });
}

function startNewGame(modeKey) {
  const mode = GAME_CONFIG.modes[modeKey] ? modeKey : "easy";
  state = createInitialState(mode);
  addLog(`New game started: ${GAME_CONFIG.modes[mode].label} mode.`);
  startDay();
  saveGame();
  render();
}

function createInitialState(mode) {
  const garbage = {};
  Object.keys(GAME_CONFIG.garbageTypes).forEach((type) => {
    garbage[type] = {
      amount: 0,
      storedDays: 0,
      unlocked: false
    };
  });

  return {
    mode,
    day: 1,
    money: GAME_CONFIG.modes[mode].startingMoney,
    actionsLeft: 0,
    bottles: { small: 0, large: 0, glass: 0 },
    fineCount: 0,
    consecutiveOverLimitDays: 0,
    garbage,
    logs: [],
    daily: null,
    status: "playing",
    resultMessage: ""
  };
}

function continueGame() {
  const loaded = loadGame();
  if (!loaded) return;
  state = loaded;
  render();
}

function resetGame() {
  localStorage.removeItem(STORAGE_KEY);
  closeModal();
  state = null;
  updateStartButtons();
  render();
}

function handleAction(action) {
  if (!state || state.status !== "playing") return;

  if (action !== "end-day" && action !== "unlock-freedom" && state.actionsLeft <= 0) {
    addLog("No actions left today. You can only end the day.");
    saveAndRender();
    return;
  }

  const actionMap = {
    "indoor-bin": openIndoorBinModal,
    "outside-bin": goFindOutsideBin,
    "walk-bottles": startBottleWalkAction,
    "redeem-bottles": redeemBottles,
    "compress-trash": startCompressAction,
    "unlock-freedom": openUnlockModal,
    "end-day": endDay
  };

  actionMap[action]();
}

function startDay() {
  const mode = GAME_CONFIG.modes[state.mode];
  const daily = createDailyModifiers();
  const events = rollDailyEvents();

  events.forEach((event) => event.apply(daily));

  state.daily = {
    eventNames: events.map((event) => event.name),
    eventTexts: events.map((event) => `${event.name}: ${event.text}`),
    trashGenerated: {},
    outsideFindBonus: daily.outsideFindBonus,
    outsideRiskBonus: daily.outsideRiskBonus,
    bottleFindBonus: daily.bottleFindBonus,
    walkBottlePenalty: daily.walkBottlePenalty,
    streetFindBonus: daily.streetFindBonus,
    streetFindMoneyMultiplier: daily.streetFindMoneyMultiplier,
    indoorRiskBonus: daily.indoorRiskBonus,
    opportunity: rollDailyOpportunity(),
    indoorLimit: 0
  };

  state.actionsLeft = Math.max(1, mode.dailyActions + daily.actionsModifier);
  state.daily.indoorLimit = Math.round(randomInt(...mode.indoorSafeRange) * daily.indoorLimitMultiplier);

  if (daily.moneyAdd !== 0) {
    state.money = roundMoney(state.money + daily.moneyAdd);
  }

  Object.keys(GAME_CONFIG.garbageTypes).forEach((type) => {
    const config = GAME_CONFIG.garbageTypes[type];
    const current = state.garbage[type];
    const raw = config.baseDaily + randomInt(-config.variance, config.variance);
    const generated = Math.max(0, Math.round(raw * daily.trashMultiplier[type] + daily.trashAdd[type]));
    state.daily.trashGenerated[type] = generated;

    if (current.unlocked) {
      current.amount = 0;
      current.storedDays = 0;
    } else {
      current.amount += generated;
    }
  });

  const eventText = events.length ? events.map((event) => event.name).join(", ") : "no special events";
  addLog(`Day ${state.day} begins. Today's events: ${eventText}. Building-bin safe quota: ${state.daily.indoorLimit}g.`);
  if (state.daily.opportunity) {
    addLog(`Today's opportunity appears: ${state.daily.opportunity.title}.`);
  }
  const generatedText = Object.keys(GAME_CONFIG.garbageTypes)
    .map((type) => `${GAME_CONFIG.garbageTypes[type].name} ${state.daily.trashGenerated[type]}g`)
    .join(", ");
  addLog(`Trash generated today: ${generatedText}.`);
}

function createDailyModifiers() {
  const trashMultiplier = {};
  const trashAdd = {};
  Object.keys(GAME_CONFIG.garbageTypes).forEach((type) => {
    trashMultiplier[type] = 1;
    trashAdd[type] = 0;
  });

  return {
    trashMultiplier,
    trashAdd,
    actionsModifier: 0,
    moneyAdd: 0,
    outsideRiskBonus: 0,
    outsideFindBonus: 0,
    bottleFindBonus: 0,
    walkBottlePenalty: 0,
    streetFindBonus: 0,
    streetFindMoneyMultiplier: 1,
    indoorLimitMultiplier: 1,
    indoorRiskBonus: 0
  };
}

function rollDailyEvents() {
  const count = weightedRandom([
    { value: 0, weight: 20 },
    { value: 1, weight: 45 },
    { value: 2, weight: 27 },
    { value: 3, weight: 8 }
  ]);
  const pool = [...DAILY_EVENTS];
  const selected = [];

  while (selected.length < count && pool.length > 0) {
    const index = randomInt(0, pool.length - 1);
    selected.push(pool.splice(index, 1)[0]);
  }

  return selected;
}

function rollDailyOpportunity() {
  if (!chance(GAME_CONFIG.opportunityChance)) return null;
  const template = pickRandom(GAME_CONFIG.opportunities);
  return {
    title: template.title,
    text: template.text,
    actionCost: template.actionCost,
    outcomes: template.outcomes,
    used: false,
    result: ""
  };
}

function openIndoorBinModal() {
  const options = getTrashOptions({ includeUnlocked: false });
  if (options.length === 0) {
    addLog("There is no trash at home that needs sneaky disposal.");
    saveAndRender();
    return;
  }

  openModal("Building Bins", `
    <p class="hint">Remaining safe quota today: <strong>${state.daily.indoorLimit}g</strong>. Going over it may get you noticed by the building manager or neighbors.</p>
    <div class="form-grid">
      ${trashSelectHtml(options)}
      ${weightInputHtml(options[0], Infinity, state.daily.indoorLimit)}
      <div class="modal-actions">
        <button id="confirmIndoorButton" class="primary-button">Use Building Bin</button>
      </div>
    </div>
  `);

  bindTrashWeightSync(options, Infinity, state.daily.indoorLimit);
  document.getElementById("confirmIndoorButton").addEventListener("click", () => {
    const type = getModalTrashType();
    const requested = getModalWeight(type);
    if (!requested) return;
    consumeAction();

    if (requested <= state.daily.indoorLimit) {
      reduceTrash(type, requested);
      state.daily.indoorLimit -= requested;
      addLog(`Building bin success: disposed of ${requested}g of ${getTrashName(type)}. Quiet hands, quiet door.`);
    } else {
      const overAmount = requested - state.daily.indoorLimit;
      const risk = clamp(getMode().indoorOverRisk + state.daily.indoorRiskBonus + overAmount / 2000, 0.05, 0.85);
      if (chance(risk)) {
        applyFine(randomInt(...getMode().fineRange), `caught overusing the building bin; ${getTrashName(type)} was not disposed of`);
      } else {
        reduceTrash(type, requested);
        state.daily.indoorLimit = 0;
        state.daily.outsideRiskBonus += 0.05;
        addLog(`You forced in ${requested}g of ${getTrashName(type)}. Nobody noticed yet, but today's later risk rises.`);
      }
    }

    closeModal();
    checkGameEnd();
    saveAndRender();
  });
}

function acceptDailyOpportunity() {
  const opportunity = state?.daily?.opportunity;
  if (!opportunity || opportunity.used || state.status !== "playing") return;

  if (opportunity.actionCost > 0 && state.actionsLeft < opportunity.actionCost) {
    addLog("Not enough actions. Today's opportunity slips away.");
    saveAndRender();
    return;
  }

  state.actionsLeft = Math.max(0, state.actionsLeft - opportunity.actionCost);
  const outcome = weightedRandom(opportunity.outcomes.map((item) => ({
    value: item,
    weight: item.weight
  })));
  const effectText = applyOpportunityOutcome(outcome);
  opportunity.used = true;
  opportunity.result = outcome.label;

  addLog(`Opportunity "${opportunity.title}": ${outcome.label}${effectText ? `. ${effectText}` : "."}`);
  checkGameEnd();
  saveAndRender();
}

function applyOpportunityOutcome(outcome) {
  const effects = [];

  if (outcome.money) {
    const money = resolveMoneyRange(outcome.money);
    state.money = roundMoney(state.money + money);
    effects.push(`money ${money >= 0 ? "+" : ""}${formatMoney(money)}`);
  }

  if (outcome.bottles) {
    const count = resolveIntRange(outcome.bottles);
    const added = addRandomBottles(count);
    if (added > 0) effects.push(`bottles +${added}`);
    if (added < count) effects.push("bottle storage full");
  }

  if (outcome.actions) {
    state.actionsLeft = Math.max(0, state.actionsLeft + outcome.actions);
    effects.push(`actions ${outcome.actions >= 0 ? "+" : ""}${outcome.actions}`);
  }

  if (outcome.indoorLimit) {
    state.daily.indoorLimit = Math.max(0, state.daily.indoorLimit + outcome.indoorLimit);
    effects.push(`building quota ${outcome.indoorLimit >= 0 ? "+" : ""}${outcome.indoorLimit}g`);
  }

  if (outcome.outsideRiskBonus) {
    state.daily.outsideRiskBonus += outcome.outsideRiskBonus;
    effects.push(`outside risk ${outcome.outsideRiskBonus > 0 ? "up" : "down"}`);
  }

  if (outcome.trashAdd) {
    Object.keys(outcome.trashAdd).forEach((type) => {
      if (state.garbage[type].unlocked) return;
      const amount = outcome.trashAdd[type];
      state.garbage[type].amount += amount;
      effects.push(`${getTrashName(type)} +${amount}g`);
    });
  }

  if (outcome.trashReduce) {
    Object.keys(outcome.trashReduce).forEach((type) => {
      const amount = Math.min(state.garbage[type].amount, outcome.trashReduce[type]);
      reduceTrash(type, amount);
      effects.push(`${getTrashName(type)} -${amount}g`);
    });
  }

  return effects.join(", ");
}

function resolveIntRange(value) {
  if (Array.isArray(value)) return randomInt(value[0], value[1]);
  return value;
}

function resolveMoneyRange(value) {
  if (Array.isArray(value)) return randomMoney(value[0], value[1]);
  return value;
}

function goFindOutsideBin() {
  consumeAction();

  const foundChance = clamp(getMode().outsideFindChance + state.daily.outsideFindBonus, 0.05, 0.95);
  const bottleChance = clamp(0.28 + state.daily.bottleFindBonus, 0, 0.9);
  if (chance(bottleChance)) {
    const count = randomInt(1, 3);
    const added = addRandomBottles(count);
    if (added > 0) addLog(`Found ${added} bottle(s) near the bins while outside.`);
    if (added < count) addLog(pickRandom(GAME_CONFIG.messages.bottleFull));
  }
  findStreetTreasure("outsideBin");

  if (!chance(foundChance)) {
    addLog(pickRandom(GAME_CONFIG.messages.noOutsideBin));
    saveAndRender();
    return;
  }

  const outsideBin = createOutsideBin();
  const usableOptions = outsideBin.acceptedTypes
    .filter((type) => !state.garbage[type].unlocked && state.garbage[type].amount > 0)
    .map((type) => ({ type, amount: state.garbage[type].amount }));

  if (usableOptions.length === 0) {
    addLog(`You found an outside bin, but it only accepts ${outsideBin.acceptedTypes.map(getTrashName).join(", ")}. Not useful right now.`);
    saveAndRender();
    return;
  }

  saveGame();
  render();
  openOutsideBinModal(outsideBin, usableOptions);
}

function createOutsideBin() {
  const types = Object.keys(GAME_CONFIG.garbageTypes);
  const acceptedCount = chance(0.38) ? 2 : 1;
  const acceptedTypes = [];

  while (acceptedTypes.length < acceptedCount) {
    const type = pickRandom(types);
    if (!acceptedTypes.includes(type)) acceptedTypes.push(type);
  }

  return {
    acceptedTypes,
    maxWeight: randomInt(300, 1200),
    baseRisk: randomInt(4, 28) / 100,
    safeStart: randomInt(26, 44)
  };
}

function openOutsideBinModal(outsideBin, options) {
  const safeWidth = randomInt(18, 28);
  outsideBin.safeEnd = Math.min(82, outsideBin.safeStart + safeWidth);
  outsideBin.usesPointer = chance(GAME_CONFIG.pointerGameChance);
  const timingGameHtml = outsideBin.usesPointer ? `
    <div class="mini-game">
      <div class="timing-track">
        <div class="safe-zone" id="safeZone"></div>
        <div class="pointer" id="timingPointer"></div>
      </div>
      <p class="hint">Green: perfect chance. Yellow: normal chance. Red: bad chance. Click when it feels right.</p>
      <div class="modal-actions">
        <button id="dropNowButton" class="primary-button">Drop Now</button>
      </div>
    </div>
  ` : `
    <div class="mini-game">
      <p class="hint">No timing bar today. You watch windows, pedestrians, and cameras, then gamble on the opening.</p>
      <div class="modal-actions">
        <button id="dropNowButton" class="primary-button">Observe and Drop</button>
      </div>
    </div>
  `;

  openModal("Outside Bin Window", `
    <p class="hint">Accepts: <strong>${outsideBin.acceptedTypes.map(getTrashName).join(", ")}</strong>. Max disposal ${outsideBin.maxWeight}g. Base detection risk ${percent(outsideBin.baseRisk)}.</p>
    <div class="form-grid">
      ${trashSelectHtml(options)}
      ${weightInputHtml(options[0], outsideBin.maxWeight)}
    </div>
    ${timingGameHtml}
  `);

  bindTrashWeightSync(options, outsideBin.maxWeight, outsideBin.maxWeight);
  if (outsideBin.usesPointer) {
    startPointerGame(outsideBin.safeStart, outsideBin.safeEnd);
  }

  document.getElementById("dropNowButton").addEventListener("click", () => {
    const type = getModalTrashType();
    const requested = getModalWeight(type, outsideBin.maxWeight);
    if (!requested) return;

    const result = outsideBin.usesPointer ? stopPointerGame(outsideBin) : rollDropOpportunity();
    const actual = Math.max(1, Math.min(
      requested,
      state.garbage[type].amount,
      Math.floor(outsideBin.maxWeight * result.capacityMultiplier)
    ));
    const risk = clamp(outsideBin.baseRisk + state.daily.outsideRiskBonus + result.riskModifier, 0.01, 0.85);

    reduceTrash(type, actual);
    if (chance(risk)) {
      applyFine(randomInt(...getMode().fineRange), `caught at outside bin: ${result.label}; disposed of ${actual}g of ${getTrashName(type)}`);
    } else {
      addLog(`Outside bin success: ${result.label}. Disposed of ${actual}g of ${getTrashName(type)}. Detection risk was ${percent(risk)}.`);
    }

    closeModal();
    checkGameEnd();
    saveAndRender();
  });
}

function startPointerGame(safeStart, safeEnd) {
  stopPointerGame();
  const safeZone = document.getElementById("safeZone");
  const pointer = document.getElementById("timingPointer");
  safeZone.style.left = `${safeStart}%`;
  safeZone.style.width = `${safeEnd - safeStart}%`;

  minigameState = {
    position: randomInt(0, 100),
    direction: chance(0.5) ? 1 : -1,
    safeStart,
    safeEnd
  };

  minigameTimer = window.setInterval(() => {
    if (!minigameState) return;
    minigameState.position += minigameState.direction * 2.2;
    if (minigameState.position >= 100) {
      minigameState.position = 100;
      minigameState.direction = -1;
    }
    if (minigameState.position <= 0) {
      minigameState.position = 0;
      minigameState.direction = 1;
    }
    pointer.style.left = `${minigameState.position}%`;
  }, 16);
}

function stopPointerGame(outsideBin) {
  if (minigameTimer) {
    window.clearInterval(minigameTimer);
    minigameTimer = null;
  }

  if (!outsideBin || !minigameState) {
    minigameState = null;
    return null;
  }

  const position = minigameState.position;
  const safe = position >= outsideBin.safeStart && position <= outsideBin.safeEnd;
  minigameState = null;

  if (safe) {
    return { label: "Perfect chance", capacityMultiplier: 1, riskModifier: -0.15 };
  }
  if (position < 16 || position > 84) {
    return { label: "Bad chance", capacityMultiplier: 0.4, riskModifier: 0.2 };
  }
  return { label: "Normal chance", capacityMultiplier: 0.7, riskModifier: 0 };
}

function rollDropOpportunity() {
  return weightedRandom([
    { value: { label: "Good read", capacityMultiplier: 1, riskModifier: -0.12 }, weight: 28 },
    { value: { label: "Normal chance", capacityMultiplier: 0.75, riskModifier: 0 }, weight: 52 },
    { value: { label: "Bad timing", capacityMultiplier: 0.45, riskModifier: 0.16 }, weight: 20 }
  ]);
}

function startBottleWalkAction() {
  if (chance(GAME_CONFIG.bottleGameChance)) {
    openBottleSearchGame();
    return;
  }

  const route = pickRandom(GAME_CONFIG.bottleRoutes);
  walkForBottles(route.id, false);
}

function openBottleSearchGame() {
  openModal("Search for Pfand Clues", "");
  bottleSearchState = {
    started: false,
    picksLeft: 3,
    tiles: createBottleSearchTiles()
  };
  renderBottleSearchGame();
}

function createBottleSearchTiles() {
  return Array.from({ length: 9 }, (_, index) => ({
    id: index,
    revealed: false,
    outcome: createBottleSearchOutcome()
  }));
}

function createBottleSearchOutcome() {
  return weightedRandom([
    { weight: 34, value: { label: "Bottle", bottles: [1, 2], text: "You find a few deposit bottles." } },
    { weight: 13, value: { label: "Bottle Bag", bottles: [3, 5], text: "Someone left a small bag of bottles nearby." } },
    { weight: 13, value: { label: "Coins", money: [0.3, 1.8], text: "There are a few coins in the gap." } },
    { weight: 5, value: { label: "Banknote", moneyChoices: [5, 10], text: "You find a crumpled banknote." } },
    { weight: 15, value: { label: "Gross Stuff", trashAdd: { residual: 90 }, text: "You uncover something you do not want to inspect." } },
    { weight: 20, value: { label: "Empty", text: "There is nothing here." } }
  ]);
}

function renderBottleSearchGame() {
  const tilesHtml = bottleSearchState.tiles.map((tile) => {
    const label = tile.revealed ? tile.outcome.label : "?";
    return `<button class="search-tile ${tile.revealed ? "revealed" : ""}" data-search-tile="${tile.id}" ${tile.revealed || bottleSearchState.picksLeft <= 0 ? "disabled" : ""}>${label}</button>`;
  }).join("");
  const status = bottleSearchState.started
    ? `${bottleSearchState.picksLeft} tile(s) left.`
    : "The first tile costs 1 action. You may reveal up to 3 tiles.";

  elements.modalBody.innerHTML = `
    <p class="hint">${status} Tiles may hide bottles, coins, banknotes, empty space, or new trash.</p>
    <div class="search-grid">${tilesHtml}</div>
    <div class="modal-actions">
      <button id="finishBottleSearchButton" class="secondary-button">Finish</button>
    </div>
  `;

  document.querySelectorAll("[data-search-tile]").forEach((button) => {
    button.addEventListener("click", () => revealBottleSearchTile(Number(button.dataset.searchTile)));
  });
  document.getElementById("finishBottleSearchButton").addEventListener("click", () => {
    closeModal();
    saveAndRender();
  });
}

function revealBottleSearchTile(tileId) {
  if (!bottleSearchState || bottleSearchState.picksLeft <= 0) return;
  const tile = bottleSearchState.tiles.find((item) => item.id === tileId);
  if (!tile || tile.revealed) return;

  if (!bottleSearchState.started) {
    if (state.actionsLeft <= 0) {
      addLog("No actions left today. Bottle searching must wait until tomorrow.");
      closeModal();
      saveAndRender();
      return;
    }
    consumeAction();
    bottleSearchState.started = true;
  }

  tile.revealed = true;
  bottleSearchState.picksLeft -= 1;
  applyBottleSearchOutcome(tile.outcome);
  renderBottleSearchGame();
  saveGame();
  render();
}

function applyBottleSearchOutcome(outcome) {
  if (outcome.bottles) {
    const wanted = resolveIntRange(outcome.bottles);
    const added = addRandomBottles(wanted);
    if (added > 0) addLog(`Search result: ${outcome.text} Gained ${added} bottle(s).`);
    if (added < wanted) addLog(pickRandom(GAME_CONFIG.messages.bottleFull));
    return;
  }

  if (outcome.money || outcome.moneyChoices) {
    const money = outcome.moneyChoices ? pickRandom(outcome.moneyChoices) : resolveMoneyRange(outcome.money);
    state.money = roundMoney(state.money + money);
    addLog(`Search result: ${outcome.text} Money +${formatMoney(money)}.`);
    return;
  }

  if (outcome.trashAdd) {
    Object.keys(outcome.trashAdd).forEach((type) => {
      if (state.garbage[type].unlocked) return;
      state.garbage[type].amount += outcome.trashAdd[type];
    });
    addLog(`Search result: ${outcome.text} Residual waste +${outcome.trashAdd.residual || 0}g.`);
    return;
  }

  addLog(`Search result: ${outcome.text}`);
}

function walkForBottles(routeId, fromMinigame) {
  const route = GAME_CONFIG.bottleRoutes.find((item) => item.id === routeId) || GAME_CONFIG.bottleRoutes[0];
  if (state.actionsLeft <= 0) {
    addLog("No actions left today. The bottles can only sparkle in your imagination.");
    closeModal();
    saveAndRender();
    return;
  }

  consumeAction();
  closeModal();

  const successChance = clamp(0.72 + state.daily.bottleFindBonus - state.daily.walkBottlePenalty + route.successBonus, 0.1, 0.95);
  if (!chance(successChance)) {
    addLog(`${route.name}: ${pickRandom(GAME_CONFIG.messages.noWalkBottles)}`);
    findStreetTreasure("walk", route.treasureBonus);
    saveAndRender();
    return;
  }

  const routeMax = state.daily.walkBottlePenalty > 0 ? Math.max(route.minBottles, Math.floor(route.maxBottles * 0.55)) : route.maxBottles;
  const count = randomInt(route.minBottles, routeMax);
  const added = addRandomBottles(count);
  const prefix = fromMinigame ? `${route.name}` : `Random walk to ${route.name}`;
  if (added > 0) addLog(`${prefix}: collected ${added} bottle(s).`);
  if (added < count) addLog(pickRandom(GAME_CONFIG.messages.bottleFull));
  findStreetTreasure("walk", route.treasureBonus);
  saveAndRender();
}

function redeemBottles() {
  const count = getBottleCount();
  if (count <= 0) {
    addLog("No bottles to redeem.");
    saveAndRender();
    return;
  }

  consumeAction();
  const money = getBottleValue();
  state.bottles = { small: 0, large: 0, glass: 0 };
  state.money = roundMoney(state.money + money);
  addLog(`Redeemed ${count} bottle(s) at the supermarket for ${formatMoney(money)}.`);
  saveAndRender();
}

function startCompressAction() {
  const options = getTrashOptions({ includeUnlocked: false });
  if (options.length === 0) {
    addLog("There is no trash at home that needs sorting or compression.");
    saveAndRender();
    return;
  }

  if (chance(GAME_CONFIG.compressGameChance)) {
    openCompressGame();
    return;
  }

  openCompressModal();
}

function openCompressGame() {
  openModal("Three-Move Sorting Challenge", "");
  compressGameState = {
    started: false,
    picksLeft: 3,
    tiles: createCompressGameTiles()
  };
  renderCompressGame();
}

function createCompressGameTiles() {
  return shuffleArray(GAME_CONFIG.compressPieces)
    .slice(0, 6)
    .map((piece, index) => ({
      id: index,
      revealed: false,
      piece
    }));
}

function renderCompressGame() {
  const tilesHtml = compressGameState.tiles.map((tile) => {
    return `
      <button class="organize-tile ${tile.revealed ? "revealed" : ""}" data-compress-tile="${tile.id}" ${tile.revealed || compressGameState.picksLeft <= 0 ? "disabled" : ""}>
        <strong>${tile.piece.label}</strong>
        <span>${tile.revealed ? tile.piece.text : "Click to sort"}</span>
      </button>
    `;
  }).join("");
  const status = compressGameState.started
    ? `${compressGameState.picksLeft} move(s) left.`
    : "The first click costs 1 action. You may sort up to 3 items.";

  elements.modalBody.innerHTML = `
    <p class="hint">${status} Different items affect different trash types, and some may uncover more junk.</p>
    <div class="organize-grid">${tilesHtml}</div>
    <div class="modal-actions">
      <button id="finishCompressGameButton" class="secondary-button">Finish</button>
    </div>
  `;

  document.querySelectorAll("[data-compress-tile]").forEach((button) => {
    button.addEventListener("click", () => revealCompressTile(Number(button.dataset.compressTile)));
  });
  document.getElementById("finishCompressGameButton").addEventListener("click", () => {
    closeModal();
    saveAndRender();
  });
}

function revealCompressTile(tileId) {
  if (!compressGameState || compressGameState.picksLeft <= 0) return;
  const tile = compressGameState.tiles.find((item) => item.id === tileId);
  if (!tile || tile.revealed) return;

  if (!compressGameState.started) {
    if (state.actionsLeft <= 0) {
      addLog("No actions left today. The sorting plan waits until tomorrow.");
      closeModal();
      saveAndRender();
      return;
    }
    consumeAction();
    compressGameState.started = true;
  }

  tile.revealed = true;
  compressGameState.picksLeft -= 1;
  const effectText = applyCompressGameEffect(tile.piece.effect);
  addLog(`Sorting result "${tile.piece.label}": ${tile.piece.text}${effectText ? ` ${effectText}` : ""}`);
  renderCompressGame();
  saveGame();
  render();
}

function applyCompressGameEffect(effect) {
  const effects = [];

  if (effect.trashReduce) {
    Object.keys(effect.trashReduce).forEach((type) => {
      const amount = Math.min(state.garbage[type].amount, effect.trashReduce[type]);
      reduceTrash(type, amount);
      if (amount > 0) effects.push(`${getTrashName(type)} -${amount}g`);
    });
  }

  if (effect.trashAdd) {
    Object.keys(effect.trashAdd).forEach((type) => {
      if (state.garbage[type].unlocked) return;
      const amount = effect.trashAdd[type];
      state.garbage[type].amount += amount;
      effects.push(`${getTrashName(type)} +${amount}g`);
    });
  }

  if (effect.storedDaysReduce) {
    Object.keys(effect.storedDaysReduce).forEach((type) => {
      const before = state.garbage[type].storedDays;
      state.garbage[type].storedDays = Math.max(0, before - effect.storedDaysReduce[type]);
      if (before !== state.garbage[type].storedDays) effects.push(`${getTrashName(type)} storage days -${before - state.garbage[type].storedDays}`);
    });
  }

  if (effect.indoorLimit) {
    state.daily.indoorLimit = Math.max(0, state.daily.indoorLimit + effect.indoorLimit);
    effects.push(`building quota +${effect.indoorLimit}g`);
  }

  return effects.length ? `Effect: ${effects.join(", ")}.` : "No obvious effect.";
}

function openCompressModal() {
  const options = getTrashOptions({ includeUnlocked: false });
  if (options.length === 0) {
    addLog("There is no trash at home that needs sorting or compression.");
    saveAndRender();
    return;
  }

  openModal("Sort and Compress at Home", `
    <p class="hint">Costs 1 action. Packaging, boxes, and junk shrink by 10%-25%; organic waste can shrink by at most 10%. Storage days -1.</p>
    <div class="form-grid">
      ${trashSelectHtml(options)}
      <div class="modal-actions">
        <button id="confirmCompressButton" class="primary-button">Start Sorting</button>
      </div>
    </div>
  `);

  document.getElementById("confirmCompressButton").addEventListener("click", () => {
    const type = getModalTrashType();
    consumeAction();
    const rate = type === "bio" ? 0.1 : randomInt(10, 25) / 100;
    const before = state.garbage[type].amount;
    const reduced = Math.max(1, Math.floor(before * rate));
    state.garbage[type].amount = Math.max(0, before - reduced);
    state.garbage[type].storedDays = Math.max(0, state.garbage[type].storedDays - 1);
    addLog(`Sorted ${getTrashName(type)} at home, reducing it by ${reduced}g and lowering storage pressure by 1 day.`);
    closeModal();
    saveAndRender();
  });
}

function openUnlockModal() {
  const lockedTypes = Object.keys(GAME_CONFIG.garbageTypes).filter((type) => !state.garbage[type].unlocked);
  if (lockedTypes.length === 0) {
    checkGameEnd();
    saveAndRender();
    return;
  }

  const choices = lockedTypes.map((type) => {
    const price = getUnlockPrice(type);
    const disabled = state.money < price ? "disabled" : "";
    return `
      <button class="choice-button" data-unlock-type="${type}" ${disabled}>
        <span>${getTrashName(type)} Freedom</span>
        <strong>${formatMoney(price)}</strong>
      </button>
    `;
  }).join("");

  openModal("Unlock Disposal Freedom", `
    <p class="hint">Once unlocked, this trash type clears automatically every day and no longer depends on building or outside bins. Unlocking does not cost an action.</p>
    <div class="choice-list">${choices}</div>
  `);

  document.querySelectorAll("[data-unlock-type]").forEach((button) => {
    button.addEventListener("click", () => {
      const type = button.dataset.unlockType;
      const price = getUnlockPrice(type);
      if (state.money < price) return;
      state.money = roundMoney(state.money - price);
      state.garbage[type].unlocked = true;
      state.garbage[type].amount = 0;
      state.garbage[type].storedDays = 0;
      addLog(`Spent ${formatMoney(price)} to unlock ${getTrashName(type)} freedom. This trash type now clears automatically.`);
      closeModal();
      checkGameEnd();
      saveAndRender();
    });
  });
}

function endDay() {
  addLog(`Day ${state.day} ends. Daily settlement begins.`);

  Object.keys(GAME_CONFIG.garbageTypes).forEach((type) => {
    if (state.garbage[type].unlocked) {
      state.garbage[type].amount = 0;
      state.garbage[type].storedDays = 0;
    } else if (state.garbage[type].amount > 0) {
      state.garbage[type].storedDays += 1;
    }
  });

  const hadLimitProblem = applyOverLimitPenalties();
  state.consecutiveOverLimitDays = hadLimitProblem ? state.consecutiveOverLimitDays + 1 : 0;

  checkGameEnd();
  if (state.status === "playing") {
    state.day += 1;
    startDay();
  }

  saveAndRender();
}

function applyOverLimitPenalties() {
  let hadProblem = false;
  Object.keys(GAME_CONFIG.garbageTypes).forEach((type) => {
    const config = getAdjustedTrashConfig(type);
    const trash = state.garbage[type];
    if (trash.unlocked || trash.amount <= 0) return;

    if (trash.amount > config.maxCapacity) {
      hadProblem = true;
      const baseFine = randomInt(3, 8);
      const fine = roundMoney(baseFine * GAME_CONFIG.garbageTypes[type].bioPenaltyMultiplier);
      applyFine(fine, `${getTrashName(type)} exceeded home capacity: smell, lack of space, mental pressure`);
    }

    if (trash.storedDays > config.maxDays) {
      hadProblem = true;
      const baseFine = randomInt(2, 6);
      const fine = roundMoney(baseFine * GAME_CONFIG.garbageTypes[type].bioPenaltyMultiplier);
      applyFine(fine, `${getTrashName(type)} stored too long: room smell and neighbor-complaint risk rise`);
    }
  });
  return hadProblem;
}

function checkGameEnd() {
  if (!state || state.status !== "playing") return;

  const unlocked = getUnlockedCount();
  if (unlocked === Object.keys(GAME_CONFIG.garbageTypes).length) {
    state.status = "won";
    state.resultMessage = `Victory: on day ${state.day}, you unlocked all four trash freedoms. German apartment life is finally quiet.`;
    addLog(state.resultMessage);
    return;
  }

  if (state.day >= GAME_CONFIG.winDay && unlocked >= 2) {
    state.status = "won";
    state.resultMessage = `Cleared: survived until day ${GAME_CONFIG.winDay} and unlocked at least 2 trash freedoms.`;
    addLog(state.resultMessage);
    return;
  }

  if (state.money < -30) {
    state.status = "lost";
    state.resultMessage = "Failure: money dropped below -30 EUR. Even the Pfand system cannot save this month.";
    addLog(state.resultMessage);
    return;
  }

  if (state.consecutiveOverLimitDays >= 3) {
    state.status = "lost";
    state.resultMessage = "Failure: trash was over limit for 3 days in a row. The room has entered an unspeakable state.";
    addLog(state.resultMessage);
    return;
  }

  if (state.fineCount >= GAME_CONFIG.maxFineCount) {
    state.status = "lost";
    state.resultMessage = `Failure: total fines reached ${GAME_CONFIG.maxFineCount}. Neighbor relations are officially bankrupt.`;
    addLog(state.resultMessage);
  }
}

function consumeAction() {
  state.actionsLeft = Math.max(0, state.actionsLeft - 1);
}

function reduceTrash(type, amount) {
  state.garbage[type].amount = Math.max(0, state.garbage[type].amount - amount);
  if (state.garbage[type].amount === 0) state.garbage[type].storedDays = 0;
}

function applyFine(amount, reason) {
  state.money = roundMoney(state.money - amount);
  state.fineCount += 1;
  addLog(`Fine ${formatMoney(amount)}: ${reason}.`);
}

function findStreetTreasure(source, extraBonus = 0) {
  const baseChance = GAME_CONFIG.streetFindChances[source] || 0;
  const bonus = state.daily.streetFindBonus || 0;
  const probability = clamp(baseChance + bonus + extraBonus, 0, 0.75);
  if (!chance(probability)) return;

  const find = weightedRandom(GAME_CONFIG.streetFinds.map((item) => ({
    value: item,
    weight: item.weight
  })));
  const multiplier = state.daily.streetFindMoneyMultiplier || 1;
  const money = find.moneyChoices
    ? pickRandom(find.moneyChoices)
    : roundMoney(randomMoney(find.minMoney, find.maxMoney) * multiplier);
  state.money = roundMoney(state.money + money);

  const place = source === "outsideBin" ? "near the bins" : "while walking";
  addLog(`You found ${find.name} ${place} and turned it into ${formatMoney(money)}.`);
}

function addRandomBottles(count) {
  const bottleKeys = Object.keys(GAME_CONFIG.bottleTypes);
  let added = 0;
  const availableSpace = getBottleSpace();
  const target = Math.min(count, availableSpace);
  for (let index = 0; index < target; index += 1) {
    const type = weightedRandom([
      { value: "small", weight: 45 },
      { value: "large", weight: 35 },
      { value: "glass", weight: 20 }
    ]);
    if (!bottleKeys.includes(type)) continue;
    state.bottles[type] += 1;
    added += 1;
  }
  return added;
}

function getTrashOptions({ includeUnlocked }) {
  return Object.keys(GAME_CONFIG.garbageTypes)
    .filter((type) => (includeUnlocked || !state.garbage[type].unlocked) && state.garbage[type].amount > 0)
    .map((type) => ({ type, amount: state.garbage[type].amount }));
}

function getModalTrashType() {
  return document.getElementById("trashTypeSelect").value;
}

function getModalWeight(type, actionMax = Infinity) {
  const input = document.getElementById("trashWeightInput");
  const max = Math.min(state.garbage[type].amount, actionMax);
  const value = Math.round(Number(input.value));
  const safeValue = clamp(Number.isFinite(value) ? value : 0, 1, max);
  input.value = safeValue;
  return safeValue;
}

function bindTrashWeightSync(options, actionMax = Infinity, defaultLimit = actionMax) {
  const select = document.getElementById("trashTypeSelect");
  const input = document.getElementById("trashWeightInput");
  const sync = (resetValue) => {
    const type = select.value;
    const max = Math.min(state.garbage[type].amount, actionMax);
    const defaultValue = Math.max(1, Math.min(max, defaultLimit));
    input.max = max;
    if (resetValue) {
      input.value = defaultValue;
      return;
    }
    if (Number(input.value) > max) input.value = max;
    if (Number(input.value) <= 0) input.value = defaultValue;
  };
  select.addEventListener("change", () => sync(true));
  input.addEventListener("input", () => sync(false));
  sync(false);
}

function trashSelectHtml(options) {
  const optionHtml = options.map((item) => {
    return `<option value="${item.type}">${getTrashName(item.type)} (${item.amount}g)</option>`;
  }).join("");

  return `
    <div class="field">
      <label for="trashTypeSelect">Trash Type</label>
      <select id="trashTypeSelect">${optionHtml}</select>
    </div>
  `;
}

function weightInputHtml(option, actionMax = Infinity, defaultLimit = actionMax) {
  const max = Math.min(option.amount, actionMax);
  const value = Math.max(1, Math.min(max, defaultLimit));
  return `
    <div class="field">
      <label for="trashWeightInput">Weight g</label>
      <input id="trashWeightInput" type="number" min="1" max="${max}" step="50" value="${value}">
    </div>
  `;
}

function openModal(title, bodyHtml) {
  closeModal();
  elements.modalTitle.textContent = title;
  elements.modalBody.innerHTML = bodyHtml;
  elements.modalBackdrop.classList.remove("hidden");
}

function closeModal() {
  stopPointerGame();
  bottleSearchState = null;
  compressGameState = null;
  elements.modalBackdrop.classList.add("hidden");
  elements.modalBody.innerHTML = "";
}

function render() {
  const hasState = Boolean(state);
  elements.startScreen.classList.toggle("hidden", hasState);
  elements.gameScreen.classList.toggle("hidden", !hasState);
  updateStartButtons();
  if (!state) return;

  elements.dayValue.textContent = state.day;
  elements.modeValue.textContent = getMode().label;
  elements.moneyValue.textContent = formatMoney(state.money);
  elements.actionsValue.textContent = state.actionsLeft;
  elements.bottlesValue.textContent = `${getBottleCount()} / ${GAME_CONFIG.maxBottles}`;
  elements.finesValue.textContent = `${state.fineCount} / ${GAME_CONFIG.maxFineCount}`;
  elements.goalValue.textContent = `${getUnlockedCount()} / 4 freedoms`;
  elements.limitStreakValue.textContent = `${state.consecutiveOverLimitDays} over-limit day(s) in a row`;

  renderDailySummary();
  renderOpportunityPanel();
  renderGarbageCards();
  renderActionButtons();
  renderLogs();
  renderResult();
}

function renderDailySummary() {
  if (!state.daily) {
    elements.dailySummary.textContent = "A new day begins.";
    return;
  }

  const events = state.daily.eventTexts.length ? state.daily.eventTexts.join(" ") : "No special events today.";
  elements.dailySummary.textContent = `${events} Building-bin safe quota remaining: ${state.daily.indoorLimit}g.`;
}

function renderOpportunityPanel() {
  const opportunity = state.daily?.opportunity;
  if (!opportunity) {
    elements.opportunityPanel.classList.add("hidden");
    elements.opportunityPanel.innerHTML = "";
    return;
  }

  const costText = opportunity.actionCost > 0 ? `costs ${opportunity.actionCost} action(s)` : "costs no action";
  const disabled = opportunity.used || state.status !== "playing" || state.actionsLeft < opportunity.actionCost;
  const buttonText = opportunity.used ? "Resolved" : "Try Opportunity";
  const resultText = opportunity.used ? `<p class="hint">Result: ${opportunity.result}</p>` : "";

  elements.opportunityPanel.classList.remove("hidden");
  elements.opportunityPanel.innerHTML = `
    <div class="opportunity-content">
      <div>
        <h2>Today's Opportunity: ${opportunity.title}</h2>
        <p>${opportunity.text} ${costText}.</p>
        ${resultText}
      </div>
      <button data-accept-opportunity class="primary-button" ${disabled ? "disabled" : ""}>${buttonText}</button>
    </div>
  `;
}

function renderGarbageCards() {
  elements.garbageCards.innerHTML = Object.keys(GAME_CONFIG.garbageTypes).map((type) => {
    const config = getAdjustedTrashConfig(type);
    const baseConfig = GAME_CONFIG.garbageTypes[type];
    const trash = state.garbage[type];
    const capacityRatio = trash.amount / config.maxCapacity;
    const dayRatio = trash.storedDays / config.maxDays;
    const danger = capacityRatio >= 1 || dayRatio > 1;
    const warning = capacityRatio >= 0.75 || dayRatio >= 0.75;
    const fillColor = danger ? "var(--danger)" : warning ? "var(--warning)" : baseConfig.color;
    const fillWidth = Math.min(100, Math.round(Math.max(capacityRatio, dayRatio) * 100));
    const unlocked = trash.unlocked ? `<span class="badge">Freedom unlocked</span>` : `<span class="badge" style="background:#f0e4d3;color:#5f4c37;">Locked</span>`;

    return `
      <article class="garbage-card ${danger ? "danger" : ""}">
        <div class="garbage-title">
          <span><span class="trash-dot" style="background:${baseConfig.color}"></span> ${baseConfig.name}</span>
        </div>
        <div class="trash-meta">
          <span>${baseConfig.german}</span>
          <span>Weight: ${trash.amount}g / ${config.maxCapacity}g</span>
          <span>Stored: ${trash.storedDays} day(s) / ${config.maxDays} day(s)</span>
          <span>Remaining capacity: ${Math.max(0, config.maxCapacity - trash.amount)}g</span>
        </div>
        <div class="progress" aria-label="${baseConfig.name} pressure">
          <div class="progress-fill" style="width:${fillWidth}%;background:${fillColor};"></div>
        </div>
        ${unlocked}
      </article>
    `;
  }).join("");
}

function renderActionButtons() {
  document.querySelectorAll("[data-action]").forEach((button) => {
    const action = button.dataset.action;
    const gameOver = state.status !== "playing";
    const noActions = state.actionsLeft <= 0;
    button.disabled = gameOver || (noActions && action !== "end-day" && action !== "unlock-freedom");
  });
}

function renderLogs() {
  elements.logList.innerHTML = state.logs.map((entry) => `<li>${entry}</li>`).join("");
}

function renderResult() {
  elements.resultPanel.className = "result-panel hidden";
  elements.resultPanel.textContent = "";
  if (state.status === "playing") return;

  elements.resultPanel.classList.remove("hidden");
  elements.resultPanel.classList.add(state.status === "won" ? "win" : "lose");
  elements.resultPanel.innerHTML = `
    <h2>${state.status === "won" ? "Result: Cleared" : "Result: Failed"}</h2>
    <p>${state.resultMessage}</p>
    <p>Final: day ${state.day}, ${formatMoney(state.money)}, ${getBottleCount()} bottle(s), ${state.fineCount} fine(s), ${getUnlockedCount()} / 4 freedoms unlocked.</p>
  `;
}

function saveAndRender() {
  saveGame();
  render();
}

function saveGame() {
  if (!state) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  updateStartButtons();
}

function loadGame() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.garbage || !parsed.mode) return null;
    return parsed;
  } catch (error) {
    return null;
  }
}

function updateStartButtons() {
  elements.continueButton.disabled = !localStorage.getItem(STORAGE_KEY);
}

function addLog(message) {
  if (!state) return;
  state.logs.unshift(message);
  state.logs = state.logs.slice(0, GAME_CONFIG.maxLogs);
}

function getMode() {
  return GAME_CONFIG.modes[state.mode];
}

function getAdjustedTrashConfig(type) {
  const base = GAME_CONFIG.garbageTypes[type];
  return {
    ...base,
    maxCapacity: Math.round(base.maxCapacity * getMode().capacityMultiplier)
  };
}

function getTrashName(type) {
  return GAME_CONFIG.garbageTypes[type].name;
}

function getUnlockPrice(type) {
  return roundMoney(GAME_CONFIG.garbageTypes[type].unlockPrice * getMode().unlockPriceMultiplier);
}

function getUnlockedCount() {
  return Object.keys(GAME_CONFIG.garbageTypes).filter((type) => state.garbage[type].unlocked).length;
}

function getBottleCount() {
  return Object.values(state.bottles).reduce((sum, count) => sum + count, 0);
}

function getBottleSpace() {
  return Math.max(0, GAME_CONFIG.maxBottles - getBottleCount());
}

function getBottleValue() {
  return Object.keys(state.bottles).reduce((sum, type) => {
    return sum + state.bottles[type] * GAME_CONFIG.bottleTypes[type].value;
  }, 0);
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomMoney(min, max) {
  return roundMoney(min + Math.random() * (max - min));
}

function chance(probability) {
  return Math.random() < probability;
}

function pickRandom(array) {
  return array[randomInt(0, array.length - 1)];
}

function shuffleArray(array) {
  const copy = [...array];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(0, index);
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function weightedRandom(options) {
  const total = options.reduce((sum, option) => sum + option.weight, 0);
  let roll = Math.random() * total;
  for (const option of options) {
    roll -= option.weight;
    if (roll <= 0) return option.value;
  }
  return options[options.length - 1].value;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function roundMoney(value) {
  return Math.round(value * 100) / 100;
}

function formatMoney(value) {
  return `${roundMoney(value).toFixed(2)} EUR`;
}

function percent(value) {
  return `${Math.round(value * 100)}%`;
}
