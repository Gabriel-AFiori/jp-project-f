import { useState } from "react";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../services/firebaseConfig";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Alterar para após o Auth ele realizar o redirecionamento da page para o dashboard ou home dependendo do app (atualmente generico para entender o comportamento do firebase)
  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
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

  // Alterar para após o Auth ele realizar o redirecionamento da page para o dashboard ou home dependendo do app (atualmente generico para entender o comportamento do firebase)
  const handleGoogleLogin = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
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
      {/* Faz sentido existir um header aqui? Ele sera compartilhado com outras pages? Possivel componentização */}
      {/* <Header /> */}
      <h2>Login</h2>
      {error && <p>{error}</p>}

      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
      </form>

      <button type="button" onClick={handleGoogleLogin}>
        Login with Google
      </button>
      
      {/* Pensar em utilizar um Navigate... (é uma possibilidade) */}
      <Link to="/signup">
        <button type="button"> Sign Up </button>
      </Link>
    </div>
  );
}

export default Login;
