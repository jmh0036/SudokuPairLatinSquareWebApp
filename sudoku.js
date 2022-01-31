//</script><script type="text/babel">
"use strict";
let TOTAL_CELLS = 81;
let caption = null;
let selectedIndex = null;
let defaultValues = [];
let cells = [];
let values = [];
let sudoku = null;
let undoes = [];
let redoes = [];
let puzzles = [
    "39..6.8.7.2..3..5......5.969..5.24.............39.7..281.6......3..5..8.5.2.9..43",
    "..8.5.49.4657....2.9.43.1656491..53...2.9......36......2...1.5.9...7..2.371..29..",
    "..5.9...1.....2.7376...82...12..9..4...2.3...3..1..96...19...5897.5.....5...3.7..",
    ".51..4....32.9......7..1..2....1.4..84..7..31..3.8....7..3..9......4.26....9..18.",
    "...26.7.168..7..9.19...45..82.1...4...46.29...5...3.28..93...74.4..5..367.3.18...",
    ".18..93.....4....8...3....95....2...28...56....9.....5..2.61..4.....48..6.3...2..",
    "....1.7.....3......6.758.1.2......47.81.......396..........9.51....21.3...5...4..",
    ".54..78...........2...6..514..17.38.......6...82......5....41.23...5.......71...6",
    "...9...5....3.5..9.5..7..1.795.6..8.....1....6.2...9..9.6...8..43.7.........8...7",
    "..6.....4...86.73..4.35...217.4..6...9.....8...8..6.172...81.4..67.43...8.....3..",
    "1...7..3.83.6.......29..6.86....49.7.9.....5.3.75....42.3..91.......2.43.4..8...9",
    "6......4...5..2..7729.....3.9..4...1....6....4...8..7.3.....1652..4..8...5......4",
    "1.36.47.9.2..9..1.7.......62.4.3.9.8.........5..9.7..16...5...2....7....9..8.2..5"
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
            []
        ];

        this.solve = () => {
            //Atleast 17 clues are needed to solve a sudoku
            if (this.values.filter(x => x === 0).length < 65) {
                this._values = [...this.values];
                for (let i = 0; i < this.values.length; i++) {
                    for (let j = 0; j < this.values.length; j++) {
                        if (this.sameCol(i, j) || this.sameRow(i, j) || this.sameCol(i, j)) {
                            if (this.values[i] && i !== j && this.values[i] === this.values[j]) {
                                if (defaultValues.length > 0) {
                                    if (defaultValues[i] !== this.values[i]) {
                                        showLog('Invalid Move');
                                        this.values[i] = 0;
                                    } else if (defaultValues[j] !== this.values[j]) {
                                        this.values[j] = 0;
                                        showLog('Invalid Move');
                                    } else {
                                        return false;
                                    }
                                } else {
                                    this.values[i] = 0;
                                }
                            }
                        }
                    }
                }
                if (this.values.filter(x => x === 0).length > 64) {
                    showLog("Insufficient Clues")
                    return false;
                }
                let changes = false;
                let exitLoop = false;
                this.array2Matrix(this.values, this.actual);
                for (let i = 0; i < this.possible.length; i++) {
                    this.possible[i] = ['', '', '', '', '', '', '', '', ''];
                }
                try {
                    do {
                        do {
                            do {
                                do {
                                    do {
                                        do {
                                            do {
                                                do {
                                                    do {
                                                        do {
                                                            changes = this.checkColumnAndRows();
                                                            if (this.isPuzzleSolved()) {
                                                                exitLoop = true;
                                                                break;
                                                            }
                                                        } while (changes);

                                                        if (exitLoop) break;

                                                        changes = this.lookForLoneRangersinBlocks();
                                                        if (this.isPuzzleSolved()) {
                                                            exitLoop = true;
                                                            break;
                                                        }
                                                    } while (changes);

                                                    if (exitLoop) break;

                                                    changes = this.lookForLoneRangersinRows();
                                                    if (this.isPuzzleSolved()) {
                                                        exitLoop = true;
                                                        break;
                                                    }
                                                } while (changes);

                                                if (exitLoop) break;

                                                changes = this.lookForLoneRangersinColumns();
                                                if (this.isPuzzleSolved()) {
                                                    exitLoop = true;
                                                    break;
                                                }
                                            } while (changes);


                                            if (exitLoop) break;
                                            changes = this.lookForTwinsInBlocks();
                                            if (this.isPuzzleSolved()) {
                                                exitLoop = true;
                                                break;
                                            }
                                        } while (changes);

                                        if (exitLoop) break;

                                        changes = this.lookForTwinsInRows();
                                        if (this.isPuzzleSolved()) {
                                            exitLoop = true;
                                            break;
                                        }
                                    } while (changes);

                                    if (exitLoop) break;

                                    changes = this.lookForTwinsInColumns();
                                    if (this.isPuzzleSolved()) {
                                        exitLoop = true;
                                        break;
                                    }
                                } while (changes);

                                if (exitLoop) break;

                                changes = this.lookForTripletsInBlocks();
                                if (this.isPuzzleSolved()) {
                                    exitLoop = true;
                                    break;
                                }
                            } while (changes);

                            if (exitLoop) break;

                            changes = this.lookForTripletsInRows();
                            if (this.isPuzzleSolved()) {
                                exitLoop = true;
                                break;
                            }
                        } while (changes);

                        if (exitLoop) break;

                        changes = this.lookForTripletsInColumns();
                        if (this.isPuzzleSolved()) {
                            exitLoop = true;
                            break;
                        }
                    } while (changes);

                } catch (ex) {
                    if (ex === 'Invalid Move') {
                        showLog("Puzzle not solved.")
                        this.array2Matrix(this._values, this.actual);
                    } else
                        throw ex;
                }

                this.matrix2Array(this.actual, this.values);

                if (this.isPuzzleSolved()) {
                    showLog("Puzzle solved.")
                    return true;
                }

                showLog('Solvig by brute force...');

                this._values = [...this.values];

                try {
                    this.solveSudokuByBruteForce(this._values);
                } catch (err) {
                    if (err === "Max Iterations") {
                        showLog('Max Iterations Error')
                        showLog("Puzzle not solved.")
                        return false;

                    } else throw err;
                }

                this.values = [...this._values];

                if (this.isPuzzleSolved(0)) {
                    showLog("Puzzle solved.")
                    return true;
                }
                showLog("Puzzle not solved.")
                return false;
            } else {
                showLog("Insufficient Clues")
                showLog("Can't solve the puzzle.")
                return false
            }
        };
    }

    matrix2Array(matrix, arr) {
        for (let i = 0; i < arr.length; i++) {
            arr[i] = matrix[parseInt(i % 9)][parseInt(i / 9)];
        }
    }

    array2Matrix(arr, matrix) {
        for (let i = 0; i < matrix.length; i++) {
            let r = 0;
            for (let j = 0; j < arr.length; j++) {
                if ((j % 9) === i) {
                    matrix[i][r] = arr[j];
                    r++;
                }
            }
        }
    }

    array2String(arr) {
        let str = '';
        for (let i = 0; i < arr.length; i++) {
            str += arr[i].toString();
        }
        return str;
    }

    string2Array(str, arr) {
        for (let i = 0; i < str.length; i++) {
            if (i < arr.length) {
                arr[i] = str[i];
            } else {
                arr.push(str[i]);
            }
        }
    }

    transposeArray(array, arrayLength) {
        var newArray = [];
        for (let i = 0; i < array.length; i++) {
            newArray.push([]);
        }

        for (let i = 0; i < array.length; i++) {
            for (let j = 0; j < arrayLength; j++) {
                newArray[j].push(array[i][j]);
            }
        }

        return newArray;
    }

    sameRow(i, j) {
        return parseInt(i / 9) === parseInt(j / 9);
    }
    sameCol(i, j) {
        return (i - j) % 9 === 0;
    }
    sameBlock(i, j) {
        return (parseInt(i / 27) === parseInt(j / 27) && parseInt(i % 9 / 3) === parseInt(j % 9 / 3));
    }

    calculatePossibleValues(col, row) {
        let str;
        if (this.possible[col][row] === '') {
            str = '123456789';
        } else str = this.possible[col][row];

        //check by column
        for (let r = 0; r < 9; r++) {
            if (this.actual[col][r] !== 0) {
                str = str.replace(this.actual[col][r].toString(), '');
            }

        }

        //check by row
        for (let c = 0; c < 9; c++) {
            if (this.actual[c][row] !== 0) {
                str = str.replace(this.actual[c][row].toString(), '');
            }

        }

        //check by block
        let startC = col - (col % 3);
        let startR = row - (row % 3);
        for (let rr = startR; rr <= startR + 2; rr++) {
            for (let cc = startC; cc <= startC + 2; cc++) {
                if (this.actual[cc][rr] !== 0) {
                    str = str.replace(this.actual[cc][rr].toString(), '');
                }
            }
        }

        //if possible value is empty then throw invalid move
        if (str === '') {
            throw 'Invalid Move';
        }
        return str;
    }

    checkColumnAndRows() {
        let changes = false;

        //check all cells
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.actual[col][row] === 0) {
                    try {
                        this.possible[col][row] = this.calculatePossibleValues(col, row);
                    } catch (ex) {
                        throw 'Invalid Move';
                    }
                    if (this.possible[col][row].length === 1) {
                        //the number is confirmed
                        this.actual[col][row] = parseInt(this.possible[col][row]);
                        changes = true;
                    }
                }
            }
        }
        return changes;
    }

    lookForLoneRangersinBlocks() {
        let changes = false;
        let nextBlock;
        let occurrence;
        let cPos, rPos;

        //check for numbers 1 to 9
        for (let n = 1; n < 10; n++) {

            //check the 9 blocks
            for (let r = 0; r < 9; r += 3) {
                for (let c = 0; c < 9; c += 3) {
                    nextBlock = false;

                    //check within  the block
                    occurrence = 0;
                    for (let rr = 0; rr < 3; rr++) {
                        for (let cc = 0; cc < 3; cc++) {
                            if (this.actual[c + cc][r + rr] === 0 && this.possible[c + cc][r + rr].length > 0 && this.possible[c + cc][r + rr].indexOf(n.toString()) > -1) {
                                occurrence++;
                                cPos = c + cc;
                                rPos = r + rr;
                                if (occurrence > 1) {
                                    nextBlock = true;
                                    break;
                                }
                            }
                        }
                        if (nextBlock) break;
                    }
                    if (!nextBlock && occurrence === 1) {
                        //the number confirmed
                        this.actual[cPos][rPos] = n;
                        changes = true;
                    }
                }

            }

        }
        return changes;
    }

    lookForLoneRangersinRows() {
        let changes = false;
        let occurrence;
        let cPos, rPos;

        //check by row
        for (let r = 0; r < 9; r++) {
            for (let n = 1; n < 10; n++) {
                occurrence = 0;
                for (let c = 0; c < 9; c++) {
                    if (this.actual[c][r] === 0 && this.possible[c][r].length > 0 && this.possible[c][r].indexOf(n.toString()) > -1) {
                        occurrence++;

                        //if multiple occurrences, not a  lone ranger anymore
                        if (occurrence > 1) break;
                        cPos = c;
                        rPos = r;
                    }
                }
                if (occurrence === 1) {
                    //number is confirmed
                    //console.log(cPos, rPos, n);
                    this.actual[cPos][rPos] = n;
                    changes = true;
                }
            }
        }
        return changes;
    }

    lookForTwinsInBlocks() {
        let changes = false;

        //look for twins in each cell
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                //if two possible values, check for twins
                if (this.actual[c][r] === 0 && this.possible[c][r].length === 2) {

                    //scan by the block that the current cell is in
                    let startC = c - (c % 3);
                    let startR = r - (r % 3);

                    for (let rr = startR; rr < startR + 3; rr++) {
                        for (let cc = startC; cc < startC + 3; cc++) {

                            //for cells other than the pair of twins
                            if (!(cc === c && rr === r) && this.possible[cc][rr] === this.possible[c][r]) {

                                //twins found, remove the twins from all the other possible values in the block
                                for (let rrr = startR; rrr < startR + 3; rrr++) {
                                    for (let ccc = startC; ccc < startC + 3; ccc++) {

                                        //only check for empty cells
                                        if (this.actual[ccc][rrr] === 0 && this.possible[ccc][rrr] !== this.possible[c][r]) {

                                            //save a copy of the original possible value (twins)
                                            let original_possible = this.possible[ccc][rrr];

                                            //remove first twin number from possible values
                                            this.possible[ccc][rrr] = this.possible[ccc][rrr].replace(this.possible[c][r][0], '');

                                            //remove second twin number from possible values
                                            this.possible[ccc][rrr] = this.possible[ccc][rrr].replace(this.possible[c][r][1], '');

                                            //if the possible values are modified then set the change variable to true
                                            if (original_possible !== this.possible[ccc][rrr]) {
                                                showLog('lookForTwinsInBlocks possibles changed:', ccc, rrr);
                                                changes = true;
                                            }

                                            //if possible values reduced to empty string, then user placed a wrong move
                                            if (this.possible[ccc][rrr] === '')
                                                throw 'Invalid Move';

                                            //if left with 1 possible value for current cell, cell is confirmed
                                            if (this.possible[ccc][rrr].length === 1) {
                                                showLog('lookForTwinsInBlocks confirmed:', ccc, rrr);
                                                this.actual[ccc][rrr] = parseInt(this.possible[ccc][rrr]);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

        }
        return changes;
    }

    lookForTwinsInRows() {
        let changes = false;

        //for each row,check each column in the row
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {

                //if two possible values, check for twins
                if (this.actual[c][r] === 0 && this.possible[c][r].length === 2) {

                    //scans columns in this row
                    for (let cc = c + 1; cc < 9; cc++) {

                        if (this.possible[cc][r] === this.possible[c][r]) {

                            //twin found, remove the twins from all the other possible values in the column
                            for (let ccc = 0; ccc < 9; ccc++) {

                                //only check for empty cells
                                if (this.actual[ccc][r] === 0 && ccc !== c && ccc !== cc) {

                                    //save a copy of the original possible value (twins)
                                    let original_possible = this.possible[ccc][r];

                                    //remove first twin number from possible values
                                    this.possible[ccc][r] = this.possible[ccc][r].replace(this.possible[c][r][0], '');

                                    //remove second twin number from possible values
                                    this.possible[ccc][r] = this.possible[ccc][r].replace(this.possible[c][r][1], '');

                                    //if the possible values are modified then set the change variable to true
                                    if (original_possible !== this.possible[ccc][r]) {
                                        showLog('lookForTwinsInRows possibles changed:', ccc, r);
                                        changes = true;
                                    }

                                    //if possible values reduced to empty string, then user placed a wrong move
                                    if (this.possible[ccc][r] === '')
                                        throw 'Invalid Move';

                                    //if left with 1 possible value for current cell, cell is confirmed
                                    if (this.possible[ccc][r].length === 1) {
                                        showLog('lookForTwinsInRows confirmed:', ccc, r);
                                        this.actual[ccc][r] = parseInt(this.possible[ccc][r]);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return changes;
    }

    lookForTwinsInColumns() {
        let changes = false;

        //for each row,check each column in the column
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {

                //if two possible values, check for twins
                if (this.actual[c][r] === 0 && this.possible[c][r].length === 2) {

                    //scans rows in this column
                    for (let rr = r + 1; rr < 9; rr++) {

                        if (this.possible[c][rr] === this.possible[c][r]) {

                            //twin found, remove the twins from all the other possible values in the column
                            for (let rrr = 0; rrr < 9; rrr++) {

                                if (this.actual[c][rrr] === 0 && rrr !== r && rrr !== rr) {

                                    //save a copy of the original possible value (twins)
                                    let original_possible = this.possible[c][rrr];

                                    //remove first twin number from possible values
                                    this.possible[c][rrr] = this.possible[c][rrr].replace(this.possible[c][r][0], '');

                                    //remove second twin number from possible values
                                    this.possible[c][rrr] = this.possible[c][rrr].replace(this.possible[c][r][1], '');

                                    //if the possible values are modified then set the change variable to true
                                    if (original_possible !== this.possible[c][rrr]) {
                                        showLog('lookForTwinsInColumns possibles changed:', c, rrr);
                                        changes = true;
                                    }

                                    //if possible values reduced to empty string, then user placed a wrong move
                                    if (this.possible[c][rrr] === '')
                                        throw 'Invalid Move';

                                    //if left with 1 possible value for current cell, cell is confirmed
                                    if (this.possible[c][rrr].length === 1) {
                                        showLog('lookForTwinsInColumns confirmed:', c, rrr);
                                        this.actual[c][rrr] = parseInt(this.possible[c][rrr]);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return changes;
    }

    lookForTripletsInBlocks() {
        let changes = false;

        //check each cell
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {

                //three possible values; check for triplets
                if (this.actual[c][r] === 0 && this.possible[c][r].length === 3) {

                    //first potential triplet found
                    let tripletslocation = `${c}${r}`;

                    //scan by block
                    let startC = c - (c % 3);
                    let startR = r - (r % 3);

                    for (let rr = startR; rr < startR + 3; rr++) {
                        for (let cc = startC; cc < startC + 3; cc++) {
                            if (!(cc === c && rr === r) &&
                                ((this.possible[cc][rr] === this.possible[c][r]) ||
                                    (this.possible[cc][rr].length === 2 &&
                                        this.possible[c][r].indexOf(this.possible[cc][rr][0].toString()) > -1 &&
                                        this.possible[c][r].indexOf(this.possible[cc][rr][1].toString()) > -1))) {

                                //save the coordinates of the triplets
                                tripletslocation += `${cc}${rr}`;
                            }
                        }
                    }

                    //found 3 cells as triplets; remove all from other cells
                    if (tripletslocation.length === 6) {

                        //triplets found, remove each cell's possible values containing rhe triplet
                        for (let rrr = startR; rrr < startR + 3; rrr++) {
                            for (let ccc = startC; ccc < startC + 3; ccc++) {

                                //look for the cell that is not part of the 3 cells found
                                if (this.actual[ccc][rrr] === 0 &&
                                    ccc !== parseInt(tripletslocation[0].toString()) &&
                                    rrr !== parseInt(tripletslocation[1].toString()) &&
                                    ccc !== parseInt(tripletslocation[2].toString()) &&
                                    rrr !== parseInt(tripletslocation[3].toString()) &&
                                    ccc !== parseInt(tripletslocation[4].toString()) &&
                                    rrr !== parseInt(tripletslocation[5].toString())) {

                                    //save the original possible values
                                    let original_possible = this.possible[ccc][rrr];

                                    //remove first triplet number from possible values
                                    this.possible[ccc][rrr] = this.possible[ccc][rrr].replace(this.possible[c][r][0], '');

                                    //remove second triplet number from possible values
                                    this.possible[ccc][rrr] = this.possible[ccc][rrr].replace(this.possible[c][r][1], '');

                                    //remove third triplet number from possible values
                                    this.possible[ccc][rrr] = this.possible[ccc][rrr].replace(this.possible[c][r][2], '');

                                    //if the possible values are modified then set the change variable to true
                                    if (original_possible !== this.possible[ccc][rrr]) {
                                        showLog('lookForTripletsInBlocks possibles changed:', ccc, rrr);
                                        changes = true;
                                    }

                                    //if possible values reduced to empty string, then user placed a wrong move
                                    if (this.possible[ccc][rrr] === '')
                                        throw 'Invalid Move';

                                    //if left with 1 possible value for current cell, cell is confirmed
                                    if (this.possible[ccc][rrr].length === 1) {
                                        showLog('lookForTripletsInBlocks confirmed:', ccc, rrr);
                                        this.actual[ccc][rrr] = parseInt(this.possible[ccc][rrr]);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return changes;
    }

    lookForTripletsInRows() {
        let changes = false;

        //check each cell
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {

                //three possible values; check for triplets
                if (this.actual[c][r] === 0 && this.possible[c][r].length === 3) {

                    //first potential triplet found
                    let tripletslocation = `${c}${r}`;

                    //scan columns in this row
                    for (let cc = 0; cc < 9; cc++) {
                        if ((cc !== c) &&
                            ((this.possible[cc][r] === this.possible[c][r]) ||
                                (this.possible[cc][r].length === 2 &&
                                    this.possible[c][r].indexOf(this.possible[cc][r][0].toString()) > -1 &&
                                    this.possible[c][r].indexOf(this.possible[cc][r][1].toString()) > -1))) {

                            //save the coordinates of the triplets
                            tripletslocation += `${cc}${r}`;
                        }
                    }

                    //found 3 cells as triplets; remove all from other cells
                    if (tripletslocation.length === 6) {

                        //triplets found, remove each cell's possible values containing rhe triplet
                        for (let ccc = 0; ccc < 9; ccc++) {

                            //look for the cell that is not part of the 3 cells found
                            if (this.actual[ccc][r] === 0 &&
                                ccc !== parseInt(tripletslocation[0].toString()) &&
                                ccc !== parseInt(tripletslocation[2].toString()) &&
                                ccc !== parseInt(tripletslocation[4].toString())) {

                                //save the original possible values
                                let original_possible = this.possible[ccc][r];

                                //remove first triplet number from possible values
                                this.possible[ccc][r] = this.possible[ccc][r].replace(this.possible[c][r][0], '');

                                //remove second triplet number from possible values
                                this.possible[ccc][r] = this.possible[ccc][r].replace(this.possible[c][r][1], '');

                                //remove third triplet number from possible values
                                this.possible[ccc][r] = this.possible[ccc][r].replace(this.possible[c][r][2], '');

                                //if the possible values are modified then set the change variable to true
                                if (original_possible !== this.possible[ccc][r]) {
                                    showLog('lookForTripletsInRows possibles changed:', ccc, r);
                                    changes = true;
                                }

                                //if possible values reduced to empty string, then user placed a wrong move
                                if (this.possible[ccc][r] === '')
                                    throw 'Invalid Move';

                                //if left with 1 possible value for current cell, cell is confirmed
                                if (this.possible[ccc][r].length === 1) {
                                    showLog('lookForTripletsInRows confirmed:', ccc, r);
                                    this.actual[ccc][r] = parseInt(this.possible[ccc][r]);
                                }
                            }
                        }
                    }
                }
            }
        }
        return changes;
    }

    lookForTripletsInColumns() {
        let changes = false;

        //check each cell
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {

                //three possible values; check for triplets
                if (this.actual[c][r] === 0 && this.possible[c][r].length === 3) {

                    //first potential triplet found
                    let tripletslocation = `${c}${r}`;

                    //scan rows in this column
                    for (let rr = 0; rr < 9; rr++) {
                        if ((rr !== r) &&
                            ((this.possible[c][rr] === this.possible[c][r]) ||
                                (this.possible[c][rr].length === 2 &&
                                    this.possible[c][r].indexOf(this.possible[c][rr][0].toString()) > -1 &&
                                    this.possible[c][r].indexOf(this.possible[c][rr][1].toString()) > -1))) {

                            //save the coordinates of the triplets
                            tripletslocation += `${c}${rr}`;
                        }
                    }

                    //found 3 cells as triplets; remove all from other cells
                    if (tripletslocation.length === 6) {

                        //triplets found, remove each cell's possible values containing rhe triplet
                        for (let rrr = 0; rrr < 9; rrr++) {

                            //look for the cell that is not part of the 3 cells found
                            if (this.actual[c][rrr] === 0 &&
                                rrr !== parseInt(tripletslocation[1].toString()) &&
                                rrr !== parseInt(tripletslocation[3].toString()) &&
                                rrr !== parseInt(tripletslocation[5].toString())) {

                                //save the original possible values
                                let original_possible = this.possible[c][rrr];

                                //remove first triplet number from possible values
                                this.possible[c][rrr] = this.possible[c][rrr].replace(this.possible[c][r][0], '');

                                //remove second triplet number from possible values
                                this.possible[c][rrr] = this.possible[c][rrr].replace(this.possible[c][r][1], '');

                                //remove third triplet number from possible values
                                this.possible[c][rrr] = this.possible[c][rrr].replace(this.possible[c][r][2], '');

                                //if the possible values are modified then set the change variable to true
                                if (original_possible !== this.possible[c][rrr]) {
                                    showLog('lookForTripletsInColumns possibles changed:', c, rrr);
                                    changes = true;
                                }

                                //if possible values reduced to empty string, then user placed a wrong move
                                if (this.possible[c][rrr] === '')
                                    throw 'Invalid Move';

                                //if left with 1 possible value for current cell, cell is confirmed
                                if (this.possible[c][rrr].length === 1) {
                                    showLog('lookForTripletsInColumns confirmed:', c, rrr);
                                    this.actual[c][rrr] = parseInt(this.possible[c][rrr]);
                                }
                            }
                        }
                    }
                }
            }
        }
        return changes;
    }


    lookForLoneRangersinColumns() {
        let changes = false;
        let occurrence;
        let cPos, rPos;

        //check by column
        for (let c = 0; c < 9; c++) {
            for (let n = 1; n < 10; n++) {
                occurrence = 0;
                for (let r = 0; r < 9; r++) {
                    if (this.actual[c][r] === 0 && this.possible[c][r].length > 0 && this.possible[c][r].indexOf(n.toString()) > -1) {
                        occurrence++;

                        //if multiple occurrences, not a  lone ranger anymore
                        if (occurrence > 1) break;
                        cPos = c;
                        rPos = r;
                    }
                }
                if (occurrence === 1) {
                    //number is confirmed
                    this.actual[cPos][rPos] = n;
                    changes = true;
                }
            }
        }
        return changes;
    }

    isPuzzleSolved(m = 1) {
        if (m) {
            for (let c = 0; c < 9; c++) {
                if (this.actual[c].indexOf(0) !== -1) return false;
            }
            return true;
        } else {
            let isSolved = true;
            if (this._values.length === this.values.length) {
                for (let j = 0; j < this._values.length; j++) {
                    if (!isSolved) {
                        break;
                    }
                    if (this._values[j] > 0) {
                        for (let k = 0; k < this._values.length; k++) {
                            if (j !== k) {
                                if (this.sameRow(j, k) || this.sameCol(j, k) || this.sameBlock(j, k)) {
                                    if (this._values[j] === this._values[k]) {
                                        isSolved = false;
                                        break;
                                    }
                                }
                            }
                        }
                    } else {
                        isSolved = false;
                        break;
                    }
                }
            } else {
                isSolved = false;
            }
            return isSolved;
        }
    }

    solveSudokuByBruteForce(v) {
        if (typeof this.solveSudokuByBruteForce.iters === 'undefined')
            this.solveSudokuByBruteForce.iters = 1;
        else {
            if (this.solveSudokuByBruteForce.iters > 99999) {
                this.solveSudokuByBruteForce.iters = undefined;
                throw "Max Iterations";
            }
            this.solveSudokuByBruteForce.iters++;
        }
        let i = v.indexOf(0);
        if (i === -1) {
            this._values = v;
            return;
        }
        let excludedNumbers = [];
        for (let j = 0; j < this.values.length; j++) {
            if (this.sameRow(i, j) || this.sameCol(i, j) || this.sameBlock(i, j)) {
                if (excludedNumbers.indexOf(v[j]) === -1) {
                    excludedNumbers.push(v[j]);
                }
            }
        }
        for (let m of '123456789') {
            if (excludedNumbers.indexOf(parseInt(m)) === -1) {
                v = v.slice(0, i).concat(parseInt(m), v.slice(i + 1, v.length));
                this.solveSudokuByBruteForce(v);
            }
        }
    }
}

const solve = () => {
    if (verbose) {
        console.clear();
    }
    let start = performance.now();
    let solved = false
    solved = sudoku.solve();
    if (!solved && defaultValues.length > 0) {
        showLog("Retrying with the default values...")
        let values = [];
        for (let i of defaultValues) {
            values.push(i);
        }
        let s = new Sudoku(values);
        solved = s.solve();
        if (solved) {
            sudoku.values = s.values;
        }
    }
    let end = performance.now();
    for (let i = 0; i < cells.length; i++) {
        if (sudoku.values[i]) {
            cells[i].innerText = sudoku.values[i];
        } else {
            cells[i].innerText = '';
        }
        cells[i].style.backgroundColor = "white";
    }
    undoes = [];
    redoes = [];
    selectedIndex = null;
    let duration = (end - start).toFixed(0);
    if (solved) {
        caption.innerText = `Solved in ${duration} ms`;
    }
}

const select = index => {
    if (selectedIndex !== index) {
        if (cells[index].innerText) {
            let conflict = false;
            for (let i = 0; i < cells.length; i++) {
                if (i !== index) {
                    if (sudoku.sameRow(i, index) || sudoku.sameCol(i, index) || sudoku.sameBlock(i, index)) {
                        if (cells[i].innerText === cells[index].innerText) {
                            cells[index].style.backgroundColor = "red";
                            conflict = true;
                            break;
                        }
                    }
                }
            }
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
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        if (index !== null && (cells[index].style.fontWeight === 'normal' || isCleared())) {
            let num = prompt("Please enter an integer between 0 and 9", cells[selectedIndex].innerText);
            if (num !== null) {
                num = num.replace(/\s/g, "");
                if (num === '') {
                    num = '0';
                }
                if ('0123456789'.indexOf(num) > -1) {
                    update(parseInt(num) + 48, selectedIndex);
                }
            }
        }
    }
}

const normalize = n => {
    return n > 9 ? "" + n : "0" + n;
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
    }
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
            caption.innerText = 'Sudoku';
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
        default:
            return;
    }
    if (record) {
        let conflict = false;
        let finished = true;
        for (let i = 0; i < cells.length; i++) {
            if (!cells[i].innerText || '123456789'.indexOf(cells[i].innerText) === -1) {
                finished = false;
            }
            if (i !== index) {
                if (sudoku.sameRow(i, index) || sudoku.sameCol(i, index) || sudoku.sameBlock(i, index)) {
                    if (cells[i].innerText === cells[index].innerText) {
                        cells[index].style.backgroundColor = "red";
                        conflict = true;
                        break;
                    }
                }
            }
        }
        if (!conflict) {
            if (finished) {
                solved = true;
                for (let i = 0; i < cells.length; i++) {
                    if (!solved) {
                        break;
                    }
                    for (let j = 0; j < cells.length; j++) {
                        if (i != j) {
                            if (sudoku.sameRow(i, j) || sudoku.sameCol(i, j) || sudoku.sameBlock(i, j)) {
                                if (sudoku.values[i] === sudoku.values[j]) {
                                    solved = false;
                                    break;
                                }
                            }
                        }
                    }
                }
                if (solved) {
                    caption.innerText = 'Sudoku Solved.'
                    cells[index].style.backgroundColor = "green";
                }
            } else {
                cells[index].style.backgroundColor = "green";
            }
        }
    } else {
        cells[index].style.backgroundColor = "white";
        selectedIndex = null;
    }
    if (!solved) {
        caption.innerText = 'Sudoku';
    }
}

const clear = () => {
    for (let i = 0; i < cells.length; i++) {
        sudoku.values[i] = 0;
        cells[i].innerText = '';
        cells[i].style.fontWeight = "bold";
    }
    if (selectedIndex !== null) {
        cells[selectedIndex].style.backgroundColor = "white";
    }
    selectedIndex = null;
    caption.innerText = "Sudoku";
    defaultValues = [];
    undoes = [];
    redoes = [];
}

const reset = () => {
    if (defaultValues.length > 0) {
        for (let i = 0; i < defaultValues.length; i++) {
            if (defaultValues[i]) {
                cells[i].innerText = defaultValues[i];
                cells[i].style.fontWeight = "bold";
            } else {
                cells[i].innerText = '';
                cells[i].style.fontWeight = "normal";
            }
            sudoku.values[i] = defaultValues[i];
        }
        if (selectedIndex !== null) {
            cells[selectedIndex].style.backgroundColor = "white";
        }
        selectedIndex = null;
        caption.innerText = "Sudoku";
    } else {
        clear();
    }
    undoes = [];
    redoes = [];
}

const loadString = s => {
    let content = s.replace(/\s/g, "");
    let values = [];
    let isBold = true;
    for (let i = 0; i < content.length; i++) {
        if ('1234567890.*'.indexOf(content[i] > -1)) {
            if (values.length === cells.length)
                break;
            switch (content[i]) {
                case '0':
                case '.':
                    values.push(0);
                    isBold = true;
                    break;
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    if (isBold) {
                        values.push(parseInt(content[i]));
                    } else {
                        values.push(parseInt(content[i]) * -1);
                        isBold = true;
                    }
                    break;
                case '*':
                    isBold = false;
                    break;
                default:
                    alert("The file format is incorrect.");
                    return;
            }
        } else {
            alert("The file format is incorrect.");
            return;
        }
    }
    for (let i = 0; i < values.length; i++) {
        if (i === cells.length)
            break;
        sudoku.values[i] = Math.abs(values[i])
        if (values[i] > 0) {
            cells[i].style.fontWeight = "bold";
            defaultValues[i] = sudoku.values[i];
        } else {
            cells[i].style.fontWeight = "normal";
            defaultValues[i] = 0;
        }
        cells[i].style.backgroundColor = "white";
        if (sudoku.values[i]) {
            cells[i].innerText = sudoku.values[i];
        } else {
            cells[i].innerText = '';
        }
    }
    if (values.length < cells.length) {
        for (let i = values.length; i < cells.length; i++) {
            cells[i].style.fontWeight = "normal";
            sudoku.values[i] = 0;
            defaultValues[i] = 0;
            cells[i].innerText = '';
        }
    }
    undoes = [];
    redoes = [];
    caption.innerText = 'Sudoku';
}

const saveString = () => {
    let str = "";
    for (let i = 0; i < cells.length; i++) {
        if (cells[i].innerText && cells[i].style.fontWeight === 'bold') {
            str += cells[i].innerText;
        } else {
            if (cells[i].innerText) {
                str += `*${cells[i].innerText}`;
            } else {
                str += "*0";
            }
        }
        if (i < cells.length - 1 && (i + 1) % 9 === 0) {
            str += `
`;
        }
    }
    return str;
}

const readFile = e => {
    let file = e.files[0];
    if (!file) {
        return;
    }
    let reader = new FileReader();
    reader.onload = e => {
        let content = e.target.result;
        loadString(content);
    };
    reader.readAsText(file, 'utf-8');
}

const loadSudoku = () => {
    let input = document.createElement('input');
    input.type = 'file';
    input.click();
    input.onchange = () => {
        readFile(input);
    }
}

const savefile = (filename, data) => {
    let blob = new Blob([data], {
        type: 'text/csv'
    });
    if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, filename);
    } else {
        let elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = filename;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
        URL.revokeObjectURL(elem);
    }
}

const saveSudoku = () => {
    savefile('sudoku.txt', saveString());
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

const genModifiedPuzzles = () => {
    //create new puzzles by modifying existing puzzles
    let mtx = [
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
    let arr = [];
    let s = '';
    let arr2 = new Array(TOTAL_CELLS);
    for (let i = 0; i < puzzles.length; i++) {
        s = puzzles[i];
        s = s.split("").reverse().join("");
        if (puzzles.indexOf(s) === -1) {
            puzzles.push(s);
        }
        sudoku.string2Array(puzzles[i], arr);
        sudoku.array2Matrix(arr, mtx);
        let mtx2 = sudoku.transposeArray(mtx, mtx.length);
        sudoku.matrix2Array(mtx2, arr2);
        s = sudoku.array2String(arr2);
        if (puzzles.indexOf(s) === -1) {
            puzzles.push(s);
        }
        mtx2 = [
            mtx[6], mtx[7], mtx[8],
            mtx[3], mtx[4], mtx[5],
            mtx[0], mtx[1], mtx[2]
        ];
        sudoku.matrix2Array(mtx2, arr2);
        s = sudoku.array2String(arr2);
        if (puzzles.indexOf(s) === -1) {
            puzzles.push(s);
        }
    }
}

const newSudoku = () => {
    let puzzle = [];
    let str = saveString();
    str = str.replace(/\*\d/g, '.').replace(/\s/g, '');
    let currentIndex = puzzles.indexOf(str);
    let currentPuzzle = '';
    if (currentIndex > -1) {
        currentPuzzle = puzzles[currentIndex];
        puzzles.splice(currentIndex, 1);
    }
    puzzle = puzzles[Math.round(Math.random(0, 1) * (puzzles.length - 1))];
    loadString(puzzle);
    if (currentPuzzle !== '') {
        puzzles.push(currentPuzzle);
    }
}

window.onload = () => {
    let table = document.getElementsByTagName("table")[0];
    let solveButton = document.getElementById('btnSolve');
    let clearButton = document.getElementById('btnClear');
    let resetButton = document.getElementById('btnReset');
    let loadButton = document.getElementById('btnLoad');
    let saveButton = document.getElementById('btnSave');
    let undoButton = document.getElementById('btnUndo');
    let redoButton = document.getElementById('btnRedo');
    let newButton = document.getElementById('btnNew');
    let tbodies = table.getElementsByTagName("tbody");
    caption = table.getElementsByTagName("caption")[0];
    
    sudoku = new Sudoku(values);
    genModifiedPuzzles();
    let vals = puzzles[Math.round((Math.random(0, 1) * (puzzles.length - 1)))];
    let index = 0;
    
    for (let tbody of tbodies) {
        let trs = tbody.getElementsByTagName("tr");
        for (let tr of trs) {
            let tds = tr.getElementsByTagName("td");
            for (let td of tds) {
                if ('123456789'.indexOf(vals[index]) > -1) {
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

    solveButton.onclick = () => {
        solve();
    }

    clearButton.onclick = () => {
        clear();
    }
    resetButton.onclick = () => {
        reset();
    }
    loadButton.onclick = () => {
        loadSudoku();
    }
    saveButton.onclick = () => {
        saveSudoku();
    }
    undoButton.onclick = () => {
        undo();
    }
    redoButton.onclick = () => {
        redo();
    }
    newButton.onclick = () => {
        newSudoku();
    }
    for (let i = 0; i < cells.length; i++)
        cells[i].onclick = () => {
            select(i);
        }

    document.addEventListener('keydown', (event) => {
        if ((event.keyCode >= 48 && event.keyCode <= 57) ||
            (event.keyCode >= 96 && event.keyCode <= 105) ||
            event.keyCode == 46 || event.keyCode == 8) { //0-9,del,backspace
            update(event.keyCode, selectedIndex);
        }
    });
    caption.innerText = "Sudoku";
}