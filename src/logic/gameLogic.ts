import { BoardState, PlayerId } from '@/types';

const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1],
];

// 指定されたマスにピースを置いた場合にひっくり返せるマスを計算する
export const calculateFlippableCells = (
  board: BoardState,
  row: number,
  col: number,
  player: PlayerId
): { row: number; col: number }[] => {
  const size = board.length;
  const flippableCells: { row: number; col: number }[] = [];

  // 既にマスが埋まっている場合は置けない
  if (board[row][col].owner !== 0) {
    console.warn(`このマスは既に埋まっています!`);
    return [];
  }

  DIRECTIONS.forEach(([dr, dc]) => {
    const cellsToFlip: { row: number; col: number }[] = [];
    let currentRow = row + dr;
    let currentCol = col + dc;

    while (
      currentRow >= 0 && currentRow < size &&
      currentCol >= 0 && currentCol < size
    ) {
      const currentCellOwner = board[currentRow][currentCol].owner;

      if (currentCellOwner === 0 || currentCellOwner === player) {
        if (currentCellOwner === player) {
          // 自分の色にたどり着いたら、間のマスをひっくり返す対象に追加
          flippableCells.push(...cellsToFlip);
        }
        break;
      } else {
        // 相手の色なら、ひっくり返す候補として追加
        cellsToFlip.push({ row: currentRow, col: currentCol });
      }

      currentRow += dr;
      currentCol += dc;
    }
  });

  return flippableCells;
};