import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Home</h1>

      <Link href="/photos" className="btn btn-primary">
        Open Photo Gallery
      </Link>
    </div>
  );
}