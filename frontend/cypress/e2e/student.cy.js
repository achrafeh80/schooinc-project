describe('Dashboard pour un étudiant', () => {
    const user = {
      username: 'student_account',
      email: 'student@example.com',
      password: 'stuPassword123',
      role: 'Étudiant',
    };
  
    beforeEach(() => {
      // Connexion de l'utilisateur avant chaque test
      cy.visit('http://localhost:5173/login');
      cy.get('input[name="email"]').type(user.email);
      cy.get('input[name="password"]').type(user.password);
      cy.get('button[type="submit"]').click();
  
      // Attente de la redirection vers le dashboard
      cy.url().should('include', '/');
      cy.contains(`${user.username} 👋`).should('exist'); // S'assurer qu'on est bien connecté
    });
  
    it('Vérifie le message de bienvenue', () => {
      cy.contains(`${user.username} 👋`).should('exist');
    });
  
    it("Vérifie le rôle de l'utilisateur", () => {
      cy.contains(`Vous êtes connecté en tant que ${user.role}`).should('exist');
    });
  
    it("Vérifie les liens rapides pour un étudiant", () => {
      cy.contains('Mes Notes')
        .should('have.attr', 'href', '/grades')

      cy.contains('Mes Cours')
        .should('have.attr', 'href', '/courses')
    });
  });
   