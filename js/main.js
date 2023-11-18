//konstansok, változók
import { missionsf } from './missions.js';
import { elementsf } from './elements.js';

let seasonTime = 7;
let currentSeason = 0;
let seasonPoints = [0,0,0,0]
let missionPoints = [0,0,0,0]
let currentElement = 0;
let timeLeft
let mapArray;


let seasons = ["Tavasz (AB)","Nyár (BC)","Ősz (CD)","Tél (DA)"]
let missions
let elements

let timeCost
let timeCostDisplay = document.querySelector("#timeCost>p");
let seasonDisplay = document.querySelector("#seasonDisplay");
let seasonTimeDisplay = document.querySelector("#seasonTimeDisplay");

let cells
let rows
let missionsDom
let toPlaceRows
let shape
let selectedCells
let state

let seasonDisplays = ["#springPoint","#summerPoint","#autumnPoint","#winterPoint"]
let seasonPointDisplay = document.querySelector(seasonDisplays[currentSeason])

let pointSum = document.querySelector("#osszpont")

let calculatedMountains
let calculatedForests
let calculatedForestEdge
let calculatedPotato
let calculatedRows
let calculatedCols


let terkepesz


//forgató és tükröző gombok
const mirrorButton = document.querySelector("#mirrorbutton");
const rotateButton = document.querySelector("#rotatebutton");
rotateButton.addEventListener("click",()=>{
  elements[currentElement] = rotate(elements[currentElement])
  drawElement(currentElement);
  saveState()
})

  mirrorButton.addEventListener("click",()=>{
  elements[currentElement] = mirror(elements[currentElement]);
  drawElement(currentElement);
  saveState()
})

//restart gomb
document.querySelector("#gameOverText>button").addEventListener("click",(e)=>{
  startGame()
})

//tábla feltöltése üres elemekkel
let mapTable = document.querySelector("#map");
for (let i = 0; i < 11; i++) {
    let newRow = mapTable.insertRow();
    for (let j = 0; j < 11; j++) {
        let newCell = newRow.insertCell();
        newCell.classList.add('empty');
    }
}

