import { gql, useQuery } from '@apollo/client';

const MY_GRADES = gql`
  query MyGrades {
    myGrades {
      id
      courseId
      value
    }
  }
`;

export default function Grades() {
  const { data, loading, error } = useQuery(MY_GRADES);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-red-500">Erreur : {error.message}</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Mes Notes</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left p-2">ID du cours</th>
            <th className="text-left p-2">Note</th>
          </tr>
        </thead>
        <tbody>
          {data.myGrades.map(grade => (
            <tr key={grade.id} className="border-t">
              <td className="p-2">{grade.courseId}</td>
              <td className="p-2">{grade.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
