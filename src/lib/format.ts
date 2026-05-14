export function formatEarnings(amount: number, lang: "vi" | "en"): string {
  if (lang === "vi") {
    // 3,200,000 → "3.2Tr"
    const tr = amount / 1_000_000;
    return `${tr % 1 === 0 ? tr : tr.toFixed(1)}Tr`;
  } else {
    // 3,200,000 → "3.2M"  (giả định VND, hiển thị M cho gọn)
    const m = amount / 1_000_000;
    return `${m % 1 === 0 ? m : m.toFixed(1)}M`;
  }
}
