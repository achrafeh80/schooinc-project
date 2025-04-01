import { useState, useContext, useEffect } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { AuthContext } from '../auth/AuthContext';

const ME = gql`query { me { id email pseudo role } }`;
const UPDATE = gql`mutation($pseudo:String!){ updateUser(pseudo:$pseudo){ id pseudo } }`;
const DELETE = gql`mutation { deleteUser }`;

export default function Profil() {
  const { setAuth } = useContext(AuthContext);
  const { data, loading } = useQuery(ME);
  const [pseudo, setPseudo] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  
  const [updateUser] = useMutation(UPDATE);
  const [deleteUser] = useMutation(DELETE, {
    onCompleted: () => {
      localStorage.removeItem('token');
      setAuth(null);
      window.location.href = '/login';
    }
  });

  useEffect(() => {
    if (data?.me?.pseudo) {
      setPseudo(data.me.pseudo);
    }
  }, [data]);

  const handleUpdate = async () => {
    await updateUser({ variables: { pseudo } });
    setIsEditing(false);
    setUpdateSuccess(true);
    setTimeout(() => setUpdateSuccess(false), 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Mon Profil</h1>
      </div>

      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <div className="flex items-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          <div>
            <p className="text-sm text-gray-500">Adresse email</p>
            <p className="font-medium text-gray-800">{data?.me.email}</p>
          </div>
        </div>

        <div className="mb-2">
          <p className="text-sm text-gray-500 mb-1">Pseudo</p>
          {isEditing ? (
            <div className="flex items-center">
              <input
                value={pseudo}
                onChange={e => setPseudo(e.target.value)}
                className="border border-blue-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 block w-full p-3 rounded-md"
                placeholder="Votre pseudo"
              />
              <button
                onClick={handleUpdate}
                className="ml-3 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-md transition-colors duration-200 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                Enregistrer
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="font-medium text-gray-800 text-lg">{data?.me.pseudo}</p>
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors duration-200"
              >
                Modifier
              </button>
            </div>
          )}
        </div>

        {updateSuccess && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Pseudo modifié avec succès !
          </div>
        )}
      </div>


      <div className="border-t pt-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Actions du compte</h2>
        
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center text-red-600 hover:text-red-800 font-medium transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            Supprimer mon compte
          </button>
        ) : (
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <p className="text-red-600 mb-4">Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.</p>
            <div className="flex space-x-3">
              <button
                onClick={() => deleteUser()}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
              >
                Confirmer la suppression
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition-colors duration-200"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}