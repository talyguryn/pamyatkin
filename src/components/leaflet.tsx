import React from 'react';

import EditableDiv from '@/components/editableDiv';
import { Mars, Venus, Plus } from 'lucide-react';
import { LeafletData, LeafletSection, LeafletTextfield } from '@/types/leaflet';
import { defaultLeafletData } from '@/data/leaflet';

const leafletDataLocalStorageKey = 'leafletData';

export default function Leaflet() {
  // if query parameter clear is present, clear localStorage
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const clear = urlParams.get('clear');
    if (clear === 'true') {
      localStorage.removeItem(leafletDataLocalStorageKey);
      console.log('Leaflet data cleared from localStorage');
      // Reset the leaflet data to default
      setLeafletData(defaultLeafletData);
    }
  }, []);

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

  /* on change of leafletData, update saved data in localStorage */
  React.useEffect(() => {
    localStorage.setItem(
      leafletDataLocalStorageKey,
      JSON.stringify(leafletData)
    );

    console.log('Leaflet data updated:', leafletData);
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
      className="bg-white pt-[32px] px-[28px] pb-[40px] shadow-2xl shadow-[#3e668861] w-[595px] min-h-[842px] relative"
      id="leaflet"
      style={{
        fontFamily: 'Arial, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        // transformOrigin: 'top',
        // transform: 'scale(1.5)',
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
            className="text-xs text-[#3e6688] hover:text-[#1c4c76] flex items-center gap-1"
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
            }}
          >
            <Plus size={15} />
            <span>Добавить блок</span>
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
                        const updatedAsideSection = [...prevData.asideSection];
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
                        const updatedAsideSection = [...prevData.asideSection];
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
  );
}
