import Layout from '@/Layouts/Layout';
import { Head } from '@inertiajs/react';
import { PackageOpen } from 'lucide-react';

export default function ErrorPage() {
    return (
        <Layout>
            <Head title="404" />
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-center p-6 bg-white shadow-lg rounded-lg max-w-lg w-full -mt-32">
                    <div className="mb-4">
                        <PackageOpen className="mx-auto w-20 h-20" />
                    </div>
                    <h1 className="text-6xl">Puslapio nėra</h1>
                    <p className="mt-4 text-xl text-gray-700">Deja, toks puslapis neegzistuoja.</p>
                </div>
            </div>
        </Layout>
    );
}
