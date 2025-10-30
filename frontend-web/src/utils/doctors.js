import banner1 from "../assets/banner1.png";
import banner2 from "../assets/banner2.png";
import avatar from "../assets/avatar.jpg";

export const doctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    hospital: "Los Angeles Heart Center",
    location: "Los Angeles, CA",
    rating: 4.8,
    experience: "10 years",
    email: "sarah.johnson@laheart.com",
    phone: "(213) 555-0199",
    priceRange: "$60 - $120 / visit",
    languages: ["English", "Spanish"],
    workingHours: "Mon - Fri: 8:00 AM - 5:00 PM",
    banner: banner1,
    avatar: avatar,
    about: `
      Dr. Sarah Johnson is a board-certified cardiologist with over 10 years of experience
      in diagnosing and treating cardiovascular diseases. She specializes in preventive cardiology,
      heart failure management, and patient-centered care.
    `,
  },
  {
    id: 2,
    name: "Dr. Robert Lee",
    specialty: "Dermatologist",
    hospital: "New York Skin Clinic",
    location: "New York, NY",
    rating: 4.7,
    experience: "8 years",
    email: "robert.lee@nyskin.com",
    phone: "(646) 555-0134",
    priceRange: "$70 - $130 / visit",
    languages: ["English", "Mandarin"],
    workingHours: "Tue - Sat: 9:00 AM - 6:00 PM",
    banner: banner2,
    avatar: avatar,
    about: `
      Dr. Robert Lee is an experienced dermatologist specializing in acne treatment,
      laser therapy, and skin rejuvenation. He believes in combining advanced dermatological
      technology with personalized care.
    `,
  },
  {
    id: 3,
    name: "St. Mary Hospital",
    specialty: "General Hospital",
    hospital: "St. Mary Central Hospital",
    location: "San Diego, CA",
    rating: 4.9,
    experience: "25 years of service",
    email: "contact@stmaryhospital.org",
    phone: "(858) 555-0112",
    priceRange: "$50 - $200 depending on service",
    languages: ["English", "Spanish", "Vietnamese"],
    workingHours: "24/7 Emergency Department",
    banner: banner1,
    avatar: avatar,
    about: `
      St. Mary Hospital is one of the leading general hospitals in California, offering
      comprehensive healthcare services from pediatrics to cardiology. The hospital is known
      for its compassionate staff and advanced medical technology.
    `,
  },
  {
    id: 4,
    name: "Dr. Emily Carter",
    specialty: "Neurologist",
    hospital: "California Brain Institute",
    location: "Los Angeles, CA",
    rating: 4.9,
    experience: "12 years",
    email: "emily.carter@cbinst.org",
    phone: "(310) 555-0178",
    priceRange: "$100 - $180 / visit",
    languages: ["English", "French"],
    workingHours: "Mon - Fri: 9:00 AM - 4:30 PM",
    banner: banner2,
    avatar: avatar,
    about: `
      Dr. Emily Carter specializes in neurology and neuroscience research, focusing on
      epilepsy, migraines, and cognitive disorders. She’s known for her holistic and patient-first
      approach to brain health.
    `,
  },
  {
    id: 5,
    name: "Dr. Michael Nguyen",
    specialty: "Pediatrician",
    hospital: "Children’s Health Center",
    location: "Houston, TX",
    rating: 4.6,
    experience: "9 years",
    email: "michael.nguyen@childrenshc.org",
    phone: "(832) 555-0155",
    priceRange: "$50 - $100 / visit",
    languages: ["English", "Vietnamese"],
    workingHours: "Mon - Sat: 8:30 AM - 6:00 PM",
    banner: banner1,
    avatar: avatar,
    about: `
      Dr. Michael Nguyen is a caring pediatrician committed to supporting child development,
      vaccinations, and general pediatric care. Parents appreciate his friendly and communicative style.
    `,
  },
  {
    id: 6,
    name: "Sunrise Medical Center",
    specialty: "Multi-specialty Hospital",
    hospital: "Sunrise Medical Center",
    location: "San Francisco, CA",
    rating: 4.8,
    experience: "15 years of service",
    email: "info@sunrisemedical.com",
    phone: "(415) 555-0102",
    priceRange: "$80 - $250 depending on service",
    languages: ["English", "Spanish"],
    workingHours: "Mon - Sun: 7:00 AM - 10:00 PM",
    banner: banner2,
    avatar: avatar,
    about: `
      Sunrise Medical Center offers multidisciplinary healthcare services with a focus
      on cardiology, orthopedics, and women’s health. Known for modern facilities and a
      highly skilled medical team.
    `,
  },
];
