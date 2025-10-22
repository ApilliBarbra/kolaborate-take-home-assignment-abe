CREATE TABLE IF NOT EXISTS profiles (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  location TEXT NOT NULL,
  skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  experience_years NUMERIC(4,1) NOT NULL CHECK (experience_years >= 0),
  available_for_work BOOLEAN NOT NULL,
  hourly_rate NUMERIC(10,2) NOT NULL CHECK (hourly_rate >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
