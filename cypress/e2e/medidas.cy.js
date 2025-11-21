import { slowCypressDown } from 'cypress-slow-down';

import 'cypress-slow-down/commands';
slowCypressDown(500);

it('medidas', function() {
     cy.visit('http://localhost:5173/login')
     cy.get('#root input[placeholder="email@dominio.com"]').click();
     cy.get('#root input[placeholder="email@dominio.com"]').type('admin@agro.local');
     cy.get('#root input[type="password"]').click();
     cy.get('#root input[type="password"]').type('admin123');
     cy.get('#root button.rounded').click();
     cy.get('#root a[href="/units"]').click();
     cy.get('#root [name="dimension"]').click();
     cy.get('#root [name="dimension"]').type('11');
     cy.get('#root [name="unit"]').click();
     cy.get('#root [name="unit"]').type('metros');
     cy.get('#root button.bg-primary').click();
     cy.get('#root tr:nth-child(6) button.mr-2').click();
     cy.get('#root [name="dimension"]').click();
     cy.get('#root [name="dimension"]').clear();
     cy.get('#root [name="dimension"]').type('20');
     cy.get('#root button.bg-primary').click();
     cy.get('#root tr:nth-child(6) button.bg-red-500').click();
});
