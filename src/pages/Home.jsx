import React, { useState } from 'react';
import { LayoutDashboard, Users, BookOpen, Rocket, Monitor, Mail, Phone, MapPin, Check, Zap, Shield, TrendingUp, Clock, Award, Globe, Bus, ChevronDown } from 'lucide-react';
import { useEffect } from 'react';

const slides = [
  {
    id: 1,
    title: (
      <>
        The <span className="text-indigo-400">#1 School Platform.</span>
      </>
    ),
    subtitle:
      'Manage your entire institution from one place — students, teachers, and admin tools in one powerful suite.',
    bg: 'https://images.pexels.com/photos/1720188/pexels-photo-1720188.jpeg',
  },
  {
    id: 2,
    title: (
      <>
        Seamless <span className="text-blue-400">Learning Experience.</span>
      </>
    ),
    subtitle:
      'Empower students with smart analytics, online lessons, and real-time performance tracking.',
    bg: 'https://images.pexels.com/photos/207756/pexels-photo-207756.jpeg',
  },
  {
    id: 3,
    title: (
      <>
        Next-gen <span className="text-indigo-400">Helpdesk & Support.</span>
      </>
    ),
    subtitle:
      'Instantly resolve queries, track communication, and automate responses with AI-powered tools.',
    bg: 'https://images.pexels.com/photos/8617634/pexels-photo-8617634.jpeg',
  },
  {
    id: 4,
    title: (
      <>
        Built for <span className="text-blue-400">Growth & Success.</span>
      </>
    ),
    subtitle:
      'Scale your school operations confidently with bank-level security and robust analytics.',
    bg: 'https://images.pexels.com/photos/289737/pexels-photo-289737.jpeg',
  },
];

