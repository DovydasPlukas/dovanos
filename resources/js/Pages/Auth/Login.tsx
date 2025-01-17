import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Checkbox } from "@/Components/ui/checkbox";
import { Label } from "@/Components/ui/label";
import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Prisijungimas" />

            <div className="space-y-6">
                {status && (
                    <div className="text-sm font-medium text-green-600">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">El. paštas</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Slaptažodis</Label>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="remember"
                            checked={data.remember}
                            onCheckedChange={(checked) => 
                                setData('remember', checked === true)
                            }
                        />
                        <Label htmlFor="remember">Prisiminti mane</Label>
                    </div>

                    <div className="flex items-center justify-end gap-4">
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-sm text-gray-600 hover:text-gray-900"
                            >
                                Pamiršote slaptažodį?
                            </Link>
                        )}

                        <Button disabled={processing}>
                            Prisijungti
                        </Button>
                    </div>
                </form>

                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        Neturite paskyros?{" "}
                        <Link
                            href="/register"
                            className="text-primary hover:underline"
                        >
                            Registruotis
                        </Link>
                    </p>
                </div>
            </div>
        </GuestLayout>
    );
}
