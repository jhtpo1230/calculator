const formularDisplay = document.getElementById("formularDisplay");
const resultDisplay = document.getElementById("resultDisplay");

const operatorSet = new Set(["+", "-", "×", "÷", "*", "/"]);
const operatorMap = {
    "+": "+",
    "-": "-",
    "*": "×",
    "/": "÷",
};

function resizeFont() {
    let maxWidth = formularDisplay.clientWidth;
    let fontSize = 30; // 시작 폰트 크기
    let minFontSize = 20;
    formularDisplay.style.fontSize = fontSize + "px";

    // 텍스트가 박스 너비보다 클 경우 폰트 줄이기
    while (formularDisplay.scrollWidth > maxWidth && fontSize > minFontSize) {
        fontSize--;
        formularDisplay.style.fontSize = fontSize + "px";
    }
    if(fontSize <= minFontSize) {
        alert("수식이 너무 깁니다!");
        formula = "";
        formularDisplay.textContent = "";
    }
}
function resizeFont2() {
    let maxWidth = resultDisplay.clientWidth;
    let fontSize = 50; // 시작 폰트 크기
    let minFontSize = 30;
    resultDisplay.style.fontSize = fontSize + "px";

    // 텍스트가 박스 너비보다 클 경우 폰트 줄이기
    while (resultDisplay.scrollWidth > maxWidth && fontSize > minFontSize) {
        fontSize--;
        resultDisplay.style.fontSize = fontSize + "px";
    }
}

let formula = "";

