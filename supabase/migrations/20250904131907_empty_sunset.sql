/*
  # Create content items table for resources

  1. New Tables
    - `content_items`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `slug` (text, unique, required)
      - `excerpt` (text, required)
      - `content` (text, full content)
      - `content_type` (enum: blog, case_study, ebook, guide, webinar)
      - `featured_image_url` (text, optional)
      - `author_name` (text, default 'Agent Cory Team')
      - `author_title` (text, default 'AI Admissions Experts')
      - `reading_time_minutes` (integer, optional)
      - `tags` (text array, default empty)
      - `category` (text, default 'general')
      - `is_featured` (boolean, default false)
      - `is_published` (boolean, default true)
      - `published_at` (timestamp, default now)
      - `seo_title` (text, optional)
      - `seo_description` (text, optional)
      - `download_url` (text, optional)
      - `external_url` (text, optional)
      - `metrics` (jsonb, default empty object)
      - `view_count` (integer, default 0)
      - `created_at` (timestamp, default now)
      - `updated_at` (timestamp, default now)

  2. Security
    - Enable RLS on `content_items` table
    - Add policy for public read access to published content
    - Add policy for authenticated users to manage content

  3. Sample Data
    - Insert sample blog posts, case studies, and guides
    - Include realistic content and metadata
*/

-- Create content type enum if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'content_type_enum') THEN
    CREATE TYPE content_type_enum AS ENUM ('blog', 'case_study', 'ebook', 'guide', 'webinar');
  END IF;
END $$;

-- Create content items table
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_content_items_slug ON content_items (slug);
CREATE INDEX IF NOT EXISTS idx_content_items_type ON content_items (content_type, is_published);
CREATE INDEX IF NOT EXISTS idx_content_items_category ON content_items (category, is_published);
CREATE INDEX IF NOT EXISTS idx_content_items_featured ON content_items (is_featured, is_published);
CREATE INDEX IF NOT EXISTS idx_content_items_published_at ON content_items (published_at DESC) WHERE is_published = true;

-- Enable RLS
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public can read published content"
  ON content_items
  FOR SELECT
  TO public
  USING (is_published = true);

