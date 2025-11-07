import { slowCypressDown } from 'cypress-slow-down';

import 'cypress-slow-down/commands';
slowCypressDown(500);

it('eliminar_actividad', function() {
     cy.visit('http://localhost:5173/labores')
     cy.get('#root input[placeholder="email@dominio.com"]').click();
     cy.get('#root input[placeholder="email@dominio.com"]').type('admin@agro.local');
     cy.get('#root input[type="password"]').click();
     cy.get('#root input[type="password"]').type('admin123');
     cy.get('#root button.rounded').click();
     cy.get('#root a[href="/activities"]').click();
     cy.get('#root div:nth-child(1) > div.gap-2 > button.rounded').click();
     
});
