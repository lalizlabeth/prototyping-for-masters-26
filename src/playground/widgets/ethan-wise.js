// Sampled from Ethan’s reference diagram: upper-band hue → lower-band whiteness.
// Black = -1 (despair), gray = 0 (meh), white = 1 (love).
const preferenceScores = [-0.999,-0.999,-0.999,-0.999,-0.999,-0.849,-0.604,-0.378,-0.157,0.02,0.145,0.208,0.261,0.256,0.211,0.132,0.024,-0.105,-0.225,-0.326,-0.442,-0.544,-0.65,-0.729,-0.799,-0.859,-0.903,-0.929,-0.96,-0.974,-0.985,-0.993,-0.997,-0.999,-0.999,-0.999,-0.999,-0.998,-0.999,-0.998,-0.999,-0.999,-0.999,-0.999,-0.999,-0.998,-0.998,-1.0,-0.999,-0.998,-0.997,-0.992,-0.989,-0.975,-0.978,-0.951,-0.931,-0.898,-0.866,-0.828,-0.736,-0.622,-0.525,-0.4,-0.328,-0.174,-0.052,0.0,0.124,0.245,0.351,0.502,0.612,0.662,0.731,0.777,0.818,0.844,0.857,0.853,0.814,0.783,0.729,0.637,0.56,0.438,0.297,0.197,0.065,-0.083,-0.197,-0.343,-0.47,-0.604,-0.704,-0.789,-0.868,-0.934,-0.971,-0.987,-0.993,-0.999,-0.999,-0.999,-0.999,-0.999,-0.999,-0.999,-0.999,-0.999,-0.999,-0.993,-0.986,-0.972,-0.949,-0.916,-0.889,-0.845,-0.794,-0.751,-0.696,-0.619,-0.568,-0.504,-0.424,-0.328,-0.288,-0.202,-0.158,-0.089,-0.036,0.006,0.042,0.051,0.069,0.07,0.061,0.038,0.009,-0.027,-0.077,-0.113,-0.161,-0.229,-0.276,-0.322,-0.398,-0.453,-0.525,-0.561,-0.634,-0.696,-0.75,-0.783,-0.812,-0.842,-0.885,-0.888,-0.917,-0.938,-0.949,-0.965,-0.972,-0.978,-0.984,-0.99,-0.996,-0.995,-0.994,-0.999,-0.999,-0.999,-0.999,-0.999,-0.999,-0.999,-0.998,-0.999,-0.999,-1.0,-0.998,-0.999,-0.999,-0.999,-0.999,-0.999,-0.999,-0.999,-0.999,-1.0,-0.999,-0.999,-0.998,-0.999,-1.0,-0.998,-0.999,-1.0,-0.999,-0.999,-0.999,-0.999,-0.999,-0.999,-0.999,-0.999,-0.999,-0.999,-0.999,-0.999,-0.999,-0.998,-0.999,-0.999,-0.999,-0.999,-0.999,-0.999,-0.999,-0.998,-0.999,-0.999,-0.999,-0.999,-0.999,-0.998,-0.999,-0.999,-0.999,-0.999,-0.999,-0.998,-0.999,-0.999,-0.999,-0.999,-0.999,-0.999,-0.999,-0.999,-0.999,-0.999,-0.998,-0.999,-0.999,-0.999,-0.999,-0.999,-0.999,-0.998,-0.999,-0.999,-0.999,-0.999,-0.999,-0.999,-0.999,-0.999,-0.999,-0.999,-0.999,-0.999,-0.998,-0.999,-0.999,-0.996,-0.991,-0.978,-0.968,-0.941,-0.916,-0.872,-0.823,-0.765,-0.676,-0.576,-0.491,-0.355,-0.232,-0.101,0.098,0.261,0.375,0.488,0.583,0.665,0.739,0.795,0.848,0.883,0.919,0.944,0.958,0.972,0.983,0.987,0.993,0.996,0.997,0.996,0.998,0.995,0.997,0.997,0.998,0.997,0.996,0.996,0.997,0.996,0.998,0.995,0.997,0.997,0.997,0.997,0.996,0.996,0.997,0.996,0.998,0.996,0.994,0.993,0.988,0.978,0.975,0.963,0.943,0.928,0.899,0.861,0.818,0.771,0.695,0.618,0.572,0.496,0.383,0.276,0.214,0.132,0.014,-0.101,-0.248,-0.359,-0.45,-0.529,-0.608,-0.688,-0.761,-0.811,-0.859,-0.902,-0.938,-0.961,-0.972,-0.982,-0.99,-0.995];

export const preferenceAt = hue => {
  const h = ((hue % 360) + 360) % 360;
  const index = Math.floor(h);
  const score = preferenceScores[index] + (preferenceScores[(index + 1) % 360] - preferenceScores[index]) * (h - index);
  const caption = score > .82 ? 'I LOVE this.' : score > .6 ? 'A big yes.' : score > .15 ? 'Pretty nice.' : score >= -.25 ? 'Meh.' : score > -.7 ? 'Not for me.' : 'Absolutely not.';
  return { score, caption };
};

