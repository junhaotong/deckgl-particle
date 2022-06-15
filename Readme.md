# deckgl-particle

Particle layer for deck.gl, based on [deck.gl-particle](https://github.com/weatherlayers/deck.gl-particle)
## demo
- [Global wind demo](https://junhaotong.github.io/deckgl-particle/)
- [Part wind demo](https://junhaotong.github.io/deckgl-particle/part-wind.html)

<img src="./docs/screen-shot.png" alt="Screenshot" width="640" height="320">

## Usage

```
import { Deck } from '@deck.gl/core';
import { ParticleLayer } from 'deck.gl-particle';

const deckgl = new Deck({
  layers: [
    new ParticleLayer({
        id: 'particle',
        image: 'https://mapbox.github.io/webgl-wind/demo/wind/2016112000.png',
        numParticles: 5000,
        maxAge: 50,
        speedFactor: 0.3,
        uWindMin: -21.32,
        uWindMax: 26.8,
        vWindMin: -21.57,
        vWindMax: 21.42,
        boundsClip: false,
        width: 2,
        opacity: 1,
        animate: true,
        colors: {
            0.0: '#3288bd',
            0.1: '#66c2a5',
            0.2: '#abdda4',
            0.3: '#e6f598',
            0.4: '#fee08b',
            0.5: '#fdae61',
            0.6: '#f46d43',
            1.0: '#d53e4f'
        }
    });
  ],
  _animate: true,
});
```

Requires WebGL 2 (Chrome, Firefox, Edge, Safari 15).
