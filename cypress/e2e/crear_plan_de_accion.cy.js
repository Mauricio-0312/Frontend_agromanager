import { slowCypressDown } from 'cypress-slow-down';

import 'cypress-slow-down/commands';
slowCypressDown(500);

it('crear_plan', function() {
     cy.visit('http://localhost:5173/login')
     cy.get('#root input[placeholder="email@dominio.com"]').click();
     cy.get('#root input[placeholder="email@dominio.com"]').type('admin@agro.local');
     cy.get('#root input[type="password"]').click();
     cy.get('#root input[type="password"]').type('admin123');
     cy.get('#root button.rounded').click();
     cy.get('#root a[href="/projects/2"]').click();
     cy.get('#root a.block div.text-xs').click();
     cy.get('#root a.bg-primary').click();
     cy.get('#root input[placeholder="Actividad"]').click();
     cy.get('#root input[placeholder="Actividad"]').type('prueba');
     cy.get('#root select:nth-child(4)').select('Cosecha');
     cy.get('#root input:nth-child(6)').click();
     cy.get('#root input:nth-child(6)').type("2026-01-22");
     cy.get('#root input[value=""]').click();
     cy.get('#root input[value=""]').type("2026-02-22");
     cy.get('#root input[placeholder="Cantidad horas"]').click();
     cy.get('#root input[placeholder="Cantidad horas"]').clear();
     cy.get('#root input[placeholder="Cantidad horas"]').type('101');
     cy.get('#root select:nth-child(12)').select('4');
     cy.get('#root button.bg-primary').click();
     cy.get('#root a.block').click();
});
