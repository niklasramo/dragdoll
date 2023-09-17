function getOrCreateEventData(e,t){let i=e.get(t);return i||(i=new EventData,e.set(t,i)),i}class EventData{constructor(){this.idMap=new Map,this.fnMap=new Map,this.onceList=new Set,this.emitList=null}add(e,t,i,s,n){if(!n&&this.fnMap.has(e))throw new Error("Emitter: tried to add an existing event listener to an event!");if(this.idMap.has(i))switch(s){case"throw":throw new Error("Emitter: tried to add an existing event listener id to an event!");case"ignore":return i;default:this.delId(i,"update"===s)}let r=this.fnMap.get(e);return r||(r=new Set,this.fnMap.set(e,r)),r.add(i),this.idMap.set(i,e),t&&this.onceList.add(i),this.emitList&&this.emitList.push(e),i}delId(e,t=!1){const i=this.idMap.get(e);if(!i)return;const s=this.fnMap.get(i);t||this.idMap.delete(e),this.onceList.delete(e),s.delete(e),s.size||this.fnMap.delete(i),this.emitList=null}delFn(e){const t=this.fnMap.get(e);t&&(t.forEach((e=>{this.onceList.delete(e),this.idMap.delete(e)})),this.fnMap.delete(e),this.emitList=null)}}class Emitter{constructor(e={}){const{idDedupeMode:t="replace",allowDuplicateListeners:i=!0}=e;this.idDedupeMode=t,this.allowDuplicateListeners=i,this._events=new Map}_getListeners(e){const t=this._events.get(e);if(!t)return null;const{idMap:i,onceList:s}=t;if(!i.size)return null;const n=t.emitList||[...i.values()];if(s.size)if(s.size===i.size)this._events.delete(e);else for(const e of s)t.delId(e);else t.emitList=n;return n}on(e,t,i=Symbol()){return getOrCreateEventData(this._events,e).add(t,!1,i,this.idDedupeMode,this.allowDuplicateListeners)}once(e,t,i=Symbol()){return getOrCreateEventData(this._events,e).add(t,!0,i,this.idDedupeMode,this.allowDuplicateListeners)}off(e,t){if(void 0===e)return void this._events.clear();if(void 0===t)return void this._events.delete(e);const i=this._events.get(e);i&&("function"==typeof t?i.delFn(t):i.delId(t),i.idMap.size||this._events.delete(e))}emit(e,...t){const i=this._getListeners(e);if(!i)return;let s=0,n=i.length;for(;s<n;s++)i[s](...t)}listenerCount(e){var t;if(void 0===e){let e=0;return this._events.forEach(((t,i)=>{e+=this.listenerCount(i)})),e}return(null===(t=this._events.get(e))||void 0===t?void 0:t.idMap.size)||0}}export{Emitter};