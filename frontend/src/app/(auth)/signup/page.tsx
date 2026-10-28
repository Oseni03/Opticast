import AuthForm from "@/components/auth/AuthForm";

export const metadata = {
  title: "Sign up — Opttis",
  description:
    "Join Opttis and start converting your YouTube videos into podcasts.",
};

export default function SignupPage() {
  return <AuthForm mode="signup" />;
}
