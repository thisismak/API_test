const express = require('express');
const path = require('path'); // 備注：引入 path 模組，用於處理檔案路徑
const app = express();
const port = 3000;

// 備注：設置靜態檔案服務，將當前目錄（包含 index.html）的檔案提供給瀏覽器，非 RESTful API 功能
app.use(express.static('.'));

// 備注：明確定義根路徑（/），當用戶訪問 http://localhost:3000/ 時，返回 index.html，非 RESTful API
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 備注：模擬餐廳菜單資料，儲存在記憶體中，作為 RESTful API 的簡單資料庫
const menu = {
    pizza: { name: 'Margherita Pizza', price: 12.99, description: 'Classic pizza with tomato sauce and mozzarella cheese.' },
    burger: { name: 'Cheeseburger', price: 8.99, description: 'Juicy beef patty with cheddar cheese and fresh veggies.' },
    salad: { name: 'Caesar Salad', price: 6.99, description: 'Crisp romaine lettuce with Caesar dressing and croutons.' }
};

// 備注：定義 RESTful API 的 GET 端點，處理 /menu/:item 路徑的請求，例如 /menu/pizza
// RESTful 特徵：使用 GET 方法查詢資源，URI /menu/:item 表示特定菜品資源
app.get('/menu/:item', (req, res) => {
    // 備注：從 URL 參數中獲取菜品名稱（:item），並轉為小寫以確保一致性
    const item = req.params.item.toLowerCase();
    // 備注：記錄用戶請求的菜品名稱，方便除錯
    console.log(`User requested menu item: ${item}`);
    // 備注：檢查菜品是否存在於 menu 物件中
    if (menu[item]) {
        // 備注：如果存在，返回該菜品的 JSON 資料（例如 {name: "Margherita Pizza", ...}）
        // RESTful 特徵：返回 JSON 格式的資源表示，HTTP 狀態碼默認為 200
        res.json(menu[item]);
    } else {
        // 備注：如果不存在，返回 404 狀態碼和 JSON 錯誤訊息
        // RESTful 特徵：使用 404 狀態碼表示資源未找到，返回 JSON 格式錯誤
        res.status(404).json({ message: `Sorry, ${item} is not on the menu!` });
    }
});

// 備注：啟動伺服器，監聽 3000 埠，使 RESTful API 和靜態檔案可被訪問
app.listen(port, () => {
    console.log(`Restaurant server is running on http://localhost:${port}`);
});