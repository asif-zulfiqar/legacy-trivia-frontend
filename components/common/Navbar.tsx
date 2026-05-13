"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/images/logo.png";
import americaFlag from "@/public/images/america.png";
import hungaryFlag from "@/public/images/hungary.png";
import russiaFlag from "@/public/images/russia.png";
import spanishFlag from "@/public/images/spanish.png";
import { Dropdown } from "@/app/assets/icons";

const LANGUAGES = [
  { code: "EN", label: "EN", flag: americaFlag },
  { code: "HU", label: "HUNGARIAN", flag: hungaryFlag },
  { code: "RU", label: "RUSSIAN", flag: russiaFlag },
  { code: "ES", label: "SPANISH", flag: spanishFlag },
];

export function Navbar() {
  const [langOpen, setLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);

  return (
    <nav className="absolute inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-6 md:px-10 lg:px-14">
      {/* ── Logo ─────────────────────────────────────────────────── */}
      <Link href="/" className="flex items-baseline gap-0 select-none">
        <Image
          src={logo}
          alt="GameHub Logo"
          width={251}
          height={160}
          className="w-36 md:w-48 lg:w-56 h-auto drop-shadow-lg"
        />
      </Link>

      {/* ── Language Selector ─────────────────────────────────────── */}
      <div className="relative">
        <button
          onClick={() => setLangOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={langOpen}
          className="flex items-center gap-6 rounded-[100px] border-[1.5px] border-white/20 bg-white/10 backdrop-blur-xl p-2.5 pr-4 md:pr-5 text-white hover:bg-white/20 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.15)] focus:outline-none"
        >
          <div className="flex items-center gap-2">
            <div className="relative size-6 md:size-8 rounded-full overflow-hidden shadow-md shrink-0">
              <Image
                src={selectedLang.flag}
                alt={selectedLang.code}
                fill
                sizes="32px"
                className="object-cover"
              />
            </div>
            <span className="font-londrina font-[900] text-md md:text-xl tracking-wide pt-[2px]">
              {selectedLang.label}
            </span>
          </div>
          <Dropdown
            className={`size-6 ml-2 transition-transform duration-300 ${
              langOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        <div
          className={`absolute right-0 top-[calc(100%+16px)] w-max rounded-[2.5rem] md:rounded-[3rem] border border-white/20 bg-white/10 backdrop-blur-2xl py-5 shadow-[0_16px_64px_rgba(0,0,0,0.4)] transition-all duration-300 origin-top z-50 ${
            langOpen
              ? "opacity-100 scale-100 visible"
              : "opacity-0 scale-95 invisible"
          }`}
        >
          <ul role="listbox" className="flex flex-col gap-1 w-full">
            {LANGUAGES.map((lang) => (
              <li
                key={lang.code}
                role="option"
                aria-selected={selectedLang.code === lang.code}
                onClick={() => {
                  setSelectedLang(lang);
                  setLangOpen(false);
                }}
                className={`flex items-center gap-3 px-6 md:px-8 py-3 cursor-pointer transition-colors hover:bg-white/10 w-full ${
                  selectedLang.code === lang.code ? "bg-white/5" : ""
                }`}
              >
                <div className="relative size-6 md:size-8 rounded-full overflow-hidden shadow-md shrink-0">
                  <Image
                    src={lang.flag}
                    alt={lang.label}
                    fill
                    sizes="32px"
                    className="object-cover rounded-full"
                  />
                </div>
                <span className="font-londrina font-[900] text-md md:text-xl tracking-wide text-white drop-shadow-md pt-[2px] whitespace-nowrap">
                  {lang.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
