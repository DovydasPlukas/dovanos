import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import InputError from '@/Components/InputError';
import { Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const user = usePage().props.auth.user;
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profilio informacija</CardTitle>
                <CardDescription>
                    Atnaujinkite savo paskyros informaciją ir el. pašto adresą.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Vardas</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
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
                            required
                        />
                        <InputError message={errors.email} />
                    </div>

                    {mustVerifyEmail && user.email_verified_at === null && (
                        <div className="text-sm text-amber-600">
                            Jūsų el. paštas nėra patvirtintas.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="underline text-primary hover:text-primary/90 ml-2"
                            >
                                Siųsti patvirtinimo laišką dar kartą.
                            </Link>
                        </div>
                    )}

                    <div className="flex justify-end">
                        <Button disabled={processing}>
                            Išsaugoti
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
