### 網站安裝方法
#### 初始化 Node.js 專案，自動生成 package.json 檔案。
npm init -y
#### 安裝 Express 框架作為專案的依賴
npm install express
#### 啟動 Node.js 伺服器，運行 server.js 檔案，啟動餐廳菜單應用程式。
node server.js

---

### **步驟詳解：從選擇菜式到顯示菜式內容**

#### **步驟 1：用戶在前端選擇菜式**
- **描述**：客戶打開瀏覽器，訪問 `http://localhost:3000/`，載入 `index.html`，並在下拉選單中選擇一個菜式（例如 "Pizza"）。
- **程式碼相關**（`index.html`）：
  ```html
  <select id="dishSelect">
      <option value="pizza">Pizza</option>
      <option value="burger">Burger</option>
      <option value="salad">Salad</option>
  </select>
  ```
- **細節**：
  - 瀏覽器渲染 `index.html`，顯示一個標題「Restaurant Menu」、一個下拉選單（`<select>`）和一個「Get Details」按鈕。
  - 用戶在 `<select id="dishSelect">` 中選擇一個選項，例如 `<option value="pizza">Pizza</option>`，此時 `dishSelect` 的值被設為 `pizza`。
- **結果**：用戶選擇了菜式（例如 "pizza"），但尚未觸發任何後端交互。

---

#### **步驟 2：用戶點擊「Get Details」按鈕**
- **描述**：用戶點擊「Get Details」按鈕，觸發 JavaScript 中的 `fetchDish` 函數。
- **程式碼相關**（`index.html`）：
  ```html
  <button onclick="fetchDish()">Get Details</button>
  ```
  ```javascript
  async function fetchDish() {
      const dish = document.getElementById('dishSelect').value;
      const resultDiv = document.getElementById('result');
      ...
  }
  ```
- **細節**：
  - 按鈕的 `onclick="fetchDish()"` 屬性呼叫 `fetchDish` 函數。
  - `fetchDish` 函數開始執行，獲取 `<select id="dishSelect">` 的值（例如 `dish = "pizza"`）。
  - 同時，獲取 `<div id="result">` 元素，準備用於顯示結果。
- **結果**：`fetchDish` 函數啟動，準備發送請求。

---

#### **步驟 3：前端顯示「Loading...」提示**
- **描述**：在發送請求之前，前端更新 `<div id="result">`，顯示「Loading...」以提示用戶正在處理請求。
- **程式碼相關**（`index.html`）：
  ```javascript
  resultDiv.innerHTML = 'Loading...';
  ```
- **細節**：
  - `resultDiv` 是 `<div id="result">` 的 DOM 元素。
  - 設置 `resultDiv.innerHTML = 'Loading...'`，將 `<div id="result">` 的內容更新為「Loading...」。
  - 這是一個用戶體驗優化，告知用戶系統正在處理請求。
- **結果**：網頁上的 `<div id="result">` 顯示「Loading...」。

---

#### **步驟 4：前端發送 GET 請求到後端**
- **描述**：前端使用 `fetch` API 發送 GET 請求到後端的 API 端點，例如 `http://localhost:3000/menu/pizza`。
- **程式碼相關**（`index.html`）：
  ```javascript
  const response = await fetch(`http://localhost:3000/menu/${dish}`);
  ```
- **細節**：
  - `dish` 是用戶選擇的值（例如 `"pizza"`）。
  - `fetch(`http://localhost:3000/menu/${dish}`)` 構造 URL，例如 `http://localhost:3000/menu/pizza`，並發送 GET 請求。
  - `fetch` 是瀏覽器內建的 API，支援非同步操作，返回一個 Promise。
  - `await` 確保程式等待伺服器回應後再繼續執行。
- **結果**：瀏覽器向伺服器發送 HTTP GET 請求：
  ```
  GET /menu/pizza HTTP/1.1
  Host: localhost:3000
  ```

---

#### **步驟 5：後端接收並處理 GET 請求**
- **描述**：後端的 Express 伺服器接收到 GET 請求，匹配 `/menu/:item` 路由，並處理請求。
- **程式碼相關**（`server.js`）：
  ```javascript
  app.get('/menu/:item', (req, res) => {
      const item = req.params.item.toLowerCase();
      console.log(`User requested menu item: ${item}`);
      if (menu[item]) {
          res.json(menu[item]);
      } else {
          res.status(404).json({ message: `Sorry, ${item} is not on the menu!` });
      }
  });
  ```
