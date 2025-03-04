import MyHeader from '@/components/header/Header'; // Import Header

export default function Atividade() {
    return (
        <>
            <MyHeader />
            <main className="flex h-screen w-full items-center justify-center">
                <div className="flex flex-col gap-8 items-center sm:items-start">
                    Pagina de atividades!!
                </div>
            </main>
        </>
    );
}
