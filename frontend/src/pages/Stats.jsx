import { gql, useLazyQuery } from '@apollo/client';
import { useState } from 'react';

const STATS = gql`query($courseId:ID!){ gradeStatsByCourse(courseId:$courseId){min max median} }`;

export default function Stats() {
  const [courseId, setCourseId] = useState('');
  const [fetchStats, { data, loading }] = useLazyQuery(STATS);

  const handleSubmit = e => {
    e.preventDefault();
    fetchStats({ variables: { courseId } });
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Statistiques par cours</h2>
      <form onSubmit={handleSubmit} className="mb-6 flex space-x-2">
        <input value={courseId} onChange={e => setCourseId(e.target.value)} className="border p-2 rounded w-full"
          placeholder="ID du cours" required />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Voir Stats</button>
      </form>

      {loading && <p>Chargement...</p>}
      {data && (
        <div className="space-y-2 text-lg">
          <p>Min : {data.gradeStatsByCourse.min}</p>
          <p>Max : {data.gradeStatsByCourse.max}</p>
          <p>Médiane : {data.gradeStatsByCourse.median}</p>
        </div>
      )}
    </div>
  );
}
