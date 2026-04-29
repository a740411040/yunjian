"use client";

import { Loader2, Send, Sparkles } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { PoeticCopy } from "@/components/common/PoeticCopy";
import { getMyFeedbackList, submitFeedback } from "@/lib/feedback";
import type {
  FeedbackCategory,
  FeedbackStatus,
  UserFeedback
} from "@/types/feedback";

const categoryOptions: Array<{
  value: FeedbackCategory;
  label: string;
  hint: string;
}> = [
  {
    value: "bug",
    label: "问题反馈",
    hint: "页面报错、交互异常、数据不对等。"
  },
  {
    value: "idea",
    label: "功能建议",
    hint: "新的工作流、创作方式或效率优化。"
  },
  {
    value: "theme",
    label: "主题与视觉",
    hint: "夜间模式、配色、版式与文案感受。"
  },
  {
    value: "community",
    label: "社区体验",
    hint: "关注、话题、互动、反馈流程相关。"
  },
  {
    value: "other",
    label: "其他",
    hint: "暂时不便归类的想法与提醒。"
  }
];

const statusLabelMap: Record<FeedbackStatus, string> = {
  pending: "待查看",
  reviewing: "评估中",
  planned: "已纳入计划",
  resolved: "已处理"
};

export function FeedbackPageClient() {
  const [items, setItems] = useState<UserFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [category, setCategory] = useState<FeedbackCategory>("idea");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [contact, setContact] = useState("");

  async function refresh() {
    setLoading(true);

    try {
      const nextItems = await getMyFeedbackList();
      setItems(nextItems);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "加载反馈列表失败，请稍后重试。";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("请先补全标题和内容。");
      return;
    }

    setSubmitting(true);

    try {
      const created = await submitFeedback({
        category,
        title,
        content,
        contact
      });

      setItems((current) => [created, ...current]);
      setTitle("");
      setContent("");
      setContact("");
      setCategory("idea");
      toast.success("反馈已递交，我们会认真查看。");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "提交反馈失败，请稍后重试。";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
      <section className="paper-card p-6 md:p-8">
        <p className="text-sm font-semibold text-cinnabar">产品回音</p>
        <h2 className="font-title mt-2 text-3xl font-black text-ink">
          把不便、想法与细微感受都交给这里
        </h2>
        <PoeticCopy
          copyKey="feedback.header"
          className="mt-4 max-w-2xl text-sm leading-loose text-dai/70"
        />

        <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
          <div className="grid gap-3 md:grid-cols-2">
            {categoryOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setCategory(option.value)}
                className={`rounded-3xl border p-4 text-left transition ${
                  category === option.value
                    ? "border-cinnabar/24 bg-cinnabar-soft"
                    : "border-border-soft bg-white/52 hover:bg-white/70"
                }`}
              >
                <p className="text-sm font-semibold text-ink">{option.label}</p>
                <p className="mt-2 text-xs leading-loose text-dai/55">
                  {option.hint}
                </p>
              </button>
            ))}
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-dai">
              反馈标题
            </span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="例如：社区关注流里想增加只看互相关注"
              className="surface-input h-12 w-full rounded-2xl px-4 text-sm text-dai outline-none transition focus:border-cinnabar/50 focus:ring-4 focus:ring-cinnabar/10"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-dai">
              详细内容
            </span>
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={7}
              placeholder="可以描述问题出现的位置、你预期的体验，或者你希望它未来长成什么样。"
              className="surface-input w-full rounded-2xl px-4 py-3 text-sm leading-loose text-dai outline-none transition focus:border-cinnabar/50 focus:ring-4 focus:ring-cinnabar/10"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-dai">
              联系方式
              <span className="ml-2 font-normal text-dai/45">可选</span>
            </span>
            <input
              value={contact}
              onChange={(event) => setContact(event.target.value)}
              placeholder="邮箱、微信或你希望我们联系你的方式"
              className="surface-input h-12 w-full rounded-2xl px-4 text-sm text-dai outline-none transition focus:border-cinnabar/50 focus:ring-4 focus:ring-cinnabar/10"
            />
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="seal-button h-12 gap-2 text-sm font-semibold"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {submitting ? "递送中..." : "递交反馈"}
          </button>
        </form>
      </section>

      <aside className="space-y-6">
        <section className="paper-card p-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-cinnabar" />
            <h3 className="font-title text-2xl font-black text-ink">
              最近回音
            </h3>
          </div>

          {loading ? (
            <div className="mt-5 space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-28 animate-pulse rounded-3xl border border-border-soft bg-white/52"
                />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="mt-5 rounded-3xl border border-dashed border-border-soft bg-white/46 px-5 py-8">
              <PoeticCopy
                copyKey="feedback.empty"
                className="text-sm leading-loose text-dai/60"
              />
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="rounded-3xl border border-border-soft bg-white/52 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-cinnabar-soft px-3 py-1 text-xs font-semibold text-cinnabar">
                      {
                        categoryOptions.find(
                          (option) => option.value === item.category
                        )?.label
                      }
                    </span>
                    <span className="text-xs text-dai/45">
                      {statusLabelMap[item.status]}
                    </span>
                  </div>

                  <h4 className="mt-3 text-base font-semibold text-ink">
                    {item.title}
                  </h4>
                  <p className="mt-2 text-sm leading-loose text-dai/62">
                    {item.content}
                  </p>
                  <p className="mt-3 text-xs text-dai/42">
                    {new Date(item.created_at).toLocaleString("zh-CN")}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="paper-card p-6">
          <p className="text-sm font-semibold text-cinnabar">
            我们会如何使用这些反馈
          </p>
          <ul className="mt-4 space-y-3 text-sm leading-loose text-dai/64">
            <li>会优先汇总高频问题，尤其是影响写作、发布与浏览的阻碍。</li>
            <li>视觉与文案建议会纳入后续主题和首页样式的迭代。</li>
            <li>如果你留下联系方式，后续需要补充信息时可以更快回访。</li>
          </ul>
        </section>
      </aside>
    </div>
  );
}
