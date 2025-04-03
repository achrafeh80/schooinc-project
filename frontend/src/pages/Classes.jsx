import { gql, useQuery, useMutation } from '@apollo/client';
import { useState, useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';

const GET_USERS = gql`
  query {
    listUsers {
      id
      pseudo
    }
  }
`;

const LIST_CLASSES = gql`
  query {
    listClasses {
      id
      name
      professorId
    }
  }
`;

const GET_CLASS = gql`
  query($id: ID!) {
    getClass(id: $id) {
      id
      name
      studentIds
      professorId
    }
  }
`;

const CREATE_CLASS = gql`
  mutation($name: String!) {
    createClass(name: $name) {
      id
      name
    }
  }
`;

const UPDATE_CLASS = gql`
  mutation($id: ID!, $name: String!) {
    updateClass(id: $id, name: $name) {
      id
      name
    }
  }
`;

const DELETE_CLASS = gql`
  mutation($id: ID!) {
    deleteClass(id: $id)
  }
`;

const ADD_STUDENT = gql`
  mutation($classId: ID!, $studentId: ID!) {
    addStudentToClass(classId: $classId, studentId: $studentId) {
      id
      studentIds
    }
  }
`;

const REMOVE_STUDENT = gql`
  mutation($classId: ID!, $studentId: ID!) {
    removeStudentFromClass(classId: $classId, studentId: $studentId) {
      id
      studentIds
    }
  }
`;

export default function Classes() {
  const { auth } = useContext(AuthContext);
  const { data: usersData } = useQuery(GET_USERS);
  const { data, refetch } = useQuery(LIST_CLASSES);
  const [name, setName] = useState('');
  const [editName, setEditName] = useState('');
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [warningMessage, setWarningMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const { data: selectedClassData, refetch: refetchSelectedClass } = useQuery(GET_CLASS, {
    variables: { id: selectedClassId },
    skip: !selectedClassId,
  });

  const clearMessages = () => {
    setSuccessMessage(null);
    setWarningMessage(null);
    setErrorMessage(null);
  };

  const [createClass] = useMutation(CREATE_CLASS, {
    onCompleted: () => {
      refetch();
      setName('');
      setSuccessMessage('Classe créée avec succès.');
      clearMessages();
    },
    onError: (err) => {
      setErrorMessage(err.message);
      clearMessages();
    }
  });

  const [updateClass] = useMutation(UPDATE_CLASS, {
    onCompleted: () => {
      refetch();
      refetchSelectedClass();
      setEditName('');
      setSuccessMessage('Nom de classe modifié.');
      clearMessages();
    },
    onError: (err) => {
      setErrorMessage(err.message);
      clearMessages();
    }
  });

  const [deleteClass] = useMutation(DELETE_CLASS, {
    onCompleted: () => {
      refetch();
      setSelectedClassId(null);
      setSuccessMessage('Classe supprimée avec succès.');
      clearMessages();
    },
    onError: (err) => {
      setErrorMessage(err.message);
      clearMessages();
    }
  });

  const [addStudentToClass] = useMutation(ADD_STUDENT, {
    onCompleted: () => {
      refetchSelectedClass();
      setStudentId('');
      setSuccessMessage("Étudiant ajouté avec succès.");
      clearMessages();
    },
    onError: (err) => {
      setErrorMessage(err.message);
      clearMessages();
    }
  });

  const [removeStudentFromClass] = useMutation(REMOVE_STUDENT, {
    onCompleted: () => {
      refetchSelectedClass();
      setWarningMessage("Étudiant retiré avec succès.");
      clearMessages();
    },
    onError: (err) => {
      setErrorMessage(err.message);
      clearMessages();
    }
  });

  const isOwner = selectedClassData?.getClass?.professorId === auth?.id;

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2">
        <h2 className="text-2xl font-bold mb-4">Gestion des Classes</h2>
        <h4 className="text-lg font-minibold mb-2">Créer une nouvelle classe :</h4>

        {successMessage && (
          <p className="bg-green-100 border border-green-400 text-green-700 p-2 rounded mb-4">{successMessage}</p>
        )}
        {warningMessage && (
          <p className="bg-red-100 border border-red-500 text-red-700 p-2 rounded mb-4">{warningMessage}</p>
        )}
        {errorMessage && (
          <p className="bg-red-100 border border-red-500 text-red-700 p-2 rounded mb-4">{errorMessage}</p>
        )}

        <form onSubmit={e => {
          e.preventDefault();
          clearMessages();
          createClass({ variables: { name } });
        }} className="mb-6 flex space-x-2">
          <input value={name} onChange={e => setName(e.target.value)} className="border w-full p-2 rounded"
            placeholder="Nom de la classe" required />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Créer</button>
        </form>

        <ul className="space-y-2 mb-8">
          {data?.listClasses.map(cls => (
            <button
              key={cls.id}
              className={`w-full text-left border p-2 rounded bg-white shadow cursor-pointer hover:bg-gray-100 ${
                cls.id === selectedClassId ? 'bg-blue-50 border-blue-400' : ''
              }`}
              onClick={() => {
                clearMessages();
                setSelectedClassId(cls.id);
              }}
            >
              {cls.name}
            </button>
          ))}
        </ul>

        {selectedClassData && (
          <div className="bg-white p-4 rounded shadow border">
            <h3 className="text-xl font-semibold mb-2">
              {selectedClassData.getClass.name}
            </h3>

            {!isOwner ? (
              <p className="text-red-500">Tu n’es pas le propriétaire de cette classe.</p>
            ) : (
              <>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    updateClass({ variables: { id: selectedClassId, name: editName } });
                  }}
                  className="flex space-x-2 mt-2"
                >
                  <input
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    placeholder="Nouveau nom"
                    className="border p-2 rounded w-full"
                  />
                  <button type="submit" className="bg-yellow-500 text-white px-4 py-2 rounded">Modifier</button>
                </form>

                {selectedClassData.getClass.studentIds.length === 0 && (
                  <button
                    onClick={() => {
                      deleteClass({ variables: { id: selectedClassId } });
                    }}
                    className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Supprimer la classe
                  </button>
                )}

                <h4 className="font-semibold mt-6">Étudiants dans la classe :</h4>
                <ul className="list-disc ml-6 mb-4">
                  {selectedClassData.getClass.studentIds.length === 0 && (
                    <li className="text-gray-500 italic">Aucun étudiant</li>
                  )}
                  {selectedClassData.getClass.studentIds.map(id => (
                    <li key={id} className="flex justify-between items-center">
                      <span>{usersData?.listUsers.find(u => u.id === id)?.pseudo || id}</span>
                      <button
                        onClick={() => {
                          removeStudentFromClass({ variables: { classId: selectedClassId, studentId: id } });
                        }}
                        className="text-red-500 hover:underline"
                      >
                        Supprimer
                      </button>
                    </li>
                  ))}
                </ul>


              </>
            )}
          </div>
        )}
      </div>

      {usersData && ( 
        <div className="bg-white p-4 rounded shadow border h-fit">
          <h3 className="text-lg font-bold mb-4">Étudiants</h3>
          <ul className="divide-y">
            {usersData.listUsers.map(user => (
              <li key={user.id} className="flex justify-between items-center py-2">
                <span>{user.pseudo}</span>
                <small className="text-gray-500 text-xs ml-2">{user.id}</small>
                {isOwner && selectedClassId && (
                  <button
                    onClick={() => {
                      addStudentToClass({ variables: { classId: selectedClassId, studentId: user.id } });
                    }}
                    className="text-blue-600 text-sm hover:underline ml-auto"
                  >
                    ➕
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
