export function formatEarnings(amount: number) {
  if (amount < 1_000_000) {
    return `${amount.toLocaleString()} VND`;
  } else {
    // 3,200,000 -> "3.2M"
    const m = amount / 1_000_000;
    return `${m % 1 === 0 ? m : m.toFixed(1)}M`;
  }
}
