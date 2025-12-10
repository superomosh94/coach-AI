const mysql = require('mysql2/promise');
require('dotenv').config();

const DB_CONFIG = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'vibe_coach'
};

// 100+ Curated Flirting Lines
const FLIRTING_LINES = [
    // KENYAN/SHENG LINES (30 lines)
    { text: "Uko na GPS? Kwa sababu nimepotea kwenye macho yako.", category: "playful", style: "kenyan", context: "opening", quality: 4.2 },
    { text: "Nimekuwa na WiFi password yako kwa moyo wangu.", category: "smooth", style: "sheng", context: "opening", quality: 4.0 },
    { text: "Wewe ni kama Nairobi traffic - unavyonifanya nishikwe.", category: "funny", style: "kenyan", context: "opening", quality: 4.3 },
    { text: "Unatumia network gani? Ju connection yetu ni strong sana.", category: "clever", style: "sheng", context: "opening", quality: 4.1 },
    { text: "Si uko na magnet? Kwa maana kila wakati ninakuvutia.", category: "playful", style: "kenyan", context: "opening", quality: 3.9 },
    { text: "Unakaa na bundles za unlimited? Ju tungepata unlimited time.", category: "clever", style: "sheng", context: "opening", quality: 4.2 },
    { text: "Wewe ni kama chapati - round, soft, na nataka kukuonja.", category: "funny", style: "kenyan", context: "opening", quality: 3.8 },
    { text: "Kama ulikuwa airtime, ningekubuy kila siku.", category: "cheesy", style: "kenyan", context: "opening", quality: 3.5 },
    { text: "Nimekutag kwa heart yangu kama favorite contact.", category: "smooth", style: "sheng", context: "response", quality: 4.0 },
    { text: "Uko na insurance? Ju ninaweza kuanguka kwa upendo.", category: "playful", style: "kenyan", context: "opening", quality: 4.1 },
    { text: "Sio poa kuassume lakini nakuassume uko single.", category: "direct", style: "sheng", context: "opening", quality: 3.8 },
    { text: "Wewe ni kama ugali - basic but unanipatia life.", category: "funny", style: "kenyan", context: "compliment", quality: 4.0 },
    { text: "Kama ni kukupata, ningepayuka kila siku.", category: "romantic", style: "sheng", context: "opening", quality: 4.3 },
    { text: "Uko na vibe ya Nairobi - chaotic lakini ninaikupenda.", category: "smooth", style: "kenyan", context: "compliment", quality: 4.4 },
    { text: "Si uniforward contacts zako? Nikutie kwa emergency list.", category: "playful", style: "sheng", context: "opening", quality: 3.9 },
    { text: "Kama ulikuwa exam, ningekusoma usiku na mchana.", category: "clever", style: "kenyan", context: "opening", quality: 4.2 },
    { text: "Nimekuweka kwa Do Not Disturb list - wa moyo wangu.", category: "smooth", style: "sheng", context: "response", quality: 4.1 },
    { text: "Wewe ni kama Monday - tough lakini lazima nikubali.", category: "funny", style: "kenyan", context: "opening", quality: 3.7 },
    { text: "Uko na password? Ju nataka kuaccess heart yako.", category: "clever", style: "sheng", context: "opening", quality: 4.0 },
    { text: "Kama ni dating app, ningekuswipe right mara kumi.", category: "playful", style: "kenyan", context: "opening", quality: 4.1 },
    { text: "Unajua kunitext kila saa ni free - no charges.", category: "smooth", style: "sheng", context: "followup", quality: 3.8 },
    { text: "Wewe ni kama mandazi - sweet, warm, na napenda kukupick.", category: "funny", style: "kenyan", context: "compliment", quality: 4.0 },
    { text: "Si nikuinstall kwa phone na moyo pia?", category: "clever", style: "sheng", context: "opening", quality: 4.2 },
    { text: "Uko na license ya kuwa mrembo hivyo?", category: "playful", style: "kenyan", context: "opening", quality: 3.9 },
    { text: "Nimekupata kwa explore page ya moyo wangu.", category: "smooth", style: "sheng", context: "response", quality: 4.3 },
    { text: "Wewe ni kama KCB - unaniweka kwa balance.", category: "clever", style: "kenyan", context: "compliment", quality: 4.1 },
    { text: "Kama ulikuwa song, ningekuplay kwa repeat.", category: "romantic", style: "sheng", context: "opening", quality: 4.4 },
    { text: "Uko na first aid kit? Ju umevunja moyo wangu - kwa njia nzuri.", category: "playful", style: "kenyan", context: "opening", quality: 4.0 },
    { text: "Si unifollow back kwa real life pia?", category: "funny", style: "sheng", context: "followup", quality: 3.8 },
    { text: "Nimekusalimia na moyo wangu - unaskia?", category: "romantic", style: "kenyan", context: "opening", quality: 4.2 },

    // ROMANTIC/SWEET LINES (25 lines)
    { text: "Every time I see you, my heart does a little dance.", category: "romantic", style: "international", context: "compliment", quality: 4.5 },
    { text: "You're the reason I believe in chemistry.", category: "romantic", style: "international", context: "opening", quality: 4.6 },
    { text: "I could get lost in your eyes forever.", category: "romantic", style: "international", context: "compliment", quality: 4.4 },
    { text: "You make ordinary moments feel extraordinary.", category: "romantic", style: "international", context: "response", quality: 4.7 },
    { text: "I didn't believe in soulmates until I met you.", category: "romantic", style: "international", context: "opening", quality: 4.8 },
    { text: "Your smile could light up the darkest room.", category: "romantic", style: "international", context: "compliment", quality: 4.5 },
    { text: "I think the universe must have brought us together.", category: "romantic", style: "international", context: "opening", quality: 4.6 },
    { text: "You're the plot twist I never saw coming.", category: "romantic", style: "international", context: "response", quality: 4.7 },
    { text: "Time stops when I'm with you.", category: "romantic", style: "international", context: "compliment", quality: 4.9 },
    { text: "You're the best chapter in my story.", category: "romantic", style: "international", context: "response", quality: 4.8 },
    { text: "I never knew what I was missing until I found you.", category: "romantic", style: "international", context: "opening", quality: 4.7 },
    { text: "You're the melody that plays in my heart.", category: "romantic", style: "international", context: "compliment", quality: 4.6 },
    { text: "Every moment with you feels like a fairytale.", category: "romantic", style: "international", context: "response", quality: 4.5 },
    { text: "You're my favorite notification.", category: "romantic", style: "international", context: "response", quality: 4.4 },
    { text: "I could listen to you talk for hours and never get bored.", category: "romantic", style: "international", context: "response", quality: 4.6 },
    { text: "You're the sunshine on my cloudiest days.", category: "romantic", style: "international", context: "compliment", quality: 4.7 },
    { text: "I think you might be the one I've been searching for.", category: "romantic", style: "international", context: "opening", quality: 4.8 },
    { text: "You make me want to be a better person.", category: "romantic", style: "international", context: "response", quality: 4.9 },
    { text: "Your laugh is my favorite sound in the world.", category: "romantic", style: "international", context: "compliment", quality: 4.6 },
    { text: "I feel like I've known you my entire life.", category: "romantic", style: "international", context: "response", quality: 4.5 },
    { text: "You're the answer to questions I didn't know I had.", category: "romantic", style: "international", context: "opening", quality: 4.7 },
    { text: "Being with you feels like coming home.", category: "romantic", style: "international", context: "response", quality: 4.8 },
    { text: "You're the highlight of my every day.", category: "romantic", style: "international", context: "compliment", quality: 4.6 },
    { text: "I think my heart skips a beat every time you smile.", category: "romantic", style: "international", context: "compliment", quality: 4.5 },
    { text: "You're the person I want to share everything with.", category: "romantic", style: "international", context: "response", quality: 4.7 },

    // WITTY/CLEVER LINES (25 lines)
    { text: "Are you a carbon sample? Because I want to date you.", category: "clever", style: "international", context: "opening", quality: 4.1 },
    { text: "Do you have a pencil? Because I want to erase your past and write our future.", category: "clever", style: "international", context: "opening", quality: 4.5 },
    { text: "Are you a dictionary? Because you add meaning to my life.", category: "clever", style: "international", context: "opening", quality: 4.2 },
    { text: "If you were a triangle, you'd be acute one.", category: "clever", style: "international", context: "opening", quality: 4.0 },
    { text: "Are you a bank loan? Because you have my interest.", category: "clever", style: "international", context: "opening", quality: 4.0 },
    { text: "Do you have a name, or can I call you mine?", category: "clever", style: "international", context: "opening", quality: 4.3 },
    { text: "Are you a keyboard? Because you're just my type.", category: "clever", style: "international", context: "opening", quality: 4.1 },
    { text: "Is your dad a terrorist? Because you're the bomb.", category: "clever", style: "international", context: "opening", quality: 3.5 },
    { text: "Are you a beaver? Because daaaaam.", category: "funny", style: "international", context: "opening", quality: 3.9 },
    { text: "Do you like sales? Because if you're looking for a good one, clothing is 100% off at my place.", category: "bold", style: "international", context: "opening", quality: 3.2 },
    { text: "Are you a cat? Because you're purr-fect.", category: "funny", style: "international", context: "opening", quality: 3.8 },
    { text: "Do you have a mirror in your pocket? Because I can see myself in your pants... wait, that came out wrong.", category: "funny", style: "international", context: "opening", quality: 3.4 },
    { text: "Are you Netflix? Because I could watch you for hours.", category: "clever", style: "international", context: "opening", quality: 4.2 },
    { text: "If you were a fruit, you'd be a fine-apple.", category: "funny", style: "international", context: "opening", quality: 3.9 },
    { text: "Are you a magician's assistant? Because when I look at you, everyone else disappears.", category: "clever", style: "international", context: "opening", quality: 4.4 },
    { text: "Do you play soccer? Because you're a keeper.", category: "clever", style: "international", context: "opening", quality: 4.0 },
    { text: "Are you a library book? Because I'm checking you out.", category: "clever", style: "international", context: "opening", quality: 3.7 },
    { text: "If you were a vegetable, you'd be a cute-cumber.", category: "funny", style: "international", context: "opening", quality: 3.8 },
    { text: "Are you Australian? Because you meet all of my koala-fications.", category: "funny", style: "international", context: "opening", quality: 3.9 },
    { text: "Do you believe in love at first swipe?", category: "clever", style: "international", context: "opening", quality: 4.1 },
    { text: "Are you a charger? Because I'm dying without you.", category: "clever", style: "international", context: "opening", quality: 4.0 },
    { text: "If looks could kill, you'd be a weapon of mass destruction.", category: "smooth", style: "international", context: "compliment", quality: 4.3 },
    { text: "Are you my appendix? Because I don't understand how you work, but I want to take you out.", category: "funny", style: "international", context: "opening", quality: 3.6 },
    { text: "Do you like Star Wars? Because Yoda only one for me.", category: "funny", style: "international", context: "opening", quality: 4.0 },
    { text: "Are you a 45-degree angle? Because you're a-cute-y.", category: "clever", style: "international", context: "opening", quality: 4.1 },

    // DIRECT/CONFIDENT LINES (20 lines)
    { text: "I had to come over and talk to you. You're stunning.", category: "direct", style: "international", context: "opening", quality: 4.7 },
    { text: "I'm not good at pickup lines, but I think you're beautiful.", category: "direct", style: "international", context: "opening", quality: 4.8 },
    { text: "Can I buy you a drink? I'd like to get to know you better.", category: "direct", style: "international", context: "opening", quality: 4.5 },
    { text: "I know this is forward, but would you like to have coffee sometime?", category: "direct", style: "international", context: "opening", quality: 4.6 },
    { text: "I think you're amazing and I'd love to take you out.", category: "direct", style: "international", context: "opening", quality: 4.7 },
    { text: "Life's too short. Can I take you to dinner?", category: "direct", style: "international", context: "opening", quality: 4.4 },
    { text: "I'm terrible at this, but I think you're really attractive.", category: "direct", style: "international", context: "opening", quality: 4.6 },
    { text: "I don't usually do this, but I couldn't leave without saying hi.", category: "direct", style: "international", context: "opening", quality: 4.5 },
    { text: "You caught my eye from across the room.", category: "direct", style: "international", context: "opening", quality: 4.4 },
    { text: "I'd regret it if I didn't at least introduce myself.", category: "direct", style: "international", context: "opening", quality: 4.6 },
    { text: "Can I get your number? I'd like to continue this conversation.", category: "direct", style: "international", context: "followup", quality: 4.3 },
    { text: "I'm going to be honest - I find you incredibly attractive.", category: "direct", style: "international", context: "opening", quality: 4.7 },
    { text: "Would you like to grab dinner with me this weekend?", category: "direct", style: "international", context: "followup", quality: 4.5 },
    { text: "I think we should get to know each other better.", category: "direct", style: "international", context: "response", quality: 4.4 },
    { text: "You seem interesting. Tell me about yourself.", category: "direct", style: "international", context: "followup", quality: 4.2 },
    { text: "I'm not leaving until I get your number.", category: "bold", style: "international", context: "followup", quality: 4.0 },
    { text: "What's your story? I'd love to hear it.", category: "direct", style: "international", context: "followup", quality: 4.3 },
    { text: "I have a feeling we'd get along really well.", category: "direct", style: "international", context: "response", quality: 4.5 },
    { text: "Let me take you on a proper date.", category: "direct", style: "international", context: "followup", quality: 4.6 },
    { text: "I think this is the start of something good.", category: "direct", style: "international", context: "response", quality: 4.7 }
];

