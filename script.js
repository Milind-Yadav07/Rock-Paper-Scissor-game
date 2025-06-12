const selectionButtons = document.querySelectorAll('[data-selection]')
const finalColumn = document.querySelector('[data-final-column]')
const computerScoreSpan = document.querySelector('[data-computer-score]')
const yourScoreSpan = document.querySelector('[data-your-score]')
const roundNumberSpan = document.getElementById('round-number')
const roundMessageDiv = document.getElementById('round-message')
const resetButton = document.getElementById('reset-button')

const SELECTIONS = [
  {
    name: 'rock',
    emoji: '✊',
    beats: 'scissors'
  },
  {
    name: 'paper',
    emoji: '✋',
    beats: 'rock'
  },
  {
    name: 'scissors',
    emoji: '✌',
    beats: 'paper'
  }
]

let roundNumber = 0

// Sound effects using Web Audio API
const audioCtx = new (window.AudioContext || window.webkitAudioContext)()

function playSound(frequency, duration = 200) {
  const oscillator = audioCtx.createOscillator()
  const gainNode = audioCtx.createGain()
  oscillator.connect(gainNode)
  gainNode.connect(audioCtx.destination)
  oscillator.type = 'square'
  oscillator.frequency.value = frequency
  oscillator.start()
  gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime)
  oscillator.stop(audioCtx.currentTime + duration / 1000)
}

selectionButtons.forEach(selectionButton => {
  selectionButton.addEventListener('click', e => {
    const selectionName = selectionButton.dataset.selection
    const selection = SELECTIONS.find(selection => selection.name === selectionName)
    makeSelection(selection)
  })
})

resetButton.addEventListener('click', resetGame)

// Keyboard support for R, P, S keys
window.addEventListener('keydown', e => {
  if (e.repeat) return
  const key = e.key.toLowerCase()
  let selectionName = null
  if (key === 'r') selectionName = 'rock'
  else if (key === 'p') selectionName = 'paper'
  else if (key === 's') selectionName = 'scissors'
  if (selectionName) {
    const selection = SELECTIONS.find(selection => selection.name === selectionName)
    if (selection) {
      makeSelection(selection)
      playSound(440, 100) // Play selection sound
    }
  }
})

function makeSelection(selection) {
  roundNumber++
  roundNumberSpan.innerText = roundNumber

  const computerSelection = randomSelection()
  const yourWinner = isWinner(selection, computerSelection)
  const computerWinner = isWinner(computerSelection, selection)

  clearPreviousResults()

  addSelectionResult(computerSelection, computerWinner)
  addSelectionResult(selection, yourWinner)

  if (yourWinner) {
    incrementScore(yourScoreSpan)
    roundMessageDiv.innerText = "You won this round! 🎉"
  } else if (computerWinner) {
    incrementScore(computerScoreSpan)
    roundMessageDiv.innerText = "Computer won this round! 🤖"
  } else {
    roundMessageDiv.innerText = "It's a tie! 🤝"
  }
}

function incrementScore(scoreSpan) {
  scoreSpan.innerText = parseInt(scoreSpan.innerText) + 1
}

function addSelectionResult(selection, winner) {
  const div = document.createElement('div')
  div.innerText = selection.emoji
  div.classList.add('result-selection')
  if (winner) div.classList.add('winner')
  finalColumn.after(div)
}

function clearPreviousResults() {
  const previousResults = document.querySelectorAll('.result-selection')
  previousResults.forEach(result => result.remove())
}

function isWinner(selection, opponentSelection) {
  return selection.beats === opponentSelection.name
}

function randomSelection() {
  const randomIndex = Math.floor(Math.random() * SELECTIONS.length)
  return SELECTIONS[randomIndex]
}

function resetGame() {
  roundNumber = 0
  roundNumberSpan.innerText = roundNumber
  yourScoreSpan.innerText = '0'
  computerScoreSpan.innerText = '0'
  roundMessageDiv.innerText = ''
  clearPreviousResults()
}
