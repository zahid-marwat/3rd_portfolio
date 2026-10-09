import React from 'react';

const Skills = ({ skills }) => {
    if (!skills) return null;

    return (
        <section className="section section-dark" id="skills" aria-labelledby="skills-title">
            <div className="container">
                <h2 id="skills-title" className="section-title">Skills & Technologies</h2>
                <div className="skills-container">
                    {Object.entries(skills).map(([categoryName, skillsList]) => (
                        <div key={categoryName} className="skills-category">
                            <h3 className="skills-category-title">{categoryName}</h3>
                            <div className="skills-grid">
                                {skillsList.map((skill, index) => (
                                    <span key={index} className="skill-tag">{skill}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Skills;
