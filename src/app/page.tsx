'use client';
import React from 'react';
import { Mars, Venus } from 'lucide-react';
import { exportToPdf } from '@/utils/export';
import { LeafletData, LeafletSection, LeafletTextfield } from '@/types/leaflet';
import EditableDiv from '@/components/editableDiv';
import axios from 'axios';

const leafletDataLocalStorageKey = 'leafletData';
const defaultLeafletData: LeafletData = {
  title: { value: `Инструкция<br>по уходу`, placeholder: 'Заголовок памятки' },
  petName: { value: '', placeholder: 'Имя питомца' },
  petSexIsMale: true,
  imageSrc: '',
  asideSection: [
    {
      title: {
        value: 'Дата рождения',
        placeholder: '',
      },
      content: {
        value: '',
        placeholder: '22.02.2025',
      },
    },
    {
      title: {
        value: 'Порода и окрас',
        placeholder: '',
      },
      content: {
        value: '',
        placeholder: 'Мейн-кун, кремовый солид',
      },
    },
    {
      title: {
        value: 'Имя в родословной',
        placeholder: '',
      },
      content: {
        value: '',
        placeholder: 'Arman Pride Yan',
      },
    },
    {
      title: {
        value: 'Номер чипа',
        placeholder: '',
      },
      content: {
        value: '',
        placeholder: '643 099 000 000 000',
      },
    },
  ],
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

  // Load from localStorage on client after mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(leafletDataLocalStorageKey);
      if (stored) {
        try {
          setLeafletData(JSON.parse(stored) as LeafletData);
        } catch {
          setLeafletData(defaultLeafletData);
        }
      }
    }
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

        // Update leaflet data with the new image source
        setLeafletData((prevData) => ({
          ...prevData,
          imageSrc: img,
        }));
      };
      reader.readAsDataURL(file);
      input.remove();
    };
    input.click();
  };

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

  // on change of leafletData, update saved data in localStorage
  React.useEffect(() => {
    localStorage.setItem(
      leafletDataLocalStorageKey,
      JSON.stringify(leafletData)
    );

    console.log('Leaflet data updated:', leafletData);
  }, [leafletData]);

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
      <div className="w-[808px]">
        <div className="text-5xl font-bold text-[#3e6688] mt-20 mb-2">
          Памяткин
        </div>
        <div className="text-2xl text-[#3e6688] mb-8">
          Сервис для создания памяток по уходу за питомцем
        </div>
        <div className="text-[#3e6688]">
          <div>Чтобы сделать инструкцию по уходу за питомцем:</div>
          <ul className="space-y-2 ml-4 mb-0">
            <li>Загрузите фотографию питомца и заполните данные о нем.</li>
            <li>
              Заполните разделы инструкции. Редактируйте заголовки и основной
              текст инструкции. Добавьте свои разделы с помощью кнопки «Добавить
              раздел».
            </li>
            <li>
              Нажмите кнопку «Купить PDF», чтобы оплатить и скачать получившийся
              файл.
            </li>
          </ul>
        </div>
        <div className="text-[#3e6688] text-xs mt-4">
          Если у вас есть вопросы или пожелания, напишите нам на{' '}
          <a
            href="mailto:info@pamyatkin.ru"
            className="text-[#3e6688] underline"
          >
            info@pamyatkin.ru
          </a>
          .
        </div>
      </div>

      {/* leaflet */}
      <div
        className="bg-white mt-18 mb-[470px] pt-[32px] px-[28px] pb-[40px] shadow-2xl shadow-[#3e668861] w-[595px] min-h-[842px] relative"
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
          <EditableDiv
            value={leafletData.title.value}
            onChange={(value) =>
              setLeafletData((prevData) => ({
                ...prevData,
                title: {
                  ...prevData.title,
                  value,
                } as LeafletTextfield,
              }))
            }
            contentEditable={false}
            placeholder={leafletData.title.placeholder}
            style={{
              fontWeight: 'bold',
              fontSize: '32px',
              lineHeight: '1',
              width: '380px',
            }}
          />
          <div
            style={{ width: '125px', height: '125px' }}
            className="flex-shrink-0 group relative hover:cursor-pointer"
            onClick={handleImageClick}
          >
            <img
              className={leafletData.imageSrc ? 'block' : 'hidden'}
              style={{
                objectFit: 'cover',
                width: '100%',
                height: '100%',
              }}
              src={leafletData.imageSrc || '/cat.png'}
              alt="Cat"
            />
            <div
              className={`${leafletData.imageSrc ? 'hidden' : 'flex'} group-hover:flex text-center absolute w-full h-full top-0 items-center justify-center bg-[#ffffffbb] border border-dashed border-[#3e668832] hover:border-[#3e668861] backdrop-blur-xs`}
            >
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
                  <EditableDiv
                    value={section.title.value}
                    onChange={(value) =>
                      setLeafletData((prevData) => {
                        const updatedSections = [...prevData.sections];
                        updatedSections[index] = {
                          ...updatedSections[index],
                          title: {
                            ...updatedSections[index].title,
                            value,
                          },
                        };
                        return {
                          ...prevData,
                          sections: updatedSections,
                        };
                      })
                    }
                    contentEditable={true}
                    placeholder={section.title.placeholder}
                    style={{
                      fontWeight: 'bold',
                      fontSize: '12px',
                      lineHeight: '1',
                    }}
                  />
                  <EditableDiv
                    value={section.content.value}
                    onChange={(value) =>
                      setLeafletData((prevData) => {
                        const updatedSections = [...prevData.sections];
                        updatedSections[index] = {
                          ...updatedSections[index],
                          content: {
                            ...updatedSections[index].content,
                            value,
                          },
                        };
                        return {
                          ...prevData,
                          sections: updatedSections,
                        };
                      })
                    }
                    contentEditable={true}
                    placeholder={section.content.placeholder}
                    style={{
                      fontSize: '11px',
                      lineHeight: '1.3',
                      marginBottom: '4px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      minHeight: '68px',
                    }}
                    data-focus={index === 0 ? true : undefined}
                  />
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
                        placeholder: 'Заголовок секции',
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
              Добавить секцию
            </div>
          </div>
          <div style={{ width: '125px', flexShrink: 0 }}>
            <div
              style={{
                display: 'flex',
                gap: '2px',
                justifyContent: 'start',
                alignItems: 'stretch',
                marginBottom: '10px',
              }}
            >
              <EditableDiv
                value={leafletData.petName.value}
                onChange={(value) =>
                  setLeafletData((prevData) => ({
                    ...prevData,
                    petName: {
                      ...prevData.petName,
                      value,
                    } as LeafletTextfield,
                  }))
                }
                contentEditable={true}
                placeholder={leafletData.petName.placeholder}
                style={{
                  fontSize: '15px',
                  lineHeight: '1',
                }}
              />

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onClick={(e) => {
                  const checkbox = e.currentTarget.querySelector(
                    'input[type="checkbox"]'
                  ) as HTMLInputElement;
                  if (checkbox) {
                    checkbox.checked = !checkbox.checked;
                    setLeafletData((prevData) => ({
                      ...prevData,
                      petSexIsMale: checkbox.checked,
                    }));
                  }
                }}
                className="cursor-pointer"
              >
                <input
                  type="checkbox"
                  style={{ display: 'none' }}
                  checked={leafletData.petSexIsMale}
                  className="cursor-pointer"
                  onChange={(e) => {}}
                />
                {leafletData.petSexIsMale ? (
                  <Mars size={15} />
                ) : (
                  <Venus size={15} />
                )}
              </div>
            </div>

            <div
              style={{
                fontSize: '9px',
                lineHeight: '1.3',
                gap: '6px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {(leafletData.asideSection || []).map(
                (section: LeafletSection, index: number) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                    }}
                  >
                    <EditableDiv
                      value={section.title.value}
                      onChange={(value) =>
                        setLeafletData((prevData) => {
                          const updatedAsideSection = [
                            ...prevData.asideSection,
                          ];
                          updatedAsideSection[index] = {
                            ...updatedAsideSection[index],
                            title: {
                              ...updatedAsideSection[index].title,
                              value,
                            },
                          };
                          return {
                            ...prevData,
                            asideSection: updatedAsideSection,
                          };
                        })
                      }
                      contentEditable={false}
                      placeholder={section.title.placeholder}
                      style={{}}
                    />
                    <EditableDiv
                      value={section.content.value}
                      onChange={(value) =>
                        setLeafletData((prevData) => {
                          const updatedAsideSection = [
                            ...prevData.asideSection,
                          ];
                          updatedAsideSection[index] = {
                            ...updatedAsideSection[index],
                            content: {
                              ...updatedAsideSection[index].content,
                              value,
                            },
                          };
                          return {
                            ...prevData,
                            asideSection: updatedAsideSection,
                          };
                        })
                      }
                      contentEditable={true}
                      placeholder={section.content.placeholder}
                      style={{}}
                    />
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="text-xs text-center text-gray-500 mt-20 mb-8">
        <a href="https://bureau.ru/school/" target="_blank">
          Сделано в Школе Бюро Горбунова в 2025 году.
        </a>
      </div>

      <div className="fixed bottom-4 left-4 flex flex-col gap-2">
        <button
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
        </button>
      </div>

      <div className="fixed bottom-4 right-4 flex flex-col gap-2">
        <button
          className="px-8 py-2 bg-white text-[#3e6688] rounded hover:bg-[#eef7ff] active:bg-[#bfd9f0] cursor-pointer"
          onClick={() => {
            exportToPdf(document.getElementById('leaflet'));
          }}
        >
          Показать PDF
        </button>
        <button
          className="px-8 py-2 bg-[#3e6688] text-white rounded hover:bg-[#31506b] active:bg-[#2b3e4d] cursor-pointer"
          onClick={() => {
            handleBuyClick();
          }}
        >
          Купить PDF
        </button>
      </div>
    </div>
  );
}
