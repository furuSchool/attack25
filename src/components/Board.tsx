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
    return (
        <div className="grid grid-cols-5 gap-1 p-2 bg-black">
            {board.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                    const panelNumber = rowIndex * board.length + colIndex + 1;
                    return (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            className={`w-32 h-32 flex items-center justify-center cursor-pointer transition-all duration-300 transform hover:scale-105 ${getCellClass(
                                cell.owner,
                                cell.isAttackChance,
                                players
                            )}`}
                            onClick={() => onCellClick(rowIndex, colIndex)}
                        >
                            {cell.owner === 0 && (
                                <span className="text-5xl font-bold text-black opacity-100 select-none">
                                    {panelNumber}
                                </span>
                            )}
                        </div>
                    );
                })
            )}
        </div>
    );
}
