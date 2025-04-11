import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useUser } from '../context/UserContext';
import '../styles/dynamic.css';

function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useUser();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate form
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all fields');
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      // Create user with Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Update user profile with display name
      await updateProfile(userCredential.user, {
        displayName: formData.name
      });

      // Update user context
      login({
        email: userCredential.user.email,
        name: formData.name,
        uid: userCredential.user.uid
      });

      // Navigate to quiz
      navigate('/quiz', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-green-300 to-blue-300">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full p-2 mb-4 border rounded"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-2 mb-4 border rounded"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-2 mb-4 border rounded"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="w-full p-2 mb-4 border rounded"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <button 
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
        <p className="text-center mt-4">
          Already have an account?{' '}
          <button
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

export default SignUp;