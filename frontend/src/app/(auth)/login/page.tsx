import AuthForm from "@/components/auth/AuthForm";

export const metadata = {
  title: "Log in — Opttis",
  description: "Sign in to your Opttis account to access your podcast studio.",
};

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
