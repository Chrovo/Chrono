import { useEffect, useRef } from "react";
import Card from "./Card";
import VanillaTilt from "vanilla-tilt";

const Benefits = () => {
    const cardRefs = [useRef(null), useRef(null), useRef(null)];

    useEffect(() => {
        cardRefs.forEach(ref => {
            if(ref.current) {
                VanillaTilt.init(ref.current, {
                    max: 8,
                    speed: 400,
                    glare: true,
                    "max-glare": 0.1,
                });
            }
        });
    }, []);
    
    return (
        <div className="px-6">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-white mb-3">Why Chrono?</h2>
                <p className="text-slate-400 text-lg">Everything you need to build beautiful timelines</p>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
                <Card ref={cardRefs[0]} text="Free" bullet1="No hidden fees" bullet2="Full access to all tools" bullet3="Unlimited timelines and sharing" color="text-blue-400" data-tilt/>
                <Card ref={cardRefs[1]} text="Style" bullet1="Built for teachers, with feedback in mind" bullet2="Fast, reliable performance" bullet3="Easy access anywhere" color="text-cyan-400" data-tilt/>
                <Card ref={cardRefs[2]} text="Easy" bullet1="Drag & drop" bullet2="Intuitive Design" bullet3="Share with one click" color="text-teal-300" data-tilt/>
            </div>
        </div>
    );
};

export default Benefits;