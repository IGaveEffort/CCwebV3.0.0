import type { ReactNode } from 'react';

export default function JobawayFooter({
    copyright = '© Jobaway. All rights reserved.',
    socialTitle = 'Follow us:',
    social = (
        <>
            <li><a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a></li>
            <li><a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a></li>
            <li><a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a></li>
        </>
    ),
    widgets,
    showSubscribe = false,
    subscribeTitle = 'Subscribe to our newsletter',
    subscribeForm,
}: {
    copyright?: ReactNode;
    socialTitle?: ReactNode;
    social?: ReactNode;
    widgets?: ReactNode;
    showSubscribe?: boolean;
    subscribeTitle?: ReactNode;
    subscribeForm?: ReactNode;
}) {
    return (
        <>
            {showSubscribe ? (
                <section className="subscribe-style-two">
                    <div className="bg-color"></div>
                    <div className="auto-container">
                        <div className="inner-container">
                            <div className="text-box">
                                <h2>{subscribeTitle}</h2>
                            </div>
                            <div className="form-inner">{subscribeForm}</div>
                        </div>
                    </div>
                </section>
            ) : null}

            <footer className="main-footer home-2 has-monster__widget">
                {widgets ? (
                    <div className="widget-section p_relative pt_80 pb_100">
                        <div className="auto-container">
                            <div className="footer-sytle-one">{widgets}</div>
                        </div>
                    </div>
                ) : null}

                <div className="footer-bottom">
                    <div className="auto-container">
                        <div className="bottom-inner">
                            <div className="copyright">
                                <p>{copyright}</p>
                            </div>
                            <ul className="social-links">
                                <li>
                                    <h5>{socialTitle}</h5>
                                </li>
                                {social}
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
