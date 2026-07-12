"use client";

import { AvatarExpression, AvatarStyle } from "@/lib/types";
import { AVATAR_COLORS } from "@/lib/avatar-styles";

interface AvatarProps {
  style: AvatarStyle;
  expression: AvatarExpression;
  size?: "sm" | "md" | "lg";
  speaking?: boolean;
}

type Colors = { body: string; face: string; accent: string; highlight: string };

function getColors(style: string): Colors {
  return AVATAR_COLORS[style] || AVATAR_COLORS.bear;
}

function Eyes({ expression, accent, celebrating }: { expression: AvatarExpression; accent: string; celebrating?: boolean }) {
  const happy = expression === "happy" || expression === "celebrating";
  const big = celebrating || expression === "encouraging";
  const r = big ? 5.5 : 4;

  return (
    <>
      {/* Left eye */}
      {happy ? (
        <path d={`M 32 37 Q 38 ${big ? 32 : 34} 44 37`} stroke={accent} strokeWidth={2.5} fill="none" strokeLinecap="round" />
      ) : (
        <>
          <circle cx={38} cy={38} r={r} fill={accent} />
          <circle cx={36} cy={36} r={2} fill="white" />
        </>
      )}
      {/* Right eye */}
      {happy ? (
        <path d={`M 56 37 Q 62 ${big ? 32 : 34} 68 37`} stroke={accent} strokeWidth={2.5} fill="none" strokeLinecap="round" />
      ) : (
        <>
          <circle cx={62} cy={38} r={r} fill={accent} />
          <circle cx={60} cy={36} r={2} fill="white" />
        </>
      )}
    </>
  );
}

function Mouth({ expression, accent }: { expression: AvatarExpression; accent: string }) {
  switch (expression) {
    case "happy":
    case "celebrating":
      return <path d="M 35 54 Q 50 68 65 54" stroke={accent} strokeWidth="2.5" fill="none" strokeLinecap="round" />;
    case "encouraging":
      return (
        <g>
          <ellipse cx={50} cy={58} rx={7} ry={5} fill={accent} />
          <ellipse cx={50} cy={56} rx={5} ry={3} fill="white" opacity={0.6} />
        </g>
      );
    case "speaking":
      return <ellipse cx={50} cy={57} rx={6} ry={7} fill={accent} />;
    default:
      return <path d="M 38 56 Q 50 60 62 56" stroke={accent} strokeWidth="2" fill="none" strokeLinecap="round" />;
  }
}

function Cheeks({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <>
      <circle cx={26} cy={52} r={6} fill="#FFB6C1" opacity={0.4} />
      <circle cx={74} cy={52} r={6} fill="#FFB6C1" opacity={0.4} />
    </>
  );
}

function Ears({ type, colors }: { type: string; colors: Colors }) {
  switch (type) {
    case "bear":
      return (
        <>
          <circle cx={20} cy={22} r={14} fill={colors.body} />
          <circle cx={80} cy={22} r={14} fill={colors.body} />
          <circle cx={20} cy={22} r={8} fill={colors.face} />
          <circle cx={80} cy={22} r={8} fill={colors.face} />
        </>
      );
    case "bunny":
      return (
        <>
          <ellipse cx={35} cy={10} rx={8} ry={22} fill={colors.body} />
          <ellipse cx={65} cy={10} rx={8} ry={22} fill={colors.body} />
          <ellipse cx={35} cy={10} rx={4} ry={16} fill={colors.face} />
          <ellipse cx={65} cy={10} rx={4} ry={16} fill={colors.face} />
        </>
      );
    case "cat":
    case "mermaid":
      return (
        <>
          <polygon points="18,30 28,8 38,28" fill={colors.body} />
          <polygon points="62,28 72,8 82,30" fill={colors.body} />
          <polygon points="22,28 28,14 34,28" fill={colors.face} />
          <polygon points="66,28 72,14 78,28" fill={colors.face} />
        </>
      );
    case "dog":
      return (
        <>
          <ellipse cx={22} cy={38} rx={16} ry={10} fill={colors.highlight} transform="rotate(-20 22 38)" />
          <ellipse cx={78} cy={38} rx={16} ry={10} fill={colors.highlight} transform="rotate(20 78 38)" />
        </>
      );
    case "owl":
      return (
        <>
          <polygon points="18,28 26,6 34,28" fill={colors.body} />
          <polygon points="66,28 74,6 82,28" fill={colors.body} />
          <polygon points="22,26 26,12 30,26" fill={colors.face} />
          <polygon points="70,26 74,12 78,26" fill={colors.face} />
        </>
      );
    case "dinosaur":
    case "dragon":
      return (
        <>
          <ellipse cx={30} cy={12} rx={6} ry={10} fill={colors.accent} />
          <ellipse cx={50} cy={8} rx={5} ry={8} fill={colors.accent} />
          <ellipse cx={70} cy={12} rx={6} ry={10} fill={colors.accent} />
        </>
      );
    default:
      return null;
  }
}

