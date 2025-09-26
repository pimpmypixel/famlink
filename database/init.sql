-- Initialize PostgreSQL database for Famlink application

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enable pg_vector extension for AI/vector search features
-- Note: This requires the pgvector extension to be installed
-- If not available, this will be skipped
DO $$
BEGIN
    CREATE EXTENSION IF NOT EXISTS "vector";
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'pgvector extension not available, skipping...';
END
$$;

-- Create vector embeddings table for AI features
CREATE TABLE IF NOT EXISTS vector_embeddings (
    id SERIAL PRIMARY KEY,
    reference_id VARCHAR(255),
    content TEXT,
    embedding vector(1536), -- OpenAI ada-002 dimensions
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vector_embeddings_reference_id ON vector_embeddings(reference_id);
CREATE INDEX IF NOT EXISTS idx_vector_embeddings_created_at ON vector_embeddings(created_at);

-- Create index for vector similarity search (if pgvector is available)
DO $$
BEGIN
    CREATE INDEX IF NOT EXISTS idx_vector_embeddings_embedding ON vector_embeddings USING ivfflat (embedding vector_cosine_ops);
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Vector index creation failed, pgvector may not be available';
END
$$;

-- Set up proper permissions
GRANT ALL PRIVILEGES ON DATABASE postgres TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;

-- Allow postgres user to create databases and manage schemas
ALTER USER postgres CREATEDB;
