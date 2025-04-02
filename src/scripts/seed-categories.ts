import { db } from "@/db";
import { categories } from "@/db/schema";

const categoryNames = [
    "車&バイク",
    "教育",
    "ゲーム",
    "エンタテインメント",
    "映画&アニメ",
    "ファッション",
    "ミュージック",
    "ニュース&政治",
    "人文&VLOG",
    "ペット&動物",
    "科学&テクノロジー",
    "スポーツ",
    "旅行&イベント",

]

async function main() {
    console.log("Seeding Categories...")

    try {
        const values = categoryNames.map((name) => ({
            name,
            description: `${name}に関連する動画です`
        }))
        await db.insert(categories).values(values)
        console.log("Seeding Categories Successfully");
    } catch (error) {
        console.log("Error Seeding Categories: ", error);
        process.exit(1);

    }
}
main();