function Accessory({ type, expression, colors }: { type: string; expression: AvatarExpression; colors: Colors }) {
  switch (type) {
    case "unicorn":
      return (
        <g>
          <path d="M 50 12 L 46 0 L 54 2 Z" fill="#FFD700" />
          <path d="M 46 0 L 42 -6 L 50 2" fill="#FF69B4" />
          {expression === "celebrating" && (
            <>
              <circle cx={20} cy={16} r={3} fill="#FFD700" opacity={0.7} />
              <circle cx={80} cy={16} r={3} fill="#FFD700" opacity={0.7} />
              <circle cx={30} cy={8} r={2} fill="#FF69B4" opacity={0.7} />
              <circle cx={70} cy={8} r={2} fill="#FF69B4" opacity={0.7} />
            </>
          )}
        </g>
      );
    case "robot":
      return (
        <g>
          <line x1={50} y1={8} x2={50} y2={18} stroke={colors.accent} strokeWidth={3} />
          <circle cx={50} cy={6} r={4} fill={expression === "celebrating" ? "#FFD700" : colors.accent} />
        </g>
      );
    case "fairy":
      return (
        <g>
          <path d="M 28 22 L 32 8 L 38 16 L 44 4 L 50 14 L 56 4 L 62 16 L 68 8 L 72 22" fill="#FFD700" />
          {expression === "celebrating" && (
            <>
              <text x={8} y={18} fontSize={12}>✨</text>
              <text x={80} y={18} fontSize={12}>✨</text>
            </>
          )}
        </g>
      );
    case "wizard":
      return (
        <g>
          <polygon points="50,-2 30,24 70,24" fill={colors.accent} />
          <polygon points="50,2 34,22 66,22" fill={colors.highlight} />
          <circle cx={50} cy={10} r={3} fill="#FFD700" />
        </g>
      );
    case "superhero":
      return (
        <g>
          <path d="M 28 26 L 50 8 L 72 26" fill={colors.accent} />
          <path d="M 34 26 L 50 12 L 66 26" fill={colors.highlight} />
          <text x={44} y={22} fontSize={8} fill="white" fontWeight="bold">S</text>
        </g>
      );
    case "princess":
      return (
        <g>
          <path d="M 28 24 L 32 8 L 38 16 L 44 4 L 50 14 L 56 4 L 62 16 L 68 8 L 72 24" fill="#FFD700" />
          <circle cx={44} cy={8} r={2} fill="#FF69B4" />
          <circle cx={56} cy={8} r={2} fill="#FF69B4" />
        </g>
      );
    case "ninja":
      return (
        <g>
          <rect x={18} y={18} width={64} height={16} rx={4} fill={colors.accent} />
          <rect x={42} y={24} width={16} height={8} rx={2} fill="white" opacity={0.9} />
        </g>
      );
    case "pirate":
      return (
        <g>
          <ellipse cx={50} cy={14} rx={28} ry={6} fill={colors.accent} />
          <rect x={22} y={14} width={56} height={6} fill={colors.accent} />
          <circle cx={72} cy={10} r={3} fill="white" />
        </g>
      );
    case "astronaut":
      return (
        <g>
          <rect x={16} y={12} width={68} height={14} rx={4} fill={colors.highlight} />
          <rect x={30} y={14} width={8} height={10} rx={2} fill="#4CAF50" />
          <rect x={62} y={14} width={8} height={10} rx={2} fill="#F44336" />
        </g>
      );
    case "frog":
      return (
        <g>
          <circle cx={30} cy={18} r={12} fill={colors.body} />
          <circle cx={70} cy={18} r={12} fill={colors.body} />
          <circle cx={30} cy={18} r={7} fill="white" />
          <circle cx={70} cy={18} r={7} fill="white" />
          <circle cx={30} cy={18} r={4} fill={colors.accent} />
          <circle cx={70} cy={18} r={4} fill={colors.accent} />
        </g>
      );
    default:
      return null;
  }
}

