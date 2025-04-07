describe('Bienvenue 😊', () => {
  it('Vérifie la page d\'accueil', () => { 
    cy.visit('http://localhost:5173');
  });
});

describe('Test sur le compte professor', () => {
  const users = [
    { username: 'professor_account', email: 'admin@example.com', password: 'profPassword123', role: 'professor' },
    ];

  users.forEach(user => {
    it(`Crée le compte pour ${user.username}`, () => {
      cy.visit('http://localhost:5173/register');
      
      cy.get('input[name="email"]').type(user.email);
      cy.get('input[name="pseudo"]').type(user.username);
      cy.get('input[name="password"]').type(user.password);
      cy.get('select[name="role"]').select(user.role);
      
      cy.get('button[type="submit"]').click();
      cy.contains('Vous êtes connecté').should('exist');
    });

    it('Vérifie l\'affichage du dashboard pour les rôles', () => {
      
      // Vérifie les liens rapides pour un professeur
      cy.contains('Notes').should('exist');
      cy.contains('Classes').should('exist');
      cy.contains('Dashboard').should('exist');
      cy.contains('Mon profil').should('exist');
      cy.contains('Classes').should('exist');
    });

    it('Modifier un cours', () => {
      cy.visit('http://localhost:5173/courses'); 
  
      // Assumes that there is a course already created
      cy.contains('Modifier').click();      
      cy.get('input[name="title"]').clear().type('Titre modifié');
      cy.get('textarea[name="description"]').clear().type('Description mise à jour');
      cy.get('button[type="submit"]').click();
  
     // cy.contains('Titre modifié').should('exist');
    });
  
    it('Supprimer un cours', () => {
      cy.visit('http://localhost:5173/courses');
  
      // Assumes that there is a course already created
      cy.contains('Supprimer').click();
      cy.get('button').contains('Confirmer').click();
      cy.contains('Titre modifié').should('not.exist');
    });
  });
});

describe('Création de comptes', () => {
  const users = [
      { username: 'student_account', email: 'student@example.com', password: 'stuPassword123', role: 'student' }
  ];

  users.forEach(user => {
    it(`Crée le compte pour ${user.username}`, () => {
      cy.visit('http://localhost:5173/register');
      
      cy.get('input[name="email"]').type(user.email);
      cy.get('input[name="pseudo"]').type(user.username);
      cy.get('input[name="password"]').type(user.password);
      cy.get('select[name="role"]').select(user.role);
      
      cy.get('button[type="submit"]').click();
      cy.contains('Bonjour').should('exist');
    });

    it('Vérifie l\'affichage du dashboard pour les rôles', () => {
      // Vérifie les liens rapides pour un étudiant
      cy.contains('Mes Notes').should('exist');
      cy.contains('Mes Cours').should('exist');
  
      
    });
  });
});


 