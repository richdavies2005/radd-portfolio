"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";

interface TypewriterProps {
  /** Phrases typed one character at a time, cycled and looped. */
  texts: string[];
  /** Seconds per character while typing. */
  typeSpeed?: number;
  /** Seconds a fully-typed phrase holds before it deletes. */
  holdTime?: number;
  /** Seconds per character while deleting. */
  deleteSpeed?: number;
  cursorChar?: string;
  /** Class applied to a trailing period so it can be accented (e.g. flame). */
  periodClassName?: string;
  className?: string;
}

/** Split a trailing period off so it can be colored independently. */
function splitTrailingPeriod(text: string): [string, string] {
  return text.endsWith(".") ? [text.slice(0, -1), "."] : [text, ""];
}

// Source's cursor blink variants, verbatim: a near-instant opacity toggle
// (block-cursor feel) on an infinite reverse repeat with a visible/hidden
// dwell set by repeatDelay.
const CURSOR_VARIANTS: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.01,
      repeat: Infinity,
      repeatDelay: 0.4,
      repeatType: "reverse",
    },
  },
};

/**
 * Typewriter — types out a rotating list of phrases one character at a time
 * with a blinking cursor, holds each, deletes it, types the next, and loops.
 *
 * Adapted from the OriginKit "typewriter" component: the recursive-setTimeout
 * typing state machine is ported as-authored, but the Framer render-target /
 * property-panel plumbing is removed and the cursor blink uses the project's
 * Motion install (`motion/react`) instead of `framer-motion`.
 *
 * Purely decorative: the surrounding heading carries the real text and this
 * is aria-hidden, so screen readers and crawlers see a stable title. Under
 * prefers-reduced-motion it renders the first phrase, static, no cursor.
 */
export function Typewriter({
  texts,
  typeSpeed = 0.09,
  holdTime = 1.8,
  deleteSpeed = 0.04,
  cursorChar = "_",
  periodClassName,
  className,
}: TypewriterProps) {
  const reduced = useReducedMotion();
  const list = texts.filter((t): t is string => typeof t === "string");
  const hasTexts = list.length > 0;

  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  const typeDelayMs = Math.max(0, typeSpeed * 1000);
  const holdMs = Math.max(0, holdTime * 1000);
  const deleteDelayMs = Math.max(0, deleteSpeed * 1000);

  // Typing state machine — one timeout scheduled per state transition, cleared
  // on the next render/unmount; state changes drive the next iteration.
  useEffect(() => {
    if (reduced || !hasTexts) return;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const currentText = list[currentTextIndex] ?? "";

    if (isDeleting) {
      if (displayText === "") {
        setIsDeleting(false);
        setCurrentTextIndex((prev) => (prev + 1) % list.length);
        setCurrentIndex(0);
      } else {
        timeout = setTimeout(
          () => setDisplayText((prev) => prev.slice(0, -1)),
          deleteDelayMs,
        );
      }
    } else if (currentIndex < currentText.length) {
      timeout = setTimeout(() => {
        setDisplayText((prev) => prev + currentText[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, typeDelayMs);
    } else if (list.length > 1) {
      timeout = setTimeout(() => setIsDeleting(true), holdMs);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
    // `list` is rebuilt each render from `texts`; depend on its content, not
    // the array identity, so the effect doesn't double-fire every tick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentIndex,
    displayText,
    isDeleting,
    currentTextIndex,
    typeDelayMs,
    deleteDelayMs,
    holdMs,
    reduced,
    hasTexts,
  ]);

  if (reduced) {
    const [reducedBody, reducedPeriod] = splitTrailingPeriod(list[0] ?? "");
    return (
      <span className={className}>
        {reducedBody}
        {reducedPeriod && <span className={periodClassName}>{reducedPeriod}</span>}
      </span>
    );
  }

  const [body, period] = splitTrailingPeriod(displayText);

  return (
    <span className={className} style={{ whiteSpace: "pre-wrap" }}>
      {body}
      {period && <span className={periodClassName}>{period}</span>}
      <motion.span
        aria-hidden
        variants={CURSOR_VARIANTS}
        initial="initial"
        animate="animate"
        className="ml-1"
      >
        {cursorChar}
      </motion.span>
    </span>
  );
}
