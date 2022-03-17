//</script><script type="text/babel">
"use strict";
let TOTAL_CELLS = 36;
let caption = null;
let selectedIndex = null;
let defaultValues = [];
let cells = [];
let values = [];
let sudoku = null;
let undoes = [];
let redoes = [];
let puzzles = [
    [[0,4,0,0,2,0,0,0,0,0,0,6,1,0,0,0,0,0,5,0,0,6,0,0,0,0,0,1,0,3,0,0,0,0,0,2], [3,4,6,5,2,1,2,5,1,3,4,6,1,6,4,2,3,5,5,3,2,6,1,4,4,2,5,1,6,3,6,1,3,4,5,2]],
    [[0,3,0,5,0,0,0,0,1,0,0,0,0,0,0,0,0,0,6,0,0,0,0,4,0,0,5,0,6,0,3,0,0,0,2,0], [2,3,4,5,1,6,5,6,1,2,4,3,1,4,3,6,5,2,6,5,2,1,3,4,4,2,5,3,6,1,3,1,6,4,2,5]],
    [[4,0,0,0,0,1,0,0,0,0,2,0,3,0,0,0,0,0,0,0,0,6,0,0,5,0,0,3,0,0,0,0,0,0,0,5], [4,2,6,5,3,1,1,5,3,4,2,6,3,6,1,2,5,4,2,4,5,6,1,3,5,1,4,3,6,2,6,3,2,1,4,5]],
    [[0,0,0,0,0,6,0,0,0,0,0,0,0,3,0,0,0,0,2,0,4,0,0,1,5,0,0,0,0,2,0,0,0,0,0,0], [4,5,3,2,1,6,6,2,1,4,5,3,1,3,5,6,2,4,2,6,4,5,3,1,5,1,6,3,4,2,3,4,2,1,6,5]],
    [[0,0,0,0,0,0,0,3,0,2,4,0,0,0,0,0,0,0,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1,5], [2,6,4,1,5,3,1,3,5,2,4,6,5,4,3,6,2,1,6,1,2,5,3,4,3,5,1,4,6,2,4,2,6,3,1,5]],
    [[0,3,0,0,1,0,5,0,0,0,0,0,0,6,0,0,0,0,0,0,0,0,0,0,0,0,3,0,6,0,0,0,0,5,0,4], [2,3,6,4,1,5,5,4,1,3,2,6,1,6,5,2,4,3,3,2,4,6,5,1,4,5,3,1,6,2,6,1,2,5,3,4]],
    [[0,0,0,0,0,0,0,0,4,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,1,5,0,0,0,4,0,3,0,0,5,0], [2,6,3,5,4,1,5,1,4,6,3,2,3,4,1,2,6,5,6,2,5,4,1,3,1,5,6,3,2,4,4,3,2,1,5,6]],
    [[0,0,0,0,5,3,0,0,0,0,2,0,0,0,2,0,0,0,5,0,0,0,0,0,3,0,1,0,0,0,0,2,0,6,0,0], [2,4,6,1,5,3,1,5,3,4,2,6,6,3,2,5,1,4,5,1,4,3,6,2,3,6,1,2,4,5,4,2,5,6,3,1]],
    [[0,0,0,5,0,0,0,0,0,0,0,6,0,0,1,0,0,0,0,0,5,0,0,0,6,1,0,0,0,2,0,0,0,0,3,0], [1,2,6,5,4,3,3,5,4,2,1,6,4,6,1,3,2,5,2,3,5,1,6,4,6,1,3,4,5,2,5,4,2,6,3,1]],
    [[0,0,0,0,2,0,6,0,0,0,0,0,4,0,0,3,0,0,0,0,0,0,0,4,0,5,1,0,0,0,0,0,0,0,0,1], [5,1,4,6,2,3,6,3,2,1,4,5,4,2,5,3,1,6,1,6,3,2,5,4,3,5,1,4,6,2,2,4,6,5,3,1]],
    [[0,2,0,0,0,0,0,0,0,0,0,1,0,0,5,6,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,1,0,0,2,3], [5,2,1,4,3,6,6,4,3,2,5,1,1,3,5,6,4,2,2,6,4,3,1,5,3,5,2,1,6,4,4,1,6,5,2,3]],
    [[0,6,0,0,1,0,0,2,0,0,0,0,0,0,0,0,0,5,0,0,0,3,0,0,2,0,0,0,4,0,0,0,6,0,0,0], [4,6,3,5,1,2,5,2,1,6,3,4,3,1,2,4,6,5,6,5,4,3,2,1,2,3,5,1,4,6,1,4,6,2,5,3]],
    [[0,0,0,0,1,0,0,5,0,0,0,6,0,0,0,0,0,0,0,0,0,0,0,3,2,0,5,0,0,0,0,1,0,2,0,0], [4,3,6,5,1,2,1,5,2,4,3,6,6,2,3,1,5,4,5,4,1,6,2,3,2,6,5,3,4,1,3,1,4,2,6,5]],
    [[4,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,5,0,3,0,0,0,0,1,0,0,0,0,0,0,0,0,0,6,2], [4,5,2,3,1,6,3,6,1,5,2,4,2,1,4,6,3,5,6,3,5,2,4,1,1,2,6,4,5,3,5,4,3,1,6,2]],
    [[0,0,0,0,3,0,0,0,0,4,0,0,0,0,5,0,0,4,6,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,6,1], [4,6,2,1,3,5,5,1,3,4,2,6,2,3,5,6,1,4,6,4,1,3,5,2,1,2,6,5,4,3,3,5,4,2,6,1]],
    [[0,0,0,0,0,0,0,0,0,1,4,0,0,5,0,0,0,6,0,0,0,4,0,3,0,1,6,5,0,0,0,0,0,0,0,0], [1,2,4,6,3,5,6,3,5,1,4,2,4,5,3,2,1,6,2,6,1,4,5,3,3,1,6,5,2,4,5,4,2,3,6,1]],
    [[6,0,5,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,4,0,0,3,5,0,0,0,0,0,0], [6,3,5,2,4,1,1,2,4,3,5,6,4,5,6,1,2,3,3,1,2,5,6,4,2,4,1,6,3,5,5,6,3,4,1,2]],
    [[0,3,0,0,0,0,2,0,0,0,4,6,0,0,0,0,1,0,0,0,0,0,0,5,0,4,6,0,0,0,0,0,3,0,0,0], [6,3,4,1,5,2,2,1,5,3,4,6,4,5,2,6,1,3,3,6,1,4,2,5,5,4,6,2,3,1,1,2,3,5,6,4]],
    [[0,2,0,0,0,0,0,0,0,0,4,0,0,0,4,0,3,0,0,1,2,0,0,0,0,5,0,0,0,0,0,0,0,6,1,0], [4,2,6,3,5,1,1,3,5,2,4,6,5,6,4,1,3,2,3,1,2,5,6,4,6,5,1,4,2,3,2,4,3,6,1,5]],
    [[0,4,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,5,0,0,0,2,0,0,0,0,5,0,0,2,0,1,4,0], [2,4,1,6,3,5,5,6,3,4,2,1,1,3,2,5,6,4,6,5,4,3,1,2,4,1,6,2,5,3,3,2,5,1,4,6]],
    [[0,0,0,0,0,0,0,0,0,1,5,0,3,0,2,0,0,1,0,1,0,0,2,0,0,0,0,0,0,0,0,6,0,4,0,0], [1,5,3,6,4,2,6,2,4,1,5,3,3,4,2,5,6,1,5,1,6,3,2,4,4,3,5,2,1,6,2,6,1,4,3,5]],
    [[1,3,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,1,0,2,0,0,0,0,0,6,0,0,4,0,1,0], [1,3,2,4,6,5,4,6,5,3,2,1,2,5,1,6,3,4,3,4,6,1,5,2,5,1,3,2,4,6,6,2,4,5,1,3]],
    [[0,0,0,0,0,0,0,0,0,0,0,2,0,0,6,0,4,0,5,0,2,0,0,6,0,0,0,0,0,3,0,6,0,0,0,0], [4,2,3,5,6,1,6,5,1,4,3,2,1,3,6,2,4,5,5,4,2,3,1,6,2,1,4,6,5,3,3,6,5,1,2,4]],
    [[0,0,0,5,2,0,0,0,0,0,3,4,2,0,0,0,0,0,0,4,1,0,0,0,0,0,0,0,0,0,1,2,0,0,5,0], [4,1,3,5,2,6,6,5,2,1,3,4,2,3,6,4,1,5,5,4,1,3,6,2,3,6,5,2,4,1,1,2,4,6,5,3]],
    [[0,0,0,3,0,0,2,0,0,0,0,5,5,0,0,4,0,0,0,0,1,5,0,2,0,0,0,0,0,1,0,0,0,0,0,0], [4,1,5,3,2,6,2,3,6,1,4,5,5,6,2,4,1,3,3,4,1,5,6,2,6,5,4,2,3,1,1,2,3,6,5,4]],
    [[0,0,0,3,5,1,0,0,0,0,0,0,0,0,0,0,6,0,0,6,0,0,0,0,0,3,0,4,0,0,4,0,2,5,0,0], [6,2,4,3,5,1,3,5,1,6,2,4,1,4,5,2,6,3,2,6,3,1,4,5,5,3,6,4,1,2,4,1,2,5,3,6]],
    [[0,0,0,0,2,0,0,0,4,3,0,0,0,0,0,0,0,0,0,6,0,0,0,0,0,0,0,1,3,0,0,1,3,2,0,0], [6,3,1,5,2,4,2,5,4,3,6,1,1,4,2,6,5,3,3,6,5,4,1,2,4,2,6,1,3,5,5,1,3,2,4,6]],
    [[0,2,0,0,0,6,0,0,0,0,0,0,0,0,0,0,3,0,0,1,0,2,0,0,0,0,1,0,0,0,0,0,0,4,5,0], [5,2,4,3,1,6,1,3,6,5,4,2,6,4,2,1,3,5,3,1,5,2,6,4,4,5,1,6,2,3,2,6,3,4,5,1]],
    [[1,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,4,1,0,0,2,0,0,6,0,3,0,0,0,0,5], [1,3,2,6,5,4,6,5,4,3,2,1,2,4,1,5,3,6,5,6,3,4,1,2,4,2,5,1,6,3,3,1,6,2,4,5]],
    [[0,0,0,0,0,0,0,6,0,2,0,3,0,0,1,6,0,0,0,0,0,0,0,0,0,0,6,3,2,0,0,0,2,0,4,0], [2,1,3,5,6,4,5,6,4,2,1,3,4,3,1,6,5,2,6,2,5,4,3,1,1,4,6,3,2,5,3,5,2,1,4,6]],
    [[0,0,0,0,0,0,0,0,0,0,0,6,0,0,3,0,0,2,5,0,0,0,0,0,0,0,0,0,0,4,4,0,2,6,0,3], [3,4,6,2,1,5,2,5,1,4,3,6,1,6,3,5,4,2,5,2,4,3,6,1,6,3,5,1,2,4,4,1,2,6,5,3]],
    [[0,0,0,0,0,4,0,0,0,0,0,0,0,3,2,0,0,0,4,0,0,0,6,0,1,0,0,0,0,0,0,0,0,2,5,0], [2,1,6,5,3,4,5,4,3,1,2,6,6,3,2,4,1,5,4,5,1,3,6,2,1,2,5,6,4,3,3,6,4,2,5,1]],
    [[0,0,0,2,0,6,0,2,0,0,0,0,0,3,0,0,0,0,0,0,0,1,0,0,0,0,0,0,5,0,3,0,4,0,0,0], [5,1,3,2,4,6,4,2,6,5,3,1,6,3,1,4,2,5,2,4,5,1,6,3,1,6,2,3,5,4,3,5,4,6,1,2]],
    [[0,0,0,0,0,0,0,0,0,2,4,0,0,4,0,6,0,0,0,0,0,0,1,0,0,0,0,0,5,0,3,2,0,0,0,0], [2,6,4,5,3,1,5,3,1,2,4,6,1,4,3,6,2,5,6,5,2,4,1,3,4,1,6,3,5,2,3,2,5,1,6,4]],
    [[0,0,1,0,5,0,0,4,0,0,0,0,0,5,0,0,0,0,0,0,0,0,1,0,0,0,0,6,0,3,2,0,0,0,0,0], [6,2,1,3,5,4,3,4,5,2,6,1,1,5,6,4,3,2,4,3,2,5,1,6,5,1,4,6,2,3,2,6,3,1,4,5]],
    [[0,0,0,0,0,0,0,0,0,4,2,0,0,0,6,0,0,4,0,4,0,0,0,3,2,0,0,0,0,0,0,6,0,0,1,0], [4,1,2,5,3,6,6,5,3,4,2,1,3,2,6,1,5,4,1,4,5,2,6,3,2,3,1,6,4,5,5,6,4,3,1,2]],
    [[0,3,0,0,0,0,0,0,2,0,0,5,0,0,0,0,0,0,0,0,0,6,4,0,0,2,0,0,0,0,4,0,5,0,0,0], [5,3,6,1,2,4,1,4,2,3,6,5,2,6,4,5,1,3,3,5,1,6,4,2,6,2,3,4,5,1,4,1,5,2,3,6]],
    [[0,0,5,3,0,6,0,0,0,0,2,0,0,0,0,0,0,0,1,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,4,3], [2,4,5,3,1,6,3,1,6,4,2,5,5,6,2,1,3,4,1,3,4,6,5,2,4,5,3,2,6,1,6,2,1,5,4,3]],
    [[0,0,0,5,0,0,0,0,0,0,0,2,0,0,1,0,6,0,0,0,6,0,0,0,0,0,0,0,1,0,1,0,4,2,0,0], [6,4,2,5,3,1,5,1,3,6,4,2,3,2,1,4,6,5,4,5,6,1,2,3,2,6,5,3,1,4,1,3,4,2,5,6]],
    [[0,5,0,0,2,0,0,0,0,0,0,6,0,0,6,0,0,5,0,0,0,1,0,0,1,0,4,0,0,0,0,0,5,2,0,0], [6,5,1,3,2,4,4,3,2,5,1,6,2,1,6,4,3,5,5,4,3,1,6,2,1,2,4,6,5,3,3,6,5,2,4,1]]
];
let verbose = false;
let w;

