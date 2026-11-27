/* Sala de ensayo · reproductor online */
const ytDefaultSources={
1:{id:"GeKJUSyJeXM",start:0,label:"Pepo Lara · canal Topic"},
3:{id:"hSKldnxWmds",start:0,label:"Video oficial de Omega"},
4:{id:"JcWl4PcGGYc",start:0,label:"Referencia publicada por Canal 13 San Juan"},
5:{id:"oNYCq9MuJME",start:0,label:"Video oficial de Omega ft. Monada"},
9:{id:"_1dHFBsq6ic",start:0,label:"Presentación en vivo · Un Poco de Ruido"},
10:{id:"_1dHFBsq6ic",start:886,label:"Presentación en vivo · Un Poco de Ruido"}
};
let ytUserSources={};try{ytUserSources=JSON.parse(localStorage.getItem("em_online_sources")||"{}")}catch(e){}
let ytPlayer=null,ytApiReady=false,ytSelectedId=null,ytLoopA=null,ytLoopB=null,ytLoopOn=false,ytLoopTimer=null,ytTickTimer=null,ytPendingAutoplay=false;
function ytAllSources(){return {...ytDefaultSources,...ytUserSources}}
function ytSong(id){return catalogSongs.find(s=>s.id===Number(id))}
function ytSource(id){return ytAllSources()[String(id)]||ytAllSources()[id]||null}
function ytFormat(t){t=Math.max(0,Math.floor(Number(t)||0));return Math.floor(t/60)+":"+String(t%60).padStart(2,"0")}
function ytExtractId(raw){try{const u=new URL(raw);if(u.hostname.includes("youtu.be"))return u.pathname.split("/").filter(Boolean)[0]||null;if(u.hostname.includes("youtube.com")||u.hostname.includes("youtube-nocookie.com")){if(u.searchParams.get("v"))return u.searchParams.get("v");const p=u.pathname.split("/").filter(Boolean);if(["embed","shorts","live"].includes(p[0]))return p[1]||null}}catch(e){}return null}
function ytSetStatus(t){const el=document.getElementById("ytStatus");if(el)el.textContent=t}
function renderOnlinePlayer(){
 const list=document.getElementById("ytSongList");if(!list)return;
 const sources=ytAllSources(),available=catalogSongs.filter(s=>sources[s.id]);
 document.getElementById("ytSourceCount").textContent=available.length+" de "+catalogSongs.length+" con enlace";
 list.innerHTML=catalogSongs.map(s=>{const src=sources[s.id];return '<div class="onlineSong"><div class="row" style="justify-content:space-between"><div style="min-width:0"><b>'+s.id+'. '+esc(s.title)+'</b><div class="small muted">'+esc(s.artist)+' · '+(src?"Fuente conectada":"Falta conectar fuente")+'</div></div><button class="btn '+(src?"":"secondary")+'" onclick="ytSelectSong('+s.id+')">'+(src?"Escuchar":"Conectar") +'</button></div></div>'}).join("");
 if(!ytSelectedId&&available.length)ytSelectSong(available[0].id,false);
 if(ytSelectedId){const s=ytSong(ytSelectedId);if(s){document.getElementById("ytSongTitle").textContent=s.title;document.getElementById("ytSongArtist").textContent=s.artist;}}
}
function ytEnsurePlayer(source,autoplay){
 if(!source)return;if(!ytApiReady){ytPendingAutoplay=autoplay;ytSetStatus("Cargando reproductor de YouTube…");return}
 const start=Number(source.start)||0;
 if(ytPlayer&&typeof ytPlayer.loadVideoById==="function"){if(autoplay)ytPlayer.loadVideoById({videoId:source.id,startSeconds:start});else ytPlayer.cueVideoById({videoId:source.id,startSeconds:start});return}
 ytPendingAutoplay=autoplay;
 ytPlayer=new YT.Player("ytPlayer",{width:"100%",height:"100%",videoId:source.id,playerVars:{playsinline:1,rel:0,start:start,origin:location.origin},events:{
 onReady:()=>{ytPlayer.setVolume(Number(document.getElementById("ytVolume")?.value||80));if(ytPendingAutoplay)ytPlayer.playVideo();else ytSetStatus("Listo para reproducir");ytStartTicker()},
 onStateChange:e=>{const labels={"-1":"Preparando","0":"Finalizado","1":"Reproduciendo","2":"En pausa","3":"Cargando","5":"Listo"};ytSetStatus(labels[e.data]||"Estado de reproducción");const b=document.getElementById("ytPlayBtn");if(b)b.textContent=e.data===1?"Ⅱ":"▶"},
 onError:e=>ytSetStatus("YouTube no permite reproducir esta versión aquí (error "+e.data+"). Probá otro enlace oficial.")
 }});
}
function ytSelectSong(id,autoplay=true){
 const s=ytSong(id);if(!s)return;ytSelectedId=id;ytLoopOn=false;ytLoopA=null;ytLoopB=null;if(ytLoopTimer)clearInterval(ytLoopTimer);ytUpdateLoopLabel();
 document.getElementById("ytSongTitle").textContent=s.title;document.getElementById("ytSongArtist").textContent=s.artist;
 const src=ytSource(id);if(!src){if(ytPlayer?.stopVideo)ytPlayer.stopVideo();ytSetStatus("Esta canción todavía no tiene un enlace conectado.");document.getElementById("ytUrlInput").value="";document.getElementById("ytStartInput").value="0";return}
 document.getElementById("ytUrlInput").value="https://www.youtube.com/watch?v="+src.id;document.getElementById("ytStartInput").value=src.start||0;ytEnsurePlayer(src,autoplay);
}
function ytTogglePlay(){if(!ytPlayer||!ytApiReady){ytSetStatus("Elegí una canción y esperá que cargue el reproductor.");return}const state=ytPlayer.getPlayerState();if(state===1)ytPlayer.pauseVideo();else ytPlayer.playVideo()}
function ytNextSong(direction){const available=catalogSongs.filter(s=>ytSource(s.id));if(!available.length)return;let i=available.findIndex(s=>s.id===Number(ytSelectedId));i=(i+direction+available.length)%available.length;ytSelectSong(available[i].id,true)}
function ytSeekBy(n){if(ytPlayer?.getCurrentTime)ytPlayer.seekTo(Math.max(0,ytPlayer.getCurrentTime()+n),true)}
function ytPreviewSeek(v){const d=ytPlayer?.getDuration?.()||0;document.getElementById("ytCurrent").textContent=ytFormat(d*(Number(v)/1000))}
function ytCommitSeek(v){if(ytPlayer?.getDuration)ytPlayer.seekTo(ytPlayer.getDuration()*(Number(v)/1000),true)}
function ytMarkA(){if(!ytPlayer?.getCurrentTime)return;ytLoopA=ytPlayer.getCurrentTime();if(ytLoopB!==null&&ytLoopB<=ytLoopA)ytLoopB=null;ytUpdateLoopLabel()}
function ytMarkB(){if(!ytPlayer?.getCurrentTime)return;const t=ytPlayer.getCurrentTime();if(ytLoopA===null)ytLoopA=0;if(t<=ytLoopA){ytSetStatus("El final B debe estar después del inicio A.");return}ytLoopB=t;ytUpdateLoopLabel()}
function ytUpdateLoopLabel(){const info=document.getElementById("ytLoopInfo");if(info)info.textContent=ytLoopA===null?"Repetición A–B desactivada":"A "+ytFormat(ytLoopA)+(ytLoopB===null?" · falta marcar B":" → B "+ytFormat(ytLoopB))+(ytLoopOn?" · ACTIVA":"")}
function ytToggleAB(){if(ytLoopOn){ytLoopOn=false;clearInterval(ytLoopTimer);ytUpdateLoopLabel();return}if(ytLoopA===null||ytLoopB===null||ytLoopB<=ytLoopA){ytSetStatus("Marcá primero el inicio A y el final B.");return}ytLoopOn=true;ytLoopTimer=setInterval(()=>{if(ytPlayer?.getCurrentTime&&ytPlayer.getCurrentTime()>=ytLoopB)ytPlayer.seekTo(ytLoopA,true)},180);ytUpdateLoopLabel();ytPlayer.playVideo()}
function ytSetRate(rate){if(!ytPlayer?.setPlaybackRate){ytSetStatus("El reproductor todavía no está listo.");return}const n=Number(rate),allowed=ytPlayer.getAvailablePlaybackRates?.()||[1];if(!allowed.includes(n)){ytSetStatus("Esta versión no admite "+n+"×. Velocidades disponibles: "+allowed.join(", "));document.getElementById("ytRate").value=String(ytPlayer.getPlaybackRate?.()||1);return}ytPlayer.setPlaybackRate(n);ytSetStatus("Velocidad solicitada: "+n+"×")}
function ytSetVolume(v){if(ytPlayer?.setVolume)ytPlayer.setVolume(Number(v))}
function ytJumpTo(v){if(v!==""&&ytPlayer?.seekTo)ytPlayer.seekTo(Number(v),true);document.getElementById("ytJump").value=""}
function ytStartTicker(){if(ytTickTimer)clearInterval(ytTickTimer);ytTickTimer=setInterval(()=>{if(!ytPlayer?.getCurrentTime)return;const t=ytPlayer.getCurrentTime(),d=ytPlayer.getDuration()||0;document.getElementById("ytCurrent").textContent=ytFormat(t);document.getElementById("ytDuration").textContent=ytFormat(d);document.getElementById("ytSeek").value=d?Math.round(t/d*1000):0},400)}
function ytSearchCurrent(){const s=ytSong(ytSelectedId);if(!s)return;window.open("https://www.youtube.com/results?search_query="+encodeURIComponent(s.artist+" "+s.title+" video oficial"),"_blank","noopener")}
function ytSaveSource(){const s=ytSong(ytSelectedId);if(!s){alert("Elegí primero una canción de la lista.");return}const id=ytExtractId(document.getElementById("ytUrlInput").value.trim());if(!id){alert("El enlace no parece ser un enlace válido de YouTube.");return}const start=Math.max(0,Number(document.getElementById("ytStartInput").value)||0);ytUserSources[s.id]={id,start,label:"Enlace agregado por la banda"};localStorage.setItem("em_online_sources",JSON.stringify(ytUserSources));renderOnlinePlayer();ytSelectSong(s.id,true);ytSetStatus("Versión conectada. Comprobá que sea la grabación correcta.")}
function ytOpenArrangement(){if(!ytSelectedId)return;go("repertoire");openCatalogSong(ytSelectedId)}
window.onYouTubeIframeAPIReady=function(){ytApiReady=true;if(document.getElementById("onlinePlayer")&&!document.getElementById("onlinePlayer").classList.contains("hide")){if(ytSelectedId)ytEnsurePlayer(ytSource(ytSelectedId),false);else renderOnlinePlayer()}};
window.addEventListener("beforeunload",()=>{if(ytLoopTimer)clearInterval(ytLoopTimer);if(ytTickTimer)clearInterval(ytTickTimer)});