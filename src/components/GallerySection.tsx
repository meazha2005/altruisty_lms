'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  Sparkles,
  MapPin,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  Award,
  Users2,
  Laptop,
  Building2,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export type GalleryCategory = 'all' | 'certifications' | 'events' | 'training';

export interface GalleryItem {
  id: string;
  src: string;
  category: 'certifications' | 'events' | 'training';
  title: string;
  location: string;
  tag: string;
  desc: string;
  date?: string;
  span?: string; // Optional layout span for grid variation
}

export const galleryItems: GalleryItem[] = [
  {
    id: 'cert-1',
    src: '/images/certification1.jpeg',
    category: 'certifications',
    title: 'Certificate Felicitation Ceremony',
    location: 'Altruisty Innovation Center',
    tag: 'Internship Completion',
    desc: 'Proud student interns receiving their official Altruisty Completion Certificates after successfully building and deploying production capstones.',
    date: 'Batch 2026',
    span: 'col-span-1 md:col-span-2 row-span-1',
  },
  {
    id: 'event-2',
    src: '/images/events2.jpeg',
    category: 'events',
    title: 'National Youth Day at REC',
    location: 'Rajalakshmi Engineering College',
    tag: 'Keynote & Leadership',
    desc: 'Altruisty founders and technical leads felicitated as distinguished guests and speakers at the REC National Youth Day symposium organized by Institution’s Innovation Council & Start Up HQ.',
    date: 'Campus Symposium',
    span: 'col-span-1 md:col-span-2 row-span-1',
  },
  {
    id: 'train-1',
    src: '/images/training1.jpeg',
    category: 'training',
    title: 'Mentor-Led Live Development Bay',
    location: 'Altruisty Development Hub',
    tag: 'Hands-on Coding',
    desc: 'Interactive live coding lab where interns work directly alongside senior engineers on production tech stacks and real company challenges.',
    date: 'In-Person Track',
  },
  {
    id: 'cert-2',
    src: '/images/certification2.jpeg',
    category: 'certifications',
    title: 'Empowering Women in Engineering',
    location: 'Altruisty Innovation Center',
    tag: 'Women in Tech',
    desc: 'Talented female software engineers celebrated upon graduating from our intensive Full Stack and Artificial Intelligence internship programs.',
    date: 'Felicitation Day',
  },
  {
    id: 'event-3',
    src: '/images/events3.jpeg',
    category: 'events',
    title: '300+ Student Auditorium Keynote',
    location: 'Jeppiaar Engineering College Auditorium',
    tag: 'Mega Campus Keynote',
    desc: 'Delivering an inspiring tech keynote to an auditorium packed with 300+ aspiring engineers covering modern full-stack engineering, open source, and startup leadership.',
    date: 'Engineering Summit',
    span: 'col-span-1 md:col-span-2 row-span-1',
  },
  {
    id: 'train-2',
    src: '/images/training2.jpeg',
    category: 'training',
    title: 'System Architecture & Whiteboard Sprint',
    location: 'Altruisty Innovation Bay',
    tag: 'System Design',
    desc: 'Interns collaborating around the whiteboard mapping out microservice architectures, relational database schemas, and API workflows.',
    date: 'Design Sprint',
  },
  {
    id: 'event-1',
    src: '/images/events1.jpeg',
    category: 'events',
    title: 'Institutional Faculty & Student Tech Seminar',
    location: 'College Conference Hall',
    tag: 'Academic Partnership',
    desc: 'College faculty coordinators, department leadership, and students collaborating with the Altruisty engineering cohort for campus skill enablement.',
    date: 'College Workshop',
  },
  {
    id: 'cert-3',
    src: '/images/certification3.jpeg',
    category: 'certifications',
    title: 'Verified Credential Recipients',
    location: 'Altruisty Innovation Center',
    tag: 'Milestone Honors',
    desc: 'Interns holding their verified Altruisty credentials featuring tamper-proof QR codes recognized for campus credits and industry placements.',
    date: 'Official Certification',
  },
  {
    id: 'train-3',
    src: '/images/training3.jpeg',
    category: 'training',
    title: 'Intensive Developer Cohort Lab',
    location: 'Altruisty Tech Bay',
    tag: 'Cohort Bootcamp',
    desc: 'A full-capacity coding lab of aspiring software developers building responsive applications, debugging live code, and doing peer programming.',
    date: 'Full Cohort',
  },
  {
    id: 'event-4',
    src: '/images/events4.jpeg',
    category: 'events',
    title: 'Collaborative College Workshop Cohort',
    location: 'Innovation Tech Lab',
    tag: 'Campus Tech Drive',
    desc: 'College students, mentors, and faculty members celebrating the completion of a dedicated hands-on technology immersion workshop.',
    date: 'Campus Drive',
  },
];

