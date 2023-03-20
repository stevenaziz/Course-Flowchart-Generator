# COURSE FLOWCHART GENERATOR
Authored by Steven Aziz and Azhar Kimanje

## Introduction
This programming project implementing a courseflow chart using the third party libraries toposort.js, vis-network.js and vis-network.js.map.
This project was designed on Visual Studio Code and runs as a webpage on a browser environment. It will be able to successfully guide the user of the webpage to see through graduating requirements all the way from freshman year of college at SPU to senior year. There are two majors that we will be using to demonstrate all its features and these will be Computer Science BA and Computer Engineering BS. The user will be able to see flow charts with and without constraints and arranged lists of courses to guide them in successfully gaining from the using the webpage.

## Description
This project is about being able to use a third party library to implement a graphing algorithm and create a DAG that can help students plan how to take courses in Computer Science BA and Computer Engineering BS. The project utilizes vis.js and toposort.js to arrange and graph the information from the text file. We chose a Directed Acyclic Graph because it is reasonable and avoids cycles which means the student can only progress as they go through their studies in these majors. toposort.js is where the data from the .txt files was arranged topologically and script.js is where all the graphing logic and functions were implemented to success create the graph that you will see in your index.html file.

## Requirements
- `SPU_Computer_Engineering_BS.txt` contains the courses a student needs to take to fulfill Computer Engineering BS major
- `SPU_Computer_Science_BA.txt` contains the courses a student needs to take to fulfill Computer Science BA major
- `index.html`
- `style.css`
- `script.js`
- `toposort.js`
- `vis-network.js`
- `vis-network.js.map`
index.html is where the graphs and lists are printed out.
script.js is where all the files get parsed, UI is implemented, graphing logic and listing logic are implemented.
toposort.js does all the arranging of the information broken down by script.js happens.

## User Manual
*Once a person clones this into their computer how the person is supposed to run the program, add screenshots showing how your program works, also add here the link to the Youtube video showing the program running*

Place file that includes all files in the requirements anywhere in your computer directory.
Right click on index.html and select open with browser

Youtube Link: 

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
