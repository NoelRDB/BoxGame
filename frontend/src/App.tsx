import BoxGame from "./components/BoxGame";

export default function App() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-y-3">
      {/* <VerifyBlock />
      <PayBlock /> */}
      <BoxGame />
    </main>
  );
}
