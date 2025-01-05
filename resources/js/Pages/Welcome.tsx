import Layout from '@/Layouts/Layout';
import { Head, Link } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage().props;

    return (
        <>
            <Layout>
                <Head title="Welcome" />
                <div className="bg-gray-50 text-black/50 dark:bg-black dark:text-white/50">
                    <div className="relative flex min-h-screen flex-col items-center selection:bg-[#FF2D20] selection:text-white">
                        <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl text-center">
                            <div className="flex flex-col items-center space-y-4">
                                <h1 className="text-4xl font-semibold">Index Page</h1>
                            </div>

                            <header className="flex justify-center py-10">
                                <nav className="flex space-x-6">
                                    {auth.user ? (
                                        <Link
                                            href={route('dashboard')}
                                            className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                        >
                                            Dashboard
                                        </Link>
                                    ) : (
                                        <>
                                            <a
                                                href={route('login')}
                                                className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                            >
                                                Log in
                                            </a>
                                            <Link
                                                href={route('register')}
                                                className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                            >
                                                Register
                                            </Link>
                                        </>
                                    )}
                                </nav>
                            </header>
                        </div>
                        <div className="relative flex flex-col items-center justify-center selection:bg-[#FF2D20] selection:text-white">
                            <Link
                                href="/items"
                                className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                            >
                                Go to Items
                            </Link>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
}