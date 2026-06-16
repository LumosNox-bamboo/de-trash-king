"use strict";

const STORAGE_KEY = "trashQueenMobileSaveV1";

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
      name: "超市后门",
      text: "Pfand 味很浓，竞争也很激烈。",
      successBonus: 0.08,
      minBottles: 2,
      maxBottles: 7,
      treasureBonus: 0.02
    },
    {
      id: "park",
      name: "公园长椅",
      text: "路线轻松，收获稳定但不会太夸张。",
      successBonus: 0,
      minBottles: 1,
      maxBottles: 5,
      treasureBonus: 0.08
    },
    {
      id: "station",
      name: "车站周边",
      text: "瓶子多，但空手而归的概率也高。",
      successBonus: -0.08,
      minBottles: 3,
      maxBottles: 10,
      treasureBonus: 0.04
    }
  ],
  compressPieces: [
    {
      label: "拆平刷纸盒",
      text: "把纸盒拆开压平。",
      effect: { trashReduce: { recycling: 260, packaging: 80 }, storedDaysReduce: { recycling: 1 } }
    },
    {
      label: "压缩黄袋",
      text: "把包装袋里的空气挤出去。",
      effect: { trashReduce: { packaging: 260 }, storedDaysReduce: { packaging: 1 } }
    },
    {
      label: "扎紧厨余袋",
      text: "减少味道扩散，但厨余不能压太狠。",
      effect: { trashReduce: { bio: 80 }, storedDaysReduce: { bio: 1 } }
    },
    {
      label: "杂物重分拣",
      text: "把能回收的东西从其他垃圾里挑出来。",
      effect: { trashReduce: { residual: 180 }, trashAdd: { recycling: 60 }, storedDaysReduce: { residual: 1 } }
    },
    {
      label: "找到备用垃圾袋",
      text: "收纳变顺手，楼内安全额度临时增加。",
      effect: { indoorLimit: 160 }
    },
    {
      label: "整理过头",
      text: "翻出一堆之前没看见的小垃圾。",
      effect: { trashAdd: { residual: 120 } }
    },
    {
      label: "瓶子角落归位",
      text: "把瓶子袋挪到不挡路的位置。",
      effect: { storedDaysReduce: { packaging: 1, recycling: 1 }, indoorLimit: 80 }
    },
    {
      label: "清出旧传单",
      text: "传单不重，但很占地方。",
      effect: { trashReduce: { recycling: 160 }, trashAdd: { residual: 40 } }
    }
  ],
  messages: {
    noOutsideBin: [
      "你绕了两条街，只发现了写着 Hausverwaltung 的警告纸。没有找到可用垃圾桶。",
      "外面的桶都上了锁，像在防什么国际垃圾犯。今天没找到可用垃圾桶。",
      "你找到一个桶，但上面贴着只属于本楼住户。理智让你转身离开。",
      "街角的垃圾桶刚被清空，干净得让人绝望。今天没有机会。",
      "你听见楼上窗户打开的声音，决定先保住邻里关系。没有找到安全垃圾桶。"
    ],
    noWalkBottles: [
      "散步一圈，只收获了鞋底的雨水和德国街区的安静。",
      "今天瓶子像被专业队扫过，一路上只剩瓶盖。",
      "你看见一个瓶子，走近才发现是没有 Pfand 的装饰品。",
      "路人手里的 Club-Mate 都还没喝完，你来早了。",
      "垃圾桶旁很干净，干净到让人怀疑这里有隐藏竞争者。"
    ],
    bottleFull: [
      "瓶子袋已经满了，再放下去真的会开始有味道。",
      "家里的瓶子角落到达上限，理智建议先去超市换押金。",
      "瓶子库存塞满了，继续捡只会制造新的生活压力。"
    ]
  },
  streetFindChances: {
    outsideBin: 0.18,
    walk: 0.12
  },
  streetFinds: [
    { name: "几枚硬币", minMoney: 0.3, maxMoney: 1.8, weight: 45 },
    { name: "夹着书签的二手书", minMoney: 1.2, maxMoney: 4.5, weight: 26 },
    { name: "还能用的小家具", minMoney: 4, maxMoney: 11, weight: 14 },
    { name: "皱巴巴的纸币", moneyChoices: [5, 10], weight: 10 },
    { name: "没人要但成色不错的台灯", minMoney: 3, maxMoney: 8, weight: 5 }
  ],
  opportunityChance: 0.68,
  opportunities: [
    {
      title: "帮邻居搬纸箱",
      text: "邻居在门口堆了一车纸箱。帮忙可能赚钱，也可能把纸箱压力转移到你家。",
      actionCost: 1,
      outcomes: [
        { weight: 45, label: "邻居很感激", money: [5, 9], trashAdd: { recycling: 180 } },
        { weight: 35, label: "纸箱比想象中多", money: [2, 5], trashAdd: { recycling: 360, packaging: 120 } },
        { weight: 20, label: "只得到一句 danke", trashAdd: { recycling: 220 } }
      ]
    },
    {
      title: "路边 Sperrmüll 淘货",
      text: "路边摆着一堆大件垃圾。可能淘到好东西，也可能只是把杂物带回家。",
      actionCost: 1,
      outcomes: [
        { weight: 35, label: "淘到能卖的小家具", money: [8, 18], trashAdd: { residual: 120 } },
        { weight: 45, label: "捡到一些可回收材料", money: [1, 4], trashAdd: { recycling: 160 } },
        { weight: 20, label: "搬回来的都是麻烦", trashAdd: { residual: 320 } }
      ]
    },
    {
      title: "垃圾房门没锁",
      text: "楼内垃圾房门今天虚掩着。机会难得，但动静不能太大。",
      actionCost: 1,
      outcomes: [
        { weight: 50, label: "顺利摸清路线", indoorLimit: 650 },
        { weight: 30, label: "只多争取到一点空间", indoorLimit: 250 },
        { weight: 20, label: "门突然响了一声", indoorLimit: 150, outsideRiskBonus: 0.08 }
      ]
    },
    {
      title: "同学求带饭",
      text: "同学愿意给跑腿费，但外卖盒和厨余会留在你这里。",
      actionCost: 1,
      outcomes: [
        { weight: 50, label: "跑腿费到账", money: [4, 8], trashAdd: { packaging: 180, bio: 80 } },
        { weight: 30, label: "对方还多点了饮料", money: [5, 9], bottles: [1, 3], trashAdd: { packaging: 260 } },
        { weight: 20, label: "被临时砍价", money: [1, 3], trashAdd: { packaging: 220, bio: 120 } }
      ]
    },
    {
      title: "Pfand 路线规划",
      text: "你研究出一条可能有瓶子的路线。收益看运气。",
      actionCost: 1,
      outcomes: [
        { weight: 35, label: "路线很肥", bottles: [5, 10] },
        { weight: 45, label: "普通收获", bottles: [2, 5] },
        { weight: 20, label: "基本被人捡完了", bottles: [0, 1] }
      ]
    },
    {
      title: "分类强迫症爆发",
      text: "你突然想把家里的垃圾重新拆开、压平、分类。",
      actionCost: 1,
      outcomes: [
        { weight: 45, label: "整理得很成功", trashReduce: { packaging: 320, recycling: 260, residual: 120 } },
        { weight: 35, label: "只整理出一点空间", trashReduce: { packaging: 180, recycling: 120 } },
        { weight: 20, label: "越理越乱", trashAdd: { residual: 100 }, trashReduce: { packaging: 80 } }
      ]
    },
    {
      title: "临时线上问卷",
      text: "学生群里有人发有偿问卷。钱不多，但不用出门。",
      actionCost: 0,
      outcomes: [
        { weight: 60, label: "问卷顺利通过", money: [1, 3] },
        { weight: 25, label: "抽中了额外奖励", money: [4, 7] },
        { weight: 15, label: "填完才发现没报酬" }
      ]
    },
    {
      title: "楼道短暂无人",
      text: "猫眼里看了一圈，楼道今天异常安静。",
      actionCost: 0,
      outcomes: [
        { weight: 55, label: "今天偷丢更安全", indoorLimit: 220, outsideRiskBonus: -0.06 },
        { weight: 30, label: "只是错觉", indoorLimit: 80 },
        { weight: 15, label: "隔壁门忽然开了", outsideRiskBonus: 0.08 }
      ]
    }
  ],
  bottleTypes: {
    small: { label: "小瓶", value: 0.25 },
    large: { label: "大瓶", value: 0.25 },
    glass: { label: "玻璃瓶", value: 0.08 }
  },
  modes: {
    easy: {
      label: "简单",
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
      label: "困难",
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
      name: "厨余垃圾",
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
      name: "包装垃圾",
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
      name: "可回收垃圾",
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
      name: "其他垃圾",
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
    name: "今天在外面吃饭",
    text: "厨余 -60%，包装 -30%。",
    apply(daily) {
      daily.trashMultiplier.bio *= 0.4;
      daily.trashMultiplier.packaging *= 0.7;
    }
  },
  {
    name: "朋友来家里玩",
    text: "包装 +300g，其他垃圾 +200g，可回收 +150g。",
    apply(daily) {
      daily.trashAdd.packaging += 300;
      daily.trashAdd.residual += 200;
      daily.trashAdd.recycling += 150;
    }
  },
  {
    name: "做了一顿大餐",
    text: "厨余 +500g，包装 +100g。",
    apply(daily) {
      daily.trashAdd.bio += 500;
      daily.trashAdd.packaging += 100;
    }
  },
  {
    name: "今天太忙，只点了外卖",
    text: "包装 +450g，其他垃圾 +120g，厨余 -100g。",
    apply(daily) {
      daily.trashAdd.packaging += 450;
      daily.trashAdd.residual += 120;
      daily.trashAdd.bio -= 100;
    }
  },
  {
    name: "邻居格外警惕",
    text: "当天外面扔垃圾被发现概率 +15%。",
    apply(daily) {
      daily.outsideRiskBonus += 0.15;
    }
  },
  {
    name: "下雨，不适合出门",
    text: "当天行动次数 -1，散步捡瓶子收益下降。",
    apply(daily) {
      daily.actionsModifier -= 1;
      daily.walkBottlePenalty += 0.25;
    }
  },
  {
    name: "附近有活动结束",
    text: "外面垃圾桶出现概率 +20%，捡到瓶子的概率 +25%。",
    apply(daily) {
      daily.outsideFindBonus += 0.2;
      daily.bottleFindBonus += 0.25;
    }
  },
  {
    name: "房间整理日",
    text: "其他垃圾 +500g，可回收 +250g。",
    apply(daily) {
      daily.trashAdd.residual += 500;
      daily.trashAdd.recycling += 250;
    }
  },
  {
    name: "今天很节俭",
    text: "所有垃圾 -20%，金钱 +0.5 欧元。",
    apply(daily) {
      Object.keys(GAME_CONFIG.garbageTypes).forEach((type) => {
        daily.trashMultiplier[type] *= 0.8;
      });
      daily.moneyAdd += 0.5;
    }
  },
  {
    name: "楼管巡查",
    text: "楼内垃圾桶可丢重量下降，强行丢太多罚款概率上升。",
    apply(daily) {
      daily.indoorLimitMultiplier *= 0.65;
      daily.indoorRiskBonus += 0.18;
    }
  },
  {
    name: "楼下有人搬家",
    text: "外面垃圾桶出现概率 +10%，翻到值钱东西概率 +25%。",
    apply(daily) {
      daily.outsideFindBonus += 0.1;
      daily.streetFindBonus += 0.25;
    }
  },
  {
    name: "考试周到了",
    text: "行动次数 -1，可回收垃圾 +220g，包装 +120g。",
    apply(daily) {
      daily.actionsModifier -= 1;
      daily.trashAdd.recycling += 220;
      daily.trashAdd.packaging += 120;
    }
  },
  {
    name: "兼职发了小费",
    text: "金钱 +2-6 欧元。",
    apply(daily) {
      daily.moneyAdd += randomMoney(2, 6);
    }
  },
  {
    name: "超市打折买太多",
    text: "包装 +260g，厨余 +180g，金钱 -1.5 欧元。",
    apply(daily) {
      daily.trashAdd.packaging += 260;
      daily.trashAdd.bio += 180;
      daily.moneyAdd -= 1.5;
    }
  },
  {
    name: "房东群消息轰炸",
    text: "楼内和外面扔垃圾被发现概率都上升。",
    apply(daily) {
      daily.indoorRiskBonus += 0.12;
      daily.outsideRiskBonus += 0.1;
    }
  },
  {
    name: "社区跳蚤市场",
    text: "翻到书本或小家具时收益更高。",
    apply(daily) {
      daily.streetFindBonus += 0.12;
      daily.streetFindMoneyMultiplier += 0.55;
    }
  },
  {
    name: "Pfand 好运日",
    text: "捡到瓶子的概率 +35%。",
    apply(daily) {
      daily.bottleFindBonus += 0.35;
    }
  },
  {
    name: "邻居送来多余面包",
    text: "金钱 +1 欧元，但厨余 +160g。",
    apply(daily) {
      daily.moneyAdd += 1;
      daily.trashAdd.bio += 160;
    }
  },
  {
    name: "地下室公告栏有免费区",
    text: "翻到值钱东西概率 +18%，但其他垃圾 +120g。",
    apply(daily) {
      daily.streetFindBonus += 0.18;
      daily.trashAdd.residual += 120;
    }
  },
  {
    name: "邻居出差了",
    text: "楼内和外面扔垃圾被发现概率下降。",
    apply(daily) {
      daily.indoorRiskBonus -= 0.12;
      daily.outsideRiskBonus -= 0.12;
    }
  },
  {
    name: "Hausmeister 心情不错",
    text: "楼内垃圾桶安全额度上升，被发现概率下降。",
    apply(daily) {
      daily.indoorLimitMultiplier *= 1.25;
      daily.indoorRiskBonus -= 0.1;
    }
  },
  {
    name: "Gelber Sack 收运日",
    text: "包装垃圾 -250g，外面垃圾桶出现概率 +10%。",
    apply(daily) {
      daily.trashAdd.packaging -= 250;
      daily.outsideFindBonus += 0.1;
    }
  },
  {
    name: "食堂免费晚餐",
    text: "厨余 -40%，金钱 +1 欧元。",
    apply(daily) {
      daily.trashMultiplier.bio *= 0.6;
      daily.moneyAdd += 1;
    }
  },
  {
    name: "周末宅家追剧",
    text: "行动次数 +1，包装 +180g，其他垃圾 +90g。",
    apply(daily) {
      daily.actionsModifier += 1;
      daily.trashAdd.packaging += 180;
      daily.trashAdd.residual += 90;
    }
  },
  {
    name: "超市 Pfand 机器排长队",
    text: "今天去超市换押金心情很差，行动次数 -1。",
    apply(daily) {
      daily.actionsModifier -= 1;
    }
  },
  {
    name: "垃圾分类讲座突然有用",
    text: "所有垃圾 -10%，楼内被发现概率下降。",
    apply(daily) {
      Object.keys(GAME_CONFIG.garbageTypes).forEach((type) => {
        daily.trashMultiplier[type] *= 0.9;
      });
      daily.indoorRiskBonus -= 0.08;
    }
  },
  {
    name: "厨房冰箱清理失败",
    text: "厨余 +420g，其他垃圾 +80g。",
    apply(daily) {
      daily.trashAdd.bio += 420;
      daily.trashAdd.residual += 80;
    }
  },
  {
    name: "路边 Sperrmüll 日",
    text: "翻到值钱东西概率 +30%，外面垃圾桶出现概率 +10%。",
    apply(daily) {
      daily.streetFindBonus += 0.3;
      daily.outsideFindBonus += 0.1;
    }
  },
  {
    name: "邻居主动打招呼",
    text: "今天外面扔垃圾被发现概率下降，但压力感更强，包装 +60g。",
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
  addLog(`新游戏开始：${GAME_CONFIG.modes[mode].label}模式。`);
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
    addLog("今天没有行动次数了，只能结束当天。");
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
    eventTexts: events.map((event) => `${event.name}：${event.text}`),
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

  const eventText = events.length ? events.map((event) => event.name).join("、") : "无特殊事件";
  addLog(`第 ${state.day} 天开始。今日事件：${eventText}。楼内安全额度 ${state.daily.indoorLimit}g。`);
  if (state.daily.opportunity) {
    addLog(`今日奇遇出现：${state.daily.opportunity.title}。`);
  }
  const generatedText = Object.keys(GAME_CONFIG.garbageTypes)
    .map((type) => `${GAME_CONFIG.garbageTypes[type].name} ${state.daily.trashGenerated[type]}g`)
    .join("，");
  addLog(`今日新增垃圾：${generatedText}。`);
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
    addLog("家里没有需要偷偷丢的垃圾。");
    saveAndRender();
    return;
  }

  openModal("楼内垃圾桶", `
    <p class="hint">今日楼内剩余安全额度：<strong>${state.daily.indoorLimit}g</strong>。超过额度可能被楼管或邻居发现。</p>
    <div class="form-grid">
      ${trashSelectHtml(options)}
      ${weightInputHtml(options[0], Infinity, state.daily.indoorLimit)}
      <div class="modal-actions">
        <button id="confirmIndoorButton" class="primary-button">丢进楼内垃圾桶</button>
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
      addLog(`楼内垃圾桶成功处理 ${getTrashName(type)} ${requested}g，动作很轻，门也没有响。`);
    } else {
      const overAmount = requested - state.daily.indoorLimit;
      const risk = clamp(getMode().indoorOverRisk + state.daily.indoorRiskBonus + overAmount / 2000, 0.05, 0.85);
      if (chance(risk)) {
        applyFine(randomInt(...getMode().fineRange), `楼内垃圾桶超量被发现，${getTrashName(type)}没有成功丢掉`);
      } else {
        reduceTrash(type, requested);
        state.daily.indoorLimit = 0;
        state.daily.outsideRiskBonus += 0.05;
        addLog(`你硬塞了 ${getTrashName(type)} ${requested}g，暂时没人发现，但今天后续风险上升。`);
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
    addLog("行动次数不够，今天的奇遇只能看着它溜走。");
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

  addLog(`今日奇遇「${opportunity.title}」：${outcome.label}${effectText ? `。${effectText}` : "。"}。`);
  checkGameEnd();
  saveAndRender();
}

function applyOpportunityOutcome(outcome) {
  const effects = [];

  if (outcome.money) {
    const money = resolveMoneyRange(outcome.money);
    state.money = roundMoney(state.money + money);
    effects.push(`金钱 ${money >= 0 ? "+" : ""}${formatMoney(money)}`);
  }

  if (outcome.bottles) {
    const count = resolveIntRange(outcome.bottles);
    const added = addRandomBottles(count);
    if (added > 0) effects.push(`瓶子 +${added}`);
    if (added < count) effects.push("瓶子库存已满");
  }

  if (outcome.actions) {
    state.actionsLeft = Math.max(0, state.actionsLeft + outcome.actions);
    effects.push(`行动 ${outcome.actions >= 0 ? "+" : ""}${outcome.actions}`);
  }

  if (outcome.indoorLimit) {
    state.daily.indoorLimit = Math.max(0, state.daily.indoorLimit + outcome.indoorLimit);
    effects.push(`楼内安全额度 ${outcome.indoorLimit >= 0 ? "+" : ""}${outcome.indoorLimit}g`);
  }

  if (outcome.outsideRiskBonus) {
    state.daily.outsideRiskBonus += outcome.outsideRiskBonus;
    effects.push(`外出风险 ${outcome.outsideRiskBonus > 0 ? "上升" : "下降"}`);
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

  return effects.join("，");
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
    if (added > 0) addLog(`外出时在垃圾桶旁捡到 ${added} 个瓶子。`);
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
    addLog(`你找到了一个外面垃圾桶，但它只收 ${outsideBin.acceptedTypes.map(getTrashName).join("、")}，家里暂时用不上。`);
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
      <p class="hint">绿色：完美机会。黄色：普通机会。红色：糟糕机会。看准时机点击。</p>
      <div class="modal-actions">
        <button id="dropNowButton" class="primary-button">现在丢！</button>
      </div>
    </div>
  ` : `
    <div class="mini-game">
      <p class="hint">今天不用卡点。你先观察楼上窗户、路人和摄像头，再赌一个机会窗口。</p>
      <div class="modal-actions">
        <button id="dropNowButton" class="primary-button">观察后丢</button>
      </div>
    </div>
  `;

  openModal("外面垃圾桶机会窗口", `
    <p class="hint">可接受：<strong>${outsideBin.acceptedTypes.map(getTrashName).join("、")}</strong>。最大可丢 ${outsideBin.maxWeight}g，基础被发现概率 ${percent(outsideBin.baseRisk)}。</p>
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
      applyFine(randomInt(...getMode().fineRange), `外面垃圾桶被发现：${result.label}，处理了 ${getTrashName(type)} ${actual}g`);
    } else {
      addLog(`外面垃圾桶成功：${result.label}，处理了 ${getTrashName(type)} ${actual}g，被发现概率 ${percent(risk)}。`);
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
    return { label: "完美机会", capacityMultiplier: 1, riskModifier: -0.15 };
  }
  if (position < 16 || position > 84) {
    return { label: "糟糕机会", capacityMultiplier: 0.4, riskModifier: 0.2 };
  }
  return { label: "普通机会", capacityMultiplier: 0.7, riskModifier: 0 };
}

function rollDropOpportunity() {
  return weightedRandom([
    { value: { label: "观察得很准", capacityMultiplier: 1, riskModifier: -0.12 }, weight: 28 },
    { value: { label: "普通机会", capacityMultiplier: 0.75, riskModifier: 0 }, weight: 52 },
    { value: { label: "时机有点糟", capacityMultiplier: 0.45, riskModifier: 0.16 }, weight: 20 }
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
  openModal("翻找 Pfand 线索", "");
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
    { weight: 34, value: { label: "瓶子", bottles: [1, 2], text: "翻到几个还能换押金的瓶子。" } },
    { weight: 13, value: { label: "一小袋瓶子", bottles: [3, 5], text: "有人把瓶子整袋放在旁边。" } },
    { weight: 13, value: { label: "硬币", money: [0.3, 1.8], text: "缝里有几枚硬币。" } },
    { weight: 5, value: { label: "纸币", moneyChoices: [5, 10], text: "你发现一张皱巴巴的纸币。" } },
    { weight: 15, value: { label: "脏东西", trashAdd: { residual: 90 }, text: "翻出一团不想细看的东西。" } },
    { weight: 20, value: { label: "空", text: "这里什么都没有。" } }
  ]);
}

function renderBottleSearchGame() {
  const tilesHtml = bottleSearchState.tiles.map((tile) => {
    const label = tile.revealed ? tile.outcome.label : "?";
    return `<button class="search-tile ${tile.revealed ? "revealed" : ""}" data-search-tile="${tile.id}" ${tile.revealed || bottleSearchState.picksLeft <= 0 ? "disabled" : ""}>${label}</button>`;
  }).join("");
  const status = bottleSearchState.started
    ? `还可以翻 ${bottleSearchState.picksLeft} 格。`
    : "第一次翻格时消耗 1 次行动，最多翻 3 格。";

  elements.modalBody.innerHTML = `
    <p class="hint">${status} 可能有瓶子、零钱、纸币，也可能翻出新的垃圾。</p>
    <div class="search-grid">${tilesHtml}</div>
    <div class="modal-actions">
      <button id="finishBottleSearchButton" class="secondary-button">收工</button>
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
      addLog("今天没有行动次数了，瓶子只能明天再翻。");
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
    if (added > 0) addLog(`翻找结果：${outcome.text} 获得 ${added} 个瓶子。`);
    if (added < wanted) addLog(pickRandom(GAME_CONFIG.messages.bottleFull));
    return;
  }

  if (outcome.money || outcome.moneyChoices) {
    const money = outcome.moneyChoices ? pickRandom(outcome.moneyChoices) : resolveMoneyRange(outcome.money);
    state.money = roundMoney(state.money + money);
    addLog(`翻找结果：${outcome.text} 金钱 +${formatMoney(money)}。`);
    return;
  }

  if (outcome.trashAdd) {
    Object.keys(outcome.trashAdd).forEach((type) => {
      if (state.garbage[type].unlocked) return;
      state.garbage[type].amount += outcome.trashAdd[type];
    });
    addLog(`翻找结果：${outcome.text} 其他垃圾 +${outcome.trashAdd.residual || 0}g。`);
    return;
  }

  addLog(`翻找结果：${outcome.text}`);
}

function walkForBottles(routeId, fromMinigame) {
  const route = GAME_CONFIG.bottleRoutes.find((item) => item.id === routeId) || GAME_CONFIG.bottleRoutes[0];
  if (state.actionsLeft <= 0) {
    addLog("今天没有行动次数了，只能看着瓶子在想象中发光。");
    closeModal();
    saveAndRender();
    return;
  }

  consumeAction();
  closeModal();

  const successChance = clamp(0.72 + state.daily.bottleFindBonus - state.daily.walkBottlePenalty + route.successBonus, 0.1, 0.95);
  if (!chance(successChance)) {
    addLog(`${route.name}：${pickRandom(GAME_CONFIG.messages.noWalkBottles)}`);
    findStreetTreasure("walk", route.treasureBonus);
    saveAndRender();
    return;
  }

  const routeMax = state.daily.walkBottlePenalty > 0 ? Math.max(route.minBottles, Math.floor(route.maxBottles * 0.55)) : route.maxBottles;
  const count = randomInt(route.minBottles, routeMax);
  const added = addRandomBottles(count);
  const prefix = fromMinigame ? `${route.name}` : `随机散步到${route.name}`;
  if (added > 0) addLog(`${prefix}：捡瓶子成功，获得 ${added} 个瓶子。`);
  if (added < count) addLog(pickRandom(GAME_CONFIG.messages.bottleFull));
  findStreetTreasure("walk", route.treasureBonus);
  saveAndRender();
}

function redeemBottles() {
  const count = getBottleCount();
  if (count <= 0) {
    addLog("没有瓶子可换押金。");
    saveAndRender();
    return;
  }

  consumeAction();
  const money = getBottleValue();
  state.bottles = { small: 0, large: 0, glass: 0 };
  state.money = roundMoney(state.money + money);
  addLog(`去超市换押金，${count} 个瓶子换到 ${formatMoney(money)}。`);
  saveAndRender();
}

function startCompressAction() {
  const options = getTrashOptions({ includeUnlocked: false });
  if (options.length === 0) {
    addLog("家里没有需要压缩整理的垃圾。");
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
  openModal("三手整理挑战", "");
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
        <span>${tile.revealed ? tile.piece.text : "点击整理"}</span>
      </button>
    `;
  }).join("");
  const status = compressGameState.started
    ? `还可以整理 ${compressGameState.picksLeft} 手。`
    : "第一次点击消耗 1 次行动，最多整理 3 手。";

  elements.modalBody.innerHTML = `
    <p class="hint">${status} 不同整理项会影响不同垃圾，也可能翻出新的杂物。</p>
    <div class="organize-grid">${tilesHtml}</div>
    <div class="modal-actions">
      <button id="finishCompressGameButton" class="secondary-button">收工</button>
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
      addLog("今天没有行动次数了，整理计划只能留到明天。");
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
  addLog(`整理结果「${tile.piece.label}」：${tile.piece.text}${effectText ? ` ${effectText}` : ""}`);
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
      if (before !== state.garbage[type].storedDays) effects.push(`${getTrashName(type)}存放天数 -${before - state.garbage[type].storedDays}`);
    });
  }

  if (effect.indoorLimit) {
    state.daily.indoorLimit = Math.max(0, state.daily.indoorLimit + effect.indoorLimit);
    effects.push(`楼内安全额度 +${effect.indoorLimit}g`);
  }

  return effects.length ? `效果：${effects.join("，")}。` : "没有明显效果。";
}

