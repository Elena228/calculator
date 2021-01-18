class Calculator {
    constructor (previousOperandTextElement, currentOperandTextElement) {
      this.previousOperandTextElement = previousOperandTextElement;
      this.currentOperandTextElement = currentOperandTextElement;
      this.clear();
    }

    clear() {
      this.currentOperand = '';
      this.previousOperand = '';
      this.operation = undefined;
      this.readyToReset = false;
      this.errorOperand = false;
    }
    
    delete() {
      if (this.currentOperand === '') return;
      this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }
    
    appendNumber(number) {
      if (this.errorOperand) return;
      if ((number === '.') && (this.currentOperand.includes('.'))) return; 
      if (this.previousOperand === '' && this.currentOperand !== '' && this.readyToReset) {
        this.currentOperand = '';
        this.readyToReset = false;
      }
      this.currentOperand = this.currentOperand.toString() + number.toString();
    }

    chooseOperation (operation) {
      if (this.errorOperand) return;
      if (this.currentOperand === '' && operation !== '-') return;
      if (this.currentOperand === '' && operation === '-') {
        this.currentOperand = '-'; 
        return; 
      }
      if (this.currentOperand === '-' || this.currentOperand === '.'|| this.currentOperand === '-.') return; 
      if ((this.previousOperand !== '') || (this.operation === '√')) {
        this.compute();
      }
      this.operation = operation;
      if (this.operation !== '√' && !this.errorOperand) {
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
      }  
    }

    compute() {
      let computation;
      let prev = parseFloat(this.previousOperand);
      let current = parseFloat(this.currentOperand); 
       if (isNaN(current) || (isNaN(prev) && (this.operation != '√'))) return;
      switch (this.operation) {
        case '+':
          computation = prev + current;
        break;
        case '-':
          computation = prev - current;
        break;
        case '*':
          computation = prev * current;
        break;
        case '÷':
          if (current === 0) {
            this.errorOperand = true;
          } else {
            computation = prev / current;
          }
        break;
        case '^':
          computation = Math.pow(prev, current); 
        break;
        case '√':
          if (current >= 0) {
            computation = Math.sqrt(current);
          } else {
            this.errorOperand = true;
          }
        break;
        default:
          return;
      }
      this.readyToReset = true;
      this.currentOperand = +computation.toFixed(16);
      this.operation = undefined;
      this.previousOperand = '';
    }

    getDisplayNumber(number) {
      let integerDisplay;
      const stringNumber = number.toString();
      const integerDigits = parseInt(stringNumber.split('.')[0]);
      const decimalDigits = stringNumber.split('.')[1];
      if (isNaN(integerDigits) && stringNumber !== '-') {
        integerDisplay = '';
      } else if (stringNumber === '-') {
          integerDisplay = '-';
        } else {
            integerDisplay = integerDigits.toLocaleString('ru');
          }
      if (decimalDigits != null && !stringNumber.includes('-.')) {
        return `${integerDisplay}.${decimalDigits}`;
      } else if (stringNumber.includes('-.')) {
          return `-.${decimalDigits}`;
        } else {
          return integerDisplay;
        }
    }

    updateDisplay() {
      if (this.errorOperand) {
        this.currentOperandTextElement.innerText = 'Error';
        this.previousOperandTextElement.innerText = '';   
      }
      if (this.operation != '√')  {
        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
      } else {
        this.currentOperandTextElement.innerText = `${this.operation} ${this.getDisplayNumber(this.currentOperand)}`;
      }
      if (this.operation != null && this.operation != '√') {
        this.previousOperandTextElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
      } else {
        this.previousOperandTextElement.innerText = '';   
      }
    }
}

const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

numberButtons.forEach (button => {
  button.addEventListener('click', () => {
    calculator.appendNumber(button.innerText);
    calculator.updateDisplay();
  });
});

operationButtons.forEach (button => {
  button.addEventListener('click', () => {
    calculator.chooseOperation(button.innerText);
    calculator.updateDisplay();
  });
  });
  
allClearButton.addEventListener('click', () => {
  calculator.clear();
  calculator.updateDisplay();
});  

equalsButton.addEventListener('click', () => {
  calculator.compute();
  calculator.updateDisplay();
});

deleteButton.addEventListener('click', () => {
  calculator.delete();
  calculator.updateDisplay();
});