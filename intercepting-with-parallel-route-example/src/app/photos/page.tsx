import Image from "next/image";
import Link from "next/link";

const photos = [10, 20, 30, 40, 50, 60];

export default function PhotosPage() {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Photo Gallery</h1>

            <div className="grid grid-cols-3 gap-6">

                {photos.map((id) => (
                    <Link key={id} href={`/photos/${id}`} className="border p-5 m-5">
                        <Image src={`https://picsum.photos/id/${id}/400/300`} alt={`photo-${id}`} width={400} height={300} />

                        <h2 className="card-title">Photo {id}</h2>
                    </Link>
                ))}

            </div>
        </div>
    );
}