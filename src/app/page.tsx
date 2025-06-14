'use client'; // このファイルがクライアントサイドで動作することを示す

import { useState } from 'react';
import { useGame } from '@/hooks/useGame';
import { PlayerId } from '@/types';
import Board from '@/components/Board';
import GameControls from '@/components/GameControls';
import PlayerInfo from '@/components/PlayerInfo';

export default function Home() {
  const { state, dispatch } = useGame();
  const [currentPlayerId, setCurrentPlayerId] = useState<PlayerId>(1);

  const handleCellClick = (row: number, col: number) => {
    if (state.isAttackChanceMode) {
      dispatch({ type: 'SET_ATTACK_CHANCE_TARGET', payload: { row, col } });
    } else {
      dispatch({ type: 'PLACE_PIECE', payload: { row, col, player: currentPlayerId } });
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-4">アタック25</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <Board board={state.board} players={state.players} onCellClick={handleCellClick} />
        <div className="flex flex-col gap-4">
          <PlayerInfo players={state.players} board={state.board} />
          <GameControls
            players={state.players}
            currentPlayerId={currentPlayerId}
            onPlayerChange={setCurrentPlayerId}
            onUndo={() => dispatch({ type: 'UNDO' })}
            onReset={() => dispatch({ type: 'RESET' })}
            onAttackChance={() => dispatch({ type: 'START_ATTACK_CHANCE' })}
            isAttackChanceMode={state.isAttackChanceMode}
          />
        </div>
      </div>
    </main>
  );
}