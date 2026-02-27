const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const DEFAULT_FOLDER = "eduarda-porto";

function ensureCloudinaryConfig() {
  if (!CLOUDINARY_CLOUD_NAME) {
    throw new Error("Cloudinary cloud name not configured (VITE_CLOUDINARY_CLOUD_NAME).");
  }

  if (!CLOUDINARY_UPLOAD_PRESET) {
    throw new Error("Cloudinary upload preset not configured (VITE_CLOUDINARY_UPLOAD_PRESET).");
  }
}

async function uploadToCloudinary(
  file: File,
  resourceType: "image" | "raw",
  folder = DEFAULT_FOLDER,
): Promise<{ secureUrl: string; publicId: string }> {
  ensureCloudinaryConfig();

  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  formData.append("folder", folder || DEFAULT_FOLDER);

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });
  } catch {
    throw new Error("Network error while uploading to Cloudinary.");
  }

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      payload?.error?.message ||
      "Cloudinary upload failed. Check upload preset permissions and file type.";
    throw new Error(message);
  }

  if (!payload?.secure_url || !payload?.public_id) {
    throw new Error("Cloudinary upload succeeded but returned an invalid payload.");
  }

  return { secureUrl: payload.secure_url, publicId: payload.public_id };
}

export async function uploadImageToCloudinary(
  file: File,
  folder = DEFAULT_FOLDER,
): Promise<{ url: string; publicId: string }> {
  const { secureUrl, publicId } = await uploadToCloudinary(file, "image", folder);
  return { url: secureUrl, publicId };
}

export async function uploadFileToCloudinary(
  file: File,
  folder = DEFAULT_FOLDER,
): Promise<{ url: string; publicId: string }> {
  const { secureUrl, publicId } = await uploadToCloudinary(file, "raw", folder);
  return { url: secureUrl, publicId };
}
