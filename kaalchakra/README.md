Create the payments table in Supabase with the following structure (you can run this SQL):

CREATE TABLE payments (
  id BIGSERIAL PRIMARY KEY,
  order_id TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id),
  amount INTEGER NOT NULL, -- in paise
  currency TEXT NOT NULL DEFAULT 'INR',
  payment_id TEXT,
  status TEXT DEFAULT 'created',
  service TEXT,
  service_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);