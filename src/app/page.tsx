'use client';
import React from 'react';
import { exportToPdf } from '@/utils/export';

import axios from 'axios';
import Leaflet from '@/components/leaflet';
import { askAi } from '@/utils/ask-ai';
import { LeafletData } from '@/types/leaflet';
import Loader from '@/components/loader';

export default function Home() {
  const [userEmail, setUserEmail] = React.useState<string | null>(null);
  const emailInputRef = React.useRef<HTMLInputElement>(null);
  const [price, setPrice] = React.useState<number | null>(null);
  const [leafletData, setLeafletData] = React.useState<LeafletData | null>(
    null
  );

  const [isAiThinking, setIsAiThinking] = React.useState<boolean>(false);
  const [isAiThinking2, setIsAiThinking2] = React.useState<boolean>(false);

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

  const callAi = async ({
    systemMessage,
    userMessage,
  }: {
    systemMessage: string;
    userMessage: string;
  }) => {
    console.log('Calling AI to generate leaflet data...');

    const composedSystemMessage = `${systemMessage}

    Output valid JSON only. No text, no markdown, just the raw JSON. I will parse this programmatically. Please return just the JSON object, starting with { and ending with }. No extra formatting. Important: DO NOT include \`\`\`json or any other explanation. Only return the raw JSON. This will be parsed directly by a script. Все текстовые поля заполняй без дополнительной разметки и списков, но используй переносы строк, если это необходимо. Нужен готовый к использованию JSON. Формат JSON должен соответствовать следующему шаблону:
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

        sections — это основные разделы памятки. Каждый раздел должен содержать title и content. title — это заголовок раздела, content — это текст раздела. Если у тебя нет информации для заполнения, оставь поле пустым или придумай что-то подходящее.`;

    try {
      let response = await askAi({
        systemMessage: composedSystemMessage,
        userMessage,
      });

      console.log('AI response:', response);
      try {
        // prepare response for parsing from ```json\n{\n  \"titl .... ``` to {"title": "Заголовок", ...}
        if (response.startsWith('```json\n')) {
          response = response.replace('```json\n', '');
        }
        if (response.endsWith('```')) {
          response = response.slice(0, -3);
        }

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
    } catch (error) {
      console.error('Ошибка при запросе к ИИ:', error);
      alert('Ошибка при запросе к ИИ. Попробуйте позже.');
    }
  };

  return (
    <div className="flex flex-col">
      {/* two colums layout */}
      <div className="flex justify-start gap-8 px-16 py-8 mx-auto relative">
        {/* leaflet */}
        <div className="w-full">
          <Leaflet passedLeafletData={leafletData} />
        </div>
        <div className="flex flex-col gap-10 w-[350px] pt-4 pb-8 flex-shrink-0 h-full sticky top-0 z-10">
          <div>
            <div className="text-4xl font-bold text-[#9C3CF0] mb-2">
              Памяткин
            </div>
            <div className="text-[#9C3CF0]">
              <ol className="space-y-2 mt-1 pl-6 custom-counter">
                <li>Заполните инструкцию</li>
                <li>Добавьте фотку питомца и данные о нем</li>
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
            {/* <button
              className="mb-2 px-8 py-2 bg-gradient-to-br from-purple-600 to-blue-900 text-white rounded hover:from-purple-700 hover:to-blue-950 active:from-purple-800 active:to-blue-950 cursor-pointer"
              onClick={async () => {
                if (isAiThinking) return;

                const userInput = prompt(
                  'Расскажите о питомце: "Порода, возраст, кличка, особенности поведения, предпочтения в питании и т.д."'
                );

                if (!userInput) return;

                setIsAiThinking(true);

                await callAi({
                  systemMessage:
                    'Ты — помощник по уходу за домашними животными. Помоги составить инструкцию по уходу за питомцем на темы: подготовка дома, первый день дома, питание, отдых, гигиена, прогулки, прививки, дрессировка, любые дополнительные разделы при необходимости. Заполни поля ответа полезной информацией. Где не хватает информации либо придумай, либо оставь пустым. Напиши достаточно большое количество информации, чтобы пользователю не пришлось искать ответы на основные вопросы в чатах или интернете.',
                  userMessage: userInput,
                });

                setIsAiThinking(false);
              }}
            >
              {isAiThinking ? <Loader /> : 'Сгенерировать с помощью ИИ'}
            </button>
            <button
              className="mb-20 px-8 py-2 bg-gradient-to-br from-purple-600 to-blue-900 text-white rounded hover:from-purple-700 hover:to-blue-950 active:from-purple-800 active:to-blue-950 cursor-pointer"
              onClick={async () => {
                if (isAiThinking2) return;

                const userInput = prompt(
                  'Вставьте сюда текст инструкции, которая у вас уже есть'
                );

                if (!userInput) return;

                setIsAiThinking2(true);

                await callAi({
                  systemMessage:
                    'Ты — помощник по уходу за домашними животными и опытный редактор. Помоги на базе инструкции от пользователя составить памятку по уходу за питомцем на темы: подготовка дома, первый день дома, питание, отдых, гигиена, прогулки, прививки, дрессировка, любые дополнительные разделы при необходимости. Перефразируй тексты, чтобы упростить их, но сохранить смысл',
                  userMessage: userInput,
                });

                setIsAiThinking2(false);
              }}
            >
              {isAiThinking2 ? <Loader /> : 'Пересобрать памятку из вашей'}
            </button> */}

            {/* input field for user's email */}
            <input
              type="email"
              placeholder="Электронная почта для чека"
              className="px-4 py-2 pb-2.5 border border-[#9C3CF0]/60 rounded focus:outline-none focus:ring-1 focus:ring-[#9C3CF0]/30 w-full placeholder:text-[#9C3CF0] placeholder:opacity-60"
              onChange={(e) => {
                setUserEmail(e.target.value);
              }}
              value={userEmail || ''}
              required
              ref={emailInputRef}
              autoComplete="email"
            />

            <button
              className="px-8 py-2 bg-[#9C3CF0] text-white rounded hover:bg-[#8c2ae1] active:bg-[#6f1bb9] cursor-pointer"
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
            <div className="text-[#9C3CF0] text-xs mb-2">
              Оплачивая, вы соглашаетесь{' '}
              <a href="/oferta" className="text-[#9C3CF0] underline">
                с публичной офертой
              </a>
            </div>
            <div className="text-[#9C3CF0] text-xs mt-12">
              Вопросы и пожелания:{' '}
              <a
                href="mailto:support@pamyatkin.ru"
                className="text-[#9C3CF0] underline"
              >
                support@pamyatkin.ru
              </a>
            </div>
            <div className="text-xs text-gray-400 mt-2 ">
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
