const cloudinary = require("../config/cloudinary");
const stream = require("stream");

const DEFAULT_FOLDER = "productos";

/* ===========================================================
   UPLOAD BUFFER (1 sola foto)
   =========================================================== */
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
    try {
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

      const uploadStream = cloudinary.uploader.upload_stream(
        opts,
        (err, result) => {
          if (err) return reject(err);

          // Si pidió devolución del eager
          if (
            returnEager &&
            Array.isArray(result?.eager) &&
            result.eager[0]?.secure_url
          ) {
            result.secure_url = result.eager[0].secure_url;
            result.url = result.eager[0].secure_url;
          }

          resolve(result);
        }
      );

      passthrough.end(buffer);
      passthrough.pipe(uploadStream);
    } catch (e) {
      reject(e);
    }
  });
}

/* ===========================================================
   UPLOAD MANY (máx 3 fotos)
   =========================================================== */
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
    error:
      r.status === "rejected" ? String(r.reason?.message || r.reason) : null,
    originalname: list[idx]?.originalname,
  }));
}

/* ===========================================================
   HELPERS
   =========================================================== */
function publicIdFromUrl(url = "") {
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/").filter(Boolean);

    const uploadIdx = parts.findIndex((p) => p === "upload");
    if (uploadIdx === -1) return null;

    let tail = parts.slice(uploadIdx + 1);

    if (tail[0]?.includes(",")) tail = tail.slice(1);
    if (/^v\d+$/i.test(tail[0])) tail = tail.slice(1);

    const filename = tail.pop();
    const folderPath = tail.join("/");
    const nameNoExt = filename.replace(/\.[^.]+$/, "");

    return folderPath ? `${folderPath}/${nameNoExt}` : nameNoExt;
  } catch {
    return null;
  }
}

async function deleteByPublicId(publicId) {
  if (!publicId) return null;
  return cloudinary.uploader.destroy(publicId, { resource_type: "image" });
}

/* ===========================================================
   LIMPIEZA DE HUÉRFANAS
   =========================================================== */
async function listPublicIdsInFolder(folder = DEFAULT_FOLDER) {
  const all = [];
  let nextCursor;

  do {
    const res = await cloudinary.api.resources({
      type: "upload",
      prefix: `${folder}/`,
      resource_type: "image",
      max_results: 500,
      next_cursor: nextCursor,
    });

    res.resources?.forEach((r) => all.push(r.public_id));
    nextCursor = res.next_cursor;
  } while (nextCursor);

  return all;
}

async function cleanGlobalOrphansByUrls({
  folder = DEFAULT_FOLDER,
  referencedUrls = [],
} = {}) {
  try {
    const referencedIds = referencedUrls.map(publicIdFromUrl).filter(Boolean);

    const refSet = new Set(referencedIds);

    const allInFolder = await listPublicIdsInFolder(folder);

    const toDelete = allInFolder.filter((pid) => !refSet.has(pid));
    if (toDelete.length === 0) return;

    await Promise.allSettled(toDelete.map((pid) => deleteByPublicId(pid)));
  } catch (e) {
    console.error(`[CLOUDINARY] Error limpiando huérfanas (${folder}):`, e);
  }
}

module.exports = {
  uploadBuffer,
  uploadManyBuffers,
  publicIdFromUrl,
  deleteByPublicId,
  cleanGlobalOrphansByUrls,
};
