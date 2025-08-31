// 📌 src/pages/AdminLogin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
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
        throw new Error(errData.message || '❌ Error en el login');
      }

      const data = await res.json();

      // ✅ Guardamos token y usuario en localStorage
      localStorage.setItem('adminToken', data.accessToken);
      localStorage.setItem('adminUser', JSON.stringify(data.user));

      // ✅ Validar que sea admin
      if (data.user.rol === 'admin') {
        alert(`✅ Bienvenido Administrador: ${data.user.nombre || data.user.email}`);
        navigate('/catalog', { replace: true }); // 👈 redirige al catálogo
      } else {
        setError('⚠️ No tienes permisos de administrador');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
      }
    } catch (err) {
      console.error('❌ Error en login admin:', err);
      setError(err.message || 'Error desconocido');
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
        Login Administrativo
      </h2>

      {/* Mensaje de error */}
      {error && (
        <p style={{ color: 'red', textAlign: 'center', marginBottom: '15px' }}>
          {error}
        </p>
      )}

      {/* Formulario de login */}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="email"
            placeholder="Correo admin"
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
            marginBottom: '10px',
          }}
        >
          {loading ? 'Ingresando...' : 'Iniciar Sesión'}
        </button>
      </form>

      {/* Botón para ir al catálogo público */}
      <button
        onClick={() => navigate('/user/catalog')}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#555',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        Volver al Catálogo Público
      </button>
    </div>
  );
};

export default AdminLogin;
