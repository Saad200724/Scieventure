// Import generated images
import webOfLifeImg from '@assets/generated_images/web_of_life_ecosystem_forest.png';
import photosynthesisImg from '@assets/generated_images/photosynthesis_plant_power_leaves.png';
import atomicStructureImg from '@assets/generated_images/atomic_structure_basics_atoms.png';
import chemicalReactionsImg from '@assets/generated_images/chemical_reactions_lab_experiment.png';
import physicsMotionImg from '@assets/generated_images/physics_of_motion_forces.png';
import energyHeatImg from '@assets/generated_images/energy_heat_transfer_waves.png';
import bioLabImg from '@assets/generated_images/biology_lab_manual_scientific.png';
import chemFormulaImg from '@assets/generated_images/chemistry_formula_handbook_reference.png';
import physicsGuideImg from '@assets/generated_images/physics_problem_guide_solutions.png';
import mathCheatImg from '@assets/generated_images/mathematics_cheat_sheet_formulas.png';
import scientificMethodImg from '@assets/generated_images/scientific_method_workbook_procedures.png';
import envScienceImg from '@assets/generated_images/environmental_science_guide_nature.png';
import climateMonitoringImg from '@assets/generated_images/climate_monitoring_bangladesh_data.png';
import airQualityImg from '@assets/generated_images/urban_air_quality_study_stations.png';
import renewableEnergyImg from '@assets/generated_images/renewable_energy_research_sources.png';
import biodiversityImg from '@assets/generated_images/biodiversity_survey_species.png';

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
    thumbnail: webOfLifeImg,
    rating: 4.8,
    studentCount: 1240,
    progress: 0
  },
  {
    id: 2,
    title: "Photosynthesis: Plant Power",
    description: "Learn how plants convert sunlight into chemical energy through the amazing process of photosynthesis.",
    subject: "Biology",
    difficulty: 3,
    duration: 60,
    lessons: 10,
    thumbnail: photosynthesisImg,
    rating: 4.9,
    studentCount: 890,
    progress: 0
  },
  {
    id: 3,
    title: "Atomic Structure Basics",
    description: "Discover the building blocks of matter and understand the structure of atoms, electrons, and nuclei.",
    subject: "Chemistry",
    difficulty: 2,
    duration: 50,
    lessons: 9,
    thumbnail: atomicStructureImg,
    rating: 4.7,
    studentCount: 1567,
    progress: 0
  },
  {
    id: 4,
    title: "Chemical Reactions Lab",
    description: "Perform virtual experiments to understand different types of chemical reactions and their properties.",
    subject: "Chemistry",
    difficulty: 3,
    duration: 75,
    lessons: 12,
    thumbnail: chemicalReactionsImg,
    rating: 4.6,
    studentCount: 2034,
    progress: 0
  },
  {
    id: 5,
    title: "Physics of Motion",
    description: "Master Newton's laws and understand the principles governing movement and forces.",
    subject: "Physics",
    difficulty: 3,
    duration: 55,
    lessons: 11,
    thumbnail: physicsMotionImg,
    rating: 4.9,
    studentCount: 1456,
    progress: 0
  },
  {
    id: 6,
    title: "Energy & Heat Transfer",
    description: "Explore different forms of energy and how heat moves through conduction, convection, and radiation.",
    subject: "Physics",
    difficulty: 2,
    duration: 50,
    lessons: 8,
    thumbnail: energyHeatImg,
    rating: 4.8,
    studentCount: 934,
    progress: 0
  }
];

