import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Registracija" />

            <form onSubmit={submit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Vardas</Label>
                    <Input
                        id="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        autoComplete="name"
                        required
                    />
                    <InputError message={errors.name} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">El. paštas</Label>
                    <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        autoComplete="username"
                        required
                    />
                    <InputError message={errors.email} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Slaptažodis</Label>
                    <Input
                        id="password"
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        autoComplete="new-password"
                        required
                    />
                    <InputError message={errors.password} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password_confirmation">Patvirtinti slaptažodį</Label>
                    <Input
                        id="password_confirmation"
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        autoComplete="new-password"
                        required
                    />
                    <InputError message={errors.password_confirmation} />
                </div>

                <div className="flex items-center justify-end gap-4">
                    <Link
                        href={route('login')}
                        className="text-sm text-gray-600 hover:text-gray-900"
                    >
                        Jau turite paskyrą?
                    </Link>

                    <Button disabled={processing}>
                        Registruotis
                    </Button>
                </div>
            </form>
        </GuestLayout>
    );
}
