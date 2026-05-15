import { useRouter } from "@tanstack/react-router";

export function BackButton({ label }: { label?: string }) {
  const router = useRouter();
  
  return (
    <button
      onClick={() => router.history.back()}
      className="flex items-center gap-1.5 text-sm text-gray-600 font-medium py-2 hover:text-gray-900 transition-colors"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
      </svg>
      {label ?? "Back"}
    </button>
  );
}
