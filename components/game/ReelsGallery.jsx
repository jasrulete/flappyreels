import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Lock, Film, ExternalLink } from 'lucide-react';

// Sample Instagram Reels - these are popular/viral reel IDs
const SAMPLE_REELS = [
    { id: 'DNm9Z6ah3kn', title: 'Trending Reel #1' },
    { id: 'DRev3S9Et1r', title: 'Trending Reel #2' },
    { id: 'DP9d4xZD-bc', title: 'Trending Reel #3' },
    { id: 'DNYM5UnxzGl', title: 'Trending Reel #4' },
    { id: 'DRdL7hfAhtP', title: 'Trending Reel #5' },
    { id: 'C8lv6lUIaWh', title: 'Trending Reel #6' },
    { id: 'C8jWpjHoZvM', title: 'Trending Reel #7' },
    { id: 'C8g_FFfoD9F', title: 'Trending Reel #8' },
    { id: 'C8enK7voHLr', title: 'Trending Reel #9' },
    { id: 'C8cO_LvoZNe', title: 'Trending Reel #10' },
    { id: 'C8Z0kVLIHDa', title: 'Trending Reel #11' },
    { id: 'C8XbR5lIi1z', title: 'Trending Reel #12' },
];

export default function ReelsGallery({ unlockedCount, isOpen, onClose }) {
    const [selectedReel, setSelectedReel] = useState(null);
    
    const handleWatchReel = (reel) => {
        // Open Instagram reel in new tab
        window.open(`https://www.instagram.com/reel/${reel.id}/`, '_blank');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="bg-white rounded-3xl max-w-lg w-full max-h-[80vh] overflow-hidden shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-black flex items-center gap-2">
                                        <Film className="w-6 h-6" />
                                        Your Reels
                                    </h2>
                                    <p className="text-white/80 text-sm mt-1">
                                        {unlockedCount} of {SAMPLE_REELS.length} unlocked
                                    </p>
                                </div>
                                <button 
                                    onClick={onClose}
                                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            
                            {/* Progress bar */}
                            <div className="mt-4 h-2 bg-white/30 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(unlockedCount / SAMPLE_REELS.length) * 100}%` }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="h-full bg-white rounded-full"
                                />
                            </div>
                        </div>
                        
                        {/* Reels Grid */}
                        <div className="p-4 overflow-y-auto max-h-[50vh]">
                            {unlockedCount === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Lock className="w-10 h-10 text-gray-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">No Reels Yet!</h3>
                                    <p className="text-gray-500">pagdola to unlock reels to watch</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 gap-3">
                                    {SAMPLE_REELS.map((reel, index) => {
                                        const isUnlocked = index < unlockedCount;
                                        
                                        return (
                                            <motion.div
                                                key={reel.id}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: index * 0.05 }}
                                                className={`h-40 rounded-xl overflow-hidden relative group cursor-pointer ${
                                                    isUnlocked ? 'bg-gradient-to-br from-purple-400 to-pink-500' : 'bg-gray-200'
                                                }`}
                                                onClick={() => isUnlocked && handleWatchReel(reel)}
                                            >
                                                {isUnlocked ? (
                                                    <>
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center group-hover:bg-white/50 transition-colors">
                                                                <Play className="w-6 h-6 text-white fill-white" />
                                                            </div>
                                                        </div>
                                                        <div className="absolute bottom-2 left-2 right-2">
                                                            <p className="text-white text-xs font-medium truncate">
                                                                Reel #{index + 1}
                                                            </p>
                                                        </div>
                                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <ExternalLink className="w-4 h-4 text-white" />
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <Lock className="w-6 h-6 text-gray-400" />
                                                    </div>
                                                )}
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                        
                        {/* Footer */}
                        <div className="p-4 border-t bg-gray-50">
                            <p className="text-center text-sm text-gray-500">
                                Mag eskor ka para maka watch kana ng reels! 🎮
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}