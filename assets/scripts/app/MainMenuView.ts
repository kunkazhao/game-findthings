import { _decorator, Component, Node, Size, Vec3, Label } from 'cc';
import { createButton, createLabel } from './uiFactory';

const { ccclass } = _decorator;

type MainMenuOptions = {
  size: Size;
  getCurrentLevel: () => number;
  onStart: () => void;
  onSettings: () => void;
};

@ccclass('MainMenuView')
export class MainMenuView extends Component {
  private levelLabel: Label | null = null;
  private options: MainMenuOptions | null = null;

  init(options: MainMenuOptions): void {
    this.options = options;
    this.build(options.size);
    this.refresh();
  }

  refresh(): void {
    if (!this.levelLabel || !this.options) return;
    const level = this.options.getCurrentLevel();
    this.levelLabel.string = `当前关卡：第 ${level} 关`;
  }

  private build(size: Size): void {
    this.node.removeAllChildren();

    const title = createLabel(this.node, '找一找', 48);
    title.node.setPosition(new Vec3(0, size.height * 0.28, 0));

    this.levelLabel = createLabel(this.node, '当前关卡：第 1 关', 26);
    this.levelLabel.node.setPosition(new Vec3(0, size.height * 0.18, 0));

    const startBtn = createButton(
      this.node,
      '开始游戏',
      new Size(220, 64),
      () => this.options?.onStart()
    );
    startBtn.node.setPosition(new Vec3(0, -20, 0));

    const settingsBtn = createButton(
      this.node,
      '设置',
      new Size(140, 56),
      () => this.options?.onSettings()
    );
    settingsBtn.node.setPosition(new Vec3(0, -110, 0));
  }
}