function openCompressModal() {
  const options = getTrashOptions({ includeUnlocked: false });
  if (options.length === 0) {
    addLog("家里没有需要压缩整理的垃圾。");
    saveAndRender();
    return;
  }

  openModal("在家整理压缩", `
    <p class="hint">消耗 1 次行动。包装、纸盒和杂物可减少 10%-25%；厨余最多只能减少 10%。存放天数 -1。</p>
    <div class="form-grid">
      ${trashSelectHtml(options)}
      <div class="modal-actions">
        <button id="confirmCompressButton" class="primary-button">开始整理</button>
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
    addLog(`在家整理 ${getTrashName(type)}，减少 ${reduced}g，并让存放压力下降 1 天。`);
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
        <span>${getTrashName(type)}自由</span>
        <strong>${formatMoney(price)}</strong>
      </button>
    `;
  }).join("");

  openModal("解锁垃圾处理自由", `
    <p class="hint">解锁后，该类垃圾每天自动清空，不再受楼内或外面垃圾桶限制。解锁不消耗行动次数。</p>
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
      addLog(`花费 ${formatMoney(price)}，解锁 ${getTrashName(type)}自由。该类垃圾从此自动处理。`);
      closeModal();
      checkGameEnd();
      saveAndRender();
    });
  });
}

function endDay() {
  addLog(`第 ${state.day} 天结束，开始每日结算。`);

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
      applyFine(fine, `${getTrashName(type)}超过家中容量：异味、空间不足、心理压力`);
    }

    if (trash.storedDays > config.maxDays) {
      hadProblem = true;
      const baseFine = randomInt(2, 6);
      const fine = roundMoney(baseFine * GAME_CONFIG.garbageTypes[type].bioPenaltyMultiplier);
      applyFine(fine, `${getTrashName(type)}存放过久：房间异味和邻居投诉风险上升`);
    }
  });
  return hadProblem;
}

function checkGameEnd() {
  if (!state || state.status !== "playing") return;

  const unlocked = getUnlockedCount();
  if (unlocked === Object.keys(GAME_CONFIG.garbageTypes).length) {
    state.status = "won";
    state.resultMessage = `胜利：你在第 ${state.day} 天解锁了全部四类垃圾自由。德国公寓生活终于安静了。`;
    addLog(state.resultMessage);
    return;
  }

  if (state.day >= GAME_CONFIG.winDay && unlocked >= 2) {
    state.status = "won";
    state.resultMessage = `通关：坚持到第 ${GAME_CONFIG.winDay} 天，并至少解锁 2 类垃圾自由。`;
    addLog(state.resultMessage);
    return;
  }

  if (state.money < -30) {
    state.status = "lost";
    state.resultMessage = "失败：金钱低于 -30 欧元，押金系统也救不了这个月的预算。";
    addLog(state.resultMessage);
    return;
  }

  if (state.consecutiveOverLimitDays >= 3) {
    state.status = "lost";
    state.resultMessage = "失败：连续 3 天有垃圾超限，房间已经进入不可描述状态。";
    addLog(state.resultMessage);
    return;
  }

  if (state.fineCount >= GAME_CONFIG.maxFineCount) {
    state.status = "lost";
    state.resultMessage = `失败：总罚款次数达到 ${GAME_CONFIG.maxFineCount} 次，邻里关系正式破产。`;
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
  addLog(`罚款 ${formatMoney(amount)}：${reason}。`);
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

  const place = source === "outsideBin" ? "垃圾桶旁" : "散步路上";
  addLog(`你在${place}翻到${find.name}，处理后赚到 ${formatMoney(money)}。`);
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
    return `<option value="${item.type}">${getTrashName(item.type)}（${item.amount}g）</option>`;
  }).join("");

  return `
    <div class="field">
      <label for="trashTypeSelect">垃圾类型</label>
      <select id="trashTypeSelect">${optionHtml}</select>
    </div>
  `;
}

function weightInputHtml(option, actionMax = Infinity, defaultLimit = actionMax) {
  const max = Math.min(option.amount, actionMax);
  const value = Math.max(1, Math.min(max, defaultLimit));
  return `
    <div class="field">
      <label for="trashWeightInput">重量 g</label>
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
  elements.goalValue.textContent = `${getUnlockedCount()} / 4 自由`;
  elements.limitStreakValue.textContent = `连续超限 ${state.consecutiveOverLimitDays} 天`;

  renderDailySummary();
  renderOpportunityPanel();
  renderGarbageCards();
  renderActionButtons();
  renderLogs();
  renderResult();
}

