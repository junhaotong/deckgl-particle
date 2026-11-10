(function(a,c){typeof exports=="object"&&typeof module<"u"?c(exports,require("@deck.gl/layers"),require("@luma.gl/engine")):typeof define=="function"&&define.amd?define(["exports","@deck.gl/layers","@luma.gl/engine"],c):(a=typeof globalThis<"u"?globalThis:a||self,c(a.DeckglParticle={},a.deck,a.luma))})(this,function(a,c,y){"use strict";var N=Object.defineProperty;var j=(a,c,y)=>c in a?N(a,c,{enumerable:!0,configurable:!0,writable:!0,value:y}):a[c]=y;var A=(a,c,y)=>(j(a,typeof c!="symbol"?c+"":c,y),y);const R=`#version 300 es
#define SHADER_NAME particle-layer-update-transform-vertex-shader

precision highp float;

in vec3 sourcePosition;
out vec3 targetPosition;

uniform sampler2D speedTexture;

const float PI = 3.1415926535;
const float EARTH_RADIUS = 6370972.0; // meters

const vec2 DROP_POSITION = vec2(0);

vec2 getUV(vec2 pos) {
  return vec2(
    (pos.x - particle.bounds[0]) / (particle.bounds[2] - particle.bounds[0]),
    (pos.y - particle.bounds[3]) / (particle.bounds[1] - particle.bounds[3])
  );
}

vec4 clipBox(vec4 bbox1, vec4 bbox2) {
    return vec4(
        max(bbox1[0], bbox2[0]),
        max(bbox1[1], bbox2[1]),
        min(bbox1[2], bbox2[2]),
        min(bbox1[3], bbox2[3])
    );
}

// see https://stackoverflow.com/a/27228836/1823988
float atan2(float y, float x) {
  return x == 0. ? sign(y) * PI / 2. : atan(y, x);
}

// see https://github.com/chrisveness/geodesy/blob/master/latlon-spherical.js#L187
float distanceTo(vec2 from, vec2 point) {
  float y1 = radians(from.y);
  float x1 = radians(from.x);
  float y2 = radians(point.y);
  float x2 = radians(point.x);
  float dy = y2 - y1;
  float dx = x2 - x1;

  float a = sin(dy / 2.) * sin(dy / 2.) + cos(y1) * cos(y2) * sin(dx / 2.) * sin(dx / 2.);
  float c = 2. * atan2(sqrt(a), sqrt(1. - a));
  float d = EARTH_RADIUS * c;

  return d;
}

// see https://github.com/chrisveness/geodesy/blob/master/latlon-spherical.js#L360
vec2 destinationPoint(vec2 from, float dist, float bearing) {
  float d = dist / EARTH_RADIUS;
  float r = radians(bearing);

  float y1 = radians(from.y);
  float x1 = radians(from.x);

  float siny2 = sin(y1) * cos(d) + cos(y1) * sin(d) * cos(r);
  float y2 = asin(siny2);
  float y = sin(r) * sin(d) * cos(y1);
  float x = cos(d) - sin(y1) * siny2;
  float x2 = x1 + atan2(y, x);

  float lat = degrees(y2);
  float lon = degrees(x2);

  return vec2(lon, lat);
}

float rand(vec2 co) {
  return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

vec2 randVec2(vec2 seed) {
  return vec2(rand(seed + 1.3), rand(seed + 2.1));
}

vec2 randPosition(vec2 seed) {
  vec2 randomVec2 = randVec2(seed);
  
  if (particle.viewportSphere > 0.5) {
    randomVec2.x += 0.0001; // prevent generating point in the center
    float dist = sqrt(randomVec2.x) * particle.viewportSphereRadius;
    float bearing = randomVec2.y * 360.;
    return destinationPoint(particle.viewportSphereCenter, dist, bearing);
  } else {
    vec2 viewportBoundsMin = particle.viewportBounds.xy;
    vec2 viewportBoundsMax = particle.viewportBounds.zw;
    return mix(viewportBoundsMin, viewportBoundsMax, randomVec2);
  }
}

bool isPositionVisible(vec2 position) {
  if (particle.viewportSphere > 0.5) {
    return distanceTo(particle.viewportSphereCenter, position) <= particle.viewportSphereRadius;
  } else {
    vec2 viewportBoundsMin = particle.viewportBounds.xy;
    vec2 viewportBoundsMax = particle.viewportBounds.zw;
    return (
      viewportBoundsMin.x <= position.x && position.x <= viewportBoundsMax.x &&
      viewportBoundsMin.y <= position.y && position.y <= viewportBoundsMax.y
    );
  }
}

void main() {
  // only the newest generation (age 0) is updated here, older generations are shifted by a buffer copy
  float particleIndex = float(gl_VertexID);
  targetPosition = vec3(0);

  if (sourcePosition.xy != DROP_POSITION) {
    // update position
    vec2 uv = getUV(sourcePosition.xy);
    vec4 values = texture(speedTexture, uv);
    vec2 speed = values.xy * 2. - 1.;
    float distortion = cos(radians(sourcePosition.y));
    vec2 distortedSpeed = vec2(speed.x / distortion, speed.y);
    vec2 offset = distortedSpeed * particle.viewportSpeedFactor;
    targetPosition.xy = sourcePosition.xy + offset;

    if (values.a != 1.) {
      // drop nodata
      targetPosition.xy = DROP_POSITION;
    }

    // drop out of bounds
    if (!isPositionVisible(sourcePosition.xy) || !isPositionVisible(targetPosition.xy)) {
      targetPosition.xy = DROP_POSITION;
    }

    if (abs(mod(particleIndex, particle.maxAge + 2.) - mod(particle.time, particle.maxAge + 2.)) < 1.) {
      // drop by maxAge, +2 because only non-randomized pairs are rendered
      targetPosition.xy = DROP_POSITION;
    }
  } else {
    // generate random position to prevent converging particles
    vec2 randomSeed = vec2(particleIndex * particle.seed / particle.numParticles);
    targetPosition.xy = randPosition(randomSeed);
  }
}
`;var d=63710088e-1,O={centimeters:d*100,centimetres:d*100,degrees:d/111325,feet:d*3.28084,inches:d*39.37,kilometers:d/1e3,kilometres:d/1e3,meters:d,metres:d,miles:d/1609.344,millimeters:d*1e3,millimetres:d*1e3,nauticalmiles:d/1852,radians:1,yards:d*1.0936};function D(o,e){e===void 0&&(e="kilometers");var t=O[e];if(!t)throw new Error(e+" units is invalid");return o*t}function g(o){var e=o%360;return e*Math.PI/180}function B(o){if(!o)throw new Error("coord is required");if(!Array.isArray(o)){if(o.type==="Feature"&&o.geometry!==null&&o.geometry.type==="Point")return o.geometry.coordinates;if(o.type==="Point")return o.coordinates}if(Array.isArray(o)&&o.length>=2&&!Array.isArray(o[0])&&!Array.isArray(o[1]))return o;throw new Error("coord must be GeoJSON Point or an Array of numbers")}function b(o,e,t){t===void 0&&(t={});var i=B(o),r=B(e),n=g(r[1]-i[1]),u=g(r[0]-i[0]),p=g(i[1]),f=g(r[1]),l=Math.pow(Math.sin(n/2),2)+Math.pow(Math.sin(u/2),2)*Math.cos(p)*Math.cos(f);return D(2*Math.atan2(Math.sqrt(l),Math.sqrt(1-l)),t.units)}const F={addressModeU:"repeat"},_={name:"particle",vs:`uniform particleUniforms {
  vec4 bounds;
  vec4 viewportBounds;
  vec2 viewportSphereCenter;
  float viewportSphereRadius;
  float viewportSphere;
  float viewportSpeedFactor;
  float numParticles;
  float maxAge;
  float time;
  float seed;
} particle;
`,uniformTypes:{bounds:"vec4<f32>",viewportBounds:"vec4<f32>",viewportSphereCenter:"vec2<f32>",viewportSphereRadius:"f32",viewportSphere:"f32",viewportSpeedFactor:"f32",numParticles:"f32",maxAge:"f32",time:"f32",seed:"f32"}},C={name:"wind",fs:`uniform windUniforms {
  vec4 bounds;
  vec2 windMin;
  vec2 windMax;
  float emptyData;
} wind;
`,uniformTypes:{bounds:"vec4<f32>",windMin:"vec2<f32>",windMax:"vec2<f32>",emptyData:"f32"}},U={0:"#3288bd",.1:"#66c2a5",.2:"#abdda4",.3:"#e6f598",.4:"#fee08b",.5:"#fdae61",.6:"#f46d43",1:"#d53e4f"},z=(o,e)=>[Math.max(o[0],e[0]),Math.max(o[1],e[1]),Math.min(o[2],e[2]),Math.min(o[3],e[3])],k={image:{type:"image",value:null,async:!0},bounds:{type:"array",value:[-180,-90,180,90],compare:!0},textureParameters:{type:"object",value:F,compare:!0,ignore:!0},numParticles:{type:"number",min:1,max:1e6,value:5e3},maxAge:{type:"number",min:1,max:255,value:100},speedFactor:{type:"number",min:0,max:1,value:1},colors:{type:"object",value:U,compare:!0},width:{type:"number",value:1},uWindMin:{type:"number",value:0},emptyData:{type:"number",value:0},uWindMax:{type:"number",value:0},vWindMin:{type:"number",value:0},vWindMax:{type:"number",value:0},animate:!0,boundsClip:{type:"boolean",value:!1}};class S extends c.LineLayer{getShaders(){const e=super.getShaders();return{...e,modules:[...e.modules,C],inject:{"vs:#decl":`
          out float drop;
          out vec2 positionWind;
          const vec2 DROP_POSITION = vec2(0);
        `,"vs:#main-start":`
          drop = float(instanceSourcePositions.xy == DROP_POSITION || instanceTargetPositions.xy == DROP_POSITION);
        `,"vs:#main-end":`
          positionWind = instanceTargetPositions.xy;
        `,"fs:#decl":`
          in float drop;
          in vec2 positionWind;
          uniform sampler2D windTexture;
          uniform sampler2D colorTexture;
          vec2 getUV(vec2 pos) {
            return vec2(
              (pos.x - wind.bounds[0]) / (wind.bounds[2] - wind.bounds[0]),
              (pos.y - wind.bounds[3]) / (wind.bounds[1] - wind.bounds[3])
            );
          }
        `,"fs:#main-start":`
          if (drop > 0.5) discard;
        `,"fs:#main-end":`
          vec2 windUV = getUV(positionWind.xy);
          vec2 windXY = texture(windTexture, windUV).xy;
          vec2 velocity = mix(wind.windMin, wind.windMax, windXY);
          float speed = length(velocity);
          float maxSpeed = length(wind.windMax);
          float colorPos = speed / maxSpeed;
          if (windXY.x == wind.emptyData && windXY.y == wind.emptyData) {
            fragColor.a = 0.;
          } else {
            fragColor = vec4(texture(colorTexture, vec2(colorPos, 0.5)).rgb, fragColor.a);
          }
        `}}}initializeState(){super.initializeState();const e=this.getAttributeManager();e.remove(["instanceSourcePositions","instanceTargetPositions","instanceColors","instanceWidths"]),e.addInstanced({instanceSourcePositions:{size:3,type:"float32",noAlloc:!0},instanceTargetPositions:{size:3,type:"float32",noAlloc:!0},instanceColors:{size:4,type:"float32",noAlloc:!0},instanceSourcePositions64Low:{size:3,type:"float32",noAlloc:!0},instanceTargetPositions64Low:{size:3,type:"float32",noAlloc:!0},instanceWidths:{size:1,type:"float32",noAlloc:!0}})}updateState(e){var r;super.updateState(e);const{props:t,oldProps:i}=e;(t.image!==i.image||t.numParticles!==i.numParticles||t.maxAge!==i.maxAge)&&this._setupTransformFeedback(),(t.colors!==i.colors||!this.state.colorTexture)&&((r=this.state.colorTexture)==null||r.destroy(),this.setState({colorTexture:this._createColorTexture(t.colors)}))}finalizeState(e){var t;this._deleteTransformFeedback(),(t=this.state.colorTexture)==null||t.destroy(),super.finalizeState(e)}draw({uniforms:e}){const{initialized:t}=this.state;if(!t)return;const{animate:i,image:r,bounds:n,width:u,uWindMin:p,uWindMax:f,vWindMin:l,vWindMax:x,emptyData:m}=this.props,{model:s,colorTexture:v}=this.state;if(!r||typeof r=="string"||!s||!v)return;i&&this._runTransformFeedback();const{sourcePositions:w,targetPositions:T,instanceColors:M}=this.state;s.setAttributes({instanceSourcePositions:w,instanceTargetPositions:T,instanceColors:M}),s.setConstantAttributes({instanceSourcePositions64Low:new Float32Array([0,0,0]),instanceTargetPositions64Low:new Float32Array([0,0,0]),instanceWidths:new Float32Array([u])}),s.shaderInputs.setProps({wind:{bounds:n,windMin:[p,l],windMax:[f,x],emptyData:m/255}}),s.setBindings({windTexture:r,colorTexture:v}),super.draw({uniforms:e}),i&&this.setNeedsRedraw()}_setupTransformFeedback(){const{device:e}=this.context,{numParticles:t,maxAge:i}=this.props,{initialized:r}=this.state;r&&this._deleteTransformFeedback();const n=t*i,u=t*(i-1),p=e.createBuffer({data:new Float32Array(n*3)}),f=e.createBuffer({data:new Float32Array(n*3)}),l=new Float32Array(n*4);for(let s=0;s<n;s++){const v=Math.floor(s/t);l[s*4]=1,l[s*4+1]=1,l[s*4+2]=1,l[s*4+3]=1-v/i}const x=e.createBuffer({data:l}),m=new y.BufferTransform(e,{attributes:{sourcePosition:p},bufferLayout:[{name:"sourcePosition",format:"float32x3"}],feedbackBuffers:{targetPosition:f},vs:R,varyings:["targetPosition"],modules:[_],vertexCount:t});this.setState({initialized:!0,numInstances:n,numAgedInstances:u,sourcePositions:p,targetPositions:f,instanceColors:x,transform:m,frame:0})}_runTransformFeedback(){const{initialized:e}=this.state;if(!e)return;const{device:t,viewport:i}=this.context,{image:r,bounds:n,numParticles:u,speedFactor:p,maxAge:f,boundsClip:l}=this.props,{numAgedInstances:x,transform:m,frame:s}=this.state,v=this.state.sourcePositions,w=this.state.targetPositions;if(!r||typeof r=="string"||!m)return;const T=i.resolution?1:0,{longitude:M,latitude:V}=i,P=[M,V],E=Math.max(b(P,i.unproject([0,0]),{units:"meters"}),b(P,i.unproject([i.width/2,0]),{units:"meters"}),b(P,i.unproject([0,i.height/2]),{units:"meters"})),h=i.getBounds();h[1]=Math.max(h[1],-85.051129),h[3]=Math.min(h[3],85.051129);const L=window.devicePixelRatio,W=p*L/2**i.zoom;if(x>0){const I=t.createCommandEncoder();I.copyBufferToBuffer({sourceBuffer:v,sourceOffset:0,destinationBuffer:w,destinationOffset:u*4*3,size:x*4*3}),t.submit(I.finish())}m.model.shaderInputs.setProps({particle:{bounds:n,numParticles:u,maxAge:f,viewportSphere:T,viewportSphereCenter:P,viewportSphereRadius:E,viewportBounds:l?z(h,n):h,viewportSpeedFactor:W,time:s,seed:Math.random()}}),m.model.setBindings({speedTexture:r}),m.run({inputBuffers:{sourcePosition:v},outputBuffers:{targetPosition:w},clearColor:!1,clearDepth:!1,clearStencil:!1}),this.setState({sourcePositions:w,targetPositions:v,frame:s+1})}_deleteTransformFeedback(){const{initialized:e,sourcePositions:t,targetPositions:i,instanceColors:r,transform:n}=this.state;e&&(t==null||t.destroy(),i==null||i.destroy(),r==null||r.destroy(),n==null||n.destroy(),this.setState({initialized:!1,sourcePositions:void 0,targetPositions:void 0,instanceColors:void 0,transform:void 0}))}step(){this._runTransformFeedback(),this.setNeedsRedraw()}clear(){const{initialized:e,numInstances:t,sourcePositions:i,targetPositions:r}=this.state??{};e&&(i.write(new Float32Array(t*3)),r.write(new Float32Array(t*3)),this.setNeedsRedraw())}_createColorTexture(e){const t=document.createElement("canvas"),i=t.getContext("2d");t.width=256,t.height=1;const r=i.createLinearGradient(0,0,256,0);for(const n in e)r.addColorStop(+n,e[n]);return i.fillStyle=r,i.fillRect(0,0,256,1),this.context.device.createTexture({width:256,height:1,format:"rgba8unorm",data:new Uint8Array(i.getImageData(0,0,256,1).data.buffer),sampler:{minFilter:"linear",magFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}})}}A(S,"layerName","ParticleLayer"),A(S,"defaultProps",k),a.ParticleLayer=S,Object.defineProperty(a,Symbol.toStringTag,{value:"Module"})});
