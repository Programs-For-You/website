<script>
  import { onMount } from 'svelte';
  import { cn } from '#lib/cn.js';
  /**
   * A slow, flowing colour field drawn with a WebGL fragment shader (domain-warped noise in forest green,
   * sage, cream and a little brown). Pauses off screen, draws one still frame for reduced motion, and falls
   * back to a plain gradient when WebGL is missing. Decorative only.
   * scale: render resolution (0.5 is plenty for a soft blur). tone: 'forest' | 'night' (darker, for the footer).
   */
  let { class: cls = '', scale = 0.55, tone = 'forest', speed = 1 } = $props();
  let canvas = $state();

  const VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  const FRAG = `precision highp float;
uniform vec2 u_res; uniform float u_time; uniform float u_night;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.02+vec2(17.3,9.1);a*=.5;}return v;}
void main(){
  vec2 uv=gl_FragCoord.xy/u_res;
  vec2 p=(uv-.5)*vec2(u_res.x/u_res.y,1.)*1.7;
  float t=u_time*.055;
  vec2 q=vec2(fbm(p+vec2(0.,t)),fbm(p+vec2(5.2,1.3)-t));
  vec2 r=vec2(fbm(p+3.*q+vec2(1.7,9.2)+t*1.3),fbm(p+3.*q+vec2(8.3,2.8)-t));
  float f=fbm(p+3.*r);
  vec3 deep=vec3(.015,.11,.075), sage=vec3(.50,.65,.54), cream=vec3(.83,.81,.73), brown=vec3(.34,.21,.12);
  vec3 col=mix(deep,sage,smoothstep(.12,.72,f));
  col=mix(col,cream,smoothstep(.55,.95,r.x)*.8);
  col=mix(col,brown,smoothstep(.62,1.,q.y)*.45);
  col*=.82+.3*smoothstep(1.25,0.,length(uv-.5));
  col=mix(col,col*vec3(.18,.24,.2),u_night);
  gl_FragColor=vec4(col,1.);
}`;

  onMount(() => {
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
    if (!gl) return;
    const compile = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(prog, 'u_res');
    const uTime = gl.getUniformLocation(prog, 'u_time');
    gl.uniform1f(gl.getUniformLocation(prog, 'u_night'), tone === 'night' ? 1 : 0);

    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let raf = 0, visible = false, start = performance.now(), offset = 12;

    const size = () => {
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      const w = Math.max(2, Math.round(canvas.clientWidth * dpr * scale));
      const h = Math.max(2, Math.round(canvas.clientHeight * dpr * scale));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
    };
    const draw = (now) => {
      size();
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, offset + ((now - start) / 1000) * speed);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const loop = (now) => { raf = 0; if (!visible || document.hidden) return; draw(now); raf = requestAnimationFrame(loop); };
    const sync = () => {
      cancelAnimationFrame(raf); raf = 0;
      if (reduced.matches) { draw(start); canvas.dataset.ready = ''; return; }
      if (visible && !document.hidden) raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync(); }, { threshold: 0 });
    io.observe(canvas);
    const ro = new ResizeObserver(() => { if (reduced.matches) draw(start); });
    ro.observe(canvas);
    draw(start);
    canvas.dataset.ready = '';
    document.addEventListener('visibilitychange', sync);
    reduced.addEventListener('change', sync);
    return () => {
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect();
      document.removeEventListener('visibilitychange', sync);
      reduced.removeEventListener('change', sync);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  });
</script>

<!-- The gradient behind is what you see before WebGL starts, or when it is unavailable. -->
<div class={cn('absolute inset-0 overflow-hidden bg-[linear-gradient(150deg,#0e3b2a_0%,#86a98a_48%,#d9d3c1_100%)]', tone === 'night' && 'bg-[linear-gradient(150deg,#06130e_0%,#1b2a24_55%,#0c1210_100%)]', cls)} aria-hidden="true">
  <canvas bind:this={canvas} class="absolute inset-0 block size-full opacity-0 transition-opacity duration-1000 data-ready:opacity-100"></canvas>
</div>
