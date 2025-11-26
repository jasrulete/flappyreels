import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Film, Trophy, Gamepad2, Instagram } from 'lucide-react';
import { Button } from "../components/ui/button";
import FlappyBird from "../components/game/FlappyBird";
import ReelsGallery from "../components/game/ReelsGallery";

export default function Home() {
    const [totalReels, setTotalReels] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [currentScore, setCurrentScore] = useState(0);
    const [showGallery, setShowGallery] = useState(false);
    const [gamesPlayed, setGamesPlayed] = useState(0);

    // Load saved data
    useEffect(() => {
        const saved = localStorage.getItem('flappyReels');
        if (saved) {
            const data = JSON.parse(saved);
            setTotalReels(data.totalReels || 0);
            setHighScore(data.highScore || 0);
            setGamesPlayed(data.gamesPlayed || 0);
        }
    }, []);

    // Save data
    const saveData = (newTotalReels, newHighScore, newGamesPlayed) => {
        localStorage.setItem('flappyReels', JSON.stringify({
            totalReels: newTotalReels,
            highScore: newHighScore,
            gamesPlayed: newGamesPlayed
        }));
    };

    const handleGameOver = (score) => {
        const newTotalReels = totalReels + score;
        const newHighScore = Math.max(highScore, score);
        const newGamesPlayed = gamesPlayed + 1;
        
        setTotalReels(newTotalReels);
        setHighScore(newHighScore);
        setGamesPlayed(newGamesPlayed);
        setCurrentScore(0);
        saveData(newTotalReels, newHighScore, newGamesPlayed);
    };

    const handleScoreUpdate = (score) => {
        setCurrentScore(score);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-6">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-6"
                >
                    <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 mb-2">
                        Flappy Reels
                    </h1>
                    <p className="text-white/60 text-sm md:text-base">
                        Score points, unlock Instagram reels! 🎬
                    </p>
                </motion.div>

                {/* Stats Bar */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex justify-center gap-3 md:gap-6 mb-6"
                >
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3 flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                            <Trophy className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-white/50 text-xs">Best</p>
                            <p className="text-white font-bold text-lg">{highScore}</p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => setShowGallery(true)}
                        className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3 flex items-center gap-2 hover:bg-white/20 transition-colors group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Film className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-left">
                            <p className="text-white/50 text-xs">Reels</p>
                            <p className="text-white font-bold text-lg">{totalReels + currentScore}</p>
                        </div>
                    </button>
                    
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3 flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                            <Gamepad2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-white/50 text-xs">Games</p>
                            <p className="text-white font-bold text-lg">{gamesPlayed}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Game Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex justify-center"
                >
                    <FlappyBird 
                        onGameOver={handleGameOver}
                        onScoreUpdate={handleScoreUpdate}
                    />
                </motion.div>

                {/* Watch Reels Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex justify-center mt-6"
                >
                    <Button
                        onClick={() => setShowGallery(true)}
                        className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:opacity-90 text-white font-bold px-8 py-6 rounded-2xl text-lg shadow-lg shadow-pink-500/30 flex items-center gap-3"
                    >
                        <Instagram className="w-6 h-6" />
                        Watch Your Reels ({totalReels + currentScore})
                    </Button>
                </motion.div>

                {/* Instructions */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center mt-8 text-white/40 text-sm"
                >
                    <p>Tap or click to flap • Each point = 1 reel to watch</p>
                </motion.div>
            </div>

            {/* Reels Gallery Modal */}
            <ReelsGallery 
                unlockedCount={Math.min(totalReels + currentScore, 12)}
                isOpen={showGallery}
                onClose={() => setShowGallery(false)}
            />
        </div>
    );
}