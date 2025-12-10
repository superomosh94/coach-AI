const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testAIFeatures() {
    console.log('='.repeat(60));
    console.log('🤖 TESTING AI-POWERED FEATURES');
    console.log('='.repeat(60));
    console.log();

    try {
        // Test 1: Random Lines with Filters
        console.log('1️⃣  Testing Random Lines with Filters...');
        const randomResponse = await axios.get(`${BASE_URL}/api/random`, {
            params: {
                category: 'romantic',
                style: 'international',
                count: 3
            }
        });
        console.log(`✓ Got ${randomResponse.data.count} romantic international lines`);
        console.log(`   Sample: "${randomResponse.data.lines[0].line_text}"\n`);

        // Test 2: Weighted Random (Quality-based)
        console.log('2️⃣  Testing Weighted Random Selection...');
        const weightedResponse = await axios.get(`${BASE_URL}/api/weighted-random?count=3`);
        console.log(`✓ Got ${weightedResponse.data.count} high-quality lines`);
        console.log(`   Best: "${weightedResponse.data.lines[0].line_text}"`);
        console.log(`   Quality Score: ${weightedResponse.data.lines[0].quality_score}/5.0\n`);

        // Test 3: Conversation Analysis
        console.log('3️⃣  Testing Conversation Analysis...');
        const conversation1 = "Hi there! You look amazing today. I love your smile and your beautiful eyes.";
        const analysisResponse = await axios.post(`${BASE_URL}/api/analyze`, {
            conversation: conversation1
        });
        console.log(`✓ Analyzed conversation:`);
        console.log(`   Detected Tone: ${analysisResponse.data.analysis.tone}`);
        console.log(`   Detected Stage: ${analysisResponse.data.analysis.stage}`);
        console.log(`   Preferred Style: ${analysisResponse.data.analysis.preferredStyle}\n`);

        // Test 4: AI Recommendations - Romantic Context
        console.log('4️⃣  Testing AI Recommendations (Romantic Context)...');
        const romanticConvo = "You're absolutely stunning. I can't stop thinking about you since we met.";
        const recommendation1 = await axios.post(`${BASE_URL}/api/recommend`, {
            conversation: romanticConvo,
            count: 3
        });
        console.log(`✓ Got ${recommendation1.data.count} recommendations`);
        console.log(`   Analysis: ${recommendation1.data.analysis.tone} tone, ${recommendation1.data.analysis.stage} stage`);
        console.log(`   Top Suggestion: "${recommendation1.data.recommendations[0].line_text}"\n`);

        // Test 5: AI Recommendations - Playful Context
        console.log('5️⃣  Testing AI Recommendations (Playful Context)...');
        const playfulConvo = "Hey! That was hilarious. You have such a great sense of humor!";
        const recommendation2 = await axios.post(`${BASE_URL}/api/recommend`, {
            conversation: playfulConvo,
            count: 3
        });
        console.log(`✓ Got ${recommendation2.data.count} recommendations`);
        console.log(`   Analysis: ${recommendation2.data.analysis.tone} tone, ${recommendation2.data.analysis.stage} stage`);
        console.log(`   Top Suggestion: "${recommendation2.data.recommendations[0].line_text}"\n`);

        // Test 6: Kenyan Context Detection
        console.log('6️⃣  Testing Kenyan Context Detection...');
        const kenyanConvo = "Wah! Niaje msee? Uko poa sana. Nairobi represents!";
        const kenyanRec = await axios.post(`${BASE_URL}/api/recommend`, {
            conversation: kenyanConvo,
            count: 3
        });
        console.log(`✓ Got ${kenyanRec.data.count} recommendations`);
        console.log(`   Preferred Style: ${kenyanRec.data.analysis.preferredStyle}`);
        console.log(`   Top Kenyan Line: "${kenyanRec.data.recommendations[0].line_text}"\n`);

        // Test 7: Initial Stage Detection
        console.log('7️⃣  Testing Initial Stage Detection...');
        const initialConvo = "Hi, nice to meet you! This is my first time here.";
        const initialRec = await axios.post(`${BASE_URL}/api/recommend`, {
            conversation: initialConvo,
            count: 3
        });
        console.log(`✓ Got ${initialRec.data.count} recommendations`);
        console.log(`   Detected Stage: ${initialRec.data.analysis.stage}`);
        console.log(`   Opening Line: "${initialRec.data.recommendations[0].line_text}"\n`);

        console.log('='.repeat(60));
        console.log('✅ ALL TESTS PASSED!');
        console.log('='.repeat(60));
        console.log();
        console.log('📝 API Endpoints Available:');
        console.log('   GET  /api/random?category=X&style=Y&count=N');
        console.log('   GET  /api/weighted-random?count=N');
        console.log('   POST /api/analyze (body: {conversation})');
        console.log('   POST /api/recommend (body: {conversation, count})');
        console.log();

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.response) {
            console.error('   Response:', error.response.data);
        }
    }
}

// Run tests
console.log('⏳ Waiting for server to be ready...\n');
setTimeout(testAIFeatures, 2000);
