import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebaseConfig";
import { FirebaseError } from "firebase/app";
import axios from "axios";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Alterar o catch para tratar o erro de forma mais amigavel
  // Alterar para após o Auth ele realizar o redirecionamento da page para o dashboard ou home dependendo do app (atualmente generico para entender o comportamento do firebase)
  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Agora o register local registra o usuario no db
      const response = await axios.post('http://localhost:3001/user', {
        userId: user.uid,
        email: user.email,
      });
      
      console.log(response.data);
      console.log(userCredential.user);
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

  return (
    <div>
      <h2>Signup</h2>
      {error && <p>{error}</p>}

      <form onSubmit={ handleSignup }>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button type="submit">Signup</button>
      </form>
    </div>
  );
}

export default Signup;
