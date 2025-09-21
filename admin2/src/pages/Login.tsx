import { LoginForm } from "@/components/login-form";
import { useUserStore } from "@/store/useUserStore";
import { useState } from "react";



export default function Login() {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const {login,loading} = useUserStore();

  const handlSubmit=async(e: React.FormEvent)=>{
    e.preventDefault();
    await login(email,password);
    setEmail("");
    setPassword("");
  }
  return (
    <div className="bg-muted flex items-center justify-center p-6 md:p-10 w-full h-full">

      <LoginForm
       email={email} 
       setEmail={setEmail} 
       password={password}
       setPassword={setPassword}
       handleSubmite={handlSubmit}
       loading={loading}
       className="max-w-[750px] w-full h-full pt-23" />
    </div>
  )
}