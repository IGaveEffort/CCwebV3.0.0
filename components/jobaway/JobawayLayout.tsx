import type { ReactNode } from 'react';
import JobawayHeader, { NavItem } from './JobawayHeader';
import JobawayFooter from './JobawayFooter';

export default function JobawayLayout({
    children,
    nav,
}: {
    children: ReactNode;
    nav: NavItem[];
}) {
    return (
        <div className="boxed_wrapper ltr">
            <JobawayHeader nav={nav} />
            {children}
            <JobawayFooter />
        </div>
    );
}
