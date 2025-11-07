import React from 'react';
import { BookmarkedPlayer } from '../types';

interface BookmarkedPlayersProps {
    players: BookmarkedPlayer[];
    onLoad: (tag: string) => void;
    onRemove: (tag: string) => void;
    isLoading: boolean;
}

const BookmarkedPlayers: React.FC<BookmarkedPlayersProps> = ({ players, onLoad, onRemove, isLoading }) => {
    if (players.length === 0) {
        return null; // Don't render anything if there are no bookmarks
    }

    return (
        <div className="mt-8 max-w-lg mx-auto">
            <h2 className="text-xl font-bold text-center mb-4 text-gray-300">Bookmarked Players</h2>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-lg space-y-3">
                {players.map(player => (
                    <div key={player.tag} className="group flex items-center justify-between bg-gray-700 p-2 rounded-md hover:bg-gray-600 transition-colors">
                        <button
                            onClick={() => onLoad(player.tag)}
                            disabled={isLoading}
                            className="flex-grow text-left disabled:cursor-not-allowed"
                        >
                            <span className="font-bold text-lg text-white group-hover:text-yellow-400 transition-colors">{player.name}</span>
                            <span className="block font-mono text-sm text-gray-400">{player.tag}</span>
                        </button>
                        <button
                            onClick={() => onRemove(player.tag)}
                            className="text-gray-400 hover:text-red-500 p-1 rounded-full flex-shrink-0"
                            aria-label={`Remove ${player.tag}`}
                            disabled={isLoading}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BookmarkedPlayers;