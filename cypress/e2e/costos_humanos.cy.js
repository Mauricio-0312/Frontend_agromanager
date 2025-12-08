import { slowCypressDown } from 'cypress-slow-down';

import 'cypress-slow-down/commands';
slowCypressDown(500);

it('costos', function() {
     cy.visit('http://localhost:5173/login')
     cy.get('#root input[placeholder="email@dominio.com"]').click();
     cy.get('#root input[placeholder="email@dominio.com"]').type('admin@agro.local');
     cy.get('#root input[type="password"]').click();
     cy.get('#root input[type="password"]').type('admin123');
     cy.get('#root button.rounded').click();
     cy.get('#root a[href="/projects/2"]').click();
     cy.get('#root div.text-blue-700').click();
     cy.get('#root a[href="/planes-accion/1/costos-humanos"]').click();
     cy.get('#root a.bg-primary').click();
     cy.get('#actividad').click();
     cy.get('#actividad').type('preuba');
     cy.get('#tiempo').click();
     cy.get('#tiempo').clear();
     cy.get('#tiempo').type('20');
     cy.get('#cantidad').click();
     cy.get('#cantidad').type('2');
     cy.get('#costo').click();
     cy.get('#costo').type('22');
     cy.get('#root button.bg-primary').click();
     cy.get('#root tr:nth-child(2) a.rounded').click();
     cy.get('#actividad').click();
     cy.get('#actividad').type(' editado');
     cy.get('#root button.bg-primary').click();
});
