import { CodeGenerator } from "@/components/code-generator";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <div className="container py-8">
          <CodeGenerator />
        </div>
      </main>
    </div>
  );
}
