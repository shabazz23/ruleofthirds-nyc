'use client';

import { useState } from 'react';
import Reveal from '../../components/Reveal';

// Messages are delivered to info@ruleofthirds.nyc by Web3Forms (web3forms.com).
// This access key only lets the form send to that inbox, so it is safe to keep
// in the site code. To change the inbox, create a new key at web3forms.com.
const WEB3FORMS_KEY = '';
const INBOX = 'info@ruleofthirds.nyc';

export default function Contact() {
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Hidden field only bots fill in: quietly drop those submissions.
    if (data.get('botcheck')) {
      setStatus('sent');
      return;
    }
    if (!WEB3FORMS_KEY) {
      setStatus('error');
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `Website inquiry: ${data.get('subject')}`,
          from_name: 'Rule of Thirds website',
          name: data.get('name'),
          email: data.get('email'),
          topic: data.get('subject'),
          message: data.get('message'),
          botcheck: '',
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success) {
        form.reset();
        setStatus('sent');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <section className="page-hero center">
        <Reveal>
          <p className="eyebrow">Contact</p>
          <h1>
            Get in <em>Touch</em>
          </h1>
        </Reveal>
      </section>

      <section className="contact-grid">
        <Reveal>
          <p className="lede">
            For creative collaborations, inquiries, partnerships, or general
            correspondence, we&rsquo;d love to hear from you.
          </p>
        </Reveal>
        <Reveal>
          {status === 'sent' ? (
            <div className="form-done" role="status">
              <h3>Thank you.</h3>
              <p>Your message is on its way. We&rsquo;ll be in touch soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <input
                type="checkbox"
                name="botcheck"
                className="form-trap"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />
              <div className="field">
                <label htmlFor="name">Name</label>
                <input id="name" name="name" required autoComplete="name" maxLength={120} />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" required autoComplete="email" maxLength={200} />
              </div>
              <div className="field">
                <label htmlFor="subject">Subject</label>
                <input id="subject" name="subject" required maxLength={160} />
              </div>
              <div className="field">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" required maxLength={5000} />
              </div>
              <button className="btn" type="submit" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Send Message'}
              </button>
              {status === 'error' ? (
                <p className="form-note form-error" role="alert">
                  Something went wrong sending your message. Please try again, or email us
                  at <a href={`mailto:${INBOX}`}>{INBOX}</a>.
                </p>
              ) : (
                <p className="form-note">
                  Or email us directly at <a href={`mailto:${INBOX}`}>{INBOX}</a>.
                </p>
              )}
            </form>
          )}
        </Reveal>
      </section>
    </>
  );
}