- **細節**：
  - Express 監聽 3000 埠，接收到 `GET /menu/pizza` 請求。
  - `:item` 是路由的動態參數，`req.params.item` 獲取值 `"pizza"`，並通過 `.toLowerCase()` 轉為小寫，確保一致性。
  - `console.log(`User requested menu item: ${item}`)` 在伺服器控制台輸出「User requested menu item: pizza」，用於除錯。
  - 檢查 `menu` 物件是否包含 `item`（即 `menu.pizza`）。
  - **情況 1：菜品存在**（例如 `menu.pizza` 存在）：
    - `menu.pizza` 返回物件：
      ```javascript
      { name: 'Margherita Pizza', price: 12.99, description: 'Classic pizza with tomato sauce and mozzarella cheese.' }
      ```
    - `res.json(menu[item])` 將物件轉為 JSON，設置 HTTP 狀態碼為 200（預設），並返回：
      ```json
      {"name": "Margherita Pizza", "price": 12.99, "description": "Classic pizza with tomato sauce and mozzarella cheese."}
      ```
  - **情況 2：菜品不存在**（例如請求 `/menu/pasta`）：
    - 返回 HTTP 狀態碼 404 和 JSON：
      ```json
      {"message": "Sorry, pasta is not on the menu!"}
      ```
- **結果**：後端根據請求返回 JSON 回應（成功或錯誤）。

---

#### **步驟 6：前端檢查回應狀態**
- **描述**：前端接收後端的回應，並檢查是否成功（HTTP 狀態碼 200-299）。
- **程式碼相關**（`index.html`）：
  ```javascript
  if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
  }
  ```
- **細節**：
  - `response` 是 `fetch` 返回的 Response 物件，包含 HTTP 狀態碼和回應內容。
  - `response.ok` 檢查狀態碼是否在 200-299 範圍（表示成功）。
  - 如果 `response.ok` 為 `false`（例如 404），拋出錯誤，進入 `catch` 塊。
  - 例如：
    - 對於 `GET /menu/pizza`，狀態碼為 200，`response.ok` 為 `true`，繼續執行。
    - 對於 `GET /menu/pasta`，狀態碼為 404，`response.ok` 為 `false`，拋出錯誤。
- **結果**：確認回應是否成功，決定下一步處理。

---

#### **步驟 7：前端解析 JSON 回應**
- **描述**：如果回應成功，前端將回應內容解析為 JavaScript 物件。
- **程式碼相關**（`index.html`）：
  ```javascript
  const data = await response.json();
  ```
- **細節**：
  - `response.json()` 將後端的 JSON 回應轉為 JavaScript 物件。
  - 例如，後端返回：
    ```json
    {"name": "Margherita Pizza", "price": 12.99, "description": "Classic pizza with tomato sauce and mozzarella cheese."}
    ```
    `data` 成為：
    ```javascript
    { name: "Margherita Pizza", price: 12.99, description: "Classic pizza with tomato sauce and mozzarella cheese." }
    ```
  - 如果後端返回錯誤（例如 404）：
    ```json
    {"message": "Sorry, pasta is not on the menu!"}
    ```
    `data` 成為：
    ```javascript
    { message: "Sorry, pasta is not on the menu!" }
    ```
- **結果**：前端獲得解析後的 `data` 物件，準備渲染。

---

#### **步驟 8：前端根據回應內容更新頁面**
- **描述**：前端根據解析的 `data` 物件，更新 `<div id="result">` 的內容，顯示菜品資訊或錯誤訊息。
- **程式碼相關**（`index.html`）：
  ```javascript
  if (data.message) {
      resultDiv.innerHTML = `<p class="error">${data.message}</p>`;
  } else {
      resultDiv.innerHTML = `
          <h3>${data.name}</h3>
          <p>Price: $${data.price}</p>
          <p>Description: ${data.description}</p>
      `;
  }
  ```
- **細節**：
  - **情況 1：菜品存在（無 `data.message`）**：
    - 例如，`data = { name: "Margherita Pizza", price: 12.99, description: "Classic..." }`。
    - `resultDiv.innerHTML` 更新為：
      ```html
      <h3>Margherita Pizza</h3>
      <p>Price: $12.99</p>
      <p>Description: Classic pizza with tomato sauce and mozzarella cheese.</p>
      ```
    - 這些 HTML 內容被渲染到 `<div id="result">`，顯示菜品名稱、價格和描述。
  - **情況 2：菜品不存在（有 `data.message`）**：
    - 例如，`data = { message: "Sorry, pasta is not on the menu!" }`。
    - `resultDiv.innerHTML` 更新為：
      ```html
      <p class="error">Sorry, pasta is not on the menu!</p>
      ```
    - `.error` 類別應用 CSS 樣式（`color: red`），錯誤訊息以紅色顯示。
- **結果**：網頁顯示最終內容（菜品資訊或錯誤訊息）。

---

#### **步驟 9：錯誤處理（如果發生異常）**
- **描述**：如果 GET 請求失敗（例如網絡問題或伺服器錯誤），前端捕獲錯誤並顯示。
- **程式碼相關**（`index.html`）：
  ```javascript
  catch (error) {
      resultDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
  }
  ```
