//text overflow poorly handled
//no negative numbers input

let curNumber = '';
let prevNumber = '';
let curOperator = '';
//wird nach Ergebnisausgabe mit = direkt eine Nummer eingegeben, muss das letzte Ergebnis ueberschrieben werden
let overwrite = false;

const operatorMap = new Map([
    ["÷", "/"],
    ["×", "*"],
    ["−", "-"],
    ["＋", "+"]
]);

function numberInputHandler(n) {
    if (overwrite) {
        prevNumber = '';
        overwrite = false;
    }
    curNumber += n;
    changeDisplayValue(curNumber);

}

function operatorInputHandler(o) {
    overwrite = false;

    if (curNumber === '' && prevNumber !== '') {
        changeHistoryValue(prevNumber, getMapKeyByValue(o));
    }

    if (prevNumber === '' && curNumber !== '') {
        prevNumber = curNumber;
        curNumber = '';
        changeHistoryValue(prevNumber, getMapKeyByValue(o));
    }


    if (curNumber !== '' && prevNumber !== '') {
        calculate(prevNumber + curOperator + curNumber);
        changeHistoryValue(prevNumber, getMapKeyByValue(o));
    }

    curOperator = o;
}

function equalsHandler() {
    if (curOperator !== '' && curNumber !== '' && prevNumber !== '') {
        changeHistoryValue('', '');
        calculate(prevNumber + curOperator + curNumber);
        overwrite = true;
    }
}

function calculate(calc) {
    console.log("EVALUATING:" + calc);
    var result = eval(calc);
    console.log("RESULT: " + result);
    changeDisplayValue(result);

    curNumber = '';
    prevNumber = result;
}

function buttonAnimation(button) {
    button.classList.add("active");
    setTimeout(function () {
        button.classList.remove("active");
    }, 70);
}

function getMapKeyByValue(value) {
    return [...operatorMap].find(([key, val]) => val == value)[0];
}

function cancel() {
    curNumber = '';
    prevNumber = '';
    curOperator = '';
    changeDisplayValue('');
    changeHistoryValue('', '');
}

function removeLastInput() {
    if (curNumber !== '') {
        curNumber = curNumber.slice(0, -1);
        changeDisplayValue(curNumber);
    }
}

function changeDisplayValue(value) {
    $('.output').attr('value', value);
}

function changeHistoryValue(value, operator) {
    $('.history').attr('value', value + " " + operator);
    changeDisplayValue('');
}

$('.num').on('click', function () {
    numberInputHandler($(this).attr('value'));
});

$('.operator').on('click', function () {
    operatorInputHandler(operatorMap.get($(this).attr('value')));
});

$('.equal').on('click', function () {
    equalsHandler();
});

$('.cancel').on('click', function () {
    cancel();
});

document.addEventListener("keydown", function (event) {

    if (isFinite(event.key) & event.key !== ' ') {
        numberInputHandler(event.key);
        buttonAnimation(document.querySelector("input[class='num'][value='" + event.key + "']"));
    }

    if (event.key === '*' || event.key === '/' || event.key === '+' || event.key === '-') {
        operatorInputHandler(event.key);
        var opVar = getMapKeyByValue(event.key);
        buttonAnimation(document.querySelector("input[class='operator'][value='" + opVar + "']"));
    }

    if (event.key === '=' || event.key === 'Enter') {
        //Enter key will trigger last clicked button, causes conflicts like 5+1=5 if 5 clicked and +1 typed
        event.preventDefault();
        equalsHandler();
        buttonAnimation(document.querySelector("input[class='equal']"));
    }

    if (event.key === 'Escape' || event.key === 'c' || event.key === 'C') {
        cancel();
        buttonAnimation(document.querySelector("input[class='cancel']"));
    }

    if (event.key === 'Backspace') {
        removeLastInput();
    }
});

