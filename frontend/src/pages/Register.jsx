import { useState, useContext } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';

const REGISTER = gql`
  mutation Register($email: String!, $pseudo: String!, $password: String!, $role: String!) {
    register(email: $email, pseudo: $pseudo, password: $password, role: $role) {
      token
      user { id email pseudo role }
    }
  }
`;

export default function Register() {
  const [form, setForm] = useState({ email: '', pseudo: '', password: '', role: 'student' });
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const [register, { error }] = useMutation(REGISTER, {
    onCompleted: ({ register }) => {
      localStorage.setItem('token', register.token);
      setAuth(register.user);
      navigate('/');
    }
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    register({ variables: form });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Créer un compte</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email"
          className="w-full border px-3 py-2 rounded" required />
        <input name="pseudo" type="text" value={form.pseudo} onChange={handleChange} placeholder="Pseudo"
          className="w-full border px-3 py-2 rounded" required />
        <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Mot de passe"
          className="w-full border px-3 py-2 rounded" required />
        <select name="role" value={form.role} onChange={handleChange} className="w-full border px-3 py-2 rounded">
          <option value="student">Étudiant</option>
          <option value="professor">Professeur</option>
        </select>
        {error && <p className="text-red-500">{error.message}</p>}
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">Créer un compte</button>
      </form>
    </div>
  );
}
