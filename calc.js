import keys from './keys.json' with {type: 'json'}

class Calculator {
    data = {
        val1: '',
        val2: '',
        answerVal: '',
        operand: '',
        nextInput: false,
        maxDisplay: 50,
        getCurrentNumber() {
            return this.nextInput ? this.val2 : this.val1
        },
        updateCurrentVal(number) {
            this.nextInput ? this.val2 = number : this.val1 = number

            if (this.val1 == '-') this.val1 = ''
            if (this.val2 == '-') this.val2 = ''
        },
        reset() {
            this.val1 = ''
            this.val2 = ''
            this.answerVal = ''
            this.operand = ''
            this.nextInput = false
        },
        swithCurrentVals() {
            this.nextInput = !this.nextInput
        },
        evalData() {
            return String(eval(`${Number(this.val1)}${this.operand}${Number(this.val2)}`))
        }
    }

    constructor(parentElem, id = '') {
        this.parentElem = parentElem
        this.id = id
        this.makeBody()
    }

    makeBody() {
        this.mainBody = document.createElement('div')
        this.mainBody.classList.add('calc-cont') 
        this.mainBody.id = this.id

        const header = document.createElement('h1')
        header.textContent = 'Calculator™'
        this.mainBody.appendChild(header)

        this.createDisplay()
        this.createBtns()

        this.parentElem.appendChild(this.mainBody)
    }

    createDisplay() {
        const displayWrap = document.createElement('div')
        displayWrap.id = 'display-wrap'

        this.display = document.createElement('div')
        this.display.id = 'display'
        this.display.textContent = '0.'

        displayWrap.appendChild(this.display)
        this.mainBody.appendChild(displayWrap)
    }

    createBtns() {
        const btnWrap = document.createElement('div')
        btnWrap.id = 'btns-wrap'

        for (const key of keys) {
            let button = document.createElement('button')

            button.textContent = key.key
            button.classList.add('calc-button')

            if (key.id) button.id = key.id
            if (key.class) {
                let classArr = key.class.split(" ")

                for (const tokens of classArr) {
                    button.classList.add(tokens)
                }
            }

            button.onclick = () => eval(key.func)

            document.addEventListener('keydown', ev => {
                if (ev.key == key.keyboardId) {
                    eval(key.func)
                }
            })

            btnWrap.appendChild(button)
        }

        this.mainBody.appendChild(btnWrap)
    }

    inputNum(char) {
        char = String(char)

        let number = this.data.getCurrentNumber(), regex = /^[0]{1,}/

        if (number.length < this.data.maxDisplay) {
            number = number == '' ? char : number + char
        }

        if (regex.test(number) && !number.includes('.')) {
            number = number.replace(regex, '')
        }

        this.data.updateCurrentVal(number)
        this.displayNumber(number)
    }

    inputDecimal() {
        let number = this.data.getCurrentNumber()

        if (number == '') {
            number = '0.'
        } else number = number.includes('.') ? number : number + '.'

        this.data.updateCurrentVal(number)
        this.displayNumber(number)
    }

    negate() {
        let number = this.data.getCurrentNumber()

        if (number != '' && number != 0)
            number = number.includes('-') ? number.replace('-', '') : number = '-' + number

        this.data.updateCurrentVal(number)
        this.displayNumber(number)
    }

    displayNumber(num) {
        if (num == '' || num == '-') {
            this.display.textContent = '0.'
        } else this.display.textContent = num.includes('.') ? num : num + '.'
    }

    delChars() {
        let number = this.data.getCurrentNumber(),
            arr = number.split('')

        if (arr[arr.length - 1] == '.') delete arr[arr.length - 2]

        delete arr[arr.length - 1]

        number = arr.join('')

        this.data.updateCurrentVal(number)
        this.displayNumber(number)
    }

    clearAll() {
        this.data.reset()
        this.clearDisplay()
    }

    clearDisplay() {
        this.display.textContent = '0.'
        this.displayBlink()
    }

    displayBlink() {
        this.display.classList.add('blink')
        setTimeout(() => this.display.classList.remove('blink'), 100)
    }

    addOperand(type) {
        this.displayBlink()

        if (this.data.operand == '') {
            this.data.swithCurrentVals()
        }

        this.data.operand = type
    }

    root() {
        let number = this.data.getCurrentNumber()

        if (number != '') {
            this.displayBlink()

            let root = Math.sqrt(number)
            if (root) number = String(root)
            else number = '0'
        }

        this.data.updateCurrentVal(number)
        this.displayNumber(number)
    }

    evaluateCalc() {
        if (this.data.operand != '') {
            this.displayBlink()

            this.data.answerVal = this.data.evalData()
            if (this.data.answerVal.length > 16) String(this.data.answerVal = Number(this.data.answerVal).toExponential())

            this.displayNumber(this.data.answerVal)

            this.data.reset()
        }
    }
}

new Calculator(document.body, 'main')