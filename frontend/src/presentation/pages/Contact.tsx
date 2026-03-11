import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Contact.css';

const Contact: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    _honeypot: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('http://localhost:3001/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '', _honeypot: '' });
      } else {
        const data = await response.json();
        setErrorMessage(data.error || t('contact.form.error'));
        setStatus('error');
      }
    } catch (error) {
      console.error("Erreur d'envoi:", error);
      setStatus('error');
    }
  };

  return (
    <div id="contact" className="contact-page animate-fade-in">
      <div className="contact-header">
        <h1 className="section-title">{t('contact.title')}<span className="dot">.</span></h1>
        <p className="section-subtitle">{t('contact.subtitle')}</p>
      </div>

      <div className="contact-content">
        <div className="mac-card contact-info-card static-card">
          <h3 className="info-card-title">{t('contact.info.title')}</h3>

          <div className="info-item">
            <div className="info-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <div className="info-text">
              <h4>{t('contact.info.location')}</h4>
              <p>Lyon / Chambéry</p>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            <div className="info-text">
              <h4>{t('contact.info.email')}</h4>
              <p>tomfrumy@ik.me</p>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </div>
            <div className="info-text">
              <h4>{t('contact.info.social')}</h4>
              <p className="social-links">
                <a href="https://www.linkedin.com/in/tom-frumy-78b154295" target="_blank" rel="noreferrer">LinkedIn</a>
                <span className="separator">/</span>
                <a href="https://github.com/Kurama73?tab=repositories" target="_blank" rel="noreferrer">GitHub</a>
              </p>
            </div>
          </div>
        </div>

        {/* Colonne de Droite : Formulaire */}
        <div className="mac-card contact-form-card static-card">
          <form className="contact-form" onSubmit={handleSubmit}>

            <div className="form-group-row">
              <div className="form-group">
                <label>{t('contact.form.name')}</label>
                <input
                  type="text"
                  className="clean-input"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>{t('contact.form.email')}</label>
                <input
                  type="email"
                  className="clean-input"
                  placeholder="john@domain.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>{t('contact.form.subject')}</label>
              <input
                type="text"
                className="clean-input"
                placeholder="..."
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>{t('contact.form.message')}</label>
              <textarea
                className="clean-input"
                rows={6}
                placeholder="..."
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                required
              ></textarea>
            </div>

            <div className="form-group" style={{ display: 'none' }}>
              <label>Ne pas remplir ce champ</label>
              <input
                type="text"
                value={formData._honeypot}
                onChange={e => setFormData({ ...formData, _honeypot: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className={`primary-button submit-btn ${status === 'loading' ? 'loading' : ''}`}
              disabled={status === 'loading'}
            >
              {status === 'loading' ? t('contact.form.sending') : t('contact.form.send')}
            </button>

            {status === 'success' && (
              <p className="status-message success">{t('contact.form.success')}</p>
            )}
            {status === 'error' && (
              <p className="status-message error">{errorMessage || t('contact.form.error')}</p>
            )}

          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
