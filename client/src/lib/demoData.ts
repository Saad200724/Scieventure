// Demo data for all pages
export const DEMO_MODULES = [
  {
    id: 1,
    title: "Web of Life: Understanding Ecosystems",
    description: "Explore the intricate relationships between organisms and their environment in this comprehensive ecosystem module.",
    subject: "Biology",
    difficulty: 2,
    duration: 45,
    lessons: 8,
    thumbnail: "🌿"
  },
  {
    id: 2,
    title: "Photosynthesis: Plant Power",
    description: "Learn how plants convert sunlight into chemical energy through the amazing process of photosynthesis.",
    subject: "Biology",
    difficulty: 3,
    duration: 60,
    lessons: 10,
    thumbnail: "☀️"
  },
  {
    id: 3,
    title: "Atomic Structure Basics",
    description: "Discover the building blocks of matter and understand the structure of atoms, electrons, and nuclei.",
    subject: "Chemistry",
    difficulty: 2,
    duration: 50,
    lessons: 9,
    thumbnail: "⚛️"
  },
  {
    id: 4,
    title: "Chemical Reactions Lab",
    description: "Perform virtual experiments to understand different types of chemical reactions and their properties.",
    subject: "Chemistry",
    difficulty: 3,
    duration: 75,
    lessons: 12,
    thumbnail: "🧪"
  },
  {
    id: 5,
    title: "Physics of Motion",
    description: "Master Newton's laws and understand the principles governing movement and forces.",
    subject: "Physics",
    difficulty: 3,
    duration: 55,
    lessons: 11,
    thumbnail: "🚀"
  },
  {
    id: 6,
    title: "Energy & Heat Transfer",
    description: "Explore different forms of energy and how heat moves through conduction, convection, and radiation.",
    subject: "Physics",
    difficulty: 2,
    duration: 50,
    lessons: 8,
    thumbnail: "🔥"
  }
];

export const DEMO_PROJECTS = [
  {
    id: 1,
    title: "Climate Monitoring Bangladesh",
    description: "Monitor temperature, rainfall, and air quality across Bangladesh regions to contribute to climate research.",
    subject: "Environmental Science",
    difficulty: 2,
    participationType: "Group",
    status: "Active",
    participants: 24,
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    thumbnail: "☁️"
  },
  {
    id: 2,
    title: "Urban Air Quality Study",
    description: "Analyze air pollution levels in major cities and contribute to environmental awareness.",
    subject: "Environmental Science",
    difficulty: 2,
    participationType: "Group",
    status: "Active",
    participants: 18,
    endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    thumbnail: "💨"
  },
  {
    id: 3,
    title: "Renewable Energy Research",
    description: "Investigate sustainable energy solutions and their potential for rural electrification.",
    subject: "Physics",
    difficulty: 3,
    participationType: "Group",
    status: "Active",
    participants: 32,
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    thumbnail: "⚡"
  },
  {
    id: 4,
    title: "Biodiversity Survey",
    description: "Document and catalog local plant and animal species in your region.",
    subject: "Biology",
    difficulty: 2,
    participationType: "Individual",
    status: "Active",
    participants: 45,
    endDate: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000),
    thumbnail: "🦋"
  },
  {
    id: 5,
    title: "Water Quality Testing",
    description: "Test and analyze water samples from local sources to assess environmental health.",
    subject: "Chemistry",
    difficulty: 2,
    participationType: "Group",
    status: "Active",
    participants: 21,
    endDate: new Date(Date.now() + 55 * 24 * 60 * 60 * 1000),
    thumbnail: "💧"
  },
  {
    id: 6,
    title: "Astronomy Observation Network",
    description: "Contribute to scientific observations of celestial objects and track astronomical events.",
    subject: "Physics",
    difficulty: 3,
    participationType: "Individual",
    status: "Active",
    participants: 38,
    endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
    thumbnail: "🔭"
  }
];

export const DEMO_RESOURCES = [
  {
    id: 1,
    title: "Advanced Biology Lab Manual",
    description: "Complete laboratory procedures and protocols for advanced biology experiments",
    subject: "Biology",
    fileSize: "4.2 MB",
    downloadCount: 523,
    thumbnail: "📕",
    tags: ["lab", "manual", "practical"]
  },
  {
    id: 2,
    title: "Chemistry Formula Handbook",
    description: "Essential chemical formulas, equations, and reference tables for quick lookup",
    subject: "Chemistry",
    fileSize: "2.8 MB",
    downloadCount: 687,
    thumbnail: "📗",
    tags: ["formula", "reference", "handbook"]
  },
  {
    id: 3,
    title: "Physics Problem-Solving Guide",
    description: "Step-by-step solutions to common physics problems across all topics",
    subject: "Physics",
    fileSize: "3.5 MB",
    downloadCount: 445,
    thumbnail: "📘",
    tags: ["formula", "problems", "solutions"]
  },
  {
    id: 4,
    title: "Mathematics Cheat Sheet",
    description: "Quick reference guide for mathematical formulas and concepts",
    subject: "Mathematics",
    fileSize: "1.9 MB",
    downloadCount: 891,
    thumbnail: "📙",
    tags: ["formula", "reference", "quick"]
  },
  {
    id: 5,
    title: "Scientific Method Workbook",
    description: "Interactive workbook for understanding experimental design and data analysis",
    subject: "General Science",
    fileSize: "5.1 MB",
    downloadCount: 334,
    thumbnail: "📓",
    tags: ["worksheet", "practical", "methods"]
  },
  {
    id: 6,
    title: "Environmental Science Guide",
    description: "Comprehensive guide to ecology, climate systems, and conservation",
    subject: "Environmental Science",
    fileSize: "6.3 MB",
    downloadCount: 412,
    thumbnail: "📔",
    tags: ["textbook", "reference", "guide"]
  }
];

export const DEMO_DISCUSSIONS = [
  {
    id: 1,
    title: "How do plants adapt to different seasons?",
    author: "Maliha Hasan",
    replies: 12,
    views: 234,
    avatar: "👩‍🔬"
  },
  {
    id: 2,
    title: "Best practices for conducting chemistry experiments safely",
    author: "Rahman Siddiqui",
    replies: 8,
    views: 156,
    avatar: "👨‍🔬"
  },
  {
    id: 3,
    title: "How can we make physics more interesting in rural schools?",
    author: "Farhan Ahmed",
    replies: 15,
    views: 289,
    avatar: "👨‍💻"
  }
];

export const DEMO_EVENTS = [
  {
    id: 1,
    title: "Science Fair 2025",
    date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    location: "Dhaka Convention Center",
    description: "Annual science fair showcasing student projects"
  },
  {
    id: 2,
    title: "Environmental Awareness Workshop",
    date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    location: "Online",
    description: "Learn about sustainable practices and conservation"
  },
  {
    id: 3,
    title: "Astronomy Observation Night",
    date: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
    location: "Various locations",
    description: "Join us for a night of stargazing and learning"
  }
];