export const DEMO_PROJECTS = [
  {
    id: 1,
    title: "Climate Monitoring Bangladesh",
    description: "Monitor temperature, rainfall, and air quality across Bangladesh regions to contribute to climate research.",
    subject: "Environmental Science",
    difficulty: 2,
    participationType: "Open Participation",
    status: "Active",
    participants: [
      { firstName: "Rahman", lastName: "Siddiqui", username: "rsiddiqui", initials: "RS" },
      { firstName: "Maliha", lastName: "Hasan", username: "mhasan", initials: "MH" },
      { firstName: "Farhan", lastName: "Ahmed", username: "fahmed", initials: "FA" }
    ],
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    location: "All Bangladesh",
    thumbnail: climateMonitoringImg
  },
  {
    id: 2,
    title: "Urban Air Quality Study",
    description: "Analyze air pollution levels in major cities and contribute to environmental awareness.",
    subject: "Environmental Science",
    difficulty: 2,
    participationType: "Open Participation",
    status: "Active",
    participants: [
      { firstName: "Kabir", lastName: "Ahmed", username: "kahmed", initials: "KA" },
      { firstName: "Sabrina", lastName: "Rahman", username: "srahman", initials: "SR" },
      { firstName: "Leena", lastName: "Nur", username: "lnur", initials: "LN" }
    ],
    endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    location: "Major Cities",
    thumbnail: airQualityImg
  },
  {
    id: 3,
    title: "Renewable Energy Research",
    description: "Investigate sustainable energy solutions and their potential for rural electrification.",
    subject: "Physics",
    difficulty: 3,
    participationType: "Open Participation",
    status: "Active",
    participants: [
      { firstName: "Nadia", lastName: "Jahan", username: "njahan", initials: "NJ" },
      { firstName: "Abdul", lastName: "Basit", username: "abasit", initials: "AB" },
      { firstName: "Rashid", lastName: "Khan", username: "rkhan", initials: "RK" }
    ],
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    location: "Rural Areas",
    thumbnail: renewableEnergyImg
  },
  {
    id: 4,
    title: "Biodiversity Survey",
    description: "Document and catalog local plant and animal species in your region.",
    subject: "Biology",
    difficulty: 2,
    participationType: "Open Participation",
    status: "Active",
    participants: [
      { firstName: "Rahman", lastName: "Siddiqui", username: "rsiddiqui", initials: "RS" },
      { firstName: "Maliha", lastName: "Hasan", username: "mhasan", initials: "MH" }
    ],
    endDate: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000),
    location: "Various Regions",
    thumbnail: biodiversityImg
  },
  {
    id: 5,
    title: "Water Quality Testing",
    description: "Test and analyze water samples from local sources to assess environmental health.",
    subject: "Chemistry",
    difficulty: 2,
    participationType: "Open Participation",
    status: "Active",
    participants: [
      { firstName: "Farhan", lastName: "Ahmed", username: "fahmed", initials: "FA" },
      { firstName: "Kabir", lastName: "Ahmed", username: "kahmed", initials: "KA" },
      { firstName: "Sabrina", lastName: "Rahman", username: "srahman", initials: "SR" }
    ],
    endDate: new Date(Date.now() + 55 * 24 * 60 * 60 * 1000),
    location: "Local Sources",
    thumbnail: airQualityImg
  },
  {
    id: 6,
    title: "Astronomy Observation Network",
    description: "Contribute to scientific observations of celestial objects and track astronomical events.",
    subject: "Physics",
    difficulty: 3,
    participationType: "Open Participation",
    status: "Active",
    participants: [
      { firstName: "Leena", lastName: "Nur", username: "lnur", initials: "LN" },
      { firstName: "Nadia", lastName: "Jahan", username: "njahan", initials: "NJ" }
    ],
    endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
    location: "All Bangladesh",
    thumbnail: renewableEnergyImg
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
    thumbnail: bioLabImg,
    tags: ["lab", "manual", "practical"],
    filePath: "/resources/bio-manual.pdf"
  },
  {
    id: 2,
    title: "Chemistry Formula Handbook",
    description: "Essential chemical formulas, equations, and reference tables for quick lookup",
    subject: "Chemistry",
    fileSize: "2.8 MB",
    downloadCount: 687,
    thumbnail: chemFormulaImg,
    tags: ["formula", "reference", "handbook"],
    filePath: "/resources/chem-handbook.pdf"
  },
  {
    id: 3,
    title: "Physics Problem-Solving Guide",
    description: "Step-by-step solutions to common physics problems across all topics",
    subject: "Physics",
    fileSize: "3.5 MB",
    downloadCount: 445,
    thumbnail: physicsGuideImg,
    tags: ["formula", "problems", "solutions"],
    filePath: "/resources/physics-guide.pdf"
  },
  {
    id: 4,
    title: "Mathematics Cheat Sheet",
    description: "Quick reference guide for mathematical formulas and concepts",
    subject: "Mathematics",
    fileSize: "1.9 MB",
    downloadCount: 891,
    thumbnail: mathCheatImg,
    tags: ["formula", "reference", "quick"],
    filePath: "/resources/math-sheet.pdf"
  },
  {
    id: 5,
    title: "Scientific Method Workbook",
    description: "Interactive workbook for understanding experimental design and data analysis",
    subject: "General Science",
    fileSize: "5.1 MB",
    downloadCount: 334,
    thumbnail: scientificMethodImg,
    tags: ["worksheet", "practical", "methods"],
    filePath: "/resources/method-workbook.pdf"
  },
  {
    id: 6,
    title: "Environmental Science Guide",
    description: "Comprehensive guide to ecology, climate systems, and conservation",
    subject: "Environmental Science",
    fileSize: "6.3 MB",
    downloadCount: 412,
    thumbnail: envScienceImg,
    tags: ["textbook", "reference", "guide"],
    filePath: "/resources/env-guide.pdf"
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
