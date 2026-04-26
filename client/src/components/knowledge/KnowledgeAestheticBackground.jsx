import React from "react";
import "./KnowledgeAestheticBackground.css";

export default function KnowledgeAestheticBackground() {
  return (
    <div className="knowledge-bg" aria-hidden="true">
      <div className="knowledge-bg-orb knowledge-bg-orb-one" />
      <div className="knowledge-bg-orb knowledge-bg-orb-two" />
      <div className="knowledge-bg-orb knowledge-bg-orb-three" />
      <div className="knowledge-bg-grid" />
      <div className="knowledge-bg-noise" />
      <div className="knowledge-bg-vignette" />
    </div>
  );
}
