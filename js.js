document.addEventListener('DOMContentLoaded', () => {
  new BOMBS();
})

class BOMBS{
  constructor() {
    this.grid = document.querySelector('.grid')
    this.flagsLeft = document.querySelector('#flags-left')
    this.result = document.querySelector('.result')
    this.controls = document.querySelector('.controls')
    this.restart = document.querySelector('.restart')
    
    this.flags = 0
    this.squares = []
    this.isGameOver = false

    this.selectMode()
    
  }
  
  selectMode(){
    const controlBtns = Array.from(this.controls.querySelectorAll('.start')) 

    controlBtns.map((btn) => {
      btn.addEventListener('click', () => {
        this.mode = btn.innerText

        switch (this.mode) {
          case 'easy':
            this.width = 10
            this.bombAmount = 20
            this.start(this.mode, this.width, this.bombAmount)
            this.controls.remove()
            
            break;
            case 'normal':
            this.width = 16
            this.bombAmount = 65
            this.start(this.mode, this.width, this.bombAmount)
            this.controls.remove()
            
            break;
          case 'pro':
            this.width = 20
            this.bombAmount = 85
            this.start(this.mode, this.width, this.bombAmount)
            this.controls.remove()
            break;
        
          default:
            break;
        }
      })
    })

  }
  start(mode, width, bombAmount) {
    this.flagsLeft.innerHTML = this.bombAmount

    //get shuffled game array with random bombs
    const bombsArray = Array(bombAmount).fill('bomb')
    const emptyArray = Array(width * width - bombAmount).fill('valid')
    const gameArray = emptyArray.concat(bombsArray)
    const shuffledArray = gameArray.sort(() => Math.random() - 0.5)

    for(let i = 0; i < width * width; i++) {
      const square = document.createElement('div')
      square.setAttribute('id', i)
      square.classList.add(shuffledArray[i])

      this.grid.appendChild(square)
      this.squares.push(square)

      //normal click
      square.addEventListener('click', () => {
        console.log(square);
          this.click(square)
      })

      // left click
      square.oncontextmenu = (e) => {
        e.preventDefault()
        this.addFlag(square)
      }
    }

    //add numbers
    for (let i = 0; i < this.squares.length; i++) {
      let total = 0
      const isLeftEdge = (i % width === 0)
      const isRightEdge = (i % width === width - 1)

      switch (mode) {
        case 'easy':
          if (this.squares[i].classList.contains('valid')) {
            if (i > 0 && !isLeftEdge && this.squares[i - 1].classList.contains('bomb')) total ++
            if (i > 9 && !isRightEdge && this.squares[i + 1 - width].classList.contains('bomb')) total ++
            if (i > 10 && this.squares[i - width].classList.contains('bomb')) total ++
            if (i > 11 && !isLeftEdge && this.squares[i - 1 - width].classList.contains('bomb')) total ++

            if (i < 98 && !isRightEdge && this.squares[i + 1 ].classList.contains('bomb')) total ++
            if (i < 90 && !isLeftEdge && this.squares[i - 1 + width].classList.contains('bomb')) total ++
            if (i < 88 && !isRightEdge && this.squares[i + 1 + width].classList.contains('bomb')) total ++
            if (i < 89 && this.squares[i + width].classList.contains('bomb')) total ++
  
            this.squares[i].setAttribute('data', total)
          }
          
          break;
          
        case 'normal':
          this.grid.classList.add('normal')

          if (this.squares[i].classList.contains('valid')) {
            if (i > 0 && !isLeftEdge && this.squares[i - 1].classList.contains('bomb')) total ++
            if (i > 15 && !isRightEdge && this.squares[i + 1 - width].classList.contains('bomb')) total ++
            if (i > 16 && this.squares[i - width].classList.contains('bomb')) total ++
            if (i > 17 && !isLeftEdge && this.squares[i - 1 - width].classList.contains('bomb')) total ++

            if (i < 254 && !isRightEdge && this.squares[i + 1 ].classList.contains('bomb')) total ++
            if (i < 240 && !isLeftEdge && this.squares[i - 1 + width].classList.contains('bomb')) total ++
            if (i < 238 && !isRightEdge && this.squares[i + 1 + width].classList.contains('bomb')) total ++
            if (i < 239 && this.squares[i + width].classList.contains('bomb')) total ++
  
            this.squares[i].setAttribute('data', total)
          }

          break;

        case 'pro':
          this.grid.classList.add('pro')

          if (this.squares[i].classList.contains('valid')) {
            if (i > 0 && !isLeftEdge && this.squares[i - 1].classList.contains('bomb')) total ++
            if (i > 19 && !isRightEdge && this.squares[i + 1 - width].classList.contains('bomb')) total ++
            if (i > 20 && this.squares[i - width].classList.contains('bomb')) total ++
            if (i > 21 && !isLeftEdge && this.squares[i - 1 - width].classList.contains('bomb')) total ++

            if (i < 398 && !isRightEdge && this.squares[i + 1 ].classList.contains('bomb')) total ++
            if (i < 380 && !isLeftEdge && this.squares[i - 1 + width].classList.contains('bomb')) total ++
            if (i < 378 && !isRightEdge && this.squares[i + 1 + width].classList.contains('bomb')) total ++
            if (i < 379 && this.squares[i + width].classList.contains('bomb')) total ++
  
            this.squares[i].setAttribute('data', total)
          }

          break;
        default:
          break;
      }
    }
  }

