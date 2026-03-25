export default async function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).send("ok");
  }

  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const body = req.body;
    const events = body.events || [];

    for (const event of events) {
      if (event.type !== "message") continue;
      if (event.message.type !== "text") continue;

      const userText = (event.message.text || "").trim();
      const replyToken = event.replyToken;

      let replyText =
        "您好，歡迎來到 A.N.H Hair Salon（預約制）✨\n\n" +
        "可輸入以下關鍵字查詢：\n" +
        "預約 / 改時間 / 取消 / 地址 / 營業時間 / 價格 / 設計師 / 停車";

      if (/預約|我要預約|想預約|可以預約嗎|有空嗎/.test(userText)) {
        replyText =
          "您好，歡迎預約 A.N.H Hair Salon（預約制）✨\n\n" +
          "請點擊預約系統填寫資料：\n" +
          "【你的預約網址】\n\n" +
          "送出後會由店家確認時間，確認後才算預約成功。";
      } else if (/改時間|改期|延期/.test(userText)) {
        replyText =
          "您好，如需改時間，請提供以下資訊，我們會盡快協助您處理🙏\n\n" +
          "姓名：\n原預約日期：\n原預約時間：";
      } else if (/取消|取消預約/.test(userText)) {
        replyText =
          "您好，如需取消預約，請提供以下資訊，我們會盡快為您處理🙏\n\n" +
          "姓名：\n預約日期：\n預約時間：";
      } else if (/地址|在哪|地點|位置|怎麼去/.test(userText)) {
        replyText =
          "📍 A.N.H Hair Salon（預約制）\n\n" +
          "地圖位置：\n" +
          "https://share.google/k6jhT8kWFv3qTWnoY";
      } else if (/營業時間|幾點開|幾點關|今天有開嗎/.test(userText)) {
        replyText =
          "A.N.H Hair Salon（預約制）\n\n" +
          "營業時間請依店家公告與預約安排為主。\n" +
          "建議先使用預約系統預約，或直接私訊詢問可預約時段✨";
      } else if (/價格|多少錢|剪髮多少|染髮多少|費用|價目表/.test(userText)) {
        replyText =
          "A.N.H Hair Salon 價格參考✨\n\n" +
          "成人剪髮：250\n" +
          "學生剪髮：150\n" +
          "洗髮：200 起\n" +
          "染髮：1500 起\n" +
          "燙髮：1500 起\n" +
          "護髮：1000 起\n\n" +
          "實際價格依髮量、長度、設計項目調整。";
      } else if (/設計師|指定設計師|可以指定嗎/.test(userText)) {
        replyText =
          "您好，可以指定設計師✨\n\n" +
          "預約時可直接於備註填寫，\n" +
          "也可以私訊告知您的需求與想做的風格。";
      } else if (/停車|停車場|車位/.test(userText)) {
        replyText =
          "您好，建議可先參考店址附近停車空間，\n" +
          "詳細位置可先查看地圖：\n" +
          "https://share.google/k6jhT8kWFv3qTWnoY";
      } else if (/現場|walk in|不用預約|直接去/.test(userText)) {
        replyText =
          "您好，A.N.H Hair Salon 為預約制✨\n\n" +
          "建議先透過預約系統或私訊確認時段，避免久候或撲空。";
      }

      await fetch("https://api.line.me/v2/bot/message/reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
        },
        body: JSON.stringify({
          replyToken,
          messages: [
            {
              type: "text",
              text: replyText
            }
          ]
        })
      });
    }

    return res.status(200).send("ok");
  } catch (error) {
    console.error(error);
    return res.status(500).send("error");
  }
}