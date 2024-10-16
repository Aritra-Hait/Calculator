let displayValue = "";

const display = document.querySelector('.display');

const buttons = document.querySelectorAll("button");

const digits = document.querySelectorAll(".digit");
[...digits].forEach((digit) => digit.addEventListener("click", showDigit));

const operators = document.querySelectorAll(".op");
[...operators].forEach((digit) => digit.addEventListener("click", calculate));

function operate(num1, op, num2) {
    let ans;
    if (op === '+')
        ans = num1 + num2;
    else if (op === '-')
        ans = num1 - num2;
    else if (op === '×')
        ans = num1 * num2;
    else if (op === '%')
        ans = num1 % num2;
    else
        ans = num1 / num2;
    return ans;
}

function setDisplay(str) {
    displayValue = str;
    display.textContent = displayValue;
}

function updateDisplay(str) {
    displayValue += str;
    display.textContent = displayValue;
}

function clearDisplay() {
    displayValue = "";
    display.textContent = displayValue;
}

function showDigit() {
    updateDisplay(this.dataset.digit);
}

function showArithmetic(operator) {
    if (
        displayValue.split(" ").some((v) => {
            return ["+", "-", "×", "/", "%"].includes(v);  //To split the expression and check if any operator is present 
        })
    ) {
        const result = getResult(displayValue);
        if (Number.isNaN(+result)) setDisplay(result);
        else setDisplay(`${result} ${operator} `);
    } else {
        updateDisplay(` ${operator} `);
    }
}

function handleAthematicMessage() {
    setTimeout(() => {               //It's used to delay the addition of the event listener slightly,
        buttons.addEventListener(    //ensuring any pending UI updates are processed before handling button clicks.
            "click",
            (e) => {
                if (e.target.className == "digit") {
                    setDisplay(e.target.dataset.digit); //e.target refers to the element which is button in this case
                } else {
                    clearDisplay();
                }
            },
            { once: true }  // the click event on buttons will only be handled the first time it occurs, 
            //and then the listener will be automatically removed.
        );
    }, 1);
}

function formatLargeNumber(number, maxDigits = 14) {
    // Convert to string to count digits
    let numStr = Math.abs(number).toString();

    if (numStr.length <= maxDigits) {
        // If within maxDigits, return as is
        return number.toString();
    } else {
        // If more than maxDigits, use toExponential or toPrecision
        if (
            number >= 10 ** maxDigits ||
            number <= -(10 ** maxDigits) ||
            (number > 0 && number < 10 ** -(maxDigits - 1)) ||
            (number < 0 && number > -(10 ** -(maxDigits - 1)))
        ) {
            // Use scientific notation for very large or very small numbers
            return number.toExponential(maxDigits - 1); // 1 digit for integer part + (maxDigits-1) decimal places
        } else {
            // For numbers that don't need scientific notation, round to maxDigits significant digits
            return number.toPrecision(maxDigits);
        }
    }
}

function getResult(str = "") {
    if (!str.includes(" ")) {
        str = `${str} + `;
    }
    const equationArray = str.split(" ");
    const [a, op, b] = equationArray;

    if (op == "/" && !+b) {
        handleAthematicMessage();
        return "Math Error";
    }
    const result = operate(+a, op, +b);
    if (Number.isNaN(result)) {
        handleAthematicMessage();
        return "Wrong Input";
    }
    return formatLargeNumber(result, 8);
}

function calculate() {
    const operator = this.dataset.op;

    if (["+", "-", "×", "/", "%"].includes(operator)) {
        showArithmetic.call(this, operator);
    } else if (operator === "=") {
        const result = getResult(displayValue);
        setDisplay(`${result}`);
    } else if (operator === "ac") {
        clearDisplay();
    } else if (operator === "backspace") {
        const equationArray = displayValue.split(" ");
        if (equationArray.length === 1) setDisplay(displayValue.slice(0, -1));
        else if (!!equationArray[2]) setDisplay(displayValue.slice(0, -1));
        else setDisplay(equationArray[0]);
    }
}
