document.addEventListener("keydown", handleKeydown)
document.addEventListener("click", () => document.documentElement.requestFullscreen())
document.addEventListener("dblclick", changeGoals)

const input = document.querySelector(".input")
const speedPointerElement = document.querySelector(".speed-container .needle")
const accuracyPointerElement = document.querySelector(".accuracy-container .needle")

const spanCharacters = []
const numberCheckpoints = [45, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300]
const numberCheckpointsColor = [
 "#B3E5FC",
 "#81D4FA",
 "#FFF9C4",
 "#FFF59D",
 "#C5E1A5",
 "#AED581",
 "#FFCC80",
 "#FFA726",
 "#FF7043",
 "#F44336",
 "#D32F2F",
]
const paragraphs = [
 "Speed up and feel the beat! Hit the right pace, and the phonk music will ignite your flow. Type fast, let the rhythm guide you, and enjoy the ride!",
 "Typing quickly and accurately is a skill that comes with practice. Focus on each word and let your fingers flow effortlessly over the keyboard. Speed will come naturally as you refine your technique. Stay consistent, and soon you’ll see the results.",
 "Ahmed you’ve reached a typing challenge this is a test to see if you can type your own name correctly. I bet you didn't pass.",
]

const paragraph = paragraphs[Math.floor(Math.random() * paragraphs.length)]
let typedParagraph = ""

let cursorPosition = -1
let mistakes = 0
let accuracy
let accuracyAngle
let currentAccuracyAngle = 45
let speed
let speedAngle
let currentSpeedAngle = 45
let statsInterval
let timerInterval
let timer = 0
let speedGoal = numberCheckpoints[3]
let accuracyGoal = numberCheckpoints[8]

const kerosene = new Audio("kerosene.mp3")

for (let i in paragraph) {
 const span = document.createElement("span")
 span.innerHTML = paragraph[i]
 input.appendChild(span)
 spanCharacters.push(span)
}

function handleKeydown(e) {
 if (e.key === "Control") beat()
 if (e.key.length === 1) addLetter(e.key)
 else if (e.key === "Backspace") removeLetter()
}

function addLetter(letter) {
 if (timer === 0) startTimer()
 if (cursorPosition + 1 === paragraph.length) return
 typedParagraph += letter
 cursorPosition++
 check()
}

function removeLetter() {
 if (typedParagraph.length === 0 || paragraph[cursorPosition] === " " || cursorPosition + 1 === paragraph.length) return
 spanCharacters[cursorPosition].style.color = "var(--placeholder)"
 typedParagraph = typedParagraph.slice(0, -1)
 cursorPosition--
 spanCharacters.forEach((character) => (character.style.borderRightColor = "transparent"))
 spanCharacters[cursorPosition].style.borderRightColor = "var(--correct)"
}

function check() {
 const character = spanCharacters[cursorPosition]
 if (typedParagraph[cursorPosition] === paragraph[cursorPosition]) character.style.color = "var(--correct)"
 else {
  if (character.innerHTML === " ") character.style.background = "var(--incorrect)"
  character.style.color = "var(--incorrect)"
  mistakes++
 }
 spanCharacters.forEach((character) => (character.style.borderRightColor = "transparent"))
 character.style.borderRightColor = "var(--correct)"
}

function calculateStats() {
 accuracy = Math.floor(((typedParagraph.length - mistakes) / (typedParagraph.length + mistakes)) * 100)
 accuracyAngle = (260 / 100) * accuracy + 45

 speed = Math.floor((typedParagraph.length - mistakes) / 5 / (timer / 60))
 speedAngle = (260 / 100) * speed + 45
}

function displayStats() {
 statsInterval = setInterval(() => {
  calculateStats()

  if (currentAccuracyAngle < accuracyAngle) currentAccuracyAngle++
  else if (currentAccuracyAngle > accuracyAngle) currentAccuracyAngle--
  accuracyPointerElement.style.transform = `rotate(${currentAccuracyAngle}deg)`

  if (currentSpeedAngle < speedAngle) currentSpeedAngle++
  else if (currentSpeedAngle > speedAngle) currentSpeedAngle--
  speedPointerElement.style.transform = `rotate(${currentSpeedAngle}deg)`

  displayNumberCheckpoints()
 }, 1)
}

function startTimer() {
 displayStats()
 timer = 1
 timerInterval = setInterval(() => {
  timer++
  if (timer > 5 && currentSpeedAngle > speedGoal && currentAccuracyAngle > accuracyGoal) kerosene.play()
  if (cursorPosition + 1 === paragraph.length) {
   clearInterval(statsInterval)
   clearInterval(timerInterval)
  }
 }, 1000)
}

let allAccuracyNumbers = Array.from(document.querySelectorAll(".accuracy-container .number"))
let allSpeedNumbers = Array.from(document.querySelectorAll(".speed-container .number"))

function displayNumberCheckpoints() {
 for (let i in numberCheckpoints) {
  if (currentAccuracyAngle > numberCheckpoints[i]) allAccuracyNumbers[i].style.color = numberCheckpointsColor[i]
  else allAccuracyNumbers[i].style.color = "transparent"
  if (currentSpeedAngle > numberCheckpoints[i]) allSpeedNumbers[i].style.color = numberCheckpointsColor[i]
  else allSpeedNumbers[i].style.color = "transparent"
 }
}

function changeGoals() {
 if (speedGoal === numberCheckpoints[3]) {
  speedGoal = numberCheckpoints[6]
  accuracyGoal = numberCheckpoints[9]
  document.querySelector(".speed-container .number:first-child").style.color = "red"
  document.querySelector(".accuracy-container .number:first-child").style.color = "red"
 } else {
  speedGoal = numberCheckpoints[3]
  accuracyGoal = numberCheckpoints[8]
  document.querySelector(".speed-container .number:first-child").style.color = "lightblue"
  document.querySelector(".accuracy-container .number:first-child").style.color = "lightblue"
 }
}

let currentBeatIndex = 0
kerosene.addEventListener("timeupdate", beat)
kerosene.addEventListener("ended", () =>
 document.querySelectorAll(".stats-container > div").forEach((div) => div.classList.remove("opacity-effect"))
)

function beat() {
 if (Math.floor(kerosene.currentTime) === 12)
  document.querySelectorAll(".stats-container > div").forEach((div) => div.classList.add("opacity-effect"))
 if (kerosene.currentTime >= 12.5 + currentBeatIndex) {
  randomDuration = Math.floor(Math.random() * (500 - 100)) + 100
  randomDelay = Math.floor(Math.random() * (5 - 0.5)) + 0.5
  currentBeatIndex += 1.59
  document.querySelectorAll(".stats-container > div").forEach((div) => {
   div.style.transform = "scale(1.1)"
   div.style.animationDuration = randomDuration + "ms"
   div.style.animationDelay = randomDelay + "s"
   setTimeout(() => (div.style.transform = "scale(1)"), 100)
  })
 }
}
