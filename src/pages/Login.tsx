import { useState } from "react";
import { loginWithEmail, loginWithGoogle } from "../services/fireService";
import { useNavigate, Link } from "react-router-dom";
import Form from "../components/Form";

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
    try {
      await loginWithGoogle();
      navigate("/home");
    } catch (error) {
      setError("Google Login failed.");
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Form
        fields={[
          { name: "Email", type: "email", value: email, onChange: (e) => setEmail(e.target.value) },
          { name: "Password", type: "password", value: password, onChange: (e) => setPassword(e.target.value) },
        ]}
        onSubmit={handleLogin}
        buttonText="Login"
      />
      <button onClick={handleGoogleLogin}>Login with Google</button>
      <Link to="/signup">
        <button type="button">Sign Up</button>
      </Link>
    </div>
  );
}

export default Login;
