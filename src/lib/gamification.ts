export interface GameState {
  xp: number;
  level: number;
  streak: number;
  highestStreak: number;
  hearts: number;
}

export const MAX_HEARTS = 3;

const XP_PER_LEVEL = [0, 50, 150, 300, 500, 800, 1200, 1800, 2500, 3500]; // 10 levels

export class Gamification {
  private static STORAGE_KEY = 'logic_game_campaign';

  static load(): GameState {
    if (typeof window === 'undefined') {
      return this.defaultState();
    }
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (!saved) return this.defaultState();

    try {
      const parsed = JSON.parse(saved);
      return {
        ...this.defaultState(),
        ...parsed,
        hearts: MAX_HEARTS // Always restore hearts on load or could persist
      };
    } catch {
      return this.defaultState();
    }
  }

  static save(state: GameState): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    }
  }

  static defaultState(): GameState {
    return {
      xp: 0,
      level: 1,
      streak: 0,
      highestStreak: 0,
      hearts: MAX_HEARTS
    };
  }

  static calculateXP(isCorrect: boolean, streak: number, timeTakenMs?: number): number {
    if (!isCorrect) return 0;
    let base = 10;
    if (streak > 2) base += 5; // Streak bonus
    if (timeTakenMs && timeTakenMs < 10000) base += 5; // Speed bonus
    return base;
  }

  static checkLevelUp(currentXP: number, currentLevel: number): boolean {
    const nextBoundary = XP_PER_LEVEL[currentLevel] || Infinity;
    return currentXP >= nextBoundary;
  }

  static getNextBoundary(level: number): number {
    return XP_PER_LEVEL[level] || Infinity;
  }

  // Define challenge constraints based on level
  static getChallengeConstraints(level: number): { allowedFigures: number[] } {
    if (level === 1) return { allowedFigures: [1] }; // Start simple
    if (level === 2) return { allowedFigures: [1, 2] };
    if (level === 3) return { allowedFigures: [2, 3] };
    if (level === 4) return { allowedFigures: [1, 2, 3] };
    return { allowedFigures: [1, 2, 3, 4] }; // Advanced mixes everything
  }
}
