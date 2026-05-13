"use client";
import { useState, useRef, useEffect } from "react";

export default function Game() {
  const [started, setStarted] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Detect mobile safely (client-side only)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mobileCheck = /iPhone|iPad|Android/i.test(navigator.userAgent);
    setIsMobile(mobileCheck);

    // Auto-start on desktop
    if (!mobileCheck) {
      setStarted(true);
    }
  }, []);

  const startGame = async () => {
    const elem = containerRef.current;
    if (!elem) return;

    setStarted(true);

    // Fullscreen
    try {
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      }
    } catch (err) {
      console.log("Fullscreen failed:", err);
    }

    // Orientation lock (TypeScript-safe)
    try {
      const orientation = screen.orientation as unknown as {
        lock?: (orientation: "landscape") => Promise<void>;
      };

      if (orientation.lock) {
        await orientation.lock("landscape");
      }
    } catch (err) {
      console.log("Orientation lock failed:", err);
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-screen bg-black flex items-center justify-center relative"
    >
      {!started ? (
        // 🎮 Mobile Preview
        <div className="text-center text-white px-4">
          <h1 className="text-2xl mb-4 font-semibold">
            Legacy Trivia
          </h1>

          <button
            onClick={startGame}
            className="bg-green-500 hover:bg-green-600 transition px-6 py-3 rounded-xl text-lg"
          >
            ▶ Play Game
          </button>

          <p className="text-sm mt-4 opacity-70">
            Rotate your device for best experience
          </p>
        </div>
      ) : (
        // 🎯 Game iframe
        <iframe
          src="https://alihamza293.github.io/LegacyTriviaUnityGame/"
          title="Legacy Trivia"
          className="w-full h-full border-0"
          allow="fullscreen"
        />
      )}
    </div>
  );
}