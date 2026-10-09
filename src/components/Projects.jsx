import React from 'react';

const Projects = ({ projects }) => {
    if (!projects || projects.length === 0) return null;

    return (
        <section className="section" id="projects" aria-labelledby="projects-title">
            <div className="container">
                <h2 id="projects-title" className="section-title">Featured Projects</h2>
                <div className="projects-grid" role="list">
                    {projects.map((project, index) => (
                        <article key={index} className="project-card" role="listitem">
                            <h3 className="project-name">{project.name}</h3>
                            <p className="project-description">{project.description}</p>

                            <div className="project-technologies">
                                {project.technologies.map((tech, idx) => (
                                    <span key={idx} className="tech-tag">{tech}</span>
                                ))}
                            </div>

                            {project.highlights && (
                                <ul className="project-highlights">
                                    {project.highlights.map((highlight, idx) => (
                                        <li key={idx}>{highlight}</li>
                                    ))}
                                </ul>
                            )}

                            <div className="project-links">
                                {project.link && (
                                    <a
                                        href={project.link}
                                        className="project-link"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        🔗 Live Demo
                                    </a>
                                )}
                                {project.github && (
                                    <a
                                        href={project.github}
                                        className="project-link"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        💻 GitHub
                                    </a>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;
