const display = document.getElementById("display");
const expressionDisplay = document.getElementById("expression");
const keypad = document.getElementById("keypad");

let currentInput = "0";
let firstValue = null;
let operator = null;
let waitingForSecondValue = false;
let expression = "";

function updateDisplay() {
    display.textContent = currentInput;
    expressionDisplay.textContent = expression;
}

function inputNumber(number) {

    if (waitingForSecondValue) {
        currentInput = number;
        waitingForSecondValue = false;
        return;
    }

    if (number === "." && currentInput.includes(".")) {
        return;
    }

    if (currentInput === "0" && number !== ".") {
        currentInput = number;
    } else {
        currentInput += number;
    }
}

function chooseOperator(nextOperator) {

    const inputValue = Number(currentInput);

    if (operator && waitingForSecondValue) {
        operator = nextOperator;
        expression = `${formatValue(firstValue)} ${operatorSymbol(nextOperator)}`;
        return;
    }

    if (firstValue === null) {
        firstValue = inputValue;
    } else if (operator) {

        const result = calculate(firstValue, inputValue, operator);

        if (result === "ERROR") {
            showError("Cannot divide by zero");
            return;
        }

        currentInput = String(result);
        firstValue = result;
    }

    operator = nextOperator;
    waitingForSecondValue = true;

    expression = `${formatValue(firstValue)} ${operatorSymbol(operator)}`;
}

function calculate(first, second, selectedOperator) {

    if (selectedOperator === "+") {
        return first + second;
    }

    if (selectedOperator === "-") {
        return first - second;
    }

    if (selectedOperator === "*") {
        return first * second;
    }

    if (selectedOperator === "/") {
        if (second === 0) {
            return "ERROR";
        }

        return first / second;
    }

    if (selectedOperator === "%") {
        return first % second;
    }
}

function equals() {

    if (operator === null || firstValue === null) {
        return;
    }

    const secondValue = Number(currentInput);

    const result = calculate(
        firstValue,
        secondValue,
        operator
    );

    if (result === "ERROR") {
        showError("Cannot divide by zero");
        return;
    }

    expression =
        `${formatValue(firstValue)} ${operatorSymbol(operator)} ${formatValue(secondValue)} =`;

    currentInput = String(formatValue(result));

    firstValue = null;
    operator = null;
    waitingForSecondValue = true;
}

function clearCalculator() {

    currentInput = "0";
    firstValue = null;
    operator = null;
    waitingForSecondValue = false;
    expression = "";

    updateDisplay();
}

function backspace() {

    if (waitingForSecondValue) {
        return;
    }

    if (currentInput.length === 1) {
        currentInput = "0";
    } else {
        currentInput = currentInput.slice(0, -1);
    }
}

function showError(message) {

    currentInput = message;
    firstValue = null;
    operator = null;
    waitingForSecondValue = true;
    expression = "";

    updateDisplay();
}

function formatValue(value) {

    if (!Number.isFinite(value)) {
        return "Error";
    }

    return Number(value.toFixed(10));
}

function operatorSymbol(value) {

    if (value === "*") return "×";
    if (value === "/") return "÷";
    if (value === "-") return "−";
    if (value === "+") return "+";
    if (value === "%") return "%";

    return value;
}

/* Event delegation — no inline onclick */

keypad.addEventListener("click", function(event) {

    const button = event.target.closest("button");

    if (!button) {
        return;
    }

    const number = button.dataset.number;
    const selectedOperator = button.dataset.operator;
    const action = button.dataset.action;

    if (number !== undefined) {
        inputNumber(number);
    }

    if (selectedOperator) {
        chooseOperator(selectedOperator);
    }

    if (action === "clear") {
        clearCalculator();
    }

    if (action === "backspace") {
        backspace();
    }

    if (action === "equals") {
        equals();
    }

    updateDisplay();
});

/* Keyboard support */

document.addEventListener("keydown", function(event) {

    const key = event.key;

    if (
        (key >= "0" && key <= "9") ||
        key === "."
    ) {
        inputNumber(key);
    }

    if (
        key === "+" ||
        key === "-" ||
        key === "*" ||
        key === "/" ||
        key === "%"
    ) {
        chooseOperator(key);
    }

    if (key === "Enter" || key === "=") {
        equals();
    }

    if (key === "Backspace") {
        backspace();
    }

    if (key === "Escape") {
        clearCalculator();
    }

    updateDisplay();
});

updateDisplay();