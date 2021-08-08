const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const cellSize = 35;
const gridLength = 20;
let canvasWidth, canvasHeight;

class Cell {
  constructor(posX, posY, size, bombed, state) {
    this.posX = posX;
    this.posY = posY;
    this.size = size;
    this.endX = posX + size;
    this.endY = posY + size;
    this.isBombed = bombed;
    this.state = state;
    this.text = this.isBombed ? "💣" : "🌳";
  }

  setText(text) {
    this.text = text;
  }

  drawCell() {
    //Filled Rectangle  
    let color = this.isBombed ? "#ff6459" : "#b8ffe4";
    ctx.fillStyle = color;
    ctx.fillRect(this.posX, this.posY, this.size, this.size);
    //Rectangle Border
    ctx.fillStyle = "black";
    ctx.strokeRect(this.posX, this.posY, this.size, this.size);
    //Filling Text
    if(this.state === "open" || this.state === "flagged"){
      ctx.fillStyle = "black";
      ctx.font = "20px Rubik Mono One";
      ctx.textAlign = "center";
      let text = this.state === "flagged" ? "🚩":this.text;
      ctx.fillText(text, this.posX + 18, this.posY + 25);
    }
  }
};

class Grid {
  constructor(length) {
    this.length = length;
    this.cellArray = new Array(length);
    this.setCanvas();
    this.createCellArray();
    this.setCellText();
  }

  setCanvas() {
    canvasWidth = canvasHeight = this.length * cellSize;
    canvas.setAttribute("width", canvasWidth);
    canvas.setAttribute("height", canvasHeight);
  }

  createCellArray() {
    for (let i = 0; i < this.length; i++) {
      this.cellArray[i] = new Array(length);
    }
    for (let i = 0; i < this.length; i++) {
      for (let j = 0; j < this.length; j++) {
        let isBombed = Math.random() < 0.17;
        this.cellArray[i][j] = new Cell(
          i * cellSize,
          j * cellSize,
          cellSize,
          isBombed,
          "closed"
        );
      }
    }
  }

  setCellText() {
    for (let i = 0; i < this.length; i++) {
      for (let j = 0; j < this.length; j++) {
        let cell = this.cellArray[i][j];
        if (cell.isBombed) continue;
        let text = 0;
        if (i + 1 < this.length && this.cellArray[i + 1][j].isBombed) text++;
        if (j + 1 < this.length && this.cellArray[i][j + 1].isBombed) text++;
        if (i + 1 < this.length && j + 1 < this.length && this.cellArray[i + 1][j + 1].isBombed) text++;
        if (i - 1 > -1 && this.cellArray[i - 1][j].isBombed) text++;
        if (j - 1 > -1 && this.cellArray[i][j - 1].isBombed) text++;
        if (i - 1 > -1 && j - 1 > -1 && this.cellArray[i - 1][j - 1].isBombed) text++;
        if (i + 1 < this.length && j - 1 > -1 && this.cellArray[i + 1][j - 1].isBombed) text++;
        if (i - 1 > -1 && j + 1 < this.length && this.cellArray[i - 1][j + 1].isBombed) text++;
        cell.setText(text);
      }
    }
  }

  drawGrid() {
    for (let i = 0; i < this.length; i++) {
      for (let j = 0; j < this.length; j++) {
        let cell = this.cellArray[i][j];
        cell.drawCell();
      }
    }
  }

  clickCell(x,y){
    let cellRowIndex = Math.floor(x/cellSize);
    let cellColumnIndex = Math.floor(y/cellSize);
    this.cellArray[cellRowIndex][cellColumnIndex].state = "open";
    this.drawGrid();
  }

  flagCell(x,y){
    let cellRowIndex = Math.floor(x/cellSize);
    let cellColumnIndex = Math.floor(y/cellSize);
    if(this.cellArray[cellRowIndex][cellColumnIndex].state === "closed") 
      this.cellArray[cellRowIndex][cellColumnIndex].state = "flagged";
    this.drawGrid();
  }
};

const grid = new Grid(gridLength);
grid.drawGrid();


canvas.addEventListener("click",function(event){
 const rect = canvas.getBoundingClientRect();
 const x = event.clientX - rect.left;
 const y = event.clientY - rect.top;
 grid.clickCell(x,y);
});

canvas.addEventListener("contextmenu",function(event){
  event.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  grid.flagCell(x,y);
});