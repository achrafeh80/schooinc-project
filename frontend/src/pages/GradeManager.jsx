import { gql, useMutation, useQuery } from '@apollo/client';
import { useState, useEffect } from 'react';

// GraphQL Queries
const GET_USERS = gql`query { listUsers { id pseudo } }`;
const LIST_CLASSES = gql`query { listClasses { id name studentIds } }`;
const LIST_COURSES = gql`query { listCourses { id title } }`;
const LIST_GRADES_BY_STUDENT = gql`
  query($studentId: ID!) {
    listGradesByStudent(studentId: $studentId) {
      id
      value
      courseId
      classId
    }
  }
`;

// Mutations
const ADD = gql`mutation($studentId:ID!,$courseId:ID!,$classId:ID,$value:Float!){
  addGrade(studentId:$studentId,courseId:$courseId,classId:$classId,value:$value){id}
}`;
const UPDATE = gql`mutation($id:ID!,$value:Float!){ updateGrade(id:$id,value:$value){ id value } }`;
const DELETE = gql`mutation($id:ID!){ deleteGrade(id:$id) }`;

export default function GradeManager() {
  const [form, setForm] = useState({ studentId: '', courseId: '', classId: '', value: '' });
  const [editGradeId, setEditGradeId] = useState(null);
  const [editValue, setEditValue] = useState('');

  const { data: usersData } = useQuery(GET_USERS);
  const { data: classData } = useQuery(LIST_CLASSES);
  const { data: courseData } = useQuery(LIST_COURSES);

  const { data: gradesData, refetch: refetchGrades } = useQuery(LIST_GRADES_BY_STUDENT, {
    variables: { studentId: form.studentId },
    skip: !form.studentId,
  });

  const [addGrade] = useMutation(ADD, {
    onCompleted: () => {
      alert("Note ajoutée");
      setForm({ ...form, value: '' });
      refetchGrades();
    }
  });

  const [updateGrade] = useMutation(UPDATE, {
    onCompleted: () => {
      alert("Note modifiée");
      setEditGradeId(null);
      setEditValue('');
      refetchGrades();
    }
  });

  const [deleteGrade] = useMutation(DELETE, {
    onCompleted: () => {
      alert("Note supprimée");
      refetchGrades();
    }
  });

  // Trouver automatiquement la classe de l'étudiant
  useEffect(() => {
    if (!form.studentId || !classData?.listClasses) return;
    const found = classData.listClasses.find(cls =>
      cls.studentIds.includes(form.studentId)
    );
    setForm(f => ({ ...f, classId: found?.id || '' }));
  }, [form.studentId, classData]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const selectedStudent = usersData?.listUsers.find(u => u.id === form.studentId);
  const selectedClass = classData?.listClasses.find(cls => cls.id === form.classId);

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* FORMULAIRE */}
      <div className="md:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-lg shadow border space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Gérer les Notes</h2>

          {/* Étudiant sélectionné */}
          {selectedStudent && (
            <div className="text-gray-700">
              <p><strong>Étudiant :</strong> {selectedStudent.pseudo}</p>
              {selectedClass && <p><strong>Classe :</strong> {selectedClass.name}</p>}
            </div>
          )}

          {/* Choix du cours */}
          <select
            name="courseId"
            value={form.courseId}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          >
            <option value="">-- Choisir un cours --</option>
            {courseData?.listCourses.map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>

          {/* Note */}
          <input
            name="value"
            type="number"
            value={form.value}
            onChange={handleChange}
            placeholder="Note"
            className="border p-2 w-full rounded"
            required
          />

          {/* Ajouter */}
          <button
            onClick={() => addGrade({ variables: { ...form, value: parseFloat(form.value) } })}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
            disabled={!form.studentId}
          >
            Ajouter la note
          </button>
        </div>

        {/* TABLEAU DES NOTES */}
        {gradesData?.listGradesByStudent?.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-semibold mb-4">Notes de {selectedStudent?.pseudo}</h3>
            <table className="w-full table-auto border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2 border">Cours</th>
                  <th className="p-2 border">Valeur</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {gradesData.listGradesByStudent.map(grade => {
                  const courseTitle = courseData?.listCourses.find(c => c.id === grade.courseId)?.title || grade.courseId;
                  return (
                    <tr key={grade.id} className="border-t">
                      <td className="p-2 border">{courseTitle}</td>
                      <td className="p-2 border">
                        {editGradeId === grade.id ? (
                          <input
                            type="number"
                            value={editValue}
                            onChange={e => setEditValue(e.target.value)}
                            className="border p-1 rounded w-20"
                          />
                        ) : (
                          grade.value
                        )}
                      </td>
                      <td className="p-2 border space-x-2">
                        {editGradeId === grade.id ? (
                          <button
                            onClick={() => updateGrade({ variables: { id: grade.id, value: parseFloat(editValue) } })}
                            className="bg-blue-600 text-white px-2 py-1 rounded text-sm"
                          >
                            Enregistrer
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setEditGradeId(grade.id);
                              setEditValue(grade.value);
                            }}
                            className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
                          >
                            Modifier
                          </button>
                        )}
                        <button
                          onClick={() => deleteGrade({ variables: { id: grade.id } })}
                          className="bg-red-600 text-white px-2 py-1 rounded text-sm"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* LISTE DES ÉTUDIANTS */}
      <div className="space-y-6">
      {classData?.listClasses.map(cls => (
        <div key={cls.id}>
          <h4 className="text-md font-semibold text-gray-700 mb-2 border-b pb-1">{cls.name}</h4>
          <div className="space-y-2">
            {usersData?.listUsers
              .filter(user => cls.studentIds.includes(user.id))
              .map(user => (
                <button
                  key={user.id}
                  onClick={() => setForm(f => ({ ...f, studentId: user.id }))}
                  className={`w-full flex justify-between items-center px-4 py-2 rounded-md border transition text-left
                    ${
                      form.studentId === user.id
                        ? 'bg-blue-100 border-blue-400 font-semibold'
                        : 'hover:bg-gray-50 border-gray-300'
                    }`}
                >
                  <span className="text-gray-800">{user.pseudo}</span>
                  <span className="text-xs text-gray-500">{user.id}</span>
                </button>
              ))}

            {cls.studentIds.length === 0 && (
              <p className="text-sm text-gray-400 italic">Aucun étudiant dans cette classe</p>
            )}
          </div>
        </div>
      ))}
    </div>


    </div>
  );
}
