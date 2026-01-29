function get(string) {
    return document.querySelector(`${string}`)
}

const calcDisplayWrap = get("#calc-display"),
    mainDisp = get("#main-display"),
    digitWrap = get("#digit-wrap"),
    endMinus = get("#end-minus .display"),
    memoryDisplay = get("#m-elem .display"),
    errorDisplay = get("#e-elem .display"),
    themeBtn = get("#theme-btn")

const calculator = {
    _state: 1,
    get state() {
        return this._state
    },
    set state(val) {
        this._state = val
        this.updateDisplay()
    },
    get stateValue() {
        return this.state == 1 ? this.value1 : this.state == 2 ? this.value2 : this.value3
    },
    set stateValue(str) {
        this["value" + this.state] = str
    },
    digits: 12,
    memory: null,
    value1: "0",
    value2: null,
    value3: null,
    operation: null,
    start() {
        this.memory = localStorage.getItem("mem")
        this.updateDisplay()
    },
    clearDisplay() {
        document.querySelectorAll(".digit").forEach(elem => {
            let disp = elem.getElementsByClassName("display")[0]
            disp.textContent = ""
            disp.classList.remove("minus")
        })

        document.querySelectorAll(".decimal").forEach(elem => {
            elem.getElementsByClassName("display")[0].classList.add("hide")
        })

        memoryDisplay.classList.add("hide")
        errorDisplay.classList.add("hide")
    },
    formatVal(value = 0) {
        function cleanNumStr(str = "") {
            return str.replace(/(?<=\.\d*)0+$/, "").replace(/\.$/, "")
        }

        let strVal = cleanNumStr(value.toPrecision(this.digits - (value.toString().startsWith("0.") ? 1 : 0)).replace("+", ""))

        if (strVal.includes("e")) {
            let [decimalStr, expoStr] = strVal.split("e"),
                valsLeft = this.digits - (expoStr.length + 1)

            decimalStr = Number(decimalStr) + ""

            if (decimalStr.replace("-", "").replace(".", "").length > valsLeft) {
                decimalStr = Number(decimalStr).toPrecision(valsLeft)
            }

            return decimalStr + "e" + expoStr
        } else return strVal
    },
    updateDisplay() {
        if (this.stateValue != "Infinity" && this.stateValue != "NaN") {
            this.clearDisplay()

            let strVal = this.stateValue.replace("+", ""),
                isNegative = strVal[0] == "-",
                isDecimal = strVal.includes("."),
                displayList = strVal.replace(/^-/, "").replace(".", "").split("")

            displayList.reverse().forEach((s, i) => {
                let display = document.getElementById("digit" + (i + 1)).querySelector(".display")
                display.textContent = s
            })

            if (isDecimal) {
                let decimalIndex = strVal.split(".")[1].length + 1

                document.querySelector(`#decimal${decimalIndex} .display`).classList.remove("hide")
            } else {
                document.querySelector("#decimal1 .display").classList.remove("hide")
            }

            if (isNegative) {
                let minusIndex = displayList.length + 1

                if (displayList.length != this.digits) {
                    let elem = document.querySelector(`#digit${minusIndex} .display`)

                    if (elem) {
                        elem.textContent = "-"
                    }
                } else {
                    endMinus.classList.remove("hide")
                }
            }

            [...document.getElementsByClassName("display")].forEach(e => {
                if (e.textContent == "-") e.classList.add("minus")
            })
        } else {
            errorDisplay.classList.remove("hide")
        }

        this.updateMemoryDiplay()
    },
    blinkDisplay() {
        mainDisp.style.opacity = "0"
        setTimeout(() => mainDisp.style.opacity = "1", 50)
    },
    inputVal(val) {
        if (errorDisplay.classList.contains("hide")) {
            val = val + ""

            if (this.state == 1 && this.operation) {
                this.value2 = "0"
                this.state = 2
            }

            if (this.state == 3) {
                this.value1 = "0"
                this.state = 1
                this.value2 = null
                this.value3 = null
                this.operation = null
            }

            if (this.state != 3 && !this.stateValue.includes("e")) {
                if (this.stateValue == "0") this.stateValue = ""

                if (this.stateValue.replace(/^-/, "").replace(".", "").length != 12) {
                    let newVal = this.stateValue + val

                    if (newVal.replace(/^-/, "").replace(".", "").length <= 12) {
                        this.stateValue = newVal
                    }
                }
            }

            this.updateDisplay()
        }
    },
    backSpace() {
        if (errorDisplay.classList.contains("hide")) {
            if (this.state == 1 && this.operation) this.state = 2
            else if (this.state == 3) this.clearEverything()

            let str = this.stateValue,
                lastVal = str[str.length - 1]

            this.stateValue = this.stateValue.slice(0, str.length - 1)

            if (this.stateValue == "-") this.stateValue = "0"

            if (this.stateValue == "") this.stateValue = "0"

            this.updateDisplay()
        }
    },
    clear() {
        if (this.state != 3) {
            this.stateValue = "0"
            this.updateDisplay()
            this.blinkDisplay()
        } else this.clearEverything()
    },
    clearEverything() {
        this.value1 = "0"
        this.value2 = null
        this.value3 = null
        this.operation = null
        this.state = 1
        this.blinkDisplay()
    },
    addDecimal() {
        if (errorDisplay.classList.contains("hide")) {
            if (this.state == 1 && this.operation) {
                this.value2 = "0"
                this.state = 2
            }

            if (this.state == 3) {
                this.clearEverything()
                this.state = 1
            }

            if (!this.stateValue.includes(".")) {
                this.stateValue = this.stateValue + "."
                this.updateDisplay()
            }
        }
    },
    toggleNegation() {
        if (this.state < 3 && !this.stateValue.match(/^0\.*$/) && errorDisplay.classList.contains("hide")) {
            let isNeg = this.stateValue.indexOf("-") == 0

            if (isNeg) this.stateValue = this.stateValue.replace(/^-/, "")
            else this.stateValue = "-" + this.stateValue

            this.updateDisplay()
        }
    },
    square() {
        if (errorDisplay.classList.contains("hide")) {
            this.value3 = this.formatVal(Math.pow(+this.stateValue, 2))
            this.state = 3
            this.blinkDisplay()
        }
    },
    squareRoot() {
        if (errorDisplay.classList.contains("hide")) {
            this.value3 = this.formatVal(Math.sqrt(+this.stateValue))
            this.state = 3
            this.blinkDisplay()
        }
    },
    changeOperation(operation) {
        if (errorDisplay.classList.contains("hide")) {
            if (this.state == 2) {
                this.execute()
            } else if (this.state == 3) {
                this.state = 1
                this.value1 = this.value3
                this.value2 = null
                this.value3 = null
                this.updateDisplay()
            }

            this.operation = operation
            this.blinkDisplay()
        }
    },
    execute() {
        if (errorDisplay.classList.contains("hide")) {
            if (!this.operation) this.operation = "add"
            if (this.state == 1) {
                this.value2 = "0"
                this.state = 2
            }

            this.value3 = "0"
            this.state = 3

            let ans
            switch (this.operation) {
                case "add":
                    ans = +this.value1 + (+this.value2)
                    this.value3 = this.formatVal(ans)
                    break
                case "sub":
                    ans = +this.value1 - (+this.value2)
                    this.value3 = this.formatVal(ans)
                    break
                case "mul":
                    ans = +this.value1 * (+this.value2)
                    this.value3 = this.formatVal(ans)
                    break
                case "div":
                    ans = +this.value1 / (+this.value2)
                    this.value3 = this.formatVal(ans)
                    break
            }

            this.value1 = this.value3

            this.updateDisplay()

            this.blinkDisplay()
        }
    },
    updateMemoryDiplay() {
        if (this.memory != null) {
            memoryDisplay.classList.remove("hide")
        } else {
            memoryDisplay.classList.add("hide")
        }
    },
    memorySave() {
        if (errorDisplay.classList.contains("hide")) {
            this.memory = this.stateValue
            localStorage.setItem("mem", this.memory)
            this.updateMemoryDiplay()
        }
    },
    memorySubtract() {
        if (this.memory) {
            let val = +this.memory
            this.memory = this.formatVal(val - 1)
            localStorage.setItem("mem", this.memory)
        }
    },
    memoryAdd() {
        if (this.memory) {
            let val = +this.memory
            this.memory = this.formatVal(val + 1)
            localStorage.setItem("mem", this.memory)
        }
    },
    memoryClear() {
        this.memory = null
        localStorage.removeItem("mem")
        this.updateMemoryDiplay()
    },
    memoryRecall() {
        if (this.memory) {
            if (this.state == 3) this.clearEverything()

            this.stateValue = this.memory
            this.updateDisplay()
            this.blinkDisplay()
        }
    }
}

