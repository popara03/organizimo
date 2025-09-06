import Sidebar from '@/components/custom/sidebar';
import { Head, usePage } from '@inertiajs/react';

export default function Dashboard() {
    const {props} : any = usePage();
    const user = props.user;
    const groups = props.groups;

    return (
    <div className="flex-1 px-4 ps-12 flex flex-col">
        <Head title="Dashboard" />

        <Sidebar data={groups} />

        <h1 className='font-jersey !text-2xl'>Hello{user && `, ${user.name}`}!</h1>
    </div>
    );
}