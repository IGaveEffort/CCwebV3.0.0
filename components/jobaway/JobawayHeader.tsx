'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export type NavItem = {
    label: string;
    href: string;
    children?: NavItem[];
};

function NavList({ items, depth = 0 }: { items: NavItem[]; depth?: number }) {
    return (
        <ul className={depth === 0 ? 'navigation clearfix' : ''}>
            {items.map((item) => {
                const hasChildren = !!(item.children && item.children.length);
                return (
                    <li key={`${item.href}-${item.label}`} className={hasChildren ? 'dropdown' : undefined}>
                        <Link href={item.href}>{item.label}</Link>
                        {hasChildren ? <NavList items={item.children!} depth={depth + 1} /> : null}
                    </li>
                );
            })}
        </ul>
    );
}

export default function JobawayHeader({
    nav,
    logoHref = '/',
    logoSrc = '/jobaway/assets/images/logo.png',
    logoAlt = 'Logo',
    showTop = false,
    phoneLabel = 'Call:',
    phone = '',
    emailLabel = 'Email:',
    email = '',
    primaryCtaHref = '#',
    primaryCtaLabel = 'Get Started',
    secondaryCtaHref = '#',
    secondaryCtaLabel = 'Sign In',
}: {
    nav: NavItem[];
    logoHref?: string;
    logoSrc?: string;
    logoAlt?: string;
    showTop?: boolean;
    phoneLabel?: string;
    phone?: string;
    emailLabel?: string;
    email?: string;
    primaryCtaHref?: string;
    primaryCtaLabel?: string;
    secondaryCtaHref?: string;
    secondaryCtaLabel?: string;
}) {
    useEffect(() => {
        // Replicates the theme's script.js header/mobile behavior without jQuery.

        const header = document.querySelector('.main-header');
        const scrollTop = document.querySelector('.scroll-top');

        const onScroll = () => {
            const windowpos = window.scrollY;
            if (header) {
                if (windowpos >= 150) header.classList.add('fixed-header');
                else header.classList.remove('fixed-header');
            }
            if (scrollTop) {
                if (windowpos >= 150) scrollTop.classList.add('open');
                else scrollTop.classList.remove('open');
            }
        };

        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });

        // Add dropdown buttons for submenu items (theme appends these dynamically)
        const dropdownLis = Array.from(document.querySelectorAll('.main-header .navigation li.dropdown'));
        for (const li of dropdownLis) {
            const existing = li.querySelector(':scope > .dropdown-btn');
            const submenu = li.querySelector(':scope > ul');
            if (!existing && submenu) {
                const btn = document.createElement('div');
                btn.className = 'dropdown-btn';
                btn.innerHTML = '<span class="fas fa-angle-down"></span>';
                li.appendChild(btn);
            }
        }

        // Clone desktop menu into mobile menu and sticky header
        const desktopMenu = document.querySelector('.main-header .menu-area .main-menu');
        const mobileOuter = document.querySelector('.mobile-menu .menu-box .menu-outer');
        const stickyMenu = document.querySelector('.sticky-header .main-menu');

        if (desktopMenu && mobileOuter && mobileOuter.childElementCount === 0) {
            mobileOuter.appendChild(desktopMenu.cloneNode(true));
        }
        if (desktopMenu && stickyMenu && stickyMenu.childElementCount === 0) {
            stickyMenu.appendChild(desktopMenu.cloneNode(true));
        }

        // Mobile dropdown toggle
        const mobileDropdownBtns = Array.from(document.querySelectorAll('.mobile-menu li.dropdown .dropdown-btn'));
        for (const btn of mobileDropdownBtns) {
            btn.addEventListener('click', () => {
                btn.classList.toggle('open');
                const prev = btn.previousElementSibling;
                if (prev && prev.tagName.toLowerCase() === 'ul') {
                    const el = prev as HTMLElement;
                    el.style.display = el.style.display === 'block' ? 'none' : 'block';
                }
                const mega = (btn.parentElement?.querySelector(':scope > .megamenu') as HTMLElement | null);
                if (mega) mega.style.display = mega.style.display === 'block' ? 'none' : 'block';
            });
        }

        const body = document.body;
        const openMobile = () => body.classList.add('mobile-menu-visible');
        const closeMobile = () => body.classList.remove('mobile-menu-visible');

        const toggler = document.querySelector('.mobile-nav-toggler');
        const backdrop = document.querySelector('.mobile-menu .menu-backdrop');
        const closeBtn = document.querySelector('.mobile-menu .close-btn');

        toggler?.addEventListener('click', openMobile);
        backdrop?.addEventListener('click', closeMobile);
        closeBtn?.addEventListener('click', closeMobile);

        // Search popup toggles
        const searchTogglers = Array.from(document.querySelectorAll('.search-toggler'));
        const searchPopup = document.getElementById('search-popup');
        const closeSearch = document.querySelector('.close-search');
        const overlayLayer = document.querySelector('#search-popup .overlay-layer');

        const openSearch = () => searchPopup?.classList.add('popup-visible');
        const closeSearchFn = () => searchPopup?.classList.remove('popup-visible');

        for (const el of searchTogglers) el.addEventListener('click', openSearch);
        closeSearch?.addEventListener('click', closeSearchFn);
        overlayLayer?.addEventListener('click', closeSearchFn);

        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, []);

    return (
        <>
            {/* Search Popup */}
            <div id="search-popup" className="search-popup">
                <div className="popup-inner">
                    <div className="upper-box">
                        <figure className="logo-box">
                            <Link href={logoHref}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={logoSrc} alt={logoAlt} />
                            </Link>
                        </figure>
                        <div className="close-search">
                            <span className="icon-27" />
                        </div>
                    </div>
                    <div className="overlay-layer" />
                    <div className="auto-container">
                        <form method="get" action="/search">
                            <div className="form-group">
                                <input type="search" name="q" placeholder="Search here..." required />
                                <button type="submit">
                                    <i className="icon-1" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <header className="main-header header-style-three">
                {showTop ? (
                    <div className="header-top">
                        <div className="auto-container">
                            <div className="top-inner">
                                <ul className="info">
                                    {phone ? (
                                        <li>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src="/jobaway/assets/images/icons/icon-6.png" alt="" />
                                            {phoneLabel} <a href={`tel:${phone}`}>{phone}</a>
                                        </li>
                                    ) : null}
                                    {email ? (
                                        <li>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src="/jobaway/assets/images/icons/icon-7.png" alt="" />
                                            {emailLabel} <a href={`mailto:${email}`}>{email}</a>
                                        </li>
                                    ) : null}
                                </ul>
                            </div>
                        </div>
                    </div>
                ) : null}

                <div className="header-lower">
                    <div className="auto-container">
                        <div className="outer-box">
                            <figure className="logo-box">
                                <Link href={logoHref}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={logoSrc} alt={logoAlt} />
                                </Link>
                            </figure>

                            <div className="menu-area">
                                <div className="mobile-nav-toggler">
                                    <i className="icon-bar" />
                                    <i className="icon-bar" />
                                    <i className="icon-bar" />
                                </div>

                                <nav className="main-menu navbar-expand-md navbar-light clearfix">
                                    <div className="collapse navbar-collapse show clearfix" id="navbarSupportedContent">
                                        <NavList items={nav} />
                                    </div>
                                </nav>
                            </div>

                            <div className="menu-right-content">
                                <div className="search-btn mr_20">
                                    <button className="search-toggler" aria-label="Open search">
                                        <i className="icon-1" />
                                    </button>
                                </div>
                                <div className="link-box mr_20">
                                    <Link href={secondaryCtaHref}>{secondaryCtaLabel}</Link>
                                </div>
                                <div className="btn-box">
                                    <Link href={primaryCtaHref} className="theme-btn btn-one">
                                        {primaryCtaLabel}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="sticky-header">
                    <div className="outer-container">
                        <div className="outer-box">
                            <figure className="logo-box">
                                <Link href={logoHref}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={logoSrc} alt={logoAlt} />
                                </Link>
                            </figure>
                            <div className="menu-area">
                                <nav className="main-menu clearfix">{/* Menu injected via JS clone */}</nav>
                            </div>
                            <div className="menu-right-content">
                                <div className="search-btn mr_20">
                                    <button className="search-toggler" aria-label="Open search">
                                        <i className="icon-1" />
                                    </button>
                                </div>
                                <div className="link-box mr_20">
                                    <Link href={secondaryCtaHref}>{secondaryCtaLabel}</Link>
                                </div>
                                <div className="btn-box">
                                    <Link href={primaryCtaHref} className="theme-btn btn-one">
                                        {primaryCtaLabel}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            <div className="mobile-menu">
                <div className="menu-backdrop" />
                <div className="close-btn">
                    <i className="fas fa-times" />
                </div>
                <nav className="menu-box">
                    <div className="nav-logo">
                        <Link href={logoHref}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/jobaway/assets/images/logo-2.png" alt={logoAlt} />
                        </Link>
                    </div>
                    <div className="menu-outer">{/* Menu injected via JS clone */}</div>
                </nav>
            </div>
        </>
    );
}
