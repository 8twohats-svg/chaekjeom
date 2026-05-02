import { useState } from "react";
import { sentences } from "./data/sentences";

type Stage = "home" | "result";

function pickRandom(): string {
  return sentences[Math.floor(Math.random() * sentences.length)];
}

const ANSWER_PREFIXES = [
  "책님이 답하시길",
  "책님께서 말씀하시길",
  "책님이 정답을 알려드립니다",
  "책님이 한 말씀 하시길",
  "책님의 답은",
];

function pickPrefix(): string {
  return ANSWER_PREFIXES[Math.floor(Math.random() * ANSWER_PREFIXES.length)];
}

function App() {
  const [stage, setStage] = useState<Stage>("home");
  const [answer, setAnswer] = useState<string>("");
  const [prefix, setPrefix] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const ask = () => {
    setAnswer(pickRandom());
    setPrefix(pickPrefix());
    setStage("result");
    setCopied(false);
  };

  const askAgain = () => {
    setAnswer(pickRandom());
    setPrefix(pickPrefix());
    setCopied(false);
  };

  const reset = () => {
    setStage("home");
  };

  const share = async () => {
    const text = `📖 책점\n\n${prefix},\n\n"${answer}"\n\n나의 답을 받아보세요 → https://chaekjeom.pages.dev`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col">
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

      <footer className="text-center text-xs text-ink-soft/60 py-6 px-4 space-y-2">
        <p className="font-serif">책점</p>
        <p>© 2026</p>
      </footer>
    </div>
  );
}

function Home({ onAsk }: { onAsk: () => void }) {
  return (
    <div className="text-center space-y-12 animate-fade-in">
      <div className="space-y-4">
        <div className="text-6xl mb-4" aria-hidden>
          📖
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-ink font-serif tracking-tight">
          책점
        </h1>
        <p className="text-ink-soft leading-relaxed font-serif">
          마음에 질문을 담고
          <br />
          책을 펼쳐보세요.
        </p>
      </div>

      <button
        type="button"
        onClick={onAsk}
        className="w-full py-5 px-8 bg-ink text-paper rounded-full font-medium hover:bg-accent transition-colors text-lg shadow-lg shadow-ink/10"
      >
        책님께 묻기
      </button>

      <p className="text-xs text-ink-soft/60 leading-relaxed">
        * 운명은 책님의 한 마디 안에 숨어 있습니다.
        <br />
        해석은 마음 가는 대로.
      </p>
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
    <div className="space-y-10 animate-fade-in" key={answer}>
      {/* 책 펼친 카드 */}
      <div className="bg-paper-dark rounded-3xl px-8 py-12 sm:py-16 border border-accent-soft/30 shadow-xl shadow-ink/5 relative overflow-hidden">
        {/* 책 가운데 라인 */}
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-accent-soft/20" />

        <div className="relative space-y-8 text-center">
          <p className="text-sm text-accent font-serif tracking-wide">
            ── {prefix} ──
          </p>

          <p className="text-2xl sm:text-3xl text-ink leading-relaxed font-serif font-bold px-2">
            "{answer}"
          </p>

          <p className="text-xs text-ink-soft/70 font-serif">— 책님</p>
        </div>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={onShare}
          className="w-full py-4 bg-ink text-paper rounded-full font-medium hover:bg-accent transition-colors"
        >
          {copied ? "✓ 복사됐어요" : "공유하기"}
        </button>
        <button
          type="button"
          onClick={onAskAgain}
          className="w-full py-4 bg-paper-dark text-ink rounded-full font-medium hover:bg-accent-soft/30 transition-colors border border-accent-soft/30"
        >
          한 번 더 묻기
        </button>
        <button
          type="button"
          onClick={onReset}
          className="w-full py-3 text-sm text-ink-soft hover:text-ink transition-colors"
        >
          처음으로
        </button>
      </div>

      <p className="text-xs text-ink-soft/60 text-center leading-relaxed">
        해석은 본인의 몫입니다.
        <br />
        책님은 책임지지 않습니다.
      </p>
    </div>
  );
}

export default App;
