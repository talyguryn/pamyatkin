'use client';
import React from 'react';
import { Mars, Venus } from 'lucide-react';
import { exportToPdf } from '@/utils/export';
import { LeafletData, LeafletSection, LeafletTextfield } from '@/types/leaflet';

import { defaultLeafletData } from '@/data/leaflet';
import axios from 'axios';
import Leaflet from '@/components/leaflet';

export default function Home() {
  const handleBuyClick = async () => {
    const paymentRequest = await axios.get('/api/kassa');
    if (paymentRequest.status !== 200) {
      alert('Ошибка при создании платежа. Попробуйте позже.');
      return;
    }

    const paymentData = paymentRequest.data;
    console.log('Payment created:', paymentData);

    const paymentUrl = paymentData.confirmation.confirmation_url;
    if (paymentUrl) {
      window.open(paymentUrl, '_blank');
    }

    // exportToPdf(document.getElementById('leaflet'), true);
  };

  return (
    <div className="flex flex-col items-center justify-center bg-stone-100">
      {/* two colums layout */}
      <div className="flex justify-center gap-8 max-w-3xl w-full mx-auto p-4">
        {/* leaflet */}
        <div className="w-full">
          <Leaflet />
        </div>
        <div className="flex flex-col justify-between w-[250px] pt-4 pb-8 flex-shrink-0 h-screen ">
          <div>
            <div className="text-4xl font-bold text-[#3e6688] mb-2">
              Памяткин
            </div>
            {/* <div className="text-2xl text-[#3e6688] mb-8"></div> */}
            <div className="text-[#3e6688]">
              <div>
                Соберите и скачайте инструкцию по уходу за домашним животным:
              </div>
              <ul className="space-y-2 ml-4 mb-0">
                <li>Загрузите фотку и укажите данные животного.</li>
                <li>Отредактуруйте инструкцию.</li>
                <li>Оплатите и скачайте файл для печати.</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {/* <button
              className="px-8 py-2 bg-white text-[#883e3e] rounded hover:bg-[#ffeeee] active:bg-[#f0bfbf] cursor-pointer"
              onClick={() => {
                if (
                  !confirm(
                    'Вы уверены, что хотите очистить форму? Все данные будут потеряны.'
                  )
                ) {
                  return;
                }

                // setLeafletData(defaultLeafletData);
                // localStorage.removeItem(leafletDataLocalStorageKey);
              }}
            >
              Очистить форму
            </button> */}
            {/* <button
              className="px-8 py-2 bg-white text-[#3e6688] rounded hover:bg-[#eef7ff] active:bg-[#bfd9f0] cursor-pointer"
              onClick={() => {
                exportToPdf(document.getElementById('leaflet'));
              }}
            >
              Показать PDF
            </button> */}
            <div className="text-[#3e6688] text-xs mb-2">
              Оплачивая, вы соглашаетесь с{' '}
              <a href="/oferta" className="text-[#3e6688] underline">
                публичной офертой
              </a>
              .
            </div>
            <button
              className="px-8 py-2 bg-[#3e6688] text-white rounded hover:bg-[#31506b] active:bg-[#2b3e4d] cursor-pointer"
              onClick={() => {
                handleBuyClick();
              }}
            >
              Купить PDF
            </button>

            <div className="text-[#3e6688] text-xs mt-4">
              Вопросы и пожелания:{' '}
              <a
                href="mailto:info@pamyatkin.ru"
                className="text-[#3e6688] underline"
              >
                info@pamyatkin.ru
              </a>
              .
            </div>

            <div className="text-xs text-gray-500 mt-2">
              <a href="https://bureau.ru/school/" target="_blank">
                Сделано в Школе Бюро Горбунова в 2025 году.
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
