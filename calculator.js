const fomularDisplay = document.getElementById("formulaDisplay");
const resultDisplay = document.getElementById("resultDisplay");

let Status = "num"

// 숫자 버튼 클릭 시 fomularDisplay 표시
const btnNumber = document.querySelectorAll(".btnNumber")
btnNumber.forEach(button => {
    button.addEventListener("click", () => {
        const clickedNum = button.textContent;
        Status = "num";
        fomularDisplay.textContent += clickedNum;
    })
})
// 연산자 버튼 클릭 시 fomularDisplay 표시
const btnOperator = document.querySelectorAll(".btnOperator")
btnOperator.forEach(button => {
    button.addEventListener("click", () => {
        const clickedOperator = button.textContent;
        if (Status === "operator") return;
        else {
            Status = "operator"
            fomularDisplay.textContent += clickedOperator;
        }
    })
})
// AC 버튼 클릭 fomularDisplay reset
const btnReset = document.getElementById("btnReset");
btnReset.addEventListener("click", () => {
    fomularDisplay.textContent = "";
})