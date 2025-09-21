import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import Footer from '@/components/custom/fixed/footer';

export default function Welcome() {
    return (
        <div className="relative w-full flex-1 flex flex-col justify-between overflow-hidden">
            <div className="px-4 flex flex-col gap-4">
                <h1 className="!text-5xl sm:!text-6xl md:!text-8xl">
                    <b>Share. Connect. Solve.</b>
                    <br />
                    – your company’s knowledge hub
                </h1>

                <p className="max-w-[900px]">
                    Organizimo brings your team closer with a simple platform designed to make communication effortless and effective. Share ideas, track discussions, and solve recurring issues through posts, comments, attachments, and group management - all in one place.
                </p>

                <div className="w-full flex flex-col sm:flex-row gap-4">
                    <Button variant={'default'} className='font-jersey text-secondary' asChild >
                        <Link href="/login">
                            Login
                        </Link>
                    </Button>

                    <Button variant={'outline'} className='font-jersey' asChild >
                        <Link href="/register">
                            Register
                        </Link>
                    </Button>
                </div>
            </div>

            {/* animated line */}
            <div className="w-full py-12 flex-1 flex justify-center items-center">
                <div className="w-full flex scrolling">
                    <div className="min-w-full flex bg-red-300">
                        <div className="min-w-1/5 min-h-8 bg-accent-lime"></div>
                        <div className="min-w-1/5 min-h-8 bg-accent-orange"></div>
                        <div className="min-w-1/5 min-h-8 bg-accent-red"></div>
                        <div className="min-w-1/5 min-h-8 bg-accent-purple"></div>
                        <div className="min-w-1/5 min-h-8 bg-accent-blue"></div>
                    </div>
                    <div className="min-w-full flex bg-red-300">
                        <div className="min-w-1/5 min-h-8 bg-accent-lime "></div>
                        <div className="min-w-1/5 min-h-8 bg-accent-orange"></div>
                        <div className="min-w-1/5 min-h-8 bg-accent-red"></div>
                        <div className="min-w-1/5 min-h-8 bg-accent-purple"></div>
                        <div className="min-w-1/5 min-h-8 bg-accent-blue"></div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}