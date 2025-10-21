import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Trophy, Coins, Settings, Smartphone } from 'lucide-react';

const BananaRunner = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const gameLoopRef = useRef(null);
  const [gameState, setGameState] = useState('menu');
  const [score, setScore] = useState(0);
  const [distance, setDistance] = useState(0);
  const [coins, setCoins] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [isMobile, setIsMobile] = useState(false);
  const [selectedBanana, setSelectedBanana] = useState({
    head: 'default',
    accessory: 'default',
    shirt: 'default'
  });

  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });

  const gameRef = useRef({
    player: { x: 150, y: 300, width: 40, height: 60, velocityY: 0, isJumping: false, isSliding: false },
    obstacles: [],
    collectibles: [],
    background: { x: 0 },
    gameSpeed: 5,
    gravity: 0.8,
    jumpForce: -15,
    score: 0,
    distance: 0,
    coins: 0,
    theme: 'urban',
    obstacleTimer: 0,
    collectibleTimer: 0,
    scale: 1
  });

  const themes = {
    urban: {
      name: 'Urban City',
      sky: '#87CEEB',
      ground: '#555555',
      buildings: ['#8B4513', '#A0522D', '#CD853F'],
      obstacles: ['🚗', '🚧', '🚦']
    },
    desert: {
      name: 'Desert Sands',
      sky: '#FFE4B5',
      ground: '#EDC9AF',
      buildings: ['#D2691E', '#8B4513', '#A0522D'],
      obstacles: ['🌵', '🦂', '🪨']
    },
    tropical: {
      name: 'Tropical Beach',
      sky: '#00CED1',
      ground: '#F4A460',
      buildings: ['#228B22', '#32CD32', '#00FF00'],
      obstacles: ['🥥', '🦀', '🏖️']
    }
  };

  const abilities = {
    head: {
      default: { name: 'None', power: 'none' },
      chef: { name: 'Chef Hat', power: 'magnet', emoji: '👨‍🍳' },
      detective: { name: 'Detective', power: 'slowmo', emoji: '🕵️' },
      wizard: { name: 'Wizard', power: 'doubleJump', emoji: '🧙' }
    },
    accessory: {
      default: { name: 'None', power: 'none' },
      sunglasses: { name: 'Sunglasses', power: 'shield', emoji: '😎' },
      backpack: { name: 'Backpack', power: 'storage', emoji: '🎒' }
    },
    shirt: {
      default: { name: 'None', power: 'none' },
      suit: { name: 'Suit', power: 'coinBoost', emoji: '👔' },
      casual: { name: 'Casual', power: 'balanced', emoji: '👕' }
    }
  };

  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const containerWidth = container.clientWidth;
      const isMobileDevice = window.innerWidth < 768;
      setIsMobile(isMobileDevice);
      
      let width, height;
      
      if (isMobileDevice) {
        width = Math.min(containerWidth - 20, 600);
        height = Math.min(window.innerHeight * 0.6, 450);
      } else {
        width = Math.min(containerWidth - 40, 800);
        height = 600;
      }
      
      setCanvasSize({ width, height });
      gameRef.current.scale = width / 800;
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const drawBanana = (ctx, x, y, width, height, customization) => {
    ctx.save();
    
    ctx.fillStyle = '#FFD93D';
    ctx.beginPath();
    ctx.ellipse(x, y + height/2, width/2, height/2, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#E0C24B';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - width/4, y + height/4);
    ctx.lineTo(x - width/4, y + height * 0.75);
    ctx.stroke();
    
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(x - 8, y + height/2 - 5, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 8, y + height/2 - 5, 3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y + height/2 + 5, 8, 0, Math.PI);
    ctx.stroke();
    
    const emojiSize = Math.max(16, width * 0.6);
    ctx.font = `${emojiSize}px Arial`;
    ctx.textAlign = 'center';
    
    if (customization.head !== 'default') {
      const headEmoji = abilities.head[customization.head]?.emoji || '🎩';
      ctx.fillText(headEmoji, x, y + height/2 - height * 0.35);
    }
    
    if (customization.accessory !== 'default') {
      const accEmoji = abilities.accessory[customization.accessory]?.emoji || '😎';
      ctx.fillText(accEmoji, x + width * 0.3, y + height/2);
    }
    
    if (customization.shirt !== 'default') {
      const shirtEmoji = abilities.shirt[customization.shirt]?.emoji || '👕';
      ctx.fillText(shirtEmoji, x, y + height/2 + height * 0.35);
    }
    
    ctx.restore();
  };

  const drawBackground = (ctx, game, currentTheme, width, height) => {
    const theme = themes[currentTheme];
    
    ctx.fillStyle = theme.sky;
    ctx.fillRect(0, 0, width, height);
    
    const groundY = height * 0.67;
    
    const buildingOffset = (game.background.x * 0.3) % 200;
    const numBuildings = Math.ceil(width / 200) + 2;
    for (let i = -1; i < numBuildings; i++) {
      const x = i * 200 - buildingOffset;
      const buildingHeight = 100 + Math.sin(i * 0.5) * 30;
      ctx.fillStyle = theme.buildings[i % theme.buildings.length];
      ctx.fillRect(x, groundY - buildingHeight, 150, buildingHeight);
    }
    
    ctx.fillStyle = theme.ground;
    ctx.fillRect(0, groundY, width, height - groundY);
    
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.lineWidth = 2;
    const lineOffset = game.background.x % 100;
    for (let i = 0; i < Math.ceil(width / 100) + 1; i++) {
      const x = i * 100 - lineOffset;
      ctx.beginPath();
      ctx.moveTo(x, groundY);
      ctx.lineTo(x + 50, groundY);
      ctx.stroke();
    }
  };

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const game = gameRef.current;
    const { width, height } = canvasSize;
    
    const scale = width / 800;
    const groundY = height * 0.67;
    const playerX = 150 * scale;
    const playerGroundY = groundY - 60 * scale;
    
    ctx.clearRect(0, 0, width, height);
    
    const themeIndex = Math.floor(game.distance / 500) % Object.keys(themes).length;
    const currentTheme = Object.keys(themes)[themeIndex];
    
    drawBackground(ctx, game, currentTheme, width, height);
    
    game.background.x += game.gameSpeed;
    
    if (game.player.isJumping) {
      game.player.velocityY += game.gravity;
      game.player.y += game.player.velocityY;
      
      if (game.player.y >= playerGroundY) {
        game.player.y = playerGroundY;
        game.player.velocityY = 0;
        game.player.isJumping = false;
      }
    } else {
      game.player.y = playerGroundY;
    }
    
    const playerHeight = game.player.isSliding ? 30 * scale : 60 * scale;
    const playerWidth = 40 * scale;
    
    drawBanana(ctx, playerX, game.player.y, playerWidth, playerHeight, selectedBanana);
    
    game.obstacleTimer++;
    if (game.obstacleTimer > Math.max(60 - (game.gameSpeed * 1.5), 30)) {
      game.obstacles.push({
        x: width,
        y: groundY,
        width: 40 * scale,
        height: 60 * scale,
        type: themes[currentTheme].obstacles[Math.floor(Math.random() * 3)]
      });
      game.obstacleTimer = 0;
    }
    
    game.collectibleTimer++;
    if (game.collectibleTimer > 50) {
      game.collectibles.push({
        x: width,
        y: groundY - 100 * scale - Math.random() * 100 * scale,
        width: 30 * scale,
        height: 30 * scale,
        type: Math.random() > 0.7 ? '✨' : '🪙',
        collected: false
      });
      game.collectibleTimer = 0;
    }
    
    game.obstacles = game.obstacles.filter(obs => {
      obs.x -= game.gameSpeed;
      
      if (obs.x > -50) {
        ctx.font = `${40 * scale}px Arial`;
        ctx.fillText(obs.type, obs.x, obs.y);
        
        if (
          playerX + playerWidth > obs.x &&
          playerX < obs.x + obs.width &&
          game.player.y + playerHeight > obs.y - obs.height &&
          game.player.y < obs.y
        ) {
          const hasShield = selectedBanana.accessory === 'sunglasses';
          if (!hasShield) {
            setGameState('gameover');
            if (game.score > highScore) {
              setHighScore(game.score);
            }
          } else {
            setSelectedBanana(prev => ({ ...prev, accessory: 'default' }));
          }
        }
        
        return true;
      }
      return false;
    });
    
    game.collectibles = game.collectibles.filter(col => {
      col.x -= game.gameSpeed;
      
      if (col.x > -50 && !col.collected) {
        ctx.font = `${30 * scale}px Arial`;
        ctx.fillText(col.type, col.x, col.y);
        
        const hasMagnet = selectedBanana.head === 'chef';
        const magnetRange = hasMagnet ? 150 * scale : 50 * scale;
        
        const dist = Math.sqrt(
          Math.pow(playerX - col.x, 2) +
          Math.pow(game.player.y + playerHeight/2 - col.y, 2)
        );
        
        if (dist < magnetRange) {
          if (hasMagnet && dist > 50 * scale) {
            col.x += (playerX - col.x) * 0.1;
            col.y += (game.player.y + playerHeight/2 - col.y) * 0.1;
          }
          
          if (dist < 50 * scale) {
            col.collected = true;
            if (col.type === '🪙') {
              const coinValue = selectedBanana.shirt === 'suit' ? 2 : 1;
              game.coins += coinValue;
              game.score += 10 * coinValue;
            } else {
              game.score += 50;
            }
          }
        }
        
        return true;
      }
      return !col.collected;
    });
    
    game.score += 1;
    game.distance += 0.1;
    
    if (game.distance % 100 < 0.1) {
      game.gameSpeed = Math.min(game.gameSpeed + 0.2, 10);
    }
    
    if (Math.floor(game.distance) % 5 === 0) {
      setScore(Math.floor(game.score));
      setDistance(Math.floor(game.distance));
      setCoins(game.coins);
    }
    
    const hudFontSize = Math.max(12, 16 * scale);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillRect(10, 10, 160 * scale, 70 * scale);
    ctx.fillStyle = '#000';
    ctx.font = `bold ${hudFontSize}px Arial`;
    ctx.textAlign = 'left';
    ctx.fillText(`${Math.floor(game.distance)}m`, 15, 25 + hudFontSize);
    ctx.fillText(`Score: ${Math.floor(game.score)}`, 15, 25 + hudFontSize * 2.2);
    ctx.fillText(`🪙 ${game.coins}`, 15, 25 + hudFontSize * 3.4);
    
    ctx.fillStyle = 'rgba(255, 217, 61, 0.95)';
    const themeWidth = 150 * scale;
    ctx.fillRect(width - themeWidth - 10, 10, themeWidth, 35 * scale);
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.font = `bold ${Math.max(11, 14 * scale)}px Arial`;
    ctx.fillText(themes[currentTheme].name, width - themeWidth/2 - 10, 25 + hudFontSize * 0.8);
    
  }, [canvasSize, selectedBanana, highScore]);

  const startGame = () => {
    const groundY = canvasSize.height * 0.67;
    const scale = canvasSize.width / 800;
    
    gameRef.current = {
      player: { 
        x: 150 * scale, 
        y: groundY - 60 * scale, 
        width: 40 * scale, 
        height: 60 * scale, 
        velocityY: 0, 
        isJumping: false, 
        isSliding: false 
      },
      obstacles: [],
      collectibles: [],
      background: { x: 0 },
      gameSpeed: 5,
      gravity: 0.8,
      jumpForce: selectedBanana.head === 'wizard' ? -18 : -15,
      score: 0,
      distance: 0,
      coins: 0,
      theme: 'urban',
      obstacleTimer: 0,
      collectibleTimer: 0,
      scale
    };
    setScore(0);
    setDistance(0);
    setCoins(0);
    setGameState('playing');
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const handleTouchStart = (e) => {
      if (gameState !== 'playing') return;
      e.preventDefault();
      
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now()
      };
    };
    
    const handleTouchEnd = (e) => {
      if (gameState !== 'playing') return;
      e.preventDefault();
      
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      const deltaTime = Date.now() - touchStartRef.current.time;
      
      const game = gameRef.current;
      
      if (deltaY > 30 && Math.abs(deltaX) < 50 && deltaTime < 300) {
        if (!game.player.isJumping) {
          game.player.isSliding = true;
          setTimeout(() => {
            game.player.isSliding = false;
          }, 400);
        }
      }
      else if ((deltaTime < 200 && Math.abs(deltaY) < 20) || (deltaY < -30 && deltaTime < 300)) {
        if (!game.player.isJumping) {
          game.player.isJumping = true;
          game.player.velocityY = game.jumpForce;
        }
      }
    };
    
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
    
    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [gameState, selectedBanana]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameState !== 'playing') return;
      
      const game = gameRef.current;
      
      if ((e.key === 'ArrowUp' || e.key === ' ') && !game.player.isJumping) {
        game.player.isJumping = true;
        game.player.velocityY = game.jumpForce;
      }
      
      if (e.key === 'ArrowDown' && !game.player.isJumping) {
        game.player.isSliding = true;
        setTimeout(() => {
          game.player.isSliding = false;
        }, 400);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, selectedBanana]);

  useEffect(() => {
    if (gameState === 'playing') {
      gameLoopRef.current = setInterval(gameLoop, 1000 / 60);
    } else {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    }
    
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState, gameLoop]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-yellow-100 to-orange-100 p-2 sm:p-4">
      <div className="text-center mb-3 sm:mb-6 px-2">
        <h1 className="text-3xl sm:text-5xl font-bold text-yellow-600 mb-1 sm:mb-2">🍌 Banana Runner</h1>
        <p className="text-sm sm:text-base text-gray-700">
          {isMobile ? 'Tap to jump, swipe down to slide!' : 'Jump and slide to avoid obstacles!'}
        </p>
      </div>

      <div ref={containerRef} className="w-full max-w-4xl">
        <div className="relative bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden">
          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            className="block w-full h-auto touch-none"
            style={{ touchAction: 'none' }}
          />
          
          {gameState === 'menu' && (
            <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 max-w-md w-full">
                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6 text-yellow-600">
                  Customize Your Banana
                </h2>
                
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-bold mb-1 sm:mb-2">Head Gear</label>
                    <select
                      value={selectedBanana.head}
                      onChange={(e) => setSelectedBanana(prev => ({ ...prev, head: e.target.value }))}
                      className="w-full p-2 text-sm sm:text-base border-2 border-yellow-400 rounded-lg"
                    >
                      {Object.entries(abilities.head).map(([key, val]) => (
                        <option key={key} value={key}>
                          {val.emoji || '🍌'} {val.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-bold mb-1 sm:mb-2">Accessory</label>
                    <select
                      value={selectedBanana.accessory}
                      onChange={(e) => setSelectedBanana(prev => ({ ...prev, accessory: e.target.value }))}
                      className="w-full p-2 text-sm sm:text-base border-2 border-yellow-400 rounded-lg"
                    >
                      {Object.entries(abilities.accessory).map(([key, val]) => (
                        <option key={key} value={key}>
                          {val.emoji || '🍌'} {val.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-bold mb-1 sm:mb-2">Outfit</label>
                    <select
                      value={selectedBanana.shirt}
                      onChange={(e) => setSelectedBanana(prev => ({ ...prev, shirt: e.target.value }))}
                      className="w-full p-2 text-sm sm:text-base border-2 border-yellow-400 rounded-lg"
                    >
                      {Object.entries(abilities.shirt).map(([key, val]) => (
                        <option key={key} value={key}>
                          {val.emoji || '🍌'} {val.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <button
                  onClick={startGame}
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl text-lg sm:text-xl flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-lg active:scale-95"
                >
                  <Play size={isMobile ? 20 : 24} />
                  Start Running!
                </button>
                
                {highScore > 0 && (
                  <div className="mt-3 sm:mt-4 text-center">
                    <p className="text-sm sm:text-base text-gray-600 flex items-center justify-center gap-2">
                      <Trophy className="text-yellow-500" size={isMobile ? 16 : 20} />
                      High Score: {highScore}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {gameState === 'gameover' && (
            <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 max-w-md w-full text-center">
                <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 text-red-500">Game Over!</h2>
                
                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  <p className="text-xl sm:text-2xl font-bold text-gray-800">
                    Distance: {distance}m
                  </p>
                  <p className="text-lg sm:text-xl text-gray-700">
                    Score: {score}
                  </p>
                  <p className="text-lg sm:text-xl text-yellow-600 flex items-center justify-center gap-2">
                    <Coins size={isMobile ? 16 : 20} />
                    Coins: {coins}
                  </p>
                  {score > highScore && (
                    <p className="text-green-500 font-bold flex items-center justify-center gap-2">
                      <Trophy size={isMobile ? 16 : 20} />
                      New High Score!
                    </p>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button
                    onClick={startGame}
                    className="flex-1 bg-gradient-to-r from-green-400 to-green-500 text-white font-bold py-3 px-4 sm:px-6 rounded-xl flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-transform text-sm sm:text-base"
                  >
                    <RotateCcw size={isMobile ? 16 : 20} />
                    Play Again
                  </button>
                  <button
                    onClick={() => setGameState('menu')}
                    className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-bold py-3 px-4 sm:px-6 rounded-xl flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-transform text-sm sm:text-base"
                  >
                    <Settings size={isMobile ? 16 : 20} />
                    Menu
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 sm:mt-6 bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-lg max-w-2xl w-full">
        <h3 className="font-bold text-center mb-2 sm:mb-3 text-gray-800 text-sm sm:text-base flex items-center justify-center gap-2">
          {isMobile && <Smartphone size={16} />}
          🎮 Controls
        </h3>
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-2 sm:gap-4 text-xs sm:text-sm`}>
          {isMobile ? (
            <>
              <div className="text-center p-2 sm:p-3 bg-yellow-50 rounded-lg">
                <p className="font-bold">👆 Tap or Swipe Up</p>
                <p className="text-gray-600">Jump</p>
              </div>
              <div className="text-center p-2 sm:p-3 bg-yellow-50 rounded-lg">
                <p className="font-bold">👇 Swipe Down</p>
                <p className="text-gray-600">Slide</p>
              </div>
            </>
          ) : (
            <>
              <div className="text-center p-2 sm:p-3 bg-yellow-50 rounded-lg">
                <p className="font-bold">⬆️ Arrow Up / Space</p>
                <p className="text-gray-600">Jump</p>
              </div>
              <div className="text-center p-2 sm:p-3 bg-yellow-50 rounded-lg">
                <p className="font-bold">⬇️ Arrow Down</p>
                <p className="text-gray-600">Slide</p>
              </div>
            </>
          )}
        </div>
      </div>

      {gameState === 'playing' && (
        <div className="mt-3 sm:mt-4 bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-lg flex gap-4 sm:gap-6 justify-center">
          <div className="text-center">
            <p className="text-xl sm:text-2xl font-bold text-yellow-600">{distance}m</p>
            <p className="text-xs text-gray-600">Distance</p>
          </div>
          <div className="text-center">
            <p className="text-xl sm:text-2xl font-bold text-blue-600">{score}</p>
            <p className="text-xs text-gray-600">Score</p>
          </div>
          <div className="text-center">
            <p className="text-xl sm:text-2xl font-bold text-yellow-500">🪙 {coins}</p>
            <p className="text-xs text-gray-600">Coins</p>
          </div>
        </div>
      )}

      <div className="mt-3 sm:mt-6 max-w-2xl w-full bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg">
        <h3 className="font-bold text-base sm:text-lg mb-2 sm:mb-3 text-center text-gray-800">✨ Special Abilities</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 text-xs sm:text-sm">
          <div className="bg-white p-2 sm:p-3 rounded-lg">
            <p className="font-bold text-yellow-600">👨‍🍳 Chef Hat</p>
            <p className="text-gray-600">Magnet pulls coins closer</p>
          </div>
          <div className="bg-white p-2 sm:p-3 rounded-lg">
            <p className="font-bold text-purple-600">🧙 Wizard Hat</p>
            <p className="text-gray-600">Jump higher and further</p>
          </div>
          <div className="bg-white p-2 sm:p-3 rounded-lg">
            <p className="font-bold text-blue-600">😎 Sunglasses</p>
            <p className="text-gray-600">Shield from 1 obstacle</p>
          </div>
          <div className="bg-white p-2 sm:p-3 rounded-lg">
            <p className="font-bold text-green-600">👔 Suit</p>
            <p className="text-gray-600">2x coin value</p>
          </div>
          <div className="bg-white p-2 sm:p-3 rounded-lg sm:col-span-2 lg:col-span-2">
            <p className="font-bold text-orange-600">🎒 Backpack</p>
            <p className="text-gray-600">Store extra power-ups (coming soon!)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BananaRunner;
