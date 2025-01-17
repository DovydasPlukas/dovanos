import Layout from '@/Layouts/Layout';
import { Head } from '@inertiajs/react';
import { Separator } from "@/Components/ui/separator";
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({
    mustVerifyEmail,
    status,
}: { mustVerifyEmail: boolean; status?: string }) {
    return (
        <Layout>
            <Head title="Profilis" />

            <div className="space-y-6 p-6 pb-16 container mx-auto">
                <div className="space-y-0.5">
                    <h2 className="text-2xl font-bold tracking-tight">Nustatymai</h2>
                    <p className="text-muted-foreground">
                        Tvarkykite savo paskyros nustatymus ir keiskite slaptažodį.
                    </p>
                </div>
                <Separator />
                
                <div className="grid gap-6">
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                    />
                    <UpdatePasswordForm />
                    <DeleteUserForm />
                </div>
            </div>
        </Layout>
    );
}
