import { useEffect, useState } from "react";
import { sentences } from "./data/sentences";
import { track } from "./lib/analytics";

type Stage = "home" | "result";

function pickRandom(): string {
  return sentences[Math.floor(Math.random() * sentences.length)];
}

const ANSWER_PREFIXES = [
  "책님이 답하시길",
  "책님께서 말씀하시길",
  "책님이 정답을 알려드립니다",
  "책님이 한 말씀 하시길",
  "책님의 답은 이거예요",
  "책님이 점지하시길",
  "책님이 그러시는데요",
  "책님 의견은",
  "책님 왈,",
  "책님이 보시기에",
];

function pickPrefix(): string {
  return ANSWER_PREFIXES[Math.floor(Math.random() * ANSWER_PREFIXES.length)];
}

function App() {
  const [stage, setStage] = useState<Stage>("home");
  const [answer, setAnswer] = useState<string>("");
  const [prefix, setPrefix] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    track.pageView();
  }, []);

  const ask = () => {
    track.askClicked();
    const a = pickRandom();
    setAnswer(a);
    setPrefix(pickPrefix());
    setStage("result");
    setCopied(false);
    track.resultView(a);
  };

  const askAgain = () => {
    track.askAgainClicked();
    const a = pickRandom();
    setAnswer(a);
    setPrefix(pickPrefix());
    setCopied(false);
    track.resultView(a);
  };

  const reset = () => {
    track.resetClicked();
    setStage("home");
  };

  const share = async () => {
    track.shareClicked();
    const text = `📖✨ 책점\n\n${prefix}\n"${answer}"\n— 책님\n\n나도 책점 보러가기 → https://chaekjeom.pages.dev`;
    try {
      await navigator.clipboard.writeText(text);
      track.shareCopied();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          {stage === "home" ? (
            <Home onAsk={ask} />
          ) : (
            <Result
              prefix={prefix}
              answer={answer}
              onAskAgain={askAgain}
              onShare={share}
              onReset={reset}
              copied={copied}
            />
          )}
        </div>
      </main>

      <footer className="text-center text-xs text-ink-soft/70 py-6 px-4 space-y-2">
        <div className="space-x-3">
          <a href="/privacy/" className="hover:text-ink transition-colors">
            개인정보처리방침
          </a>
          <span>·</span>
          <a href="/terms/" className="hover:text-ink transition-colors">
            이용약관
          </a>
        </div>
        <p>📖 책점 © 2026</p>
      </footer>
    </div>
  );
}

function Home({ onAsk }: { onAsk: () => void }) {
  return (
    <div className="text-center space-y-10 animate-fade-in">
      <div className="space-y-5">
        <div className="text-8xl animate-bounce-soft" aria-hidden>
          📖
        </div>
        <h1 className="text-5xl sm:text-6xl font-black text-ink tracking-tight">
          책점
        </h1>
        <p className="text-ink-soft leading-relaxed text-base">
          ✨ 마음에 질문을 담고 ✨
          <br />
          책님께 한 말씀 받아보세요
        </p>
      </div>

      <button
        type="button"
        onClick={onAsk}
        className="w-full py-5 px-8 bg-purple-deep text-white rounded-3xl font-bold text-lg
                   hover:scale-105 active:scale-95 transition-transform
                   shadow-2xl shadow-purple/40
                   border-2 border-purple-deep"
      >
        책님께 묻기 ✨
      </button>

      <div className="bg-white/60 backdrop-blur rounded-2xl p-4 text-sm text-ink-soft border border-white/80 leading-relaxed">
        💡 진지하게 받아들이지 마세요
        <br />
        <span className="font-bold text-ink">책님</span>도 가끔은 농담을 하신답니다
      </div>
    </div>
  );
}

function Result({
  prefix,
  answer,
  onAskAgain,
  onShare,
  onReset,
  copied,
}: {
  prefix: string;
  answer: string;
  onAskAgain: () => void;
  onShare: () => void;
  onReset: () => void;
  copied: boolean;
}) {
  return (
    <div className="space-y-8" key={answer}>
      {/* 책 펼친 카드 */}
      <div className="bg-white rounded-3xl px-7 py-12 shadow-2xl shadow-purple/20 border-2 border-purple/20 animate-pop">
        <div className="space-y-7 text-center">
          <p className="text-sm text-purple-deep font-bold tracking-wide">
            ✨ {prefix} ✨
          </p>

          <p className="text-2xl sm:text-3xl text-ink leading-relaxed font-extrabold px-2">
            "{answer}"
          </p>

          <div className="flex items-center justify-center gap-2 text-sm text-ink-soft pt-2">
            <span>—</span>
            <span className="font-bold">책님</span>
            <span>📖</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={onShare}
          className={`w-full py-4 rounded-3xl font-bold text-lg shadow-xl transition-transform hover:scale-105 active:scale-95 ${
            copied
              ? "bg-yellow text-ink shadow-yellow/40"
              : "bg-pink text-white shadow-pink/40"
          }`}
        >
          {copied ? "✓ 복사됐어요" : "📋 공유하기"}
        </button>
        <button
          type="button"
          onClick={onAskAgain}
          className="w-full py-4 bg-purple text-white rounded-3xl font-bold text-lg shadow-xl shadow-purple/40 hover:scale-105 active:scale-95 transition-transform"
        >
          🎲 한 번 더 묻기
        </button>
        <button
          type="button"
          onClick={onReset}
          className="w-full py-3 text-sm text-ink-soft hover:text-ink transition-colors"
        >
          처음으로
        </button>
      </div>

      <p className="text-xs text-ink-soft/70 text-center leading-relaxed bg-white/40 backdrop-blur rounded-2xl py-3 px-4">
        🤷 해석은 본인의 몫
        <br />
        🙅 책님은 책임지지 않습니다
      </p>
    </div>
  );
}

export default App;
