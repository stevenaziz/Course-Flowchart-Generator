// Variables
const fileInput = new FileReader();

// Selectors
const inputFile = document.querySelector("#major-reqs");
const inputMaxCredits = document.querySelector("#max-credits");
const submitBtn = document.querySelector("#submit-btn");

// Listeners
submitBtn.addEventListener("click", processInput);

function processInput(e) {
    e.preventDefault();

    const maxCredits = inputMaxCredits.value;
    const startQtr = document.querySelector('input[name="start-qtr"]:checked').value;

    fileInput.readAsText(inputFile.files[0]);
    fileInput.addEventListener("load", parseFile);
}

function parseFile() {
    console.log(fileInput.result);
}