/**
 * @author Vadim Katsubo
 * @group 721701
 * Лабораторная работа 2
 * Построить СДНФ для заданной формулы.
 */

var unaryOrBinaryComplexFormula = new RegExp('([(][!]([A-Z]|[0-1])[)])|([(]([A-Z]|[0-1])((&)|(\\|)|(->)|(~))([A-Z]|[0-1])[)])','g');
var unaryOrBinaryComplexFormula1 = new RegExp('([(][!]([A-Z]|[0-1])[)])|([(]([A-Z]|[0-1])((&)|(\\|)|(->)|(~))([A-Z]|[0-1])[)])');
var atomOrConstant = new RegExp('([A-Z]|[0-1])', 'g');
var replaceFormula = "R";
var tempFormula;
let controller;
let calcView;

function createController() {
    let holder = new ExpressionHolder();
    calcView = new CalculatorView();
    controller = new Controller(holder, calcView);
}

class Controller {
    constructor(holder, calculatorView) {
        this.holder = holder;
        this.calculatorView = calculatorView;
    }

    makePDNF() {
        let quest = document.getElementById('quest');
        if (!quest.checked){
            this.holder.addExpression(document.getElementById('panel').value);
            if(!this.holder.checkBracket()) {
                this.calculatorView.clearTable();
                this.calculatorView.renderTextResult("Неправильно расставленны скобки");
                return;
            }
            if(!this.holder.isFormula()) {
                this.calculatorView.clearTable();
                this.calculatorView.renderTextResult("Неправильная формула");
                return;
            }

            let arrayWithLiteral = this.holder.getArrayWithLiteral();
            let countRow = Math.pow(2, arrayWithLiteral.length);
            let table = this.holder.madeTruthTable(arrayWithLiteral, countRow);
            
            let result = this.holder.makePDNF(table, arrayWithLiteral, countRow);
            if (result.includes("()") || result == ""){
                this.calculatorView.clearTable();
                this.calculatorView.renderTextResult("Невозможно построить СДНФ");
                return;
            }

            this.calculatorView.renderTable(table, arrayWithLiteral);
            this.calculatorView.renderTextResult(result);
        } else {
            this.calculatorView.clearTable();
            this.calculatorView.renderTextResult("");
            this.holder.addExpression(document.getElementById('panel').value);
            if(!this.holder.checkBracket()) {
                this.calculatorView.renderQuest("");
                return;
            }
            if(!this.holder.isFormula()) {
                this.calculatorView.renderQuest("");
                return;
            }

            let arrayWithLiteral = this.holder.getArrayWithLiteral();
            let countRow = Math.pow(2, arrayWithLiteral.length);
            let table = this.holder.madeTruthTable(arrayWithLiteral, countRow);
            
            let result = this.holder.makePDNF(table, arrayWithLiteral, countRow);
            if (result.includes("()") || result == ""){
                this.calculatorView.renderQuest("");
                return;
            }
            this.calculatorView.renderQuest(result);
        }
        
    }

    checkAnswer(item){
        this.holder.addExpression(document.getElementById('panel').value);
            if(!this.holder.checkBracket()) {
                this.calculatorView.renderRightAnswer(item.value, "");
                return;
            }
            if(!this.holder.isFormula()) {
                this.calculatorView.renderRightAnswer(item.value, "");
                return;
            }

            let arrayWithLiteral = this.holder.getArrayWithLiteral();
            let countRow = Math.pow(2, arrayWithLiteral.length);
            let table = this.holder.madeTruthTable(arrayWithLiteral, countRow);
            
            let result = this.holder.makePDNF(table, arrayWithLiteral, countRow);
            if (result.includes("()") || result == ""){
                this.calculatorView.renderRightAnswer(item.value, "");
                return;
            }
            this.calculatorView.renderRightAnswer(item.value, result);
    }

    cleanPanel() {
        this.holder.cleanExpression();
        this.calculatorView.clean();
    }

}

class ExpressionHolder {

    constructor() {
        this.expression = "";
        this.currentNumber = "";
    }

    addExpression(expression) {
        this.expression = expression;
    }

    cleanExpression() {
        this.expression = "";
        this.currentNumber = "";
    }

    checkBracket() {
        let queueBracket = [];
        for (let i = 0; i < this.expression.length; i++) {
            let digit = this.expression.charAt(i);
            if (digit === "(") {
                queueBracket.push("(");
            }
            if (digit === ")") {
                let leftBracket = queueBracket.pop();
                if (leftBracket !== "(" || leftBracket === undefined) {
                    return false;
                }
            }
        }
        if(queueBracket.length === 0) {
            return true;
        } else return false;       
    }

