import"./supabase-C7PnJWqa.js";/* empty css             */import{C as d}from"./contentService-DfeF0OW3.js";class u{constructor(){this.allContent=[],this.filteredContent=[],this.currentView="grid",this.currentPage=1,this.itemsPerPage=12,this.isLoading=!1,this.init()}async init(){try{this.showLoadingState();try{console.log("Attempting to load content from database..."),this.allContent=await d.getAllContent(),console.log("Successfully loaded content from database:",this.allContent.length,"items"),this.filteredContent=[...this.allContent]}catch(e){console.warn("Database loading failed, using fallback content:",e),this.allContent=this.getFallbackContent(),this.filteredContent=[...this.allContent]}this.bindEvents(),this.renderFeaturedContent(),this.renderAllContent(),console.log("Resources page initialized with",this.allContent.length,"items")}catch(e){console.error("Error initializing resources page:",e),this.allContent=this.getFallbackContent(),this.filteredContent=[...this.allContent],this.renderFeaturedContent(),this.renderAllContent()}}getFallbackContent(){return[{id:"ai-guide-fallback",title:"The Complete Guide to AI in Admissions",slug:"ai-admissions-guide",excerpt:"Comprehensive 40-page guide covering implementation strategies, best practices, and ROI measurement for AI-powered admissions automation.",content:`# The Complete Guide to AI in Admissions

This comprehensive guide covers everything you need to know about implementing AI in your admissions process...`,content_type:"guide",featured_image_url:"https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800",author_name:"Agent Cory Team",author_title:"AI Admissions Experts",reading_time_minutes:25,tags:["AI","Implementation","Best Practices"],category:"ai",is_featured:!0,is_published:!0,published_at:new Date().toISOString(),seo_title:"Complete Guide to AI in Admissions - Agent Cory",seo_description:"Learn how to implement AI in your admissions process with this comprehensive guide.",download_url:"/downloads/ai-admissions-guide.pdf",metrics:{downloads:1250,rating:4.8},view_count:3420},{id:"conversion-webinar-fallback",title:"5 Strategies to Double Your Lead Conversion Rate",slug:"double-conversion-strategies",excerpt:"Join our upcoming webinar to learn proven tactics that top-performing institutions use to convert more inquiries into enrolled students.",content:`# 5 Strategies to Double Your Lead Conversion Rate

## Strategy 1: Speed of Response

The faster you respond...`,content_type:"webinar",featured_image_url:"https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800",author_name:"Agent Cory Team",author_title:"AI Admissions Experts",reading_time_minutes:45,tags:["Webinar","Conversion","Strategy"],category:"conversion",is_featured:!0,is_published:!0,published_at:new Date(Date.now()-2*24*60*60*1e3).toISOString(),external_url:"https://zoom.us/webinar/register/example",metrics:{registrations:450,attendees:320},view_count:1890},{id:"metro-case-study-fallback",title:"Case Study: 847% ROI in 12 Months",slug:"metro-state-case-study",excerpt:"How Metro State University transformed their admissions process and achieved record-breaking results.",content:`# Metro State University Case Study

## The Challenge

Metro State University was struggling with...`,content_type:"case_study",featured_image_url:"https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800",author_name:"Dr. Sarah Johnson",author_title:"Director of Admissions, Metro State University",reading_time_minutes:12,tags:["Case Study","ROI","University"],category:"admissions",is_featured:!1,is_published:!0,published_at:new Date(Date.now()-7*24*60*60*1e3).toISOString(),metrics:{roi_percentage:847,additional_revenue:21e5,time_saved_hours:2100},view_count:2890},{id:"benchmarks-report-fallback",title:"2024 Admissions Benchmarks Report",slug:"admissions-benchmarks-2024",excerpt:"Comprehensive industry data including response times, conversion rates, and ROI metrics from 500+ institutions.",content:`# 2024 Admissions Benchmarks Report

## Executive Summary

This comprehensive report...`,content_type:"ebook",featured_image_url:"https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800",author_name:"Agent Cory Research Team",author_title:"Industry Analysts",reading_time_minutes:30,tags:["Benchmarks","Industry Data","Research"],category:"roi",is_featured:!0,is_published:!0,published_at:new Date(Date.now()-1*24*60*60*1e3).toISOString(),download_url:"/downloads/benchmarks-2024.pdf",metrics:{downloads:1850,institutions_surveyed:500},view_count:2650},{id:"response-time-blog-fallback",title:"The Psychology of Fast Response Times in Admissions",slug:"psychology-fast-response-times",excerpt:"Research-backed insights into why speed matters so much in admissions and how to leverage it for better conversion rates.",content:`# The Psychology of Fast Response Times

## Why Speed Matters

In the world of admissions...`,content_type:"blog",featured_image_url:"https://images.pexels.com/photos/3184394/pexels-photo-3184394.jpeg?auto=compress&cs=tinysrgb&w=800",author_name:"Agent Cory Team",author_title:"AI Admissions Experts",reading_time_minutes:8,tags:["Psychology","Response Time","Conversion"],category:"admissions",is_featured:!1,is_published:!0,published_at:new Date(Date.now()-14*24*60*60*1e3).toISOString(),metrics:{shares:245,comments:18},view_count:1560},{id:"crm-integration-guide-fallback",title:"CRM Integration Best Practices",slug:"crm-integration-best-practices",excerpt:"Step-by-step guide for seamless CRM integration, data mapping, and workflow automation setup.",content:`# CRM Integration Best Practices

## Getting Started

Integrating your CRM...`,content_type:"guide",featured_image_url:"https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=800",author_name:"Agent Cory Team",author_title:"Integration Specialists",reading_time_minutes:20,tags:["CRM","Integration","Automation"],category:"crm",is_featured:!1,is_published:!0,published_at:new Date(Date.now()-10*24*60*60*1e3).toISOString(),metrics:{downloads:890,implementations:120},view_count:1340},{id:"ai-implementation-blog-fallback",title:"AI vs Human: Finding the Right Balance",slug:"ai-human-balance-admissions",excerpt:"When to use AI and when human touch matters most in the admissions journey.",content:`# AI vs Human: Finding the Right Balance

## The Human Element

While AI can automate...`,content_type:"blog",featured_image_url:"https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800",author_name:"Agent Cory Team",author_title:"AI Strategy Experts",reading_time_minutes:12,tags:["AI Strategy","Human Touch","Balance"],category:"roi",is_featured:!0,is_published:!0,published_at:new Date(Date.now()-21*24*60*60*1e3).toISOString(),metrics:{shares:180,comments:25},view_count:980}]}bindEvents(){const e=document.getElementById("resource-search");if(e){let i;e.addEventListener("input",()=>{clearTimeout(i),i=setTimeout(()=>{this.handleSearch(e.value)},300)})}const n=document.getElementById("type-filter"),t=document.getElementById("category-filter"),s=document.getElementById("clear-filters");n&&n.addEventListener("change",()=>this.applyFilters()),t&&t.addEventListener("change",()=>this.applyFilters()),s&&s.addEventListener("click",()=>this.clearAllFilters()),document.querySelectorAll(".view-btn").forEach(i=>{i.addEventListener("click",c=>{const l=c.currentTarget.dataset.view;this.toggleView(l)})});const a=document.getElementById("load-more");a&&a.addEventListener("click",()=>this.loadMoreContent());const r=document.getElementById("newsletter-form");r&&r.addEventListener("submit",i=>this.handleNewsletterSignup(i)),this.bindModalEvents()}bindModalEvents(){document.querySelectorAll(".modal-close").forEach(t=>{t.addEventListener("click",s=>{const o=s.target.closest(".modal");o&&this.closeModal(o)})}),document.addEventListener("click",t=>{t.target.classList.contains("modal")&&this.closeModal(t.target)});const n=document.getElementById("lead-magnet-form");n&&n.addEventListener("submit",t=>this.handleLeadMagnetForm(t))}handleSearch(e){const n=e.toLowerCase().trim();n?this.filteredContent=this.allContent.filter(t=>t.title.toLowerCase().includes(n)||t.excerpt.toLowerCase().includes(n)||t.tags.some(s=>s.toLowerCase().includes(n))||t.category.toLowerCase().includes(n)):this.filteredContent=[...this.allContent],this.currentPage=1,this.renderAllContent()}applyFilters(){const e=document.getElementById("type-filter"),n=document.getElementById("category-filter"),t=(e==null?void 0:e.value)||"all",s=(n==null?void 0:n.value)||"all";this.filteredContent=this.allContent.filter(o=>{const a=t==="all"||o.content_type===t,r=s==="all"||o.category===s;return a&&r}),this.currentPage=1,this.renderAllContent(),this.updateActiveFilters(t,s)}updateActiveFilters(e,n){const t=[];e!=="all"&&t.push({type:"type",value:e}),n!=="all"&&t.push({type:"category",value:n}),console.log("Active filters:",t)}clearAllFilters(){const e=document.getElementById("type-filter"),n=document.getElementById("category-filter"),t=document.getElementById("resource-search");e&&(e.value="all"),n&&(n.value="all"),t&&(t.value=""),this.filteredContent=[...this.allContent],this.currentPage=1,this.renderAllContent()}toggleView(e){this.currentView=e,document.querySelectorAll(".view-btn").forEach(t=>{t.classList.remove("active"),t.dataset.view===e&&t.classList.add("active")});const n=document.getElementById("resources-content");n&&(n.className=e==="list"?"resources-grid list-view":"resources-grid")}renderFeaturedContent(){const e=document.getElementById("featured-content");if(!e)return;const n=this.allContent.filter(t=>t.is_featured);if(n.length===0){e.innerHTML='<div class="empty-state"><p>No featured resources available.</p></div>';return}e.innerHTML=n.map(t=>this.createFeaturedCard(t)).join(""),e.querySelectorAll(".featured-card").forEach((t,s)=>{t.addEventListener("click",()=>{this.openContentModal(n[s])})})}renderAllContent(){const e=document.getElementById("resources-content");if(!e)return;const n=0,t=this.currentPage*this.itemsPerPage,s=this.filteredContent.slice(n,t);if(s.length===0){e.innerHTML=`
        <div class="empty-state">
          <i data-lucide="search"></i>
          <h3>No resources found</h3>
          <p>Try adjusting your search or filter criteria.</p>
        </div>
      `;return}e.innerHTML=s.map(o=>this.createResourceCard(o)).join(""),e.querySelectorAll(".resource-card").forEach((o,a)=>{o.addEventListener("click",()=>{this.openContentModal(s[a])})}),this.updateLoadMoreButton(),typeof lucide<"u"&&lucide.createIcons()}createFeaturedCard(e){return`
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
            ${e.tags.map(n=>`<span class="tag">${n}</span>`).join("")}
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
    `}formatContentType(e){return{blog:"Blog Post",case_study:"Case Study",guide:"Guide",ebook:"eBook",webinar:"Webinar"}[e]||e}getActionText(e){return{blog:"Read Article",case_study:"View Case Study",guide:"Read Guide",ebook:"Download eBook",webinar:"Watch Webinar"}[e]||"View Content"}formatDate(e){return new Date(e).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"})}updateLoadMoreButton(){const e=document.getElementById("load-more");if(!e)return;const n=this.filteredContent.length>this.currentPage*this.itemsPerPage;e.style.display=n?"block":"none"}loadMoreContent(){this.currentPage++,this.renderAllContent()}openContentModal(e){if(e.content_type==="ebook"||e.download_url){this.openLeadMagnetModal(e);return}if(e.external_url){window.open(e.external_url,"_blank");return}e.content&&e.content.length>500?this.showContentModal(e):window.location.href=`/content/${e.slug}`,console.log("Viewed content:",e.title)}showContentModal(e){const n=document.getElementById("content-modal"),t=document.getElementById("content-modal-title"),s=document.getElementById("content-modal-body");if(!n||!t||!s)return;t.textContent=e.title;const o=this.convertToHTML(e.content);s.innerHTML=`
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
          <button class="btn btn-primary" onclick="navigator.share ? navigator.share({title: '${e.title}', url: window.location.href}) : null">
          <button class="btn btn-primary" onclick="this.shareContent('${e.title}', window.location.href)">
            <i data-lucide="share-2"></i>
            Share
          </button>
        </div>
      </div>
    `,this.openModal(n)}openLeadMagnetModal(e){const n=document.getElementById("lead-magnet-modal"),t=document.getElementById("magnet-modal-title"),s=document.getElementById("magnet-modal-description"),o=document.getElementById("magnet-resource-id");!n||!t||!s||!o||(t.textContent=`Download: ${e.title}`,s.innerHTML=`
      <p>${e.excerpt}</p>
      ${e.content_type==="ebook"?"<p><strong>Format:</strong> PDF • <strong>Pages:</strong> 40+ • <strong>File Size:</strong> 2.5MB</p>":""}
    `,o.value=e.id,this.openModal(n))}openModal(e){e.classList.add("active"),document.body.style.overflow="hidden";const n=e.querySelector("input, select, textarea");n&&setTimeout(()=>n.focus(),100)}closeModal(e){e.classList.remove("active"),document.body.style.overflow="",e.querySelectorAll("form").forEach(o=>o.reset()),e.querySelectorAll('[id$="-success"]').forEach(o=>o.style.display="none"),e.querySelectorAll("form").forEach(o=>o.style.display="block")}handleLeadMagnetForm(e){e.preventDefault();const n=e.target,t=new FormData(n),s=Object.fromEntries(t.entries());if(s.website)return;console.log("Lead magnet request:",{name:s.name,email:s.email,organization:s.organization,role:s.role,resource_id:s.resourceId,follow_up_requested:s.followUp==="on"}),n.style.display="none";const o=document.getElementById("magnet-success");o&&(o.style.display="block"),this.showToast("Resource request submitted successfully!","success")}handleNewsletterSignup(e){e.preventDefault();const n=e.target,s=new FormData(n).get("email");console.log("Newsletter signup:",s),this.showToast("Successfully subscribed to newsletter!","success"),n.reset()}convertToHTML(e){return e.replace(/^# (.*$)/gm,"<h1>$1</h1>").replace(/^## (.*$)/gm,"<h2>$1</h2>").replace(/^### (.*$)/gm,"<h3>$1</h3>").replace(/^\* (.*$)/gm,"<li>$1</li>").replace(/^(\d+)\. (.*$)/gm,"<li>$2</li>").replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\*(.*?)\*/g,"<em>$1</em>").replace(/\n\n/g,"</p><p>").replace(/^(.*)$/gm,"<p>$1</p>").replace(/<p><h/g,"<h").replace(/<\/h([1-6])><\/p>/g,"</h$1>").replace(/<p><li>/g,"<ul><li>").replace(/<\/li><\/p>/g,"</li></ul>")}shareContent(e,n){navigator.share&&window.isSecureContext?navigator.share({title:e,url:n}).catch(t=>{console.log("Share failed, falling back to clipboard:",t),this.copyToClipboard(n,e)}):(console.log("Web Share API not available or not in secure context, using clipboard fallback"),this.copyToClipboard(n,e))}copyToClipboard(e,n){navigator.clipboard&&navigator.clipboard.writeText?navigator.clipboard.writeText(e).then(()=>{this.showToast(`Link copied to clipboard: ${n}`,"success")}).catch(()=>{this.fallbackCopyToClipboard(e,n)}):this.fallbackCopyToClipboard(e,n)}fallbackCopyToClipboard(e,n){const t=document.createElement("textarea");t.value=e,t.style.position="fixed",t.style.left="-999999px",t.style.top="-999999px",document.body.appendChild(t),t.focus(),t.select();try{document.execCommand("copy"),this.showToast(`Link copied to clipboard: ${n}`,"success")}catch{this.showToast("Unable to copy link. Please copy manually.","error")}document.body.removeChild(t)}showLoadingState(){["featured-content","resources-content"].forEach(n=>{const t=document.getElementById(n);t&&(t.innerHTML=`
          <div class="loading-placeholder">
            <div class="loading-spinner"></div>
            <p>Loading resources...</p>
          </div>
        `)})}showErrorState(){["featured-content","resources-content"].forEach(n=>{const t=document.getElementById(n);t&&(t.innerHTML=`
          <div class="empty-state">
            <i data-lucide="alert-circle"></i>
            <h3>Unable to load resources</h3>
            <p>Please try refreshing the page.</p>
            <button class="btn btn-primary" onclick="window.location.reload()">Refresh Page</button>
          </div>
        `)})}showToast(e,n="info"){const t=document.createElement("div");t.className=`toast toast-${n}`,t.textContent=e,t.style.cssText=`
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: var(--shadow-lg);
      z-index: 1001;
      animation: slideInRight 0.3s ease-out;
      max-width: 400px;
    `;const s={success:"var(--success)",error:"var(--error)",info:"var(--sky-gradient-start)"};t.style.background=s[n],t.style.color="white",document.body.appendChild(t),setTimeout(()=>{t.style.animation="slideOutRight 0.3s ease-out",setTimeout(()=>t.remove(),300)},4e3)}}document.addEventListener("DOMContentLoaded",()=>{window.resourcesManager=new u});
