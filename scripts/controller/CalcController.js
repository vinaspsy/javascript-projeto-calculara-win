class CalcController{

    constructor(){

        this._audio = new Audio('click.mp3');
        this._audioOnOff = false;
        this._lastOperator = '';
        this._lastNumber = '';
        this._operation = [];
        this._displayCalcEl = document.querySelector("#display");
        this.initialize();
        this.initButtonsEvents();
        this.initKeyboard();

    }

    initialize(){

        this.setLastNumberToDisplay();
        this.pasteFromClipboard();

        document.querySelectorAll(".row > button").forEach(btn=>{

            if(btn.innerHTML == "C"){

                btn.addEventListener('dblclick', e=>{

                    this.toggleAudio();
                    
                });

            }

        });

    }

    toggleAudio(){

        this._audioOnOff = !this._audioOnOff;

    }

    playAudio(){

        if(this._audioOnOff){

            this._audio.currentTime = 0;
            this._audio.play();

        }

    }

    pasteFromClipboard(){

        document.addEventListener('paste', e=>{

            let text = e.clipboardData.getData('Text');

            this.displayCalc = parseFloat(text);
            
        });

    }

    copyToClipboard(){

        let input = document.createElement('input');

        input.value = this.displayCalc;

        document.body.appendChild(input);

        input.select();

        document.execCommand("Copy");

        input.remove();

    }

    initKeyboard(){

        document.addEventListener('keyup', e=>{

            this.playAudio();

            switch(e.key){
                case 'Escape':
                    this.clearAll();
                    break;
                case 'Backspace':
                    this.clearEntry();
                    break;
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                    this.addOperation(e.key);
                    break;
                case 'Enter':
                case '=':
                    this.calc();
                    break;
                case '.':
                case ',':
                    this.addDot(".");
                    break;
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key));
                    break;
                case 'c':
                    if(e.ctrlKey) this.copyToClipboard();
                    break;
            }

        })

    }

    addEventListenerAll(element, events, fn){

        events.split(' ').forEach(event=>{
            element.addEventListener(event, fn, false);
        });

    }

    clearAll(){
        
        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';

        this.setLastNumberToDisplay();

    }

    clearEntry(){

        this._operation.pop();

        this.setLastNumberToDisplay();
    }

    getLastOperation(){

        return this._operation[this._operation.length - 1];

    }

    setLastOperation(value){

        this._operation[this._operation.length - 1] = value;
        
    }

    isOperation(value){
        return (['+', '-', '*', '%', '/'].indexOf(value) > -1)
    }

    pushOperation(value){

        this._operation.push(value);

        if(this._operation.length > 3){

            this.calc();
            
        }

    }

    getResult(){
        try{
            return eval(this._operation.join(""));
        }catch(e){
            setTimeout(()=>{
                this.setError();
            }, 1);
        }
        
    }

    calc(){

        let last = '';

        this._lastOperator = this.getLastItem();

        if(this._operation.length < 3){

            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];

        }

        if(this._operation.length > 3){

            last = this._operation.pop();
            
            this._lastNumber = this.getResult();
        }else if(this._operation.length == 3){

            this._lastNumber = this.getLastItem(false);

        }

        let result = this.getResult();

        if(last == "%"){

            result /= 100;

            this._operation = [result];

        }else{

            this._operation = [result];
            
            if(last) this._operation.push(last);

        }

        this.setLastNumberToDisplay();
        
    }

    getLastItem(isOperation = true){
        let lastItem;

        for(let i = this._operation.length - 1; i >= 0; i--){

            if(this.isOperation(this._operation[i]) == isOperation){
                lastItem = this._operation[i];
                break;
            }

        }

        if(!lastItem){

            lastItem = (isOperation) ? this._lastOperator : this._lastNumber;
        }

        return lastItem;

    }

    setLastNumberToDisplay(){

        let lastNumber = this.getLastItem(false);

        if(!lastNumber) lastNumber = 0;

        this.displayCalc = lastNumber;

    }

    addOperation(value){

        if(isNaN(this.getLastOperation())){

            if(this.isOperation(value)){

                this.setLastOperation(value);

            }else{

                this.pushOperation(value);

                this.setLastNumberToDisplay();

            }
        }else{
            if(this.isOperation(value)){

                this.pushOperation(value); 

            }else{

                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(newValue);

                this.setLastNumberToDisplay();

            }
            
        }

    }

    setError(){
        this.displayCalc = "Error";
    }

    addDot(){

        let lastOperator = this.getLastOperation();

        if(typeof lastOperator === 'string' && lastOperator.split('').indexOf('.') > -1) return;

        if(this.isOperation(lastOperator) || !lastOperator){
            this.pushOperation('0.');
        }else{
            this.setLastOperation(lastOperator.toString() + '.');
        }
        this.setLastNumberToDisplay();
        
    }

    execBtn(value){

        this.playAudio();

        switch(value){
            case 'C':
                this.clearAll();
                break;
            case 'CE':
            case '←':
                this.clearEntry();
                break;
            case '+':
            case '-':
            case '%':
                this.addOperation(value);
                break;
            case 'X':
                this.addOperation('*');
                break;
            case '÷':
                this.addOperation('/');
                break;
            case '=':
                this.calc();
                break;
            case ',':
                this.addDot(".");
                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;
            default:
                this.setError();
                break;
        }

    }

    initButtonsEvents(){

        let buttons = document.querySelectorAll(".row > button");

        buttons.forEach((btn, index)=>{

            this.addEventListenerAll(btn, 'click drag', e=>{
                let textBtn = btn.innerHTML;

                this.execBtn(textBtn);
            });

            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e=>{
                btn.style.cursor = "pointer";
            });

        });

    }

    get displayCalc(){
        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(value){

        if(value.toString().length > 10){
            this.setError();
            return false;
        }

        this._displayCalcEl.innerHTML = value;
    }

}