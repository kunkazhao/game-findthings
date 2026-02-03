import {
  _decorator,
  Component,
  Node,
  Size,
  Vec3,
  UITransform,
  Graphics,
  Color,
  Label,
  EventTouch
} from 'cc';
import type { LevelData } from '../data/levels';
import type { TargetPoint } from '../core/types';
import { findHitTarget } from '../core/hitTest';
import { pickHintTarget } from '../core/hint';
import { createGameState, GameLevel } from '../core/gameState';
import { createButton, createLabel, createPanel, ButtonHandle } from './uiFactory';

const { ccclass } = _decorator;

type GameViewOptions = {
  size: Size;
  onBack: () => void;
  onNextLevel: (nextId: number) => void;
  onWin: (levelId: number) => void;
};

@ccclass('GameView')
export class GameView extends Component {
  private options: GameViewOptions | null = null;
  private board: Node | null = null;
  private boardUI: UITransform | null = null;
  private targets: TargetPoint[] = [];
  private targetMap = new Map<string, TargetPoint>();
  private found = new Set<string>();
  private levelData: LevelData | null = null;

  private foundLabel: Label | null = null;
  private heartsLabel: Label | null = null;
  private hintLabel: Label | null = null;

  private winOverlay: Node | null = null;
  private failOverlay: Node | null = null;
  private adOverlay: Node | null = null;
  private adLabel: Label | null = null;
  private adCancelBtn: ButtonHandle | null = null;
  private adWatchBtn: ButtonHandle | null = null;
  private missOverlay: Node | null = null;

  private state: ReturnType<typeof createGameState> | null = null;

  init(options: GameViewOptions): void {
    this.options = options;
    this.build(options.size);
  }

  startLevel(level: LevelData): void {
    this.levelData = level;
    this.targets = level.targets;
    this.targetMap = new Map(level.targets.map((t) => [t.id, t]));
    this.found.clear();

    const gameLevel: GameLevel = {
      targetIds: level.targets.map((t) => t.id),
      hearts: level.initialHearts,
      hints: level.initialHints
    };
    this.state = createGameState(gameLevel);

    this.clearMarkers();
    this.updateHud();
    this.hideOverlays();
  }

  private build(size: Size): void {
    this.node.removeAllChildren();

    const board = createPanel(
      this.node,
      'Board',
      new Size(size.width, size.height),
      new Color(245, 235, 220, 255)
    );
    board.setPosition(Vec3.ZERO);
    this.board = board;
    this.boardUI = board.getComponent(UITransform);

    board.on(Node.EventType.TOUCH_END, (event: EventTouch) => {
      this.onBoardTouch(event);
    });

    const hud = new Node('HUD');
    this.node.addChild(hud);

    this.foundLabel = createLabel(hud, '已找到：0/0', 26);
    this.foundLabel.node.setPosition(new Vec3(-size.width * 0.3, size.height * 0.42, 0));

    this.heartsLabel = createLabel(hud, '爱心：3', 26);
    this.heartsLabel.node.setPosition(new Vec3(size.width * 0.3, size.height * 0.42, 0));

    const hintBtn = createButton(
      hud,
      '提示 x1',
      new Size(160, 52),
      () => this.onHint()
    );
    hintBtn.node.setPosition(new Vec3(-size.width * 0.3, -size.height * 0.42, 0));
    this.hintLabel = hintBtn.label;

    const backBtn = createButton(
      hud,
      '返回',
      new Size(120, 52),
      () => this.options?.onBack()
    );
    backBtn.node.setPosition(new Vec3(size.width * 0.3, -size.height * 0.42, 0));

    this.missOverlay = createPanel(
      this.node,
      'MissOverlay',
      new Size(size.width, size.height),
      new Color(255, 0, 0, 70)
    );
    this.missOverlay.active = false;

    this.winOverlay = this.createResultOverlay(
      '通关成功',
      '下一关',
      () => this.onNextLevel(),
      '返回',
      () => this.options?.onBack()
    );
    this.failOverlay = this.createResultOverlay(
      '闯关失败',
      '重试',
      () => this.onRetry(),
      '返回',
      () => this.options?.onBack()
    );
    this.adOverlay = this.createAdOverlay();
  }

  private onBoardTouch(event: EventTouch): void {
    if (!this.state || !this.boardUI || !this.board || !this.levelData) return;
    if (this.winOverlay?.active || this.failOverlay?.active || this.adOverlay?.active) return;

    const uiPos = event.getUILocation();
    const local = this.boardUI.convertToNodeSpaceAR(new Vec3(uiPos.x, uiPos.y, 0));
    const nx = local.x / this.boardUI.width + 0.5;
    const ny = local.y / this.boardUI.height + 0.5;

    const hitId = findHitTarget({ x: nx, y: ny }, this.targets, this.found);
    if (hitId) {
      this.markFound(hitId);
      if (this.state.isWin()) {
        this.options?.onWin(this.levelData.id);
        this.showWin();
      }
      return;
    }

    this.state.miss();
    this.updateHud();
    this.flashMiss();
    if (this.state.isFail()) {
      this.showFail();
    }
  }

