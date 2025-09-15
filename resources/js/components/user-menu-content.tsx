import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { logout } from '@/routes';
import { edit } from '@/routes/profile';
import { type User } from '@/types';
import { Link, router } from '@inertiajs/react';
import { LogOut, Settings, MoonIcon, Lightbulb } from 'lucide-react';
import { useAppearance } from '@/hooks/use-appearance';

interface UserMenuContentProps {
    user: User;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
    const cleanup = useMobileNavigation();
    const { appearance, updateAppearance } = useAppearance();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <div className="flex items-center gap-2 px-2 py-2">
                    <MoonIcon size={20} className='text-neutral-700 dark:text-neutral-200' />
                    <span className="text-sm text-neutral-800 dark:text-neutral-200 mr-16 ml-2">Theme</span>
                    <button
                        type="button"
                        className="shrink-0 relative inline-flex h-6 w-11 items-center rounded-full bg-neutral-200 dark:bg-neutral-700 transition-colors"
                        aria-pressed={appearance === 'dark'}
                        onClick={() => updateAppearance(appearance === 'dark' ? 'light' : 'dark')}
                        data-test="theme-toggle"
                    >
                        <span
                            className={
                                'inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ' +
                                (appearance === 'dark' ? 'translate-x-5' : 'translate-x-1')
                            }
                        >
                            {/* {appearance === 'dark' ? <MoonIcon /> : <Lightbulb />} */}
                        </span>
                    </button>
                </div>
            </DropdownMenuGroup>
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <Link className="block w-full" href={edit()} as="button" prefetch onClick={cleanup}>
                        <Settings className="mr-2" />
                        Settings
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link className="block w-full" href={logout()} as="button" onClick={handleLogout} data-test="logout-button">
                    <LogOut className="mr-2" />
                    Log out
                </Link>
            </DropdownMenuItem>
        </>
    );
}
