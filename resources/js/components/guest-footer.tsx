import { __ } from '@/lib/translations';

export default function GuestFooter() {
    return (
        <footer className="bg-slate-900 text-white">
            <div className="max-w-7xl mx-auto px-6 py-16">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Contact Information */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-white">{__('welcome.footer.contact.title')}</h3>
                        <div className="space-y-3 text-slate-300">
                            <div>
                                <p className="font-medium">{__('welcome.footer.contact.family_link_support')}</p>
                                <p>{__('welcome.footer.contact.phone')}</p>
                                <p>{__('welcome.footer.contact.hours')}</p>
                            </div>
                            <div>
                                <p className="font-medium">{__('welcome.footer.contact.emergency_help')}</p>
                                <p>{__('welcome.footer.contact.emergency_phone')}</p>
                                <p>{__('welcome.footer.contact.emergency_hours')}</p>
                            </div>
                            <div>
                                <p className="font-medium">{__('welcome.footer.contact.email')}</p>
                                <p>{__('welcome.footer.contact.email_address')}</p>
                            </div>
                        </div>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-white">{__('welcome.footer.services.title')}</h3>
                        <ul className="space-y-2 text-slate-300">
                            <li><a href="#" className="hover:text-white transition-colors">{__('welcome.footer.services.family_counseling')}</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">{__('welcome.footer.services.conflict_management')}</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">{__('welcome.footer.services.parental_authority')}</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">{__('welcome.footer.services.child_protection')}</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">{__('welcome.footer.services.legal_help')}</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">{__('welcome.footer.services.psychological_support')}</a></li>
                        </ul>
                    </div>

                    {/* Information */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-white">{__('welcome.footer.information.title')}</h3>
                        <ul className="space-y-2 text-slate-300">
                            <li><a href="#" className="hover:text-white transition-colors">{__('welcome.footer.information.about_family_link')}</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">{__('welcome.footer.information.news_press')}</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">{__('welcome.footer.information.statistics_reports')}</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">{__('welcome.footer.information.legislation')}</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">{__('welcome.footer.information.faq')}</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">{__('welcome.footer.information.help_guides')}</a></li>
                        </ul>
                    </div>

                    {/* Emergency & Legal */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-white">{__('welcome.footer.emergency.title')}</h3>
                        <ul className="space-y-2 text-slate-300">
                            <li><a href="#" className="hover:text-white transition-colors">{__('welcome.footer.emergency.child_exposure')}</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">{__('welcome.footer.emergency.domestic_violence')}</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">{__('welcome.footer.emergency.suicidal_thoughts')}</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">{__('welcome.footer.emergency.acute_crisis_help')}</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">{__('welcome.footer.emergency.police_report')}</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">{__('welcome.footer.emergency.legal_assistance')}</a></li>
                        </ul>
                    </div>
                </div>

                {/* Secondary Footer Links */}
                <div className="border-t border-slate-700 pt-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        {/* Legal Information */}
                        <div>
                            <h4 className="text-md font-semibold mb-3 text-white">{__('welcome.footer.legal.title')}</h4>
                            <ul className="space-y-1 text-sm text-slate-400">
                                <li><a href="#" className="hover:text-slate-300 transition-colors">{__('welcome.footer.legal.privacy_policy')}</a></li>
                                <li><a href="#" className="hover:text-slate-300 transition-colors">{__('welcome.footer.legal.cookie_policy')}</a></li>
                                <li><a href="#" className="hover:text-slate-300 transition-colors">{__('welcome.footer.legal.terms_of_service')}</a></li>
                                <li><a href="#" className="hover:text-slate-300 transition-colors">{__('welcome.footer.legal.accessibility_statement')}</a></li>
                                <li><a href="#" className="hover:text-slate-300 transition-colors">{__('welcome.footer.legal.data_protection')}</a></li>
                            </ul>
                        </div>

                        {/* Social Media & Follow */}
                        <div>
                            <h4 className="text-md font-semibold mb-3 text-white">{__('welcome.footer.social.title')}</h4>
                            <div className="flex space-x-4">
                                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                                    <span className="sr-only">{__('welcome.footer.social.facebook')}</span>
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                    </svg>
                                </a>
                                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                                    <span className="sr-only">{__('welcome.footer.social.twitter')}</span>
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                    </svg>
                                </a>
                                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                                    <span className="sr-only">{__('welcome.footer.social.linkedin')}</span>
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                    </svg>
                                </a>
                                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                                    <span className="sr-only">{__('welcome.footer.social.youtube')}</span>
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Newsletter Signup */}
                        <div>
                            <h4 className="text-md font-semibold mb-3 text-white">{__('welcome.footer.newsletter.title')}</h4>
                            <p className="text-sm text-slate-400 mb-3">
                                {__('welcome.footer.newsletter.description')}
                            </p>
                            <div className="flex">
                                <input
                                    type="email"
                                    placeholder={__('welcome.footer.newsletter.email_placeholder')}
                                    className="flex-1 px-3 py-2 text-sm bg-slate-800 border border-slate-600 rounded-l-md text-white placeholder-slate-400 focus:outline-none focus:border-slate-500"
                                />
                                <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-r-md hover:bg-blue-700 transition-colors">
                                    {__('welcome.footer.newsletter.subscribe')}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Footer */}
                    <div className="border-t border-slate-700 pt-6">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="text-sm text-slate-400 mb-4 md:mb-0">
                                <p>{__('welcome.footer.bottom.copyright')}</p>
                                <p>{__('welcome.footer.bottom.governed_by')}</p>
                            </div>
                            <div className="flex space-x-6 text-sm">
                                <a href="#" className="text-slate-400 hover:text-white transition-colors">{__('welcome.footer.bottom.sitemap')}</a>
                                <a href="#" className="text-slate-400 hover:text-white transition-colors">{__('welcome.footer.bottom.rss')}</a>
                                <a href="#" className="text-slate-400 hover:text-white transition-colors">{__('welcome.footer.bottom.api')}</a>
                                <a href="#" className="text-slate-400 hover:text-white transition-colors">{__('welcome.footer.bottom.developers')}</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
