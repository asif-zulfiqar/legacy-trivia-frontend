"use client";

import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { SparkleIcon } from "../assets/icons";

export default function Game() {
  const [started, setStarted] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // =========================
  // SEND DATA TO UNITY
  // =========================
  const sendUserDataToUnity = () => {
    // Full auth response
    const authData = JSON.parse(localStorage.getItem("auth") || "{}");

    iframeRef.current?.contentWindow?.postMessage(
      {
        type: "USER_DATA",
        payload: authData,
      },
      "https://alihamza293.github.io",
    );

    // console.log(
    //   "FULL RESPONSE SENT TO UNITY:",
    //   authData
    // );
  };

  // =========================
  // RECEIVE DATA FROM UNITY
  // =========================
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Security check
      if (event.origin !== "https://alihamza293.github.io") return;

      console.log("FROM UNITY:", event.data);

      const { type, payload } = event.data;

      switch (type) {
        case "UNITY_MESSAGE":
          console.log("Unity Says:", payload);

          // ✅ Unity ready
          if (payload === "GAME_READY") {
            sendUserDataToUnity();
          }

          break;

        case "GAME_SCORE":
          console.log("Score:", payload);
          break;

        default:
          console.log("Unknown Message:", event.data);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  // =========================
  // START GAME
  // =========================
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

    // Landscape lock
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
      className="w-full h-screen bg-black flex items-center justify-center relative overflow-hidden"
    >
      {!started ? (
        <div className="flex flex-col items-center justify-center text-center px-4">
          <Image
            src={"/images/logo.png"}
            alt="GameHub Logo"
            width={251}
            height={160}
            className="w-36 md:w-48 lg:w-56 h-auto drop-shadow-lg"
          />

          <Button
            type="button"
            size="lg"
            onClick={startGame}
            className="-m-5 mb-6 h-[55px] min-w-[200px] px-8 py-0 font-londrina text-base md:text-[22px] font-[900] leading-none disabled:opacity-70"
          >
            Play Game
            <span className="flex size-5 scale-[0.7] items-center justify-center">
              <SparkleIcon />
            </span>
          </Button>

          <p className="font-londrina text-base font-[900] text-white/80">
            Rotate your device for best experience
          </p>
        </div>
      ) : (
        <iframe
          ref={iframeRef}
          src="https://alihamza293.github.io/LegacyTriviaUnityGame/"
          title="Legacy Trivia"
          className="w-full h-full border-0"
          allow="fullscreen"
          onLoad={() => {
            console.log("UNITY LOADED");
          }}
        />
      )}
    </div>
  );
}
