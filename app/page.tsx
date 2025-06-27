"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gift, Heart, Sparkles, Star, Cake, PartyPopper } from "lucide-react";

type Stage =
  | "landing"
  | "name-input"
  | "greeting"
  | "surprise-modal"
  | "heart-clicking"
  | "birthday-sequence"
  | "final-modal"
  | "gift-question"
  | "gift-response"
  | "final-message";

export default function BirthdaySurprise() {
  const [stage, setStage] = useState<Stage>("landing");
  const [userName, setUserName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [clickedHearts, setClickedHearts] = useState<number[]>([]);
  const [currentText, setCurrentText] = useState("");
  const [showContinueButton, setShowContinueButton] = useState(false);
  const [giftChoice, setGiftChoice] = useState<"yes" | "no" | null>(null);
  const [showGreetingButton, setShowGreetingButton] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [confettiTrigger, setConfettiTrigger] = useState(false);
  const [showHearts, setShowHearts] = useState(false);

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const typewriterTexts = [
    "Wait…",
    "Someone has a birthday!",
    `Happy Birthday, ${userName}!`,
    "You're getting older 🥹",
  ];

  const [textIndex, setTextIndex] = useState(0);

  const typeWriter = (text: string, callback?: () => void) => {
    let i = 0;
    setCurrentText("");
    const timer = setInterval(() => {
      setCurrentText(text.slice(0, i));
      i++;
      if (i > text.length) {
        clearInterval(timer);
        if (callback) {
          setTimeout(callback, 800);
        }
      }
    }, 20);
  };

  const handleLandingClick = () => {
    setStage("name-input");
  };

  const handleNameSubmit = () => {
    if (nameInput.trim()) {
      setUserName(nameInput.trim());
      setStage("greeting");
      setTimeout(() => {
        setShowGreetingButton(true);
      }, 2000);
    }
  };

  const handleGreetingContinue = () => {
    setStage("surprise-modal");
    setShowHearts(true); // Start showing hearts in background
  };

  const handleSurpriseContinue = () => {
    setStage("heart-clicking");
  };

  const handleHeartClick = (heartIndex: number) => {
    if (!clickedHearts.includes(heartIndex)) {
      const newClickedHearts = [...clickedHearts, heartIndex];
      setClickedHearts(newClickedHearts);

      if (newClickedHearts.length === 4) {
        setConfettiTrigger(true);
        setTimeout(() => {
          setStage("birthday-sequence");
          setTextIndex(0);
          typeWriter(typewriterTexts[0], () => {
            setTextIndex(1);
            typeWriter(typewriterTexts[1], () => {
              setTextIndex(2);
              typeWriter(typewriterTexts[2], () => {
                setTextIndex(3);
                typeWriter(typewriterTexts[3], () => {
                  setShowContinueButton(true);
                });
              });
            });
          });
        }, 200);
      }
    }
  };

  const handleBirthdayContinue = () => {
    setStage("final-modal");
  };

  const handleGiftChoice = (choice: "yes" | "no") => {
    setGiftChoice(choice);
    setStage("gift-response");
    setTimeout(() => {
      setStage("final-message");
    }, 3000);
  };

  const handleFinalContinue = () => {
    setStage("final-message");
  };

  // Enhanced floating elements with more variety
  const FloatingElements = () => {
    const elements = [
      { icon: Heart, color: "text-pink-400", size: 4 },
      { icon: Star, color: "text-yellow-400", size: 3 },
      { icon: Sparkles, color: "text-purple-400", size: 2 },
      { icon: Cake, color: "text-orange-400", size: 5 },
      { icon: PartyPopper, color: "text-blue-400", size: 4 },
    ];

    return (
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Regular floating elements */}
        {[...Array(40)].map((_, i) => {
          const element = elements[i % elements.length];
          return (
            <motion.div
              key={`float-${i}`}
              className={`absolute ${element.color}`}
              initial={{
                x: Math.random() * (windowSize.width || 1000),
                y: (windowSize.height || 1000) + 50,
                rotate: 0,
                scale: 0.4 + Math.random() * 0.6,
              }}
              animate={{
                y: -100,
                rotate: [0, 180, 360],
                x: [
                  Math.random() * (windowSize.width || 1000),
                  Math.random() * (windowSize.width || 1000) + 100,
                  Math.random() * (windowSize.width || 1000) - 100,
                ],
                scale: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 8 + Math.random() * 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 8,
              }}
            >
              <element.icon
                className={`w-${element.size} h-${element.size} ${
                  element.icon === Heart ? "fill-current" : ""
                } opacity-70`}
              />
            </motion.div>
          );
        })}

        {/* Special floating hearts - larger and more prominent */}
        {showHearts &&
          [...Array(12)].map((_, i) => (
            <motion.div
              key={`heart-special-${i}`}
              className="absolute text-pink-500"
              initial={{
                x: Math.random() * (windowSize.width || 1000),
                y: (windowSize.height || 1000) + 100,
                rotate: 0,
                scale: 0.6,
              }}
              animate={{
                y: -150,
                rotate: [0, 360],
                x: [
                  Math.random() * (windowSize.width || 1000),
                  Math.random() * (windowSize.width || 1000) + 200,
                  Math.random() * (windowSize.width || 1000) - 200,
                ],
                scale: [0.6, 1.2, 0.6],
              }}
              transition={{
                duration: 10 + Math.random() * 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 10,
              }}
            >
              <Heart className="w-8 h-8 fill-current opacity-80" />
            </motion.div>
          ))}

        {/* Pulsing stars */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`star-pulse-${i}`}
            className="absolute text-yellow-300"
            initial={{
              x: Math.random() * (windowSize.width || 1000),
              y: Math.random() * (windowSize.height || 1000),
              scale: 0.3,
            }}
            animate={{
              scale: [0.3, 1.2, 0.3],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 4,
            }}
          >
            <Star className="w-5 h-5 fill-current" />
          </motion.div>
        ))}

        {/* Floating numbers for heart count */}
        {showHearts &&
          [...Array(20)].map((_, i) => (
            <motion.div
              key={`number-${i}`}
              className="absolute text-2xl font-bold text-pink-600"
              initial={{
                x: Math.random() * (windowSize.width || 1000),
                y: (windowSize.height || 1000) + 50,
                opacity: 0.7,
              }}
              animate={{
                y: -100,
                x: [
                  Math.random() * (windowSize.width || 1000),
                  Math.random() * (windowSize.width || 1000) + 100,
                  Math.random() * (windowSize.width || 1000) - 100,
                ],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 12 + Math.random() * 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 12,
              }}
            >
              {Math.floor(Math.random() * 4) + 1}
            </motion.div>
          ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <FloatingElements />

      {/* Confetti Explosion */}
      {confettiTrigger && (
        <div className="fixed inset-0 pointer-events-none z-20">
          {[...Array(150)].map((_, i) => (
            <motion.div
              key={`confetti-${i}`}
              className={`absolute w-2 h-2 ${
                i % 5 === 0
                  ? "bg-pink-400"
                  : i % 5 === 1
                  ? "bg-purple-400"
                  : i % 5 === 2
                  ? "bg-yellow-400"
                  : i % 5 === 3
                  ? "bg-blue-400"
                  : "bg-green-400"
              }`}
              initial={{
                x: (windowSize.width || 1000) / 2,
                y: (windowSize.height || 1000) / 2,
                scale: 0,
                rotate: 0,
              }}
              animate={{
                x:
                  (windowSize.width || 1000) / 2 + (Math.random() - 0.5) * 1000,
                y:
                  (windowSize.height || 1000) / 2 + (Math.random() - 0.5) * 800,
                scale: [0, 1, 0],
                rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
              }}
              transition={{
                duration: 2.5,
                ease: "easeOut",
                delay: Math.random() * 0.8,
              }}
            />
          ))}
        </div>
      )}

      {/* Dynamic Background with Enhanced Gradient Animation */}
      <motion.div
        className={`fixed inset-0 transition-all duration-2000 ${
          stage === "landing"
            ? "bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100"
            : stage === "name-input" ||
              stage === "greeting" ||
              stage === "surprise-modal"
            ? "bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50"
            : stage === "heart-clicking"
            ? "bg-gradient-to-br from-rose-100 via-pink-100 to-purple-100"
            : "bg-gradient-to-br from-purple-200 via-pink-200 to-yellow-200"
        }`}
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Landing Stage with Enhanced Gift Box Animation */}
      {stage === "landing" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center min-h-screen p-8 relative z-10"
          onClick={handleLandingClick}
        >
          <motion.h1
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-2xl md:text-4xl font-bold text-center mb-12 text-purple-800 max-w-2xl"
          >
            I have a surprise for you. Click on the gift box to open it.
          </motion.h1>

          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{
              scale: 1,
              rotate: 0,
            }}
            transition={{ delay: 1, type: "spring", stiffness: 200 }}
            whileHover={{
              scale: 1.1,
              rotate: [0, -5, 5, -5, 0],
              transition: { duration: 0.5 },
            }}
            className="cursor-pointer"
          >
            <motion.div
              animate={{
                boxShadow: [
                  "0 10px 30px rgba(0,0,0,0.2)",
                  "0 20px 40px rgba(255,20,147,0.4)",
                  "0 10px 30px rgba(0,0,0,0.2)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="bg-gradient-to-br from-pink-400 to-purple-500 p-8 rounded-3xl relative overflow-hidden"
            >
              {/* Gift box shine effect */}
              <motion.div
                className="absolute inset-0 bg-white opacity-0"
                animate={{
                  opacity: [0, 0.3, 0],
                  left: ["-100%", "100%", "100%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: 1,
                }}
              />
              <Gift className="w-24 h-24 text-white" />
            </motion.div>
          </motion.div>

          {/* Subtle floating hearts around gift */}
          <div className="absolute top-1/2 left-1/2 w-full h-full pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={`landing-heart-${i}`}
                className="absolute text-pink-400"
                initial={{
                  x: Math.random() * 200 - 100,
                  y: Math.random() * 200 - 100,
                  scale: 0.5,
                  opacity: 0,
                }}
                animate={{
                  y: [0, -50, 0],
                  x: [0, Math.random() > 0.5 ? 30 : -30, 0],
                  scale: [0.5, 0.8, 0.5],
                  opacity: [0, 0.7, 0],
                }}
                transition={{
                  duration: 4 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              >
                <Heart className="w-6 h-6 fill-current" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Name Input Modal */}
      <AnimatePresence>
        {stage === "name-input" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
            >
              {/* Animated background elements */}
              <motion.div
                className="absolute -top-20 -left-20 w-40 h-40 bg-pink-100 rounded-full opacity-20"
                animate={{
                  scale: [1, 1.5, 1],
                  x: [0, 50, 0],
                  y: [0, 50, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                }}
              />
              <motion.div
                className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-100 rounded-full opacity-20"
                animate={{
                  scale: [1, 1.5, 1],
                  x: [0, -50, 0],
                  y: [0, -50, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  delay: 4,
                }}
              />

              <div className="text-center mb-6 relative z-10">
                <motion.div
                  className="text-6xl mb-4"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🎁
                </motion.div>
                <h2 className="text-2xl font-bold text-purple-800 mb-2">
                  What's your name?
                </h2>
              </div>

              <div className="space-y-4 relative z-10">
                <Input
                  value={nameInput}
                  onChange={(e: any) => setNameInput(e.target.value)}
                  placeholder="Enter your name..."
                  className="text-center text-lg py-3 rounded-2xl border-2 border-pink-200 focus:border-purple-400 shadow-sm"
                  onKeyPress={(e: any) =>
                    e.key === "Enter" && handleNameSubmit()
                  }
                />
                <Button
                  onClick={handleNameSubmit}
                  className="w-full py-3 text-lg rounded-2xl bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 shadow-lg transform transition-all hover:scale-105"
                  disabled={!nameInput.trim()}
                >
                  Continue
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Greeting Stage */}
      {stage === "greeting" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center min-h-screen p-8 relative z-10"
        >
          <motion.div
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1 }}
            className="text-center mb-8"
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-8xl mb-6"
              whileHover={{ scale: 1.2, rotate: [0, 10, -10, 0] }}
            >
              😸
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-4xl font-bold text-purple-800 mb-8"
            >
              Hi, {userName}!
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="text-2xl text-purple-700 mb-8"
            >
              I have something for you.
            </motion.p>
          </motion.div>

          <AnimatePresence>
            {showGreetingButton && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
              >
                <Button
                  onClick={handleGreetingContinue}
                  className="px-8 py-4 text-xl rounded-2xl bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 shadow-lg transform transition-all hover:scale-105"
                >
                  Click to Continue
                  <Sparkles className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Surprise Modal with Enhanced Emoji Animations */}
      <AnimatePresence>
        {stage === "surprise-modal" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            {/* Enhanced Floating Emoji Animations */}
            <div className="fixed inset-0 pointer-events-none">
              {["💖", "😻", "🎉", "✨", "💕", "🌟", "🎊", "💫"].map(
                (emoji, i) => (
                  <motion.div
                    key={`emoji-${i}`}
                    className="absolute text-4xl"
                    initial={{
                      x: Math.random() * (windowSize.width || 1000),
                      y: (windowSize.height || 1000) + 50,
                      rotate: 0,
                      scale: 0.5,
                    }}
                    animate={{
                      y: -100,
                      rotate: [0, 180, 360],
                      scale: [0.5, 1.2, 0.5],
                      x: [
                        Math.random() * (windowSize.width || 1000),
                        Math.random() * (windowSize.width || 1000) + 100,
                        Math.random() * (windowSize.width || 1000) - 100,
                      ],
                    }}
                    transition={{
                      duration: 4 + Math.random() * 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: Math.random() * 2,
                    }}
                  >
                    {emoji}
                  </motion.div>
                )
              )}
            </div>

            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotateY: 90 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotateY: -90 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center relative z-10 overflow-hidden"
            >
              {/* Background animation */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-pink-50 to-purple-50 opacity-50"
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%"],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />

              {/* Enhanced Profile Picture */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.1, rotate: [0, 5, -5, 0] }}
                className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-4xl shadow-lg relative z-10"
              >
                😊
              </motion.div>

              <motion.div
                className="text-6xl mb-6 relative z-10"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🎀
              </motion.div>
              <h2 className="text-2xl font-bold text-purple-800 mb-6 relative z-10">
                Click the 4 hearts.
              </h2>
              <Button
                onClick={handleSurpriseContinue}
                className="px-8 py-3 text-lg rounded-2xl bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 shadow-lg transform transition-all hover:scale-105 relative z-10"
              >
                Let's Go!
                <Heart className="ml-2 w-5 h-5 fill-white" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Heart Clicking Stage */}
      {stage === "heart-clicking" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center min-h-screen p-8 relative z-10"
        >
          <motion.h1
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-3xl font-bold text-purple-800 mb-12 text-center"
          >
            Click the 4 hearts.
          </motion.h1>

          <div className="grid grid-cols-2 gap-8">
            {[0, 1, 2, 3].map((heartIndex) => (
              <motion.div
                key={heartIndex}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: heartIndex * 0.2 }}
                whileHover={{ scale: 1.1, rotate: [0, 5, -5, 0] }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleHeartClick(heartIndex)}
                className={`cursor-pointer p-4 rounded-full transition-all duration-300 ${
                  clickedHearts.includes(heartIndex)
                    ? "bg-pink-200 shadow-inner"
                    : "bg-white shadow-lg hover:shadow-xl"
                }`}
              >
                <motion.div
                  animate={
                    clickedHearts.includes(heartIndex)
                      ? {
                          scale: [1, 1.5, 1],
                          rotate: [0, 360, 0],
                        }
                      : {}
                  }
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  <Heart
                    className={`w-16 h-16 transition-all duration-300 ${
                      clickedHearts.includes(heartIndex)
                        ? "text-pink-600 fill-current"
                        : "text-pink-400"
                    }`}
                  />
                </motion.div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-8 text-center"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <p className="text-lg text-purple-600 font-semibold">
              {clickedHearts.length}/4 hearts clicked
            </p>
          </motion.div>
        </motion.div>
      )}

      {/* Birthday Sequence */}
      {stage === "birthday-sequence" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center min-h-screen p-8 relative z-10"
        >
          <div className="text-center mb-8">
            <motion.div
              key={textIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold text-purple-800 mb-8 min-h-[80px]"
            >
              {currentText}
            </motion.div>

            <motion.div
              className="flex justify-center space-x-4 mb-8"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                className="text-6xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🐱
              </motion.div>
              <motion.div
                className="text-6xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🎂
              </motion.div>
              <motion.div
                className="text-6xl"
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🐱
              </motion.div>
            </motion.div>
          </div>

          {showContinueButton && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Button
                onClick={handleBirthdayContinue}
                className="px-8 py-4 text-xl rounded-2xl bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 shadow-lg transform transition-all hover:scale-105"
              >
                Continue
                <Sparkles className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Final Modal */}
      <AnimatePresence>
        {stage === "final-modal" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl text-center relative overflow-hidden"
            >
              {/* Background animation */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-pink-100 to-purple-100 opacity-70"
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%"],
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />

              <div className="flex justify-center space-x-2 mb-6 relative z-10">
                <Heart className="w-8 h-8 text-pink-400 fill-current" />
                <div className="text-4xl">😻</div>
                <Heart className="w-8 h-8 text-pink-400 fill-current" />
              </div>

              <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-6 mb-6 relative z-10 border border-pink-200 shadow-sm">
                <p className="text-lg text-purple-800 leading-relaxed">
                  You bring so much joy and happiness to everyone around you.
                  Your special day deserves to be celebrated with all the love
                  in the world! 🌟
                </p>
              </div>

              <Button
                onClick={() => setStage("gift-question")}
                className="px-8 py-3 text-lg rounded-2xl bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 shadow-lg transform transition-all hover:scale-105 relative z-10"
              >
                Continue
                <Heart className="ml-2 w-5 h-5 fill-white" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gift Question Modal */}
      <AnimatePresence>
        {stage === "gift-question" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center relative overflow-hidden"
            >
              {/* Background animation */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-pink-50 opacity-70"
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%"],
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />

              <div className="flex justify-center space-x-2 mb-6 relative z-10">
                <Heart className="w-6 h-6 text-pink-400 fill-current" />
                <div className="text-4xl">😸</div>
                <Heart className="w-6 h-6 text-pink-400 fill-current" />
              </div>

              <h2 className="text-2xl font-bold text-purple-800 mb-6 relative z-10">
                {userName}, do you want a gift?
              </h2>

              <div className="flex space-x-4 relative z-10">
                <Button
                  onClick={() => handleGiftChoice("yes")}
                  className="flex-1 py-3 text-lg rounded-2xl bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 shadow-lg transform transition-all hover:scale-105"
                >
                  Yes! 🎁
                </Button>
                <Button
                  onClick={() => handleGiftChoice("no")}
                  variant="outline"
                  className="flex-1 py-3 text-lg rounded-2xl border-2 border-pink-300 text-pink-600 hover:bg-pink-50 shadow-sm transform transition-all hover:scale-105"
                >
                  No thanks
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gift Response - Auto disappears */}
      <AnimatePresence>
        {stage === "gift-response" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center"
            >
              {giftChoice === "no" ? (
                <>
                  <div className="text-6xl mb-4">😹</div>
                  <h2 className="text-2xl font-bold text-purple-800 mb-4">
                    Too bad! You're getting one anyway! 🎉
                  </h2>
                  <p className="text-lg text-purple-600">
                    You can't escape birthday surprises! 😸
                  </p>
                </>
              ) : (
                <>
                  <div className="text-6xl mb-4">😼</div>
                  <h2 className="text-2xl font-bold text-purple-800">
                    Pehle party de 😼
                  </h2>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Final Message */}
      <AnimatePresence>
        {stage === "final-message" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl text-center"
            >
              <div className="text-6xl mb-6">🎊</div>

              <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-6 mb-6">
                <h2 className="text-2xl font-bold text-purple-800 mb-4">
                  Happy Birthday, {userName}! 🎂
                </h2>
                <p className="text-lg text-purple-700 leading-relaxed">
                  May your special day be filled with happiness, laughter, and
                  all your favorite things. You deserve all the joy in the
                  world! Here's to another amazing year ahead! ✨🎈
                </p>
              </div>

              <div className="flex justify-center space-x-2">
                <div className="text-3xl">🐱</div>
                <div className="text-3xl">💖</div>
                <div className="text-3xl">🎂</div>
                <div className="text-3xl">💖</div>
                <div className="text-3xl">🐱</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
