import os
import mysql.connector
from flask import Flask, render_template, request, jsonify, redirect, url_for
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Database configuration
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', ''),
    'database': os.getenv('DB_NAME', 'vibe_coach')
}

def get_db_connection():
    """Create database connection"""
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        return conn
    except mysql.connector.Error as e:
        print(f"Database connection error: {e}")
        return None

@app.route('/')
def index():
    """Home page with form to add flirting lines"""
    return render_template('index.html')

@app.route('/add_line', methods=['POST'])
def add_line():
    """Add a flirting line to the database"""
    try:
        # Get form data
        line_text = request.form.get('line_text')
        category = request.form.get('category')
        style = request.form.get('style')
        language = request.form.get('language')
        tags = request.form.get('tags', '')
        
        # Validate required fields
        if not line_text or not category:
            return jsonify({'success': False, 'message': 'Line text and category are required'}), 400
        
        # Connect to database
        conn = get_db_connection()
        if not conn:
            return jsonify({'success': False, 'message': 'Database connection failed'}), 500
        
        cursor = conn.cursor()
        
        # Insert the flirting line
        query = """
            INSERT INTO flirting_lines (line_text, category, style, language, usage_count)
            VALUES (%s, %s, %s, %s, 0)
        """
        cursor.execute(query, (line_text, category, style, language))
        line_id = cursor.lastrowid
        
        # Add tags if provided
        if tags:
            tag_list = [tag.strip() for tag in tags.split(',')]
            for tag_name in tag_list:
                # Check if tag exists
                cursor.execute("SELECT tag_id FROM tags WHERE tag_name = %s", (tag_name,))
                result = cursor.fetchone()
                
                if result:
                    tag_id = result[0]
                else:
                    # Create new tag
                    cursor.execute("INSERT INTO tags (tag_name) VALUES (%s)", (tag_name,))
                    tag_id = cursor.lastrowid
                
                # Link tag to line
                cursor.execute(
                    "INSERT INTO line_tags (line_id, tag_id) VALUES (%s, %s)",
                    (line_id, tag_id)
                )
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({'success': True, 'message': 'Line added successfully!'})
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/lines')
def view_lines():
    """View all flirting lines"""
    try:
        conn = get_db_connection()
        if not conn:
            return "Database connection failed", 500
        
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT line_id, line_text, category, style, language, usage_count, created_at
            FROM flirting_lines
            ORDER BY created_at DESC
            LIMIT 100
        """)
        lines = cursor.fetchall()
        cursor.close()
        conn.close()
        
        return render_template('view_lines.html', lines=lines)
        
    except Exception as e:
        return f"Error: {e}", 500

@app.route('/stats')
def stats():
    """View database statistics"""
    try:
        conn = get_db_connection()
        if not conn:
            return "Database connection failed", 500
        
        cursor = conn.cursor(dictionary=True)
        
        # Get total lines
        cursor.execute("SELECT COUNT(*) as total FROM flirting_lines")
        total_lines = cursor.fetchone()['total']
        
        # Get lines by category
        cursor.execute("""
            SELECT category, COUNT(*) as count
            FROM flirting_lines
            GROUP BY category
        """)
        by_category = cursor.fetchall()
        
        # Get most used lines
        cursor.execute("""
            SELECT line_text, usage_count
            FROM flirting_lines
            ORDER BY usage_count DESC
            LIMIT 10
        """)
        most_used = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return render_template('stats.html', 
                             total_lines=total_lines,
                             by_category=by_category,
                             most_used=most_used)
        
    except Exception as e:
        return f"Error: {e}", 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
