/**
 * @param {number} value 
 */
function formatVal(value) {
    let strVal = value.toPrecision(12).replace("+", "")

    if (strVal.includes("e")) {
        
    } else return strVal
}

console.log(formatVal(123456789))