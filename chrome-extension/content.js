window.addEventListener("message",event=>{
 if(event.source!==window||!event.data||event.data.source!=="ocarina-sala")return;
 const data=event.data;
 if(data.type==="SET_PITCH")chrome.runtime.sendMessage({type:"SALA_PITCH",semitones:data.semitones});
 if(data.type==="STOP")chrome.runtime.sendMessage({type:"SALA_STOP"});
 if(data.type==="STATUS")chrome.runtime.sendMessage({type:"SALA_STATUS"},result=>window.postMessage({source:"ocarina-transpose",type:"STATUS",active:!!result?.active},"*"));
});
chrome.runtime.onMessage.addListener(message=>{
 if(message?.type==="SALA_CAPTURE_STATUS")window.postMessage({source:"ocarina-transpose",type:"STATUS",active:!!message.active,message:message.message||""},"*");
});
