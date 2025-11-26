import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Physics tuning: lower gravity / slightly stronger jump for a floatier feel
const GRAVITY = 0.3;
const JUMP_STRENGTH = -6;
const PIPE_WIDTH = 70;
const PIPE_GAP = 160;
const PIPE_SPEED = 3;
const BIRD_SIZE = 35;

export default function FlappyBird({ onGameOver, onScoreUpdate }) {
    const canvasRef = useRef(null);
    const gameLoopRef = useRef(null);
    const [gameState, setGameState] = useState('ready'); // ready, playing, over
    const [score, setScore] = useState(0);
    
    const gameDataRef = useRef({
        bird: { x: 80, y: 250, velocity: 0 },
        pipes: [],
        score: 0,
        frameCount: 0
    });

    const resetGame = useCallback(() => {
        gameDataRef.current = {
            bird: { x: 80, y: 250, velocity: 0 },
            pipes: [],
            score: 0,
            frameCount: 0
        };
        setScore(0);
        setGameState('ready');
    }, []);

    const jump = useCallback(() => {
        if (gameState === 'ready') {
            setGameState('playing');
        }
        if (gameState !== 'over') {
            gameDataRef.current.bird.velocity = JUMP_STRENGTH;
        }
    }, [gameState]);

    const handleInteraction = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        jump();
    }, [jump]);

    // Keyboard support
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === 'Space' || e.key === ' ') {
                e.preventDefault();
                jump();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [jump]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        const drawBird = (y) => {
            const x = gameDataRef.current.bird.x;
            const velocity = gameDataRef.current.bird.velocity;
            const rotation = Math.min(Math.max(velocity * 3, -30), 45);
            
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            
            // Body
            const gradient = ctx.createRadialGradient(0, 0, 5, 0, 0, BIRD_SIZE/2);
            gradient.addColorStop(0, '#FFE066');
            gradient.addColorStop(1, '#F59E0B');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.ellipse(0, 0, BIRD_SIZE/2, BIRD_SIZE/2.5, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Wing
            ctx.fillStyle = '#D97706';
            ctx.beginPath();
            const wingY = Math.sin(Date.now() / 50) * 3;
            ctx.ellipse(-5, wingY, 12, 8, -0.3, 0, Math.PI * 2);
            ctx.fill();
            
            // Eye
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(8, -5, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#1F2937';
            ctx.beginPath();
            ctx.arc(10, -5, 4, 0, Math.PI * 2);
            ctx.fill();
            
            // Beak
            ctx.fillStyle = '#EF4444';
            ctx.beginPath();
            ctx.moveTo(15, 0);
            ctx.lineTo(25, 3);
            ctx.lineTo(15, 6);
            ctx.closePath();
            ctx.fill();
            
            ctx.restore();
        };

        const drawPipe = (pipe) => {
            const capHeight = 30;
            const capOverhang = 8;
            
            // Top pipe
            const topGradient = ctx.createLinearGradient(pipe.x, 0, pipe.x + PIPE_WIDTH, 0);
            topGradient.addColorStop(0, '#22C55E');
            topGradient.addColorStop(0.5, '#4ADE80');
            topGradient.addColorStop(1, '#16A34A');
            
            ctx.fillStyle = topGradient;
            ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight - capHeight);
            
            // Top cap
            ctx.fillStyle = '#15803D';
            ctx.beginPath();
            ctx.roundRect(pipe.x - capOverhang, pipe.topHeight - capHeight, PIPE_WIDTH + capOverhang * 2, capHeight, [0, 0, 8, 8]);
            ctx.fill();
            
            // Bottom pipe
            const bottomY = pipe.topHeight + PIPE_GAP;
            ctx.fillStyle = topGradient;
            ctx.fillRect(pipe.x, bottomY + capHeight, PIPE_WIDTH, height - bottomY);
            
            // Bottom cap
            ctx.fillStyle = '#15803D';
            ctx.beginPath();
            ctx.roundRect(pipe.x - capOverhang, bottomY, PIPE_WIDTH + capOverhang * 2, capHeight, [8, 8, 0, 0]);
            ctx.fill();
        };

        const drawBackground = () => {
            // Sky gradient
            const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
            skyGradient.addColorStop(0, '#7DD3FC');
            skyGradient.addColorStop(0.5, '#BAE6FD');
            skyGradient.addColorStop(1, '#FDE68A');
            ctx.fillStyle = skyGradient;
            ctx.fillRect(0, 0, width, height);
            
            // Clouds
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            const cloudOffset = (gameDataRef.current.frameCount * 0.5) % (width + 200);
            [[100, 60], [300, 100], [500, 50], [700, 120]].forEach(([cx, cy]) => {
                const x = ((cx - cloudOffset + width + 200) % (width + 200)) - 100;
                ctx.beginPath();
                ctx.arc(x, cy, 30, 0, Math.PI * 2);
                ctx.arc(x + 25, cy - 10, 25, 0, Math.PI * 2);
                ctx.arc(x + 50, cy, 30, 0, Math.PI * 2);
                ctx.arc(x + 25, cy + 10, 20, 0, Math.PI * 2);
                ctx.fill();
            });
            
            // Ground
            const groundGradient = ctx.createLinearGradient(0, height - 80, 0, height);
            groundGradient.addColorStop(0, '#84CC16');
            groundGradient.addColorStop(1, '#65A30D');
            ctx.fillStyle = groundGradient;
            ctx.fillRect(0, height - 80, width, 80);
            
            // Ground detail
            ctx.fillStyle = '#4D7C0F';
            for (let i = 0; i < width; i += 40) {
                const offset = (i + gameDataRef.current.frameCount * 2) % width;
                ctx.beginPath();
                ctx.moveTo(offset, height - 80);
                ctx.lineTo(offset + 15, height - 80);
                ctx.lineTo(offset + 7.5, height - 95);
                ctx.closePath();
                ctx.fill();
            }
        };

        const checkCollision = () => {
            const bird = gameDataRef.current.bird;
            const birdTop = bird.y - BIRD_SIZE/2;
            const birdBottom = bird.y + BIRD_SIZE/2;
            const birdLeft = bird.x - BIRD_SIZE/2;
            const birdRight = bird.x + BIRD_SIZE/2;
            
            // Ground/ceiling collision
            if (birdBottom > height - 80 || birdTop < 0) return true;
            
            // Pipe collision
            for (const pipe of gameDataRef.current.pipes) {
                const pipeRight = pipe.x + PIPE_WIDTH;
                const bottomPipeTop = pipe.topHeight + PIPE_GAP;
                
                if (birdRight > pipe.x && birdLeft < pipeRight) {
                    if (birdTop < pipe.topHeight || birdBottom > bottomPipeTop) {
                        return true;
                    }
                }
            }
            return false;
        };

        const gameLoop = () => {
            ctx.clearRect(0, 0, width, height);
            drawBackground();
            
            const data = gameDataRef.current;
            
            if (gameState === 'playing') {
                data.frameCount++;
                
                // Update bird
                data.bird.velocity += GRAVITY;
                data.bird.y += data.bird.velocity;
                
                // Spawn pipes
                if (data.frameCount % 100 === 0) {
                    const minHeight = 60;
                    const maxHeight = height - PIPE_GAP - 140;
                    const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;
                    data.pipes.push({ x: width, topHeight, passed: false });
                }
                
                // Update pipes
                data.pipes = data.pipes.filter(pipe => {
                    pipe.x -= PIPE_SPEED;
                    
                    // Score when passing pipe
                    if (!pipe.passed && pipe.x + PIPE_WIDTH < data.bird.x) {
                        pipe.passed = true;
                        data.score++;
                        setScore(data.score);
                        onScoreUpdate?.(data.score);
                    }
                    
                    return pipe.x > -PIPE_WIDTH;
                });
                
                // Check collision
                if (checkCollision()) {
                    setGameState('over');
                    onGameOver?.(data.score);
                }
            }
            
            // Draw pipes
            data.pipes.forEach(drawPipe);
            
            // Draw bird
            drawBird(data.bird.y);
            
            gameLoopRef.current = requestAnimationFrame(gameLoop);
        };

        gameLoopRef.current = requestAnimationFrame(gameLoop);

        return () => {
            if (gameLoopRef.current) {
                cancelAnimationFrame(gameLoopRef.current);
            }
        };
    }, [gameState, onGameOver, onScoreUpdate]);

    return (
        <div className="relative w-full max-w-md mx-auto">
            <canvas
                ref={canvasRef}
                width={400}
                height={600}
                className="w-full rounded-3xl shadow-2xl cursor-pointer touch-none"
                onClick={handleInteraction}
                onMouseDown={handleInteraction}
                onTouchStart={handleInteraction}
            />
            
            {/* Score Display */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2">
                <motion.div 
                    key={score}
                    initial={{ scale: 1.3 }}
                    animate={{ scale: 1 }}
                    className="text-6xl font-black text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]"
                    style={{ textShadow: '3px 3px 0 #1F2937, -1px -1px 0 #1F2937, 1px -1px 0 #1F2937, -1px 1px 0 #1F2937' }}
                >
                    {score}
                </motion.div>
            </div>
            
            {/* Ready State */}
            <AnimatePresence>
                {gameState === 'ready' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex flex-col items-center justify-center"
                        onClick={handleInteraction}
                        onTouchStart={handleInteraction}
                    >
                        <motion.div 
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="text-center"
                        >
                            <p className="text-2xl font-bold text-white drop-shadow-lg mb-2">
                                Tap to Start
                            </p>
                            <p className="text-white/80 text-sm drop-shadow">
                                Score points = Reels to watch! 🎬
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {/* Game Over */}
            <AnimatePresence>
                {gameState === 'over' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-3xl"
                    >
                        <div className="bg-white rounded-2xl p-6 text-center shadow-2xl mx-4">
                            <h2 className="text-3xl font-black text-gray-800 mb-2">Game Over!</h2>
                            <p className="text-5xl font-black text-amber-500 mb-1">{score}</p>
                            <p className="text-gray-500 mb-4">reels unlocked 🎉</p>
                            <button
                                onClick={resetGame}
                                className="px-8 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
                            >
                                Play Again
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}