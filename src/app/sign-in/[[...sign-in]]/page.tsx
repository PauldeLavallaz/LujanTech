import { SignIn } from "@clerk/nextjs";

export default function Page() {
    return <div className="flex justify-center items-center h-screen">
        <SignIn 
            path="/sign-in"
            appearance={{
                elements: {
                    rootBox: "mx-auto",
                    card: "shadow-none",
                    headerTitle: "text-2xl font-bold",
                    headerSubtitle: "text-gray-600",
                },
            }}
            localization={{
                signIn: {
                    title: "Iniciá sesión en Morfeo Dream Labs",
                    subtitle: "Continuá tu viaje creativo",
                    start: {
                        title: "Iniciá sesión en Morfeo Dream Labs",
                        subtitle: "Continuá tu viaje creativo",
                    },
                },
                socialButtonsBlockButton: {
                    google: "Continuar con Google",
                },
                dividerText: "o",
                formFieldLabel__emailAddress: "Correo electrónico",
                formButtonPrimary: "Continuar",
                footerActionLink: "Registrate",
                footerActionText: "¿No tenés una cuenta?",
            }}
            signUpUrl="/sign-up"
        />
    </div>;
}