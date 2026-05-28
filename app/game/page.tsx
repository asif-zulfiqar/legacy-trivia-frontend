"use client";

import { useState, useRef, useEffect } from "react";

export default function Game() {
  const [started, setStarted] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // =========================
  // SEND DATA TO UNITY
  // =========================
  const sendUserDataToUnity = () => {
    // Full auth response
    const authData = JSON.parse(
      localStorage.getItem("auth") || "{}"
    );

    iframeRef.current?.contentWindow?.postMessage(
      {
        type: "USER_DATA",
        payload: authData,
      },
      "https://alihamza293.github.io"
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
      if (
        event.origin !==
        "https://alihamza293.github.io"
      )
        return;

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

    window.addEventListener(
      "message",
      handleMessage
    );

    return () => {
      window.removeEventListener(
        "message",
        handleMessage
      );
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
      console.log(
        "Fullscreen failed:",
        err
      );
    }

    // Landscape lock
    try {
      const orientation =
        screen.orientation as unknown as {
          lock?: (
            orientation: "landscape"
          ) => Promise<void>;
        };

      if (orientation.lock) {
        await orientation.lock(
          "landscape"
        );
      }
    } catch (err) {
      console.log(
        "Orientation lock failed:",
        err
      );
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-screen bg-black flex items-center justify-center relative overflow-hidden"
    >
      {!started ? (
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
            Rotate your device for best
            experience
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