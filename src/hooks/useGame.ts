import { useReducer } from "react";
import { GameState, PlayerId, BoardState, Player } from "@/types";
import { calculateFlippableCells } from "@/logic/gameLogic";

// 初期設定
const INITIAL_BOARD_SIZE = 5;
const INITIAL_PLAYER_COUNT = 4;

// 利用可能なプレイヤーカラー
const PLAYER_COLORS = [
    "bg-rose-600", // ローズ
    "bg-green-600", // グリーン
    "bg-gray-300", // グレー
    "bg-blue-600", // ブルー
    "bg-purple-600", // パープル
    "bg-orange-600", // オレンジ
    "bg-teal-600", // ティール
    "bg-cyan-600", // シアン
];

const createPlayers = (count: number): Player[] => {
    return Array.from({ length: count }, (_, i) => ({
        id: (i + 1) as PlayerId,
        name: `Player ${i + 1}`,
        color: PLAYER_COLORS[i % PLAYER_COLORS.length],
    }));
};

// 初期盤面を生成する関数
const createInitialBoard = (size: number): BoardState =>
    Array(size)
        .fill(null)
        .map(() => Array(size).fill({ owner: 0, isAttackChance: false }));

// ゲームの初期状態
const initialState: GameState = {
    boardSize: INITIAL_BOARD_SIZE,
    board: createInitialBoard(INITIAL_BOARD_SIZE),
    players: createPlayers(INITIAL_PLAYER_COUNT),
    isAttackChanceMode: false,
    history: [],
};

// Reducerが受け取るアクションの型
export type Action =
    | { type: "PLACE_PIECE"; payload: { row: number; col: number; player: PlayerId } }
    | { type: "START_ATTACK_CHANCE" }
    | { type: "END_ATTACK_CHANCE" }
    | { type: "SET_ATTACK_CHANCE_TARGET"; payload: { row: number; col: number } }
    | { type: "CHANGE_SETTINGS"; payload: { boardSize?: number; playerCount?: number } }
    | { type: "CHANGE_PLAYER_NAME"; payload: { playerId: PlayerId; newName: string } }
    | { type: "UNDO" }
    | { type: "RESET" };

// 状態を更新するReducer関数
function gameReducer(state: GameState, action: Action): GameState {
    switch (action.type) {
        case "CHANGE_SETTINGS": {
            const newBoardSize = action.payload.boardSize ?? state.boardSize;
            const newPlayerCount = action.payload.playerCount ?? state.players.length;

            const newPlayers = createPlayers(newPlayerCount);
            const newBoard = createInitialBoard(newBoardSize);

            // 設定が変更されたらゲーム全体をリセット
            return {
                boardSize: newBoardSize,
                board: newBoard,
                players: newPlayers,
                isAttackChanceMode: false,
                history: [],
            };
        }
        case "CHANGE_PLAYER_NAME": {
            const { playerId, newName } = action.payload;
            return {
                ...state,
                players: state.players.map(player =>
                    player.id === playerId ? { ...player, name: newName } : player
                ),
            };
        }
        case "PLACE_PIECE": {
            const { row, col, player } = action.payload;
            const newBoard = JSON.parse(JSON.stringify(state.board)); // deep copy
            const targetCell = newBoard[row][col];

            // アタックチャンスマスへの配置
            if (targetCell.isAttackChance) {
                const tempBoard = JSON.parse(JSON.stringify(state.board));
                tempBoard[row][col].owner = 0;
                const flippable = calculateFlippableCells(tempBoard, row, col, player);

                targetCell.owner = player;
                targetCell.isAttackChance = false;
                flippable.forEach((cell) => {
                    newBoard[cell.row][cell.col].owner = player;
                });

                return {
                    ...state,
                    history: [...state.history, state], // 現在の状態を履歴に追加
                    board: newBoard,
                };
            }

            // 通常の配置
            const flippable = calculateFlippableCells(state.board, row, col, player);
            // if (flippable.length === 0) return state; // ひっくり返せないので無効

            newBoard[row][col] = { owner: player, isAttackChance: false };
            flippable.forEach((cell) => {
                newBoard[cell.row][cell.col].owner = player;
            });

            return {
                ...state,
                history: [...state.history, state], // 現在の状態を履歴に追加
                board: newBoard,
            };
        }

        case "START_ATTACK_CHANCE":
            return { ...state, isAttackChanceMode: true };

        case "END_ATTACK_CHANCE":
            return { ...state, isAttackChanceMode: false };

        case "SET_ATTACK_CHANCE_TARGET": {
            if (!state.isAttackChanceMode) return state;
            const { row, col } = action.payload;
            // 誰かが所有しているマスでなければ無効
            if (state.board[row][col].owner === 0) return state;

            const newBoard = JSON.parse(JSON.stringify(state.board));
            newBoard[row][col].isAttackChance = true;
            newBoard[row][col].owner = 0;

            return {
                ...state,
                history: [...state.history, state],
                board: newBoard,
                isAttackChanceMode: false, // ターゲット選択後はモード解除
            };
        }

        case "UNDO": {
            if (state.history.length === 0) return state;
            const previousState = state.history[state.history.length - 1];
            return previousState;
        }

        case "RESET":
            return {
                ...state,
                board: createInitialBoard(state.boardSize),
                isAttackChanceMode: false,
                history: [],
            };

        default:
            throw new Error("Unknown action type");
    }
}

// このカスタムフックをコンポーネントで使う
export const useGame = () => {
    const [state, dispatch] = useReducer(gameReducer, initialState);
    return { state, dispatch };
};
