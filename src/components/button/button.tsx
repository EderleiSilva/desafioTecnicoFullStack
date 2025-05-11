import Link from "next/link"

interface buttonNavegationProps {
    text: string;
    href: string;
}

export default function ButtonNavegation ({ text, href }: buttonNavegationProps){
    return(
        <Link href={href}>
            <button 
                className="bg-blue-500 
                        hover:bg-blue-700 
                        text-white 
                        font-bold 
                        py-2 
                        px-4 
                        rounded 
                        cursor-pointer">
                {text}
            </button>  
        </Link>
    )
}