function createDisplay() {
    let digit = document.getElementsByClassName("digit")[0],
        decimal = document.getElementsByClassName("decimal")[0]

    get("#calc-head div:nth-of-type(2)").textContent = calculator.digits + " Digit Display"

    digit.remove()
    decimal.remove()

    for (let i = 0; i < calculator.digits; i++) {
        let digitElem = digit.cloneNode(true),
            decimalElem = decimal.cloneNode(true)

        digitElem.id = "digit" + (calculator.digits - i)
        decimalElem.id = "decimal" + (calculator.digits - i)

        digitWrap.append(digitElem, decimalElem)
    }
}

createDisplay()

let keysList = [],
    formatCode = (code = "") => {
        return code.replace(/ShiftLeft|ShiftRight/, "Shift")
            .replace(/ControlLeft|ControlRight/, "Control")
            .replace(/AltLeft|AltRight/, "Alt")
            .replace(/Key|Digit/, "")
    },
    functions = {
        "1": () => calculator.inputVal(1),
        "2": () => calculator.inputVal(2),
        "3": () => calculator.inputVal(3),
        "4": () => calculator.inputVal(4),
        "5": () => calculator.inputVal(5),
        "6": () => calculator.inputVal(6),
        "7": () => calculator.inputVal(7),
        "8": () => calculator.inputVal(8),
        "9": () => calculator.inputVal(9),
        "0": () => calculator.inputVal(0),
        "Shift-Minus": () => calculator.toggleNegation(),
        "Shift-2": () => calculator.square(),
        "Control-2": () => calculator.squareRoot(),
        "+": () => calculator.changeOperation("add"),
        "-": () => calculator.changeOperation("sub"),
        "/": () => calculator.changeOperation("div"),
        "*": () => calculator.changeOperation("mul"),
        ".": () => calculator.addDecimal(),
        "=": () => calculator.execute(),
        "Backspace": () => calculator.backSpace(),
        "Escape": () => calculator.clear(),
        "Shift-Escape": () => calculator.clearEverything(),
        "M-Delete": () => calculator.memoryClear(),
        "M-Enter": () => calculator.memorySave(),
        "M-R": () => calculator.memoryRecall(),
        "M-A": () => calculator.memoryAdd(),
        "M-S": () => calculator.memorySubtract()
    }

