import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

/**
 * Export an array of HTMLElements as individual PNG files, one per element.
 * @param elements - array of elements to export
 * @param fileNamePrefix - prefix for downloaded file names (default: 'page')
 */
export async function exportElementsToPngPages(
  elements: HTMLElement[],
  fileNamePrefix: string = 'page',
): Promise<void> {
  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];
    const canvas = await html2canvas(el, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `${fileNamePrefix}-${i + 1}.png`;
    link.href = imgData;
    link.click();
  }
}

/**
 * Export an array of HTMLElements as a multi-page PDF.
 * @param elements - array of elements to export as pages
 * @param fileName - name of the generated PDF file (default: 'document.pdf')
 * @param widthMM - page width in millimeters (default: 210)
 * @param heightMM - page height in millimeters (default: 297)
 */
export async function exportElementsToPdfPages(
  elements: HTMLElement[],
  fileName: string = 'document.pdf',
  widthMM: number = 210,
  heightMM: number = 297,
): Promise<void> {
  const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];
    const canvas = await html2canvas(el, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    if (i > 0) pdf.addPage();
    pdf.addImage(imgData, 'JPEG', 0, 0, widthMM, heightMM);
  }
  pdf.save(fileName);
}