/*
  # Website Content Management Schema

  1. New Tables
    - `Website_Pages` - Store page content and metadata
    - `Website_Features` - Manage feature descriptions and benefits
    - `Website_Testimonials` - Customer testimonials and case studies
    - `Website_Resources` - Blog posts, guides, webinars, and downloads
    - `Website_FAQ` - Frequently asked questions
    - `Website_Pricing_Plans` - Pricing tiers and features
    - `Website_Lead_Magnets` - Downloadable resources requiring contact info
    - `Website_Demo_Requests` - Track demo and consultation requests
    - `Website_Analytics` - Track page views and user interactions
    - `Website_Settings` - Site-wide configuration and content

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage content
    - Public read access for website content

  3. Features
    - Content versioning support
    - SEO metadata management
    - Multi-language support ready
    - Analytics tracking
    - Lead capture and management
*/

-- Website Pages Table
CREATE TABLE IF NOT EXISTS Website_Pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  meta_description text,
  hero_title text,
  hero_subtitle text,
  content jsonb DEFAULT '{}'::jsonb,
  seo_data jsonb DEFAULT '{}'::jsonb,
  is_published boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE Website_Pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published pages"
  ON Website_Pages
  FOR SELECT
  TO public
  USING (is_published = true);

CREATE POLICY "Authenticated users can manage pages"
  ON Website_Pages
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Website Features Table
CREATE TABLE IF NOT EXISTS Website_Features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  icon_svg text,
  benefits text[] DEFAULT '{}',
  category text DEFAULT 'general',
  is_highlighted boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE Website_Features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active features"
  ON Website_Features
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage features"
  ON Website_Features
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Website Testimonials Table
CREATE TABLE IF NOT EXISTS Website_Testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_title text,
  customer_organization text NOT NULL,
  testimonial_text text NOT NULL,
  metrics jsonb DEFAULT '{}'::jsonb,
  case_study_data jsonb DEFAULT '{}'::jsonb,
  avatar_url text,
  is_featured boolean DEFAULT false,
  is_case_study boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE Website_Testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active testimonials"
  ON Website_Testimonials
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage testimonials"
  ON Website_Testimonials
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Website Resources Table
CREATE TABLE IF NOT EXISTS Website_Resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  content text,
  resource_type text NOT NULL CHECK (resource_type IN ('blog', 'guide', 'webinar', 'case-study', 'whitepaper')),
  topic text NOT NULL,
  reading_time_minutes integer,
  download_url text,
  thumbnail_url text,
  is_lead_magnet boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  tags text[] DEFAULT '{}',
  seo_data jsonb DEFAULT '{}'::jsonb,
  is_published boolean DEFAULT true,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE Website_Resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published resources"
  ON Website_Resources
  FOR SELECT
  TO public
  USING (is_published = true);

