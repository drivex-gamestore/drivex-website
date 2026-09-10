"use client";

import React, { useState, useEffect, useRef, useCallback } from "react"; 

const DEFAULT_HONEYPOT_FIELD = "website";

export function FormHoneypot() {
  return (
    <input
      type="text"
      name={DEFAULT_HONEYPOT_FIELD}
      autoComplete="off"
      tabIndex={-1}
      aria-hidden="true"
      className="pointer-events-none absolute -left-[9999px] -z-10 h-px w-px overflow-hidden opacity-0"
    />
  );
}

export function useSpamPrevention({
  honeypotField = DEFAULT_HONEYPOT_FIELD,
  honeypotDuration = 2000,
  formRef,
  debug = false
} = {}) {
  const startTimeRef = useRef(Date.now());
  const [hasInteraction, setHasInteraction] = useState(false);

  useEffect(() => {
    const handleInteraction = () => {
      if (debug) {
        console.log("[Spam Prevention] User interaction detected");
      }
      setHasInteraction(true);
    };

    const events = ["keydown", "mousemove", "touchstart", "click"];
    const target = formRef?.current ?? document;

    if (debug) {
      console.log("[Spam Prevention] Initialized", {
        honeypotField,
        honeypotDuration,
        target: formRef?.current ? "form" : "document"
      });
    }

    for (const event of events) {
      target.addEventListener(event, handleInteraction, { once: true });
    }

    return () => {
      for (const event of events) {
        target.removeEventListener(event, handleInteraction);
      }
    };
  }, [formRef, debug, honeypotField, honeypotDuration]);

  const checkSpam = useCallback(
    (formElement) => {
      const fillTime = Date.now() - startTimeRef.current;
      const isTooFast = fillTime < honeypotDuration;
      const honeypotInput = formElement.querySelector(`[name="${honeypotField}"]`);
      const hasHoneypotValue = !!honeypotInput?.value?.trim();
      const noInteraction = !hasInteraction;

      if (debug) {
        console.log("[Spam Prevention] Spam check:", {
          fillTime: `${fillTime}ms`,
          isTooFast,
          hasHoneypotValue,
          honeypotValue: honeypotInput?.value || "(empty)",
          noInteraction
        });
      }

      if (hasHoneypotValue) {
        return {
          isSpam: true,
          reason: "honeypot_filled",
          message: "Invalid submission detected. Please refresh the page and try again."
        };
      }
      
      if (isTooFast) {
        return {
          isSpam: true,
          reason: "too_fast",
          message: "Please take your time filling out the form. Form submissions are processed after a brief delay."
        };
      }
      
      if (noInteraction) {
        return {
          isSpam: true,
          reason: "no_interaction",
          message: "Please interact with the form fields before submitting. Click or type in the fields to continue."
        };
      }

      return { isSpam: false };
    },
    [honeypotField, honeypotDuration, hasInteraction, debug]
  );

  const getMetadata = useCallback(() => {
    return {
      hasInteraction,
      fillTime: Date.now() - startTimeRef.current,
      startTime: startTimeRef.current
    };
  }, [hasInteraction]);

  const enhanceFormData = useCallback(
    (formData) => {
      const fillTime = Date.now() - startTimeRef.current;
      formData.append("_submissionTime", String(fillTime));
      
      if (debug) {
        console.log("[Spam Prevention] Enhanced form data with submission time:", `${fillTime}ms`);
      }
      
      return formData;
    },
    [debug]
  );

  const reset = useCallback(() => {
    startTimeRef.current = Date.now();
    setHasInteraction(false);

    const handleInteraction = () => {
      if (debug) {
        console.log("[Spam Prevention] User interaction detected");
      }
      setHasInteraction(true);
    };

    const target = formRef?.current ?? document;
    const events = ["keydown", "mousemove", "touchstart", "click"];

    for (const event of events) {
      target.addEventListener(event, handleInteraction, { once: true });
    }

    if (debug) {
      console.log("[Spam Prevention] Reset - timing and interaction tracking restarted");
    }
  }, [formRef, debug]);

  return { checkSpam, getMetadata, enhanceFormData, reset };
}