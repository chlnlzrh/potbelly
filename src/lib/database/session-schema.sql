-- Session Logging Database Schema
-- Optimized for performance and security compliance

-- Session logs table
CREATE TABLE IF NOT EXISTS session_logs (
    id UUID PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    session_id VARCHAR(255) NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    action VARCHAR(100) NOT NULL,
    metadata JSONB,
    ip_address INET,
    user_agent TEXT,
    duration INTEGER,
    ai_model_used VARCHAR(100),
    sensitive BOOLEAN DEFAULT FALSE,
    risk_level VARCHAR(20) DEFAULT 'low',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI interactions table
CREATE TABLE IF NOT EXISTS ai_interactions (
    id UUID PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    model_version VARCHAR(100) NOT NULL,
    prompt TEXT,
    response TEXT,
    token_count INTEGER,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    risk_level VARCHAR(20) DEFAULT 'low',
    sanitized BOOLEAN DEFAULT FALSE,
    prompt_injection_detected BOOLEAN DEFAULT FALSE,
    sensitive_data_detected BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Security events table
CREATE TABLE IF NOT EXISTS security_events (
    id UUID PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    description TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    blocked BOOLEAN DEFAULT FALSE,
    response TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit events table
CREATE TABLE IF NOT EXISTS audit_events (
    id UUID PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    session_id VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(255) NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    success BOOLEAN NOT NULL,
    changes JSONB,
    reason TEXT,
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User sessions table for active session tracking
CREATE TABLE IF NOT EXISTS user_sessions (
    session_id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_activity TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    device_info JSONB,
    preferences JSONB,
    current_page VARCHAR(255),
    action_count INTEGER DEFAULT 0,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_session_logs_user_timestamp ON session_logs(user_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_session_logs_session_id ON session_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_session_logs_action ON session_logs(action);
CREATE INDEX IF NOT EXISTS idx_session_logs_risk_level ON session_logs(risk_level);
CREATE INDEX IF NOT EXISTS idx_session_logs_timestamp ON session_logs(timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_ai_interactions_session_id ON ai_interactions(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_timestamp ON ai_interactions(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_risk_level ON ai_interactions(risk_level);

CREATE INDEX IF NOT EXISTS idx_security_events_session_id ON security_events(session_id);
CREATE INDEX IF NOT EXISTS idx_security_events_severity ON security_events(severity);
CREATE INDEX IF NOT EXISTS idx_security_events_timestamp ON security_events(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_security_events_type ON security_events(type);

CREATE INDEX IF NOT EXISTS idx_audit_events_user_id ON audit_events(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_session_id ON audit_events(session_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_timestamp ON audit_events(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_events_resource ON audit_events(resource);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_active ON user_sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_user_sessions_last_activity ON user_sessions(last_activity);

-- JSONB indexes for metadata queries
CREATE INDEX IF NOT EXISTS idx_session_logs_metadata_gin ON session_logs USING GIN(metadata);
CREATE INDEX IF NOT EXISTS idx_user_sessions_device_info_gin ON user_sessions USING GIN(device_info);
CREATE INDEX IF NOT EXISTS idx_user_sessions_preferences_gin ON user_sessions USING GIN(preferences);

-- Partitioning for large-scale deployments (optional)
-- CREATE TABLE session_logs_2024 PARTITION OF session_logs
-- FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

-- Data retention policy (runs daily)
CREATE OR REPLACE FUNCTION cleanup_old_logs()
RETURNS void AS $$
BEGIN
    -- Delete logs older than retention period (90 days default)
    DELETE FROM session_logs WHERE created_at < NOW() - INTERVAL '90 days';
    DELETE FROM ai_interactions WHERE created_at < NOW() - INTERVAL '90 days';
    DELETE FROM security_events WHERE created_at < NOW() - INTERVAL '365 days'; -- Keep security events longer
    DELETE FROM audit_events WHERE created_at < NOW() - INTERVAL '365 days'; -- Keep audit events longer
    DELETE FROM user_sessions WHERE last_activity < NOW() - INTERVAL '30 days' AND is_active = FALSE;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update session activity
CREATE OR REPLACE FUNCTION update_session_activity()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE user_sessions 
    SET 
        last_activity = NOW(),
        action_count = action_count + 1,
        updated_at = NOW()
    WHERE session_id = NEW.session_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_session_activity
    AFTER INSERT ON session_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_session_activity();

-- Security function to detect anomalies
CREATE OR REPLACE FUNCTION detect_session_anomalies(p_session_id VARCHAR(255))
RETURNS TABLE(anomaly_type VARCHAR(100), severity VARCHAR(20), description TEXT) AS $$
BEGIN
    -- Check for excessive actions in short time
    RETURN QUERY
    SELECT 
        'high_activity'::VARCHAR(100) as anomaly_type,
        'medium'::VARCHAR(20) as severity,
        'High number of actions in short time period'::TEXT as description
    FROM session_logs 
    WHERE session_id = p_session_id 
        AND timestamp > NOW() - INTERVAL '5 minutes'
    GROUP BY session_id
    HAVING COUNT(*) > 50;

    -- Check for multiple high-risk actions
    RETURN QUERY
    SELECT 
        'multiple_risks'::VARCHAR(100) as anomaly_type,
        'high'::VARCHAR(20) as severity,
        'Multiple high-risk actions detected'::TEXT as description
    FROM session_logs 
    WHERE session_id = p_session_id 
        AND risk_level IN ('high', 'critical')
        AND timestamp > NOW() - INTERVAL '1 hour'
    GROUP BY session_id
    HAVING COUNT(*) > 3;

    -- Check for sensitive data exposure
    RETURN QUERY
    SELECT 
        'sensitive_exposure'::VARCHAR(100) as anomaly_type,
        'critical'::VARCHAR(20) as severity,
        'Sensitive data exposure detected'::TEXT as description
    FROM session_logs 
    WHERE session_id = p_session_id 
        AND sensitive = TRUE
        AND timestamp > NOW() - INTERVAL '1 hour'
    GROUP BY session_id
    HAVING COUNT(*) > 0;
END;
$$ LANGUAGE plpgsql;

-- View for session analytics
CREATE OR REPLACE VIEW session_analytics AS
SELECT 
    s.session_id,
    s.user_id,
    s.start_time,
    s.last_activity,
    s.action_count,
    EXTRACT(EPOCH FROM (s.last_activity - s.start_time))/60 as duration_minutes,
    COUNT(CASE WHEN sl.risk_level = 'high' THEN 1 END) as high_risk_actions,
    COUNT(CASE WHEN sl.risk_level = 'critical' THEN 1 END) as critical_risk_actions,
    COUNT(CASE WHEN sl.action = 'ai_query' THEN 1 END) as ai_interactions,
    COUNT(CASE WHEN sl.sensitive = TRUE THEN 1 END) as sensitive_actions,
    MAX(sl.timestamp) as last_log_time
FROM user_sessions s
LEFT JOIN session_logs sl ON s.session_id = sl.session_id
GROUP BY s.session_id, s.user_id, s.start_time, s.last_activity, s.action_count;

-- Performance monitoring view
CREATE OR REPLACE VIEW performance_metrics AS
SELECT 
    DATE_TRUNC('hour', timestamp) as hour,
    action,
    COUNT(*) as action_count,
    AVG(duration) as avg_duration_ms,
    COUNT(CASE WHEN risk_level = 'high' THEN 1 END) as high_risk_count,
    COUNT(CASE WHEN sensitive = TRUE THEN 1 END) as sensitive_count
FROM session_logs
WHERE timestamp > NOW() - INTERVAL '24 hours'
GROUP BY DATE_TRUNC('hour', timestamp), action
ORDER BY hour DESC, action_count DESC;