import OpenAI from "openai";
export default async function handler(req,res){
 if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
 if(!process.env.OPENAI_API_KEY)return res.status(503).json({error:"OPENAI_API_KEY belum diatur di Environment Variables hosting."});
 try{
  const {goal="muscle",question="",profile={},meals=[],workouts=[]}=req.body||{};
  const safeMeals=meals.slice(-30).map(m=>({name:String(m.name||"").slice(0,100),kcal:Number(m.kcal)||0,protein:Number(m.protein)||0,carbs:Number(m.carbs)||0,fat:Number(m.fat)||0}));
  const safeWorkouts=workouts.slice(0,10).map(w=>({title:String(w.title||"Workout").slice(0,100),date:String(w.date||"").slice(0,40)}));
  const response=await new OpenAI({apiKey:process.env.OPENAI_API_KEY}).responses.create({model:process.env.OPENAI_MODEL||"gpt-4.1-mini",input:`Kamu adalah asisten kebiasaan makan dan latihan yang ramah untuk pengguna Indonesia. Beri saran praktis, fleksibel, tidak menghakimi, tidak menyuruh diet ekstrem. Tujuan: ${goal}. Berat kg: ${Number(profile.weight)||"tidak diketahui"}. Target protein pilihan pengguna: ${Number(profile.proteinTarget)||"tidak diatur"} g/hari. Catatan makan hari ini (estimasi): ${JSON.stringify(safeMeals)}. Latihan terbaru yang tersedia: ${JSON.stringify(safeWorkouts)}. Pertanyaan: ${String(question).slice(0,500)}. Jawab dalam Bahasa Indonesia, singkat dan konkret, sarankan pilihan warteg dan alternatif. Ingat bahwa data nutrisi foto adalah perkiraan; jangan klaim bahwa kamu membaca data Hevy jika daftar kosong. Jangan beri diagnosis medis atau target kalori ekstrem.`});
  return res.status(200).json({advice:response.output_text||"Coba tambahkan catatan makan dan pertanyaan yang lebih spesifik."});
 }catch(e){console.error("recommend error",e.message);return res.status(500).json({error:"Rekomendasi gagal. Periksa konfigurasi backend."});}
}
