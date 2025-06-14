import { BoardState, Player } from '@/types';

interface Props {
  players: Player[];
  board: BoardState;
}

export default function PlayerInfo({ players, board }: Props) {
  const scores = players.map(player => ({
    ...player,
    score: board.flat().filter(cell => cell.owner === player.id).length,
  }));

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-2">スコア</h2>
      {scores.map(p => (
        <div key={p.id} className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className={`w-5 h-5 rounded-full ${p.color}`} />
            <span>{p.name}</span>
          </div>
          <span className="font-bold text-lg">{p.score}</span>
        </div>
      ))}
    </div>
  );
}