/*
  # Fix Content Items RLS and Add Sample Data

  1. Tables
    - Ensure `content_items` table exists with proper structure
    - Add comprehensive sample data for immediate functionality
    
  2. Security
    - Enable RLS on `content_items` table
    - Add policy for public read access to published content
    - Add policy for authenticated users to manage content
    
  3. Sample Data
    - Insert 8 diverse content items covering all content types
    - Include proper metadata, images, and realistic metrics
    - Mix of featured and regular content for testing
*/

-- Create content_items table if it doesn't exist
CREATE TABLE IF NOT EXISTS content_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text NOT NULL,
  content text,
  content_type content_type_enum NOT NULL,
  featured_image_url text,
  author_name text DEFAULT 'Agent Cory Team',
  author_title text DEFAULT 'AI Admissions Experts',
  reading_time_minutes integer,
  tags text[] DEFAULT '{}',
  category text DEFAULT 'general',
  is_featured boolean DEFAULT false,
  is_published boolean DEFAULT true,
  published_at timestamptz DEFAULT now(),
  seo_title text,
  seo_description text,
  download_url text,
  external_url text,
  metrics jsonb DEFAULT '{}',
  view_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can read published content" ON content_items;
DROP POLICY IF EXISTS "Authenticated users can manage content" ON content_items;

-- Create policies for public access to published content
CREATE POLICY "Public can read published content"
  ON content_items
  FOR SELECT
  TO public
  USING (is_published = true);

-- Create policies for authenticated users to manage content
CREATE POLICY "Authenticated users can manage content"
  ON content_items
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Clear existing sample data to avoid duplicates
DELETE FROM content_items WHERE author_name = 'Agent Cory Team' AND title LIKE '%Sample%';

