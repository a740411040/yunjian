"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  getCurrentProfileClient,
  updateCurrentProfile
} from "@/lib/profiles";
import type { Profile, ProfilePayload } from "@/types/profile";

export function useProfile(initialProfile?: Profile | null) {
  const [profile, setProfile] = useState<Profile | null>(
    initialProfile ?? null
  );
  const [loading, setLoading] = useState(!initialProfile);
  const [saving, setSaving] = useState(false);

  async function refresh() {
    setLoading(true);

    try {
      const data = await getCurrentProfileClient();
      setProfile(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "加载个人资料失败。";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function saveProfile(payload: ProfilePayload) {
    setSaving(true);

    try {
      const updated = await updateCurrentProfile(payload);
      setProfile(updated);
      toast.success("个人资料已保存。");
      return updated;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "保存失败，请稍后重试。";
      toast.error(message);
      throw error;
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    if (!initialProfile) {
      refresh();
    }
  }, [initialProfile]);

  return {
    profile,
    loading,
    saving,
    refresh,
    saveProfile
  };
}