# COURSE FLOWCHART GENERATOR
Authored by Steven Aziz and Azhar Kimanje

## Introduction
In order for university students to graduate with a degree in a major of their choice they are required to take (and pass) a number of courses related to their major. For new university admits this can be really daunting since there is little to no informing on how they should plan their major requirements.

Fortunately, we have a solution! Our course flowchart generate will accept a file of major requirements along with the student's constraints (which quarter they started and how many credits they can take per quarter) to suggest an optimal course sequence. It works for any quarter-based university and can tell students everything they need to know about their journey in seconds!

## Description
To solve the probelm we used two third-party libraries (Toposort and vis.js) to design and execute a simple webpage that accept three inputs and prints the optimal course flow. We built the project in HTML, CSS, and JavaScript using VS Code and it runs in a browser environment. Two test files, `SPU_Computer_Science_BA.txt` and `SPU_Computer_Engineering_BS.txt`, are provided to verify functionality and provide a demonstration on how the course flowchart generator works.

## Requirements
- Up-to-date modern web browser (i.e. Safari, Chrome, Edge, Firefox, Opera, etc.)
All required libraries and files are included in this repository.

## User Manual
1. Clone the repository on the target computer
2. Open `index.html` in the browser (usually by right-click)

<img width="1000" alt="Run the program by opening the index.html file in your browser" src="https://user-images.githubusercontent.com/90646854/226276205-5428f661-1a2a-41bf-9714-ac5e097986ba.png">

Youtube Link: https://youtu.be/-s7s2OuCj10

## Reflection
*Write the reflection about getting the small groups in the minimum number of iterations, etc.*

The initial difficulty we had was selecting a language we were both comfortable with to start. We quickly decided between C++ and Javascript
Then the next issue was to select a third party language that could work with the two languages we were willing to implement this project in.
For Clion we were planning to use Boost and for JavaScript there was D3.js, graphlib, vis.js etc
Steven was thinking of Boost and connecting it to clion and have the final project run on command line.
Azhar was thinking of Javascript after initially failing to connect boost to clion. 
JavaScript seemed to be the easiest to connect to a third party library after everything failed with Clion
Azhar discovered vis.js as the easiest third-party library to use and focused on implementing graphs that take in different forms of data.
Azhar worked on index.html file while Steven worked on script.js file. Azhar figured out different methods that could be exploited with vis.js to create a beginner reasonable graph that can be reference to.
Steven then figured out how to parse any kind of data from the .txt fie into usable information by the graphing algorithm
Steven as the most proficient in Java Script also used another third party library to sort the information he had parsed from the files and this library was called toposort.js. Steven was abe to using graphing algorithm that sorted all our arrays of data into objects and arrays that were usable in graphing format.
We both worked together finally to merge index.html file graphing logic to script.js data and parsed information logic. 
Steven also perfectly set up the UI to allow interaction between client and graphs.
