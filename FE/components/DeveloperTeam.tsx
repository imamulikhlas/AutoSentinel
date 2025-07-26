"use client"

import { useState } from "react"
import { Github, Linkedin, Twitter, Mail, Code, Coffee, Zap, Heart, Star, Server } from "lucide-react"
import { SmoothTransition } from "./SmoothTransition"
import { InteractiveCard } from "./InteractiveCard"

export const DeveloperTeam = () => {
    const [hoveredDev, setHoveredDev] = useState<number | null>(null)

    const developers = [
        {
          name: "Farel Imam Maulana",
          role: "AI/ML Engineer",
          speciality: "Machine Learning & Security",
          avatar: "/teams/farel.webp?height=120&width=120",
          bio: "AI enthusiast specializing in security analysis and threat detection algorithms. Building the future of smart contract security.",
          skills: ["Python", "TensorFlow", "Security Analysis", "Blockchain"],
          social: {
            github: "https://github.com/frl-im",
            linkedin: "https://linkedin.com/in/farel-imam-maulana-5a2622355",
            email: "akunx368@gmail.com",
          },
          gradient: "from-green-400 to-emerald-500",
          bgGradient: "from-green-500/10 to-emerald-500/10",
          borderColor: "border-green-500/30",
          teamRole : "🧑‍🚀Astro-F",
        },
        {
            name: "M Imamul Ikhlas",
            role: "Full Stack Developer",
            speciality: "Next Js, Python, Blockchain",
            avatar: "/teams/imam.webp?height=120&width=120",
            bio: "Passionate about building scalable web applications with modern technologies. Love turning ideas into reality.",
            skills: ["React", "TypeScript", "Python", "Supabase"],
            social: {
                github: "https://github.com/imamulikhlas",
                linkedin: "https://linkedin.com/in/imamulikhlas",
                email: "imamulikhlas@gmail.com",
            },
            gradient: "from-blue-400 to-cyan-500",
            bgGradient: "from-blue-500/10 to-cyan-500/10",
            borderColor: "border-blue-500/30",
            teamRole : "🎖️🧑‍🚀 Commander",
        },
        // {
        //     name: "Sela Amelia",
        //     role: "Blockchain Developer",
        //     speciality: "Smart Contract Security",
        //     avatar: "/placeholder.svg?height=120&width=120",
        //     bio: "Blockchain security expert with deep knowledge of smart contract vulnerabilities and Web3 technologies.",
        //     skills: ["Solidity", "Web3", "Security Auditing", "DeFi"],
        //     social: {
        //         linkedin: "https://linkedin.com/in/davidkim",
        //     },
                // gradient: "from-purple-400 to-pink-500",
                // bgGradient: "from-purple-500/10 to-pink-500/10",
                // borderColor: "border-purple-500/30",
        // },
        {
          name: "Sela Amelia",
          role: "UI/UX Designer",
          speciality: "Product Design & Research",
          avatar: "/teams/sela.webp?height=10&width=99990",
          bio: "Creative designer focused on user experience and interface design. Making complex security tools accessible to everyone.",
          skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
          social: {
            linkedin: "https://linkedin.com/in/sela-amelia-baa18a24a",
          },
          gradient: "from-orange-400 to-red-500",
          bgGradient: "from-orange-500/10 to-red-500/10",
          borderColor: "border-orange-500/30",
          teamRole : "🧑‍🚀Astro-S",
        },
    ]

    const renderCard = (dev, i) => (
        <SmoothTransition key={i} delay={400 + i * 100}>
            <InteractiveCard
                className={`bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border ${dev.borderColor} shadow-xl relative overflow-hidden transition-all duration-300 hover:shadow-2xl`}
                onMouseOver={() => setHoveredDev(i)}
                onMouseLeave={() => setHoveredDev(null)}
            >
                {/* Background Gradient */}
                <div
                    className={`absolute inset-0 bg-gradient-to-r ${dev.bgGradient} opacity-0 hover:opacity-100 transition-opacity duration-400`}
                ></div>

                {/* Floating Badge */}
                <div className="absolute top-3 -right-2 z-20">
                    <div
                        className={`bg-gradient-to-r ${dev.gradient} text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg animate-bounce`}
                    >
                        {dev.teamRole}
                    </div>
                </div>

                <div className="relative z-10">
                    {/* Avatar */}
                    <div className="text-center mb-6">
                        <div className="relative inline-block">
                            <div
                                className={`absolute inset-0 bg-gradient-to-r ${dev.gradient} rounded-full blur-lg opacity-50 animate-pulse`}
                            ></div>
                            <img
                                src={dev.avatar || "/placeholder.svg"}
                                alt={dev.name}
                                className={`relative w-20 h-20 rounded-full border-2 ${dev.borderColor} transition-all duration-300 hover:scale-110 hover:rotate-3`}
                            />
                            {/* Online Status */}
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-800 flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            </div>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="text-center mb-4">
                        <h3
                            className={`text-xl font-bold text-white mb-1 transition-all duration-300 hover:bg-gradient-to-r hover:${dev.gradient} hover:bg-clip-text`}
                        >
                            {dev.name}
                        </h3>
                        <p
                            className={`text-sm font-medium bg-gradient-to-r ${dev.gradient} bg-clip-text text-transparent mb-1`}
                        >
                            {dev.role}
                        </p>
                        <p className="text-xs text-gray-400 transition-colors duration-300 hover:text-gray-300">
                            {dev.speciality}
                        </p>
                    </div>

                    {/* Bio */}
                    <div
                        className={`transition-all duration-300 ${hoveredDev === i ? "max-h-32 opacity-100" : "max-h-0 opacity-0"} overflow-hidden`}
                    >
                        <p className="text-gray-300 text-sm leading-relaxed mb-4 transition-colors duration-300 hover:text-gray-200">
                            {dev.bio}
                        </p>
                    </div>

                    {/* Skills */}
                    <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                            {dev.skills.slice(0, hoveredDev === i ? 4 : 2).map((skill, skillIndex) => (
                                <SmoothTransition key={skillIndex} delay={skillIndex * 50}>
                                    <span
                                        className={`text-xs px-2 py-1 bg-gradient-to-r ${dev.bgGradient} border ${dev.borderColor} rounded-full text-gray-300 transition-all duration-300 hover:scale-105`}
                                    >
                                        {skill}
                                    </span>
                                </SmoothTransition>
                            ))}
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="flex justify-center space-x-3">
                        {[
                            dev.social?.github && {
                                icon: Github,
                                url: dev.social.github,
                                color: "hover:text-gray-300"
                            },
                            dev.social?.linkedin && {
                                icon: Linkedin,
                                url: dev.social.linkedin,
                                color: "hover:text-blue-400"
                            },
                            dev.social?.twitter && {
                                icon: Twitter,
                                url: dev.social.twitter,
                                color: "hover:text-cyan-400"
                            },
                            dev.social?.email && {
                                icon: Mail,
                                url: `mailto:${dev.social.email}`,
                                color: "hover:text-red-400"
                            },
                        ]
                            .filter(Boolean) 
                            .map(({ icon: Icon, url, color }, socialIndex) => (
                                <SmoothTransition key={socialIndex} delay={socialIndex * 50}>
                                    <a
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`text-gray-500 ${color} transition-all duration-300 hover:scale-125 hover:-translate-y-1`}
                                    >
                                        <Icon className="w-4 h-4" />
                                    </a>
                                </SmoothTransition>
                            ))}
                    </div>
                </div>
            </InteractiveCard>
        </SmoothTransition>
    )

    return (
        <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <SmoothTransition delay={0}>
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full border border-orange-500/30 mb-6 transition-all duration-300 hover:scale-110">
                            <Code className="w-8 h-8 text-orange-400 transition-transform duration-300 hover:rotate-12" />
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 transition-all duration-400 hover:scale-105">
                            Meet Team{" "}
                            <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                                Anjay Mabar
                            </span>
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto transition-colors duration-300 hover:text-gray-200">
                            The brilliant minds behind Auto Sentinel - passionate developers who built this revolutionary security
                            platform.
                        </p>
                    </div>
                </SmoothTransition>

                {/* Team Stats */}
                <SmoothTransition delay={200}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                        {[
                            { icon: Coffee, label: "Cups of Coffee", value: "∞", color: "text-amber-400" },
                            { icon: Code, label: "Lines of Code", value: "10K+", color: "text-blue-400" },
                            { icon: Zap, label: "Dedication Spirits", value: "∞", color: "text-purple-400" },
                            { icon: Heart, label: "Passion Level", value: "MAX", color: "text-red-400" },
                        ].map(({ icon: Icon, label, value, color }, i) => (
                            <SmoothTransition key={i} delay={250 + i * 50}>
                                <InteractiveCard className="bg-gray-800/30 backdrop-blur-xl rounded-xl p-4 border border-gray-700/50 text-center">
                                    <Icon className={`w-6 h-6 ${color} mx-auto mb-2 transition-all duration-300 hover:scale-110`} />
                                    <div className={`text-2xl font-bold ${color} mb-1 transition-all duration-300 hover:scale-105`}>
                                        {value}
                                    </div>
                                    <div className="text-gray-400 text-sm transition-colors duration-300 hover:text-gray-300">
                                        {label}
                                    </div>
                                </InteractiveCard>
                            </SmoothTransition>
                        ))}
                    </div>
                </SmoothTransition>

                {/* Developer Cards */}
                {/* Mobile & Tablet: Normal responsive grid */}
                <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:hidden">
                    {developers.map((dev, i) => renderCard(dev, i))}
                </div>

                {/* Desktop: Centered grid */}
                <div className="hidden lg:flex justify-center">
                    <div className="grid gap-8" 
                         style={{
                             gridTemplateColumns: `repeat(${Math.min(developers.length, 4)}, 300px)`
                         }}>
                        {developers.map((dev, i) => renderCard(dev, i))}
                    </div>
                </div>

                {/* Team Message */}
                <SmoothTransition delay={800}>
                    <div className="mt-16 text-center">
                        <InteractiveCard className="bg-gradient-to-r from-orange-500/10 via-red-500/10 to-pink-500/10 rounded-3xl p-8 sm:p-12 border border-orange-500/20 backdrop-blur-xl max-w-4xl mx-auto">
                            <div className="flex items-center justify-center mb-6">
                                <Star className="w-8 h-8 text-orange-400 mr-3 animate-pulse" />
                                <h3 className="text-2xl sm:text-3xl font-bold text-white">Built with Passion</h3>
                                <Star className="w-8 h-8 text-orange-400 ml-3 animate-pulse" />
                            </div>
                            <p className="text-lg text-gray-300 leading-relaxed mb-6 transition-colors duration-300 hover:text-gray-200">
                                "We believe that blockchain security shouldn't be complicated. That's why we built Auto Sentinel - to
                                make advanced AI-powered security analysis accessible to everyone in the Web3 ecosystem."
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <div className="flex items-center text-orange-400">
                                    <Server className="w-5 h-5 mr-2 animate-pulse" />
                                    <span className="font-medium">Team Anjay Mabar</span>
                                </div>
                                <div className="hidden sm:block w-2 h-2 bg-gray-600 rounded-full"></div>
                                <div className="text-gray-400">BI - OJK Hackathon 2025</div>
                            </div>
                        </InteractiveCard>
                    </div>
                </SmoothTransition>
            </div>
        </section>
    )
}