import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiService from '../services/apiService';
import { Lock, CheckCircle } from 'lucide-react';

const ResetPasswordPage = () => {
  const { token } = useParams(); // Get the token from the URL
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await apiService.resetPassword(token, password);
      setMessage(response.message);
    } catch (err) {
      setError(err || 'Failed to reset password. The link may be invalid or expired.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 shadow-lg animate-fade-in-down">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Reset Your Password</h1>
            <p className="text-slate-400">Enter your new password below.</p>
          </div>

          {message ? (
            <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <p className="text-green-400 mb-6 text-lg">{message}</p>
              <Link to="/" className="w-full bg-purple-600 text-white font-semibold py-3 rounded-lg hover:bg-purple-700 transition-colors block">
                Proceed to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {error && <p className="text-red-400 text-sm text-center">{error}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-purple-600 text-white font-semibold py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-500"
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;