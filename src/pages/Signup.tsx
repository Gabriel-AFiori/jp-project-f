import { useState } from "react";
import { signupWithEmailandPassword } from "../services/fireService"; // Serviço de autenticação
import { FirebaseError } from "firebase/app";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Form from "../components/formComponent"; // Componente de formulário

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Função para tratar o signup
  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const userCredential = await signupWithEmailandPassword(email, password);
      const user = userCredential.user;

      // Registra o usuário no banco de dados
      const response = await axios.post("http://localhost:3001/user", {
        userId: user.uid,
        email: user.email,
      });

      navigate("/");
      console.log(response.data);
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        console.error(error.code);
        console.error(error.message);
        setError(error.message);
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
    <div>
      <h2>Signup</h2>
      {error && <p>{error}</p>}
      <Form fields={fields} onSubmit={handleSignup} buttonText="Signup" />
    </div>
  );
}

export default Signup;
