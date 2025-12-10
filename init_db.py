import os
import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_NAME = os.getenv("DB_NAME", "vibe_coach")
SCHEMA_FILE = os.path.join("database", "schema.sql")
SEED_FILE = os.path.join("database", "seed.sql")

def create_connection(db_name=None):
    """Create a database connection"""
    connection = None
    try:
        connection = mysql.connector.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=db_name
        )
        print(f"Connection to MySQL DB {'[' + db_name + ']' if db_name else '(Server)'} successful")
    except Error as e:
        print(f"The error '{e}' occurred")
    return connection

def execute_sql_file(connection, file_path):
    """Execute SQL commands from a file"""
    if not os.path.exists(file_path):
        print(f"Error: File '{file_path}' not found.")
        return

    print(f"Executing {file_path}...")
    cursor = connection.cursor()
    
    with open(file_path, 'r', encoding='utf-8') as f:
        sql_content = f.read()

    # Split by semicolon, but handle delimiters for stored procedures
    # A simple split won't work well with DELIMITER //...//
    commands = []
    
    # Simple parsing logic for this specific project structure
    # Since checking for DELIMITER is complex, we use the `multi=True` feature of execute() usually,
    # but `execute()` doesn't support executing a whole script string directly easily in one go with pure multi=True for mixed delimiter changes.
    # However, mysql-connector's cursor.execute(operation, multi=True) returns an iterator.
    
    try:
        # We try to execute the whole script at once using multi=True
        # Note regarding DELIMITER: The Python connector often doesn't need or recognize the 'DELIMITER' command 
        # the same way the CLI does, but `multi=True` handles multiple statements. 
        # However, for stored procedures with delimiters in the file, it can be tricky.
        # IF the SQL file has `DELIMITER //`, we might need to pre-process or assume the connector handles it.
        # Actually, standard python mysql connector fails on 'DELIMITER'.
        # Solution: We will remove DELIMITER lines and split manually or try a robust method.
        # Given the schema content provided earlier, it uses DELIMITER. We'll strip them and split by specific tokens manually 
        # OR better: Read the file, and since we generated it, we know the structure.
        
        # Strategy: Use cursor.execute with multi=True on the whole content? 
        # No, 'DELIMITER' is a client command.
        
        # Let's clean the SQL: remove DELIMITER lines, replace // with ; where appropriate? 
        # That's risky.
        
        # Better approach for this specific schema:
        # Pre-process content to handle the stored procedures blocks.
        
        idx = 0
        statements = []
        delimiter = ";"
        current_statement = ""
        
        lines = sql_content.splitlines()
        for line in lines:
            line = line.strip()
            if not line or line.startswith("--"):
                continue
                
            if line.upper().startswith("DELIMITER"):
                delimiter = line.split()[1]
                continue
                
            current_statement += line + " "
            
            if current_statement.strip().endswith(delimiter):
                # Remove buffer delimiter
                stmt = current_statement.strip()[: -len(delimiter)]
                statements.append(stmt)
                current_statement = ""
                
        # Execute each statement
        for statement in statements:
            if statement.strip():
                try:
                    cursor.execute(statement)
                    # Consume result
                    while cursor.nextset():
                        pass
                except Error as e:
                    print(f"Failed executing statement: {statement[:50]}... Error: {e}")

        connection.commit()
        print(f"Successfully executed {file_path}")
        
    except Error as e:
        print(f"Failed to execute script: {e}")

def init_db():
    # 1. Connect to Server (no DB) to create DB
    try:
        conn = create_connection()
        if conn is None:
            return
        
        # Ensure DB exists (handled in schema.sql but good to double check or create here)
        cursor = conn.cursor()
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_NAME}")
        print(f"Database {DB_NAME} checked/created.")
        conn.close()
        
        # 2. Connect to actual DB
        conn = create_connection(DB_NAME)
        if conn is None:
            return
            
        # 3. Execute Schema
        execute_sql_file(conn, SCHEMA_FILE)
        
        # 4. Execute Seed
        execute_sql_file(conn, SEED_FILE)
        
        conn.close()
        print("Database initialization complete!")
        
    except Exception as e:
        print(f"Initialization failed: {e}")

if __name__ == "__main__":
    init_db()