document.addEventListener("keydown", ev => {
    let code = formatCode(ev.code)
    if (!keysList.includes(code)) keysList.push(code)

    let combination = keysList.join("-")

    if (keysList.length > 1 && functions[combination]) {
        let btn = document.querySelector(`button[data-key="${combination}"]`)
        if (btn) btn.classList.add("pressed")
        functions[combination]()
        ev.preventDefault()
    } else if (functions[ev.key]) {
        let btn = document.querySelector(`button[data-key="${ev.key}"]`)
        if (btn) btn.classList.add("pressed")
        functions[ev.key]()
        ev.preventDefault()
    }
})

document.addEventListener("keyup", ev => {
    document.querySelectorAll("#buttons-wrap button").forEach(btn => {
        btn.classList.remove("pressed")
    })

    let code = formatCode(ev.code)

    keysList = keysList.filter(c => c != code)
})

document.querySelectorAll("#buttons-wrap button").forEach(btn => {
    btn.title = btn.dataset.key != "-" ? btn.dataset.key.split("-").join("+") : btn.dataset.key

    btn.addEventListener("click", () => {
        functions[btn.dataset.key]()
    })
})

calculator.start()

let root = document.querySelector("html")
themeBtn.addEventListener("click", () => {
    root.classList.toggle("dark")
    localStorage.setItem("theme", root.classList.contains("dark") ? "dark" : "light")
})

if (localStorage.getItem("theme") == "light" || !localStorage.getItem("theme")) root.classList.remove("dark")
else root.classList.add("dark")