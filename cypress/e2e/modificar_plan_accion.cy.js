import { slowCypressDown } from 'cypress-slow-down';

import 'cypress-slow-down/commands';
slowCypressDown(500);
import 'cypress-slow-down/commands';

it('das', function() {
        cy.visit('http://localhost:5173/login')
        cy.get('#root form.flex').click();
        cy.get('#root input[placeholder="email@dominio.com"]').click();
        cy.get('#root input[placeholder="email@dominio.com"]').type('admin@agro.local');
        cy.get('#root input[type="password"]').click();
        cy.get('#root input[type="password"]').type('admin123');
        cy.get('#root button.rounded').click();
        cy.get('#root a[href="/projects/2"]').click();
        cy.get('#root div.text-blue-700').click();
        cy.get('#root a[href="/planes-accion/1/editar"]').click();
        cy.get('#root input[placeholder="Actividad"]').click();
        cy.get('#root input[placeholder="Actividad"]').type(' editado');
        cy.get('#root select:nth-child(12)').select('4');
        cy.get('#root button.bg-primary').click();
});
