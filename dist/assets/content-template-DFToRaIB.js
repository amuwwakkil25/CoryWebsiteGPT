import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css             */import{s as r}from"./supabase-CSR-07Nq.js";class c{static async getAllContent(){console.log("Fetching content from database...",{supabaseUrl:"configured",supabaseKey:"configured"});const{data:t,error:e}=await r.from("content_items").select("*").eq("is_published",!0).order("published_at",{ascending:!1});if(e)throw console.error("Supabase error fetching content:",{message:e.message,details:e.details,hint:e.hint,code:e.code}),e;if(console.log("Fetched content items:",(t==null?void 0:t.length)||0,"items"),!t||t.length===0)throw console.warn("No content items found in database"),new Error("No content found in database");return t}static async getFeaturedContent(){const{data:t,error:e}=await r.from("content_items").select("*").eq("is_published",!0).eq("is_featured",!0).order("published_at",{ascending:!1});if(e)throw console.error("Error fetching featured content:",e),e;return t}static async getContentByType(t){const{data:e,error:n}=await r.from("content_items").select("*").eq("is_published",!0).eq("content_type",t).order("published_at",{ascending:!1});if(n)throw console.error("Error fetching content by type:",n),n;return e}static async getContentByCategory(t){const{data:e,error:n}=await r.from("content_items").select("*").eq("is_published",!0).eq("category",t).order("published_at",{ascending:!1});if(n)throw console.error("Error fetching content by category:",n),n;return e}static async getContentBySlug(t){const{data:e,error:n}=await r.from("content_items").select("*").eq("slug",t).eq("is_published",!0).single();if(n)throw console.error("Error fetching content by slug:",n),n;return e}static async searchContent(t){const{data:e,error:n}=await r.from("content_items").select("*").eq("is_published",!0).or(`title.ilike.%${t}%,excerpt.ilike.%${t}%,content.ilike.%${t}%`).order("published_at",{ascending:!1});if(n)throw console.error("Error searching content:",n),n;return e}static async getRelatedContent(t,e=3){const{data:n,error:o}=await r.from("content_items").select("*").eq("is_published",!0).neq("id",t.id).or(`category.eq.${t.category},content_type.eq.${t.content_type}`).order("published_at",{ascending:!1}).limit(e);if(o)throw console.error("Error fetching related content:",o),o;return n}static async incrementViewCount(t){try{const{error:e}=await r.from("content_items").update({view_count:r.sql`view_count + 1`,updated_at:new Date().toISOString()}).eq("id",t);e&&console.error("Error incrementing view count:",e)}catch(e){console.error("Error incrementing view count:",e)}}static async submitLeadMagnetRequest(t){const{error:e}=await r.from("website_demo_requests").insert({request_type:"lead_magnet",name:t.name,email:t.email,organization:t.organization,role:t.role,resource_id:t.resource_id,follow_up_requested:t.follow_up_requested,metadata:{source:"resources_page",timestamp:new Date().toISOString()}});if(e)throw console.error("Error submitting lead magnet request:",e),e}static async createContent(t){const{data:e,error:n}=await r.from("content_items").insert({...t,view_count:0}).select().single();if(n)throw console.error("Error creating content:",n),n;return e}static async updateContent(t,e){const{data:n,error:o}=await r.from("content_items").update({...e,updated_at:new Date().toISOString()}).eq("id",t).select().single();if(o)throw console.error("Error updating content:",o),o;return n}static async deleteContent(t){const{error:e}=await r.from("content_items").delete().eq("id",t);if(e)throw console.error("Error deleting content:",e),e}static generateSlug(t){return t.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}static estimateReadingTime(t){const n=t.split(/\s+/).length;return Math.ceil(n/200)}static extractExcerpt(t,e=160){const n=t.replace(/#{1,6}\s/g,"").replace(/\*\*(.*?)\*\*/g,"$1").replace(/\*(.*?)\*/g,"$1").replace(/\[(.*?)\]\(.*?\)/g,"$1");return n.length<=e?n:n.substring(0,e).replace(/\s+\S*$/,"")+"..."}}class h{constructor(){this.content=null,this.relatedContent=[],this.init()}async init(){try{const t=this.getSlugFromURL();if(!t){this.showErrorState();return}await this.loadContent(t),this.content?(await this.loadRelatedContent(),this.renderContent(),this.updateSEO(),await this.trackView()):this.showErrorState()}catch(t){console.error("Error initializing content page:",t),this.showErrorState()}}getSlugFromURL(){var e;const t=window.location.pathname.split("/");return((e=t[t.length-1])==null?void 0:e.replace(".html",""))||null}async loadContent(t){try{this.content=await c.getContentBySlug(t)}catch(e){console.error("Error loading content:",e),this.content=null}}async loadRelatedContent(){if(this.content)try{this.relatedContent=await c.getRelatedContent(this.content,4)}catch(t){console.error("Error loading related content:",t),this.relatedContent=[]}}renderContent(){if(!this.content)return;const t=document.getElementById("content-container"),e=document.getElementById("loading-state");!t||!e||(e.style.display="none",t.innerHTML=this.createContentHTML(),t.style.display="block",this.bindContentEvents(),typeof lucide<"u"&&lucide.createIcons())}createContentHTML(){if(!this.content)return"";const t=this.content.content_type==="ebook"||this.content.download_url,e=this.content.content_type==="webinar"&&this.content.external_url;return`
      <!-- Content Hero -->
      <section class="content-hero">
        <div class="container">
          <div class="content-breadcrumb">
            <a href="/resources.html">Resources</a> / 
            <a href="/resources.html?type=${this.content.content_type}">${this.formatContentType(this.content.content_type)}</a> / 
            <span>${this.content.title}</span>
          </div>
          
          <div class="content-badge ${this.content.content_type}">${this.formatContentType(this.content.content_type)}</div>
          <h1>${this.content.title}</h1>
          <p class="lead">${this.content.excerpt}</p>
          
          <div class="content-meta-hero">
            <div class="meta-item-hero">
              <i data-lucide="user"></i>
              <span>${this.content.author_name}</span>
            </div>
            <div class="meta-item-hero">
              <i data-lucide="calendar"></i>
              <span>${this.formatDate(this.content.published_at)}</span>
            </div>
            ${this.content.reading_time_minutes?`
              <div class="meta-item-hero">
                <i data-lucide="clock"></i>
                <span>${this.content.reading_time_minutes} min read</span>
              </div>
            `:""}
            <div class="meta-item-hero">
              <i data-lucide="eye"></i>
              <span>${this.content.view_count} views</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Content Main -->
      <section class="content-main">
        <div class="container">
          <div class="content-layout">
            <article class="content-article">
              ${this.content.featured_image_url?`
                <img src="${this.content.featured_image_url}" alt="${this.content.title}" class="article-featured-image" />
              `:""}
              
              ${t?this.createDownloadSection():""}
              ${e?this.createExternalSection():""}
              
              <div class="article-content">
                ${this.convertMarkdownToHTML(this.content.content)}
              </div>
              
              ${this.content.content_type==="case_study"?this.createMetricsSection():""}
              
              <div class="article-footer">
                <div class="article-tags">
                  ${this.content.tags.map(n=>`<span class="tag">${n}</span>`).join("")}
                </div>
                
                <div class="article-actions">
                  <button class="btn btn-secondary" onclick="window.print()">
                    <i data-lucide="printer"></i>
                    Print Article
                  </button>
                  <button class="btn btn-secondary" onclick="this.shareContent()">
                    <i data-lucide="share-2"></i>
                    Share
                  </button>
                  <a href="/demo-and-pricing.html" class="btn btn-primary">
                    <i data-lucide="arrow-right"></i>
                    Get Started with Cory
                  </a>
                </div>
              </div>
            </article>
            
            <aside class="content-sidebar">
              ${this.createAuthorCard()}
              ${this.createTableOfContents()}
              ${this.createRelatedContent()}
              ${this.createCTACard()}
            </aside>
          </div>
        </div>
      </section>
    `}createDownloadSection(){return`
      <div class="download-section">
        <div class="download-card">
          <div class="download-icon">
            <i data-lucide="download"></i>
          </div>
          <div class="download-content">
            <h3>Download This ${this.formatContentType(this.content.content_type)}</h3>
            <p>Get the complete ${this.content.content_type} as a PDF for offline reading and sharing.</p>
            <button class="btn btn-primary btn-lg" id="download-content-btn">
              <i data-lucide="download"></i>
              Download Now
            </button>
          </div>
        </div>
      </div>
    `}createExternalSection(){return`
      <div class="external-section">
        <div class="external-card">
          <div class="external-icon">
            <i data-lucide="external-link"></i>
          </div>
          <div class="external-content">
            <h3>Watch This ${this.formatContentType(this.content.content_type)}</h3>
            <p>Join us for this live presentation and Q&A session.</p>
            <a href="${this.content.external_url}" target="_blank" class="btn btn-primary btn-lg">
              <i data-lucide="play"></i>
              Watch Now
            </a>
          </div>
        </div>
      </div>
    `}createMetricsSection(){var e;return!((e=this.content)!=null&&e.metrics)||Object.keys(this.content.metrics).length===0?"":`
      <div class="case-study-metrics">
        <h3>Key Results</h3>
        <div class="metrics-grid">
          ${Object.entries(this.content.metrics).map(([n,o])=>`
      <div class="metric-item">
        <div class="metric-value">${o}</div>
        <div class="metric-label">${this.formatMetricLabel(n)}</div>
      </div>
    `).join("")}
        </div>
      </div>
    `}createAuthorCard(){return`
      <div class="sidebar-card author-card">
        <h4>About the Author</h4>
        <div class="author-info">
          <div class="author-avatar">
            <i data-lucide="user"></i>
          </div>
          <div class="author-details">
            <h5>${this.content.author_name}</h5>
            <p>${this.content.author_title}</p>
          </div>
        </div>
      </div>
    `}createTableOfContents(){var n;if(!((n=this.content)!=null&&n.content))return"";const t=this.content.content.match(/^#{2,4}\s(.+)$/gm)||[];return t.length===0?"":`
      <div class="sidebar-card toc-card">
        <h4>Table of Contents</h4>
        <ul class="table-of-contents">
          ${t.map(o=>{var l;const a=((l=o.match(/^#{2,4}/))==null?void 0:l[0].length)||2,i=o.replace(/^#{2,4}\s/,""),s=i.toLowerCase().replace(/[^a-z0-9]+/g,"-");return`<li class="toc-item level-${a}"><a href="#${s}">${i}</a></li>`}).join("")}
        </ul>
      </div>
    `}createRelatedContent(){return this.relatedContent.length===0?"":`
      <div class="sidebar-card related-card">
        <h4>Related Content</h4>
        <div class="related-content-list">
          ${this.relatedContent.map(e=>`
      <div class="related-content-item" data-slug="${e.slug}">
        <div class="related-image">
          <img src="${e.featured_image_url||"https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=200"}" alt="${e.title}" />
        </div>
        <div class="related-content-info">
          <h5>${e.title}</h5>
          <p>${this.formatContentType(e.content_type)} • ${e.reading_time_minutes||5} min read</p>
        </div>
      </div>
    `).join("")}
        </div>
      </div>
    `}createCTACard(){return`
      <div class="sidebar-card cta-card">
        <div class="cta-content">
          <div class="cta-icon">
            <i data-lucide="zap"></i>
          </div>
          <h4>Ready to Get Started?</h4>
          <p>See how Agent Cory can transform your admissions process in just 30 minutes.</p>
          <a href="/demo-and-pricing.html" class="btn btn-primary btn-full">
            <i data-lucide="calendar"></i>
            Book Demo
          </a>
        </div>
      </div>
    `}bindContentEvents(){const t=document.getElementById("download-content-btn");t&&t.addEventListener("click",()=>this.handleDownload()),document.querySelectorAll(".related-content-item").forEach(e=>{e.addEventListener("click",()=>{const n=e.getAttribute("data-slug");n&&(window.location.href=`/content/${n}`)})}),document.querySelectorAll(".table-of-contents a").forEach(e=>{e.addEventListener("click",n=>{var i;n.preventDefault();const o=(i=e.getAttribute("href"))==null?void 0:i.substring(1),a=document.getElementById(o||"");a&&a.scrollIntoView({behavior:"smooth"})})})}async handleDownload(){if(this.content){if(this.content.download_url){window.open(this.content.download_url,"_blank");return}console.log("Opening lead magnet form for:",this.content.title)}}updateSEO(){if(!this.content)return;document.title=this.content.seo_title||`${this.content.title} - Agent Cory`;const t=document.getElementById("page-description");t&&t.setAttribute("content",this.content.seo_description||this.content.excerpt);const e=document.getElementById("og-title"),n=document.getElementById("og-description"),o=document.getElementById("og-image"),a=document.getElementById("og-url");e&&e.setAttribute("content",this.content.title),n&&n.setAttribute("content",this.content.excerpt),o&&this.content.featured_image_url&&o.setAttribute("content",this.content.featured_image_url),a&&a.setAttribute("content",window.location.href)}async trackView(){if(this.content)try{await c.incrementViewCount(this.content.id)}catch(t){console.error("Error tracking view:",t)}}convertMarkdownToHTML(t){let e=t.replace(/^# (.*$)/gm,'<h1 id="$1">$1</h1>').replace(/^## (.*$)/gm,'<h2 id="$1">$1</h2>').replace(/^### (.*$)/gm,'<h3 id="$1">$1</h3>').replace(/^#### (.*$)/gm,'<h4 id="$1">$1</h4>').replace(/^\* (.*$)/gm,"<li>$1</li>").replace(/^(\d+)\. (.*$)/gm,"<li>$2</li>").replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\*(.*?)\*/g,"<em>$1</em>").replace(/`(.*?)`/g,"<code>$1</code>").replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2" target="_blank">$1</a>').replace(/\n\n/g,"</p><p>").replace(/^(.*)$/gm,"<p>$1</p>").replace(/<p><h/g,"<h").replace(/<\/h([1-6])><\/p>/g,"</h$1>").replace(/<p><li>/g,"<ul><li>").replace(/<\/li><\/p>/g,"</li></ul>").replace(/<\/ul>\s*<ul>/g,"");return e=e.replace(/<h([2-4]) id="([^"]+)">([^<]+)<\/h[2-4]>/g,(n,o,a,i)=>{const s=i.toLowerCase().replace(/[^a-z0-9]+/g,"-");return`<h${o} id="${s}">${i}</h${o}>`}),e}formatContentType(t){return{blog:"Blog Post",case_study:"Case Study",guide:"Guide",ebook:"eBook",webinar:"Webinar"}[t]||t}formatDate(t){return new Date(t).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})}formatMetricLabel(t){return t.replace(/_/g," ").replace(/\b\w/g,e=>e.toUpperCase())}showErrorState(){const t=document.getElementById("loading-state"),e=document.getElementById("error-state");t&&(t.style.display="none"),e&&(e.style.display="block")}shareContent(){this.content&&(navigator.share?navigator.share({title:this.content.title,text:this.content.excerpt,url:window.location.href}):navigator.clipboard.writeText(window.location.href).then(()=>{this.showToast("Link copied to clipboard!","success")}))}showToast(t,e="info"){const n=document.createElement("div");n.className=`toast toast-${e}`,n.textContent=t,n.style.cssText=`
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: var(--shadow-lg);
      z-index: 1001;
      animation: slideInRight 0.3s ease-out;
    `;const o={success:"var(--success)",error:"var(--error)",info:"var(--sky-gradient-start)"};n.style.background=o[e],n.style.color="white",document.body.appendChild(n),setTimeout(()=>{n.style.animation="slideOutRight 0.3s ease-out",setTimeout(()=>n.remove(),300)},4e3)}}document.addEventListener("DOMContentLoaded",()=>{new h});window.shareContent=function(){window.contentPageManager&&window.contentPageManager.shareContent()};
