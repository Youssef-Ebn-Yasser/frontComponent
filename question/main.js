// select element

let countSpan = document.querySelector(".quiz-info .count span");
let bullts = document.querySelector(".bults");
let bulltsSpanContainer = document.querySelector(".bults .spans");
let quizArea = document.querySelector(".quiz-area");
let answersAre = document.querySelector(".answers-ares");
let submitButton = document.querySelector(".submit");
let resultsContainer = document.querySelector(".results");
let countDownSpan = document.querySelector(".count-down");



// set options
let currentIndex = 0;
let rightAnswers = 0;
let countDownInterval =0;

function getQuestions() {
    let myRequest = new XMLHttpRequest();
    let questionObjresponse;

    // ajax readyState
    // 0 => not start
    // 1 => start connect server
    // 2=> recive
    // 3=> process
    // 4 => finsh
    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            console.log(this.responseText)

            questionObjresponse = JSON.parse(this.responseText)
            //console.log(questionObj)

            let questionCount = questionObjresponse.length
            console.log(questionCount)

            // create  bullts + set question count
            createBullets(questionCount);

            // add question data
            addQuestionData(questionObjresponse[currentIndex], questionCount);

            // start count down 
            countDownFunction(15,questionCount)
            // click on submit 
            submitButton.onclick = () => {
                // get right answer
                let rightAnswer = questionObjresponse[0]["right-answer"];

                // increase index
                currentIndex++;
                // check the answer
                checkAnswer(rightAnswer, questionCount);

                // remove old question
                quizArea.innerHTML = "";
                answersAre.innerHTML = "";

                addQuestionData(questionObjresponse[currentIndex], questionCount);

                // handle bults
                handleBults();

                // set Count down
                clearInterval(countDownInterval);
                countDownFunction(5,questionCount);

                // show results
                showResults(questionCount);
            }


        }
    }
    myRequest.open("get", "html-question.json", true);
    myRequest.send();

    return questionObjresponse
}

let questionObj = getQuestions()
console.log(questionObj)
// questionObj 



function createBullets(num) {
    countSpan.innerHTML = num;

    // create spans

    for (let i = 0; i < num; i++) {

        // create span
        let theBults = document.createElement("span");

        // check if first span
        if (i === 0) {
            theBults.className = "on"
        }

        // apend bullts to main container
        bulltsSpanContainer.appendChild(theBults);
    }
}


function addQuestionData(obj, count) {
    if (currentIndex < count) {
        // create H2 question
        let questionTitle = document.createElement("h2");
        // create question text
        let questionText = document.createTextNode(obj.title);
        // append text to h2
        questionTitle.appendChild(questionText);
        // append h2
        quizArea.appendChild(questionTitle)

        // create the answers
        for (let i = 0; i < 4; i++) {
            // craete main answer div
            let mainDiv = document.createElement("div");
            mainDiv.className = "answer";

            // create radio input
            let radioInput = document.createElement("input");
            // add type name  id data Attribute
            radioInput.name = "question";
            radioInput.type = "radio";
            radioInput.id = `ans_${i + 1}`;
            radioInput.dataset.answer = obj[`ans_${i + 1}`];

            // create label
            let label = document.createElement("label");

            // add for attribut
            label.htmlFor = `ans_${i + 1}`;

            // create label text
            let labelText = document.createTextNode(obj[`ans_${i + 1}`]);
            // add the text to label
            label.appendChild(labelText)

            // append input + label to main div
            mainDiv.appendChild(radioInput);
            mainDiv.appendChild(label);

            answersAre.appendChild(mainDiv);
        }
    }
}

function checkAnswer(rightAnswer, questionCount) {
    let answers = document.getElementsByName("question");
    let theChoosenAnswer;

    for (let i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
            theChoosenAnswer = answers[i].dataset.answer;
        }
    }

    if (rightAnswer === theChoosenAnswer) {
        rightAnswers++;
    }


}


function handleBults() {
    let bultsSpans = document.querySelectorAll(".bults .spans span");
    let arrayOfSpan = Array.from(bultsSpans);

    arrayOfSpan.forEach((span, index) => {
        if (currentIndex === index) {
            span.className = "on";
        } else {
            span.className = "";
        }
    })

}

function showResults(questionCount){
    let result;

    if(currentIndex === questionCount){
        console.log("finish")
        quizArea.remove();
        answersAre.remove();
        submitButton.remove();
        bullts.remove();


        if(rightAnswers > (questionCount /2) && rightAnswers < questionCount){
            result = `<span class="good">Good </span> , ${rightAnswers} from ${questionCount} is right answer`;
        }else if (rightAnswers === questionCount) {
            result = `<span class="perfect">Perfect</span> , All answers true`;
        }else {
            result = `<span class="bad">Bad</span> , ${rightAnswers} from ${questionCount} right answer`;
        }

        resultsContainer.innerHTML = result;
        resultsContainer.style.padding = "20px";
        resultsContainer.style.backgroundcolor = "white";
    }
}

function countDownFunction(duration , count){
    if(currentIndex < count) {
        let minutes ,seconds;

        countDownInterval = setInterval(()=>{
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;


                countDownSpan.innerHTML = `${minutes}:${seconds}`

            if(--duration < 0){
                clearInterval(countDownInterval);
                submitButton.click();
            }
        },1000)
    }
}