import { ReactNode } from 'react';
import { Toaster } from 'sonner';

const Providers = ( { children } : { children: ReactNode } ) => {
  return (
    <>
      <Toaster
        richColors
        closeButton
        theme='dark'
        className='toaster'
      />
      
      {children}
    </>
  )
}

export default Providers;