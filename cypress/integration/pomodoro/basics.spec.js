describe('Pomodoro Timer App', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.get('.app .timer').as('timer')
    cy.get('.app .title').as('title')
  })
  it('Is a timer that initially says 25 minutes', () => {
    cy.get('@title') //
      .contains('Let the countdown begin!')
    cy.get('@timer').contains('25:00')
  })
  it('Counts down when started', () => {
    cy.get('#startBtn').click()
    cy.get('@title') //
      .contains("You're doing great!")
    cy.get('@timer').contains('24:59')
    cy.get('@timer').contains('24:58')
    cy.get('@timer').contains('24:57')
  })
  it('Can be stopped after being started', () => {
    cy.get('#startBtn').click()
    cy.wait(1000)
    cy.get('#stopBtn').click()

    cy.get('@title').contains('Keep it up!')
    cy.get('@timer')
      .invoke('text')
      .then((time1) => {
        cy.wait(1000)
        cy.get('@timer')
          .invoke('text')
          .should((time2) => {
            expect(time1).to.eq(time2)
          })
      })
  })
  it('Can be reset', () => {
    cy.get('@timer').contains('25:00')
    cy.get('#resetBtn').click()
    cy.get('@timer').contains('25:00')
    cy.get('#startBtn').click()
    cy.wait(1000)
    cy.get('#resetBtn').click()
    cy.get('@timer').contains('25:00')
  })

  it("Doesn't show the start button after you hit start", () => {
    cy.get('#startBtn')
      .click()
      .then(($startBtn) => {
        expect($startBtn).to.be.hidden
      })
  })

  // Superseded by "Doesn't show the start button after you hit start"
  it.skip("Doesn't do anything different if you hit start twice", () => {
    cy.get('@timer').contains('25:00')
    cy.get('#startBtn').click()
    cy.get('#startBtn').click()
    cy.wait(3000)
    // Waiting for 3 seconds
    // will cause a 6-second
    // elapsed time if two timers
    // count down together
    cy.get('.app .timer #seconds')
      .invoke('text')
      .then(parseFloat)
      .should('be.above', 55)
  })

  it("Doesn't show the stop button before you hit start, but DOES after", () => {
    cy.get('#stopBtn').should('not.exist')
    cy.get('#startBtn').click()
    cy.get('#stopBtn').should('be.visible')
  })

  it('Should be able to be re-started after stopping', () => {
    cy.get('#startBtn').click()
    cy.wait(1000)
    cy.get('#stopBtn').click()
    cy.get('#startBtn').click()
    cy.wait(3000)
    // should have > 3 seconds elapsed
    cy.get('.app .timer #seconds')
      .invoke('text')
      .then(parseFloat)
      .should('be.below', 57)
  })

  it('Should be able to be re-started after reset', () => {
    cy.get('#startBtn').click()
    cy.wait(1000)
    cy.get('#resetBtn').click()
    cy.get('#startBtn').click()
    cy.wait(3000)
    // should have started counting down
    cy.get('.app .timer #seconds')
      .invoke('text')
      .then(parseFloat)
      .should('not.equal', 0)
  })
})

describe('Starting the Timer from 0', () => {
  beforeEach(() => {
    cy.visit('/?start=1')
    cy.get('.app .timer').as('timer')
    cy.get('.app .title').as('title')
  })
  it(`After getting to 0, resets`, () => {
    cy.get('@timer').contains('00:01')

    cy.get('#startBtn').click()
    cy.get('@timer').contains('00:00')
    cy.get('@title').contains('Ready to go another round?')
    cy.get('@timer').contains('00:01')
  })
})
