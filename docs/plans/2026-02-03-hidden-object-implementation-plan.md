# Hidden-Object Mini-Game Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a playable hidden-object prototype in Cocos Creator 3.8.8 with 5 levels, hint + rewarded-ad flow, and minimal UI.

**Architecture:** Data-driven levels + pure-logic modules (hit test, hints, game state, progress store) with TDD; Cocos components are thin UI/scene wrappers that call the pure logic. A single scene hosts three panels (Main, Level Select, Game) toggled by an AppRoot controller.

**Tech Stack:** Cocos Creator 3.8.8, TypeScript, Vitest (logic-only tests).

---

### Task 0: Commit base Cocos project skeleton

**Files:**
- Add: `.creator/default-meta.json`
- Add: `settings/**`
- Add: `tsconfig.json`
- Add: `package.json`

**Step 1: Verify files exist**

Run: `ls -la .creator settings tsconfig.json package.json`

**Step 2: Commit base project files**

```bash
git add .creator settings tsconfig.json package.json
git commit -m "chore: add cocos project skeleton"
```

---

### Task 1: Tooling and test harness

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `tsconfig.test.json`
- Create: `tests/.gitkeep`

**Step 0: Ensure Node.js is available**

Run: `node -v`
If missing, install via Homebrew:

```bash
brew install node
```

**Step 1: Add a tiny failing test to prove the harness**

Create `tests/sanity.test.ts`:
```ts
import { describe, it, expect } from 'vitest';

describe('sanity', () => {
  it('fails until harness is wired', () => {
    expect(true).toBe(false);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run tests/sanity.test.ts`
Expected: FAIL with `Expected: false, Received: true`.

**Step 3: Wire Vitest and TypeScript config**

- Add `devDependencies` for `vitest` and `typescript` (if missing).
- Add script `"test": "vitest run"`.
- Add `vitest.config.ts` using `tsconfig.test.json`.

**Step 4: Flip test to pass**

```ts
expect(true).toBe(true);
```

**Step 5: Run tests to verify pass**

Run: `npx vitest run tests/sanity.test.ts`
Expected: PASS.

**Step 6: Commit**

```bash
git add package.json vitest.config.ts tsconfig.test.json tests/sanity.test.ts

git commit -m "test: add vitest harness"
```

---

### Task 2: Core types + hit test logic (TDD)

**Files:**
- Create: `assets/scripts/core/types.ts`
- Create: `assets/scripts/core/hitTest.ts`
- Test: `tests/hitTest.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { findHitTarget } from '../assets/scripts/core/hitTest';

const targets = [
  { id: 'a', x: 0.5, y: 0.5, r: 0.05 },
  { id: 'b', x: 0.8, y: 0.2, r: 0.05 },
];

describe('findHitTarget', () => {
  it('returns hit target id when within radius', () => {
    expect(findHitTarget({ x: 0.52, y: 0.52 }, targets, new Set())).toBe('a');
  });

  it('returns null when no target hit', () => {
    expect(findHitTarget({ x: 0.1, y: 0.1 }, targets, new Set())).toBe(null);
  });

  it('skips already found targets', () => {
    const found = new Set(['a']);
    expect(findHitTarget({ x: 0.52, y: 0.52 }, targets, found)).toBe(null);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run tests/hitTest.test.ts`
Expected: FAIL with "findHitTarget is not defined".

**Step 3: Write minimal implementation**

```ts
export function findHitTarget(point, targets, found) {
  // minimal implementation
}
```

**Step 4: Run tests to verify pass**

Run: `npx vitest run tests/hitTest.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add assets/scripts/core/types.ts assets/scripts/core/hitTest.ts tests/hitTest.test.ts

git commit -m "feat: add hit test logic"
```

---

### Task 3: Hint selection (TDD)

**Files:**
- Create: `assets/scripts/core/hint.ts`
- Test: `tests/hint.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { pickHintTarget } from '../assets/scripts/core/hint';

const targets = ['a', 'b', 'c'];

describe('pickHintTarget', () => {
  it('returns a remaining target deterministically with injected rng', () => {
    const rng = () => 0; // always first
    expect(pickHintTarget(targets, rng)).toBe('a');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run tests/hint.test.ts`
Expected: FAIL with "pickHintTarget is not defined".

**Step 3: Minimal implementation**