    isFormula() { //проверка является ли строка формулой
        let formula = this.expression;
        while (formula != tempFormula) {
            tempFormula = formula;
            formula = formula.replace(unaryOrBinaryComplexFormula, replaceFormula);
        }
        tempFormula = 0;
        if ((formula.length == 1)) {
            return true;
        } else {
            return false;
        }
    }

    getNumberOfSubformulas(formula) {
        debugger;
    result=null; // инициализация переменных
    var oldFormule=""; //
    var leftFormule=""; // 
    result = formula.match(atomOrConstant, 'g'); // получение атомарных символов		
        while (formula !=="R") { // основной цикл получение всех подформул
            var medium=null;
        tempFormula = formula;
            
        result.push(formula.match(unaryOrBinaryComplexFormula)); // поулчение первого совпадения
            var length=result.length-1; // -
            if(Array.isArray(result[length]))  // -
                if(result[length].length>1) // -
                    result[length].splice(1,result[length].length-1); // -
            medium=result[length][0].match(new RegExp('([R])','g')) // кол-во символов R
        
            if(medium != null && medium.length == 1) // случай с одним R
            {
                result[length][0]=result[length][0].replace("R",oldFormule);
                oldFormule=result[length][0];
            }
            else if (medium != null && medium.length == 2)  //случай с двумя R
            {
                result[length][0]=result[length][0].replace("R",leftFormule);
        
                result[length][0]=result[length][0].replace("R",oldFormule);
                oldFormule=result[length][0]; 
            }
            else if (medium == null ) // случай с тремя R
            {
                leftFormule=oldFormule;
                oldFormule=result[length][0];
            }
                    
        formula = formula.replace(unaryOrBinaryComplexFormula1, replaceFormula);//замена формулы на R
        }
        result = result.join(','); //структуризация массива
        result = result.split(',');
        for (var i = 0; i < result.length; i++) //удаление одинаковых подформул
            for (var j = i+1; j < result.length; j++)
            if (result[i] == result[j]) {result.splice(j, 1);j--;}
        
        return result.length;
    }

    makePDNF(table, arrayWithLiteral, countRow) {
        let resultColumn = arrayWithLiteral.length;
        let array = "";
        let count = ExpressionHolder.getDijunctionCount(table, countRow, resultColumn);

        if (count > 1) {
            array += "(";
        }

        let groupCount = 0;
        for (let index = 0; index < countRow; index++) {
            if (table[index][resultColumn] === "1") {
                let formula = ExpressionHolder.makeSubFormulaForRow(table[index], arrayWithLiteral);
                array += formula;
                if (groupCount !== count - 1) {
                    array += "|";
                }
                if (groupCount < count - 2) {
                    array += '(';
                }
                groupCount++;
            }
        }

        for (let index = 0; index < count - 1; index++) {
            array += ')';
        }
        return array;
    }

    static getDijunctionCount(table, countRow, resultColumn){
        let count = 0;

        for (let index = 0; index < countRow; index++) {
            if (table[index][resultColumn] === "1") {
                count++;
            }
        }
        return count;
    }

    static makeSubFormulaForRow(row, array) {
        let formula = "";
        if (array.length > 1) {
            formula += "(";
        }

        for (let index = 0; index < array.length; index++) {
            if (row[index] === "0") {
                formula += "(!" + array[index] + ")";
            } else {
                formula += array[index];
            }
            if (index !== array.length - 1) {
                formula += "&";
            }
            if (index < array.length - 2) {
                formula += '(';
            }
        }
        for (let index = 0; index < array.length - 1; index++) {
            formula += ')';
        }
        return formula;
    }

    madeTruthTable(arrayWithLiteral, countRow) {
        let table = [];

        for (let index = 0; index < countRow; index++) {
            let row = [];
            let byte = ExpressionHolder.numberToBinaryString(index, arrayWithLiteral.length);
            row.push(...byte);
            row.push(this.getResultForRow(byte, arrayWithLiteral));
            table.push(row);
        }
        return table;
    }

    getArrayWithLiteral() {
        let arrayWithLiteral = [];
        for (let index = 0; index < this.expression.length; index++) {
            let str = this.expression[index];
            if (str.match(/[A-Z]/) !== null && !arrayWithLiteral.includes(str)) {
                arrayWithLiteral.push(str);
            }
        }
        return arrayWithLiteral;
    }

    static numberToBinaryString(number, stringLength) {
        let string = (number >>> 0).toString(2);
        for (let i = string.length; i < stringLength; i++) {
            string = "0" + string;
        }
        return string;
    }

    getResultForRow(byte, arrayWithLiteral) {
        let map = {};
        for (let index in arrayWithLiteral) {
            map[arrayWithLiteral[index]] = byte.charAt(index++);
        }
        let newString = ExpressionHolder.replaceLogicSymbol(this.expression);
        for (let index in Object.keys(map)) {
            let key = Object.keys(map)[index];
            while (newString.match(key) != null) {
                newString = newString.replace(key, map[key]);
            }
        }
        if (eval(newString)) {
            return "1";
        } else {
            return "0";
        }
    }