  addFlag(square) {
    if (this.isGameOver) return

    if (!square.classList.contains('checked') && (this.flags < this.bombAmount)) {
      if (!square.classList.contains('flag')) {
        square.classList.add('flag')
        square.innerHTML = ' 🚩'
        this.flags ++
        this.flagsLeft.innerHTML = this.bombAmount - this.flags
        this.checkForWin()
      } else {
        square.classList.remove('flag')
        square.innerHTML = ''
        this.flags --
        this.flagsLeft.innerHTML = this.bombAmount - this.flags
      }
    }
  }

  click(square) {
    let currentId = square.id
    if (this.isGameOver) return

    if (square.classList.contains('checked') || square.classList.contains('flag')) return

    if (square.classList.contains('bomb')) {
      this.gameOver()
    } else {
      let total = square.getAttribute('data')

      if (total != 0) {
        square.classList.add('checked')

        if (total == 1) square.classList.add('one')
        if (total == 2) square.classList.add('two')
        if (total == 3) square.classList.add('three')
        if (total == 4) square.classList.add('four')
        if (total == 5) square.classList.add('five')
        if (total == 6) square.classList.add('six')
        if (total == 7) square.classList.add('seven')
        if (total == 8) square.classList.add('eight')

        square.innerHTML = total

        return
      }

      this.checkSquare(this.mode, currentId)
    }

    square.classList.add('checked')
  }

