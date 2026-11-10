/*
 * Copyright (c) 2021 WeatherLayers.com
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
export default `\
#version 300 es
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
