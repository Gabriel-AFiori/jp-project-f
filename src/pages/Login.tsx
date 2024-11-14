import { useState } from "react";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../services/firebaseConfig";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
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

      <button type="button"> Sign Up </button>
    </div>
  );
}

export default Login;
