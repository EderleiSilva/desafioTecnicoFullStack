import ButtonNavegation from "../components/button/button";

export default function Home() {
  return (
    <div className="p-20 h-screen flex justify-center items-center">
      <div className="w-full max-w-md bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <section>
          <h1 className="items-center text-2xl font-bold text-gray-800 mb-6">
            Bem vido ao Desafio Técnico FullStack com Ênfase Frontend
          </h1>

          <div className="flex gap-4 justify-center my-10">
            <ButtonNavegation text="Cadastrar" href="/register" />
            <ButtonNavegation text="Logar" href="/login" />
          </div>

        </section>
      </div>
    </div>
  );
}
