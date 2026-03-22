export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");

    const body = req.body || {};
    const title = body.title || "Bài Bolero";
    const prompt = body.prompt || "tình yêu buồn";

    try {
        const response = await fetch(
            "https://router.huggingface.co/hf-inference/models/bigscience/bloom",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    inputs: `Viết bài Bolero: ${title}, nội dung: ${prompt}`
                })
            }
        );

        const text = await response.text();

        let data;

        try {
            data = JSON.parse(text);
        } catch (e) {
            return res.status(200).json({
                lyrics: "❌ HuggingFace trả HTML → bị chặn hoặc lỗi",
                audioUrl: ""
            });
        }

        let lyrics = "";

        if (Array.isArray(data) && data[0]?.generated_text) {
            lyrics = data[0].generated_text;
        } else if (data?.error) {
            lyrics = "❌ AI lỗi: " + data.error;
        } else {
            lyrics = "❌ Không tạo được";
        }

        // 👉 fallback chống fail
        if (!lyrics || lyrics.startsWith("❌")) {
            lyrics = `
🎵 ${title}

Chiều mưa rơi ướt lối em về...
Tình buồn như gió lê thê...

💔 Điệp khúc:
Em ơi sao nỡ quên câu thề...
            `;
        }

        return res.status(200).json({
            lyrics,
            audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        });

    } catch (error) {
        return res.status(200).json({
            lyrics: "❌ Server lỗi: " + error.toString(),
            audioUrl: ""
        });
    }
}
