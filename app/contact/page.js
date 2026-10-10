'use client';

import { useState } from 'react';
import Reveal from '../../components/Reveal';

export default function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // No backend yet — the form goes live with the store launch.
    setSent(true);
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
          {sent ? (
            <div className="form-done">
              <h3>Thank you.</h3>
              <p>
                This form goes live with our next update — for now, reach us through the
                links above or below.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="name">Name</label>
                <input id="name" name="name" required autoComplete="name" />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" required autoComplete="email" />
              </div>
              <div className="field">
                <label htmlFor="subject">Subject</label>
                <input id="subject" name="subject" required />
              </div>
              <div className="field">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" required />
              </div>
              <button className="btn" type="submit">
                Send Message
              </button>
              <p className="form-note">Direct messaging opens soon.</p>
            </form>
          )}
        </Reveal>
      </section>
    </>
  );
}
