import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// POST /api/ai/chat — Nutrition chatbot
router.post('/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'message is required' });

  // If OpenAI key is configured, use it; otherwise use built-in responses
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key') {
    try {
      const { default: OpenAI } = await import('openai');
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are PoshanAI, an expert nutrition advisor for Indian Anganwadi centers. 
            You specialize in child malnutrition detection (SAM/MAM), ICDS protocols, Indian dietary guidelines, 
            and government nutrition schemes (PM POSHAN, RUTF, NRC). Answer in clear, actionable language.
            Keep responses concise and practical for Anganwadi workers.`
          },
          { role: 'user', content: message }
        ],
        max_tokens: 400,
        temperature: 0.7,
      });
      return res.json({ success: true, response: response.choices[0].message.content });
    } catch (err) {
      console.error('OpenAI error:', err.message);
    }
  }

  // Fallback responses
  const m = message.toLowerCase();
  let response;
  if (m.includes('sam') || m.includes('severe')) {
    response = 'SAM (Severe Acute Malnutrition) is identified by MUAC < 11.5cm, WHZ < -3, or bilateral oedema. These children need immediate NRC referral and therapeutic feeding with RUTF.';
  } else if (m.includes('mam') || m.includes('moderate')) {
    response = 'MAM (Moderate Acute Malnutrition) is identified by MUAC 11.5–12.5cm or WHZ -3 to -2. Treatment includes supplementary feeding, micronutrient supplements, and weekly monitoring.';
  } else if (m.includes('weight') || m.includes('growth')) {
    response = 'Children should be weighed monthly using calibrated scales. Record weight-for-age on WHO growth chart. Any child with 2+ months no weight gain needs immediate attention.';
  } else if (m.includes('diet') || m.includes('food') || m.includes('meal')) {
    response = 'For under-5 children, ensure energy-dense meals: dal+rice+ghee, eggs twice weekly, green leafy vegetables, seasonal fruits. Add jaggery and groundnuts for extra calories.';
  } else {
    response = 'Thank you for your question. As PoshanAI, I can help with malnutrition detection, nutrition analysis, dietary recommendations, ICDS protocols, and government scheme guidance. Please ask a specific question!';
  }

  res.json({ success: true, response });
});

// POST /api/ai/analyze-plate — Plate detection (mock)
router.post('/analyze-plate', async (req, res) => {
  const { imageBase64 } = req.body;
  if (!imageBase64) return res.status(400).json({ error: 'imageBase64 is required' });

  // Mock response — replace with actual vision AI in production
  await new Promise(r => setTimeout(r, 1500));
  res.json({
    success: true,
    data: {
      detected: [
        { food: 'Dal (Lentil Soup)', confidence: 94, calories: 120, protein: 8, portion: '1 bowl' },
        { food: 'Steamed Rice', confidence: 97, calories: 180, protein: 3.2, portion: '1 cup' },
        { food: 'Vegetable Sabzi', confidence: 82, calories: 80, protein: 2.1, portion: '1 serving' },
      ],
      totalCalories: 380,
      totalProtein: 13.3,
      adequacyScore: 68,
      recommendations: ['Add ghee for extra calories', 'Include seasonal fruit for Vitamin C'],
    }
  });
});

// POST /api/ai/detect-malnutrition — Malnutrition risk assessment
router.post('/detect-malnutrition', (req, res) => {
  const { weight, height, muac, age, oedema } = req.body;
  if (!weight || !height || !muac) return res.status(400).json({ error: 'weight, height, and muac are required' });

  const muacNum = parseFloat(muac);
  let status, riskScore, recommendation;

  if (muacNum < 11.5 || oedema) {
    status = 'SAM'; riskScore = 96;
    recommendation = 'Immediate NRC referral required. Start Ready-to-Use Therapeutic Food (RUTF) protocol.';
  } else if (muacNum < 12.5) {
    status = 'MAM'; riskScore = 65;
    recommendation = 'Enroll in supplementary feeding program. Weekly weight monitoring. Refer to health worker.';
  } else if (muacNum < 13.5) {
    status = 'At Risk'; riskScore = 35;
    recommendation = 'Monitor monthly. Provide counseling on energy-dense foods and hygiene practices.';
  } else {
    status = 'Normal'; riskScore = 10;
    recommendation = 'Continue regular monthly monitoring. Maintain balanced diet as per ICDS guidelines.';
  }

  res.json({
    success: true,
    data: { status, riskScore, recommendation, muac: muacNum, weight: parseFloat(weight), height: parseFloat(height) }
  });
});

export default router;