CREATE POLICY "Authenticated users can manage content"
  ON content_items
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert sample content
INSERT INTO content_items (
  title, slug, excerpt, content, content_type, featured_image_url, 
  reading_time_minutes, tags, category, is_featured, metrics
) VALUES 
(
  'The Complete Guide to AI in Admissions',
  'ai-admissions-complete-guide',
  'Comprehensive 40-page guide covering implementation strategies, best practices, and ROI measurement for AI-powered admissions automation.',
  '# The Complete Guide to AI in Admissions

## Introduction

Artificial Intelligence is revolutionizing the admissions landscape. This comprehensive guide will walk you through everything you need to know about implementing AI in your admissions process.

## Chapter 1: Understanding AI in Education

AI in admissions isn''t just about automation—it''s about creating better experiences for both prospects and admissions teams.

### Key Benefits:
- **Speed**: Respond to inquiries in seconds, not hours
- **Consistency**: Every prospect gets the same high-quality experience
- **Scalability**: Handle unlimited inquiries without adding staff
- **Intelligence**: Learn from every interaction to improve over time

## Chapter 2: Implementation Strategy

### Phase 1: Assessment
Before implementing AI, assess your current admissions process:
- Current response times
- Contact rates
- Conversion metrics
- Staff workload

### Phase 2: Planning
- Define success metrics
- Choose the right AI solution
- Plan integration with existing systems
- Prepare staff training

### Phase 3: Implementation
- Start with pilot program
- Monitor performance closely
- Gather feedback from staff and prospects
- Iterate and improve

## Chapter 3: Best Practices

### Do''s:
- Start small and scale gradually
- Maintain human oversight
- Regularly review AI responses
- Keep training data updated

### Don''ts:
- Replace human judgment entirely
- Ignore compliance requirements
- Neglect staff training
- Set unrealistic expectations

## Chapter 4: Measuring ROI

Track these key metrics:
- Response time improvement
- Contact rate increase
- Conversion rate changes
- Staff time savings
- Student satisfaction scores

## Conclusion

AI implementation in admissions is not just a trend—it''s becoming essential for competitive institutions. Start your journey today.',
  'guide',
  'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
  25,
  ARRAY['AI', 'Implementation', 'Best Practices', 'Strategy'],
  'ai',
  true,
  '{"downloads": 1250, "rating": 4.8, "shares": 89}'::jsonb
),
(
  'Case Study: 847% ROI in 12 Months',
  'metro-state-847-percent-roi',
  'How Metro State University transformed their admissions process and achieved record-breaking results with Agent Cory.',
  '# Metro State University: 847% ROI Case Study

## Executive Summary

Metro State University''s Business School implemented Agent Cory in January 2024 and achieved an 847% return on investment within 12 months.

## The Challenge

Metro State was facing several critical challenges:
- **Slow Response Times**: Average 6-8 hours to contact new inquiries
- **Low Contact Rates**: Only reaching 42% of prospects
- **Staff Burnout**: Counselors spending 25+ hours/week on manual outreach
- **Declining Enrollments**: 15% drop in business program enrollments

## The Solution

Agent Cory implementation included:
- Instant phone outreach (under 60 seconds)
- Multi-channel follow-up automation
- Intelligent lead qualification
- CRM integration with Salesforce

## Implementation Timeline

### Month 1: Setup and Training
- CRM integration completed
- Staff training on new workflows
- AI training on program specifics

### Month 2-3: Pilot Program
- Started with Business School only
- Monitored performance closely
- Refined AI responses based on feedback

### Month 4-6: Full Rollout
- Expanded to all programs
- Optimized workflows
- Added advanced features

## Results After 12 Months

### Contact Rate Improvement
- **Before**: 42% contact rate
- **After**: 94% contact rate
- **Improvement**: +124% increase

### Response Time
- **Before**: 6-8 hours average
- **After**: 47 seconds average
- **Improvement**: 99.8% faster

### Conversion Rates
- **Before**: 18% inquiry to application
- **After**: 33% inquiry to application
- **Improvement**: +83% increase

### Staff Efficiency
- **Before**: 25 hours/week manual outreach
- **After**: 3 hours/week oversight
- **Improvement**: 88% time savings

### Financial Impact
- **Additional Applications**: +340 per year
- **Additional Enrollments**: +102 students
- **Additional Revenue**: $2.1M annually
- **Platform Cost**: $36K annually
- **Net ROI**: 847%

## Key Success Factors

1. **Leadership Buy-in**: Full support from administration
2. **Staff Training**: Comprehensive training on new workflows
3. **Gradual Implementation**: Phased rollout reduced risk
4. **Continuous Optimization**: Regular review and improvement

## Lessons Learned

### What Worked Well:
- AI handled routine inquiries perfectly
- Staff could focus on high-value conversations
- 24/7 availability captured more leads
- Consistent messaging improved brand perception

### Challenges Overcome:
- Initial staff resistance through training
- Integration complexity resolved with vendor support
- Compliance concerns addressed through proper setup

## Recommendations for Other Institutions

1. **Start with pilot program** in one department
2. **Invest in proper training** for all staff
3. **Set realistic expectations** for implementation timeline
4. **Monitor metrics closely** and adjust as needed
5. **Celebrate wins** to build momentum

## Conclusion

The implementation of Agent Cory transformed Metro State''s admissions process, delivering exceptional ROI while improving the experience for both prospects and staff.',
  'case_study',
  'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
  12,
  ARRAY['Case Study', 'ROI', 'University', 'Implementation'],
  'roi',
  true,
  '{"roi_percentage": 847, "additional_revenue": 2100000, "time_saved_hours": 2100, "contact_rate_improvement": 124}'::jsonb
),
(
  'Response Time Benchmarks: What Top Institutions Achieve',
  'response-time-benchmarks-2024',
  'Industry data showing how response time impacts conversion rates, with actionable recommendations for improvement.',
  '# Response Time Benchmarks 2024

## Key Findings

Our analysis of 500+ institutions reveals critical insights about response time impact on admissions success.

## Industry Benchmarks

### Current State:
- **Average Response Time**: 4.2 hours
- **Best Performers**: Under 30 minutes
- **Worst Performers**: 24+ hours

### Impact on Conversion:
- **Under 5 minutes**: 35-40% conversion rate
- **5-30 minutes**: 25-30% conversion rate  
- **1-4 hours**: 15-20% conversion rate
- **4+ hours**: 8-12% conversion rate

## Recommendations

1. **Aim for under 5 minutes** for maximum impact
2. **Use automation** to achieve consistent speed
3. **Track and measure** response times religiously
4. **Train staff** on urgency importance

## Technology Solutions

Modern institutions are using:
- AI-powered instant response systems
- CRM automation triggers
- Multi-channel outreach coordination
- 24/7 availability through AI

## Conclusion

Speed wins in admissions. Institutions that respond fastest convert the most prospects.',
  'blog',
  'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
  8,
  ARRAY['Benchmarks', 'Response Time', 'Data', 'Strategy'],
  'admissions',
  false,
  '{"institutions_analyzed": 500, "shares": 156, "downloads": 890}'::jsonb
),
(
  'Multi-Channel Outreach Playbook',
  'multi-channel-outreach-playbook',
  'Templates and strategies for coordinated phone, SMS, email, and chat campaigns that convert prospects into enrolled students.',
  '# Multi-Channel Outreach Playbook

## Overview

Successful admissions requires meeting prospects where they are. This playbook provides proven templates and strategies for coordinated outreach.

## Channel Strategy

### Phone (Primary Channel)
- **Timing**: Within 5 minutes of inquiry
- **Script**: Conversational, not salesy
- **Follow-up**: If no answer, leave personalized voicemail

### SMS (Immediate Follow-up)
- **Timing**: 2-3 minutes after missed call
- **Content**: Brief, helpful, includes calendar link
- **Frequency**: Maximum 3 messages per week

### Email (Nurture Channel)
- **Timing**: 5-10 minutes after initial contact
- **Content**: Detailed program information
- **Series**: 5-email welcome sequence

### Chat (Real-time Support)
- **Availability**: 24/7 through AI
- **Purpose**: FAQ answers and appointment booking
- **Escalation**: To humans for complex questions

## Templates

### Phone Script Template:
"Hi [Name], this is [Your Name] from [Institution]. I see you just inquired about our [Program] program. Do you have a quick minute to chat about your goals?"

### SMS Template:
"Hi [Name]! Thanks for your interest in [Program]. I just tried calling - here''s a link to book a convenient time to chat: [Calendar Link]"

### Email Template:
Subject: "Your [Program] Information - [Institution]"

"Hi [Name],

Thank you for your interest in our [Program] program. I wanted to personally reach out and provide you with the information you requested..."

## Best Practices

1. **Coordinate timing** across all channels
2. **Personalize every message** with prospect''s name and program interest
3. **Provide value** in every touchpoint
4. **Make it easy** to take the next step
5. **Track everything** for continuous improvement

## Measuring Success

Track these metrics for each channel:
- Response rates
- Conversion rates
- Time to response
- Channel attribution

## Advanced Strategies

### Behavioral Triggers:
- Website page visits
- Email opens and clicks
- Calendar page views
- Application starts

### Personalization:
- Program-specific messaging
- Geographic customization
- Time zone optimization
- Device-specific formatting

## Conclusion

Multi-channel outreach isn''t about more messages—it''s about better coordination and timing to create seamless prospect experiences.',
  'guide',
  'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800',
  18,
  ARRAY['Outreach', 'Templates', 'Multi-channel', 'Strategy'],
  'conversion',
  false,
  '{"downloads": 2340, "rating": 4.6, "implementations": 78}'::jsonb
),
(
  '5 Strategies to Double Your Lead Conversion Rate',
  'double-lead-conversion-strategies',
  'Proven tactics that top-performing institutions use to convert more inquiries into enrolled students.',
  '# 5 Strategies to Double Your Lead Conversion Rate

## Introduction

Top-performing institutions consistently achieve 2x higher conversion rates than their peers. Here are the five strategies they use.

## Strategy 1: Speed of Response

**The Rule**: Contact prospects within 5 minutes of inquiry.

**Why it works**: 
- Prospects are still engaged and thinking about your program
- Shows professionalism and organization
- Beats competitors who respond slowly

**Implementation**:
- Set up automated alerts for new inquiries
- Use AI for instant response when staff unavailable
- Track response times religiously

## Strategy 2: Multi-Touch Sequences

**The Rule**: Plan 7-12 touchpoints over 30 days.

**Why it works**:
- Most prospects need multiple exposures before deciding
- Different people prefer different communication channels
- Builds relationship and trust over time

**Implementation**:
- Map out your sequence in advance
- Use mix of phone, email, SMS, and mail
- Provide value in every touchpoint

## Strategy 3: Qualification and Segmentation

**The Rule**: Qualify prospects early and segment messaging.

**Why it works**:
- Personalized messaging resonates better
- Focus time on best-fit prospects
- Improve conversion rates through relevance

**Implementation**:
- Ask qualifying questions in first conversation
- Segment by program interest, timeline, budget
- Customize follow-up based on segments

## Strategy 4: Social Proof Integration

**The Rule**: Include testimonials and success stories in every touchpoint.

**Why it works**:
- Reduces risk perception
- Builds credibility and trust
- Helps prospects visualize success

**Implementation**:
- Collect student and graduate testimonials
- Include employment outcomes data
- Share relevant success stories by program

## Strategy 5: Objection Handling Framework

**The Rule**: Anticipate and address common objections proactively.

**Why it works**:
- Removes barriers to enrollment
- Builds confidence in decision
- Accelerates decision timeline

**Common Objections**:
- Cost concerns → Financial aid options
- Time constraints → Flexible scheduling
- Program fit → Detailed curriculum review
- Career outcomes → Employment statistics

## Measuring Success

Track these conversion metrics:
- Inquiry to application rate
- Application to enrollment rate
- Time from inquiry to enrollment
- Channel attribution
- Objection frequency

## Implementation Checklist

- [ ] Audit current response times
- [ ] Map out multi-touch sequence
- [ ] Create qualification framework
- [ ] Collect social proof materials
- [ ] Document common objections and responses
- [ ] Set up tracking and measurement
- [ ] Train staff on new processes

## Conclusion

Doubling conversion rates isn''t about luck—it''s about implementing proven systems and processes. Start with these five strategies and watch your enrollment numbers grow.',
  'blog',
  'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800',
  15,
  ARRAY['Conversion', 'Strategy', 'Best Practices', 'Admissions'],
  'conversion',
  true,
  '{"shares": 234, "comments": 45, "implementations": 67}'::jsonb
),
(
  '2024 Admissions Technology Benchmark Report',
  'admissions-technology-benchmarks-2024',
  'Comprehensive analysis of technology adoption, ROI metrics, and best practices from 500+ educational institutions.',
  '# 2024 Admissions Technology Benchmark Report

## Executive Summary

This report analyzes technology adoption and performance metrics from 500+ educational institutions across the United States.

## Key Findings

### Technology Adoption Rates:
- **CRM Systems**: 89% adoption
- **Marketing Automation**: 67% adoption  
- **AI/Chatbots**: 34% adoption
- **Voice AI**: 12% adoption

### Performance Metrics:
- **Average Response Time**: 4.2 hours
- **Contact Rate**: 47% average
- **Conversion Rate**: 19% inquiry to application
- **Staff Efficiency**: 23 hours/week on manual outreach

## ROI Analysis

### High Performers (Top 10%):
- **Response Time**: Under 30 minutes
- **Contact Rate**: 85%+
- **Conversion Rate**: 35%+
- **Technology Investment**: $50K+ annually

### Low Performers (Bottom 10%):
- **Response Time**: 24+ hours
- **Contact Rate**: Under 30%
- **Conversion Rate**: Under 12%
- **Technology Investment**: Under $10K annually

## Technology ROI by Category

### CRM Systems:
- **Average ROI**: 340%
- **Payback Period**: 8 months
- **Key Benefits**: Organization, tracking, reporting

### Marketing Automation:
- **Average ROI**: 520%
- **Payback Period**: 6 months
- **Key Benefits**: Nurturing, segmentation, efficiency

### AI Solutions:
- **Average ROI**: 680%
- **Payback Period**: 4 months
- **Key Benefits**: Speed, availability, consistency

## Implementation Recommendations

### For Small Institutions (Under 1,000 students):
1. Start with basic CRM
2. Add email automation
3. Consider AI chatbot for website

### For Medium Institutions (1,000-5,000 students):
1. Comprehensive CRM with automation
2. Multi-channel marketing platform
3. AI for initial prospect engagement

### For Large Institutions (5,000+ students):
1. Enterprise CRM with full automation
2. Advanced AI including voice capabilities
3. Predictive analytics and machine learning

## Future Trends

### Next 12 Months:
- AI adoption will double
- Voice AI will become mainstream
- Predictive analytics will expand

### Next 3 Years:
- AI will handle 70%+ of initial interactions
- Personalization will become hyper-targeted
- Integration ecosystems will mature

## Methodology

This report is based on:
- Survey of 523 institutions
- Performance data from 200+ implementations
- Interviews with 50+ admissions leaders
- Analysis of 2M+ prospect interactions

## About the Research

Conducted by the Agent Cory Research Team in partnership with leading admissions professionals and technology vendors.',
  'ebook',
  'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800',
  35,
  ARRAY['Benchmarks', 'Technology', 'ROI', 'Industry Data'],
  'roi',
  true,
  '{"institutions_surveyed": 523, "downloads": 3400, "pages": 42}'::jsonb
);