-- Insert comprehensive sample data
INSERT INTO content_items (
  title, slug, excerpt, content, content_type, featured_image_url, 
  author_name, author_title, reading_time_minutes, tags, category, 
  is_featured, published_at, seo_title, seo_description, download_url, 
  external_url, metrics, view_count
) VALUES 
(
  'The Complete Guide to AI in Admissions',
  'ai-admissions-guide',
  'Comprehensive 40-page guide covering implementation strategies, best practices, and ROI measurement for AI-powered admissions automation.',
  '# The Complete Guide to AI in Admissions

## Introduction

Artificial Intelligence is revolutionizing the admissions landscape. This comprehensive guide will walk you through everything you need to know about implementing AI in your admissions process.

## Chapter 1: Understanding AI in Education

AI in admissions isn''t just about automation—it''s about creating better experiences for both prospects and staff. Modern AI systems can:

- Respond to inquiries in under 60 seconds
- Qualify leads with 95% accuracy
- Handle multiple communication channels simultaneously
- Provide 24/7 availability

## Chapter 2: Implementation Strategies

### Phase 1: Assessment and Planning
Before implementing any AI solution, you need to understand your current process and identify opportunities for improvement.

### Phase 2: Technology Selection
Choose AI tools that integrate seamlessly with your existing CRM and SIS systems.

### Phase 3: Training and Deployment
Proper training ensures your AI system understands your programs, policies, and institutional voice.

## Chapter 3: Measuring Success

Key metrics to track:
- Response time improvement
- Contact rate increases
- Conversion rate changes
- Staff time savings
- Student satisfaction scores

## Conclusion

AI implementation in admissions is not just a trend—it''s becoming essential for competitive institutions. Start your journey today.',
  'guide',
  'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Agent Cory Team',
  'AI Admissions Experts',
  25,
  ARRAY['AI', 'Implementation', 'Best Practices', 'Strategy'],
  'ai',
  true,
  now() - interval '1 day',
  'Complete Guide to AI in Admissions - Agent Cory',
  'Learn how to implement AI in your admissions process with this comprehensive guide.',
  '/downloads/ai-admissions-guide.pdf',
  null,
  '{"downloads": 1250, "rating": 4.8, "shares": 89}',
  3420
),
(
  'Case Study: Metro State University - 847% ROI in 12 Months',
  'metro-state-case-study',
  'How Metro State University transformed their admissions process and achieved record-breaking results with Agent Cory.',
  '# Metro State University Case Study

## The Challenge

Metro State University was facing significant challenges in their admissions process:
- 40% contact rate with manual outreach
- 4-24 hour response times
- Overwhelmed admissions staff
- Lost weekend and evening leads

## The Solution

Metro State implemented Agent Cory''s AI admissions assistant with:
- Instant response capabilities
- Multi-channel outreach automation
- Intelligent lead qualification
- Seamless CRM integration

## Implementation Process

### Week 1-2: Setup and Integration
- CRM integration and data mapping
- AI training on university programs
- Staff training and workflow design

### Week 3-4: Testing and Optimization
- Pilot program with 100 leads
- Response optimization and fine-tuning
- Staff feedback integration

### Month 2-3: Full Deployment
- Complete automation rollout
- Performance monitoring
- Continuous optimization

## Results After 12 Months

### Contact Rate Improvement
- Before: 40% contact rate
- After: 94% contact rate
- Improvement: +135%

### Response Time
- Before: 4-24 hours
- After: Under 60 seconds
- Improvement: 99% faster

### Staff Efficiency
- Before: 40 hours/week on manual outreach
- After: 4 hours/week on qualified leads only
- Time Saved: 2,100 hours annually

### Financial Impact
- Additional Applications: +240 per year
- Additional Enrollments: +72 per year
- Additional Revenue: $2.1M annually
- ROI: 847%

## Key Success Factors

1. **Leadership Buy-in**: Full support from administration
2. **Staff Training**: Comprehensive training on new workflows
3. **Data Integration**: Seamless CRM connectivity
4. **Continuous Optimization**: Regular performance reviews

## Lessons Learned

- AI doesn''t replace humans—it empowers them
- Speed of response is critical for conversion
- Multi-channel approach significantly improves results
- Proper training data is essential for AI accuracy

## Conclusion

Metro State''s transformation demonstrates the powerful impact of AI in admissions. The combination of speed, consistency, and intelligence has revolutionized their enrollment process.',
  'case_study',
  'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Dr. Sarah Johnson',
  'Director of Admissions, Metro State University',
  12,
  ARRAY['Case Study', 'ROI', 'University', 'Success Story'],
  'admissions',
  true,
  now() - interval '7 days',
  'Metro State University Case Study - 847% ROI with AI',
  'See how Metro State University achieved 847% ROI with AI admissions automation.',
  null,
  null,
  '{"roi_percentage": 847, "additional_revenue": 2100000, "time_saved_hours": 2100, "contact_rate_improvement": 135}',
  2890
),
(
  '2024 Admissions Benchmarks Report',
  'admissions-benchmarks-2024',
  'Comprehensive industry data including response times, conversion rates, and ROI metrics from 500+ institutions.',
  '# 2024 Admissions Benchmarks Report

## Executive Summary

This comprehensive report analyzes data from over 500 educational institutions to provide industry benchmarks for admissions performance in 2024.

## Key Findings

### Response Times
- Industry Average: 4-24 hours
- Top Performers: Under 1 hour
- AI-Enabled Institutions: Under 60 seconds

### Contact Rates
- Industry Average: 40-50%
- Top Performers: 70-80%
- AI-Enabled Institutions: 90-95%

### Conversion Rates
- Industry Average: 15-25%
- Top Performers: 30-40%
- AI-Enabled Institutions: 35-45%

## Technology Adoption

### CRM Usage
- 85% use some form of CRM
- 45% have advanced automation
- 12% use AI-powered systems

### Communication Channels
- Email: 100% adoption
- Phone: 95% adoption
- SMS: 60% adoption
- Chat: 35% adoption
- AI Voice: 8% adoption

## ROI Analysis

Institutions using AI automation report:
- 5-10x return on investment
- 50-80% reduction in manual work
- 20-40% increase in enrollment

## Recommendations

1. Implement rapid response systems
2. Adopt multi-channel communication
3. Invest in AI automation
4. Focus on staff efficiency
5. Measure and optimize continuously

## Methodology

This report is based on:
- 500+ institution survey responses
- Performance data analysis
- Industry expert interviews
- Technology vendor assessments

## About This Report

Published annually by Agent Cory Research Team to help institutions benchmark their admissions performance and identify improvement opportunities.',
  'ebook',
  'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Agent Cory Research Team',
  'Industry Analysts',
  30,
  ARRAY['Benchmarks', 'Industry Data', 'Research', 'Report'],
  'roi',
  true,
  now() - interval '3 days',
  '2024 Admissions Benchmarks Report - Industry Data',
  'Get comprehensive industry benchmarks for admissions performance in 2024.',
  '/downloads/benchmarks-2024.pdf',
  null,
  '{"downloads": 1850, "institutions_surveyed": 500, "pages": 42}',
  2650
),
(
  'The Psychology of Fast Response Times in Admissions',
  'psychology-fast-response-times',
  'Research-backed insights into why speed matters so much in admissions and how to leverage it for better conversion rates.',
  '# The Psychology of Fast Response Times

## Why Speed Matters

In the world of admissions, timing is everything. Research shows that the likelihood of converting a lead decreases dramatically with each passing hour.

## The Science Behind Speed

### Cognitive Availability
When prospects submit an inquiry, they''re in a state of heightened interest and cognitive availability. This is the optimal time for engagement.

### Decision-Making Windows
Studies show that prospects make decisions about educational programs within:
- 24 hours: 60% of decisions made
- 48 hours: 80% of decisions made
- 1 week: 95% of decisions made

### Competitive Advantage
Fast response times provide significant competitive advantages:
- First-mover advantage in prospect engagement
- Higher perceived value and professionalism
- Increased trust and credibility

## Implementation Strategies

### Technology Solutions
- AI-powered instant response systems
- Multi-channel communication platforms
- Automated qualification workflows

### Process Optimization
- Streamlined lead routing
- Predefined response templates
- Clear escalation procedures

### Staff Training
- Response time awareness
- Urgency mindset development
- Technology proficiency

## Measuring Impact

Track these key metrics:
- Time to first response
- Contact success rates
- Conversion improvements
- Competitive win rates

## Conclusion

Speed isn''t just about efficiency—it''s about psychology, competitive advantage, and ultimately, enrollment success.',
  'blog',
  'https://images.pexels.com/photos/3184394/pexels-photo-3184394.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Agent Cory Team',
  'AI Admissions Experts',
  8,
  ARRAY['Psychology', 'Response Time', 'Conversion', 'Research'],
  'admissions',
  false,
  now() - interval '14 days',
  'Psychology of Fast Response Times in Admissions',
  'Research-backed insights into why speed matters in admissions.',
  null,
  null,
  '{"shares": 245, "comments": 18, "reading_time": 8}',
  1560
),
(
  '5 Strategies to Double Your Lead Conversion Rate',
  'double-conversion-strategies',
  'Join our upcoming webinar to learn proven tactics that top-performing institutions use to convert more inquiries into enrolled students.',
  '# 5 Strategies to Double Your Lead Conversion Rate

## Strategy 1: Speed of Response

The faster you respond to inquiries, the higher your conversion rate. Aim for:
- Under 5 minutes for phone calls
- Under 1 minute for chat responses
- Under 30 minutes for email replies

## Strategy 2: Multi-Channel Approach

Don''t rely on just one communication method:
- Phone calls for immediate engagement
- SMS for quick follow-ups
- Email for detailed information
- Chat for instant support

## Strategy 3: Intelligent Qualification

Ask the right questions to identify serious prospects:
- Program fit assessment
- Timeline evaluation
- Budget qualification
- Decision-making authority

## Strategy 4: Personalized Communication

Tailor your message to each prospect:
- Reference their specific program interest
- Address their unique concerns
- Provide relevant success stories
- Offer appropriate next steps

## Strategy 5: Systematic Follow-Up

Create a structured follow-up sequence:
- Immediate acknowledgment
- Educational content delivery
- Periodic check-ins
- Re-engagement campaigns

## Webinar Details

Join us for a live presentation where we''ll dive deep into each strategy with real examples and implementation tips.

**Date:** Every Tuesday at 2 PM ET
**Duration:** 45 minutes + Q&A
**Format:** Live presentation with interactive Q&A

## What You''ll Learn

- Specific tactics used by top-performing institutions
- Implementation timelines and resource requirements
- Common pitfalls and how to avoid them
- ROI measurement and optimization techniques

## Register Now

Space is limited to ensure quality interaction. Register today to secure your spot.',
  'webinar',
  'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Agent Cory Team',
  'AI Admissions Experts',
  45,
  ARRAY['Webinar', 'Conversion', 'Strategy', 'Live Training'],
  'conversion',
  true,
  now() - interval '2 days',
  '5 Strategies to Double Lead Conversion - Live Webinar',
  'Learn proven tactics to double your admissions conversion rate.',
  null,
  'https://zoom.us/webinar/register/example',
  '{"registrations": 450, "attendees": 320, "satisfaction": 4.7}',
  1890
),
(
  'CRM Integration Best Practices for Higher Ed',
  'crm-integration-best-practices',
  'Step-by-step guide for seamless CRM integration, data mapping, and workflow automation setup.',
  '# CRM Integration Best Practices

## Getting Started

Integrating your CRM with AI automation requires careful planning and execution. This guide provides a roadmap for success.

## Pre-Integration Checklist

### Data Audit
- Clean existing data
- Standardize field formats
- Identify data gaps
- Plan data migration

### System Requirements
- API access verification
- Security compliance check
- Performance requirements
- Backup procedures

## Integration Process

### Phase 1: Planning (Week 1)
- Stakeholder alignment
- Technical requirements gathering
- Timeline development
- Resource allocation

### Phase 2: Configuration (Week 2-3)
- API connections setup
- Field mapping configuration
- Workflow design
- Testing procedures

### Phase 3: Testing (Week 4)
- Data flow validation
- Workflow testing
- Performance verification
- Security audit

### Phase 4: Deployment (Week 5)
- Production rollout
- Staff training
- Monitoring setup
- Support procedures

## Common Challenges

### Data Quality Issues
- Inconsistent formatting
- Missing required fields
- Duplicate records
- Outdated information

### Technical Challenges
- API limitations
- Rate limiting
- Authentication issues
- Error handling

### Process Challenges
- Staff resistance
- Workflow disruption
- Training requirements
- Change management

## Best Practices

1. **Start Small**: Begin with a pilot program
2. **Clean Data First**: Ensure data quality before integration
3. **Train Staff**: Provide comprehensive training
4. **Monitor Closely**: Track performance metrics
5. **Iterate Quickly**: Make adjustments based on feedback

## Conclusion

Successful CRM integration requires careful planning, proper execution, and ongoing optimization. Follow these best practices for the best results.',
  'guide',
  'https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Agent Cory Team',
  'Integration Specialists',
  20,
  ARRAY['CRM', 'Integration', 'Automation', 'Best Practices'],
  'crm',
  false,
  now() - interval '10 days',
  'CRM Integration Best Practices for Higher Education',
  'Step-by-step guide for seamless CRM integration and automation.',
  '/downloads/crm-integration-guide.pdf',
  null,
  '{"downloads": 890, "implementations": 120, "success_rate": 95}',
  1340
),
(
  'AI vs Human: Finding the Right Balance in Admissions',
  'ai-human-balance-admissions',
  'When to use AI and when human touch matters most in the admissions journey.',
  '# AI vs Human: Finding the Right Balance

## The Human Element

While AI can automate many processes, the human element remains crucial in admissions. The key is knowing when to use each approach.

## Where AI Excels

### Speed and Availability
- Instant response to inquiries
- 24/7 availability
- Consistent performance
- Scalable operations

### Data Processing
- Lead qualification
- Pattern recognition
- Predictive analytics
- Performance tracking

### Routine Tasks
- FAQ responses
- Appointment scheduling
- Follow-up sequences
- Data entry

## Where Humans Excel

### Complex Conversations
- Nuanced discussions
- Emotional support
- Complex problem-solving
- Relationship building

### Decision Making
- Policy exceptions
- Special circumstances
- Strategic planning
- Quality assurance

### Personal Connection
- Empathy and understanding
- Cultural sensitivity
- Trust building
- Mentorship

## The Optimal Balance

### AI-First Approach
Use AI for initial contact and qualification, then hand off to humans for relationship building.

### Human-Supervised AI
AI handles routine tasks while humans monitor and intervene when needed.

### Collaborative Model
AI and humans work together throughout the process, each contributing their strengths.

## Implementation Guidelines

### Start with AI for:
- Initial response
- Basic qualification
- Appointment scheduling
- Follow-up reminders

### Escalate to humans for:
- Complex questions
- Emotional concerns
- Special circumstances
- Final enrollment decisions

## Measuring Success

Track both AI and human performance:
- Response times
- Conversion rates
- Satisfaction scores
- Efficiency metrics

## Conclusion

The future of admissions isn''t AI vs human—it''s AI and human working together to create better experiences and outcomes.',
  'blog',
  'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Agent Cory Team',
  'AI Strategy Experts',
  12,
  ARRAY['AI Strategy', 'Human Touch', 'Balance', 'Best Practices'],
  'roi',
  false,
  now() - interval '21 days',
  'AI vs Human Balance in Admissions - Strategic Guide',
  'Learn when to use AI and when human touch matters most.',
  null,
  null,
  '{"shares": 180, "comments": 25, "engagement_rate": 8.5}',
  980
),
(
  'Student Retention: AI-Powered Early Warning Systems',
  'ai-student-retention-systems',
  'How AI can identify at-risk students early and implement automated intervention strategies to improve retention rates.',
  '# Student Retention: AI-Powered Early Warning Systems

## The Retention Challenge

Student retention is one of the biggest challenges facing educational institutions today. Traditional approaches often identify at-risk students too late.

## AI-Powered Solutions

### Early Detection
AI can analyze multiple data points to identify at-risk students:
- LMS engagement patterns
- Assignment submission rates
- Grade trends
- Communication frequency

### Predictive Modeling
Machine learning algorithms can predict:
- Likelihood of dropout
- Optimal intervention timing
- Most effective intervention types
- Success probability

### Automated Interventions
AI can trigger appropriate responses:
- Personalized outreach messages
- Resource recommendations
- Counselor notifications
- Support service referrals

## Implementation Framework

### Data Collection
- Academic performance data
- Engagement metrics
- Communication logs
- Support service usage

### Risk Scoring
- Multi-factor risk assessment
- Real-time score updates
- Threshold-based alerts
- Trend analysis

### Intervention Strategies
- Automated check-ins
- Resource delivery
- Peer connections
- Faculty notifications

## Success Metrics

Track the effectiveness of your retention efforts:
- Early identification accuracy
- Intervention success rates
- Overall retention improvement
- Student satisfaction scores

## Case Studies

### Community College Network
- 15% retention improvement
- 60% reduction in dropouts
- 40% increase in graduation rates

### Tech Institute
- 21% retention improvement
- 50% faster intervention
- 85% student satisfaction

## Best Practices

1. **Start Early**: Implement from day one
2. **Use Multiple Data Sources**: Don''t rely on grades alone
3. **Personalize Interventions**: One size doesn''t fit all
4. **Train Staff**: Ensure proper use of AI insights
5. **Measure Continuously**: Track and optimize performance

## Conclusion

AI-powered early warning systems represent the future of student retention. By identifying at-risk students early and implementing targeted interventions, institutions can significantly improve outcomes.',
  'guide',
  'https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Agent Cory Team',
  'Student Success Experts',
  18,
  ARRAY['Retention', 'AI', 'Student Success', 'Early Warning'],
  'ai',
  false,
  now() - interval '5 days',
  'AI-Powered Student Retention Systems - Implementation Guide',
  'Learn how to implement AI early warning systems for student retention.',
  '/downloads/retention-guide.pdf',
  null,
  '{"downloads": 650, "implementations": 45, "avg_improvement": 18}',
  1120
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_content_items_published_featured 
  ON content_items (is_published, is_featured, published_at DESC);

CREATE INDEX IF NOT EXISTS idx_content_items_category_type 
  ON content_items (category, content_type, is_published);

CREATE INDEX IF NOT EXISTS idx_content_items_slug 
  ON content_items (slug) WHERE is_published = true;