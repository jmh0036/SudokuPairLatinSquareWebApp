// To compile: g++ -static-libgcc -static-libstdc++ .\23PuzzleMaker.cpp -o 26SolutionSet.exe
// .\26SolutionSet.exe

// On Linux: c++ 23PuzzleMakerMinClue.cpp -o 23Solver.o
// Next line: ./23Solver.o

#include <iostream>
#include <cmath>
#include <cstdlib>
#include <string>
#include <ctime>

using namespace std;

// Define the order of the SPLS$(a,b)$, where SIZE = $a \times b$
#define SIZE 9
#define a 3
#define b 3
// #define fp2 3
// #define fp3 4

const int SIZE_SQUARED = SIZE * SIZE;
const int ROW_NB = SIZE * SIZE * SIZE;
const int intCount = 3;                // Number of Factors (Factor Pairs)
const int COL_NB = (intCount + 1) * SIZE * SIZE; // +1 for one symbol in each cell

#define MAX_K 1000
#define block(r, c, i) (FParray[i][0] * ((r) / FParray[i][0]) + ((c) / FParray[i][1]))

struct Node
{

    Node *left;
    Node *right;
    Node *up;
    Node *down;
    Node *head;

    int size;     //used for Column header
    int rowID[3]; //used to identify row in order to map solutions to a sudoku grid
                  //ID Format: (Candidate, Row, Column)
};

struct Node Head;
struct Node *HeadNode = &Head;
struct Node *solution[MAX_K];
struct Node *orig_values[MAX_K];
bool matrix[ROW_NB][COL_NB] = {{0}};
bool isSolved = false;
bool isSolvedN = false;
void MapSolutionToGrid(int Sudoku[][SIZE]);
void PrintGrid(int Sudoku[][SIZE]);

clock_t timer, timer2;

int NumberOfSolutions = 0;

//===============================================================================================================//
//---------------------------------------------DLX Functions-----------------------------------------------------//
//===============================================================================================================//

void coverColumn(Node *col)
{
    col->left->right = col->right;
    col->right->left = col->left;
    for (Node *node = col->down; node != col; node = node->down)
    {
        for (Node *temp = node->right; temp != node; temp = temp->right)
        {
            temp->down->up = temp->up;
            temp->up->down = temp->down;
            temp->head->size--;
        }
    }
}

void uncoverColumn(Node *col)
{
    for (Node *node = col->up; node != col; node = node->up)
    {
        for (Node *temp = node->left; temp != node; temp = temp->left)
        {
            temp->head->size++;
            temp->down->up = temp;
            temp->up->down = temp;
        }
    }
    col->left->right = col;
    col->right->left = col;
}

void search(int k, int *counter)
{
    *counter = *counter + 1;
    //cout << *counter << endl;
    
    // maybe 2500000 can be brought down to 1200000 or even lower.
    if (*counter > 2500000)
    {
        cout << "Heuristic taking too long, scrapping attempt (code 1)" << endl;
        return;
    }

    if (NumberOfSolutions > 1)
    {
        return;
    }

    if (HeadNode->right == HeadNode)
    {
        timer2 = clock() - timer;
        int Grid[SIZE][SIZE] = {{0}};
        MapSolutionToGrid(Grid);
        NumberOfSolutions++;
        if (NumberOfSolutions > 1)
        {
            return;
        }
        // PrintGrid(Grid);
        // cout << "Time Elapsed: " << (float)timer2 / CLOCKS_PER_SEC << " seconds.\n\n";
        // cin.get(); //Pause console
        timer = clock();
        isSolved = true;
        return;
    }

    if (NumberOfSolutions > 1)
    {
        return;
    }

    //Choose Column Object Deterministically: Choose the column with the smallest Size
    Node *Col = HeadNode->right;
    int counter2 = 0;
    for (Node *temp = Col->right; temp != HeadNode; temp = temp->right)
    {
        if (counter2 > 10000)
        {
            cout << "Heuristic taking too long, scrapping attempt (code 2)" << endl;
            return;
        }
        //cout << "For1" << endl;
        if (temp->size < Col->size)
        {
            Col = temp;
        }

        counter2++;
    }

    coverColumn(Col);

    for (Node *temp = Col->down; temp != Col; temp = temp->down)
    {
        //cout << "For2" << endl;
        solution[k] = temp;
        for (Node *node = temp->right; node != temp; node = node->right)
        {
            coverColumn(node->head);
        }

        search(k + 1, counter);

        temp = solution[k];
        solution[k] = NULL;
        Col = temp->head;
        for (Node *node = temp->left; node != temp; node = node->left)
        {
            uncoverColumn(node->head);
        }
    }

    uncoverColumn(Col);
}

