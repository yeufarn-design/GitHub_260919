# 待辦清單 Web App

這是一個在 GitHub Copilot 實戰工作坊中完成的待辦清單 Web App。專案從基本的待辦管理開始，逐步加入主題切換、清單篩選與批次整理功能，並以純前端技術完成。

## 線上展示

[開啟 GitHub Pages](https://<你的帳號>.github.io/<你的repo名稱>/)

> 請將上方網址中的帳號與 repository 名稱替換成實際的 GitHub Pages 網址。

## 功能

- 新增待辦事項。
- 將待辦事項標記為已完成或未完成。
- 刪除單筆待辦事項。
- 顯示整體未完成待辦事項數量。
- 使用「全部」、「未完成」與「已完成」篩選清單。
- 篩選結果為空時顯示對應提示，說明資料仍保留在其他篩選條件中。
- 切換淺色與深色模式，並顯示對應圖示與文字。
- 依照使用者偏好保存主題設定；未手動設定時跟隨作業系統的 `prefers-color-scheme`。
- 保存目前的篩選條件，重新整理後維持原本的清單視圖。
- 批次清除所有已完成事項，操作前會顯示確認對話框。
- 沒有已完成事項時停用「清除已完成」按鈕。

## 技術

- 使用純 HTML、CSS 與原生 JavaScript。
- 不使用任何框架、套件或外部 CDN。
- 使用 CSS 變數管理主題與介面配色。
- 使用 `localStorage` 保存待辦資料、主題偏好與篩選條件。
- 透過 `textContent`、`createElement` 與事件委派產生及更新 DOM。

## 開發方式

- 使用 GitHub Copilot Agent Mode，讓 Agent 根據需求讀取專案、修改檔案並協助執行驗證。
- 透過 MCP 連接 Microsoft Learn 與 GitHub 工具，查詢官方文件、讀取 issue、檢查 repository 狀態，以及建立 Pull Request。
- 使用 `.github/prompts/fix-issue.prompt.md` 定義 agentic workflow，將讀取 issue、提出計畫、建立分支、修改、驗證、提交、推送與開 PR 的流程標準化。
- 使用 `.github/copilot-instructions.md` 記錄專案的技術限制、程式風格與協作規則。

## 我學到什麼

- 如何使用 GitHub Copilot Agent Mode 從需求開始，逐步完成前端功能與驗證。
- 如何使用 MCP 讓 AI 查詢 Microsoft Learn 文件與 GitHub repository 資訊。
- 如何將重複性的 issue 修正流程整理成可重複使用的 agentic workflow。
- 如何透過 Git 分支、commit 與 Pull Request 管理功能變更。
- 如何在實作深色模式時注意 `prefers-color-scheme` 與色彩對比等無障礙議題。
