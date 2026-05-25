import React from 'react';
import { useDocuments } from '../context/DocumentContext';
import { useUI } from '../context/UIContext';
import UploadBox from '../components/knowledge/UploadBox';
import DocumentList from '../components/knowledge/DocumentList';
import Sidebar from '../components/chat/Sidebar';
import KnowledgeAestheticBackground from '../components/knowledge/KnowledgeAestheticBackground';
import ThemeTransitionOverlay from '../components/common/ThemeTransitionOverlay';
import PremiumThemePortalToggle from '../components/common/PremiumThemePortalToggle';
import './KnowledgePage.css';

const KnowledgeBasePage = () => {
  const { documents, loading } = useDocuments();
  const { isDark, toggleTheme } = useUI();

  return (
    <main className="knowledge-page-premium">
      <ThemeTransitionOverlay isDark={isDark} />
      <KnowledgeAestheticBackground />

      <div className="flex h-screen overflow-hidden relative">
        <Sidebar />
        
        <div className="flex-1 flex flex-col h-full relative z-10 overflow-y-auto custom-scrollbar">
          <section className="knowledge-main-shell">
            <header className="knowledge-header">
              <div className="animate-fade-in">
                <p className="knowledge-eyebrow">Document Intelligence</p>
                <h1>Knowledge Base</h1>
                <p>Upload and vectorize documents to power your AI reasoning engine.</p>
              </div>

              <div className="knowledge-header-actions flex items-center gap-4">
                <PremiumThemePortalToggle isDark={isDark} onToggle={toggleTheme} />
                <span className="knowledge-sync-pill">● Vector Store Synced</span>
              </div>
            </header>

            <section className="knowledge-stats-grid">
              <article className="knowledge-stat-card animate-fade-in" style={{ animationDelay: '0.05s' }}>
                <div className="knowledge-stat-icon">📄</div>
                <strong>{documents?.length || 0}</strong>
                <span>Total Documents</span>
              </article>

              <article className="knowledge-stat-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="knowledge-stat-icon">🧠</div>
                <strong>{documents?.length ? "Active" : "Ready"}</strong>
                <span>Vector Index</span>
              </article>

              <article className="knowledge-stat-card animate-fade-in" style={{ animationDelay: '0.15s' }}>
                <div className="knowledge-stat-icon">⚡</div>
                <strong>{loading ? "Syncing" : "Synced"}</strong>
                <span>Processing Status</span>
              </article>

              <article className="knowledge-stat-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="knowledge-stat-icon">🔒</div>
                <strong>Secure</strong>
                <span>Private Library</span>
              </article>
            </section>

            <section className="knowledge-content-grid">
              <div className="knowledge-left-column">
                <div className="animate-fade-in" style={{ animationDelay: '0.25s' }}>
                  <UploadBox />
                </div>
                
                <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                  <section className="knowledge-panel knowledge-library-card">
                    <div className="knowledge-panel-inner">
                      <div className="knowledge-library-top">
                        <div>
                          <h2>Library Explorer</h2>
                          <p>Manage documents currently available to your AI assistant.</p>
                        </div>
                      </div>
                      <DocumentList />
                    </div>
                  </section>
                </div>
              </div>

              <aside className="knowledge-right-panel animate-fade-in" style={{ animationDelay: '0.35s' }}>
                <section className="knowledge-info-card">
                  <h3>RAG Pipeline</h3>
                  <div className="knowledge-pipeline-list">
                    <div className="knowledge-pipeline-step">
                      <span className="knowledge-step-number">1</span>
                      <div>
                        <strong>Upload</strong>
                        <span>Documents enter the knowledge workspace.</span>
                      </div>
                    </div>
                    <div className="knowledge-pipeline-step">
                      <span className="knowledge-step-number">2</span>
                      <div>
                        <strong>Chunk</strong>
                        <span>Text is split into retrievable sections.</span>
                      </div>
                    </div>
                    <div className="knowledge-pipeline-step">
                      <span className="knowledge-step-number">3</span>
                      <div>
                        <strong>Embed</strong>
                        <span>Chunks are converted into vector memory.</span>
                      </div>
                    </div>
                    <div className="knowledge-pipeline-step">
                      <span className="knowledge-step-number">4</span>
                      <div>
                        <strong>Retrieve</strong>
                        <span>Chat answers use the most relevant sources.</span>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="knowledge-info-card">
                  <h3>Supported Sources</h3>
                  <div className="knowledge-chip-row">
                    <span className="knowledge-chip">PDF</span>
                    <span className="knowledge-chip">DOCX</span>
                    <span className="knowledge-chip">TXT</span>
                    <span className="knowledge-chip">Markdown</span>
                    <span className="knowledge-chip">Notes</span>
                    <span className="knowledge-chip">Reports</span>
                  </div>
                </section>

                <section className="knowledge-info-card">
                  <h3>Safety Checks</h3>
                  <div className="knowledge-pipeline-list">
                    <div className="knowledge-pipeline-step">
                      <span className="knowledge-step-number">✓</span>
                      <div>
                        <strong>Private by default</strong>
                        <span>Only your workspace documents should be used.</span>
                      </div>
                    </div>
                    <div className="knowledge-pipeline-step">
                      <span className="knowledge-step-number">✓</span>
                      <div>
                        <strong>Source-grounded</strong>
                        <span>Assistant responses can cite uploaded files.</span>
                      </div>
                    </div>
                  </div>
                </section>
              </aside>
            </section>
          </section>
        </div>
      </div>
    </main>
  );
};

export default KnowledgeBasePage;