```ts
export function pickHintTarget(ids, rng = Math.random) {
  if (!ids.length) return null;
  const idx = Math.floor(rng() * ids.length);
  return ids[idx];
}
```

**Step 4: Run tests to verify pass**

Run: `npx vitest run tests/hint.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add assets/scripts/core/hint.ts tests/hint.test.ts

git commit -m "feat: add hint selection"
```

---

### Task 4: Progress store (TDD)

**Files:**
- Create: `assets/scripts/core/progressStore.ts`
- Test: `tests/progressStore.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { createProgressStore } from '../assets/scripts/core/progressStore';

const memoryStorage = () => {
  const map = new Map<string, string>();
  return {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => map.set(k, v),
  };
};

describe('progress store', () => {
  it('unlocks next level after win', () => {
    const store = createProgressStore(memoryStorage());
    store.setCurrentLevel(1);
    store.markLevelCleared(1);
    expect(store.isUnlocked(2)).toBe(true);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run tests/progressStore.test.ts`
Expected: FAIL with "createProgressStore is not defined".

**Step 3: Minimal implementation**

Implement `createProgressStore` with `getItem/setItem` and defaults.

**Step 4: Run tests to verify pass**

Run: `npx vitest run tests/progressStore.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add assets/scripts/core/progressStore.ts tests/progressStore.test.ts

git commit -m "feat: add progress store"
```

---

### Task 5: Game state (TDD)

**Files:**
- Create: `assets/scripts/core/gameState.ts`
- Test: `tests/gameState.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { createGameState } from '../assets/scripts/core/gameState';

const level = { targetIds: ['a', 'b'], hearts: 3, hints: 1 };

describe('game state', () => {
  it('marks targets found and wins when all found', () => {
    const state = createGameState(level);
    state.hit('a');
    state.hit('b');
    expect(state.isWin()).toBe(true);
  });

  it('reduces hearts on miss and fails at zero', () => {
    const state = createGameState(level);
    state.miss();
    state.miss();
    state.miss();
    expect(state.isFail()).toBe(true);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run tests/gameState.test.ts`
Expected: FAIL with "createGameState is not defined".

**Step 3: Minimal implementation**

Implement `createGameState` to track found ids, hearts, hints, win/fail.

**Step 4: Run tests to verify pass**

Run: `npx vitest run tests/gameState.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add assets/scripts/core/gameState.ts tests/gameState.test.ts

git commit -m "feat: add game state"
```

---

### Task 6: Level data (no tests)

**Files:**
- Create: `assets/scripts/data/levels.ts`

**Step 1: Add 5 levels**

Include titles and target points for 2/3/4/5/6 targets.

**Step 2: Commit**

```bash
git add assets/scripts/data/levels.ts

git commit -m "feat: add placeholder level data"
```

---

### Task 7: Cocos UI + controller scripts (engine code, no tests)

**Files:**
- Create: `assets/scripts/app/AppRoot.ts`
- Create: `assets/scripts/app/MainMenuView.ts`
- Create: `assets/scripts/app/LevelSelectView.ts`
- Create: `assets/scripts/app/GameView.ts`
- Create: `assets/scripts/app/uiFactory.ts`

**Step 1: Implement runtime UI creation**

- Build panels for Main, Level Select, Game under Canvas.
- Use Labels + touch listeners for buttons.

**Step 2: Wire logic**

- Use core modules (hit test, hint, game state, progress store).
- Implement hint/ad mock flow.

**Step 3: Commit**

```bash
git add assets/scripts/app

git commit -m "feat: add runtime UI controllers"
```

---

### Task 8: Scene template + setup notes (no tests)

**Files:**
- Create: `assets/scenes/Main.scene` (copy of Cocos 2D default scene)
- Create: `README.md`

**Step 1: Add base scene file**

Copy default 2D scene from Cocos installation.

**Step 2: Add setup notes**

Explain: open project in Cocos, attach `AppRoot` to Canvas, set Main.scene as start scene.

**Step 3: Commit**

```bash
git add assets/scenes/Main.scene README.md

git commit -m "docs: add setup notes and base scene"
```

---

Plan complete and saved to `docs/plans/2026-02-03-hidden-object-implementation-plan.md`. Two execution options:

1. Subagent-Driven (this session) - I dispatch fresh subagent per task, review between tasks, fast iteration
2. Parallel Session (separate) - Open new session with executing-plans, batch execution with checkpoints

Which approach?
