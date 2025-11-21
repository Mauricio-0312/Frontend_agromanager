import { slowCypressDown } from 'cypress-slow-down';

import 'cypress-slow-down/commands';
slowCypressDown(500);

it('logger', function() {
     cy.visit('http://localhost:5173/login')
     cy.get('#root input[placeholder="email@dominio.com"]').click();
     cy.get('#root input[placeholder="email@dominio.com"]').type('admin@agro.local');
     cy.get('#root label:nth-child(3)').click();
     cy.get('#root input[type="password"]').click();
     cy.get('#root input[type="password"]').type('admin123');
     cy.get('#root button.rounded').click();
     cy.get('#root a[href="/admin"]').click();
     cy.get('#root input[placeholder="Nombre"]').click();
     cy.get('#root input[placeholder="Nombre"]').type('loggger1');
     cy.get('#root input[placeholder="Cédula"]').click();
     cy.get('#root input[placeholder="Cédula"]').type('123');
     cy.get('#root input[placeholder="Email"]').click();
     cy.get('#root input[placeholder="Email"]').type('logger@logger.com');
     cy.get('#root input[placeholder="Password"]').click();
     cy.get('#root input[placeholder="Password"]').type('12345');
     cy.get('#root select.border').select('analista');
     cy.get('#root button.bg-primary').click();
     cy.get('#root a[href="/logs"]').click();
     cy.get('#root tr:nth-child(2) button.rounded').click();
});

