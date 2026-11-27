let activeTabId=null,creating=null;
async function ensureOffscreen(){
 const url=chrome.runtime.getURL("offscreen.html");
 const contexts=await chrome.runtime.getContexts({contextTypes:["OFFSCREEN_DOCUMENT"],documentUrls:[url]});
 if(contexts.length)return;
 if(!creating)creating=chrome.offscreen.createDocument({url:"offscreen.html",reasons:["USER_MEDIA"],justification:"Procesar el audio de la pestaña activa para cambiar el tono dentro de la Sala de Ensayo."});
 try{await creating}finally{creating=null}
}
async function notifyTab(tabId,active,message=""){
 if(!tabId)return;
 try{await chrome.tabs.sendMessage(tabId,{type:"SALA_CAPTURE_STATUS",active,message})}catch(e){}
}
async function stopCapture(tabId,message="Transposición detenida."){
 try{await chrome.runtime.sendMessage({target:"offscreen",type:"STOP_CAPTURE"})}catch(e){}
 const old=tabId??activeTabId;activeTabId=null;await notifyTab(old,false,message)
}
chrome.action.onClicked.addListener(async tab=>{
 if(!tab?.id)return;
 try{
  const captured=await chrome.tabCapture.getCapturedTabs();
  const already=captured.find(x=>x.tabId===tab.id&&x.status==="active");
  if(already){await stopCapture(tab.id,"Motor detenido. El audio vuelve al modo normal.");return}
  if(captured.length)await stopCapture(captured[0].tabId,"Cambiando la pestaña procesada…");
  await ensureOffscreen();
  const streamId=await chrome.tabCapture.getMediaStreamId({targetTabId:tab.id});
  activeTabId=tab.id;
  await chrome.runtime.sendMessage({target:"offscreen",type:"START_CAPTURE",streamId});
  await notifyTab(tab.id,true,"Captura solicitada. Preparando el motor de transposición…");
 }catch(error){activeTabId=null;await notifyTab(tab.id,false,"No se pudo activar el motor: "+(error?.message||"revisá permisos y compatibilidad de Chrome"))}
});
chrome.runtime.onMessage.addListener((msg,sender,sendResponse)=>{
 if(msg?.target==="offscreen")return;
 if(msg?.target==="background"&&msg.type==="ENGINE_READY"){notifyTab(activeTabId,true,"Motor de audio listo. Ajustá los semitonos desde la Sala.");return}
 if(msg?.target==="background"&&msg.type==="ENGINE_ERROR"){notifyTab(activeTabId,false,"No se pudo iniciar el motor: "+(msg.message||"error de audio"));activeTabId=null;return}
 if(msg?.type==="SALA_PITCH"){chrome.runtime.sendMessage({target:"offscreen",type:"SET_PITCH",semitones:Number(msg.semitones)||0}).catch(()=>{});sendResponse({ok:true});return}
 if(msg?.type==="SALA_STOP"){stopCapture(activeTabId,"Motor detenido desde la Sala.");sendResponse({ok:true});return}
 if(msg?.type==="SALA_STATUS"){chrome.tabCapture.getCapturedTabs().then(tabs=>sendResponse({active:tabs.some(t=>t.status==="active")})).catch(()=>sendResponse({active:false}));return true}
});
chrome.tabs.onRemoved.addListener(tabId=>{if(tabId===activeTabId)stopCapture(tabId,"Pestaña cerrada.")});
