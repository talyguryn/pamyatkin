const { jsPDF } = await import('jspdf');
const html2canvas = (await import('html2canvas-pro')).default;

const SCALE = 2; // Scale factor for high DPI rendering

export async function exportToPdf(
  element: HTMLElement | null,
  download = false,
  fileName = 'Памятка (pamyatkin.ru)'
) {
  if (!element) {
    alert('Leaflet element not found!');
    return;
  }

  const canvas = await html2canvas(element, {
    scale: SCALE,
    useCORS: true,
    onclone: (clonedDoc) => {
      // Ensure the cloned document has the same styles as the original
      // const styleSheets = document.styleSheets;
      // for (let i = 0; i < styleSheets.length; i++) {
      //   const styleSheet = styleSheets[i];
      //   if (styleSheet.cssRules) {
      //     for (let j = 0; j < styleSheet.cssRules.length; j++) {
      //       const rule = styleSheet.cssRules[j];
      //       if (rule instanceof CSSStyleRule) {
      //         clonedDoc.styleSheets[0].insertRule(
      //           rule.cssText,
      //           clonedDoc.styleSheets[0].cssRules.length
      //         );
      //       }
      //     }
      //   }
      // }

      // Hide elements with data-hide-on-export attribute
      const elements = clonedDoc.querySelectorAll('[data-hide-on-export]');
      elements.forEach((el) => {
        (el as HTMLElement).style.display = 'none';
      });

      // Show elements with data-show-on-export attribute
      const showElements = clonedDoc.querySelectorAll('[data-show-on-export]');
      showElements.forEach((el) => {
        (el as HTMLElement).style.display = 'block';
      });

      // remove border and paddings from all contenteditable elements
      const contentEditableElements =
        clonedDoc.querySelectorAll('[contenteditable]');
      contentEditableElements.forEach((el) => {
        (el as HTMLElement).style.border = 'none';
        (el as HTMLElement).style.padding = '0';
        (el as HTMLElement).style.minHeight = '0';
      });
    },
  });

  const pagePaddings = {
    top: 32 * SCALE,
    left: 28 * SCALE,
    right: 28 * SCALE,
    bottom: 40 * SCALE,
  };

  // const pageWidth = canvas.width;
  // const pageHeight = canvas.width / (595 / 842); // A4 aspect ratio

  const pageWidth = canvas.width + pagePaddings.left + pagePaddings.right;
  const pageHeight = pageWidth / (595 / 842); // A4 aspect ratio

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    // format: [595 * SCALE, 842 * SCALE], // A4 size in pixels at 72 DPI
    format: [pageWidth, pageHeight],
    compress: true,
  });

  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const totalPages = Math.ceil(imgHeight / pageHeight);

  // console.log(`Total pages: ${totalPages}`);
  // console.log(`Image dimensions: ${imgWidth}x${imgHeight}`);
  // console.log(`Page dimensions: ${pageWidth}x${pageHeight}`);

  let cutLineY = 0;

  let currentPage = 0;
  while (currentPage < totalPages) {
    const pageCanvas = document.createElement('canvas');
    pageCanvas.width = pageWidth;
    pageCanvas.height = pageHeight;
    const ctx = pageCanvas.getContext('2d');
    if (!ctx) {
      console.error('Failed to get canvas context');
      return;
    }

    const sourceY = cutLineY;

    let drawHeight = Math.min(
      pageHeight - pagePaddings.top - pagePaddings.bottom,
      imgHeight - sourceY
    );

    console.log(
      `page ${currentPage}, predicted cut line`,
      drawHeight + sourceY
    );

    // function to calculate the cut line position. if last line of the calculated image has not white pixels, then we need to go up for 1px and check again while we find last line with only white pixels
    const isLineWhite = (y: number): boolean => {
      // Use the source canvas, not the page canvas
      const imageData = canvas
        .getContext('2d')!
        .getImageData(0, y, imgWidth, 1).data;

      console.log(`imageData`, imageData);

      for (let i = 0; i < imageData.length; i += 4) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];
        const a = imageData[i + 3];
        if (a !== 0 && (r < 255 || g < 255 || b < 255)) {
          console.log(
            `Non-white pixel found at (${i / 4}, ${y}): rgba(${r}, ${g}, ${b}, ${a})`
          );
          return false;
        }
      }
      return true;
    };

    const findCutLine = (y: number): number => {
      let line = y;
      while (line > 0 && !isLineWhite(line) && line >= cutLineY) {
        line--;
      }
      return line;
    };

    // Calculate draw height with checkCutLine
    cutLineY = findCutLine(drawHeight + sourceY);

    console.log(`page ${currentPage}, calculated cut line`, cutLineY);

    // recalculate drawHeight based on cutLineY
    drawHeight = cutLineY - sourceY;

    //

    // cutLineY += drawHeight;

    // Draw the image on the canvas with padding
    ctx.fillStyle = '#ffffff'; // Set background color
    ctx.fillRect(0, 0, pageWidth, pageHeight); // Fill the background
    ctx.drawImage(
      canvas,
      0,
      sourceY,
      imgWidth,
      drawHeight,
      pagePaddings.left,
      pagePaddings.top,
      imgWidth,
      drawHeight
    );

    // Convert the canvas to an image and add it to the PDF
    const pageImgData = pageCanvas.toDataURL('image/png');
    if (currentPage > 0) {
      pdf.addPage();
    }
    pdf.addImage(pageImgData, 'PNG', 0, 0, pageWidth, pageHeight);
    currentPage++;
  }

  if (download) {
    pdf.save(fileName + '.pdf');
  } else {
    const pdfBlob = pdf.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const pdfWindow = window.open(pdfUrl, '_blank');

    if (pdfWindow) {
      pdfWindow.focus();
    }
  }
}
