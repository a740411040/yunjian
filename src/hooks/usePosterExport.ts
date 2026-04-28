"use client";

import { useState } from "react";
import { toast } from "sonner";

type PosterPayload = {
  variant: "private" | "community";
  brand: string;
  subtitle: string;
  sealTop: string;
  sealBottom: string;
  title: string;
  content: string;
  authorName: string;
  username: string;
  avatarUrl: string | null;
  tags: string[];
  dateText: string;
  sourceText: string;
  stats: {
    likeCount: number;
    favoriteCount: number;
    commentCount: number;
  };
};

const W = 360;
const H = 480;
const SCALE = 3;

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

const fontSans =
  'Arial, "Microsoft YaHei", "PingFang SC", "Noto Sans SC", sans-serif';

const fontTitle =
  '"Microsoft YaHei", "PingFang SC", "Noto Sans SC", Arial, sans-serif';

function safeFileName(value: string) {
  return (
    value
      .trim()
      .replace(/[\\/:*?"<>|]/g, "")
      .replace(/\s+/g, " ")
      .slice(0, 24) || "云笺"
  );
}

function readPosterPayload(node: HTMLElement): PosterPayload {
  const raw = node.dataset.posterPayload;

  if (!raw) {
    throw new Error("海报数据缺失，请刷新页面后重试。");
  }

  return JSON.parse(raw) as PosterPayload;
}

function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const r = Math.min(radius, width / 2, height / 2);

  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function fillRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  color: string
) {
  ctx.save();
  drawRoundRect(ctx, x, y, width, height, radius);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

function strokeRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  color: string,
  lineWidth = 1
) {
  ctx.save();
  drawRoundRect(ctx, x, y, width, height, radius);
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
  ctx.restore();
}

function drawCircleStroke(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string
) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
}

function drawWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number
) {
  const chars = Array.from(text);
  const lines: string[] = [];
  let line = "";

  for (const char of chars) {
    const nextLine = line + char;

    if (ctx.measureText(nextLine).width <= maxWidth) {
      line = nextLine;
      continue;
    }

    if (line) {
      lines.push(line);
      line = char;
    }

    if (lines.length >= maxLines) {
      break;
    }
  }

  if (line && lines.length < maxLines) {
    lines.push(line);
  }

  const finalLines = lines.slice(0, maxLines);

  if (chars.length > finalLines.join("").length && finalLines.length > 0) {
    const lastIndex = finalLines.length - 1;
    let last = finalLines[lastIndex];

    while (last.length > 0 && ctx.measureText(`${last}…`).width > maxWidth) {
      last = last.slice(0, -1);
    }

    finalLines[lastIndex] = `${last}…`;
  }

  finalLines.forEach((item, index) => {
    ctx.fillText(item, x, y + index * lineHeight);
  });
}

function drawCenteredText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  width: number
) {
  const textWidth = ctx.measureText(text).width;
  ctx.fillText(text, x + (width - textWidth) / 2, y);
}

function getImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("图片加载失败"));
    image.src = url;
  });
}

async function drawAvatar(
  ctx: CanvasRenderingContext2D,
  avatarUrl: string | null,
  fallbackText: string,
  x: number,
  y: number,
  size: number
) {
  fillRoundRect(ctx, x, y, size, size, size / 2, COLORS.redLight);

  if (avatarUrl) {
    try {
      const image = await getImage(avatarUrl);

      ctx.save();
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(image, x, y, size, size);
      ctx.restore();
      return;
    } catch {
      // 头像跨域失败时自动降级为首字
    }
  }

  ctx.save();
  ctx.fillStyle = COLORS.red;
  ctx.font = `900 ${Math.round(size * 0.48)}px ${fontSans}`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillText(fallbackText.slice(0, 1) || "云", x + size / 2, y + size / 2);
  ctx.restore();
}

function drawFallbackQR(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const black = "#1F1F23";

  fillRoundRect(ctx, x, y, 50, 50, 12, COLORS.white);

  function block(left: number, top: number, width: number, height: number) {
    ctx.fillStyle = black;
    ctx.fillRect(x + 5 + left, y + 5 + top, width, height);
  }

  function white(left: number, top: number, width: number, height: number) {
    ctx.fillStyle = COLORS.white;
    ctx.fillRect(x + 5 + left, y + 5 + top, width, height);
  }

  block(0, 0, 10, 10);
  white(3, 3, 4, 4);

  block(30, 0, 10, 10);
  white(33, 3, 4, 4);

  block(0, 30, 10, 10);
  white(3, 33, 4, 4);

  block(17, 3, 5, 5);
  block(23, 3, 4, 4);
  block(14, 14, 6, 6);
  block(22, 15, 11, 5);
  block(18, 24, 5, 5);
  block(25, 24, 9, 5);
  block(15, 31, 5, 9);
  block(24, 31, 4, 4);
  block(31, 35, 7, 5);
}

function drawStat(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  value: number,
  label: string,
  color: string
) {
  strokeRoundRect(ctx, x, y, 92, 48, 15, COLORS.border);
  fillRoundRect(ctx, x, y, 92, 48, 15, "rgba(255,255,255,0.62)");

  ctx.save();
  ctx.textBaseline = "top";
  ctx.font = `900 17px ${fontSans}`;
  ctx.fillStyle = color;
  drawCenteredText(ctx, String(value || 0), x, y + 7, 92);

  ctx.font = `400 11px ${fontSans}`;
  ctx.fillStyle = COLORS.muted;
  drawCenteredText(ctx, label, x, y + 29, 92);
  ctx.restore();
}

