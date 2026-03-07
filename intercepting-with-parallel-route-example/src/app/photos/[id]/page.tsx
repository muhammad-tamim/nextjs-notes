import Image from "next/image";

export default async function PhotoPage({ params }: { params: { id: string } }) {
    const { id } = await params;

    return (
        <div className="flex flex-col items-center m-10">
            <h1 className="text-3xl font-bold"> Full Page Photo {id}</h1>

            <Image src={`https://picsum.photos/id/${id}/900/500`} alt={`photo-${id}`} width={900} height={500} />

            <p>This page renders on refresh.</p>
        </div>
    );
}