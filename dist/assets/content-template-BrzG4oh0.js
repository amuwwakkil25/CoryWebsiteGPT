import"./supabase-C7PnJWqa.js";/* empty css             */import{C as r}from"./contentService-DfeF0OW3.js";class l{constructor(){this.content=null,this.relatedContent=[],this.init()}async init(){try{const t=this.getSlugFromURL();if(!t){this.showErrorState();return}await this.loadContent(t),this.content?(await this.loadRelatedContent(),this.renderContent(),this.updateSEO(),await this.trackView()):this.showErrorState()}catch(t){console.error("Error initializing content page:",t),this.showErrorState()}}getSlugFromURL(){var e;const t=window.location.pathname.split("/");return((e=t[t.length-1])==null?void 0:e.replace(".html",""))||null}async loadContent(t){try{this.content=await r.getContentBySlug(t)}catch(e){console.error("Error loading content:",e),this.content=null}}async loadRelatedContent(){if(this.content)try{this.relatedContent=await r.getRelatedContent(this.content,4)}catch(t){console.error("Error loading related content:",t),this.relatedContent=[]}}renderContent(){if(!this.content)return;const t=document.getElementById("content-container"),e=document.getElementById("loading-state");!t||!e||(e.style.display="none",t.innerHTML=this.createContentHTML(),t.style.display="block",this.bindContentEvents(),typeof lucide<"u"&&lucide.createIcons())}createContentHTML(){if(!this.content)return"";const t=this.content.content_type==="ebook"||this.content.download_url,e=this.content.content_type==="webinar"&&this.content.external_url;return`
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
          ${Object.entries(this.content.metrics).map(([n,i])=>`
      <div class="metric-item">
        <div class="metric-value">${i}</div>
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
          ${t.map(i=>{var c;const a=((c=i.match(/^#{2,4}/))==null?void 0:c[0].length)||2,o=i.replace(/^#{2,4}\s/,""),s=o.toLowerCase().replace(/[^a-z0-9]+/g,"-");return`<li class="toc-item level-${a}"><a href="#${s}">${o}</a></li>`}).join("")}
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
    `}bindContentEvents(){const t=document.getElementById("download-content-btn");t&&t.addEventListener("click",()=>this.handleDownload()),document.querySelectorAll(".related-content-item").forEach(e=>{e.addEventListener("click",()=>{const n=e.getAttribute("data-slug");n&&(window.location.href=`/content/${n}`)})}),document.querySelectorAll(".table-of-contents a").forEach(e=>{e.addEventListener("click",n=>{var o;n.preventDefault();const i=(o=e.getAttribute("href"))==null?void 0:o.substring(1),a=document.getElementById(i||"");a&&a.scrollIntoView({behavior:"smooth"})})})}async handleDownload(){if(this.content){if(this.content.download_url){window.open(this.content.download_url,"_blank");return}console.log("Opening lead magnet form for:",this.content.title)}}updateSEO(){if(!this.content)return;document.title=this.content.seo_title||`${this.content.title} - Agent Cory`;const t=document.getElementById("page-description");t&&t.setAttribute("content",this.content.seo_description||this.content.excerpt);const e=document.getElementById("og-title"),n=document.getElementById("og-description"),i=document.getElementById("og-image"),a=document.getElementById("og-url");e&&e.setAttribute("content",this.content.title),n&&n.setAttribute("content",this.content.excerpt),i&&this.content.featured_image_url&&i.setAttribute("content",this.content.featured_image_url),a&&a.setAttribute("content",window.location.href)}async trackView(){if(this.content)try{await r.incrementViewCount(this.content.id)}catch(t){console.error("Error tracking view:",t)}}convertMarkdownToHTML(t){let e=t.replace(/^# (.*$)/gm,'<h1 id="$1">$1</h1>').replace(/^## (.*$)/gm,'<h2 id="$1">$1</h2>').replace(/^### (.*$)/gm,'<h3 id="$1">$1</h3>').replace(/^#### (.*$)/gm,'<h4 id="$1">$1</h4>').replace(/^\* (.*$)/gm,"<li>$1</li>").replace(/^(\d+)\. (.*$)/gm,"<li>$2</li>").replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\*(.*?)\*/g,"<em>$1</em>").replace(/`(.*?)`/g,"<code>$1</code>").replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2" target="_blank">$1</a>').replace(/\n\n/g,"</p><p>").replace(/^(.*)$/gm,"<p>$1</p>").replace(/<p><h/g,"<h").replace(/<\/h([1-6])><\/p>/g,"</h$1>").replace(/<p><li>/g,"<ul><li>").replace(/<\/li><\/p>/g,"</li></ul>").replace(/<\/ul>\s*<ul>/g,"");return e=e.replace(/<h([2-4]) id="([^"]+)">([^<]+)<\/h[2-4]>/g,(n,i,a,o)=>{const s=o.toLowerCase().replace(/[^a-z0-9]+/g,"-");return`<h${i} id="${s}">${o}</h${i}>`}),e}formatContentType(t){return{blog:"Blog Post",case_study:"Case Study",guide:"Guide",ebook:"eBook",webinar:"Webinar"}[t]||t}formatDate(t){return new Date(t).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})}formatMetricLabel(t){return t.replace(/_/g," ").replace(/\b\w/g,e=>e.toUpperCase())}showErrorState(){const t=document.getElementById("loading-state"),e=document.getElementById("error-state");t&&(t.style.display="none"),e&&(e.style.display="block")}shareContent(){this.content&&(navigator.share?navigator.share({title:this.content.title,text:this.content.excerpt,url:window.location.href}):navigator.clipboard.writeText(window.location.href).then(()=>{this.showToast("Link copied to clipboard!","success")}))}showToast(t,e="info"){const n=document.createElement("div");n.className=`toast toast-${e}`,n.textContent=t,n.style.cssText=`
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: var(--shadow-lg);
      z-index: 1001;
      animation: slideInRight 0.3s ease-out;
    `;const i={success:"var(--success)",error:"var(--error)",info:"var(--sky-gradient-start)"};n.style.background=i[e],n.style.color="white",document.body.appendChild(n),setTimeout(()=>{n.style.animation="slideOutRight 0.3s ease-out",setTimeout(()=>n.remove(),300)},4e3)}}document.addEventListener("DOMContentLoaded",()=>{new l});window.shareContent=function(){window.contentPageManager&&window.contentPageManager.shareContent()};
