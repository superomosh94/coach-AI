-- ============================================
-- DATABASE: vibe_coach
-- PURPOSE: Store and organize flirting lines
-- ============================================

CREATE DATABASE IF NOT EXISTS vibe_coach;
USE vibe_coach;

-- ============================================
-- 1. MAIN LINES TABLE (Core storage)
-- ============================================
CREATE TABLE IF NOT EXISTS flirting_lines (
    line_id INT PRIMARY KEY AUTO_INCREMENT,
    line_text TEXT NOT NULL,
    
    -- Categorization
    category ENUM('playful', 'smooth', 'direct', 'funny', 'cheesy', 'romantic', 'clever', 'bold') DEFAULT 'playful',
    
    -- Cultural Context
    style ENUM('kenyan', 'international', 'sheng', 'swahili', 'mixed') DEFAULT 'international',
    
    -- Usage Context
    context ENUM(
        'opening', 
        'response', 
        'followup', 
        'recovery', 
        'closing',
        'teasing',
        'compliment',
        'question',
        'statement'
    ) DEFAULT 'opening',
    
    -- Conversation Stage
    stage ENUM('initial', 'middle', 'advanced', 'closing') DEFAULT 'initial',
    
    -- Gender Specificity
    target_gender ENUM('female', 'male', 'neutral', 'both') DEFAULT 'neutral',
    
    -- Platform/Source Type
    source_type ENUM(
        'reddit',
        'twitter', 
        'website',
        'book',
        'movie',
        'manual_entry',
        'forum',
        'whatsapp',
        'tiktok'
    ) DEFAULT 'manual_entry',
    
    -- Quality Metrics (to be filled as you review)
    quality_score DECIMAL(3,2) CHECK (quality_score BETWEEN 0 AND 5) DEFAULT 0,
    originality_score DECIMAL(3,2) CHECK (originality_score BETWEEN 0 AND 5) DEFAULT 0,
    success_rate DECIMAL(3,2) CHECK (success_rate BETWEEN 0 AND 1) DEFAULT 0.5,
    
    -- Technical Data
    character_count INT DEFAULT 0,
    word_count INT DEFAULT 0,
    has_emoji BOOLEAN DEFAULT FALSE,
    has_question BOOLEAN DEFAULT FALSE,
    has_compliment BOOLEAN DEFAULT FALSE,
    
    -- Usage Tracking
    usage_count INT DEFAULT 0,
    last_used_date DATETIME DEFAULT NULL,
    
    -- Source Information
    original_source VARCHAR(500),
    source_url VARCHAR(1000),
    scrape_date DATE,
    author VARCHAR(100),
    
    -- Moderation Flags
    is_approved BOOLEAN DEFAULT FALSE,
    is_explicit BOOLEAN DEFAULT FALSE,
    requires_context BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes for faster queries
    INDEX idx_category (category),
    INDEX idx_style (style),
    INDEX idx_context (context),
    INDEX idx_quality (quality_score DESC),
    INDEX idx_success (success_rate DESC),
    INDEX idx_created (created_at),
    FULLTEXT idx_search (line_text)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 2. TAGS TABLE (For categorization)
-- ============================================
CREATE TABLE IF NOT EXISTS tags (
    tag_id INT PRIMARY KEY AUTO_INCREMENT,
    tag_name VARCHAR(50) UNIQUE NOT NULL,
    tag_type ENUM('topic', 'style', 'situation', 'audience', 'platform') DEFAULT 'topic',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 3. LINE_TAGS JUNCTION TABLE (Many-to-Many)
-- ============================================
CREATE TABLE IF NOT EXISTS line_tags (
    line_id INT,
    tag_id INT,
    confidence DECIMAL(3,2) DEFAULT 1.0,
    added_by VARCHAR(50) DEFAULT 'system',
    PRIMARY KEY (line_id, tag_id),
    FOREIGN KEY (line_id) REFERENCES flirting_lines(line_id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(tag_id) ON DELETE CASCADE,
    INDEX idx_line (line_id),
    INDEX idx_tag (tag_id)
);

-- ============================================
-- 4. SOURCES TABLE (Track where you scraped from)
-- ============================================
CREATE TABLE IF NOT EXISTS sources (
    source_id INT PRIMARY KEY AUTO_INCREMENT,
    source_name VARCHAR(200) NOT NULL,
    source_url VARCHAR(500),
    source_type ENUM('website', 'social_media', 'forum', 'app', 'book', 'other') DEFAULT 'website',
    domain VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    scrape_frequency ENUM('daily', 'weekly', 'monthly', 'manual', 'once') DEFAULT 'manual',
    last_scraped DATETIME DEFAULT NULL,
    total_lines_scraped INT DEFAULT 0,
    reliability_score DECIMAL(3,2) DEFAULT 0.5,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 5. SCRAPE_LOGS TABLE (Track scraping activity)
-- ============================================
CREATE TABLE IF NOT EXISTS scrape_logs (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    source_id INT,
    scrape_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    lines_found INT DEFAULT 0,
    lines_new INT DEFAULT 0,
    lines_duplicate INT DEFAULT 0,
    lines_filtered INT DEFAULT 0,
    duration_seconds INT,
    status ENUM('success', 'partial', 'failed', 'no_new_data') DEFAULT 'success',
    error_message TEXT,
    FOREIGN KEY (source_id) REFERENCES sources(source_id)
);

-- ============================================
-- 6. DUPLICATE_CHECKS TABLE (Avoid duplicates)
-- ============================================
CREATE TABLE IF NOT EXISTS duplicate_checks (
    hash_id VARCHAR(64) PRIMARY KEY,  -- SHA256 hash of line_text
    line_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (line_id) REFERENCES flirting_lines(line_id)
);

-- ============================================
-- 7. USER_FEEDBACK TABLE (For manual review)
-- ============================================
CREATE TABLE IF NOT EXISTS user_feedback (
    feedback_id INT PRIMARY KEY AUTO_INCREMENT,
    line_id INT,
    reviewer_name VARCHAR(100),
    rating INT CHECK (rating BETWEEN 1 AND 5),
    
    -- Specific feedback
    is_cringy BOOLEAN DEFAULT FALSE,
    is_effective BOOLEAN DEFAULT FALSE,
    is_cultural BOOLEAN DEFAULT FALSE,
    is_original BOOLEAN DEFAULT FALSE,
    
    -- Suggestions
    suggested_improvement TEXT,
    alternative_phrasing TEXT,
    
    -- Context
    target_demographic VARCHAR(100),
    suggested_context VARCHAR(200),
    
    feedback_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (line_id) REFERENCES flirting_lines(line_id),
    INDEX idx_line_feedback (line_id),
    INDEX idx_rating (rating DESC)
);

-- ============================================
-- 8. LINE_VARIANTS TABLE (Store similar lines)
-- ============================================
CREATE TABLE IF NOT EXISTS line_variants (
    variant_id INT PRIMARY KEY AUTO_INCREMENT,
    original_line_id INT,
    variant_text TEXT NOT NULL,
    variant_type ENUM('kenyanized', 'simplified', 'formalized', 'playful', 'direct') DEFAULT 'kenyanized',
    created_by VARCHAR(50) DEFAULT 'system',
    quality_score DECIMAL(3,2) DEFAULT 0,
    FOREIGN KEY (original_line_id) REFERENCES flirting_lines(line_id)
);

-- ============================================
-- 9. KEYWORD_TRIGGERS TABLE (For smart matching)
-- ============================================
CREATE TABLE IF NOT EXISTS keyword_triggers (
    trigger_id INT PRIMARY KEY AUTO_INCREMENT,
    keyword VARCHAR(100) NOT NULL,
    keyword_type ENUM('word', 'phrase', 'emoji', 'pattern') DEFAULT 'word',
    
    -- Response suggestions
    suggested_category ENUM('playful', 'smooth', 'direct', 'funny', 'cheesy') DEFAULT 'playful',
    suggested_context ENUM('opening', 'response', 'followup', 'recovery') DEFAULT 'response',
    
    -- Match behavior
    match_type ENUM('exact', 'contains', 'regex', 'similar') DEFAULT 'contains',
    match_priority INT DEFAULT 1,  -- Higher = more important
    
    -- Response templates (for auto-generation)
    response_template TEXT,
    
    example_line_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (example_line_id) REFERENCES flirting_lines(line_id),
    
    INDEX idx_keyword (keyword),
    INDEX idx_priority (match_priority DESC)
);

-- ============================================
-- 10. CULTURAL_TERMS TABLE (Kenyan/Swahili terms)
-- ============================================
CREATE TABLE IF NOT EXISTS cultural_terms (
    term_id INT PRIMARY KEY AUTO_INCREMENT,
    term VARCHAR(100) NOT NULL,
    language ENUM('swahili', 'sheng', 'english', 'mixed') DEFAULT 'swahili',
    meaning TEXT,
    usage_context VARCHAR(200),
    popularity_score INT DEFAULT 1,
    is_slang BOOLEAN DEFAULT TRUE,
    example_usage TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_term (term),
    INDEX idx_language (language)
);

-- ============================================
-- 11. LINE_STATS VIEW (For quick analytics)
-- ============================================
CREATE OR REPLACE VIEW line_stats AS
SELECT 
    COUNT(*) as total_lines,
    SUM(CASE WHEN is_approved = TRUE THEN 1 ELSE 0 END) as approved_lines,
    SUM(CASE WHEN style = 'kenyan' THEN 1 ELSE 0 END) as kenyan_lines,
    SUM(CASE WHEN style = 'sheng' THEN 1 ELSE 0 END) as sheng_lines,
    AVG(quality_score) as avg_quality,
    AVG(success_rate) as avg_success,
    MIN(created_at) as oldest_line,
    MAX(created_at) as newest_line,
    COUNT(DISTINCT category) as categories_count,
    COUNT(DISTINCT source_type) as sources_count
FROM flirting_lines;

-- ============================================
-- 12. SCRAPING_QUEUE TABLE (Manage what to scrape)
-- ============================================
CREATE TABLE IF NOT EXISTS scraping_queue (
    queue_id INT PRIMARY KEY AUTO_INCREMENT,
    source_url VARCHAR(1000) NOT NULL,
    source_name VARCHAR(200),
    priority INT DEFAULT 1,  -- 1=low, 5=high
    status ENUM('pending', 'in_progress', 'completed', 'failed', 'skipped') DEFAULT 'pending',
    scheduled_time DATETIME,
    assigned_to VARCHAR(100),
    retry_count INT DEFAULT 0,
    max_retries INT DEFAULT 3,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    started_at DATETIME DEFAULT NULL,
    completed_at DATETIME DEFAULT NULL,
    
    INDEX idx_status (status),
    INDEX idx_priority (priority DESC),
    INDEX idx_scheduled (scheduled_time)
);

-- ============================================
-- STORED PROCEDURES (For common operations)
-- ============================================

-- Get random line by category
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS GetRandomLine(
    IN p_category VARCHAR(20),
    IN p_style VARCHAR(20),
    IN p_min_quality DECIMAL(3,2)
)
BEGIN
    SELECT line_id, line_text, category, style, quality_score, success_rate
    FROM flirting_lines
    WHERE is_approved = TRUE
        AND (p_category IS NULL OR category = p_category)
        AND (p_style IS NULL OR style = p_style)
        AND quality_score >= p_min_quality
    ORDER BY RAND()
    LIMIT 1;
END //
DELIMITER ;

-- Update line stats after feedback
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS UpdateLineStats(
    IN p_line_id INT,
    IN p_rating INT
)
BEGIN
    DECLARE v_old_success DECIMAL(3,2);
    DECLARE v_new_success DECIMAL(3,2);
    DECLARE v_usage INT;
    
    SELECT success_rate, usage_count INTO v_old_success, v_usage
    FROM flirting_lines WHERE line_id = p_line_id;
    
    SET v_new_success = ((v_old_success * v_usage) + (p_rating / 5.0)) / (v_usage + 1);
    
    UPDATE flirting_lines 
    SET success_rate = v_new_success,
        usage_count = usage_count + 1,
        last_used_date = NOW()
    WHERE line_id = p_line_id;
END //
DELIMITER ;

-- ============================================
-- TRIGGERS (Automate common tasks)
-- ============================================

-- Auto-calculate character and word counts
DELIMITER //
DROP TRIGGER IF EXISTS before_line_insert;
CREATE TRIGGER before_line_insert
BEFORE INSERT ON flirting_lines
FOR EACH ROW
BEGIN
    SET NEW.character_count = CHAR_LENGTH(NEW.line_text);
    SET NEW.word_count = LENGTH(NEW.line_text) - LENGTH(REPLACE(NEW.line_text, ' ', '')) + 1;
    SET NEW.has_emoji = (NEW.line_text REGEXP '[🚀-🙏]|[😀-😺]');
    SET NEW.has_question = (NEW.line_text LIKE '%?%');
    SET NEW.has_compliment = (
        NEW.line_text LIKE '%beautiful%' OR
        NEW.line_text LIKE '%handsome%' OR
        NEW.line_text LIKE '%cute%' OR
        NEW.line_text LIKE '%nice%' OR
        NEW.line_text LIKE '%amazing%'
    );
END //
DELIMITER ;

-- Same for updates
DELIMITER //
DROP TRIGGER IF EXISTS before_line_update;
CREATE TRIGGER before_line_update
BEFORE UPDATE ON flirting_lines
FOR EACH ROW
BEGIN
    SET NEW.character_count = CHAR_LENGTH(NEW.line_text);
    SET NEW.word_count = LENGTH(NEW.line_text) - LENGTH(REPLACE(NEW.line_text, ' ', '')) + 1;
    SET NEW.has_emoji = (NEW.line_text REGEXP '[🚀-🙏]|[😀-😺]');
    SET NEW.has_question = (NEW.line_text LIKE '%?%');
END //
DELIMITER ;
