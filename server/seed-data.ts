import { InsertModule, InsertProject, InsertResource } from "@shared/schema";

export const SEED_VERSION = "1.0.0";

export const seedModules: InsertModule[] = [
  {
    title: "Introduction to Quantum Physics",
    description: "Explore the fascinating world of quantum mechanics with interactive PhET simulations from University of Colorado Boulder. Learn about wave-particle duality, quantum tunneling, and the uncertainty principle through hands-on experiments.",
    subject: "Physics",
    language: "en",
    educationLevel: "High School / College",
    thumbnail: "https://phet.colorado.edu/images/phet-logo-trademarked.png",
    content: {
      format: "simulation",
      url: "https://phet.colorado.edu/en/simulations/quantum-wave-interference",
      segments: [
        { title: "Wave-Particle Duality", durationMinutes: 45 },
        { title: "Quantum Tunneling", durationMinutes: 30 },
        { title: "Double Slit Experiment", durationMinutes: 40 }
      ]
    }
  },
  {
    title: "Chemistry: Atomic Structure and Bonding",
    description: "Master the fundamentals of chemistry with interactive simulations and real experiments. Understand how atoms bond, create molecules, and react with each other using PhET's award-winning chemistry tools.",
    subject: "Chemistry",
    language: "en",
    educationLevel: "High School",
    thumbnail: "https://phet.colorado.edu/images/phet-logo-trademarked.png",
    content: {
      format: "simulation",
      url: "https://phet.colorado.edu/en/simulations/build-an-atom",
      segments: [
        { title: "Atomic Structure", durationMinutes: 35 },
        { title: "Chemical Bonding", durationMinutes: 40 },
        { title: "Molecular Geometry", durationMinutes: 35 }
      ]
    }
  },
  {
    title: "Cell Biology and Genetics",
    description: "Dive deep into the world of cells with HHMI BioInteractive resources. Explore DNA replication, protein synthesis, and genetic inheritance through 3D interactive models and virtual labs.",
    subject: "Biology",
    language: "en",
    educationLevel: "High School / College",
    thumbnail: "https://www.biointeractive.org/themes/gesso/logo.png",
    content: {
      format: "interactive",
      url: "https://www.biointeractive.org/classroom-resources/dna-structure",
      segments: [
        { title: "DNA Structure", durationMinutes: 30 },
        { title: "Protein Synthesis", durationMinutes: 45 },
        { title: "Genetic Inheritance", durationMinutes: 40 }
      ]
    }
  },
  {
    title: "Climate Change and Environmental Science",
    description: "Understand the science behind climate change using data from real research. Analyze temperature trends, carbon cycles, and ecosystem impacts with interactive visualizations from UCAR Center for Science Education.",
    subject: "Earth Science",
    language: "en",
    educationLevel: "Middle School / High School",
    thumbnail: "https://scied.ucar.edu/sites/default/files/2021-09/COMET_LOGO.png",
    content: {
      format: "interactive",
      url: "https://scied.ucar.edu/learning-zone/earth-system/climate-change",
      segments: [
        { title: "Greenhouse Effect", durationMinutes: 35 },
        { title: "Carbon Cycle", durationMinutes: 40 },
        { title: "Climate Models", durationMinutes: 50 }
      ]
    }
  },
  {
    title: "Newton's Laws of Motion",
    description: "Master classical mechanics with The Physics Classroom's comprehensive tutorials. Learn about forces, acceleration, and momentum through interactive problems and real-world applications.",
    subject: "Physics",
    language: "en",
    educationLevel: "High School",
    thumbnail: "https://www.physicsclassroom.com/getattachment/Class/newtlaws/u2l1a1.png",
    content: {
      format: "tutorial",
      url: "https://www.physicsclassroom.com/class/newtlaws",
      segments: [
        { title: "First Law: Inertia", durationMinutes: 30 },
        { title: "Second Law: F=ma", durationMinutes: 40 },
        { title: "Third Law: Action-Reaction", durationMinutes: 35 }
      ]
    }
  },
  {
    title: "Organic Chemistry Fundamentals",
    description: "Learn organic chemistry through virtual lab experiments with ChemCollective. Practice molecular structure, reactions, and synthesis in a safe virtual environment.",
    subject: "Chemistry",
    language: "en",
    educationLevel: "High School / College",
    thumbnail: "https://chemcollective.org/assets/modules/logo.png",
    content: {
      format: "virtual_lab",
      url: "https://chemcollective.org/vlabs",
      segments: [
        { title: "Molecular Structure", durationMinutes: 40 },
        { title: "Functional Groups", durationMinutes: 35 },
        { title: "Organic Reactions", durationMinutes: 45 }
      ]
    }
  },
  {
    title: "Ecosystem Dynamics and Biodiversity",
    description: "Explore how ecosystems work using Khan Academy's comprehensive biology course. Learn about energy flow, food webs, and the impact of human activities on biodiversity.",
    subject: "Biology",
    language: "en",
    educationLevel: "High School",
    thumbnail: "https://cdn.kastatic.org/images/khan-logo-dark-background.png",
    content: {
      format: "video_course",
      url: "https://www.khanacademy.org/science/biology/ecology",
      segments: [
        { title: "Energy Flow in Ecosystems", durationMinutes: 35 },
        { title: "Population Ecology", durationMinutes: 40 },
        { title: "Biodiversity and Conservation", durationMinutes: 45 }
      ]
    }
  },
  {
    title: "বাংলায় পদার্থবিদ্যা - SSC Physics",
    description: "10 Minute School থেকে SSC স্তরের পদার্থবিদ্যা শিখুন। বল, শক্তি, তাপ এবং আলো সম্পর্কে বাংলা ভাষায় বিস্তারিত ব্যাখ্যা এবং অনুশীলন।",
    subject: "Physics",
    language: "bn",
    educationLevel: "SSC (Class 9-10)",
    thumbnail: "https://10minuteschool.com/assets/images/logo.png",
    content: {
      format: "video_course",
      url: "https://10minuteschool.com/en/academic/101/?group=science",
      segments: [
        { title: "বল ও গতি (Force & Motion)", durationMinutes: 40 },
        { title: "কাজ, ক্ষমতা ও শক্তি (Work, Power & Energy)", durationMinutes: 45 },
        { title: "তাপ ও উষ্ণতা (Heat & Temperature)", durationMinutes: 35 }
      ]
    }
  }
];

