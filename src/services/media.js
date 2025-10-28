const cloudinary = require("../config/cloudinary");
const stream = require("stream");

const DEFAULT_FOLDER = "productos";

/* ============ Uploads ============ */

function uploadBuffer({
  buffer,
  folder = DEFAULT_FOLDER,
  filename,
  format = "jpg",
  publicId,
  eager,
  returnEager,
}) {
  return new Promise((resolve, reject) => {
    const passthrough = new stream.PassThrough();
    const opts = {
      folder,
      format,
      public_id:
        publicId || (filename ? filename.replace(/\.[^.]+$/, "") : undefined),
      resource_type: "image",
      eager,
      eager_async: false,
    };

    const cldStream = cloudinary.uploader.upload_stream(opts, (err, result) => {
      if (err) return reject(err);

      if (
        returnEager &&
        Array.isArray(result?.eager) &&
        result.eager[0]?.secure_url
      ) {
        result.secure_url = result.eager[0].secure_url;
        result.url = result.eager[0].secure_url;
      }

      resolve(result);
    });

    passthrough.end(buffer);
    passthrough.pipe(cldStream);
  });
}

async function uploadManyBuffers(
  files = [],
  { folder = DEFAULT_FOLDER, max = 3, format = "jpg", eager, returnEager } = {}
) {
  const list = Array.isArray(files) ? files.slice(0, max) : [];

  const settled = await Promise.allSettled(
    list.map((f) =>
      uploadBuffer({
        buffer: f.buffer,
        folder,
        filename: f.originalname,
        format,
        eager,
        returnEager,
      })
    )
  );

  return settled.map((r, idx) => ({
    ok: r.status === "fulfilled",
    url: r.status === "fulfilled" ? r.value?.secure_url || null : null,
    error: r.status === "rejected" ? String(r.reason?.message || r.reason) : null,
    originalname: list[idx]?.originalname,
  }));
}

/* ============ Helpers ============ */

function publicIdFromUrl(url = "") {
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/").filter(Boolean);
    const uploadIdx = parts.findIndex((p) => p === "upload");
    if (uploadIdx === -1) return null;

    let tail = parts.slice(uploadIdx + 1);
    if (tail[0] && /[,]/.test(tail[0])) tail = tail.slice(1);
    if (tail[0] && /^v\d+$/i.test(tail[0])) tail = tail.slice(1);
    if (tail.length < 1) return null;

    const filename = tail.pop();
    const folderPath = tail.length ? tail.join("/") : "";
    const nameNoExt = (filename || "").replace(/\.[^.]+$/, "");
    return folderPath ? `${folderPath}/${nameNoExt}` : nameNoExt;
  } catch {
    return null;
  }
}

async function deleteByPublicId(publicId) {
  if (!publicId) return null;
  return cloudinary.uploader.destroy(publicId, { resource_type: "image" });
}

/* ============ Limpieza global de huérfanas ============ */

async function listPublicIdsInFolder(folder = DEFAULT_FOLDER) {
  const all = [];
  let nextCursor;
  do {
    const resp = await cloudinary.api.resources({
      type: "upload",
      prefix: `${folder}/`,
      resource_type: "image",
      max_results: 500,
      next_cursor: nextCursor,
    });
    (resp.resources || []).forEach((r) => all.push(r.public_id));
    nextCursor = resp.next_cursor;
  } while (nextCursor);
  return all;
}

async function cleanGlobalOrphansByUrls({
  folder = DEFAULT_FOLDER,
  referencedUrls = [],
} = {}) {
  try {
    const referencedIds = (Array.isArray(referencedUrls) ? referencedUrls : [])
      .map(publicIdFromUrl)
      .filter(Boolean);
    const refSet = new Set(referencedIds);
    const allInFolder = await listPublicIdsInFolder(folder);
    const toDelete = allInFolder.filter((pid) => !refSet.has(pid));
    if (toDelete.length === 0) return;

    const settled = await Promise.allSettled(
      toDelete.map((pid) => deleteByPublicId(pid))
    );
    settled.forEach((r, i) => {
      if (r.status === "rejected") {
        console.warn(
          "[CLOUDINARY] No se pudo borrar huérfana:",
          toDelete[i],
          r.reason
        );
      }
    });
  } catch (e) {
    console.error("[CLOUDINARY] Limpieza global de huérfanas falló:", e);
  }
}

module.exports = {
  uploadManyBuffers,
  publicIdFromUrl,
  deleteByPublicId,
  cleanGlobalOrphansByUrls,
};
