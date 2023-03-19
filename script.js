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
let GraphNoConstraints = document.getElementById('GraphNoConstraints');
const inputFile = document.querySelector("#major-reqs");
const inputMaxCredits = document.querySelector("#max-credits");
const submitBtn = document.querySelector("#submit-btn");
const formAlert = document.querySelector(".form-alert");

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
                currEdge = [tempID, currID]
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
        startQtr = sortedObjsArr[0].avail[0];   // if no start qtr is provided pick the earliest qtr
    }

    let courseGroupsArr = [];                   // final results array —— array of arrays
    let allSelectedCoursesArr = [];             // array of all courses visisted
    let currSelectedCoursesArr = [];            // array of courses being visited by selected qtr
    const numCourses = sortedObjsArr.length;    // number of courses
    let currQtrCreds = 0;
    let i = 0;
    
    while (allSelectedCoursesArr.length < numCourses) {
        courseGroupsArr[i] = [];
        for (let j = 0; (j < sortedObjsArr.length) && (currQtrCreds < maxCredits); j++) {
            if (
                (sortedObjsArr[j].avail.includes(currQtr(i, startQtr))) &&  // course available this qtr
                (sortedObjsArr[j].prereqs.every(prereq => allSelectedCoursesArr.includes(prereq))) && // all prereqs met
                ((currQtrCreds + sortedObjsArr[j].credits) <= maxCredits)   // course won't cause quarter to exceed max credits
                ) 
                {
                currSelectedCoursesArr.push(sortedObjsArr[j].id);   // add course to buffer array
                currQtrCreds += sortedObjsArr[j].credits;           // increment current qtr credits
                courseGroupsArr[i].push(sortedObjsArr[j]);          // add course to final groups array
                sortedObjsArr.splice(j, 1);                         // remove course from array being iterated
                j--;                                                // decrement iterator since loop will increment it
            }
        }

        allSelectedCoursesArr = allSelectedCoursesArr.concat(currSelectedCoursesArr);
        
        currSelectedCoursesArr.length = 0;
        currQtrCreds = 0;

        i++;
    }
    
    let courseObjArrWGroups = [];
    courseGroupsArr.forEach((qtrArr, qtrArrIdx) => {
        qtrArr.forEach(course => {
            course.group = qtrArrIdx;
            courseObjArrWGroups.push(course);
        });
    });
    return courseObjArrWGroups;
}

// creates the graph to be visaulized in memeory
function createVisGraph(courseArr,graphContainer) {
    let visObjects = [];
    let visEdges = [];

    // create visNodes
    for (let i = 0; i < courseArr.length; i++) {
        visObjects.push({
            id: courseArr[i].id,
            label: courseArr[i].code,
            title: courseArr[i].name + "\n" + courseArr[i].credits,
            level: courseArr[i].group, // how group graphs are created
            group: courseArr[i].group%3,
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
    let visGroups = new vis.DataSet([     // group dataSet and content creator, where every group is arranged by color
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
            font: {
                size: 16,
            },
            scaling: {
                min: 50,
                max: 50,
                label: {
                    enabled: true,
                    min: 100,
                    max: 100,
                },
            },
            widthConstraint: {
                min: 30,
                max: 30,
            },
            heightConstraint: {
                min: 10,
                max: 30,
            },
        },
        edges: {
            arrows: {
                to: true,
            },
        },
        width: '100%',
        height: '1000px',
        interaction: {
          zoomView: false,
        },
        layout: {
            hierarchical: {
                enabled: true,
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
        // physics: {
        //     barnesHut: {
        //         gravitationalConstant: -2000,
        //         centralGravity: 0.3,
        //         springLength: 95,
        //         springConstant: 0.04,
        //         damping: 0.09,
        //         avoidOverlap: 0
        //     },
        //     maxVelocity: 50,
        //     minVelocity: 0.1,
        //     solver: 'barnesHut'
        // },
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

function main () {
    let sortedObjsArr = [];

    toposort(idsArr, edgesArr).forEach(id => {
        sortedObjsArr.push(idMap.get(id));
    });

    createVisGraph(createCourseGroups(0, Number.MAX_SAFE_INTEGER, sortedObjsArr), GraphNoConstraints);
    
}