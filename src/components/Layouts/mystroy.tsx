const ExploreMyStory = () => {
    return (
        <div className="py-16 px-6 sm:px-12 lg:px-24 text-white backdrop-blur-sm bg-transparent">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-center sm:text-5xl">Ellis Armah Ayikwei</h1>
                <p className="mt-4 text-lg leading-relaxed text-center">Software Engineer & Tech Support | Accra, Ghana</p>

                <div className="mt-10 space-y-8">
                    <section>
                        <h2 className="text-3xl font-semibold">Building My Career: A Strong Foundation</h2>
                        <p className="mt-2 leading-relaxed">
                            With a deep passion for technology and problem-solving, I embarked on a journey to make a significant impact in the tech space. Pursuing a{' '}
                            <strong className="text-[#dc711a]">BSc in Information Technology</strong> at Ghana Communications Technology University has solidified my technical foundation. Through
                            certifications like the <strong className="text-[#dc711a]">Google Professional IT Support Certificate</strong>, the{' '}
                            <strong className="text-[#dc711a]">Google Digital Marketing and SEO Certificate</strong>, and the{' '}
                            <strong className="text-[#dc711a]">ALX Software Engineering Certificate</strong>, I’ve gained comprehensive knowledge across IT support, backend engineering, and digital
                            marketing.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-3xl font-semibold">Technical Expertise: Innovating with Creativity</h2>
                        <p className="mt-2 leading-relaxed">
                            My skill set spans diverse domains, combining strong programming expertise with creative problem-solving. Proficient in{' '}
                            <strong className="text-[#dc711a]">HTML/CSS, JavaScript, React.js, Python, Flutter, and Node.js</strong>, I develop functional and visually appealing web and mobile
                            applications. My proficiency in design tools like <strong className="text-[#dc711a]">Figma</strong>, <strong className="text-[#dc711a]">Adobe Photoshop</strong>, and{' '}
                            <strong className="text-[#dc711a]">Adobe XD</strong> ensures user-centric designs that align functionality with aesthetics.
                        </p>
                        <p className="mt-2 leading-relaxed">
                            I’m equally adept in IT support and infrastructure management, with hands-on experience in{' '}
                            <strong className="text-[#dc711a]">Active Directory, VPN, and Linux environments</strong>. This breadth of expertise positions me as a versatile professional capable of
                            delivering robust and scalable solutions.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-3xl font-semibold">Professional Experience: Solving Real-World Challenges</h2>
                        <p className="mt-2 leading-relaxed">
                            My career has spanned impactful roles, including a Software Engineer at <strong className="text-[#dc711a]">Enterprise Group Ghana</strong>, where I developed full-stack
                            applications using <strong className="text-[#dc711a]">React TypeScript and Python Flask</strong>. From contributing to mobile app development at{' '}
                            <strong className="text-[#dc711a]">MyBasi</strong> and <strong className="text-[#dc711a]">Ride Smash</strong> to designing e-commerce platforms at{' '}
                            <strong className="text-[#dc711a]">Mira Drinks</strong>, my roles have honed my ability to adapt and excel in dynamic environments.
                        </p>
                        <p className="mt-2 leading-relaxed">
                            In addition to software engineering, I have consistently demonstrated excellence in IT support at <strong className="text-[#dc711a]">TradeHut GH</strong>, resolving
                            technical challenges and enhancing user satisfaction.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-3xl font-semibold">Vision and Values: Driving Impact</h2>
                        <p className="mt-2 leading-relaxed">
                            My mission is to leverage technology to create meaningful impact. Whether through building scalable solutions for businesses or providing IT support to individuals, I aim
                            to empower others with technology. As a bilingual professional fluent in <strong className="text-[#dc711a]">English, Ga, and Twi</strong>, I bring a unique ability to
                            communicate across diverse teams and audiences.
                        </p>
                    </section>
                </div>

                <div className="mt-8">
                    <h3 className="text-center text-xl lg:text-3xl font-semibold text-white mb-4">Skills & Technologies</h3>
                    <div className="flex flex-wrap justify-center gap-3">
                        {[
                            'HTML/CSS/JavaScript',
                            'Python/Flask/Django',
                            'React.js',
                            'Typescript',
                            'Node.js',
                            'Flutter',
                            'Figma',
                            'Adobe Photoshop',
                            'MongoDB',
                            'MySQL',
                            'AWS',
                            'Docker',
                            'Git',
                            'Linux',
                            'Active Directory',
                            'VPN',
                        ].map((badgeText, idx) => (
                            <span
                                key={idx}
                                className="px-4 py-2 rounded-full ring-2 ring-[#dc711a9f] border-2 border-[#dc711a] bg-white text-[#dc711a] text-sm font-semibold hover:bg-[#dc711a] hover:text-white transition duration-300"
                            >
                                {badgeText}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="mt-12 flex items-center justify-center gap-4">
                    <a
                        href="/myportfolio"
                        className="px-6 py-3 text-white bg-[#dc711a] hover:bg-[#dc711a]/90 rounded-md text-lg font-medium shadow-md focus:outline-none focus:ring-2 focus:ring-[#dc711a]/50"
                    >
                        Explore My Portfolio
                    </a>
                    <a
                        href="/contactme"
                        className="px-6 py-3 text-[#dc711a] border border-[#dc711a] hover:bg-[#dc711a]/10 rounded-md text-lg font-medium shadow-md focus:outline-none focus:ring-2 focus:ring-[#dc711a]/50"
                    >
                        Let’s Work Together
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ExploreMyStory;
