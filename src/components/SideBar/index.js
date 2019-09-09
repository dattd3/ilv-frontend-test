import React, { Suspense } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

function SideBar(props) {
    return (
        <nav id="sidebar" class="sidebar">
            <div class="sidebar-content ">
                <a class="sidebar-brand" href="index.html">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-box align-middle"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                    <span class="align-middle">AppStack</span>
                </a>

                <ul class="sidebar-nav">
                    <li class="sidebar-header">
                        Main
            </li>
                    <li class="sidebar-item active">
                        <a href="#dashboards" data-toggle="collapse" class="sidebar-link" aria-expanded="true">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-sliders align-middle"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg> <span class="align-middle">Dashboard</span>
                        </a>
                        <ul id="dashboards" class="sidebar-dropdown list-unstyled collapse show" data-parent="#sidebar">
                            <li class="sidebar-item"><a class="sidebar-link" href="dashboard-default.html">Default</a></li>
                            <li class="sidebar-item"><a class="sidebar-link" href="dashboard-analytics.html">Analytics</a></li>
                            <li class="sidebar-item active"><a class="sidebar-link" href="dashboard-e-commerce.html">E-commerce</a></li>
                            <li class="sidebar-item"><a class="sidebar-link" href="dashboard-social.html">Social</a></li>
                            <li class="sidebar-item"><a class="sidebar-link" href="dashboard-crypto.html">Crypto <span class="sidebar-badge badge badge-primary">New</span></a></li>
                        </ul>
                    </li>
                    <li class="sidebar-item">
                        <a href="#pages" data-toggle="collapse" class="sidebar-link collapsed">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-layout align-middle"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg> <span class="align-middle">Pages</span>
                        </a>
                        <ul id="pages" class="sidebar-dropdown list-unstyled collapse " data-parent="#sidebar">
                            <li class="sidebar-item"><a class="sidebar-link" href="pages-profile.html">Profile</a></li>
                            <li class="sidebar-item"><a class="sidebar-link" href="pages-settings.html">Settings</a></li>
                            <li class="sidebar-item"><a class="sidebar-link" href="pages-clients.html">Clients</a></li>
                            <li class="sidebar-item"><a class="sidebar-link" href="pages-projects.html">Projects <span class="sidebar-badge badge badge-primary">New</span></a></li>
                            <li class="sidebar-item"><a class="sidebar-link" href="pages-invoice.html">Invoice</a></li>
                            <li class="sidebar-item"><a class="sidebar-link" href="pages-pricing.html">Pricing</a></li>
                            <li class="sidebar-item"><a class="sidebar-link" href="pages-tasks.html">Tasks <span class="sidebar-badge badge badge-primary">New</span></a></li>
                            <li class="sidebar-item"><a class="sidebar-link" href="pages-blank.html">Blank Page</a></li>
                        </ul>
                    </li>
                    <li class="sidebar-item">
                        <a href="#auth" data-toggle="collapse" class="sidebar-link collapsed">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-users align-middle"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> <span class="align-middle">Auth</span>
                            <span class="sidebar-badge badge badge-secondary">12/24</span>
                        </a>
                        <ul id="auth" class="sidebar-dropdown list-unstyled collapse " data-parent="#sidebar">
                            <li class="sidebar-item"><a class="sidebar-link" href="pages-sign-in.html">Sign In</a></li>
                            <li class="sidebar-item"><a class="sidebar-link" href="pages-sign-up.html">Sign Up</a></li>
                            <li class="sidebar-item"><a class="sidebar-link" href="pages-reset-password.html">Reset Password</a></li>
                            <li class="sidebar-item"><a class="sidebar-link" href="pages-404.html">404 Page</a></li>
                            <li class="sidebar-item"><a class="sidebar-link" href="pages-500.html">500 Page</a></li>
                        </ul>
                    </li>
                    <li class="sidebar-item">
                        <a href="#layouts" data-toggle="collapse" class="sidebar-link collapsed">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-monitor align-middle"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg> <span class="align-middle">Layouts</span>
                        </a>
                        <ul id="layouts" class="sidebar-dropdown list-unstyled collapse " data-parent="#sidebar">
                            <li class="sidebar-item"><a class="sidebar-link" href="layouts-sidebar-sticky.html">Sticky Sidebar</a></li>
                            <li class="sidebar-item"><a class="sidebar-link" href="layouts-sidebar-collapsed.html">Collapsed Sidebar</a></li>
                            <li class="sidebar-item"><a class="sidebar-link" href="layouts-boxed.html">Boxed Layout</a></li>
                            <li class="sidebar-item"><a class="sidebar-link" href="dashboard-analytics.html?theme=classic">Classic Theme</a></li>
                            <li class="sidebar-item"><a class="sidebar-link" href="dashboard-analytics.html?theme=corporate">Corporate Theme <span class="sidebar-badge badge badge-primary">New</span></a></li>
                            <li class="sidebar-item"><a class="sidebar-link" href="dashboard-analytics.html?theme=modern">Modern Theme <span class="sidebar-badge badge badge-primary">New</span></a></li>
                        </ul>
                    </li>
                    <li class="sidebar-item">
                        <a href="#documentation" data-toggle="collapse" class="sidebar-link collapsed">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-book-open align-middle"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg> <span class="align-middle">Documentation</span>
                        </a>
                        <ul id="documentation" class="sidebar-dropdown list-unstyled collapse " data-parent="#sidebar">
                            <li class="sidebar-item"><a class="sidebar-link" href="docs-introduction.html">Introduction</a></li>
                            <li class="sidebar-item"><a class="sidebar-link" href="docs-installation.html">Getting Started</a></li>
                            <li class="sidebar-item"><a class="sidebar-link" href="docs-plugins.html">Plugins</a></li>
                            <li class="sidebar-item"><a class="sidebar-link" href="docs-changelog.html">Changelog</a></li>
                        </ul>
                    </li>

                    <li class="sidebar-header">
                        Components
            </li>
                    <li class="sidebar-item">
                        <a href="#ui" data-toggle="collapse" class="sidebar-link collapsed">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-grid align-middle"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg> <span class="align-middle">UI Elements</span>
                        </a>
                        <ul id="ui" class="sidebar-dropdown list-unstyled collapse " data-parent="#sidebar">
                            <li class="sidebar-item"><a class="sidebar-link" href="ui-alerts.html">Alerts</a></li>
                            <li class="sidebar-item"><a class="sidebar-link" href="ui-buttons.html">Buttons</a></li>
                            <li class="sidebar-item"><a class="sidebar-link" href="ui-cards.html">Cards</a></li>
                            <li class="sidebar-item"><a class="sidebar-link" href="ui-general.html">General</a></li>
                            <li class="sidebar-item"><a class="sidebar-link" href="ui-grid.html">Grid</a></li>
                            <li class="sidebar-item"><a class="sidebar-link" href="ui-modals.html">Modals</a></li>
                            <li class="sidebar-item"><a class="sidebar-link" href="ui-notifications.html">Notifications</a></li>
                            <li class="sidebar-item"><a class="sidebar-link" href="ui-tabs.html">Tabs</a></li>
                            <li class="sidebar-item"><a class="sidebar-link" href="ui-typography.html">Typography</a></li>
                        </ul>
                    </li>
                    <li class="sidebar-item">
                        <a href="#charts" data-toggle="collapse" class="sidebar-link collapsed">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-pie-chart align-middle"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg> <span class="align-middle">Charts</span>
                            <span class="sidebar-badge badge badge-primary">New</span>
                        </a>
                        <ul id="charts" class="sidebar-dropdown list-unstyled collapse " data-parent="#sidebar">
                            <li class="sidebar-item"><a class="sidebar-link" href="charts-chartjs.html">Chart.js</a></li>
                            <li class="sidebar-item"><a class="sidebar-link" href="charts-apexcharts.html">ApexCharts <span class="sidebar-badge badge badge-primary">New</span></a></li>
                        </ul>
                    </li>
                    <li class="sidebar-item">
                        <a href="#forms" data-toggle="collapse" class="sidebar-link collapsed">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check-square align-middle"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg> <span class="align-middle">Forms</span>
                        </a>
                        <ul id="forms" class="sidebar-dropdown list-unstyled collapse " data-parent="#sidebar">
                            <li class="sidebar-item"><a class="sidebar-link" href="forms-layouts.html">Layouts</a></li>
                            <li class="sidebar-item"><a class="sidebar-link" href="forms-basic-elements.html">Basic Elements</a></li>
                            <li class="sidebar-item"><a class="sidebar-link" href="forms-advanced-elements.html">Advanced Elements</a></li>
                            <li class="sidebar-item"><a class="sidebar-link" href="forms-input-groups.html">Input Groups</a></li>
                            <li class="sidebar-item"><a class="sidebar-link" href="forms-editors.html">Editors</a></li>
                            <li class="sidebar-item"><a class="sidebar-link" href="forms-validation.html">Validation</a></li>
                            <li class="sidebar-item"><a class="sidebar-link" href="forms-wizard.html">Wizard</a></li>
                        </ul>
                    </li>
                    <li class="sidebar-item">
                        <a href="#tables" data-toggle="collapse" class="sidebar-link collapsed">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-list align-middle"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3" y2="6"></line><line x1="3" y1="12" x2="3" y2="12"></line><line x1="3" y1="18" x2="3" y2="18"></line></svg> <span class="align-middle">Tables</span>
                        </a>
                        <ul id="tables" class="sidebar-dropdown list-unstyled collapse " data-parent="#sidebar">
                            <li class="sidebar-item"><a class="sidebar-link" href="tables-bootstrap.html">Bootstrap</a></li>
                            <li class="sidebar-item"><a class="sidebar-link" href="tables-datatables.html">DataTables</a></li>
                        </ul>
                    </li>
                    <li class="sidebar-item">
                        <a href="#icons" data-toggle="collapse" class="sidebar-link collapsed">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-heart align-middle"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg> <span class="align-middle">Icons</span>
                            <span class="sidebar-badge badge badge-info">Special</span>
                        </a>
                        <ul id="icons" class="sidebar-dropdown list-unstyled collapse " data-parent="#sidebar">
                            <li class="sidebar-item"><a class="sidebar-link" href="icons-feather.html">Feather</a></li>
                            <li class="sidebar-item"><a class="sidebar-link" href="icons-font-awesome.html">Font Awesome</a></li>
                        </ul>
                    </li>
                    <li class="sidebar-item">
                        <a class="sidebar-link" href="calendar.html">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-calendar align-middle"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> <span class="align-middle">Calendar</span>
                            <span class="sidebar-badge badge badge-primary">New</span>
                        </a>
                    </li>
                    <li class="sidebar-item">
                        <a href="#maps" data-toggle="collapse" class="sidebar-link collapsed">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-map-pin align-middle"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> <span class="align-middle">Maps</span>
                        </a>
                        <ul id="maps" class="sidebar-dropdown list-unstyled collapse " data-parent="#sidebar">
                            <li class="sidebar-item"><a class="sidebar-link" href="maps-google.html">Google Maps</a></li>
                            <li class="sidebar-item"><a class="sidebar-link" href="maps-vector.html">Vector Maps</a></li>
                        </ul>
                    </li>
                    <li class="sidebar-item">
                        <a href="#multi" data-toggle="collapse" class="sidebar-link">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-share-2 align-middle"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg> <span class="align-middle">Multi Level</span>
                        </a>
                        <ul id="multi" class="sidebar-dropdown list-unstyled collapse" data-parent="#sidebar">
                            <li class="sidebar-item">
                                <a href="#multi-2" data-toggle="collapse" class="sidebar-link collapsed">
                                    Two Levels
        </a>
                                <ul id="multi-2" class="sidebar-dropdown list-unstyled collapse">
                                    <li class="sidebar-item">
                                        <a class="sidebar-link" href="#">Item 1</a>
                                        <a class="sidebar-link" href="#">Item 2</a>
                                    </li>
                                </ul>
                            </li>
                            <li class="sidebar-item">
                                <a href="#multi-3" data-toggle="collapse" class="sidebar-link collapsed">
                                    Three Levels
        </a>
                                <ul id="multi-3" class="sidebar-dropdown list-unstyled collapse">
                                    <li class="sidebar-item">
                                        <a href="#multi-3-1" data-toggle="collapse" class="sidebar-link collapsed">
                                            Item 1
            </a>
                                        <ul id="multi-3-1" class="sidebar-dropdown list-unstyled collapse">
                                            <li class="sidebar-item">
                                                <a class="sidebar-link" href="#">Item 1</a>
                                                <a class="sidebar-link" href="#">Item 2</a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li class="sidebar-item">
                                        <a class="sidebar-link" href="#">Item 2</a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                </ul>

                <div class="sidebar-bottom d-none d-lg-block">
                    <div class="media">
                        <img class="rounded-circle mr-3" src="img/avatars/avatar.jpg" alt="Chris Wood" width="40" height="40" />
                        <div class="media-body">
                            <h5 class="mb-1">Chris Wood</h5>
                            <div><i class="fas fa-circle text-success"></i> Online</div>
                        </div>
                    </div>
                </div>

            </div>
        </nav>
    );
}

export default SideBar;