//függvények
function startGame(){
  //játék vége felirat eltűnetése
  document.getElementById("toPlaceContainer").classList.remove("hidden");
  document.getElementById("gameOverText").classList.add("hidden");


  //localstorage beolvasás

  if(localStorage.getItem("terkepesz") != null){

    terkepesz = JSON.parse(localStorage.getItem("terkepesz"))
    
    seasonTime = terkepesz.seasonTime
    currentSeason = terkepesz.currentSeason
    seasonPoints = terkepesz.seasonPoints
    missionPoints = terkepesz.missionPoints
    currentElement = terkepesz.currentElement
    elements = terkepesz.elements
    missions = terkepesz.missions
    mapArray = terkepesz.mapArray
    calculatedMountains = terkepesz.calculatedMountains
    calculatedForests = terkepesz.calculatedForests
    calculatedForestEdge = terkepesz.calculatedForestEdge
    calculatedPotato = terkepesz.calculatedPotato
    calculatedRows = terkepesz.calculatedRows
    calculatedCols = terkepesz.calculatedCols

  }else{
    terkepesz = {}
    seasonTime = 7
    currentSeason = 0
    seasonPoints = [0,0,0,0]
    missionPoints = [0,0,0,0]
    currentElement = 0
    elements = shuffle(elementsf());
    missions = shuffle(missionsf().basic)

    mapArray = [];
    for (let i = 0; i < 11; i++) {
      const row = [];
      for (let j = 0; j < 11; j++) {
        row.push(0);
      }
      mapArray.push(row);
  }
    mapArray[1][1] = 1;
    mapArray[3][8] = 1;
    mapArray[5][3] = 1;
    mapArray[8][9] = 1;
    mapArray[9][5] = 1;

    calculatedMountains = []
    calculatedForests = []
    calculatedForestEdge = []
    calculatedPotato = []
    calculatedRows = []
    calculatedCols = []
  
  }

  timeLeft = 28

  // táblázat kirajzolása
  rows = document.querySelectorAll("tr");
  cells = document.querySelectorAll("#map td")
  cells.forEach(cell=>{
    cell.classList.remove(...cell.classList)
    cell.classList.add("empty")
  })
  drawMap();


  //küldetések kiosztása
  missionsDom = document.querySelectorAll("#mission");

  for(let i = 0; i < 4; i++){
    missionsDom[i].childNodes[1].src = `./img/${missions[i].title}.png`;
    missionsDom[i].childNodes[3].childNodes[1].innerHTML = missions[i].title;
    missionsDom[i].childNodes[3].childNodes[3].innerHTML = missions[i].description;
  }

  //lehelyezendő elemek
  timeCost = elements[currentElement].time
  timeCostDisplay.innerHTML = timeCost
  toPlaceRows = document.querySelectorAll("#element tr");
  drawElement(currentElement);


  //elem lehelyezése
  selectedCells = []
  state = "placeable"
  shape = elements[currentElement].shape
  mapTable = document.querySelector("#map");

  mapTable.addEventListener("mouseover",(e)=>{
    checkIfPlacable(e)
  })
  mapTable.addEventListener("mouseout",(e)=>{
    removeMarkers()
  })
  mapTable.addEventListener("click",(e)=>{
  
    if(state == "placeable"){
      placeElement();
      removeMarkers();
      handlePoints();
      handleTime();
      timeCost = elements[currentElement].time
      timeCostDisplay.innerHTML = timeCost
      
    }  
  })

  //pontok resetelése


  for(let i = 0; i < 4; i++){
    document.querySelector(seasonDisplays[i]).innerHTML = seasonPoints[i] + " pont"
    document.querySelectorAll("#missionPoint")[i].innerHTML = "(" + missionPoints[i] + " pont)"
  }

  
  //aktív küldetések / évszak resetelése
  document.getElementById("A").classList.remove(...document.getElementById("A").classList)
  document.getElementById("B").classList.remove(...document.getElementById("B").classList)
  document.getElementById("C").classList.remove(...document.getElementById("C").classList)
  document.getElementById("D").classList.remove(...document.getElementById("D").classList)
  document.querySelectorAll("#mission").forEach(mission=>{
    mission.classList.add("inactive")
  })

  document.getElementById(`${seasons[currentSeason].split(" ")[1].split("")[1]}`).classList.add("active")
  document.getElementById(`${seasons[currentSeason].split(" ")[1].split("")[2]}`).classList.add("active")
  document.getElementById(`${seasons[currentSeason].split(" ")[1].split("")[1]}`).parentElement.classList.remove("inactive")
  document.getElementById(`${seasons[currentSeason].split(" ")[1].split("")[2]}`).parentElement.classList.remove("inactive")
  seasonTimeDisplay.innerHTML = seasonTime + "/7"

  seasonDisplay.innerHTML = seasons[currentSeason]

  let sumPoint = seasonPoints[0]+seasonPoints[1]+seasonPoints[2]+seasonPoints[3]
  pointSum.innerHTML = "Összesen: " + sumPoint + " pont"

  
  document.querySelectorAll(".mountain").forEach(mountain=>{
    if(calculatedMountains.includes(mountain.parentElement.rowIndex + " " + mountain.cellIndex)){
      mountain.classList.add("surrounded")
    }

  })


  
}

