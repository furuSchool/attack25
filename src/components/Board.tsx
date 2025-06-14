import { BoardState, Player } from "@/types";

interface Props {
    board: BoardState;
    players: Player[];
    onCellClick: (row: number, col: number) => void;
}

// セルの見た目を決めるヘルパー
const getCellClass = (owner: number, isAttackChance: boolean, players: Player[]) => {
    if (isAttackChance) {
        return "bg-yellow-400 border-4 border-yellow-600";
    }
    const player = players.find((p: Player) => p.id === owner);
    return player ? player.color : "bg-zinc-400";
};

export default function Board({ board, players, onCellClick }: Props) {
    const boardSize = board.length;
    return (
        <div
            // ★盤面コンテナの修正
            className="grid w-full aspect-square gap-1 p-2 bg-black"
            style={{ gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))` }}
        >
            {board.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                    const panelNumber = rowIndex * board.length + colIndex + 1;
                    return (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            className={`aspect-square flex items-center justify-center cursor-pointer transition-all duration-300 transform hover:scale-105 ${getCellClass(
                                cell.owner,
                                cell.isAttackChance,
                                players
                            )}`}
                            onClick={() => onCellClick(rowIndex, colIndex)}
                        >
                            <span className="text-5xl font-bold text-black opacity-100 select-none">
                                {panelNumber}
                            </span>
                        </div>
                    );
                })
            )}
        </div>
    );
}
