import React from 'react';

import EditableDiv from '@/components/editableDiv';
import { Mars, Venus, Plus } from 'lucide-react';
import { LeafletData, LeafletSection, LeafletTextfield } from '@/types/leaflet';
import { defaultLeafletData } from '@/data/leaflet';
import { title } from 'process';

const leafletDataLocalStorageKey = 'leafletData';

const SCALE_FACTOR = 1.5; // Adjust this value to scale the leaflet

interface LeafletProps {
  passedLeafletData?: LeafletData | null; // Optional prop to pass leaflet data
}

export default function Leaflet(props: LeafletProps) {
  const initialLeafletData = props.passedLeafletData || null;
  const [leafletData, setLeafletData] =
    React.useState<LeafletData>(defaultLeafletData);

  // if query parameter clear is present, clear localStorage
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const clear = urlParams.get('clear');
    if (clear === 'true') {
      localStorage.removeItem(leafletDataLocalStorageKey);
      // Reset the leaflet data to default
      setLeafletData(defaultLeafletData);
    }
  }, []);

  // Load from localStorage on client after mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(leafletDataLocalStorageKey);
      // If initialLeafletData is provided, use it; otherwise, use stored data or default
      if (initialLeafletData) {
        setLeafletData(initialLeafletData);
        return;
      }

      if (stored) {
        try {
          setLeafletData(JSON.parse(stored) as LeafletData);
        } catch {
          setLeafletData(defaultLeafletData);
        }
      }
    }
  }, []);

  // on rerender, if initialLeafletData is provided, update leafletData
  React.useEffect(() => {
    if (initialLeafletData) {
      setLeafletData(initialLeafletData);
    }
  }, [initialLeafletData]);

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

  /* on change of leafletData, update saved data in localStorage */
  React.useEffect(() => {
    localStorage.setItem(
      leafletDataLocalStorageKey,
      JSON.stringify(leafletData)
    );

    // console.log('Leaflet data updated:', leafletData);
  }, [leafletData]);

  /* on paste remove all formatting from the pasted text and paste it as plain text */
  React.useEffect(() => {
    document.addEventListener('paste', (event) => {
      event.preventDefault();
      const text = event.clipboardData?.getData('text/plain') ?? '';
      document.execCommand('insertText', false, text);
    });
  }, []);

  /* on load focus on the data-focus element */
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
    <div
      style={{
        background: 'white',
        paddingTop: `calc(32px * ${SCALE_FACTOR})`,
        paddingLeft: `calc(28px * ${SCALE_FACTOR})`,
        paddingRight: `calc(28px * ${SCALE_FACTOR})`,
        paddingBottom: `calc(40px * ${SCALE_FACTOR})`,
        boxShadow: '0 25px 50px -12px #3e668861',
        width: `calc(595px * ${SCALE_FACTOR})`,
        // minHeight: `calc(842px * ${SCALE_FACTOR})`,
        position: 'relative',
      }}
    >
      <div
        className="relative"
        id="leaflet"
        style={{
          fontFamily: 'Arial, sans-serif',
          display: 'flex',
          flexDirection: 'column',
          gap: `calc(10px * ${SCALE_FACTOR})`,
          minHeight: `calc((842px - 72px) * ${SCALE_FACTOR})`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 'auto',
            right: `calc(7px * ${SCALE_FACTOR})`,
            bottom: '0',
            color: '#B4B4B4',
            fontSize: `calc(7px * ${SCALE_FACTOR})`,
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
              fontSize: `calc(32px * ${SCALE_FACTOR})`,
              lineHeight: '1',
              width: `calc(380px * ${SCALE_FACTOR})`,
            }}
          />
          <div
            style={{
              width: `calc(125px * ${SCALE_FACTOR})`,
              height: `calc(125px * ${SCALE_FACTOR})`,
            }}
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
              <span
                style={{
                  fontSize: `calc(12px * ${SCALE_FACTOR})`,
                  color: '#3e6688',
                  textAlign: 'center',
                  lineHeight: '1.2',
                  width: '100%',
                  userSelect: 'none',
                }}
              >
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
              width: `calc(380px * ${SCALE_FACTOR})`,
              gap: `calc(20px * ${SCALE_FACTOR})`,
            }}
          >
            {leafletData.sections.map(
              (section: LeafletSection, index: number) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: `calc(10px * ${SCALE_FACTOR})`,
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
                    onKeyDown={(event: KeyboardEvent) => {
                      if (event.key !== 'Backspace') return;

                      const titleElement = document.querySelectorAll(
                        `[data-section-title-index]`
                      )[index] as HTMLElement;
                      const contentElement = document.querySelectorAll(
                        `[data-section-content-index]`
                      )[index] as HTMLElement;

                      if (
                        !titleElement.innerText.replace(/\n/g, '') &&
                        !contentElement.innerText.replace(/\n/g, '')
                      ) {
                        setLeafletData((prevData) => {
                          const updatedSections = [...prevData.sections];

                          return {
                            ...prevData,
                            sections: updatedSections.filter(
                              (element, i) => i !== index
                            ),
                          };
                        });
                      }
                    }}
                    contentEditable={true}
                    placeholder={section.title.placeholder}
                    style={{
                      fontWeight: 'bold',
                      fontSize: `calc(12px * ${SCALE_FACTOR})`,
                      lineHeight: '1',
                    }}
                    className="section__title"
                    data-section-title-index={index}
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
                      fontSize: `calc(11px * ${SCALE_FACTOR})`,
                      lineHeight: '1.3',
                      marginBottom: `calc(4px * ${SCALE_FACTOR})`,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: `calc(10px * ${SCALE_FACTOR})`,
                      minHeight: `calc(68px * ${SCALE_FACTOR})`,
                    }}
                    data-focus={index === 0 ? true : undefined}
                    className="section__content"
                    data-section-content-index={index}
                  />
                </div>
              )
            )}

            <button
              style={{
                width: '100%',
                height: `calc(30px * ${SCALE_FACTOR})`,
                borderRadius: `calc(4px * ${SCALE_FACTOR})`,
                cursor: 'pointer',
                background: 'none',
                border: '1px dashed #3e6688',
                color: '#3e6688',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: `calc(4px * ${SCALE_FACTOR})`,
                fontSize: `calc(12px * ${SCALE_FACTOR})`,
                padding: 0,
              }}
              className="hover:text-[#1c4c76] opacity-50 hover:opacity-100"
              data-hide-on-export
              onClick={() => {
                setLeafletData((prevData) => ({
                  ...prevData,
                  sections: [
                    ...prevData.sections,
                    {
                      title: {
                        value: '',
                        placeholder: 'Заголовок',
                      },
                      content: {
                        value: '',
                        placeholder: 'Текст блока',
                      },
                    },
                  ],
                }));

                setTimeout(() => {
                  const sectionTitleElements =
                    document.querySelectorAll('.section__title');
                  const lastSectionTitleElement =
                    sectionTitleElements[sectionTitleElements.length - 1];
                  if (lastSectionTitleElement) {
                    (lastSectionTitleElement as HTMLElement).focus();
                    (lastSectionTitleElement as HTMLElement).scrollIntoView();
                  }
                }, 50);
              }}
            >
              <Plus size={15 * SCALE_FACTOR} />
              {/*<span>Добавить блок</span>*/}
            </button>
          </div>
          <div
            style={{ width: `calc(125px * ${SCALE_FACTOR})`, flexShrink: 0 }}
          >
            <div
              style={{
                display: 'flex',
                gap: `calc(2px * ${SCALE_FACTOR})`,
                justifyContent: 'start',
                alignItems: 'stretch',
                marginBottom: `calc(10px * ${SCALE_FACTOR})`,
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
                  fontSize: `calc(12px * ${SCALE_FACTOR})`,
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
                  <Mars size={15 * SCALE_FACTOR} />
                ) : (
                  <Venus size={15 * SCALE_FACTOR} />
                )}
              </div>
            </div>

            <div
              style={{
                fontSize: `calc(9px * ${SCALE_FACTOR})`,
                lineHeight: '1.3',
                gap: `calc(6px * ${SCALE_FACTOR})`,
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
                      gap: `calc(2px * ${SCALE_FACTOR})`,
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
    </div>
  );
}
