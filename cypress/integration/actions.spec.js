describe('Aupost Postage Delivery', () => {

  beforeEach(() => {
    cy.visit('parcels-mail/calculate-postage-delivery-times', { failOnStatusCode: false })
  })

  it('Check compare postage cost within Australia', () => {
    inputPlace('#domFrom_value')
    inputPlace('#domTo_value')
    cy.contains('button', 'Go').click()

    cy.get('#postage-options').should('be.visible').within(() => {
      cy.get('[class*=price]').should('contain', '$')
      cy.get('[class*=name-label]').then(postOtions => {
        const expressPost = postOtions.text().includes('Express Post')
        const parcelPost = postOtions.text().includes('Parcel Post')
        expect(expressPost || parcelPost).to.be.true
      })
    })
  })
  it('Check input size and weight', () => {
    inputPlace('#domFrom_value')
    inputPlace('#domTo_value')
    cy.contains('button', 'Go').click()

    cy.get('.filters-container').should('be.visible').within(() => {
      cy.get('a[class*=size-weight]').should('be.visible').then(sizeWeightLink => {
        cy.get(sizeWeightLink).first().click()
        checkSizeWeight()
      })
      cy.get('a[class*=delivery-times]').then(dateLink => {
        cy.get(dateLink).first().click()
        checkDate()
      })
    })
  })
})

function inputPlace(element) {
  // yarra valley fails
  cy.get(element).type(faker.address.cityPrefix())
  cy.get('[ng-repeat*=result]').should('not.contain', 'Searching').then(from => {
    cy.get('[ng-repeat*=result]').first().click()
  })
}

function checkSizeWeight() {
  // need to consider volume
  const fakeLength = faker.random.number({ min: 1, max: 100 })
  const fakeWidth = faker.random.number({ min: 1, max: 100 })
  const fakeHeight = faker.random.number({ min: 1, max: 100 })
  const fakeWeight = faker.random.number({ min: 1, max: 22 })

  cy.get('[name="lengthInput"]').type(fakeLength)
  cy.get('[name="widthInput"]').type(fakeWidth)
  cy.get('[name="heightInput"]').type(fakeHeight)
  cy.get('[name="weightInput"]').type(fakeWeight)
  cy.get('#submit-set-dimensions').click()

  cy.get('.size-weight__view-container > div').within(sizeWeight => {
    const size = sizeWeight[0].innerText
    expect(size).includes(fakeLength + ' x ' + fakeWidth + ' x ' + fakeHeight)
    const weight = sizeWeight[1].innerText
    expect(weight).includes(fakeWeight)
  })
}

function checkDate() {
  cy.get('[name="dateInput"]').click().type('2020-12-12')
  cy.get('#set-date').click()

  cy.get('.delivery-times__selection.ng-binding').should('be.visible')
}
