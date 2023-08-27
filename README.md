<h1 align="center">Soku Games</h1>

> 以下说明基本全是字，~~因为还没有怎么截图、设计 Logo~~，敬请谅解。

# 介绍

这是一个关于**简单棋牌游戏**的**架构设计**的代码仓库，旨在能够设计一个比较完美的架构（虽然比较 Toy Project），帮助其他人快速、高效地开发出新的游戏，以及能够接入社区发展成一个生态，类似于**Steam创意工坊**，以及**插件生态**。

# 思想

软件开发的设计模式中有非常重要的原则是**开闭原则（Open Closed Principle）**，是插件生态里面非常重要的基石，比如**Vite、Webpack**等前端工具链，他们都有各自的**生命周期**，以及**成套的钩子**，开发插件只需要监听对应的钩子，**在正确的时间做正确的事情**。实际上有对应的设计模式，它的名字叫**发布订阅模型**。发布订阅的实现并不难，难得是**如何设计一个比较完善的生命周期**。

# 设计

本项目还在发展初期，因此设计上相对来讲还是比较稚嫩，相信后续的发展以及讨论，会更完善此设计。

## 假设它的使用方法是...

![image](https://github.com/Board-Game-Bot/soku-games/assets/84608230/d05b490d-8c3a-45f6-a1b7-8a45a91b7645)

## 假设它的开发 SDK 是...

![image](https://github.com/Board-Game-Bot/soku-games/assets/84608230/92f40d6e-af2e-437d-923b-f6e6794e8624)


## 整体架构设计

当前的设计。

![游戏架构设计](https://github.com/Board-Game-Bot/soku-games/assets/84608230/5dfe9a8e-f101-4032-925b-fea2f1c09cf8)


下图为旧版的设计。区别是下面的原本是区分**渲染器、裁判器、控制器等等** 的。

![游戏架构设计](https://github.com/Board-Game-Bot/soku-game/assets/84608230/68babcf4-fb93-4acc-a6ca-b2662e5fcec2)


## 生命周期设计

游戏所有的事件有：`prepare`、`start`、`step`、`end`。这四个基本上都有`before:event`以及`after:event`钩子，区别是所传给回调的参数不一样。

除此之外，还有`invalid-format`、`invalid-step`，这两个钩子比较特殊，但可以提供给**裁判器**使用。

如下为设计图。

![生命周期设计](https://github.com/Board-Game-Bot/soku-games/assets/84608230/0549b1a0-0c78-486f-b26e-7ef41afec6bc)
