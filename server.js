const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
const AIRecommender = require('./ai-recommender');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const recommender = new AIRecommender();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MySQL Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'vibe_coach'
});

db.connect((err) => {
    if (err) {
        console.error('❌ Database connection failed:', err.message);
        console.log('⚠️  App will run but database features will not work');
        console.log('💡 Run: node init-mysql.js to initialize the database\n');
    } else {
        console.log('✓ Connected to MySQL database\n');
    }
});

// Routes
app.get('/', (req, res) => {
    res.render('index', { title: 'Vibe Coach - Home' });
});

app.get('/add', (req, res) => {
    res.render('add', { title: 'Add Line', message: null });
});

app.get('/analyze', (req, res) => {
    res.render('analyze', { title: 'AI Coach Analysis' });
});

app.get('/random', (req, res) => {
    res.render('random', { title: 'Random Line Generator' });
});

app.post('/add-line', (req, res) => {
    const { line_text, category, style, language, tags } = req.body;

    if (!line_text || !category) {
        return res.render('add', {
            title: 'Add Line',
            message: { type: 'error', text: 'Line text and category are required' }
        });
    }

    const query = 'INSERT INTO flirting_lines (line_text, category, style, language, usage_count) VALUES (?, ?, ?, ?, 0)';

    db.query(query, [line_text, category, style, language], (err, result) => {
        if (err) {
            console.error('Error inserting line:', err);
            return res.render('add', {
                title: 'Add Line',
                message: { type: 'error', text: 'Failed to add line: ' + err.message }
            });
        }

        res.render('add', {
            title: 'Add Line',
            message: { type: 'success', text: 'Line added successfully!' }
        });
    });
});

app.get('/lines', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = 50; // Lines per page
    const offset = (page - 1) * perPage;

    // Get total count first
    db.query('SELECT COUNT(*) as total FROM flirting_lines', (err, countResult) => {
        if (err) {
            return res.render('lines', {
                title: 'All Lines',
                lines: [],
                error: 'Failed to load lines',
                currentPage: 1,
                totalPages: 1,
                total: 0
            });
        }

        const total = countResult[0].total;
        const totalPages = Math.ceil(total / perPage);

        // Get lines for current page with random order
        db.query(
            `SELECT line_id, line_text, category, style, context, stage, quality_score, usage_count 
             FROM flirting_lines 
             ORDER BY RAND() 
             LIMIT ? OFFSET ?`,
            [perPage, offset],
            (err, lines) => {
                if (err) {
                    return res.render('lines', {
                        title: 'All Lines',
                        lines: [],
                        error: 'Failed to load lines',
                        currentPage: page,
                        totalPages: 1,
                        total: 0
                    });
                }

                res.render('lines', {
                    title: 'All Lines',
                    lines: lines,
                    error: null,
                    currentPage: page,
                    totalPages: totalPages,
                    total: total
                });
            }
        );
    });
});

app.get('/stats', (req, res) => {
    // Get total count
    db.query('SELECT COUNT(*) as total FROM flirting_lines', (err, totals) => {
        if (err) {
            return res.render('stats', {
                title: 'Statistics',
                total: 0,
                byCategory: [],
                mostUsed: [],
                error: 'Failed to load stats'
            });
        }

        // Get by category
        db.query('SELECT category, COUNT(*) as count FROM flirting_lines GROUP BY category', (err, byCategory) => {
            if (err) byCategory = [];

            // Get most used
            db.query('SELECT line_text, usage_count FROM flirting_lines ORDER BY usage_count DESC LIMIT 10', (err, mostUsed) => {
                if (err) mostUsed = [];

                res.render('stats', {
                    title: 'Statistics',
                    total: totals[0].total,
                    byCategory: byCategory,
                    mostUsed: mostUsed,
                    error: null
                });
            });
        });
    });
});

// ===== AI-POWERED API ENDPOINTS =====

// API: Get random lines with filters
app.get('/api/random', async (req, res) => {
    try {
        const { category, style, context, stage, minQuality, count } = req.query;

        const filters = {};
        if (category) filters.category = category;
        if (style) filters.style = style;
        if (context) filters.context = context;
        if (stage) filters.stage = stage;
        if (minQuality) filters.minQuality = parseFloat(minQuality);

        const lines = await recommender.getRandomLines(filters, parseInt(count) || 5);

        res.json({
            success: true,
            count: lines.length,
            filters,
            lines
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// API: Get AI-powered recommendations based on conversation
app.post('/api/recommend', async (req, res) => {
    try {
        const { conversation, count } = req.body;

        if (!conversation) {
            return res.status(400).json({
                success: false,
                error: 'Conversation text is required'
            });
        }

        const result = await recommender.getRecommendations(conversation, parseInt(count) || 5);

        res.json({
            success: true,
            ...result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// API: Analyze conversation context
app.post('/api/analyze', async (req, res) => {
    try {
        const { conversation } = req.body;

        if (!conversation) {
            return res.status(400).json({
                success: false,
                error: 'Conversation text is required'
            });
        }

        const analysis = recommender.analyzeConversation(conversation);

        res.json({
            success: true,
            analysis
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// API: Get weighted random lines (higher quality = higher probability)
app.get('/api/weighted-random', async (req, res) => {
    try {
        const count = parseInt(req.query.count) || 5;
        const lines = await recommender.getWeightedRandomLines(count);

        res.json({
            success: true,
            count: lines.length,
            lines
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});


app.listen(PORT, () => {
    console.log(`✓ Server running → http://localhost:${PORT}`);
});
