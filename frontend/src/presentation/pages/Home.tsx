import React, { useState, useEffect } from 'react';
import { PortfolioService } from '../../domain/services/portfolio.service';
import SkillBar from '../components/SkillBar';
import ProjectCard from '../components/ProjectCard';
import ProjectModal from '../components/ProjectModal';
import type { Project, ProfessionalExperience, Formation, Passion, IutCompetence } from '../../domain/models';
import FormationModal from '../components/FormationModal';
import ProfExperienceModal from '../components/ProfExperienceModal';
import './Home.css';

const Home: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);
  const [selectedProfExperience, setSelectedProfExperience] = useState<ProfessionalExperience | null>(null);
  const [formations, setFormations] = useState<Formation[]>([]);
  const [professionalExperiences, setProfessionalExperiences] = useState<ProfessionalExperience[]>([]);
  const [passions, setPassions] = useState<Passion[]>([]);
  const [iutCompetences, setIutCompetences] = useState<IutCompetence[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          formationsData,
          profExpData,
          passionsData,
          competencesData,
          projectsData
        ] = await Promise.all([
          PortfolioService.getFormations(),
          PortfolioService.getProfessionalExperiences(),
          PortfolioService.getPassions(),
          PortfolioService.getIutCompetences(),
          PortfolioService.getProjects()
        ]);

        setFormations(formationsData);
        setProfessionalExperiences(profExpData);
        setPassions(passionsData);
        setIutCompetences(competencesData);
        setProjects(projectsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const isModalOpen = selectedProject || selectedFormation || selectedProfExperience;
    if (isModalOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [selectedProject, selectedFormation, selectedProfExperience]);

  const handleOpenProjectModal = (project: Project) => {
    setSelectedProject(project);
  };

  const handleOpenFormationModal = (formation: Formation) => {
    setSelectedFormation(formation);
  };

  const handleOpenProfExperienceModal = (experience: ProfessionalExperience) => {
    setSelectedProfExperience(experience);
  };

  const handleCloseModals = () => {
    setSelectedProject(null);
    setSelectedFormation(null);
    setSelectedProfExperience(null);
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="home-page animate-fade-in">

      {/* SECTION ACCUEIL ET PHOTO */}
      <section id="home" className="hero-section">
        <div className="profile-photo-container">
          <img src="https://ui-avatars.com/api/?name=Tom+Frumy&background=ff4d00&color=fff&size=200" alt="Tom Frumy" className="profile-photo" />
        </div>
        <h1 className="hero-title">Tom Frumy<span className="dot">.</span></h1>
        <p className="hero-subtitle">Étudiant Développeur & Passionné</p>
        <div className="hero-bio">
          Développeur passionné par l'innovation et le spatial.
          Expertise technique et rigueur opérationnelle au service de projets à fort impact.
        </div>
      </section>

      {/* SECTION PARCOURS */}
      <section id="parcours" className="timeline-section">
        <h2 className="section-title">Mon Parcours</h2>
        <p className="section-subtitle">Formation et expériences professionnelles. Cliquez pour découvrir les compétences acquises.</p>

        {/* FORMATIONS */}
        <div className="parcours-subsection">
          <h3 className="subsection-title">🎓 Formation</h3>
          {formations.length === 0 ? (
            <p>Chargement des formations...</p>
          ) : (
            <div className="timeline-grid">
              {formations.map(formation => (
                <div key={formation.id} className="mac-card timeline-card formation-card" onClick={() => handleOpenFormationModal(formation)}>
                  <div className="timeline-header">
                    <span className="timeline-company">{formation.institution}</span>
                    <span className="timeline-period">{formation.period}</span>
                  </div>
                  <h3 className="timeline-title">{formation.title}</h3>
                  <p className="timeline-desc">{formation.description}</p>
                  <div className="formation-type-badge">{formation.type}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* EXPERIENCES PROFESSIONNELLES */}
        <div className="parcours-subsection">
          <h3 className="subsection-title">💼 Expériences Professionnelles</h3>
          {professionalExperiences.length === 0 ? (
            <p>Chargement des expériences...</p>
          ) : (
            <div className="timeline-grid">
              {professionalExperiences.map(exp => (
                <div key={exp.id} className="mac-card timeline-card experience-card" onClick={() => handleOpenProfExperienceModal(exp)}>
                  <div className="timeline-header">
                    <span className="timeline-company">{exp.company}</span>
                    <span className="timeline-period">{exp.period}</span>
                  </div>
                  <h3 className="timeline-title">{exp.title}</h3>
                  <p className="timeline-desc">{exp.description}</p>
                  <div className="experience-type-badge">{exp.type}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SECTION PROJETS */}
      <section id="projects" className="projects-section">
        <h2 className="section-title">Mes Projets</h2>
        <p className="section-subtitle">Cliquez sur un projet pour voir les détails.</p>
        <div className="projects-grid">
          {projects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => handleOpenProjectModal(project)}
            />
          ))}
        </div>
      </section>

      {/* SECTION PASSIONS */}
      <section id="passions" className="passions-section">
        <h2 className="section-title">Mes Passions</h2>
        <p className="section-subtitle">Ce qui m'anime au quotidien.</p>
        <div className="passions-grid">
          {passions.map(passion => (
            <div key={passion.id} className="mac-card passion-card">
              <div className="passion-image">
                <img src={passion.imageUrl} alt={passion.name} />
              </div>
              <div className="passion-content">
                <h3>{passion.name}</h3>
                <p>{passion.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION IUT */}
      <section id="iut" className="iut-section">
        <h2 className="section-title">Référentiel B.U.T Informatique</h2>
        <p className="section-subtitle">
          Projets associés et progression sur les 6 compétences clés.
        </p>
        <div className="iut-grid">
          {iutCompetences.map(comp => {
            const linkedProjects = PortfolioService.getProjectsByCompetence(projects, comp.id);
            return (
              <div key={comp.id} className="mac-card iut-card">
                <h3>{comp.name}</h3>
                <p className="iut-desc">{comp.description}</p>
                <SkillBar name="Niveau d'acquisition" mastery={comp.level} />

                {linkedProjects.length > 0 && (
                  <div className="linked-projects-area">
                    <h4>Projets associés :</h4>
                    <div className="linked-projects-pills">
                      {linkedProjects.map(p => (
                        <button
                          key={p.id}
                          className="project-pill"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenProjectModal(p);
                          }}
                        >
                          {p.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* MODALS */}
      {selectedProject && (
        <div className="modal-overlay" onClick={handleCloseModals}>
          <ProjectModal project={selectedProject} onClose={handleCloseModals} />
        </div>
      )}
      {selectedFormation && (
        <div className="modal-overlay" onClick={handleCloseModals}>
          <FormationModal formation={selectedFormation} onClose={handleCloseModals} />
        </div>
      )}
      {selectedProfExperience && (
        <div className="modal-overlay" onClick={handleCloseModals}>
          <ProfExperienceModal experience={selectedProfExperience} onClose={handleCloseModals} />
        </div>
      )}

    </div>
  );
};

export default Home;