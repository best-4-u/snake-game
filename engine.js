class Engine {
  constructor(){
    this.isSnakeAlive = true;
    this.isMeatExists = false;

    this.meatPosX = 0;
    this.meatPosY = 0;

    this.snake = {
      head: {
        x: -1,
        y: -1
      },
      tails: [
        {
          x: -1,
          y: -1
        }
      ],
      direction: 'up'
    };
    
    this.table = [];
    for (let i = 0; i < 20; i++){
      this.table.push(Array(20).fill(0));
    }

    this.arenaDiv = document.getElementById('arena');
  }

  renderBoard() {
    document.getElementById('arena').innerHTML = '';
    let meatExists = false;
    for (let i = 0; i < this.table.length; i++){
      for (let j = 0; j < this.table[i].length; j++){
        if (this.table[i][j] === 0){
          this.drawCell();
        } else if(this.table[i][j] === 1){
          this.drawMeat();
          meatExists = true;
        } else if(this.table[i][j] === 2) {
          this.drawSnakeHead();
        } else if(this.table[i][j] === 3) {
          this.drawSnakeTail();
        }
      }
    }

    this.isMeatExists = meatExists
    
  }

  drawCell() {
    const element = document.createElement('div');
    element.className = "cell";
    this.arenaDiv.appendChild(element);
  }

  drawMeat() {
    const element = document.createElement('div');
    element.className = "meat";
    this.arenaDiv.appendChild(element);
  }

  drawSnakeHead() {
    const element = document.createElement('div');
    element.className = `snake_head ${this.snake.direction}`;
    this.arenaDiv.appendChild(element);
  }

  drawSnakeTail() {
    const element = document.createElement('div');
    element.className = "snake_tail";
    this.arenaDiv.appendChild(element);
  }

  createSnake(){
    const headPosX = parseInt(this.table.length / 2);
    const headPosY = parseInt(this.table[0].length / 2);
    
    const tailPosY = headPosY + 1;
    const tail2PosY = headPosY + 2;
    
    this.table[headPosX][headPosY] = 2;
    this.table[tailPosY][headPosX] = 3;
    this.table[tail2PosY][headPosX] = 3;

    this.snake = {
      ...this.snake,
      head: {
        x: headPosX,
        y: headPosY
      },
      tails: [
        {
          x: headPosX,
          y: tailPosY
        },
        {
          x: headPosX,
          y: tail2PosY
        }
      ]
    };
    
  }

  move() {
    const snake = this.snake;
    this.table[snake.head.x][snake.head.y] = 0;

    snake.tails.forEach( item => {
      this.table[item.y][item.x] = 0;
    });

    const newSnakeHead = {
      x: -1,
      y: -1
    };

    if (snake.direction === "up") {
      newSnakeHead.x = snake.head.x;
      newSnakeHead.y = snake.head.y - 1;
    } else if (snake.direction === "left") {
      newSnakeHead.x = snake.head.x - 1;
      newSnakeHead.y = snake.head.y;
    } else if (snake.direction === "right") {
      newSnakeHead.x = snake.head.x + 1;
      newSnakeHead.y = snake.head.y;
    } else if (snake.direction === "down") {
      newSnakeHead.x = snake.head.x;
      newSnakeHead.y = snake.head.y + 1;
    }

    const prevTail = {
      x: snake.head.x,
      y: snake.head.y
    };

    let addTail = false;

    if (newSnakeHead.y < 0){
      newSnakeHead.y = this.table[0].length - 1;
    } else if(newSnakeHead.y > this.table[0].length - 1) {
      newSnakeHead.y = 0;
    } else if (newSnakeHead.x < 0){
      newSnakeHead.x = this.table.length - 1;
    } else if(newSnakeHead.x > this.table.length - 1) {
      newSnakeHead.x = 0;
    }

    if (this.table[newSnakeHead.y][newSnakeHead.x] === 1){
      addTail = true;
      this.isMeatExists = false;
    }

    let newTable = [];
    this.table.forEach((item,index) => {
      newTable[index] = item.slice();
    });

    newTable[newSnakeHead.y][newSnakeHead.x] = 2;
    
    const tails = snake.tails.map( item => {
      const newTail = { ...prevTail };
      
      newTable[prevTail.y][prevTail.x] = 3;

      prevTail.x = item.x;
      prevTail.y = item.y;

      return {
        x: newTail.x,
        y: newTail.y
      }
    });

    if (newTable[newSnakeHead.y][newSnakeHead.x] === 3){
      this.isSnakeAlive = false;
    }

    this.table = newTable;

    if (addTail){
      tails.push({
        x: prevTail.x,
        y: prevTail.y
      });
    }

    this.snake = {
      ...this.snake,
      head: {
        x: newSnakeHead.x,
        y: newSnakeHead.y
      },
      tails
    };

  }

  createMeat() {
    let posX = -1;
    let posY = -1;

    while(posX < 0 || posY < 0 || this.table[posX][posY] !== 0){
      posX = Math.floor(getRandomArbitrary(0, 19));
      posY = Math.floor(getRandomArbitrary(0, 19));

      return { posX, posY };
    }
  }

  addMeat(meat) {
    this.table[meat.posX][meat.posY] = 1;
  }

  changeDirection(code) {
    const directions = [
      {
        code: '37', 
        direction: 'left',
        oposite: 'right'
      }, 
      {
        code: '38', 
        direction: 'up',
        oposite: 'down'
      },
      {
        code: '39', 
        direction: 'right',
        oposite: 'left'
      }, 
      {
        code: '40', 
        direction: 'down',
        oposite: 'up'
      }
    ];

    const findDirection = directions.find(el => parseInt(el.code) === parseInt(code));

    if (!findDirection){
      return null;
    }

    if (this.snake.direction === findDirection.oposite){
      return null;
    }

    this.snake = {
      ...this.snake,
      direction: findDirection.direction
    };
  }
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

document.addEventListener('DOMContentLoaded', (event) => {

  const engine = new Engine();
  engine.createSnake();
  
  const interval = setInterval( () => {

    engine.renderBoard();
    engine.move();
    if (!engine.isMeatExists) {
      const meat = engine.createMeat();
      engine.addMeat(meat);
      engine.isMeatExists = true;
    }

    if (!engine.isSnakeAlive) {
      clearInterval(interval);
    }
  }, 300);

  document.body.onkeydown = function(e){
    engine.changeDirection(e.keyCode);
  };

});