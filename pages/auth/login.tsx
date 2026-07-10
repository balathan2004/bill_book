import { Button, TextField } from "@mui/material";
import { useState } from "react";
import styles from "../../styles/Login.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {};

  return (
    <div className={styles.login_container}>
      <div className={styles.login_card}>
        <h1>BillBook</h1>
        <p>Sign in to manage your bills and expenses.</p>

        <TextField
          fullWidth
          label="Email"
          type="email"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          fullWidth
          variant="contained"
          size="large"
          sx={{ mt: 2 }}
          onClick={handleSubmit}
        >
          Sign In
        </Button>
      </div>
    </div>
  );
}
