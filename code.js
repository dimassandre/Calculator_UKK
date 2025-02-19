
var operators = ["+", "-", "/", "*"];

var box = null;
var last_operation_history = null;
var operator = null;
var equal = null;
var dot = null;

var firstNum = true;

var numbers = [];
var operator_value;
var last_button;
var calc_operator;
var total;

var key_combination = []

function updateDisplay(value) {
    document.getElementById("box").innerText = parseFloat(value.toFixed(4));}

function inputNumber(num) {
    var box = document.getElementById("box");

    // Jika sebelumnya ada operator, masukkan angka baru
    if (box.innerText === "0" || last_operator !== "") {
        box.innerText = num;
    } else {
        box.innerText += num;
    }
}

function calculate_percentage() {
    var box = document.getElementById("box");

    // Pastikan input valid
    if (isNaN(box.innerText) || box.innerText.trim() === "") {
        return;
    }

    var currentValue = parseFloat(box.innerText);

    // Konversi angka menjadi persen dari angka sebelumnya
    if (numbers.length === 0) {
        numbers[0] = currentValue / 100; // Jika ini angka pertama
    } else {
        numbers[1] = (numbers[0] * currentValue) / 100; // Jika angka kedua, hitung persentase dari angka pertama
    }

    updateDisplay(numbers[numbers.length - 1]);
    isPercentage = true; // Tandai bahwa angka ini persen
}

function set_operator(operator) {
    last_operator = operator;
    numbers.push(parseFloat(document.getElementById("box").innerText));
    updateDisplay("");
}

function calculate_result() {
    var result;
    if (numbers.length < 2 || !last_operator) {
        return;
    }

    switch (last_operator) {
        case "+":
            result = numbers[0] + numbers[1];
            break;
        case "-":
            result = numbers[0] - numbers[1];
            break;
        case "*":
            result = numbers[0] * numbers[1];
            break;
        case "/":
            result = numbers[0] / numbers[1];
            break;
        default:
            return;
    }

    updateDisplay(result);
    numbers = [result]; // Simpan hasil ke dalam array
    last_operator = "";
    isPercentage = false;
}

