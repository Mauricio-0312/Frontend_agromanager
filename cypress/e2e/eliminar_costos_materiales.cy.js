import { slowCypressDown } from 'cypress-slow-down';

import 'cypress-slow-down/commands';
slowCypressDown(500);

it('eliminar', function() {
     cy.visit('http://localhost:5173/login')
     cy.get('#root input[placeholder="email@dominio.com"]').click();
     cy.get('#root input[placeholder="email@dominio.com"]').type('admin@agro.local');
     cy.get('#root input[type="password"]').click();
     cy.get('#root input[type="password"]').type('admin123');
     
     cy.get('#root button.rounded').click();
     cy.get('#root a[href="/projects/2"]').click();
     cy.get('#root a.block').click();
     cy.get('#root a[href="/planes-accion/1/costos-materiales"]').click();
     cy.get('#root tr:nth-child(2) button.rounded').click();
     
});
