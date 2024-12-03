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
          },
          variables: {
            colorPrimary: "#000000",
            colorTextSecondary: "#666666",
          },
        }}
        translations={{
          signIn: {
            start: {
              title: "Iniciá sesión en Morfeo Dreams Lab",
              subtitle: "Continuá tu viaje creativo",
            },
            social: {
              google: {
                buttonText: "Continuar con Google",
              },
            },
            emailCode: {
              title: "Iniciá sesión en Morfeo Dreams Lab",
              subtitle: "Continuá tu viaje creativo",
            },
            password: {
              title: "Iniciá sesión en Morfeo Dreams Lab",
              subtitle: "Continuá tu viaje creativo",
            },
          },
          dividerText: "o",
          formFieldLabel__emailAddress: "Correo electrónico",
          formButtonPrimary: "Continuar",
          footerActionText: "¿No tenés una cuenta?",
          footerActionLink: "Registrate",
        }}
        signUpUrl="/sign-up"
      />
    </div>
  );
}