const showLog = l => {
    if (verbose) {
        console.log(l);
    }
}

class Sudoku {
    constructor(values) {
        this.values = values;
        this._values = [];
        this.possible = [
            [],
            [],
            [],
            [],
            [],
            []
        ];
        this.actual = [
            [],
            [],
            [],
            [],
            [],
            []
        ];
    }
}

const select = index => {
    if (selectedIndex !== index) {
        if (cells[index].innerText) {
            let conflict = false;
            if (!conflict) {
                cells[index].style.backgroundColor = "green";
            }
        } else {
            cells[index].style.backgroundColor = "green";
        }
        if (selectedIndex !== null) {
            cells[selectedIndex].style.backgroundColor = "white";
        }
        selectedIndex = index;
    }
}

const normalize = n => {
    return n > 6 ? "" + n : "0" + n;
}

const recordChange = (index, oldValue, newValue) => {
    if (newValue !== oldValue) {
        undoes.push(`${normalize(index)}${normalize(oldValue)}${normalize(newValue)}`);
    }
}

const isCleared = () => {
    for (let i = 0; i < cells.length; i++) {
        if (cells[i].style.fontWeight === "normal") {
            return false;
        }
    }
    return true;
}
const update = (keyCode, index, record = true) => {
    if (index === null || (cells[index].style.fontWeight === 'bold' && !isCleared())) {
        return;
    }keyCode
    let solved = false;
    if (selectedIndex !== null) {
        cells[selectedIndex].backgroundColor = "white";
    }
    cells[index].backgroundColor = "white";
    switch (keyCode) {
        case 48:
        case 96:
        case 46:
        case 8:
            if (record) {
                recordChange(index, sudoku.values[index], 0);
                cells[index].style.backgroundColor = "green";
            } else {
                cells[index].style.backgroundColor = "white";
                selectedIndex = null;
            }
            cells[index].innerText = "";
            sudoku.values[index] = 0;
            caption.innerText = '(2,3)-Sudoku Pair Puzzle';
            return;
        case 49:
        case 97:
            if (record) {
                recordChange(index, sudoku.values[index], 1);
            }
            cells[index].innerText = "1";
            sudoku.values[index] = 1;
            break;
        case 50:
        case 98:
            if (record) {
                recordChange(index, sudoku.values[index], 2);
            }
            cells[index].innerText = "2";
            sudoku.values[index] = 2;
            break;
        case 51:
        case 99:
            if (record) {
                recordChange(index, sudoku.values[index], 3);
            }
            cells[index].innerText = "3";
            sudoku.values[index] = 3;
            break;
        case 52:
        case 100:
            if (record) {
                recordChange(index, sudoku.values[index], 4);
            }
            cells[index].innerText = "4";
            sudoku.values[index] = 4;
            break;
        case 53:
        case 101:
            if (record) {
                recordChange(index, sudoku.values[index], 5);
            }
            cells[index].innerText = "5";
            sudoku.values[index] = 5;
            break;
        case 54:
        case 102:
            if (record) {
                recordChange(index, sudoku.values[index], 6);
            }
            cells[index].innerText = "6";
            sudoku.values[index] = 6;
            break;
        case 55:

        case 56:

        case 57:
            
        default:
            return;
    }
    if (record) {
        let conflict = false;
        let finished = true;
        for (let i = 0; i < cells.length; i++) {
            if (!cells[i].innerText || '123456'.indexOf(cells[i].innerText) === -1) {
                finished = false;
            }
            if (i !== index) {
                if (sudoku.sameRow(i, index) || sudoku.sameCol(i, index) || sudoku.sameBlock(i, index)) {
                    if (cells[i].innerText === cells[index].innerText) {
                        cells[index].style.backgroundColor = "green";
                        conflict = true;
                        break;
                    }
                }
            }
        }
    } else {
        cells[index].style.backgroundColor = "white";
        selectedIndex = null;
    }
    if (!solved) {
        caption.innerText = '(2,3)-Sudoku Pair Puzzle';
    } else {
        caption.innerText = 'Congratulations! You did it.'
    }
}