  checkSquare(mode, currentId) {
    const isLeftEdge = (currentId % this.width === 0)
    const isRightEdge = (currentId % this.width === this.width - 1)
    
    switch (mode) {
      case 'easy':
        setTimeout(() => {
          if (currentId > 0 && !isLeftEdge) {
            const newId = this.squares[parseInt(currentId) - 1].id
            const newSquare = document.getElementById(newId)
            this.click(newSquare)
          }
          if (currentId > 9 && !isRightEdge) {
            const newId = this.squares[parseInt(currentId) + 1 - this.width].id
            const newSquare = document.getElementById(newId)
            this.click(newSquare)
          }
          if (currentId > 10) {
            const newId = this.squares[parseInt(currentId -this.width)].id
            const newSquare = document.getElementById(newId)
            this.click(newSquare)
          }
          if (currentId > 11 && !isLeftEdge) {
            const newId = this.squares[parseInt(currentId) -1 -this.width].id
            const newSquare = document.getElementById(newId)
            this.click(newSquare)
          }
          if (currentId < 98 && !isRightEdge) {
            const newId = this.squares[parseInt(currentId) +1].id
            const newSquare = document.getElementById(newId)
            this.click(newSquare)
          }
          if (currentId < 90 && !isLeftEdge) {
            const newId = this.squares[parseInt(currentId) -1 +this.width].id
            const newSquare = document.getElementById(newId)
            this.click(newSquare)
          }
          if (currentId < 88 && !isRightEdge) {
            const newId = this.squares[parseInt(currentId) +1 +this.width].id
            const newSquare = document.getElementById(newId)
            this.click(newSquare)
          }
          if (currentId < 89) {
            const newId = this.squares[parseInt(currentId) +this.width].id
            const newSquare = document.getElementById(newId)
            this.click(newSquare)
          }
        }, 10)
        
        break;
        
      case 'normal':
        setTimeout(() => {
          if (currentId > 0 && !isLeftEdge) {
            const newId = this.squares[parseInt(currentId) - 1].id
            const newSquare = document.getElementById(newId)
            this.click(newSquare)
          }
          if (currentId > 15 && !isRightEdge) {
            const newId = this.squares[parseInt(currentId) + 1 - this.width].id
            const newSquare = document.getElementById(newId)
            this.click(newSquare)
          }
          if (currentId > 16) {
            const newId = this.squares[parseInt(currentId -this.width)].id
            const newSquare = document.getElementById(newId)
            this.click(newSquare)
          }
          if (currentId > 17 && !isLeftEdge) {
            const newId = this.squares[parseInt(currentId) -1 -this.width].id
            const newSquare = document.getElementById(newId)
            this.click(newSquare)
          }
          if (currentId < 254 && !isRightEdge) {
            const newId = this.squares[parseInt(currentId) +1].id
            const newSquare = document.getElementById(newId)
            this.click(newSquare)
          }
          if (currentId < 240 && !isLeftEdge) {
            const newId = this.squares[parseInt(currentId) -1 +this.width].id
            const newSquare = document.getElementById(newId)
            this.click(newSquare)
          }
          if (currentId < 238 && !isRightEdge) {
            const newId = this.squares[parseInt(currentId) +1 +this.width].id
            const newSquare = document.getElementById(newId)
            this.click(newSquare)
          }
          if (currentId < 239) {
            const newId = this.squares[parseInt(currentId) +this.width].id
            const newSquare = document.getElementById(newId)
            this.click(newSquare)
          }
        }, 10)
        
      case 'pro':
        setTimeout(() => {
          if (currentId > 0 && !isLeftEdge) {
            const newId = this.squares[parseInt(currentId) - 1].id
            const newSquare = document.getElementById(newId)
            this.click(newSquare)
          }
          if (currentId > 19 && !isRightEdge) {
            const newId = this.squares[parseInt(currentId) + 1 - this.width].id
            const newSquare = document.getElementById(newId)
            this.click(newSquare)
          }
          if (currentId > 20) {
            const newId = this.squares[parseInt(currentId -this.width)].id
            const newSquare = document.getElementById(newId)
            this.click(newSquare)
          }
          if (currentId > 21 && !isLeftEdge) {
            const newId = this.squares[parseInt(currentId) -1 -this.width].id
            const newSquare = document.getElementById(newId)
            this.click(newSquare)
          }
          if (currentId < 398 && !isRightEdge) {
            const newId = this.squares[parseInt(currentId) +1].id
            const newSquare = document.getElementById(newId)
            this.click(newSquare)
          }
          if (currentId < 380 && !isLeftEdge) {
            const newId = this.squares[parseInt(currentId) -1 +this.width].id
            const newSquare = document.getElementById(newId)
            this.click(newSquare)
          }
          if (currentId < 378 && !isRightEdge) {
            const newId = this.squares[parseInt(currentId) +1 +this.width].id
            const newSquare = document.getElementById(newId)
            this.click(newSquare)
          }
          if (currentId < 379) {
            const newId = this.squares[parseInt(currentId) +this.width].id
            const newSquare = document.getElementById(newId)
            this.click(newSquare)
          }
        }, 10)
      default:
        break;
    }
  }

  gameOver() {
    this.result.innerHTML = 'BOOM! Game Over!'
    this.isGameOver = true

    this.squares.forEach(square => {
      if (square.classList.contains('bomb')) {
        square.innerHTML = '💣'
        square.classList.remove('bomb')
        square.classList.add('checked')
      }
    })

    this.restart.classList.add('active')
    this.restart.addEventListener('click', () => {
      document.location.reload();
    })
  }

  checkForWin() {
    let matches = 0

    for (let i = 0; i < this.squares.length; i++) {
      if (this.squares[i].classList.contains('flag') && this.squares[i].classList.contains('bomb')) {
        matches ++
      }
      if (matches === this.bombAmount) {
        this.result.innerHTML = 'YOU WIN!'
        this.isGameOver = true

        this.restart.classList.add('active')
        this.restart.innerText = 'Play again'
        this.restart.addEventListener('click', () => {
          document.location.reload();
        })
      }
    }
  }

}