export function InkDecorations() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute left-[6%] top-[18%] h-72 w-72 rounded-full bg-cinnabar/10 blur-3xl" />
      <div className="absolute right-[4%] top-[14%] h-80 w-80 rounded-full bg-shiqing/20 blur-3xl" />
      <div className="absolute left-[40%] top-[54%] h-96 w-96 rounded-full bg-dai/5 blur-3xl" />
      <div className="absolute right-24 top-44 h-48 w-48 rounded-full border border-cinnabar/10" />
      <div className="absolute bottom-32 left-16 h-64 w-64 rounded-full border border-shiqing/20" />
    </div>
  );
}
