function Link( {url, label, inGrid} ) {

    return <a draggable={false} href={url} className="@container p-3 rounded-lg border-2 border-solid text-center font-mono grid hover:(cursor-pointer) shadow-md">
            <div className={`place-self-center ${inGrid ? 'text-[min(15cqh,15cqw)]' : ''}`}>{label}</div>
        </a>
}

export default Link;