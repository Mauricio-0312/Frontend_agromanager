import { slowCypressDown } from 'cypress-slow-down';

import 'cypress-slow-down/commands';
slowCypressDown(500);

it('crear', function() {
     cy.visit('http://localhost:5173/login')
     cy.get('#root input[placeholder="email@dominio.com"]').click();
     cy.get('#root input[placeholder="email@dominio.com"]').type('admin@agro.local');
     cy.get('#root input[type="password"]').click();
     cy.get('#root input[type="password"]').type('admin123');
     cy.get('#root button.rounded').click();
     cy.get('#root a[href="/projects/2"]').click();
     cy.get('#root div.mt-8').click();
     cy.get('#root a[href="/planes-accion/1/costos-materiales"]').click();
     cy.get('#root a.bg-primary').click();
     cy.get('#actividad').click();
     cy.get('#actividad').type('prueba');
     cy.get('#categoria').select('2');
     cy.get('#descripcion').click();
     cy.get('#descripcion').type('a');
     cy.get('#cantidad').click();
     cy.get('#cantidad').clear();
     cy.get('#cantidad').type('330');
     cy.get('#unidad').select('4');
     cy.get('#costo').click();
     cy.get('#costo').type('10');
     cy.get('#root button.bg-primary').click();
     cy.get('#root tr:nth-child(2) a.rounded').click();
     cy.get('#actividad').click();
     cy.get('#actividad').type(' editado');
     cy.get('#root button.bg-primary').click();
});
