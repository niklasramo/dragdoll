var S={start:"start",move:"move",cancel:"cancel",end:"end",destroy:"destroy"};import{Emitter as ct}from"eventti";var N=class{constructor(){this.drag=null,this.isDestroyed=!1,this._emitter=new ct}_createDragData(e){return{x:e.x,y:e.y}}_updateDragData(e){this.drag&&(this.drag.x=e.x,this.drag.y=e.y)}_resetDragData(){this.drag=null}_start(e){this.isDestroyed||this.drag||(this.drag=this._createDragData(e),this._emitter.emit(S.start,e))}_move(e){this.drag&&(this._updateDragData(e),this._emitter.emit(S.move,e))}_end(e){this.drag&&(this._updateDragData(e),this._emitter.emit(S.end,e),this._resetDragData())}_cancel(e){this.drag&&(this._updateDragData(e),this._emitter.emit(S.cancel,e),this._resetDragData())}on(e,t,n){return this._emitter.on(e,t,n)}off(e,t){this._emitter.off(e,t)}cancel(){this.drag&&(this._emitter.emit(S.cancel,{type:S.cancel,x:this.drag.x,y:this.drag.y}),this._resetDragData())}destroy(){this.isDestroyed||(this.isDestroyed=!0,this.cancel(),this._emitter.emit(S.destroy,{type:S.destroy}),this._emitter.off())}};import{Ticker as dt}from"tikki";var E=Symbol(),_=Symbol(),m=new dt({phases:[E,_]});function Lt(r,e,t){E=e,_=t,m=r}var Z=class extends N{constructor(){super();this.drag=null,this._direction={x:0,y:0},this._speed=0,this._tick=this._tick.bind(this)}_createDragData(t){return{...super._createDragData(t),time:0,deltaTime:0}}_start(t){this.isDestroyed||this.drag||(super._start(t),m.on(E,this._tick))}_end(t){this.drag&&(m.off(E,this._tick),super._end(t))}_cancel(t){this.drag&&(m.off(E,this._tick),super._cancel(t))}_tick(t){if(this.drag)if(t&&this.drag.time){this.drag.deltaTime=t-this.drag.time,this.drag.time=t;let n={type:"tick",time:this.drag.time,deltaTime:this.drag.deltaTime};if(this._emitter.emit("tick",n),!this.drag)return;let i=this._speed*(this.drag.deltaTime/1e3),o=this._direction.x*i,s=this._direction.y*i;(o||s)&&this._move({type:"move",x:this.drag.x+o,y:this.drag.y+s})}else this.drag.time=t,this.drag.deltaTime=0}};import{Emitter as ht}from"eventti";function ue(r,e){if("pointerId"in r)return r.pointerId===e?r:null;if("changedTouches"in r){let t=0;for(;t<r.changedTouches.length;t++)if(r.changedTouches[t].identifier===e)return r.changedTouches[t];return null}return r}function Ue(r){return"pointerType"in r?r.pointerType:"touches"in r?"touch":"mouse"}function Ve(r){return"pointerId"in r?r.pointerId:"changedTouches"in r?r.changedTouches[0]?r.changedTouches[0].identifier:null:-1}var pe=typeof window<"u"&&typeof window.document<"u",ee=(()=>{let r=!1;try{let e=Object.defineProperty({},"passive",{get:function(){r=!0}});window.addEventListener("testPassive",null,e),window.removeEventListener("testPassive",null,e)}catch{}return r})(),Be=pe&&"ontouchstart"in window,Fe=pe&&!!window.PointerEvent,He=!!(pe&&navigator.vendor&&navigator.vendor.indexOf("Apple")>-1&&navigator.userAgent&&navigator.userAgent.indexOf("CriOS")==-1&&navigator.userAgent.indexOf("FxiOS")==-1);function fe(r={}){let{capture:e=!0,passive:t=!0}=r;return ee?{capture:e,passive:t}:{capture:e}}function ge(r){return r==="auto"||r===void 0?Fe?"pointer":Be?"touch":"mouse":r}var mt={start:"pointerdown",move:"pointermove",cancel:"pointercancel",end:"pointerup"},ut={start:"touchstart",move:"touchmove",cancel:"touchcancel",end:"touchend"},pt={start:"mousedown",move:"mousemove",cancel:"",end:"mouseup"},q={pointer:mt,touch:ut,mouse:pt},U=class{constructor(e,t={}){let{listenerOptions:n={},sourceEvents:i="auto",startPredicate:o=s=>!("button"in s&&s.button>0)}=t;this.element=e,this.drag=null,this.isDestroyed=!1,this._areWindowListenersBound=!1,this._startPredicate=o,this._listenerOptions=fe(n),this._sourceEvents=ge(i),this._emitter=new ht,this._onStart=this._onStart.bind(this),this._onMove=this._onMove.bind(this),this._onCancel=this._onCancel.bind(this),this._onEnd=this._onEnd.bind(this),e.addEventListener(q[this._sourceEvents].start,this._onStart,this._listenerOptions)}_getTrackedPointerEventData(e){return this.drag?ue(e,this.drag.pointerId):null}_onStart(e){if(this.isDestroyed||this.drag||!this._startPredicate(e))return;let t=Ve(e);if(t===null)return;let n=ue(e,t);if(n===null)return;let i={pointerId:t,pointerType:Ue(e),x:n.clientX,y:n.clientY};this.drag=i;let o={...i,type:S.start,srcEvent:e,target:n.target};this._emitter.emit(o.type,o),this.drag&&this._bindWindowListeners()}_onMove(e){if(!this.drag)return;let t=this._getTrackedPointerEventData(e);if(!t)return;this.drag.x=t.clientX,this.drag.y=t.clientY;let n={type:S.move,srcEvent:e,target:t.target,...this.drag};this._emitter.emit(n.type,n)}_onCancel(e){if(!this.drag)return;let t=this._getTrackedPointerEventData(e);if(!t)return;this.drag.x=t.clientX,this.drag.y=t.clientY;let n={type:S.cancel,srcEvent:e,target:t.target,...this.drag};this._emitter.emit(n.type,n),this._resetDrag()}_onEnd(e){if(!this.drag)return;let t=this._getTrackedPointerEventData(e);if(!t)return;this.drag.x=t.clientX,this.drag.y=t.clientY;let n={type:S.end,srcEvent:e,target:t.target,...this.drag};this._emitter.emit(n.type,n),this._resetDrag()}_bindWindowListeners(){if(this._areWindowListenersBound)return;let{move:e,end:t,cancel:n}=q[this._sourceEvents];window.addEventListener(e,this._onMove,this._listenerOptions),window.addEventListener(t,this._onEnd,this._listenerOptions),n&&window.addEventListener(n,this._onCancel,this._listenerOptions),this._areWindowListenersBound=!0}_unbindWindowListeners(){if(this._areWindowListenersBound){let{move:e,end:t,cancel:n}=q[this._sourceEvents];window.removeEventListener(e,this._onMove,this._listenerOptions),window.removeEventListener(t,this._onEnd,this._listenerOptions),n&&window.removeEventListener(n,this._onCancel,this._listenerOptions),this._areWindowListenersBound=!1}}_resetDrag(){this.drag=null,this._unbindWindowListeners()}cancel(){if(!this.drag)return;let e={type:S.cancel,srcEvent:null,target:null,...this.drag};this._emitter.emit(e.type,e),this._resetDrag()}updateSettings(e){if(this.isDestroyed)return;let{listenerOptions:t,sourceEvents:n,startPredicate:i}=e,o=ge(n),s=fe(t);i&&this._startPredicate!==i&&(this._startPredicate=i),(t&&(this._listenerOptions.capture!==s.capture||this._listenerOptions.passive===s.passive)||n&&this._sourceEvents!==o)&&(this.element.removeEventListener(q[this._sourceEvents].start,this._onStart,this._listenerOptions),this._unbindWindowListeners(),this.cancel(),n&&(this._sourceEvents=o),t&&s&&(this._listenerOptions=s),this.element.addEventListener(q[this._sourceEvents].start,this._onStart,this._listenerOptions))}on(e,t,n){return this._emitter.on(e,t,n)}off(e,t){this._emitter.off(e,t)}destroy(){this.isDestroyed||(this.isDestroyed=!0,this.cancel(),this._emitter.emit(S.destroy,{type:S.destroy}),this._emitter.off(),this.element.removeEventListener(q[this._sourceEvents].start,this._onStart,this._listenerOptions))}};var Ge=class extends N{constructor(t={}){super();let{moveDistance:n=25,startPredicate:i=c=>{if((c.key==="Enter"||c.key===" ")&&document.activeElement&&document.activeElement!==document.body){let{left:a,top:d}=document.activeElement.getBoundingClientRect();return{x:a,y:d}}return null},movePredicate:o=(c,a,d)=>{if(!a.drag)return null;switch(c.key){case"ArrowLeft":return{x:a.drag.x-d,y:a.drag.y};case"ArrowRight":return{x:a.drag.x+d,y:a.drag.y};case"ArrowUp":return{x:a.drag.x,y:a.drag.y-d};case"ArrowDown":return{x:a.drag.x,y:a.drag.y+d};default:return null}},cancelPredicate:s=(c,a)=>a.drag&&c.key==="Escape"?{x:a.drag.x,y:a.drag.y}:null,endPredicate:l=(c,a)=>a.drag&&(c.key==="Enter"||c.key===" ")?{x:a.drag.x,y:a.drag.y}:null}=t;this._moveDistance=n,this._startPredicate=i,this._movePredicate=o,this._cancelPredicate=s,this._endPredicate=l,this.cancel=this.cancel.bind(this),this._onKeyDown=this._onKeyDown.bind(this),document.addEventListener("keydown",this._onKeyDown),window.addEventListener("blur",this.cancel),window.addEventListener("visibilitychange",this.cancel)}_onKeyDown(t){if(!this.drag){let s=this._startPredicate(t,this,this._moveDistance);s&&(t.preventDefault(),this._start({type:"start",x:s.x,y:s.y,srcEvent:t}));return}let n=this._cancelPredicate(t,this,this._moveDistance);if(n){t.preventDefault(),this._cancel({type:"cancel",x:n.x,y:n.y,srcEvent:t});return}let i=this._endPredicate(t,this,this._moveDistance);if(i){t.preventDefault(),this._end({type:"end",x:i.x,y:i.y,srcEvent:t});return}let o=this._movePredicate(t,this,this._moveDistance);if(o){t.preventDefault(),this._move({type:"move",x:o.x,y:o.y,srcEvent:t});return}}updateSettings(t={}){t.moveDistance!==void 0&&(this._moveDistance=t.moveDistance),t.startPredicate!==void 0&&(this._startPredicate=t.startPredicate),t.movePredicate!==void 0&&(this._movePredicate=t.movePredicate),t.cancelPredicate!==void 0&&(this._cancelPredicate=t.cancelPredicate),t.endPredicate!==void 0&&(this._endPredicate=t.endPredicate)}destroy(){this.isDestroyed||(super.destroy(),document.removeEventListener("keydown",this._onKeyDown),window.removeEventListener("blur",this.cancel),window.removeEventListener("visibilitychange",this.cancel))}};var ft=["start","cancel","end","moveLeft","moveRight","moveUp","moveDown"];function te(r,e){if(!r.size||!e.size)return 1/0;let t=1/0;for(let n of r){let i=e.get(n);i!==void 0&&i<t&&(t=i)}return t}var ze=class extends Z{constructor(t={}){super();let{startPredicate:n=()=>{if(document.activeElement){let{left:v,top:f}=document.activeElement.getBoundingClientRect();return{x:v,y:f}}return null},computeSpeed:i=()=>500,startKeys:o=[" ","Enter"],moveLeftKeys:s=["ArrowLeft"],moveRightKeys:l=["ArrowRight"],moveUpKeys:c=["ArrowUp"],moveDownKeys:a=["ArrowDown"],cancelKeys:d=["Escape"],endKeys:u=[" ","Enter"]}=t;this._computeSpeed=i,this._startPredicate=n,this._startKeys=new Set(o),this._cancelKeys=new Set(d),this._endKeys=new Set(u),this._moveLeftKeys=new Set(s),this._moveRightKeys=new Set(l),this._moveUpKeys=new Set(c),this._moveDownKeys=new Set(a),this._moveKeys=new Set([...s,...l,...c,...a]),this._moveKeyTimestamps=new Map,this._onKeyDown=this._onKeyDown.bind(this),this._onKeyUp=this._onKeyUp.bind(this),this._onTick=this._onTick.bind(this),this.on("tick",this._onTick),document.addEventListener("keydown",this._onKeyDown),document.addEventListener("keyup",this._onKeyUp),window.addEventListener("blur",this.cancel),window.addEventListener("visibilitychange",this.cancel)}_end(t){this.drag&&(this._moveKeyTimestamps.clear(),super._end(t))}_cancel(t){this.drag&&(this._moveKeyTimestamps.clear(),super._cancel(t))}_updateDirection(){let t=te(this._moveLeftKeys,this._moveKeyTimestamps),n=te(this._moveRightKeys,this._moveKeyTimestamps),i=te(this._moveUpKeys,this._moveKeyTimestamps),o=te(this._moveDownKeys,this._moveKeyTimestamps),s=t===n?0:t<n?-1:1,l=i===o?0:i<o?-1:1;if(!(s===0||l===0)){let c=1/(Math.sqrt(s*s+l*l)||1);s*=c,l*=c}this._direction.x=s,this._direction.y=l}_onTick(){this._speed=this._computeSpeed(this)}_onKeyUp(t){this._moveKeyTimestamps.get(t.key)&&(this._moveKeyTimestamps.delete(t.key),this._updateDirection())}_onKeyDown(t){if(!this.drag){if(this._startKeys.has(t.key)){let n=this._startPredicate(t,this);n&&(t.preventDefault(),this._start({type:"start",x:n.x,y:n.y}))}return}if(this._cancelKeys.has(t.key)){t.preventDefault(),this._cancel({type:"cancel",x:this.drag.x,y:this.drag.y});return}if(this._endKeys.has(t.key)){t.preventDefault(),this._end({type:"end",x:this.drag.x,y:this.drag.y});return}if(this._moveKeys.has(t.key)){t.preventDefault(),this._moveKeyTimestamps.get(t.key)||(this._moveKeyTimestamps.set(t.key,Date.now()),this._updateDirection());return}}updateSettings(t={}){let n=!1;if(t.startPredicate!==void 0&&(this._startPredicate=t.startPredicate),t.computeSpeed!==void 0&&(this._computeSpeed=t.computeSpeed),ft.forEach((i,o)=>{let s=`${i}Keys`,l=t[s];l!==void 0&&(this[`_${s}`]=new Set(l),o>=3&&(n=!0))}),n){let i=[...this._moveLeftKeys,...this._moveRightKeys,...this._moveUpKeys,...this._moveDownKeys];[...this._moveKeys].every((s,l)=>i[l]===s)||(this._moveKeys=new Set(i),this._moveKeyTimestamps.clear(),this._updateDirection())}}destroy(){this.isDestroyed||(super.destroy(),this.off("tick",this._onTick),document.removeEventListener("keydown",this._onKeyDown),document.removeEventListener("keyup",this._onKeyUp),window.removeEventListener("blur",this.cancel),window.removeEventListener("visibilitychange",this.cancel))}};import{Emitter as gt}from"eventti";var je=new WeakMap;function y(r){let e=je.get(r)?.deref();return e||(e=window.getComputedStyle(r,null),je.set(r,new WeakRef(e))),e}function ne(r){let e=y(r);switch(e.display){case"none":return;case"inline":case"contents":return!1}let{transform:t}=e;if(t&&t!=="none")return!0;let{perspective:n}=e;if(n&&n!=="none")return!0;let{backdropFilter:i}=e;if(i&&i!=="none")return!0;let{contentVisibility:o}=e;if(o&&o==="auto")return!0;let{contain:s}=e;if(s&&(s==="strict"||s==="content"||s.indexOf("paint")>-1||s.indexOf("layout")>-1))return!0;if(!He){let{filter:l}=e;if(l&&l!=="none")return!0;let{willChange:c}=e;if(c&&(c.indexOf("transform")>-1||c.indexOf("perspective")>-1||c.indexOf("filter")>-1))return!0}return!1}function $e(r){return y(r).position!=="static"?!0:ne(r)}function M(r){return r instanceof Document}function Ee(r,e){let t=y(r),{display:n}=t;if(n==="none"||n==="contents")return null;switch(t.position){case"relative":return r;case"fixed":{let i=e||r.parentNode;for(;i&&!M(i);)if(i instanceof Element){let o=ne(i);if(o===!0)return i;if(o===void 0)return null;i=i.parentNode}else i instanceof ShadowRoot?i=i.host:i=i.parentNode;return r.ownerDocument.defaultView}case"absolute":{let i=e||r.parentNode;for(;i&&!M(i);)if(i instanceof Element){let o=$e(i);if(o===!0)return i;if(o===void 0)return null;i=i.parentNode}else i instanceof ShadowRoot?i=i.host:i=i.parentNode;return r.ownerDocument}default:return null}}function b(r){return r instanceof Window}function Se(r,e={left:0,top:0}){if(e.left=0,e.top=0,M(r))return e;if(b(r))return e.left=r.scrollX,e.top=r.scrollY,e;let t=r.ownerDocument.defaultView;t&&(e.left+=t.scrollX,e.top+=t.scrollY);let{left:n,top:i}=r.getBoundingClientRect();e.left+=n,e.top+=i;let o=y(r);return e.left+=parseFloat(o.borderLeftWidth)||0,e.top+=parseFloat(o.borderTopWidth)||0,e}var ve={left:0,top:0},_e={left:0,top:0};function ye(r,e,t={left:0,top:0}){return t.left=0,t.top=0,r===e||(Se(r,ve),Se(e,_e),t.left=_e.left-ve.left,t.top=_e.top-ve.top),t}var Et="matrix(1, 0, 0, 1, 0, 0)",St="matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",Je=ee?{capture:!0,passive:!0}:!0,Qe={left:0,top:0},be={x:0,y:0};var xe=class{constructor(e,t,n,i,o){this.element=e,this.elementContainer=t,this.elementOffsetContainer=n,this.dragContainer=i,this.dragOffsetContainer=o,this.x=0,this.y=0,this.pX=0,this.pY=0,this._updateDiffX=0,this._updateDiffY=0,this._moveDiffX=0,this._moveDiffY=0,this._containerDiffX=0,this._containerDiffY=0,this._transform=""}},De=class{constructor(){this.sensor=null,this.isEnded=!1,this.isStarted=!1,this.startEvent=null,this.nextMoveEvent=null,this.prevMoveEvent=null,this.endEvent=null,this.items=[]}};function vt(){return{container:null,startPredicate:()=>!0,getElements:()=>null,releaseElements:()=>{},getStartPosition:({item:r})=>{let{transform:e}=y(r.element);return e&&e!=="none"&&e!==Et&&e!==St?r._transform=e:r._transform="",{x:0,y:0}},setPosition:({item:r,x:e,y:t})=>{r.element.style.transform=`translate(${e}px, ${t}px) ${r._transform}`},getPositionChange:({event:r,prevEvent:e})=>(be.x=r.x-e.x,be.y=r.y-e.y,be)}}var Ze=class{constructor(e,t={}){this.sensors=e,this.settings=this._parseSettings(t),this.plugins={},this.drag=null,this.isDestroyed=!1,this._sensorData=new Map,this._emitter=new gt,this._startId=Symbol(),this._moveId=Symbol(),this._updateId=Symbol(),this._onMove=this._onMove.bind(this),this._onScroll=this._onScroll.bind(this),this._onEnd=this._onEnd.bind(this),this._prepareStart=this._prepareStart.bind(this),this._applyStart=this._applyStart.bind(this),this._prepareMove=this._prepareMove.bind(this),this._applyMove=this._applyMove.bind(this),this._preparePositionUpdate=this._preparePositionUpdate.bind(this),this._applyPositionUpdate=this._applyPositionUpdate.bind(this),this.sensors.forEach(n=>{this._sensorData.set(n,{predicateState:0,predicateEvent:null,onMove:s=>this._onMove(s,n),onEnd:s=>this._onEnd(s,n)});let{onMove:i,onEnd:o}=this._sensorData.get(n);n.on("start",i),n.on("move",i),n.on("cancel",o),n.on("end",o),n.on("destroy",o)})}_parseSettings(e,t=vt()){let{container:n=t.container,startPredicate:i=t.startPredicate,getElements:o=t.getElements,releaseElements:s=t.releaseElements,getStartPosition:l=t.getStartPosition,setPosition:c=t.setPosition,getPositionChange:a=t.getPositionChange}=e||{};return{container:n,startPredicate:i,getElements:o,releaseElements:s,getStartPosition:l,setPosition:c,getPositionChange:a}}_emit(e,...t){this._emitter.emit(e,...t)}_onMove(e,t){let n=this._sensorData.get(t);if(n)switch(n.predicateState){case 0:{n.predicateEvent=e;let i=this.settings.startPredicate({draggable:this,sensor:t,event:e});i===!0?this.resolveStartPredicate(t):i===!1&&this.rejectStartPredicate(t);break}case 1:{this.drag&&(this.drag.nextMoveEvent=e,m.once(E,this._prepareMove,this._moveId),m.once(_,this._applyMove,this._moveId));break}}}_onScroll(){this.updatePosition()}_onEnd(e,t){let n=this._sensorData.get(t);n&&(this.drag?n.predicateState===1&&(this.drag.endEvent=e,this._sensorData.forEach(i=>{i.predicateState=0,i.predicateEvent=null}),this.stop()):(n.predicateState=0,n.predicateEvent=null))}_prepareStart(){let{drag:e}=this;if(!e||!e.startEvent)return;let t=this.settings.getElements({draggable:this,sensor:e.sensor,startEvent:e.startEvent})||[];e.items=t.map(n=>{if(!n.isConnected)throw new Error("Element is not connected");let i=n.parentElement,o=Ee(n);if(!o)throw new Error("Offset container could not be computed for the element!");let s=this.settings.container||i,l=s===i?o:Ee(n,s);if(!l)throw new Error("Drag offset container could not be computed for the element!");let c=new xe(n,i,o,s,l),a=n.getBoundingClientRect();if(c.x=a.left,c.y=a.top,o!==l){let{left:v,top:f}=ye(l,o,Qe);c._containerDiffX=v,c._containerDiffY=f}let{x:d,y:u}=this.settings.getStartPosition({draggable:this,sensor:e.sensor,item:c});return c.pX=d,c.pY=u,c})}_applyStart(){let e=this.drag;if(!e||!e.startEvent||(this._emit("beforestart",e.startEvent),this.drag!==e))return;let{container:t}=this.settings;if(t)for(let n of e.items)n.element&&(n.element.parentElement!==t&&(t.appendChild(n.element),n.pX+=n._containerDiffX,n.pY+=n._containerDiffY),this.settings.setPosition({phase:"start",draggable:this,sensor:e.sensor,item:n,x:n.pX,y:n.pY}));window.addEventListener("scroll",this._onScroll,Je),e.isStarted=!0,this._emit("start",e.startEvent)}_prepareMove(){let{drag:e}=this;if(!e||!e.startEvent)return;let t=e.nextMoveEvent,n=e.prevMoveEvent||e.startEvent;if(!(!t||t===n)){for(let i of e.items){if(!i.element)continue;let{x:o,y:s}=this.settings.getPositionChange({draggable:this,sensor:e.sensor,item:i,startEvent:e.startEvent,prevEvent:n,event:t});o&&(i.pX=i.pX-i._moveDiffX+o,i.x=i.x-i._moveDiffX+o,i._moveDiffX=o),s&&(i.pY=i.pY-i._moveDiffY+s,i.y=i.y-i._moveDiffY+s,i._moveDiffY=s)}e.prevMoveEvent=t}}_applyMove(){let{drag:e}=this;if(!(!e||!e.nextMoveEvent)){for(let t of e.items)t._moveDiffX=0,t._moveDiffY=0;if(this._emit("beforemove",e.nextMoveEvent),this.drag===e){for(let t of e.items)t.element&&this.settings.setPosition({phase:"move",draggable:this,sensor:e.sensor,item:t,x:t.pX,y:t.pY});this._emit("move",e.nextMoveEvent)}}}_preparePositionUpdate(){let{drag:e}=this;if(e)for(let t of e.items){if(!t.element)continue;if(t.elementOffsetContainer!==t.dragOffsetContainer){let{left:l,top:c}=ye(t.dragOffsetContainer,t.elementOffsetContainer,Qe);t._containerDiffX=l,t._containerDiffY=c}let{left:n,top:i}=t.element.getBoundingClientRect(),o=t.x-t._moveDiffX-n;t.pX=t.pX-t._updateDiffX+o,t._updateDiffX=o;let s=t.y-t._moveDiffY-i;t.pY=t.pY-t._updateDiffY+s,t._updateDiffY=s}}_applyPositionUpdate(){let{drag:e}=this;if(e)for(let t of e.items)t.element&&(t._updateDiffX=0,t._updateDiffY=0,this.settings.setPosition({phase:"move",draggable:this,sensor:e.sensor,item:t,x:t.pX,y:t.pY}))}on(e,t,n){return this._emitter.on(e,t,n)}off(e,t){this._emitter.off(e,t)}resolveStartPredicate(e,t){let n=this._sensorData.get(e);if(!n)return;let i=t||n.predicateEvent;n.predicateState===0&&i&&(n.predicateState=1,n.predicateEvent=null,this.drag=new De,this.drag.sensor=e,this.drag.startEvent=i,this._sensorData.forEach((o,s)=>{s!==e&&(o.predicateState=2,o.predicateEvent=null)}),m.once(E,this._prepareStart,this._startId),m.once(_,this._applyStart,this._startId))}rejectStartPredicate(e){let t=this._sensorData.get(e);t?.predicateState===0&&(t.predicateState=2,t.predicateEvent=null)}stop(){let{drag:e}=this;if(!(!e||e.isEnded)){if(e.isEnded=!0,this._emit("beforeend",e.endEvent),m.off(E,this._startId),m.off(_,this._startId),m.off(E,this._moveId),m.off(_,this._moveId),m.off(E,this._updateId),m.off(_,this._updateId),e.isStarted){window.removeEventListener("scroll",this._onScroll,Je);let t=[];for(let n of e.items)n.element&&(t.push(n.element),n.elementContainer&&n.element.parentElement!==n.elementContainer&&(n.pX-=n._containerDiffX,n.pY-=n._containerDiffY,n._containerDiffX=0,n._containerDiffY=0,n.elementContainer.appendChild(n.element)),this.settings.setPosition({phase:"end",draggable:this,sensor:e.sensor,item:n,x:n.pX,y:n.pY}));t.length&&this.settings.releaseElements({draggable:this,sensor:e.sensor,elements:t})}this._emit("end",e.endEvent),this.drag=null}}updatePosition(e=!1){this.drag&&(e?(this._preparePositionUpdate(),this._applyPositionUpdate()):(m.once(E,this._preparePositionUpdate,this._updateId),m.once(_,this._applyPositionUpdate,this._updateId)))}updateSettings(e={}){this.settings=this._parseSettings(e,this.settings)}use(e){return e(this)}destroy(){this.isDestroyed||(this.isDestroyed=!0,this.stop(),this._sensorData.forEach(({onMove:e,onEnd:t},n)=>{n.off("start",e),n.off("move",e),n.off("cancel",t),n.off("end",t),n.off("destroy",t)}),this._sensorData.clear(),this._emit("destroy"),this._emitter.off())}};import{Emitter as _t}from"eventti";var z=class{constructor(e,t){this._data=[],this._createObject=e,this._onPut=t}pick(){return this._data.length?this._data.pop():this._createObject()}put(e){this._data.indexOf(e)===-1&&(this._onPut&&this._onPut(e),this._data.push(e))}reset(){this._data.length=0}};function W(r,e){return!(r.right<=e.left||e.right<=r.left||r.bottom<=e.top||e.bottom<=r.top)}function et(r,e){if(!W(r,e))return 0;let t=Math.min(r.right,e.right)-Math.max(r.left,e.left),n=Math.min(r.bottom,e.bottom)-Math.max(r.top,e.top);return t*n}function Pe(r,e){let t=et(r,e);if(!t)return 0;let n=Math.min(r.width,e.width)*Math.min(r.height,e.height);return t/n*100}function Te(r,e={width:0,height:0,left:0,right:0,top:0,bottom:0}){if(b(r))e.width=document.documentElement.clientWidth,e.height=document.documentElement.clientHeight,e.left=0,e.right=e.width,e.top=0,e.bottom=e.height;else{let t=r.getBoundingClientRect(),n=y(r),i=parseFloat(n.borderLeftWidth)||0,o=parseFloat(n.borderTopWidth)||0;e.width=r.clientWidth,e.height=r.clientHeight,e.left=t.left+i,e.right=e.left+e.width,e.top=t.top+o,e.bottom=e.top+e.height}return e}function re(r,e,t,n){return Math.sqrt(Math.pow(t-r,2)+Math.pow(n-e,2))}function tt(r,e){return W(r,e)?0:r.right<e.left?r.bottom<e.top?re(r.right,r.bottom,e.left,e.top):r.top>e.bottom?re(r.right,r.top,e.left,e.bottom):e.left-r.right:r.left>e.right?r.bottom<e.top?re(r.left,r.bottom,e.right,e.top):r.top>e.bottom?re(r.left,r.top,e.right,e.bottom):r.left-e.right:r.bottom<e.top?e.top-r.bottom:r.top-e.bottom}function we(r){return b(r)||r===document.documentElement||r===document.body?window:r}function V(r){return b(r)?r.pageXOffset:r.scrollLeft}function Ae(r){return b(r)&&(r=document.documentElement),r.scrollWidth-r.clientWidth}function B(r){return b(r)?r.pageYOffset:r.scrollTop}function Ie(r){return b(r)&&(r=document.documentElement),r.scrollHeight-r.clientHeight}var se={width:0,height:0,left:0,right:0,top:0,bottom:0},nt={...se},rt={...se},it=50,A={direction:"none",threshold:0,distance:0,value:0,maxValue:0,duration:0,speed:0,deltaTime:0,isEnding:!1},h={x:1,y:2},X={forward:4,reverse:8},ie={none:0,left:h.x|X.reverse,right:h.x|X.forward},j={none:0,up:h.y|X.reverse,down:h.y|X.forward},p={...ie,...j};function ke(r){switch(r){case ie.none:case j.none:return"none";case ie.left:return"left";case ie.right:return"right";case j.up:return"up";case j.down:return"down";default:throw new Error(`Unknown direction value: ${r}`)}}function ot(r,e,t){let{left:n=0,right:i=0,top:o=0,bottom:s=0}=e;return n=Math.max(0,n),i=Math.max(0,i),o=Math.max(0,o),s=Math.max(0,s),t.width=r.width+n+i,t.height=r.height+o+s,t.left=r.left-n,t.top=r.top-o,t.right=r.right+i,t.bottom=r.bottom+s,t}function oe(r,e){return Math.ceil(r)>=Math.floor(e)}function Ce(r,e){return Math.min(e/2,r)}function Re(r,e,t,n){return Math.max(0,t+r*2+n*e-n)/2}var Le=class{constructor(){this.positionX=0,this.positionY=0,this.directionX=p.none,this.directionY=p.none,this.overlapCheckRequestTime=0}},Ke=class{constructor(){this.element=null,this.requestX=null,this.requestY=null,this.scrollLeft=0,this.scrollTop=0}reset(){this.requestX&&(this.requestX.action=null),this.requestY&&(this.requestY.action=null),this.element=null,this.requestX=null,this.requestY=null,this.scrollLeft=0,this.scrollTop=0}addRequest(e){h.x&e.direction?(this.requestX&&this.removeRequest(this.requestX),this.requestX=e):(this.requestY&&this.removeRequest(this.requestY),this.requestY=e),e.action=this}removeRequest(e){this.requestX===e?(this.requestX=null,e.action=null):this.requestY===e&&(this.requestY=null,e.action=null)}computeScrollValues(){this.element&&(this.scrollLeft=this.requestX?this.requestX.value:V(this.element),this.scrollTop=this.requestY?this.requestY.value:B(this.element))}scroll(){this.element&&(this.element.scrollTo?this.element.scrollTo(this.scrollLeft,this.scrollTop):(this.element.scrollLeft=this.scrollLeft,this.element.scrollTop=this.scrollTop))}},Oe=class{constructor(){this.item=null,this.element=null,this.isActive=!1,this.isEnding=!1,this.direction=0,this.value=NaN,this.maxValue=0,this.threshold=0,this.distance=0,this.deltaTime=0,this.speed=0,this.duration=0,this.action=null}reset(){this.isActive&&this.onStop(),this.item=null,this.element=null,this.isActive=!1,this.isEnding=!1,this.direction=0,this.value=NaN,this.maxValue=0,this.threshold=0,this.distance=0,this.deltaTime=0,this.speed=0,this.duration=0,this.action=null}hasReachedEnd(){return X.forward&this.direction?oe(this.value,this.maxValue):this.value<=0}computeCurrentScrollValue(){return this.element?this.value!==this.value?h.x&this.direction?V(this.element):B(this.element):Math.max(0,Math.min(this.value,this.maxValue)):0}computeNextScrollValue(){let e=this.speed*(this.deltaTime/1e3),t=X.forward&this.direction?this.value+e:this.value-e;return Math.max(0,Math.min(t,this.maxValue))}computeSpeed(){if(!this.item||!this.element)return 0;let{speed:e}=this.item;return typeof e=="function"?(A.direction=ke(this.direction),A.threshold=this.threshold,A.distance=this.distance,A.value=this.value,A.maxValue=this.maxValue,A.duration=this.duration,A.speed=this.speed,A.deltaTime=this.deltaTime,A.isEnding=this.isEnding,e(this.element,A)):e}tick(e){return this.isActive||(this.isActive=!0,this.onStart()),this.deltaTime=e,this.value=this.computeCurrentScrollValue(),this.speed=this.computeSpeed(),this.value=this.computeNextScrollValue(),this.duration+=e,this.value}onStart(){if(!this.item||!this.element)return;let{onStart:e}=this.item;typeof e=="function"&&e(this.element,ke(this.direction))}onStop(){if(!this.item||!this.element)return;let{onStop:e}=this.item;typeof e=="function"&&e(this.element,ke(this.direction))}};function st(r=500,e=.5,t=.25){let n=r*(e>0?1/e:1/0),i=r*(t>0?1/t:1/0);return function(o,s){let l=0;if(!s.isEnding)if(s.threshold>0){let d=s.threshold-Math.max(0,s.distance);l=r/s.threshold*d}else l=r;let c=s.speed;if(c===l)return l;let a=l;return c<l?(a=c+n*(s.deltaTime/1e3),Math.min(l,a)):(a=c-i*(s.deltaTime/1e3),Math.max(l,a))}}var ae=class{constructor(e={}){let{overlapCheckInterval:t=150}=e;this.items=[],this.settings={overlapCheckInterval:t},this._actions=[],this._isDestroyed=!1,this._isTicking=!1,this._tickTime=0,this._tickDeltaTime=0,this._requests={[h.x]:new Map,[h.y]:new Map},this._itemData=new Map,this._requestPool=new z(()=>new Oe,n=>n.reset()),this._actionPool=new z(()=>new Ke,n=>n.reset()),this._emitter=new _t,this._frameRead=this._frameRead.bind(this),this._frameWrite=this._frameWrite.bind(this)}_frameRead(e){this._isDestroyed||(e&&this._tickTime?(this._tickDeltaTime=e-this._tickTime,this._tickTime=e,this._updateItems(),this._updateRequests(),this._updateActions()):(this._tickTime=e,this._tickDeltaTime=0))}_frameWrite(){this._isDestroyed||this._applyActions()}_startTicking(){this._isTicking||(this._isTicking=!0,m.on(E,this._frameRead),m.on(_,this._frameWrite))}_stopTicking(){this._isTicking&&(this._isTicking=!1,this._tickTime=0,this._tickDeltaTime=0,m.off(E,this._frameRead),m.off(_,this._frameWrite))}_getItemClientRect(e,t={width:0,height:0,left:0,right:0,top:0,bottom:0}){let{clientRect:n}=e;return t.left=n.left,t.top=n.top,t.width=n.width,t.height=n.height,t.right=n.left+n.width,t.bottom=n.top+n.height,t}_requestItemScroll(e,t,n,i,o,s,l){let c=this._requests[t],a=c.get(e);a?(a.element!==n||a.direction!==i)&&a.reset():(a=this._requestPool.pick(),c.set(e,a)),a.item=e,a.element=n,a.direction=i,a.threshold=o,a.distance=s,a.maxValue=l}_cancelItemScroll(e,t){let n=this._requests[t],i=n.get(e);i&&(i.action&&i.action.removeRequest(i),this._requestPool.put(i),n.delete(e))}_checkItemOverlap(e,t,n){let{inertAreaSize:i,targets:o}=e;if(!o.length){t&&this._cancelItemScroll(e,h.x),n&&this._cancelItemScroll(e,h.y);return}let s=this._itemData.get(e),l=s?.directionX,c=s?.directionY;if(!l&&!c){t&&this._cancelItemScroll(e,h.x),n&&this._cancelItemScroll(e,h.y);return}let a=this._getItemClientRect(e,se),d=null,u=-1/0,v=0,f=-1/0,x=p.none,O=0,D=0,g=null,P=-1/0,F=0,H=-1/0,ce=p.none,Ye=0,Ne=0,de=0;for(;de<o.length;de++){let I=o[de],qe=typeof I.threshold=="number"?I.threshold:it,he=!!(t&&l&&I.axis!=="y"),me=!!(n&&c&&I.axis!=="x"),K=I.priority||0;if((!he||K<u)&&(!me||K<P))continue;let k=we(I.element||I),J=he?Ae(k):-1,Q=me?Ie(k):-1;if(J<=0&&Q<=0)continue;let T=Te(k,nt),Y=Pe(a,T)||-1/0;if(Y===-1/0)if(I.padding&&W(a,ot(T,I.padding,rt)))Y=-tt(a,T);else continue;if(he&&K>=u&&J>0&&(K>u||Y>f)){let w=0,C=p.none,R=Ce(qe,T.width),G=Re(R,i,a.width,T.width);l===p.right?(w=T.right+G-a.right,w<=R&&!oe(V(k),J)&&(C=p.right)):l===p.left&&(w=a.left-(T.left-G),w<=R&&V(k)>0&&(C=p.left)),C&&(d=k,u=K,v=R,f=Y,x=C,O=w,D=J)}if(me&&K>=P&&Q>0&&(K>P||Y>H)){let w=0,C=j.none,R=Ce(qe,T.height),G=Re(R,i,a.height,T.height);c===p.down?(w=T.bottom+G-a.bottom,w<=R&&!oe(B(k),Q)&&(C=p.down)):c===p.up&&(w=a.top-(T.top-G),w<=R&&B(k)>0&&(C=p.up)),C&&(g=k,P=K,F=R,H=Y,ce=C,Ye=w,Ne=Q)}}t&&(d&&x?this._requestItemScroll(e,h.x,d,x,v,O,D):this._cancelItemScroll(e,h.x)),n&&(g&&ce?this._requestItemScroll(e,h.y,g,ce,F,Ye,Ne):this._cancelItemScroll(e,h.y))}_updateScrollRequest(e){let t=e.item,{inertAreaSize:n,smoothStop:i,targets:o}=t,s=this._getItemClientRect(t,se),l=null,c=0;for(;c<o.length;c++){let a=o[c],d=we(a.element||a);if(d!==e.element)continue;let u=!!(h.x&e.direction);if(u){if(a.axis==="y")continue}else if(a.axis==="x")continue;let v=u?Ae(d):Ie(d);if(v<=0)break;let f=Te(d,nt);if((Pe(s,f)||-1/0)===-1/0){let H=a.scrollPadding||a.padding;if(!(H&&W(s,ot(f,H,rt))))break}let O=typeof a.threshold=="number"?a.threshold:it,D=Ce(O,u?f.width:f.height),g=Re(D,n,u?s.width:s.height,u?f.width:f.height),P=0;if(e.direction===p.left?P=s.left-(f.left-g):e.direction===p.right?P=f.right+g-s.right:e.direction===p.up?P=s.top-(f.top-g):P=f.bottom+g-s.bottom,P>D)break;let F=u?V(d):B(d);if(l=X.forward&e.direction?oe(F,v):F<=0,l)break;return e.maxValue=v,e.threshold=D,e.distance=P,e.isEnding=!1,!0}return i===!0&&e.speed>0?(l===null&&(l=e.hasReachedEnd()),e.isEnding=!l):e.isEnding=!1,e.isEnding}_updateItems(){for(let e=0;e<this.items.length;e++){let t=this.items[e],n=this._itemData.get(t),{x:i,y:o}=t.position,s=n.positionX,l=n.positionY;i===s&&o===l||(n.directionX=i>s?p.right:i<s?p.left:n.directionX,n.directionY=o>l?p.down:o<l?p.up:n.directionY,n.positionX=i,n.positionY=o,n.overlapCheckRequestTime===0&&(n.overlapCheckRequestTime=this._tickTime))}}_updateRequests(){let e=this.items,t=this._requests[h.x],n=this._requests[h.y],i=0;for(;i<e.length;i++){let o=e[i],s=this._itemData.get(o),l=s.overlapCheckRequestTime,c=l>0&&this._tickTime-l>this.settings.overlapCheckInterval,a=!0,d=t.get(o);d&&d.isActive&&(a=!this._updateScrollRequest(d),a&&(c=!0,this._cancelItemScroll(o,h.x)));let u=!0,v=n.get(o);v&&v.isActive&&(u=!this._updateScrollRequest(v),u&&(c=!0,this._cancelItemScroll(o,h.y))),c&&(s.overlapCheckRequestTime=0,this._checkItemOverlap(o,a,u))}}_requestAction(e,t){let n=t===h.x,i=null,o=0;for(;o<this._actions.length;o++){if(i=this._actions[o],e.element!==i.element){i=null;continue}if(n?i.requestX:i.requestY){this._cancelItemScroll(e.item,t);return}break}i||(i=this._actionPool.pick()),i.element=e.element,i.addRequest(e),e.tick(this._tickDeltaTime),this._actions.push(i)}_updateActions(){let e=0;for(e=0;e<this.items.length;e++){let t=this.items[e],n=this._requests[h.x].get(t),i=this._requests[h.y].get(t);n&&this._requestAction(n,h.x),i&&this._requestAction(i,h.y)}for(e=0;e<this._actions.length;e++)this._actions[e].computeScrollValues()}_applyActions(){if(!this._actions.length)return;this._emitter.emit("beforescroll");let e=0;for(e=0;e<this._actions.length;e++)this._actions[e].scroll(),this._actionPool.put(this._actions[e]);this._actions.length=0;let t;for(e=0;e<this.items.length;e++)t=this.items[e],t.onPrepareScrollEffect&&t.onPrepareScrollEffect();for(e=0;e<this.items.length;e++)t=this.items[e],t.onApplyScrollEffect&&t.onApplyScrollEffect();this._emitter.emit("afterscroll")}on(e,t){return this._emitter.on(e,t)}off(e,t){this._emitter.off(e,t)}addItem(e){if(this._isDestroyed||this._itemData.has(e))return;let{x:t,y:n}=e.position,i=new Le;i.positionX=t,i.positionY=n,i.directionX=p.none,i.directionY=p.none,i.overlapCheckRequestTime=this._tickTime,this._itemData.set(e,i),this.items.push(e),this._isTicking||this._startTicking()}removeItem(e){if(this._isDestroyed)return;let t=this.items.indexOf(e);t!==-1&&(this._requests[h.x].get(e)&&(this._cancelItemScroll(e,h.x),this._requests[h.x].delete(e)),this._requests[h.y].get(e)&&(this._cancelItemScroll(e,h.y),this._requests[h.y].delete(e)),this._itemData.delete(e),this.items.splice(t,1),this._isTicking&&!this.items.length&&this._stopTicking())}isDestroyed(){return this._isDestroyed}isItemScrollingX(e){return!!this._requests[h.x].get(e)?.isActive}isItemScrollingY(e){return!!this._requests[h.y].get(e)?.isActive}isItemScrolling(e){return this.isItemScrollingX(e)||this.isItemScrollingY(e)}updateSettings(e={}){let{overlapCheckInterval:t=this.settings.overlapCheckInterval}=e;this.settings.overlapCheckInterval=t}destroy(){if(this._isDestroyed)return;let e=this.items.slice(0),t=0;for(;t<e.length;t++)this.removeItem(e[t]);this._actions.length=0,this._requestPool.reset(),this._actionPool.reset(),this._emitter.off(),this._isDestroyed=!0}};var Me=new ae;var $={x:0,y:0},L={left:0,top:0,width:0,height:0};function yt(){return{targets:[],inertAreaSize:.2,speed:st(),smoothStop:!1,getPosition:r=>{let{drag:e}=r,t=e?.items[0];if(t)$.x=t.pX,$.y=t.pY;else{let n=e&&(e.nextMoveEvent||e.startEvent);$.x=n?n.x:0,$.y=n?n.y:0}return $},getClientRect:r=>{let{drag:e}=r,t=e?.items[0];if(t&&t.element){let{left:n,top:i,width:o,height:s}=t.element.getBoundingClientRect();L.left=n,L.top=i,L.width=o,L.height=s}else{let n=e&&(e.nextMoveEvent||e.startEvent);L.left=n?n.x-25:0,L.top=n?n.y-25:0,L.width=n?50:0,L.height=n?50:0}return L},onStart:null,onStop:null}}var We=class{constructor(e,t){this._draggableAutoScroll=e,this._draggable=t,this._position={x:0,y:0},this._clientRect={left:0,top:0,width:0,height:0}}_getSettings(){return this._draggableAutoScroll.settings}get targets(){let{targets:e}=this._getSettings();return typeof e=="function"&&(e=e(this._draggable)),e}get position(){let{getPosition:e}=this._getSettings();if(typeof e=="function"){let t=e(this._draggable);this._position.x=t.x,this._position.y=t.y}else this._position.x=0,this._position.y=0;return this._position}get clientRect(){let{getClientRect:e}=this._getSettings();if(typeof e=="function"){let{left:t,top:n,width:i,height:o}=e(this._draggable);this._clientRect.left=t,this._clientRect.top=n,this._clientRect.width=i,this._clientRect.height=o}else this._clientRect.left=0,this._clientRect.top=0,this._clientRect.width=0,this._clientRect.height=0;return this._clientRect}get inertAreaSize(){return this._getSettings().inertAreaSize}get smoothStop(){return this._getSettings().smoothStop}get speed(){return this._getSettings().speed}get onStart(){return this._getSettings().onStart}get onStop(){return this._getSettings().onStop}onPrepareScrollEffect(){let e=this._draggable._updateId;m.off(E,e),m.off(_,e),this._draggable._preparePositionUpdate()}onApplyScrollEffect(){this._draggable._applyPositionUpdate()}},Xe=class{constructor(e,t={}){this.name="autoscroll",this.version="0.0.2",this.settings=this._parseSettings(t),this._autoScrollProxy=null,e.on("start",()=>{this._autoScrollProxy||(this._autoScrollProxy=new We(this,e),Me.addItem(this._autoScrollProxy))}),e.on("beforeend",()=>{this._autoScrollProxy&&(Me.removeItem(this._autoScrollProxy),this._autoScrollProxy=null)})}_parseSettings(e,t=yt()){let{targets:n=t.targets,inertAreaSize:i=t.inertAreaSize,speed:o=t.speed,smoothStop:s=t.smoothStop,getPosition:l=t.getPosition,getClientRect:c=t.getClientRect,onStart:a=t.onStart,onStop:d=t.onStop}=e||{};return{targets:n,inertAreaSize:i,speed:o,smoothStop:s,getPosition:l,getClientRect:c,onStart:a,onStop:d}}updateSettings(e={}){this.settings=this._parseSettings(e,this.settings)}};function Lr(r){return e=>{let t=new Xe(e,r),n=e;return n.plugins[t.name]=t,n}}var at=new Set(["auto","scroll","overlay"]);function le(r){let e=y(r);return!!(at.has(e.overflowY)||at.has(e.overflowX))}function lt(r,e=[]){let t=r?.parentNode;for(;t&&!M(t);)t instanceof Element?(le(t)&&e.push(t),t=t.parentNode):t instanceof ShadowRoot?t=t.host:t=t.parentNode;return e.push(window),e}function bt(r){let e=[];return le(r)&&e.push(r),lt(r,e),e}function Br(r={}){let e,t=0,n=null,i,{timeout:o=250,fallback:s=()=>!0}=r,l=d=>d.preventDefault(),c=d=>{if(t){if(e){d.cancelable&&d.preventDefault();return}e===void 0&&(d.cancelable&&d.timeStamp-t>o?(e=!0,d.preventDefault()):e=!1)}};return d=>{if(!(d.sensor instanceof U))return s(d);let{draggable:u,sensor:v,event:f}=d,x=f;if(x.pointerType==="touch"){if(x.type==="start"&&(x.srcEvent.type==="pointerdown"||x.srcEvent.type==="touchstart")){n=x.target;let O=n?bt(n):[];O.forEach(g=>{g.addEventListener("touchmove",c,{passive:!1,capture:!0})});let D=()=>{t&&(u.off("beforeend",D),u.sensors.forEach(g=>{g instanceof U&&g.off("end",D)}),n?.removeEventListener("contextmenu",l),O.forEach(g=>{g.removeEventListener("touchmove",c,{capture:!0})}),t=0,e=void 0,n=null,i=void window.clearTimeout(i))};e=void 0,t=x.srcEvent.timeStamp,n?.addEventListener("contextmenu",l),u.on("beforeend",D),u.sensors.forEach(g=>{g instanceof U&&g.off("end",D)}),o>0&&(i=window.setTimeout(()=>{u.resolveStartPredicate(v),e=!0,i=void 0},o))}return e}return x.type==="start"&&!x.srcEvent.button}}export{h as AUTO_SCROLL_AXIS,X as AUTO_SCROLL_AXIS_DIRECTION,p as AUTO_SCROLL_DIRECTION,ae as AutoScroll,Z as BaseMotionSensor,N as BaseSensor,Ze as Draggable,Xe as DraggableAutoScroll,ze as KeyboardMotionSensor,Ge as KeyboardSensor,U as PointerSensor,S as SensorEventType,Me as autoScroll,Lr as autoScrollPlugin,st as autoScrollSmoothSpeed,Br as createPointerSensorStartPredicate,Lt as setTicker,m as ticker,E as tickerReadPhase,_ as tickerWritePhase};
