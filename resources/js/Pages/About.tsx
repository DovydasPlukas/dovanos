import Footer from '@/Components/MyComponents/Footer';
import Navbar from '@/Components/MyComponents/Navbar';
import Layout from '@/Layouts/Layout';
import { Head } from '@inertiajs/react';

export default function EditPage() {
    return (
        <>
        <Layout>
            <Head title="Apie mus" />
            <div className="flex flex-col min-h-screen">
                {/* Adjusted spacing to bring the content higher */}
                <div className="flex-grow container mx-auto px-4 pb-32 flex items-center justify-center">
                    <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-3xl">
                        <h1 className="text-2xl font-bold text-gray-800 mb-6">Apie mus</h1>
                        <p className="text-gray-700 mb-4">
                            <strong>Dovanų idėjų platforma</strong> – vieta, kur galite rasti įkvėpimo ieškodami idealių dovanų savo artimiesiems, draugams ar kolegoms. Čia pateikiama daugybė unikalių ir kūrybingų idėjų įvairioms progoms – nuo gimtadienių iki švenčių ar ypatingų asmeninių sukakčių.
                        </p>
                        <p className="text-gray-700 mb-4">
                            Mūsų pagrindinis tikslas – padėti Jums lengviau surasti dovanų idėjas, kurios atitinka Jūsų poreikius, biudžetą ir adresato pomėgius.
                        </p>
                        <p className="text-gray-700 mb-4">
                            <strong>Dovanų idėjų platforma</strong> neprekiauja dovanomis tiesiogiai, tačiau pateikiame informaciją apie įvairias dovanojimo galimybes ir nuorodas į išteklius, kur galite įsigyti norimą dovaną ar paslaugą.
                        </p>
                        <p className="text-gray-700 mb-4">
                            Mes stengiamės užtikrinti, kad informacija apie dovanų idėjas būtų aktuali ir naudinga, tačiau negalime garantuoti, kad viskas bus pateikta tiksliai, nes informacija kartais gali keistis.
                        </p>
                        <p className="text-gray-700">
                            Jeigu turite unikalių dovanų idėjų ar paslaugų, kviečiame jas pasiūlyti ir prisidėti prie mūsų platformos turinio!
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
        </>
    );
}
