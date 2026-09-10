"use client";

import { useRef, useState, useActionState, useEffect, startTransition } from 'react';
import { AnimatedButton } from '@drivexstudio/animations';
import { Input } from '@modules/forms/components/Input';
import { FormHoneypot } from '@modules/forms/components/FormHoneypot'; 
import { useSpamPrevention } from '@modules/forms/hooks/useSpamPrevention'; 
import { cx } from '@libs/vendor'; 
import { subscribeToNewsletter } from '@libs/actions/newsletter'; 

export function NewsletterForm({
  heading,
  description,
  buttonText,
  successMessage = "You're on the list.",
  buttonTheme = "dark",
  className
}) {
  const formRef = useRef(null);
  
  const { checkSpam, enhanceFormData, reset } = useSpamPrevention({ formRef });
  
  const [state, action, isPending] = useActionState(subscribeToNewsletter, { success: false, error: "" });
  const [localError, setLocalError] = useState(null);
  
  const onSubmit = (e) => {
    e.preventDefault();
    setLocalError(null);
    
    const form = formRef.current;
    if (!form) return;
    
    const spamCheck = checkSpam(form);
    if (spamCheck.isSpam) {
      setLocalError(spamCheck.message);
      return;
    }
    
    const formData = enhanceFormData(new FormData(form));
    startTransition(() => {
      action(formData);
    });
  };
  
  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      reset();
    }
  }, [state.success, reset]);
  
  if (state.success) {
    return (
      <div className={className}>
        {heading && <p className="mb-8 font-medium text-body text-foreground">{heading}</p>}
        <p className="text-body text-foreground-muted">{successMessage}</p>
      </div>
    );
  }
  
  const displayError = localError || (!state.success && state.error) ? (localError || state.error) : null;
  
  return (
    <div className={className}>
      {heading && <p className="mb-8 font-medium text-body text-foreground">{heading}</p>}
      {description && <p className="mb-16 text-body-sm text-foreground-muted">{description}</p>}
      
      <form ref={formRef} onSubmit={onSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-6">
          <Input type="text" name="name" placeholder="Name" required autoComplete="name" size="sm" />
          <Input type="email" name="email" placeholder="Email" required autoComplete="email" size="sm" />
          <AnimatedButton type="submit" disabled={isPending} theme={buttonTheme} size="sm" className="w-full">
            {buttonText ?? "Subscribe"}
          </AnimatedButton>
        </div>
        
        <FormHoneypot />
        
        <p className="text-body-sm text-foreground-muted opacity-60">Unsubscribe anytime.</p>
        
        {displayError && (
          <p className={cx("text-body-sm", buttonTheme === "dark" ? "text-brand" : "text-red-500")}>
            {displayError}
          </p>
        )}
      </form>
    </div>
  );
}