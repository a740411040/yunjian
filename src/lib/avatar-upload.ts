// src/lib/avatar-upload.ts

import { createClient } from "@/lib/supabase/browser";

const AVATAR_BUCKET = "avatars";
const MAX_AVATAR_SIZE = 2 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif"
];

function getFileExtension(file: File) {
  const nameParts = file.name.split(".");
  const rawExtension = nameParts.length > 1 ? nameParts.pop() : "";
  const extension = rawExtension?.toLowerCase();

  if (extension) {
    if (extension === "jpeg") {
      return "jpg";
    }

    return extension;
  }

  if (file.type === "image/jpeg") {
    return "jpg";
  }

  if (file.type === "image/png") {
    return "png";
  }

  if (file.type === "image/webp") {
    return "webp";
  }

  if (file.type === "image/gif") {
    return "gif";
  }

  return "jpg";
}

function validateAvatarFile(file: File) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("头像文件格式不支持，请上传 JPG、PNG、WEBP 或 GIF 图片。");
  }

  if (file.size > MAX_AVATAR_SIZE) {
    throw new Error("头像图片不能超过 2MB。");
  }
}

export async function uploadAvatar(file: File, userId: string) {
  validateAvatarFile(file);

  const supabase = createClient();

  const extension = getFileExtension(file);
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 8);
  const filePath = `${userId}/avatar-${timestamp}-${random}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
      contentType: file.type
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage
    .from(AVATAR_BUCKET)
    .getPublicUrl(filePath);

  if (!data.publicUrl) {
    throw new Error("头像上传成功，但未能获取公开链接。");
  }

  return data.publicUrl;
}