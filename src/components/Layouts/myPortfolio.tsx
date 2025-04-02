import { Link } from 'react-router-dom';
import IconCode from '../Icon/IconCode';
import IconGlobe from '../Icon/IconGlobe';
import { renderTechnology } from './rendertechnology';

const Portfolio = () => {
    const projects = [
        {
            id: 1,
            title: 'QrCode Generator',
            description: 'A mobile application built using Flutter. Focused on seamless qrCode generation with embeded icons.',
            image: 'project1.png',
            iframe: () => {
                return <iframe className="border-1 border-gray-200 w-full h-[450px]" src="https://play.google.com/store/apps/details?id=com.tradehut.qrcodegenerator&hl=en" allowFullScreen></iframe>;
            },
            link: 'https://github.com/Ellis-Ayikwei/QrCode-Generator.git',
            stacks: ['Flutter'],
        },
        {
            id: 2,
            title: 'MyBasi Platform',
            description: 'Collaborated on a robust mobile app for client management using Flutter, enhancing user experience and performance.',
            image: 'project2.png', // Replace with the actual image path
            link: 'https://github.com/Thehustl3r/mybasi-customer-mobile.git',
            iframe: () => {
                return (
                    <iframe
                        className="border-1 border-gray-200 w-full h-[450px]"
                        src="https://embed.figma.com/proto/LP8q5adI8vhHh07Ezf1LxJ/my-bus?page-id=0%3A1&node-id=558-359&starting-point-node-id=558%3A429&embed-host=share"
                        allowFullScreen
                    ></iframe>
                );
            },
            stacks: ['Flutter'],
        },
        {
            id: 3,
            title: 'Sprout Collab',
            description: 'A collaboration plaform',
            image: 'project3.png', // Replace with the actual image path
            iframe: () => {
                return <iframe className="border-1 border-gray-200 w-full h-[450px]" src="https://www.sproutcollab.me/" allowFullScreen></iframe>;
            },
            link: '#',
            stacks: ['Flutter'],
        },
        {
            id: 3,
            title: 'TradeHut GH E-Commerce',
            description: 'Maintained and improved custom web applications and e-commerce platforms for enhanced user satisfaction.',
            image: 'project3.png', // Replace with the actual image path
            link: '#',
            stacks: ['Flutter'],
        },
        {
            id: 3,
            title: 'TradeHut GH E-Commerce',
            description: 'Maintained and improved custom web applications and e-commerce platforms for enhanced user satisfaction.',
            image: 'project3.png', // Replace with the actual image path
            link: '#',
            stacks: ['Flutter'],
        },
        {
            id: 3,
            title: 'TradeHut GH E-Commerce',
            description: 'Maintained and improved custom web applications and e-commerce platforms for enhanced user satisfaction.',
            image: 'project3.png', // Replace with the actual image path
            link: '#',
            stacks: ['Python', 'React', 'flask'],
        },
    ];

    return (
        <section id="portfolio" className="relative bg-gradient-to-b from-white to-gray-50 py-24">
            <div className="container mx-auto px-4 max-w-6xl relative">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">My Portfolio</h1>
            </div>
        </section>
    );
};

export default Portfolio;
