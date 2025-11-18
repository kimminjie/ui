"use client";

import { useState, type ChangeEvent } from "react";

import { K_LEAGUE_NOTICE, PROMPT_PLACEHOLDER } from "./constants";


export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any>(null);

  const handleLog = async () => {
    const trimmed = query.trim();

    if (!trimmed) {
      window.alert("검색어를 입력해주세요.");
      return;
    }

    console.log("========================================");
    console.log("🔍 [CLIENT] 검색 요청 시작");
    console.log("📝 입력한 검색어:", trimmed);
    console.log("🌐 현재 URL:", window.location.href);
    console.log("========================================");
    window.alert(`입력한 검색어: ${trimmed}`);

    const apiGatewayUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:8080";
    let url: URL | null = null;
    let actualKeyword = trimmed;

    try {

      // /폴더명 형식인지 확인
      if (trimmed.startsWith('/')) {
        const parts = trimmed.substring(1).split(/\s+/, 2);
        const folder = parts[0].toLowerCase();
        actualKeyword = parts[1] || parts[0]; // 폴더명만 입력한 경우

        // 폴더별로 다른 엔드포인트로 라우팅
        switch (folder) {
          case 'player':
          case 'players':
            url = new URL(`${apiGatewayUrl}/api/soccer/players`);
            break;
          case 'team':
          case 'teams':
            url = new URL(`${apiGatewayUrl}/api/soccer/team`);
            break;
          case 'stadium':
          case 'stadiums':
            url = new URL(`${apiGatewayUrl}/api/soccer/stadiums`);
            break;
          case 'schedule':
          case 'schedules':
            url = new URL(`${apiGatewayUrl}/api/soccer/schedules`);
            break;
          default:
            // 기본 검색으로
            url = new URL(`${apiGatewayUrl}/api/soccer/search`);
            url.searchParams.set("keyword", trimmed);
        }
      } else {
        // 기본 검색
        url = new URL(`${apiGatewayUrl}/api/soccer/search`);
        url.searchParams.set("keyword", trimmed);
      }

      if (!url) {
        throw new Error("URL을 생성할 수 없습니다.");
      }

      console.log("🚀 API Gateway 호출 URL:", url.toString());
      console.log("🔍 실제 요청 경로:", url.pathname);
      console.log("🔍 입력값:", trimmed);
      console.log("🔍 폴더명:", trimmed.startsWith('/') ? trimmed.substring(1).split(/\s+/, 2)[0].toLowerCase() : "N/A");

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (e) {
          // JSON 파싱 실패 시 기본 메시지 사용
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("✅ [CLIENT] 검색 성공!");
      console.log("📊 응답 데이터:", data);
      console.log("========================================");

      // /로 시작하는 경우 터미널에만 출력하고 화면에는 표시하지 않음
      if (trimmed.startsWith('/')) {
        const parts = trimmed.substring(1).split(/\s+/, 2);
        const folder = parts[0].toLowerCase();

        // 터미널에만 출력 (서버 컨트롤러에서 이미 출력됨)
        console.log(`📁 [${folder.toUpperCase()}] 테이블 데이터가 터미널에 출력되었습니다.`);
        setResults(null); // 화면에는 표시하지 않음
        window.alert(`✅ ${folder.toUpperCase()} 테이블 데이터가 터미널에 출력되었습니다.`);
      } else {
        // 일반 검색어는 화면에 표시
        setResults(data);
        window.alert(`검색 완료: ${JSON.stringify(data)}`);
      }
    } catch (error: any) {
      console.error("❌ ========================================");
      console.error("❌ [CLIENT] 검색 요청 오류 발생!");
      console.error("❌ 에러:", error);
      console.error("❌ 에러 메시지:", error.message);
      console.error("❌ 에러 타입:", error.name);
      console.error("❌ 요청 URL:", url ? url.toString() : "N/A");
      console.error("❌ ========================================");
      
      let errorMessage = "알 수 없는 오류가 발생했습니다.";
      if (error instanceof TypeError && error.message.includes("fetch")) {
        errorMessage = "네트워크 오류: API 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      window.alert(`오류: ${errorMessage}`);
    }
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
              onChange={(event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)}
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

        {/* 결과 표시 영역 */}
        {results && (
          <div className="w-full max-w-6xl mt-8">
            <div className="bg-white rounded-lg shadow-lg p-6 max-h-[600px] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4 text-zinc-900">
                📊 검색 결과
                {results.message && (
                  <span className="text-base font-normal text-zinc-600 ml-2">
                    ({results.message})
                  </span>
                )}
              </h2>

              {/* 데이터가 배열인 경우 테이블로 표시 */}
              {Array.isArray(results.data) && results.data.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-zinc-200">
                    <thead className="bg-zinc-50">
                      <tr>
                        {Object.keys(results.data[0]).map((key) => (
                          <th
                            key={key}
                            className="px-4 py-3 text-left text-xs font-medium text-zinc-700 uppercase tracking-wider"
                          >
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-zinc-200">
                      {results.data.map((item: any, index: number) => (
                        <tr key={index} className="hover:bg-zinc-50">
                          {Object.keys(results.data[0]).map((key) => (
                            <td
                              key={key}
                              className="px-4 py-3 text-sm text-zinc-700 whitespace-nowrap"
                            >
                              {item[key] !== null && item[key] !== undefined
                                ? String(item[key])
                                : "-"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : results.data && typeof results.data === "object" ? (
                // 객체인 경우 (검색 결과 등)
                <div className="text-left">
                  <pre className="whitespace-pre-wrap text-sm text-zinc-700 font-mono bg-zinc-50 p-4 rounded">
                    {JSON.stringify(results.data, null, 2)}
                  </pre>
                </div>
              ) : (
                // 기타
                <div className="text-center text-zinc-500 py-8">
                  {results.message || "결과가 없습니다."}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
