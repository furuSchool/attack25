import { Player, PlayerId } from '@/types';

interface Props {
  players: Player[];
  currentPlayerId: PlayerId;
  onPlayerChange: (id: PlayerId) => void;
  onUndo: () => void;
  onReset: () => void;
  onAttackChance: () => void;
  isAttackChanceMode: boolean;
}

export default function GameControls({
  players, currentPlayerId, onPlayerChange, onUndo, onReset, onAttackChance, isAttackChanceMode
}: Props) {
  return (
    <div className="p-4 bg-white rounded-lg shadow flex flex-col gap-3">
      <div>
        <label htmlFor="player-select" className="block text-sm font-medium text-gray-700">
          パネル選択
        </label>
        <select
          id="player-select"
          value={currentPlayerId}
          onChange={(e) => onPlayerChange(Number(e.target.value) as PlayerId)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {players.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      <button
        onClick={onAttackChance}
        className={`w-full px-4 py-2 text-white font-bold rounded-md ${isAttackChanceMode ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-gray-600 hover:bg-gray-700'}`}
      >
        {isAttackChanceMode ? 'アタックチャンス中' : 'アタックチャンス'}
      </button>

      <div className="flex gap-2">
        <button onClick={onUndo} className="flex-1 px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700">
          一つ前に戻す
        </button>
        <button onClick={onReset} className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">
          リセット
        </button>
      </div>
    </div>
  );
}