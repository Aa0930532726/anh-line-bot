# ANH LINE Webhook

## 部署步驟
1. 上傳到 GitHub 新專案
2. 用 Vercel 匯入該 GitHub 專案
3. 在 Vercel > Settings > Environment Variables 新增：
   - `LINE_CHANNEL_ACCESS_TOKEN` = 你的 LINE Channel access token
4. 重新部署
5. 把 LINE Developers 的 Webhook URL 設成：
   - `https://你的vercel網址/api/line/webhook`

## 測試
打開：
- `/api/line/webhook`
應顯示：
- `{ "ok": true, "message": "LINE webhook is running" }`
