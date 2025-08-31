import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Credenciales incorrectas');
      }

      const data = await res.json();

      // ✅ Guardar token y usuario en localStorage
      localStorage.setItem('userToken', data.accessToken);
      localStorage.setItem('userEmail', JSON.stringify(data.user));

      alert(`✅ Bienvenido ${data.user.nombre || data.user.email}`);
      navigate('/user/catalog', { replace: true });
    } catch (err) {
      console.error('❌ Error en login:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: '400px',
        margin: '80px auto',
        padding: '30px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        backgroundColor: '#fff',
      }}
    >
      <h2
        style={{
          textAlign: 'center',
          marginBottom: '20px',
          color: '#c3002f',
        }}
      >
        Login Usuario
      </h2>

      {error && (
        <p style={{ color: 'red', textAlign: 'center', marginBottom: '15px' }}>
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: loading ? '#888' : '#c3002f',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Iniciando...' : 'Iniciar Sesión'}
        </button>
      </form>

      <p style={{ marginTop: '15px', textAlign: 'center' }}>
        ¿No tienes cuenta?{' '}
        <button
          onClick={() => navigate('/user/register')}
          style={{
            background: 'none',
            border: 'none',
            color: '#c3002f',
            fontWeight: 'bold',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          Regístrate aquí
        </button>
      </p>
    </div>
  );
};

export default UserLogin;