CREATE POLICY "Authenticated users can manage resources"
  ON Website_Resources
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Website FAQ Table
CREATE TABLE IF NOT EXISTS Website_FAQ (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text DEFAULT 'general',
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE Website_FAQ ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active FAQs"
  ON Website_FAQ
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage FAQs"
  ON Website_FAQ
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Website Pricing Plans Table
CREATE TABLE IF NOT EXISTS Website_Pricing_Plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  monthly_price numeric(10,2),
  annual_price numeric(10,2),
  features text[] DEFAULT '{}',
  is_popular boolean DEFAULT false,
  is_custom boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE Website_Pricing_Plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active pricing plans"
  ON Website_Pricing_Plans
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage pricing plans"
  ON Website_Pricing_Plans
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Website Lead Magnets Table
CREATE TABLE IF NOT EXISTS Website_Lead_Magnets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  resource_type text NOT NULL,
  download_url text,
  thumbnail_url text,
  features text[] DEFAULT '{}',
  form_fields jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE Website_Lead_Magnets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active lead magnets"
  ON Website_Lead_Magnets
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage lead magnets"
  ON Website_Lead_Magnets
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Website Demo Requests Table
CREATE TABLE IF NOT EXISTS Website_Demo_Requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_type text NOT NULL CHECK (request_type IN ('demo', 'call', 'consultation', 'lead_magnet')),
  name text NOT NULL,
  email text,
  phone text,
  organization text,
  role text,
  crm_system text,
  monthly_inquiries text,
  message text,
  resource_id uuid REFERENCES Website_Lead_Magnets(id),
  metadata jsonb DEFAULT '{}'::jsonb,
  status text DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'scheduled', 'completed', 'cancelled')),
  follow_up_requested boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE Website_Demo_Requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage demo requests"
  ON Website_Demo_Requests
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Website Analytics Table
CREATE TABLE IF NOT EXISTS Website_Analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug text NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('page_view', 'button_click', 'form_submit', 'download', 'chat_open')),
  event_data jsonb DEFAULT '{}'::jsonb,
  user_agent text,
  ip_address inet,
  referrer text,
  session_id text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE Website_Analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read analytics"
  ON Website_Analytics
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Public can insert analytics events"
  ON Website_Analytics
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Website Settings Table
CREATE TABLE IF NOT EXISTS Website_Settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value jsonb NOT NULL,
  description text,
  is_public boolean DEFAULT false,
  updated_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE Website_Settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read public settings"
  ON Website_Settings
  FOR SELECT
  TO public
  USING (is_public = true);

CREATE POLICY "Authenticated users can manage settings"
  ON Website_Settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_website_pages_slug ON Website_Pages(slug);
