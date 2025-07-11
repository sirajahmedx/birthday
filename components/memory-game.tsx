"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryGameProps {
  onComplete: () => void;
  onClose: () => void;
  userName: string;
}

const emojis = [
  "🎂",
  "🎁",
  "🎉",
  "🎈",
  "🌟",
  "🎊",
  "🍰",
  "🎵",
  "🌈",
  "🥳",
  "😊",
  "😍",
  "😉",
  "😘",
  "🤗",
  "🤩",
  "🥳",
  "😎",
  "😌",
  "😜",
  "😝",
];

export default function MemoryGame({
  onComplete,
  onClose,
  userName,
}: MemoryGameProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]); // store card indexes
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [shake, setShake] = useState(false);

  // Dynamic grid size support
  const [gridSize, setGridSize] = useState(3); // 3x3 default

  const handleGridSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const size = Math.max(2, Math.min(10, parseInt(e.target.value)));
    setGridSize(size);
  };

  // Initialize the game
  useEffect(() => {
    initializeGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gridSize]);

  const initializeGame = () => {
    const totalCards = gridSize * gridSize;
    const pairCount = Math.floor(totalCards / 2);
    const gameEmojis = emojis.slice(0, pairCount);
    let id = 0;
    const cardPairs = [...gameEmojis, ...gameEmojis].map((emoji) => ({
      id: id++,
      emoji,
      isFlipped: false,
      isMatched: false,
    }));
    // Shuffle and slice to fit grid
    const shuffledCards = cardPairs
      .sort(() => Math.random() - 0.5)
      .slice(0, totalCards);
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setGameWon(false);
    setShake(false);
  };

  const handleCardClick = (cardId: number) => {
    const cardIdx = cards.findIndex((c) => c.id === cardId);
    if (
      cards[cardIdx].isFlipped ||
      cards[cardIdx].isMatched ||
      flippedCards.length === 2
    ) {
      return;
    }
    const newFlippedCards = [...flippedCards, cardIdx];
    setFlippedCards(newFlippedCards);
    setCards((prev) =>
      prev.map((card, idx) =>
        idx === cardIdx ? { ...card, isFlipped: true } : card
      )
    );
    if (newFlippedCards.length === 2) {
      setMoves((prev) => prev + 1);
      const [firstIdx, secondIdx] = newFlippedCards;
      const firstCard = cards[firstIdx];
      const secondCard = cards[secondIdx];
      if (firstCard.emoji === secondCard.emoji) {
        // Match found!
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card, idx) =>
              idx === firstIdx || idx === secondIdx
                ? { ...card, isMatched: true }
                : card
            )
          );
          setMatchedPairs((prev) => prev + 1);
          setFlippedCards([]);
        }, 400);
      } else {
        // No match - shake and flip back
        setShake(true);
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card, idx) =>
              idx === firstIdx || idx === secondIdx
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
          setShake(false);
        }, 700);
      }
    }
  };

  // Check for game completion
  useEffect(() => {
    if (
      matchedPairs === Math.floor((gridSize * gridSize) / 2) &&
      cards.length > 0
    ) {
      setGameWon(true);
      setTimeout(() => {
        onComplete();
      }, 1200);
    }
  }, [matchedPairs, onComplete, gridSize, cards.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed inset-0 bg-gradient-to-br from-purple-100 to-pink-200 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl text-center relative overflow-hidden border-2 border-purple-200"
      >
        {/* Background gradient overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 pointer-events-none"
        />

        <div className="relative z-10">
          {!gameWon ? (
            <>
              <motion.div
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex justify-between items-center mb-6"
              >
                <h2 className="text-4xl font-extrabold text-purple-900 tracking-tight drop-shadow mb-1 flex items-center gap-2">
                  Memory Challenge!
                  <motion.span
                    initial={{ scale: 0.7, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    aria-label="brain"
                    role="img"
                  >
                    🧠
                  </motion.span>
                </h2>
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="text-sm px-3 py-1"
                  aria-label="Close game"
                >
                  ✕
                </Button>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-purple-700 mb-4 text-base font-medium"
              >
                Find the matching pairs to get your gift,{" "}
                <span className="font-bold text-purple-900">{userName}</span>!
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex justify-between text-sm text-purple-700 mb-4 px-2"
              >
                <span className="font-semibold">
                  Moves: <span className="text-purple-900">{moves}</span>
                </span>
                <span className="font-semibold">
                  Pairs:{" "}
                  <span className="text-purple-900">
                    {matchedPairs}/{Math.floor((gridSize * gridSize) / 2)}
                  </span>
                </span>
              </motion.div>

              {/* Grid size selector */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mb-6 flex justify-center items-center gap-2"
              >
                <label
                  htmlFor="gridSize"
                  className="text-purple-700 font-semibold"
                >
                  Grid Size:
                </label>
                <input
                  type="number"
                  id="gridSize"
                  min={2}
                  max={10}
                  value={gridSize}
                  onChange={handleGridSizeChange}
                  className="border-2 border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 rounded px-2 py-1 w-16 text-center transition-all duration-200 outline-none"
                  aria-label="Select grid size"
                />
              </motion.div>

              {/* Game Grid */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className={`grid gap-3 mb-6 ${shake ? "animate-shake" : ""}`}
                style={{
                  gridTemplateColumns: `repeat(${gridSize}, minmax(0,1fr))`,
                  maxWidth: `min(100%, ${gridSize * 70}px)`,
                  margin: "0 auto",
                }}
              >
                {cards.map((card, idx) => (
                  <motion.button
                    key={card.id}
                    type="button"
                    aria-label={
                      card.isFlipped || card.isMatched
                        ? `Card ${card.emoji}`
                        : "Hidden card"
                    }
                    tabIndex={0}
                    className={`
                      relative w-14 h-14 sm:w-20 sm:h-20 rounded-xl cursor-pointer transform transition-all duration-200 outline-none focus:ring-2 focus:ring-purple-400
                      ${
                        card.isMatched
                          ? "bg-green-200 scale-110 shadow-xl border-2 border-green-400"
                          : card.isFlipped
                          ? "bg-blue-100 border-2 border-blue-300"
                          : "bg-gradient-to-br from-purple-200 to-pink-200 hover:scale-105 border-2 border-purple-200"
                      }
                    `}
                    onClick={() => handleCardClick(card.id)}
                    whileHover={{ scale: card.isMatched ? 1.05 : 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    animate={card.isMatched ? { scale: [1, 1.15, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 flex items-center justify-center text-3xl sm:text-4xl"
                    >
                      {card.isFlipped || card.isMatched ? (
                        <motion.span
                          initial={{ rotateY: 0 }}
                          animate={{ rotateY: 360 }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                        >
                          {card.emoji}
                        </motion.span>
                      ) : (
                        <span className="text-purple-400">❓</span>
                      )}
                    </motion.div>
                  </motion.button>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Button
                  onClick={initializeGame}
                  variant="outline"
                  className="text-base font-semibold px-8 py-3 mt-2 shadow-md transition-colors duration-200 border-2 border-purple-300 hover:border-purple-500"
                >
                  {gameWon ? "Play Again 🔄" : "Reset Game 🔄"}
                </Button>
              </motion.div>
            </>
          ) : (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-center"
            >
              <motion.div
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="text-8xl mb-6 drop-shadow"
              >
                🎉
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="text-5xl font-extrabold text-purple-900 mb-3 tracking-tight"
              >
                Congratulations!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7 }}
                className="text-xl text-purple-700 mb-5 font-medium"
              >
                You completed the memory challenge in{" "}
                <span className="font-bold text-purple-900">{moves}</span>{" "}
                moves!
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.7 }}
                className="text-purple-600 text-lg"
              >
                Your gift is coming right up...{" "}
                <span aria-label="gift" role="img">
                  🎁
                </span>
              </motion.p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
