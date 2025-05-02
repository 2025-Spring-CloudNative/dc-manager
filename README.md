# DCMS Rack Management System – frontend

使用 **React + TypeScript + Vite + SCSS** 開發

---

## overall structure

```
src/
├── assets/                # 圖片與靜態資源
├── components/            # 元件模組（含 mainpage / ManagementPage / shared）
├── pages/                 # mainpage與ManagementPage
├── lib/                   # 公用function(ex: cn()）
├── router.tsx             # React Router 設定
└── main.tsx               # 應用主進入點
```

---



### installation

```bash
npm install
```

### development

```bash
npm run dev
```

瀏覽器打開：http://localhost:5173

---


##  主要功能模組說明

###  `MainPage`

-  `/` router
- 使用元件：`Card`

###  `ManagementPage`

-  `/ManagementPage` router
- 功能包含：
  - 搜尋欄與清除按鈕
  - 篩選按鈕（FilterButton）
  - 表格展示（RackSummaryTable）
  - 可點選的機櫃表格（FavoriteRackMap）

---

## Style

- 使用 **SCSS Modules** 管理元件樣式
- 全域變數在 `styleguide.css` 定義
- 統一使用 Radix UI 作為基礎元件庫（如 Separator）(from CHAT)

---

## Component Standards

- every component composed of：
  - `Component.tsx` 主檔案
  - `Component.module.scss` 樣式模組
  - `index.ts` 作為導出（若屬複用元件）

- 範例：

```
components/
└── ManagementPage/
    └── FilterButton/
        ├── FilterButton.tsx
        ├── FilterButton.module.scss
        └── index.ts
```

- `Button`, `Input`, `NvBar`, `Table`, `Separator` are Reusable Component，
放於 `components/shared中`

- `Card`在MainPage 和Management Page 中不同，因此分開存放



---
