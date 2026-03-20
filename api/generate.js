export default async function handler(req, res) {
    // Cho phép gọi từ web GitHub
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    try {
        const { title, prompt } = req.body;

        // 👉 Gọi OpenAI tạo lời
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
                        content: `Viết bài hát Bolero cực xúc động.
Tiêu đề: ${title}
Nội dung: ${prompt}
Có đoạn điệp khúc rõ ràng.`
                    }
                ]
            })
        });

        const data = await response.json();

        const lyrics =
            data?.choices?.[0]?.message?.content ||
            "Lỗi tạo lời, kiểm tra API key";

        // 🎵 Nhạc demo (sẽ nâng cấp sau)
        const audioUrl =
            "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

        return res.status(200).json({
            lyrics,
            audioUrl
        });

    } catch (error) {
        return res.status(500).json({
            error: error.toString()
        });
    }
}
