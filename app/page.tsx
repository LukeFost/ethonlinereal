import { MainBody } from "@/components/main-body";
import { MainNav } from "@/components/main-nav";
export default function Home() {
  return (
    <main className="flex min-h-screen min-w-screen px-12">
      <div className="w-full">
        <MainNav></MainNav>
        <MainBody></MainBody>
      </div>
    </main>
  );
}
