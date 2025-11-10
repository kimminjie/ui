"use client";

import { useState } from "react";

import { K_LEAGUE_NOTICE, PROMPT_PLACEHOLDER } from "./constants";

export default function Home() {
  const [query, setQuery] = useState("");

  const handleLog = async () => {
    const trimmed = query.trim();

    if (!trimmed) {
      window.alert("검색어를 입력해주세요.");
      return;
    }

    console.log("입력한 검색어:", trimmed);
    window.alert(`입력한 검색어: ${trimmed}`);

    fetch(
      `http://localhost:8080/soccer/search?keyword=${encodeURIComponent(
        trimmed,
      )}`,
      { method: "GET", mode: "no-cors" },
    ).catch((error) => {
      console.warn("검색 요청을 보내는 중 오류 발생:", error);
    });
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#f7f7f5] px-6 py-16 font-sans">
      <main className="mt-120 flex w-full max-w-4xl flex-col items-center justify-center gap-14 text-center">
        <h1 className="text-2xl tracking-tight text-zinc-900 sm:text-3xl">
          {K_LEAGUE_NOTICE}
        </h1>

        <div className="w-full max-w-2xl">
          <div className="flex items-center gap-3 rounded-full border border-zinc-200 bg-white px-5 py-3 shadow-sm">
            <span className="flex h-8 w-8 items-center justify-center text-sm font-semibold text-black">
              +
            </span>
            <input
              className="w-full border-none bg-transparent text-lg text-zinc-700 placeholder:text-zinc-400 focus:outline-none"
              placeholder={PROMPT_PLACEHOLDER}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="챗봇 질문 입력"
            />
            <div className="flex items-center gap-2 text-zinc-500">
              <button
                type="button"
                onClick={handleLog}
                className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-zinc-100"
                aria-label="검색어를 전송"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 3a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="22" />
                  <line x1="8" y1="22" x2="16" y2="22" />
                </svg>
              </button>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 10a7 7 0 0 1 14 0c0 5-7 9-7 9s-7-4-7-9z" />
                <circle cx="12" cy="10" r="2" />
              </svg>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