function button_number(button) {

    operator = document.getElementsByClassName("operator");
    box = document.getElementById("box");
    last_operation_history = document.getElementById("last_operation_history");
    equal = document.getElementById("equal_sign").value;
    dot = document.getElementById("dot").value;
    
    last_button = button;

    // jika tombol yang ditekan bukan operator atau tanda =
    if (!operators.includes(button) && button!=equal){
        // jika ini adalah tombol pertama yang ditekan
        if (firstNum){
            // jika tombolnya titik, tampilkan 0.
            if (button == dot){
                box.innerText = "0"+dot;
            }
            // jika bukan, tampilkan angka yang ditekan
            else {
                box.innerText = button;
            }
            firstNum = false;
        }
        else {

            // kembalikan jika nilai box adalah 0
            if (box.innerText.length == 1 && box.innerText == 0){

                if (button == dot){
                    box.innerText += button;
                }
                return;
            }
            // kembalikan jika box sudah memiliki titik dan tombol yang ditekan adalah titik
            if (box.innerText.includes(dot) && button == dot){
                return;
            }
            // batas maksimal input angka adalah 20
            if (box.innerText.length == 20){
                return;
            }

            // jika tombol titik ditekan dan box sudah memiliki tanda -, tampilkan -0.
            if (button == dot && box.innerText == "-"){
                box.innerText = "-0"+dot;
            }
            // jika tidak, tambahkan angka yang ditekan
            else {
                box.innerText += button;
            }  
        }
    }
    // jika tombol adalah operator atau tanda =
    else {

        // kembalikan jika operator sudah ditekan
        if (operator_value != null && button == operator_value){
            return
        }

        // tampilkan tanda minus jika ini adalah nilai pertama yang dipilih dan akhirnya kembalikan
        if (button == "-" && box.innerText == 0){
            box.innerText = button;
            firstNum = false;
            operator_value = button
            showSelectedOperator()
            return;
        }
        // kembalikan jika tombol minus ditekan dan box sudah menampilkan tanda minus
        else if (operators.includes(button) && box.innerText == "-"){
            return
        }
        // kembalikan jika tombol minus ditekan dan history sudah memiliki tanda sama dengan
        else if (button == "-" && operator_value == "-" && last_operation_history.innerText.includes("=")){
            return
        }

        // set nilai operator jika tombol yang ditekan adalah operator
        if (operators.includes(button)){
            if (typeof last_operator != "undefined" && last_operator != null){
                calc_operator = last_operator
            }
            else {
                calc_operator = button
            }
            if (button == "*"){
                last_operator = "×"
            }
            else if (button == "/"){
                last_operator = "÷"
            }
            else {
                last_operator = button
            }
            operator_value = button
            firstNum = true
            showSelectedOperator()
        }

        // tambahkan angka pertama ke array angka dan tampilkan di history
        if (numbers.length == 0){
            numbers.push(box.innerText)
            if (typeof last_operator != "undefined" && last_operator != null){
                last_operation_history.innerText = box.innerText + " " + last_operator
            }
        }
        // perhitungan selanjutnya
        else {   
            if (numbers.length == 1){
                numbers[1] = box.innerText
            }
            var temp_num = box.innerText

            // hitung total
            if (button==equal && calc_operator != null){
                var total = calculate(numbers[0], numbers[1], calc_operator)
                box.innerText = total;

                // tambahkan angka kedua ke history
                if (!last_operation_history.innerText.includes("=")){
                    last_operation_history.innerText += " " + numbers[1] + " ="
                }

                temp_num = numbers[0]

                numbers[0] = total
                operator_value = null
                showSelectedOperator()

                // ganti angka pertama di history dengan nilai total
                var history_arr = last_operation_history.innerText.split(" ")
                history_arr[0] = temp_num
                last_operation_history.innerText = history_arr.join(" ")
            }
            // perbarui history dengan nilai yang ada di layar dan operator yang ditekan
            else if (calc_operator != null) {
                 last_operation_history.innerText = temp_num + " " + last_operator
                 calc_operator = button
                 numbers = []
                 numbers.push(box.innerText)
            }
        }
    }

}

// menyorot tombol operator yang dipilih
function showSelectedOperator(){

    var elements = document.getElementsByClassName("operator");

    for (var i=0; i<elements.length; i++){
        elements[i].style.backgroundColor  = "#e68a00";
    }

    if (operator_value == "+"){
        document.getElementById("plusOp").style.backgroundColor  = "#ffd11a";
    }
    else if (operator_value == "-"){
        document.getElementById("subOp").style.backgroundColor  = "#ffd11a";
    }
    else if (operator_value == "*"){
        document.getElementById("multiOp").style.backgroundColor  = "#ffd11a";
    }
    else if (operator_value == "/"){
        document.getElementById("divOp").style.backgroundColor  = "#ffd11a";
    }
}

// fungsi untuk menghitung hasil dengan dua angka dan operator
function calculate(num1, num2, operator){

    if (operator === "+"){
        total = (parseFloat)(num1)+(parseFloat)(num2)
    }
    else if (operator === "-"){
        total = (parseFloat)(num1)-(parseFloat)(num2)
    }
    else if (operator === "*"){
        total = (parseFloat)(num1)*(parseFloat)(num2)
    }
    else if (operator === "/"){
        total = (parseFloat)(num1)/(parseFloat)(num2)
    }
    else {
        if (total == box.innerText){
            return total
        }
        else {
            return box.innerText
        }
    }
    // jika total bukan integer, tampilkan maksimal 12 angka desimal
    if (!Number.isInteger(total)){
        total = total.toPrecision(12);
    }
    return parseFloat(total);
}

// fungsi untuk membersihkan layar dan mengatur ulang semuanya
function button_clear(){
    window.location.reload()
}

