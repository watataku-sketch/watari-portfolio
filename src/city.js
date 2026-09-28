import p5 from 'p5';

const sketch = (p) => {
  let pg; 
  let stars = [];        
  let clouds = [];
  let townHouses = [];
  let trees = [];
  let flyingBirds = [];
  let airplanes = [];    
  let cars = [];
  let duckFamilies = [];
  let boats = [];

  const fontMap = {
    '0': [1,1,1, 1,0,1, 1,0,1, 1,0,1, 1,1,1], '1': [0,1,0, 0,1,0, 0,1,0, 0,1,0, 0,1,0],
    '2': [1,1,1, 0,0,1, 1,1,1, 1,0,0, 1,1,1], '3': [1,1,1, 0,0,1, 1,1,1, 0,0,1, 1,1,1],
    '4': [1,0,1, 1,0,1, 1,1,1, 0,0,1, 0,0,1], '5': [1,1,1, 1,0,0, 1,1,1, 0,0,1, 1,1,1],
    '6': [1,1,1, 1,0,0, 1,1,1, 1,0,1, 1,1,1], '7': [1,1,1, 0,0,1, 0,1,0, 0,1,0, 0,1,0],
    '8': [1,1,1, 1,0,1, 1,1,1, 1,0,1, 1,1,1], '9': [1,1,1, 1,0,1, 1,1,1, 0,0,1, 1,1,1],
    ':': [0,0,0, 0,1,0, 0,0,0, 0,1,0, 0,0,0],
    'K': [1,0,1, 1,1,0, 1,0,0, 1,1,0, 1,0,1], 'I': [1,1,1, 0,1,0, 0,1,0, 0,1,0, 1,1,1],
    'T': [1,1,1, 0,1,0, 0,1,0, 0,1,0, 0,1,0], 'E': [1,1,1, 1,0,0, 1,1,0, 1,0,0, 1,1,1],
    'O': [1,1,1, 1,0,1, 1,0,1, 1,0,1, 1,1,1], 'S': [1,1,1, 1,0,0, 1,1,1, 0,0,1, 1,1,1],
    'A': [1,1,1, 1,0,1, 1,1,1, 1,0,1, 1,0,1]
  };

  p.setup = () => {
    // ★ 895:108 の比率を維持したまま、画面幅に合わせて高さを自動計算
    let canvasHeight = p.windowWidth * (108 / 895);
    let canvas = p.createCanvas(p.windowWidth, canvasHeight);
    canvas.parent('hero-sketch'); // htmlのdivタグに挿入
    p.noSmooth(); 
    
    pg = p.createGraphics(895, 108);
    pg.noSmooth();
    
    initTownData();
  };

  p.windowResized = () => {
    // ★ リサイズ時も同様に比率を維持して高さを計算
    let canvasHeight = p.windowWidth * (108 / 895);
    p.resizeCanvas(p.windowWidth, canvasHeight);
  };

  p.draw = () => {
    let h = p.hour();
    let m = p.minute();
    let s = p.second();
    
    drawDynamicSky(pg, h, m);
    drawStars(pg, h, m);
    drawCelestialBody(pg, h, m);
    updateAndDrawClouds(pg);
    
    updateAndDrawAirplanes(pg);
    updateAndDrawBirds(pg);
    
    drawTownHouses(pg, h);
    drawBalloons(pg);
    
    drawCityRoad(pg);
    updateAndDrawCars(pg);
    drawNatureAndLife(pg);
    
    drawCobbleBank(pg);
    drawCentralPostOffice(pg, h, m, s);
    
    let d = new Date();
    let smoothSec = d.getSeconds() + (d.getMilliseconds() / 1000.0); 
    // p.floor() で座標を「必ず整数（ピクセル単位）」に切り捨てる
    let trainX = p.floor(p.map(smoothSec, 0, 60, -50, 1250));
    drawMailTram(pg, trainX, 75); 

    drawWater(pg);
    updateAndDrawDucks(pg);
    updateAndDrawBoats(pg);
    
    p.background(0); 
    
    let aspect = 895 / 108; 
    let drawW = p.width;
    let drawH = p.width / aspect;
    
    if (drawH > p.height) {
      drawH = p.height;
      drawW = p.height * aspect;
    }
    
    let drawX = (p.width - drawW) / 2;
    let drawY = (p.height - drawH) / 2;
    
    p.image(pg, drawX, drawY, drawW, drawH);
  };

  function initTownData() {
    for (let i = 0; i < 50; i++) {
      stars.push({ x: p.random(895), y: p.random(45), size: p.random([1, 2]), offset: p.random(100) });
    }
    for (let i = 0; i < 8; i++) {
      clouds.push({ x: p.random(895), y: p.random(5, 25), w: p.floor(p.random(15, 35)), speed: p.random(0.05, 0.15) });
    }
    airplanes.push({ x: 895, y: p.random(10, 25), speed: -0.8 });

    let hasKitte = false;
    for (let x = 10; x < 880; ) {
      if (x > 360 && x < 520) { x = 520; continue; } 
      let isKitte = !hasKitte && x > 60 && x < 150; 
      let isSkyscraper = true; 
      
      let w = isKitte ? 46 : p.floor(p.random(35, 55));
      let h = isKitte ? 80 : p.floor(p.random(50, 75));
      
      let rColor = p.random(['#bdc3c7', '#95a5a6', '#7f8c8d', '#34495e', '#2c3e50', '#636e72']);
      if (isKitte) rColor = '#2c3e50'; 
      
      let roofStyle = 'flat'; 
      let specialty = isKitte ? 'kitte' : 'skyscraper';
      
      let windows = [];
      if (specialty === 'skyscraper' || specialty === 'kitte') {
        let startY = specialty === 'kitte' ? 40 : 6; 
        for(let wx = 4; wx < w - 4; wx += 8) {
          for(let wy = startY; wy < h - 10; wy += 8) {
             if (p.random() > 0.4) windows.push({x: wx, y: wy});
          }
        }
      }
      if (isKitte) hasKitte = true;
      townHouses.push({
        x: x, w: w, h: h, color: rColor, roofStyle: roofStyle, specialty: specialty, windows: windows,
        catX: p.random(2, w - 12), hasCat: p.random() > 0.3, catColor: p.random(['#f0ad4e', '#333333', '#ffffff'])
      });
      x += w + p.floor(p.random(4, 12));
    }
    
    for (let x = 5; x < 890; x += p.random(20, 50)) {
      if (x > 360 && x < 520) continue; 
      trees.push({ x: x, h: p.random(12, 38), w: p.random(10, 22), type: p.random(['round', 'bush']) });
    }
    for (let i = 0; i < 5; i++) {
      flyingBirds.push({ x: p.random(895), y: p.random(20, 50), speed: p.random(0.3, 0.6) });
    }
    for(let i=0; i<12; i++) {
      let isTopLane = p.random() > 0.5; 
      let carType = p.random(['sedan', 'truck', 'bus']);
      let carColor;
      
      if (carType === 'truck' && p.random() > 0.5) {
        carColor = '#e60012'; 
      } else {
        carColor = p.random(['#ff9ff3', '#feca57', '#ff6b6b', '#48dbfb', '#1dd1a1', '#ffffff', '#c8d6e5', '#e60012']);
      }
      cars.push({
        x: p.random(895), y: isTopLane ? 81 : 88, 
        speed: isTopLane ? p.random(-0.8, -1.8) : p.random(0.8, 1.8),
        color: carColor,
        type: carType
      });
    }
    duckFamilies.push({ x: 800, speed: -0.15 });
    duckFamilies.push({ x: 200, speed: -0.2 });
    boats.push({ x: -20, speed: 0.3 });
    boats.push({ x: 500, speed: 0.4 });
  }

  function drawDynamicSky(target, h, m) {
    let timeVal = h + m / 60.0;
    let cTop, cBottom;
    
    if (timeVal >= 5 && timeVal < 9) { 
      cTop = p.color('#89f7fe'); cBottom = p.color('#66a6ff');
    } else if (timeVal >= 9 && timeVal < 16) { 
      cTop = p.color('#2193b0'); cBottom = p.color('#6dd5ed');
    } else if (timeVal >= 16 && timeVal < 19) { 
      cTop = p.color('#6a11cb'); cBottom = p.color('#fa709a');
    } else { 
      cTop = p.color('#0f2027'); cBottom = p.color('#2c5364');
    }
    
    for (let y = 0; y < 95; y++) {
      let inter = p.map(y, 0, 95, 0, 1);
      target.stroke(p.lerpColor(cTop, cBottom, inter));
      target.line(0, y, target.width, y);
    }
  }

  function drawStars(target, h, m) {
    let timeVal = h + m / 60.0;
    if (timeVal >= 18.5 || timeVal < 5.5) {
      target.noStroke();
      for (let s of stars) {
        let twinkle = p.sin(p.frameCount * 0.05 + s.offset) * 127 + 128;
        target.fill(255, 255, 255, twinkle * 0.8);
        target.rect(s.x, s.y, s.size, s.size);
      }
    }
  }

  function drawCelestialBody(target, h, m) {
    let timeVal = h + m / 60.0;
    target.noStroke();
    let isDay = timeVal >= 5 && timeVal < 19;
    let progress = 0;

    if (isDay) {
      progress = p.map(timeVal, 5, 19, 0, 1);
    } else {
      if (timeVal >= 19) {
        progress = p.map(timeVal, 19, 29, 0, 1); 
      } else {
        progress = p.map(timeVal + 24, 19, 29, 0, 1);
      }
    }
    let cx = p.map(progress, 0, 1, 20, 875);
    let cy = 45 - p.sin(progress * p.PI) * 35; 

    if (isDay) {
      if (timeVal >= 16 && timeVal < 19) {
        target.fill(255, 60, 30); 
        target.rect(cx - 3, cy - 5, 6, 10);
        target.rect(cx - 4, cy - 4, 8, 8);
        target.rect(cx - 5, cy - 3, 10, 6);
      } else {
        target.fill(255, 220, 80); 
        target.rect(cx - 3, cy - 5, 6, 10);
        target.rect(cx - 4, cy - 4, 8, 8);
        target.rect(cx - 5, cy - 3, 10, 6);
      }
    } else {
      target.fill(240, 245, 255); 
      target.rect(cx - 1, cy - 4, 3, 1);
      target.rect(cx - 2, cy - 3, 4, 1);
      target.rect(cx - 3, cy - 2, 3, 1);
      target.rect(cx - 3, cy - 1, 2, 1);
      target.rect(cx - 3, cy,     2, 1);
      target.rect(cx - 3, cy + 1, 3, 1);
      target.rect(cx - 2, cy + 2, 4, 1);
      target.rect(cx - 1, cy + 3, 3, 1);
    }
  }

  function updateAndDrawClouds(target) {
    target.noStroke();
    target.fill(255, 255, 255, 180);
    for (let cl of clouds) {
      cl.x += cl.speed;
      if (cl.x > 895) cl.x = -cl.w;
      target.rect(cl.x, cl.y, cl.w, 4);
      target.rect(cl.x + 3, cl.y - 2, cl.w - 6, 8);
      target.rect(cl.x + 6, cl.y - 4, cl.w - 12, 12);
    }
  }

  function updateAndDrawAirplanes(target) {
    target.noStroke();
    for (let a of airplanes) {
      a.x += a.speed;
      if (a.x < -40) {
        a.x = target.width + 40;
        a.y = p.random(10, 25);
      }
      target.fill(255);
      target.rect(a.x, a.y, 22, 6); 
      target.rect(a.x + 20, a.y - 4, 4, 5); 
      target.fill('#e60012');
      target.rect(a.x + 2, a.y + 3, 20, 1); 
      target.rect(a.x + 21, a.y - 3, 2, 3); 
      target.fill('#70a1ff');
      target.rect(a.x + 2, a.y + 1, 4, 2); 
      for (let wx = 8; wx < 18; wx += 3) {
        target.rect(a.x + wx, a.y + 1, 1, 1); 
      }
      target.fill(220);
      target.rect(a.x + 10, a.y + 6, 8, 3); 
      target.fill(200);
      target.rect(a.x + 12, a.y + 9, 4, 2); 
    }
  }

  function drawBalloons(target) {
    let t = p.frameCount * 0.02;
    drawBalloon(target, 340 + p.sin(t) * 10, 40 + p.cos(t * 1.5) * 8, '#ff4b5c'); 
    drawBalloon(target, 680 + p.cos(t * 1.2) * 8, 30 + p.sin(t * 0.8) * 10, '#ff4b5c'); 
  }

  function drawBalloon(target, x, y, col) {
    target.noStroke();
    target.fill(col);
    target.rect(x - 4, y - 6, 10, 10);
    target.rect(x - 6, y - 4, 14, 6);
    target.fill(255, 255, 255, 150); 
    target.rect(x - 3, y - 4, 3, 3); 
    target.stroke(100, 100, 100, 150);
    target.line(x + 1, y + 4, x + 3, y + 16);
  }

  function updateAndDrawBirds(target) {
    target.noStroke();
    for (let bird of flyingBirds) {
      bird.x += bird.speed;
      if (bird.x > 895) bird.x = -15;
      let wing = p.floor(p.frameCount * 0.1 + bird.x) % 2;
      target.fill(255); 
      target.rect(bird.x, bird.y, 8, 4);
      target.rect(bird.x - 2, bird.y - 2, 4, 3);
      if (wing === 0) target.rect(bird.x + 2, bird.y - 4, 3, 4);
      else target.rect(bird.x + 2, bird.y + 4, 3, 4);
      target.fill(255, 100, 100);
      target.rect(bird.x + 6, bird.y + 2, 4, 3);
    }
  }

  function drawTownHouses(target, h) {
    let baseY = 80; 
    let isNight = (h >= 17 || h < 6);
    target.noStroke();
    for (let h_info of townHouses) {
      target.fill(h_info.color);
      target.rect(h_info.x, baseY - h_info.h, h_info.w, h_info.h);
      target.fill('#d9534f'); 
      if (h_info.roofStyle === 'triangle') {
        target.triangle(h_info.x - 2, baseY - h_info.h, h_info.x + h_info.w/2, baseY - h_info.h - 8, h_info.x + h_info.w + 2, baseY - h_info.h);
      } else if (h_info.roofStyle === 'flat') {
        target.fill(h_info.specialty === 'skyscraper' || h_info.specialty === 'kitte' ? '#7f8c8d' : '#d9534f'); 
        target.rect(h_info.x - 2, baseY - h_info.h - 2, h_info.w + 4, 3);
      } else { 
        target.rect(h_info.x + 2, baseY - h_info.h - 4, h_info.w - 4, 4); 
        target.rect(h_info.x + 6, baseY - h_info.h - 8, h_info.w - 12, 4); 
      }
      if (h_info.specialty === 'skyscraper' || h_info.specialty === 'kitte') {
        if (isNight) target.fill('#f1c40f'); 
        else target.fill(40, 50, 60, 150); 
        for(let wPos of h_info.windows) {
          target.rect(h_info.x + wPos.x, baseY - h_info.h + wPos.y, 4, 5);
        }
      }
      if (h_info.specialty === 'kitte') {
        let alpha = isNight ? 200 + p.sin(p.frameCount * 0.05) * 55 : 100; 
        let neonColor = isNight ? p.color(241, 196, 15, alpha) : p.color(200);
        drawPixelString(target, "KITTE", h_info.x + 6, baseY - h_info.h + 10, 1, neonColor, 2);
        drawPixelString(target, "OSAKA", h_info.x + 4, baseY - h_info.h + 24, 1, neonColor, 2);
      }
      if (h_info.hasCat) {
        let cy = baseY - h_info.h - (h_info.roofStyle === 'triangle' ? 5 : 4);
        target.fill(h_info.catColor);
        target.rect(h_info.x + h_info.catX, cy - 2, 6, 4); 
        target.rect(h_info.x + h_info.catX + 4, cy - 5, 4, 4); 
        target.stroke(h_info.catColor); target.strokeWeight(2);
        target.line(h_info.x + h_info.catX + 1, cy, h_info.x + h_info.catX - 3, cy - 4); 
        target.noStroke(); target.strokeWeight(1);
      }
    }
  }

  function drawCityRoad(target) {
    target.noStroke();
    target.fill('#576574'); 
    target.rect(0, 80, target.width, 15);
    target.fill('#c8d6e5'); 
    for(let x=0; x<target.width; x+=20) {
      target.rect(x, 87, 10, 1);
    }
  }

  function updateAndDrawCars(target) {
    target.noStroke();
    for(let c of cars) {
      c.x += c.speed;
      if (c.x > 895 + 40) c.x = -40;
      if (c.x < -40) c.x = 895 + 40;
      let isGoingRight = c.speed > 0;
      target.fill(c.color);
      if (c.type === 'sedan') {
        target.rect(c.x, c.y + 2, 16, 4); target.rect(c.x + 3, c.y, 8, 2);  
        target.fill(30); target.rect(c.x + 2, c.y + 5, 3, 3); target.rect(c.x + 11, c.y + 5, 3, 3); 
        target.fill('#f1c40f'); 
        if (isGoingRight) target.rect(c.x + 14, c.y + 2, 2, 2); else target.rect(c.x, c.y + 2, 2, 2);
      } else if (c.type === 'truck') {
        target.rect(c.x + (isGoingRight ? 0 : 8), c.y - 2, 16, 8); 
        if (c.color === '#e60012') {
          target.fill('#ffffff');
          target.rect(c.x + (isGoingRight ? 2 : 12), c.y + 1, 2, 4);
        }
        target.fill('#ecf0f1'); target.rect(c.x + (isGoingRight ? 18 : 0), c.y + 2, 6, 4); 
        target.fill(30);
        target.rect(c.x + 2, c.y + 5, 4, 3); target.rect(c.x + 10, c.y + 5, 4, 3); target.rect(c.x + 18, c.y + 5, 3, 3);
      } else { 
        target.rect(c.x, c.y - 2, 26, 8); 
        target.fill('#34495e'); 
        target.rect(c.x + 2, c.y, 4, 3); target.rect(c.x + 8, c.y, 4, 3); target.rect(c.x + 14, c.y, 4, 3); target.rect(c.x + 20, c.y, 4, 3);
        target.fill(30);
        target.rect(c.x + 4, c.y + 5, 4, 3); target.rect(c.x + 18, c.y + 5, 4, 3);
      }
    }
  }

  function drawNatureAndLife(target) {
    for (let tree of trees) {
      target.noStroke();
      target.fill('#85532a'); 
      target.rect(tree.x - 1, 95 - tree.h, 2, tree.h);
      target.fill('#5cb85c');
      if (tree.type === 'round') {
        target.rect(tree.x - tree.w/2, 95 - tree.h - tree.w/2, tree.w, tree.w * 0.8);
        target.rect(tree.x - tree.w/4, 95 - tree.h - tree.w/1.5, tree.w/2, tree.w);
      } else {
        target.triangle(tree.x, 95 - tree.h - tree.w, tree.x - tree.w/2, 95 - tree.h, tree.x + tree.w/2, 95 - tree.h);
      }
    }
  }

  function drawCobbleBank(target) {
    target.stroke('#c8c2bc'); target.line(0, 95, target.width, 95); 
    target.noStroke(); target.fill('#b5aba0'); 
    target.rect(0, 96, target.width, 1);
  }

  function drawCentralPostOffice(target, h, m, s) {
    let cx = 447, cy = 50;
    target.noStroke();
    target.fill('#b83b30'); 
    target.rect(cx - 50, cy - 10, 100, 55); 
    target.fill('#9c2d24'); 
    target.rect(cx - 50, cy + 40, 100, 5);
    target.fill('#d44035'); 
    target.rect(cx - 24, cy - 50, 48, 55); 
    target.fill('#9c2d24'); 
    target.triangle(cx - 26, cy - 50, cx, cy - 75, cx + 26, cy - 50);
    target.fill('#3b0f0f'); 
    target.rect(cx - 20, cy - 42, 40, 20); 
    
    let timeStr = p.nf(h, 2) + ":" + p.nf(m, 2);
    drawPixelString(target, timeStr, cx - 18, cy - 38, 2, p.color(255, 255, 255), 2);
    
    if (s % 2 === 0) { target.fill('#ff4757'); target.rect(cx - 2, cy - 18, 4, 4); } 
    else { target.fill('#2ed573'); target.rect(cx - 2, cy - 18, 4, 4); }

    target.fill('#ffffff'); 
    target.rect(cx - 12, cy - 18, 24, 20);
    target.fill('#e60012'); 
    target.rect(cx - 9, cy - 14, 18, 2); 
    target.rect(cx - 9, cy - 10, 18, 2); 
    target.rect(cx - 1, cy - 10,  2, 8); 

    target.fill('#5a4030'); 
    target.rect(cx - 12, cy + 25, 24, 20);
    target.fill('#ffffff'); 
    target.rect(cx - 10, cy + 27, 20, 4); 
    
    let windowColor = (h >= 17 || h < 6) ? p.color('#ffd166') : p.color('#c7ecee');
    target.fill('#fcd9d9'); 
    target.rect(cx - 40, cy, 16, 24); target.rect(cx + 24, cy, 16, 24);
    target.fill(windowColor); 
    target.rect(cx - 38, cy + 2, 12, 20); target.rect(cx + 26, cy + 2, 12, 20);

    let boxX = cx - 45, boxY = cy + 15;
    target.fill('#ff3838'); target.rect(boxX, boxY, 12, 30); 
    target.fill('#d42424'); target.rect(boxX + 10, boxY, 2, 30);
    target.fill('#ff3838'); target.rect(boxX - 1, boxY - 3, 14, 5); 
    target.fill('#333333'); target.rect(boxX + 2, boxY + 4, 8, 2); 
  }

  function drawMailTram(target, x, y) {
    target.push();
    target.noStroke();
    target.fill('#7f8c8d');
    target.rect(0, y + 20, 895, 1);

    let rot = (p.frameCount % 4);
    let numCars = 7; 
    let carSpacing = 48; 

    for (let i = numCars - 1; i >= 0; i--) {
      let carX = x - i * carSpacing;
      if (i > 0) { target.fill(50); target.rect(carX + 44, y + 10, 6, 4); }

      target.fill('#2f3542');
      target.rect(carX + 6, y + 12, 8, 8); target.rect(carX + 30, y + 12, 8, 8);
      target.fill(rot === 0 ? '#ffdd59' : '#f1f2f6');
      target.rect(carX + 8, y + 14, 4, 4); target.rect(carX + 32, y + 14, 4, 4);
      target.fill('#e84118'); target.rect(carX + 2, y, 42, 14);
      target.fill('#f5f6fa'); target.rect(carX + 2, y + 2, 42, 2);

      if (i === 0) {
        target.fill('#ffffff'); 
        target.rect(carX + 20, y + 8, 4, 2); 
        target.fill('#70a1ff'); target.rect(carX + 34, y + 4, 6, 6); target.rect(carX + 4, y + 4, 6, 6);
        target.fill('#ffd166'); target.rect(carX + 34, y + 4, 4, 2);
        let headlightPulse = p.abs(p.sin(p.frameCount * 0.08)) * 30;
        target.fill(255, 255, 150, 60 + headlightPulse);
        target.triangle(carX + 44, y + 8, carX + 80, y - 2, carX + 80, y + 18);
        target.fill('#ffd2f0'); target.rect(carX + 44, y + 8, 2, 2);
      } else {
        target.fill('#70a1ff'); target.rect(carX + 8, y + 4, 8, 6); target.rect(carX + 28, y + 4, 8, 6);
        target.fill('#ffffff'); target.rect(carX + 20, y + 8, 4, 2); 
      }
    }

    let lastCarX = x - (numCars - 1) * carSpacing;
    for (let i = 0; i < 3; i++) {
      let letterX = lastCarX - 18 - (i * 24);
      let letterY = y - 8 - (i * 4) + p.sin(p.frameCount * 0.1 - i * 1.5) * 4;
      target.fill('#ffffff'); target.rect(letterX, letterY, 12, 8);
      target.fill('#ff4757'); target.rect(letterX + 4, letterY + 2, 4, 4);
    }
    target.pop();
  }

  function drawWater(target) {
    target.noStroke();
    target.fill('#3498db'); 
    target.rect(0, 97, target.width, 11);
    target.fill('#2980b9');
    let t = p.frameCount * 0.02;
    for (let x = 0; x < target.width; x += 15) {
      target.rect(x + (t * 10 % 15), 99 + p.sin(t + x) * 1, 6, 1);
      target.rect(x + (t * 5 % 15), 103 + p.cos(t + x) * 1, 4, 1);
    }
  }

  function updateAndDrawDucks(target) {
    target.noStroke();
    for (let df of duckFamilies) {
      df.x += df.speed; 
      if (df.x < -30) df.x = target.width + 30; 
      let bob = p.sin(p.frameCount * 0.1 + df.x) * 1;

      target.fill('#ffd166');
      target.rect(df.x, 99 + bob, 8, 5); 
      target.rect(df.x - 4, 96 + bob, 5, 5); 
      target.fill('#ff5b5c');
      target.rect(df.x - 6, 98 + bob, 2, 2); 

      for (let i = 1; i <= 3; i++) {
        let bx = df.x + i * 12;
        let bbob = p.sin(p.frameCount * 0.1 + bx) * 1;
        target.fill('#ffd166');
        target.rect(bx, 101 + bbob, 4, 3);
        target.rect(bx - 2, 99 + bbob, 3, 3);
      }
    }
  }

  function updateAndDrawBoats(target) {
    target.noStroke();
    for (let b of boats) {
      b.x += b.speed;
      if (b.x > target.width + 50) b.x = -50; 
      let bob = p.cos(p.frameCount * 0.05 + b.x) * 1;

      target.fill('#ffffff'); 
      target.rect(b.x + 6, 95 + bob, 16, 8);
      target.fill('#70a1ff'); 
      target.rect(b.x + 8, 97 + bob, 4, 4);
      target.rect(b.x + 14, 97 + bob, 4, 4);
      target.fill('#e84118'); 
      target.rect(b.x, 103 + bob, 32, 5);
      target.triangle(b.x, 103 + bob, b.x, 108 + bob, b.x - 6, 103 + bob); 
      
      if (p.frameCount % 40 < 20) {
        target.fill(255, 255, 255, 180);
        target.rect(b.x + 22, 90 + bob, 5, 5);
      }
    }
  }

  function drawPixelString(target, str, x, y, spacing, col, scale = 1) {
    let curX = x;
    for (let i = 0; i < str.length; i++) {
      let char = str.charAt(i);
      if (fontMap[char]) {
        drawChar(target, char, curX, y, col, scale);
        curX += (3 * scale) + spacing;
      } else if (char === ' ') {
        curX += (2 * scale) + spacing; 
      }
    }
  }

  function drawChar(target, char, x, y, col, scale) {
    target.push();
    target.fill(col);
    target.noStroke();
    let d = fontMap[char];
    for (let i = 0; i < 15; i++) {
      if (d[i] === 1) {
        let px = x + (i % 3) * scale;
        let py = y + Math.floor(i / 3) * scale;
        target.rect(px, py, scale, scale);
      }
    }
    target.pop();
  }
};

new p5(sketch);