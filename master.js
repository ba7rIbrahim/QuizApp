let countSpan = document.querySelector('.count span');
let spans = document.querySelector('.bullets .spans');
let quizArea = document.querySelector('.quiz-area');
let answerArea = document.querySelector('.answer-area');
let submit = document.querySelector('button');
let bullets = document.querySelector('.bullets');
let countDown = document.querySelector('.countdown');
let counterInterval;

let currentIndex = 0;
let countAnswer = 0;

let resultCount = document.querySelector('.result .qCount');

function getQuestions() {
  let request = new XMLHttpRequest();
  
  request.onreadystatechange = function() {
    if(this.readyState === 4 && this.status === 200) {
      let questionsObject = JSON.parse(this.responseText);
      let qCount = questionsObject.length;
      
      resultCount.innerHTML = qCount;

      createBullet(qCount);

      getData(questionsObject[currentIndex], qCount);

      countdown(5, qCount);
      

      submit.onclick  = function () {
        let rightAnswer = questionsObject[currentIndex].right_answer;
        currentIndex++;
        checkAnswer(rightAnswer, qCount);

        quizArea.innerHTML = '';
        answerArea.innerHTML = ''

        getData(questionsObject[currentIndex], qCount); 

        handelBullets(qCount);

        clearInterval(counterInterval);
        countdown(5, qCount);

        showResult(qCount);
      }
    }
  }
  request.open('GET', 'Questions.json');
  request.send();


}
getQuestions();

function createBullet(number) {
  countSpan.innerHTML = number;
  for(let i = 0; i < number; i++)  {
    let span = document.createElement('span');
    if(i == 0) span.classList.add('active');
    spans.append(span);
  }
}

function getData(obj, count) {
  if(currentIndex < count) {
    let qHeading = document.createElement('h2');
    qHeading.innerHTML = obj['title'];
    quizArea.append(qHeading);

    for(let i = 1; i <= 4; i++) {
      let answerDiv = document.createElement('div');
      answerDiv.classList.add('answer');
      let input = document.createElement('input');
      input.type = 'radio';
      input.id = `answer_${i}`;
      input.name = 'question';
      input.dataset.answer = obj[`answer_${i}`];

      if(i === 1) input.checked = true;

      let label = document.createElement('label');
      label.htmlFor = `answer_${i}`;
      label.innerHTML = obj[`answer_${i}`];
    
      answerDiv.append(input, label);

      answerArea.append(answerDiv);

    }
  }
}

function handelBullets() {
  let bulletsSpan = document.querySelectorAll('.bullets .spans span')
  let bulletsArray = Array.from(bulletsSpan);
  bulletsArray.forEach((ele, index) => {
    
    if(currentIndex == index) {
      ele.classList.add('active');
    }
  });
}

function checkAnswer(rAnswer, count) {
  let radioChecked = document.getElementsByName('question');
  let chooseAnswer;
    radioChecked.forEach((ele) => {
      if(ele.checked) {
        chooseAnswer = ele.dataset.answer;
      }
  });

  if(chooseAnswer === rAnswer) {
    countAnswer++;
  }
}

function end() {
  let end = document.createElement('div');
  end.classList.add('end');
  end.innerHTML = 'End Questions';
  answerArea.append(end);
}

function showResult(count) {
  if(currentIndex === count) {
    quizArea.remove();
    answerArea.remove();
    submit.remove();
    bullets.remove();

    let rightAnswer = document.querySelector('.result .currentIndex');
    let spanResult = document.querySelector('.result > span');

    rightAnswer.innerHTML = countAnswer;

    if(countAnswer == count) {
      spanResult.innerHTML = 'Perfect' + ', ';
      spanResult.classList.add('perfect');
    }
    else if(countAnswer >= 4 && countAnswer < count) {
      spanResult.innerHTML = 'Good' + ', ';
      spanResult.classList.add('good');
    }
    else {
      spanResult.innerHTML = 'Bad' + ', ';
      spanResult.classList.add('bad');
    }
  }
}

function countdown(duration, count) {
  let min, sec;

  if(currentIndex < count) {

    counterInterval = setInterval (() => {
      min = parseInt(duration / 60);
      sec = parseInt(duration % 60);

      min = min < 10 ? `0${min}` : min;
      sec = sec < 10 ? `0${sec}` : sec;

      countDown.innerHTML = `${min}:${sec}`;
      
      if(--duration < 0) {
        clearInterval(counterInterval);
        submit.click();
      }

    }, 1000);
  }
}