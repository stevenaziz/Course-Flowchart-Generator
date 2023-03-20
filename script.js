// Global Variables
let userMaxCredits;
let userStartQtr;
// anonymous function that uses startQtr and array index to determine the current quarter
let currQtr = function(index, startQtr) {
    index += startQtr;
    index %= 3;
    if (index == 0) { return 3; }
    return index;
}

// Selectors
const noConstraintsHdr = document.querySelector("#noConstraintsHdr");
const constraintsHdr = document.querySelector("#constraintsHdr");
const GraphNoConstraints = document.getElementById('GraphNoConstraints');
const GraphWithConstraints = document.getElementById('GraphWithConstraints');
const ListNoConstraints = document.getElementById('ListNoConstraints');
const ListWithConstraints = document.getElementById('ListWithConstraints');
const inputFile = document.querySelector("#major-reqs");
const inputMaxCredits = document.querySelector("#max-credits");
const submitBtn = document.querySelector("#submit-btn");
const formAlert = document.querySelector(".form-alert");

// Listeners
submitBtn.addEventListener("click", processInput);

// Capture form data, read file, and call parsing function
function processInput(e) {
    e.preventDefault();

    let fileInput = new FileReader();

    // check user input is present, else throw error and stop
    try {
        if (
            isNaN(inputMaxCredits.value) || 
            inputMaxCredits.value < 5 || 
            document.querySelector('input[name="start-qtr"]:checked').value == null || 
            inputFile.files[0] == undefined
            ) {
            throw new Error();
        }
    } catch {
        formAlert.innerText = "Please check your input and try again.";
        return;
    }
    
    formAlert.innerText = "";

    // get form data
    userMaxCredits = inputMaxCredits.value;
    userStartQtr = document.querySelector('input[name="start-qtr"]:checked').value;

    // read text file and call parsing function
    fileInput.readAsText(inputFile.files[0]);
    fileInput.addEventListener("load", function() {
        parseFile(fileInput);
    });
}

// Parse data in fileInput and create multiple arrays of objects
function parseFile(fileInput) {
    let idsArr = [];
    let edgesArr = [];
    let idCourseMap = new Map();

    let inputFileLinesArr = fileInput.result.split(/\r?\n/);        // split by new line
    let courseCodeNameCredsArr = [];
    let coursePrereqsAvailArr = [];
    let coursePrereqsArr = [];
    let courseAvailArr = [];
    let currObj = {};
    let currEdge = [];
    let currID;
    let temp;

    inputFileLinesArr.forEach(line => {
        courseCodeNameCredsArr = line.split(",", 3);

        currID = +(courseCodeNameCredsArr[0].replace(/\D/g, ""))    // replace anything NOT a digit with empty string;
        
        coursePrereqsAvailArr = line.split("[");
        coursePrereqsAvailArr.shift();                              // Removes course code, name, and credits (already processed)

        coursePrereqsAvailArr[0] = coursePrereqsAvailArr[0].trim(); // remove start-end whitespace
        coursePrereqsArr = coursePrereqsAvailArr[0].split(",");
        coursePrereqsArr.pop();                                     // remove last element - empty
        coursePrereqsArr.forEach((element, index, array) => {
            temp = +(element.replace(/\D/g, ""));
            if (temp != 0) {
                array[index] = temp;
                currEdge = [temp, currID]
                edgesArr.push(currEdge);
            } else {
                array.length = 0;
            }
        });

        courseAvailArr = coursePrereqsAvailArr[1].split(",");
        courseAvailArr.forEach((element, index, array) => {
            temp = +(element.replace(/\D/g, ""));
            if ((temp != 1) && (temp != 2) && (temp != 3)) {
                formAlert.innerText = "Please check your input and try again.";
                return;
            }
            array[index] = temp;
        });

        currObj = {
            code: courseCodeNameCredsArr[0],
            id: currID,
            name: courseCodeNameCredsArr[1].trim(),
            credits: parseInt(courseCodeNameCredsArr[2]),
            prereqs: coursePrereqsArr,
            avail: courseAvailArr,
            group: 0                                                // will be updated later
        };

        if (isNaN(currID) || currObj.credits < 1 || currObj.credits > 5) {
            formAlert.innerText = "Please check your input and try again.";
            return;
        }

        idsArr.push(currID);
        idCourseMap.set(currID, currObj);
    });

    // call main function to sort and print output
    main(idsArr, edgesArr, idCourseMap);
}

