import { Button, TextField, Link } from "@mui/material";
import { useState } from "react";
import NextLink from "next/link";
import styles from "@/styles/login.module.css";
import { useLoginMutation } from "@/src/redux/api/authApi";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading }] = useLoginMutation();

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    try {
      const data = await login({ email, password }).unwrap();
      console.log(data);
      toast.success(data?.message);

      router.push("/home");
    } catch (err: any) {
      console.error(err);
      toast.error(
        err?.data?.error || err.data || "An error occurred. Please try again.",
      );
    }
  };

  return (
    <div className={styles.login_container}>
      <div className={styles.login_card}>
        <h1>Welcome Back</h1>
        <p>Sign in to access your BillBook account.</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <TextField
            required
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            required
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
            type="submit"
            variant="contained"
            size="large"
            sx={{ mt: 2 }}
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        <p className={styles.auth_link}>
          Don't have an account?{" "}
          <Link component={NextLink} href="/auth/register">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}
