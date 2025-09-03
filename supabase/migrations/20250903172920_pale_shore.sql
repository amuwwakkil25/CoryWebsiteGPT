/*
  # Content Management System for Resources

  1. New Tables
    - `content_items`
      - `id` (uuid, primary key)
      - `title` (text)
      - `slug` (text, unique)
      - `excerpt` (text)
      - `content` (text)
      - `content_type` (enum: blog, case_study, ebook, guide, webinar)
      - `featured_image_url` (text)
      - `author_name` (text)
      - `author_title` (text)
      - `reading_time_minutes` (integer)
      - `tags` (text array)
      - `category` (text)
      - `is_featured` (boolean)
      - `is_published` (boolean)
      - `published_at` (timestamp)
      - `seo_title` (text)
      - `seo_description` (text)
      - `download_url` (text, for ebooks/guides)
      - `external_url` (text, for webinars)
      - `metrics` (jsonb, for case studies)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `content_items` table
    - Add policies for public read access to published content
    - Add policies for authenticated users to manage content
*/

-- Create enum for content types
CREATE TYPE content_type_enum AS ENUM ('blog', 'case_study', 'ebook', 'guide', 'webinar');

-- Create content_items table
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

-- Policies for public access to published content
CREATE POLICY "Public can read published content"
  ON content_items
  FOR SELECT
  TO public
  USING (is_published = true);

-- Policies for authenticated users to manage content
CREATE POLICY "Authenticated users can manage content"
  ON content_items
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_content_items_slug ON content_items(slug);
CREATE INDEX IF NOT EXISTS idx_content_items_type ON content_items(content_type, is_published);
CREATE INDEX IF NOT EXISTS idx_content_items_category ON content_items(category, is_published);
CREATE INDEX IF NOT EXISTS idx_content_items_featured ON content_items(is_featured, is_published);
CREATE INDEX IF NOT EXISTS idx_content_items_published_at ON content_items(published_at DESC) WHERE is_published = true;

