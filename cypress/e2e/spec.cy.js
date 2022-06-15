describe('app spec', () => {
  it('allows to choose a username and send messages', () => {
    cy.visit('http://localhost:3001/')
    cy.get('input').type('John Doe{enter}')
    cy.contains('John Doe has joined the chat')
    cy.get('textarea').type('Hello! This is the first message')
    cy.get('button').click()
    cy.contains('ul', 'Hello! This is the first message')
    cy.get('textarea').type('Hello! This is another message')
    cy.get('button').click()
    cy.get('li.message').should('have.length', 2)
  })
  it('shows that the second user has joined the chat', () => {
    //first user
    cy.visit('http://localhost:3001/')
    cy.get('input').type('John Doe{enter}')
    cy.contains('John Doe has joined the chat')
    //create another user
    const secondName = 'Bob'
    cy.task('connect', secondName)
    cy.contains('Bob has joined the chat')
  })
  it('shows messages sent by the second user', () => {
    //first user
    cy.visit('http://localhost:3001/')
    cy.get('input').type('John Doe{enter}')
    cy.contains('John Doe has joined the chat').should('be.visible')
    //create another user
    const secondName = 'Bob'
    cy.task('connect', secondName)
    cy.contains('Bob has joined the chat').should('be.visible')
    const message = 'Hello from Bob!'
    cy.task('send', message)
    cy.contains('Hello from Bob!')
  })
  it('verifies that messages are received', () => {
    //first user
    cy.visit('http://localhost:3001/')
    const name = 'John Doe'
    cy.get('input').type(`${name}{enter}`)
    cy.contains('John Doe has joined the chat').should('be.visible')
    //create another user
    const secondName = 'Bob'
    cy.task('connect', secondName)
    cy.contains('Bob has joined the chat').should('be.visible')
    //send a message from the first user
    const message = 'Hello, Bob!'
    cy.get('textarea').type(message)
    cy.get('button').click()
    //check that the message is displayed
    cy.contains('ul', message)
    //make sure that the second user received the message
    cy.task('getLastMessage').then((msg) => {
      cy.wrap(msg.username).should('equal', name)
      cy.wrap(msg.message).should('equal', message)
    })
  })
  it('notifies when a user leaves the chat', () => {
    //first user
    cy.visit('http://localhost:3001/')
    const name = 'John Doe'
    cy.get('input').type(`${name}{enter}`)
    cy.contains('John Doe has joined the chat').should('be.visible')
    //create another user
    const secondName = 'Bob'
    cy.task('connect', secondName)
    cy.contains('Bob has joined the chat').should('be.visible')
    //disconnect
    cy.task('disconnect')
    cy.contains('Bob has left the chat').should('be.visible')
  })
})
