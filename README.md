# Course Flowchart Generator
Authored by Steven Aziz and Azhar Kimanje

## Introduction
For university students to graduate with a degree in a major of their choice, they must take (and pass) many courses related to their major. This can be daunting for new university admits since there needs to be more information on how they should plan their major requirements.

Fortunately, we have a solution! Our course flowchart generator will accept a file of major requirements and the student's constraints (the starting quarter and maximum credits the student can take per quarter) to suggest an optimal course sequence. It works for any quarter-based university and can tell students everything they need to know about their journey in seconds!

## Description
To solve the problem, we used two third-party libraries (Toposort and vis.js) to design and execute a simple webpage that accepts three inputs and prints the optimal course flow. We built the project in HTML, CSS, and JavaScript using VS Code, and the entire project runs in a browser-based environment. Two test files, `SPU_Computer_Science_BA.txt` and `SPU_Computer_Engineering_BS.txt`, are provided to verify functionality and give a demonstration of how the course flowchart generator works.

## Requirements
- Up-to-date, modern web browser (i.e., Safari, Chrome, Edge, Firefox, Opera, etc.)

> All required libraries and files are already included in this repository.

## User Manual
1. Clone the repository on the target computer and navigate to its directory in the file system
2. Open `index.html` in the browser (usually by right-clicking)

> On Mac and Windows, this can be done by right-clicking the file, selecting _Open With_, and selecting a browser from the drop-down

> **IMPORTANT — all project files need to be in the same directory, or the program will not run**

<img width="950" alt="Run the program by opening the index.html file in your browser" src="https://user-images.githubusercontent.com/90646854/226277263-4fb741b1-cee5-468a-ba8f-5e1d32a783c0.png">

Video Walkthrough of the Project: https://youtu.be/8T-pQMTBXL8

## Reflection
The initial difficulty was selecting a language we were both comfortable with and a third-party graph library for the flowchart. We both knew C++ and Javascript, but for some odd reason, we decided to try C++, thinking it would be easier. We quickly discovered Boost is the most-popular third-party, open-source C++ graph library. We spent well over a week trying to install and use Boost, but after nearly two weeks, we gave up on Boost (and, by extension, C++) in favor of JavaScript. Azhar's research led to the discovery of vis.js, a simple, easy-to-use graph visualization library for JavaScript. And so, we selected vis.js as our third-party library for this project.

Creating the HTML page and CSS was easy. The next challenge: implementing HTML forms that would accept the correct information and read that information into the script file. We learned about the FileReader JavaScript class and were happy to discover that reading files in the browser was accessible.

Afterward, we spent significant time writing the ParseFile function to read the text file line by line and extract the information needed for the next step. We learned about JavaScript array manipulation, string methods, and objects. It was a lot of code, but it was only the difficulty of what we expected. All this time, Azhar had been implementing our usage of the vis.js APIs.

The most challenging piece of the project came next: writing the algorithm to select the courses and group them into the best quarters. This part easily took over 24 hours of work before we caught a break: we would iterate through an array of quarters (where each quarter was an array of classes) while at the same time iterating through a topologically sorted array of objects (this is where the Toposort library came in) and pick the best courses to go into each quarter. This idea came to Steven in an epiphany moment after many hours of brainstorming and pacing, but it was brilliant and worked!

So we implemented the createCourseGroups function and completed the project by implementing a main function that would manage all the on-screen print, and completing the HTML and graph styling.

This project was a tremendous learning experience, and it makes us proud to see our work doing valuable things to make potential users' lives a little easier. If only we had this when we started university!
