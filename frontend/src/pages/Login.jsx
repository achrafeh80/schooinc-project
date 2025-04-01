import { useState, useContext } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user { id email pseudo role }
    }
  }
`;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const [login, { error }] = useMutation(LOGIN, {
    onCompleted: ({ login }) => {
      localStorage.setItem('token', login.token);
      setAuth(login.user);
      navigate('/');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ variables: { email, password } });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Connexion</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email"
          className="w-full border px-3 py-2 rounded" required />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mot de passe"
          className="w-full border px-3 py-2 rounded" required />
        {error && <p className="text-red-500">{error.message}</p>}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Se connecter</button>
      </form>
    </div>
  );
}
