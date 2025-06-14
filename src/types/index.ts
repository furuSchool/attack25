export type PlayerId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10; // プレイヤーID
export type CellOwner = 0 | PlayerId;

// プレイヤー情報
export interface Player {
  id: PlayerId;
  name: string;
  color: string;
}

// 各マスの状態
export interface CellState {
  owner: CellOwner;
  isAttackChance: boolean;
}

// ゲーム全体の盤面の状態
export type BoardState = CellState[][];

// ゲーム全体のの状態
export interface GameState {
  board: BoardState;
  players: Player[];
  isAttackChanceMode: boolean; // アタックチャンス中か
  history: GameState[]; // 履歴
}