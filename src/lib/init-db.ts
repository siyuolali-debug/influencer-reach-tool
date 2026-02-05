import { supabase } from './supabase';

export async function initDatabase() {
  try {
    // 创建influencers表
    const { error: influencersError } = await supabase.rpc('execute_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS influencers (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          platform TEXT, -- 如 TikTok, IG
          status TEXT DEFAULT 'pending', -- pending, sent, replied
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (influencersError) {
      console.error('Error creating influencers table:', influencersError);
      return false;
    }

    // 创建email_templates表
    const { error: templatesError } = await supabase.rpc('execute_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS email_templates (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title TEXT NOT NULL,
          subject TEXT NOT NULL,
          body TEXT NOT NULL, -- 支持 {{name}} 占位符
          category TEXT, -- 如 'outreach', 'follow_up'
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (templatesError) {
      console.error('Error creating email_templates table:', templatesError);
      return false;
    }

    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
}
