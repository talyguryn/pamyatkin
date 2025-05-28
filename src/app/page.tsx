'use client';
import React from 'react';

import { exportToPdf } from '@/utils/export';

import { LeafletData, LeafletSection, LeafletTextfield } from '@/types/leaflet';

const defaultLeafletData: LeafletData = {
  title: { value: 'Инструкция по уходу', placeholder: 'Введите заголовок' },
  petName: { value: 'Имя питомца', placeholder: 'Введите имя питомца' },
  imageSrc: '/cat.png',
  sections: [
    {
      title: {
        value: 'Как сделать дом безопасным',
        placeholder: 'Введите заголовок секции',
      },
      content: {
        value: '',
        placeholder:
          'Убрать провода, закрыть окна, убрать цветы с пола, опасные и мелкие предметы. Это поможет питомцу не пораниться и не отравиться. Не пускайте питомца на диван и кровать, чтобы он не мог оттуда упасть.',
      },
    },
    {
      title: {
        value: 'Как помочь обустроиться в доме',
        placeholder: 'Введите заголовок секции',
      },
      content: {
        value: '',
        placeholder:
          'Лежанка, когтеточка, игрушки, туалет и тихое место для отдыха. Это поможет питомцу адаптироваться к новому дому.',
      },
    },
    {
      title: {
        value: 'Чем кормить питомца',
        placeholder: 'Введите заголовок секции',
      },
      content: {
        value: '',
        placeholder:
          'Вода и сухой корм всегда должны быть в доступе. Первые пару дней он может плохо кушать или даже не кушать совсем. Не пугайтесь, такое бывает в первые дни — он покушает ночью, когда все будут спать. Потом все наладится.',
      },
    },
    {
      title: {
        value: 'Какие прививки делать',
        placeholder: 'Введите заголовок секции',
      },
      content: {
        value: '',
        placeholder:
          'Например, через 3 месяца после первой прививки. Это поможет питомцу защититься от инфекций и болезней. До второй прививки не гуляйте с питомцем на улице, чтобы он не подхватил инфекцию.',
      },
    },
  ],
};