const safiro = new FontFace('Safiro', 'url(/fonts/safiro-medium-webfont.woff2)', { weight: '500' });
document.fonts.add(safiro);
safiro.load().catch(error => console.error('Unable to load Safiro', error));

export default {
  student: "Ethan Wise",
  title: "Hue do you love?",
  width: 360,
  height: 360,
  frame: false,
  mount(root) {
    root.innerHTML = `
      <style>
        * { box-sizing: border-box; }
        .hue-card { height: 100%; padding: 24px; border: 2px solid #151515; border-radius: 28px; background: var(--hue); color: var(--ink, #151515); font-family: 'Safiro', sans-serif; font-weight: 500; display: flex; flex-direction: column; align-items: center; }
        .heading { position: relative; width: 100%; display: flex; justify-content: center; align-items: center; font-size: 11px; letter-spacing: .08em; text-transform: uppercase; }
        .dot { position: absolute; right: 0; width: 12px; height: 12px; background: var(--opposite-hue); border-radius: 50%; border: 1px solid #151515; }
        .portrait { width: 180px; height: 180px; margin: 13px 0 4px; overflow: visible; }
        .head { transform-origin: 100px 100px; }
        .happy .head { animation: nod .7s ease-in-out infinite; }
        .despair .head { animation: shake .48s ease-in-out infinite; }
        .hearts { fill: #151515; stroke: none; }
        .mouth-detail { stroke-width: 2; }
        .meh .head { transform: rotate(-7deg); }
        .okay .head { transform: rotate(4deg); }
        .control { width: 100%; margin-top: 20px; }
        .hue-slider { position: relative; width: 100%; height: 18px; border: 1.5px solid #151515; border-radius: 20px; cursor: ew-resize; touch-action: none; user-select: none; }
        .hue-slider::after { content: ''; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 24px; height: 28px; border: 3px solid #151515; border-radius: 12px; background: var(--hue); box-shadow: inset 0 0 0 2px white; pointer-events: none; }
        .hue-slider:focus-visible { outline: 3px solid var(--ink); outline-offset: 6px; }
        .hue-slider:active { cursor: grabbing; }
        .scale { display: flex; justify-content: center; align-items: baseline; margin-top: 12px; font-size: 10px; }
        output { color: inherit; font-size: 17px; font-weight: 500; }
        @keyframes nod { 0%, 100% { transform: translateY(-3px) scaleY(1); } 50% { transform: translateY(5px) scaleY(.91); } }
        @keyframes shake { 0%, 100% { transform: translateX(-5px) rotate(-9deg); } 50% { transform: translateX(5px) rotate(9deg); } }
        @media (prefers-reduced-motion: reduce) { .head { animation: none !important; } }
      </style>
      <section class="hue-card">
        <div class="heading"><span>Hue do you love?</span><span class="dot"></span></div>
        <svg class="portrait" viewBox="0 0 200 200" role="img" aria-label="Happy face">
          <g class="head" fill="white" stroke="#151515" stroke-width="5" stroke-linecap="round">
            <circle cx="100" cy="100" r="83" />
            <path class="brow-left" fill="none" />
            <path class="brow-right" fill="none" />
            <path class="eye-left" fill="none" />
            <path class="eye-right" fill="none" />
            <g class="hearts">
              <path d="M69 98 L54 83 C40 66 61 57 69 72 C77 57 98 66 84 83 Z" />
              <path d="M131 98 L116 83 C102 66 123 57 131 72 C139 57 160 66 146 83 Z" />
            </g>
            <path class="mouth" fill="#151515" stroke-width="5" stroke-linejoin="round" />
            <path class="mouth-detail" fill="white" />
          </g>
        </svg>
        <div class="control">
          <div class="hue-slider" role="slider" tabindex="0" aria-valuemin="0" aria-valuemax="359" aria-valuenow="302" aria-label="Hue in degrees"></div>
          <div class="scale"><output>302°</output></div>
        </div>
      </section>`;

    const card = root.querySelector('.hue-card');
    const slider = root.querySelector('.hue-slider');
    const face = root.querySelector('svg');
    const setPath = (name, path) => root.querySelector(`.${name}`).setAttribute('d', path);
    let hue = 302;
    const color = h => {
      const channel = n => {
        const k = (n + h / 60) % 6;
        return Math.round(255 * (1 - Math.max(0, Math.min(k, 4 - k, 1))));
      };
      return [channel(5), channel(3), channel(1)];
    };
    const rgb = channels => `rgb(${channels.join(' ')})`;
    const wrap = value => ((value % 360) + 360) % 360;
    const update = () => {
      const { score, caption } = preferenceAt(hue);
      const happy = score > .6;
      const despair = score < -.7;
      card.classList.toggle('happy', happy);
      card.classList.toggle('despair', despair);
      card.classList.toggle('meh', score >= -.25 && score <= .15);
      card.classList.toggle('okay', score > .15 && !happy);
      const channels = color(hue);
      card.style.setProperty('--hue', rgb(channels));
      card.style.setProperty('--opposite-hue', `hsl(${wrap(hue + 180)} 100% 50%)`);
      // Each visible track spans a full hue cycle, centered on the selected hue.
      slider.style.background = `linear-gradient(to right, ${Array.from({ length: 37 }, (_, i) => `${rgb(color(wrap(hue - 180 + i * 10)))} ${i / 36 * 100}%`).join(', ')})`;
      const linear = c => { c /= 255; return c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; };
      const luminance = .2126 * linear(channels[0]) + .7152 * linear(channels[1]) + .0722 * linear(channels[2]);
      card.style.setProperty('--ink', luminance > .179 ? '#151515' : '#fff');
      slider.setAttribute('aria-valuenow', String(hue));
      root.querySelector('output').value = `${hue}°`;
      slider.setAttribute('aria-valuetext', `${hue} degrees. ${caption}`);
      face.setAttribute('aria-label', `${caption} ${happy ? 'Beaming and nodding.' : despair ? 'Miserable and shaking its head.' : 'A skeptical look.'}`);
      const joy = Math.max(0, score);
      const sad = Math.max(0, -score);
      const love = Math.max(0, Math.min(1, (score - .82) / .18));
      root.querySelector('.hearts').style.opacity = love;
      root.querySelector('.eye-left').style.opacity = 1 - love;
      root.querySelector('.eye-right').style.opacity = 1 - love;
      // Happy crescents become squeezed, slanted eyes for a full-on "nope".
      setPath('eye-left', `M 57 ${87 - sad * 8} Q 69 ${87 - joy * 20 + sad * 12} 81 ${87 + sad * 4}`);
      setPath('eye-right', `M 119 ${87 + sad * 4} Q 131 ${87 - joy * 20 + sad * 12} 143 ${87 - sad * 8}`);
      setPath('brow-left', `M 55 ${64 + sad * 13} Q 68 ${59 - joy * 4} 81 ${64 - sad * 13}`);
      setPath('brow-right', `M 119 ${64 - sad * 13 - (1 - Math.abs(score)) * 9} Q 132 ${59 - joy * 4 - (1 - Math.abs(score)) * 8} 145 ${64 + sad * 13}`);
      // An open grin, a crooked meh, and a trembling frown share one contour.
      const edge = 121 + sad * 18;
      const top = 122 - sad * 49 + joy * 7;
      const bottom = 125 - sad * 36 + joy * 62;
      const skew = (1 - Math.abs(score)) * 5;
      setPath('mouth', `M 62 ${edge} Q 100 ${top} 138 ${edge - skew} Q 100 ${bottom} 62 ${edge} Z`);
      root.querySelector('.mouth-detail').style.opacity = Math.max(joy, sad);
      setPath('mouth-detail', joy > 0
        ? `M 68 ${edge + 2} Q 100 ${top + 2} 132 ${edge - skew + 2} L 127 ${edge + 10} Q 100 ${top + 11} 73 ${edge + 10} Z`
        : `M 70 ${edge - 3} Q 100 ${top + 7} 130 ${edge - skew - 3} Q 100 ${top + 17} 70 ${edge - 3} Z`);

    };
    let drag = null;
    slider.addEventListener('pointerdown', event => {
      if (event.button !== 0 || drag) return;
      event.preventDefault();
      slider.focus({ preventScroll: true });
      drag = { id: event.pointerId, x: event.clientX, hue, width: slider.getBoundingClientRect().width };
      slider.setPointerCapture(event.pointerId);
    });
    slider.addEventListener('pointermove', event => {
      if (!drag || event.pointerId !== drag.id) return;
      hue = wrap(Math.round(drag.hue - (event.clientX - drag.x) / drag.width * 360));
      update();
    });
    const endDrag = event => {
      if (!drag || event.pointerId !== drag.id) return;
      drag = null;
      if (slider.hasPointerCapture(event.pointerId)) slider.releasePointerCapture(event.pointerId);
    };
    slider.addEventListener('pointerup', endDrag);
    slider.addEventListener('pointercancel', endDrag);
    slider.addEventListener('lostpointercapture', () => { drag = null; });
    slider.addEventListener('keydown', event => {
      const steps = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1, PageUp: 10, PageDown: -10 };
      if (!(event.key in steps) && event.key !== 'Home' && event.key !== 'End') return;
      event.preventDefault();
      hue = event.key === 'Home' ? 0 : event.key === 'End' ? 359 : wrap(hue + steps[event.key] * (event.shiftKey ? 10 : 1));
      update();
    });
    update();
  },
};