function renderDailySummary() {
  if (!state.daily) {
    elements.dailySummary.textContent = "新的一天开始了。";
    return;
  }

  const events = state.daily.eventTexts.length ? state.daily.eventTexts.join(" ") : "今天没有特殊事件。";
  elements.dailySummary.textContent = `${events} 楼内剩余安全额度 ${state.daily.indoorLimit}g。`;
}

function renderOpportunityPanel() {
  const opportunity = state.daily?.opportunity;
  if (!opportunity) {
    elements.opportunityPanel.classList.add("hidden");
    elements.opportunityPanel.innerHTML = "";
    return;
  }

  const costText = opportunity.actionCost > 0 ? `消耗 ${opportunity.actionCost} 次行动` : "不消耗行动";
  const disabled = opportunity.used || state.status !== "playing" || state.actionsLeft < opportunity.actionCost;
  const buttonText = opportunity.used ? "已处理" : "尝试奇遇";
  const resultText = opportunity.used ? `<p class="hint">结果：${opportunity.result}</p>` : "";

  elements.opportunityPanel.classList.remove("hidden");
  elements.opportunityPanel.innerHTML = `
    <div class="opportunity-content">
      <div>
        <h2>今日奇遇：${opportunity.title}</h2>
        <p>${opportunity.text} ${costText}。</p>
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
    const unlocked = trash.unlocked ? `<span class="badge">已解锁</span>` : `<span class="badge" style="background:#f0e4d3;color:#5f4c37;">未解锁</span>`;

    return `
      <article class="garbage-card ${danger ? "danger" : ""}">
        <div class="garbage-title">
          <span><span class="trash-dot" style="background:${baseConfig.color}"></span> ${baseConfig.name}</span>
          ${unlocked}
        </div>
        <div class="trash-meta">
          <span>${baseConfig.german}</span>
          <span>重量：${trash.amount}g / ${config.maxCapacity}g</span>
          <span>存放：${trash.storedDays} 天 / ${config.maxDays} 天</span>
          <span>剩余容量：${Math.max(0, config.maxCapacity - trash.amount)}g</span>
        </div>
        <div class="progress" aria-label="${baseConfig.name}压力">
          <div class="progress-fill" style="width:${fillWidth}%;background:${fillColor};"></div>
        </div>
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
    <h2>${state.status === "won" ? "结算：通关" : "结算：失败"}</h2>
    <p>${state.resultMessage}</p>
    <p>最终：第 ${state.day} 天，${formatMoney(state.money)}，瓶子 ${getBottleCount()} 个，罚款 ${state.fineCount} 次，解锁 ${getUnlockedCount()} / 4。</p>
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
  return `${roundMoney(value).toFixed(2)} 欧元`;
}

function percent(value) {
  return `${Math.round(value * 100)}%`;
}