void searchN(int k) {

    if (HeadNode->right == HeadNode) {
        timer2 = clock() - timer;
        int Grid[SIZE][SIZE] = { {0} };
        MapSolutionToGrid(Grid);
        NumberOfSolutions++;
        PrintGrid(Grid);
        // cout << "Time Elapsed: " << (float)timer2 / CLOCKS_PER_SEC << " seconds.\n\n";
        // cin.get(); //Pause console
        timer = clock();
        isSolvedN = true;
        return;
    }

    //Choose Column Object Deterministically: Choose the column with the smallest Size
    Node* Col = HeadNode->right;
    for (Node* temp = Col->right; temp != HeadNode; temp = temp->right)
        if (temp->size < Col->size)
            Col = temp;

    coverColumn(Col);

    for (Node* temp = Col->down; temp != Col; temp = temp->down) {
        solution[k] = temp;
        for (Node* node = temp->right; node != temp; node = node->right) {
            coverColumn(node->head);
        }

        searchN(k + 1);

        temp = solution[k];
        solution[k] = NULL;
        Col = temp->head;
        for (Node* node = temp->left; node != temp; node = node->left) {
            uncoverColumn(node->head);
        }
    }

    uncoverColumn(Col);
}

//===============================================================================================================//
//----------------------Functions to turn a Sudoku grid into an Exact Cover problem -----------------------------//
//===============================================================================================================//

//--------------------------BUILD THE INITIAL MATRIX CONTAINING ALL POSSIBILITIES--------------------------------//
void BuildSparseMatrix(bool matrix[ROW_NB][COL_NB])
{
    // Calculates the factor Pairs.
    int FParray[intCount][2];

    FParray[0][0] = 1;
    FParray[0][1] = SIZE;
    FParray[1][0] = SIZE;
    FParray[1][1] = 1;

    FParray[2][0] = a;
    FParray[2][1] = b;
    // FParray[3][0] = b;
    // FParray[3][1] = a;

    // FParray[4][0] = fp2;
    // FParray[4][1] = fp3;

    for (int row = 0, r = 0; r < SIZE; r++)
    {
        for (int c = 0; c < SIZE; c++)
        {
            for (int i = 0; i < SIZE; i++, row++)
            {
                //uniqueness constraint
                matrix[row][r + SIZE * c] = 1;
                //Factor Pair constraint (including Row & column)
                for (int pair = 0; pair < intCount; pair++)
                {
                    matrix[row][(pair + 1) * (SIZE * SIZE) + i + SIZE * (block(r, c, pair))] = 1;
                }
            }
        }
    }
}

//-------------------BUILD A TOROIDAL DOUBLY LINKED LIST OUT OF THE SPARSE MATRIX-------------------------//
void BuildLinkedList(bool matrix[ROW_NB][COL_NB])
{

    Node *header = new Node;
    header->left = header;
    header->right = header;
    header->down = header;
    header->up = header;
    header->size = -1;
    header->head = header;
    Node *temp = header;

    //Create all Column Nodes
    for (int i = 0; i < COL_NB; i++)
    {
        Node *newNode = new Node;
        newNode->size = 0;
        newNode->up = newNode;
        newNode->down = newNode;
        newNode->head = newNode;
        newNode->right = header;
        newNode->left = temp;
        temp->right = newNode;
        temp = newNode;
    }

    int ID[3] = {0, 1, 1};
    //Add a Node for each 1 present in the sparse matrix and update Column Nodes accordingly
    for (int i = 0; i < ROW_NB; i++)
    {
        Node *top = header->right;
        Node *prev = NULL;

        if (i != 0 && i % SIZE_SQUARED == 0)
        {
            ID[0] -= SIZE - 1;
            ID[1]++;
            ID[2] -= SIZE - 1;
        }
        else if (i != 0 && i % SIZE == 0)
        {
            ID[0] -= SIZE - 1;
            ID[2]++;
        }
        else
        {
            ID[0]++;
        }

        for (int j = 0; j < COL_NB; j++, top = top->right)
        {
            if (matrix[i][j])
            {
                Node *newNode = new Node;
                newNode->rowID[0] = ID[0];
                newNode->rowID[1] = ID[1];
                newNode->rowID[2] = ID[2];
                if (prev == NULL)
                {
                    prev = newNode;
                    prev->right = newNode;
                }
                newNode->left = prev;
                newNode->right = prev->right;
                newNode->right->left = newNode;
                prev->right = newNode;
                newNode->head = top;
                newNode->down = top;
                newNode->up = top->up;
                top->up->down = newNode;
                top->size++;
                top->up = newNode;
                if (top->down == top)
                    top->down = newNode;
                prev = newNode;
            }
        }
    }

    HeadNode = header;
}

