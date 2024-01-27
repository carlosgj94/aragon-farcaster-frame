import Head from "next/head";
import { Metadata, ResolvingMetadata } from "next";


type Props = {
    params: { id: string }
    searchParams: { [key: string]: string | string[] | undefined }
}
export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const id = params.id

    const fcMetadata: Record<string, string> = {
        "fc:frame": "vNext",
        "fc:frame:image": `${process.env['HOST']}/api/image?id=${id}`,

    };

    return {
        title: 'This is the proposal title',
        openGraph: {
            title: 'This is the proposal title',
            images: [`/ api / image ? id = ${id} `],
        },
        other: {
            ...fcMetadata,
        },
        metadataBase: new URL(process.env['HOST'] || '')
    }
}

export default async function Page({ params }: { params: { id: string } }) {
    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen py-2">
                <main className="flex flex-col items-center justify-center flex-1 px-4 sm:px-20 text-center">
                    <h1>Hello world</h1>
                </main>
            </div>
        </>
    );
}