  private markFound(id: string): void {
    if (!this.state || !this.boardUI || !this.board) return;
    if (this.found.has(id)) return;
    const target = this.targetMap.get(id);
    if (!target) return;

    this.found.add(id);
    this.state.hit(id);

    const marker = new Node('Marker');
    this.board.addChild(marker);

    const r = Math.min(this.boardUI.width, this.boardUI.height) * target.r;
    const pos = new Vec3(
      (target.x - 0.5) * this.boardUI.width,
      (target.y - 0.5) * this.boardUI.height,
      0
    );
    marker.setPosition(pos);

    const gfx = marker.addComponent(Graphics);
    gfx.lineWidth = 4;
    gfx.strokeColor = new Color(30, 200, 30, 255);
    gfx.circle(0, 0, r);
    gfx.stroke();

    this.updateHud();
  }

  private onHint(): void {
    if (!this.state) return;
    if (this.state.useHint()) {
      const remaining = this.state.getRemainingTargetIds();
      const id = pickHintTarget(remaining);
      if (id) this.markFound(id);
      if (this.levelData && this.state.isWin()) {
        this.options?.onWin(this.levelData.id);
        this.showWin();
      }
    } else {
      this.showAdPrompt();
    }
  }

  private onRetry(): void {
    if (this.levelData) {
      this.startLevel(this.levelData);
    }
  }

  private onNextLevel(): void {
    if (!this.levelData) return;
    const nextId = this.levelData.id + 1;
    this.options?.onNextLevel(nextId);
  }

  private updateHud(): void {
    if (!this.state || !this.levelData) return;
    if (this.foundLabel) {
      this.foundLabel.string = `已找到：${this.state.getFoundCount()}/${this.levelData.targetCount}`;
    }
    if (this.heartsLabel) {
      this.heartsLabel.string = `爱心：${this.state.getHearts()}`;
    }
    if (this.hintLabel) {
      const hints = this.state.getHints();
      this.hintLabel.string = hints > 0 ? `提示 x${hints}` : '看广告 +1';
    }
  }

  private flashMiss(): void {
    if (!this.missOverlay) return;
    this.missOverlay.active = true;
    this.scheduleOnce(() => {
      if (this.missOverlay) this.missOverlay.active = false;
    }, 0.15);
  }

  private showWin(): void {
    if (this.winOverlay) this.winOverlay.active = true;
  }

  private showFail(): void {
    if (this.failOverlay) this.failOverlay.active = true;
  }

  private hideOverlays(): void {
    if (this.winOverlay) this.winOverlay.active = false;
    if (this.failOverlay) this.failOverlay.active = false;
    if (this.adOverlay) this.adOverlay.active = false;
  }

  private clearMarkers(): void {
    if (!this.board) return;
    const toRemove = this.board.children.filter((child) => child.name === 'Marker');
    toRemove.forEach((node) => node.removeFromParent());
  }

  private createResultOverlay(
    titleText: string,
    leftText: string,
    leftAction: () => void,
    rightText: string,
    rightAction: () => void
  ): Node {
    if (!this.options) throw new Error('options not set');
    const overlay = createPanel(
      this.node,
      'ResultOverlay',
      new Size(this.options.size.width, this.options.size.height),
      new Color(0, 0, 0, 120)
    );

    const panel = createPanel(
      overlay,
      'Dialog',
      new Size(this.options.size.width * 0.7, 220),
      new Color(255, 248, 235, 255)
    );
    panel.setPosition(Vec3.ZERO);

    const title = createLabel(panel, titleText, 32);
    title.node.setPosition(new Vec3(0, 60, 0));

    const leftBtn = createButton(panel, leftText, new Size(160, 54), leftAction);
    leftBtn.node.setPosition(new Vec3(-100, -40, 0));

    const rightBtn = createButton(panel, rightText, new Size(160, 54), rightAction);
    rightBtn.node.setPosition(new Vec3(100, -40, 0));

    overlay.active = false;
    return overlay;
  }

  private createAdOverlay(): Node {
    if (!this.options) throw new Error('options not set');
    const overlay = createPanel(
      this.node,
      'AdOverlay',
      new Size(this.options.size.width, this.options.size.height),
      new Color(0, 0, 0, 120)
    );

    const panel = createPanel(
      overlay,
      'AdPanel',
      new Size(this.options.size.width * 0.7, 220),
      new Color(255, 248, 235, 255)
    );
    panel.setPosition(Vec3.ZERO);

    this.adLabel = createLabel(panel, '观看广告获得 1 次提示', 26);
    this.adLabel.node.setPosition(new Vec3(0, 60, 0));

    this.adCancelBtn = createButton(panel, '取消', new Size(140, 50), () => {
      overlay.active = false;
    });
    this.adCancelBtn.node.setPosition(new Vec3(-90, -40, 0));

    this.adWatchBtn = createButton(panel, '观看', new Size(140, 50), () => {
      this.playAdMock();
    });
    this.adWatchBtn.node.setPosition(new Vec3(90, -40, 0));

    overlay.active = false;
    return overlay;
  }

  private showAdPrompt(): void {
    if (!this.adOverlay || !this.adLabel || !this.adCancelBtn || !this.adWatchBtn) return;
    this.adOverlay.active = true;
    this.adLabel.string = '观看广告获得 1 次提示';
    this.adCancelBtn.node.active = true;
    this.adWatchBtn.node.active = true;
  }

  private playAdMock(): void {
    if (!this.adOverlay || !this.adLabel || !this.adCancelBtn || !this.adWatchBtn) return;
    this.adLabel.string = '广告播放中...';
    this.adCancelBtn.node.active = false;
    this.adWatchBtn.node.active = false;

    this.scheduleOnce(() => {
      if (!this.state) return;
      this.state.addHint(1);
      this.updateHud();
      if (this.adOverlay) this.adOverlay.active = false;
    }, 2);
  }
}