-- Insert sample content
INSERT INTO content_items (title, slug, excerpt, content, content_type, featured_image_url, reading_time_minutes, tags, category, is_featured, seo_title, seo_description, metrics) VALUES
(
  'The Complete Guide to AI in Admissions',
  'complete-guide-ai-admissions',
  'Comprehensive 40-page guide covering implementation strategies, best practices, and ROI measurement for AI-powered admissions automation.',
  '# The Complete Guide to AI in Admissions

## Introduction

The landscape of higher education admissions is rapidly evolving. With increasing competition for students and the need for operational efficiency, institutions are turning to artificial intelligence to transform their admissions processes.

## Chapter 1: Understanding AI in Admissions

Artificial Intelligence in admissions encompasses several key technologies:

### Conversational AI
- Natural language processing for student interactions
- Voice AI for phone-based engagement
- Chatbots for website and messaging platforms

### Predictive Analytics
- Lead scoring and qualification
- Enrollment likelihood prediction
- Optimal contact timing

### Automation Workflows
- Multi-channel outreach sequences
- Follow-up scheduling
- CRM integration and data sync

## Chapter 2: Implementation Strategies

### Phase 1: Assessment and Planning
Before implementing AI, institutions must:
1. Audit current admissions processes
2. Identify bottlenecks and inefficiencies
3. Define success metrics and KPIs
4. Secure stakeholder buy-in

### Phase 2: Technology Selection
Key considerations when choosing AI solutions:
- Integration capabilities with existing systems
- Scalability and customization options
- Compliance with educational regulations
- Vendor support and training

### Phase 3: Pilot Implementation
Start with a controlled pilot program:
- Select specific programs or demographics
- Implement core AI features gradually
- Monitor performance closely
- Gather feedback from staff and prospects

## Chapter 3: Best Practices

### Data Quality and Management
- Ensure clean, accurate prospect data
- Implement proper data governance
- Regular data audits and cleanup
- FERPA compliance considerations

### Staff Training and Change Management
- Comprehensive training programs
- Clear role definitions post-AI implementation
- Regular performance reviews
- Continuous improvement processes

### Student Experience Optimization
- Maintain human touch where needed
- Personalize AI interactions
- Provide clear escalation paths
- Monitor satisfaction metrics

## Chapter 4: ROI Measurement

### Key Performance Indicators
Track these essential metrics:
- Response time improvements
- Contact rate increases
- Conversion rate changes
- Staff time savings
- Cost per enrollment reduction

### Financial Impact Calculation
Calculate ROI using:
- Additional enrollment revenue
- Staff cost savings
- Technology investment costs
- Implementation and training expenses

## Chapter 5: Common Challenges and Solutions

### Challenge: Staff Resistance
**Solution:** Involve staff in the selection process, provide comprehensive training, and clearly communicate how AI enhances rather than replaces their work.

### Challenge: Technology Integration
**Solution:** Choose solutions with robust APIs, work with experienced implementation partners, and plan for adequate testing time.

### Challenge: Maintaining Personal Touch
**Solution:** Use AI for initial engagement and qualification, then seamlessly hand off to human counselors for relationship building.

## Conclusion

AI implementation in admissions is not just about technology—it''s about transforming how institutions connect with and serve prospective students. When implemented thoughtfully, AI can dramatically improve both operational efficiency and student experience.

The key to success lies in choosing the right technology partner, implementing gradually, and maintaining focus on the human elements that make education meaningful.',
  'guide',
  'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
  25,
  ARRAY['AI', 'Admissions', 'Implementation', 'Best Practices'],
  'ai',
  true,
  'The Complete Guide to AI in Admissions - Agent Cory',
  'Comprehensive guide covering AI implementation strategies, best practices, and ROI measurement for admissions automation.',
  '{}'
),
(
  'Case Study: 847% ROI in 12 Months',
  'metro-state-university-case-study',
  'How Metro State University transformed their admissions process and achieved record-breaking results with Agent Cory.',
  '# Metro State University: 847% ROI in 12 Months

## Executive Summary

Metro State University''s Business School faced declining enrollment and inefficient admissions processes. After implementing Agent Cory, they achieved an 847% ROI in their first year while dramatically improving prospect engagement.

## The Challenge

### Initial Situation
- **Contact Rate:** 42% of inquiries reached
- **Response Time:** 4-24 hours average
- **Staff Workload:** 25 hours/week on manual outreach
- **Conversion Rate:** 18% inquiry to application
- **Lost Opportunities:** 60% of weekend/evening inquiries never contacted

### Pain Points
1. Slow response times leading to lost prospects
2. Inconsistent follow-up processes
3. Overwhelmed admissions staff
4. Poor visibility into lead pipeline
5. Missed opportunities during off-hours

## The Solution

Metro State implemented Agent Cory''s AI admissions assistant with:
- Instant phone outreach (under 60 seconds)
- Multi-channel follow-up automation
- Intelligent lead qualification
- CRM integration with Salesforce
- 24/7 availability

## Implementation Timeline

### Month 1: Setup and Training
- CRM integration and data mapping
- AI training on program specifics
- Staff training and process documentation
- Pilot launch with Business School

### Month 2-3: Optimization
- Fine-tuning AI responses
- Expanding to additional programs
- Performance monitoring and adjustments
- Staff feedback integration

### Month 4-12: Scale and Measure
- Full deployment across all programs
- Continuous optimization
- ROI measurement and reporting
- Process refinement

## Results After 12 Months

### Contact Rate Improvement
- **Before:** 42% of inquiries contacted
- **After:** 94% of inquiries contacted
- **Impact:** 124% increase in prospect engagement

### Response Time Transformation
- **Before:** 4-24 hours average response
- **After:** 47 seconds average response
- **Impact:** 99.7% faster prospect engagement

### Conversion Rate Boost
- **Before:** 18% inquiry to application rate
- **After:** 32% inquiry to application rate
- **Impact:** 78% improvement in conversion

### Staff Efficiency Gains
- **Before:** 25 hours/week on manual outreach
- **After:** 3 hours/week on manual outreach
- **Impact:** 22 hours/week saved per counselor

### Financial Impact
- **Additional Applications:** 1,247 per year
- **Additional Enrollments:** 374 students
- **Additional Revenue:** $2,121,000
- **Staff Cost Savings:** $71,400
- **Platform Investment:** $36,000
- **Net Benefit:** $2,156,400
- **ROI:** 847%

## Key Success Factors

### 1. Leadership Buy-In
Strong support from the Dean and Enrollment VP ensured smooth implementation and staff adoption.

### 2. Comprehensive Training
Both AI training on program specifics and staff training on new processes were crucial for success.

### 3. Gradual Implementation
Starting with one school and expanding gradually allowed for optimization and staff adjustment.

### 4. Continuous Monitoring
Regular performance reviews and adjustments ensured optimal results.

## Lessons Learned

### What Worked Well
- Instant response times dramatically improved prospect engagement
- AI handled routine questions effectively, freeing staff for complex conversations
- 24/7 availability captured previously lost opportunities
- Integration with existing CRM maintained workflow continuity

### Areas for Improvement
- Initial AI responses needed refinement for program-specific nuances
- Staff required time to adjust to new qualified lead flow
- Some prospects preferred human interaction for complex financial aid questions

## Recommendations for Other Institutions

### Before Implementation
1. Audit current admissions processes thoroughly
2. Secure leadership and staff buy-in early
3. Plan for adequate training time
4. Set realistic expectations for gradual improvement

### During Implementation
1. Start with pilot programs to test and refine
2. Monitor performance metrics closely
3. Gather regular feedback from staff and prospects
4. Be prepared to make adjustments quickly

### After Implementation
1. Continue optimizing AI responses based on performance data
2. Expand successful processes to other programs
3. Share success stories to maintain momentum
4. Plan for scaling to additional use cases

## Conclusion

Metro State University''s success with Agent Cory demonstrates the transformative potential of AI in admissions. The key lies not just in the technology, but in thoughtful implementation, comprehensive training, and continuous optimization.

The 847% ROI achieved in the first year represents just the beginning. As the AI continues to learn and improve, and as the institution expands its use of automation, the benefits will only compound.

*"Cory transformed our entire admissions funnel. We went from losing prospects due to slow response times to engaging 94% of our inquiries within minutes. The ROI was immediate and substantial."* - Dr. Sarah Johnson, Director of Admissions',
  'case_study',
  'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
  12,
  ARRAY['Case Study', 'ROI', 'University', 'Results'],
  'ai',
  true,
  'Metro State University Case Study: 847% ROI with AI Admissions',
  'See how Metro State University achieved 847% ROI in 12 months with Agent Cory AI admissions automation.',
  '{"roi_percentage": "847%", "additional_revenue": "$2.1M", "contact_rate_improvement": "124%", "response_time_improvement": "99.7%"}'
),
(
  '5 Strategies to Double Your Lead Conversion Rate',
  'double-lead-conversion-strategies',
  'Proven tactics that top-performing institutions use to convert more inquiries into enrolled students.',
  '# 5 Strategies to Double Your Lead Conversion Rate

Converting prospective students from initial inquiry to enrolled student is the ultimate goal of any admissions team. Yet many institutions struggle with conversion rates that hover around 15-25%. The top-performing institutions, however, consistently achieve conversion rates of 35-50% or higher.

What''s their secret? It''s not just one thing—it''s a systematic approach that optimizes every touchpoint in the admissions journey.

## Strategy 1: Master the Speed Game

**The 5-Minute Rule That Changes Everything**

Research consistently shows that contacting prospects within 5 minutes versus 30 minutes increases conversion rates by up to 900%. Yet most institutions take 4-24 hours to make first contact.

### Implementation Steps:
1. **Set up instant notifications** for new inquiries across all channels
2. **Create response templates** for common inquiry types
3. **Implement automated calling systems** for immediate outreach
4. **Train staff on rapid response protocols**

### Pro Tip:
Use AI-powered systems like Agent Cory to achieve sub-60-second response times automatically, ensuring you never miss the critical first-contact window.

## Strategy 2: Perfect Your Multi-Channel Orchestration

**Why Single-Channel Outreach Fails**

Prospects engage differently across channels. Some prefer phone calls, others respond better to text messages, and many need email follow-up with detailed information. The key is coordinated, intelligent multi-channel engagement.

### The Winning Formula:
1. **Primary Contact:** Phone call within 60 seconds
2. **Immediate Backup:** SMS with calendar link if no answer
3. **Information Delivery:** Email with program details and next steps
4. **Ongoing Nurture:** Scheduled follow-up across preferred channels

### Channel-Specific Best Practices:
- **Phone:** Keep initial calls under 3 minutes, focus on qualification
- **SMS:** Include clear value proposition and easy next steps
- **Email:** Provide comprehensive information with visual elements
- **Chat:** Offer immediate answers and booking options

## Strategy 3: Implement Intelligent Lead Scoring

**Not All Inquiries Are Created Equal**

Treating all prospects the same is a recipe for inefficiency. Smart institutions use lead scoring to prioritize their efforts and customize their approach.

### Key Scoring Factors:
- **Program Fit:** How well does their background match the program?
- **Timeline:** When are they looking to start?
- **Financial Capacity:** Can they afford the program?
- **Engagement Level:** How responsive are they to outreach?
- **Source Quality:** Which lead sources convert best?

### Scoring Implementation:
1. **Define scoring criteria** based on your historical data
2. **Assign point values** to different attributes and behaviors
3. **Create routing rules** to send high-score leads to top counselors
4. **Automate follow-up sequences** based on score ranges

## Strategy 4: Optimize Your Qualification Process

**Ask the Right Questions at the Right Time**

Effective qualification isn''t about gathering every piece of information—it''s about identifying genuine interest and fit while building rapport.

### The BANT-E Framework for Education:
- **Budget:** Can they afford the program?
- **Authority:** Are they the decision-maker?
- **Need:** Do they have a genuine need for the program?
- **Timeline:** When are they looking to start?
- **Engagement:** How interested and responsive are they?

### Qualification Best Practices:
1. **Start with rapport building** before diving into qualification
2. **Use open-ended questions** to understand motivations
3. **Listen for buying signals** and respond appropriately
4. **Qualify budget sensitively** using ranges or scenarios
5. **Confirm next steps** before ending conversations

## Strategy 5: Create Irresistible Follow-Up Sequences

**The Fortune Is in the Follow-Up**

Most prospects don''t convert on the first contact. The institutions that win are those that maintain consistent, valuable follow-up without being pushy.

### The 7-Touch Follow-Up Framework:
1. **Touch 1:** Immediate response (phone + SMS)
2. **Touch 2:** Welcome email with program overview
3. **Touch 3:** Success story or case study (2 days later)
4. **Touch 4:** Financial aid information (1 week later)
5. **Touch 5:** Program-specific content (2 weeks later)
6. **Touch 6:** Limited-time opportunity (1 month later)
7. **Touch 7:** Final check-in with alternative options

### Follow-Up Content Ideas:
- Student success stories and testimonials
- Virtual campus tours and program previews
- Financial aid and scholarship information
- Career outcome data and job placement rates
- Faculty spotlights and program highlights
- Application deadline reminders
- Scholarship opportunity alerts

## Putting It All Together: The Conversion Optimization Checklist

### Immediate Actions (This Week):
- [ ] Audit your current response times
- [ ] Set up instant inquiry notifications
- [ ] Create response templates for common scenarios
- [ ] Implement basic lead scoring criteria

### Short-Term Improvements (This Month):
- [ ] Develop multi-channel follow-up sequences
- [ ] Train staff on qualification best practices
- [ ] Create content library for follow-up campaigns
- [ ] Implement tracking and analytics

### Long-Term Optimization (Next Quarter):
- [ ] Analyze conversion data to refine scoring
- [ ] A/B test different follow-up sequences
- [ ] Expand successful processes to all programs
- [ ] Consider AI automation for scale

## Measuring Success

Track these key metrics to measure your conversion optimization efforts:

### Primary Metrics:
- **Overall Conversion Rate:** Inquiries to enrolled students
- **Channel Conversion Rates:** Performance by traffic source
- **Time-to-Contact:** Average response time to new inquiries
- **Contact Success Rate:** Percentage of inquiries successfully reached

### Secondary Metrics:
- **Qualification Rate:** Percentage of contacts that are qualified
- **Appointment Show Rate:** Scheduled vs. attended meetings
- **Pipeline Velocity:** Time from inquiry to enrollment decision
- **Staff Efficiency:** Hours spent per enrolled student

## Real-World Results

Institutions implementing these strategies typically see:
- **50-100% improvement** in contact rates
- **25-75% increase** in conversion rates
- **60-80% reduction** in response times
- **30-50% decrease** in cost per enrollment

## Conclusion

Doubling your lead conversion rate isn''t about working harder—it''s about working smarter. By implementing these five strategies systematically, you can transform your admissions process and achieve the kind of results that seemed impossible just a few years ago.

The institutions that embrace these approaches today will have a significant competitive advantage tomorrow. The question isn''t whether to optimize your conversion process—it''s how quickly you can implement these proven strategies.

Ready to get started? Begin with Strategy 1 (speed) as it provides the fastest path to immediate improvement, then layer in the other strategies over time for compound benefits.',
  'blog',
  'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
  8,
  ARRAY['Conversion', 'Strategy', 'Best Practices', 'Admissions'],
  'conversion',
  true,
  '5 Strategies to Double Your Lead Conversion Rate - Agent Cory',
  'Learn proven tactics that top-performing institutions use to convert more inquiries into enrolled students.',
  '{}'
),
(
  '2024 Admissions Benchmarks Report',
  'admissions-benchmarks-2024',
  'Comprehensive industry data including response times, conversion rates, and ROI metrics from 500+ institutions.',
  'Download our comprehensive 2024 Admissions Benchmarks Report featuring data from over 500 educational institutions.',
  'ebook',
  'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800',
  30,
  ARRAY['Benchmarks', 'Industry Data', 'Research', 'Metrics'],
  'admissions',
  true,
  '2024 Admissions Benchmarks Report - Industry Data & Insights',
  'Comprehensive industry benchmarks including response times, conversion rates, and ROI metrics from 500+ institutions.',
  '{"institutions_surveyed": "500+", "data_points": "50+", "report_pages": "45"}'
),
(
  'AI Implementation: Lessons from 100+ Institutions',
  'ai-implementation-lessons',
  'Real-world insights from successful AI implementations, including common pitfalls and how to avoid them.',
  'Join our webinar featuring insights from over 100 successful AI implementations in higher education admissions.',
  'webinar',
  'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800',
  45,
  ARRAY['AI', 'Implementation', 'Webinar', 'Best Practices'],
  'ai',
  false,
  'AI Implementation Webinar: Lessons from 100+ Institutions',
  'Real-world insights from successful AI implementations, including common pitfalls and how to avoid them.',
  '{"institutions_featured": "100+", "duration_minutes": "45", "attendee_rating": "4.8/5"}'
),
(
  'The Psychology of Fast Response Times',
  'psychology-fast-response-times',
  'Research-backed insights into why speed matters so much in admissions and how to leverage it for better conversions.',
  '# The Psychology of Fast Response Times

## Why Every Second Counts in Admissions

When a prospective student submits an inquiry, they''re in a unique psychological state. They''ve overcome inertia, made a decision to explore their options, and taken action. This moment represents peak interest and engagement—but it''s also incredibly fragile.

## The Science Behind Speed

### The Attention Economy
In our hyperconnected world, attention is the scarcest resource. Prospects are bombarded with options, distractions, and competing priorities. The institution that captures their attention first—and maintains it—has a significant advantage.

### Psychological Momentum
Taking action (submitting an inquiry) creates psychological momentum. Fast response times maintain this momentum, while delays allow it to dissipate. Once momentum is lost, it''s exponentially harder to rebuild.

### The Commitment Escalation Principle
Each positive interaction increases a prospect''s psychological commitment to the process. Fast, helpful responses create a series of small "yes" moments that build toward larger commitments.

## The Data Speaks Volumes

### Response Time Impact Studies
- **5 minutes vs 30 minutes:** 900% higher conversion rate
- **1 hour vs 24 hours:** 60% higher conversion rate
- **Same day vs next day:** 40% higher conversion rate

### Industry Benchmarks
- **Top Quartile Institutions:** Under 5 minutes average response
- **Average Institutions:** 2-4 hours average response
- **Bottom Quartile:** 24+ hours average response

## Implementing Speed in Your Process

### Technology Solutions
1. **Instant Notification Systems:** Real-time alerts for new inquiries
2. **Automated Response Tools:** AI-powered immediate engagement
3. **Mobile-First Workflows:** Enable staff to respond from anywhere
4. **Integration Platforms:** Connect all inquiry sources to response systems

### Process Optimization
1. **Response Time SLAs:** Set and measure specific response time goals
2. **Escalation Procedures:** Backup systems when primary responders are unavailable
3. **Weekend/Evening Coverage:** Ensure 24/7 response capability
4. **Quality vs Speed Balance:** Maintain helpful, personalized responses at speed

## The Compound Effect of Speed

Fast response times don''t just improve individual conversions—they create a compound effect:

### Brand Perception
Prospects associate fast response with:
- Professionalism and organization
- Genuine interest in their success
- Quality of future service and support

### Word-of-Mouth Marketing
Impressed prospects share their positive experiences, creating organic marketing that attracts more high-quality inquiries.

### Staff Morale
When systems work efficiently, staff feel more effective and engaged, leading to better performance across all interactions.

## Conclusion

Speed isn''t just about efficiency—it''s about psychology, respect, and competitive advantage. In an era where prospects have unlimited options, the institutions that respond fastest will consistently win more enrollments.

The question isn''t whether speed matters—it''s whether you''re willing to invest in the systems and processes needed to achieve it consistently.',
  'blog',
  'https://images.pexels.com/photos/3184394/pexels-photo-3184394.jpeg?auto=compress&cs=tinysrgb&w=800',
  6,
  ARRAY['Psychology', 'Response Time', 'Conversion', 'Research'],
  'admissions',
  false,
  'The Psychology of Fast Response Times in Admissions',
  'Research-backed insights into why speed matters so much in admissions and how to leverage it.',
  '{}'
);