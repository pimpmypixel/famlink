import { Shield, Scale } from 'lucide-react';

export default function AppLogo({ className }: { className?: string }) {
    return (
        <>
            <div className={`flex aspect-square size-8 p-2 items-center justify-center rounded-md bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-lg ${className}`}>
                <div className="relative">
                    <Shield className={`size-5 ${className}`} />
                    <Scale className={`size-3 absolute -bottom-1 -right-1 text-blue-200 ${className}`} />
                </div>
            </div>
            <div className="ml-2 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-bold text-slate-800">Familie Link</span>
                <span className="text-xs text-blue-600 font-semibold tracking-wide">Din stemme, din styrke</span>
            </div>
        </>
    );
}