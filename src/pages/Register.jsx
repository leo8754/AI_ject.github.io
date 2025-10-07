import React from 'react';
import RegisterForm from '../components/RegisterForm';
import '../styles/register.css';

function Register() {
  return (
    <div className="register-page">
      <h2>註冊帳號</h2>
      <RegisterForm />
    </div>
  );
}

export default Register;
