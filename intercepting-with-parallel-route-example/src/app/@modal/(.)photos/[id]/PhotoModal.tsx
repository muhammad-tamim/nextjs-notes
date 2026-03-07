"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function PhotoModal({ id }: { id: string }) {

    const router = useRouter();

    return (
        <div className="modal modal-open">

            <div className="modal-box max-w-3xl space-y-4">

                <h3 className="font-bold text-lg">Photo {id}</h3>

                <Image src={`https://picsum.photos/id/${id}/900/500`} alt={`photo-${id}`} width={900} height={500} />

                <div className="modal-action">
                    <button className="btn" onClick={() => router.back()}>Close</button>
                </div>

            </div>

        </div>
    );
}