//-------------------COVERS VALUES THAT ARE ALREADY PRESENT IN THE GRID-------------------------//
void TransformListToCurrentGrid(int Puzzle[][SIZE])
{
    int index = 0;
    for (int i = 0; i < SIZE; i++)
        for (int j = 0; j < SIZE; j++)
            if (Puzzle[i][j] > 0)
            {
                Node *Col = NULL;
                Node *temp = NULL;
                for (Col = HeadNode->right; Col != HeadNode; Col = Col->right)
                {
                    for (temp = Col->down; temp != Col; temp = temp->down)
                        if (temp->rowID[0] == Puzzle[i][j] && (temp->rowID[1] - 1) == i && (temp->rowID[2] - 1) == j)
                            goto ExitLoops;
                }
            ExitLoops:
                coverColumn(Col);
                orig_values[index] = temp;
                index++;
                for (Node *node = temp->right; node != temp; node = node->right)
                {
                    coverColumn(node->head);
                }
            }
}

//===============================================================================================================//
//----------------------------------------------- Print Functions -----------------------------------------------//
//===============================================================================================================//

void MapSolutionToGrid(int Sudoku[][SIZE])
{

    for (int i = 0; solution[i] != NULL; i++)
    {
        Sudoku[solution[i]->rowID[1] - 1][solution[i]->rowID[2] - 1] = solution[i]->rowID[0];
    }
    for (int i = 0; orig_values[i] != NULL; i++)
    {
        Sudoku[orig_values[i]->rowID[1] - 1][orig_values[i]->rowID[2] - 1] = orig_values[i]->rowID[0];
    }
}

//---------------------------------PRINTS A SUDOKU GRID OF ANY SIZE---------------------------------------------//
void PrintGrid(int Sudoku[][SIZE])
{
    for (int i = 0; i < SIZE; i++)
    {
        // cout << "{ ";
        for (int j = 0; j < SIZE; j++)
        {
            cout << Sudoku[i][j];
            if (j < SIZE - 1)
            {
                cout << ", ";
            }
        }
        if (i < SIZE - 1)
        {
            // cout << " }," << endl;
            cout << endl;
        }
        // cout << " }" << endl;
    }
    // cout << " }" << endl << endl << endl;
    cout << endl << endl;

    for (int i = 0; i < SIZE; i++)
    {
        for (int j = 0; j < SIZE; j++)
        {
            if (Sudoku[i][j] == 0)
            {
                cout << ".";
            }
            else
            {
                cout << Sudoku[i][j];
            }
        }
    }
}

//--------------------------------------------------------------------------------//

void SolveSudoku(int Sudoku[][SIZE])
{
    timer = clock();
    BuildSparseMatrix(matrix);
    BuildLinkedList(matrix);
    TransformListToCurrentGrid(Sudoku);
    // cout << "Right before search(0)" << endl;
    int *counter = (int *)malloc(sizeof(int));
    *counter = 0;
    search(0, counter);
    // cout << "Right after search(0)" << endl;
    if (!isSolved)
        // cout << "No Solution!" << endl;
        NumberOfSolutions = 0;
    isSolved = false;
}

void SolveSudokuN(int Sudoku[][SIZE]) {
    timer = clock();
    BuildSparseMatrix(matrix);
    BuildLinkedList(matrix);
    TransformListToCurrentGrid(Sudoku);
    searchN(0);
    if (!isSolvedN)
        cout << "No Solution!" << endl;
    isSolvedN = false;
}

int main()
{

    // Starting Point
    int Starter[SIZE][SIZE] = {
        { 0, 3, 0, 0, 0, 6, 9, 0, 4 },
        { 0, 1, 0, 5, 8, 0, 0, 0, 0 },
        { 6, 0, 8, 0, 0, 3, 1, 0, 0 },
        { 0, 8, 0, 0, 0, 0, 0, 2, 0 },
        { 4, 0, 2, 1, 0, 9, 8, 0, 3 },
        { 0, 9, 0, 0, 0, 0, 0, 4, 0 },
        { 0, 0, 7, 9, 0, 0, 6, 0, 5 },
        { 0, 0, 0, 0, 7, 5, 0, 1, 0 },
        { 8, 0, 3, 6, 0, 0, 0, 9, 0 }
    };

    // After all is said and done, print that thing!
    cout << "Puzzle:" << endl;
    for (int i = 0; i < SIZE; i++)
    {
        // cout << "{ ";
        for (int j = 0; j < SIZE; j++)
        {
            cout << Starter[i][j];
            if (j < SIZE - 1)
            {
                cout << ", ";
            }
        }
        if (i < SIZE - 1)
        {
            // cout << " }," << endl;
            cout << endl;
        }
        // cout << " }" << endl;
    }
    // cout << " }" << endl << endl << endl;
    cout << endl << endl;

    for (int i = 0; i < SIZE; i++)
    {
        for (int j = 0; j < SIZE; j++)
        {
            if (Starter[i][j] == 0)
            {
                cout << ".";
            }
            else
            {
                cout << Starter[i][j];
            }
        }
    }

    cout << endl << endl;

    cout << "Answer:" << endl;
    SolveSudokuN(Starter);

    return 0;
}
