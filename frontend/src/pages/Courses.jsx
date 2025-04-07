import { gql, useQuery, useMutation } from '@apollo/client';
import { useContext,useState } from 'react';
import { AuthContext } from '../auth/AuthContext';
// GraphQL queries et mutations
const LIST = gql`
  query {
    listCourses {
      id
      title
      description
    }
  }
`;

const CREATE = gql`
  mutation($title: String!, $description: String!) {
    createCourse(title: $title, description: $description) {
      id
      title
    }
  }
`;

const UPDATE = gql`
  mutation($id: ID!, $title: String, $description: String) {
    updateCourse(id: $id, title: $title, description: $description) {
      id
      title
      description
    }
  }
`;

const DELETE = gql`
  mutation($id: ID!) {
    deleteCourse(id: $id)
  }
`;

export default function Courses() {
  // États et hooks
  const { data, refetch } = useQuery(LIST);
  const [form, setForm] = useState({ id: null, title: '', description: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { auth } = useContext(AuthContext);

  // Mutations
  const [createCourse] = useMutation(CREATE, {
    onCompleted: () => {
      refetch();
      setForm({ id: null, title: '', description: '' });
      setMessage('Cours créé avec succès.');
      setError('');
    }
  });

  const [updateCourse] = useMutation(UPDATE, {
    onCompleted: () => {
      refetch();
      setForm({ id: null, title: '', description: '' });
      setMessage('Cours modifié avec succès.');
      setError('');
    },
    onError: (err) => {
      if (err.message.includes('Not your course')) {
        setError("Ce cours ne vous appartient pas. Veuillez vérifier que vous êtes le professeur responsable.");
        setMessage('');
      } else {
        setError(err.message);
        setMessage('');
      }
    }
  });

  const [deleteCourse] = useMutation(DELETE, {
    onCompleted: () => {
      refetch();
      setForm({ id: null, title: '', description: '' });
      setMessage('Cours supprimé avec succès.');
      setError('');
    }
  });

  // Gestionnaires d'événements
  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.id) {
      updateCourse({ 
        variables: { 
          id: form.id, 
          title: form.title, 
          description: form.description 
        } 
      });
    } else {
      createCourse({ 
        variables: { 
          title: form.title, 
          description: form.description 
        } 
      });
    }
  };

  const handleEdit = (course) => {
    setForm({ 
      id: course.id, 
      title: course.title, 
      description: course.description 
    });
    setMessage('');
    setError('');
  };

  const handleDelete = (id) => {
    if (confirm('Confirmer la suppression de ce cours ?')) {
      deleteCourse({ variables: { id } });
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Gérer les Cours</h2>

      {/* Messages de notification */}
      {message && (
        <div className="mb-6 p-3 bg-green-100 border-l-4 border-green-500 text-green-700 rounded">
          {message}
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Formulaire visible uniquement pour les professeurs */}
{auth.role === 'professor' && (
  <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-sm">
    <div className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Titre du cours
        </label>
        <input
          id="title"
          name='title'
          value={form.title}
          onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          className="border w-full p-2 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition duration-200"
          placeholder="Titre"
          required
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={form.description}
          name='description'
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          className="border w-full p-2 rounded-md h-24 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition duration-200"
          placeholder="Description"
        />
      </div>
      
      <button
        type="submit"
        className={`px-4 py-2 rounded-md text-white transition duration-200 ${
          form.id 
            ? 'bg-yellow-500 hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-300' 
            : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300'
        }`}
      >
        {form.id ? 'Mettre à jour' : 'Créer'}
      </button>
    </div>
  </form>
)}


      {/* Liste des cours */}
      <h3 className="text-xl font-semibold mb-4 text-gray-700">Liste des cours</h3>
      
      {!data?.listCourses?.length && (
        <p className="text-gray-500 italic">Aucun cours disponible actuellement.</p>
      )}
      
      <ul className="space-y-3">
        {data?.listCourses.map(course => (
          <li key={course.id} className="border p-4 rounded-lg bg-white shadow-sm hover:shadow transition duration-200">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <div>
                <h4 className="font-bold text-lg text-gray-800">{course.title}</h4>
                <p className="text-gray-600 mt-1">{course.description}</p>
              </div>
              {/* Actions pour les professeurs uniquement */}
              {auth.role === 'professor' && (
                <div className="flex space-x-3 sm:self-start">
                <button
                  onClick={() => handleEdit(course)}
                  className="text-blue-600 hover:text-blue-800 font-medium transition duration-200 px-3 py-1 rounded hover:bg-blue-50"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(course.id)}
                  className="text-red-600 hover:text-red-800 font-medium transition duration-200 px-3 py-1 rounded hover:bg-red-50"
                >
                  Supprimer
                </button>
              </div>
              )}
              
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}