"use client";
import React, { useState, useRef } from 'react';
import MultiPageLeaflet, { MultiPageLeafletHandle } from '../components/Leaflet/MultiPageLeaflet';
import ImageBlock from '../components/Leaflet/ImageBlock';
import TextBlock from '../components/Leaflet/TextBlock';
import SectionBlock from '../components/Leaflet/SectionBlock';
import {
  exportElementsToPngPages,
  exportElementsToPdfPages,
} from '../utils/export';

export default function Home() {
  const leafletRef = useRef<MultiPageLeafletHandle>(null);
  // Content state
  const [image, setImage] = useState<string | null>(null);

  const [title, setTitle] = useState('Уход за питомцем');
  const [petName, setPetName] = useState('');
  const [description, setDescription] = useState('');
  const [firstDayTitle, setFirstDayTitle] = useState('Помогите обустроиться');
  const [firstDayText, setFirstDayText] = useState(`Первые 2–3 дня нужно ограничить пространство одной комнатой. В свободном доступе у котёнка в этой комнате должны быть миски с водой, едой и лоток. Это делается для того, чтобы котёнок не растерялся в новом месте. Для него все будет новым: место, люди, запахи, лоток. Поэтому очень важно, чтобы все было в зоне его досягаемости. Когда увидите, что он чётко ходит в лоток, признал его своим — можете переставить лоток в другое место. Но обязательно покажите его котёнку, чтобы он не потерял лоток. Посадите котёнка в лоток, чтобы он сам вышел из него.
Первые пару дней он может плохо кушать или даже не кушать совсем. Не пугайтесь, такое бывает в первые дни — он покушает ночью, когда все будут спать. Потом все наладится. Можете предложить котёнку влажный корм для аппетита.`);
  const [feedingTitle, setFeedingTitle] = useState('Подберите правильный корм');
  const [feedingText, setFeedingText] = useState(`Свежая питьевая вода и сухой корм всегда должны быть в доступе для питомца. Влажный корм для котят до года или премиум класса можно давать один раз в день.
В качестве сухого корма используйте «Proplan для котят», а из влажных подойдут «Royal Canin Kitten Instinctive для котят» и паштет «Royal Canin Babycat Instinctive».
Дополнительно питомцу можно давать: вареное постное мясо или сырое, промороженное не менее суток в морозилке. Также можно предлагать творог, йогурт без добавок, сметану, сыр. Варёное куриное или перепелиное яйцо 1 раз в неделю.
Котёнку нельзя давать сладкое, солёное, маринованное, копчёное и острое.`);
  const [vaccinationTitle, setVaccinationTitle] = useState('Оставляйте корм в свободном доступе');
  const [vaccinationText, setVaccinationText] = useState(`Сухой корм у котят всегда должен быть в свободном доступе. Это делается для того, чтобы котёнок не переедал. Если его кормить по часам, то он будет стараться съесть как можно больше, думая что в следующий раз не покормят. Если после этого котёнок попьёт водички, то съеденный в большом объёме корм разбухнет в желудке у котёнка, и он начнёт его срыгивать.
Поэтому миску с кормом лучше держать в свободном доступе. Так он научится есть столько, сколько ему нужно: будет много раз за день подходить к миске и кушать по чуть-чуть.`);

  // Handle image upload
  const onImageChange = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  // Assemble blocks
  const blocks = [
    <div className='flex justify-between' key="cover">
      <TextBlock
        tag="h1"
        key="title"
        placeholder="Имя питомца"
        onChange={setTitle}
        value={title}
        className="text-[32px] leading-[1] font-bold m-0 p-0"
      />
      <ImageBlock key="image" image={image} onImageChange={onImageChange} className='w-[125px] h-[125px]' />
    </div>,
    ,
    // <TextBlock
    //   key="petName"
    //   tag="h3"
    //   placeholder="Имя питомца"
    //   value={petName}
    //   onChange={setPetName}
    //   className="text-5xl font-bold pt-4"
    // />,
    // <TextBlock
    //   key="description"
    //   tag="div"
    //   placeholder="Описание"
    //   value={description}
    //   onChange={setDescription}
    //   className="text-xl py-2"
    // />,
    <SectionBlock
      key="firstDay"
      titlePlaceholder="Подберите правильный корм"
      textPlaceholder="Рекомендации по подготовке дома к появлению животного"
      title={firstDayTitle}
      text={firstDayText}
      onTitleChange={setFirstDayTitle}
      onTextChange={setFirstDayText}
    />,
    <SectionBlock
      key="feeding"
      titlePlaceholder="Питание"
      textPlaceholder="Чем, сколько и как часто кормить. Что вредно для животного."
      title={feedingTitle}
      text={feedingText}
      onTitleChange={setFeedingTitle}
      onTextChange={setFeedingText}
    />,
    <SectionBlock
      key="vaccination"
      titlePlaceholder="Прививки"
      textPlaceholder="Когда и какие прививки делать. Когда делать повторные прививки."
      title={vaccinationTitle}
      text={vaccinationText}
      onTitleChange={setVaccinationTitle}
      onTextChange={setVaccinationText}
    />,
  ];

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gray-100">
      {/* Render paginated leaflet with provided blocks */}
      <MultiPageLeaflet ref={leafletRef} blocks={blocks} />

      {/* Export buttons */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2">
        <button
          className="px-8 py-2 bg-[#3395F7] text-white rounded hover:bg-[#3378f7] active:bg-[#3357f7] cursor-pointer"
          onClick={() =>
            exportElementsToPdfPages(
              leafletRef.current?.pageRefs || [],
              'leaflet.pdf',
            )
          }
        >
          Скачать ПДФ
        </button>
        {/* <button
          className="px-8 py-2 bg-[#3395F7] text-white rounded hover:bg-[#3378f7] active:bg-[#3357f7]"
          onClick={() =>
            exportElementsToPngPages(
              leafletRef.current?.pageRefs || [],
              'leaflet',
            )
          }
        >
          Скачать ПНГ (по страницам)
        </button> */}
      </div>
    </div>
  );
}
