"use client";
import { useRef, useEffect, useCallback } from 'react';
import { gsap, ScrollTrigger, ScrambleTextPlugin } from '@libs/vendor';

const DEFAULT_SCRAMBLE_CHARS = " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";

export default function useDualLayerScramble(defaultOptions) {
  const containerRef = useRef(null);
  const timelineRef = useRef(null);
  const originalTextRef = useRef("");
  const originalHTMLRef = useRef("");
  const originalDimensionsRef = useRef(null);
  const lineDataRef = useRef([]);
  const spanElementsRef = useRef([]);
  const isAnimatingRef = useRef(false);
  const isSplitRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const text = container.innerText ?? "";

    if (text.trim().length > 0) {
      originalTextRef.current = text;
      originalHTMLRef.current = container.innerHTML;
      originalDimensionsRef.current = {
        width: container.offsetWidth,
        height: container.offsetHeight
      };
    }
  }, []);

  const killTimeline = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
      isAnimatingRef.current = false;
    }
  }, []);

  const splitText = useCallback(() => {
    if (!containerRef.current || isSplitRef.current) return;
    const container = containerRef.current;

    if ((originalTextRef.current || container.innerText || "").trim().length === 0) return;

    if (!originalDimensionsRef.current) {
      originalDimensionsRef.current = {
        width: container.offsetWidth,
        height: container.offsetHeight
      };
    }

    const getLines = (node) => {
      const text = node.innerText || "";
      if (text.trim().length === 0) return [];
      if (text.includes("\n")) return text.split("\n").filter(line => line.length > 0);

      const firstChild = node.firstChild;
      if (!firstChild || firstChild.nodeType !== Node.TEXT_NODE) return [text];

      const range = document.createRange();
      const linesArray = [];
      let currentLine = "";
      let lastTop = null;
      const textLength = firstChild.length;

      for (let i = 0; i < text.length && i < textLength; i++) {
        range.setStart(firstChild, i);
        range.setEnd(firstChild, i + 1);
        const rect = range.getBoundingClientRect();

        if (lastTop !== null && Math.abs(rect.top - lastTop) > 2) {
          if (currentLine.length > 0) {
            linesArray.push(currentLine);
          }
          currentLine = "";
        }
        currentLine += text[i];
        lastTop = rect.top;
      }

      if (currentLine.length > 0) linesArray.push(currentLine);
      return linesArray.length > 0 ? linesArray : [text];
    };

    const lines = getLines(container);
    const measureDiv = document.createElement("div");
    measureDiv.style.cssText = `
      position: absolute;
      visibility: hidden;
      pointer-events: none;
      white-space: nowrap;
    `;

    const computedStyle = window.getComputedStyle(container);
    measureDiv.style.font = computedStyle.font;
    measureDiv.style.fontSize = computedStyle.fontSize;
    measureDiv.style.fontFamily = computedStyle.fontFamily;
    measureDiv.style.fontWeight = computedStyle.fontWeight;
    measureDiv.style.letterSpacing = computedStyle.letterSpacing;
    measureDiv.style.textTransform = computedStyle.textTransform;

    document.body.appendChild(measureDiv);

    lineDataRef.current = lines.map(line => {
      measureDiv.textContent = line;
      return {
        text: line,
        width: measureDiv.offsetWidth,
        height: measureDiv.offsetHeight
      };
    });

    document.body.removeChild(measureDiv);

    const maxWidth = Math.max(...lineDataRef.current.map(line => line.width));
    const totalHeight = lineDataRef.current.reduce((sum, line) => sum + line.height, 0);
    const finalWidth = Math.max(originalDimensionsRef.current?.width ?? 0, maxWidth);
    const finalHeight = Math.max(originalDimensionsRef.current?.height ?? 0, totalHeight);

    isSplitRef.current = true;
    gsap.set(container, { width: finalWidth, height: finalHeight, display: "inline-block", overflow: "hidden" });
    container.innerHTML = "";
    spanElementsRef.current = [];

    lineDataRef.current.forEach(line => {
      const span = document.createElement("span");
      span.style.cssText = `
        display: block;
        opacity: 0;
        width: ${line.width}px;
        height: ${line.height}px;
        overflow: hidden;
        white-space: nowrap;
      `;
      span.innerText = line.text;
      container.appendChild(span);
      spanElementsRef.current.push(span);
    });

    gsap.set(container, { opacity: 1 });
  }, []);

  const scramble = useCallback((options) => {
    if (!containerRef.current) return null;
    if (isAnimatingRef.current) return timelineRef.current;

    splitText();

    const mergedOptions = { ...defaultOptions, ...options };
    const duration = mergedOptions.duration ?? 1;
    const speed = mergedOptions.speed ?? 1;
    const chars = mergedOptions.chars ?? DEFAULT_SCRAMBLE_CHARS;
    const firstColorClass = mergedOptions.firstColorClass ?? "scramble-brand";
    const secondColorClass = mergedOptions.secondColorClass ?? "scramble-foreground";
    const stagger = mergedOptions.stagger ?? 0.08;

    const lineData = lineDataRef.current;
    const spanElements = spanElementsRef.current;

    if (lineData.length === 0 || spanElements.length === 0) return null;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      spanElements.forEach((span, index) => {
        const line = lineData[index];
        if (line) span.innerText = line.text;
        span.style.opacity = "1";
        span.className = span.className.replace(/\bscramble-\w+\b/g, "");
      });
      mergedOptions.onComplete?.();
      return null;
    }

    killTimeline();
    isAnimatingRef.current = true;
    timelineRef.current = gsap.timeline({
      onComplete: () => {
        isAnimatingRef.current = false;
        timelineRef.current = null;
        mergedOptions.onComplete?.();
      }
    });

    spanElements.forEach((span, index) => {
      const line = lineData[index];
      if (!line) return;

      const lineText = line.text;
      const delay = index * stagger;

      const generateScrambledText = (originalText, scrambleChars = DEFAULT_SCRAMBLE_CHARS) => {
        let scrambled = "";
        for (let i = 0; i < originalText.length; i++) {
          const char = originalText[i];
          if (char === " ") {
            scrambled += char;
          } else {
            scrambled += scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
          }
        }
        return scrambled;
      };

      const scrambledString = generateScrambledText(lineText, chars);
      const nonSpaceCount = lineText.replace(/\s/g, "").length;
      const spaceOnlyText = lineText.replace(/[^\s]/g, " ");

      timelineRef.current?.add(() => {
        gsap.set(span, { opacity: 1 });
        span.innerText = spaceOnlyText;
      }, delay);

      timelineRef.current?.to(span, {
        duration: duration,
        scrambleText: {
          text: scrambledString,
          chars: chars,
          speed: speed,
          revealDelay: 0.1,
          oldClass: firstColorClass,
          newClass: firstColorClass
        },
        ease: "none"
      }, delay);

      timelineRef.current?.to(span, {
        duration: duration,
        scrambleText: {
          text: lineText,
          chars: chars,
          speed: speed,
          revealDelay: 0.1,
          oldClass: firstColorClass,
          newClass: secondColorClass
        },
        ease: "none"
      }, delay + (nonSpaceCount > 0 ? duration / nonSpaceCount : 0));
    });

    return timelineRef.current;
  }, [defaultOptions, killTimeline, splitText]);

  const kill = useCallback(() => {
    killTimeline();
    if (containerRef.current && isSplitRef.current) {
      containerRef.current.innerHTML = originalHTMLRef.current || originalTextRef.current;
      gsap.set(containerRef.current, { opacity: 0, width: "auto", height: "auto", overflow: "visible" });
      spanElementsRef.current = [];
      lineDataRef.current = [];
      isSplitRef.current = false;
    }
  }, [killTimeline]);

  useEffect(() => {
    return () => {
      killTimeline();
      spanElementsRef.current = [];
      lineDataRef.current = [];
      isSplitRef.current = false;
    };
  }, [killTimeline]);

  return { ref: containerRef, scramble, kill, isAnimating: isAnimatingRef.current };
}