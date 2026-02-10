import React from "react";

export default function About() {
    return (
        <div className="about-page">
            {/* Hero Section */}
            <section className="hero" style={{ padding: '100px 0', minHeight: '400px', display: 'flex', alignItems: 'center' }}>
                <div className="container">
                    <span className="badge">Our Heritage</span>
                    <h1>A Legacy of Coastal Luxury</h1>
                    <p style={{ maxWidth: '700px', margin: '0 auto' }}>Since 1998, Ocean View Resort has been a sanctuary for those seeking the perfect blend of serenity, sophistication, and Sri Lankan hospitality.</p>
                </div>
            </section>

            {/* Story Section */}
            <section className="page" style={{ padding: '80px 0' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px', alignItems: 'center' }}>
                        <div className="about-img-wrap" style={{ borderRadius: '32px', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
                            <img
                                src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80"
                                alt="Resort View"
                                style={{ width: '100%', height: 'auto', display: 'block' }}
                            />
                        </div>

                        <div className="about-content">
                            <div className="section-title" style={{ marginBottom: '32px' }}>
                                <span>Established 1998</span>
                                <h2>The Ocean View Story</h2>
                            </div>
                            <p style={{ color: 'var(--text-light)', fontSize: '17px', marginBottom: '24px' }}>
                                Nestled on the pristine southern shores of Galle, Ocean View Resort began as a boutique family retreat. Over the decades, it has evolved into a world-class destination while maintaining the warmth and personal touch that defines true luxury.
                            </p>
                            <p style={{ color: 'var(--text-light)', fontSize: '17px' }}>
                                Our architecture pays homage to the colonial heritage of the region, seamlessly integrated with modern amenities and sustainable practices. Every corner of our resort is designed to connect you with the rhythms of the Indian Ocean.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section style={{ background: 'var(--card)', padding: '100px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                <div className="container">
                    <div className="section-title" style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <span>Our Principles</span>
                        <h2>Why Choose Ocean View?</h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
                        <div style={{ padding: '40px', borderRadius: '24px', background: 'var(--bg)', border: '1px solid var(--border)', textAlign: 'center' }}>
                            <div style={{ fontSize: '40px', marginBottom: '20px' }}>🏝️</div>
                            <h3 style={{ marginBottom: '16px' }}>Pristine Location</h3>
                            <p style={{ color: 'var(--text-light)' }}>Direct access to secluded beaches and panoramic views of the horizon from every suite.</p>
                        </div>

                        <div style={{ padding: '40px', borderRadius: '24px', background: 'var(--bg)', border: '1px solid var(--border)', textAlign: 'center' }}>
                            <div style={{ fontSize: '40px', marginBottom: '20px' }}>🍳</div>
                            <h3 style={{ marginBottom: '16px' }}>Gourmet Dining</h3>
                            <p style={{ color: 'var(--text-light)' }}>A culinary journey featuring organic local produce and fresh seafood caught daily by local fishermen.</p>
                        </div>

                        <div style={{ padding: '40px', borderRadius: '24px', background: 'var(--bg)', border: '1px solid var(--border)', textAlign: 'center' }}>
                            <div style={{ fontSize: '40px', marginBottom: '20px' }}>💆</div>
                            <h3 style={{ marginBottom: '16px' }}>Holistic Wellness</h3>
                            <p style={{ color: 'var(--text-light)' }}>Traditional Ayurvedic treatments and modern spa therapies designed to rejuvenate your soul.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="page" style={{ padding: '80px 0', textAlign: 'center' }}>
                <div className="container">
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '80px' }}>
                        <div>
                            <div style={{ fontSize: '48px', fontWeight: '800', color: 'var(--accent)', fontFamily: 'Playfair Display, serif' }}>25+</div>
                            <div style={{ color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '12px', marginTop: '8px' }}>Years of Excellence</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '48px', fontWeight: '800', color: 'var(--accent)', fontFamily: 'Playfair Display, serif' }}>40</div>
                            <div style={{ color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '12px', marginTop: '8px' }}>Luxury Suites</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '48px', fontWeight: '800', color: 'var(--accent)', fontFamily: 'Playfair Display, serif' }}>150+</div>
                            <div style={{ color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '12px', marginTop: '8px' }}>Dedicated Staff</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '48px', fontWeight: '800', color: 'var(--accent)', fontFamily: 'Playfair Display, serif' }}>12k</div>
                            <div style={{ color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '12px', marginTop: '8px' }}>Happy Guests</div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
