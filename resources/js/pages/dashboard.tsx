import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const {props} : any = usePage();
    const user = props.user;

    return (
            <div>
                <Head title="Dashboard" />

                <h1>Hello{user && `, ${user.name}`}!</h1>
            </div>
    );
}