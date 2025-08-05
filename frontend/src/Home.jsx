import Link from './Link'

const production = import.meta.env.MODE == 'production'
const backendURL =  `${production ? "http://classwork.engr.oregonstate.edu:${import.meta.env.VITE_BACKEND_PORT}/"
                                  : "http://localhost:3000/"}`;

function Home() {

    const reset = async () => {
        // console.log(`fetching ${backendURL}reset`)
        const res = await fetch(`${backendURL}reset`, {
            method: 'PUT'
        })
        if (res.ok) {
            console.log('yayy!!!')
        } else {
            console.log("error, couldn't reset")
        }
    }

    return (
        <>
            <h1 className='text-6xl rounded-lg p-4 font-sans border-2 border-solid shadow-md text-center text-2xl m-0 p-0'>~Furry Friends~<br></br><span className='text-3xl'>Adoption Shelter</span></h1>

            <br></br>

            <div className='grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 [&>*]:(aspect-[1/1])'>
                <Link inGrid={true} url="/view/Pets" label="Pets" />
                <Link inGrid={true} url="/view/Contacts" label="Contacts" />
                <Link inGrid={true} url="/view/PetRaces" label="PetRaces" />
                <Link inGrid={true} url="/view/Applications" label="Applications" />
                <Link inGrid={true} url="/view/AppAnswers" label="AppAnswers" />
                <Link inGrid={true} url="/view/AppQuestions" label="AppQuestions" />
            </div>

            <br></br>

            <div className='w-full flex justify-center' onClick={reset}>
                <button className='w-full text-[15cqh] rounded-lg p-4 font-sans border-2 border-solid border:black hover:border-white shadow-md text-center text-2xl m-0 p-0 hover:cursor-pointer'>reset</button>
            </div>
        </>
    )
}

export default Home;