function backspace_remove(){

    box = document.getElementById("box");
    var elements = document.getElementsByClassName("operator");

    for (var i=0; i<elements.length; i++){
        elements[i].style.backgroundColor  = "#e68a00";
    }

    var last_num = box.innerText;
    last_num = last_num.slice(0, -1)
    
    box.innerText = last_num

    // tampilkan 0 jika semua karakter di layar dihapus
    if (box.innerText.length == 0){
        box.innerText = 0
        firstNum = true
    }

}


// fungsi untuk mengubah tanda angka yang ditampilkan
function plus_minus(){
    box = document.getElementById("box");

    // jika operator sudah ditekan
    if (typeof last_operator != "undefined"){
        if (numbers.length>0){
            // jika tombol operator yang terakhir ditekan
            if (operators.includes(last_button)){
                // jika teks yang ditampilkan hanya tanda minus, ganti dengan 0
                if (box.innerText == "-"){
                    box.innerText = 0
                    firstNum = true
                    return
                }
                // jika teks yang ditampilkan bukan tanda minus, ganti dengan tanda minus
                else {
                    box.innerText = "-"
                    firstNum = false
                }
            }
            // jika tombol operator terakhir bukan operator, ubah tanda angkanya
            else {
                box.innerText = -box.innerText

                if (numbers.length==1){
                    numbers[0] = box.innerText
                }
                else {
                    numbers[1] = box.innerText
                }
            }
        }
        return
    }

    // jika angka yang ditampilkan adalah 0, ganti dengan tanda minus
    if (box.innerText == 0){
        box.innerText = "-"
        firstNum = false
        return
    }
    box.innerText = -box.innerText
}

// fungsi untuk menghitung akar kuadrat dari angka yang ditampilkan
function square_root(){
    box = document.getElementById("box");
    var square_num = Math.sqrt(box.innerText)
    box.innerText = square_num
    numbers.push(square_num)
}

// fungsi untuk menghitung pembagian 1 dengan angka yang ditampilkan
function division_one(){
    box = document.getElementById("box");
    var square_num = 1/box.innerText
    box.innerText = square_num
    numbers.push(square_num)
}

// fungsi untuk menghitung pangkat dari angka yang ditampilkan
function power_of(){
    box = document.getElementById("box");
    var square_num =Math.pow(box.innerText, 2)
    box.innerText = square_num
    numbers.push(square_num)
}
 
// fungsi untuk menghapus angka terakhir yang diketikkan
function clear_entry(){
    box = document.getElementById("box");

    if (numbers.length > 0 && typeof last_operator != "undefined"){
        box.innerText = 0
        var temp = numbers[0]
        numbers = []
        numbers.push(temp)
        firstNum = true;
    }
}

document.addEventListener('keydown', keyPressed);
document.addEventListener('keyup', keyReleased);

// fungsi untuk menangkap event keydown
function keyPressed(e) {
    e.preventDefault()
    var equal = document.getElementById("equal_sign").value;
    var dot = document.getElementById("dot").value;

    if (e.key == "Delete"){
        button_clear();
        return;
    }

    var isNumber = isFinite(e.key);
    var enterPress;
    var dotPress;
    var commaPress = false;

    if (e.key == "Enter"){
        enterPress = equal;
    }
    if (e.key == "."){
        dotPress = dot;
    }
    if (e.key == ","){
        commaPress = true;
    }
    
    if (isNumber || operators.includes(e.key) || e.key == "Enter" || e.key == dotPress || 
        commaPress || e.key == "Backspace"){
        if (e.key == "Enter"){
            button_number(enterPress)
        }
        else if (e.key == "Backspace"){
            document.getElementById("backspace_btn").style.backgroundColor  = "#999999";
            backspace_remove()
        }
        else if (commaPress){
            button_number(dot)
        }
        else {
            button_number(e.key) 
        }   
    }
    if (e.key) {
        key_combination[e.code] = e.key;
    }
}

