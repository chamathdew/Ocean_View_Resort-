import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ROOM_DATA } from "../utils/roomData";

export default function RoomDetails() {
    const { type } = useParams();
    const navigate = useNavigate();
    const [activeImage, setActiveImage] = useState(0);

    // Default to Double if type is invalid
    const room = ROOM_DATA[type] || ROOM_DATA.Double;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!room) return <div className="container">Room not found</div>;

    return (
        <div className="room-detail-page">
            {/* Hero Section */}
            <section
                className="room-hero"
                style={{
                    height: '70vh',
                    position: 'relative',
                    background: `url(${room.images[activeImage]}) center/cover no-repeat`,
                    transition: 'background 0.5s ease-in-out'
                }}
            >
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.8))' }}></div>
                <div className="container" style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'flex-end', paddingBottom: 60 }}>
                    <div style={{ color: 'white' }}>
                        <span className="badge" style={{ background: 'var(--accent)', color: 'var(--primary)', border: 'none' }}>{room.category}</span>
                        <h1 style={{ color: 'white', fontSize: 'clamp(32px, 5vw, 64px)', margin: '12px 0' }}>{room.name}</h1>
                        <div style={{ display: 'flex', gap: 24, fontSize: 16 }}>
                            <span>✦ {room.capacity}</span>
                            <span>✦ Ocean View</span>
                            <span>✦ LKR {room.price.toLocaleString()} / Night</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="page">
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 60, alignItems: 'start' }}>

                        {/* Left Content */}
                        <div>
                            <div style={{ marginBottom: 40 }}>
                                <h2 style={{ fontSize: 32, marginBottom: 20 }}>About this Suite</h2>
                                <p style={{ fontSize: 17, color: 'var(--text-light)', lineHeight: 1.8, marginBottom: 24 }}>
                                    {room.longDescription}
                                </p>
                                <div style={{ height: 1, background: 'var(--border)', width: '100%', margin: '40px 0' }}></div>
                            </div>

                            {/* Gallery Thumbs */}
                            <div style={{ marginBottom: 40 }}>
                                <h3 style={{ fontSize: 20, marginBottom: 16 }}>Photo Gallery</h3>
                                <div style={{ display: 'flex', gap: 12 }}>
                                    {room.images.map((img, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => setActiveImage(idx)}
                                            style={{
                                                width: 100,
                                                height: 70,
                                                borderRadius: 12,
                                                overflow: 'hidden',
                                                cursor: 'pointer',
                                                border: activeImage === idx ? '2px solid var(--accent)' : '1px solid var(--border)',
                                                boxShadow: activeImage === idx ? 'var(--shadow-md)' : 'none',
                                                transition: 'all 0.3s'
                                            }}
                                        >
                                            <img src={img} alt="room" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Amenities */}
                            <div>
                                <h3 style={{ fontSize: 20, marginBottom: 20 }}>Premium Amenities</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                    {room.amenities.map(item => (
                                        <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14 }}>
                                            <span style={{
                                                width: 32,
                                                height: 32,
                                                borderRadius: '50%',
                                                background: 'var(--bg)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'var(--accent)',
                                                fontSize: 12
                                            }}>✓</span>
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Sticky Sidebar */}
                        <div style={{ position: 'sticky', top: 120 }}>
                            <div style={{
                                background: 'var(--card)',
                                padding: 40,
                                borderRadius: 32,
                                border: '1px solid var(--border)',
                                boxShadow: 'var(--shadow-lg)'
                            }}>
                                <h3 style={{ fontSize: 24, marginBottom: 24 }}>What We Offer</h3>
                                <div style={{ display: 'grid', gap: 24, marginBottom: 32 }}>
                                    {room.offers.map((offer, idx) => (
                                        <div key={idx} style={{
                                            padding: 24,
                                            background: 'var(--bg)',
                                            borderRadius: 20,
                                            border: '1px solid var(--border)',
                                            transition: 'transform 0.3s'
                                        }}>
                                            <h4 style={{ margin: '0 0 8px 0', fontSize: 16, color: 'var(--primary)' }}>{offer.title}</h4>
                                            <p style={{ margin: 0, fontSize: 13, color: 'var(--text-light)', lineHeight: 1.5 }}>{offer.description}</p>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ padding: '24px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: 32 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                        <span style={{ color: 'var(--text-light)' }}>Starting from</span>
                                        <span style={{ fontSize: 28, fontWeight: 800, color: 'var(--primary)' }}>LKR {room.price.toLocaleString()}</span>
                                    </div>
                                    <span style={{ fontSize: 12, color: 'var(--text-light)' }}>* Prices vary by season and demand.</span>
                                </div>

                                <Link
                                    to="/book"
                                    className="btn btn-accent"
                                    style={{ width: '100%', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
                                >
                                    Configure & Book Now
                                </Link>
                                <div style={{ textAlign: 'center', marginTop: 16 }}>
                                    <Link to="/" style={{ fontSize: 13, color: 'var(--text-light)' }}>Back to all rooms</Link>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Experience Section */}
            <section style={{ padding: '100px 0', background: 'var(--primary)', color: 'white', textAlign: 'center' }}>
                <div className="container">
                    <h2 style={{ color: 'var(--accent)', fontSize: 36, marginBottom: 20 }}>The Ocean View Experience</h2>
                    <p style={{ maxWidth: 800, margin: '0 auto', fontSize: 18, opacity: 0.8, lineHeight: 1.8 }}>
                        Whether you're seeking a romantic getaway, a family adventure, or a solo retreat, our rooms are designed to provide the ultimate coastal luxury. Immerse yourself in the tranquility of the Indian Ocean and let our hospitality redefine your travel experience.
                    </p>
                </div>
            </section>
        </div>
    );
}
