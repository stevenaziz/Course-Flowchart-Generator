// Global Variables
const fileInput = new FileReader();
let idMap = new Map();
let userMaxCredits;
let userStartQtr;
let courseObjArr = [];
let idsArr = [];
let edgesArr = [];
let currQtr = function(index, startQtr) { // anonymous function that uses startQtr and array index to determine the current quarter
    index += startQtr;
    index %= 3;
    if (index == 0) { return 3; }
    return index;
}

// Selectors
const inputFile = document.querySelector("#major-reqs");
const inputMaxCredits = document.querySelector("#max-credits");
const submitBtn = document.querySelector("#submit-btn");

// Listeners
submitBtn.addEventListener("click", processInput);

// Capture form data, read file, and call parsing function
function processInput(e) {
    e.preventDefault();

    // clear array
    courseObjArr.length = 0;
    idsArr.length = 0;
    edgesArr.length = 0;
    idMap.clear();

    // get form data
    userMaxCredits = inputMaxCredits.value;
    userStartQtr = document.querySelector('input[name="start-qtr"]:checked').value;

    // read text file and call parsing function
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
    let currEdge = [];
    let currID;
    let tempID;

    coursesArr.forEach(courseInfo => {
        courseCodeNameCredsArr = courseInfo.split(",", 3);

        currID = +(courseCodeNameCredsArr[0].replace(/\D/g, "")) // replace anything NOT a digit with empty string;
        idsArr.push(currID);
        
        coursePrereqsAvailArr = courseInfo.split("[");
        coursePrereqsAvailArr.shift(); // Removes course code, name, and credits (already processed)

        coursePrereqsAvailArr[0] = coursePrereqsAvailArr[0].trim(); // remove start-end whitespace
        coursePrereqsArr = coursePrereqsAvailArr[0].split(",");
        coursePrereqsArr.pop(); // remove last element - empty
        coursePrereqsArr.forEach((element, index, array) => {
            tempID = +(element.replace(/\D/g, ""));
            if (tempID != 0) {
                array[index] = +(element.replace(/\D/g, ""));
                currEdge = [currID, tempID]
                edgesArr.push(currEdge);
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

        idMap.set(currObj.id, currObj);
    });

    // call main function to sort and print output
    main();
}

function createCourseGroups(startQtr, maxCredits, sortedObjsArr) {
    if (startQtr == 0) {
        startQtr = sortedObjsArr[0].avail[0];
    }

    let courseGroupsArr = [];
    let allSelectedCoursesArr = [];
    let currSelectedCoursesArr = [];
    const numCourses = sortedObjsArr.length;
    let currQtrCreds = 0;
    let i = 0;
    
    while (allSelectedCoursesArr.length < numCourses) {
        courseGroupsArr[i] = [];
        for (let j = 0; (j < sortedObjsArr.length) && (currQtrCreds < maxCredits); j++) {
            if ((sortedObjsArr[j].avail.includes(currQtr(i, startQtr))) && (sortedObjsArr[j].prereqs.every(prereq => allSelectedCoursesArr.includes(prereq))) && ((currQtrCreds + sortedObjsArr[j].credits) <= maxCredits)) {
                currSelectedCoursesArr.push(sortedObjsArr[j].id);
                currQtrCreds += sortedObjsArr[j].credits;
                courseGroupsArr[i].push(sortedObjsArr[j]);
                sortedObjsArr.splice(j, 1);
                j--;
            }
        }

        allSelectedCoursesArr = allSelectedCoursesArr.concat(currSelectedCoursesArr);
        
        currSelectedCoursesArr.length = 0;
        currQtrCreds = 0;

        i++;
    }
    return courseGroupsArr;
}

function main () {
    let sortedObjsArr = [];

    toposort(idsArr, edgesArr).reverse().forEach(id => {
        sortedObjsArr.push(idMap.get(id));
    });

    console.log(createCourseGroups(0, Number.MAX_SAFE_INTEGER, sortedObjsArr));
}