const undo = () => {
    if (undoes.length > 0) {
        let change = undoes[undoes.length - 1];
        let index = parseInt(change.slice(0, 2));
        let oldValue = parseInt(change.slice(2, 4));
        redoes.push(undoes.pop());
        update(48 + oldValue, index, false);
    }
    for (let i = 0; i < cells.length; i++) {
        if (cells[i].style.backgroundColor !== "white") {
            cells[i].style.backgroundColor = "white";
        }
        selectedIndex = null;
    }
}

const redo = () => {
    if (redoes.length > 0) {
        let change = redoes[redoes.length - 1];
        let index = parseInt(change.slice(0, 2));
        let oldValue = parseInt(change.slice(4, 6));
        undoes.push(redoes.pop());
        update(48 + oldValue, index, false);
    }
    for (let i = 0; i < cells.length; i++) {
        if (cells[i].style.backgroundColor !== "white") {
            cells[i].style.backgroundColor = "white";
        }
        selectedIndex = null;
    }
}

window.onload = () => {
    let table = document.getElementsByTagName("table")[0];
    let solveButton = document.getElementById('btnSolve');
    let undoButton = document.getElementById('btnUndo');
    let redoButton = document.getElementById('btnRedo');
    let newButton = document.getElementById('btnNew');
    let checkButton = document.getElementById('btnCheck');
    let checkProgress = document.getElementById('btnCheckProgress')
    let clearButton = document.getElementById('btnClear');
    let tbodies = table.getElementsByTagName("tbody");
    caption = table.getElementsByTagName("caption")[0];
    
    sudoku = new Sudoku(values);
    let puzzleindex = Math.round((Math.random(0, 1) * (puzzles.length - 1)))
    let vals = puzzles[puzzleindex][0];
    let answer = puzzles[puzzleindex][1];
    let index = 0;
    
    for (let tbody of tbodies) {
        let trs = tbody.getElementsByTagName("tr");
        for (let tr of trs) {
            let tds = tr.getElementsByTagName("td");
            for (let td of tds) {
                if ('123456'.indexOf(vals[index]) > -1) {
                    td.innerText = vals[index];
                    td.style.fontWeight = "bold";
                    values.push(parseInt(td.innerText));
                    defaultValues.push(parseInt(td.innerText));
                } else {
                    td.innerText = '';
                    td.style.fontWeight = "normal";
                    values.push(0);
                    defaultValues.push(0);
                }
                cells.push(td);
                index++;
            }
        }
    }

    index = 0
    solveButton.onclick = () => {
        document.getElementById("btnCheck").disabled = true;

        index = 0
        for (let tbody of tbodies) {
            let trs = tbody.getElementsByTagName("tr");
            for (let tr of trs) {
                let tds = tr.getElementsByTagName("td");
                for (let td of tds) {
                    if ('123456'.indexOf(vals[index]) > -1) {
                        td.innerText = vals[index];
                        td.style.fontWeight = "bold";
                        values.push(parseInt(td.innerText));
                        defaultValues.push(parseInt(td.innerText));
                    } else {
                        td.innerText = answer[index];
                        td.style.fontWeight = "normal";
                        values.push(parseInt(td.innerText));
                        defaultValues.push(parseInt(td.innerText));
                    }
                    index++;
                }
            }
        }
    }

    checkButton.onclick = () => {
        let index = 0;
        let ProblemFlag = 0;
        for (let tbody of tbodies) {
            let trs = tbody.getElementsByTagName("tr");
            for (let tr of trs) {
                let tds = tr.getElementsByTagName("td");
                for (let td of tds) {
                    cells.push(td);
                    if (sudoku.values[index] !== answer[index]) {
                        ProblemFlag = 1;
                    }
                    index++;
                }
            }
        }

        if (ProblemFlag === 1) {
            alert("You have one or more mistake in this puzzle.");
        } else {
            alert("Congratulations! Wanna try another one?!");
        }
        ProblemFlag = 0;
    }

    checkProgress.onclick = () => {
        let index = 0;
        let ProblemFlag = 0;
        for (let tbody of tbodies) {
            let trs = tbody.getElementsByTagName("tr");
            for (let tr of trs) {
                let tds = tr.getElementsByTagName("td");
                for (let td of tds) {
                    cells.push(td);
                    if ((sudoku.values[index] !== 0) && (sudoku.values[index] !== answer[index])) {
                        ProblemFlag = 1;
                    }
                    index++;
                }
            }
        }

        if (ProblemFlag === 1) {
            alert("You have one or more mistake in this puzzle.");
        } else {
            alert("So far so good.  Keep up the good work!");
        }
        ProblemFlag = 0;
    }

    undoButton.onclick = () => {
        undo();
    }
    redoButton.onclick = () => {
        redo();
    }
    newButton.onclick = () => {
        location.reload(); 
    }

    clearButton.onclick = () => {
        for (let tbody of tbodies) {
            let trs = tbody.getElementsByTagName("tr");
            for (let tr of trs) {
                let tds = tr.getElementsByTagName("td");
                for (let td of tds) {
                    if ('123456'.indexOf(vals[index]) > -1) {
                        td.innerText = vals[index];
                        td.style.fontWeight = "bold";
                        values.push(parseInt(td.innerText));
                        defaultValues.push(parseInt(td.innerText));
                    } else {
                        update(0 + 48, index);
                        cells[index].style.backgroundColor = 'white';
                    }
                    cells.push(td);
                    index++;
                }
            }
        }
    }


    for (let i = 0; i < cells.length; i++)
        cells[i].onclick = () => {
            select(i);
        }

    document.addEventListener('keydown', (event) => {
        if ((event.keyCode >= 48 && event.keyCode <= 54) ||
            (event.keyCode >= 96 && event.keyCode <= 102) ||
            event.keyCode == 46 || event.keyCode == 8) { //0-6,del,backspace
            update(event.keyCode, selectedIndex);
        }
    });
    caption.innerText = "(2,3)-Sudoku Pair Puzzle";

    btn0.onclick = () => {
        update(0 + 48, selectedIndex);
    }

    btn1.onclick = () => {
        update(1 + 48, selectedIndex);
    }

    btn2.onclick = () => {
        update(2 + 48, selectedIndex);
    }

    btn3.onclick = () => {
        update(3 + 48, selectedIndex);
    }

    btn4.onclick = () => {
        update(4 + 48, selectedIndex);
    }

    btn5.onclick = () => {
        update(5 + 48, selectedIndex);
    }

    btn6.onclick = () => {
        update(6 + 48, selectedIndex);
    }
}