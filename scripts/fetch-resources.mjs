#!/usr/bin/env node

// Simple Node.js script to generate static resources data
import { writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Static fallback content for build time
const staticContent = [
  {
    id: "ai-guide-static",
    title: "The Complete Guide to AI in Admissions",
    slug: "ai-admissions-guide",
    summary: "Comprehensive 40-page guide covering implementation strategies, best practices, and ROI measurement for AI-powered admissions automation.",
    cover_image: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800",
    reading_minutes: 25,
    tags: ["AI", "Implementation", "Best Practices"],
    published: true,
    created_at: new Date().toISOString()
  },
  {
    id: "conversion-webinar-static",
    title: "5 Strategies to Double Your Lead Conversion Rate",
    slug: "double-conversion-strategies",
    summary: "Join our upcoming webinar to learn proven tactics that top-performing institutions use to convert more inquiries into enrolled students.",
    cover_image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800",
    reading_minutes: 45,
    tags: ["Webinar", "Conversion", "Strategy"],
    published: true,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "metro-case-study-static",
    title: "Case Study: Metro State University - 847% ROI in 12 Months",
    slug: "metro-state-case-study",
    summary: "How Metro State University transformed their admissions process and achieved record-breaking results with Agent Cory.",
    cover_image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800",
    reading_minutes: 12,
    tags: ["Case Study", "ROI", "University"],
    published: true,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "benchmarks-report-static",
    title: "2024 Admissions Benchmarks Report",
    slug: "admissions-benchmarks-2024",
    summary: "Comprehensive industry data including response times, conversion rates, and ROI metrics from 500+ institutions.",
    cover_image: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800",
    reading_minutes: 30,
    tags: ["Benchmarks", "Industry Data", "Research"],
    published: true,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "response-time-blog-static",
    title: "The Psychology of Fast Response Times in Admissions",
    slug: "psychology-fast-response-times",
    summary: "Research-backed insights into why speed matters so much in admissions and how to leverage it for better conversion rates.",
    cover_image: "https://images.pexels.com/photos/3184394/pexels-photo-3184394.jpeg?auto=compress&cs=tinysrgb&w=800",
    reading_minutes: 8,
    tags: ["Psychology", "Response Time", "Conversion"],
    published: true,
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "crm-integration-guide-static",
    title: "CRM Integration Best Practices for Higher Ed",
    slug: "crm-integration-best-practices",
    summary: "Step-by-step guide for seamless CRM integration, data mapping, and workflow automation setup.",
    cover_image: "https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=800",
    reading_minutes: 20,
    tags: ["CRM", "Integration", "Automation"],
    published: true,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  }
];

try {
  // Create data directory if it doesn't exist
  mkdirSync('dist/data', { recursive: true });
  
  // Generate static resources JSON
  const output = {
    ok: true,
    items: staticContent,
    generated_at: new Date().toISOString(),
    source: 'static_build'
  };
  
  writeFileSync('dist/data/resources.json', JSON.stringify(output, null, 2));
  console.log('✅ Generated static resources data:', staticContent.length, 'items');
} catch (error) {
  console.error('❌ Error generating static resources:', error.message);
  process.exit(1);
}