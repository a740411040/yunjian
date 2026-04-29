export type PoeticCopyKey =
  | "workspace.header"
  | "workspace.sidebar"
  | "workspace.empty"
  | "community.guide"
  | "community.prompt"
  | "community.empty"
  | "profile.empty"
  | "feedback.header"
  | "feedback.empty"
  | "landing.hero"
  | "landing.footer";

const poeticCopyMap: Record<PoeticCopyKey, string[]> = {
  "workspace.header": [
    "今夜与清晨之间，所有未定之事，都可以先落成一页。",
    "写下来的念头，会比匆匆路过的灵感更愿意留下来。",
    "不必句句完整，先让心里那点光有地方停。"
  ],
  "workspace.sidebar": [
    "每日只记一两行也好，字句会替你把散乱的时辰慢慢归拢。",
    "纸上留白，并非空无，而是给后来想起的事预留位置。",
    "先写下，再慢慢懂得自己曾经为什么停在这里。"
  ],
  "workspace.empty": [
    "这一页还安静着，正适合迎接第一缕念头。",
    "有些开端不必盛大，一句真心就足够让纸面醒来。",
    "先落一笔，今天就会因此有了可回望的形状。"
  ],
  "community.guide": [
    "公开的文字不必喧闹，只要真诚，便会有人在相似的夜里读懂。",
    "把一段切身的体会递出去，常常比完整答案更能照亮别人。",
    "社区像一处长廊，你留下的一页，也会成为别人的风景。"
  ],
  "community.prompt": [
    "好内容不一定很长，能留下余味的句子，自会被轻轻记住。",
    "若一段经历仍在发热，不妨把它写成今日的话题。",
    "把真实的观察放进字里行间，文字自然会长出温度。"
  ],
  "community.empty": [
    "这一角话题还未有人落笔，也许正等你先把风声写下来。",
    "有些广场要等第一张纸页铺开，才会真正热闹起来。",
    "空白不是缺席，而是邀请下一位写作者先开口。"
  ],
  "profile.empty": [
    "这一处简介仍留白，像一扇半掩的窗，等主人慢慢补上故事。",
    "有人尚未写自我介绍，但字里行间早已透露出气息。",
    "沉默也有轮廓，只是暂时还没被写成句子。"
  ],
  "feedback.header": [
    "若有哪里还不够妥帖，告诉我们，我们会替它慢慢生长。",
    "每一条建议，都是把这方纸面修得更适宜久留的一笔。",
    "你说出的不便与期待，会成为下一次改进的来处。"
  ],
  "feedback.empty": [
    "还没有递出新的回音，但这里会认真保存每一次发声。",
    "意见箱此刻很安静，正等一句真诚的提醒落下。",
    "再细小的感受也值得被收进案头，成为后续改动的引线。"
  ],
  "landing.hero": [
    "替灵感留白，替情绪落款，替今天留一页能回望的纸。",
    "把散落的心思安放在云端，它们会在合适的时候重新开花。",
    "每次认真落笔，都是在替未来的自己保留一个温柔坐标。"
  ],
  "landing.footer": [
    "你珍视的内容，值得被更安静也更长久地保存。",
    "有些表达不为热闹，只为在日后翻阅时仍旧诚恳。",
    "当一页纸被写满，生活也会因此显出一点纹理。"
  ]
};

function hashValue(input: string) {
  let hash = 0;

  for (let index = 0; index < input.length; index += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash);
}

export function pickPoeticCopy(key: PoeticCopyKey, seed: string) {
  const pool = poeticCopyMap[key];

  if (!pool?.length) {
    return "";
  }

  const index = hashValue(`${key}:${seed}`) % pool.length;
  return pool[index] ?? pool[0];
}

export function getPoeticCopyPool(key: PoeticCopyKey) {
  return poeticCopyMap[key];
}
