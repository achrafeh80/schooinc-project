describe('Gestion des cours pour un professeur', () => {
    const user = {
      username: 'professor_account',
      email: 'admin@example.com',
      password: 'profPassword123',
      role: 'Professeur'
    };
  
    const course = {
      title: 'Introduction à React',
      description: 'Un cours complet pour apprendre React'
    };
  
    const updatedCourse = {
      title: 'React Avancé',
      description: 'Cours mis à jour pour les étudiants avancés'
    };
  
    beforeEach(() => {
        cy.visit('http://localhost:5173/login');
        cy.get('input[name="email"]').type(user.email);
        cy.get('input[name="password"]').type(user.password);
        cy.get('button[type="submit"]').click();
        cy.url().should('include', '/');
    
        cy.url().should('include', '/');
      cy.contains(`${user.username} 👋`).should('exist');
    
        // Aller vers la page des cours
        cy.contains('Cours').click(); // ou "Gestion des Cours" selon ton label
        cy.url().should('include', '/courses');
      });
  
      it('Crée un nouveau cours', () => {
        cy.get('input[name="title"]').type(course.title);
        cy.get('textarea[name="description"]').type(course.description);
        cy.contains('Créer').click();
    
        // Vérifie le succès
        cy.contains('Cours créé avec succès.').should('exist');
        cy.contains(course.title).should('exist');
        cy.contains(course.description).should('exist');
      });
    
      it('Met à jour un cours existant', () => {
        // Clique sur le bouton "Modifier" du cours ciblé
        cy.contains(course.title)
          .parent()
          .parent()
          .within(() => {
            cy.contains('Modifier').click();
          });
    
        // Modifier les champs
        cy.get('input[name="title"]').clear().type(updatedCourse.title);
        cy.get('textarea[name="description"]').clear().type(updatedCourse.description);
        cy.contains('Mettre à jour').click();
    
        // Vérifie le succès
        cy.contains('Cours modifié avec succès.').should('exist');
        cy.contains(updatedCourse.title).should('exist');
        cy.contains(updatedCourse.description).should('exist');
      });
    });

describe('Gestion des classes pour un professeur', () => {
        const user = {
          email: 'admin@example.com',
          password: 'profPassword123',
          username: 'professor_account',
          role: 'Professeur',
        };
      
        const classData = {
          name: 'Msc 1',
        };
      
        const updatedClassData = {
          name: 'Msc 2',
        };
      
        beforeEach(() => {
          cy.visit('http://localhost:5173/login');
          cy.get('input[name="email"]').type(user.email);
          cy.get('input[name="password"]').type(user.password);
          cy.get('button[type="submit"]').click();

          cy.url().should('include', '/');
          cy.contains(`${user.username} 👋`).should('exist');
        });
      
        it('Créer une classe', () => {
          cy.contains('Classes').click();
          cy.get('input[name="name"]').type(classData.name);
          cy.get('button[type="submit"]').click();
        });
       
        it('Mettre à jour une classe', () => {
            cy.contains('Classes').click(); // Ouvre la section des classes
          
            // Vérifier que la classe originale est présente
            cy.contains(`${classData.name}`).should('exist');
          
            // Cliquer sur la classe que tu veux modifier
            cy.contains(`${classData.name}`).click();
          
            // Modifier le nom de la classe dans le champ d'input
            cy.get('input[name="nameUpd"]') // Assure-toi que c'est le bon sélecteur pour l'input du nom
              .clear() // Efface le nom actuel
              .type(updatedClassData.name); // Tape le nouveau nom de la classe
          
            // Cliquer sur le bouton pour soumettre le formulaire
            cy.contains(`${classData.name}`).click();
          
            // Vérifier que la classe a été mise à jour (optionnel selon l'application)
            cy.contains('Modifier').should('exist'); // Vérifie que le nouveau nom de la classe est visible
          });
          
          
      
        it('Supprimer une classe sans étudiants', () => {
            cy.contains('Classes').click();
          
            // Vérifier que la classe originale est présente
            cy.contains(`${classData.name}`).should('exist');
          
            // Cliquer sur la classe que tu veux modifier
            cy.contains(`${classData.name}`).click();

          cy.contains('Supprimer la classe').click();
          
        });
           
      
      });
      

    