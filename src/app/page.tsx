"use client"; // このファイルがクライアントサイドで動作することを示す

import { useState } from "react";
import { useGame } from "@/hooks/useGame";
import { PlayerId } from "@/types";
import Header from "@/components/Header";
import Board from "@/components/Board";
import GameControls from "@/components/GameControls";
import PlayerInfo from "@/components/PlayerInfo";

export default function Home() {
    const { state, dispatch } = useGame();
    const [currentPlayerId, setCurrentPlayerId] = useState<PlayerId>(1);

    const handleCellClick = (row: number, col: number) => {
        if (state.isAttackChanceMode) {
            dispatch({ type: "SET_ATTACK_CHANCE_TARGET", payload: { row, col } });
        } else {
            dispatch({ type: "PLACE_PIECE", payload: { row, col, player: currentPlayerId } });
        }
    };

    return (
<main className="flex flex-col w-full min-h-screen bg-gray-100">
    <Header
        boardSize={state.boardSize}
        playerCount={state.players.length}
        dispatch={dispatch}
    />

    <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-8 mt-4 md:mt-8">
        <div className="flex-1 flex justify-center items-center">
            <div className="w-full max-w-[85vh]">
                <Board
                    board={state.board}
                    players={state.players}
                    onCellClick={handleCellClick}
                />
            </div>
        </div>
        <div className="w-full md:w-80 flex-shrink-0 flex flex-col gap-4">
            <PlayerInfo players={state.players} board={state.board} />
            <GameControls
                players={state.players}
                currentPlayerId={currentPlayerId}
                onPlayerChange={setCurrentPlayerId}
                onUndo={() => dispatch({ type: "UNDO" })}
                onReset={() => dispatch({ type: "RESET" })}
                onAttackChance={() => dispatch({ type: state.isAttackChanceMode ? "END_ATTACK_CHANCE" : "START_ATTACK_CHANCE" })}
                isAttackChanceMode={state.isAttackChanceMode}
            />
        </div>
    </div>
</main>
    );
}
