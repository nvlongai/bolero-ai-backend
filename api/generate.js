export default async function handler(req, res) {
    // Cho phép gọi từ web GitHub
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    try {
        const body = req.body || {};
        const title = body.title || "Bài Bolero";
        const prompt = body.prompt || "tình yêu buồn, chia ly";

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
                        content: `
Hãy sáng tác một bài hát Bolero Việt Nam hoàn chỉnh.

Yêu cầu:
- Tiêu đề: ${title}
- Nội dung: ${prompt}
- Phong cách: Bolero trữ tình, giống nhạc vàng xưa như: Chế Linh, Mạnh Quỳnh, Trường Vũ, Ngọc Sơn,..
- Giọng nam, cảm xúc sâu lắng, truyền cảm,...

Cấu trúc bắt buộc:
[Verse 1]
(4 câu)

[Verse 2]
(4 câu)

[Chorus]
(4-6 câu, cao trào, dễ nhớ)

[Verse 3]
(4 câu)

[Bridge]
(2-4 câu)

[Chorus - lặp lại mạnh hơn]

[Kết]
(2 câu, kết buồn hoặc dang dở)

Yêu cầu thêm:
- Lời phải mượt, có vần
- Có hình ảnh: mưa, kỷ niệm, chia ly
- Không viết giải thích, chỉ viết lời bài hát`
- Điệp khúc phải dễ thuộc, dễ lan truyền`
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
