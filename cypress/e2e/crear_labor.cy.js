import { slowCypressDown } from 'cypress-slow-down';

import 'cypress-slow-down/commands';
slowCypressDown(500);

it('crear_equipo', function() {
     cy.visit('http://localhost:5173/labores')
     cy.get('#root input[placeholder="email@dominio.com"]').click();
     cy.get('#root input[placeholder="email@dominio.com"]').type('admin@agro.local');
     cy.get('#root input[type="password"]').click();
     cy.get('#root input[type="password"]').type('admin123');
     cy.get('#root button.rounded').click();
     cy.get('#root a[href="/labores"]').click();
     cy.get('#root [name="descripcion"]').click();
     cy.get('#root [name="descripcion"]').type('Cosecha');
     cy.get('#root button.bg-primary').click();
     
});