function createCourseGroups(startQtr, maxCredits, sortedCoursesArr) {    
    let arrOfGroupsArr = [];                                        // final results array —— array of arrays
    let allSelectedCoursesArr = [];                                 // array of all courses visisted
    let currSelectedCoursesArr = [];                                // array of courses being visited by selected qtr
    const numCourses = sortedCoursesArr.length;                     // number of total courses
    let currQtrCreds = 0;
    let i = 0;
    
    while (allSelectedCoursesArr.length < numCourses) {
        arrOfGroupsArr[i] = [];
        for (let j = 0; (j < sortedCoursesArr.length) && (currQtrCreds < maxCredits); j++) {
            if (
                (sortedCoursesArr[j].avail.includes(currQtr(i, startQtr))) &&                               // course available this qtr
                (sortedCoursesArr[j].prereqs.every(prereq => allSelectedCoursesArr.includes(prereq))) &&    // all prereqs met
                ((currQtrCreds + sortedCoursesArr[j].credits) <= maxCredits)                                // course won't cause quarter to exceed max credits
                ) 
                {
                currSelectedCoursesArr.push(sortedCoursesArr[j].id);   // add course to current qtr array
                currQtrCreds += sortedCoursesArr[j].credits;           // increment current qtr credits
                arrOfGroupsArr[i].push(sortedCoursesArr[j]);           // add course to final groups array in group i
                sortedCoursesArr.splice(j, 1);                         // remove course from array being iterated
                j--;                                                   // decrement iterator since for-loop will increment it
            }
        }

        allSelectedCoursesArr = allSelectedCoursesArr.concat(currSelectedCoursesArr);                       // join courses selected for this qtr with all selected courses
        
        currSelectedCoursesArr.length = 0;
        currQtrCreds = 0;

        i++;
    }
    return arrOfGroupsArr;
}

// creates the graph to be visaulized in memeory
function createVisGraph(courseArr, edgesArr, graphContainer) {
    let visObjects = [];
    let visEdges = [];

    // create visNodes
    for (let i = 0; i < courseArr.length; i++) {
        visObjects.push({
            id: courseArr[i].id,
            label: courseArr[i].code,
            title: courseArr[i].name + "\n" + courseArr[i].credits,
            level: courseArr[i].group,                              // each level is one quarter
            group: courseArr[i].group%3,                            // each group is a collection of levels (Autumn/Winter/Spring)  
            shape: "box"
        });
    }

    // create visEdges
    edgesArr.forEach(edge => {
        visEdges.push({
            from: edge[0],
            to: edge[1]
        });
    });

    // create groups for each quarter
    let visGroups = new vis.DataSet([
        {id: 1, content: 'Fall'},
        {id: 2, content: 'Winter'},
        {id: 0, content: 'Spring'}
    ]);

    let data = {
        nodes: visObjects,
        edges: visEdges,
        groups: visGroups
    }

    let options = {
        nodes: {
            // font: {
            //     size: 16,
            // },
            // scaling: {
            //     min: 50,
            //     max: 50,
            //     label: {
            //         enabled: true,
            //     },
            // },
            // widthConstraint: {
            //     min: 30,
            //     max: 30,
            // },
            // heightConstraint: {
            //     min: 10,
            //     max: 30,
            // },
        },
        edges: {
            arrows: {
                to: true,
            },
        },
        width: '100%',
        height: '100%',
        interaction: {
          zoomView: false,
        },
        layout: {
            hierarchical: {
                direction: "LR", // set the direction of the layout
                sortMethod: "directed", // sort the nodes according to their position in the graph
                nodeSpacing: 10,
                levelSeparation: 200,
                shakeTowards: 'roots',
                edgeMinimization: true,
                blockShifting: true,
                treeSpacing: 10,
            },
        },
        physics: {
            barnesHut: {
                gravitationalConstant: -2000,
                centralGravity: 0.3,
                springLength: 95,
                springConstant: 0.04,
                damping: 0.09,
                avoidOverlap: 0
            },
            maxVelocity: 50,
            minVelocity: 0.1,
            solver: 'barnesHut'
        },
        // groups: { // group design
        //     useDefaultGroups: false,
        //     font: {
        //         color: '#fff',
        //         size: 14,
        //         face: 'arial',
        //         strokeWidth: 0.5,
        //         strokeColor: '#fff'
        //     }
        // }
    };

    let network = new vis.Network(graphContainer, data, options);
}