async function drawPoster(payload: PosterPayload) {
  const canvas = document.createElement("canvas");
  canvas.width = W * SCALE;
  canvas.height = H * SCALE;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("当前浏览器不支持 Canvas。");
  }

  ctx.scale(SCALE, SCALE);
  ctx.textBaseline = "top";

  ctx.save();
  drawRoundRect(ctx, 0, 0, W, H, 28);
  ctx.clip();

  ctx.fillStyle = COLORS.paper;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = COLORS.bottom;
  ctx.fillRect(0, H - 118, W, 118);

  drawCircleStroke(ctx, 5, 186, 81, "rgba(192,72,81,0.13)");
  drawCircleStroke(ctx, 318, 324, 92, "rgba(79,167,126,0.16)");

  ctx.font = `900 20px ${fontSans}`;
  ctx.fillStyle = COLORS.red;
  ctx.fillText(payload.brand, 28, 24);

  ctx.font = `400 10px ${fontSans}`;
  ctx.letterSpacing = "4px";
  ctx.fillStyle = COLORS.muted;
  ctx.fillText(payload.subtitle, 28, 56);
  ctx.letterSpacing = "0px";

  fillRoundRect(ctx, 296, 22, 36, 54, 18, COLORS.red);
  ctx.font = `900 15px ${fontSans}`;
  ctx.fillStyle = COLORS.white;
  ctx.textAlign = "center";
  ctx.fillText(payload.sealTop, 314, 30);
  ctx.fillText(payload.sealBottom, 314, 48);
  ctx.textAlign = "start";

  if (payload.variant === "community") {
    strokeRoundRect(ctx, 28, 91, 304, 54, 20, COLORS.border);
    fillRoundRect(ctx, 28, 91, 304, 54, 20, "rgba(255,255,255,0.60)");

    await drawAvatar(
      ctx,
      payload.avatarUrl,
      payload.authorName,
      42,
      100,
      36
    );

    ctx.font = `900 15px ${fontSans}`;
    ctx.fillStyle = COLORS.ink;
    ctx.fillText(payload.authorName, 90, 101);

    ctx.font = `400 10px ${fontSans}`;
    ctx.fillStyle = COLORS.muted;
    ctx.fillText(`@${payload.username}`, 90, 123);
  }

  const titleTop = payload.variant === "community" ? 172 : 116;
  const titleMaxLines = payload.variant === "community" ? 2 : 3;
  const titleFontSize =
    payload.title.length > 22 ? 22 : payload.title.length > 14 ? 24 : 27;

  ctx.font = `900 ${titleFontSize}px ${fontTitle}`;
  ctx.fillStyle = COLORS.ink;
  drawWrappedText(
    ctx,
    payload.title,
    28,
    titleTop,
    304,
    titleFontSize + 8,
    titleMaxLines
  );

  ctx.fillStyle = "rgba(192,72,81,0.22)";
  ctx.fillRect(28, payload.variant === "community" ? 238 : 212, 304, 1);

  ctx.font = `500 14px ${fontSans}`;
  ctx.fillStyle = COLORS.text;
  drawWrappedText(
    ctx,
    payload.content,
    28,
    payload.variant === "community" ? 256 : 232,
    304,
    22,
    payload.variant === "community" ? 2 : 4
  );

  let tagX = 28;
  const tagY = payload.variant === "community" ? 320 : 326;
  const tags = payload.tags.length > 0 ? payload.tags.slice(0, 3) : ["云笺"];

  for (const tag of tags) {
    ctx.font = `800 11px ${fontSans}`;
    const text = tag.length > 8 ? `${tag.slice(0, 8)}…` : tag;
    const tagWidth = Math.min(92, Math.max(42, ctx.measureText(text).width + 20));

    if (tagX + tagWidth > 332) {
      break;
    }

    fillRoundRect(ctx, tagX, tagY, tagWidth, 22, 999, "rgba(248,233,233,0.92)");
    strokeRoundRect(ctx, tagX, tagY, tagWidth, 22, 999, "rgba(192,72,81,0.20)");

    ctx.fillStyle = COLORS.redDark;
    ctx.fillText(text, tagX + 10, tagY + 4);

    tagX += tagWidth + 6;
  }

  if (payload.variant === "community") {
    drawStat(ctx, 28, 354, payload.stats.likeCount, "喜欢", COLORS.red);
    drawStat(ctx, 134, 354, payload.stats.favoriteCount, "收藏", COLORS.green);
    drawStat(ctx, 240, 354, payload.stats.commentCount, "评论", COLORS.blue);
  }

  ctx.font = `900 13px ${fontSans}`;
  ctx.fillStyle = COLORS.muted;
  ctx.fillText(payload.dateText, 28, payload.variant === "community" ? 414 : 384);

  ctx.font = `900 15px ${fontSans}`;
  ctx.fillStyle = COLORS.ink;
  ctx.fillText(
    payload.sourceText,
    28,
    payload.variant === "community" ? 442 : 412
  );

  drawFallbackQR(ctx, 282, 404);

  ctx.restore();

  return canvas;
}

function canvasToBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("海报生成失败。"));
        return;
      }

      resolve(blob);
    }, "image/png");
  });
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

export function usePosterExport() {
  const [exporting, setExporting] = useState(false);

  async function exportPoster(node: HTMLElement | null, title = "云笺") {
    if (!node) {
      toast.error("没有找到海报节点。");
      return;
    }

    setExporting(true);

    try {
      if (document.fonts) {
        await document.fonts.ready;
      }

      const payload = readPosterPayload(node);
      const canvas = await drawPoster(payload);
      const blob = await canvasToBlob(canvas);

      downloadBlob(blob, `${safeFileName(title)}-云笺海报.png`);

      toast.success("海报已生成，请在下载目录查看。");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "海报生成失败。";

      toast.error(message);
      console.error("Poster export failed:", error);
    } finally {
      setExporting(false);
    }
  }

  return {
    exporting,
    exportPoster
  };
}
