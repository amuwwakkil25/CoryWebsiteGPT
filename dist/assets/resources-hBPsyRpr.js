import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css             */const c=class c{static async loadContent(){console.log("🔄 Starting content loading process...");const e=this.getCachedContent();if(e)return console.log("✅ Using cached content:",e.length,"items"),e;try{console.log("🔄 Attempting database load...");const t=await this.loadFromDatabase();if(t&&t.length>0)return console.log("✅ Database load successful:",t.length,"items"),this.setCachedContent(t),t}catch(t){console.warn("⚠️ Database load failed:",t)}console.log("📦 Using static fallback content");const s=this.getStaticContent();return this.setCachedContent(s),s}static getCachedContent(){try{const e=localStorage.getItem(this.CACHE_KEY);if(!e)return null;const{data:s,timestamp:t}=JSON.parse(e);return Date.now()-t>this.CACHE_DURATION?(localStorage.removeItem(this.CACHE_KEY),null):s}catch{return null}}static setCachedContent(e){try{localStorage.setItem(this.CACHE_KEY,JSON.stringify({data:e,timestamp:Date.now()}))}catch(s){console.warn("Cache storage failed:",s)}}static async loadFromDatabase(){const e=new Promise((t,n)=>{setTimeout(()=>n(new Error("Database timeout")),5e3)}),s=this.executeQuery();return Promise.race([s,e])}static async executeQuery(){const e="https://wjtmdrjuheclgdzwprku.supabase.co",s="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqdG1kcmp1aGVjbGdkendwcmt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMjM5NTUsImV4cCI6MjA2OTc5OTk1NX0.Yk4ZCqbZ45Of7fmxDitJfDroBtCUK0D_PS7LWhmM26c",t=await fetch(`${e}/rest/v1/content_items?is_published=eq.true&order=published_at.desc`,{headers:{apikey:s,Authorization:`Bearer ${s}`,"Content-Type":"application/json"}});if(!t.ok)throw new Error(`Database query failed: ${t.status} ${t.statusText}`);return await t.json()}static getStaticContent(){return[{id:"ai-guide-static",title:"The Complete Guide to AI in Admissions",slug:"ai-admissions-guide",excerpt:"Comprehensive 40-page guide covering implementation strategies, best practices, and ROI measurement for AI-powered admissions automation.",content:`# The Complete Guide to AI in Admissions

This comprehensive guide covers everything you need to know about implementing AI in your admissions process...`,content_type:"guide",featured_image_url:"https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800",author_name:"Agent Cory Team",author_title:"AI Admissions Experts",reading_time_minutes:25,tags:["AI","Implementation","Best Practices"],category:"ai",is_featured:!0,is_published:!0,published_at:new Date().toISOString(),seo_title:"Complete Guide to AI in Admissions - Agent Cory",seo_description:"Learn how to implement AI in your admissions process with this comprehensive guide.",download_url:"/downloads/ai-admissions-guide.pdf",metrics:{downloads:1250,rating:4.8},view_count:3420},{id:"conversion-webinar-static",title:"5 Strategies to Double Your Lead Conversion Rate",slug:"double-conversion-strategies",excerpt:"Join our upcoming webinar to learn proven tactics that top-performing institutions use to convert more inquiries into enrolled students.",content:`# 5 Strategies to Double Your Lead Conversion Rate

## Strategy 1: Speed of Response

The faster you respond...`,content_type:"webinar",featured_image_url:"https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800",author_name:"Agent Cory Team",author_title:"AI Admissions Experts",reading_time_minutes:45,tags:["Webinar","Conversion","Strategy"],category:"conversion",is_featured:!0,is_published:!0,published_at:new Date(Date.now()-2*24*60*60*1e3).toISOString(),external_url:"https://zoom.us/webinar/register/example",metrics:{registrations:450,attendees:320},view_count:1890},{id:"metro-case-study-static",title:"Case Study: Metro State University - 847% ROI in 12 Months",slug:"metro-state-case-study",excerpt:"How Metro State University transformed their admissions process and achieved record-breaking results with Agent Cory.",content:`# Metro State University Case Study

## The Challenge

Metro State University was struggling with low contact rates and slow response times...`,content_type:"case_study",featured_image_url:"https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800",author_name:"Dr. Sarah Johnson",author_title:"Director of Admissions, Metro State University",reading_time_minutes:12,tags:["Case Study","ROI","University"],category:"admissions",is_featured:!1,is_published:!0,published_at:new Date(Date.now()-7*24*60*60*1e3).toISOString(),metrics:{roi_percentage:847,additional_revenue:21e5,time_saved_hours:2100},view_count:2890},{id:"benchmarks-report-static",title:"2024 Admissions Benchmarks Report",slug:"admissions-benchmarks-2024",excerpt:"Comprehensive industry data including response times, conversion rates, and ROI metrics from 500+ institutions.",content:`# 2024 Admissions Benchmarks Report

## Executive Summary

This comprehensive report analyzes data from over 500 educational institutions...`,content_type:"ebook",featured_image_url:"https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800",author_name:"Agent Cory Research Team",author_title:"Industry Analysts",reading_time_minutes:30,tags:["Benchmarks","Industry Data","Research"],category:"roi",is_featured:!0,is_published:!0,published_at:new Date(Date.now()-1*24*60*60*1e3).toISOString(),download_url:"/downloads/benchmarks-2024.pdf",metrics:{downloads:1850,institutions_surveyed:500},view_count:2650},{id:"response-time-blog-static",title:"The Psychology of Fast Response Times in Admissions",slug:"psychology-fast-response-times",excerpt:"Research-backed insights into why speed matters so much in admissions and how to leverage it for better conversion rates.",content:`# The Psychology of Fast Response Times

## Why Speed Matters

In the world of admissions, timing is everything...`,content_type:"blog",featured_image_url:"https://images.pexels.com/photos/3184394/pexels-photo-3184394.jpeg?auto=compress&cs=tinysrgb&w=800",author_name:"Agent Cory Team",author_title:"AI Admissions Experts",reading_time_minutes:8,tags:["Psychology","Response Time","Conversion"],category:"admissions",is_featured:!1,is_published:!0,published_at:new Date(Date.now()-14*24*60*60*1e3).toISOString(),metrics:{shares:245,comments:18},view_count:1560},{id:"crm-integration-guide-static",title:"CRM Integration Best Practices for Higher Ed",slug:"crm-integration-best-practices",excerpt:"Step-by-step guide for seamless CRM integration, data mapping, and workflow automation setup.",content:`# CRM Integration Best Practices

## Getting Started

Integrating your CRM with AI automation requires careful planning...`,content_type:"guide",featured_image_url:"https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=800",author_name:"Agent Cory Team",author_title:"Integration Specialists",reading_time_minutes:20,tags:["CRM","Integration","Automation"],category:"crm",is_featured:!1,is_published:!0,published_at:new Date(Date.now()-10*24*60*60*1e3).toISOString(),metrics:{downloads:890,implementations:120},view_count:1340},{id:"ai-implementation-blog-static",title:"AI vs Human: Finding the Right Balance in Admissions",slug:"ai-human-balance-admissions",excerpt:"When to use AI and when human touch matters most in the admissions journey.",content:`# AI vs Human: Finding the Right Balance

## The Human Element

While AI can automate many processes...`,content_type:"blog",featured_image_url:"https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800",author_name:"Agent Cory Team",author_title:"AI Strategy Experts",reading_time_minutes:12,tags:["AI Strategy","Human Touch","Balance"],category:"roi",is_featured:!0,is_published:!0,published_at:new Date(Date.now()-21*24*60*60*1e3).toISOString(),metrics:{shares:180,comments:25},view_count:980},{id:"retention-strategies-static",title:"Student Retention: AI-Powered Early Warning Systems",slug:"ai-student-retention-systems",excerpt:"How AI can identify at-risk students early and implement automated intervention strategies to improve retention rates.",content:`# Student Retention: AI-Powered Early Warning Systems

## The Retention Challenge

Student retention is one of the biggest challenges...`,content_type:"guide",featured_image_url:"https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=800",author_name:"Agent Cory Team",author_title:"Student Success Experts",reading_time_minutes:18,tags:["Retention","AI","Student Success"],category:"ai",is_featured:!1,is_published:!0,published_at:new Date(Date.now()-5*24*60*60*1e3).toISOString(),metrics:{downloads:650,implementations:45},view_count:1120}]}};c.CACHE_KEY="agentcory_content_cache",c.CACHE_DURATION=10*60*1e3;let l=c;class m{constructor(){this.allContent=[],this.filteredContent=[],this.currentView="grid",this.currentPage=1,this.itemsPerPage=12,this.isLoading=!1,this.init()}async init(){console.log("🚀 Initializing Resources Page Manager...");try{this.showLoadingState(),this.allContent=await l.loadContent(),this.filteredContent=[...this.allContent],this.bindEvents(),this.renderFeaturedContent(),this.renderAllContent(),console.log("✅ Resources page initialized successfully with",this.allContent.length,"items")}catch(e){console.error("❌ Critical error during initialization:",e),this.showErrorState()}}bindEvents(){const e=document.getElementById("resource-search");if(e){let i;e.addEventListener("input",()=>{clearTimeout(i),i=setTimeout(()=>{this.handleSearch(e.value)},300)})}const s=document.getElementById("type-filter"),t=document.getElementById("category-filter"),n=document.getElementById("clear-filters");s&&s.addEventListener("change",()=>this.applyFilters()),t&&t.addEventListener("change",()=>this.applyFilters()),n&&n.addEventListener("click",()=>this.clearAllFilters()),document.querySelectorAll(".view-btn").forEach(i=>{i.addEventListener("click",d=>{const u=d.currentTarget.dataset.view;this.toggleView(u)})});const a=document.getElementById("load-more");a&&a.addEventListener("click",()=>this.loadMoreContent());const r=document.getElementById("newsletter-form");r&&r.addEventListener("submit",i=>this.handleNewsletterSignup(i)),this.bindModalEvents()}bindModalEvents(){document.querySelectorAll(".modal-close").forEach(t=>{t.addEventListener("click",n=>{const o=n.target.closest(".modal");o&&this.closeModal(o)})}),document.addEventListener("click",t=>{t.target.classList.contains("modal")&&this.closeModal(t.target)});const s=document.getElementById("lead-magnet-form");s&&s.addEventListener("submit",t=>this.handleLeadMagnetForm(t))}handleSearch(e){const s=e.toLowerCase().trim();s?this.filteredContent=this.allContent.filter(t=>t.title.toLowerCase().includes(s)||t.excerpt.toLowerCase().includes(s)||t.tags.some(n=>n.toLowerCase().includes(s))||t.category.toLowerCase().includes(s)):this.filteredContent=[...this.allContent],this.currentPage=1,this.renderAllContent()}applyFilters(){const e=document.getElementById("type-filter"),s=document.getElementById("category-filter"),t=(e==null?void 0:e.value)||"all",n=(s==null?void 0:s.value)||"all";this.filteredContent=this.allContent.filter(o=>{const a=t==="all"||o.content_type===t,r=n==="all"||o.category===n;return a&&r}),this.currentPage=1,this.renderAllContent()}clearAllFilters(){const e=document.getElementById("type-filter"),s=document.getElementById("category-filter"),t=document.getElementById("resource-search");e&&(e.value="all"),s&&(s.value="all"),t&&(t.value=""),this.filteredContent=[...this.allContent],this.currentPage=1,this.renderAllContent()}toggleView(e){this.currentView=e,document.querySelectorAll(".view-btn").forEach(t=>{t.classList.remove("active"),t.dataset.view===e&&t.classList.add("active")});const s=document.getElementById("resources-content");s&&(s.className=e==="list"?"resources-grid list-view":"resources-grid")}renderFeaturedContent(){const e=document.getElementById("featured-content");if(!e)return;const s=this.allContent.filter(t=>t.is_featured);if(s.length===0){e.innerHTML='<div class="empty-state"><p>No featured resources available.</p></div>';return}e.innerHTML=s.map(t=>this.createFeaturedCard(t)).join(""),e.querySelectorAll(".featured-card").forEach((t,n)=>{t.addEventListener("click",()=>{this.openContentModal(s[n])})})}renderAllContent(){const e=document.getElementById("resources-content");if(!e)return;const s=0,t=this.currentPage*this.itemsPerPage,n=this.filteredContent.slice(s,t);if(n.length===0){e.innerHTML=`
        <div class="empty-state">
          <i data-lucide="search"></i>
          <h3>No resources found</h3>
          <p>Try adjusting your search or filter criteria.</p>
        </div>
      `;return}e.innerHTML=n.map(o=>this.createResourceCard(o)).join(""),e.querySelectorAll(".resource-card").forEach((o,a)=>{o.addEventListener("click",()=>{this.openContentModal(n[a])})}),this.updateLoadMoreButton(),typeof lucide<"u"&&lucide.createIcons()}createFeaturedCard(e){return`
      <div class="featured-card" data-id="${e.id}">
        <div class="featured-image">
          <img src="${e.featured_image_url||"https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800"}" alt="${e.title}" />
          <div class="content-badge ${e.content_type}">${this.formatContentType(e.content_type)}</div>
        </div>
        <div class="featured-content">
          <h3>${e.title}</h3>
          <p>${e.excerpt}</p>
          <div class="content-meta">
            <div class="meta-item">
              <i data-lucide="user" class="meta-icon"></i>
              <span>${e.author_name}</span>
            </div>
            ${e.reading_time_minutes?`
              <div class="meta-item">
                <i data-lucide="clock" class="meta-icon"></i>
                <span>${e.reading_time_minutes} min read</span>
              </div>
            `:""}
            <div class="meta-item">
              <i data-lucide="calendar" class="meta-icon"></i>
              <span>${this.formatDate(e.published_at)}</span>
            </div>
          </div>
          <div class="content-tags">
            ${e.tags.map(s=>`<span class="tag">${s}</span>`).join("")}
          </div>
        </div>
      </div>
    `}createResourceCard(e){return`
      <div class="resource-card" data-id="${e.id}">
        <div class="resource-image">
          <img src="${e.featured_image_url||"https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800"}" alt="${e.title}" />
          <div class="content-badge ${e.content_type}">${this.formatContentType(e.content_type)}</div>
        </div>
        <div class="resource-content">
          <h3>${e.title}</h3>
          <p>${e.excerpt}</p>
          <div class="resource-footer">
            <div class="read-time">
              <i data-lucide="clock"></i>
              <span>${e.reading_time_minutes||5} min read</span>
            </div>
            <div class="resource-action">
              <span>${this.getActionText(e.content_type)}</span>
              <i data-lucide="arrow-right"></i>
            </div>
          </div>
        </div>
      </div>
    `}formatContentType(e){return{blog:"Blog Post",case_study:"Case Study",guide:"Guide",ebook:"eBook",webinar:"Webinar"}[e]||e}getActionText(e){return{blog:"Read Article",case_study:"View Case Study",guide:"Read Guide",ebook:"Download eBook",webinar:"Watch Webinar"}[e]||"View Content"}formatDate(e){return new Date(e).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"})}updateLoadMoreButton(){const e=document.getElementById("load-more");if(!e)return;const s=this.filteredContent.length>this.currentPage*this.itemsPerPage;e.style.display=s?"block":"none"}loadMoreContent(){this.currentPage++,this.renderAllContent()}openContentModal(e){if(e.content_type==="ebook"||e.download_url){this.openLeadMagnetModal(e);return}if(e.external_url){window.open(e.external_url,"_blank");return}this.showContentModal(e)}showContentModal(e){const s=document.getElementById("content-modal"),t=document.getElementById("content-modal-title"),n=document.getElementById("content-modal-body");if(!s||!t||!n)return;t.textContent=e.title;const o=this.convertToHTML(e.content);n.innerHTML=`
      <div class="content-header">
        <div class="content-meta">
          <span class="content-type-badge ${e.content_type}">${this.formatContentType(e.content_type)}</span>
          <span class="content-author">By ${e.author_name}</span>
          <span class="content-date">${this.formatDate(e.published_at)}</span>
          ${e.reading_time_minutes?`<span class="content-time">${e.reading_time_minutes} min read</span>`:""}
        </div>
        ${e.featured_image_url?`
          <img src="${e.featured_image_url}" alt="${e.title}" class="content-featured-image" />
        `:""}
      </div>
      <div class="content-body">
        ${o}
      </div>
      <div class="content-footer">
        <div class="content-tags">
          ${e.tags.map(a=>`<span class="tag">${a}</span>`).join("")}
        </div>
        <div class="content-actions">
          <button class="btn btn-secondary" onclick="window.print()">
            <i data-lucide="printer"></i>
            Print
          </button>
          <button class="btn btn-primary" onclick="window.resourcesManager.shareContent('${e.title}', window.location.href)">
            <i data-lucide="share-2"></i>
            Share
          </button>
        </div>
      </div>
    `,this.openModal(s)}openLeadMagnetModal(e){const s=document.getElementById("lead-magnet-modal"),t=document.getElementById("magnet-modal-title"),n=document.getElementById("magnet-modal-description"),o=document.getElementById("magnet-resource-id");!s||!t||!n||!o||(t.textContent=`Download: ${e.title}`,n.innerHTML=`
      <p>${e.excerpt}</p>
      ${e.content_type==="ebook"?"<p><strong>Format:</strong> PDF • <strong>Pages:</strong> 40+ • <strong>File Size:</strong> 2.5MB</p>":""}
    `,o.value=e.id,this.openModal(s))}openModal(e){e.classList.add("active"),document.body.style.overflow="hidden";const s=e.querySelector("input, select, textarea");s&&setTimeout(()=>s.focus(),100)}closeModal(e){e.classList.remove("active"),document.body.style.overflow="",e.querySelectorAll("form").forEach(o=>o.reset()),e.querySelectorAll('[id$="-success"]').forEach(o=>o.style.display="none"),e.querySelectorAll("form").forEach(o=>o.style.display="block")}handleLeadMagnetForm(e){e.preventDefault();const s=e.target,t=new FormData(s),n=Object.fromEntries(t.entries());if(n.website)return;console.log("📝 Lead magnet request:",{name:n.name,email:n.email,organization:n.organization,role:n.role,resource_id:n.resourceId,follow_up_requested:n.followUp==="on"}),s.style.display="none";const o=document.getElementById("magnet-success");o&&(o.style.display="block"),this.showToast("Resource request submitted successfully!","success")}handleNewsletterSignup(e){e.preventDefault();const s=e.target,n=new FormData(s).get("email");console.log("📧 Newsletter signup:",n),this.showToast("Successfully subscribed to newsletter!","success"),s.reset()}convertToHTML(e){return e.replace(/^# (.*$)/gm,"<h1>$1</h1>").replace(/^## (.*$)/gm,"<h2>$1</h2>").replace(/^### (.*$)/gm,"<h3>$1</h3>").replace(/^\* (.*$)/gm,"<li>$1</li>").replace(/^(\d+)\. (.*$)/gm,"<li>$2</li>").replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\*(.*?)\*/g,"<em>$1</em>").replace(/\n\n/g,"</p><p>").replace(/^(.*)$/gm,"<p>$1</p>").replace(/<p><h/g,"<h").replace(/<\/h([1-6])><\/p>/g,"</h$1>").replace(/<p><li>/g,"<ul><li>").replace(/<\/li><\/p>/g,"</li></ul>")}shareContent(e,s){navigator.clipboard&&navigator.clipboard.writeText?navigator.clipboard.writeText(s).then(()=>{this.showToast(`Link copied to clipboard: ${e}`,"success")}).catch(()=>{this.fallbackCopyToClipboard(s,e)}):this.fallbackCopyToClipboard(s,e)}fallbackCopyToClipboard(e,s){const t=document.createElement("textarea");t.value=e,t.style.position="fixed",t.style.left="-999999px",t.style.top="-999999px",document.body.appendChild(t),t.focus(),t.select();try{document.execCommand("copy"),this.showToast(`Link copied to clipboard: ${s}`,"success")}catch{this.showToast("Unable to copy link. Please copy manually.","error")}document.body.removeChild(t)}showLoadingState(){["featured-content","resources-content"].forEach(s=>{const t=document.getElementById(s);t&&(t.innerHTML=`
          <div class="loading-placeholder">
            <div class="loading-spinner"></div>
            <p>Loading resources...</p>
          </div>
        `)})}showErrorState(){["featured-content","resources-content"].forEach(s=>{const t=document.getElementById(s);t&&(t.innerHTML=`
          <div class="empty-state">
            <i data-lucide="alert-circle"></i>
            <h3>Unable to load resources</h3>
            <p>Please try refreshing the page or contact support.</p>
            <button class="btn btn-primary" onclick="window.location.reload()">Refresh Page</button>
          </div>
        `)})}showToast(e,s="info"){const t=document.createElement("div");t.className=`toast toast-${s}`,t.textContent=e,t.style.cssText=`
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: var(--shadow-lg);
      z-index: 1001;
      animation: slideInRight 0.3s ease-out;
      max-width: 400px;
    `;const n={success:"var(--success)",error:"var(--error)",info:"var(--sky-gradient-start)"};t.style.background=n[s],t.style.color="white",document.body.appendChild(t),setTimeout(()=>{t.style.animation="slideOutRight 0.3s ease-out",setTimeout(()=>t.remove(),300)},4e3)}}document.addEventListener("DOMContentLoaded",()=>{window.resourcesManager=new m});
