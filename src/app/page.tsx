'use client';
import React from 'react';
import { exportToPdf } from '@/utils/export';

import axios from 'axios';
import Leaflet from '@/components/leaflet';
import { askAi } from '@/utils/ask-ai';
import { LeafletData } from '@/types/leaflet';

export default function Home() {
  const [userEmail, setUserEmail] = React.useState<string | null>(null);
  const emailInputRef = React.useRef<HTMLInputElement>(null);
  const [price, setPrice] = React.useState<number | null>(null);
  const [leafletData, setLeafletData] = React.useState<LeafletData | null>(
    null
  );

  const [isAiThinking, setIsAiThinking] = React.useState<boolean>(false);

  React.useEffect(() => {
    // fetch price from server
    axios
      .get('/api/get-price')
      .then((response) => {
        const priceData = response.data;
        setPrice(parseFloat(priceData.price));
      })
      .catch((error) => {
        console.error('Error fetching price:', error);
        // alert('Ошибка при получении цены. Попробуйте позже.');
      });
  }, []);

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
    // Validate user email
    if (!userEmail || !emailInputRef.current?.checkValidity()) {
      // alert('Пожалуйста, введите корректный email для получения чека.');
      emailInputRef.current?.focus();

      // shake the input field to indicate error
      emailInputRef.current?.classList.add('animate-shake');
      setTimeout(() => {
        emailInputRef.current?.classList.remove('animate-shake');
      }, 1000);
      return;
    }

    const paymentRequest = await axios.get(
      '/api/kassa?email=' + encodeURIComponent(userEmail)
    );
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

  const callAi = async () => {
    const userInput = prompt(
      'Расскажите о питомце: "Порода, возраст, кличка, особенности поведения, предпочтения в питании и т.д."'
    );

    if (!userInput) {
      return;
    }

    setIsAiThinking(true);

    console.log('Calling AI to generate leaflet data...');
    askAi({
      systemMessage: `Ты — помощник по уходу за домашними животными. Помоги составить инструкцию по уходу за питомцем на темы: подготовка дома, первый день дома, питание, отдых, гигиена, прогулки, прививки, дрессировка, любые дополнительные разделы при необходимости. Заполни поля ответа полезной информацией. Где не хватает информации либо придумай, либо оставь пустым. Напиши достаточно большое количество информации, чтобы пользователю не пришлось искать ответы на основные вопросы в чатах или интернете. Output valid JSON only. No text, no markdown, just the raw JSON. I will parse this programmatically. Please return just the JSON object, starting with { and ending with }. No extra formatting. Important: DO NOT include \`\`\`json or any other explanation. Only return the raw JSON. This will be parsed directly by a script. Все текстовые поля заполняй без дополнительной разметки и списков, но используй переносы строк, если это необходимо. Нужен готовый к использованию JSON. Формат JSON должен соответствовать следующему шаблону:
      {
          title: {
  value?: "Инструкция\\nпо уходу";
  placeholder?: string;
};
          petName: {
  value?: string;
  placeholder?: string;
};
          petSexIsMale: boolean;
          imageSrc: "";
          asideSection: {
            title: {
              value?: string;
              placeholder?: string;
            };
            content: {
              value?: string;
              placeholder?: string;
            };
          }[];
          sections: {
            title: {
              value?: string;
              placeholder?: string;
            };
            content: {
              value?: string;
              placeholder?: string;
            };
          }[];
        };

        asideSection — это информация, которая будут отображаться в боковой части памятки. ты можешь каждый важный факт о питомце вынести в отдельный блок. Каждый блок должен содержать title и content. title — это заголовок блока, content — это текст блока. Если у тебя нет информации для заполнения, оставь поле пустым или придумай что-то подходящее.

        sections — это основные разделы памятки. Каждый раздел должен содержать title и content. title — это заголовок раздела, content — это текст раздела. Если у тебя нет информации для заполнения, оставь поле пустым или придумай что-то подходящее.`,
      userMessage: userInput || '',
      // 'Лабрадор, 3 года, кличка Бобик. Он любит гулять по утрам и есть сухой корм. У него есть аллергия на курицу. Он очень дружелюбный и любит играть с детьми. Порода: Лабрадор-ретривер, окрас: черный. Дата рождения: 01.01.2020. Номер чипа: 123456789012345.',
    })
      .then((response) => {
        console.log('AI response:', response);
        try {
          // prepare response for parsing from ```json\n{\n  \"titl .... ``` to {"title": "Заголовок", ...}
          // if (response.startsWith('```json\n')) {
          //   response = response.replace('```json\n', '');
          // }
          // if (response.endsWith('```')) {
          //   response = response.slice(0, -3);
          // }

          // remove any leading/trailing whitespace and \n characters
          // response = response.trim().replace(/\n/g, '');
          console.log('Parsed AI response:', response);

          // if response is not valid JSON, throw error
          const data = JSON.parse(response);
          setLeafletData(data);
        } catch (error) {
          console.error('Ошибка при разборе ответа ИИ:', error);
          alert('Ошибка при получении данных от ИИ. Попробуйте позже.');
        }
      })
      .catch((error) => {
        console.error('Ошибка при запросе к ИИ:', error);
        alert('Ошибка при запросе к ИИ. Попробуйте позже.');
      })
      .finally(() => {
        setIsAiThinking(false);
      });
  };

  return (
    <div className="flex flex-col bg-stone-100">
      {/* two colums layout */}
      <div className="flex justify-start gap-8 px-16 py-8 mx-auto">
        {/* leaflet */}
        <div className="w-full">
          <Leaflet passedLeafletData={leafletData} />
        </div>
        <div className="flex flex-col gap-10 w-[350px] pt-4 pb-8 flex-shrink-0 h-screen ">
          <div>
            <div className="text-4xl font-bold text-[#3e6688] mb-2">
              Памяткин
            </div>
            <div className="text-[#3e6688]">
              {/* <div>
                Соберите и скачайте инструкцию по уходу за домашним животным:
              </div> */}
              <ol className="space-y-2 mt-1 pl-6 custom-counter">
                <li>Загрузите фотку и данные питомца</li>
                <li>Отредактируйте инструкцию</li>
                <li>Оплатите и скачайте файл для печати</li>
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
              className="mb-20 px-8 py-2 bg-gradient-to-br from-purple-600 to-blue-900 text-white rounded hover:from-purple-700 hover:to-blue-950 active:from-purple-800 active:to-blue-950 cursor-pointer"
              onClick={() => {
                if (isAiThinking) {
                  return;
                }
                callAi();
              }}
            >
              {isAiThinking ? (
                <>
                  <svg
                    aria-hidden="true"
                    role="status"
                    className="inline w-4 h-4 me-3 text-gray-600 animate-spin dark:text-gray-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="#ffffff"
                    />
                  </svg>
                </>
              ) : (
                'Сгенерировать с помощью ИИ'
              )}
            </button>

            {/* input field for user's email */}
            <input
              type="email"
              placeholder="Электронная почта для чека"
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#3e6688] w-full"
              onChange={(e) => {
                setUserEmail(e.target.value);
              }}
              value={userEmail || ''}
              required
              ref={emailInputRef}
              autoComplete="email"
            />

            <button
              className="px-8 py-2 bg-[#3e6688] text-white rounded hover:bg-[#31506b] active:bg-[#2b3e4d] cursor-pointer"
              onClick={() => {
                if (!price) {
                  exportToPdf(document.getElementById('leaflet'));
                  return;
                }
                handleBuyClick();
              }}
            >
              Скачать ПДФ {price ? `за ${price} ₽` : ''}
            </button>
            <div className="text-[#3e6688] text-xs mb-2">
              Оплачивая, вы соглашаетесь{' '}
              <a
                href="/oferta"
                target="_blank"
                className="text-[#3e6688] underline"
              >
                с публичной офертой
              </a>
            </div>
            <div className="text-[#3e6688] text-xs mt-12">
              Вопросы и пожелания:{' '}
              <a
                href="mailto:support@pamyatkin.ru"
                className="text-[#3e6688] underline"
              >
                support@pamyatkin.ru
              </a>
            </div>
            <div className="text-xs text-gray-500 mt-2 ">
              <a href="https://bureau.ru/school/" target="_blank">
                Сделано в Школе Бюро Горбунова в 2025 году
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
