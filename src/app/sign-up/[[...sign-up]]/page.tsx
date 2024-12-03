import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex justify-center items-center h-screen">
      <SignUp 
        path="/sign-up"
        routing="path"
        afterSignUpUrl="/"
        // ... misma configuración de apariencia que sign-in ...
      />
    </div>
  );
} 