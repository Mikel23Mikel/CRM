// Справочник этапов производства СХД.
// При подключении API (1С / Teamline) этот список можно заменить на загрузку с сервера.
export const STAGES = [
  { id: 'setup',      name: 'Постановка в производство', short: 'Постановка' },
  { id: 'docs',       name: 'Документация и спецификация', short: 'Документация' },
  { id: 'staging',    name: 'Стенд / примерка комплектации', short: 'Staging' },
  { id: 'frame',      name: 'Сборка каркаса (шасси)', short: 'Каркас' },
  { id: 'backplane',  name: 'Установка backplane', short: 'Backplane' },
  { id: 'bays',       name: 'Монтаж корзин накопителей', short: 'Корзины' },
  { id: 'psu',        name: 'Блоки питания (PSU)', short: 'PSU' },
  { id: 'cooling',    name: 'Система охлаждения', short: 'Охлаждение' },
  { id: 'controllers',name: 'Контроллеры', short: 'Контроллеры' },
  { id: 'io',         name: 'I/O модули и кабели', short: 'I/O' },
  { id: 'drives',     name: 'Накопители (SSD/HDD)', short: 'Накопители' },
  { id: 'labeling',   name: 'Маркировка и шильды', short: 'Маркировка' },
  { id: 'qc_assembly',name: 'ОТ сборки', short: 'ОТ сборки' },
  { id: 'burnin',     name: 'Старение (burn-in)', short: 'Старение' },
  { id: 'testing',    name: 'Функциональное тестирование', short: 'Тестирование' },
  { id: 'rework',     name: 'Доработка по замечаниям', short: 'Доработка' },
  { id: 'qc_final',   name: 'Финальная ОТ', short: 'Финальная ОТ' },
  { id: 'packing',    name: 'Упаковка', short: 'Упаковка' },
  { id: 'shipping',   name: 'Отгрузка', short: 'Отгрузка' },
]

export const stageById = (id) => STAGES.find((s) => s.id === id)
