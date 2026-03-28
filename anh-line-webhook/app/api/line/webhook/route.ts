import { NextRequest, NextResponse } from "next/server";

const HOLIDAY_URL =
  "https://69c6330c456bd68ec02e0e7b--fancy-lily-0517dc.netlify.app/";

const ADDRESS = "台中市大雅區秀山里平和二路12號";
const MAP_URL =
  "https://www.google.com/maps/search/?api=1&query=台中市大雅區秀山里平和二路12號";

function getReplyText(userMessage: string): string | null {
  const msg = userMessage.trim();

  if (
    msg.includes("地址") ||
    msg.includes("在哪") ||
    msg.includes("位置") ||
    msg.includes("怎麼去") ||
    msg.includes("地點") ||
    msg.includes("店在哪")
  ) {
    return `📍店面地址：\n${ADDRESS}\n\n🗺 Google地圖：\n${MAP_URL}`;
  }

  if (
    msg.includes("公休") ||
    msg.includes("休假") ||
    msg.includes("店休") ||
    msg.includes("哪天休") ||
    msg.includes("休假表")
  ) {
    return `您好～最新公休日請參考：\n${HOLIDAY_URL}`;
  }

  if (
    msg.includes("營業時間") ||
    msg.includes("幾點開") ||
    msg.includes("幾點關") ||
    msg.includes("今天有開") ||
    msg.includes("現在有開") ||
    msg.includes("今天營業") ||
    msg.includes("有開嗎")
  ) {
    return "您好～營業時間為早上 09:00 到晚上 20:00。";
  }

  if (
    msg.includes("預約") ||
    msg.includes("可以約") ||
    msg.includes("想約") ||
    msg.includes("我要約")
  ) {
    return "您好～可以幫您預約喔 😊\n請直接提供想要的日期、時間與服務項目，我們幫您確認。";
  }

  if (
    msg.includes("洗加剪") ||
    msg.includes("剪髮多少") ||
    msg.includes("剪頭髮") ||
    msg.includes("剪髮")
  ) {
    return "您好～\n洗加剪（成人）$450\n洗加剪（學生／國中以下）$350\n\n單剪 $250 UP\n學生剪髮 $150 UP";
  }

  if (msg.includes("染")) {
    return "您好～染髮價格如下：\n染髮單步驟 $1500 UP\n染髮雙步驟 $2500 UP\n隔離含護髮 +$500\n\n長度加價：\n及肩 +$200\n及胸 +$500\n及腰 +$800";
  }

  if (msg.includes("燙")) {
    return "您好～燙髮價格如下：\n燙髮 $1500 UP\n離子燙／溫塑燙 $2000 UP\n燙髮＋護髮 +$500\n\n長度加價：\n及肩 +$200\n及胸 +$500\n及腰 +$800";
  }

  if (msg.includes("護髮")) {
    return "您好～結構式護髮項目如下：\n源氏護髮 $1500（不含長度費）\n黑曜光感護髮 $1800（不含長度費）\n金耀煥生工程護髮 $2000（不含長度費）\n女神護髮 $2000（不含長度費）\n\n長度加價：\n及肩 +$200\n及胸 +$500\n及腰 +$800";
  }

  if (
    msg.includes("洗髮") ||
    msg.includes("洗頭") ||
    msg.includes("頭皮護理") ||
    msg.includes("頭皮")
  ) {
    return "您好～洗護項目如下：\n一般洗髮 $200 UP\n健康洗髮 $790 UP\n頭皮健康環境重建護理 $1590 UP";
  }

  if (
    msg.includes("價目") ||
    msg.includes("價格") ||
    msg.includes("多少") ||
    msg.includes("費用") ||
    msg.includes("怎麼算")
  ) {
    return "您好～這是 A.N.H 價目表：\n\n【剪髮】\n剪髮 $250 UP\n學生剪髮 $150 UP\n洗加剪（成人）$450\n洗加剪（學生／國中以下）$350\n\n【洗髮】\n一般洗髮 $200 UP\n健康洗髮 $790 UP\n頭皮健康環境重建護理 $1590 UP\n\n【染髮】\n染髮單步驟 $1500 UP\n染髮雙步驟 $2500 UP\n隔離含護髮 +$500\n\n【燙髮】\n燙髮 $1500 UP\n離子燙／溫塑燙 $2000 UP\n燙髮＋護髮 +$500\n\n【結構式護髮】\n源氏護髮 $1500（不含長度費）\n黑曜光感護髮 $1800（不含長度費）\n金耀煥生工程護髮 $2000（不含長度費）\n女神護髮 $2000（不含長度費）\n\n【長度加價】\n及肩 +$200\n及胸 +$500\n及腰 +$800\n\n※價格依髮量與實際狀況調整";
  }

  if (msg.includes("在嗎") || msg.includes("你好") || msg.includes("哈囉")) {
    return "您好～在喔 😊\n請問想詢問價格、營業時間、公休日，還是地址呢？";
  }

  return null;
}

async function replyToLine(replyToken: string, text: string) {
  const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;

  if (!channelAccessToken) {
    console.error("Missing LINE_CHANNEL_ACCESS_TOKEN");
    return;
  }

  const response = await fetch("https://api.line.me/v2/bot/message/reply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${channelAccessToken}`,
    },
    body: JSON.stringify({
      replyToken,
      messages: [
        {
          type: "text",
          text,
        },
      ],
    }),
  });

  const resultText = await response.text();

  if (!response.ok) {
    console.error("LINE reply failed:", response.status, resultText);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body?.events || body.events.length === 0) {
      return NextResponse.json({ ok: true, message: "No events" }, { status: 200 });
    }

    for (const event of body.events) {
      if (event.type !== "message") continue;
      if (event.message?.type !== "text") continue;
      if (!event.replyToken) continue;

      const userMessage = event.message.text || "";
      const replyText = getReplyText(userMessage);

      if (replyText) {
        await replyToLine(event.replyToken, replyText);
      }
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("LINE webhook error:", error);
    return NextResponse.json({ ok: true, error: "handled" }, { status: 200 });
  }
}

export async function GET() {
  return NextResponse.json(
    { ok: true, message: "LINE webhook is running" },
    { status: 200 }
  );
}
