import { forwardRef } from "react";
import { SITE_NAME, SITE_SLOGAN } from "@/lib/constants";
import { stripHtml } from "@/lib/utils";
import type { Note } from "@/types/note";
import type { Profile } from "@/types/profile";

type PosterVariant = "private" | "community";

type PosterStats = {
  likeCount?: number;
  favoriteCount?: number;
  commentCount?: number;
};

type PosterCaptureCardProps = {
  note: Note;
  profile?: Profile | null;
  variant?: PosterVariant;
  stats?: PosterStats;
};

const POSTER_WIDTH = 360;
const POSTER_HEIGHT = 480;

const fontSans =
  'Arial, "Microsoft YaHei", "PingFang SC", "Noto Sans SC", "Source Han Sans SC", sans-serif';

const fontSerif =
  '"Microsoft YaHei", "PingFang SC", "Noto Sans SC", "Source Han Sans SC", serif';

const COLORS = {
  paper: "#FFFDF8",
  bottom: "#F3EDE3",
  ink: "#1C1C1E",
  text: "#4F5E6D",
  muted: "#9AA1AA",
  border: "#E6E0D6",
  red: "#C04851",
  redDark: "#9F3540",
  redLight: "#F8E9E9",
  green: "#4FA77E",
  blue: "#243447",
  white: "#FFFFFF"
};

function normalizeText(value?: string | null) {
  return String(value ?? "")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function limitText(value: string, max: number) {
  const text = normalizeText(value);
  if (text.length <= max) return text;
  return `${text.slice(0, max)}…`;
}

function formatDate(value?: string | null) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");

  return `${y}/${m}/${d}`;
}

function safeNumber(value?: number) {
  if (typeof value !== "number") return 0;
  if (!Number.isFinite(value)) return 0;
  return value;
}

export const PosterCaptureCard = forwardRef<
  HTMLDivElement,
  PosterCaptureCardProps
