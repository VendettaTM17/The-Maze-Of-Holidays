
  const userName = prompt(
    "Welcome dear player, please introduce your name or your amazing team's name"
  ) || "Player";

  alert(
    `Hello ${userName}!\n\nInstructions:\n- Use the arrows in your keyboard or the touchpad in your phone to move, try to get the yellow papers by answering the questions correctly. Be aware of the red monsters, they will steal a paper from you if you let them touch you. If you collect all 10 papers you'll win, if you get robbed 3 times you'll lose the game.\n\nGood Luck!`
  );

  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  const tileSize = 40;
  const rows = 15;  
  const cols = 15;  

  const maze = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
    [1,0,1,0,1,0,1,1,1,0,1,0,1,0,1],
    [1,0,1,0,0,0,0,0,1,0,0,0,1,0,1],
    [1,0,1,1,1,1,1,0,1,1,1,0,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,1,0,0,0,1],
    [1,1,1,1,1,0,1,1,1,0,1,1,1,0,1],
    [1,0,0,0,1,0,0,0,1,0,0,0,1,0,1],
    [1,0,1,0,0,0,1,0,0,0,1,0,0,0,1],
    [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
    [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
    [1,0,1,0,0,0,0,0,0,0,1,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ];

  let player = { x: 1, y: 1, lives: 3 };
  let monsters = [
    { x: 13, y: 1 },
    { x: 13, y: 13 },
    { x: 1, y: 13 }
  ];

  let papers = [
    { x: 3, y: 1, question: "This festival marks the beginning of the lunar calendar in a country where red is considered a lucky color. Families gather for a large meal, exchange envelopes with money, and enjoy traditional dances meant to drive away bad spirits", answer: "chinese new year" },
    { x: 11, y: 1, question: "This holiday blends pre-Hispanic beliefs and Catholic traditions. Families create decorated altars to welcome the souls of loved ones", answer: "day of the dead" },
    { x: 7, y: 3, question: "This holiday began as a harvest celebration shared between Native Americans and settlers. Today, it includes parades, large family meals, and expressions of gratitude", answer: "thanksgiving" },
    { x: 3, y: 5, question: "This festival, held before the Christian season of Lent, is known for extravagant street parades, dancing, music, and masks. The celebration is deeply rooted in a mix of European, African, and Indigenous traditions, especially in Brazil", answer: "brazilian carnival" },
    { x: 11, y: 7, question: "This holiday includes lighting candles on a special holder with eight branches. It commemorates the rededication of a sacred place and a miracle involving oil that lasted longer than expected", answer: "hanukkah" },
    { x: 6, y: 11, question: "Celebrated in many countries, this holiday involves decorating evergreen trees, giving gifts, and sharing meals. It has both religious and secular traditions and is connected to the story of a birth in Bethlehem", answer: "christmas" },
    { x: 9, y: 13, question: "This holiday is very spooky, lots of people go around asking for candy while dressing in amazing costumes all over the neighborhood", answer: "halloween" },
    { x: 5, y: 9, question: "In this holiday everyone dresses with the color green, it is associated with luck and clovers", answer: "saint patricks day" },
    { x: 13, y: 5, question: "This holiday is celebrated in their unique way according to the country, the main point is to celebrate freedom and independence from another country", answer: "independence day" },
    { x: 1, y: 11, question: "This holiday is considered to be the day of love, couples all around the world share their gifts and romantic dinners, and also friends celebrated their strong bonding frienships?", answer: "saint valentine" }
  ];

  let collectedPapers = [];

  const smallSize = 30;
  const offset = (tileSize - smallSize) / 2;

  let hitCooldown = false;
  const hitCooldownTime = 1000; // 1 segundo

  // Dibujar todo
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    maze.forEach((row, y) => {
      row.forEach((cell, x) => {
        ctx.fillStyle = cell === 1 ? 'black' : 'white';
        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
      });
    });

    ctx.fillStyle = 'yellow';
    papers.forEach(p => {
      ctx.fillRect(p.x * tileSize + 5, p.y * tileSize + 5, tileSize - 10, tileSize - 10);
    });

    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x * tileSize + offset, player.y * tileSize + offset, smallSize, smallSize);

    ctx.fillStyle = 'red';
    monsters.forEach(m => {
      ctx.fillRect(m.x * tileSize + offset, m.y * tileSize + offset, smallSize, smallSize);
    });
  }

  // Función para mover jugador, bloqueando movimiento a monstruos y causando daño si intenta
  function movePlayer(dx, dy) {
    const newX = player.x + dx;
    const newY = player.y + dy;

    if (maze[newY] && maze[newY][newX] === 0) {
      const monsterHere = monsters.find(m => m.x === newX && m.y === newY);
      if (monsterHere) {
        // No se mueve, pero recibe daño si no está en cooldown
        if (!hitCooldown) {
          handlePlayerHit();
          hitCooldown = true;
          setTimeout(() => { hitCooldown = false; }, hitCooldownTime);
        }
        draw();
        return; // Bloquea movimiento
      }

      // Si no hay monstruo, mover jugador normalmente
      player.x = newX;
      player.y = newY;
      checkPaper();
      draw();
    }
  }

  // Escuchar teclado
  document.addEventListener('keydown', (event) => {
    switch(event.key) {
      case 'ArrowUp': movePlayer(0, -1); break;
      case 'ArrowDown': movePlayer(0, 1); break;
      case 'ArrowLeft': movePlayer(-1, 0); break;
      case 'ArrowRight': movePlayer(1, 0); break;
    }
  });

  // Botones táctiles D-Pad
  ['btn-up','btn-left','btn-down','btn-right'].forEach(id => {
    const btn = document.getElementById(id);
    const dirMap = {
      'btn-up': [0, -1],
      'btn-down': [0, 1],
      'btn-left': [-1, 0],
      'btn-right': [1, 0]
    };
    btn.addEventListener('touchstart', e => {
      e.preventDefault();
      const [dx, dy] = dirMap[id];
      movePlayer(dx, dy);
    });
    btn.addEventListener('click', e => {
      e.preventDefault();
      const [dx, dy] = dirMap[id];
      movePlayer(dx, dy);
    });
  });

  function checkPaper() {
    for (let i = 0; i < papers.length; i++) {
      const paper = papers[i];
      if (paper.x === player.x && paper.y === player.y) {
        const userAnswer = prompt(paper.question);
        if (userAnswer && userAnswer.trim().toLowerCase() === paper.answer.toLowerCase()) {
          collectedPapers.push(paper);
          papers.splice(i, 1);
          updateInventory();
          if (collectedPapers.length === 10) {
            winGame();
          }
        } else {
          teleportPaper(paper);
          alert('OOPS Wrong answer, paper has moved to another place.');
        }
        break;
      }
    }
  }

  function teleportPaper(paper) {
    const emptySpaces = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (
          maze[y][x] === 0 &&
          !papers.some(p => p.x === x && p.y === y) &&
          !(player.x === x && player.y === y) &&
          !monsters.some(m => m.x === x && m.y === y)
        ) {
          emptySpaces.push({ x, y });
        }
      }
    }
    if (emptySpaces.length > 0) {
      const newPos = emptySpaces[Math.floor(Math.random() * emptySpaces.length)];
      paper.x = newPos.x;
      paper.y = newPos.y;
    }
  }

  function updateInventory() {
    document.getElementById('papersCollected').textContent = collectedPapers.length;
    document.getElementById('lives').textContent = `${userName} HP: ${player.lives}`;
  }

  function getValidMoves(x, y) {
    const moves = [];
    if (maze[y-1] && maze[y-1][x] === 0) moves.push({x: x, y: y-1});
    if (maze[y+1] && maze[y+1][x] === 0) moves.push({x: x, y: y+1});
    if (maze[y][x-1] === 0) moves.push({x: x-1, y: y});
    if (maze[y][x+1] === 0) moves.push({x: x+1, y: y});
    return moves;
  }

  function moveMonsters() {
    monsters.forEach((monster, index) => {
      const validMoves = getValidMoves(monster.x, monster.y).filter(pos => {
        return !monsters.some((m, i) => i !== index && m.x === pos.x && m.y === pos.y);
      });

      if (validMoves.length > 0) {
        const move = validMoves[Math.floor(Math.random() * validMoves.length)];
        monster.x = move.x;
        monster.y = move.y;
      }

      // Si el monstruo llega a la posición del jugador, causa daño igual
      if (monster.x === player.x && monster.y === player.y) {
        if (!hitCooldown) {
          handlePlayerHit();
          hitCooldown = true;
          setTimeout(() => { hitCooldown = false; }, hitCooldownTime);
        }
      }
    });
  }

  function handlePlayerHit() {
    if (collectedPapers.length > 0) {
      const lostPaper = collectedPapers.pop();
      papers.push(lostPaper);
      alert('A monster has touched you! A paper has been robbed');
      updateInventory();
    } else {
      alert('A monster touched you!');
    }

    player.lives--;
    player.x = 1;
    player.y = 1;
    updateInventory();
    draw();

    if (player.lives <= 0) {
      alert('You have lost all 3 lives, the game will start again');
      resetGame();
    }
  }

  function winGame() {
    alert(`Victory, ${userName} you have collected all 10 papers, AMAZING JOB`);
    resetGame();
  }

  function resetGame() {
    player = { x: 1, y: 1, lives: 3 };
    collectedPapers = [];
    papers = [
      { x: 3, y: 1, question: "This festival marks the beginning of the lunar calendar in a country where red is considered a lucky color. Families gather for a large meal, exchange envelopes with money, and enjoy traditional dances meant to drive away bad spirits", answer: "chinese new year" },
      { x: 11, y: 1, question: "This holiday blends pre-Hispanic beliefs and Catholic traditions. Families create decorated altars to welcome the souls of loved ones", answer: "day of the dead" },
      { x: 7, y: 3, question: "This holiday began as a harvest celebration shared between Native Americans and settlers. Today, it includes parades, large family meals, and expressions of gratitude", answer: "thanksgiving" },
      { x: 3, y: 5, question: "This festival, held before the Christian season of Lent, is known for extravagant street parades, dancing, music, and masks. The celebration is deeply rooted in a mix of European, African, and Indigenous traditions, especially in Brazil", answer: "brazilian carnival" },
      { x: 11, y: 7, question: "This holiday includes lighting candles on a special holder with eight branches. It commemorates the rededication of a sacred place and a miracle involving oil that lasted longer than expected", answer: "hanukkah" },
      { x: 6, y: 11, question: "Celebrated in many countries, this holiday involves decorating evergreen trees, giving gifts, and sharing meals. It has both religious and secular traditions and is connected to the story of a birth in Bethlehem", answer: "christmas" },
      { x: 9, y: 13, question: "This holiday is very spooky, lots of people go around asking for candy while dressing in amazing costumes all over the neighborhood", answer: "halloween" },
      { x: 5, y: 9, question: "In this holiday everyone dresses with the color green, it is associated with luck and clovers", answer: "saint patricks day" },
      { x: 13, y: 5, question: "This holiday is celebrated in their unique way according to the country, the main point is to celebrate freedom and independence from another country", answer: "independence day" },
      { x: 1, y: 11, question: "This holiday is considered to be the day of love, couples all around the world share their gifts and romantic dinners, and also friends celebrated their strong bonding frienships?", answer: "saint valentines day" }
    ];
    updateInventory();
    draw();
  }

  setInterval(() => {
    moveMonsters();
    draw();
  }, 500);

  updateInventory();
  draw();

