type ErrorProps = {
    message: string
}

export default function Error({ message }: ErrorProps) {
    return (
        <>
            <div className="h-full flex items-center justify-center">
                <div className="text-neutral-400">
                    {message}
                </div>
            </div>
        </>
        
    )
}