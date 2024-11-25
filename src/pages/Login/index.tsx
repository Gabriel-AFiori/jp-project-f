import { useState } from "react";
import { loginWithEmail } from "../../services/fireService";
import { auth, googleProvider } from "../../services/firebaseConfig";
import { useNavigate, Link } from "react-router-dom";
import Form from "../../components/formComponent";
import { signInWithPopup } from "firebase/auth";
import axios from "axios";
import { FirebaseError } from "firebase/app";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await loginWithEmail(email, password);
      navigate("/home");
    } catch (error) {
      setError("Login failed. Please try again.");
      console.error(error);
    }
  };

  const handleGoogleLogin = async () => {
    try{
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user
      const response = await axios.post('https://jp-project-b-production.up.railway.app/user', {
        userId: user.uid,
        email: user.email,
      });
  
      if (response.status === 200) {
        navigate("/home");
      } else {
        setError("Google Login failed.");
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        setError(error.message);
      } else {
        setError("Google Login failed.");
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p>{error}</p>}
      <Form
        fields={[
          { name: "Email", type: "email", value: email, onChange: (e) => setEmail(e.target.value) },
          { name: "Password", type: "password", value: password, onChange: (e) => setPassword(e.target.value) },
        ]}
        onSubmit={handleLogin}
        buttonText="Login"
      />
      <button className="google-login" onClick={handleGoogleLogin}>
        <svg className="google-icon" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
          <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
        </svg>
      </button>
      <Link to="/signup">
        <button type="button">Sign Up</button>
      </Link>
    </div>
  );
}

export default Login;
