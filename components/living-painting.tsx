"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { Pause, Play } from "lucide-react";

const vertex = `attribute vec2 position; varying vec2 uv; void main(){uv=position*.5+.5;gl_Position=vec4(position,0.,1.);}`;
const fragment = `precision highp float;
varying vec2 uv;
uniform sampler2D painting;
uniform vec2 viewport;
uniform vec2 picture;
uniform float scrollOffset;
uniform float time;
uniform float motion;
void main(){
 vec2 p=vec2(uv.x,1.-uv.y);
 vec2 q=vec2((p.x*viewport.x+(picture.x-viewport.x)*.5)/picture.x,(p.y*viewport.y+scrollOffset)/picture.y);
 float sky=1.-smoothstep(.46,.60,q.y);
 float flowers=smoothstep(.54,.73,q.y);
 float breeze=sin(q.y*20.+time*.55+sin(q.x*9.-time*.22));
 float ribbon=sin(q.x*13.+q.y*18.-time*.35);
 // Traveling gusts keep neighboring flowers related, without swaying in lockstep.
 float gust=sin(time*.85-q.x*7.+q.y*3.);
 float flutter=sin(time*1.45-q.x*18.+q.y*11.);
 float sway=gust*.0055+flutter*.0013;
 // Pin the lower edge so the foreground feels rooted rather than sliding.
 float rooted=1.-smoothstep(.91,1.,q.y);
 q.x+=motion*(sky*breeze*.0025+flowers*rooted*sway);
 q.y+=motion*(sky*ribbon*.0013+flowers*rooted*(cos(time*.85-q.x*7.+q.y*3.)*.0011));
 q=clamp(q,vec2(.001),vec2(.999));
 vec3 color=texture2D(painting,q).rgb;
 color*=1.+motion*sky*.012*sin(time*.7+q.x*5.+q.y*4.);
 gl_FragColor=vec4(color,1.);
}`;

export function LivingPainting({ scene }: { scene: RefObject<HTMLDivElement | null> }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const fallback = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const pauseRef = useRef(false);
  useEffect(() => { pauseRef.current = paused; window.dispatchEvent(new Event("painting-motion")); }, [paused]);

  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const gl = element.getContext("webgl", { alpha: false, antialias: false, powerPreference: "low-power" });
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0, disposed = false, loaded = false, last = 0, time = 0;
    let program: WebGLProgram | null = null;
    const shaders: WebGLShader[] = [];
    let buffer: WebGLBuffer | null = null, texture: WebGLTexture | null = null;
    if (gl) {
      const compile = (kind: number, source: string) => {
        const shader = gl.createShader(kind)!; shaders.push(shader);
        gl.shaderSource(shader, source); gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error("Shader unavailable");
        return shader;
      };
      try {
        program = gl.createProgram()!;
        gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex));
        gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment));
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error("Program unavailable");
        gl.useProgram(program);
        buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
        const position = gl.getAttribLocation(program, "position");
        gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
        texture = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.uniform1i(gl.getUniformLocation(program, "painting"), 0);
      } catch { program = null; }
    }
    const uniforms = gl && program ? Object.fromEntries(["viewport", "picture", "scrollOffset", "time", "motion"].map(key => [key, gl.getUniformLocation(program!, key)])) : null;
    function draw(now: number) {
      frame = 0;
      if (disposed || document.hidden) { last = 0; return; }
      const width = window.innerWidth, height = window.innerHeight;
      const pictureHeight = Math.max(height * (width <= 760 ? 2.1 : 1), width * 1.5);
      const pictureWidth = pictureHeight / 1.5;
      const range = Math.max(1, (scene.current?.offsetHeight || height * 2.5) - height);
      const progress = Math.max(0, Math.min(1, -(scene.current?.getBoundingClientRect().top || 0) / range));
      const offset = (pictureHeight - height) * progress;
      if (fallback.current) fallback.current.style.transform = `translate3d(0,${-offset}px,0)`;
      const moving = !pauseRef.current && !media.matches && (scene.current?.getBoundingClientRect().bottom ?? 0) > 0;
      if (last && moving) time += Math.min((now - last) / 1000, .05);
      last = now;
      if (gl && program && uniforms && loaded) {
        const dpr = Math.min(devicePixelRatio || 1, width <= 760 ? 1.5 : 2);
        const bw = Math.round(width*dpr), bh = Math.round(height*dpr);
        if (element!.width !== bw || element!.height !== bh) { element!.width = bw; element!.height = bh; gl.viewport(0,0,bw,bh); }
        gl.uniform2f(uniforms.viewport, width, height);
        gl.uniform2f(uniforms.picture, pictureWidth, pictureHeight);
        gl.uniform1f(uniforms.scrollOffset, offset);
        gl.uniform1f(uniforms.time, time);
        gl.uniform1f(uniforms.motion, media.matches ? 0 : 1);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      if (moving && loaded && program) frame = requestAnimationFrame(draw);
    }
    const schedule = () => { if (!frame && !disposed) frame = requestAnimationFrame(draw); };
    const changeMotion = () => { setReduced(media.matches); schedule(); };
    const contextLost = (event: Event) => { event.preventDefault(); loaded = false; setReady(false); cancelAnimationFrame(frame); frame = 0; };
    const source = new Image();
    source.onload = () => {
      if (disposed) return;
      if (gl && program) {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,source);
        loaded = true; setReady(true);
      }
      schedule();
    };
    source.src = "/painted-landscape-hd.webp";
    changeMotion();
    const resizeObserver = new ResizeObserver(schedule);
    if (scene.current) resizeObserver.observe(scene.current);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("painting-motion", schedule);
    document.addEventListener("visibilitychange", schedule);
    media.addEventListener("change", changeMotion);
    element.addEventListener("webglcontextlost", contextLost);
    return () => {
      disposed = true; cancelAnimationFrame(frame); resizeObserver.disconnect();
      window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule);
      window.removeEventListener("painting-motion", schedule); document.removeEventListener("visibilitychange", schedule);
      media.removeEventListener("change", changeMotion); element.removeEventListener("webglcontextlost", contextLost);
      if (gl) { gl.deleteTexture(texture); gl.deleteBuffer(buffer); if(program) gl.deleteProgram(program); shaders.forEach(shader=>gl.deleteShader(shader)); }
    };
  }, [scene]);

  return <>
    <div className="painting-window" aria-hidden="true">
      <div ref={fallback} className="painting"><img src="/painted-landscape-hd.webp" alt="" width="1024" height="1536" fetchPriority="high" /></div>
      <canvas ref={canvas} className={`living-canvas ${ready ? "is-ready" : ""}`} />
      <div className="painting-shade" />
    </div>
    {ready && !reduced && <button type="button" className="motion-control" onClick={() => setPaused(!paused)} aria-label={paused ? "Retomar animação da pintura" : "Pausar animação da pintura"} aria-pressed={paused} title={paused ? "Retomar movimento" : "Pausar movimento"}>{paused ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}</button>}
  </>;
}
