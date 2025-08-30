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
        if(this.readyState === 4 && this.status === 200){
            console.log(this.responseText)

            questionObjresponse = JSON.parse(this.responseText)
            //console.log(questionObj)
        }
    }
    myRequest.open("get","html-question.json",true);
    myRequest.send();

    return questionObjresponse
}

let questionObj = getQuestions()
console.log(questionObj)
// questionObj 



