let context=null,stream=null,source=null,shifter=null;
async function start(streamId){
 await stop();
 stream=await navigator.mediaDevices.getUserMedia({audio:{mandatory:{chromeMediaSource:"tab",chromeMediaSourceId:streamId}},video:false});
 context=new AudioContext();
 await context.audioWorklet.addModule(chrome.runtime.getURL("pitch-worklet.js"));
 source=context.createMediaStreamSource(stream);
 shifter=new AudioWorkletNode(context,"ocarina-pitch-shifter",{numberOfInputs:1,numberOfOutputs:1,outputChannelCount:[2]});
 source.connect(shifter);shifter.connect(context.destination);
 await context.resume();
 chrome.runtime.sendMessage({target:"background",type:"ENGINE_READY"});
}
async function stop(){
 try{source?.disconnect();shifter?.disconnect()}catch(e){}
 if(stream)stream.getTracks().forEach(track=>track.stop());
 if(context&&context.state!=="closed")await context.close();
 context=null;stream=null;source=null;shifter=null;
}
chrome.runtime.onMessage.addListener((msg,sender,sendResponse)=>{
 if(msg?.target!=="offscreen")return;
 if(msg.type==="START_CAPTURE"){start(msg.streamId).catch(async error=>{await stop();chrome.runtime.sendMessage({target:"background",type:"ENGINE_ERROR",message:error?.message||"Error de captura"})})}
 if(msg.type==="SET_PITCH"&&shifter&&context){const p=shifter.parameters.get("semitones");p.setTargetAtTime(Number(msg.semitones)||0,context.currentTime,.035)}
 if(msg.type==="STOP_CAPTURE")stop();
});
