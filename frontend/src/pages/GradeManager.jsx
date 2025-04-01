import { gql, useMutation } from '@apollo/client';
import { useState } from 'react';

const ADD = gql`mutation($studentId:ID!,$courseId:ID!,$classId:ID,$value:Float!){
  addGrade(studentId:$studentId,courseId:$courseId,classId:$classId,value:$value){id}
}`;

const UPDATE = gql`mutation($id:ID!,$value:Float!){ updateGrade(id:$id,value:$value){ id value } }`;
const DELETE = gql`mutation($id:ID!){ deleteGrade(id:$id) }`;

export default function GradeManager() {
  const [form, setForm] = useState({ studentId: '', courseId: '', classId: '', value: '' });
  const [edit, setEdit] = useState({ id: '', value: '' });

  const [addGrade] = useMutation(ADD, { onCompleted: () => alert("Note ajoutée") });
  const [updateGrade] = useMutation(UPDATE, { onCompleted: () => alert("Note modifiée avec succès !") });
  const [deleteGrade] = useMutation(DELETE, { onCompleted: () => alert("Note supprimée avec succès !") });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-4">Ajouter une note</h2>
        <form onSubmit={e => {
          e.preventDefault();
          addGrade({ variables: { ...form, value: parseFloat(form.value) } });
        }} className="space-y-4 max-w-md">
          <input name="studentId" value={form.studentId} onChange={handleChange} placeholder="ID Étudiant"
            className="border p-2 w-full rounded" required />
          <input name="courseId" value={form.courseId} onChange={handleChange} placeholder="ID Cours"
            className="border p-2 w-full rounded" required />
          <input name="classId" value={form.classId} onChange={handleChange} placeholder="ID Classe (optionnel)"
            className="border p-2 w-full rounded" />
          <input name="value" type="number" value={form.value} onChange={handleChange} placeholder="Note"
            className="border p-2 w-full rounded" required />
          <button className="bg-indigo-600 text-white px-4 py-2 rounded" type="submit">Ajouter</button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Modifier ou Supprimer une note</h2>
        <input value={edit.id} onChange={e => setEdit({ ...edit, id: e.target.value })} placeholder="ID de la note"
          className="border p-2 rounded w-full mb-2" />
        <input value={edit.value} onChange={e => setEdit({ ...edit, value: e.target.value })} type="number" placeholder="Nouvelle valeur"
          className="border p-2 rounded w-full mb-2" />
        <button onClick={() => updateGrade({ variables: { id: edit.id, value: parseFloat(edit.value) } })}
          className="bg-yellow-500 text-white px-4 py-2 rounded mr-2">Modifier</button>
        <button onClick={() => deleteGrade({ variables: { id: edit.id } })}
          className="bg-red-600 text-white px-4 py-2 rounded">Supprimer</button>
      </div>
    </div>
  );
}