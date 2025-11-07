import React from 'react';
import { BookmarkedPlayer } from '../types';

interface PlayerTagInputProps {
    playerTag: string;
    onPlayerTagChange: (tag: string) => void;
    onImport: (playerTag: string) => void;
    isLoading: boolean;
    error: string | null;
    currentPlayer: { tag: string; name: string } | null;
    bookmarkedPlayers: BookmarkedPlayer[];
    onBookmark: () => void;
}

const PlayerTagInput: React.FC<PlayerTagInputProps> = ({ 
    playerTag, 
    onPlayerTagChange, 
    onImport, 
    isLoading, 
    error,
    currentPlayer,
    bookmarkedPlayers,
    onBookmark
}) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onImport(playerTag.trim());
    };

    const isBookmarked = currentPlayer ? bookmarkedPlayers.some(p => p.tag === currentPlayer.tag) : false;

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg max-w-lg mx-auto">
            <h2 className="text-xl font-bold text-center mb-4 text-gray-300">Import Player Data</h2>
            <p className="text-center text-sm text-gray-500 mb-4">
                Enter your player tag to load equipment levels. You can bookmark players after a successful import.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-4">
                <input
                    type="text"
                    value={playerTag}
                    onChange={(e) => onPlayerTagChange(e.target.value.toUpperCase())}
                    placeholder="#PLAYERTAG"
                    className="flex-grow w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    aria-label="Player Tag"
                />
                <button
                    type="submit"
                    disabled={isLoading || !playerTag}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md shadow-md transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Loading...' : 'Import'}
                </button>
            </form>
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            
            {currentPlayer && !isLoading && !error && (
                 <div className="text-center mt-4">
                     <p className="text-gray-400 mb-2">Successfully loaded: <span className="font-bold text-white">{currentPlayer.name}</span></p>
                    <button
                        onClick={onBookmark}
                        disabled={isBookmarked}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                        {isBookmarked ? '✓ Bookmarked' : 'Bookmark Player'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default PlayerTagInput;