function main (idsArr, edgesArr, idCourseMap) {
    const sortedIdsArr = toposort(idsArr, edgesArr);
    let sortedCoursesArr = [];
    let arrsOfGroupsArr = [];
    let htmlOutput = "";
    let qtrNumMap = new Map();
    
    qtrNumMap.set(1, "Autumn");
    qtrNumMap.set(2, "Winter");
    qtrNumMap.set(3, "Spring");

    let coursesWGroups = function(arrayOfArrays) {
        let coursesWGroupsArr = [];
        arrayOfArrays.forEach((element, index) => {
            element.forEach(courseObj => {
                courseObj.group = index;
                coursesWGroupsArr.push(courseObj);
            });
        });
        return coursesWGroupsArr;
    }



    // without constraints    
    sortedIdsArr.forEach((id, index) => {
        sortedCoursesArr[index] = idCourseMap.get(id);
        sortedCoursesArr[index].avail = [1, 2, 3];
    });

    arrsOfGroupsArr = createCourseGroups(1, Number.MAX_SAFE_INTEGER, sortedCoursesArr);

    arrsOfGroupsArr.forEach((qtr, qtrIdx) => {
        htmlOutput += `<li>${qtrNumMap.get(currQtr(qtrIdx, 1))}</li>`;
        htmlOutput += "<ol class='courses'>";
        qtr.forEach(course => {
            htmlOutput += `<li>${course.code} ${course.name}, ${course.credits}</li>`;
        });
        htmlOutput += "</ol>";
    });

    noConstraintsHdr.classList.remove("display-none");
    ListNoConstraints.classList.remove("display-none");
    ListNoConstraints.innerHTML = htmlOutput;

    GraphNoConstraints.classList.remove("display-none");
    createVisGraph(coursesWGroups(arrsOfGroupsArr), edgesArr, GraphNoConstraints);


    htmlOutput = "";


    // with constraints
    sortedIdsArr.forEach((id, index) => {                               // we need to run this again since the createCourseGroups
        sortedCoursesArr[index] = idCourseMap.get(id);                  // function removes all elements from this array when called
    });

    arrsOfGroupsArr = createCourseGroups(userStartQtr, userMaxCredits, sortedCoursesArr);

    arrsOfGroupsArr.forEach((qtr, qtrIdx) => {
        htmlOutput += `<li>${qtrNumMap.get(currQtr(qtrIdx, userStartQtr))}</li>`;
        htmlOutput += "<ol class='courses'>";
        qtr.forEach(course => {
            htmlOutput += `<li>${course.code} ${course.name}, ${course.credits}</li>`;
        });
        htmlOutput += "</ol>";
    });

    constraintsHdr.classList.remove("display-none");
    ListWithConstraints.classList.remove("display-none");
    ListWithConstraints.innerHTML = htmlOutput;

    GraphWithConstraints.classList.remove("display-none");
    createVisGraph(coursesWGroups(arrsOfGroupsArr), edgesArr, GraphWithConstraints);
}