import { useState } from "react";
import { signupWithEmailandPassword } from "../../services/fireService";
import { FirebaseError } from "firebase/app";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Form from "../../components/formComponent";
import { Link } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const userCredential = await signupWithEmailandPassword(email, password);
      const user = userCredential.user;

      const response = await axios.post("https://jp-project-back-production.up.railway.app/user", { //Lembrar de voltar para o endereço do Railway
        userId: user.uid,
        email: user.email,
      });

      navigate("/");
      console.log(response.data);
    } catch (error: unknown) {
      if (error instanceof FirebaseError && error.code === "auth/email-already-in-use") {
        setError("Email already in use.");
      } else {
        console.error("Unexpected error", error);
        setError("An unexpected error occurred.");
      }
    }
  };

  const fields = [
    { name: "Email", type: "email", value: email, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value) },
    { name: "Password", type: "password", value: password, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value) },
  ];

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      {error && <p>{error}</p>}
      <Form fields={fields} onSubmit={handleSignup} buttonText="Signup" />
      <Link to="/">
        <button type="button">Return to Login</button>
      </Link>
    </div>
  );
}

export default Signup;