- **細節**：
  - 可能的錯誤包括：
    - 網絡問題（伺服器未運行，無法連接到 `http://localhost:3000`）。
    - HTTP 錯誤（例如 404，`response.ok` 為 `false`）。
  - 例如，如果伺服器未啟動，`error.message` 可能是「Failed to fetch」，則 `<div id="result">` 顯示：
    ```html
    <p class="error">Error: Failed to fetch</p>
    ```
  - 錯誤訊息以紅色顯示（`.error` 樣式）。
- **結果**：用戶看到錯誤提示，了解請求失敗。

---

### **完整流程總結**
以下是從用戶選擇菜式到網站顯示菜式內容的步驟（假設選擇 "pizza"）：
1. **用戶選擇菜式**：在 `<select id="dishSelect">` 選擇 "Pizza"。
2. **點擊按鈕**：點擊「Get Details」，觸發 `fetchDish()`。
3. **顯示 Loading**：`<div id="result">` 顯示「Loading...」。
4. **發送 GET 請求**：前端發送 `GET /menu/pizza` 到 `http://localhost:3000/menu/pizza`。
5. **後端處理**：Express 匹配 `/menu/:item`，從 `menu` 物件獲取 `pizza` 資料，返回 JSON：
   ```json
   {"name": "Margherita Pizza", "price": 12.99, "description": "Classic pizza with tomato sauce and mozzarella cheese."}
   ```
6. **檢查回應**：前端確認 HTTP 狀態碼為 200（`response.ok` 為 `true`）。
7. **解析 JSON**：將回應解析為 JavaScript 物件 `data`。
8. **更新頁面**：根據 `data`，將 `<div id="result">` 更新為：
   ```html
   <h3>Margherita Pizza</h3>
   <p>Price: $12.99</p>
   <p>Description: Classic pizza with tomato sauce and mozzarella cheese.</p>
   ```
9. **錯誤處理（如果發生）**：若請求失敗（例如伺服器不可用），顯示錯誤訊息（紅色）。

---

### **生活化比喻**
- 就像您在餐廳點餐：
  1. 您在菜單上選好披薩（選擇 "pizza"）。
  2. 您告訴服務員（點擊「Get Details」）。
  3. 服務員說「請稍等」（顯示「Loading...」）。
  4. 服務員去廚房查詢（發送 GET 請求）。
  5. 廚房提供披薩的資訊（後端返回 JSON）。
  6. 服務員確認資訊正確（檢查 `response.ok`）。
  7. 服務員將資訊整理成表格（解析 JSON）。
  8. 服務員告訴您披薩的價格和描述（更新 `<div id="result">`）。
  9. 如果廚房沒找到菜品或服務員走錯地方（錯誤），您會得到一個道歉（顯示錯誤訊息）。

---

### **技術細節補充**
- **前端技術**：
  - HTML：提供下拉選單和按鈕。
  - CSS：美化頁面，設置錯誤訊息為紅色。
  - JavaScript：使用 `fetch` 和 DOM 操作（`innerHTML`）處理請求和渲染。
- **後端技術**：
  - Node.js 和 Express：處理 GET 請求，返回 JSON。
  - `menu` 物件：模擬資料庫，儲存菜品資料。
- **依賴管理**：
  - `package.json` 和 `package-lock.json` 確保 Express 及其依賴正確安裝。
- **HTTP 協議**：
  - GET 請求使用 RESTful API 風格，URL 為 `/menu/:item`。
  - JSON 作為資料交換格式，標準化前端後端通信。

---

### **如果菜品不存在（例如請求 `/menu/pasta`）**
- **步驟變化**：
  - 步驟 5：後端返回：
    ```json
    {"message": "Sorry, pasta is not on the menu!"}
    ```
    HTTP 狀態碼為 404。
  - 步驟 6：`response.ok` 為 `false`，拋出錯誤，但 `response.json()` 仍可解析。
  - 步驟 7：解析得到 `data = { message: "Sorry, pasta is not on the menu!" }`。
  - 步驟 8：顯示：
    ```html
    <p class="error">Sorry, pasta is not on the menu!</p>
    ```

---

### **如果您想進一步改進**
- **前端**：添加更詳細的 Loading 動畫（例如 spinner）。
- **後端**：使用資料庫（如 MongoDB）取代 `menu` 物件，支援更多菜品。
- **錯誤處理**：提供更具體的錯誤訊息（例如區分網絡錯誤和 404）。
- **新功能**：添加「獲取所有菜品」的 API（`GET /menu`）。

如果您有其他問題或想深入某個步驟（例如如何改進前端顯示或後端處理），請告訴我，我可以提供具體程式碼和建議！