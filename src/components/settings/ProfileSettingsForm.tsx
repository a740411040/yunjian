// src/components/settings/ProfileSettingsForm.tsx

"use client";

import {
  Image as ImageIcon,
  Loader2,
  Save,
  Upload,
  X
} from "lucide-react";
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState
} from "react";
import { toast } from "sonner";
import { uploadAvatar } from "@/lib/avatar-upload";
import { useProfile } from "@/hooks/useProfile";
import type { Profile } from "@/types/profile";

type ProfileSettingsFormProps = {
  initialProfile: Profile | null;
};

export function ProfileSettingsForm({
  initialProfile
}: ProfileSettingsFormProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { profile, saving, saveProfile } = useProfile(initialProfile);

  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [communityEnabled, setCommunityEnabled] = useState(true);
  const [allowComments, setAllowComments] = useState(true);
  const [showLikedNotes, setShowLikedNotes] = useState(false);
  const [defaultNoteVisibility, setDefaultNoteVisibility] = useState<
    "private" | "public"
  >("private");

  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    if (!profile) return;

    setUsername(profile.username ?? "");
    setDisplayName(profile.display_name ?? "");
    setAvatarUrl(profile.avatar_url ?? "");
    setBio(profile.bio ?? "");
    setWebsite(profile.website ?? "");
    setLocation(profile.location ?? "");
    setCommunityEnabled(profile.community_enabled ?? true);
    setAllowComments(profile.allow_comments ?? true);
    setShowLikedNotes(profile.show_liked_notes ?? false);
    setDefaultNoteVisibility(
      profile.default_note_visibility === "public" ? "public" : "private"
    );
  }, [profile]);

  async function handleAvatarFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!profile?.id) {
      toast.error("当前用户资料尚未加载完成，请稍后再上传头像。");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    setUploadingAvatar(true);

    try {
      const publicUrl = await uploadAvatar(file, profile.id);

      setAvatarUrl(publicUrl);

      toast.success("头像上传成功，记得保存个人资料。");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "头像上传失败，请稍后重试。";

      toast.error(message);
    } finally {
      setUploadingAvatar(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function handlePickAvatar() {
    if (uploadingAvatar || saving) {
      return;
    }

    fileInputRef.current?.click();
  }

  function handleClearAvatar() {
    setAvatarUrl("");
    toast.message("已清空头像，保存后生效。");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await saveProfile({
      username: username.trim() || null,
      display_name: displayName.trim() || "云笺用户",
      avatar_url: avatarUrl.trim() || null,
      bio: bio.trim() || "这个人还没有留下简介。",
      website: website.trim() || null,
      location: location.trim() || null,
      community_enabled: communityEnabled,
      allow_comments: allowComments,
      show_liked_notes: showLikedNotes,
      default_note_visibility: defaultNoteVisibility
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-6 lg:grid-cols-[1fr_360px]"
    >
      <section className="paper-card p-6 md:p-8">
        <p className="text-sm font-semibold text-cinnabar">社区身份</p>

        <h2 className="font-title mt-2 text-3xl font-black text-ink">
          基础资料
        </h2>

        <div className="mt-8 grid gap-5">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-dai">
              昵称
            </span>

            <input
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder="例如：山月记"
              className="h-12 w-full rounded-2xl border border-border-soft bg-white/70 px-4 text-sm outline-none transition focus:border-cinnabar/50 focus:ring-4 focus:ring-cinnabar/10"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-dai">
              用户名
            </span>

            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="例如：yun_jian_user"
              className="h-12 w-full rounded-2xl border border-border-soft bg-white/70 px-4 text-sm outline-none transition focus:border-cinnabar/50 focus:ring-4 focus:ring-cinnabar/10"
            />

            <p className="mt-2 text-xs leading-relaxed text-dai/50">
              建议只使用英文、数字、下划线。后续可以用于个人主页链接。
            </p>
          </label>

          <div className="rounded-3xl border border-border-soft bg-white/52 p-5">
            <div className="flex flex-col gap-5 md:flex-row md:items-center">
              <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-full border border-cinnabar/20 bg-cinnabar-soft text-3xl font-black text-cinnabar">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarUrl}
                    alt="头像预览"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  displayName?.slice(0, 1) || "云"
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handlePickAvatar}
                    disabled={uploadingAvatar || saving}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-cinnabar px-4 text-sm font-semibold text-white transition hover:bg-cinnabar/90 disabled:cursor-not-allowed disabled:bg-dai/20 disabled:text-dai/40"
                  >
                    {uploadingAvatar ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}

                    {uploadingAvatar ? "上传中..." : "上传头像"}
                  </button>

                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={handleClearAvatar}
                      disabled={uploadingAvatar || saving}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border-soft bg-white/70 px-4 text-sm font-semibold text-dai transition hover:bg-white hover:text-cinnabar disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <X className="h-4 w-4" />
                      清空头像
                    </button>
                  )}
                </div>

                <p className="mt-3 text-xs leading-relaxed text-dai/50">
                  支持 JPG、PNG、WEBP、GIF，图片大小不超过 2MB。上传成功后会自动填入头像链接，但需要点击“保存个人资料”才会正式写入资料。
                </p>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleAvatarFileChange}
              className="hidden"
            />
          </div>

          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-dai">
              <ImageIcon className="h-4 w-4 text-cinnabar" />
              头像 URL
            </span>

            <input
              value={avatarUrl}
              onChange={(event) => setAvatarUrl(event.target.value)}
              placeholder="https://example.com/avatar.png"
              className="h-12 w-full rounded-2xl border border-border-soft bg-white/70 px-4 text-sm outline-none transition focus:border-cinnabar/50 focus:ring-4 focus:ring-cinnabar/10"
            />

            <p className="mt-2 text-xs leading-relaxed text-dai/50">
              可以上传本地头像，也可以手动粘贴图片链接。保存后会同步到公开个人主页和社区作者信息。
            </p>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-dai">
              个人简介
            </span>

            <textarea
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              rows={5}
              placeholder="写一句介绍自己的话。"
              className="w-full rounded-2xl border border-border-soft bg-white/70 px-4 py-3 text-sm leading-loose outline-none transition focus:border-cinnabar/50 focus:ring-4 focus:ring-cinnabar/10"
            />
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-dai">
                网站
              </span>

              <input
                value={website}
                onChange={(event) => setWebsite(event.target.value)}
                placeholder="https://..."
                className="h-12 w-full rounded-2xl border border-border-soft bg-white/70 px-4 text-sm outline-none transition focus:border-cinnabar/50 focus:ring-4 focus:ring-cinnabar/10"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-dai">
                所在地
              </span>

              <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="例如：杭州"
                className="h-12 w-full rounded-2xl border border-border-soft bg-white/70 px-4 text-sm outline-none transition focus:border-cinnabar/50 focus:ring-4 focus:ring-cinnabar/10"
              />
            </label>
          </div>
        </div>
      </section>

      <aside className="space-y-6">
        <section className="paper-card p-6">
          <p className="text-sm font-semibold text-cinnabar">资料预览</p>

          <div className="mt-6 flex items-center gap-4">
            <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-full border border-cinnabar/20 bg-cinnabar-soft text-2xl font-black text-cinnabar">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt="头像预览"
                  className="h-full w-full object-cover"
                />
              ) : (
                displayName?.slice(0, 1) || "云"
              )}
            </div>

            <div className="min-w-0">
              <h3 className="font-title truncate text-2xl font-black text-ink">
                {displayName || "云笺用户"}
              </h3>

              <p className="mt-1 truncate text-sm text-dai/50">
                @{username || "username"}
              </p>
            </div>
          </div>

          <p className="mt-5 text-sm leading-loose text-dai/70">
            {bio || "这个人还没有留下简介。"}
          </p>
        </section>

        <section className="paper-card p-6">
          <p className="text-sm font-semibold text-cinnabar">社区偏好</p>

          <h3 className="font-title mt-2 text-2xl font-black text-ink">
            发布与互动
          </h3>

          <div className="mt-6 space-y-5">
            <label className="flex items-start justify-between gap-4 rounded-2xl border border-border-soft bg-white/52 p-4">
              <div>
                <p className="text-sm font-semibold text-dai">启用社区主页</p>

                <p className="mt-1 text-xs leading-relaxed text-dai/50">
                  关闭后，别人将不能访问你的社区主页。
                </p>
              </div>

              <input
                type="checkbox"
                checked={communityEnabled}
                onChange={(event) => setCommunityEnabled(event.target.checked)}
                className="mt-1 h-5 w-5 accent-cinnabar"
              />
            </label>

            <label className="flex items-start justify-between gap-4 rounded-2xl border border-border-soft bg-white/52 p-4">
              <div>
                <p className="text-sm font-semibold text-dai">允许评论</p>

                <p className="mt-1 text-xs leading-relaxed text-dai/50">
                  默认允许别人评论你的公开笔记。
                </p>
              </div>

              <input
                type="checkbox"
                checked={allowComments}
                onChange={(event) => setAllowComments(event.target.checked)}
                className="mt-1 h-5 w-5 accent-cinnabar"
              />
            </label>

            <label className="flex items-start justify-between gap-4 rounded-2xl border border-border-soft bg-white/52 p-4">
              <div>
                <p className="text-sm font-semibold text-dai">公开喜欢列表</p>

                <p className="mt-1 text-xs leading-relaxed text-dai/50">
                  是否允许别人看到你点赞过的公开笔记。
                </p>
              </div>

              <input
                type="checkbox"
                checked={showLikedNotes}
                onChange={(event) => setShowLikedNotes(event.target.checked)}
                className="mt-1 h-5 w-5 accent-cinnabar"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-dai">
                默认笔记权限
              </span>

              <select
                value={defaultNoteVisibility}
                onChange={(event) =>
                  setDefaultNoteVisibility(
                    event.target.value as "private" | "public"
                  )
                }
                className="h-12 w-full rounded-2xl border border-border-soft bg-white/70 px-4 text-sm outline-none transition focus:border-cinnabar/50 focus:ring-4 focus:ring-cinnabar/10"
              >
                <option value="private">默认私密</option>
                <option value="public">默认公开</option>
              </select>
            </label>
          </div>
        </section>

        <button
          type="submit"
          disabled={saving || uploadingAvatar}
          className="seal-button h-12 w-full gap-2 text-sm font-semibold"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}

          {saving ? "保存中..." : "保存个人资料"}
        </button>
      </aside>
    </form>
  );
}