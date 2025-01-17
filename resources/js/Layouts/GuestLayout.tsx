import { Link } from '@inertiajs/react';
import { Gift } from 'lucide-react';
import { PropsWithChildren } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
} from "@/Components/ui/card";

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0">
            <div>
                <Link href="/" className="text-xl font-semibold text-gray-800 flex items-center">
                    <Gift className="h-6 w-6 text-gray-800 mr-2" />
                    <span>Dovanų idėjų platforma</span>
                </Link>
            </div>

            <Card className="mt-6 w-full sm:max-w-md">
                <CardContent className="p-6">
                    {children}
                </CardContent>
            </Card>
        </div>
    );
}
