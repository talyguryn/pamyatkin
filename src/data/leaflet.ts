import { LeafletData } from '@/types/leaflet';

export const defaultLeafletData: LeafletData = {
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
        placeholder: 'Заголовок',
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
        placeholder: 'Заголовок',
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
        placeholder: 'Заголовок',
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
        placeholder: 'Заголовок',
      },
      content: {
        value: '',
        placeholder: `Например, через 3 месяца после первой прививки. Это поможет питомцу защититься от инфекций и болезней. До второй прививки не гуляйте с питомцем на улице, чтобы он не подхватил инфекцию.`,
      },
    },
    {
      title: {
        value: 'Контактные данные',
        placeholder: 'Заголовок',
      },
      content: {
        value: '',
        placeholder:
          'Если у вас есть вопросы или нужна помощь, вы можете связаться с нами по телефону или электронной почте. Мы всегда готовы помочь вам и вашему питомцу.',
      },
    },
  ],
};
