// the state of the application
///////////////
const quizState = {
  current_view: "#intro_view",
  currentGrade: 0,
  current_question: -1,
  answered_questions: 0,
  current_model: {}
}

let questions = [

];

let user = "";

//retieves the files that is json
////////////
function f1() {
  var quiz = document.getElementById("quiz");
  var quiz2 = document.getElementById("quiz2");

  if (quiz.checked == true)
    fetch("quiz.json")
      .then(res => { console.log(res);
        return res.json();
      }).then(loaded_questions => { console.log(loaded_questions);
        questions = loaded_questions;
      })
      .catch(err => { console.error(err);
      });
  else if (quiz2.checked == true)
    fetch("quiz2.json")
      .then(res => { console.log(res);
        return res.json();
      }).then(loaded_questions => { console.log(loaded_questions);
        questions = loaded_questions;
      })
      .catch(err => { console.error(err);
      });
  else
    alert("Please select a quiz inorder to continue");
  return false;
}
//sets the intial values for timer
//////////////

let seconds = 0;
let minutes = 0;
let hours = 0;
let displaySeconds = 0;
let displayMinutes = 0;
let displayHours = 0;
let interval = null;
let status = "stopped";

//sets the function of the timer
/////////
function timer() {
  seconds++;
  if (seconds / 60 === 1) {
    seconds = 0;
    minutes++;

    if (minutes / 60 === 1) {
      minutes = 0;
      hours++;
    }
  }
  if (seconds < 10) {
    displaySeconds = "0" + seconds.toString();
  }
  else {
    displaySeconds = seconds;
  }

  if (minutes < 10) {
    displayMinutes = "0" + minutes.toString();
  }
  else {
    displayMinutes = minutes;
  }

  if (hours < 10) {
    displayHours = "0" + hours.toString();
  }
  else {
    displayHours = hours;
  }
  document.getElementById("timer").innerHTML = displayHours + ":" + displayMinutes + ":" + displaySeconds;
}
//this set a function to reset the clock
///////////

function resetClock(){
  window.clearInterval(interval);
  seconds = 0;
  minutes = 0;
  hours = 0;
  document.getElementById("timer").innerHTML = "00:00:00";
  document.getElementById("startStopClock").innerHTML = "Start";
}
//This function starts or stops the clock
//////////////////////

function startstopClock(){

  if(status === "stopped"){
      interval = window.setInterval(timer, 1000);
      status = "started";
  }
  else{
      window.clearInterval(interval);
      status = "stopped";
  }
}









// start: begins the quiz.
////////////////

document.addEventListener('DOMContentLoaded', () => {
  // Set the state
  quizState.current_view = "#intro_view";
  quizState.current_model = {
    action: "Start"
  }
  update_view(quizState); 

  document.querySelector("#widget_view").onclick = (e) => {
    handle_widget_event(e)
  }
});


//this deals with the different type of views
/////////////////