>(function PosterCaptureCard(
  { note, profile, variant = "private", stats },
  ref
) {
  const isCommunity = variant === "community";

  const rawTitle = normalizeText(note.title) || "未题";
  const title = limitText(rawTitle, isCommunity ? 26 : 34);

  const rawContent =
    isCommunity && note.community_excerpt
      ? normalizeText(note.community_excerpt)
      : normalizeText(stripHtml(note.content));

  const content = limitText(
    rawContent || "这是一条安静的云笺。",
    isCommunity ? 42 : 64
  );

  const authorName = limitText(
    profile?.display_name || profile?.username || "云笺用户",
    12
  );

  const username = limitText(profile?.username || "user", 18);

  const visibleTags = Array.isArray(note.tags)
    ? note.tags.filter(Boolean).slice(0, 3)
    : [];

  const dateText =
    formatDate(note.updated_at) ||
    formatDate(note.created_at) ||
    formatDate(new Date().toISOString());

  const likeCount = safeNumber(stats?.likeCount);
  const favoriteCount = safeNumber(stats?.favoriteCount);
  const commentCount = safeNumber(stats?.commentCount);

  const titleFontSize = (() => {
    if (title.length > 22) return 22;
    if (title.length > 14) return 24;
    return 27;
  })();

  const posterPayload = JSON.stringify({
    variant,
    brand: isCommunity ? "云笺社区" : SITE_NAME,
    subtitle: isCommunity ? "YUN JIAN COMMUNITY" : "YUN JIAN NOTE",
    sealTop: isCommunity ? "共" : "云",
    sealBottom: isCommunity ? "赏" : "笺",
    title,
    content,
    authorName,
    username,
    avatarUrl: profile?.avatar_url ?? null,
    tags: visibleTags,
    dateText,
    sourceText: isCommunity ? "来自云笺社区" : SITE_SLOGAN,
    stats: {
      likeCount,
      favoriteCount,
      commentCount
    }
  });

  return (
    <div
      ref={ref}
      data-poster-payload={posterPayload}
      style={{
        position: "relative",
        width: POSTER_WIDTH,
        height: POSTER_HEIGHT,
        overflow: "hidden",
        borderRadius: 28,
        boxSizing: "border-box",
        backgroundColor: COLORS.paper,
        color: COLORS.ink,
        fontFamily: fontSans
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: POSTER_WIDTH,
          height: POSTER_HEIGHT,
          backgroundColor: COLORS.paper
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: POSTER_WIDTH,
          height: 118,
          backgroundColor: COLORS.bottom
        }}
      />

      <div
        style={{
          position: "absolute",
          left: -76,
          top: 105,
          width: 162,
          height: 162,
          borderRadius: 999,
          border: "1px solid rgba(192,72,81,0.13)",
          boxSizing: "border-box"
        }}
      />

      <div
        style={{
          position: "absolute",
          right: -74,
          top: 232,
          width: 184,
          height: 184,
          borderRadius: 999,
          border: "1px solid rgba(79,167,126,0.16)",
          boxSizing: "border-box"
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 28,
          top: 24,
          width: 304,
          height: 54
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 230,
            height: 24,
            overflow: "hidden",
            fontSize: 20,
            lineHeight: "24px",
            fontWeight: 900,
            letterSpacing: "1px",
            color: COLORS.red
          }}
        >
          {isCommunity ? "云笺社区" : SITE_NAME}
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            top: 32,
            width: 230,
            height: 12,
            overflow: "hidden",
            fontSize: 10,
            lineHeight: "12px",
            letterSpacing: "4px",
            color: COLORS.muted
          }}
        >
          {isCommunity ? "YUN JIAN COMMUNITY" : "YUN JIAN NOTE"}
        </div>

        <div
          style={{
            position: "absolute",
            right: 0,
            top: -2,
            width: 36,
            height: 54,
            borderRadius: 18,
            backgroundColor: COLORS.red,
            color: COLORS.white,
            textAlign: "center",
            boxSizing: "border-box",
            paddingTop: 8,
            fontSize: 15,
            lineHeight: "18px",
            fontWeight: 900
          }}
        >
          {isCommunity ? (
            <>
              共
              <br />
              赏
            </>
          ) : (
            <>
              云
              <br />
              笺
            </>
          )}
        </div>
      </div>

      {isCommunity && (
        <div
          style={{
            position: "absolute",
            left: 28,
            top: 91,
            width: 304,
            height: 54,
            borderRadius: 20,
            border: `1px solid ${COLORS.border}`,
            backgroundColor: "rgba(255,255,255,0.60)",
            boxSizing: "border-box"
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 14,
              top: 9,
              width: 36,
              height: 36,
              borderRadius: 999,
              overflow: "hidden",
              backgroundColor: COLORS.redLight,
              color: COLORS.red,
              fontSize: 20,
              lineHeight: "36px",
              fontWeight: 900,
              textAlign: "center"
            }}
          >
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={authorName}
                crossOrigin="anonymous"
                style={{
                  display: "block",
                  width: 36,
                  height: 36,
                  objectFit: "cover"
                }}
              />
            ) : (
              authorName.slice(0, 1)
            )}
          </div>

          <div
            style={{
              position: "absolute",
              left: 62,
              top: 10,
              width: 200,
              height: 18,
              overflow: "hidden",
              fontSize: 15,
              lineHeight: "18px",
              fontWeight: 900,
              color: COLORS.ink
            }}
          >
            {authorName}
          </div>

          <div
            style={{
              position: "absolute",
              left: 62,
              top: 32,
              width: 200,
              height: 14,
              overflow: "hidden",
              fontSize: 10,
              lineHeight: "14px",
              letterSpacing: "1px",
              color: COLORS.muted
            }}
          >
            @{username}
          </div>
        </div>
      )}

      <div
        style={{
          position: "absolute",
          left: 28,
          top: isCommunity ? 172 : 116,
          width: 304,
          height: isCommunity ? 58 : 82,
          overflow: "hidden",
          fontFamily: fontSerif,
          fontSize: titleFontSize,
          lineHeight: `${titleFontSize + 8}px`,
          fontWeight: 900,
          color: COLORS.ink,
          wordBreak: "break-all"
        }}
      >
        {title}
      </div>

      <div
        style={{
          position: "absolute",
          left: 28,
          top: isCommunity ? 238 : 212,
          width: 304,
          height: 1,
          backgroundColor: "rgba(192,72,81,0.22)"
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 28,
          top: isCommunity ? 256 : 232,
          width: 304,
          height: isCommunity ? 48 : 78,
          overflow: "hidden",
          fontSize: 14,
          lineHeight: "22px",
          fontWeight: 500,
          color: COLORS.text,
          wordBreak: "break-all"
        }}
      >
        {content}
      </div>

      <div
        style={{
          position: "absolute",
          left: 28,
          top: isCommunity ? 320 : 326,
          width: 304,
          height: 24,
          overflow: "hidden",
          whiteSpace: "nowrap"
        }}
      >
        {visibleTags.length > 0 ? (
          visibleTags.map((tag) => (
            <div
              key={tag}
              style={{
                display: "inline-block",
                maxWidth: 86,
                height: 22,
                lineHeight: "22px",
                marginRight: 6,
                paddingLeft: 10,
                paddingRight: 10,
                borderRadius: 999,
                border: "1px solid rgba(192,72,81,0.20)",
                backgroundColor: "rgba(248,233,233,0.92)",
                color: COLORS.redDark,
                fontSize: 11,
                fontWeight: 800,
                overflow: "hidden",
                textOverflow: "ellipsis",
                verticalAlign: "top",
                boxSizing: "border-box"
              }}
            >
              {limitText(tag, 8)}
            </div>
          ))
        ) : (
          <div
            style={{
              display: "inline-block",
              height: 22,
              lineHeight: "22px",
              paddingLeft: 10,
              paddingRight: 10,
              borderRadius: 999,
              border: "1px solid rgba(192,72,81,0.20)",
              backgroundColor: "rgba(248,233,233,0.92)",
              color: COLORS.redDark,
              fontSize: 11,
              fontWeight: 800,
              boxSizing: "border-box"
            }}
          >
            云笺
          </div>
        )}
      </div>

      {isCommunity && (
        <div
          style={{
            position: "absolute",
            left: 28,
            top: 354,
            width: 304,
            height: 48
          }}
        >
          <PosterStat left={0} value={likeCount} label="喜欢" color={COLORS.red} />

          <PosterStat
            left={106}
            value={favoriteCount}
            label="收藏"
            color={COLORS.green}
          />

          <PosterStat
            left={212}
            value={commentCount}
            label="评论"
            color={COLORS.blue}
          />
        </div>
      )}

      <div
        style={{
          position: "absolute",
          left: 28,
          top: isCommunity ? 414 : 384,
          width: 210,
          height: 54,
          overflow: "hidden"
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 200,
            height: 18,
            overflow: "hidden",
            fontSize: 13,
            lineHeight: "18px",
            fontWeight: 900,
            letterSpacing: "2px",
            color: COLORS.muted
          }}
        >
          {dateText}
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            top: 28,
            width: 200,
            height: 22,
            overflow: "hidden",
            fontFamily: fontSans,
            fontSize: 15,
            lineHeight: "22px",
            fontWeight: 900,
            color: COLORS.ink,
            whiteSpace: "nowrap"
          }}
        >
          {isCommunity ? "来自云笺社区" : SITE_SLOGAN}
        </div>
      </div>

      <FallbackQR />
    </div>
  );
});

