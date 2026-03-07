import PhotoModal from "./PhotoModal";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {

    const { id } = await params;

    return <PhotoModal id={id} />;
}