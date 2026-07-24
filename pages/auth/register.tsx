import { Button, TextField, Link } from "@mui/material";
import { useState } from "react";
import NextLink from "next/link";
import styles from "@/styles/login.module.css";
import { useRegisterMutation } from "@/src/redux/api/authApi";
import { ToastContainer, toast } from "react-toastify";
export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [register, { isLoading }] = useRegisterMutation();

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    try {
      const data = await register({ email, password }).unwrap();
      toast.success("Account created successfully! Please log in.");
    } catch (err) {
      toast.error(
        err?.data?.error || err.data || "An error occurred. Please try again.",
      );
    }
  };

  return (
    <div className={styles.login_container}>
      <div className={styles.login_card}>
        <h1>Create Account</h1>
        <p>Start managing your bills and expenses with BillBook.</p>

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
          type={showPassword ? "text" : "password"}
          margin="normal"
          slotProps={{
            input: {
              endAdornment: (
                <Button
                  onClick={() => setShowPassword(!showPassword)}
                  sx={{ minWidth: "auto" }}
                >
                  {showPassword ? "Hide" : "Show"}
                </Button>
              ),
            },
          }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          fullWidth
          variant="contained"
          size="large"
          sx={{ mt: 2 }}
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>

        <p className={styles.auth_link}>
          Already have an account?{" "}
          <Link component={NextLink} href="/auth/login">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