export const seedProjects: InsertProject[] = [
  {
    title: "Galaxy Zoo: Classify Galaxies",
    description: "Join thousands of citizen scientists in classifying galaxy shapes to help professional astronomers understand galaxy formation and evolution. Your classifications contribute to real research published in scientific journals.",
    subject: "Astronomy",
    participationType: "Online",
    location: "Global - Online Participation",
    difficulty: 1,
    isActive: true,
    endDate: new Date('2025-12-31')
  },
  {
    title: "iNaturalist Bangladesh: Biodiversity Survey",
    description: "Document the incredible biodiversity of Bangladesh! Take photos of plants, animals, and insects in your area. Scientists use this data to track species distribution and conservation needs across Bangladesh.",
    subject: "Biology",
    participationType: "Field Work",
    location: "Bangladesh - All Districts",
    difficulty: 1,
    isActive: true,
    endDate: new Date('2025-12-31')
  },
  {
    title: "eBird Bangladesh: Bird Migration Tracking",
    description: "Help track bird populations and migration patterns in Bangladesh. Submit your bird sightings to contribute to one of the world's largest biodiversity databases. Great for both beginners and expert birdwatchers!",
    subject: "Ornithology",
    participationType: "Field Work",
    location: "Bangladesh - All Regions",
    difficulty: 1,
    isActive: true,
    endDate: new Date('2026-06-30')
  },
  {
    title: "CoCoRaHS: Weather Data Collection",
    description: "Join the Community Collaborative Rain, Hail & Snow Network. Measure and report precipitation data from your location to help meteorologists improve weather forecasts and climate studies.",
    subject: "Meteorology",
    participationType: "Online",
    location: "Global - Home Based",
    difficulty: 1,
    isActive: true,
    endDate: new Date('2025-12-31')
  },
  {
    title: "NASA Exoplanet Watch: Discover New Planets",
    description: "Help NASA search for planets beyond our solar system! Analyze telescope data to identify potential exoplanets. No astronomy experience needed - training provided through interactive tutorials.",
    subject: "Space Science",
    participationType: "Online",
    location: "Global - Online Analysis",
    difficulty: 2,
    isActive: true,
    endDate: new Date('2026-03-31')
  },
  {
    title: "Foldit: Protein Folding Challenge",
    description: "Solve puzzles that help scientists understand protein structures. Your solutions could contribute to medical breakthroughs in disease treatment. Combines gaming with real scientific research!",
    subject: "Biochemistry",
    participationType: "Online",
    location: "Global - Online Gaming",
    difficulty: 2,
    isActive: true,
    endDate: new Date('2025-12-31')
  },
  {
    title: "Water Quality Monitoring - Local Rivers",
    description: "Test water quality in your local rivers and streams. Learn to measure pH, dissolved oxygen, and turbidity. Share data with environmental researchers tracking water pollution in Bangladesh.",
    subject: "Environmental Science",
    participationType: "Field Work",
    location: "Bangladesh - Major Rivers",
    difficulty: 2,
    isActive: true,
    endDate: new Date('2025-09-30')
  },
  {
    title: "Solar System Observation Project",
    description: "Track the positions of planets, observe the moon phases, and record astronomical events. Build your own simple telescope and contribute to astronomical databases. Perfect for astronomy beginners!",
    subject: "Astronomy",
    participationType: "Hybrid",
    location: "Bangladesh & Online",
    difficulty: 2,
    isActive: true,
    endDate: new Date('2025-12-31')
  },
  {
    title: "Plastic Pollution Documentation",
    description: "Document and map plastic pollution in your community. Take photos, record locations, and classify plastic types. Data helps environmental organizations plan cleanup efforts and policy changes.",
    subject: "Environmental Science",
    participationType: "Field Work",
    location: "Bangladesh - Urban & Coastal Areas",
    difficulty: 1,
    isActive: true,
    endDate: new Date('2025-11-30')
  },
  {
    title: "Earthquake Data Analysis Bangladesh",
    description: "Analyze historical earthquake data for Bangladesh and surrounding regions. Learn to read seismograph data and understand tectonic plate movements. Contribute to earthquake preparedness research.",
    subject: "Geology",
    participationType: "Online",
    location: "Bangladesh - Data Analysis",
    difficulty: 3,
    isActive: true,
    endDate: new Date('2025-08-31')
  }
];

