import { createWorker } from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';

// Set PDF.js worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export async function extractTextFromFile(file: File): Promise<string> {
  if (file.type.startsWith('image/')) {
    // Handle image files directly with Tesseract.js
    const worker = await createWorker();
    const { data: { text } } = await worker.recognize(file);
    await worker.terminate();
    return text;
  } else if (file.type === 'application/pdf') {
    // Handle PDF files by rendering pages to canvas and OCRing each
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better OCR accuracy
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({ canvasContext: context, viewport, canvas }).promise;

      const worker = await createWorker();
      const { data: { text } } = await worker.recognize(canvas);
      await worker.terminate();

      fullText += text + '\n';
    }

    return fullText.trim();
  } else {
    throw new Error('Unsupported file type. Only images and PDFs are supported.');
  }
}
