# 我是德区垃圾王 · 手机版

这是独立的手机版页面，保留原版中文主页和英文页不变。

## 如何运行

直接打开：

```text
mobile/index.html
```

上传到 GitHub Pages 后访问：

```text
https://lumosnox-bamboo.github.io/de-trash-king/mobile/
```

## 文件结构

```text
mobile/
├── index.html   # 手机版页面入口
├── style.css    # 手机版优化样式
├── game.js      # 手机版游戏逻辑
└── README.md    # 手机版说明
```

## 说明

- 手机版使用独立 `localStorage` key：`trashQueenMobileSaveV1`。
- 手机存档不会覆盖原中文版存档。
- 游戏规则和原中文版一致。
- 游戏中界面采用一屏式移动布局：状态、垃圾、行动按钮和短日志集中显示。
- 顶部“设置”可切换小屏精简、事件日志和纵向滚动布局。
- 顶部“设置”里也提供中文 / English 入口。
