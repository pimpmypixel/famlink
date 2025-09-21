import { Shield, Scale } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';

export default function AppLogo({ className }: { className?: string }) {
    const { state } = useSidebar();
    const isCollapsed = state === 'collapsed';

    // Extract size classes from className to apply them properly
    const sizeClasses = className?.match(/(h-\d+|w-\d+|size-\d+)/g)?.join(' ') || 'size-8';
    const otherClasses = className?.replace(/(h-\d+|w-\d+|size-\d+)/g, '').trim();

    return (
        <>
            <div className={`flex aspect-square items-center justify-center rounded-md bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-lg ${sizeClasses} ${otherClasses || 'p-2'}`}>
                <div className="relative">
                    <Shield className="size-full" />
                    <Scale className="size-1/3 absolute -bottom-1 -right-1 text-blue-200" />
                </div>
            </div>
            {!isCollapsed && (
                <div className="ml-2 grid flex-1 text-left text-sm">
                    <span className="mb-0.5 truncate leading-tight font-bold text-slate-800">Familie Link</span>
                    <span className="text-xs text-blue-600 font-semibold tracking-wide">Din stemme, din styrke</span>
                </div>
            )}
        </>
    );
}