CREATE INDEX IF NOT EXISTS idx_website_pages_published ON Website_Pages(is_published, sort_order);
CREATE INDEX IF NOT EXISTS idx_website_features_category ON Website_Features(category, sort_order);
CREATE INDEX IF NOT EXISTS idx_website_testimonials_featured ON Website_Testimonials(is_featured, sort_order);
CREATE INDEX IF NOT EXISTS idx_website_resources_type ON Website_Resources(resource_type, is_published);
CREATE INDEX IF NOT EXISTS idx_website_resources_topic ON Website_Resources(topic, is_published);
CREATE INDEX IF NOT EXISTS idx_website_faq_category ON Website_FAQ(category, sort_order);
CREATE INDEX IF NOT EXISTS idx_website_pricing_active ON Website_Pricing_Plans(is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_website_demo_requests_status ON Website_Demo_Requests(status, created_at);
CREATE INDEX IF NOT EXISTS idx_website_analytics_page ON Website_Analytics(page_slug, created_at);
CREATE INDEX IF NOT EXISTS idx_website_analytics_event ON Website_Analytics(event_type, created_at);
CREATE INDEX IF NOT EXISTS idx_website_settings_key ON Website_Settings(setting_key);

-- Insert initial data
INSERT INTO Website_Settings (setting_key, setting_value, description, is_public) VALUES
('site_title', '"Agent Cory - AI Admissions Assistant"', 'Main site title', true),
('site_description', '"Boost admissions conversions with AI-powered speed & precision"', 'Site description for SEO', true),
('contact_phone', '"+1-555-CORY-AI"', 'Main contact phone number', true),
('contact_email', '"hello@agentcory.com"', 'Main contact email', true),
('company_address', '{"street": "123 Innovation Drive", "suite": "Suite 100", "city": "Tech City", "state": "TC", "zip": "12345"}', 'Company address', true),
('social_links', '{"linkedin": "#", "twitter": "#"}', 'Social media links', true),
('analytics_id', '"G-XXXXXXX"', 'Google Analytics tracking ID', false),
('chat_widget_enabled', 'true', 'Enable/disable chat widget', true)
ON CONFLICT (setting_key) DO NOTHING;

-- Insert sample features
INSERT INTO Website_Features (name, description, icon_svg, benefits, category, is_highlighted, sort_order) VALUES
('Instant Outreach', 'Strike while the iron is hot. Cory engages every new inquiry within 60 seconds through intelligent phone calls.', '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/><polyline points="12,6 12,12 16,14" stroke="currentColor" stroke-width="2"/></svg>', ARRAY['30-second average response time', 'Natural conversation AI', 'Voicemail detection', 'Time zone awareness'], 'core', true, 1),
('Multi-Channel Communication', 'Meet prospects where they are with seamless voice, SMS, chat, email, and WhatsApp outreach.', '<svg viewBox="0 0 24 24"><path stroke="currentColor" stroke-width="2" fill="none" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>', ARRAY['Voice calls with natural AI', 'SMS with smart scheduling', 'Email campaigns', 'Live chat integration', 'WhatsApp Business API'], 'core', true, 2),
('Intelligent FAQ Brain', 'Cory knows your programs inside and out. Trained on your specific curriculum and policies.', '<svg viewBox="0 0 24 24"><path stroke="currentColor" stroke-width="2" fill="none" d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/></svg>', ARRAY['Custom training on programs', 'Automatic updates', 'Human escalation', 'Multi-language support'], 'intelligence', true, 3),
('Smart Booking & Calendar Sync', 'Seamlessly books appointments with qualified prospects directly into counselors calendars.', '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2" fill="none"/></svg>', ARRAY['Real-time calendar integration', 'Automatic confirmations', 'No-show recovery', 'Counselor availability'], 'automation', true, 4),
('Lead Scoring & Routing', 'Automatically qualifies and scores prospects based on program fit and engagement level.', '<svg viewBox="0 0 24 24"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2" stroke="currentColor" stroke-width="2" fill="none"/></svg>', ARRAY['Real-time qualification', 'Custom scoring criteria', 'Automatic assignment', 'Priority queue management'], 'intelligence', true, 5),
('CRM & SIS Integration', 'Plug into your existing systems without disruption. Every interaction automatically logged.', '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2" fill="none"/></svg>', ARRAY['Slate CRM native integration', 'Salesforce Education Cloud', 'Ellucian Banner compatibility', 'Real-time data sync'], 'integration', true, 6)
ON CONFLICT DO NOTHING;

-- Insert sample testimonials
INSERT INTO Website_Testimonials (customer_name, customer_title, customer_organization, testimonial_text, metrics, is_featured, is_case_study, sort_order) VALUES
('Dr. Sarah Johnson', 'Director of Admissions', 'Metro State University', 'Cory transformed our admissions process. We went from 40% contact rates to 94% overnight, and our conversion improved by 30% thanks to faster response times.', '{"roi": "847%", "contact_rate_improvement": "54%", "conversion_improvement": "30%"}', true, true, 1),
('Michael Chen', 'VP Enrollment Management', 'Tech Institute', 'Our team can focus on relationship building instead of manual outreach. Cory handles the initial qualification perfectly and hands off qualified leads with complete context.', '{"hours_saved": "2100", "automation_coverage": "89%", "qualification_accuracy": "67%"}', true, true, 2),
('Lisa Rodriguez', 'Enrollment Director', 'Community College Network', 'The 24/7 availability alone increased our inquiries by 20%. Weekend and evening leads that we used to lose are now converting at the same rate as business hours.', '{"additional_revenue": "$2.4M", "off_hours_improvement": "45%", "contact_consistency": "93%"}', true, true, 3)
ON CONFLICT DO NOTHING;

-- Insert sample FAQ
INSERT INTO Website_FAQ (question, answer, category, sort_order) VALUES
('How long does implementation take?', 'Most institutions are up and running within 2-3 weeks. This includes CRM integration, FAQ training, and team onboarding. Enterprise implementations may take 4-6 weeks depending on customization needs.', 'implementation', 1),
('What CRM systems do you integrate with?', 'We have native integrations with Slate, Salesforce Education Cloud, and Ellucian Banner. We also support custom API connections and can integrate with most CRM/SIS systems through Zapier or direct API development.', 'integration', 2),
('Is there a setup fee?', 'Starter and Professional plans include setup at no extra charge. Enterprise plans may have a one-time implementation fee depending on customization requirements, which will be discussed during your consultation.', 'pricing', 3),
('Can I customize the AIs responses?', 'Yes! Cory is trained on your specific programs, policies, and messaging. You can customize responses, add program-specific information, and update the knowledge base anytime through our admin portal.', 'customization', 4),
('What happens if I exceed my inquiry limit?', 'We will alert you as you approach your limit and help you upgrade if needed. Overage rates are reasonable and we never stop service abruptly – we will work with you to find the right plan for your volume.', 'pricing', 5),
('Is my data secure?', 'Absolutely. We are SOC 2 certified with bank-level security. All data is encrypted in transit and at rest. We are also FERPA and CCPA compliant, with regular security audits and penetration testing.', 'security', 6),
('Can I cancel anytime?', 'Yes, you can cancel anytime with 30 days notice. We will help you export your data and ensure a smooth transition. No cancellation fees or long-term contracts required.', 'pricing', 7),
('What kind of support do you provide?', 'All plans include email support and access to our knowledge base. Professional and Enterprise plans include phone support and dedicated success managers. We also provide training webinars and documentation.', 'support', 8)
ON CONFLICT DO NOTHING;

-- Insert pricing plans
INSERT INTO Website_Pricing_Plans (name, description, monthly_price, annual_price, features, is_popular, sort_order) VALUES
('Starter', 'Perfect for smaller institutions', 497.00, 397.00, ARRAY['Up to 500 inquiries/month', 'Phone, SMS, Email outreach', 'Basic CRM integration', 'Standard FAQ training', 'Email support', 'Basic analytics dashboard'], false, 1),
('Professional', 'For growing admissions teams', 997.00, 797.00, ARRAY['Up to 1,500 inquiries/month', 'WhatsApp & Live Chat', 'Advanced CRM sync (Slate, Salesforce)', 'Custom FAQ training', 'Lead scoring & routing', 'Advanced analytics & reports', 'Phone & email support', 'Dedicated success manager'], true, 2),
('Enterprise', 'For large institutions & systems', NULL, NULL, ARRAY['Unlimited inquiries', 'Multi-campus support', 'Custom integrations', 'White-label options', 'Advanced security & compliance', 'Priority support & SLA', 'Custom reporting & dashboards', 'On-site training available'], false, 3)
ON CONFLICT DO NOTHING;

-- Insert lead magnets
INSERT INTO Website_Lead_Magnets (title, description, resource_type, features) VALUES
('The Complete Guide to AI in Admissions', 'Comprehensive 40-page guide covering implementation strategies, best practices, and ROI measurement for AI-powered admissions automation.', 'guide', ARRAY['Implementation strategies', 'Best practices', 'ROI measurement', 'Case studies']),
('5 Strategies to Double Your Lead Conversion Rate', 'Join our upcoming webinar to learn proven tactics that top-performing institutions use to convert more inquiries into enrolled students.', 'webinar', ARRAY['Proven conversion tactics', 'Live Q&A session', 'Downloadable templates', 'Follow-up resources']),
('2024 Admissions Benchmarks Report', 'Comprehensive industry data including response times, conversion rates, and ROI metrics from 500+ institutions.', 'report', ARRAY['50+ key benchmarks', 'Industry comparison data', 'Improvement recommendations', 'Executive summary']),
('ROI Calculator + Implementation Toolkit', 'Interactive calculator plus complete toolkit for planning and implementing AI admissions automation.', 'toolkit', ARRAY['Custom ROI projection tool', 'Implementation timeline', 'Staff training materials', 'Success metrics tracking'])
ON CONFLICT DO NOTHING;

-- Insert sample resources
INSERT INTO Website_Resources (title, description, resource_type, topic, reading_time_minutes, is_featured, tags) VALUES
('The Psychology of Fast Response Times', 'Research-backed insights into why speed matters so much in admissions and how to leverage it.', 'blog', 'admissions', 8, false, ARRAY['response-time', 'psychology', 'conversion']),
('AI vs Human: Finding the Right Balance', 'When to use AI and when human touch matters most in the admissions journey.', 'blog', 'ai', 6, false, ARRAY['ai', 'automation', 'human-touch']),
('Maximizing Your Slate CRM Investment', 'Advanced tips and tricks for getting the most out of your Slate CRM with AI integration.', 'blog', 'crm', 12, false, ARRAY['slate', 'crm', 'integration']),
('Admissions Response Time Benchmarks 2024', 'Industry data showing how response time impacts conversion rates, with actionable recommendations.', 'guide', 'admissions', 15, true, ARRAY['benchmarks', 'response-time', 'data']),
('CRM Integration Best Practices', 'Step-by-step guide for seamless CRM integration, data mapping, and workflow automation setup.', 'guide', 'crm', 20, false, ARRAY['crm', 'integration', 'best-practices']),
('Multi-Channel Outreach Playbook', 'Templates and strategies for coordinated phone, SMS, email, and chat campaigns that convert.', 'guide', 'conversion', 30, false, ARRAY['multi-channel', 'templates', 'outreach'])
ON CONFLICT DO NOTHING;

-- Insert page content
INSERT INTO Website_Pages (slug, title, meta_description, hero_title, hero_subtitle, content) VALUES
('home', 'Agent Cory - AI Admissions Assistant', 'Boost admissions conversions with AI that responds in under 60 seconds across all channels', 'Boost Admissions Conversions with AI-Powered Speed & Precision', 'Agent Cory engages new inquiries in under 30 seconds by call, text, chat, and email—qualifies, answers FAQs, books appointments, then hands off to counselors.', '{"stats": [{"value": "< 60s", "label": "response time"}, {"value": "90–95%", "label": "first-week contact rate"}, {"value": "5–10×", "label": "ROI potential"}]}'),
('features', 'Agent Cory Features - AI Admissions Capabilities', 'Explore Agent Cory features: instant outreach, multi-channel communication, FAQ automation, booking systems, lead scoring, and CRM integrations.', 'Powerful Features for Modern Admissions', 'Every feature designed to maximize conversions while minimizing manual work for your admissions team.', '{}'),
('how-it-works', 'How Agent Cory Works - AI Admissions Process', 'See how Agent Cory engages prospects through automated campaigns, rapid response, and intelligent qualification across all channels.', 'How Agent Cory Works', 'From the moment a prospect submits an inquiry to successful enrollment, Cory orchestrates every touchpoint with precision timing and intelligent automation.', '{}'),
('demo-and-pricing', 'Demo & Pricing - Agent Cory', 'Try Agent Cory with a live demo and explore flexible pricing plans for AI-powered admissions automation.', 'Experience Cory, Then Choose Your Plan', 'Get hands-on with our AI assistant and find the perfect solution for your admissions team.', '{}'),
('roi-and-case-studies', 'ROI & Case Studies - Agent Cory Results', 'See real results from Agent Cory implementations: improved response times, higher conversion rates, and significant ROI for admissions teams.', 'Proven Results & Real ROI', 'See how institutions are transforming their admissions process and achieving measurable returns with Agent Cory.', '{}'),
('resources', 'Resources - Agent Cory Content Hub', 'Explore guides, case studies, and best practices for AI-powered admissions automation and lead conversion optimization.', 'Resources & Insights', 'Expert guidance, best practices, and actionable insights for modernizing your admissions process with AI.', '{}'),
('privacy', 'Privacy Policy - Agent Cory', 'Agent Cory privacy policy covering data collection, SMS consent, cookie usage, and your privacy rights.', 'Privacy Policy', 'Your privacy is important to us. This policy explains how we collect, use, and protect your information.', '{}')
ON CONFLICT (slug) DO NOTHING;