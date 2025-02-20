import JSZip from "jszip";

export function downloadAsFile(content: string, fileName: string) {
  const fileExtension = getExtension(fileName);
  const contentType = contentTypeMap[fileExtension] || defaultContentType;

  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);

  triggerDownload(fileName, url);

  URL.revokeObjectURL(url);
}

export async function downloadAsZip(files: Array<{ content: string; filePath: string }>, zipFileName: string) {
  const zip = new JSZip();

  for (const file of files) {
    const fileExtension = getExtension(file.filePath);
    const contentType = contentTypeMap[fileExtension] || defaultContentType;

    const blob = new Blob([file.content], { type: contentType });
    zip.file(file.filePath, blob);
  }

  const zipBlob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(zipBlob);

  triggerDownload(zipFileName, url);

  URL.revokeObjectURL(url);
}

export function triggerDownload(fileName: string, url: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;

  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
}

export function getExtension(fileName: string) {
  return fileName.split(".").pop()?.toLowerCase() || "";
}

const defaultContentType = "text/plain";

const contentTypeMap: { [extension: string]: string } = {
  js: "application/javascript",
  jsx: "application/javascript",
  ts: "application/typescript",
  tsx: "application/typescript",
  html: "text/html",
  htm: "text/html",
  css: "text/css",
  scss: "text/css",
  json: "application/json",
  xml: "application/xml",
  txt: "text/plain",
  csv: "text/csv",
  md: "text/markdown",
  yaml: "application/x-yaml",
  zip: "application/zip",
};
