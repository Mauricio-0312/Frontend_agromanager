import { slowCypressDown } from 'cypress-slow-down';

import 'cypress-slow-down/commands';
slowCypressDown(500);


it('crear_actividad', function() {
     cy.visit('http://localhost:5173/labores')
     cy.get('#root input[placeholder="email@dominio.com"]').click();
     cy.get('#root input[placeholder="email@dominio.com"]').type('admin@agro.local');
     cy.get('#root input[type="password"]').click();
     cy.get('#root input[type="password"]').type('admin123');
     cy.get('#root button.rounded').click();
     cy.get('#root a[href="/projects/2"]').click();
     cy.get('#root [name="fecha"]').click();
     cy.get('#root [name="fecha"]').type('2025-10-25');
     cy.get('#root [name="actividad"]').click();
     cy.get('#root [name="actividad"]').type('actividad de prueba');
     cy.get('#root [name="labor"]').select('6');
     cy.get('#root [name="encargado"]').select('5');
     cy.get('#root [name="equipos"]').select(['15', '16']);
     cy.get('#root [name="recurso"]').click();
     cy.get('#root [name="recurso"]').type('23');
     cy.get('#root [name="costo"]').click();
     cy.get('#root [name="costo"]').type('10');
     cy.get('#root [name="observaciones"]').click();
     cy.get('#root [name="observaciones"]').type('prueba');
     cy.get('#root button.bg-primary').click();
});
