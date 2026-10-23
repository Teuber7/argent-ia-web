/* =============================================================
   Fondo interactivo de cubos (WebGL2)
   Port a JavaScript puro del componente React "Cubes".
   Inspirado en el trabajo original de Can Tastemel para lambda.ai
   https://cantastemel.com

   Uso:  window.mountCubes(contenedor, { gridSize: 12, ... })
   Devuelve una función para desmontarlo.
   Si el navegador no soporta WebGL2, no hace nada y devuelve null.
   ============================================================= */
(function () {
  "use strict";

  var VERTEX = `#version 300 es
in vec3 aPosition;
in vec3 aNormal;
in vec2 aUv;
in vec2 aCenter;
in vec4 aRotation;
in vec2 aState;
uniform mat4 uProjection;
uniform float uSize;
out vec3 vNormal;
out vec2 vUv;
out float vFlash;

vec3 turn(vec4 q, vec3 v) {
  return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);
}

void main() {
  vec3 local = turn(aRotation, aPosition * uSize * aState.y);
  vNormal = turn(aRotation, aNormal);
  vUv = aUv;
  vFlash = aState.x;
  gl_Position = uProjection * vec4(vec3(aCenter, 0.0) + local, 1.0);
}`;

  var FRAGMENT = `#version 300 es
precision highp float;
in vec3 vNormal;
in vec2 vUv;
in float vFlash;
uniform vec3 uFace;
uniform vec3 uEdge;
uniform vec3 uRipple;
uniform vec3 uLight;
uniform float uShading;
uniform float uEdgeWidth;
uniform float uStyle;
uniform float uMarks;
uniform float uOpacity;
out vec4 outColor;

void main() {
  vec2 span = max(fwidth(vUv), vec2(0.00001));
  vec2 border = min(vUv, 1.0 - vUv) / span;
  bool vertical = border.x < border.y;
  float distance = min(border.x, border.y);
  float halfWidth = uEdgeWidth * 0.5;
  float cover = 1.0 - smoothstep(halfWidth - 0.5, halfWidth + 0.5, distance);
  float along = vertical ? vUv.y : vUv.x;
  float phase = along * uMarks;
  float step = max(vertical ? span.y : span.x, 0.00001) * uMarks;
  float offset = abs(fract(phase + 0.5) - 0.5);
  if (uStyle > 0.5 && uStyle < 1.5) {
    cover *= 1.0 - smoothstep(0.25 - step, 0.25 + step, offset);
  } else if (uStyle > 1.5 && uStyle < 2.5) {
    float radius = max(uEdgeWidth * 0.9, 1.0);
    float dot = length(vec2(offset / step, distance));
    cover = 1.0 - smoothstep(radius - 0.75, radius + 0.75, dot);
  } else if (uStyle > 2.5) {
    cover = 0.0;
  }
  vec3 normal = normalize(vNormal);
  cover *= smoothstep(0.06, 0.28, abs(normal.z));
  float side = clamp(1.0 - normal.z, 0.0, 1.0);
  float toward = clamp(0.6 + 0.6 * dot(normalize(normal.xy + vec2(0.00001)), normalize(uLight.xy)), 0.0, 1.0);
  vec3 face = mix(uFace, uEdge, side * mix(0.12, 0.42, toward) * uShading);
  face = mix(face, uRipple, vFlash * 0.22);
  vec3 edge = mix(uEdge, uRipple, vFlash);
  vec3 color = mix(face, edge, cover);
  float alpha = mix(uOpacity, 1.0, cover);
  outColor = vec4(color * alpha, alpha);
}`;

  var FACES = [
    [0, 0, 1, 1, 0, 0, 0, 1, 0],
    [0, 0, -1, -1, 0, 0, 0, 1, 0],
    [1, 0, 0, 0, 0, -1, 0, 1, 0],
    [-1, 0, 0, 0, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 0, 0, 0, -1],
    [0, -1, 0, 1, 0, 0, 0, 0, 1]
  ];

  var STYLES = { solid: 0, dashed: 1, dotted: 2, none: 3 };
  var INTRO_SECONDS = 1.1;

  function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }

  function buildCube() {
    var vertices = [];
    var indices = [];
    FACES.forEach(function (f, face) {
      var nx = f[0], ny = f[1], nz = f[2], ux = f[3], uy = f[4], uz = f[5], vx = f[6], vy = f[7], vz = f[8];
      [[0, 0], [1, 0], [1, 1], [0, 1]].forEach(function (c) {
        var u = c[0], v = c[1];
        vertices.push(
          nx * 0.5 + (u - 0.5) * ux + (v - 0.5) * vx,
          ny * 0.5 + (u - 0.5) * uy + (v - 0.5) * vy,
          nz * 0.5 + (u - 0.5) * uz + (v - 0.5) * vz,
          nx, ny, nz, u, v
        );
      });
      var base = face * 4;
      indices.push(base, base + 1, base + 2, base, base + 2, base + 3);
    });
    return { vertices: new Float32Array(vertices), indices: new Uint16Array(indices) };
  }

  function compile(gl, type, source) {
    var shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
    gl.deleteShader(shader);
    return null;
  }

  function link(gl) {
    var vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
    var fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    var program = gl.createProgram();
    if (!vertex || !fragment || !program) return null;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    ["aPosition", "aNormal", "aUv", "aCenter", "aRotation", "aState"].forEach(function (name, index) {
      gl.bindAttribLocation(program, index, name);
    });
    gl.linkProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      return null;
    }
    var uniforms = {};
    var count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (var i = 0; i < count; i++) {
      var info = gl.getActiveUniform(program, i);
      if (info) uniforms[info.name] = gl.getUniformLocation(program, info.name);
    }
    return { program: program, uniforms: uniforms };
  }

  function toRotation(rx, ry, out, offset) {
    var angle = Math.hypot(rx, ry);
    if (angle < 0.000001) {
      out[offset] = 0; out[offset + 1] = 0; out[offset + 2] = 0; out[offset + 3] = 1;
      return;
    }
    var s = Math.sin(angle / 2) / angle;
    out[offset] = rx * s;
    out[offset + 1] = ry * s;
    out[offset + 2] = 0;
    out[offset + 3] = Math.cos(angle / 2);
  }

  function multiply(a, b, out, offset) {
    var ax = a[0], ay = a[1], az = a[2], aw = a[3];
    var bx = b[0], by = b[1], bz = b[2], bw = b[3];
    out[offset] = aw * bx + ax * bw + ay * bz - az * by;
    out[offset + 1] = aw * by - ax * bz + ay * bw + az * bx;
    out[offset + 2] = aw * bz + ax * by - ay * bx + az * bw;
    out[offset + 3] = aw * bw - ax * bx - ay * by - az * bz;
  }

  function projection(width, height, scale, perspective) {
    var halfWidth = width / 2 / scale;
    var halfHeight = height / 2 / scale;
    var depth = Math.max(halfWidth, halfHeight) * 4 + 4;
    if (perspective <= 0.001) {
      return new Float32Array([1 / halfWidth, 0, 0, 0, 0, 1 / halfHeight, 0, 0, 0, 0, -1 / depth, 0, 0, 0, 0, 1]);
    }
    var fov = ((8 + perspective * 52) * Math.PI) / 180;
    var distance = halfHeight / Math.tan(fov / 2);
    var near = Math.max(0.1, distance - depth);
    var far = distance + depth;
    var f = 1 / Math.tan(fov / 2);
    var aspect = halfWidth / halfHeight;
    return new Float32Array([
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (far + near) / (near - far), -1,
      0, 0, (2 * far * near) / (near - far) - ((far + near) / (near - far)) * distance, distance
    ]);
  }

  window.mountCubes = function (container, options) {
    if (!container) return null;
    var o = options || {};
    var s = {
      gridSize: Math.round(clamp(o.gridSize == null ? 10 : o.gridSize, 1, 40)),
      gap: clamp(o.gap == null ? 0.18 : o.gap, 0, 0.9),
      faceColor: String(o.faceColor || "#120F17"),
      edgeColor: String(o.edgeColor || "#ffffff"),
      edgeWidth: Math.max(0, o.edgeWidth == null ? 1 : o.edgeWidth),
      edgeStyle: o.edgeStyle || "solid",
      faceOpacity: clamp(o.faceOpacity == null ? 1 : o.faceOpacity, 0, 1),
      shading: Math.max(0, o.shading == null ? 0.6 : o.shading),
      maxAngle: o.maxAngle == null ? 45 : o.maxAngle,
      radius: Math.max(0.5, o.radius == null ? 3 : o.radius),
      speed: Math.max(0.05, o.speed == null ? 1 : o.speed),
      bounce: clamp(o.bounce == null ? 0.4 : o.bounce, 0, 1),
      brush: Math.max(0, o.brush == null ? 1 : o.brush),
      perspective: clamp(o.perspective == null ? 0 : o.perspective, 0, 1),
      autoAnimate: o.autoAnimate !== false,
      rippleOnClick: o.rippleOnClick !== false,
      rippleColor: String(o.rippleColor || "#ffffff"),
      rippleSpeed: Math.max(0.05, o.rippleSpeed == null ? 1 : o.rippleSpeed),
      intro: o.intro !== false,
      paused: !!o.paused,
      dpr: o.dpr
    };

    var canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = "position:absolute;inset:0;display:block;width:100%;height:100%";
    container.appendChild(canvas);

    var gl = canvas.getContext("webgl2", {
      alpha: true, premultipliedAlpha: true, antialias: true, depth: true, stencil: false
    });
    if (!gl) { container.removeChild(canvas); return null; }
    var shader = link(gl);
    if (!shader) { container.removeChild(canvas); return null; }

    var cube = buildCube();
    var vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, cube.vertices, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 32, 0);
    gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 32, 12);
    gl.enableVertexAttribArray(2); gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 32, 24);
    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, cube.indices, gl.STATIC_DRAW);
    var instanceBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, instanceBuffer);
    [[3, 2, 0], [4, 4, 8], [5, 2, 24]].forEach(function (a) {
      gl.enableVertexAttribArray(a[0]);
      gl.vertexAttribPointer(a[0], a[1], gl.FLOAT, false, 32, a[2]);
      gl.vertexAttribDivisor(a[0], 1);
    });

    var probe = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
    var colorCache = {};
    function toRgb(value) {
      if (colorCache[value]) return colorCache[value];
      var rgb = [1, 1, 1];
      if (probe) {
        probe.clearRect(0, 0, 1, 1);
        probe.fillStyle = "#ffffff";
        probe.fillStyle = value;
        probe.fillRect(0, 0, 1, 1);
        var d = probe.getImageData(0, 0, 1, 1).data;
        rgb = [d[0] / 255, d[1] / 255, d[2] / 255];
      }
      colorCache[value] = rgb;
      return rgb;
    }

    var reduce = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false;
    var view = { width: 1, height: 1, ratio: 1, scale: 1 };
    var pointer = { x: 0, y: 0, inside: false, moved: 0 };
    var cursor = { x: 0, y: 0, vx: 0, vy: 0, weight: 0, primed: false };
    var grid = { size: 0, count: 0 };
    var rx = new Float32Array(0), ry = new Float32Array(0);
    var wx = new Float32Array(0), wy = new Float32Array(0);
    var glow = new Float32Array(0);
    var rings = [];
    var delays = new Float32Array(0);
    var instances = new Float32Array(0);
    var clock = 0;
    var introClock = s.intro && !reduce ? 0 : 99;
    var raf = 0, last = 0, visible = true;

    function allocate(size) {
      if (grid.size === size) return;
      grid.size = size;
      grid.count = size * size;
      rx = new Float32Array(grid.count);
      ry = new Float32Array(grid.count);
      wx = new Float32Array(grid.count);
      wy = new Float32Array(grid.count);
      glow = new Float32Array(grid.count);
      delays = new Float32Array(grid.count);
      instances = new Float32Array(grid.count * 8);
      var center = (size - 1) / 2;
      for (var i = 0; i < grid.count; i++) {
        delays[i] = Math.hypot((i % size) - center, Math.floor(i / size) - center) / Math.max(1, size / 2);
      }
    }

    function cellOf(i) {
      var size = grid.size;
      var center = (size - 1) / 2;
      return [(i % size) - center, center - Math.floor(i / size)];
    }

    function toWorld(x, y) {
      return [(x - view.width / 2) / view.scale, (view.height / 2 - y) / view.scale];
    }

    function ripple(x, y) {
      if (!s.rippleOnClick || reduce) return;
      var p = toWorld(x, y);
      rings.push({ x: p[0], y: p[1], born: clock });
      if (rings.length > 6) rings.shift();
      wake();
    }

    function render() {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      if (!grid.count) return;
      gl.useProgram(shader.program);
      gl.bindVertexArray(vao);
      gl.bindBuffer(gl.ARRAY_BUFFER, instanceBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, instances, gl.DYNAMIC_DRAW);
      var u = shader.uniforms;
      gl.uniformMatrix4fv(u.uProjection, false, projection(view.width, view.height, view.scale, s.perspective));
      gl.uniform1f(u.uSize, 1 - s.gap);
      gl.uniform3fv(u.uFace, toRgb(s.faceColor));
      gl.uniform3fv(u.uEdge, toRgb(s.edgeColor));
      gl.uniform3fv(u.uRipple, toRgb(s.rippleColor));
      var light = [-0.42, 0.55, 0.72];
      var len = Math.hypot(light[0], light[1], light[2]);
      gl.uniform3f(u.uLight, light[0] / len, light[1] / len, light[2] / len);
      gl.uniform1f(u.uShading, s.shading);
      gl.uniform1f(u.uEdgeWidth, s.edgeWidth * view.ratio);
      gl.uniform1f(u.uStyle, STYLES[s.edgeStyle] == null ? 0 : STYLES[s.edgeStyle]);
      var cubePixels = (1 - s.gap) * view.scale;
      var spacing = s.edgeStyle === "dotted" ? Math.max(4, s.edgeWidth * 4) : Math.max(6, s.edgeWidth * 6);
      gl.uniform1f(u.uMarks, Math.max(1, Math.round(cubePixels / spacing)));
      gl.uniform1f(u.uOpacity, s.faceOpacity);

      gl.enable(gl.DEPTH_TEST);
      gl.enable(gl.CULL_FACE);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      if (s.faceOpacity >= 0.999) {
        gl.depthMask(true);
        gl.cullFace(gl.BACK);
        gl.drawElementsInstanced(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0, grid.count);
      } else {
        gl.depthMask(false);
        gl.cullFace(gl.FRONT);
        gl.drawElementsInstanced(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0, grid.count);
        gl.cullFace(gl.BACK);
        gl.drawElementsInstanced(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0, grid.count);
        gl.depthMask(true);
      }
    }

    function step(dt) {
      allocate(s.gridSize);
      clock += dt;
      if (introClock < 99) introClock += dt;

      var live = s.autoAnimate && !reduce && (!pointer.inside || clock - pointer.moved > 3);
      var goalX = cursor.x, goalY = cursor.y, engaged = false;
      if (pointer.inside && clock - pointer.moved <= 3) {
        var w = toWorld(pointer.x, pointer.y);
        goalX = w[0]; goalY = w[1]; engaged = true;
      } else if (live) {
        var reach = grid.size * 0.42;
        goalX = Math.sin(clock * 0.37) * reach * Math.cos(clock * 0.11);
        goalY = Math.sin(clock * 0.53 + 1.2) * reach;
        engaged = true;
      }
      if (!cursor.primed && engaged) { cursor.x = goalX; cursor.y = goalY; cursor.primed = true; }
      var follow = 1 - Math.exp(-dt * 18);
      var prevX = cursor.x, prevY = cursor.y;
      cursor.x += (goalX - cursor.x) * follow;
      cursor.y += (goalY - cursor.y) * follow;
      var blend = 1 - Math.exp(-dt * 10);
      cursor.vx += ((cursor.x - prevX) / Math.max(dt, 0.001) - cursor.vx) * blend;
      cursor.vy += ((cursor.y - prevY) / Math.max(dt, 0.001) - cursor.vy) * blend;
      cursor.weight += ((engaged ? 1 : 0) - cursor.weight) * (1 - Math.exp(-dt * (engaged ? 6 : 2.5)));

      var stiffness = 160 * s.speed * s.speed;
      var damping = 2 * (1 - 0.82 * s.bounce) * Math.sqrt(stiffness);
      var maxAngle = (s.maxAngle * Math.PI) / 180;
      var lift = 0.8;
      var travel = 8 * s.rippleSpeed;
      var fade = Math.exp(-dt * 3.2);
      var reachLimit = grid.size * 1.5 + 2;
      for (var k = rings.length - 1; k >= 0; k--) {
        if ((clock - rings[k].born) * travel > reachLimit) rings.splice(k, 1);
      }
      var speedNow = Math.hypot(cursor.vx, cursor.vy);
      var sweepX = speedNow > 0.0001 ? -cursor.vy / speedNow : 0;
      var sweepY = speedNow > 0.0001 ? cursor.vx / speedNow : 0;
      var sweep = reduce ? 0 : Math.min(speedNow, 40) * s.brush * 1.6;
      var moving = false;

      for (var i = 0; i < grid.count; i++) {
        var cell = cellOf(i);
        var cx = cell[0], cy = cell[1];
        var dx = cx - cursor.x, dy = cy - cursor.y;
        var distance = Math.hypot(dx, dy);
        var t = distance / s.radius;
        var falloff = t < 1 ? (1 - t * t) * (1 - t * t) * cursor.weight : 0;
        var targetX = 0, targetY = 0;
        if (falloff > 0 && distance > 0.0001) {
          var tiltAmount = maxAngle * falloff * (distance / Math.hypot(distance, lift));
          targetX = (dy / distance) * tiltAmount;
          targetY = (-dx / distance) * tiltAmount;
        }
        if (falloff > 0 && sweep > 0) {
          wx[i] += sweepX * sweep * falloff * dt * 4;
          wy[i] += sweepY * sweep * falloff * dt * 4;
        }
        glow[i] *= fade;
        for (var r = 0; r < rings.length; r++) {
          var ring = rings[r];
          var ox = cx - ring.x, oy = cy - ring.y;
          var reachR = Math.hypot(ox, oy);
          var now = (clock - ring.born) * travel;
          if (reachR > now || reachR <= now - travel * dt || reachR < 0.0001) continue;
          var strength = Math.exp(-reachR / (grid.size * 0.8));
          wx[i] -= (oy / reachR) * 13 * strength;
          wy[i] += (ox / reachR) * 13 * strength;
          glow[i] = Math.max(glow[i], strength);
        }
        if (glow[i] > 0.01) moving = true;
        if (reduce) {
          rx[i] = targetX; ry[i] = targetY; wx[i] = 0; wy[i] = 0;
        } else {
          wx[i] += (stiffness * (targetX - rx[i]) - damping * wx[i]) * dt;
          wy[i] += (stiffness * (targetY - ry[i]) - damping * wy[i]) * dt;
          rx[i] += wx[i] * dt;
          ry[i] += wy[i] * dt;
        }
        if (Math.abs(targetX - rx[i]) + Math.abs(targetY - ry[i]) > 0.0005 ||
            Math.abs(wx[i]) + Math.abs(wy[i]) > 0.0005) moving = true;

        var grow = 1, tumble = 0;
        if (introClock < 99) {
          var local = clamp((introClock - delays[i] * 0.55) / INTRO_SECONDS, 0, 1);
          var eased = 1 - Math.pow(1 - local, 3);
          grow = eased;
          tumble = (1 - eased) * (Math.PI / 2);
          if (local < 1) moving = true;
        }

        var tilt = [0, 0, 0, 1];
        toRotation(rx[i], ry[i], tilt, 0);
        var turn = [Math.sin(tumble / 2), 0, 0, Math.cos(tumble / 2)];
        var base = i * 8;
        instances[base] = cx;
        instances[base + 1] = cy;
        multiply(tilt, turn, instances, base + 2);
        instances[base + 6] = glow[i];
        instances[base + 7] = grow;
      }
      if (introClock >= INTRO_SECONDS + 0.6 && introClock < 99) introClock = 99;
      return moving || live || rings.length > 0 ||
        (engaged && speedNow > 0.01) ||
        Math.abs((engaged ? 1 : 0) - cursor.weight) > 0.002;
    }

    function frame(now) {
      raf = 0;
      if (!visible || document.hidden) return;
      var dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      var active = s.paused ? false : step(dt);
      render();
      if (active) raf = requestAnimationFrame(frame);
      else last = 0;
    }

    function wake() {
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame);
    }

    function resize() {
      var width = Math.max(1, container.clientWidth);
      var height = Math.max(1, container.clientHeight);
      view.ratio = Math.min(s.dpr || window.devicePixelRatio || 1, 2);
      view.width = width;
      view.height = height;
      view.scale = Math.max(width, height) / (s.gridSize + 0.9);
      canvas.width = Math.max(1, Math.round(width * view.ratio));
      canvas.height = Math.max(1, Math.round(height * view.ratio));
      allocate(s.gridSize);
      if (!raf) { step(0); render(); }
      wake();
    }

    function onPointerMove(event) {
      var rect = container.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.inside = pointer.x >= 0 && pointer.y >= 0 && pointer.x <= rect.width && pointer.y <= rect.height;
      if (pointer.inside) pointer.moved = clock;
      wake();
    }

    function onPointerLeave() { pointer.inside = false; wake(); }

    function onPointerDown(event) {
      var rect = container.getBoundingClientRect();
      ripple(event.clientX - rect.left, event.clientY - rect.top);
    }

    function onVisibility() { last = 0; wake(); }

    var resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    var intersection = new IntersectionObserver(function (entries) {
      visible = entries.some(function (e) { return e.isIntersecting; });
      if (visible) { last = 0; wake(); }
    });
    intersection.observe(container);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("visibilitychange", onVisibility);
    resize();

    return function destroy() {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersection.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("visibilitychange", onVisibility);
      gl.deleteBuffer(vertexBuffer);
      gl.deleteBuffer(indexBuffer);
      gl.deleteBuffer(instanceBuffer);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(shader.program);
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  };
})();