function handle_widget_event(e) {

  if (quizState.current_view == "#intro_view") {
    if (e.target.dataset.action == "Start") {

    
      quizState.current_question = 0
      user = document.querySelector("#name").value;

      quizState.current_model = questions[quizState.current_question];
     
      setQuestionView(quizState);

      update_view(quizState);

      updateGrade(quizState);
    }
  }

  //deals with the image view
  /////////////////
  if (quizState.current_view == "#view_image_selection") {
    if (e.target.dataset.action == "answer") {
      user_pick = e.target.dataset.answer;
    }
    if (e.target.dataset.action == "submit") {
      check_answer(user_pick, quizState.current_model)
    }
  }
  //deals with the text input view
  /////////////////
   if (quizState.current_view == "#view_text_input") {
    if (e.target.dataset.action == "submit") {
      user_pick = document.querySelector(`#${quizState.current_model.answerFieldId}`).value;
      check_answer(user_pick, quizState.current_model)
    }
  }
  //deals with the multiple choice view
  /////////////////
  if (quizState.current_view == "#view_multiple_choice") {

    if (e.target.dataset.action == "answer") {
      user_pick = e.target.dataset.answer;
    }
    if (e.target.dataset.action == "submit") {
      check_answer(user_pick, quizState.current_model)
    }
  }


  // deals with true/false questions.
  /////////////////
  if (quizState.current_view == "#view_true_false") {

    if (e.target.dataset.action == "answer") {
      user_pick = e.target.dataset.answer;
    }
    if (e.target.dataset.action == "submit") {
      check_answer(user_pick, quizState.current_model)
    }
  }

  // deals with the multiple selection.
  ///////////////////
  if (quizState.current_view == "#view_multiple_selection") {

    if (e.target.dataset.action == "submit") {
      var valueList = document.getElementById("list").value;
      user_pick = valueList
      check_answer(user_pick, quizState.current_model)
    }
  }

  //gives feed back if wrong
 //////////////////// 

  if (quizState.current_view == "#feedback_incorrect") {
    if (e.target.dataset.action == "next") {
      updateQuestion(quizState);
    }
  }

 

  // the final view being diplayed
  ///////////////////
  if (quizState.current_view == "#end_view") {
    startstopClock();
    let grade = ((quizState.currentGrade / quizState.answered_questions) * 100);
    if (grade > 65) {
      document.getElementById("result").innerHTML = "Your Grade is" + grade + "% <br> " + user + "Congrates You have passes the quiz";
    }
    else {
      document.getElementById("result").innerHTML = "Your Grade is " + grade + "% <br>" + user + " Sorry but you have failed the quiz, please try again";
    }
    if (e.target.dataset.action == "Start_Again") {
      quizState.current_question = 0
      quizState.currentGrade = 0
      quizState.answered_questions = 0
      quizState.current_model = questions[quizState.current_question];
     
      setQuestionView(quizState);

      update_view(quizState);
      resetClock();
      startstopClock();
      updateGrade(quizState)

    }
    if (e.target.dataset.action == "intro_page") {
      quizState.currentGrade = 0
      quizState.answered_questions = 0
      quizState.current_view = "#intro_view";
      quizState.current_model = {
        action: "Start"
      }
      update_view(quizState);
      resetClock();
    }
  }

} 

//This sets each question type
//////////////////

function setQuestionView(quizState) {
  if (quizState.current_question == -2) {
    quizState.current_view = "#end_view";
    return
  }
  if (quizState.current_model.questionType == "multiple_choice") {
    quizState.current_view = "#view_multiple_choice";
  }
  else if (quizState.current_model.questionType == "true_false") {
    quizState.current_view = "#view_true_false";
  }
  else if (quizState.current_model.questionType == "text_input") {
    quizState.current_view = "#view_text_input";
  }
  else if (quizState.current_model.questionType == "multiple_list") {
    quizState.current_view = "#view_multiple_selection";
  }
  else if (quizState.current_model.questionType == "image_choices") {
    quizState.current_view = "#view_image_selection";
  }
} 

//This updates the question from the previous
/////////////////
function updateQuestion(quizState) {
  if (quizState.current_question < questions.length - 1) {
    quizState.current_question = quizState.current_question + 1;
    quizState.current_model = questions[quizState.current_question];
  }
  else {
    quizState.current_question = -2;
    quizState.current_model = {};
  }
  setQuestionView(quizState);
  update_view(quizState);
}

//This checks the user answer if it is correct
/////////////////
function check_answer(user_answer, model) {
  if (user_answer == model.correctAnswer) {
    quizState.currentGrade++;
    document.querySelector("#widget_view").innerHTML = `
    <div class="container">
    <h2>Correct</h2>
    </div>`
    setTimeout(() => {
      updateQuestion(quizState);
    }, 1000);
  }
  else {
    quizState.current_view = "#feedback_incorrect";
    update_view(quizState);
  }
  quizState.answered_questions++;
  updateGrade(quizState);
}



//this updates the grade from 0
/////////////////

function updateGrade(quizState) {
  document.querySelector("#comppleted").querySelector("p").innerHTML = `Questions: ${quizState.answered_questions}`;
  var score = Math.floor((quizState.currentGrade / quizState.answered_questions) * 100);
  document.querySelector("#currentGrade").querySelector("p").innerHTML = `Grade: ${score} %`;
}

//This update the overall view
////////////////
function update_view(quizState) {
  const html_element = render_widget(quizState.current_model, quizState.current_view)
  document.querySelector("#widget_view").innerHTML = html_element;
}

//this deals with the template source
/////////////////////
const render_widget = (model, view) => {
  // Get the template HTML
  template_source = document.querySelector(view).innerHTML
  // Handlebars compiles the above source into a template
  var template = Handlebars.compile(template_source);

  // apply the model to the template.
  var html_widget_element = template({ ...model, ...quizState })

  return html_widget_element
  
}     //end of js file
