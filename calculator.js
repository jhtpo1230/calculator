const formularDisplay = document.getElementById("formularDisplay");
const resultDisplay = document.getElementById("resultDisplay");

const operatorSet = new Set(["+", "-", "×", "÷", "*", "/"]);
const operatorMap = {
    "+": "+",
    "-": "-",
    "*": "×",
    "/": "÷",
};
let formular = "";

function formularResizeFont() {
    let maxWidth = formularDisplay.clientWidth;
    let fontSize = 30;
    let minFontSize = 20;
    formularDisplay.style.fontSize = fontSize + "px";

    while (formularDisplay.scrollWidth > maxWidth && fontSize > minFontSize) {
        fontSize--;
        formularDisplay.style.fontSize = fontSize + "px";
    }
    if (fontSize <= minFontSize) {
        alert("수식이 너무 깁니다!");
        formular = "";
        formularDisplay.textContent = "";
    }
}
function resultResizeFont() {
    let maxWidth = resultDisplay.clientWidth;
    let fontSize = 50;
    let minFontSize = 30;
    resultDisplay.style.fontSize = fontSize + "px";

    while (resultDisplay.scrollWidth > maxWidth && fontSize > minFontSize) {
        fontSize--;
        resultDisplay.style.fontSize = fontSize + "px";
    }
}

function calculate(num1, op, num2) {
    switch (op) {
        case "+":
            return num1 + num2;
        case "-":
            return num1 - num2;
        case "×":
            return num1 * num2;
        case "÷":
            if (num2 == 0) {
                alert("0으로 나눌 수 없습니다.");
            }
            return num1 / num2;
    }
}

function clickedEqualLogic() {
    const lastOperatorIsExist = operatorSet.has(formular[formular.length - 1])
        ? formular.slice(0, -1)
        : formular;
    const firstMinusIsExist =
        lastOperatorIsExist[0] == "-"
            ? "0" + lastOperatorIsExist
            : lastOperatorIsExist;

    const resolvedFormular = firstMinusIsExist;

    let formularTokens = resolvedFormular.match(/(\d+(\.\d+)?|[+-×÷])/g);
    formularTokens = formularTokens.map((item) => {
        return isNaN(item) ? item : Number(item);
    });

    let finalFormular = [];
    let operatorIndex = 1;
    while (formularTokens.includes("×") || formularTokens.includes("÷")) {
        if (operatorIndex == 1) {
            if (
                formularTokens[operatorIndex] == "×" ||
                formularTokens[operatorIndex] == "÷"
            ) {
                let firstOperatorResult = calculate(
                    formularTokens[0],
                    formularTokens[1],
                    formularTokens[2]
                );
                finalFormular.push(firstOperatorResult);
                formularTokens[1] = null;
                operatorIndex += 2;
            } else {
                finalFormular.push(formularTokens[0]);
                finalFormular.push(formularTokens[1]);
                finalFormular.push(formularTokens[2]);
                operatorIndex += 2;
            }
        } else {
            if (
                formularTokens[operatorIndex] == "×" ||
                formularTokens[operatorIndex] == "÷"
            ) {
                let multiplicativeResult = calculate(
                    finalFormular[finalFormular.length - 1],
                    formularTokens[operatorIndex],
                    formularTokens[operatorIndex + 1]
                );
                finalFormular.pop();
                finalFormular.push(multiplicativeResult);
                formularTokens[operatorIndex] = null;
                operatorIndex += 2;
            } else {
                finalFormular.push(formularTokens[operatorIndex]);
                finalFormular.push(formularTokens[operatorIndex + 1]);
                operatorIndex += 2;
            }
        }
    }

    let result = 0;
    if (finalFormular.length == 0) {
        result = formularTokens[0];
        for (let index = 1; index < formularTokens.length; index += 2) {
            result = calculate(
                result,
                formularTokens[index],
                formularTokens[index + 1]
            );
        }
    } else {
        for (
            let index = operatorIndex;
            index < formularTokens.length;
            index++
        ) {
            finalFormular.push(formularTokens[index]);
        }
        result = finalFormular[0];
        for (let index = 1; index < finalFormular.length; index += 2) {
            result = calculate(
                result,
                finalFormular[index],
                finalFormular[index + 1]
            );
        }
    }
    resultDisplay.textContent = result;
    resultResizeFont();
}

function decimalPointIsExist() {
    let str = "";
    for (let index = formular.length - 1; index >= 0; index--) {
        const char = formular[index];
        if (operatorSet.has(char)) break;
        else str += char;
    }
    let pointExist = str.includes(".") ? true : false;
    return pointExist;
}

