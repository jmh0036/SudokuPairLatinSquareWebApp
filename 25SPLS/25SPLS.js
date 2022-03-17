//</script><script type="text/babel">
"use strict";
let TOTAL_CELLS = 100;
let caption = null;
let selectedIndex = null;
let defaultValues = [];
let cells = [];
let values = [];
let sudoku = null;
let undoes = [];
let redoes = [];
let puzzles = [
    [[0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,9,1,0,0,0,0,0,0,9,1,0,0,0,0,0,0,0,0,5,0,0,3,0,6,0,10,0,5,0,0,0,7,0,0,2,0,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,0,1,1,0,0,0,0,0,7,2,0,0,8,0,4,0,0,0,0,0,10,0,9,0,0,0,6,0,3,0,0,4], [6,9,7,1,10,2,5,4,3,8,5,2,8,4,3,6,9,1,7,10,7,8,3,6,9,1,2,10,4,5,4,1,10,2,5,7,8,3,9,6,3,10,9,5,8,4,6,7,1,2,2,4,6,7,1,5,10,9,8,3,10,6,2,9,7,3,4,8,5,1,1,3,5,8,4,10,7,2,6,9,8,5,4,3,2,9,1,6,10,7,9,7,1,10,6,8,3,5,2,4]],
    [[0,0,0,0,0,0,0,0,0,0,10,5,3,0,0,0,0,0,0,8,0,0,0,0,0,0,0,0,0,0,0,0,8,0,0,0,5,7,9,0,0,6,0,9,0,0,0,0,0,7,0,0,10,0,0,0,2,0,0,0,0,8,0,0,4,0,0,0,0,3,2,0,5,6,0,0,0,0,0,9,0,0,0,0,0,0,0,1,0,0,0,0,0,8,0,0,4,0,6,5], [4,9,6,2,8,7,1,3,5,10,10,5,3,7,1,4,9,6,2,8,3,7,4,5,9,10,8,2,1,6,1,2,8,10,6,3,5,7,9,4,8,6,1,9,2,5,10,4,3,7,5,4,10,3,7,6,2,9,8,1,9,8,7,1,4,2,6,5,10,3,2,3,5,6,10,1,7,8,4,9,6,10,9,4,5,8,3,1,7,2,7,1,2,8,3,9,4,10,6,5]],
    [[0,8,9,0,0,0,0,0,0,0,0,5,7,0,0,0,0,0,0,0,0,0,10,0,0,0,1,4,0,6,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,5,4,0,0,0,0,0,7,0,0,6,0,0,5,0,0,3,10,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,6,0,0,0,0,0,0,2,10,0,7,0,2,0,9,0,0,0,0,0], [3,8,9,4,2,7,6,10,5,1,10,5,7,6,1,4,2,8,3,9,9,7,10,2,3,5,1,4,8,6,1,4,8,5,6,10,3,9,7,2,2,6,3,1,8,9,7,5,4,10,4,10,5,9,7,1,8,6,2,3,5,9,6,3,10,2,4,7,1,8,8,2,1,7,4,6,10,3,9,5,6,1,4,8,5,3,9,2,10,7,7,3,2,10,9,8,5,1,6,4]],
    [[0,0,0,0,0,0,6,2,0,0,0,0,0,0,0,0,0,0,9,0,0,7,0,5,0,0,8,0,0,0,1,0,0,0,0,0,0,0,6,0,0,0,0,9,0,0,0,0,0,0,0,3,0,0,6,0,0,0,0,0,0,9,6,0,3,1,5,0,10,0,0,0,5,2,0,0,0,0,0,7,5,0,0,0,2,0,7,0,0,0,0,0,0,4,0,0,0,0,0,6], [9,5,8,10,1,3,6,2,7,4,3,2,7,6,4,10,1,5,9,8,6,7,4,5,9,2,8,3,1,10,1,10,2,3,8,7,4,9,6,5,8,4,1,9,5,6,10,7,2,3,2,3,10,7,6,4,9,8,5,1,7,9,6,8,3,1,5,4,10,2,4,1,5,2,10,9,3,6,8,7,5,6,3,1,2,8,7,10,4,9,10,8,9,4,7,5,2,1,3,6]],
    [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,1,10,0,0,1,0,0,2,0,4,0,0,0,7,0,3,0,0,0,0,0,0,0,10,0,0,0,0,0,0,0,0,7,0,0,0,4,0,0,0,0,0,0,0,8,0,1,0,0,6,0,0,0,0,0,9,0,0,2,0,0,0,0,0,0,0,8,7,0,0,5,0,2,0,0,0,2,0,10,1,0,9,0], [9,3,1,7,10,5,2,6,8,4,8,2,4,5,6,3,7,1,10,9,5,1,8,10,2,7,4,9,3,6,7,4,3,6,9,1,10,8,2,5,10,6,2,9,8,4,5,3,1,7,3,7,5,4,1,8,9,2,6,10,2,8,7,1,4,9,6,10,5,3,6,10,9,3,5,2,8,4,7,1,1,9,10,8,7,6,3,5,4,2,4,5,6,2,3,10,1,7,9,8]],
    [[0,0,0,0,0,0,0,6,8,0,1,0,0,9,0,0,0,0,0,7,0,0,0,10,2,0,0,0,0,0,0,0,0,0,0,4,0,0,0,9,3,0,0,0,0,0,0,0,4,0,0,0,0,1,6,0,8,0,0,0,0,0,0,0,0,9,0,0,0,1,0,0,0,0,0,0,6,0,0,0,7,0,10,0,0,0,0,0,0,0,8,0,4,0,0,0,7,0,3,10], [10,2,3,4,7,1,9,6,8,5,1,5,6,9,8,10,3,4,2,7,9,4,7,10,2,6,5,8,1,3,6,8,1,5,3,4,2,7,10,9,3,7,2,8,9,5,10,1,4,6,4,10,5,1,6,7,8,3,9,2,5,6,8,3,10,9,4,2,7,1,2,1,9,7,4,3,6,10,5,8,7,3,10,2,5,8,1,9,6,4,8,9,4,6,1,2,7,5,3,10]],
    [[2,0,0,0,0,0,0,0,0,0,0,8,0,0,0,0,0,0,0,0,0,5,0,0,0,0,7,0,0,0,0,0,0,0,0,6,2,9,8,0,0,0,0,0,8,7,0,3,0,0,0,0,3,0,0,0,0,0,0,0,0,6,1,0,0,2,0,0,0,0,0,0,2,0,0,0,0,0,9,10,0,0,0,9,3,5,0,0,7,0,10,2,0,0,0,0,0,0,4,0], [2,4,9,1,5,3,8,6,10,7,6,8,7,3,10,9,1,5,2,4,9,5,8,6,2,4,7,10,3,1,3,7,10,4,1,6,2,9,8,5,1,10,5,2,8,7,4,3,6,9,4,9,3,7,6,10,5,8,1,2,7,6,1,10,9,2,3,4,5,8,5,3,2,8,4,1,6,7,9,10,8,1,4,9,3,5,10,2,7,6,10,2,6,5,7,8,9,1,4,3]],
    [[9,0,0,7,0,0,0,0,0,0,0,0,0,0,0,0,10,0,4,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,9,0,0,5,0,5,0,0,0,0,0,4,0,0,4,0,0,0,0,2,0,0,0,0,0,0,7,0,0,3,0,6,1,0,0,0,0,0,4,0,0,0,0,0,0,0,10,0,0,6,0,8,0,3,3,0,0,0,0,5,2,10,0,0], [9,10,4,7,2,8,6,5,3,1,1,3,5,8,6,9,10,2,4,7,2,4,3,9,5,10,7,1,6,8,8,6,1,10,7,4,9,3,2,5,7,5,6,2,3,1,8,4,10,9,4,8,9,1,10,2,3,7,5,6,10,9,7,5,8,3,4,6,1,2,6,1,2,3,4,7,5,9,8,10,5,2,10,4,9,6,1,8,7,3,3,7,8,6,1,5,2,10,9,4]],
    [[0,0,0,0,0,10,1,0,0,0,0,0,6,0,0,0,0,0,5,2,0,0,0,0,0,0,0,0,0,0,0,8,0,0,0,6,0,0,0,10,0,0,4,0,8,0,0,0,1,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,10,0,0,0,0,4,0,5,1,0,0,0,3,0,6,0,1,0,0,0,0,0,0,9,2,0,0,4,7,3,2,0,0,0,0,0], [7,2,8,9,5,10,1,3,4,6,4,1,6,10,3,7,9,8,5,2,10,6,3,7,4,1,5,2,8,9,5,8,2,1,9,6,4,7,3,10,3,9,4,5,8,2,10,6,1,7,6,7,10,2,1,3,8,4,9,5,8,3,9,6,10,5,2,1,7,4,2,5,1,4,7,9,3,10,6,8,1,10,5,8,6,4,7,9,2,3,9,4,7,3,2,8,6,5,10,1]],
    [[0,0,0,0,0,0,10,0,0,0,0,5,0,0,0,7,0,0,0,0,0,4,10,0,0,0,0,3,1,5,7,0,0,0,0,0,0,0,0,2,0,1,0,0,0,0,0,0,0,9,0,0,0,10,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,5,0,1,0,0,0,0,0,0,0,0,8,0,1,7,5,0,0,0,0,6,4,0,8,0,3,0], [6,8,7,1,2,9,10,5,4,3,10,5,9,4,3,7,2,1,8,6,9,4,10,2,6,8,7,3,1,5,7,3,5,8,1,4,9,6,10,2,2,1,6,3,5,10,4,8,7,9,8,9,4,10,7,3,5,2,6,1,1,2,3,7,10,5,6,4,9,8,4,6,8,5,9,1,3,10,2,7,3,10,2,9,8,6,1,7,5,4,5,7,1,6,4,2,8,9,3,10]],
    [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,6,0,0,0,9,0,0,0,0,8,0,0,1,0,4,6,0,6,0,0,1,0,0,0,0,2,2,0,0,0,0,0,0,7,0,0,0,0,0,0,9,0,0,0,0,1,3,0,0,0,0,0,0,5,8,0,0,9,0,7,0,3,0,0,0,0,0,8,0,6,0,0,0,2,10,7], [8,1,5,9,4,10,2,6,7,3,7,10,6,2,3,9,5,4,1,8,5,3,1,4,6,2,7,8,9,10,9,2,10,8,7,5,1,3,4,6,4,6,7,3,1,8,10,9,5,2,2,5,9,10,8,1,6,7,3,4,6,4,8,5,9,7,3,10,2,1,3,7,2,1,10,6,4,5,8,9,10,9,4,7,2,3,8,1,6,5,1,8,3,6,5,4,9,2,10,7]],
    [[0,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,3,0,8,0,0,0,0,1,0,10,0,5,0,2,3,0,0,0,0,0,0,6,0,0,5,0,0,0,8,0,0,0,0,0,6,0,10,0,0,0,0,0,2,0,0,1,5,0,0,0,0,0,6,0,0,0,0,0,0,0,0,0,0,3,4,8,0,0,0,6,0,10,0,0,0,2,0,0,7,0,0,8,3], [6,8,3,1,2,10,5,4,9,7,4,10,5,9,7,6,1,3,2,8,7,9,6,8,1,3,10,2,5,4,2,3,10,4,5,9,8,7,6,1,1,5,7,2,4,8,9,6,3,10,8,6,9,10,3,1,7,5,4,2,9,2,1,5,8,4,3,10,7,6,10,7,4,3,6,5,2,8,1,9,3,4,8,7,9,2,6,1,10,5,5,1,2,6,10,7,4,9,8,3]],
    [[0,0,0,0,0,0,8,0,0,0,0,4,0,0,0,7,0,0,0,0,0,0,0,2,0,5,0,0,0,0,3,0,0,9,4,0,0,0,0,10,1,0,0,0,0,0,0,5,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,8,0,0,9,0,2,0,0,10,0,4,0,1,0,0,0,0,0,1,0,5,0,0,0,7,9,0,0,0,6,0,0,0,3,0,0,8], [5,2,7,1,10,3,8,9,4,6,9,4,3,6,8,7,10,2,1,5,10,6,8,2,1,5,4,3,7,9,3,7,5,9,4,2,1,6,8,10,1,8,4,10,6,9,7,5,3,2,2,5,9,3,7,8,6,4,10,1,6,3,1,8,5,4,9,10,2,7,7,10,2,4,9,1,5,8,6,3,8,1,10,5,3,6,2,7,9,4,4,9,6,7,2,10,3,1,5,8]],
    [[0,0,0,0,0,0,0,2,0,0,0,9,0,7,0,0,0,0,6,0,0,0,1,0,0,0,9,0,0,0,0,0,0,0,7,0,3,0,0,0,0,0,4,6,0,0,0,1,0,3,0,0,0,10,0,0,0,0,0,0,0,0,0,0,0,6,0,7,0,0,3,0,0,2,0,0,0,0,0,0,0,5,7,0,0,0,0,0,0,1,0,4,9,0,2,0,0,0,0,8], [5,6,10,3,8,9,7,2,1,4,1,9,2,7,4,3,8,5,6,10,2,3,1,5,6,10,9,4,8,7,4,10,8,9,7,1,3,6,5,2,7,8,4,6,5,2,10,1,9,3,9,2,3,10,1,5,4,8,7,6,8,1,5,4,10,6,2,7,3,9,3,7,6,2,9,8,1,10,4,5,10,5,7,8,3,4,6,9,2,1,6,4,9,1,2,7,5,3,10,8]],
    [[0,0,0,0,0,0,0,0,6,0,0,1,0,0,0,0,0,0,0,10,0,0,6,0,0,8,0,0,0,5,0,0,0,5,1,0,0,0,0,0,2,0,0,0,0,0,3,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0,0,3,0,6,9,0,0,0,0,5,0,0,7,0,0,0,0,0,4,0,10,0,0,0,0,5,0,0,0,0,0,9,5,0,6,2,3,0], [5,9,3,8,10,4,7,1,6,2,6,1,7,4,2,3,5,9,8,10,7,3,6,10,9,8,2,4,1,5,8,4,2,5,1,7,10,6,9,3,2,10,9,1,6,5,3,8,4,7,3,8,5,7,4,9,1,10,2,6,10,2,4,3,8,6,9,7,5,1,9,5,1,6,7,2,4,3,10,8,4,6,10,2,3,1,8,5,7,9,1,7,8,9,5,10,6,2,3,4]],
    [[0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,7,5,0,0,0,0,0,0,0,0,0,6,0,0,0,8,0,3,0,7,1,0,0,0,4,0,5,6,0,0,0,2,0,0,0,0,0,7,0,0,0,0,0,3,0,0,0,0,0,2,0,0,0,0,10,0,6,0,0,3,0,1,0,0,6,0,8,0,0,0,0,9,10,0,0,1,0,0,5,0,0,0], [5,2,3,7,1,9,4,6,10,8,8,10,9,6,4,2,3,1,7,5,3,4,1,2,7,8,10,5,9,6,9,6,5,8,10,3,2,7,1,4,7,1,4,10,5,6,8,9,3,2,6,8,2,9,3,7,1,4,5,10,1,3,8,5,9,10,6,2,4,7,2,7,10,4,6,5,9,3,8,1,4,5,6,3,8,1,7,10,2,9,10,9,7,1,2,4,5,8,6,3]],
    [[0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,8,7,4,0,0,0,0,9,0,0,0,0,0,7,0,0,1,0,2,0,0,0,0,0,0,0,2,0,0,3,0,0,0,1,0,3,6,0,1,0,0,10,9,0,0,0,3,0,0,0,0,0,0,6,0,0,0,0,0,0,4,0,5,0,0,6,0,1,0,0,0,9,0,0,10,0,0,7,0,0,5,0,0,0], [8,2,7,6,4,1,9,3,10,5,3,1,10,5,9,6,8,7,4,2,6,4,8,9,10,5,1,2,3,7,7,5,1,3,2,8,10,4,6,9,9,10,2,4,7,3,6,5,8,1,5,3,6,8,1,7,2,10,9,4,4,8,3,10,5,9,7,1,2,6,1,7,9,2,6,10,4,8,5,3,2,6,5,1,8,4,3,9,7,10,10,9,4,7,3,2,5,6,1,8]],
    [[3,0,0,0,0,0,0,0,0,0,0,7,0,9,4,0,0,0,0,0,2,0,6,0,0,0,1,0,0,0,9,0,0,0,0,0,8,2,0,0,0,0,0,0,6,1,0,0,3,0,0,0,0,0,0,0,0,0,0,8,0,0,3,0,2,0,4,0,0,0,1,0,0,10,9,0,0,0,0,6,0,0,0,8,0,0,0,9,0,0,0,0,0,0,0,7,0,0,0,10], [3,6,2,5,10,9,7,4,8,1,8,7,1,9,4,2,3,6,10,5,2,5,6,4,8,3,1,10,9,7,9,1,10,3,7,5,8,2,6,4,4,10,8,7,6,1,9,5,3,2,5,3,9,2,1,6,10,7,4,8,7,8,3,6,2,10,4,1,5,9,1,4,5,10,9,8,2,3,7,6,10,2,7,8,5,4,6,9,1,3,6,9,4,1,3,7,5,8,2,10]],
    [[0,0,0,0,0,0,0,0,0,8,0,0,3,0,0,0,0,7,0,0,0,0,0,0,0,0,0,2,0,0,4,0,8,0,7,9,0,5,0,0,3,0,0,0,0,0,0,0,4,0,0,0,0,10,0,0,0,0,0,0,0,4,0,8,0,6,0,0,0,0,9,0,0,0,0,7,0,4,0,1,0,0,6,0,2,1,5,0,0,0,0,10,0,1,0,0,0,0,0,7], [5,7,10,4,1,2,3,6,9,8,6,9,3,2,8,10,4,7,1,5,10,1,9,5,3,4,8,2,7,6,4,2,8,6,7,9,1,5,3,10,3,8,1,7,6,5,9,10,4,2,2,5,4,10,9,8,7,1,6,3,1,4,7,8,10,6,2,3,5,9,9,6,2,3,5,7,10,4,8,1,7,3,6,9,2,1,5,8,10,4,8,10,5,1,4,3,6,9,2,7]],
    [[0,0,0,0,0,0,0,4,0,8,0,0,0,1,0,10,0,0,0,0,0,0,6,0,0,0,0,0,0,4,0,2,8,0,0,7,0,6,0,0,9,0,0,0,0,0,0,0,2,0,7,0,0,0,3,0,0,9,0,5,6,0,0,0,0,1,0,3,0,0,0,0,0,0,0,0,4,0,0,7,3,1,0,0,6,0,5,0,0,2,0,4,0,0,0,0,0,0,0,0], [5,6,10,2,9,3,1,4,7,8,4,7,3,1,8,10,2,5,9,6,1,3,6,7,5,2,9,8,10,4,10,2,8,9,4,7,3,6,5,1,9,8,4,5,1,6,7,10,2,3,7,10,2,6,3,4,8,9,1,5,6,5,7,4,2,1,10,3,8,9,8,9,1,3,10,5,4,2,6,7,3,1,9,10,6,8,5,7,4,2,2,4,5,8,7,9,6,1,3,10]]
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
    return n > 10 ? "" + n : "0" + n;
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
            caption.innerText = '(2,5)-Sudoku Pair Puzzle';
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
        case 103:
            if (record) {
                recordChange(index, sudoku.values[index], 7);
            }
            cells[index].innerText = "7";
            sudoku.values[index] = 7;
            break;

        case 56:
        case 104:
            if (record) {
                recordChange(index, sudoku.values[index], 8);
            }
            cells[index].innerText = "8";
            sudoku.values[index] = 8;
            break;

        case 57:
        case 105:
            if (record) {
                recordChange(index, sudoku.values[index], 9);
            }
            cells[index].innerText = "9";
            sudoku.values[index] = 9;
            break;

        case 58:
        case 106:
            if (record) {
                recordChange(index, sudoku.values[index], 10);
            }
            cells[index].innerText = "10";
            sudoku.values[index] = 10;
            break;
            
        default:
            return;
    }
    if (record) {
        let conflict = false;
        let finished = true;
        for (let i = 0; i < cells.length; i++) {
            if (!cells[i].innerText || [1,2,3,4,5,6,7,8,9,10].indexOf(cells[i].innerText) === -1) {
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
        caption.innerText = '(2,5)-Sudoku Pair Puzzle';
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
                if ([1,2,3,4,5,6,7,8,9,10].indexOf(vals[index]) > -1) {
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
                    if ([1,2,3,4,5,6,7,8,9,10].indexOf(vals[index]) > -1) {
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
        if ((event.keyCode >= 48 && event.keyCode <= 58) ||
            (event.keyCode >= 96 && event.keyCode <= 106) ||
            event.keyCode == 46 || event.keyCode == 12) { //0-10,del,backspace
            update(event.keyCode, selectedIndex);
        }
    });
    caption.innerText = "(2,5)-Sudoku Pair Puzzle";

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

    btn7.onclick = () => {
        update(7 + 48, selectedIndex);
    }

    btn8.onclick = () => {
        update(8 + 48, selectedIndex);
    }

    btn9.onclick = () => {
        update(9 + 48, selectedIndex);
    }

    btn10.onclick = () => {
        update(10 + 48, selectedIndex);
    }
}