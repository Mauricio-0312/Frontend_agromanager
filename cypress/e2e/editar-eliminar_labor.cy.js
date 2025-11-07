import { slowCypressDown } from 'cypress-slow-down';

import 'cypress-slow-down/commands';
slowCypressDown(500);

it('editar-eliminar_labor', function() {
     cy.visit('http://localhost:5173/labores')
     cy.get('#root input[placeholder="email@dominio.com"]').click();
     cy.get('#root input[placeholder="email@dominio.com"]').type('admin@agro.local');
     cy.get('#root input[type="password"]').click();
     cy.get('#root input[type="password"]').type('admin123');
     cy.get('#root button.rounded').click();
     cy.get('#root a[href="/labores"]').click();
     cy.get('#root tr:nth-child(1) button.mr-2').click();
     cy.get('#root [name="descripcion"]').click();
     cy.get('#root [name="descripcion"]').type(' editado');
     cy.get('#root button.bg-primary').click();
     cy.get('#root tr:nth-child(1) button.bg-red-500').click();
     
});
