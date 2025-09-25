const formularDisplay = document.getElementById("formulaDisplay");
const resultDisplay = document.getElementById("resultDisplay");
const operatorSet = new Set(["+", "-", "÷", "×"]);
let formula = "";

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
// 숫자 버튼 클릭 시 formularDisplay 표시
const btnNumber = document.querySelectorAll(".btnNumber");
btnNumber.forEach((button) => {
    button.addEventListener("click", () => {
        const clickedNum = button.textContent;
        formularDisplay.textContent += clickedNum;
        formula += clickedNum;
    });
});
// 연산자 버튼 클릭 시 formularDisplay 표시
const btnOperator = document.querySelectorAll(".btnOperator");
btnOperator.forEach((button) => {
    button.addEventListener("click", () => {
        const clickedOperator = button.textContent;
        let lastChar =
            formularDisplay.textContent[formularDisplay.textContent.length - 1];
        if (operatorSet.has(lastChar) || lastChar == undefined) return;
        else if (lastChar == ".") { // 소수점 다음 숫자 x + 연산자
            formularDisplay.textContent += "0" + clickedOperator;
            formula += "0" + clickedOperator;
        } else {
            formularDisplay.textContent += clickedOperator;
            formula += clickedOperator;
        }
    });
});
//
const btnErase = document.querySelectorAll(".btnErase");
btnErase.forEach((button) => {
    button.addEventListener("click", () => {
        const clickedErase = button.textContent;
        if (clickedErase == "AC") {
            formularDisplay.textContent = "";
            formula = "";
        } else {
            formularDisplay.textContent = formularDisplay.textContent.slice(0, -1);
            formula = formula.slice(0, -1);
        }
    });
});

const btnDecimalPoint = document.getElementById("btnDecimalPoint");
btnDecimalPoint.addEventListener("click", () => {
    let lastChar =
        formularDisplay.textContent[formularDisplay.textContent.length - 1];
    if (formula == "" || lastChar == ".") { return; }
    else if (operatorSet.has(lastChar)) { // 마지막 문자가 연산자
        formularDisplay.textContent += "0.";
        formula += "0."
    } // 마지막 문자가 숫자 + 그 뒤로 소수점 x
    else if (!operatorSet.has(lastChar) && decimalPointIsExist() == false) {
        formularDisplay.textContent += ".";
        formula += "."
    } else {
        return;
    }
});