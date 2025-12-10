const mysql = require('mysql2/promise');
const Groq = require('groq-sdk');
require('dotenv').config();

const DB_CONFIG = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'vibe_coach'
};

class AIRecommender {
    constructor() {
        this.db = null;
        this.groq = new Groq({
            apiKey: process.env.GROQ_API_KEY
        });
        this.useAI = !!process.env.GROQ_API_KEY;
    }

    async connect() {
        if (!this.db) {
            this.db = await mysql.createConnection(DB_CONFIG);
        }
        return this.db;
    }

    /**
     * Get random flirting lines with optional filters
     */
    async getRandomLines(filters = {}, count = 5) {
        await this.connect();

        const { category, style, context, stage, minQuality } = filters;

        let query = 'SELECT * FROM flirting_lines WHERE 1=1';
        const params = [];

        if (category) {
            query += ' AND category = ?';
            params.push(category);
        }
        if (style) {
            query += ' AND style = ?';
            params.push(style);
        }
        if (context) {
            query += ' AND context = ?';
            params.push(context);
        }
        if (stage) {
            query += ' AND stage = ?';
            params.push(stage);
        }
        if (minQuality) {
            query += ' AND quality_score >= ?';
            params.push(minQuality);
        }

        query += ' ORDER BY RAND() LIMIT ?';
        params.push(count);

        const [rows] = await this.db.query(query, params);
        return rows;
    }

    /**
     * Analyze conversation context using rule-based approach
     */
    analyzeConversation(conversation) {
        const text = conversation.toLowerCase();

        // Detect tone
        const tone = this.detectTone(text);

        // Detect stage
        const stage = this.detectStage(text);

        // Detect cultural context
        const needsKenyan = this.detectKenyanContext(text);

        // Detect if user wants something specific
        const preferredCategory = this.detectCategory(text);

        return {
            tone,
            stage,
            preferredStyle: needsKenyan ? 'kenyan' : 'international',
            preferredCategory,
            conversation: text
        };
    }

    detectTone(text) {
        const keywords = {
            romantic: ['love', 'heart', 'beautiful', 'gorgeous', 'stunning', 'amazing', 'perfect'],
            playful: ['fun', 'laugh', 'smile', 'haha', 'lol', 'cute', 'funny'],
            direct: ['interested', 'like you', 'want', 'date', 'coffee', 'dinner'],
            smooth: ['charm', 'impressed', 'attractive', 'interest', 'vibe'],
            funny: ['joke', 'hilarious', 'comedy', 'humor'],
            bold: ['confident', 'straight', 'honest', 'upfront']
        };

        const scores = {};
        for (const [category, words] of Object.entries(keywords)) {
            scores[category] = words.filter(word => text.includes(word)).length;
        }

        const max = Math.max(...Object.values(scores));
        if (max === 0) return 'playful'; // default

        return Object.keys(scores).find(key => scores[key] === max);
    }

    detectStage(text) {
        // Initial stage keywords
        if (text.includes('hi') || text.includes('hello') || text.includes('hey') ||
            text.includes('first time') || text.includes('just met') || text.includes('new')) {
            return 'initial';
        }

        // Advanced stage keywords
        if (text.includes('relationship') || text.includes('together') ||
            text.includes('dating') || text.includes('serious') || text.includes('commitment')) {
            return 'advanced';
        }

        // Default to middle
        return 'middle';
    }

    detectKenyanContext(text) {
        const kenyanKeywords = ['kenyan', 'nairobi', 'sheng', 'swahili', 'local', 'kenya'];
        return kenyanKeywords.some(word => text.includes(word));
    }

    detectCategory(text) {
        if (text.includes('romantic') || text.includes('sweet') || text.includes('love')) {
            return 'romantic';
        }
        if (text.includes('funny') || text.includes('humor') || text.includes('joke')) {
            return 'funny';
        }
        if (text.includes('clever') || text.includes('smart') || text.includes('witty')) {
            return 'clever';
        }
        if (text.includes('direct') || text.includes('straight') || text.includes('honest')) {
            return 'direct';
        }
        if (text.includes('cheesy')) {
            return 'cheesy';
        }

        return null; // Let the recommender decide
    }

