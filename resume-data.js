// Personal Portfolio and Resume Data - Mathesh Nadar
const resumeData = {
  personal: {
    name: "Mathesh Nadar",
    title: "AI & Data Science Engineer",
    subtitle: "AI & Data Science undergraduate with experience in software development, ML modelling, and full-stack web applications.",
    email: "matheshnadar7@gmail.com",
    phone: "+91 9137592052",
    location: "Jai Janta Nagar, Orlem Malad West, Mumbai 400064",
    website: "https://gold-reindeer-161566.hostingersite.com/",
    linkedin: "https://linkedin.com/in/matheshnadar7",
    github: "https://github.com/mathesh99",
    profileImage: "",
    resumePdf: "",
    availability: "Available for new opportunities",
    twitter: "", // Left blank or omitted in resume
    about: "I am an AI & Data Science undergraduate with practical experience in software development, testing, and full-stack web application development through internships and academic projects. Proficient in JavaScript, Java, React.js, Node.js, Express.js, and REST APIs. I have built projects including an Insurance Service Chatbot, a Cashify-like gadget valuation platform, and an Automatic Timetable Generator System while contributing to CRM projects involving testing, debugging, and backend development. Strong problem-solving skills with a focus on developing scalable and efficient software solutions.",
    
    // Additional personal metadata from sidebar
    birthDate: "10/01/2005",
    maritalStatus: "Unmarried",
    nationality: "Indian"
  },
  
  education: [
    {
      degree: "B.E. in Artificial Intelligence & Data Science",
      institution: "Thadomal Shahani Engineering College",
      location: "Mumbai, India",
      duration: "2022 - 2026",
      status: "Ongoing",
      grade: "Current CGPA: 8.29 / 10 (Percentage: 73.34%)",
      semesters: [
        { name: "Semester 1", gpa: "8.10" },
        { name: "Semester 2", gpa: "8.25" },
        { name: "Semester 3", gpa: "8.40" }
      ],
      achievements: [
        "Specialization in Core Machine Learning algorithms, Big Data systems, and Web Engineering",
        "Elected to work on multiple collaborative team projects in data modeling and full-stack systems"
      ]
    },
    {
      degree: "Higher Secondary Certificate (HSC)",
      institution: "The BSGD'S Junior College",
      location: "Mumbai, India",
      duration: "2020 - 2022",
      status: "Completed",
      grade: "Percentage: 80.67%",
      achievements: [
        "Focused on Mathematics, Physics, Chemistry, and Computer Science streams"
      ]
    },
    {
      degree: "Secondary School Certificate (SSC)",
      institution: "St. Anne's High School",
      location: "Mumbai, India",
      duration: "2018 - 2020",
      status: "Completed",
      grade: "Percentage: 84.40%",
      achievements: [
        "Passed with high distinctions in Mathematics and Science subjects"
      ]
    }
  ],

  experience: [
    {
      role: "Developer (Intern)",
      company: "Future One World",
      location: "Mumbai, India (Remote/Hybrid)",
      duration: "Feb 02, 2026 - May 02, 2026",
      bullets: [
        "Contributed to CRM and client projects through testing, debugging, and workflow validation to ensure platform reliability.",
        "Developed a Cashify-like gadget valuation platform using React.js and Node.js with a custom pricing algorithm.",
        "Designed and implemented an Automatic Timetable Generator System for AH Wadia High School.",
        "Optimized CRM system features, backend API endpoints, database operations, and overall application performance."
      ],
      techStack: ["React.js", "Node.js", "Express.js", "MySQL", "JavaScript", "REST APIs"]
    }
  ],

  skills: [
    {
      category: "Programming Languages",
      items: [
        { name: "JavaScript", level: 90 },
        { name: "Java", level: 85 },
        { name: "Python", level: 85 },
        { name: "React / HTML5 / CSS3", level: 90 },
        { name: "SQL", level: 85 },
        { name: "C", level: 70 }
      ]
    },
    {
      category: "Data Analysis & ML Tools",
      items: [
        { name: "Data Visualization & Cleaning", level: 90 },
        { name: "Microsoft Excel & Power BI", level: 80 },
        { name: "Pandas & NumPy & Plotly", level: 85 },
        { name: "Scikit-Learn & Matplotlib", level: 80 },
        { name: "XGBoost & Seaborn", level: 75 }
      ]
    },
    {
      category: "Tools & Frameworks",
      items: [
        { name: "React.js & Node.js", level: 90 },
        { name: "Express.js & REST APIs", level: 85 },
        { name: "Git & GitHub Version Control", level: 90 },
        { name: "MySQL Database", level: 85 },
        { name: "VS Code IDE", level: 95 }
      ]
    },
    {
      category: "Core Soft Skills",
      items: [
        { name: "Analytical Thinking", level: 95 },
        { name: "Problem Solving", level: 95 },
        { name: "Communication Skills", level: 85 },
        { name: "Teamwork & Collaboration", level: 90 },
        { name: "Fast Learner", level: 95 }
      ]
    }
  ],

  projects: [
    {
      title: "RAG Based Market Trend Predictor",
      description: "Generative AI system for Market Trend Analysis using Retrieval-Augmented Generation (RAG) to predict trends, market sentiment, and insights from news, social media, and historical data.",
      category: "AI & ML",
      role: "AI Developer",
      techStack: ["Python", "RAG", "LLMs", "Generative AI", "Data Analysis"],
      githubLink: "https://github.com/mathesh99",
      liveLink: "",
      accentColor: "linear-gradient(135deg, #8a2be2 0%, #4a00e0 100%)"
    },
    {
      title: "Customer Segmentation ML Model",
      description: "Machine Learning classification and clustering system designed to analyze and segment customer purchase behavior.",
      category: "AI & ML",
      role: "Data Analyst",
      techStack: ["Python", "Scikit-learn", "Pandas", "Matplotlib", "Seaborn"],
      githubLink: "https://github.com/mathesh99",
      liveLink: "",
      accentColor: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"
    },
    {
      title: "Cashify-Like Gadget Valuation Platform",
      description: "Full-stack web application designed for evaluating secondary market gadget valuations using a custom-developed valuation and pricing algorithm.",
      category: "Fullstack",
      role: "Full-Stack Developer",
      techStack: ["React.js", "Node.js", "Express.js", "MySQL", "CSS3"],
      githubLink: "https://github.com/mathesh99",
      liveLink: "https://gold-reindeer-161566.hostingersite.com/",
      accentColor: "linear-gradient(135deg, #f857a6 0%, #ff5858 100%)"
    },
    {
      title: "Automatic Timetable Generator System",
      description: "Automatic scheduling system designed for AH Wadia High School to generate school class schedules and minimize scheduling conflicts.",
      category: "Fullstack",
      role: "Lead Developer",
      techStack: ["React", "Java", "JavaScript", "CSS3", "Algorithms"],
      githubLink: "https://github.com/mathesh99",
      liveLink: "",
      accentColor: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)"
    }
  ],

  achievements: [
    {
      title: "Scholarship Recipient",
      description: "Awarded the prestigious Ms. Raju Hari Nain Scholarship for academic excellence and outstanding curriculum achievements."
    },
    {
      title: "Industry Ready Experience",
      description: "Successfully completed Software Developer Internship at Future One World, delivering production-ready modules."
    },
    {
      title: "Valuation System Innovation",
      description: "Developed an Old Gadgets Pricing Algorithm achieving 95% accuracy in matching dynamic market values."
    },
    {
      title: "Automation Efficiency",
      description: "Created a Timetable Generator that reduced manual planning work for AH Wadia High School administration by 95%."
    }
  ],

  interests: [
    "Data Analytics",
    "Machine Learning",
    "Web Development",
    "Data Visualization",
    "Automation Technologies"
  ],

  languages: [
    { name: "English", level: "Fluent" },
    { name: "Tamil", level: "Native / Bilingual" },
    { name: "Hindi", level: "Conversational" }
  ],

  activities: [
    "Continuous learning of Emerging AI Technologies",
    "Active contributor to Team-Based Engineering Projects",
    "Practicing SQL & Data Analysis problems",
    "Exploring Generative AI & Advanced Data Analytics methodologies"
  ]
};

// Export data for browser inclusion or node context (supporting both ES modules, CommonJS and standard browser global)
window.resumeData = resumeData;
if (typeof module !== 'undefined' && module.exports) {
  module.exports = resumeData;
}
