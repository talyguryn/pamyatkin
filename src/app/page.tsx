'use client';
import React from 'react';

import { exportToPdf } from '@/utils/export';

export default function Home() {
  // on paste remove all formatting from the pasted text and paste it as plain text
  React.useEffect(() => {
    document.addEventListener('paste', (event) => {
      event.preventDefault();
      const text = event.clipboardData?.getData('text/plain') ?? '';
      document.execCommand('insertText', false, text);
    });
  }, []);

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

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-stone-100 mb-20">
      {/* leaflet */}
      <div
        className="bg-white mt-20 mb-[470px] pt-[32px] px-[28px] pb-[40px] shadow-2xl shadow-[#3e668861] w-[595px] h-[842px] relative"
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
            contentEditable
            suppressContentEditableWarning
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
          className="overflow-y-hidden"
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
            <div
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
              >
                Помогите обустроиться
              </div>
              <div
                style={{
                  fontSize: '11px',
                  lineHeight: '1.3',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
                contentEditable
                suppressContentEditableWarning
              >
                <div>
                  Первые 2–3 дня нужно ограничить пространство одной комнатой.
                  В свободном доступе у котёнка в этой комнате должны быть миски
                  с водой, едой и лоток. Это делается для того, чтобы котёнок
                  не растерялся в новом месте. Для него все будет новым: место,
                  люди, запахи, лоток. Поэтому очень важно, чтобы все было
                  в зоне его досягаемости. Когда увидите, что он чётко ходит
                  в лоток, признал его своим — можете переставить лоток в другое
                  место. Но обязательно покажите его котёнку,
                  чтобы он не потерял лоток. Посадите котёнка в лоток,
                  чтобы он сам вышел из него.
                </div>
                <div>
                  Первые пару дней он может плохо кушать или даже не кушать
                  совсем. Не пугайтесь, такое бывает в первые дни — он покушает
                  ночью, когда все будут спать. Потом все наладится. Можете
                  предложить котёнку влажный корм для аппетита.
                </div>
              </div>
            </div>
            <div
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
              >
                Подберите правильный корм
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
              >
                <div>
                  Свежая питьевая вода и сухой корм всегда должны быть в доступе
                  для питомца. Влажный корм для котят до года или премиум класса
                  можно давать один раз в день.
                </div>
                <div>
                  В качестве сухого корма используйте «Proplan для котят»,
                  а из влажных подойдут «Royal Canin Kitten Instinctive
                  для котят» и паштет «Royal Canin Babycat Instinctive».
                </div>
                <div>
                  Дополнительно питомцу можно давать: вареное постное мясо
                  или сырое, промороженное не менее суток в морозилке.
                  Также можно предлагать творог, йогурт без добавок,
                  сметану, сыр. Варёное куриное или перепелиное яйцо
                  1 раз в неделю.
                </div>
                <div>
                  Котёнку нельзя давать сладкое, солёное, маринованное, копчёное
                  и острое.
                </div>
              </div>
            </div>

            <div
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
              >
                Оставляйте корм в свободном доступе
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
              >
                <div>
                  Сухой корм у котят всегда должен быть в свободном доступе.
                  Это делается для того, чтобы котёнок не переедал.
                </div>
                <div>
                  Если его кормить по часам, то он будет стараться съесть
                  как можно больше, думая что в следующий раз не покормят.
                  Если после этого котёнок попьёт водички, то съеденный
                  в большом объёме корм разбухнет в желудке у котёнка,
                  и он начнёт его срыгивать.
                </div>
                <div>
                  Поэтому миску с кормом лучше держать в свободном доступе.
                  Так он научится есть столько, сколько ему нужно: будет много
                  раз за день подходить к миске и кушать по чуть-чуть.
                </div>
              </div>
            </div>

            {/* hover button to add a new block */}
            {/* <div
              style={{
                width: '100%',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f0f0f0',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
              data-hide-on-export
            >
              + Добавить блок
            </div> */}
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

      <div className="text-xs text-center text-gray-500 mt-4 mb-8">
        Сделано в 
        <a href="https://bureau.ru/school/" target="_blank">
          Школе Бюро
        </a>{' '}
        в 2025 году
      </div>

      <div className="fixed bottom-4 right-4 flex flex-col gap-2">
        <button
          className="px-8 py-2 bg-white text-[#3395F7] rounded hover:bg-[#f3f9ff] active:bg-[#ebf5ff] cursor-pointer"
          onClick={() => {
            exportToPdf(document.getElementById('leaflet'));
          }}
        >
          Показать PDF
        </button>
        <button
          className="px-8 py-2 bg-[#3395F7] text-white rounded hover:bg-[#3378f7] active:bg-[#3357f7] cursor-pointer"
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