export const seedResources: InsertResource[] = [
  {
    title: "PhET Interactive Simulations - Complete Collection",
    description: "150+ free, research-based science and math simulations from University of Colorado Boulder. Available in Bengali and English. Works offline after download. Covers physics, chemistry, biology, earth science, and math.",
    subject: "Multi-Subject",
    language: "en",
    educationLevel: "K-12 / College",
    fileSize: "Various",
    filePath: "https://phet.colorado.edu/en/simulations/filter?sort=alpha&view=grid",
    thumbnail: "https://phet.colorado.edu/images/phet-logo-trademarked.png",
    tags: ["simulations", "interactive", "bengali", "offline", "K-12"]
  },
  {
    title: "Khan Academy Biology - Full Course",
    description: "Comprehensive biology course covering cell biology, genetics, evolution, ecology, and human anatomy. Includes video lessons, practice exercises, and progress tracking. Completely free forever.",
    subject: "Biology",
    language: "en",
    educationLevel: "High School / College",
    fileSize: "Online Streaming",
    filePath: "https://www.khanacademy.org/science/biology",
    thumbnail: "https://cdn.kastatic.org/images/khan-logo-dark-background.png",
    tags: ["biology", "video", "exercises", "free", "comprehensive"]
  },
  {
    title: "LabXchange Virtual Lab Experiments",
    description: "Safe virtual laboratory from Harvard University. Conduct biology and chemistry experiments online with realistic equipment and immediate feedback. Perfect for schools without lab facilities.",
    subject: "Chemistry",
    language: "en",
    educationLevel: "High School / College",
    fileSize: "Online Platform",
    filePath: "https://about.labxchange.org/featured/virtual-lab-simulations",
    thumbnail: "https://about.labxchange.org/wp-content/themes/labxchange/assets/images/logo.png",
    tags: ["virtual_lab", "chemistry", "biology", "safe", "harvard"]
  },
  {
    title: "10 Minute School - বাংলায় বিজ্ঞান শিক্ষা",
    description: "সম্পূর্ণ বাংলা ভাষায় বিজ্ঞান শিক্ষা। SSC ও HSC স্তরের পদার্থবিজ্ঞান, রসায়ন এবং জীববিজ্ঞানের সকল অধ্যায়। ভিডিও লেকচার, কুইজ এবং লাইভ ক্লাস সহ।",
    subject: "Multi-Subject",
    language: "bn",
    educationLevel: "SSC / HSC",
    fileSize: "Online Streaming",
    filePath: "https://10minuteschool.com/en/academic/101/?group=science",
    thumbnail: "https://10minuteschool.com/assets/images/logo.png",
    tags: ["bengali", "ssc", "hsc", "video", "live_class", "bangladesh"]
  },
  {
    title: "The Physics Classroom - Complete Physics Tutorials",
    description: "In-depth physics tutorials covering mechanics, waves, electricity, magnetism, and modern physics. Includes interactive diagrams, practice problems with solutions, and concept builders.",
    subject: "Physics",
    language: "en",
    educationLevel: "High School",
    fileSize: "Online",
    filePath: "https://www.physicsclassroom.com/class",
    thumbnail: "https://www.physicsclassroom.com/images/logo.png",
    tags: ["physics", "tutorials", "problems", "high_school", "interactive"]
  },
  {
    title: "HHMI BioInteractive - 3D Molecular Visualizations",
    description: "Award-winning 3D animations and interactive models of biological processes. Explore DNA replication, protein synthesis, cell division, and more at the molecular level. Used by educators worldwide.",
    subject: "Biology",
    language: "en",
    educationLevel: "High School / College",
    fileSize: "Online Streaming",
    filePath: "https://www.biointeractive.org/",
    thumbnail: "https://www.biointeractive.org/themes/gesso/logo.png",
    tags: ["3d", "molecular_biology", "animations", "cell_biology", "genetics"]
  },
  {
    title: "ChemCollective Virtual Lab Activities",
    description: "Virtual chemistry lab from Carnegie Mellon University. Includes murder mystery scenarios, forensic analysis, and traditional chemistry experiments. All experiments are scenario-based for engagement.",
    subject: "Chemistry",
    language: "en",
    educationLevel: "High School / College",
    fileSize: "Online Platform",
    filePath: "https://chemcollective.org/vlabs",
    thumbnail: "https://chemcollective.org/assets/modules/logo.png",
    tags: ["chemistry", "virtual_lab", "scenarios", "problem_solving", "safe"]
  },
  {
    title: "OpenStax - Free College Science Textbooks",
    description: "Peer-reviewed, openly licensed college textbooks for Biology, Chemistry, Physics, Anatomy & Physiology, and more. Available as free PDF downloads or low-cost print versions.",
    subject: "Multi-Subject",
    language: "en",
    educationLevel: "College",
    fileSize: "PDF (Various sizes)",
    filePath: "https://openstax.org/subjects/science",
    thumbnail: "https://openstax.org/dist/images/logo.svg",
    tags: ["textbooks", "college", "pdf", "free", "peer_reviewed"]
  },
  {
    title: "NASA Space Place - Learn About Space!",
    description: "Games, activities, and articles about space and Earth science from NASA. Perfect for younger students (ages 8-13) interested in astronomy, planets, space exploration, and Earth science.",
    subject: "Space Science",
    language: "en",
    educationLevel: "Elementary / Middle School",
    fileSize: "Online Platform",
    filePath: "https://spaceplace.nasa.gov/",
    thumbnail: "https://spaceplace.nasa.gov/review/sun/sun-icon.en.png",
    tags: ["nasa", "space", "kids", "games", "astronomy", "earth_science"]
  },
  {
    title: "CK-12 Foundation - Free STEM Textbooks",
    description: "Customizable K-12 science textbooks with embedded videos, simulations, and practice problems. Covers all science subjects from elementary through AP level. Create your own custom textbook!",
    subject: "Multi-Subject",
    language: "en",
    educationLevel: "K-12",
    fileSize: "Online & PDF",
    filePath: "https://www.ck12.org/science/",
    thumbnail: "https://www.ck12.org/images/logos/ck12-logo.png",
    tags: ["textbooks", "k12", "customizable", "free", "interactive", "ap"]
  },
  {
    title: "Molecular Workbench - Nanotechnology Simulations",
    description: "Interactive experiments in physics, chemistry, biology, biotechnology, and nanotechnology. Visualize atoms and molecules in motion. Great for understanding molecular-level phenomena.",
    subject: "Physics",
    language: "en",
    educationLevel: "High School / College",
    fileSize: "Online/Downloadable",
    filePath: "https://mw.concord.org/modeler/",
    thumbnail: "https://concord.org/sites/default/files/images/logos/mw-logo.png",
    tags: ["molecular", "nanotechnology", "simulations", "physics", "chemistry"]
  },
  {
    title: "Bozeman Science - AP & High School Videos",
    description: "Paul Andersen's comprehensive video collection covering AP Biology, AP Chemistry, AP Environmental Science, Physics, and Anatomy. Aligned with AP standards and Next Generation Science Standards.",
    subject: "Multi-Subject",
    language: "en",
    educationLevel: "High School / AP",
    fileSize: "Online Streaming",
    filePath: "https://www.bozemanscience.com/",
    thumbnail: "https://www.bozemanscience.com/images/logo.png",
    tags: ["video", "ap", "ngss", "biology", "chemistry", "physics"]
  }
];
