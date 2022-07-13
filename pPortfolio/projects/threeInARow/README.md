<img width="150px" src="https://w0244079.github.io/nscc/nscc-jpeg.jpg" >

# PROG 2700 - Assignment - Three in a Row

## Summary

1. ~Examine the application at https://www.brainbashers.com/show3inarow.asp and play it a few times to understand how it works. (Be careful! It's addictive!) Your job will be to recreate a portion of this application with your own implementation of pure JavaScript (no frameworks or libraries) and working with the Document Object Model (DOM). Starting puzzle data will be retrieved remotely via an available API.~ 

Example Puzzle at beginning | Completed Example Puzzle
--- | ---
|<figure><img src="https://w0244079.github.io/nscc/courses/prog2700/assignments/3inarow/puzzle_start.png" width="300px" /></figure>|<figure><img src="https://w0244079.github.io/nscc/courses/prog2700/assignments/3inarow/puzzle_finish.png" width="300px" /></figure>

2. You will simulate the 3-in-a-row puzzle by writing it in **pure JavaScript**. 
    1. ~The data that you will work with is pre-defined JSON data from a remote location. https://threeinarowpuzzle.herokuapp.com/sample . This JSON data will serve as the underlying data structure which will represent your puzzle.~ 
    2. ~The display grid should be an HTML table. However, the table must be generated only using JavaScript and without using the document.write() function to output the table tags. (ie. You’ll need to create elements/nodes and attach them to the DOM).~
    3. ~You will add unobtrusive JavaScript events (addEventListener) to certain squares in the puzzle so that repeatedly left-clicking on the square will cycle through and change its state to one of three distinct possibilities: ~
        * ~Empty (State 0) ~
        * ~State 1 ~
        * ~State 2~
    4. ~Squares that are set to a color (or image if you wish) at the beginning of the puzzle should not be changeable as stated in the JSON data.~ 
    5. ~At any time during the playing of the puzzle the end user should be able to click a “Check Puzzle” button that displays one of the following status outputs~
        * ~“So far so good” (all colored squares are correct but the puzzle is incomplete)~
        * ~“Something is wrong” (one or more of the colored squares is incorrectly assigned)~
        * ~“You did it!!” (all squares are correct and the puzzle has been completely filled in)~
    6. ~A checkbox can be checked at any time which will cause the puzzle to display any incorrect squares. Unchecking the box will remove the indication of any incorrect squares.~ 
    7. ~All JavaScript code will be unobtrusive.~
    8. ~You will also add one Innovative Feature to your version of the puzzle which will add meaningful value to the playing of the game. When you have decided your feature, or if you are struggling deciding what to add, discuss with your instructor for approval.~ 
    
### Notes
* ~If solving this puzzle is not your thing, you can refer to the solution.png for the solution. ~
* ~The remote API data is test data for a 6x6 puzzle. After you have completed the app to work with the sample puzzle, you can switch to a different API endpoint, https://threeinarowpuzzle.herokuapp.com/random which will randomly send you a puzzle of varying sizes (6x6, 8x8, 10x10 and 14x14). Your solution will need to accommodate the different puzzle sizes. (ie, your solution should be able to handle a puzzle of any size….not just 6x6.) ~

## Assessment

1. Don’t forget that a student-led demonstration of your code is part of this assignment. This demonstration will be done either live with the instructor or submitted as a video walkthough. Part of the assessment will include your ability to speak about the code you wrote, even if it doesn’t completely work or do what you expect.
2. Late submissions will be subject to the late penalties laid out in the course outline.

## Academic Integrity and Plagiarism

Code sharing by any means is considered plagiarism and is strictly forbidden under the NSCC Academic Integrity policy. 

[NSCC ACADEMIC INTEGRITY GUIDELINES](https://www.nscc.ca/docs/about-nscc/policies-procedures/policy-academicintegrity.pdf)  
[NSCC ACADEMIC INTEGRITY REPORTING POLICY](https://www.nscc.ca/docs/about-nscc/policies-procedures/procedures-academicintegritystudent.pdf)
