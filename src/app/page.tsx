'use client';
import React from 'react';
import { Mars, Venus } from 'lucide-react';
import { exportToPdf } from '@/utils/export';
import { LeafletData, LeafletSection, LeafletTextfield } from '@/types/leaflet';

import { defaultLeafletData } from '@/data/leaflet';
import axios from 'axios';
import Leaflet from '@/components/leaflet';
import { getPrice } from '@/utils/price';

export default function Home() {
  // check query parameters 'from' in url
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const from = urlParams.get('from');
    if (from && from === 'kassa') {
      // try to check payment status
      const lastPaymentId = localStorage.getItem('lastPaymentId');

      if (lastPaymentId) {
        axios
          .get(`/api/check-payments?id=${lastPaymentId}`)
          .then((response) => {
            const paymentData = response.data;
            console.log('Payment status:', paymentData);
            if (paymentData.status === 'succeeded') {
              // alert(
              //   'Платеж успешно завершен! Инструкция сейчас будет загружена.'
              // );
              exportToPdf(document.getElementById('leaflet'), true);
              localStorage.removeItem('lastPaymentId');
            } else {
              alert('Платеж не завершен. Попробуйте еще раз.');
            }
          })
          .catch((error) => {
            console.error('Error checking payment status:', error);
            // alert('Ошибка при проверке статуса платежа. Попробуйте позже.');
          });
      }
    }
  }, []);

  const handleBuyClick = async () => {
    const paymentRequest = await axios.get('/api/kassa');
    if (paymentRequest.status !== 200) {
      alert('Ошибка при создании платежа. Попробуйте позже.');
      return;
    }

    const paymentData = paymentRequest.data;
    console.log('Payment created:', paymentData);

    const paymentUrl = paymentData.confirmation.confirmation_url;
    if (!paymentUrl) {
      alert('Ошибка при получении URL для оплаты. Попробуйте позже.');
      return;
    }

    // get payment id and save to localStorage in user last payment
    const paymentId = paymentData.id;
    localStorage.setItem('lastPaymentId', paymentId);

    window.location.href = paymentUrl;

    // exportToPdf(document.getElementById('leaflet'), true);
  };

  return (
    <div className="flex flex-col bg-stone-100">
      {/* two colums layout */}
      <div className="flex justify-start gap-8 px-16 py-8 mx-auto">
        {/* leaflet */}
        <div className="w-full">
          <Leaflet />
        </div>
        <div className="flex flex-col gap-10 w-[350px] pt-4 pb-8 flex-shrink-0 h-screen ">
          <div>
            <div className="text-4xl font-bold text-[#3e6688] mb-2">
              Памяткин
            </div>
            <div className="text-[#3e6688]">
              <div>
                Соберите и скачайте инструкцию по уходу за домашним животным:
              </div>
              <ol className="space-y-2 mt-1 pl-6">
                <li>Загрузите фотку и укажите данные животного.</li>
                <li>Отредактуруйте инструкцию.</li>
                <li>Оплатите и скачайте файл для печати.</li>
              </ol>
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

                setLeafletData(defaultLeafletData);
                localStorage.removeItem(leafletDataLocalStorageKey);
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

            <button
              className="px-8 py-2 bg-[#3e6688] text-white rounded hover:bg-[#31506b] active:bg-[#2b3e4d] cursor-pointer"
              onClick={() => {
                handleBuyClick();
              }}
            >
              Скачать ПДФ за {getPrice()} ₽
            </button>
            <div className="text-[#3e6688] text-xs mb-2">
              Оплачивая, вы соглашаетесь с{' '}
              <a
                href="/oferta"
                target="_blank"
                className="text-[#3e6688] underline"
              >
                публичной офертой
              </a>
              .
            </div>
            <div className="text-[#3e6688] text-xs mt-12">
              Вопросы и пожелания:{' '}
              <a
                href="mailto:info@pamyatkin.ru"
                className="text-[#3e6688] underline"
              >
                info@pamyatkin.ru
              </a>
              .
            </div>
            <div className="text-xs text-gray-500 mt-2 ">
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
