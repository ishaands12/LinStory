CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    current_level INTEGER DEFAULT 1,
    current_xp INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS module_progress (
    user_id TEXT,
    module_id TEXT,
    completed_sections INTEGER DEFAULT 0,
    total_sections INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT 0,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, module_id),
    FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS quiz_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    quiz_id TEXT,
    score INTEGER,
    max_score INTEGER,
    attempt_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

-- Insert a default user for local dev
INSERT OR IGNORE INTO users (id, name, current_level, current_xp) VALUES ('user_1', 'Student One', 1, 0);
