# 找一找（原型）

## 快速开始

1. 打开 Cocos Creator 3.8.8，选择此项目目录。
2. 打开场景 `assets/scenes/Main.scene`。
3. 选中场景中的 `Canvas` 节点，添加组件 `AppRoot`（脚本路径：`assets/scripts/app/AppRoot.ts`）。
4. 在 `Project -> Project Settings -> General -> Start Scene` 中设置 `Main.scene` 为启动场景。
5. 点击运行即可。

## 关卡数据

关卡配置位于：`assets/scripts/data/levels.ts`。
- `title` 是关卡标题（用于选关页面）
- `targets` 是目标点（归一化坐标 0..1 + 半径）

目前为占位数据与占位背景路径，后续替换素材时可同步更新 `bg` 与 `targets`。

## 玩法说明

- 关内不展示目标名称/清单，仅通过关卡标题提示目标类型。
- 点击命中目标会标记并计数，误触扣爱心。
- 提示会直接标记一个目标；无提示时可观看广告获取 1 次提示（原型为模拟广告）。
