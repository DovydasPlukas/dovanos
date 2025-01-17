import { Button } from "@/Components/ui/button";
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="El. pašto patvirtinimas" />

            <div className="mb-4 text-sm text-gray-600">
                Ačiū už registraciją! Prieš pradedant, ar galėtumėte patvirtinti
                savo el. pašto adresą paspausdami nuorodą, kurią ką tik išsiuntėme
                jums? Jei negavote el. laiško, mielai išsiųsime jums kitą.
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    Nauja patvirtinimo nuoroda buvo išsiųsta el. pašto adresu,
                    kurį pateikėte registracijos metu.
                </div>
            )}

            <form onSubmit={submit}>
                <div className="mt-4 flex items-center justify-between gap-4">
                    <Button disabled={processing}>
                        Siųsti patvirtinimo el. laišką dar kartą
                    </Button>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="text-sm text-gray-600 hover:text-gray-900"
                    >
                        Atsijungti
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
