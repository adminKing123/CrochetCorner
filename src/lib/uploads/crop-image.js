function parseAspectRatio(value) {
  const [width, height] = String(value).split("/").map(Number);

  if (!width || !height) {
    return null;
  }

  return width / height;
}

function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read the selected image."));
    };

    image.src = url;
  });
}

function getOutputMimeType(file) {
  if (file.type === "image/png") {
    return "image/png";
  }

  if (file.type === "image/webp") {
    return "image/webp";
  }

  return "image/jpeg";
}

function getOutputExtension(mimeType) {
  if (mimeType === "image/png") {
    return ".png";
  }

  if (mimeType === "image/webp") {
    return ".webp";
  }

  return ".jpg";
}

function canvasToBlob(canvas, mimeType) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to process the image."));
          return;
        }

        resolve(blob);
      },
      mimeType,
      mimeType === "image/jpeg" ? 0.92 : undefined
    );
  });
}

function computeCenterCrop(sourceWidth, sourceHeight, targetRatio) {
  const sourceRatio = sourceWidth / sourceHeight;

  let cropWidth;
  let cropHeight;

  if (sourceRatio > targetRatio) {
    cropHeight = sourceHeight;
    cropWidth = sourceHeight * targetRatio;
  } else {
    cropWidth = sourceWidth;
    cropHeight = sourceWidth / targetRatio;
  }

  return {
    cropX: (sourceWidth - cropWidth) / 2,
    cropY: (sourceHeight - cropHeight) / 2,
    cropWidth,
    cropHeight,
  };
}

function needsCrop(sourceWidth, sourceHeight, targetRatio) {
  const sourceRatio = sourceWidth / sourceHeight;
  const { cropX, cropY } = computeCenterCrop(sourceWidth, sourceHeight, targetRatio);

  return Math.abs(sourceRatio - targetRatio) > 0.005 || cropX > 0.5 || cropY > 0.5;
}

export async function cropImageToAspectRatio(file, aspectRatio) {
  const targetRatio = parseAspectRatio(aspectRatio);

  if (!targetRatio) {
    throw new Error("Invalid aspect ratio.");
  }

  const image = await loadImageFromFile(file);
  const { naturalWidth, naturalHeight } = image;

  if (!needsCrop(naturalWidth, naturalHeight, targetRatio)) {
    return file;
  }

  const { cropX, cropY, cropWidth, cropHeight } = computeCenterCrop(
    naturalWidth,
    naturalHeight,
    targetRatio
  );

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(cropWidth);
  canvas.height = Math.round(cropHeight);

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Could not process the image.");
  }

  context.drawImage(
    image,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    0,
    0,
    canvas.width,
    canvas.height
  );

  const outputType = getOutputMimeType(file);
  const blob = await canvasToBlob(canvas, outputType);
  const baseName = file.name.replace(/\.[^.]+$/, "") || "image";

  return new File([blob], `${baseName}${getOutputExtension(outputType)}`, {
    type: outputType,
  });
}
