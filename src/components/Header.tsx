import { Dispatch } from "react";

// useGameフックのAction型をインポート（後で作成）
import { Action } from "@/hooks/useGame";

interface Props {
    boardSize: number;
    playerCount: number;
    dispatch: Dispatch<Action>;
}

export default function Header({ boardSize, playerCount, dispatch }: Props) {
    const handleBoardSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSize = parseInt(e.target.value, 10);
        if (newSize > 1 && newSize <= 8) {
            // 2x2から8x8までに制限
            dispatch({ type: "CHANGE_SETTINGS", payload: { boardSize: newSize } });
        }
    };

    const handlePlayerCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newCount = parseInt(e.target.value, 10);
        if (newCount > 1 && newCount <= 8) {
            // 2人から8人までに制限
            dispatch({ type: "CHANGE_SETTINGS", payload: { playerCount: newCount } });
        }
    };

    return (
        <header className="w-full bg-white shadow-lg">
            {/* インナーコンテナ：コンテンツの最大幅を決め、中央に配置する */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4">
                    <h1 className="text-3xl font-extrabold text-gray-800">
                        アタック25
                    </h1>
                    <div className="flex items-center gap-x-4 sm:gap-x-6">
                        <div>
                            <label
                                htmlFor="player-count"
                                className="text-sm font-medium text-gray-600"
                            >
                                プレイヤー人数（２ ~ ８人）
                            </label>
                            <input
                                type="number"
                                id="player-count"
                                value={playerCount}
                                onChange={handlePlayerCountChange}
                                className="w-20 ml-2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                                min="2"
                                max="8"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="board-size"
                                className="text-sm font-medium text-gray-600"
                            >
                                一辺のマス数
                            </label>
                            <input
                                type="number"
                                id="board-size"
                                value={boardSize}
                                onChange={handleBoardSizeChange}
                                className="w-20 ml-2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                                min="2"
                                max="8"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
