import type { Metadata } from "next";
import RegisterView from "@/components/store/RegisterView";

export const metadata: Metadata = {
  title: "Register",
  description: "Register your Beats 3 to activate your warranty.",
};

export default function RegisterPage() {
  return <RegisterView />;
}