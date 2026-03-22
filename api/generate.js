export default async function handler(req, res) {
    // CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    try {
        const body = req.body || {};
        const title = body.title || "Bài Bolero";
        const prompt = body.prompt || "tình yêu buồn";

        // 👉 Kiểm tra API KEY
        if (!process.env.OPENAI_API_KEY) {
            return res.status(200).json({
                lyrics: "❌ Chưa cấu hình API KEY trên Vercel",
                audioUrl: ""
            });
        }

        // 👉 Gọi OpenAI
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + process.env.OPENAI_API_KEY
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "user",
                        content: `Viết bài Bolero hoàn chỉnh. Tiêu đề: ${title}. Nội dung: ${prompt}`
                    }
                ]
            })
        });

        const data = await response.json();

        // 👉 Nếu OpenAI lỗi
        if (data.error) {
            return res.status(200).json({
                lyrics: "❌ Lỗi OpenAI: " + data.error.message,
                audioUrl: ""
            });
        }

        const lyrics =
            data?.choices?.[0]?.message?.content ||
            "Không tạo được lời";

        return res.status(200).json({
            lyrics,
            audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        });

    } catch (error) {
        return res.status(200).json({
            lyrics: "❌ Server crash: " + error.toString(),
            audioUrl: ""
        });
    }
}
