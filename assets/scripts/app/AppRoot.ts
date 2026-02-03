import { _decorator, Component, Node, Size, Vec3, sys, Color, UITransform } from 'cc';
import { MainMenuView } from './MainMenuView';
import { LevelSelectView } from './LevelSelectView';
import { GameView } from './GameView';
import { LEVELS } from '../data/levels';
import { createProgressStore } from '../core/progressStore';
import { createButton, createLabel, createPanel } from './uiFactory';

const { ccclass } = _decorator;

type Settings = {
  music: boolean;
  sfx: boolean;
};

@ccclass('AppRoot')
export class AppRoot extends Component {
  private mainMenu: MainMenuView | null = null;
  private levelSelect: LevelSelectView | null = null;
  private gameView: GameView | null = null;
  private settingsOverlay: Node | null = null;
  private musicLabel: ReturnType<typeof createLabel> | null = null;
  private sfxLabel: ReturnType<typeof createLabel> | null = null;

  private progress = createProgressStore({
    getItem: (key: string) => sys.localStorage.getItem(key),
    setItem: (key: string, value: string) => sys.localStorage.setItem(key, value)
  });

  private settings: Settings = this.loadSettings();

  onLoad(): void {
    const size = this.getCanvasSize();
    this.buildViews(size);
    this.showMainMenu();
  }

  private getCanvasSize(): Size {
    const ui = this.node.getComponent(UITransform);
    if (ui) return new Size(ui.width, ui.height);
    return new Size(960, 640);
  }

  private buildViews(size: Size): void {
    const mainNode = new Node('MainMenu');
    this.node.addChild(mainNode);
    this.mainMenu = mainNode.addComponent(MainMenuView);
    this.mainMenu.init({
      size,
      getCurrentLevel: () => this.progress.getCurrentLevel(),
      onStart: () => this.showLevelSelect(),
      onSettings: () => this.showSettings(true)
    });

    const selectNode = new Node('LevelSelect');
    this.node.addChild(selectNode);
    this.levelSelect = selectNode.addComponent(LevelSelectView);
    this.levelSelect.init({
      size,
      levels: LEVELS,
      isUnlocked: (id) => this.progress.isUnlocked(id),
      onSelect: (id) => this.showGame(id),
      onBack: () => this.showMainMenu()
    });

    const gameNode = new Node('GameView');
    this.node.addChild(gameNode);
    this.gameView = gameNode.addComponent(GameView);
    this.gameView.init({
      size,
      onBack: () => this.showLevelSelect(),
      onNextLevel: (nextId) => this.showGame(nextId),
      onWin: (levelId) => this.progress.markLevelCleared(levelId)
    });

    this.settingsOverlay = this.buildSettings(size);
  }

  private showMainMenu(): void {
    this.setActiveView('main');
    this.mainMenu?.refresh();
  }

  private showLevelSelect(): void {
    this.setActiveView('select');
    this.levelSelect?.refresh();
  }

  private showGame(levelId: number): void {
    const level = LEVELS.find((item) => item.id === levelId) ?? LEVELS[0];
    this.setActiveView('game');
    this.gameView?.startLevel(level);
  }

  private setActiveView(view: 'main' | 'select' | 'game'): void {
    if (this.mainMenu) this.mainMenu.node.active = view === 'main';
    if (this.levelSelect) this.levelSelect.node.active = view === 'select';
    if (this.gameView) this.gameView.node.active = view === 'game';
    if (this.settingsOverlay) this.settingsOverlay.active = false;
  }

  private buildSettings(size: Size): Node {
    const overlay = createPanel(
      this.node,
      'SettingsOverlay',
      new Size(size.width, size.height),
      new Color(0, 0, 0, 120)
    );

    const panel = createPanel(
      overlay,
      'SettingsPanel',
      new Size(size.width * 0.7, 260),
      new Color(255, 248, 235, 255)
    );
    panel.setPosition(Vec3.ZERO);

    const title = createLabel(panel, '设置', 32);
    title.node.setPosition(new Vec3(0, 90, 0));

    const musicBtn = createButton(panel, '音乐：开', new Size(180, 50), () => {
      this.settings.music = !this.settings.music;
      this.syncSettingsLabels();
      this.saveSettings();
    });
    musicBtn.node.setPosition(new Vec3(0, 20, 0));
    this.musicLabel = musicBtn.label;

    const sfxBtn = createButton(panel, '音效：开', new Size(180, 50), () => {
      this.settings.sfx = !this.settings.sfx;
      this.syncSettingsLabels();
      this.saveSettings();
    });
    sfxBtn.node.setPosition(new Vec3(0, -40, 0));
    this.sfxLabel = sfxBtn.label;

    const closeBtn = createButton(panel, '关闭', new Size(140, 50), () => {
      overlay.active = false;
    });
    closeBtn.node.setPosition(new Vec3(0, -110, 0));

    overlay.active = false;
    this.syncSettingsLabels();
    return overlay;
  }

  private showSettings(show: boolean): void {
    if (this.settingsOverlay) this.settingsOverlay.active = show;
  }

  private syncSettingsLabels(): void {
    if (this.musicLabel) {
      this.musicLabel.string = `音乐：${this.settings.music ? '开' : '关'}`;
    }
    if (this.sfxLabel) {
      this.sfxLabel.string = `音效：${this.settings.sfx ? '开' : '关'}`;
    }
  }

  private loadSettings(): Settings {
    const raw = sys.localStorage.getItem('settings_v1');
    if (!raw) return { music: true, sfx: true };
    try {
      const data = JSON.parse(raw) as Settings;
      return {
        music: data.music !== false,
        sfx: data.sfx !== false
      };
    } catch {
      return { music: true, sfx: true };
    }
  }

  private saveSettings(): void {
    sys.localStorage.setItem('settings_v1', JSON.stringify(this.settings));
  }
}
