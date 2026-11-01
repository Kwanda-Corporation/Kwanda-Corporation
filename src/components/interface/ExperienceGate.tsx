import { useEffect, useRef, useState } from 'react';
import { LANDMARKS, type LandmarkId } from '../../lib/landmarks';

const LEAVE_MS = 450;

type ExperienceGateProps = {
  id: LandmarkId;
  onContinue: () => void;
};

/**
 * A welcoming threshold shown when a destination is entered. It names the
 * place before the editorial sheet appears, so the traveller always knows
 * what they are looking at before committing to read it.
 */
export function ExperienceGate({ id, onContinue }: ExperienceGateProps) {
  const [leaving, setLeaving] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const info = LANDMARKS[id];
  const name = id === 'about' ? 'the Origin House' : info.name;

  useEffect(() => {
    buttonRef.current?.focus();
  }, []);

  const handleContinue = () => {
    if (leaving) return;
    setLeaving(true);
    window.setTimeout(onContinue, LEAVE_MS);
  };

  return (
    <div
      className={`experience-gate${leaving ? ' is-leaving' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={`Welcome to ${name}`}
    >
      <GateArch />
      <p className="gate-kicker">{info.kicker}</p>
      <h2 className="gate-title">
        <span className="gate-lead">Welcome to</span>
        <span className="gate-name">{name}</span>
      </h2>
      <button
        ref={buttonRef}
        type="button"
        className="btn btn-primary gate-continue"
        onClick={handleContinue}
      >
        Continue
        <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}

function GateArch() {
  return (
    <svg
      className="gate-arch"
      viewBox="0 0 200 120"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path d="M40 118 V62 Q40 30 100 30 Q160 30 160 62 V118" strokeWidth="2" />
      <path d="M40 118 H160" strokeWidth="2" />
      <path d="M48 116 V66 M152 116 V66" strokeWidth="1" opacity="0.45" />
    </svg>
  );
}
