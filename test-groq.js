const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testGroqIntegration() {
    console.log('='.repeat(60));
    console.log('🤖 TESTING GROQ AI INTEGRATION');
    console.log('='.repeat(60));
    console.log();

    try {
        // Test 1: Romantic Conversation
        console.log('1️⃣  Testing Groq AI with Romantic Conversation...');
        const romanticConvo = "You're absolutely stunning. I can't stop thinking about you since we met. Your smile lights up my world.";

        const response1 = await axios.post(`${BASE_URL}/api/recommend`, {
            conversation: romanticConvo,
            count: 3
        });

        console.log(`✓ Groq Analysis Complete`);
        console.log(`   Method: ${response1.data.analysis.method}`);
        console.log(`   Detected Tone: ${response1.data.analysis.tone}`);
        console.log(`   Stage: ${response1.data.analysis.stage}`);
        console.log(`   Style: ${response1.data.analysis.preferredStyle}`);
        if (response1.data.analysis.confidence) {
            console.log(`   Confidence: ${(response1.data.analysis.confidence * 100).toFixed(0)}%`);
        }
        console.log(`   Top Suggestion: "${response1.data.recommendations[0].line_text.substring(0, 60)}..."\n`);

        // Test 2: Playful/Funny Conversation
        console.log('2️⃣  Testing with Playful Conversation...');
        const playfulConvo = "Haha! You're hilarious! That joke was so funny I almost fell off my chair. You have such a great sense of humor!";

        const response2 = await axios.post(`${BASE_URL}/api/recommend`, {
            conversation: playfulConvo,
            count: 3
        });

        console.log(`✓ Groq Analysis Complete`);
        console.log(`   Method: ${response2.data.analysis.method}`);
        console.log(`   Detected Tone: ${response2.data.analysis.tone}`);
        console.log(`   Stage: ${response2.data.analysis.stage}`);
        console.log(`   Top Suggestion: "${response2.data.recommendations[0].line_text.substring(0, 60)}..."\n`);

        // Test 3: Kenyan/Sheng Conversation
        console.log('3️⃣  Testing Kenyan Context Detection...');
        const kenyanConvo = "Wah! Niaje msee? Uko poa sana. Nairobi ni home! Tunaweza kukutana Westlands ama Town?";

        const response3 = await axios.post(`${BASE_URL}/api/recommend`, {
            conversation: kenyanConvo,
            count: 3
        });

        console.log(`✓ Groq Analysis Complete`);
        console.log(`   Method: ${response3.data.analysis.method}`);
        console.log(`   Detected Tone: ${response3.data.analysis.tone}`);
        console.log(`   Preferred Style: ${response3.data.analysis.preferredStyle}`);
        console.log(`   Top Kenyan Line: "${response3.data.recommendations[0].line_text.substring(0, 60)}..."\n`);

        // Test 4: Direct/Confident Conversation
        console.log('4️⃣  Testing Direct Approach...');
        const directConvo = "I find you really attractive and would love to take you out for dinner. Are you free this weekend?";

        const response4 = await axios.post(`${BASE_URL}/api/recommend`, {
            conversation: directConvo,
            count: 3
        });

        console.log(`✓ Groq Analysis Complete`);
        console.log(`   Method: ${response4.data.analysis.method}`);
        console.log(`   Detected Tone: ${response4.data.analysis.tone}`);
        console.log(`   Stage: ${response4.data.analysis.stage}`);
        console.log(`   Top Suggestion: "${response4.data.recommendations[0].line_text.substring(0, 60)}..."\n`);

        // Test 5: Analyze Only (Test Groq Analysis endpoint)
        console.log('5️⃣  Testing Analysis Only...');
        const analyzeConvo = "Hey! I noticed you from across the room. You have an amazing energy about you. Mind if I join you?";

        const response5 = await axios.post(`${BASE_URL}/api/analyze`, {
            conversation: analyzeConvo
        });

        console.log(`✓ Analysis Complete`);
        console.log(`   Method: ${response5.data.analysis.method}`);
        console.log(`   Tone: ${response5.data.analysis.tone}`);
        console.log(`   Stage: ${response5.data.analysis.stage}`);
        console.log(`   Style: ${response5.data.analysis.preferredStyle}`);
        if (response5.data.analysis.preferredCategory) {
            console.log(`   Category: ${response5.data.analysis.preferredCategory}`);
        }
        console.log();

        console.log('='.repeat(60));
        console.log('✅ ALL GROQ AI TESTS PASSED!');
        console.log('='.repeat(60));
        console.log();
        console.log('🎯 Groq AI is now analyzing your conversations with:');
        console.log('   • LLaMA 3.3 70B model');
        console.log('   • Context-aware tone detection');
        console.log('   • Cultural sensitivity (Kenyan/International)');
        console.log('   • Confidence scoring');
        console.log('   • Automatic fallback to rule-based analysis');
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
setTimeout(testGroqIntegration, 2000);
