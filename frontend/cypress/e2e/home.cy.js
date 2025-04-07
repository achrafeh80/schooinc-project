describe('Bienvenue 😊', () => {
    it('Vérifie la page d\'accueil', () => { 
      cy.visit('http://localhost:5173');
    });
  });
  
  describe('Test sur le compte professor', () => {
    const users = [
      { username: 'professor_account',
         email: 'admin@example.com',
          password: 'profPassword123',
           role: 'professor' },
      {
        username: 'student_account',
        email: 'student@example.com',
        password: 'stuPassword123',
        role: 'Étudiant',
      }
    ];
  
    users.forEach(user => {
      it(`Crée le compte pour ${user.username}`, () => {
        cy.visit('http://localhost:5173/register');
        
        cy.get('input[name="email"]').type(user.email);
        cy.get('input[name="pseudo"]').type(user.username);
        cy.get('input[name="password"]').type(user.password);
        cy.get('select[name="role"]').select(user.role);
        
        cy.get('button[type="submit"]').click();
        cy.url().should('include', '/');
      });

      it('Déconnecte l’utilisateur en cliquant sur le bouton Déconnexion', () => {
        
        cy.contains('button', 'Déconnexion').click();
        cy.url().should('include', '/login'); // adapte selon ton routing
      
        // Ou on peut vérifier que le bouton n'est plus visible
        cy.contains('Déconnexion').should('not.exist');
      });
    });
});