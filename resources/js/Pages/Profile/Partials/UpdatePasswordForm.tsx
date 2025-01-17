import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import InputError from '@/Components/InputError';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';

export default function UpdatePasswordForm({
    className = '',
}: {
    className?: string;
}) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Atnaujinti slaptažodį</CardTitle>
                <CardDescription>
                    Įsitikinkite, kad jūsų paskyra naudoja ilgą, atsitiktinį slaptažodį, kad būtų saugi.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={updatePassword} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="current_password">Dabartinis slaptažodis</Label>
                        <Input
                            id="current_password"
                            ref={currentPasswordInput}
                            value={data.current_password}
                            onChange={(e) => setData('current_password', e.target.value)}
                            type="password"
                        />
                        <InputError message={errors.current_password} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Naujas slaptažodis</Label>
                        <Input
                            id="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            type="password"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password_confirmation">Patvirtinti slaptažodį</Label>
                        <Input
                            id="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            type="password"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

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
