import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebaseConfig";
import { FirebaseError } from "firebase/app";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  // Alterar para após o Auth ele realizar o redirecionamento da page para o dashboard ou home dependendo do app (atualmente generico para entender o comportamento do firebase)
  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
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
