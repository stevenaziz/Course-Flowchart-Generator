// Global Variables
const fileInput = new FileReader();
let maxCredits;
let startQtr;
let courseObjArr = [];
let edgesArr = [];
let nodesArr = [];
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

// Capture form data, read file, and call parsing function
function processInput(e) {
    e.preventDefault();

    courseObjArr = [];
    edgesArr = [];
    nodesArr = [];
    availAutumnArr = [];
    availWinterArr = [];
    availSpringArr = [];
    noPrereqsArr = [];
    maxCredits = inputMaxCredits.value;
    startQtr = document.querySelector('input[name="start-qtr"]:checked').value;

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
    let currID;
    let tempID;

    coursesArr.forEach(courseInfo => {
        courseCodeNameCredsArr = courseInfo.split(",", 3);

        currID = +(courseCodeNameCredsArr[0].replace(/\D/g, "")), // replace anything NOT a digit with empty string
        nodesArr.push(currID);
        
        coursePrereqsAvailArr = courseInfo.split("[");
        coursePrereqsAvailArr.shift(); // Removes course code, name, and credits (already processed)

        coursePrereqsAvailArr[0] = coursePrereqsAvailArr[0].trim(); // remove start-end whitespace
        coursePrereqsArr = coursePrereqsAvailArr[0].split(",");
        coursePrereqsArr.pop(); // remove last element - empty
        coursePrereqsArr.forEach((element, index, array) => {
            tempID = +(element.replace(/\D/g, ""));
            if (tempID != 0) {
                array[index] = +(element.replace(/\D/g, ""));
                edgesArr.push([currID, tempID]);
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
            id: currID,
            name: courseCodeNameCredsArr[1].trim(),
            credits: parseInt(courseCodeNameCredsArr[2]),
            prereqs: coursePrereqsArr,
            avail: courseAvailArr,
            group: 0
        };

        courseObjArr.push(currObj);

        // console.log(`{code: ${currObj.code}, id: ${currObj.id}, name: ${currObj.name}, credits: ${currObj.credits}, prereqs: [${currObj.prereqs}], avail: [${currObj.avail}]}, `);

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
    
    console.log(toposort(nodesArr, edgesArr).reverse());
}

function groupCoursesByQtr(start_qtr, max_creds) {
    let currQtr = start_qtr;

    return toposort(nodesArr, edgesArr).reverse();
}