export const UPLOADS_PAGE_SIZE = 12;
export const UPLOAD_MAX_BYTES = 5 * 1024 * 1024;

export const UPLOAD_ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export const UPLOAD_FIXED_ASPECT_RATIOS = ["1/1", "2/3"];

export const UPLOAD_ASPECT_RATIO_CUSTOM = "custom";

export const UPLOAD_ASPECT_RATIO_OPTIONS = ["1/1", "2/3", UPLOAD_ASPECT_RATIO_CUSTOM];

/** @deprecated Use UPLOAD_FIXED_ASPECT_RATIOS or UPLOAD_ASPECT_RATIO_OPTIONS */
export const UPLOAD_ASPECT_RATIOS = UPLOAD_FIXED_ASPECT_RATIOS;

export const UPLOAD_DEFAULT_ASPECT_RATIO = "1/1";

export const UPLOAD_ASPECT_RATIO_LABELS = {
  "1/1": "Square (1:1)",
  "2/3": "Portrait (2:3)",
  custom: "Custom (keep original)",
};

export const defaultUploads = [];
