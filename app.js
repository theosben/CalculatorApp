// Function variable values
const TOTAL_CHARACTER_INPUT_ALLOWED_AMOUNT = 6; // The total amount of numbers that can be input on the calculator.

// DOM References
let screenText = document.querySelector(".screenText");
let calcButtons = document.querySelectorAll(".calcButton");

// Variables to be used
let currentScreenValue = [];
let savedValueOne = null;
let savedValueTwo = null;
let waitingForFirstNumber = true;
let operationInUse = "";
let justPressedEquals = false;

// Initialise screen (for cancel button)
let initialiseValues = function() {
    screenText.innerHTML = "0";
    currentScreenValue = [];
    savedValueOne = null;
    savedValueTwo = null;
    waitingForFirstNumber = true;
    operationInUse = "";
    justPressedEquals = false;
}

// This will take the current on screen number, save it to savedValue, and set the operationInUse to divide, multiply etc. It will also ready the currentScreenValue for a new input, and reset the boolean so the decimal point system works again.
let saveCurrentArrayAndReset = function (operationString) {
    if (currentScreenValue.length !== 0) savedValueOne = (+currentScreenValue.join(""));
    currentScreenValue = [];
    operationInUse = operationString;
    waitingForFirstNumber = true;
    justPressedEquals = false;
}

// Part of the equals process - this will limit the amount of characters shown on screen to avoid overflowing the screen.
let reduceFinalNumberLength = function() {
    let tempValue = savedValueOne.toString().slice(0,13);
    savedValueOne = +tempValue;
}

// This will reset various variables that need to be reset, and has logic to prevent the operations buttons breaking on next use.
let equalsButtonFinalProcess = function(operationString) {
    currentScreenValue = [];
    savedValueTwo = null;
    screenText.innerHTML = savedValueOne;
    waitingForFirstNumber = true;
    if (operationString === "equal") {
        operationInUse = "";
        justPressedEquals = true;
    } else {
        operationInUse = operationString;
        justPressedEquals = false;
    }
}

// The equals process will trigger if a chain of operations are used, or if the equals button is pressed. Depending on the order of events that has occured, justPressedEquals and waitingForFirstNumber will either be true or false. These flags will determine what functions are carried out, and prevent errors from occuring.
let equalsProcess = function(operationString) {
    if (justPressedEquals) operationInUse = operationString;

    savedValueTwo = (+currentScreenValue.join(""));
    switch (operationInUse) {
        case "remainder":
            if (!justPressedEquals && !waitingForFirstNumber) {
                savedValueOne = (savedValueOne%savedValueTwo);
                reduceFinalNumberLength();
            }            
            equalsButtonFinalProcess(operationString);
            break;
        case "divide":
            if (!justPressedEquals && !waitingForFirstNumber) {
                savedValueOne = (savedValueOne/savedValueTwo);
                reduceFinalNumberLength();
            }
            equalsButtonFinalProcess(operationString);
            break;
        case "multiply":
            if (!justPressedEquals && !waitingForFirstNumber) {
                savedValueOne = (savedValueOne*savedValueTwo);
                reduceFinalNumberLength();
            }            
            equalsButtonFinalProcess(operationString);
            break;
        case "minus":
            if (!justPressedEquals && !waitingForFirstNumber) {
                savedValueOne = (savedValueOne-savedValueTwo);
                reduceFinalNumberLength();
            }            
            equalsButtonFinalProcess(operationString);
            break;
        case "plus":
            if (!justPressedEquals && !waitingForFirstNumber) {
                savedValueOne = (savedValueOne+savedValueTwo);
                reduceFinalNumberLength();
            }            
            equalsButtonFinalProcess(operationString);
            break;
        default:
            if (savedValueOne === null) {
                currentScreenValue.length !== 0 ? savedValueOne = (+currentScreenValue.join("")) : savedValueOne = 0;

                currentScreenValue = [];
                waitingForFirstNumber = true;
                justPressedEquals = true;
            }
            break;
    }
}

// Main app - for each button on the calculator, do so on and so forth...
calcButtons.forEach(button => {
    button.addEventListener("click", () => {        
        if(button.classList.contains("opButton")) { // What to do if the button is an operation button.
            if (button.classList.contains("cancel")) { // If cancel button, run initialise function
                initialiseValues();
            }
            else if (button.classList.contains("back")) { // If backspace button, remove last number/decimal
                currentScreenValue.splice(currentScreenValue.length - 1);
                screenText.innerHTML = currentScreenValue.join("");

                if (currentScreenValue.length === 0) {
                    waitingForFirstNumber = true;
                    screenText.innerHTML = "0";
                }
            }
            else if (button.classList.contains("remainder")) {
                savedValueOne !== null ? equalsProcess("remainder") : saveCurrentArrayAndReset("remainder");
            }
            else if (button.classList.contains("divide")) {
                savedValueOne !== null ? equalsProcess("divide") : saveCurrentArrayAndReset("divide");
            }
            else if (button.classList.contains("multiply")) {
                savedValueOne !== null ? equalsProcess("multiply") : saveCurrentArrayAndReset("multiply");
            }
            else if (button.classList.contains("minus")) {
                savedValueOne !== null ? equalsProcess("minus") : saveCurrentArrayAndReset("minus");
            }
            else if (button.classList.contains("plus")) {
                savedValueOne !== null ? equalsProcess("plus") : saveCurrentArrayAndReset("plus");
            }
            else if (button.classList.contains("equal")) {
                equalsProcess("equal");
            }
        } else { // What to do if the button is a number or decimal.
            if (currentScreenValue.includes(".") && button.getAttribute("value") == ".") { // What to do if there is already a decimal place
                return;
            } else if(currentScreenValue.length >= TOTAL_CHARACTER_INPUT_ALLOWED_AMOUNT) {
                return;
            } else {
                if (waitingForFirstNumber && button.getAttribute("value") == ".") {
                    currentScreenValue.push("0");
                }
                if (waitingForFirstNumber && button.getAttribute("value") == "0") {
                    return;
                }
                waitingForFirstNumber = false;
                currentScreenValue.push(button.getAttribute("value"));
                screenText.innerHTML = currentScreenValue.join("");
                if (justPressedEquals) {
                    savedValueOne = null;
                }
            }
        }
    });
});

initialiseValues();