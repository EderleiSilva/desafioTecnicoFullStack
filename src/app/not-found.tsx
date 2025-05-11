import ButtonNavegation from "@/components/button/button"

export default function NotFound(){
    return(
        <div className="flex flex-col item-center justify-center">
            <h1 className="text-center font-bold mt-9 text-5xl">
                Página 404 não encontrada!
            </h1>
            <p>Essa página que tentou acessar não existe!</p>
            <ButtonNavegation text="Voltar para home" href="/" />
        </div>
    )
}