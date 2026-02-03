import { _decorator, Component, Node, Size, Vec3, Color } from 'cc';
import { createButton, createLabel } from './uiFactory';
import type { LevelData } from '../data/levels';

const { ccclass } = _decorator;

type LevelSelectOptions = {
  size: Size;
  levels: LevelData[];
  isUnlocked: (levelId: number) => boolean;
  onSelect: (levelId: number) => void;
  onBack: () => void;
};

@ccclass('LevelSelectView')
export class LevelSelectView extends Component {
  private options: LevelSelectOptions | null = null;

  init(options: LevelSelectOptions): void {
    this.options = options;
    this.build(options);
  }

  refresh(): void {
    if (!this.options) return;
    this.build(this.options);
  }

  private build(options: LevelSelectOptions): void {
    this.node.removeAllChildren();

    const title = createLabel(this.node, '选择关卡', 40);
    title.node.setPosition(new Vec3(0, options.size.height * 0.32, 0));

    const startY = options.size.height * 0.18;
    const gap = 70;

    options.levels.forEach((level, index) => {
      const unlocked = options.isUnlocked(level.id);
      const text = unlocked
        ? `第 ${level.id} 关 · ${level.title}`
        : `第 ${level.id} 关 · 未解锁`;

      const btn = createButton(
        this.node,
        text,
        new Size(options.size.width * 0.65, 56),
        () => {
          if (unlocked) options.onSelect(level.id);
        }
      );

      if (!unlocked) {
        btn.label.color = new Color(140, 140, 140, 255);
      }

      btn.node.setPosition(new Vec3(0, startY - index * gap, 0));
    });

    const backBtn = createButton(
      this.node,
      '返回',
      new Size(120, 50),
      () => options.onBack()
    );
    backBtn.node.setPosition(new Vec3(0, -options.size.height * 0.35, 0));
  }
}
