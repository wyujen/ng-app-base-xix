# ng-app-base-xix

Angular Application Base — **XIX Generation**

`ng-app-base-xix` 是一個 **以 Angular Standalone 架構為核心**、  
專為 **可複製、可維護、可演進** 的前端專案所設計的 **應用程式地基（Application Base）**。

此專案**不是特定業務系統**，而是用來作為：

- 新 Angular 專案的起始模板
- 內部系統的前端標準地基
- 長期可升級的工程基礎

---

## 🎯 設計理念（Design Philosophy）


###  Base 只放「通用能力」，不放業務邏輯
本專案刻意 **不包含任何特定業務流程**（例如實際表單、報表、系統名稱等）。

原則：
- Base = 能力（Capability）
- Feature = 業務（Business）

---

### Standalone First
- 採用 **Angular Standalone Components**
- 不使用 NgModule
- 架構更直觀、拆分更容易、升級成本更低

---

### 明確分層，避免職責混亂
- 全域能力、共用元件、功能模組 **嚴格分離**
- 不允許 feature 反向依賴 core

---

## 🧱 專案架構（Project Structure）

```text
src/app/
├─ core/                      # 全域唯一（Singleton）能力
│  ├─ config/                 # App / Runtime 設定
│  ├─ guards/                 # Route Guards
│  ├─ interceptors/           # HTTP Interceptors
│  ├─ http/                   # 基礎 API 封裝
│  ├─ services/               # Auth / Alert / Global services
│  └─ store/                  # Signal-based Global State (Entity Store)
│
├─ shared/                    # 純共用（無業務）
│  ├─ components/             # 共用 UI 元件
│  ├─ models/                 # 共用 Model / DTO
│  ├─ utils/                  # 工具函式
│  └─ constants/              # 常數定義
│
├─ features/                  # 可選功能模組（業務導向）
│  ├─ pdf/                    # PDF 功能（可選）
│  └─ excel/                  # Excel 功能（可選）
│
├─ pages/                     # 實際頁面（login / forgot / etc）
│
├─ app.component.ts
├─ app.config.ts
└─ app.routes.ts
```

## 🧩 分層說明與放置原則

### `core/`（全站唯一）

- **只能有一份**
- 全站都可能使用
- 與業務無關

**包含內容：**
- Auth / JWT
- HTTP Interceptor
- Global Alert / Error handling
- Global Signal Entity Store（如 Session、System Config）

> ❗ **限制**
> - feature **不可依賴其他 feature**
> - shared **不可依賴 core**

---

### `shared/`（純共用）

- 不知道「目前是什麼系統」
- 不知道「現在在哪個頁面」
- 不含任何業務語意

**包含內容：**
- 共用 UI 元件
- 共用 validator / utils
- 共用 model / type

---

### `features/`（可選功能）

- 一個 feature = 一個自給自足的功能模組
- 可整包啟用 / 不啟用
- 與其他 feature 低耦合

**一個 feature 內可以包含：**
- state（Signal Store）
- data-access（HTTP API）
- models
- pages / components

---

### `pages/`

- 真正會出現在 Router 中的頁面
- Base 僅提供 **最小可用頁面**（例如 login）
- 實際業務系統可自由擴充
## ⚙️ 設定與可調整項目

### Angular 版本

- Angular Major：**19（XIX 世代）**
- 實際使用版本請以 `package.json` 為準

> 專案名稱中的 `xix` 僅代表世代識別，  
> 不代表精確版本號。

---

### UI 策略

- **Bootstrap-first**
- Angular Material 為 **可選**
- 不強制混用，避免 UI 與元件庫綁死

---

### 可選功能（Optional Features）

| 功能 | 說明 | 是否預設 |
|---|---|---|
| Bootstrap | 排版基礎 | ✅ |
| Angular Material | 表單元件 | ⛔ 可選 |
| PDF（pdfmake） | PDF 輸出 | ⛔ 可選 |
| Excel（exceljs） | Excel 匯入 / 匯出 | ⛔ 可選 |
| Wizard Skeleton | 多步驟流程骨架 | ⛔ 可選 |

---

## 📦 打包與部署（Build & Deploy）

### 開發模式（本機）

```bash
npm start
```

## 🐳 生產部署（正式環境）

> 本專案 **不直接使用 `ng build` 作為最終部署方式**。  
>  
> 正式環境一律以 **Docker / docker-compose** 作為建置與部署入口。

---

### 部署流程總覽

正式環境建議流程如下：

1. 使用 **Docker** 建立應用程式映像（Image）
2. 由 **docker-compose**（或 k8s）負責服務啟動與管理
3. **Angular build 僅在容器內執行**
4. 由 **Nginx** 提供編譯後的靜態檔案（SPA）

---

### 正式部署指令（docker-compose）

```bash
docker compose up -d
```


