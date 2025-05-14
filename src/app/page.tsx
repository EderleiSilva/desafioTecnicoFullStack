import ButtonNavegation from "../components/button/button";

export default function Home() {
  return (
    <div className="p-20 h-screen flex justify-center items-center">
      <div className="w-full max-w-md bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h1 className="items-center text-2xl font-bold text-gray-800 mb-6 text-center">
          Bem vido ao Desafio Técnico FullStack com Ênfase Frontend
        </h1>
        <section className="mb-6 flex flex-col gap-4 border-3 border-gray-200 pb-4 shadow-md rounded px-2 py-2">
          <p className="text-gray-700 mb-4">
            O sistema é uma aplicação de gerenciamento de usuários, onde o usuário comum apenas consegue ver as suas infomações e o usuário administrador ja configurado consegue visualizar, editar e exluir todos os usuários.
          </p>

          <p className="text-gray-700 mb-4">
            Para acessar o sistema, faça login ou cadastre-se.
          </p>
        </section>

        <div className="flex justify-between items-center">

          <ButtonNavegation text="Cadastrar" href="/register" />
          <ButtonNavegation text="Logar" href="/login" />
        </div>

      </div>
    </div>
  );
}
