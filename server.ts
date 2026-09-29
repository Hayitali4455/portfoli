import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Shared server-side Gemini client with required User-Agent header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Role-based system instructions
const SYSTEM_INSTRUCTIONS: Record<string, string> = {
  general: `Siz Hayitali G'ulomovning shaxsiy GIS va Geofazoviy Tahlil bo'yicha aqlli AI konsultantisiz.
Hayitalining portfolioda 6 ta asosiy yo'nalishdagi loyihalari mavjud:
1. Qishloq xo'jaligi (Sentinel-2, Planet, NDVI, NDRE, suv stressi tahlili, Mirzacho'l agro-massivi)
2. O'rmon xo'jaligi (Chotqol biosfera qo'riqxonasi, toj qoplamasi zichligi, yong'in xavfi modellashtirish)
3. Ekologiya (Orolqum cho'llanish dinamikasi, Mo'ynoq havzasi, tuproq sho'rlanishi, Landsat & Sentinel-2)
4. Kadastr (Shaharsozlik va ko'chmas mulk kadastri, dron ortofotomozaykasi, GNSS RTK, PostGIS)
5. AI orqali model va ArcGIS Pro uchun tools yasash (YOLOv8-Seg chuqur o'rganish va ArcPy .pyt Python Toolbox)
6. 3D modellashtirish (Samarqand va Toshkent LOD2/LOD3 Digital Twin, DEM/DSM, fotogrammetriya)

Foydalanuvchilar savollariga o'zbek, rus yoki ingliz tillarida (foydalanuvchi qaysi tilda yozsa, shu tilda) professional, aniq, mehmondo'st va geofazoviy atamalarni to'g'ri qo'llagan holda javob bering.`,

  geoai: `Siz Hayitali G'ulomovning GeoAI va Geodasturlash (Python, ArcPy, PyQGIS, GDAL, PostGIS, Deep Learning) bo'yicha AI ekspertisiz.
Dasturlash kodlari, ArcGIS Pro Python Toolbox (.pyt), YOLOv8-Seg semantik segmentatsiya, fazoviy SQL so'rovlari va avtomatlashtirish bo'yicha texnik jihatdan aniq, tushunarli kod namunalari va tushuntirishlar bering.`,

  remotesensing: `Siz Hayitali G'ulomovning Masofadan Zondlash (Remote Sensing) va Sun'iy Yo'ldosh Tahlillari bo'yicha AI ekspertisiz.
Sentinel-2, Landsat-8/9, PlanetScope, MODIS ma'lumotlari, spektral indekslar (NDVI, NDWI, NDBI, NDRE, EVI), Google Earth Engine (GEE) tahlillari va kosmik monitoring metodikalari bo'yicha chuqur tahliliy javob bering.`,

  cadastre: `Siz Hayitali G'ulomovning Kadastr, Geodeziya va Topografiya bo'yicha AI ekspertisiz.
WGS-84, Pulkovo 1942 (SK-42) koordinata transformatsiyalari, GNSS RTK o'lchovlari, ko'chmas mulk chegaralarini delimitatsiya qilish, dron fotogrammetriyasi (Agisoft Metashape) va shaharsozlik bosh rejalari bo'yicha ekspert maslahatlarini bering.`
};

// POST /api/chat - Multi-turn conversational endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { 
      messages, 
      model = 'gemini-3.5-flash', 
      role = 'general',
      customInstruction 
    } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Xabarlar ro\'yxati kiritilmadi (messages array is required)' });
    }

    // Supported models based on requirements:
    // gemini-3.1-pro-preview for particularly complex tasks
    // gemini-3.5-flash for general tasks
    // gemini-3.1-flash-lite for tasks that should happen fast
    const allowedModels = [
      'gemini-3.5-flash',
      'gemini-3.1-flash-lite',
      'gemini-3.1-pro-preview',
    ];
    const selectedModel = allowedModels.includes(model) ? model : 'gemini-3.5-flash';

    // Format conversation history for Gemini API
    const contents = messages.map((m: any) => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: typeof m.content === 'string' ? m.content : (m.text || '') }],
    }));

    const systemInstruction = customInstruction || SYSTEM_INSTRUCTIONS[role] || SYSTEM_INSTRUCTIONS.general;

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
        topP: 0.95,
      },
    });

    const reply = response.text || "Javob hosil qilib bo'lmadi.";
    return res.json({ 
      reply,
      modelUsed: selectedModel,
      roleUsed: role
    });
  } catch (error: any) {
    console.error('Gemini Chat API error:', error);
    return res.status(500).json({ 
      error: error?.message || 'Gemini AI bilan bog\'lanishda xatolik yuz berdi' 
    });
  }
});

// Start Express + Vite middleware
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GIS Portfolio Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