export default function GallerySection() {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredItems = galleryItems.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    document.body.style.overflow = '';
  }, []);

  const nextImage = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! + 1) % filteredItems.length);
  }, [lightboxIndex, filteredItems.length]);

  const prevImage = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! - 1 + filteredItems.length) % filteredItems.length);
  }, [lightboxIndex, filteredItems.length]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, closeLightbox, nextImage, prevImage]);

  const currentItem = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  return (
    <section id="gallery" className="py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 relative overflow-hidden">
      {/* Decorative Background Lighting */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-3/4 h-96 bg-gradient-to-b from-blue-100/40 via-sky-50/20 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            <span>Real Moments • Real Impact</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Life at Altruisty: <span className="bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">Training, Hackathons & Felicitation</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            From packed college auditorium keynotes and mentor-guided development labs to milestone certificate felicitation ceremonies — take an authentic look at our vibrant student engineering community.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {[
            { id: 'all', label: 'All Moments', count: galleryItems.length, icon: Sparkles },
            { id: 'certifications', label: 'Certifications', count: 3, icon: Award },
            { id: 'events', label: 'Campus Events', count: 4, icon: Building2 },
            { id: 'training', label: 'Hands-on Labs', count: 3, icon: Laptop },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as GalleryCategory)}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-[1.03]'
                    : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => openLightbox(index)}
              className={`group relative rounded-3xl overflow-hidden bg-slate-900 shadow-md hover:shadow-2xl border border-slate-200/80 transition-all duration-500 cursor-pointer hover:-translate-y-1.5 ${
                item.span && activeCategory === 'all' ? item.span : ''
              }`}
              style={{ minHeight: '320px' }}
            >
              {/* Image with smooth zoom */}
              <div className="relative w-full h-full min-h-[320px] sm:min-h-[360px]">
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                />
              </div>

              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-85 group-hover:opacity-90 transition-opacity" />

              {/* Top Badges */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 z-10">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-white/90 text-blue-900 backdrop-blur-md shadow-xs flex items-center gap-1.5">
                  {item.category === 'certifications' && <Award className="w-3 h-3 text-blue-600" />}
                  {item.category === 'events' && <Building2 className="w-3 h-3 text-sky-600" />}
                  {item.category === 'training' && <Laptop className="w-3 h-3 text-indigo-600" />}
                  <span>{item.tag}</span>
                </span>

                <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Bottom Content Card */}
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 z-10 space-y-2 transition-transform duration-300">
                <div className="flex items-center gap-2 text-xs text-sky-300 font-medium">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{item.location}</span>
                </div>

                <h3 className="text-lg sm:text-xl font-black text-white group-hover:text-sky-200 transition-colors leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed opacity-90">
                  {item.desc}
                </p>

                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-white/10">
                  <span className="font-semibold text-sky-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Click to enlarge photo →
                  </span>
                  <span>{item.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Gallery Trust Proofs Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg sm:text-xl font-black text-slate-900">500+</div>
              <div className="text-xs text-slate-500 font-medium">Certified Interns</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg sm:text-xl font-black text-slate-900">15+</div>
              <div className="text-xs text-slate-500 font-medium">Partner Campuses</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg sm:text-xl font-black text-slate-900">100%</div>
              <div className="text-xs text-slate-500 font-medium">Verifiable QR Credentials</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg sm:text-xl font-black text-slate-900">1:1</div>
              <div className="text-xs text-slate-500 font-medium">Live Mentor Mentorship</div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          FULLSCREEN LIGHTBOX MODAL
      ======================================================== */}
      {lightboxIndex !== null && currentItem && (
        <div
          className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-250 select-none"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all cursor-pointer"
            title="Close (Esc)"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Arrows */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md transition-all cursor-pointer hover:scale-110"
            title="Previous Photo (Left Arrow)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md transition-all cursor-pointer hover:scale-110"
            title="Next Photo (Right Arrow)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Modal Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-5xl w-full max-h-[92vh] flex flex-col bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10 animate-in zoom-in-95 duration-250"
          >
            {/* Image View */}
            <div className="relative w-full h-[55vh] sm:h-[65vh] bg-black">
              <Image
                src={currentItem.src}
                alt={currentItem.title}
                fill
                priority
                className="object-contain"
                sizes="(max-width: 1280px) 100vw, 1200px"
              />
            </div>

            {/* Caption & Metadata Bar */}
            <div className="p-5 sm:p-6 bg-slate-900 border-t border-white/10 text-white space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-600 text-white">
                    {currentItem.tag}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-sky-400" />
                    <span>{currentItem.location}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-400 font-mono">
                  {lightboxIndex + 1} / {filteredItems.length}
                </div>
              </div>

              <h4 className="text-xl sm:text-2xl font-black text-white">
                {currentItem.title}
              </h4>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                {currentItem.desc}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
