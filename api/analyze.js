import OpenAI from "openai";
export const config = { api: { bodyParser: false } };
import { IncomingForm } from "formidable";
import fs from "node:fs/promises";
const client = () => new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
function parseForm(req){return new Promise((resolve,reject)=>{const form=new IncomingForm({maxFileSize:8*1024*1024, keepExtensions:true});form.parse(req,(err,fields,files)=>err?reject(err):resolve({fields,files}));});}
export default async function handler(req,res){
 if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
 if(!process.env.OPENAI_API_KEY)return res.status(503).json({error:"OPENAI_API_KEY belum diatur di Environment Variables hosting."});
 try{
  const {fields,files}=await parseForm(req);const file=Array.isArray(files.image)?files.image[0]:files.image;
  if(!file)return res.status(400).json({error:"Foto tidak ditemukan."});
  const buf=await fs.readFile(file.filepath);const mime=file.mimetype||"image/jpeg";const dataUrl=`data:${mime};base64,${buf.toString("base64")}`;
  const notes=Array.isArray(fields.notes)?fields.notes[0]:(fields.notes||"");
  const response=await client().responses.create({model:process.env.OPENAI_MODEL||"gpt-4.1-mini",input:[{role:"user",content:[{type:"input_text",text:`Identifikasi makanan Indonesia/warteg pada foto. Buat estimasi porsi dan nutrisi per item. Catatan pengguna: ${notes}. Jangan berpura-pura yakin jika tidak jelas; beri catatan bahwa nilai adalah estimasi. Balas JSON valid saja sesuai skema: {"summary":"string","items":[{"name":"string","portion":"string","kcal":0,"protein":0,"carbs":0,"fat":0}],"total":{"kcal":0,"protein":0,"carbs":0,"fat":0}}. Angka non-negatif, gram untuk makro, kcal untuk energi. Jangan memberi saran medis.`},{type:"input_image",image_url:dataUrl,detail:"high"}]}]});
  const textOut=response.output_text||"";const cleaned=textOut.replace(/^```(?:json)?\s*/i,"").replace(/\s*```$/,"");const result=JSON.parse(cleaned);
  result.items=(result.items||[]).map(x=>({name:String(x.name||"Makanan"),portion:String(x.portion||"porsi perkiraan"),kcal:Math.max(0,Number(x.kcal)||0),protein:Math.max(0,Number(x.protein)||0),carbs:Math.max(0,Number(x.carbs)||0),fat:Math.max(0,Number(x.fat)||0)}));
  result.total={kcal:result.items.reduce((s,x)=>s+x.kcal,0),protein:result.items.reduce((s,x)=>s+x.protein,0),carbs:result.items.reduce((s,x)=>s+x.carbs,0),fat:result.items.reduce((s,x)=>s+x.fat,0)};
  return res.status(200).json(result);
 }catch(e){console.error("analyze error",e.message);return res.status(500).json({error:"Analisis gagal. Coba foto lebih jelas atau periksa konfigurasi backend."});}
}
