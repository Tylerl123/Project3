// the state of the application
///////////////
const appState = {
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
  appState.current_view = "#intro_view";
  appState.current_model = {
    action: "Start"
  }
  update_view(appState); 

  document.querySelector("#widget_view").onclick = (e) => {
    handle_widget_event(e)
  }
});


//this deals with the different type of views
/////////////////

function handle_widget_event(e) {

  if (appState.current_view == "#intro_view") {
    if (e.target.dataset.action == "Start") {

      // Update State (current model + state variables)
      appState.current_question = 0
      user = document.querySelector("#name").value;

      appState.current_model = questions[appState.current_question];
      // process the appState, based on question type update appState.current_view
      setQuestionView(appState);

      // Now that the state is updated, update the view.

      update_view(appState);

      updateGrade(appState);
    }
  }

  //deals with the image view
  /////////////////
  if (appState.current_view == "#view_image_selection") {
    if (e.target.dataset.action == "answer") {
      user_response = e.target.dataset.answer;
    }
    if (e.target.dataset.action == "submit") {
      check_user_response(user_response, appState.current_model)
    }
  }
  //deals with the text input view
  /////////////////
   if (appState.current_view == "#view_text_input") {
    if (e.target.dataset.action == "submit") {
      user_response = document.querySelector(`#${appState.current_model.answerFieldId}`).value;
      check_answer(user_response, appState.current_model)
    }
  }
  //deals with the multiple choice view
  /////////////////
  if (appState.current_view == "#view_multiple_choice") {

    if (e.target.dataset.action == "answer") {
      user_response = e.target.dataset.answer;
    }
    if (e.target.dataset.action == "submit") {
      check_answer(user_response, appState.current_model)
    }
  }


  // deals with true/false questions.
  /////////////////
  if (appState.current_view == "#view_true_false") {

    if (e.target.dataset.action == "answer") {
      user_response = e.target.dataset.answer;
    }
    if (e.target.dataset.action == "submit") {
      check_answer(user_response, appState.current_model)
    }
  }

  // deals with the multiple selection.
  ///////////////////
  if (appState.current_view == "#view_multiple_selection") {

    if (e.target.dataset.action == "submit") {
      var selectValue = document.getElementById("list").value;
      user_response = selectValue
      check_answer(user_response, appState.current_model)
    }
  }

  //gives feed back if wrong
 //////////////////// 

  if (appState.current_view == "#feedback_incorrect") {
    if (e.target.dataset.action == "next") {
      updateQuestion(appState);
    }
  }

 

  // the final view being diplayed
  ///////////////////
  if (appState.current_view == "#end_view") {
    startstopClock();
    let grade = ((appState.currentGrade / appState.answered_questions) * 100);
    if (grade > 80) {
      document.getElementById("result").innerHTML = "Your Grade is" + grade + "% <br> " + user + "Congrates You have passes the quiz";
    }
    else {
      document.getElementById("result").innerHTML = "Your Grade is " + grade + "% <br>" + user + " Sorry but you have failed the quiz, please try again";
    }
    if (e.target.dataset.action == "Start_Again") {
      appState.current_question = 0
      appState.currentGrade = 0
      appState.answered_questions = 0
      appState.current_model = questions[appState.current_question];
     
      setQuestionView(appState);

      update_view(appState);
      resetClock();
      startstopClock();
      updateGrade(appState)

    }
    if (e.target.dataset.action == "intro_page") {
      appState.currentGrade = 0
      appState.answered_questions = 0
      appState.current_view = "#intro_view";
      appState.current_model = {
        action: "Start"
      }
      update_view(appState);
      resetClock();
    }
  }

} 

//This sets each question type
//////////////////

function setQuestionView(appState) {
  if (appState.current_question == -2) {
    appState.current_view = "#end_view";
    return
  }
  if (appState.current_model.questionType == "multiple_choice") {
    appState.current_view = "#view_multiple_choice";
  }
  else if (appState.current_model.questionType == "true_false") {
    appState.current_view = "#view_true_false";
  }
  else if (appState.current_model.questionType == "text_input") {
    appState.current_view = "#view_text_input";
  }
  else if (appState.current_model.questionType == "multiple_list") {
    appState.current_view = "#view_multiple_selection";
  }
  else if (appState.current_model.questionType == "image_choices") {
    appState.current_view = "#view_image_selection";
  }
} 

//This updates the question from the previous
/////////////////
function updateQuestion(appState) {
  if (appState.current_question < questions.length - 1) {
    appState.current_question = appState.current_question + 1;
    appState.current_model = questions[appState.current_question];
  }
  else {
    appState.current_question = -2;
    appState.current_model = {};
  }
  setQuestionView(appState);
  update_view(appState);
}

//This checks the user answer if it is correct
/////////////////
function check_answer(user_answer, model) {
  if (user_answer == model.correctAnswer) {
    appState.currentGrade++;
    document.querySelector("#widget_view").innerHTML = `
    <div class="container">
    <h2>Correct</h2>
    </div>`
    setTimeout(() => {
      updateQuestion(appState);
    }, 1000);
  }
  else {
    appState.current_view = "#feedback_incorrect";
    update_view(appState);
  }
  appState.answered_questions++;
  updateGrade(appState);
}



//this updates the grade from 0
/////////////////

function updateGrade(appState) {
  document.querySelector("#comppleted").querySelector("p").innerHTML = `Questions: ${appState.answered_questions}`;
  var accuracy = Math.floor((appState.currentGrade / appState.answered_questions) * 100);
  document.querySelector("#currentGrade").querySelector("p").innerHTML = `Grade: ${accuracy} %`;
}

//This update the overall view
////////////////
function update_view(appState) {
  const html_element = render_widget(appState.current_model, appState.current_view)
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
  var html_widget_element = template({ ...model, ...appState })

  return html_widget_element
  
}     //end of js file
