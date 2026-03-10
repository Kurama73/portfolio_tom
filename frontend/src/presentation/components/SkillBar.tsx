import React from 'react';

interface SkillBarProps {
  name: string;
  mastery: number;
  icon?: string;
}

const SkillBar: React.FC<SkillBarProps> = ({ name, mastery, icon }) => {
  return (
    <div className="skill-container">
      <div className="skill-info">
        <div className="skill-label">
          {icon && <img src={icon} alt={name} className="skill-icon" />}
          <span className="skill-name">{name}</span>
        </div>
        <span className="skill-percentage">{mastery}%</span>
      </div>
      <div className="skill-bar-bg">
        <div
          className="skill-bar-fill"
          style={{ width: `${mastery}%` }}
        ></div>
      </div>
    </div>
  );
};

export default SkillBar;