function operatorBehindIsZeroExist() {
    let formularToken = "";

    for (let index = formular.length - 1; index >= 0; index--) {
        const char = formular[index];
        if (operatorSet.has(char)) break;
        else formularToken += char;
    }
    let firstZeroIsExist =
        formularToken[formularToken.length - 1] == "0" ? true : false;
    return firstZeroIsExist;
}

function clickedNumberLogic(clickedNum) {
    if (formular == "0") {
        formularDisplay.textContent = clickedNum;
        formularResizeFont();
        formular = clickedNum;
    } else if (operatorBehindIsZeroExist() && decimalPointIsExist()) {
        formularDisplay.textContent += clickedNum;
        formularResizeFont();
        formular += clickedNum;
    } else if (operatorBehindIsZeroExist()) {
        formularDisplay.textContent =
            formularDisplay.textContent.slice(0, -1) + clickedNum;
        formularResizeFont();
        formular = formular.slice(0, -1) + clickedNum;
    } else {
        formularDisplay.textContent += clickedNum;
        formularResizeFont();
        formular += clickedNum;
    }
}
const btnNumber = document.querySelectorAll(".btnNumber");
btnNumber.forEach((button) => {
    button.addEventListener("click", () => {
        const clickedNum = button.textContent;
        clickedNumberLogic(clickedNum);
    });
});

function clickedOperatorLogic(clickedOperator) {
    let lastChar =
        formularDisplay.textContent[formularDisplay.textContent.length - 1];

    if (resultDisplay.textContent != "") {
        formularDisplay.textContent = resultDisplay.textContent;
        formularResizeFont();
        formular = formularDisplay.textContent;
        resultDisplay.textContent = "";
        return;
    }
    if (formular == "" && clickedOperator == "-") {
        formularDisplay.textContent += clickedOperator;
        formular += clickedOperator;
        return;
    }

    if (operatorSet.has(lastChar) || lastChar == undefined) return;
    else if (lastChar == ".") {
        formularDisplay.textContent += "0" + clickedOperator;
        formularResizeFont();
        formular += "0" + clickedOperator;
    } else {
        formularDisplay.textContent += clickedOperator;
        formularResizeFont();
        formular += clickedOperator;
    }
}
const btnOperator = document.querySelectorAll(".btnOperator");
btnOperator.forEach((button) => {
    button.addEventListener("click", () => {
        const clickedOperator = button.textContent;
        clickedOperatorLogic(clickedOperator);
    });
});

function clickedDecimalPointLogic() {
    let lastChar =
        formularDisplay.textContent[formularDisplay.textContent.length - 1];
    if (lastChar == ".") {
        return;
    } else if (formular == "" || operatorSet.has(lastChar)) {
        formularDisplay.textContent += "0.";
        formularResizeFont();
        formular += "0.";
    } else if (!operatorSet.has(lastChar) && decimalPointIsExist() == false) {
        formularDisplay.textContent += ".";
        formularResizeFont();
        formular += ".";
    } else {
        return;
    }
}
const btnDecimalPoint = document.getElementById("btnDecimalPoint");
btnDecimalPoint.addEventListener("click", () => {
    clickedDecimalPointLogic();
});

function clickedEraseLogic(clickedErase) {
    if (clickedErase == "AC" || clickedErase == "Escape") {
        formularDisplay.textContent = "";
        formular = "";
        resultDisplay.textContent = "";
    } else {
        if (resultDisplay.textContent !== "") {
            formularDisplay.textContent = "";
            formular = "";
            resultDisplay.textContent = "";
        } else {
            formularDisplay.textContent = formularDisplay.textContent.slice(
                0,
                -1
            );
            formular = formular.slice(0, -1);
        }
    }
}

const btnErase = document.querySelectorAll(".btnErase");
btnErase.forEach((button) => {
    button.addEventListener("click", () => {
        const clickedErase = button.textContent;
        clickedEraseLogic(clickedErase);
    });
});

const printResultDisplay = document.getElementById("btnEqual");
printResultDisplay.addEventListener("click", () => {
    clickedEqualLogic();
});

document.addEventListener("keydown", (event) => {
    const keyboardInput = event.key;
    if (keyboardInput === " ") return;

    if (!isNaN(keyboardInput)) {
        const clickedNum = keyboardInput;
        clickedNumberLogic(clickedNum);
    } else if (operatorSet.has(keyboardInput)) {
        const clickedOperator = operatorMap[keyboardInput];
        clickedOperatorLogic(clickedOperator);
    } else if (keyboardInput === ".") {
        clickedDecimalPointLogic();
    } else if (keyboardInput === "Backspace" || keyboardInput === "Escape") {
        const clickedErase = keyboardInput;
        clickedEraseLogic(clickedErase);
    } else if (keyboardInput === "Enter") {
        clickedEqualLogic();
    }
});
