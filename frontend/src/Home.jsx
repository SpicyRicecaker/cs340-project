import Link from './Link'

const production = import.meta.env.MODE == 'production'

function Home() {

    return (
        <>
            {!production ? <h1 className='text-1xl rounded-lg p-2 font-mono bg-white text-black border-2 border-solid shadow-md text-center text-2xl m-0 p-0'>Furry Friends!</h1> : <div></div>}
            <br></br>

            <div className='grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 [&>*]:(aspect-[1/1])'>

                <Link inGrid={true} url="/view/Contacts" label="Contacts" />
                <Link inGrid={true} url="/view/PetRaces" label="PetRaces" />
                <Link inGrid={true} url="/view/Applications" label="Applications" />
                <Link inGrid={true} url="/view/AppAnswers" label="AppAnswers" />
                <Link inGrid={true} url="/view/AppQuestions" label="AppQuestions" />
            </div>
        </>
    )
}

export default Home;