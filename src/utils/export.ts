const { jsPDF } = await import('jspdf');
const html2canvas = (await import('html2canvas-pro')).default;

export async function exportToPdf(
  element: HTMLElement | null,
  download = false
) {
  if (!element) {
    alert('Leaflet element not found!');
    return;
  }

  const canvas = await html2canvas(element, {
    scale: 4,
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

      // Hide elements with data-hideOnExport attribute
      const elements = clonedDoc.querySelectorAll('[data-hideOnExport]');
      elements.forEach((el) => {
        (el as HTMLElement).style.display = 'none';
      });
    },
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: [595, 842], // A4 size in pixels at 72 DPI
  });

  pdf.addImage(imgData, 'PNG', 0, 0, 595, 842);

  if (download) {
    pdf.save('Памятка.pdf');
  } else {
    const pdfBlob = pdf.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const pdfWindow = window.open(pdfUrl, '_blank');
    if (pdfWindow) {
      pdfWindow.focus();
      // } else {
      //   alert('Пожалуйста, разрешите всплывающие окна для этого сайта.');
    }
  }
}
