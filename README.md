# План производства СХД — диаграмма Ганта

Web-интерфейс планирования производства систем (СХД) на двух площадках: Москва и Тверь.
19 этапов: от Постановки до Отгрузки. Стиль — MS Project.

## Запуск локально
```bash
npm install
npm run dev        # http://localhost:5173 — мгновенное обновление страницы при правке кода
```

## Публикация на GitHub Pages (автоматически)
Каждый `git push` в ветку main/master запускает сборку `.github/workflows/deploy.yml`,
и через ~1–2 минуты сайт обновляется по адресу:
https://Mikel23Mikel.github.io/CRM/

Требование: Settings → Pages → Source = **GitHub Actions** (один раз).

## Структура
- `src/data/stages.js` — справочник этапов производства (правьте под ваш реальный маршрут)
- `src/data/orders.js` — системы/заказы; сюда позже подключается API из 1С и Teamline
- `src/Gantt.jsx` — диаграмма Ганта; `src/StageBoard.jsx` — лента этапов; `src/Systems.jsx` — карточки систем

## Дальнейшие интеграции (API)
Целевая схема одной системы: `{ serial, model, customer, site: "msk"|"tver", priority, plannedShip,
stages: [{ id, start, finish, progress, status: "done"|"active"|"pending"|"blocked" }] }`.
Почтовые алерты — генерировать на бэкенде при смене статуса этапа.
