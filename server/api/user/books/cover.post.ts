import {
  serverSupabaseClient,
  serverSupabaseServiceRole,
} from "#supabase/server";
import type { H3Event } from "h3";

const BUCKET = "contaai";
const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function getFileExtension(mimeType: string): string {
  const extensions: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };
  return extensions[mimeType] || "jpg";
}

function base64ToUint8Array(base64: string): Uint8Array {
  const binaryStr = atob(base64);
  const bytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }
  return bytes;
}

async function ensureBucket(event: H3Event): Promise<void> {
  const admin = await serverSupabaseServiceRole(event);
  const { data: buckets } = await admin.storage.listBuckets();
  if (buckets?.some((b) => b.name === BUCKET)) return;

  const { error } = await admin.storage.createBucket(BUCKET, {
    public: true,
    allowedMimeTypes: ALLOWED_TYPES,
    fileSizeLimit: MAX_FILE_SIZE,
  });
  if (error) {
    console.error("Error creating bucket:", error);
  }
}

export default defineEventHandler(async (event) => {
  await ensureBucket(event);

  const supabase = await serverSupabaseClient(event);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw createError({ statusCode: 401, message: "Não autenticado" });
  }

  const body = await readBody(event);

  if (!body.bookId) {
    throw createError({ statusCode: 400, message: "bookId é obrigatório" });
  }

  if (!body.file) {
    throw createError({ statusCode: 400, message: "Arquivo é obrigatório" });
  }

  const file = body.file as { data: string; type: string; name?: string };

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw createError({
      statusCode: 400,
      message: "Tipo não permitido. Use JPG, PNG ou WebP.",
    });
  }

  const bytes = base64ToUint8Array(file.data);

  if (bytes.length > MAX_FILE_SIZE) {
    throw createError({
      statusCode: 400,
      message: "Arquivo muito grande. Máximo 2MB.",
    });
  }

  const ext = getFileExtension(file.type);
  const filePath = `covers/${user.id}/${body.bookId}/cover.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, bytes, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    console.error("Upload error:", uploadError);
    throw createError({
      statusCode: 500,
      message: `Erro ao fazer upload da imagem: ${uploadError.message || JSON.stringify(uploadError)}`,
    });
  }

  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(filePath);

  if (body.save !== false) {
    await supabase
      .from("user_books")
      .update({ cover_url: urlData.publicUrl } as never)
      .eq("id", body.bookId)
      .eq("user_id", user.id);
  }

  return { url: urlData.publicUrl };
});