    /**
     * Analyze conversation using Groq AI (advanced)
     */
    async analyzeConversationWithGroq(conversation) {
        if (!this.useAI) {
            console.log('⚠️  Groq API key not found, using rule-based analysis');
            return this.analyzeConversation(conversation);
        }

        try {
            const prompt = `You are an expert at analyzing conversations for a flirting coach app. Analyze the following conversation and return a JSON object with these fields:

- tone: The overall tone (choose ONE: romantic, playful, funny, clever, direct, smooth, cheesy, bold)
- stage: The relationship stage (choose ONE: initial, middle, advanced)
- preferredStyle: Cultural style (choose ONE: kenyan, international, sheng, mixed, swahili)
- preferredCategory: Best category for response (choose ONE: romantic, playful, funny, clever, direct, smooth, cheesy, bold)
- confidence: Your confidence level (0.0 to 1.0)

Conversation: "${conversation}"

Respond with ONLY valid JSON, no additional text.`;

            const completion = await this.groq.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: "You are a conversation analyzer for a flirting coach app. You respond only with valid JSON."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                model: "llama-3.3-70b-versatile",
                temperature: 0.3,
                max_tokens: 200,
                response_format: { type: "json_object" }
            });

            const response = completion.choices[0]?.message?.content;
            const analysis = JSON.parse(response);

            return {
                tone: analysis.tone || 'playful',
                stage: analysis.stage || 'initial',
                preferredStyle: analysis.preferredStyle || 'international',
                preferredCategory: analysis.preferredCategory || null,
                confidence: analysis.confidence || 0.8,
                method: 'groq-ai',
                conversation: conversation
            };

        } catch (error) {
            // Silently fall back to rule-based analysis
            const analysis = this.analyzeConversation(conversation);
            analysis.method = 'rule-based-fallback';
            return analysis;
        }
    }

    /**
     * Get AI-powered recommendations based on conversation
     */
    async getRecommendations(conversation, count = 5) {
        const analysis = await this.analyzeConversationWithGroq(conversation);

        // Build filters based on analysis
        const filters = {
            stage: analysis.stage,
            style: analysis.preferredStyle,
            minQuality: 3.5 // Only high-quality lines
        };

        if (analysis.preferredCategory) {
            filters.category = analysis.preferredCategory;
        } else {
            filters.category = analysis.tone;
        }

        // Get recommendations
        const recommendations = await this.getRandomLines(filters, count);

        // If not enough results, try with fewer filters
        if (recommendations.length < count) {
            delete filters.category;
            const moreRecommendations = await this.getRandomLines(filters, count - recommendations.length);
            recommendations.push(...moreRecommendations);
        }

        return {
            analysis,
            recommendations,
            count: recommendations.length
        };
    }

    /**
     * Get weighted random lines (higher quality = higher chance)
     */
    async getWeightedRandomLines(count = 5) {
        await this.connect();

        // Get all lines with their quality scores
        const [lines] = await this.db.query(`
            SELECT *, quality_score as weight 
            FROM flirting_lines 
            WHERE quality_score >= 3.0
            ORDER BY quality_score DESC
            LIMIT 100
        `);

        // Weighted random selection
        const selected = [];
        const totalWeight = lines.reduce((sum, line) => sum + line.weight, 0);

        for (let i = 0; i < count && lines.length > 0; i++) {
            let random = Math.random() * totalWeight;
            let selectedIndex = 0;

            for (let j = 0; j < lines.length; j++) {
                random -= lines[j].weight;
                if (random <= 0) {
                    selectedIndex = j;
                    break;
                }
            }

            selected.push(lines[selectedIndex]);
            lines.splice(selectedIndex, 1);
        }

        return selected;
    }

    async close() {
        if (this.db) {
            await this.db.end();
            this.db = null;
        }
    }
}

module.exports = AIRecommender;
