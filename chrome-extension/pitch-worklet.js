class OcarinaPitchShifter extends AudioWorkletProcessor{
 static get parameterDescriptors(){return[{name:"semitones",defaultValue:0,minValue:-12,maxValue:12,automationRate:"k-rate"}]}
 constructor(){super();this.size=8192;this.buffers=[];this.write=0;this.phase=0;this.grain=2048}
 read(buffer,position){const size=this.size;while(position<0)position+=size;const i=Math.floor(position)%size,j=(i+1)%size,f=position-Math.floor(position);return buffer[i]*(1-f)+buffer[j]*f}
 process(inputs,outputs,parameters){
  const input=inputs[0],output=outputs[0];if(!input||!input.length||!output.length)return true;
  const semi=parameters.semitones[0]||0,ratio=Math.pow(2,semi/12),range=Math.min(3500,Math.abs(1-ratio)*this.grain),direction=ratio<1?1:-1,base=range+256;
  for(let ch=0;ch<output.length;ch++)if(!this.buffers[ch])this.buffers[ch]=new Float32Array(this.size);
  const frames=output[0].length;
  for(let i=0;i<frames;i++){
   const p1=this.phase,p2=(this.phase+.5)%1,w1=.5-.5*Math.cos(2*Math.PI*p1),w2=1-w1;
   const d1=base+direction*p1*range,d2=base+direction*p2*range;
   for(let ch=0;ch<output.length;ch++){
    const src=input[Math.min(ch,input.length-1)],sample=src?(src[i]||0):0,buf=this.buffers[ch];buf[this.write]=sample;
    output[ch][i]=Math.abs(ratio-1)<.0005?sample:this.read(buf,this.write-d1)*w1+this.read(buf,this.write-d2)*w2;
   }
   this.write=(this.write+1)%this.size;this.phase+=1/this.grain;if(this.phase>=1)this.phase-=1;
  }
  return true;
 }
}
registerProcessor("ocarina-pitch-shifter",OcarinaPitchShifter);
