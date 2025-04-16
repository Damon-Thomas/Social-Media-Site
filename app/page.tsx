import AuthForm from "./ui/auth-form";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-4 md:p-8 font-[family-name:var(--font-geist-sans)] bg-[var(--color-background)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <AuthForm />
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
    </div>
  );
}
