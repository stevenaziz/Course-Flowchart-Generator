// Variables
const fileInput = new FileReader();
let courseObjArr = []; // all courses
let availAutumnArr = [];
let availWinterArr = [];
let availSpringArr = [];
let noPrereqsArr = [];

// Selectors
const inputFile = document.querySelector("#major-reqs");
const inputMaxCredits = document.querySelector("#max-credits");
const submitBtn = document.querySelector("#submit-btn");

// Listeners
submitBtn.addEventListener("click", processInput);

// Upon submit button, capture form data, read file, and call parsing function
function processInput(e) {
    e.preventDefault();

    const maxCredits = inputMaxCredits.value;
    const startQtr = document.querySelector('input[name="start-qtr"]:checked').value;

    fileInput.readAsText(inputFile.files[0]);
    fileInput.addEventListener("load", parseFile);
}

// Parse data in fileInput and create multiple arrays of objects
function parseFile() {
    let coursesArr = fileInput.result.split(/\r?\n/); // split by new line
    let courseCodeNameCredsArr = [];
    let coursePrereqsAvailArr = [];
    let coursePrereqsArr = [];
    let courseAvailArr = [];
    let currObj = {};

    coursesArr.forEach(courseInfo => {
        courseCodeNameCredsArr = courseInfo.split(",", 3);
        
        coursePrereqsAvailArr = courseInfo.split("[");
        coursePrereqsAvailArr.shift(); // Removes course code, name, and credits (already processed)

        coursePrereqsAvailArr[0] = coursePrereqsAvailArr[0].trim();
        coursePrereqsArr = coursePrereqsAvailArr[0].split(",");
        coursePrereqsArr.pop();
        coursePrereqsArr.forEach((element, index, array) => {
            if (+(element.replace(/\D/g, "")) != 0) {
                array[index] = +(element.replace(/\D/g, ""));
            } else {
                array.shift();
            }
        });

        courseAvailArr = coursePrereqsAvailArr[1].split(",");
        courseAvailArr.forEach((element, index, array) => {
            array[index] = +(element.replace(/\D/g, ""));
        });

        currObj = {
            code: courseCodeNameCredsArr[0],
            id: +(courseCodeNameCredsArr[0].replace(/\D/g, "")), // replace anything NOT a digit with ""
            name: courseCodeNameCredsArr[1].trim(),
            credits: parseInt(courseCodeNameCredsArr[2]),
            prereqs: coursePrereqsArr,
            avail: courseAvailArr
        };

        courseObjArr.push(currObj);

        courseAvailArr.forEach(element => {
            if (element == 1) {
                availAutumnArr.push(currObj);
            }
            if (element == 2) {
                availWinterArr.push(currObj);
            }
            if (element == 3) {
                availSpringArr.push(currObj);
            }
        });

        if (coursePrereqsArr.length == 0) {
            noPrereqsArr.push(currObj);
        }
    });

    console.log(courseObjArr);
    console.log(availAutumnArr);
    console.log(availWinterArr);
    console.log(availSpringArr);
    console.log(noPrereqsArr);
}