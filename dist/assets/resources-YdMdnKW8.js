import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css             */class a{static log(e,t=null){console.log(`🔍 [Resources Debug] ${e}`,t||"");const n=document.getElementById("debug-info")||this.createDebugDiv(),s=document.createElement("div");s.style.cssText="padding: 0.5rem; border-bottom: 1px solid #eee; font-family: monospace; font-size: 0.75rem;",s.innerHTML=`<strong>${new Date().toLocaleTimeString()}</strong>: ${e}`,t&&(s.innerHTML+=`<br><pre style="margin: 0.25rem 0; color: #666;">${JSON.stringify(t,null,2)}</pre>`),n.appendChild(s),n.scrollTop=n.scrollHeight}static createDebugDiv(){const e=document.createElement("div");e.id="debug-info",e.style.cssText=`
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 400px;
      max-height: 300px;
      background: white;
      border: 2px solid #333;
      border-radius: 8px;
      overflow-y: auto;
      z-index: 9999;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;const t=document.createElement("div");return t.style.cssText="background: #333; color: white; padding: 0.5rem; font-weight: bold; position: sticky; top: 0;",t.innerHTML='Debug Log <button onclick="this.parentElement.parentElement.remove()" style="float: right; background: none; border: none; color: white; cursor: pointer;">×</button>',e.appendChild(t),document.body.appendChild(e),e}}const p=[{id:"ai-guide-static",title:"The Complete Guide to AI in Admissions",slug:"ai-admissions-guide",excerpt:"Comprehensive 40-page guide covering implementation strategies, best practices, and ROI measurement for AI-powered admissions automation.",content:`# The Complete Guide to AI in Admissions

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

Integrating your CRM with AI automation requires careful planning...`,content_type:"guide",featured_image_url:"https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=800",author_name:"Agent Cory Team",author_title:"Integration Specialists",reading_time_minutes:20,tags:["CRM","Integration","Automation"],category:"crm",is_featured:!1,is_published:!0,published_at:new Date(Date.now()-10*24*60*60*1e3).toISOString(),metrics:{downloads:890,implementations:120},view_count:1340}];class d{static async testConnection(){try{a.log("Testing database connection...");const e="https://wjtmdrjuheclgdzwprku.supabase.co",t="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqdG1kcmp1aGVjbGdkendwcmt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMjM5NTUsImV4cCI6MjA2OTc5OTk1NX0.Yk4ZCqbZ45Of7fmxDitJfDroBtCUK0D_PS7LWhmM26c";a.log("Environment check",{hasUrl:!!e,hasKey:!!t,urlPreview:e?e.substring(0,30)+"...":"missing",keyPreview:t?t.substring(0,20)+"...":"missing"});const n=await fetch(`${e}/rest/v1/`,{headers:{apikey:t,Authorization:`Bearer ${t}`}});return a.log("Connection test result",{status:n.status,statusText:n.statusText,ok:n.ok}),n.ok}catch(e){return a.log("Connection test failed",{error:e.message,stack:e.stack}),!1}}static async getContent(){try{a.log("Starting database content fetch...");const e="https://wjtmdrjuheclgdzwprku.supabase.co",t="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqdG1kcmp1aGVjbGdkendwcmt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMjM5NTUsImV4cCI6MjA2OTc5OTk1NX0.Yk4ZCqbZ45Of7fmxDitJfDroBtCUK0D_PS7LWhmM26c",n=`${e}/rest/v1/content_items?is_published=eq.true&order=published_at.desc`;a.log("Fetching from URL",{url:n});const s=await fetch(n,{headers:{apikey:t,Authorization:`Bearer ${t}`,"Content-Type":"application/json",Accept:"application/json"}});if(a.log("Database response",{status:s.status,statusText:s.statusText,ok:s.ok,headers:Object.fromEntries(s.headers.entries())}),!s.ok){const i=await s.text();throw a.log("Database error response",{errorText:i}),new Error(`Database query failed: ${s.status} ${s.statusText} - ${i}`)}const o=await s.json();return a.log("Database query success",{itemCount:o.length,firstItem:o[0]?{title:o[0].title,type:o[0].content_type}:"none"}),o}catch(e){throw a.log("Database fetch error",{error:e.message,stack:e.stack}),e}}}class m{static async loadContent(){a.log("🚀 Starting content loading process...");try{if(a.log("Testing database connection..."),await d.testConnection()){a.log("✅ Database connection successful, fetching content...");const t=await d.getContent();if(t&&t.length>0)return a.log("✅ Database content loaded successfully",{count:t.length}),t;a.log("⚠️ Database is empty, using static content")}else a.log("❌ Database connection failed, using static content")}catch(e){a.log("❌ Database error, using static content",{error:e.message})}return a.log("📦 Using static fallback content"),p}}class h{constructor(){this.allContent=[],this.filteredContent=[],this.currentView="grid",this.currentPage=1,this.itemsPerPage=12,this.isLoading=!1,this.init()}async init(){a.log("🚀 Initializing Resources Page Manager...");try{this.showLoadingState(),this.allContent=await m.loadContent(),this.filteredContent=[...this.allContent],a.log("Content loaded",{total:this.allContent.length,featured:this.allContent.filter(e=>e.is_featured).length}),this.bindEvents(),this.renderFeaturedContent(),this.renderAllContent(),a.log("✅ Resources page initialized successfully")}catch(e){a.log("❌ Critical initialization error",{error:e.message}),this.showErrorState()}}bindEvents(){const e=document.getElementById("resource-search");if(e){let r;e.addEventListener("input",()=>{clearTimeout(r),r=setTimeout(()=>{this.handleSearch(e.value)},300)})}const t=document.getElementById("type-filter"),n=document.getElementById("category-filter"),s=document.getElementById("clear-filters");t&&t.addEventListener("change",()=>this.applyFilters()),n&&n.addEventListener("change",()=>this.applyFilters()),s&&s.addEventListener("click",()=>this.clearAllFilters()),document.querySelectorAll(".view-btn").forEach(r=>{r.addEventListener("click",u=>{const g=u.currentTarget.dataset.view;this.toggleView(g)})});const i=document.getElementById("load-more");i&&i.addEventListener("click",()=>this.loadMoreContent());const c=document.getElementById("newsletter-form");c&&c.addEventListener("submit",r=>this.handleNewsletterSignup(r)),this.bindModalEvents()}bindModalEvents(){document.querySelectorAll(".modal-close").forEach(n=>{n.addEventListener("click",s=>{const o=s.target.closest(".modal");o&&this.closeModal(o)})}),document.addEventListener("click",n=>{n.target.classList.contains("modal")&&this.closeModal(n.target)});const t=document.getElementById("lead-magnet-form");t&&t.addEventListener("submit",n=>this.handleLeadMagnetForm(n))}handleSearch(e){const t=e.toLowerCase().trim();t?this.filteredContent=this.allContent.filter(n=>n.title.toLowerCase().includes(t)||n.excerpt.toLowerCase().includes(t)||n.tags.some(s=>s.toLowerCase().includes(t))||n.category.toLowerCase().includes(t)):this.filteredContent=[...this.allContent],this.currentPage=1,this.renderAllContent()}applyFilters(){const e=document.getElementById("type-filter"),t=document.getElementById("category-filter"),n=(e==null?void 0:e.value)||"all",s=(t==null?void 0:t.value)||"all";this.filteredContent=this.allContent.filter(o=>{const i=n==="all"||o.content_type===n,c=s==="all"||o.category===s;return i&&c}),this.currentPage=1,this.renderAllContent()}clearAllFilters(){const e=document.getElementById("type-filter"),t=document.getElementById("category-filter"),n=document.getElementById("resource-search");e&&(e.value="all"),t&&(t.value="all"),n&&(n.value=""),this.filteredContent=[...this.allContent],this.currentPage=1,this.renderAllContent()}toggleView(e){this.currentView=e,document.querySelectorAll(".view-btn").forEach(n=>{n.classList.remove("active"),n.dataset.view===e&&n.classList.add("active")});const t=document.getElementById("resources-content");t&&(t.className=e==="list"?"resources-grid list-view":"resources-grid")}renderFeaturedContent(){const e=document.getElementById("featured-content");if(!e)return;const t=this.allContent.filter(n=>n.is_featured);if(a.log("Rendering featured content",{count:t.length}),t.length===0){e.innerHTML='<div class="empty-state"><p>No featured resources available.</p></div>';return}e.innerHTML=t.map(n=>this.createFeaturedCard(n)).join(""),e.querySelectorAll(".featured-card").forEach((n,s)=>{n.addEventListener("click",()=>{this.openContentModal(t[s])})})}renderAllContent(){const e=document.getElementById("resources-content");if(!e)return;const t=0,n=this.currentPage*this.itemsPerPage,s=this.filteredContent.slice(t,n);if(a.log("Rendering all content",{total:this.filteredContent.length,showing:s.length,page:this.currentPage}),s.length===0){e.innerHTML=`
        <div class="empty-state">
          <i data-lucide="search"></i>
          <h3>No resources found</h3>
          <p>Try adjusting your search or filter criteria.</p>
        </div>
      `;return}e.innerHTML=s.map(o=>this.createResourceCard(o)).join(""),e.querySelectorAll(".resource-card").forEach((o,i)=>{o.addEventListener("click",()=>{this.openContentModal(s[i])})}),this.updateLoadMoreButton(),typeof lucide<"u"&&lucide.createIcons()}createFeaturedCard(e){return`
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
            ${e.tags.map(t=>`<span class="tag">${t}</span>`).join("")}
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
    `}formatContentType(e){return{blog:"Blog Post",case_study:"Case Study",guide:"Guide",ebook:"eBook",webinar:"Webinar"}[e]||e}getActionText(e){return{blog:"Read Article",case_study:"View Case Study",guide:"Read Guide",ebook:"Download eBook",webinar:"Watch Webinar"}[e]||"View Content"}formatDate(e){return new Date(e).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"})}updateLoadMoreButton(){const e=document.getElementById("load-more");if(!e)return;const t=this.filteredContent.length>this.currentPage*this.itemsPerPage;e.style.display=t?"block":"none"}loadMoreContent(){this.currentPage++,this.renderAllContent()}openContentModal(e){if(a.log("Opening content modal",{title:e.title,type:e.content_type}),e.content_type==="ebook"||e.download_url){this.openLeadMagnetModal(e);return}if(e.external_url){window.open(e.external_url,"_blank");return}this.showContentModal(e)}showContentModal(e){const t=document.getElementById("content-modal"),n=document.getElementById("content-modal-title"),s=document.getElementById("content-modal-body");if(!t||!n||!s)return;n.textContent=e.title;const o=this.convertToHTML(e.content);s.innerHTML=`
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
          ${e.tags.map(i=>`<span class="tag">${i}</span>`).join("")}
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
    `,this.openModal(t)}openLeadMagnetModal(e){const t=document.getElementById("lead-magnet-modal"),n=document.getElementById("magnet-modal-title"),s=document.getElementById("magnet-modal-description"),o=document.getElementById("magnet-resource-id");!t||!n||!s||!o||(n.textContent=`Download: ${e.title}`,s.innerHTML=`
      <p>${e.excerpt}</p>
      ${e.content_type==="ebook"?"<p><strong>Format:</strong> PDF • <strong>Pages:</strong> 40+ • <strong>File Size:</strong> 2.5MB</p>":""}
    `,o.value=e.id,this.openModal(t))}openModal(e){e.classList.add("active"),document.body.style.overflow="hidden";const t=e.querySelector("input, select, textarea");t&&setTimeout(()=>t.focus(),100)}closeModal(e){e.classList.remove("active"),document.body.style.overflow="",e.querySelectorAll("form").forEach(o=>o.reset()),e.querySelectorAll('[id$="-success"]').forEach(o=>o.style.display="none"),e.querySelectorAll("form").forEach(o=>o.style.display="block")}handleLeadMagnetForm(e){e.preventDefault();const t=e.target,n=new FormData(t),s=Object.fromEntries(n.entries());if(s.website)return;a.log("📝 Lead magnet request submitted",{name:s.name,email:s.email,organization:s.organization,resource_id:s.resourceId}),t.style.display="none";const o=document.getElementById("magnet-success");o&&(o.style.display="block"),this.showToast("Resource request submitted successfully!","success")}handleNewsletterSignup(e){e.preventDefault();const t=e.target,s=new FormData(t).get("email");a.log("📧 Newsletter signup",{email:s}),this.showToast("Successfully subscribed to newsletter!","success"),t.reset()}convertToHTML(e){return e.replace(/^# (.*$)/gm,"<h1>$1</h1>").replace(/^## (.*$)/gm,"<h2>$1</h2>").replace(/^### (.*$)/gm,"<h3>$1</h3>").replace(/^\* (.*$)/gm,"<li>$1</li>").replace(/^(\d+)\. (.*$)/gm,"<li>$2</li>").replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\*(.*?)\*/g,"<em>$1</em>").replace(/\n\n/g,"</p><p>").replace(/^(.*)$/gm,"<p>$1</p>").replace(/<p><h/g,"<h").replace(/<\/h([1-6])><\/p>/g,"</h$1>").replace(/<p><li>/g,"<ul><li>").replace(/<\/li><\/p>/g,"</li></ul>")}shareContent(e,t){navigator.clipboard&&navigator.clipboard.writeText?navigator.clipboard.writeText(t).then(()=>{this.showToast(`Link copied to clipboard: ${e}`,"success")}).catch(()=>{this.fallbackCopyToClipboard(t,e)}):this.fallbackCopyToClipboard(t,e)}fallbackCopyToClipboard(e,t){const n=document.createElement("textarea");n.value=e,n.style.position="fixed",n.style.left="-999999px",n.style.top="-999999px",document.body.appendChild(n),n.focus(),n.select();try{document.execCommand("copy"),this.showToast(`Link copied to clipboard: ${t}`,"success")}catch{this.showToast("Unable to copy link. Please copy manually.","error")}document.body.removeChild(n)}showLoadingState(){["featured-content","resources-content"].forEach(t=>{const n=document.getElementById(t);n&&(n.innerHTML=`
          <div class="loading-placeholder">
            <div class="loading-spinner"></div>
            <p>Loading resources...</p>
          </div>
        `)})}showErrorState(){["featured-content","resources-content"].forEach(t=>{const n=document.getElementById(t);n&&(n.innerHTML=`
          <div class="empty-state">
            <i data-lucide="alert-circle"></i>
            <h3>Unable to load resources</h3>
            <p>Please try refreshing the page or contact support.</p>
            <button class="btn btn-primary" onclick="window.location.reload()">Refresh Page</button>
          </div>
        `)})}showToast(e,t="info"){const n=document.createElement("div");n.className=`toast toast-${t}`,n.textContent=e,n.style.cssText=`
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: var(--shadow-lg);
      z-index: 1001;
      animation: slideInRight 0.3s ease-out;
      max-width: 400px;
    `;const s={success:"var(--success)",error:"var(--error)",info:"var(--sky-gradient-start)"};n.style.background=s[t],n.style.color="white",document.body.appendChild(n),setTimeout(()=>{n.style.animation="slideOutRight 0.3s ease-out",setTimeout(()=>n.remove(),300)},4e3)}}document.addEventListener("DOMContentLoaded",()=>{window.resourcesManager=new h});
