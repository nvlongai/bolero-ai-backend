export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");

    const body = req.body || {};
    const title = body.title || "Bài Bolero";
    const prompt = body.prompt || "tình yêu buồn";

    try {
        // 🎵 AI FREE (giả lập thông minh)
        const lyrics = `
🎵 ${title}

[Verse 1]
Chiều mưa rơi ướt lối em về
Anh đứng đó nghe lòng tái tê
Tình xưa như gió bay xa
Còn đâu những tháng ngày qua...

[Verse 2]
Con đường cũ vẫn còn in dấu
Mà giờ đây chỉ mình anh đau
Kỷ niệm xưa đã phai màu
Chỉ còn nỗi nhớ nghẹn ngào...

💔 [Chorus]
Em ơi sao nỡ quên câu thề
Để anh ôm trọn nỗi ê chề
Tình yêu như giấc mộng mê
Tan rồi chỉ còn u mê...

[Kết]
Mưa rơi lạnh ướt vai gầy
Mất em anh biết về đâu...
        `;

        return res.status(200).json({
            lyrics,
            audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        });

    } catch (error) {
        return res.status(200).json({
            lyrics: "Lỗi AI FREE",
            audioUrl: ""
        });
    }
}
