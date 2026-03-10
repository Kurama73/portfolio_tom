import React from 'react';
import './SkillBar.css';

interface SkillBarProps {
  name: string;
  mastery: number;
}

const SkillBar: React.FC<SkillBarProps> = ({ name, mastery }) => {
  return (
    <div className="skill-container">
      <div className="skill-info">
        <span className="skill-name">{name}</span>
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
