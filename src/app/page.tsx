'use client'

import { useState } from 'react';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

import { useToPng } from '@hugocxl/react-to-image'

const PAGE_WIDTH_MM = 210;
const PAGE_HEIGHT_MM = 297;

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [pageImages, setPageImages] = useState<string[]>([]);

  const [_, convert, ref] = useToPng<HTMLDivElement>({
    quality: 1,
    onSuccess: data => {
      const link = document.createElement('a');
      link.download = 'my-image-name.png';
      link.href = data;
      link.click();
    }
  })

  const handleImageClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event) => handleImageChange(event as unknown as React.ChangeEvent<HTMLInputElement>);
    input.click();
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  // const handleExport = async () => {
  //   const pageElement = document.querySelector('#leaflet');
  //   if (!pageElement) return;

  //   const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
  //   const canvas = await html2canvas(pageElement as HTMLElement, { scale: 2, useCORS: true });
  //   const style = window.getComputedStyle(pageElement);
  //   const fontFamily = style.fontFamily;
  //   const fontSize = style.fontSize;
  //   const fontWeight = style.fontWeight;

  //   // Ensure fonts are embedded correctly
  //   const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
  //   pdf.setFont(fontFamily, fontWeight);
  //   pdf.setFontSize(parseFloat(fontSize));
  //   const imgData = canvas.toDataURL('image/jpeg', 1.0);
  //   pdf.addImage(imgData, 'JPEG', 0, 0, PAGE_WIDTH_MM, PAGE_HEIGHT_MM);
  //   pdf.save('leaflet.pdf');
  // };

  return <>
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gray-100">

      <div className="w-[210mm] h-[297mm] bg-white shadow-lg my-20 px-8 pt-12 pb-16" id="leaflet" ref={ref}>

        {/* Hero image */}
        <div className={`w-full h-[480px] bg-gray-200 mt-4 mb-4 flex items-center justify-center cursor-pointer group rounded overflow-hidden`} onClick={handleImageClick}>
          <div className="w-full h-full flex items-center justify-center" style={{ backgroundImage: image ? `url(${image})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <span className={`text-gray-600 bg-gray-200 group-hover:bg-gray-300 w-full h-full  flex items-center justify-center transition-opacity duration-150 ${!image ? 'opacity-100' : 'opacity-0 group-hover:opacity-80'}`} onClick={handleImageClick}>
              {`Нажмите, чтобы ${!image ? 'добавить' : 'заменить'} фотографию питомца`}
            </span>
          </div>
        </div>

        <h1 className="text-5xl font-bold pt-4" data-placeholder="Имя питомца" contentEditable></h1>

        <div className="text-xl py-2" data-placeholder="Описание" contentEditable></div>

        <h2 className="text-3xl font-bold pt-4" data-placeholder="Первый день дома" contentEditable></h2>
        <div className="text-xl py-2" data-placeholder="Рекомндации по подготовке дома к появлению животного" contentEditable></div>

        <h2 className="text-3xl font-bold pt-4" data-placeholder="Питание" contentEditable></h2>
        <div className="text-xl py-2" data-placeholder="Чем, сколько и как часто кормить. Что вредно для животного." contentEditable></div>

        <h2 className="text-3xl font-bold pt-4" data-placeholder="Прививки" contentEditable></h2>
        <div className="text-xl py-2" data-placeholder="Когда и какие прививки делать. Когда делать повторные прививки." contentEditable></div>

        <h2 className="text-3xl font-bold pt-4" data-placeholder="Гигиена" contentEditable></h2>
        <div className="text-xl py-2" data-placeholder="Как часто и чем мыть. Как часто и чем чистить уши. Как часто и чем стричь когти." contentEditable></div>

      </div>



      {/* <button className="fixed bottom-10 right-10 mt-10 px-12 py-2 bg-[#3395F7] text-white rounded cursor-pointer hover:bg-[#3378f7] active:bg-[#3357f7]" style={{ letterSpacing: '0.01em' }} onClick={() => handleExport()}>Скачать ПДФ</button> */}
      <button className="fixed bottom-4 right-4 px-8 py-2 bg-[#3395F7] text-white rounded cursor-pointer hover:bg-[#3378f7] active:bg-[#3357f7]" style={{ letterSpacing: '0.01em' }} onClick={() => convert()}>Скачать ПНГ</button>
    </div>
  </>
}
