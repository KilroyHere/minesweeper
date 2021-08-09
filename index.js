let gridLength = 20; let grid;
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const cellSize = 35;
let canvasWidth, canvasHeight;


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
          "open"
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

  drawGrid(state="continue") {
    for (let i = 0; i < this.length; i++) {
      for (let j = 0; j < this.length; j++) {
        let cell = this.cellArray[i][j];
        cell.state = state === "gameOver" ? "open" : cell.state;
        cell.drawCell();
      }
    }
  }

  clickCell(x,y){
    let cellRowIndex = Math.floor(x/cellSize);
    let cellColumnIndex = Math.floor(y/cellSize);
    cellRowIndex = cellRowIndex > this.length-1 ? this.length-1 : cellRowIndex;
    cellColumnIndex = cellColumnIndex > this.length-1 ? this.length-1 : cellColumnIndex;
    if(this.cellArray[cellRowIndex][cellColumnIndex].state === "closed") {
      if(this.cellArray[cellRowIndex][cellColumnIndex].isBombed){
        gameOver();
        this.drawGrid("gameOver");
        return;
      } 
      this.floodFill(cellRowIndex,cellColumnIndex);
    }
    this.drawGrid();
  }

  flagCell(x,y){
    let cellRowIndex = Math.floor(x/cellSize);
    let cellColumnIndex = Math.floor(y/cellSize);
    if(this.cellArray[cellRowIndex][cellColumnIndex].state === "closed") 
      this.cellArray[cellRowIndex][cellColumnIndex].state = "flagged";
    else if(this.cellArray[cellRowIndex][cellColumnIndex].state === "flagged") 
      this.cellArray[cellRowIndex][cellColumnIndex].state = "closed";
    this.drawGrid();
  }


  floodFill(r,c){

    if(r >= this.length || r < 0){
      return;
    }
    if(c >= this.length || c < 0){
      return;
    }
    if(this.cellArray[r][c].state === "open" || this.cellArray[r][c].state === "flagged" ){
      return;
    } 
    if(this.cellArray[r][c].text > 0){
      this.cellArray[r][c].state = "open";
      return;
    }

    this.cellArray[r][c].state = "open";

    this.floodFill(r+1,c);
    this.floodFill(r,c+1);
    this.floodFill(r-1,c);
    this.floodFill(r,c-1);

  }
};


class Cell {
  constructor(posX, posY, size, bombed, state) {
    this.posX = posX;
    this.posY = posY;
    this.size = size;
    this.endX = posX + size;
    this.endY = posY + size;
    this.isBombed = bombed;
    this.state = state;
    this.text = this.isBombed ? "-2" : "0";
  }

  setText(text) {
    this.text = text;
  }

  drawCell() {
    //Filled Rectangle  
    let color = this.state === "open" ? "#ffea63" : "#feffd4";
    color = this.isBombed && this.state === "open" ? "#ff7a6e" : color;
    ctx.fillStyle = color;
    ctx.fillRect(this.posX, this.posY, this.size, this.size);

    //Rectangle Border
    ctx.fillStyle = "black";
    ctx.strokeRect(this.posX, this.posY, this.size, this.size);

    //Filling Text
    let colorArray = ['#00B3E6','#00E680', '#B34D4D','#CC80CC','#1AB399','#CC9999', '#00E680', '#99E6E6', '#6666FF'];
    if(this.state === "open" || this.state === "flagged"){
      ctx.fillStyle = colorArray[Math.abs(this.text)];
      ctx.font = "20px Rubik Mono One";
      ctx.textAlign = "center";
      let text;
      if(this.state === "open" && this.isBombed)
        text = "💣";
      else if(this.state === "flagged")
        text = "🚩";
      else
        text = this.text;
      if(this.text !== 0){
        ctx.fillText(text, this.posX + 18, this.posY + 25);
      }
    }
  }
};

function newGame(length){
  let gameOverText = document.querySelector("#overText");
  gameOverText.style.visibility = "hidden";
  grid = new Grid(length);
  grid.drawGrid();
}

newGame(gridLength);  

function gameOver(){
  let gameOverText = document.querySelector("#overText");
  gameOverText.style.visibility = "visible";
}

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

for (let i = 0; i < 4 ; i++) {
  document.querySelectorAll("#size")[i].addEventListener("click", function(key) {
    let length = Number(key.target.innerText.slice(0,2));
    newGame(length);
  });
}