export default function Home() {
  const [leafletData, setLeafletData] =
    React.useState<LeafletData>(defaultLeafletData);

  // function to change the image source by clicking on it and selecting file
  const handleImageClick = (clickEvent: React.MouseEvent<HTMLImageElement>) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png, image/jpeg';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];

      if (!file) return;
      const reader = new FileReader();

      reader.onload = (event) => {
        const img = event.target?.result as string;
        const buttonElement = clickEvent.target as HTMLImageElement;
        const containerElement = buttonElement.closest('.group') as HTMLElement;
        const imageElement = containerElement.querySelector('img');

        if (!imageElement) return;

        imageElement.src = img; // Update the image source

        imageElement.classList.remove('hidden'); // Show the image
        containerElement.querySelector('div')?.classList.add('hidden');
        containerElement.querySelector('div')?.classList.remove('flex');
      };
      reader.readAsDataURL(file);
      input.remove();
    };
    input.click();
  };

  // on paste remove all formatting from the pasted text and paste it as plain text
  React.useEffect(() => {
    document.addEventListener('paste', (event) => {
      event.preventDefault();
      const text = event.clipboardData?.getData('text/plain') ?? '';
      document.execCommand('insertText', false, text);
    });
  }, []);

  // on load focus on the data-focus element
  React.useEffect(() => {
    const focusElement = document.querySelector('[data-focus]');
    if (focusElement) {
      (focusElement as HTMLElement).focus();
      (focusElement as HTMLElement).scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-stone-100">
      {/* leaflet */}
      <div
        className="bg-white mt-20 mb-[470px] pt-[32px] px-[28px] pb-[40px] shadow-2xl shadow-[#3e668861] w-[595px] min-h-[842px] relative"
        id="leaflet"
        style={{
          fontFamily: 'Arial, sans-serif',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          transformOrigin: 'top',
          transform: 'scale(1.5)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 'auto',
            right: '12px',
            bottom: '34px',
            color: '#B4B4B4',
            fontSize: '7px',
            transform: 'translateX(100%) rotate(-90deg) ',
            transformOrigin: 'left',
            whiteSpace: 'nowrap',
            display: 'none',
          }}
          data-show-on-export
        >
          Создано в «Памяткине», pamyatkin.ru
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <div
            style={{
              fontWeight: 'bold',
              fontSize: '32px',
              lineHeight: '1',
              width: '380px',
            }}
            // contentEditable
            // suppressContentEditableWarning
            data-placeholder="Заголовок памятки"
          >
            Инструкция
            <br />
            по уходу
          </div>
          <div
            style={{ width: '125px', height: '125px' }}
            className="flex-shrink-0 group relative hover:cursor-pointer"
            onClick={handleImageClick}
          >
            <img
              className="hidden"
              style={{
                objectFit: 'cover',
                width: '100%',
                height: '100%',
              }}
              src="/cat.png"
              alt="Cat"
            />
            <div className="flex group-hover:flex text-center absolute w-full h-full top-0 items-center justify-center bg-[#ffffffbb] border border-dashed border-[#3e668832] hover:border-[#3e668861] backdrop-blur-xs">
              <span className="text-xs text-[#3e6688]">
                Фотография
                <br />
                питомца
              </span>
            </div>
          </div>
        </div>

        <div
          className=""
          // className="overflow-y-hidden"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '380px',
              gap: '20px',
            }}
          >
            {leafletData.sections.map(
              (section: LeafletSection, index: number) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  <div
                    style={{
                      fontWeight: 'bold',
                      fontSize: '12px',
                      lineHeight: '1',
                    }}
                    contentEditable
                    suppressContentEditableWarning
                    data-placeholder={section.title.placeholder}
                  >
                    {section.title.value}
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      lineHeight: '1.3',
                      marginBottom: '4px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                    }}
                    contentEditable
                    suppressContentEditableWarning
                    data-placeholder={section.content.placeholder}
                    data-focus={index === 0 ? true : undefined}
                  >
                    {section.content.value}
                  </div>
                </div>
              )
            )}

            <div
              style={{
                width: '100%',
                height: '30px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
              className="text-xs text-[#3e6688] hover:bg-[#3e668810] active:bg-[#3e668830] border border-[#3e668832] flex items-center justify-center px-2"
              data-hide-on-export
              onClick={() => {
                setLeafletData((prevData) => ({
                  ...prevData,
                  sections: [
                    ...prevData.sections,
                    {
                      title: {
                        value: '',
                        placeholder: 'Введите заголовок секции',
                      },
                      content: {
                        value: '',
                        placeholder: 'Введите текст секции',
                      },
                    },
                  ],
                }));
              }}
            >
              Добавить раздел
            </div>
          </div>
          <div style={{ width: '125px', flexShrink: 0 }}>
            <div
              style={{ fontSize: '15px', lineHeight: '1' }}
              contentEditable
              suppressContentEditableWarning
              data-placeholder="Имя питомца"
            ></div>
          </div>
        </div>
      </div>

      <div className="text-xs text-center text-gray-500 mt-20 mb-8">
        <a href="https://bureau.ru/school/" target="_blank">
          Сделано в Школе Бюро Горбунова в 2025 году.
        </a>
      </div>

      <div className="fixed bottom-4 right-4 flex flex-col gap-2">
        <button
          className="px-8 py-2 bg-white text-[#3e6688] rounded hover:bg-[#3e668810] active:bg-[#3e668830] cursor-pointer"
          onClick={() => {
            exportToPdf(document.getElementById('leaflet'));
          }}
        >
          Показать PDF
        </button>
        <button
          className="px-8 py-2 bg-[#3e6688] text-white rounded hover:bg-[#31506b] active:bg-[#2b3e4d] cursor-pointer"
          onClick={() => {
            exportToPdf(document.getElementById('leaflet'), true);
          }}
        >
          Скачать PDF
        </button>
      </div>
    </div>
  );
}
