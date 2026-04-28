import Image from "next/image";

export function PosterPreview() {
  return (
    <div className="xhs-poster-frame relative p-8">
      <div className="absolute right-8 top-8 rounded-full border border-cinnabar/20 bg-white/50 px-4 py-2 text-xs font-semibold tracking-[0.2em] text-cinnabar">
        云笺
      </div>

      <div className="flex h-full flex-col justify-between rounded-[24px] border border-white/70 bg-white/48 p-7 backdrop-blur-sm">
        <div>
          <div className="vertical-seal inline-flex rounded-2xl bg-cinnabar px-2 py-3 text-xs font-bold text-white shadow-seal">
            今日灵感
          </div>

          <h2 className="font-title mt-10 text-5xl font-black leading-tight text-ink">
            春水初生，
            <br />
            春林初盛
          </h2>

          <p className="mt-8 text-base leading-loose text-dai/74">
            把转瞬即逝的灵感写下来，让文字如宣纸上的水墨，自然晕开，
            留住每一次思考的纹理。
          </p>
        </div>

        <div>
          <div className="mb-6 flex flex-wrap gap-2">
            {["读书", "灵感", "摘录"].map((tag) => (
              <span key={tag} className="bookmark-tag">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-medium tracking-[0.2em] text-dai/45">
                YUN JIAN NOTE
              </p>
              <p className="font-title mt-2 text-lg font-black text-ink">
                一方宣纸，安放灵感
              </p>
            </div>

            <Image
              src="/poster-qr-placeholder.svg"
              width={70}
              height={70}
              alt="二维码占位"
              className="rounded-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
