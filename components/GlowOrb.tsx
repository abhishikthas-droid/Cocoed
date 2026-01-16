import React from 'react';

const GlowOrb: React.FC = () => {
    return (
        <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto mb-8 animate-float">
            {/* Outer Glows */}
            <div className="absolute inset-0 bg-blue-400/30 rounded-full blur-3xl animate-pulse-glow"></div>
            <div className="absolute inset-4 bg-indigo-500/20 rounded-full blur-2xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>

            {/* The Orb Body */}
            <div className="relative w-full h-full rounded-full orb-gradient overflow-hidden">
                {/* Shine Overlay */}
                <div className="absolute inset-0 orb-shine"></div>

                {/* Subtle internal atmospheric effects */}
                <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-white/20 rounded-full blur-xl animate-pulse"></div>

                {/* 3D highlights */}
                <div className="absolute top-2 left-6 w-16 h-8 bg-white/30 rounded-full blur-md rotate-[-20deg]"></div>
            </div>
        </div>
    );
};

export default GlowOrb;
