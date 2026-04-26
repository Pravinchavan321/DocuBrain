import React from "react";
import "./ChatAestheticBackground.css";

export default function ChatAestheticBackground() {
  return (
    <div className="chat-bg-3d" aria-hidden="true">
      <div className="chat-bg-orb chat-bg-orb-one" />
      <div className="chat-bg-orb chat-bg-orb-two" />
      <div className="chat-bg-orb chat-bg-orb-three" />
      <div className="chat-bg-grid" />
      <div className="chat-bg-vignette" />
    </div>
  );
}
