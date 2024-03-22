var y={start:"start",move:"move",cancel:"cancel",end:"end",destroy:"destroy"};import{Emitter as tt}from"eventti";var W=class{constructor(){this.drag=null,this.isDestroyed=!1,this._emitter=new tt}_createDragData(e){return{x:e.x,y:e.y}}_updateDragData(e){this.drag&&(this.drag.x=e.x,this.drag.y=e.y)}_resetDragData(){this.drag=null}_start(e){this.isDestroyed||this.drag||(this.drag=this._createDragData(e),this._emitter.emit(y.start,e))}_move(e){this.drag&&(this._updateDragData(e),this._emitter.emit(y.move,e))}_end(e){this.drag&&(this._updateDragData(e),this._emitter.emit(y.end,e),this._resetDragData())}_cancel(e){this.drag&&(this._updateDragData(e),this._emitter.emit(y.cancel,e),this._resetDragData())}on(e,t,n){return this._emitter.on(e,t,n)}off(e,t){this._emitter.off(e,t)}cancel(){this.drag&&(this._emitter.emit(y.cancel,{type:y.cancel,x:this.drag.x,y:this.drag.y}),this._resetDragData())}destroy(){this.isDestroyed||(this.isDestroyed=!0,this.cancel(),this._emitter.emit(y.destroy,{type:y.destroy}),this._emitter.off())}};import{AutoTicker as nt}from"tikki";var E=Symbol(),D=Symbol(),u=new nt({phases:[E,D]});function Ct(r,e,t){E=e,D=t,u=r}var $=class extends W{constructor(){super(),this.drag=null,this._direction={x:0,y:0},this._speed=0,this._tick=this._tick.bind(this)}_createDragData(e){return{...super._createDragData(e),time:0,deltaTime:0}}_start(e){this.isDestroyed||this.drag||(super._start(e),u.on(E,this._tick,this._tick))}_end(e){this.drag&&(u.off(E,this._tick),super._end(e))}_cancel(e){this.drag&&(u.off(E,this._tick),super._cancel(e))}_tick(e){if(this.drag)if(e&&this.drag.time){this.drag.deltaTime=e-this.drag.time,this.drag.time=e;let t={type:"tick",time:this.drag.time,deltaTime:this.drag.deltaTime};if(this._emitter.emit("tick",t),!this.drag)return;let n=this._speed*(this.drag.deltaTime/1e3),i=this._direction.x*n,o=this._direction.y*n;(i||o)&&this._move({type:"move",x:this.drag.x+i,y:this.drag.y+o})}else this.drag.time=e,this.drag.deltaTime=0}};import{Emitter as rt}from"eventti";function he(r,e){if("pointerId"in r)return r.pointerId===e?r:null;if("changedTouches"in r){let t=0;for(;t<r.changedTouches.length;t++)if(r.changedTouches[t].identifier===e)return r.changedTouches[t];return null}return r}function Ke(r){return"pointerType"in r?r.pointerType:"touches"in r?"touch":"mouse"}function Oe(r){return"pointerId"in r?r.pointerId:"changedTouches"in r?r.changedTouches[0]?r.changedTouches[0].identifier:null:-1}var me=typeof window<"u"&&typeof window.document<"u",J=(()=>{let r=!1;try{let e=Object.defineProperty({},"passive",{get:function(){r=!0}});window.addEventListener("testPassive",null,e),window.removeEventListener("testPassive",null,e)}catch{}return r})(),Me=me&&"ontouchstart"in window,We=me&&!!window.PointerEvent,Nt=!!(me&&navigator.vendor&&navigator.vendor.indexOf("Apple")>-1&&navigator.userAgent&&navigator.userAgent.indexOf("CriOS")==-1&&navigator.userAgent.indexOf("FxiOS")==-1);function ue(r={}){let{capture:e=!0,passive:t=!0}=r;return J?{capture:e,passive:t}:{capture:e}}function pe(r){return r==="auto"||r===void 0?We?"pointer":Me?"touch":"mouse":r}var it={start:"pointerdown",move:"pointermove",cancel:"pointercancel",end:"pointerup"},ot={start:"touchstart",move:"touchmove",cancel:"touchcancel",end:"touchend"},st={start:"mousedown",move:"mousemove",cancel:"",end:"mouseup"},q={pointer:it,touch:ot,mouse:st},X=class{constructor(e,t={}){let{listenerOptions:n={},sourceEvents:i="auto",startPredicate:o=s=>!("button"in s&&s.button>0)}=t;this.element=e,this.drag=null,this.isDestroyed=!1,this._areWindowListenersBound=!1,this._startPredicate=o,this._listenerOptions=ue(n),this._sourceEvents=pe(i),this._emitter=new rt,this._onStart=this._onStart.bind(this),this._onMove=this._onMove.bind(this),this._onCancel=this._onCancel.bind(this),this._onEnd=this._onEnd.bind(this),e.addEventListener(q[this._sourceEvents].start,this._onStart,this._listenerOptions)}_getTrackedPointerEventData(e){return this.drag?he(e,this.drag.pointerId):null}_onStart(e){if(this.isDestroyed||this.drag||!this._startPredicate(e))return;let t=Oe(e);if(t===null)return;let n=he(e,t);if(n===null)return;let i={pointerId:t,pointerType:Ke(e),x:n.clientX,y:n.clientY};this.drag=i;let o={...i,type:y.start,srcEvent:e,target:n.target};this._emitter.emit(o.type,o),this.drag&&this._bindWindowListeners()}_onMove(e){if(!this.drag)return;let t=this._getTrackedPointerEventData(e);if(!t)return;this.drag.x=t.clientX,this.drag.y=t.clientY;let n={type:y.move,srcEvent:e,target:t.target,...this.drag};this._emitter.emit(n.type,n)}_onCancel(e){if(!this.drag)return;let t=this._getTrackedPointerEventData(e);if(!t)return;this.drag.x=t.clientX,this.drag.y=t.clientY;let n={type:y.cancel,srcEvent:e,target:t.target,...this.drag};this._emitter.emit(n.type,n),this._resetDrag()}_onEnd(e){if(!this.drag)return;let t=this._getTrackedPointerEventData(e);if(!t)return;this.drag.x=t.clientX,this.drag.y=t.clientY;let n={type:y.end,srcEvent:e,target:t.target,...this.drag};this._emitter.emit(n.type,n),this._resetDrag()}_bindWindowListeners(){if(this._areWindowListenersBound)return;let{move:e,end:t,cancel:n}=q[this._sourceEvents];window.addEventListener(e,this._onMove,this._listenerOptions),window.addEventListener(t,this._onEnd,this._listenerOptions),n&&window.addEventListener(n,this._onCancel,this._listenerOptions),this._areWindowListenersBound=!0}_unbindWindowListeners(){if(this._areWindowListenersBound){let{move:e,end:t,cancel:n}=q[this._sourceEvents];window.removeEventListener(e,this._onMove,this._listenerOptions),window.removeEventListener(t,this._onEnd,this._listenerOptions),n&&window.removeEventListener(n,this._onCancel,this._listenerOptions),this._areWindowListenersBound=!1}}_resetDrag(){this.drag=null,this._unbindWindowListeners()}cancel(){if(!this.drag)return;let e={type:y.cancel,srcEvent:null,target:null,...this.drag};this._emitter.emit(e.type,e),this._resetDrag()}updateSettings(e){if(this.isDestroyed)return;let{listenerOptions:t,sourceEvents:n,startPredicate:i}=e,o=pe(n),s=ue(t);i&&this._startPredicate!==i&&(this._startPredicate=i),(t&&(this._listenerOptions.capture!==s.capture||this._listenerOptions.passive===s.passive)||n&&this._sourceEvents!==o)&&(this.element.removeEventListener(q[this._sourceEvents].start,this._onStart,this._listenerOptions),this._unbindWindowListeners(),this.cancel(),n&&(this._sourceEvents=o),t&&s&&(this._listenerOptions=s),this.element.addEventListener(q[this._sourceEvents].start,this._onStart,this._listenerOptions))}on(e,t,n){return this._emitter.on(e,t,n)}off(e,t){this._emitter.off(e,t)}destroy(){this.isDestroyed||(this.isDestroyed=!0,this.cancel(),this._emitter.emit(y.destroy,{type:y.destroy}),this._emitter.off(),this.element.removeEventListener(q[this._sourceEvents].start,this._onStart,this._listenerOptions))}};var qe=class extends W{constructor(e={}){super();let{moveDistance:t=25,startPredicate:n=l=>{if((l.key==="Enter"||l.key===" ")&&document.activeElement&&document.activeElement!==document.body){let{left:a,top:c}=document.activeElement.getBoundingClientRect();return{x:a,y:c}}return null},movePredicate:i=(l,a,c)=>{if(!a.drag)return null;switch(l.key){case"ArrowLeft":return{x:a.drag.x-c.x,y:a.drag.y};case"ArrowRight":return{x:a.drag.x+c.x,y:a.drag.y};case"ArrowUp":return{x:a.drag.x,y:a.drag.y-c.y};case"ArrowDown":return{x:a.drag.x,y:a.drag.y+c.y};default:return null}},cancelPredicate:o=(l,a)=>a.drag&&l.key==="Escape"?{x:a.drag.x,y:a.drag.y}:null,endPredicate:s=(l,a)=>a.drag&&(l.key==="Enter"||l.key===" ")?{x:a.drag.x,y:a.drag.y}:null}=e;this._moveDistance=typeof t=="number"?{x:t,y:t}:{...t},this._startPredicate=n,this._movePredicate=i,this._cancelPredicate=o,this._endPredicate=s,this.cancel=this.cancel.bind(this),this._onKeyDown=this._onKeyDown.bind(this),document.addEventListener("keydown",this._onKeyDown),window.addEventListener("blur",this.cancel),window.addEventListener("visibilitychange",this.cancel)}_onKeyDown(e){if(!this.drag){let o=this._startPredicate(e,this,this._moveDistance);o&&(e.preventDefault(),this._start({type:"start",x:o.x,y:o.y,srcEvent:e}));return}let t=this._cancelPredicate(e,this,this._moveDistance);if(t){e.preventDefault(),this._cancel({type:"cancel",x:t.x,y:t.y,srcEvent:e});return}let n=this._endPredicate(e,this,this._moveDistance);if(n){e.preventDefault(),this._end({type:"end",x:n.x,y:n.y,srcEvent:e});return}let i=this._movePredicate(e,this,this._moveDistance);if(i){e.preventDefault(),this._move({type:"move",x:i.x,y:i.y,srcEvent:e});return}}updateSettings(e={}){e.moveDistance!==void 0&&(typeof e.moveDistance=="number"?(this._moveDistance.x=e.moveDistance,this._moveDistance.y=e.moveDistance):(this._moveDistance.x=e.moveDistance.x,this._moveDistance.y=e.moveDistance.y)),e.startPredicate!==void 0&&(this._startPredicate=e.startPredicate),e.movePredicate!==void 0&&(this._movePredicate=e.movePredicate),e.cancelPredicate!==void 0&&(this._cancelPredicate=e.cancelPredicate),e.endPredicate!==void 0&&(this._endPredicate=e.endPredicate)}destroy(){this.isDestroyed||(super.destroy(),document.removeEventListener("keydown",this._onKeyDown),window.removeEventListener("blur",this.cancel),window.removeEventListener("visibilitychange",this.cancel))}};var at=["start","cancel","end","moveLeft","moveRight","moveUp","moveDown"];function Q(r,e){if(!r.size||!e.size)return 1/0;let t=1/0;for(let n of r){let i=e.get(n);i!==void 0&&i<t&&(t=i)}return t}var Xe=class extends ${constructor(e={}){super();let{startPredicate:t=()=>{if(document.activeElement){let{left:m,top:b}=document.activeElement.getBoundingClientRect();return{x:m,y:b}}return null},computeSpeed:n=()=>500,startKeys:i=[" ","Enter"],moveLeftKeys:o=["ArrowLeft"],moveRightKeys:s=["ArrowRight"],moveUpKeys:l=["ArrowUp"],moveDownKeys:a=["ArrowDown"],cancelKeys:c=["Escape"],endKeys:d=[" ","Enter"]}=e;this._computeSpeed=n,this._startPredicate=t,this._startKeys=new Set(i),this._cancelKeys=new Set(c),this._endKeys=new Set(d),this._moveLeftKeys=new Set(o),this._moveRightKeys=new Set(s),this._moveUpKeys=new Set(l),this._moveDownKeys=new Set(a),this._moveKeys=new Set([...o,...s,...l,...a]),this._moveKeyTimestamps=new Map,this._onKeyDown=this._onKeyDown.bind(this),this._onKeyUp=this._onKeyUp.bind(this),this._onTick=this._onTick.bind(this),this.on("tick",this._onTick,this._onTick),document.addEventListener("keydown",this._onKeyDown),document.addEventListener("keyup",this._onKeyUp),window.addEventListener("blur",this.cancel),window.addEventListener("visibilitychange",this.cancel)}_end(e){this.drag&&(this._moveKeyTimestamps.clear(),this._direction.x=0,this._direction.y=0,super._end(e))}_cancel(e){this.drag&&(this._moveKeyTimestamps.clear(),this._direction.x=0,this._direction.y=0,super._cancel(e))}_updateDirection(){let e=Q(this._moveLeftKeys,this._moveKeyTimestamps),t=Q(this._moveRightKeys,this._moveKeyTimestamps),n=Q(this._moveUpKeys,this._moveKeyTimestamps),i=Q(this._moveDownKeys,this._moveKeyTimestamps),o=e===t?0:e<t?-1:1,s=n===i?0:n<i?-1:1;if(!(o===0||s===0)){let l=1/(Math.sqrt(o*o+s*s)||1);o*=l,s*=l}this._direction.x=o,this._direction.y=s}_onTick(){this._speed=this._computeSpeed(this)}_onKeyUp(e){this._moveKeyTimestamps.get(e.key)&&(this._moveKeyTimestamps.delete(e.key),this._updateDirection())}_onKeyDown(e){if(!this.drag){if(this._startKeys.has(e.key)){let t=this._startPredicate(e,this);t&&(e.preventDefault(),this._start({type:"start",x:t.x,y:t.y}))}return}if(this._cancelKeys.has(e.key)){e.preventDefault(),this._cancel({type:"cancel",x:this.drag.x,y:this.drag.y});return}if(this._endKeys.has(e.key)){e.preventDefault(),this._end({type:"end",x:this.drag.x,y:this.drag.y});return}if(this._moveKeys.has(e.key)){e.preventDefault(),this._moveKeyTimestamps.get(e.key)||(this._moveKeyTimestamps.set(e.key,Date.now()),this._updateDirection());return}}updateSettings(e={}){let t=!1;if(e.startPredicate!==void 0&&(this._startPredicate=e.startPredicate),e.computeSpeed!==void 0&&(this._computeSpeed=e.computeSpeed),at.forEach((n,i)=>{let o=`${n}Keys`,s=e[o];s!==void 0&&(this[`_${o}`]=new Set(s),i>=3&&(t=!0))}),t){let n=[...this._moveLeftKeys,...this._moveRightKeys,...this._moveUpKeys,...this._moveDownKeys];[...this._moveKeys].every((o,s)=>n[s]===o)||(this._moveKeys=new Set(n),this._moveKeyTimestamps.clear(),this._updateDirection())}}destroy(){this.isDestroyed||(super.destroy(),this.off("tick",this._onTick),document.removeEventListener("keydown",this._onKeyDown),document.removeEventListener("keyup",this._onKeyUp),window.removeEventListener("blur",this.cancel),window.removeEventListener("visibilitychange",this.cancel))}};import{Emitter as ht}from"eventti";var Z=class{constructor(e,t){this.sensor=e,this.isEnded=!1,this.event=t,this.prevEvent=t,this.startEvent=t,this.endEvent=null,this.items=[]}};import{getOffsetContainer as Ve}from"mezr";var Ne=new WeakMap;function ee(r){let e=Ne.get(r)?.deref();return e||(e=window.getComputedStyle(r,null),Ne.set(r,new WeakRef(e))),e}import{getOffset as Ye}from"mezr";function te(r,e,t={left:0,top:0}){if(t.left=0,t.top=0,r===e)return t;let n=Ye([r,"padding"]),i=Ye([e,"padding"]);return t.left=i.left-n.left,t.top=i.top-n.top,t}var lt={left:0,top:0},ct="matrix(1, 0, 0, 1, 0, 0)",dt="matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",ne=class{constructor(e,t){if(!e.isConnected)throw new Error("Element is not connected");let n=t.drag?.sensor;if(!n)throw new Error("Sensor is not defined");let i=this,o=ee(e),s=e.getBoundingClientRect();this.data={},this.element=e,this.frozenProps=null,this.unfrozenProps=null,this.position={x:0,y:0},this._updateDiff={x:0,y:0},this._moveDiff={x:0,y:0},this._containerDiff={x:0,y:0};let l=e.parentElement;if(!l)throw new Error("Element does not have a parent element.");this.elementContainer=l;let a=Ve(e);if(!a)throw new Error("Offset container could not be computed for the element!");this.elementOffsetContainer=a;let c=t.settings.container||l;this.dragContainer=c;let d=c===l?a:Ve(e,{container:c});if(!d)throw new Error("Drag offset container could not be computed for the element!");this.dragOffsetContainer=d;{let{left:_,top:p,width:g,height:x}=s;this.clientRect={left:_,top:p,width:g,height:x}}if(a!==d){let{left:_,top:p}=te(d,a,lt);this._containerDiff.x=_,this._containerDiff.y=p}let{transform:m}=o;m&&m!=="none"&&m!==ct&&m!==dt?this.initialTransform=m:this.initialTransform="";let{x:b,y:v}=t.settings.getStartPosition({draggable:t,sensor:n,item:i,style:o});this.position.x=b,this.position.y=v;let S=t.settings.getFrozenProps({draggable:t,sensor:n,item:i,style:o});if(Array.isArray(S))if(S.length){let _={};for(let p of S)_[p]=o[p];this.frozenProps=_}else this.frozenProps=null;else this.frozenProps=S;if(this.frozenProps){let _={};for(let p in this.frozenProps)this.frozenProps.hasOwnProperty(p)&&(_[p]=e.style[p]);this.unfrozenProps=_}}updateSize(e){if(e)this.clientRect.width=e.width,this.clientRect.height=e.height;else{let t=this.element.getBoundingClientRect();this.clientRect.width=t.width,this.clientRect.height=t.height}}};var Ue=J?{capture:!0,passive:!0}:!0,mt={left:0,top:0},fe={x:0,y:0};function ut(){return{container:null,startPredicate:()=>!0,getElements:()=>null,releaseElements:()=>null,getFrozenProps:()=>null,getStartPosition:()=>({x:0,y:0}),setPosition:({item:r,x:e,y:t})=>{r.element.style.transform=`translate(${e}px, ${t}px) ${r.initialTransform}`},getPositionChange:({event:r,prevEvent:e})=>(fe.x=r.x-e.x,fe.y=r.y-e.y,fe)}}var ze=class{constructor(e,t={}){this.sensors=e,this.settings=this._parseSettings(t),this.plugins={},this.drag=null,this.isDestroyed=!1,this._sensorData=new Map,this._emitter=new ht,this._startId=Symbol(),this._moveId=Symbol(),this._updateId=Symbol(),this._onMove=this._onMove.bind(this),this._onScroll=this._onScroll.bind(this),this._onEnd=this._onEnd.bind(this),this._prepareStart=this._prepareStart.bind(this),this._applyStart=this._applyStart.bind(this),this._prepareMove=this._prepareMove.bind(this),this._applyMove=this._applyMove.bind(this),this._preparePositionUpdate=this._preparePositionUpdate.bind(this),this._applyPositionUpdate=this._applyPositionUpdate.bind(this),this.sensors.forEach(n=>{this._sensorData.set(n,{predicateState:0,predicateEvent:null,onMove:s=>this._onMove(s,n),onEnd:s=>this._onEnd(s,n)});let{onMove:i,onEnd:o}=this._sensorData.get(n);n.on("start",i,i),n.on("move",i,i),n.on("cancel",o,o),n.on("end",o,o),n.on("destroy",o,o)})}_parseSettings(e,t=ut()){let{container:n=t.container,startPredicate:i=t.startPredicate,getElements:o=t.getElements,releaseElements:s=t.releaseElements,getFrozenProps:l=t.getFrozenProps,getStartPosition:a=t.getStartPosition,setPosition:c=t.setPosition,getPositionChange:d=t.getPositionChange}=e||{};return{container:n,startPredicate:i,getElements:o,releaseElements:s,getFrozenProps:l,getStartPosition:a,setPosition:c,getPositionChange:d}}_emit(e,...t){this._emitter.emit(e,...t)}_onMove(e,t){let n=this._sensorData.get(t);if(n)switch(n.predicateState){case 0:{n.predicateEvent=e;let i=this.settings.startPredicate({draggable:this,sensor:t,event:e});i===!0?this.resolveStartPredicate(t):i===!1&&this.rejectStartPredicate(t);break}case 1:{this.drag&&(this.drag.event=e,u.once(E,this._prepareMove,this._moveId),u.once(D,this._applyMove,this._moveId));break}}}_onScroll(){this.updatePosition()}_onEnd(e,t){let n=this._sensorData.get(t);n&&(this.drag?n.predicateState===1&&(this.drag.endEvent=e,this._sensorData.forEach(i=>{i.predicateState=0,i.predicateEvent=null}),this.stop()):(n.predicateState=0,n.predicateEvent=null))}_prepareStart(){let e=this.drag;if(!e)return;let t=this.settings.getElements({draggable:this,sensor:e.sensor,startEvent:e.startEvent})||[];e.items=t.map(n=>new ne(n,this)),this._emit("preparestart",e.startEvent)}_applyStart(){let e=this.drag;if(!e)return;let{container:t}=this.settings;for(let n of e.items)t&&n.element.parentElement!==t&&(t.appendChild(n.element),n.position.x+=n._containerDiff.x,n.position.y+=n._containerDiff.y),n.frozenProps&&Object.assign(n.element.style,n.frozenProps),this.settings.setPosition({phase:"start",draggable:this,sensor:e.sensor,item:n,x:n.position.x,y:n.position.y});window.addEventListener("scroll",this._onScroll,Ue),this._emit("start",e.startEvent)}_prepareMove(){let e=this.drag;if(!e)return;let{event:t,prevEvent:n,startEvent:i,sensor:o}=e;if(t!==n){for(let s of e.items){let{x:l,y:a}=this.settings.getPositionChange({draggable:this,sensor:o,item:s,event:t,prevEvent:n,startEvent:i});l&&(s.position.x+=l,s.clientRect.left+=l,s._moveDiff.x+=l),a&&(s.position.y+=a,s.clientRect.top+=a,s._moveDiff.y+=a)}e.prevEvent=t,this._emit("preparemove",t)}}_applyMove(){let e=this.drag;if(e){for(let t of e.items)t._moveDiff.x=0,t._moveDiff.y=0,this.settings.setPosition({phase:"move",draggable:this,sensor:e.sensor,item:t,x:t.position.x,y:t.position.y});e.event&&this._emit("move",e.event)}}_preparePositionUpdate(){let{drag:e}=this;if(e)for(let t of e.items){if(t.elementOffsetContainer!==t.dragOffsetContainer){let{left:c,top:d}=te(t.dragOffsetContainer,t.elementOffsetContainer,mt);t._containerDiff.x=c,t._containerDiff.y=d}let{left:n,top:i,width:o,height:s}=t.element.getBoundingClientRect(),l=t.clientRect.left-t._moveDiff.x-n;t.position.x=t.position.x-t._updateDiff.x+l,t._updateDiff.x=l;let a=t.clientRect.top-t._moveDiff.y-i;t.position.y=t.position.y-t._updateDiff.y+a,t._updateDiff.y=a,t.clientRect.width=o,t.clientRect.height=s}}_applyPositionUpdate(){let{drag:e}=this;if(e)for(let t of e.items)t._updateDiff.x=0,t._updateDiff.y=0,this.settings.setPosition({phase:"move",draggable:this,sensor:e.sensor,item:t,x:t.position.x,y:t.position.y})}on(e,t,n){return this._emitter.on(e,t,n)}off(e,t){this._emitter.off(e,t)}resolveStartPredicate(e,t){let n=this._sensorData.get(e);if(!n)return;let i=t||n.predicateEvent;n.predicateState===0&&i&&(n.predicateState=1,n.predicateEvent=null,this.drag=new Z(e,i),this._sensorData.forEach((o,s)=>{s!==e&&(o.predicateState=2,o.predicateEvent=null)}),u.once(E,this._prepareStart,this._startId),u.once(D,this._applyStart,this._startId))}rejectStartPredicate(e){let t=this._sensorData.get(e);t?.predicateState===0&&(t.predicateState=2,t.predicateEvent=null)}stop(){let e=this.drag;if(!e||e.isEnded)return;e.isEnded=!0,u.off(E,this._startId),u.off(D,this._startId),u.off(E,this._moveId),u.off(D,this._moveId),u.off(E,this._updateId),u.off(D,this._updateId),window.removeEventListener("scroll",this._onScroll,Ue);let t=[];for(let n of e.items){if(t.push(n.element),n.elementContainer&&n.element.parentElement!==n.elementContainer&&(n.position.x-=n._containerDiff.x,n.position.y-=n._containerDiff.y,n._containerDiff.x=0,n._containerDiff.y=0,n.elementContainer.appendChild(n.element)),n.unfrozenProps)for(let i in n.unfrozenProps)n.element.style[i]=n.unfrozenProps[i]||"";this.settings.setPosition({phase:"end",draggable:this,sensor:e.sensor,item:n,x:n.position.x,y:n.position.y})}t.length&&this.settings.releaseElements({draggable:this,sensor:e.sensor,elements:t}),this._emit("end",e.endEvent),this.drag=null}updatePosition(e=!1){this.drag&&(e?(this._preparePositionUpdate(),this._applyPositionUpdate()):(u.once(E,this._preparePositionUpdate,this._updateId),u.once(D,this._applyPositionUpdate,this._updateId)))}updateSettings(e={}){this.settings=this._parseSettings(e,this.settings)}use(e){return e(this)}destroy(){this.isDestroyed||(this.isDestroyed=!0,this.stop(),this._sensorData.forEach(({onMove:e,onEnd:t},n)=>{n.off("start",e),n.off("move",e),n.off("cancel",t),n.off("end",t),n.off("destroy",t)}),this._sensorData.clear(),this._emit("destroy"),this._emitter.off())}};import{Emitter as ft}from"eventti";import{getDistance as gt,getRect as He}from"mezr";var B=class{constructor(e,t){this._data=[],this._createObject=e,this._onPut=t}pick(){return this._data.length?this._data.pop():this._createObject()}put(e){this._data.indexOf(e)===-1&&(this._onPut&&this._onPut(e),this._data.push(e))}reset(){this._data.length=0}};import{getIntersection as pt}from"mezr";function Be(r,e){let t=pt(r,e);return t?t.width*t.height:0}function ge(r,e){let t=Be(r,e);if(!t)return 0;let n=Math.min(r.width,e.width)*Math.min(r.height,e.height);return t/n*100}function w(r){return r instanceof Window}function Se(r){return w(r)||r===document.documentElement||r===document.body?window:r}function N(r){return w(r)?r.pageXOffset:r.scrollLeft}function Ee(r){return w(r)&&(r=document.documentElement),r.scrollWidth-r.clientWidth}function Y(r){return w(r)?r.pageYOffset:r.scrollTop}function ve(r){return w(r)&&(r=document.documentElement),r.scrollHeight-r.clientHeight}function _e(r,e){return!(r.right<=e.left||e.right<=r.left||r.bottom<=e.top||e.bottom<=r.top)}var xe={width:0,height:0,left:0,right:0,top:0,bottom:0},Ge={...xe},Fe=50,I={direction:"none",threshold:0,distance:0,value:0,maxValue:0,duration:0,speed:0,deltaTime:0,isEnding:!1},h={x:1,y:2},O={forward:4,reverse:8},re={none:0,left:h.x|O.reverse,right:h.x|O.forward},H={none:0,up:h.y|O.reverse,down:h.y|O.forward},f={...re,...H};function ye(r){switch(r){case re.none:case H.none:return"none";case re.left:return"left";case re.right:return"right";case H.up:return"up";case H.down:return"down";default:throw new Error(`Unknown direction value: ${r}`)}}function je(r,e,t){let{left:n=0,right:i=0,top:o=0,bottom:s=0}=e;return n=Math.max(0,n),i=Math.max(0,i),o=Math.max(0,o),s=Math.max(0,s),t.width=r.width+n+i,t.height=r.height+o+s,t.left=r.left-n,t.top=r.top-o,t.right=r.right+i,t.bottom=r.bottom+s,t}function ie(r,e){return Math.ceil(r)>=Math.floor(e)}function be(r,e){return Math.min(e/2,r)}function De(r,e,t,n){return Math.max(0,t+r*2+n*e-n)/2}var Pe=class{constructor(){this.positionX=0,this.positionY=0,this.directionX=f.none,this.directionY=f.none,this.overlapCheckRequestTime=0}},Te=class{constructor(){this.element=null,this.requestX=null,this.requestY=null,this.scrollLeft=0,this.scrollTop=0}reset(){this.requestX&&(this.requestX.action=null),this.requestY&&(this.requestY.action=null),this.element=null,this.requestX=null,this.requestY=null,this.scrollLeft=0,this.scrollTop=0}addRequest(e){h.x&e.direction?(this.requestX&&this.removeRequest(this.requestX),this.requestX=e):(this.requestY&&this.removeRequest(this.requestY),this.requestY=e),e.action=this}removeRequest(e){this.requestX===e?(this.requestX=null,e.action=null):this.requestY===e&&(this.requestY=null,e.action=null)}computeScrollValues(){this.element&&(this.scrollLeft=this.requestX?this.requestX.value:N(this.element),this.scrollTop=this.requestY?this.requestY.value:Y(this.element))}scroll(){this.element&&(this.element.scrollTo?this.element.scrollTo(this.scrollLeft,this.scrollTop):(this.element.scrollLeft=this.scrollLeft,this.element.scrollTop=this.scrollTop))}},we=class{constructor(){this.item=null,this.element=null,this.isActive=!1,this.isEnding=!1,this.direction=0,this.value=NaN,this.maxValue=0,this.threshold=0,this.distance=0,this.deltaTime=0,this.speed=0,this.duration=0,this.action=null}reset(){this.isActive&&this.onStop(),this.item=null,this.element=null,this.isActive=!1,this.isEnding=!1,this.direction=0,this.value=NaN,this.maxValue=0,this.threshold=0,this.distance=0,this.deltaTime=0,this.speed=0,this.duration=0,this.action=null}hasReachedEnd(){return O.forward&this.direction?ie(this.value,this.maxValue):this.value<=0}computeCurrentScrollValue(){return this.element?this.value!==this.value?h.x&this.direction?N(this.element):Y(this.element):Math.max(0,Math.min(this.value,this.maxValue)):0}computeNextScrollValue(){let e=this.speed*(this.deltaTime/1e3),t=O.forward&this.direction?this.value+e:this.value-e;return Math.max(0,Math.min(t,this.maxValue))}computeSpeed(){if(!this.item||!this.element)return 0;let{speed:e}=this.item;return typeof e=="function"?(I.direction=ye(this.direction),I.threshold=this.threshold,I.distance=this.distance,I.value=this.value,I.maxValue=this.maxValue,I.duration=this.duration,I.speed=this.speed,I.deltaTime=this.deltaTime,I.isEnding=this.isEnding,e(this.element,I)):e}tick(e){return this.isActive||(this.isActive=!0,this.onStart()),this.deltaTime=e,this.value=this.computeCurrentScrollValue(),this.speed=this.computeSpeed(),this.value=this.computeNextScrollValue(),this.duration+=e,this.value}onStart(){if(!this.item||!this.element)return;let{onStart:e}=this.item;typeof e=="function"&&e(this.element,ye(this.direction))}onStop(){if(!this.item||!this.element)return;let{onStop:e}=this.item;typeof e=="function"&&e(this.element,ye(this.direction))}};function $e(r=500,e=.5,t=.25){let n=r*(e>0?1/e:1/0),i=r*(t>0?1/t:1/0);return function(o,s){let l=0;if(!s.isEnding)if(s.threshold>0){let d=s.threshold-Math.max(0,s.distance);l=r/s.threshold*d}else l=r;let a=s.speed;if(a===l)return l;let c=l;return a<l?(c=a+n*(s.deltaTime/1e3),Math.min(l,c)):(c=a-i*(s.deltaTime/1e3),Math.max(l,c))}}var oe=class{constructor(e={}){let{overlapCheckInterval:t=150}=e;this.items=[],this.settings={overlapCheckInterval:t},this._actions=[],this._isDestroyed=!1,this._isTicking=!1,this._tickTime=0,this._tickDeltaTime=0,this._requests={[h.x]:new Map,[h.y]:new Map},this._itemData=new Map,this._requestPool=new B(()=>new we,n=>n.reset()),this._actionPool=new B(()=>new Te,n=>n.reset()),this._emitter=new ft,this._frameRead=this._frameRead.bind(this),this._frameWrite=this._frameWrite.bind(this)}_frameRead(e){this._isDestroyed||(e&&this._tickTime?(this._tickDeltaTime=e-this._tickTime,this._tickTime=e,this._updateItems(),this._updateRequests(),this._updateActions()):(this._tickTime=e,this._tickDeltaTime=0))}_frameWrite(){this._isDestroyed||this._applyActions()}_startTicking(){this._isTicking||(this._isTicking=!0,u.on(E,this._frameRead,this._frameRead),u.on(D,this._frameWrite,this._frameWrite))}_stopTicking(){this._isTicking&&(this._isTicking=!1,this._tickTime=0,this._tickDeltaTime=0,u.off(E,this._frameRead),u.off(D,this._frameWrite))}_getItemClientRect(e,t={width:0,height:0,left:0,right:0,top:0,bottom:0}){let{clientRect:n}=e;return t.left=n.left,t.top=n.top,t.width=n.width,t.height=n.height,t.right=n.left+n.width,t.bottom=n.top+n.height,t}_requestItemScroll(e,t,n,i,o,s,l){let a=this._requests[t],c=a.get(e);c?(c.element!==n||c.direction!==i)&&c.reset():(c=this._requestPool.pick(),a.set(e,c)),c.item=e,c.element=n,c.direction=i,c.threshold=o,c.distance=s,c.maxValue=l}_cancelItemScroll(e,t){let n=this._requests[t],i=n.get(e);i&&(i.action&&i.action.removeRequest(i),this._requestPool.put(i),n.delete(e))}_checkItemOverlap(e,t,n){let{inertAreaSize:i,targets:o}=e;if(!o.length){t&&this._cancelItemScroll(e,h.x),n&&this._cancelItemScroll(e,h.y);return}let s=this._itemData.get(e),l=s?.directionX,a=s?.directionY;if(!l&&!a){t&&this._cancelItemScroll(e,h.x),n&&this._cancelItemScroll(e,h.y);return}let c=this._getItemClientRect(e,xe),d=null,m=-1/0,b=0,v=-1/0,S=f.none,_=0,p=0,g=null,x=-1/0,V=0,U=-1/0,ae=f.none,Ce=0,Re=0,le=0;for(;le<o.length;le++){let A=o[le],Le=typeof A.threshold=="number"?A.threshold:Fe,ce=!!(t&&l&&A.axis!=="y"),de=!!(n&&a&&A.axis!=="x"),K=A.priority||0;if((!ce||K<m)&&(!de||K<x))continue;let k=Se(A.element||A),F=ce?Ee(k):-1,j=de?ve(k):-1;if(F<=0&&j<=0)continue;let P=He([k,"padding"],window),M=ge(c,P)||-1/0;if(M===-1/0)if(A.padding&&_e(c,je(P,A.padding,Ge)))M=-(gt(c,P)||0);else continue;if(ce&&K>=m&&F>0&&(K>m||M>v)){let T=0,C=f.none,R=be(Le,P.width),z=De(R,i,c.width,P.width);l===f.right?(T=P.right+z-c.right,T<=R&&!ie(N(k),F)&&(C=f.right)):l===f.left&&(T=c.left-(P.left-z),T<=R&&N(k)>0&&(C=f.left)),C&&(d=k,m=K,b=R,v=M,S=C,_=T,p=F)}if(de&&K>=x&&j>0&&(K>x||M>U)){let T=0,C=H.none,R=be(Le,P.height),z=De(R,i,c.height,P.height);a===f.down?(T=P.bottom+z-c.bottom,T<=R&&!ie(Y(k),j)&&(C=f.down)):a===f.up&&(T=c.top-(P.top-z),T<=R&&Y(k)>0&&(C=f.up)),C&&(g=k,x=K,V=R,U=M,ae=C,Ce=T,Re=j)}}t&&(d&&S?this._requestItemScroll(e,h.x,d,S,b,_,p):this._cancelItemScroll(e,h.x)),n&&(g&&ae?this._requestItemScroll(e,h.y,g,ae,V,Ce,Re):this._cancelItemScroll(e,h.y))}_updateScrollRequest(e){let t=e.item,{inertAreaSize:n,smoothStop:i,targets:o}=t,s=this._getItemClientRect(t,xe),l=null,a=0;for(;a<o.length;a++){let c=o[a],d=Se(c.element||c);if(d!==e.element)continue;let m=!!(h.x&e.direction);if(m){if(c.axis==="y")continue}else if(c.axis==="x")continue;let b=m?Ee(d):ve(d);if(b<=0)break;let v=He([d,"padding"],window);if((ge(s,v)||-1/0)===-1/0){let U=c.scrollPadding||c.padding;if(!(U&&_e(s,je(v,U,Ge))))break}let _=typeof c.threshold=="number"?c.threshold:Fe,p=be(_,m?v.width:v.height),g=De(p,n,m?s.width:s.height,m?v.width:v.height),x=0;if(e.direction===f.left?x=s.left-(v.left-g):e.direction===f.right?x=v.right+g-s.right:e.direction===f.up?x=s.top-(v.top-g):x=v.bottom+g-s.bottom,x>p)break;let V=m?N(d):Y(d);if(l=O.forward&e.direction?ie(V,b):V<=0,l)break;return e.maxValue=b,e.threshold=p,e.distance=x,e.isEnding=!1,!0}return i===!0&&e.speed>0?(l===null&&(l=e.hasReachedEnd()),e.isEnding=!l):e.isEnding=!1,e.isEnding}_updateItems(){for(let e=0;e<this.items.length;e++){let t=this.items[e],n=this._itemData.get(t),{x:i,y:o}=t.position,s=n.positionX,l=n.positionY;i===s&&o===l||(n.directionX=i>s?f.right:i<s?f.left:n.directionX,n.directionY=o>l?f.down:o<l?f.up:n.directionY,n.positionX=i,n.positionY=o,n.overlapCheckRequestTime===0&&(n.overlapCheckRequestTime=this._tickTime))}}_updateRequests(){let e=this.items,t=this._requests[h.x],n=this._requests[h.y],i=0;for(;i<e.length;i++){let o=e[i],s=this._itemData.get(o),l=s.overlapCheckRequestTime,a=l>0&&this._tickTime-l>this.settings.overlapCheckInterval,c=!0,d=t.get(o);d&&d.isActive&&(c=!this._updateScrollRequest(d),c&&(a=!0,this._cancelItemScroll(o,h.x)));let m=!0,b=n.get(o);b&&b.isActive&&(m=!this._updateScrollRequest(b),m&&(a=!0,this._cancelItemScroll(o,h.y))),a&&(s.overlapCheckRequestTime=0,this._checkItemOverlap(o,c,m))}}_requestAction(e,t){let n=t===h.x,i=null,o=0;for(;o<this._actions.length;o++){if(i=this._actions[o],e.element!==i.element){i=null;continue}if(n?i.requestX:i.requestY){this._cancelItemScroll(e.item,t);return}break}i||(i=this._actionPool.pick()),i.element=e.element,i.addRequest(e),e.tick(this._tickDeltaTime),this._actions.push(i)}_updateActions(){let e=0;for(e=0;e<this.items.length;e++){let t=this.items[e],n=this._requests[h.x].get(t),i=this._requests[h.y].get(t);n&&this._requestAction(n,h.x),i&&this._requestAction(i,h.y)}for(e=0;e<this._actions.length;e++)this._actions[e].computeScrollValues()}_applyActions(){if(!this._actions.length)return;this._emitter.emit("beforescroll");let e=0;for(e=0;e<this._actions.length;e++)this._actions[e].scroll(),this._actionPool.put(this._actions[e]);this._actions.length=0;let t;for(e=0;e<this.items.length;e++)t=this.items[e],t.onPrepareScrollEffect&&t.onPrepareScrollEffect();for(e=0;e<this.items.length;e++)t=this.items[e],t.onApplyScrollEffect&&t.onApplyScrollEffect();this._emitter.emit("afterscroll")}on(e,t,n){return this._emitter.on(e,t,n)}off(e,t){this._emitter.off(e,t)}addItem(e){if(this._isDestroyed||this._itemData.has(e))return;let{x:t,y:n}=e.position,i=new Pe;i.positionX=t,i.positionY=n,i.directionX=f.none,i.directionY=f.none,i.overlapCheckRequestTime=this._tickTime,this._itemData.set(e,i),this.items.push(e),this._isTicking||this._startTicking()}removeItem(e){if(this._isDestroyed)return;let t=this.items.indexOf(e);t!==-1&&(this._requests[h.x].get(e)&&(this._cancelItemScroll(e,h.x),this._requests[h.x].delete(e)),this._requests[h.y].get(e)&&(this._cancelItemScroll(e,h.y),this._requests[h.y].delete(e)),this._itemData.delete(e),this.items.splice(t,1),this._isTicking&&!this.items.length&&this._stopTicking())}isDestroyed(){return this._isDestroyed}isItemScrollingX(e){return!!this._requests[h.x].get(e)?.isActive}isItemScrollingY(e){return!!this._requests[h.y].get(e)?.isActive}isItemScrolling(e){return this.isItemScrollingX(e)||this.isItemScrollingY(e)}updateSettings(e={}){let{overlapCheckInterval:t=this.settings.overlapCheckInterval}=e;this.settings.overlapCheckInterval=t}destroy(){if(this._isDestroyed)return;let e=this.items.slice(0),t=0;for(;t<e.length;t++)this.removeItem(e[t]);this._actions.length=0,this._requestPool.reset(),this._actionPool.reset(),this._emitter.off(),this._isDestroyed=!0}};var Ie=new oe;var G={x:0,y:0},L={left:0,top:0,width:0,height:0};function St(){return{targets:[],inertAreaSize:.2,speed:$e(),smoothStop:!1,getPosition:r=>{let{drag:e}=r,t=e?.items[0];if(t)G.x=t.position.x,G.y=t.position.y;else{let n=e&&(e.event||e.startEvent);G.x=n?n.x:0,G.y=n?n.y:0}return G},getClientRect:r=>{let{drag:e}=r,t=e?.items[0];if(t&&t.element){let{left:n,top:i,width:o,height:s}=t.clientRect;L.left=n,L.top=i,L.width=o,L.height=s}else{let n=e&&(e.event||e.startEvent);L.left=n?n.x-25:0,L.top=n?n.y-25:0,L.width=n?50:0,L.height=n?50:0}return L},onStart:null,onStop:null}}var Ae=class{constructor(e,t){this._draggableAutoScroll=e,this._draggable=t,this._position={x:0,y:0},this._clientRect={left:0,top:0,width:0,height:0}}_getSettings(){return this._draggableAutoScroll.settings}get targets(){let{targets:e}=this._getSettings();return typeof e=="function"&&(e=e(this._draggable)),e}get position(){let{getPosition:e}=this._getSettings();if(typeof e=="function"){let t=e(this._draggable);this._position.x=t.x,this._position.y=t.y}else this._position.x=0,this._position.y=0;return this._position}get clientRect(){let{getClientRect:e}=this._getSettings();if(typeof e=="function"){let{left:t,top:n,width:i,height:o}=e(this._draggable);this._clientRect.left=t,this._clientRect.top=n,this._clientRect.width=i,this._clientRect.height=o}else this._clientRect.left=0,this._clientRect.top=0,this._clientRect.width=0,this._clientRect.height=0;return this._clientRect}get inertAreaSize(){return this._getSettings().inertAreaSize}get smoothStop(){return this._getSettings().smoothStop}get speed(){return this._getSettings().speed}get onStart(){return this._getSettings().onStart}get onStop(){return this._getSettings().onStop}onPrepareScrollEffect(){let e=this._draggable._updateId;u.off(E,e),u.off(D,e),this._draggable._preparePositionUpdate()}onApplyScrollEffect(){this._draggable._applyPositionUpdate()}},ke=class{constructor(e,t={}){this.name="autoscroll",this.version="0.0.2",this.settings=this._parseSettings(t),this._autoScrollProxy=null,e.on("start",()=>{this._autoScrollProxy||(this._autoScrollProxy=new Ae(this,e),Ie.addItem(this._autoScrollProxy))}),e.on("end",()=>{this._autoScrollProxy&&(Ie.removeItem(this._autoScrollProxy),this._autoScrollProxy=null)})}_parseSettings(e,t=St()){let{targets:n=t.targets,inertAreaSize:i=t.inertAreaSize,speed:o=t.speed,smoothStop:s=t.smoothStop,getPosition:l=t.getPosition,getClientRect:a=t.getClientRect,onStart:c=t.onStart,onStop:d=t.onStop}=e||{};return{targets:n,inertAreaSize:i,speed:o,smoothStop:s,getPosition:l,getClientRect:a,onStart:c,onStop:d}}updateSettings(e={}){this.settings=this._parseSettings(e,this.settings)}};function fr(r){return e=>{let t=new ke(e,r),n=e;return n.plugins[t.name]=t,n}}var Je=new Set(["auto","scroll","overlay"]);function se(r){let e=ee(r);return!!(Je.has(e.overflowY)||Je.has(e.overflowX))}function Qe(r){return r instanceof Document}function Ze(r,e=[]){let t=r?.parentNode;for(;t&&!Qe(t);)t instanceof Element?(se(t)&&e.push(t),t=t.parentNode):t instanceof ShadowRoot?t=t.host:t=t.parentNode;return e.push(window),e}function Et(r){let e=[];return se(r)&&e.push(r),Ze(r,e),e}function wr(r={}){let e,t=0,n=null,i,{timeout:o=250,fallback:s=()=>!0}=r,l=d=>d.preventDefault(),a=d=>{if(t){if(e){d.cancelable&&d.preventDefault();return}e===void 0&&(d.cancelable&&d.timeStamp-t>o?(e=!0,d.preventDefault()):e=!1)}};return d=>{if(!(d.sensor instanceof X))return s(d);let{draggable:m,sensor:b,event:v}=d,S=v;if(S.pointerType==="touch"){if(S.type==="start"&&(S.srcEvent.type==="pointerdown"||S.srcEvent.type==="touchstart")){n=S.target;let _=n?Et(n):[];_.forEach(g=>{g.addEventListener("touchmove",a,{passive:!1,capture:!0})});let p=()=>{t&&(m.off("end",p),m.sensors.forEach(g=>{g instanceof X&&g.off("end",p)}),n?.removeEventListener("contextmenu",l),_.forEach(g=>{g.removeEventListener("touchmove",a,{capture:!0})}),t=0,e=void 0,n=null,i=void window.clearTimeout(i))};e=void 0,t=S.srcEvent.timeStamp,n?.addEventListener("contextmenu",l),m.on("end",p),m.sensors.forEach(g=>{g instanceof X&&g.off("end",p)}),o>0&&(i=window.setTimeout(()=>{m.resolveStartPredicate(b),e=!0,i=void 0},o))}return e}return S.type==="start"&&!S.srcEvent.button}}function vt(r,e){return Math.round(r/e)*e}function et(r,e,t){let n=t-e,i=Math.abs(n);if(i>=r){let o=i%r;return vt(n>0?n-o:n+o,r)}return 0}function Ar(r,e){return function({startEvent:n,event:i,item:o}){let{__snapX__:s=n.x,__snapY__:l=n.y}=o.data,a=et(r,s,i.x),c=et(e,l,i.y);return a&&(o.data.__snapX__=s+a),c&&(o.data.__snapY__=l+c),{x:a,y:c}}}export{h as AUTO_SCROLL_AXIS,O as AUTO_SCROLL_AXIS_DIRECTION,f as AUTO_SCROLL_DIRECTION,oe as AutoScroll,$ as BaseMotionSensor,W as BaseSensor,ze as Draggable,ke as DraggableAutoScroll,Xe as KeyboardMotionSensor,qe as KeyboardSensor,X as PointerSensor,y as SensorEventType,Ie as autoScroll,fr as autoScrollPlugin,$e as autoScrollSmoothSpeed,wr as createPointerSensorStartPredicate,Ar as createSnapModifier,Ct as setTicker,u as ticker,E as tickerReadPhase,D as tickerWritePhase};