async function importLines() {
    let db;
    try {
        console.log('='.repeat(60));
        console.log('📥 Batch Import: 100+ Flirting Lines');
        console.log('='.repeat(60));
        console.log();

        db = await mysql.createConnection(DB_CONFIG);
        console.log('✓ Connected to database\n');

        let imported = 0;
        let duplicates = 0;

        for (const line of FLIRTING_LINES) {
            try {
                const query = `
                    INSERT INTO flirting_lines 
                    (line_text, category, style, context, stage, target_gender, source_type, quality_score, originality_score, success_rate, usage_count)
                    VALUES (?, ?, ?, ?, 'initial', 'neutral', 'manual_entry', ?, 4.0, 0.6, 0)
                `;
                await db.query(query, [
                    line.text,
                    line.category,
                    line.style,
                    line.context,
                    line.quality
                ]);
                imported++;
                if (imported % 10 === 0) {
                    console.log(`  ✓ Imported ${imported} lines...`);
                }
            } catch (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                    duplicates++;
                } else {
                    console.error('  ⚠️  Error:', error.message);
                }
            }
        }

        console.log();
        console.log('='.repeat(60));
        console.log('✅ Import Complete!');
        console.log(`   • Total lines processed: ${FLIRTING_LINES.length}`);
        console.log(`   • Successfully imported: ${imported}`);
        console.log(`   • Duplicates skipped: ${duplicates}`);
        console.log('='.repeat(60));

        // Show stats
        const [stats] = await db.query('SELECT COUNT(*) as total FROM flirting_lines');
        const [byStyle] = await db.query('SELECT style, COUNT(*) as count FROM flirting_lines GROUP BY style');
        const [byCategory] = await db.query('SELECT category, COUNT(*) as count FROM flirting_lines GROUP BY category');

        console.log(`\n📊 Database Statistics:`);
        console.log(`   Total lines in database: ${stats[0].total}`);
        console.log(`\n   By Style:`);
        byStyle.forEach(row => console.log(`      ${row.style}: ${row.count}`));
        console.log(`\n   By Category:`);
        byCategory.forEach(row => console.log(`      ${row.category}: ${row.count}`));

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        if (db) await db.end();
    }
}

importLines();
