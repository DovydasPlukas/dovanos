import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import InputError from '@/Components/InputError';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

export default function DeleteUserForm() {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const { data, setData, delete: destroy, processing, reset, errors } = useForm({
        password: '',
    });

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();
        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => setShowDeleteDialog(false),
            onFinish: () => reset(),
        });
    };

    return (
        <Card className="border-destructive">
            <CardHeader>
                <CardTitle>Ištrinti paskyrą</CardTitle>
                <CardDescription>
                    Kai jūsų paskyra bus ištrinta, visi jos ištekliai ir duomenys bus negrįžtamai ištrinti.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button
                    variant="destructive"
                    onClick={() => setShowDeleteDialog(true)}
                >
                    Ištrinti paskyrą
                </Button>

                <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Ar tikrai norite ištrinti savo paskyrą?</DialogTitle>
                            <DialogDescription>
                                Įveskite savo slaptažodį, kad patvirtintumėte.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={deleteUser}>
                            <div className="space-y-2">
                                <Label htmlFor="password">Slaptažodis</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                <InputError message={errors.password} />
                            </div>

                            <DialogFooter className="mt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowDeleteDialog(false)}
                                >
                                    Atšaukti
                                </Button>
                                <Button
                                    type="submit"
                                    variant="destructive"
                                    disabled={processing}
                                >
                                    Ištrinti paskyrą
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}
