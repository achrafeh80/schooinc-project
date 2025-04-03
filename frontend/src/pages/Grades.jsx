import { gql, useQuery } from '@apollo/client';

const MY_GRADES = gql`
  query MyGrades {
    myGrades {
      id
      courseId
      classId
      value
    }
  }
`;

const LIST_COURSES = gql`query { listCourses { id title } }`;
const LIST_CLASSES = gql`query { listClasses { id name } }`;

export default function Grades() {
  const { data: gradesData, loading, error } = useQuery(MY_GRADES);
  const { data: coursesData } = useQuery(LIST_COURSES);
  const { data: classesData } = useQuery(LIST_CLASSES);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-red-500">Erreur : {error.message}</p>;

  const grades = gradesData?.myGrades || [];

  const getCourseName = (id) => coursesData?.listCourses.find(c => c.id === id)?.title || id;
  const getClassName = (id) => classesData?.listClasses.find(c => c.id === id)?.name || id;

  const className = grades.length > 0 ? getClassName(grades[0].classId) : 'Classe inconnue';

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-2">Mes Notes</h2>
      <p className="text-gray-600 mb-6">Classe : <strong>{className}</strong></p>

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left p-2">Cours</th>
            <th className="text-left p-2">Note</th>
          </tr>
        </thead>
        <tbody>
          {grades.map(grade => (
            <tr key={grade.id} className="border-t">
              <td className="p-2">{getCourseName(grade.courseId)}</td>
              <td className="p-2">{grade.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
