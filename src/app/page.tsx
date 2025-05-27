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

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-stone-100">
      {/* leaflet */}
      <div
        className="bg-white my-20 mb-[600px] pt-[32px] px-[28px] pb-[40px] shadow-2xl shadow-[#3e668861] w-[595px] h-[842px] relative"
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
          }}
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
            style={{ fontWeight: 'bold', fontSize: '32px', lineHeight: '1' }}
            contentEditable
            suppressContentEditableWarning
            data-placeholder="Заголовок инструкции"
          >
            Инструкция
            <br />
            по уходу
          </div>
          <img
            style={{ width: '125px', height: '125px' }}
            src="/cat.png"
            alt="Cat"
          />
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
              data-hideOnExport
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
            >
              Янус
            </div>
          </div>
        </div>
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
