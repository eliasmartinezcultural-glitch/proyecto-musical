let activeTabId=null;
let creating=null;
async function ensureOffscreen(){
 const url=chrome.runtime.getURL("offscreen.html");
 const contexts=await chrome.runtime.getContexts({contextTypes:["OFFSCREEN_DOCUMENT"],documentUrls:[url]});
 if(contexts.length)return;
 if(!creating){creating=chrome.offscreen.createDocument({url:"offscreen.html",reasons:["USER_MEDIA"],justification:"Capturar el audio de la pestaña de la Sala para cambiar su tono en tiempo real sin descargarlo."});}
 try{await creating}finally{creating=null}
}
async function notifyTab(tabId,active,message=""){
 if(!tabId)return;
 try{await chrome.tabs.sendMessage(tabId,{type:"SALA_CAPTURE_STATUS",active,message})}catch(e){}
}
chrome.action.onClicked.addListener(async tab=>{
 if(!tab?.id)return;
 try{
  const streamId=await chrome.tabCapture.getMediaStreamId({targetTabId:tab.id});
  await ensureOffscreen();
  activeTabId=tab.id;
  await chrome.runtime.sendMessage({target:"offscreen",type:"START_CAPTURE",streamId});
  await notifyTab(tab.id,true,"Motor de audio activado. El sonido de esta pestaña pasa por el transpositor.");
 }catch(error){
  await notifyTab(tab.id,false,"No se pudo activar la captura: "+(error?.message||"revisá los permisos de Chrome"));
 }
});
chrome.runtime.onMessage.addListener((msg,sender,sendResponse)=>{
 if(msg?.target==="offscreen")return;
 if(msg?.target==="background"&&msg.type==="ENGINE_READY"){notifyTab(activeTabId,true,"Motor de audio listo. Ajustá los semitonos desde la Sala.");return;}
 if(msg?.target==="background"&&msg.type==="ENGINE_ERROR"){notifyTab(activeTabId,false,"No se pudo iniciar el motor: "+(msg.message||"error de audio"));return;}
 if(msg?.type==="SALA_PITCH"){
  chrome.runtime.sendMessage({target:"offscreen",type:"SET_PITCH",semitones:Number(msg.semitones)||0});
  sendResponse({ok:true});
  return;
 }
 if(msg?.type==="SALA_STOP"){
  chrome.runtime.sendMessage({target:"offscreen",type:"STOP_CAPTURE"});
  const old=activeTabId;activeTabId=null;notifyTab(old,false,"Transposición de audio detenida.");
  sendResponse({ok:true});return;
 }
 if(msg?.type==="SALA_STATUS"){
  sendResponse({active:activeTabId!==null});return;
 }
});
chrome.tabs.onRemoved.addListener(tabId=>{if(tabId===activeTabId){chrome.runtime.sendMessage({target:"offscreen",type:"STOP_CAPTURE"});activeTabId=null}});
