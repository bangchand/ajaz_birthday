"use client";
import { useWindowSize } from "@/hooks/useWindowSize";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import ReactConfetti from "react-confetti";

// ------------------------------------
// HOME PAGE
// ------------------------------------
export default function Home() {
  const pages = [
    "Do you know what day it is today?",
    "If you guessed Thursday… YOU'RE WRONG",
    "It's AJAZZZ DAY 🎉🔥",
    "Happy Birthday Ajazzz! 🥳💙",
  ];

  const [fireConfetti, setFireConfetti] = useState(false);
  const lastFireTime = useRef(0);
  const { width, height } = useWindowSize();
  const [volume, setVolume] = useState(0);

  // ------------------------------------
  // MICROPHONE
  // ------------------------------------
  // Inside Home component
  const [candleLit, setCandleLit] = useState(true);

  useEffect(() => {
    async function setupMic() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(stream);

        analyser.fftSize = 256;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        source.connect(analyser);

        function loop() {
          analyser.getByteFrequencyData(dataArray);
          const avg = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setVolume(avg);

          // Detect blow
          if (avg > 30) { // threshold for blowing
            setCandleLit(false);
            setTimeout(() => setCandleLit(true), 2000); // relight after 2s
          }

          requestAnimationFrame(loop);
        }
        loop();
      } catch (err) {
        console.error("Mic error:", err);
      }
    }
    setupMic();
  }, []);


  // ------------------------------------
  // RENDER
  // ------------------------------------
  return (
    <main className="h-screen w-full overflow-y-scroll snap-y snap-mandatory bg-white text-gray-900 no-scrollbar">

      {/* CONFETTI */}
      {fireConfetti && (
        <ReactConfetti
          width={width}
          height={height * 3}
          numberOfPieces={800}
          gravity={0.01}
          initialVelocityY={{ min: 1, max: 5 }}
          recycle={false}
        />
      )}

      {/* TEXT SECTIONS */}
      {pages.map((text, idx) => (
        <motion.div
          key={idx}
          className="h-screen snap-start relative flex flex-col justify-center items-center px-8 text-center overflow-hidden bg-gradient-to-br from-pink-50 via-white to-blue-50 pb-28"
          viewport={{ amount: 0.3 }}
          onViewportEnter={() => {
            if (idx === 3) {
              const now = Date.now();
              if (now - lastFireTime.current > 1000) {
                lastFireTime.current = now;
                setFireConfetti(true);
                setTimeout(() => setFireConfetti(false), 2500);
              }
            }
          }}
        >
          {/* Background blobs */}
          <motion.div
            className="absolute w-64 h-64 bg-pink-200 rounded-full opacity-30 blur-3xl"
            initial={{ scale: 0, x: -100, y: -100 }}
            animate={{ scale: 1, x: 0, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2 }}
          />
          <motion.div
            className="absolute w-64 h-64 bg-blue-200 rounded-full opacity-30 blur-3xl right-0 bottom-0"
            initial={{ scale: 0, x: 100, y: 100 }}
            animate={{ scale: 1, x: 0, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3 }}
          />

          {/* Text */}
          <motion.p
            className="text-4xl sm:text-6xl font-extrabold max-w-2xl px-6 drop-shadow-md"
            initial={{ opacity: 0, y: 80, scale: 0.8 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            {text}
          </motion.p>

          {/* Sparkle */}
          <motion.div
            className="absolute translate-y-[90px] text-5xl mt-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: [-5, 5, -5] }}
            transition={{ duration: 3, delay: 0.6, repeat: Infinity }}
          >
            ✨
          </motion.div>

          {/* Bottom Hint */}
          <motion.div
            className="absolute bottom-32 text-sm text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            {"Scroll / swipe up ✦"}
          </motion.div>
        </motion.div>
      ))}

      {/* GALLERY */}
      <section className="h-screen snap-start relative flex flex-col justify-center items-center px-6 bg-gradient-to-br from-purple-50 via-white to-indigo-50 overflow-hidden">
        <motion.h2
          className="text-4xl font-extrabold mb-8 drop-shadow-sm"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          AJAZZZ Gallery 📸
        </motion.h2>

        <div className="grid grid-cols-2 gap-4 max-w-md w-full">
          {["image1.jpg", "image2.jpg", "image3.jpg", "image4.jpg"].map((img, i) => (
            <motion.div
              key={i}
              className="rounded-xl overflow-hidden shadow-lg bg-purple-100"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <img
                src={`/images/${img}`}
                className="w-full h-full object-cover"
                alt={`gallery ${i + 1}`}
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          className="absolute bottom-32 text-sm text-gray-600"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Scroll / swipe up ✦
        </motion.div>
      </section>

      {/* CAKE + CANDLE */}
      <section className="h-screen snap-start w-full flex items-center justify-center py-16 bg-gradient-to-br from-pink-50 via-white to-blue-50">
        <div className="flex flex-col items-center gap-8">
          <div className="relative">
            {/* Cake */}
            <div className="w-64 h-40 bg-pink-200 rounded-xl shadow-lg border-4 border-pink-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-6 bg-pink-100 rounded-b-xl"></div>
              <div className="absolute top-0 left-6 w-6 h-10 bg-pink-100 rounded-b-xl"></div>
              <div className="absolute top-0 left-20 w-8 h-12 bg-pink-100 rounded-b-xl"></div>
              <div className="absolute top-0 left-40 w-5 h-9 bg-pink-100 rounded-b-xl"></div>
            </div>

            {/* Candle */}
            <div className="absolute top-[-140px] left-1/2 -translate-x-1/2 flex flex-col items-center">
              <motion.div
                animate={
                  !candleLit || volume > 60
                    ? { opacity: 0, scale: 0.2, y: 20 }  // Lilin mati
                    : { opacity: 1, scale: 1, y: [0, -4, 0], rotate: [0, -3, 3, 0] } // Lilin hidup
                }
                transition={{ duration: 0.25 }}
              >
                <svg
                  width="40"
                  height="60"
                  viewBox="0 0 100 160"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="drop-shadow-xl"
                >
                  <defs>
                    <radialGradient id="cakeFlame" cx="50%" cy="30%" r="60%">
                      <stop offset="0%" stopColor="#fff6d8" />
                      <stop offset="60%" stopColor="#ffd37a" />
                      <stop offset="100%" stopColor="#ff8a45" />
                    </radialGradient>
                  </defs>

                  {/* Outer glow */}
                  <motion.ellipse
                    cx="50"
                    cy="90"
                    rx="28"
                    ry="55"
                    fill="#ffb07a"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />

                  <motion.path
                    d="M50 20 C62 56 82 70 50 120 C18 70 38 56 50 20 Z"
                    fill="url(#cakeFlame)"
                    animate={
                      candleLit
                        ? {
                          scale: 1 - Math.min(volume / 220, 0.6),
                          opacity: 1 - Math.min(volume / 180, 0.5),
                          rotate: volume > 30 ? [0, -12, 12, 0] : [0, -3, 3, 0],
                        }
                        : { opacity: 0, scale: 0.2, y: 20 } // blown out
                    }
                    transition={{ duration: 0.15 }}
                  />

                  {/* Highlight */}
                  <motion.path
                    d="M50 42 C56 62 68 74 50 100 C32 74 44 62 50 42 Z"
                    fill="#fffceb"
                    animate={{ opacity: [1, 0.8, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                </svg>
              </motion.div>

              {/* Wick */}
              <div className="w-1 h-4 bg-gray-700 rounded-sm mt-[-2px]"></div>

              {/* Candle Body */}
              <div className="w-6 h-20 bg-white border-2 border-gray-200 rounded-md shadow-sm relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-200/50 to-transparent [mask-image:repeating-linear-gradient(45deg,#000_0px,#000_6px,transparent_6px,transparent_12px)]"></div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-2xl font-bold">Don't forget to make a wish</h3>
            <p className="text-sm text-gray-600">Blow on the mic and watch the candle flicker! 🎂💨</p>
          </div>
        </div>
      </section>
    </main>
  );
}
