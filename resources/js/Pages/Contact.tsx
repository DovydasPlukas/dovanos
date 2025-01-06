import Footer from '@/Components/MyComponents/Footer';
import Navbar from '@/Components/MyComponents/Navbar';
import { Button } from '@/Components/ui/button';
import Layout from '@/Layouts/Layout';
import { Head } from '@inertiajs/react';

export default function EditPage() {
    return (
        <>
            <Layout>
                <Head title="Dovanų idėjų platforma" />
                <div className="flex flex-col min-h-screen">
                    {/* Main content */}
                    <div className="flex-grow container mx-auto px-4 pb-32 flex items-center justify-center">
                        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-3xl">
                            {/* Contact Info Section */}
                            <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Kontaktai</h2>
                            <p className="text-gray-700 mb-4">
                                Reklama portale yra efektyvi priemonė verslams pasiekti auditoriją ir pasiekti pardavimų tikslus. Tinkamai parinkta reklama gali:
                            </p>
                            <ul className="list-disc pl-6 mb-4">
                                <li><strong>Padidinti pardavimus</strong></li>
                                <li><strong>Didinti savo prekės ženklo žinomumą</strong></li>
                                <li><strong>Pagerinti savo parduotuvės pozicijas paieškų sistemose</strong></li>
                            </ul>
                            <p className="text-gray-700 mb-4">
                                Norėdami sužinoti daugiau arba pradėti reklamuotis, susisiekite su mumis:
                            </p>
                            <p className="text-gray-700 mb-4"><strong>El. paštas:</strong> info@dovanu-idejos.lt</p>
                            <p className="text-gray-700 mb-4"><strong>Telefonas:</strong> +370 123 45678</p>

                            <p className="text-gray-700 mb-4">
                                Jeigu turite internetinę parduotuvę ir norite prisijungti prie mūsų platformos, užpildykite žemiau esančią formą arba susisiekite su mumis el. paštu.
                            </p>

                            {/* Store Registration Section */}
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Produkto reklamavimas</h2>
                            <form className="space-y-4">
                                <div>
                                    <label htmlFor="store-url" className="block text-sm font-medium text-gray-700">Internetinės parduotuvės adresas</label>
                                    <input
                                        id="store-url"
                                        type="url"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">El. paštas</label>
                                    <input
                                        id="email"
                                        type="email"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Tel. numeris</label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700">Jūsų Vardas Pavardė</label>
                                    <input
                                        id="contact-name"
                                        type="text"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    />
                                </div>
                                <div className="flex justify-center">
                                    <Button 
                                        type="submit"
                                        className="px-4 py-2 text-white rounded hover:bg-gray-300 hover:text-black w-full">
                                        Registruoti
                                    </Button>
                                </div>
                            </form>
                            <div className='mt-4 flex justify-center text-red-600'><strong>Neveikia</strong></div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
}
