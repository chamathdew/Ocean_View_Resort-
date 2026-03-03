import React, { useState } from "react";

export default function Help() {
    const faqs = [
        {
            q: "What are the standard check-in and check-out times?",
            a: "Standard check-in is at 2:00 PM and check-out is at 12:00 PM. Early check-in or late check-out is subject to availability and may incur additional charges."
        },
        {
            q: "Is breakfast included in the room rate?",
            a: "Most of our luxury suites include a gourmet complementary breakfast. Please check your specific reservation details for confirmation."
        },
        {
            q: "Do you provide airport transportation?",
            a: "Yes, we offer premium airport transfers. You can book this through our Admin panel or by contacting our concierge desk directly."
        },
        {
            q: "What is your cancellation policy?",
            a: "Cancellations made 48 hours prior to arrival are free of charge. Late cancellations or no-shows will be charged for the first night."
        },
        {
            q: "Are pets allowed at the resort?",
            a: "To ensure the comfort of all our guests, we maintain a no-pet policy, with the exception of certified service animals."
        }
    ];

    return (
        <div className="help-page">
            <section className="about-hero hero">
                <div className="container">
                    <span className="badge">Concierge Desk</span>
                    <h1>How can we assist you?</h1>
                    <p>Find answers to common questions or reach out to our dedicated support team for personalized assistance.</p>
                </div>
            </section>

            <section className="page" style={{ padding: '80px 0' }}>
                <div className="container">
                    <div className="help-content-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px' }}>

                        {/* FAQ Section */}
                        <div className="faq-section">
                            <div className="section-title" style={{ marginBottom: '40px' }}>
                                <span>Common Questions</span>
                                <h2>Frequently Asked Questions</h2>
                            </div>

                            <div className="faq-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {faqs.map((item, index) => (
                                    <div key={index} className="glass-panel" style={{ padding: '24px', transition: 'all 0.3s ease' }}>
                                        <h4 style={{ margin: '0 0 12px', color: 'var(--primary)', fontSize: '18px' }}>{item.q}</h4>
                                        <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '15px' }}>{item.a}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Contact Form Section */}
                        <div className="contact-section">
                            <div className="glass-panel" style={{ padding: '40px', position: 'sticky', top: '100px' }}>
                                <div className="section-title" style={{ marginBottom: '32px' }}>
                                    <span>Direct Line</span>
                                    <h3>Send a Message</h3>
                                </div>

                                <form className="checkout-form" onSubmit={(e) => e.preventDefault()}>
                                    <div className="field">
                                        <label className="label">Full Name</label>
                                        <input className="input" placeholder="Your Name" />
                                    </div>
                                    <div className="field">
                                        <label className="label">Email Address</label>
                                        <input className="input" type="email" placeholder="example@mail.com" />
                                    </div>
                                    <div className="field">
                                        <label className="label">Your Message</label>
                                        <textarea className="input" style={{ height: '120px', resize: 'none', padding: '15px' }} placeholder="How can we help?"></textarea>
                                    </div>
                                    <button className="btn btn-primary" style={{ width: '100%' }}>Send Message</button>
                                </form>

                                <div className="divider" style={{ margin: '32px 0' }}></div>

                                <div className="concierge-box">
                                    <p>Emergency Assistance? <br />
                                        <strong className="primary-text" style={{ fontSize: '18px' }}>+94 11 234 5678</strong>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
