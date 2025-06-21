import { BoardState, Player, PlayerId } from "@/types";
import { Dispatch } from "react";
import { Action } from "@/hooks/useGame";

interface Props {
    players: Player[];
    board: BoardState;
    dispatch: Dispatch<Action>;
}

export default function PlayerInfo({ players, board, dispatch }: Props) {
    const scores = players.map((player) => ({
        ...player,
        score: board.flat().filter((cell) => cell.owner === player.id).length,
    }));
    const handleNameChange = (id: PlayerId, newName: string) => {
        dispatch({
            type: "CHANGE_PLAYER_NAME",
            payload: { playerId: id, newName: newName },
        });
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold mb-2">スコア</h2>
            {scores.map((p) => (
                <div key={p.id} className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 w-full pr-4">
                        <div className={`w-5 h-5 rounded-full ${p.color} flex-shrink-0`} />
                        <input
                            type="text"
                            value={p.name}
                            onChange={(e) => handleNameChange(p.id, e.target.value)}
                            className="w-full bg-transparent p-1 rounded-md hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
                            aria-label={`${p.name}の名前`}
                        />
                    </div>
                    <span className="font-bold text-lg">{p.score}</span>
                </div>
            ))}
        </div>
    );
}
