import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../src/config/env';

async function testModel() {
    const key = env.GEMINI_API_KEY;
    if (!key) { console.error('No Key'); return; }

    const genAI = new GoogleGenerativeAI(key);
    const modelName = 'gemini-2.0-flash'; // Available in 2026 list

    console.log(`Testing ${modelName}...`);
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Hello from the future');
        console.log('Success:', await result.response.text());
    } catch (e: any) {
        console.error('Failed:', e.message);
    }
}

testModel();
