export const ROOM_DATA = {
    Single: {
        id: "single",
        name: "Standard Sanctuary",
        category: "Single Suite",
        description: "Our Standard Sanctuary offers a perfect blend of comfort and functionality for solo travelers. Designed with a calming palette and premium wood finishes, this room provides a peaceful retreat after a day of beachside exploration. Enjoy the serene garden views and a range of modern amenities tailored for your convenience.",
        longDescription: "Nestled in the quietest wing of the resort, the Standard Sanctuary is specifically curated for those seeking tranquility. The room features high ceilings, a custom-designed queen bed with 400-thread-count linens, and a dedicated workspace. Large floor-to-ceiling windows bathe the space in natural light while offering views of our meticulously landscaped tropical gardens. The en-suite bathroom is equipped with rain showers and organic toiletries made locally in Sri Lanka.",
        images: [
            "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80"
        ],
        amenities: ["Queen Bed", "Free High-Speed WiFi", "Garden View", "Personal Mini Bar", "Rain Shower", "42-inch Smart TV", "In-room Safe"],
        offers: [
            { title: "Complimentary Breakfast", description: "Enjoy a full English or Sri Lankan breakfast daily." },
            { title: "Welcome Drink", description: "Refresh yourself with our signature tropical fruit punch on arrival." },
            { title: "Yoga Access", description: "Free access to morning sunrise yoga sessions on the beach." }
        ],
        capacity: "1 Adult",
        price: 28000
    },
    Double: {
        id: "double",
        name: "Ocean Breeze Deluxe",
        category: "Double Suite",
        description: "Experience the ultimate coastal luxury in our Ocean Breeze Deluxe room. Perfectly suited for couples, this room offers breathtaking glimpses of the Indian Ocean and a private balcony to enjoy the sunset. The elegant interior design and romantic atmosphere make it a favorite for honeymooners.",
        longDescription: "The Ocean Breeze Deluxe rooms are our most popular selection for couples. Each room is spacious and airy, featuring an open-concept design that leads directly to a private balcony. The centerpiece is a luxurious king-sized canopy bed. Modern architectural elements are balanced by traditional Sri Lankan art pieces and hand-woven textiles. The balcony is furnished with comfortable lounge chairs, making it the perfect spot for morning coffee or evening cocktails while listening to the rhythmic waves.",
        images: [
            "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80"
        ],
        amenities: ["King Bed", "Ocean View", "Private Balcony", "Nespresso Coffee Machine", "Smart TV with Streaming", "Luxury Bathtub", "Premium Bathrobes"],
        offers: [
            { title: "Beach Dinner Discount", description: "15% off on romantic private dinners by the beach." },
            { title: "Spa Voucher", description: "A complimentary 30-minute foot massage at our wellness center." },
            { title: "Romantic Turn-down", description: "Bespoke room decoration and chocolates for special occasions." }
        ],
        capacity: "2 Guests",
        price: 35000
    },
    Family: {
        id: "family",
        name: "Coastal Family Haven",
        category: "Family Executive",
        description: "The Coastal Family Haven is designed for togetherness. With ample space, multiple sleeping arrangements, and child-friendly features, it ensures every member of the family has a comfortable and memorable stay. Located near the kids' pool and recreation area for easy access.",
        longDescription: "Our Family Executive rooms provide the space and privacy families need. The room layout includes two distinct sleeping areas and a central living space where the family can gather. Child safety is a priority in our design, with rounded edges and secure balcony railings. The room comes equipped with a selection of board games and kids' entertainment options. Parents can enjoy the sunset from the balcony while the children are safely entertained in the living area.",
        images: [
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=80"
        ],
        amenities: ["2 Queen Beds", "Separate Living Area", "Interconnecting Options", "Gaming Console", "Microwave & Mini Fridge", "Kid-sized Bathrobes", "Pool Access"],
        offers: [
            { title: "Kids Stay Free", description: "Children under 10 stay and eat breakfast for free." },
            { title: "Family Excursion", description: "Complimentary guided village tour for the whole family." },
            { title: "Laundry Service", description: "20% discount on laundry services for family-sized loads." }
        ],
        capacity: "4 Guests",
        price: 48000
    },
    Suite: {
        id: "suite",
        name: "The Royal Ocean Suite",
        category: "Presidential Suite",
        description: "The crown jewel of Ocean View Resort. The Royal Ocean Suite offers unparalleled luxury, panoramic 270-degree views of the horizon, and a private infinity pool. Experience world-class service with a dedicated butler ready to fulfill your every request.",
        longDescription: "Our Presidential Suite is an architectural masterpiece. Spanning over 150 square meters, it includes a grand master bedroom, a sophisticated dining hall, and an expansive terrace. The private glass-walled infinity pool seems to merge seamlessly with the Indian Ocean. Every detail, from the Italian marble floors to the hand-carved furniture, speaks of luxury. Guests of the Royal Ocean Suite enjoy priority booking at all resort restaurants and exclusive access to the VIP lounge.",
        images: [
            "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80"
        ],
        amenities: ["Panoramic Ocean View", "Private Infinity Pool", "24/7 Butler Service", "Jacuzzi & Steam Room", "Gourmet Wine Cellar", "Private Barista Service", "Luxury Airport Transfers"],
        offers: [
            { title: "VIP Airport Fast-track", description: "Skip the queues with our complimentary airport assistance." },
            { title: "Champagne on Arrival", description: "A chilled bottle of premium French champagne in your suite." },
            { title: "Private Chef Session", description: "One complimentary bespoke dinner prepared in-suite by our Executive Chef." }
        ],
        capacity: "2 Guests",
        price: 65000
    }
};
