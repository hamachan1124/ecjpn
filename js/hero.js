/* ヒーロー背景：AIをイメージしたネットワークのアニメーション
   点（ノード）がゆっくり漂い、近い点どうしが線でつながり、線の上を光（信号）が流れます。 */
(function () {
  var canvas = document.querySelector('.hero__canvas');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var LINK = 150;      // 線でつなぐ距離（px）
  var SPEED = 0.35;    // 点の動く速さ
  var w = 0, h = 0, nodes = [], pulses = [], running = false, raf = 0;

  function setup() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var count = Math.round(Math.min(110, Math.max(28, (w * h) / 14000)));
    nodes = []; pulses = [];
    for (var i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * SPEED, vy: (Math.random() - 0.5) * SPEED,
        r: Math.random() * 1.6 + 0.8
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    var i, j, a, b, dx, dy, d;

    for (i = 0; i < nodes.length; i++) {
      a = nodes[i];
      a.x += a.vx; a.y += a.vy;
      if (a.x < 0 || a.x > w) a.vx *= -1;
      if (a.y < 0 || a.y > h) a.vy *= -1;
    }

    ctx.lineWidth = 1;
    for (i = 0; i < nodes.length; i++) {
      a = nodes[i];
      for (j = i + 1; j < nodes.length; j++) {
        b = nodes[j];
        dx = a.x - b.x; dy = a.y - b.y;
        d = Math.sqrt(dx * dx + dy * dy);
        if (d < LINK) {
          ctx.strokeStyle = 'rgba(255,255,255,' + ((1 - d / LINK) * 0.28).toFixed(3) + ')';
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          if (running && pulses.length < 40 && Math.random() < 0.0004) {
            pulses.push({ a: a, b: b, t: 0 });
          }
        }
      }
    }

    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    for (i = 0; i < nodes.length; i++) {
      a = nodes[i];
      ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill();
    }

    ctx.shadowColor = '#ffffff'; ctx.shadowBlur = 12; ctx.fillStyle = '#ffffff';
    for (i = pulses.length - 1; i >= 0; i--) {
      var p = pulses[i];
      p.t += 0.02;
      if (p.t >= 1) { pulses.splice(i, 1); continue; }
      ctx.beginPath();
      ctx.arc(p.a.x + (p.b.x - p.a.x) * p.t, p.a.y + (p.b.y - p.a.y) * p.t, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    if (running) raf = requestAnimationFrame(draw);
  }

  function start() { if (!running && !reduce) { running = true; raf = requestAnimationFrame(draw); } }
  function stop() { running = false; cancelAnimationFrame(raf); }

  setup();
  draw(); // 最初の1コマ（動きを減らす設定の場合はこの静止画のみ）

  // 画面に見えている間だけ動かす
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e) { e[0].isIntersecting ? start() : stop(); }).observe(canvas);
  } else { start(); }

  var lastW = w;
  window.addEventListener('resize', function () {
    if (canvas.clientWidth === lastW && canvas.clientHeight === h) return;
    lastW = canvas.clientWidth; setup(); if (!running) draw();
  });
})();