function PosterStat({
  left,
  value,
  label,
  color
}: {
  left: number;
  value: number;
  label: string;
  color: string;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left,
        top: 0,
        width: 92,
        height: 48,
        borderRadius: 15,
        border: `1px solid ${COLORS.border}`,
        backgroundColor: "rgba(255,255,255,0.62)",
        boxSizing: "border-box",
        textAlign: "center",
        overflow: "hidden"
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 7,
          width: 92,
          height: 18,
          overflow: "hidden",
          fontSize: 17,
          lineHeight: "18px",
          fontWeight: 900,
          color
        }}
      >
        {value}
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          top: 29,
          width: 92,
          height: 14,
          overflow: "hidden",
          fontSize: 11,
          lineHeight: "14px",
          color: COLORS.muted
        }}
      >
        {label}
      </div>
    </div>
  );
}

function FallbackQR() {
  const black = "#1F1F23";

  function block(
    left: number,
    top: number,
    width: number,
    height: number,
    backgroundColor = black
  ) {
    return (
      <i
        style={{
          position: "absolute",
          left,
          top,
          width,
          height,
          backgroundColor,
          display: "block"
        }}
      />
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        right: 28,
        bottom: 26,
        width: 50,
        height: 50,
        borderRadius: 12,
        backgroundColor: COLORS.white,
        boxSizing: "border-box",
        padding: 5
      }}
    >
      <div
        style={{
          position: "relative",
          width: 40,
          height: 40,
          backgroundColor: COLORS.white
        }}
      >
        {block(0, 0, 10, 10)}
        {block(3, 3, 4, 4, COLORS.white)}

        {block(30, 0, 10, 10)}
        {block(33, 3, 4, 4, COLORS.white)}

        {block(0, 30, 10, 10)}
        {block(3, 33, 4, 4, COLORS.white)}

        {block(17, 3, 5, 5)}
        {block(23, 3, 4, 4)}
        {block(14, 14, 6, 6)}
        {block(22, 15, 11, 5)}
        {block(18, 24, 5, 5)}
        {block(25, 24, 9, 5)}
        {block(15, 31, 5, 9)}
        {block(24, 31, 4, 4)}
        {block(31, 35, 7, 5)}
      </div>
    </div>
  );
}