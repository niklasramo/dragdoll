import{_ as a,c as e,a2 as i,o as t}from"./chunks/framework.goTvDs_b.js";const g=JSON.parse('{"title":"DraggableDrag","description":"","frontmatter":{},"headers":[],"relativePath":"docs/draggable-drag.md","filePath":"docs/draggable-drag.md","lastUpdated":1732484338000}'),n={name:"docs/draggable-drag.md"};function l(r,s,h,d,p,o){return t(),e("div",null,s[0]||(s[0]=[i('<p><a href="/dragdoll/docs/draggable.html">Draggable</a> →</p><h1 id="draggabledrag" tabindex="-1">DraggableDrag <a class="header-anchor" href="#draggabledrag" aria-label="Permalink to &quot;DraggableDrag&quot;">​</a></h1><p>DraggableDrag class instance holds all the information about the current drag process. It&#39;s available via the Draggable instance&#39;s <a href="/dragdoll/docs/draggable.html#drag"><code>drag</code></a> property.</p><h2 id="properties" tabindex="-1">Properties <a class="header-anchor" href="#properties" aria-label="Permalink to &quot;Properties&quot;">​</a></h2><p>All the properties are read-only.</p><h3 id="sensor" tabindex="-1">sensor <a class="header-anchor" href="#sensor" aria-label="Permalink to &quot;sensor&quot;">​</a></h3><div class="language-ts vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">type</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> sensor</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Sensor</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>The sensor that is tracked for this drag process. Read-only.</p><h3 id="startevent" tabindex="-1">startEvent <a class="header-anchor" href="#startevent" aria-label="Permalink to &quot;startEvent&quot;">​</a></h3><div class="language-ts vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">type</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> startEvent</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> SensorStartEvent</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> |</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> SensorMoveEvent</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>The sensor event that initiated the drag. Read-only.</p><h3 id="prevmoveevent" tabindex="-1">prevMoveEvent <a class="header-anchor" href="#prevmoveevent" aria-label="Permalink to &quot;prevMoveEvent&quot;">​</a></h3><div class="language-ts vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">type</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> prevEvent</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> SensorStartEvent</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> |</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> SensorMoveEvent</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>The previous sensor move event. When drag starts this will be the start event. Read-only.</p><h3 id="moveevent" tabindex="-1">moveEvent <a class="header-anchor" href="#moveevent" aria-label="Permalink to &quot;moveEvent&quot;">​</a></h3><div class="language-ts vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">type</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> event</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> SensorStartEvent</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> |</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> SensorMoveEvent</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>The current sensor move event. When drag starts this will be the start event. drag Read-only.</p><h3 id="endevent" tabindex="-1">endEvent <a class="header-anchor" href="#endevent" aria-label="Permalink to &quot;endEvent&quot;">​</a></h3><div class="language-ts vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">type</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> endEvent</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> SensorEndEvent</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> |</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> SensorCancelEvent</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> |</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> SensorDestroyEvent</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> |</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> null</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>The sensor event that ended the drag. This will stay <code>null</code> (even when drag ends) if <a href="/dragdoll/docs/draggable.html#stop"><code>draggable.stop()</code></a> is called manually, because there is no specific event to link the ending to. Read-only.</p><h3 id="items" tabindex="-1">items <a class="header-anchor" href="#items" aria-label="Permalink to &quot;items&quot;">​</a></h3><div class="language-ts vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">type</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> items</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> DraggableDragItem</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[];</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>An array of <a href="/dragdoll/docs/draggable-drag-item.html"><code>DraggableDragItem</code></a> instances, which correspond to the drag elements as provided via the <a href="/dragdoll/docs/draggable.html#elements"><code>elements</code></a> option. Read-only.</p><h3 id="isended" tabindex="-1">isEnded <a class="header-anchor" href="#isended" aria-label="Permalink to &quot;isEnded&quot;">​</a></h3><div class="language-ts vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">type</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> isEnded</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> boolean</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>A boolean that indicates whether the drag process has ended. Read-only.</p>',26)]))}const c=a(n,[["render",l]]);export{g as __pageData,c as default};