    static replaceLogicSymbol(string) {
        let newString = [];
        for (let index = 0; index < string.length; index++) {
            let symbol = string[index];
            if (symbol === "&") {
                newString.push("&&");
            } else if (symbol === "|") {
                newString.push("||");
            } else if (symbol === "~") {
                newString.push("===");
            } else if (symbol === "-" && string[++index] === ">") {
                let literal = newString.pop();
                let str = "";
                if (literal === ")") {
                    let brackets = [];
                    brackets.push(literal);
                    let buffer = [];
                    buffer.push(literal);
                    while (brackets.length > 0) {
                        let substring = newString.pop();
                        if (substring === "(") {
                            brackets.pop();
                        } else if (substring === ")") {
                            brackets.push(substring);
                        }
                        buffer.push(substring);
                    }
                    buffer = buffer.reverse();
                    str = "(!" + buffer.join("") + ")||";
                } else {
                    str = "(!" + literal + ")||";
                }
                newString.push(...str);
            } else {
                newString.push(symbol);
            }
        }
        return newString.join("");
    }
}

class CalculatorView {
    constructor() {
        this.edit = document.getElementById('panel');
        this.result = document.getElementById('result');
        this.table = document.getElementById('table');
        this.questPanel = document.getElementById('questPanel');
        this.action = document.getElementById('action');
        this.quest = document.getElementById('quest'); 

    }

    renderTextEdit(expression) {
        this.edit.value = expression;
    }

    renderTextResult(expression) {
        this.result.innerText = "";
        if (expression != ""){
            this.result.innerText += "СДНФ: ";
        }
         this.result.innerText += expression;
    }

    clearTable() {
        this.table.innerHTML = "";
    }

    renderTable(table, arrayWithLiteral) {
        let size = Math.pow(2, arrayWithLiteral.length);
        let innerHTML = "<thead>";
        let tr = "<tr>";
        for (let key = 0; key < arrayWithLiteral.length; key++) {
            tr += "<td>" + arrayWithLiteral[key] + "</td>";
        }
        tr += "<td>" + "result" + "</td>";
        tr += "</tr>";
        innerHTML += "</thead>";
        innerHTML += "<tbody>";
        innerHTML += tr;
        for (let i = 0; i < size; i++) {
            let row = table[i];
            let rowTr = "<tr>";
            for (let index = 0; index < row.length; index++) {
                let val = row[index];
                rowTr += "<td>" + val + "</td>"
            }
            rowTr += "</tr>";
            innerHTML += rowTr;
        } 
        innerHTML += "</tbody>";
        this.table.innerHTML = innerHTML;
    }

    renderQuest(result){
        let variants = ["Неправильно расставленны скобки", "Неправильная формула", "Невозможно построить СДНФ"];
        let innerHTML = "<label>Выберите правильный  вариант</label>";
        if (result != ""){
            variants.push(result);
            let index = this.getRandomInt(result.length-1);
            let newResult = result.slice(0, index) + result.slice(index+1);
            variants.push(newResult);
        }
        this.shuffle(variants);
        variants.forEach(element => innerHTML += this.addButton(element));
        this.questPanel.innerHTML = innerHTML;
    }

    shuffle(array) {
        array.sort(() => Math.random() - 0.5);
      }

    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
      }

    addButton(value){
        return "<input class=\"form-group btn btn-default formButtonfront btn-second\" name=\"btnCheck\" type=\"button\" value=\" " + value + " \" onclick=\"controller.checkAnswer(this)\"/>\n";
    }

    renderRightAnswer(answer, result){
        if (answer.includes(result)){
            this.result.innerHTML = "<h5>Правильно!\nВы молодец</h5>";
        } else {
            this.result.innerHTML= "<h5>Неправильно! Ваш ответ:\n" + answer + "\nПравильный ответ был:\n" + result + "</h5>";
        }
        this.questPanel.innerHTML = "";
    }

    fill(element){
    	let addValue = element.value;
    	if (addValue.includes("Clear")){
    		this.edit.value = "";
    		return;
    	}
    	if (this.edit.value == addValue || 
    		this.edit.value.includes("&" + addValue) ||
    		this.edit.value.includes(addValue + "&") ||
    		this.edit.value.includes("&" + addValue + "&")){
    		return;
    	}
    	if (this.edit.value) {
    		this.edit.value += "&";
    	}
    	this.edit.value += addValue;
    }

    clean() {
        this.edit.value = "";
    }

    changeAction(checkbox){
        if (checkbox.checked){
            this.action.value = "Показать варианты!";
        } else {
            this.action.value = "Построить СДНФ";
        }
        this.clearTable();
        this.renderTextResult("");
        this.questPanel.innerHTML = "";

    }

}