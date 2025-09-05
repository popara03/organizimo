import Sidebar from "@/components/custom/sidebar";
import { Head } from "@inertiajs/react";

const Admin = () => {
  return (
    <div className="flex-1 px-4 ps-12 flex flex-col">
      <Head title="Admin Panel" />

      <Sidebar/>
      
      <h1 className='font-jersey !text-2xl'>Admin Panel</h1>

      <div className="flex-1 flex justify-center items-center">
        <p className="text-primary/50 text-center">Select an option from the sidebar.</p>
      </div>
    </div>
  )
}

export default Admin