import React, { useState } from 'react';
import { LayoutDashboard, Users, BookOpen, Rocket, Monitor, Mail, Phone, MapPin, Check, Zap, Shield, TrendingUp, Clock, Award, Globe, Bus } from 'lucide-react';

const App = () => {
    // Navigation handled by global NavBar component

    const BACKGROUND_IMAGE_URL = 'https://images.pexels.com/photos/1720188/pexels-photo-1720188.jpeg';

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setMobileMenuOpen(false);
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans">
            
            {/* Global NavBar is already rendered by App.jsx; removing local navbar */}

            {/* Hero Section */}
            <section 
                id="home"
                className="relative bg-cover bg-center text-white pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden"
                style={{ backgroundImage: `url('${BACKGROUND_IMAGE_URL}')` }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70 backdrop-blur-sm"></div>

                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>

                <div className="relative max-w-6xl mx-auto px-6 text-center z-10">
                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight mb-6">
                        Transform Your <span className="text-indigo-400 drop-shadow-lg">School</span> Management
                    </h1>
                    <p className="text-xl sm:text-2xl text-slate-100 max-w-3xl mx-auto mb-12 drop-shadow-md">
                        The complete platform for modern education - streamline operations, enhance learning, and empower your institution with cutting-edge technology.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button 
                            onClick={() => scrollToSection('pricing')}
                            className="bg-indigo-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-indigo-700 shadow-2xl transition-all duration-300 transform hover:scale-105"
                        >
                            Get Started
                        </button>
                        <button 
                            onClick={() => scrollToSection('features')}
                            className="border-2 border-white text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-slate-900 transition-all duration-300 transform hover:scale-105"
                        >
                            Explore Features
                        </button>
                    </div>
                </div>
            </section>

            {/* About Us Section */}
            <section id="about" className="py-24 bg-white">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">About School Management Platform</h2>
                        <div className="w-24 h-1 bg-indigo-600 mx-auto mb-6"></div>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            We're on a mission to revolutionize education management through innovative technology solutions that make schools more efficient, teachers more effective, and students more successful.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                        <div>
                            <h3 className="text-3xl font-bold text-slate-800 mb-6">Our Story</h3>
                            <p className="text-gray-600 mb-4 leading-relaxed">
                                Founded in 2020, School Management Platform was born from the vision of educators and technologists who saw the challenges schools face in managing complex operations. We've grown from a small startup to serving over 500 institutions worldwide.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                Our platform has helped millions of students, thousands of teachers, and hundreds of administrators streamline their daily tasks, allowing them to focus on what truly matters - quality education.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-indigo-50 p-6 rounded-xl text-center transform hover:scale-105 transition-transform duration-300">
                                <div className="text-4xl font-bold text-indigo-600 mb-2">500+</div>
                                <div className="text-gray-700 font-medium">Schools</div>
                            </div>
                            <div className="bg-blue-50 p-6 rounded-xl text-center transform hover:scale-105 transition-transform duration-300">
                                <div className="text-4xl font-bold text-blue-600 mb-2">50K+</div>
                                <div className="text-gray-700 font-medium">Teachers</div>
                            </div>
                            <div className="bg-green-50 p-6 rounded-xl text-center transform hover:scale-105 transition-transform duration-300">
                                <div className="text-4xl font-bold text-green-600 mb-2">2M+</div>
                                <div className="text-gray-700 font-medium">Students</div>
                            </div>
                            <div className="bg-purple-50 p-6 rounded-xl text-center transform hover:scale-105 transition-transform duration-300">
                                <div className="text-4xl font-bold text-purple-600 mb-2">98%</div>
                                <div className="text-gray-700 font-medium">Satisfaction</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Rocket className="w-8 h-8 text-indigo-600" />
                            </div>
                            <h4 className="text-xl font-bold text-slate-800 mb-3">Our Mission</h4>
                            <p className="text-gray-600">
                                To empower educational institutions with innovative technology that simplifies management and enhances learning outcomes.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Globe className="w-8 h-8 text-blue-600" />
                            </div>
                            <h4 className="text-xl font-bold text-slate-800 mb-3">Our Vision</h4>
                            <p className="text-gray-600">
                                To become the world's most trusted education management platform, serving schools in every corner of the globe.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Award className="w-8 h-8 text-green-600" />
                            </div>
                            <h4 className="text-xl font-bold text-slate-800 mb-3">Our Values</h4>
                            <p className="text-gray-600">
                                Innovation, integrity, excellence, and a relentless focus on user experience guide everything we do.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">Powerful Features</h2>
                        <div className="w-24 h-1 bg-indigo-600 mx-auto mb-6"></div>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Everything you need to manage your school efficiently, all in one integrated platform
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mb-12">
                        <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                            <div className="w-14 h-14 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                                <LayoutDashboard className="w-7 h-7 text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-3">Admin Dashboard</h3>
                            <p className="text-gray-600 mb-4">
                                Comprehensive control center with real-time analytics, reporting tools, and complete oversight of all school operations.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-start"><Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" />Student enrollment management</li>
                                <li className="flex items-start"><Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" />Staff administration</li>
                                <li className="flex items-start"><Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" />Financial tracking</li>
                            </ul>
                        </div>

                        <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                            <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                <BookOpen className="w-7 h-7 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-3">Teacher Tools</h3>
                            <p className="text-gray-600 mb-4">
                                Intuitive tools for lesson planning, grading, attendance tracking, and student performance monitoring.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-start"><Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" />Digital gradebook</li>
                                <li className="flex items-start"><Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" />Assignment management</li>
                                <li className="flex items-start"><Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" />Progress reports</li>
                            </ul>
                        </div>

                        <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                            <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                <Users className="w-7 h-7 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-3">Student Portal</h3>
                            <p className="text-gray-600 mb-4">
                                Interactive learning environment with access to courses, assignments, grades, and communication tools.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-start"><Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" />Course materials access</li>
                                <li className="flex items-start"><Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" />Assignment submission</li>
                                <li className="flex items-start"><Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" />Grade tracking</li>
                            </ul>
                        </div>

                        <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                            <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                <Clock className="w-7 h-7 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-3">Attendance System</h3>
                            <p className="text-gray-600">
                                Automated attendance tracking with real-time notifications to parents and detailed attendance reports.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                            <div className="w-14 h-14 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                                <TrendingUp className="w-7 h-7 text-orange-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-3">Analytics & Reports</h3>
                            <p className="text-gray-600">
                                Powerful analytics engine providing insights into student performance, attendance trends, and institutional metrics.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                            <div className="w-14 h-14 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                                <Shield className="w-7 h-7 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-3">Security & Privacy</h3>
                            <p className="text-gray-600">
                                Bank-level encryption, role-based access control, and compliance with education data privacy regulations.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing section removed per request */}

            {/* Contact Section */}
            <section id="contact" className="py-24 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">Get In Touch</h2>
                        <div className="w-24 h-1 bg-indigo-600 mx-auto mb-6"></div>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                            <form className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                                    <input 
                                        type="text" 
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                    <input 
                                        type="email" 
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Institution Name</label>
                                    <input 
                                        type="text" 
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
                                        placeholder="ABC School"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                                    <textarea 
                                        rows="4"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200 resize-none"
                                        placeholder="Tell us about your needs..."
                                    ></textarea>
                                </div>
                                <button 
                                    type="submit"
                                    className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors duration-300 transform hover:scale-105"
                                >
                                    Send Message
                                </button>
                            </form>
                        </div>

                        {/* Contact Information */}
                        <div>
                            <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-8 text-white mb-6 shadow-xl">
                                <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                                <div className="space-y-6">
                                    <div className="flex items-start">
                                        <Mail className="w-6 h-6 mr-4 mt-1 flex-shrink-0" />
                                        <div>
                                            <div className="font-semibold mb-1">Email</div>
                                            <div className="text-indigo-100">support@eduportal.com</div>
                                            <div className="text-indigo-100">sales@eduportal.com</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <Phone className="w-6 h-6 mr-4 mt-1 flex-shrink-0" />
                                        <div>
                                            <div className="font-semibold mb-1">Phone</div>
                                            <div className="text-indigo-100">+1 (555) 123-4567</div>
                                            <div className="text-indigo-100">+1 (555) 987-6543</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <MapPin className="w-6 h-6 mr-4 mt-1 flex-shrink-0" />
                                        <div>
                                            <div className="font-semibold mb-1">Office</div>
                                            <div className="text-indigo-100">123 Education Street</div>
                                            <div className="text-indigo-100">Learning City, LC 12345</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                                <h3 className="text-xl font-bold text-slate-800 mb-4">Office Hours</h3>
                                <div className="space-y-3 text-gray-600">
                                    <div className="flex justify-between">
                                        <span>Monday - Friday</span>
                                        <span className="font-semibold">9:00 AM - 6:00 PM</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Saturday</span>
                                        <span className="font-semibold">10:00 AM - 4:00 PM</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Sunday</span>
                                        <span className="font-semibold">Closed</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Support Section */}
            <section id="support" className="py-24 bg-white">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">Support Center</h2>
                        <div className="w-24 h-1 bg-indigo-600 mx-auto mb-6"></div>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Find answers to common questions and get the help you need
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mb-16">
                        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-8 border border-indigo-100">
                            <Zap className="w-12 h-12 text-indigo-600 mb-4" />
                            <h3 className="text-2xl font-bold text-slate-800 mb-3">Quick Start Guide</h3>
                            <p className="text-gray-600 mb-4">
                                New to EduPortal? Our comprehensive quick start guide will help you get up and running in minutes.
                            </p>
                            <button className="text-indigo-600 font-semibold hover:text-indigo-700 flex items-center">
                                View Guide <span className="ml-2">→</span>
                            </button>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100">
                            <BookOpen className="w-12 h-12 text-purple-600 mb-4" />
                            <h3 className="text-2xl font-bold text-slate-800 mb-3">Documentation</h3>
                            <p className="text-gray-600 mb-4">
                                Detailed documentation covering every feature, with step-by-step tutorials and best practices.
                            </p>
                            <button className="text-purple-600 font-semibold hover:text-purple-700 flex items-center">
                                Browse Docs <span className="ml-2">→</span>
                            </button>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-8 mb-12">
                        <h3 className="text-2xl font-bold text-slate-800 mb-8 text-center">Frequently Asked Questions</h3>
                        <div className="space-y-6 max-w-4xl mx-auto">
                            <div className="bg-white rounded-xl p-6 shadow-md">
                                <h4 className="text-lg font-bold text-slate-800 mb-2">How do I get started with School Management Platform?</h4>
                                <p className="text-gray-600">
                                    Simply sign up for an account, choose your plan, and follow our quick start guide. You can have your entire school set up in less than an hour.
                                </p>
                            </div>
                            <div className="bg-white rounded-xl p-6 shadow-md">
                                <h4 className="text-lg font-bold text-slate-800 mb-2">Can I migrate data from my existing system?</h4>
                                <p className="text-gray-600">
                                    Yes! We provide data migration tools and our support team can help you transfer all your existing data seamlessly.
                                </p>
                            </div>
                            <div className="bg-white rounded-xl p-6 shadow-md">
                                <h4 className="text-lg font-bold text-slate-800 mb-2">Is my data secure?</h4>
                                <p className="text-gray-600">
                                    Absolutely. We use bank-level encryption, regular security audits, and comply with all major education data privacy regulations.
                                </p>
                            </div>
                            <div className="bg-white rounded-xl p-6 shadow-md">
                                <h4 className="text-lg font-bold text-slate-800 mb-2">What kind of support do you offer?</h4>
                                <p className="text-gray-600">
                                    We offer email support for all plans, priority support for Professional plans, and 24/7 phone support for Enterprise customers.
                                </p>
                            </div>
                            <div className="bg-white rounded-xl p-6 shadow-md">
                                <h4 className="text-lg font-bold text-slate-800 mb-2">Can I try School Management Platform before purchasing?</h4>
                                <p className="text-gray-600">
                                    Yes! We offer a 14-day free trial with full access to all features. No credit card required.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="text-center bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-12 text-white shadow-2xl">
                        <h3 className="text-3xl font-bold mb-4">Still Have Questions?</h3>
                        <p className="text-xl text-indigo-100 mb-8">
                            Our support team is here to help you succeed
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <button 
                                onClick={() => scrollToSection('contact')}
                                className="bg-white text-indigo-600 px-8 py-3 rounded-full font-bold hover:bg-yellow-400 hover:text-slate-900 transition-all duration-300 transform hover:scale-105"
                            >
                                Contact Support
                            </button>
                            <button className="border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-indigo-600 transition-all duration-300 transform hover:scale-105">
                                Schedule a Demo
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-300 pt-16 pb-8 border-t-4 border-indigo-500">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div className="md:col-span-1">
                            <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                                <Monitor className="w-6 h-6 mr-2 text-indigo-500" />
                                School Management
                            </h3>
                            <p className="text-sm text-slate-400 leading-relaxed mb-4">
                                Empowering education through innovative technology solutions for modern schools.
                            </p>
                            <div className="flex space-x-3">
                                <a href="#" className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors duration-300">
                                    <span className="text-sm">f</span>
                                </a>
                                <a href="#" className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors duration-300">
                                    <span className="text-sm">in</span>
                                </a>
                                <a href="#" className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors duration-300">
                                    <span className="text-sm">𝕏</span>
                                </a>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold text-white mb-4 border-b border-slate-700 pb-2">Quick Links</h4>
                            <ul className="space-y-2">
                                <li><button onClick={() => scrollToSection('about')} className="text-slate-400 hover:text-indigo-400 transition-colors duration-200">About Us</button></li>
                                <li><button onClick={() => scrollToSection('features')} className="text-slate-400 hover:text-indigo-400 transition-colors duration-200">Features</button></li>
                                <li><button onClick={() => scrollToSection('pricing')} className="text-slate-400 hover:text-indigo-400 transition-colors duration-200">Pricing</button></li>
                                <li><button onClick={() => scrollToSection('contact')} className="text-slate-400 hover:text-indigo-400 transition-colors duration-200">Contact</button></li>
                                <li><button onClick={() => scrollToSection('support')} className="text-slate-400 hover:text-indigo-400 transition-colors duration-200">Support</button></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold text-white mb-4 border-b border-slate-700 pb-2">Portals</h4>
                            <ul className="space-y-2">
                                <li><a href="/admin" className="text-slate-400 hover:text-indigo-400 transition-colors duration-200 flex items-center"><LayoutDashboard className="w-4 h-4 mr-2" />Admin Login</a></li>
                                <li><a href="/student" className="text-slate-400 hover:text-indigo-400 transition-colors duration-200 flex items-center"><Users className="w-4 h-4 mr-2" />Student Login</a></li>
                                <li><a href="/teacher" className="text-slate-400 hover:text-indigo-400 transition-colors duration-200 flex items-center"><BookOpen className="w-4 h-4 mr-2" />Teacher Login</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold text-white mb-4 border-b border-slate-700 pb-2">Contact</h4>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-start">
                                    <span className="text-indigo-500 mr-2">📧</span>
                                    <span className="text-slate-400">support@eduportal.com</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-indigo-500 mr-2">📞</span>
                                    <span className="text-slate-400">+1 (555) 123-4567</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-indigo-500 mr-2">📍</span>
                                    <span className="text-slate-400">123 Education St, Learning City</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-700 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
                        <p>&copy; {new Date().getFullYear()} School Management Platform. All rights reserved.</p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <a href="/privacy" className="hover:text-indigo-400 transition-colors duration-200">Privacy Policy</a>
                            <a href="/terms" className="hover:text-indigo-400 transition-colors duration-200">Terms of Service</a>
                            <a href="/cookies" className="hover:text-indigo-400 transition-colors duration-200">Cookie Policy</a>
                        </div>
                    </div>
                </div>
            </footer>
            
        </div>
    );
};

export default App;