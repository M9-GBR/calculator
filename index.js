import Calculator from "./calc/calc.js"

document.addEventListener('DOMContentLoaded', () => {
    window.calc = new Calculator(document.getElementById('calc-div'), 'main')
})