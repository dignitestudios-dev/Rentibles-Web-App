"use client";

export default function Loader({
  show,
  
}: {
  show: boolean;

}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 h-screen flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 rounded-xl bg-zinc-900 px-8 py-6 shadow-xl">
        <div className="flex items-end gap-2 h-8">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="w-2 h-full origin-bottom rounded-full bg-orange-500"
              style={{
                animation: "pulseBar 1s ease-in-out infinite",
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>

        <p className="text-sm text-zinc-300">loading....</p>
      </div>
    </div>
  );
}
