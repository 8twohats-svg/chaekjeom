// GTM dataLayer 헬퍼

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

function fire(eventName: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...params });
}

export const track = {
  pageView: () => fire("page_view"),
  askClicked: () => fire("ask_clicked"),
  askAgainClicked: () => fire("ask_again_clicked"),
  resultView: (answer: string) => fire("result_view", { answer_preview: answer.slice(0, 30) }),
  shareClicked: () => fire("share_clicked"),
  shareCopied: () => fire("share_copied"),
  resetClicked: () => fire("reset_clicked"),
};
