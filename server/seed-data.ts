import { InsertModule, InsertProject, InsertResource } from "@shared/schema";

export const seedModules: InsertModule[] = [
  {
    title: "Introduction to Quantum Physics",
    description: "Explore the fascinating world of quantum mechanics with interactive PhET simulations from University of Colorado Boulder. Learn about wave-particle duality, quantum tunneling, and the uncertainty principle through hands-on experiments.",
    subject: "Physics",
    thumbnail: "https://phet.colorado.edu/images/phet-logo-trademarked.png",
    content: {
      type: "simulation",
      url: "https://phet.colorado.edu/en/simulations/quantum-wave-interference",
      sections: [
        { title: "Wave-Particle Duality", duration: "45 min" },
        { title: "Quantum Tunneling", duration: "30 min" },
        { title: "Double Slit Experiment", duration: "40 min" }
      ]
    }
  },
  {
    title: "Chemistry: Atomic Structure and Bonding",
    description: "Master the fundamentals of chemistry with interactive simulations and real experiments. Understand how atoms bond, create molecules, and react with each other using PhET's award-winning chemistry tools.",
    subject: "Chemistry",
    thumbnail: "https://phet.colorado.edu/images/phet-logo-trademarked.png",
    content: {
      type: "simulation",
      url: "https://phet.colorado.edu/en/simulations/build-an-atom",
      sections: [
        { title: "Atomic Structure", duration: "35 min" },
        { title: "Chemical Bonding", duration: "40 min" },
        { title: "Molecular Geometry", duration: "35 min" }
      ]
    }
  },
  {
    title: "Cell Biology and Genetics",
    description: "Dive deep into the world of cells with HHMI BioInteractive resources. Explore DNA replication, protein synthesis, and genetic inheritance through 3D interactive models and virtual labs.",
    subject: "Biology",
    thumbnail: "https://www.biointeractive.org/themes/gesso/logo.png",
    content: {
      type: "interactive",
      url: "https://www.biointeractive.org/classroom-resources/dna-structure",
      sections: [
        { title: "DNA Structure", duration: "30 min" },
        { title: "Protein Synthesis", duration: "45 min" },
        { title: "Genetic Inheritance", duration: "40 min" }
      ]
    }
  },
  {
    title: "Climate Change and Environmental Science",
    description: "Understand the science behind climate change using data from real research. Analyze temperature trends, carbon cycles, and ecosystem impacts with interactive visualizations from UCAR Center for Science Education.",
    subject: "Earth Science",
    thumbnail: "https://scied.ucar.edu/sites/default/files/2021-09/COMET_LOGO.png",
    content: {
      type: "interactive",
      url: "https://scied.ucar.edu/learning-zone/earth-system/climate-change",
      sections: [
        { title: "Greenhouse Effect", duration: "35 min" },
        { title: "Carbon Cycle", duration: "40 min" },
        { title: "Climate Models", duration: "50 min" }
      ]
    }
  },
  {
    title: "Newton's Laws of Motion",
    description: "Master classical mechanics with The Physics Classroom's comprehensive tutorials. Learn about forces, acceleration, and momentum through interactive problems and real-world applications.",
    subject: "Physics",
    thumbnail: "https://www.physicsclassroom.com/getattachment/Class/newtlaws/u2l1a1.png",
    content: {
      type: "tutorial",
      url: "https://www.physicsclassroom.com/class/newtlaws",
      sections: [
        { title: "First Law: Inertia", duration: "30 min" },
        { title: "Second Law: F=ma", duration: "40 min" },
        { title: "Third Law: Action-Reaction", duration: "35 min" }
      ]
    }
  },
  {
    title: "Organic Chemistry Fundamentals",
    description: "Learn organic chemistry through virtual lab experiments with ChemCollective. Practice molecular structure, reactions, and synthesis in a safe virtual environment.",
    subject: "Chemistry",
    thumbnail: "https://chemcollective.org/assets/modules/logo.png",
    content: {
      type: "virtual_lab",
      url: "https://chemcollective.org/vlabs",
      sections: [
        { title: "Molecular Structure", duration: "40 min" },
        { title: "Functional Groups", duration: "35 min" },
        { title: "Organic Reactions", duration: "45 min" }
      ]
    }
  },
  {
    title: "Ecosystem Dynamics and Biodiversity",
    description: "Explore how ecosystems work using Khan Academy's comprehensive biology course. Learn about energy flow, food webs, and the impact of human activities on biodiversity.",
    subject: "Biology",
    thumbnail: "https://cdn.kastatic.org/images/khan-logo-dark-background.png",
    content: {
      type: "video_course",
      url: "https://www.khanacademy.org/science/biology/ecology",
      sections: [
        { title: "Energy Flow in Ecosystems", duration: "35 min" },
        { title: "Population Ecology", duration: "40 min" },
        { title: "Biodiversity and Conservation", duration: "45 min" }
      ]
    }
  },
  {
    title: "বাংলায় পদার্থবিদ্যা - SSC Physics",
    description: "10 Minute School থেকে SSC স্তরের পদার্থবিদ্যা শিখুন। বল, শক্তি, তাপ এবং আলো সম্পর্কে বাংলা ভাষায় বিস্তারিত ব্যাখ্যা এবং অনুশীলন।",
    subject: "Physics",
    thumbnail: "https://10minuteschool.com/assets/images/logo.png",
    content: {
      type: "video_course",
      url: "https://10minuteschool.com/en/academic/101/?group=science",
      sections: [
        { title: "বল ও গতি (Force & Motion)", duration: "40 min" },
        { title: "কাজ, ক্ষমতা ও শক্তি (Work, Power & Energy)", duration: "45 min" },
        { title: "তাপ ও উষ্ণতা (Heat & Temperature)", duration: "35 min" }
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
    fileSize: "Various",
    filePath: "https://phet.colorado.edu/en/simulations/filter?sort=alpha&view=grid",
    thumbnail: "https://phet.colorado.edu/images/phet-logo-trademarked.png",
    tags: ["simulations", "interactive", "bengali", "offline", "K-12"]
  },
  {
    title: "Khan Academy Biology - Full Course",
    description: "Comprehensive biology course covering cell biology, genetics, evolution, ecology, and human anatomy. Includes video lessons, practice exercises, and progress tracking. Completely free forever.",
    subject: "Biology",
    fileSize: "Online Streaming",
    filePath: "https://www.khanacademy.org/science/biology",
    thumbnail: "https://cdn.kastatic.org/images/khan-logo-dark-background.png",
    tags: ["biology", "video", "exercises", "free", "comprehensive"]
  },
  {
    title: "LabXchange Virtual Lab Experiments",
    description: "Safe virtual laboratory from Harvard University. Conduct biology and chemistry experiments online with realistic equipment and immediate feedback. Perfect for schools without lab facilities.",
    subject: "Chemistry",
    fileSize: "Online Platform",
    filePath: "https://about.labxchange.org/featured/virtual-lab-simulations",
    thumbnail: "https://about.labxchange.org/wp-content/themes/labxchange/assets/images/logo.png",
    tags: ["virtual_lab", "chemistry", "biology", "safe", "harvard"]
  },
  {
    title: "10 Minute School - বাংলায় বিজ্ঞান শিক্ষা",
    description: "সম্পূর্ণ বাংলা ভাষায় বিজ্ঞান শিক্ষা। SSC ও HSC স্তরের পদার্থবিজ্ঞান, রসায়ন এবং জীববিজ্ঞানের সকল অধ্যায়। ভিডিও লেকচার, কুইজ এবং লাইভ ক্লাস সহ।",
    subject: "Multi-Subject",
    fileSize: "Online Streaming",
    filePath: "https://10minuteschool.com/en/academic/101/?group=science",
    thumbnail: "https://10minuteschool.com/assets/images/logo.png",
    tags: ["bengali", "ssc", "hsc", "video", "live_class", "bangladesh"]
  },
  {
    title: "The Physics Classroom - Complete Physics Tutorials",
    description: "In-depth physics tutorials covering mechanics, waves, electricity, magnetism, and modern physics. Includes interactive diagrams, practice problems with solutions, and concept builders.",
    subject: "Physics",
    fileSize: "Online",
    filePath: "https://www.physicsclassroom.com/class",
    thumbnail: "https://www.physicsclassroom.com/images/logo.png",
    tags: ["physics", "tutorials", "problems", "high_school", "interactive"]
  },
  {
    title: "HHMI BioInteractive - 3D Molecular Visualizations",
    description: "Award-winning 3D animations and interactive models of biological processes. Explore DNA replication, protein synthesis, cell division, and more at the molecular level. Used by educators worldwide.",
    subject: "Biology",
    fileSize: "Online Streaming",
    filePath: "https://www.biointeractive.org/",
    thumbnail: "https://www.biointeractive.org/themes/gesso/logo.png",
    tags: ["3d", "molecular_biology", "animations", "cell_biology", "genetics"]
  },
  {
    title: "ChemCollective Virtual Lab Activities",
    description: "Virtual chemistry lab from Carnegie Mellon University. Includes murder mystery scenarios, forensic analysis, and traditional chemistry experiments. All experiments are scenario-based for engagement.",
    subject: "Chemistry",
    fileSize: "Online Platform",
    filePath: "https://chemcollective.org/vlabs",
    thumbnail: "https://chemcollective.org/assets/modules/logo.png",
    tags: ["chemistry", "virtual_lab", "scenarios", "problem_solving", "safe"]
  },
  {
    title: "OpenStax - Free College Science Textbooks",
    description: "Peer-reviewed, openly licensed college textbooks for Biology, Chemistry, Physics, Anatomy & Physiology, and more. Available as free PDF downloads or low-cost print versions.",
    subject: "Multi-Subject",
    fileSize: "PDF (Various sizes)",
    filePath: "https://openstax.org/subjects/science",
    thumbnail: "https://openstax.org/dist/images/logo.svg",
    tags: ["textbooks", "college", "pdf", "free", "peer_reviewed"]
  },
  {
    title: "NASA Space Place - Learn About Space!",
    description: "Games, activities, and articles about space and Earth science from NASA. Perfect for younger students (ages 8-13) interested in astronomy, planets, space exploration, and Earth science.",
    subject: "Space Science",
    fileSize: "Online Platform",
    filePath: "https://spaceplace.nasa.gov/",
    thumbnail: "https://spaceplace.nasa.gov/review/sun/sun-icon.en.png",
    tags: ["nasa", "space", "kids", "games", "astronomy", "earth_science"]
  },
  {
    title: "CK-12 Foundation - Free STEM Textbooks",
    description: "Customizable K-12 science textbooks with embedded videos, simulations, and practice problems. Covers all science subjects from elementary through AP level. Create your own custom textbook!",
    subject: "Multi-Subject",
    fileSize: "Online & PDF",
    filePath: "https://www.ck12.org/science/",
    thumbnail: "https://www.ck12.org/images/logos/ck12-logo.png",
    tags: ["textbooks", "k12", "customizable", "free", "interactive", "ap"]
  },
  {
    title: "Molecular Workbench - Nanotechnology Simulations",
    description: "Interactive experiments in physics, chemistry, biology, biotechnology, and nanotechnology. Visualize atoms and molecules in motion. Great for understanding molecular-level phenomena.",
    subject: "Physics",
    fileSize: "Online/Downloadable",
    filePath: "https://mw.concord.org/modeler/",
    thumbnail: "https://concord.org/sites/default/files/images/logos/mw-logo.png",
    tags: ["molecular", "nanotechnology", "simulations", "physics", "chemistry"]
  },
  {
    title: "Bozeman Science - AP & High School Videos",
    description: "Paul Andersen's comprehensive video collection covering AP Biology, AP Chemistry, AP Environmental Science, Physics, and Anatomy. Aligned with AP standards and Next Generation Science Standards.",
    subject: "Multi-Subject",
    fileSize: "Online Streaming",
    filePath: "https://www.bozemanscience.com/",
    thumbnail: "https://www.bozemanscience.com/images/logo.png",
    tags: ["video", "ap", "ngss", "biology", "chemistry", "physics"]
  }
];
