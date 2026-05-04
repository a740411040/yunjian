export type ThemeMode = "day" | "night-dark" | "night-light";

export const THEME_STORAGE_KEY = "yun-jian-theme-mode";

export const siteThemeOptions: Array<{
  id: ThemeMode;
  label: string;
  description: string;
}> = [
  {
    id: "day",
    label: "昼白",
    description: "宣纸留白，适合日间书写。"
  },
  {
    id: "night-dark",
    label: "夜墨",
    description: "深色夜间模式，沉静护眼。"
  },
  {
    id: "night-light",
    label: "月绢",
    description: "浅色夜间模式，柔和不刺目。"
  }
];

export type LandingVariant = {
  id: string;
  name: string;
  badge: string;
  heading: string;
  highlight: string;
  description: string;
  featureLead: string;
  featureBody: string;
  heroNote: string;
  footerNote: string;
  palette: {
    shell: string;
    badge: string;
    primaryButton: string;
    secondaryButton: string;
    chip: string;
    glowA: string;
    glowB: string;
    glowC: string;
    frame: string;
  };
};

export const landingVariants: LandingVariant[] = [
  {
    id: "orchid-river",
    name: "兰汀晓雾",
    badge: "雾青宣色 · 素雅款",
    heading: "一纸微澜",
    highlight: "安放晨起的念头",
    description:
      "像把早春的潮气收进砚台，适合记录未说出口的想法、刚成形的计划与温柔的自我叙述。",
    featureLead: "轻、净、慢",
    featureBody:
      "笔记、分享、互动与反馈都藏在克制的层次里，让界面像清晨窗纸一样透气。",
    heroNote: "雾未散时，先替灵感留一处坐席。",
    footerNote: "今日所见，未必要喧哗；只要有人妥帖收起。",
    palette: {
      shell:
        "linear-gradient(135deg, rgba(248,245,238,0.96), rgba(238,247,241,0.94))",
      badge:
        "border border-[#9fb7aa] bg-white/70 text-[#5b786d] shadow-[0_12px_28px_rgba(121,158,141,0.12)]",
      primaryButton:
        "bg-[#6f8f72] text-white shadow-[0_14px_28px_rgba(111,143,114,0.24)] hover:bg-[#5f7d63]",
      secondaryButton:
        "border border-[#d7ddd6] bg-white/70 text-[#33514a] hover:bg-white",
      chip: "border border-[#d8e5dc] bg-white/72 text-[#557368]",
      glowA: "rgba(111,143,114,0.20)",
      glowB: "rgba(192,72,81,0.10)",
      glowC: "rgba(129,170,191,0.14)",
      frame:
        "linear-gradient(145deg, rgba(252,250,244,0.96), rgba(236,245,239,0.92))"
    }
  },
  {
    id: "moon-paper",
    name: "月绢清辉",
    badge: "月白银灰 · 夜读款",
    heading: "月色落在纸上",
    highlight: "字句也有了回声",
    description:
      "偏静的夜色版本，适合长段落写作、读书摘录与把零散思绪慢慢熬成完整的一页。",
    featureLead: "明月、细影、长呼吸",
    featureBody:
      "在安静的对比和柔软的高光里，保留新中式界面的呼吸感，也保留夜晚阅读的舒适度。",
    heroNote: "灯未眠，句子先在月白里坐定。",
    footerNote: "若心事太亮，不妨交给温柔的夜色来收边。",
    palette: {
      shell:
        "linear-gradient(135deg, rgba(243,244,248,0.96), rgba(235,238,245,0.94))",
      badge:
        "border border-[#c6ccda] bg-white/68 text-[#4f5d7a] shadow-[0_12px_28px_rgba(98,115,155,0.14)]",
      primaryButton:
        "bg-[#4f5d7a] text-white shadow-[0_14px_28px_rgba(79,93,122,0.26)] hover:bg-[#434f68]",
      secondaryButton:
        "border border-[#d8dde7] bg-white/70 text-[#3f4d66] hover:bg-white",
      chip: "border border-[#dbe2ef] bg-white/72 text-[#5b6882]",
      glowA: "rgba(79,93,122,0.22)",
      glowB: "rgba(168,180,212,0.18)",
      glowC: "rgba(192,72,81,0.10)",
      frame:
        "linear-gradient(145deg, rgba(248,249,252,0.98), rgba(232,236,244,0.94))"
    }
  },
  {
    id: "bamboo-shadow",
    name: "竹影松烟",
    badge: "松烟竹露 · 书斋款",
    heading: "竹影入砚",
    highlight: "把日常写成可回望的风景",
    description:
      "颜色更沉稳，留白更克制，像一间晚风经过的书斋，适合做长期积累型的个人内容空间。",
    featureLead: "稳、藏、耐看",
    featureBody:
      "从关注、话题到用户反馈，都被放进更沉静的秩序里，让创作与交流都显得从容。",
    heroNote: "若有一阵风掠过书页，也算为今日落款。",
    footerNote: "把常常想起的事写下，它们会在日后替你发光。",
    palette: {
      shell:
        "linear-gradient(135deg, rgba(241,240,233,0.96), rgba(232,239,235,0.94))",
      badge:
        "border border-[#aab7aa] bg-white/68 text-[#56685a] shadow-[0_12px_28px_rgba(92,117,97,0.14)]",
      primaryButton:
        "bg-[#56685a] text-white shadow-[0_14px_28px_rgba(86,104,90,0.26)] hover:bg-[#49584d]",
      secondaryButton:
        "border border-[#d9ddd5] bg-white/70 text-[#45584a] hover:bg-white",
      chip: "border border-[#d6e0d4] bg-white/72 text-[#5b6f5e]",
      glowA: "rgba(86,104,90,0.22)",
      glowB: "rgba(169,188,170,0.16)",
      glowC: "rgba(36,52,71,0.08)",
      frame:
        "linear-gradient(145deg, rgba(250,248,242,0.98), rgba(233,239,235,0.94))"
    }
  },
  {
    id: "cinnabar-frost",
    name: "朱砂秋练",
    badge: "朱砂霜绢 · 雅致款",
    heading: "一点朱砂",
    highlight: "替每段心绪压下印记",
    description:
      "把品牌原有的朱砂色做得更克制，层次偏暖，既保留东方印记，也更像一册可以分享的私藏手记。",
    featureLead: "有印记，也有分寸",
    featureBody:
      "从夜间模式到反馈回路，所有功能都像被整理进一部柔软却有骨力的纸本中。",
    heroNote: "只需一点红，整页心意就有了归处。",
    footerNote: "愿你今日的只言片语，也能被未来认真翻阅。",
    palette: {
      shell:
        "linear-gradient(135deg, rgba(248,242,239,0.96), rgba(244,239,231,0.94))",
      badge:
        "border border-[#d5b3af] bg-white/70 text-[#8c4f52] shadow-[0_12px_28px_rgba(192,72,81,0.12)]",
      primaryButton:
        "bg-[#b35a62] text-white shadow-[0_14px_28px_rgba(179,90,98,0.24)] hover:bg-[#9f4f58]",
      secondaryButton:
        "border border-[#e4d7cf] bg-white/70 text-[#6a4a46] hover:bg-white",
      chip: "border border-[#ead7d4] bg-white/72 text-[#8f5a59]",
      glowA: "rgba(179,90,98,0.20)",
      glowB: "rgba(129,170,191,0.12)",
      glowC: "rgba(243,212,175,0.18)",
      frame:
        "linear-gradient(145deg, rgba(252,247,244,0.98), rgba(245,238,232,0.94))"
    }
  },
  {
    id: "plum-snow",
    name: "梅雪争春",
    badge: "梅红霜白 · 清冷款",
    heading: "梅雪争春",
    highlight: "让文字也有傲骨",
    description:
      "冷色调中的暖意，像冬日梅枝上的积雪，红白相映，适合细腻的情感书写与诗意的片段记录。",
    featureLead: "清、冷、静、远",
    featureBody:
      "以青灰与梅红为主调，在清冷的视觉里保留一抹温度，像雪中盛开的梅。",
    heroNote: "雪落无声，梅开有意。",
    footerNote: "在最冷的夜里，写最暖的字。",
    palette: {
      shell:
        "linear-gradient(135deg, rgba(248,246,250,0.96), rgba(240,242,247,0.94))",
      badge:
        "border border-[#c4b8cc] bg-white/70 text-[#6b5a7a] shadow-[0_12px_28px_rgba(107,90,122,0.14)]",
      primaryButton:
        "bg-[#8e7a9e] text-white shadow-[0_14px_28px_rgba(142,122,158,0.28)] hover:bg-[#7c6a8c]",
      secondaryButton:
        "border border-[#ddd5e6] bg-white/70 text-[#5a4e6e] hover:bg-white",
      chip: "border border-[#e2d8ee] bg-white/72 text-[#7a6a8e]",
      glowA: "rgba(142,122,158,0.22)",
      glowB: "rgba(210,120,140,0.14)",
      glowC: "rgba(180,200,210,0.16)",
      frame:
        "linear-gradient(145deg, rgba(250,248,252,0.98), rgba(240,244,248,0.94))"
    }
  },
  {
    id: "cloud-cedar",
    name: "云杉晓岚",
    badge: "苍松翠微 · 山林款",
    heading: "松声入座",
    highlight: "把山林的宁静收进一屏",
    description:
      "以苍绿与墨青为主调，像清晨山间的薄雾与古松，适合长线思考、深度写作与静心的知识整理。",
    featureLead: "远、深、沉、透",
    featureBody:
      "让每一次打开都有山间清晨的宁静感，背景的青绿渐变如晨雾在林间流动。",
    heroNote: "松风吹不断，山色入窗来。",
    footerNote: "写下的每一行，都像松针落在纸上。",
    palette: {
      shell:
        "linear-gradient(135deg, rgba(242,247,243,0.96), rgba(234,245,239,0.94))",
      badge:
        "border border-[#a0b8a8] bg-white/70 text-[#4a6658] shadow-[0_12px_28px_rgba(74,102,88,0.12)]",
      primaryButton:
        "bg-[#4a7a62] text-white shadow-[0_14px_28px_rgba(74,122,98,0.26)] hover:bg-[#3e6a54]",
      secondaryButton:
        "border border-[#d0ddd4] bg-white/70 text-[#3a5446] hover:bg-white",
      chip: "border border-[#d4e2d8] bg-white/72 text-[#4a6658]",
      glowA: "rgba(74,122,98,0.20)",
      glowB: "rgba(100,160,130,0.14)",
      glowC: "rgba(180,200,175,0.16)",
      frame:
        "linear-gradient(145deg, rgba(244,248,245,0.98), rgba(234,244,238,0.94))"
    }
  },
  {
    id: "amber-dusk",
    name: "琥珀黄昏",
    badge: "昏黄琥珀 · 暖调款",
    heading: "琥珀藏光",
    highlight: "把傍晚的温柔存进文字",
    description:
      "暖橙与琥珀色调，像黄昏的最后一缕光，适合日记、随笔与情感类的轻声书写。",
    featureLead: "暖、柔、慢、珍",
    featureBody:
      "在昏黄的暖调里，所有文字都像被傍晚的光轻轻包裹，变得柔和而珍贵。",
    heroNote: "日落之后，还有一段琥珀色的时间。",
    footerNote: "黄昏不是结束，是最适合回望的时刻。",
    palette: {
      shell:
        "linear-gradient(135deg, rgba(250,246,238,0.96), rgba(248,244,236,0.94))",
      badge:
        "border border-[#d4c4a0] bg-white/70 text-[#7a6040] shadow-[0_12px_28px_rgba(180,140,80,0.14)]",
      primaryButton:
        "bg-[#c49050] text-white shadow-[0_14px_28px_rgba(196,144,80,0.26)] hover:bg-[#b08040]",
      secondaryButton:
        "border border-[#e4d8c4] bg-white/70 text-[#6a5038] hover:bg-white",
      chip: "border border-[#ece0cc] bg-white/72 text-[#8a7048]",
      glowA: "rgba(196,144,80,0.20)",
      glowB: "rgba(220,160,80,0.12)",
      glowC: "rgba(200,120,80,0.14)",
      frame:
        "linear-gradient(145deg, rgba(252,248,242,0.98), rgba(248,244,236,0.94))"
    }
  }
];

export function getRandomLandingVariant() {
  const index = Math.floor(Math.random() * landingVariants.length);
  return landingVariants[index] ?? landingVariants[0];
}
