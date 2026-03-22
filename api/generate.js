export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");

    const body = req.body || {};
    const title = body.title || "Bài Bolero";
    const prompt = body.prompt || "tình yêu buồn";

    try {
        // 🔥 Gọi HuggingFace FREE
        const response = await fetch(
            "https://api-inference.huggingface.co/models/bigscience/bloom",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    inputs: `Viết bài hát Bolero hoàn chỉnh, có verse và điệp khúc.
Tiêu đề: ${title}
Nội dung: ${prompt}`
                })
            }
        );

        const data = await response.json();

        let lyrics = "";

        // 👉 Xử lý nhiều dạng trả về (QUAN TRỌNG)
        if (Array.isArray(data) && data[0]?.generated_text) {
            lyrics = data[0].generated_text;
        } else if (data?.error) {
            lyrics = "❌ Lỗi AI FREE: " + data.error;
        } else {
            lyrics = "❌ Không tạo được lời (AI bận hoặc quá tải)";
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
