var O = Object.defineProperty;
var D = (i, e, t) => e in i ? O(i, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[e] = t;
var P = (i, e, t) => (D(i, typeof e != "symbol" ? e + "" : e, t), t);
import { LineLayer as F } from "@deck.gl/layers";
import { BufferTransform as _ } from "@luma.gl/engine";
const C = `#version 300 es
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
`;
var a = 63710088e-1, z = {
  centimeters: a * 100,
  centimetres: a * 100,
  degrees: a / 111325,
  feet: a * 3.28084,
  inches: a * 39.37,
  kilometers: a / 1e3,
  kilometres: a / 1e3,
  meters: a,
  metres: a,
  miles: a / 1609.344,
  millimeters: a * 1e3,
  millimetres: a * 1e3,
  nauticalmiles: a / 1852,
  radians: 1,
  yards: a * 1.0936
};
function U(i, e) {
  e === void 0 && (e = "kilometers");
  var t = z[e];
  if (!t)
    throw new Error(e + " units is invalid");
  return i * t;
}
function h(i) {
  var e = i % 360;
  return e * Math.PI / 180;
}
function T(i) {
  if (!i)
    throw new Error("coord is required");
  if (!Array.isArray(i)) {
    if (i.type === "Feature" && i.geometry !== null && i.geometry.type === "Point")
      return i.geometry.coordinates;
    if (i.type === "Point")
      return i.coordinates;
  }
  if (Array.isArray(i) && i.length >= 2 && !Array.isArray(i[0]) && !Array.isArray(i[1]))
    return i;
  throw new Error("coord must be GeoJSON Point or an Array of numbers");
}
function b(i, e, t) {
  t === void 0 && (t = {});
  var o = T(i), r = T(e), s = h(r[1] - o[1]), d = h(r[0] - o[0]), l = h(o[1]), u = h(r[1]), c = Math.pow(Math.sin(s / 2), 2) + Math.pow(Math.sin(d / 2), 2) * Math.cos(l) * Math.cos(u);
  return U(2 * Math.atan2(Math.sqrt(c), Math.sqrt(1 - c)), t.units);
}
const V = {
  addressModeU: "repeat"
}, E = `uniform particleUniforms {
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
`, L = {
  name: "particle",
  vs: E,
  uniformTypes: {
    bounds: "vec4<f32>",
    viewportBounds: "vec4<f32>",
    viewportSphereCenter: "vec2<f32>",
    viewportSphereRadius: "f32",
    viewportSphere: "f32",
    viewportSpeedFactor: "f32",
    numParticles: "f32",
    maxAge: "f32",
    time: "f32",
    seed: "f32"
  }
}, k = `uniform windUniforms {
  vec4 bounds;
  vec2 windMin;
  vec2 windMax;
  float emptyData;
} wind;
`, W = {
  name: "wind",
  fs: k,
  uniformTypes: {
    bounds: "vec4<f32>",
    windMin: "vec2<f32>",
    windMax: "vec2<f32>",
    emptyData: "f32"
  }
}, N = {
  0: "#3288bd",
  0.1: "#66c2a5",
  0.2: "#abdda4",
  0.3: "#e6f598",
  0.4: "#fee08b",
  0.5: "#fdae61",
  0.6: "#f46d43",
  1: "#d53e4f"
}, j = (i, e) => [
  Math.max(i[0], e[0]),
  Math.max(i[1], e[1]),
  Math.min(i[2], e[2]),
  Math.min(i[3], e[3])
], q = {
  image: { type: "image", value: null, async: !0 },
  bounds: { type: "array", value: [-180, -90, 180, 90], compare: !0 },
  textureParameters: { type: "object", value: V, compare: !0, ignore: !0 },
  numParticles: { type: "number", min: 1, max: 1e6, value: 5e3 },
  maxAge: { type: "number", min: 1, max: 255, value: 100 },
  speedFactor: { type: "number", min: 0, max: 1, value: 1 },
  colors: { type: "object", value: N, compare: !0 },
  width: { type: "number", value: 1 },
  uWindMin: { type: "number", value: 0 },
  emptyData: { type: "number", value: 0 },
  uWindMax: { type: "number", value: 0 },
  vWindMin: { type: "number", value: 0 },
  vWindMax: { type: "number", value: 0 },
  animate: !0,
  boundsClip: { type: "boolean", value: !1 }
};
class M extends F {
  getShaders() {
    const e = super.getShaders();
    return {
      ...e,
      modules: [...e.modules, W],
      inject: {
        "vs:#decl": `
          out float drop;
          out vec2 positionWind;
          const vec2 DROP_POSITION = vec2(0);
        `,
        "vs:#main-start": `
          drop = float(instanceSourcePositions.xy == DROP_POSITION || instanceTargetPositions.xy == DROP_POSITION);
        `,
        "vs:#main-end": `
          positionWind = instanceTargetPositions.xy;
        `,
        "fs:#decl": `
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
        `,
        "fs:#main-start": `
          if (drop > 0.5) discard;
        `,
        "fs:#main-end": `
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
        `
      }
    };
  }
  initializeState() {
    super.initializeState();
    const e = this.getAttributeManager();
    e.remove(["instanceSourcePositions", "instanceTargetPositions", "instanceColors", "instanceWidths"]), e.addInstanced({
      instanceSourcePositions: { size: 3, type: "float32", noAlloc: !0 },
      instanceTargetPositions: { size: 3, type: "float32", noAlloc: !0 },
      instanceColors: { size: 4, type: "float32", noAlloc: !0 },
      // constant attributes
      instanceSourcePositions64Low: { size: 3, type: "float32", noAlloc: !0 },
      instanceTargetPositions64Low: { size: 3, type: "float32", noAlloc: !0 },
      instanceWidths: { size: 1, type: "float32", noAlloc: !0 }
    });
  }
  updateState(e) {
    var r;
    super.updateState(e);
    const { props: t, oldProps: o } = e;
    (t.image !== o.image || t.numParticles !== o.numParticles || t.maxAge !== o.maxAge) && this._setupTransformFeedback(), (t.colors !== o.colors || !this.state.colorTexture) && ((r = this.state.colorTexture) == null || r.destroy(), this.setState({ colorTexture: this._createColorTexture(t.colors) }));
  }
  finalizeState(e) {
    var t;
    this._deleteTransformFeedback(), (t = this.state.colorTexture) == null || t.destroy(), super.finalizeState(e);
  }
  draw({ uniforms: e }) {
    const { initialized: t } = this.state;
    if (!t)
      return;
    const { animate: o, image: r, bounds: s, width: d, uWindMin: l, uWindMax: u, vWindMin: c, vWindMax: m, emptyData: p } = this.props, { model: n, colorTexture: f } = this.state;
    if (!r || typeof r == "string" || !n || !f)
      return;
    o && this._runTransformFeedback();
    const { sourcePositions: y, targetPositions: w, instanceColors: g } = this.state;
    n.setAttributes({
      instanceSourcePositions: y,
      instanceTargetPositions: w,
      instanceColors: g
    }), n.setConstantAttributes({
      instanceSourcePositions64Low: new Float32Array([0, 0, 0]),
      instanceTargetPositions64Low: new Float32Array([0, 0, 0]),
      instanceWidths: new Float32Array([d])
    }), n.shaderInputs.setProps({
      wind: {
        bounds: s,
        windMin: [l, c],
        windMax: [u, m],
        emptyData: p / 255
      }
    }), n.setBindings({
      windTexture: r,
      colorTexture: f
    }), super.draw({ uniforms: e }), o && this.setNeedsRedraw();
  }
  _setupTransformFeedback() {
    const { device: e } = this.context, { numParticles: t, maxAge: o } = this.props, { initialized: r } = this.state;
    r && this._deleteTransformFeedback();
    const s = t * o, d = t * (o - 1), l = e.createBuffer({ data: new Float32Array(s * 3) }), u = e.createBuffer({ data: new Float32Array(s * 3) }), c = new Float32Array(s * 4);
    for (let n = 0; n < s; n++) {
      const f = Math.floor(n / t);
      c[n * 4] = 1, c[n * 4 + 1] = 1, c[n * 4 + 2] = 1, c[n * 4 + 3] = 1 - f / o;
    }
    const m = e.createBuffer({ data: c }), p = new _(e, {
      attributes: {
        sourcePosition: l
      },
      bufferLayout: [
        { name: "sourcePosition", format: "float32x3" }
      ],
      feedbackBuffers: {
        targetPosition: u
      },
      vs: C,
      varyings: ["targetPosition"],
      modules: [L],
      vertexCount: t
    });
    this.setState({
      initialized: !0,
      numInstances: s,
      numAgedInstances: d,
      sourcePositions: l,
      targetPositions: u,
      instanceColors: m,
      transform: p,
      frame: 0
    });
  }
  _runTransformFeedback() {
    const { initialized: e } = this.state;
    if (!e)
      return;
    const { device: t, viewport: o } = this.context, { image: r, bounds: s, numParticles: d, speedFactor: l, maxAge: u, boundsClip: c } = this.props, { numAgedInstances: m, transform: p, frame: n } = this.state, f = this.state.sourcePositions, y = this.state.targetPositions;
    if (!r || typeof r == "string" || !p)
      return;
    const w = o.resolution ? 1 : 0, { longitude: g, latitude: A } = o, x = [g, A], B = Math.max(
      b(x, o.unproject([0, 0]), { units: "meters" }),
      b(x, o.unproject([o.width / 2, 0]), { units: "meters" }),
      b(x, o.unproject([0, o.height / 2]), { units: "meters" })
    ), v = o.getBounds();
    v[1] = Math.max(v[1], -85.051129), v[3] = Math.min(v[3], 85.051129);
    const I = window.devicePixelRatio, R = l * I / 2 ** o.zoom;
    if (m > 0) {
      const S = t.createCommandEncoder();
      S.copyBufferToBuffer({
        sourceBuffer: f,
        sourceOffset: 0,
        destinationBuffer: y,
        destinationOffset: d * 4 * 3,
        size: m * 4 * 3
      }), t.submit(S.finish());
    }
    p.model.shaderInputs.setProps({
      particle: {
        bounds: s,
        numParticles: d,
        maxAge: u,
        viewportSphere: w,
        viewportSphereCenter: x,
        viewportSphereRadius: B,
        viewportBounds: c ? j(v, s) : v,
        viewportSpeedFactor: R,
        time: n,
        seed: Math.random()
      }
    }), p.model.setBindings({ speedTexture: r }), p.run({
      inputBuffers: { sourcePosition: f },
      outputBuffers: { targetPosition: y },
      clearColor: !1,
      clearDepth: !1,
      clearStencil: !1
    }), this.setState({
      sourcePositions: y,
      targetPositions: f,
      frame: n + 1
    });
  }
  _deleteTransformFeedback() {
    const { initialized: e, sourcePositions: t, targetPositions: o, instanceColors: r, transform: s } = this.state;
    e && (t == null || t.destroy(), o == null || o.destroy(), r == null || r.destroy(), s == null || s.destroy(), this.setState({
      initialized: !1,
      sourcePositions: void 0,
      targetPositions: void 0,
      instanceColors: void 0,
      transform: void 0
    }));
  }
  step() {
    this._runTransformFeedback(), this.setNeedsRedraw();
  }
  clear() {
    const { initialized: e, numInstances: t, sourcePositions: o, targetPositions: r } = this.state ?? {};
    e && (o.write(new Float32Array(t * 3)), r.write(new Float32Array(t * 3)), this.setNeedsRedraw());
  }
  _createColorTexture(e) {
    const t = document.createElement("canvas"), o = t.getContext("2d");
    t.width = 256, t.height = 1;
    const r = o.createLinearGradient(0, 0, 256, 0);
    for (const s in e)
      r.addColorStop(+s, e[s]);
    return o.fillStyle = r, o.fillRect(0, 0, 256, 1), this.context.device.createTexture({
      width: 256,
      height: 1,
      format: "rgba8unorm",
      data: new Uint8Array(o.getImageData(0, 0, 256, 1).data.buffer),
      sampler: {
        minFilter: "linear",
        magFilter: "linear",
        addressModeU: "clamp-to-edge",
        addressModeV: "clamp-to-edge"
      }
    });
  }
}
P(M, "layerName", "ParticleLayer"), P(M, "defaultProps", q);
export {
  M as ParticleLayer
};
