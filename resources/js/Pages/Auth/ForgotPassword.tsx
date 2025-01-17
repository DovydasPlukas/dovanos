import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Pamirštas slaptažodis" />

            <div className="pb-4 pt-2">
                <Link
                    href={route('login')}
                    className="inline-flex text-sm text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Link>
            </div>

            <div className="mb-4 text-sm text-gray-600">
                Pamiršote slaptažodį? Jokių problemų. Tiesiog įveskite savo el. pašto
                adresą ir mes išsiųsime jums slaptažodžio atkūrimo nuorodą, kuri leis
                jums pasirinkti naują slaptažodį.
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <Input
                    id="email"
                    type="email"
                    placeholder="El. pašto adresas"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    className="mt-1"
                />

                <InputError message={errors.email} className="mt-2" />

                <div className="mt-4 flex items-center justify-end">
                    <Button disabled={processing}>
                        Siųsti slaptažodžio atkūrimo nuorodą
                    </Button>
                </div>
            </form>
        </GuestLayout>
    );
}