// fungsi untuk menangkap event keyup
function keyReleased(e){
    if (key_combination['ControlLeft'] && key_combination['KeyV']) {
        navigator.clipboard.readText().then(text => {
            box = document.getElementById("box");
            var isNumber = isFinite(text);
            if (isNumber){
                var copy_number = text
                firstNum = true
                button_number(copy_number)
            }
        }).catch(err => {
            console.error('Gagal membaca isi clipboard: ', err);
        });
    }
    if (key_combination['ControlLeft'] && key_combination['KeyC']) {
        box = document.getElementById("box");
        navigator.clipboard.writeText( box.innerText)
    }
    key_combination = []
    e.preventDefault()
    // mengubah warna tombol backspace kembali ke warna aslinya
    if (e.key == "Backspace"){
        document.getElementById("backspace_btn").style.backgroundColor  = "#666666";
    }
}

// Fungsi untuk menghitung sinus dari angka yang ditampilkan
function calculate_sin() {
    box = document.getElementById("box");
    var sin_value = Math.sin(box.innerText * (Math.PI / 180)); // Konversi ke radian
    box.innerText = sin_value.toPrecision(12);
    numbers.push(sin_value);
}

// Fungsi untuk menghitung cosinus dari angka yang ditampilkan
function calculate_cos() {
    box = document.getElementById("box");
    var cos_value = Math.cos(box.innerText * (Math.PI / 180)); // Konversi ke radian
    box.innerText = cos_value.toPrecision(12);
    numbers.push(cos_value);
}

// Fungsi untuk menghitung tangen dari angka yang ditampilkan
function calculate_tan() {
    box = document.getElementById("box");
    var tan_value = Math.tan(box.innerText * (Math.PI / 180)); // Konversi ke radian
    box.innerText = tan_value.toPrecision(12);
    numbers.push(tan_value);
}

// Fungsi untuk menghitung logaritma (log basis 10)
function calculate_log() {
    box = document.getElementById("box");
    var log_value = Math.log10(box.innerText);
    box.innerText = log_value.toPrecision(12);
    numbers.push(log_value);
}

function addToHistory(expression, result) {
    var historyList = document.getElementById("history-list");

    // Pastikan result adalah angka valid sebelum memformat
    if (!isNaN(result)) {
        result = parseFloat(result).toFixed(4); // Pastikan 4 angka di belakang koma
        result = parseFloat(result); // Hapus nol berlebihan
    }

    var historyItem = document.createElement("div");
    historyItem.innerText = expression + " = " + result;
    
    historyList.appendChild(historyItem);
}


// Modifikasi bagian dalam function calculate()
function calculate(num1, num2, operator){
    if (operator === "+"){
        total = (parseFloat)(num1)+(parseFloat)(num2)
    }
    else if (operator === "-"){
        total = (parseFloat)(num1)-(parseFloat)(num2)
    }
    else if (operator === "*"){
        total = (parseFloat)(num1)*(parseFloat)(num2)
    }
    else if (operator === "/"){
        total = (parseFloat)(num1)/(parseFloat)(num2)
    }

    // Jika total bukan integer, tampilkan maksimal 12 angka desimal
    if (!Number.isInteger(total)){
        total = total.toPrecision(12);
    }

    // Tambahkan hasil ke history
    addToHistory(num1 + " " + operator + " " + num2, total);

    return parseFloat(total);
}

function clearHistory() {
    var historyList = document.getElementById("history-list");
    historyList.innerHTML = "";
}

window.onload = function() {
    // Menandai link aktif di sidebar
    const currentPage = window.location.pathname;
    const links = document.querySelectorAll('#sidebar a');

    links.forEach(link => {
        if (link.href.includes(currentPage)) {
            link.classList.add('active');  // Menambahkan class active pada link yang sesuai
        } else {
            link.classList.remove('active');  // Menghapus class active dari link lain
        }
    });
};

// Fungsi untuk toggle sidebar saat tombol menu ditekan
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('sidebar-open');
}