function shuffle(array) {
  let currentIndex = array.length
  let randomIndex;

  while (currentIndex > 0) {

    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

function drawMap(){
  for (let i = 0; i < 11; i++) {
      for (let j = 0; j < 11; j++) {

        switch(mapArray[i][j]){
          case 1:
            rows[i].cells[j].classList.remove('empty');
            rows[i].cells[j].classList.add('mountain');
            break;
          case 2:
            rows[i].cells[j].classList.remove('empty');
            rows[i].cells[j].classList.add('forest');
            break;
          case 3:
            rows[i].cells[j].classList.remove('empty');
            rows[i].cells[j].classList.add('town');
            break;
          case 4:
            rows[i].cells[j].classList.remove('empty');
            rows[i].cells[j].classList.add('farm');
            break;
          case 5:
            rows[i].cells[j].classList.remove('empty');
            rows[i].cells[j].classList.add('water');
            break;
        }
      }
    }
}

function drawElement(n){

  for(let i = 0; i < 3; i++){
    for(let j = 0; j < 3; j++){
     if(elements[n].shape[i][j] == 1){
       toPlaceRows[i].cells[j].classList.remove(...toPlaceRows[i].cells[j].classList);
       toPlaceRows[i].cells[j].classList.add(`${elements[n].type}`);
     }else{
       toPlaceRows[i].cells[j].classList.remove(...toPlaceRows[i].cells[j].classList)
     }
    }
   }

}

function rotate(element) {

  for (let i = 0; i < 3; i++) {
    for (let j = i; j < 3; j++) {
      let temp = element.shape[i][j];
      element.shape[i][j] = element.shape[j][i];
      element.shape[j][i] = temp;
    }
  }
  for (let i = 0; i < 3; i++) {
    element.shape[i].reverse();
  }

  if(element.rotation < 3){
    element.rotation += 1
  }else{
    element.rotation = 0
  }
  return element;
}

function mirror(element) {

  for (let i = 0; i < 3; i++) {
    element.shape[i].reverse();
  }
  element.mirrored = !element.mirrored

  return element;


}

function checkIfPlacable(e){
  let cell
  let x = 0
  let y = 0

  for(let i = 0; i < 3; i++){
    for(let j = 0; j < 3; j++){
      try{
        if(shape[x][y] == 1){
          cell = mapTable.rows[e.target.parentElement.rowIndex + x].cells[e.target.cellIndex + y]
          if(!cell.classList.contains("empty")){state = "occupied"}
          selectedCells.push(cell)
        }
      }catch(error){
        state = "occupied"
      }
      if(y == 2){
        y = 0
      }else{
        y += 1
      }
    }
    if(x == 2){
      x = 0
    }else{
      x += 1
    }
  }
    selectedCells.forEach(cell =>{
      cell.classList.add(state);
    })
}

function removeMarkers(){
  cells.forEach(cell =>{
    cell.classList.remove("placeable");
    cell.classList.remove("occupied");
    selectedCells = []
    state = "placeable"
   })
}

function placeElement(){

  let type
  let number
    switch(elements[currentElement].type){
      case "forest":
        number = 2
        break;
      case "town":
        number = 3
        break;
        case "farm":
          number = 4
          break;
      case "water":
        number = 5
        break;
    }

    selectedCells.forEach(cell => {
      cell.classList.remove("empty");
      cell.classList.add(elements[currentElement].type);
      
    });


    if(currentElement < 16){
      currentElement+=1;
      drawElement(currentElement);
      shape = elements[currentElement].shape
    }
    
    selectedCells.forEach(cell => {
      mapArray[cell.parentElement.rowIndex][cell.cellIndex] = number
    });

   
}

function handleTime(){


  if(currentSeason == 3 && seasonTime - timeCost <= 0){
    timeLeft = 0
    clearState()
    gameOver()
    return
  }

  if(seasonTime == 1 && timeCost == 2){
    timeLeft -= timeCost
    seasonTime = 6
    currentSeason += 1
    seasonPointDisplay = document.querySelector(seasonDisplays[currentSeason])

  }else{
    if((seasonTime - timeCost ) == 0){
      timeLeft -= timeCost
      seasonTime = 7
      currentSeason += 1
      seasonPointDisplay = document.querySelector(seasonDisplays[currentSeason])

    }else{
      timeLeft -= timeCost
      seasonTime -= timeCost
    }
  }

  seasonTimeDisplay.innerHTML = seasonTime + "/7"
  
  seasonDisplay.innerHTML = seasons[currentSeason]
  document.getElementById("A").classList.remove(...document.getElementById("A").classList)
  document.getElementById("B").classList.remove(...document.getElementById("B").classList)
  document.getElementById("C").classList.remove(...document.getElementById("C").classList)
  document.getElementById("D").classList.remove(...document.getElementById("D").classList)
  document.querySelectorAll("#mission").forEach(mission=>{
    mission.classList.add("inactive")
  })


  document.getElementById(`${seasons[currentSeason].split(" ")[1].split("")[1]}`).classList.add("active")
  document.getElementById(`${seasons[currentSeason].split(" ")[1].split("")[2]}`).classList.add("active")
  document.getElementById(`${seasons[currentSeason].split(" ")[1].split("")[1]}`).parentElement.classList.remove("inactive")
  document.getElementById(`${seasons[currentSeason].split(" ")[1].split("")[2]}`).parentElement.classList.remove("inactive")
  

  saveState()
}

function handlePoints(){


  let points
  let sumPoint
  points = surroundedMountains()
  seasonPoints[currentSeason] += points
  sumPoint = seasonPoints[0]+seasonPoints[1]+seasonPoints[2]+seasonPoints[3]

  seasonPointDisplay.innerHTML = (Number(seasonPointDisplay.innerHTML.split(" ")[0]) + points) + " pont"


  document.querySelectorAll("#mission").forEach(mission=>{

    switch(mission.childNodes[3].childNodes[1].innerHTML){
      case "Álmos-völgy":
        points = almosvolgy()
        if(mission.childNodes[5].classList.contains("active")){
          seasonPoints[currentSeason] += points
          seasonPointDisplay.innerHTML = (Number(seasonPointDisplay.innerHTML.split(" ")[0]) + points) + " pont"
          missionPoints[[...mission.parentNode.children].indexOf(mission)] += points
          mission.childNodes[3].childNodes[5].innerHTML = "(" + missionPoints[[...mission.parentNode.children].indexOf(mission)] + " pont)"
        }
        break;
      case "Az erdő széle":
        points = erdoszele()
        if(mission.childNodes[5].classList.contains("active")){
          seasonPoints[currentSeason] += points
          seasonPointDisplay.innerHTML = (Number(seasonPointDisplay.innerHTML.split(" ")[0]) + points) + " pont"
          missionPoints[[...mission.parentNode.children].indexOf(mission)] += points
          mission.childNodes[3].childNodes[5].innerHTML = "(" + missionPoints[[...mission.parentNode.children].indexOf(mission)] + " pont)"
        }
        break;
      case "Krumpliöntözés":
        points = krumpliontozes();
        
        if(mission.childNodes[5].classList.contains("active")){
          seasonPoints[currentSeason] += points
          seasonPointDisplay.innerHTML = (Number(seasonPointDisplay.innerHTML.split(" ")[0]) + points) + " pont"
          missionPoints[[...mission.parentNode.children].indexOf(mission)] += points
          mission.childNodes[3].childNodes[5].innerHTML = "(" + missionPoints[[...mission.parentNode.children].indexOf(mission)] + " pont)"
        }
        break;
      case "Határvidék":
        points = hatarvidek()
        if(mission.childNodes[5].classList.contains("active")){
          seasonPoints[currentSeason] += points
          seasonPointDisplay.innerHTML = (Number(seasonPointDisplay.innerHTML.split(" ")[0]) + points) + " pont"
          missionPoints[[...mission.parentNode.children].indexOf(mission)] += points
          mission.childNodes[3].childNodes[5].innerHTML = "(" + missionPoints[[...mission.parentNode.children].indexOf(mission)] + " pont)"
        }
        break;
    }
  })
  sumPoint = seasonPoints[0]+seasonPoints[1]+seasonPoints[2]+seasonPoints[3]
  pointSum.innerHTML = "Összesen: " + sumPoint + " pont"



  

}

function surroundedMountains(){
  let points = 0
  let tempCells = []

  for(let row = 0; row < 11; row++){

    for(let cell = 0; cell < 11; cell++){

      if(mapTable.rows[row].cells[cell].classList.contains("mountain") && !calculatedMountains.includes(row + " " + cell)){

        try{
          if(mapArray[row][cell] == 1 && mapArray[row][cell -1] != 0 && mapArray[row][cell+1] != 0 && mapArray[row-1][cell] != 0 && mapArray[row+1][cell] != 0){
            tempCells.push(row + " " + cell)
            
          }
        }catch(error){}
       
      }
    }
  }

  tempCells.forEach(element=>{
    calculatedMountains.push(element)
    tempCells.splice(element,1)
    points += 1
    

  })

  calculatedMountains.forEach(mountain=>{
    mapTable.rows[mountain.split(" ")[0]].cells[mountain.split(" ")[1]].classList.add("surrounded")
  })

  return points
}

function almosvolgy(){
  let tempCells = []
  let points = 0



  for(let row = 0; row < 11; row++){
    for(let cell = 0; cell < 11; cell++){

      if(mapArray[row][cell] == 2  && !calculatedForests.includes(row + " " + cell) ){
        tempCells.push(mapTable.rows[row].cells[cell])
      }
    }
    }
    tempCells.forEach(c => {

      try{
        if(c.classList.contains("forest")
           && mapTable.rows[c.parentElement.rowIndex].cells[c.cellIndex + 1].classList.contains("forest")
           && mapTable.rows[c.parentElement.rowIndex].cells[c.cellIndex + 2].classList.contains("forest")){
             calculatedForests.push(c.parentElement.rowIndex + " " + c.cellIndex)
             calculatedForests.push(c.parentElement.rowIndex + " " + Number(c.cellIndex + 1))
             calculatedForests.push(c.parentElement.rowIndex + " " + Number(c.cellIndex + 2))
             tempCells.splice(c, 1);
             tempCells.splice(mapTable.rows[c.parentElement.rowIndex].cells[c.cellIndex + 1], 1);
             tempCells.splice(mapTable.rows[c.parentElement.rowIndex].cells[c.cellIndex + 2], 1);
             points += 4
            
            }
          }
      catch{}
    });
  return points
}

function erdoszele(){
  let tempCells = []
  let points = 0

  let edges = []

  for (let i = 0; i < 11; i++) {
    edges.push(mapTable.rows[0].cells[i]);
  }
  for (let i = 1; i < 11; i++) {
    edges.push(mapTable.rows[i].cells[10]);
  }
  for (let i = 9; i >= 0; i--) {
    edges.push(mapTable.rows[10].cells[i])
  }
  for (let i = 9; i > 0; i--) {
    edges.push(mapTable.rows[i].cells[0]);
  }

  edges.forEach(cell=>{
    if(cell.classList.contains("forest") && !calculatedForestEdge.includes(cell.parentElement.rowIndex + " " + cell.cellIndex)){
      calculatedForestEdge.push(cell.parentElement.rowIndex + " " + cell.cellIndex)
      points += 1
    }
  })

  return points
}

function krumpliontozes(){
  
  let points = 0
  let tempCells = []

  for(let row = 0; row < 11; row++){

    for(let cell = 0; cell < 11; cell++){

      if(mapTable.rows[row].cells[cell].classList.contains("farm") && !calculatedPotato.includes(row + " " + cell)){

        let valid = false
        let neighbours = []

        try{
          neighbours.push(mapArray[row][cell + 1])
        }catch(error){}
        try{
          neighbours.push(mapArray[row][cell - 1])
        }catch(error){}
        try{
          neighbours.push(mapArray[row + 1][cell])
        }catch(error){}
        try{
          neighbours.push(mapArray[row -1][cell])
        }catch(error){}

        neighbours.forEach(neighbour =>{
          if(neighbour == 5){
            valid = true
          }
        })

        if(valid){
          tempCells.push(row + " " + cell)
        }       
      }
    }
  }

  tempCells.forEach(element => {
    calculatedPotato.push(element)
    points += 2
    
  });

  return points
}

function hatarvidek(){

  let points = 0
  let full

  let rows = []
  for (let row = 0; row < 11; row++) {
    let rowCells = []
    for (let cell = 0; cell < 11; cell++) {
      rowCells.push(row + " " + cell);
    }
    rows.push(rowCells);
  }

  let cols = []
  for (let cell = 0; cell < 11; cell++) {
    const colCells = [];
    for (let row = 0; row < 11; row++) {
      colCells.push(row + " " + cell);
    }
    cols.push(colCells);
  }

  rows.forEach(row=>{
    if(!calculatedRows.includes(row[0].split(" ")[0])){
      full = true
      row.forEach(cell=>{
        if(mapTable.rows[cell.split(" ")[0]].cells[cell.split(" ")[1]].classList.contains("empty")){
          full = false
        }
      })
    }
    if(full && !calculatedRows.includes(row[0].split(" ")[0])){
      points += 6
      calculatedRows.push(row[0].split(" ")[0])
    }
    
  })

  cols.forEach(col=>{
    if(!calculatedCols.includes(col[0].split(" ")[1])){
      full = true
      col.forEach(cell=>{
        if(mapTable.rows[cell.split(" ")[0]].cells[cell.split(" ")[1]].classList.contains("empty")){
          full = false
        }
      })
    }
    if(full && !calculatedCols.includes(col[0].split(" ")[1])){
      calculatedCols.push(col[0].split(" ")[1])
      points += 6
      
    }
    
  })
  return points
}

function clearState(){

  localStorage.removeItem("terkepesz")

}
function saveState(){

  terkepesz.seasonTime = seasonTime
  terkepesz.currentSeason = currentSeason
  terkepesz.seasonPoints = seasonPoints
  terkepesz.missionPoints = missionPoints
  terkepesz.currentElement = currentElement
  terkepesz.elements = elements
  terkepesz.missions = missions
  terkepesz.mapArray = mapArray
  terkepesz.calculatedMountains = calculatedMountains
  terkepesz.calculatedForests = calculatedForests
  terkepesz.calculatedForestEdge = calculatedForestEdge
  terkepesz.calculatedPotato = calculatedPotato
  terkepesz.calculatedRows = calculatedRows
  terkepesz.calculatedCols = calculatedCols
  
  localStorage.setItem("terkepesz",JSON.stringify(terkepesz))

}

function gameOver(){
  
  seasonTimeDisplay.innerHTML = "0/7"
  for(let i = 0; i < 3; i++){
    for(let j = 0; j < 3; j++){
      toPlaceRows[i].cells[j].classList.remove(...toPlaceRows[i].cells[j].classList);
    }
   }
  document.getElementById("toPlaceContainer").classList.add("hidden");
  document.getElementById("gameOverText").classList.remove("hidden");
  removeMarkers()
  let clone = mapTable.cloneNode(true); 
  mapTable.replaceWith(clone); 

}

startGame()