function AvatarSvg({ style, expression, colors }: { style: string; expression: AvatarExpression; colors: Colors }) {
  const isRobot = style === "robot";
  const isAstronaut = style === "astronaut";
  const isDino = style === "dinosaur" || style === "dragon";
  const celebrating = expression === "celebrating";
  const hasMuzzle = ["bear", "bunny", "dog", "cat", "dinosaur", "dragon", "unicorn"].includes(style);

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <Ears type={style} colors={colors} />
      <Accessory type={style} expression={expression} colors={colors} />
      {/* Head */}
      {isRobot ? (
        <rect x={14} y={18} width={72} height={66} rx={14} fill={colors.body} />
      ) : isAstronaut ? (
        <circle cx={50} cy={50} r={38} fill={colors.body} stroke={colors.highlight} strokeWidth={3} />
      ) : (
        <circle cx={50} cy={52} r={36} fill={colors.body} />
      )}
      {/* Face area */}
      {isRobot ? (
        <rect x={22} y={26} width={56} height={46} rx={10} fill={colors.face} />
      ) : hasMuzzle ? (
        <ellipse cx={50} cy={56} rx={20} ry={16} fill={colors.face} />
      ) : (
        <ellipse cx={50} cy={55} rx={24} ry={20} fill={colors.face} />
      )}
      {/* Nose */}
      {style === "cat" && <ellipse cx={50} cy={46} rx={3} ry={2} fill={colors.accent} />}
      {style === "bear" && <ellipse cx={50} cy={46} rx={5} ry={3} fill={colors.accent} />}
      {style === "dog" && <ellipse cx={50} cy={46} rx={6} ry={4} fill={colors.accent} />}
      {/* Eyes & mouth */}
      <Eyes expression={expression} accent={colors.accent} celebrating={celebrating} />
      <Mouth expression={expression} accent={colors.accent} />
      <Cheeks show={expression === "happy" || celebrating} />
      {/* Celebration sparkles */}
      {celebrating && (
        <g>
          <text x={4} y={14} fontSize={10}>⭐</text>
          <text x={82} y={14} fontSize={10}>⭐</text>
          <text x={2} y={70} fontSize={8}>✨</text>
          <text x={86} y={70} fontSize={8}>✨</text>
        </g>
      )}
      {/* Dino/whiskers tail spikes */}
      {isDino && (
        <path d="M 86 40 L 96 36 L 92 46 L 98 44 L 90 54" stroke={colors.accent} strokeWidth={2} fill="none" />
      )}
      {style === "cat" && (
        <>
          <line x1={22} y1={46} x2={32} y2={44} stroke={colors.accent} strokeWidth={1} />
          <line x1={22} y1={50} x2={32} y2={50} stroke={colors.accent} strokeWidth={1} />
          <line x1={68} y1={44} x2={78} y2={46} stroke={colors.accent} strokeWidth={1} />
          <line x1={68} y1={50} x2={78} y2={50} stroke={colors.accent} strokeWidth={1} />
        </>
      )}
    </svg>
  );
}

export default function Avatar({ style, expression, size = "md", speaking }: AvatarProps) {
  const colors = getColors(style);
  const sizeClasses = { sm: "w-16 h-16", md: "w-24 h-24", lg: "w-36 h-36" };

  return (
    <div
      className={`${sizeClasses[size]} transition-all duration-300 ${
        speaking ? "animate-bounce" : ""
      } ${
        expression === "celebrating" ? "animate-pulse scale-110" : ""
      }`}
    >
      <AvatarSvg style={style} expression={expression} colors={colors} />
    </div>
  );
}