const HeroSlider = ({ scrollToSection }) => {
  const [active, setActive] = useState(0);

  // Auto-slide every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-full w-full">
      {slides.map((slide, idx) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === active ? 'opacity-100 z-20' : 'opacity-0 z-10'
          }`}
          style={{
            backgroundImage: `url('${slide.bg}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

          {/* Slide Content */}
          <div className="relative z-30 flex flex-col items-start justify-center h-full max-w-6xl mx-auto px-6 sm:px-10">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-[1.05] mb-4 sm:mb-6 drop-shadow-lg">
              {slide.title}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-200 max-w-2xl mb-8 sm:mb-10 leading-relaxed drop-shadow">
              {slide.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={() => scrollToSection('features')}
                className="inline-flex items-center justify-center rounded-full bg-white text-slate-900 px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-semibold shadow-2xl hover:shadow-[0_12px_30px_rgba(0,0,0,0.35)] transition-all hover:-translate-y-0.5"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="inline-flex items-center justify-center rounded-full border-2 border-white/90 text-white px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-semibold hover:bg-white hover:text-slate-900 transition-all hover:-translate-y-0.5"
              >
                Contact us
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-30">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActive(idx)}
            className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
              idx === active ? 'bg-white scale-110' : 'bg-white/40'
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

const App = () => {
  // Navigation handled by global NavBar component

  const BACKGROUND_IMAGE_URL = 'https://images.pexels.com/photos/1720188/pexels-photo-1720188.jpeg';

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(null); // index of open FAQ item

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setMobileMenuOpen(false);
    }
  };

  const faqs = [
    {
      q: 'How do I get started with School Management Platform?',
      a: 'Simply sign up for an account, choose your plan, and follow our quick start guide. You can have your entire school set up in less than an hour.'
    },
    {
      q: 'Can I migrate data from my existing system?',
      a: 'Yes! We provide data migration tools and our support team can help you transfer all your existing data seamlessly.'
    },
    {
      q: 'Is my data secure?',
      a: 'Absolutely. We use bank-level encryption, regular security audits, and comply with all major education data privacy regulations.'
    },
    {
      q: 'What kind of support do you offer?',
      a: 'We offer email support for all plans, priority support for Professional plans, and 24/7 phone support for Enterprise customers.'
    },
    {
      q: 'Can I try School Management Platform before purchasing?',
      a: 'Yes! We offer a 14-day free trial with full access to all features. No credit card required.'
    }
  ];

  const toggleFAQ = (idx) => setOpenFAQ((prev) => (prev === idx ? null : idx));

  return (
    <div className="min-h-screen bg-white font-sans">
 {/* Hero Section (Full-screen Auto Slider) */}
<section
  id="home"
  className="relative h-screen w-full overflow-hidden text-white font-sans"
>
  {/* Overlay + grid background */}
  <div className="absolute inset-0 bg-slate-950/70 z-10"></div>
  <div
    className="pointer-events-none absolute inset-0 opacity-25 mix-blend-soft-light z-10"
    style={{
      backgroundImage: `
        linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)
      `,
      backgroundSize: '40px 40px',
    }}
  />

  {/* Animated glowing background */}
  <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl animate-pulse"></div>
  <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-blue-500/20 blur-3xl animate-pulse delay-1000"></div>

  {/* SLIDES */}
  <div className="relative z-20 h-full w-full">
    <HeroSlider scrollToSection={scrollToSection} />
  </div>

  {/* Soft glows */}
  <div className="absolute -top-28 -left-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl"></div>
  <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl"></div>

  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
    {/* Eyebrow */}
    <div className="mb-6 sm:mb-8">
      <span className="inline-flex items-center gap-3 text-[11px] sm:text-xs tracking-widest uppercase text-indigo-200">
        <span className="h-px w-8 bg-indigo-400/70"></span>
        School Management Platform
      </span>
    </div>

   

    {/* Subhead */}
    <p className="mt-6 sm:mt-7 max-w-2xl text-slate-200 text-base sm:text-lg md:text-xl">
      Combine student portals, admin tools, and analytics on a single, secure platform that boosts efficiency and elevates learning outcomes.
    </p>

    {/* CTAs */}
<div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
  <button
    onClick={() => scrollToSection('features')}
    className="inline-flex items-center justify-center rounded-full bg-white text-slate-900 px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-semibold shadow-2xl hover:shadow-[0_12px_30px_rgba(0,0,0,0.35)] transition-all hover:-translate-y-0.5"
    aria-label="Go to Features"
  >
    Features
  </button>
  <button
    onClick={() => scrollToSection('contact')}
    className="inline-flex items-center justify-center rounded-full border-2 border-white/90 text-white px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-semibold hover:bg-white hover:text-slate-900 transition-all hover:-translate-y-0.5"
    aria-label="Go to Contact"
  >
    Contact us
  </button>
</div>


    {/* Trust strip (optional, looks like the ref) */}
    <div className="mt-10 sm:mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 text-[11px] sm:text-xs text-indigo-100/80">
      <span className="opacity-80">Trusted by 500+ schools</span>
      <span className="h-1 w-1 rounded-full bg-indigo-200/60"></span>
      <span className="opacity-80">Bank-level security</span>
      <span className="h-1 w-1 rounded-full bg-indigo-200/60"></span>
      <span className="opacity-80">24/7 enterprise support</span>
    </div>
  </div>

</section>

      {/* About Us Section */}
      <section id="about" className="py-16 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 mb-3 sm:mb-4">About School Management Platform</h2>
            <div className="w-20 sm:w-24 h-1 bg-indigo-600 mx-auto mb-4 sm:mb-6"></div>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              We're on a mission to revolutionize education management through innovative technology solutions that make schools more efficient, teachers more effective, and students more successful.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center mb-12 sm:mb-16">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4 sm:mb-6">Our Story</h3>
              <p className="text-gray-600 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">
                Founded in 2020, School Management Platform was born from the vision of educators and technologists who saw the challenges schools face in managing complex operations. We've grown from a small startup to serving over 500 institutions worldwide.
              </p>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                Our platform has helped millions of students, thousands of teachers, and hundreds of administrators streamline their daily tasks, allowing them to focus on what truly matters - quality education.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-indigo-50 p-4 sm:p-6 rounded-xl text-center transform hover:scale-105 transition-transform duration-300">
                <div className="text-2xl sm:text-4xl font-bold text-indigo-600 mb-1 sm:mb-2">500+</div>
                <div className="text-gray-700 font-medium text-sm sm:text-base">Schools</div>
              </div>
              <div className="bg-blue-50 p-4 sm:p-6 rounded-xl text-center transform hover:scale-105 transition-transform duration-300">
                <div className="text-2xl sm:text-4xl font-bold text-blue-600 mb-1 sm:mb-2">50K+</div>
                <div className="text-gray-700 font-medium text-sm sm:text-base">Teachers</div>
              </div>
              <div className="bg-green-50 p-4 sm:p-6 rounded-xl text-center transform hover:scale-105 transition-transform duration-300">
                <div className="text-2xl sm:text-4xl font-bold text-green-600 mb-1 sm:mb-2">2M+</div>
                <div className="text-gray-700 font-medium text-sm sm:text-base">Students</div>
              </div>
              <div className="bg-purple-50 p-4 sm:p-6 rounded-xl text-center transform hover:scale-105 transition-transform duration-300">
                <div className="text-2xl sm:text-4xl font-bold text-purple-600 mb-1 sm:mb-2">98%</div>
                <div className="text-gray-700 font-medium text-sm sm:text-base">Satisfaction</div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Rocket className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-600" />
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-slate-800 mb-2 sm:mb-3">Our Mission</h4>
              <p className="text-gray-600 text-sm sm:text-base">
                To empower educational institutions with innovative technology that simplifies management and enhances learning outcomes.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Globe className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-slate-800 mb-2 sm:mb-3">Our Vision</h4>
              <p className="text-gray-600 text-sm sm:text-base">
                To become the world's most trusted education management platform, serving schools in every corner of the globe.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Award className="w-7 h-7 sm:w-8 sm:h-8 text-green-600" />
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-slate-800 mb-2 sm:mb-3">Our Values</h4>
              <p className="text-gray-600 text-sm sm:text-base">
                Innovation, integrity, excellence, and a relentless focus on user experience guide everything we do.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 mb-3 sm:mb-4">Powerful Features</h2>
            <div className="w-20 sm:w-24 h-1 bg-indigo-600 mx-auto mb-4 sm:mb-6"></div>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage your school efficiently, all in one integrated platform
            </p>
          </div>

          {/* Mobile: 2 per row; Desktop: 3 per row */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12">
            <div className="bg-white rounded-xl p-4 sm:p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-indigo-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <LayoutDashboard className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-600" />
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-800 mb-2 sm:mb-3">Admin Dashboard</h3>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base mb-3 sm:mb-4">
                Comprehensive control center with real-time analytics, reporting tools, and complete oversight of all school operations.
              </p>
              <ul className="space-y-1 sm:space-y-2 text-[11px] sm:text-sm text-gray-600">
                <li className="flex items-start"><Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 mr-2 mt-0.5" />Student enrollment management</li>
                <li className="flex items-start"><Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 mr-2 mt-0.5" />Staff administration</li>
                <li className="flex items-start"><Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 mr-2 mt-0.5" />Financial tracking</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-800 mb-2 sm:mb-3">Teacher Tools</h3>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base mb-3 sm:mb-4">
                Intuitive tools for lesson planning, grading, attendance tracking, and student performance monitoring.
              </p>
              <ul className="space-y-1 sm:space-y-2 text-[11px] sm:text-sm text-gray-600">
                <li className="flex items-start"><Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 mr-2 mt-0.5" />Digital gradebook</li>
                <li className="flex items-start"><Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 mr-2 mt-0.5" />Assignment management</li>
                <li className="flex items-start"><Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 mr-2 mt-0.5" />Progress reports</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <Users className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-800 mb-2 sm:mb-3">Student Portal</h3>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base mb-3 sm:mb-4">
                Interactive learning environment with access to courses, assignments, grades, and communication tools.
              </p>
              <ul className="space-y-1 sm:space-y-2 text-[11px] sm:text-sm text-gray-600">
                <li className="flex items-start"><Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 mr-2 mt-0.5" />Course materials access</li>
                <li className="flex items-start"><Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 mr-2 mt-0.5" />Assignment submission</li>
                <li className="flex items-start"><Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 mr-2 mt-0.5" />Grade tracking</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600" />
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-800 mb-2 sm:mb-3">Attendance System</h3>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base">
                Automated attendance tracking with real-time notifications to parents and detailed attendance reports.
              </p>
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-orange-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600" />
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-800 mb-2 sm:mb-3">Analytics & Reports</h3>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base">
                Powerful analytics engine providing insights into student performance, attendance trends, and institutional metrics.
              </p>
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-red-600" />
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-800 mb-2 sm:mb-3">Security & Privacy</h3>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base">
                Bank-level encryption, role-based access control, and compliance with education data privacy regulations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 sm:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 mb-3 sm:mb-4">Get In Touch</h2>
            <div className="w-20 sm:w-24 h-1 bg-indigo-600 mx-auto mb-4 sm:mb-6"></div>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-100">
              <form className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Full Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Email Address</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Institution Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="ABC School"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Message</label>
                  <textarea
                    rows="4"
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200 resize-none"
                    placeholder="Tell us about your needs..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold sm:font-bold hover:bg-indigo-700 transition-colors duration-300 transform hover:scale-105 text-sm sm:text-base"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-6 sm:p-8 text-white mb-6 shadow-xl">
                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Contact Information</h3>
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-start">
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6 mr-3 sm:mr-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold mb-1">Email</div>
                      <div className="text-indigo-100 text-sm sm:text-base">support@eduportal.com</div>
                      <div className="text-indigo-100 text-sm sm:text-base">sales@eduportal.com</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="w-5 h-5 sm:w-6 sm:h-6 mr-3 sm:mr-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold mb-1">Phone</div>
                      <div className="text-indigo-100 text-sm sm:text-base">+1 (555) 123-4567</div>
                      <div className="text-indigo-100 text-sm sm:text-base">+1 (555) 987-6543</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 mr-3 sm:mr-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold mb-1">Office</div>
                      <div className="text-indigo-100 text-sm sm:text-base">123 Education Street</div>
                      <div className="text-indigo-100 text-sm sm:text-base">Learning City, LC 12345</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-100">
                <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 sm:mb-4">Office Hours</h3>
                <div className="space-y-2 sm:space-y-3 text-gray-600 text-sm sm:text-base">
                  <div className="flex justify-between"><span>Monday - Friday</span><span className="font-semibold">9:00 AM - 6:00 PM</span></div>
                  <div className="flex justify-between"><span>Saturday</span><span className="font-semibold">10:00 AM - 4:00 PM</span></div>
                  <div className="flex justify-between"><span>Sunday</span><span className="font-semibold">Closed</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section id="support" className="py-16 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 mb-3 sm:mb-4">Support Center</h2>
            <div className="w-20 sm:w-24 h-1 bg-indigo-600 mx-auto mb-4 sm:mb-6"></div>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              Find answers to common questions and get the help you need
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 sm:p-8 border border-indigo-100">
              <Zap className="w-10 h-10 sm:w-12 sm:h-12 text-indigo-600 mb-3 sm:mb-4" />
              <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2 sm:mb-3">Quick Start Guide</h3>
              <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4">
                New to EduPortal? Our comprehensive quick start guide will help you get up and running in minutes.
              </p>
              <button className="text-indigo-600 font-semibold hover:text-indigo-700 flex items-center text-sm sm:text-base">
                View Guide <span className="ml-2">→</span>
              </button>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 sm:p-8 border border-purple-100">
              <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-purple-600 mb-3 sm:mb-4" />
              <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2 sm:mb-3">Documentation</h3>
              <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4">
                Detailed documentation covering every feature, with step-by-step tutorials and best practices.
              </p>
              <button className="text-purple-600 font-semibold hover:text-purple-700 flex items-center text-sm sm:text-base">
                Browse Docs <span className="ml-2">→</span>
              </button>
            </div>
          </div>
          {/* Mobile-first FAQ accordion (updated version) */}
<div className="bg-gray-50 rounded-2xl p-6 sm:p-8 mb-10 sm:mb-12">
  <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6 sm:mb-8 text-center">Frequently Asked Questions</h3>
  <div className="max-w-4xl mx-auto divide-y divide-gray-200">
    {faqs.map((item, idx) => (
      <div key={idx} className="bg-white rounded-xl mb-3 sm:mb-4 shadow-md overflow-hidden">
        <button
          className="w-full flex items-center justify-between text-left px-4 sm:px-6 py-3 sm:py-4"
          onClick={() => toggleFAQ(idx)}
          aria-expanded={openFAQ === idx}
          aria-controls={`faq-panel-${idx}`}
        >
          <span className="font-bold text-slate-800 text-sm sm:text-base">{item.q}</span>
          <ChevronDown
            className={`w-5 h-5 sm:w-6 sm:h-6 text-slate-600 transition-transform duration-200 ${openFAQ === idx ? 'rotate-180' : ''}`}
          />
        </button>
        {openFAQ === idx && (
          <div
            id={`faq-panel-${idx}`}
            className="px-4 sm:px-6 pb-3 sm:pb-4 text-gray-600 text-sm border-t border-gray-200 animate-fadeIn"
          >
            {item.a}
          </div>
        )}
      </div>
    ))}
  </div>
</div>


          <div className="text-center bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-8 sm:p-12 text-white shadow-2xl">
            <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Still Have Questions?</h3>
            <p className="text-base sm:text-xl text-indigo-100 mb-6 sm:mb-8">
              Our support team is here to help you succeed
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <button
                onClick={() => scrollToSection('contact')}
                className="bg-white text-indigo-600 px-6 py-3 rounded-full font-semibold hover:bg-yellow-400 hover:text-slate-900 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
              >
                Contact Support
              </button>
              <button className="border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-indigo-600 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base">
                Schedule a Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-300 pt-12 sm:pt-16 pb-8 border-t-4 border-indigo-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-12 mb-10 sm:mb-12">
            <div className="md:col-span-1">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 flex items-center">
                <Monitor className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-indigo-500" />
                School Management
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                Empowering education through innovative technology solutions for modern schools.
              </p>
              <div className="flex space-x-3">
                <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 bg-slate-700 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors duration-300">
                  <span className="text-xs sm:text-sm">f</span>
                </a>
                <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 bg-slate-700 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors duration-300">
                  <span className="text-xs sm:text-sm">in</span>
                </a>
                <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 bg-slate-700 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors duration-300">
                  <span className="text-xs sm:text-sm">𝕏</span>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 border-b border-slate-700 pb-2">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => scrollToSection('about')} className="text-slate-400 hover:text-indigo-400 transition-colors duration-200">About Us</button></li>
                <li><button onClick={() => scrollToSection('features')} className="text-slate-400 hover:text-indigo-400 transition-colors duration-200">Features</button></li>
                <li><button onClick={() => scrollToSection('pricing')} className="text-slate-400 hover:text-indigo-400 transition-colors duration-200">Pricing</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="text-slate-400 hover:text-indigo-400 transition-colors duration-200">Contact</button></li>
                <li><button onClick={() => scrollToSection('support')} className="text-slate-400 hover:text-indigo-400 transition-colors duration-200">Support</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 border-b border-slate-700 pb-2">Portals</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/admin" className="text-slate-400 hover:text-indigo-400 transition-colors duration-200 flex items-center"><LayoutDashboard className="w-4 h-4 mr-2" />Admin Login</a></li>
                <li><a href="/student" className="text-slate-400 hover:text-indigo-400 transition-colors duration-200 flex items-center"><Users className="w-4 h-4 mr-2" />Student Login</a></li>
                <li><a href="/teacher" className="text-slate-400 hover:text-indigo-400 transition-colors duration-200 flex items-center"><BookOpen className="w-4 h-4 mr-2" />Teacher Login</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 border-b border-slate-700 pb-2">Contact</h4>
              <ul className="space-y-3 text-xs sm:text-sm">
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

          <div className="pt-6 sm:pt-8 border-t border-slate-700 flex flex-col md:flex-row justify-between items-center text-xs sm:text-sm text-slate-500">
            <p>&copy; {new Date().getFullYear()} School Management Platform. All rights reserved.</p>
            <div className="flex space-x-4 sm:space-x-6 mt-4 md:mt-0">
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
