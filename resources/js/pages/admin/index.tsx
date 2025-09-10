import { Head } from "@inertiajs/react";
import AdminLayout from "@/layouts/admin/adminLayout";

const Admin = () => {
  return (
    <div className="flex-1 flex flex-col">
      <Head title="Admin Panel" />

      <h1 className='font-jersey !text-2xl'>Admin Panel</h1>

      <div className="flex-1 flex justify-center items-center">
        <p className="text-primary/50 text-center">Select an option from the sidebar.</p>
      </div>
    </div>
  )
}

Admin.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;

export default Admin