function operator(num1, op, num2) {
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

function calculate() {
    const finalFormula = formula;

    // 숫자와 연산자를 분리12/3
    let tokens = finalFormula.match(/(\d+(\.\d+)?|[+-×÷])/g);
    tokens = tokens.map((item) => {
        return isNaN(item) ? item : Number(item);
    });

    let onlyPlusMinus = []; //숫자랑 +,-만 남게하기 위한 배열
    let operatorIndex = 1;
    while (tokens.includes("×") || tokens.includes("÷")) {
        if (operatorIndex == 1) {
            if (tokens[operatorIndex] == "×" || tokens[operatorIndex] == "÷") {
                let resultTemp = operator(tokens[0], tokens[1], tokens[2]);
                onlyPlusMinus.push(resultTemp);
                tokens[1] = null;
                operatorIndex += 2;
            } else {
                onlyPlusMinus.push(tokens[0]);
                onlyPlusMinus.push(tokens[1]);
                onlyPlusMinus.push(tokens[2]);
                operatorIndex += 2;
            }
        } else {
            if (tokens[operatorIndex] == "×" || tokens[operatorIndex] == "÷") {
                let resultTemp = operator(
                    onlyPlusMinus[onlyPlusMinus.length - 1],
                    tokens[operatorIndex],
                    tokens[operatorIndex + 1]
                );
                onlyPlusMinus.pop();
                onlyPlusMinus.push(resultTemp);
                tokens[operatorIndex] = null;
                operatorIndex += 2;
            } else {
                onlyPlusMinus.push(tokens[operatorIndex]);
                onlyPlusMinus.push(tokens[operatorIndex + 1]);
                operatorIndex += 2;
            }
        }
    }
    //곱셈과 나눗셈 연산이 끝난 뒤 push
    let result = 0;
    if (onlyPlusMinus.length == 0) {
        result = tokens[0];
        for (let index = 1; index < tokens.length; index += 2) {
            result = operator(result, tokens[index], tokens[index + 1]);
        }
    } else {
        for (let index = operatorIndex; index < tokens.length; index++) {
            onlyPlusMinus.push(tokens[index]);
        }
        result = onlyPlusMinus[0];
        for (let index = 1; index < onlyPlusMinus.length; index += 2) {
            result = operator(
                result,
                onlyPlusMinus[index],
                onlyPlusMinus[index + 1]
            );
        }
    }
    resultDisplay.textContent = result;
    resizeFont2();
}

// 소수점(.) 버튼 클릭 시 앞에 소수점 존재 여부 확인
function decimalPointIsExist() {
    let str = "";

    for (let index = formula.length - 1; index >= 0; index--) {
        const char = formula[index];
        if (operatorSet.has(char)) break;
        else str += char;
    }
    let pointExist = str.includes(".") ? true : false;
    return pointExist;
}
function operatorBehindZeroCheck() {
    let str = "";

    for (let index = formula.length - 1; index >= 0; index--) {
        const char = formula[index];
        if (operatorSet.has(char)) break;
        else str += char;
    }
    let firstZeroExist = str[str.length - 1] == "0" ? true : false;
    return firstZeroExist;
}
// 숫자 버튼 클릭 시 formularDisplay 표시
function btnNumberLogic(clickedNum) {
    if (formula == "0") {
        formularDisplay.textContent = clickedNum;
        resizeFont()
        formula = clickedNum;
    } else if (operatorBehindZeroCheck() && decimalPointIsExist()) {
        formularDisplay.textContent += clickedNum;
        resizeFont()
        formula += clickedNum;
    } else if (operatorBehindZeroCheck()) {
        formularDisplay.textContent =
            formularDisplay.textContent.slice(0, -1) + clickedNum;
        resizeFont()
        formula = formula.slice(0, -1) + clickedNum;
    } else {
        formularDisplay.textContent += clickedNum;
        resizeFont()
        formula += clickedNum;
    }
}
const btnNumber = document.querySelectorAll(".btnNumber");
btnNumber.forEach((button) => {
    button.addEventListener("click", () => {
        const clickedNum = button.textContent;
        btnNumberLogic(clickedNum);
    });
});
// 연산자 버튼 클릭 시 formularDisplay 표시
const btnOperator = document.querySelectorAll(".btnOperator");
btnOperator.forEach((button) => {
    button.addEventListener("click", () => {
        const clickedOperator = button.textContent;
        let lastChar =
            formularDisplay.textContent[formularDisplay.textContent.length - 1];

        if (resultDisplay.textContent != "") {
            formularDisplay.textContent = resultDisplay.textContent;
            resizeFont()
            formula = formularDisplay.textContent;
            resultDisplay.textContent = "";
        }

        if (operatorSet.has(lastChar) || lastChar == undefined) return;
        else if (lastChar == ".") {
            // 소수점 다음 숫자 x + 연산자
            formularDisplay.textContent += "0" + clickedOperator;
            resizeFont()
            formula += "0" + clickedOperator;
        } else {
            formularDisplay.textContent += clickedOperator;
            resizeFont()
            formula += clickedOperator;
        }
    });
});
// =
const printResultDisplay = document.getElementById("btnEqual");
printResultDisplay.addEventListener("click", () => {
    calculate();
});

const btnErase = document.querySelectorAll(".btnErase");
btnErase.forEach((button) => {
    button.addEventListener("click", () => {
        const clickedErase = button.textContent;
        if (clickedErase == "AC") {
            formularDisplay.textContent = "";
            formula = "";
            resultDisplay.textContent = "";
        } else {
            if (resultDisplay.textContent !== "") {
                formularDisplay.textContent = "";
                formula = "";
                resultDisplay.textContent = "";
            } else {
                formularDisplay.textContent = formularDisplay.textContent.slice(
                    0,
                    -1
                );
                formula = formula.slice(0, -1);
            }
        }
    });
});

const btnDecimalPoint = document.getElementById("btnDecimalPoint");
btnDecimalPoint.addEventListener("click", () => {
    let lastChar =
        formularDisplay.textContent[formularDisplay.textContent.length - 1];
    if (formula == "" || lastChar == ".") {
        return;
    } else if (operatorSet.has(lastChar)) {
        // 마지막 문자가 연산자
        formularDisplay.textContent += "0.";
        resizeFont()
        formula += "0.";
    } // 마지막 문자가 숫자 + 그 뒤로 소수점 x
    else if (!operatorSet.has(lastChar) && decimalPointIsExist() == false) {
        formularDisplay.textContent += ".";
        resizeFont()
        formula += ".";
    } else {
        return;
    }
});

// 키보드 입력
document.addEventListener("keydown", (event) => {
    const keyboardInput = event.key;
    if (keyboardInput === " ") return;

    // 숫자 키 (0~9)
    if (!isNaN(keyboardInput)) {
        const clickedNum = keyboardInput;
        btnNumberLogic(clickedNum);
    }

    // 연산자 키
    else if (operatorSet.has(keyboardInput)) {
        const clickedOperator = operatorMap[keyboardInput];

        let lastChar =
            formularDisplay.textContent[formularDisplay.textContent.length - 1];

        if (resultDisplay.textContent != "") {
            formularDisplay.textContent = resultDisplay.textContent;
            resizeFont()
            formula = formularDisplay.textContent;
            resultDisplay.textContent = "";
        }

        if (operatorSet.has(lastChar) || lastChar == undefined) return;
        else if (lastChar == ".") {
            // 소수점 다음 숫자 x + 연산자
            formularDisplay.textContent += "0" + clickedOperator;
            resizeFont()
            formula += "0" + clickedOperator;
        } else {
            formularDisplay.textContent += clickedOperator;
            resizeFont()
            formula += clickedOperator;
        }
    }
    // 소수점
    else if (keyboardInput === ".") {
        let lastChar =
            formularDisplay.textContent[formularDisplay.textContent.length - 1];
        if (formula == "" || lastChar == ".") {
            return;
        } else if (operatorSet.has(lastChar)) {
            // 마지막 문자가 연산자
            formularDisplay.textContent += "0.";
            resizeFont()
            formula += "0.";
        } // 마지막 문자가 숫자 + 그 뒤로 소수점 x
        else if (!operatorSet.has(lastChar) && decimalPointIsExist() == false) {
            formularDisplay.textContent += ".";
            resizeFont()
            formula += ".";
        } else {
            return;
        }
    }
    // 지우기
    else if (keyboardInput === "Backspace" || keyboardInput === "Escape") {
        const clickedErase = keyboardInput;
        if (clickedErase == "Escape") {
            formularDisplay.textContent = "";
            formula = "";
            resultDisplay.textContent = "";
        } else {
            formularDisplay.textContent = formularDisplay.textContent.slice(
                0,
                -1
            );
            formula = formula.slice(0, -1);
        }
    }

    // 엔터(=) 키
    else if (keyboardInput === "Enter") {
        calculate();
    }
});