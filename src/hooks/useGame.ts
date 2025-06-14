import { useReducer } from "react";
import { GameState, PlayerId, BoardState, Player } from "@/types";
import { calculateFlippableCells } from "@/logic/gameLogic";

// 初期設定
const BOARD_SIZE = 5; // 5x5マス
const PLAYERS: Player[] = [
    { id: 1, name: "Player 1", color: "bg-red-500" },
    { id: 2, name: "Player 2", color: "bg-blue-500" },
    { id: 3, name: "Player 3", color: "bg-yellow-500" },
];

// 初期盤面を生成する関数
const createInitialBoard = (size: number): BoardState =>
    Array(size)
        .fill(null)
        .map(() => Array(size).fill({ owner: 0, isAttackChance: false }));

// ゲームの初期状態
const initialState: GameState = {
    board: createInitialBoard(BOARD_SIZE),
    players: PLAYERS,
    isAttackChanceMode: false,
    history: [],
};

// Reducerが受け取るアクションの型
type Action =
    | { type: "PLACE_PIECE"; payload: { row: number; col: number; player: PlayerId } }
    | { type: "START_ATTACK_CHANCE" }
    | { type: "SET_ATTACK_CHANCE_TARGET"; payload: { row: number; col: number } }
    | { type: "UNDO" }
    | { type: "RESET" };

// 状態を更新するReducer関数
function gameReducer(state: GameState, action: Action): GameState {
    switch (action.type) {
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
                flippable.forEach(cell => {
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

        case "SET_ATTACK_CHANCE_TARGET": {
            if (!state.isAttackChanceMode) return state;
            const { row, col } = action.payload;
            // 誰かが所有しているマスでなければ無効
            if (state.board[row][col].owner === 0) return state;

            const newBoard = JSON.parse(JSON.stringify(state.board));
            newBoard[row][col].isAttackChance = true;

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
                ...initialState,
                board: createInitialBoard(BOARD_SIZE),
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
