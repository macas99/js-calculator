//text overflow poorly handled
//no negative numbers input

let cur_number = '';
let prev_number = '';
let cur_operator = '';
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
        prev_number = '';
        overwrite = false;
    }
    cur_number += n;
    changeDisplayValue(cur_number);

}

function operatorInputHandler(o) {
    overwrite = false;

    if (cur_number === '' && prev_number !== '') {
        changeHistoryValue(prev_number, getMapKeyByValue(o));
    }

    if (prev_number === '' && cur_number !== '') {
        prev_number = cur_number;
        cur_number = '';
        changeHistoryValue(prev_number, getMapKeyByValue(o));
    }


    if (cur_number !== '' && prev_number !== '') {
        calculate(prev_number + cur_operator + cur_number);
        changeHistoryValue(prev_number, getMapKeyByValue(o));
    }

    cur_operator = o;
}

function equalsHandler() {
    if (cur_operator !== '' && cur_number !== '' && prev_number !== '') {
        changeHistoryValue('', '');
        calculate(prev_number + cur_operator + cur_number);
        overwrite = true;
    }
}

function calculate(calc) {
    console.log("EVALUATING:" + calc);
    var result = eval(calc);
    console.log("RESULT: " + result);
    changeDisplayValue(result);

    cur_number = '';
    prev_number = result;
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
    cur_number = '';
    prev_number = '';
    cur_operator = '';
    changeDisplayValue('');
    changeHistoryValue('', '');
}

function removeLastInput() {
    if (cur_number !== '') {
        cur_number = cur_number.slice(0, -1);
        changeDisplayValue(cur_number);
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
        var op_var = getMapKeyByValue(event.key);
        buttonAnimation(document.querySelector("input[class='operator'][value='" + op_var + "']"));
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

