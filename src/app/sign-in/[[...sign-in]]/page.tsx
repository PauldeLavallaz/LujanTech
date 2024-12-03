import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex justify-center items-center h-screen">
      <SignIn 
        path="/sign-in"
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-none",
            headerTitle: "text-2xl font-bold",
            headerSubtitle: "text-gray-600",
            formButtonPrimary: "bg-black hover:bg-black/90",
            footerActionLink: "text-black hover:text-black/90",
            formFieldInput: "rounded-xl",
            socialButtonsBlockButton: "rounded-xl",
            dividerLine: "bg-gray-200",
            dividerText: "text-gray-400",
            headerTitle__signIn: "after:content-['Morfeo Dreams Lab']",
            headerSubtitle__signIn: "after:content-['Continuá tu viaje creativo']",
            socialButtonsBlockButton__google: "after:content-['Continuar con Google']",
            formFieldLabel__emailAddress: "after:content-['Correo electrónico']",
            formButtonPrimary__signIn: "after:content-['Continuar']",
            footerActionText__signIn: "after:content-['¿No tenés una cuenta?']",
            footerActionLink__signIn: "after:content-['Registrate']",
          },
          variables: {
            colorPrimary: "#000000",
            colorTextSecondary: "#666666",
          },
        }}
        signUpUrl="/sign-up"
      />
    </div>
  );
}