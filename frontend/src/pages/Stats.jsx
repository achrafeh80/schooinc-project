
import { gql, useLazyQuery, useQuery } from '@apollo/client';
import { useState } from 'react';

// GraphQL queries
const LIST_COURSES = gql`query { listCourses { id title } }`;
const LIST_CLASSES = gql`query { listClasses { id name studentIds } }`;
const LIST_USERS = gql`query { listUsers { id pseudo } }`;

const COURSE_STATS = gql`query($courseId:ID!) {
  gradeStatsByCourse(courseId:$courseId) {
    min
    max
    median
  }
}`;

const CLASS_STATS = gql`query($classId: ID!) {
  gradeStatsByClass(classId: $classId) {
    min
    max
    median
  }
}`;

const GRADES_BY_STUDENT = gql`query($studentId: ID!) {
  listGradesByStudent(studentId: $studentId) {
    id
    value
    courseId
  }
}`;

const STUDENT_STATS = gql`query($studentId: ID!) {
  gradeStatsByStudent(studentId: $studentId) {
    min
    max
    median
  }
}`;

export default function Stats() {
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [sortBy, setSortBy] = useState('pseudo');

  const { data: coursesData } = useQuery(LIST_COURSES);
  const { data: classesData } = useQuery(LIST_CLASSES);
  const { data: usersData } = useQuery(LIST_USERS);

  const [fetchCourseStats, { data: courseStats }] = useLazyQuery(COURSE_STATS);
  const [fetchClassStats, { data: classStats }] = useLazyQuery(CLASS_STATS);
  const [fetchStudentGrades, { data: studentGrades }] = useLazyQuery(GRADES_BY_STUDENT);
  const [fetchStudentStats, { data: studentStats }] = useLazyQuery(STUDENT_STATS);

  const handleCourseSubmit = (e) => {
    e.preventDefault();
    fetchCourseStats({ variables: { courseId: selectedCourseId } });
  };

  const handleClassSubmit = (e) => {
    e.preventDefault();
    fetchClassStats({ variables: { classId: selectedClassId } });
  };

  const handleStudentSubmit = (e) => {
    e.preventDefault();
    fetchStudentGrades({ variables: { studentId: selectedStudentId } });
    fetchStudentStats({ variables: { studentId: selectedStudentId } });
  };

  const getClassName = (studentId) => {
    const foundClass = classesData?.listClasses.find(c => c.studentIds.includes(studentId));
    return foundClass?.name || '';
  };

  const getStudentAverage = (studentId) => {
    if (!studentGrades || selectedStudentId !== studentId) return '';
    const grades = studentGrades.listGradesByStudent;
    const total = grades.reduce((sum, g) => sum + g.value, 0);
    return (grades.length > 0 ? (total / grades.length).toFixed(2) : '');
  };

  const sortedUsers = [...(usersData?.listUsers || [])].sort((a, b) => {
    if (sortBy === 'pseudo') return a.pseudo.localeCompare(b.pseudo);
    if (sortBy === 'classe') return getClassName(a.id).localeCompare(getClassName(b.id));
    if (sortBy === 'note') return parseFloat(getStudentAverage(b.id)) - parseFloat(getStudentAverage(a.id));
    return 0;
  });

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* LEFT: STAT BLOCKS */}
      <div className="space-y-8">
        <div className="space-y-4 bg-white p-4 rounded shadow border">
          <h2 className="text-lg font-semibold">Statistiques par cours</h2>
          <form onSubmit={handleCourseSubmit}>
            <select value={selectedCourseId} onChange={e => setSelectedCourseId(e.target.value)} className="w-full border p-2 rounded mb-2">
              <option value="">-- Sélectionner un cours --</option>
              {coursesData?.listCourses.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
            <button className="w-full bg-blue-600 text-white py-2 rounded">Voir</button>
          </form>
          {courseStats && (
            <div className="text-sm space-y-1">
              <p>Min: {courseStats.gradeStatsByCourse.min}</p>
              <p>Max: {courseStats.gradeStatsByCourse.max}</p>
              <p>Médiane: {courseStats.gradeStatsByCourse.median}</p>
            </div>
          )}
        </div>

        <div className="space-y-4 bg-white p-4 rounded shadow border">
          <h2 className="text-lg font-semibold">Statistiques par classe</h2>
          <form onSubmit={handleClassSubmit}>
            <select value={selectedClassId} onChange={e => setSelectedClassId(e.target.value)} className="w-full border p-2 rounded mb-2">
              <option value="">-- Sélectionner une classe --</option>
              {classesData?.listClasses.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <button className="w-full bg-purple-600 text-white py-2 rounded">Voir</button>
          </form>
          {classStats && (
            <div className="text-sm space-y-1">
              <p>Min: {classStats.gradeStatsByClass.min}</p>
              <p>Max: {classStats.gradeStatsByClass.max}</p>
              <p>Médiane: {classStats.gradeStatsByClass.median}</p>
            </div>
          )}
        </div>

        <div className="space-y-4 bg-white p-4 rounded shadow border">
          <h2 className="text-lg font-semibold">Statistiques par étudiant</h2>
          <form onSubmit={handleStudentSubmit}>
            <select value={selectedStudentId} onChange={e => setSelectedStudentId(e.target.value)} className="w-full border p-2 rounded mb-2">
              <option value="">-- Sélectionner un étudiant --</option>
              {usersData?.listUsers.map(u => (
                <option key={u.id} value={u.id}>{u.pseudo}</option>
              ))}
            </select>
            <button className="w-full bg-green-600 text-white py-2 rounded">Voir</button>
          </form>
          {studentStats && (
            <div className="text-sm space-y-1">
              <p>Min: {studentStats.gradeStatsByStudent.min}</p>
              <p>Max: {studentStats.gradeStatsByStudent.max}</p>
              <p>Médiane: {studentStats.gradeStatsByStudent.median}</p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: STUDENT GRADES + FULL TABLE */}
      <div className="space-y-6">
        <div className="bg-white p-4 rounded shadow border">
          <h2 className="text-lg font-semibold mb-2">Notes de l’étudiant</h2>
          {studentGrades && (
            <table className="w-full table-auto text-sm border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2">Cours</th>
                  <th className="border p-2">Note</th>
                </tr>
              </thead>
              <tbody>
                {studentGrades.listGradesByStudent.map(g => {
                  const course = coursesData?.listCourses.find(c => c.id === g.courseId);
                  return (
                    <tr key={g.id}>
                      <td className="border p-2">{course?.title || g.courseId}</td>
                      <td className="border p-2">{g.value}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="bg-white p-4 rounded shadow border">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Tous les élèves</h2>
            <select onChange={e => setSortBy(e.target.value)} className="border p-1 rounded text-sm">
              <option value="pseudo">Trier par nom</option>
              <option value="classe">Trier par classe</option>
              <option value="note">Trier par note</option>
            </select>
          </div>
          <table className="w-full text-sm table-auto border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Nom</th>
                <th className="border p-2">Classe</th>
                <th className="border p-2">Moyenne</th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map(user => (
                <tr key={user.id}>
                  <td className="border p-2">{user.pseudo}</td>
                  <td className="border p-2">{getClassName(user.id)}</td>
                  <td className="border p-2">{getStudentAverage(user.id)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
