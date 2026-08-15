import re

CATEGORIES = [
    "Technology & Software",
    "Design & Creative",
    "Business & Management",
    "Marketing & Media",
    "Finance & Accounting",
    "Healthcare & Life Sciences",
    "Education & Research",
    "Engineering",
    "Government & Public Sector",
    "Law & Professional Services"
]

_CAREERS_RAW = {
    "Technology & Software": [
        ("Software Engineer", "Designs and builds software applications using various programming languages.", "Python,Java,C++,SQL", "Python,Java", "Git,Docker", "Problem Solving,Logic", "Computer Science", "Git,VS Code", "AWS Certified Developer", "Write code,Test code,Deploy", "Technology", True, False, ""),
        ("Frontend Developer", "Builds user interfaces and web experiences.", "JavaScript,HTML,CSS,React", "React,JavaScript", "Redux,TypeScript", "Design Sense,Communication", "Computer Science", "VS Code,Figma", "Meta Frontend Developer", "Build UI,Optimize performance", "Technology", True, False, ""),
        ("Backend Developer", "Develops server-side logic and databases.", "Python,Node.js,SQL,REST APIs", "Python,Node.js", "Docker,AWS", "Analytical Thinking", "Computer Science", "Postman,Docker", "AWS Backend", "Build APIs,Manage DB", "Technology", True, False, ""),
        ("Full Stack Developer", "Handles both frontend and backend development.", "React,Node.js,MongoDB,Express", "React,Node.js", "AWS,Docker", "Problem Solving", "Computer Science", "VS Code,Git", "Full Stack Cert", "End-to-end development", "Technology", True, False, ""),
        ("Java Developer", "Develops applications using Java and Spring Boot.", "Java,Spring Boot,Hibernate,SQL", "Java,Spring Boot", "Maven,Git", "Logic", "Computer Science", "IntelliJ", "Oracle Java", "Build Java apps", "Technology", True, False, ""),
        ("Python Developer", "Develops scripts and web backends using Python.", "Python,Django,Flask,SQL", "Python,Django", "Docker", "Problem Solving", "Computer Science", "PyCharm", "PCAP", "Build python apps", "Technology", True, False, ""),
        ("JavaScript Developer", "Builds web apps with JS ecosystem.", "JavaScript,TypeScript,React,Node.js", "JavaScript,TypeScript", "Webpack", "Logic", "Computer Science", "VS Code", "JS Institute Cert", "Write JS code", "Technology", True, False, ""),
        ("Mobile App Developer", "Builds mobile applications.", "Swift,Kotlin,Flutter,React Native", "Swift,Kotlin", "Firebase", "Design Sense", "Computer Science", "Android Studio,Xcode", "Google Associate Android Developer", "Build mobile apps", "Technology", True, False, ""),
        ("Android Developer", "Builds Android apps.", "Kotlin,Java,Android SDK", "Kotlin,Android SDK", "Firebase", "Logic", "Computer Science", "Android Studio", "Android Developer Cert", "Build Android apps", "Technology", True, False, ""),
        ("iOS Developer", "Builds iOS apps.", "Swift,Objective-C,iOS SDK", "Swift,iOS SDK", "Core Data", "Logic", "Computer Science", "Xcode", "Apple Cert", "Build iOS apps", "Technology", True, False, ""),
        ("AI Engineer", "Develops AI models.", "Python,TensorFlow,PyTorch,Machine Learning", "Python,TensorFlow", "Keras", "Math,Logic", "Computer Science", "Jupyter", "AWS Machine Learning", "Train AI models", "Technology", True, False, ""),
        ("AI/ML Engineer", "Develops Machine Learning models.", "Python,Scikit-learn,ML Algorithms", "Python,ML Algorithms", "Pandas", "Math,Logic", "Computer Science", "Jupyter", "Google ML", "Build ML pipelines", "Technology", True, False, ""),
        ("Machine Learning Engineer", "Deploys ML models to production.", "Python,Docker,Kubernetes,MLOps", "Python,MLOps", "AWS SageMaker", "Problem Solving", "Computer Science", "AWS", "AWS ML", "Deploy models", "Technology", True, False, ""),
        ("Deep Learning Engineer", "Builds deep neural networks.", "Python,PyTorch,TensorFlow,Neural Networks", "Python,PyTorch", "CUDA", "Math", "Computer Science", "Jupyter", "DeepLearning.AI", "Build neural nets", "Technology", True, False, ""),
        ("Generative AI Engineer", "Works with LLMs and generative models.", "Python,Transformers,LangChain,LLMs", "Python,LLMs", "OpenAI API", "Logic", "Computer Science", "VS Code", "Generative AI Cert", "Build GenAI apps", "Technology", True, False, ""),
        ("NLP Engineer", "Processes and analyzes natural language.", "Python,NLTK,Spacy,Transformers", "Python,NLP", "HuggingFace", "Math", "Computer Science", "Jupyter", "NLP Specialization", "Train language models", "Technology", True, False, ""),
        ("Computer Vision Engineer", "Analyzes visual data.", "Python,OpenCV,CNNs,PyTorch", "Python,OpenCV", "TensorFlow", "Math", "Computer Science", "Jupyter", "CV Specialization", "Build vision models", "Technology", True, False, ""),
        ("Data Scientist", "Extracts insights from data.", "Python,Statistics,Machine Learning,SQL", "Python,Statistics", "Pandas", "Analytical Thinking", "Computer Science", "Jupyter,Tableau", "IBM Data Science", "Analyze data", "Technology", True, False, ""),
        ("Data Analyst", "Analyzes business data.", "SQL,Excel,Tableau,Python", "SQL,Excel", "PowerBI", "Attention to Detail", "Statistics", "Excel,Tableau", "Google Data Analytics", "Create reports", "Technology", True, False, ""),
        ("Business Intelligence Analyst", "Builds business dashboards.", "SQL,PowerBI,Tableau,Data Warehousing", "SQL,PowerBI", "Excel", "Business Acumen", "Information Systems", "PowerBI", "Microsoft BI", "Build dashboards", "Technology", True, False, ""),
        ("Data Engineer", "Builds data pipelines.", "SQL,Python,Spark,Hadoop", "SQL,Spark", "Airflow", "Logic", "Computer Science", "Databricks", "Google Data Engineer", "Build ETL pipelines", "Technology", True, False, ""),
        ("Big Data Engineer", "Handles large scale data processing.", "Hadoop,Spark,Kafka,Scala", "Spark,Kafka", "NoSQL", "Logic", "Computer Science", "Hadoop Ecosystem", "Cloudera Cert", "Process big data", "Technology", True, False, ""),
        ("Cloud Engineer", "Manages cloud infrastructure.", "AWS,Azure,Linux,Networking", "AWS,Linux", "Terraform", "Problem Solving", "Computer Science", "AWS Console", "AWS Solutions Architect", "Manage cloud resources", "Technology", True, False, ""),
        ("Cloud Architect", "Designs cloud environments.", "AWS,System Design,Kubernetes", "System Design,AWS", "Docker", "Leadership", "Computer Science", "Draw.io", "AWS Professional", "Design architectures", "Technology", False, False, ""),
        ("DevOps Engineer", "Automates software delivery.", "Linux,Docker,Kubernetes,CI/CD", "Docker,CI/CD", "Jenkins", "Problem Solving", "Computer Science", "Git,Jenkins", "AWS DevOps", "Build CI/CD pipelines", "Technology", True, False, ""),
        ("Site Reliability Engineer", "Ensures system reliability.", "Linux,Python,Monitoring,Kubernetes", "Linux,Monitoring", "Prometheus", "Incident Management", "Computer Science", "Grafana", "Google SRE", "Monitor systems", "Technology", False, False, ""),
        ("MLOps Engineer", "Manages ML infrastructure.", "Python,Docker,Kubernetes,MLFlow", "Docker,MLFlow", "AWS SageMaker", "Problem Solving", "Computer Science", "AWS", "AWS ML", "Maintain ML models", "Technology", False, False, ""),
        ("Cybersecurity Analyst", "Secures IT systems.", "Networking,Security Protocols,SIEM", "Security Protocols", "Linux", "Critical Thinking", "Cybersecurity", "Wireshark", "CompTIA Security+", "Monitor security", "Technology", True, False, ""),
        ("Security Engineer", "Builds secure systems.", "Python,Cryptography,Network Security", "Cryptography", "Penetration Testing", "Problem Solving", "Cybersecurity", "Kali Linux", "CISSP", "Implement security", "Technology", False, False, ""),
        ("Ethical Hacker", "Finds system vulnerabilities.", "Penetration Testing,Linux,Networking", "Penetration Testing", "Python", "Analytical Thinking", "Cybersecurity", "Kali Linux", "CEH", "Test security", "Technology", True, False, ""),
        ("Penetration Tester", "Conducts authorized attacks.", "Metasploit,Burp Suite,Networking", "Metasploit,Burp Suite", "Linux", "Logic", "Cybersecurity", "Burp Suite", "OSCP", "Find vulnerabilities", "Technology", True, False, ""),
        ("Network Engineer", "Manages network infrastructure.", "Cisco,Routing,Switching,Firewalls", "Routing,Switching", "BGP", "Problem Solving", "IT", "Cisco Packet Tracer", "CCNA", "Manage networks", "Technology", True, False, ""),
        ("Systems Engineer", "Maintains IT systems.", "Linux,Windows Server,Active Directory", "Linux,Windows Server", "VMware", "Troubleshooting", "IT", "Server Manager", "MCSA", "Maintain servers", "Technology", True, False, ""),
        ("Database Administrator", "Manages databases.", "SQL,Oracle,PostgreSQL,Backup Strategies", "SQL,Oracle", "Performance Tuning", "Detail Oriented", "IT", "SSMS", "Oracle DBA", "Optimize databases", "Technology", True, False, ""),
        ("Blockchain Developer", "Develops smart contracts.", "Solidity,Ethereum,Web3.js,Cryptography", "Solidity,Ethereum", "Rust", "Logic", "Computer Science", "Remix", "Blockchain Cert", "Write smart contracts", "Technology", True, False, ""),
        ("Web3 Developer", "Builds decentralized apps.", "React,Web3.js,Solidity,Ethers.js", "React,Web3.js", "IPFS", "Logic", "Computer Science", "VS Code", "Web3 Cert", "Build dApps", "Technology", True, False, ""),
        ("Embedded Systems Engineer", "Programs hardware.", "C,C++,Microcontrollers,RTOS", "C,Microcontrollers", "Python", "Problem Solving", "Electrical Engineering", "Keil", "Embedded Cert", "Program microcontrollers", "Technology", True, False, ""),
        ("IoT Engineer", "Builds connected devices.", "C,Python,Sensors,Networking", "Sensors,Networking", "MQTT", "Logic", "Engineering", "Arduino", "IoT Cert", "Build IoT systems", "Technology", True, False, ""),
        ("Game Developer", "Creates video games.", "C#,C++,Unity,Unreal Engine", "Unity,C#", "3D Math", "Creativity", "Computer Science", "Unity,Visual Studio", "Unity Developer", "Develop gameplay", "Technology", True, False, ""),
        ("AR/VR Developer", "Builds immersive experiences.", "Unity,C#,ARCore,ARKit", "Unity,AR", "3D Modeling", "Creativity", "Computer Science", "Unity", "AR/VR Cert", "Build AR apps", "Technology", True, False, ""),
        ("QA Engineer", "Tests software quality.", "Manual Testing,Automated Testing,Jira", "Manual Testing,Jira", "Selenium", "Detail Oriented", "Computer Science", "Jira,Postman", "ISTQB", "Test software", "Technology", True, False, ""),
        ("Automation Test Engineer", "Automates software testing.", "Selenium,Python,Java,Cypress", "Selenium,Python", "CI/CD", "Logic", "Computer Science", "VS Code", "Automation Cert", "Write test scripts", "Technology", True, False, ""),
        ("Software Architect", "Designs software systems.", "System Design,Microservices,Cloud", "System Design", "AWS", "Leadership", "Computer Science", "Draw.io", "AWS Architect", "Design systems", "Technology", False, False, ""),
        ("Solutions Architect", "Designs technical solutions for clients.", "Cloud Computing,Enterprise Architecture,Consulting", "Cloud Computing,Consulting", "AWS", "Communication", "Computer Science", "AWS Console", "AWS Solutions Architect", "Design solutions", "Technology", False, False, ""),
        ("Technical Support Engineer", "Provides technical assistance.", "Troubleshooting,Customer Service,Linux", "Troubleshooting", "Networking", "Communication", "IT", "Zendesk", "CompTIA A+", "Resolve tickets", "Technology", True, False, "")
    ],
    "Design & Creative": [
        ("UI/UX Designer", "Designs user interfaces and experiences.", "Figma,Wireframing,User Research,Prototyping", "Figma,User Research", "Adobe XD", "Empathy", "Design", "Figma", "Google UX", "Create designs", "Design", True, False, ""),
        ("UX Researcher", "Researches user behavior.", "User Interviews,Usability Testing,Data Analysis", "User Interviews", "Surveys", "Empathy", "Psychology", "Miro", "UX Research Cert", "Conduct research", "Design", True, False, ""),
        ("Product Designer", "Designs complete products.", "Figma,Product Strategy,UI Design", "Product Strategy", "User Research", "Business Acumen", "Design", "Figma", "Product Design Cert", "Design products", "Design", True, False, ""),
        ("Visual Designer", "Creates visual concepts.", "Typography,Color Theory,Layout", "Typography", "Branding", "Creativity", "Graphic Design", "Photoshop", "Visual Design Cert", "Create visuals", "Design", True, False, ""),
        ("Graphic Designer", "Creates marketing graphics.", "Photoshop,Illustrator,InDesign,Branding", "Photoshop,Illustrator", "Canva", "Creativity", "Graphic Design", "Adobe Creative Cloud", "Adobe Cert", "Design graphics", "Design", True, False, ""),
        ("Web Designer", "Designs websites.", "HTML,CSS,Web Design,Figma", "Web Design,Figma", "WordPress", "Creativity", "Design", "Figma,Webflow", "Web Design Cert", "Design websites", "Design", True, False, ""),
        ("Motion Designer", "Creates animations.", "After Effects,Animation,Premiere Pro", "After Effects", "Cinema 4D", "Creativity", "Animation", "After Effects", "Motion Design Cert", "Create animations", "Design", True, False, ""),
        ("3D Designer", "Creates 3D models.", "Blender,Maya,3D Modeling,Texturing", "Blender,3D Modeling", "ZBrush", "Creativity", "3D Arts", "Blender", "3D Cert", "Create 3D assets", "Design", True, False, ""),
        ("Animator", "Animates characters and scenes.", "Animation Principles,Maya,Toon Boom", "Animation Principles", "After Effects", "Creativity", "Animation", "Maya", "Animation Cert", "Animate objects", "Design", True, False, ""),
        ("Game Designer", "Designs game mechanics.", "Game Mechanics,Level Design,Storytelling", "Game Mechanics", "Unity", "Creativity", "Game Design", "Unity", "Game Design Cert", "Design gameplay", "Design", True, False, ""),
        ("Video Editor", "Edits video content.", "Premiere Pro,Final Cut,Color Grading", "Premiere Pro", "Audio Mixing", "Detail Oriented", "Film", "Premiere Pro", "Video Editing Cert", "Edit videos", "Design", True, False, ""),
        ("Content Creator", "Produces digital content.", "Video Production,Copywriting,Social Media", "Video Production", "SEO", "Creativity", "Media", "CapCut,Canva", "Content Cert", "Create content", "Media", True, False, ""),
        ("Photographer", "Captures photos.", "Photography,Lighting,Lightroom", "Photography,Lightroom", "Photoshop", "Creativity", "Photography", "Lightroom", "Photography Cert", "Take photos", "Media", True, False, ""),
        ("Creative Director", "Leads creative teams.", "Creative Strategy,Leadership,Art Direction", "Creative Strategy", "Branding", "Leadership", "Design", "Adobe Creative Cloud", "Creative Cert", "Lead teams", "Design", False, False, "")
    ],
    "Business & Management": [
        ("Product Manager", "Manages product lifecycle.", "Product Strategy,Agile,Roadmapping,User Research", "Product Strategy", "Data Analysis", "Leadership", "Business", "Jira", "CSPO", "Manage products", "Business", False, False, ""),
        ("Product Owner", "Maximizes product value.", "Scrum,Backlog Management,User Stories", "Scrum", "Agile", "Communication", "Business", "Jira", "CSPO", "Manage backlog", "Business", True, False, ""),
        ("Project Manager", "Manages projects.", "Project Planning,Agile,Risk Management,Budgeting", "Project Planning", "Scrum", "Leadership", "Business", "Asana", "PMP", "Manage projects", "Business", True, False, ""),
        ("Program Manager", "Manages multiple projects.", "Program Management,Strategy,Stakeholder Management", "Program Management", "Budgeting", "Leadership", "Business", "MS Project", "PgMP", "Manage programs", "Business", False, False, ""),
        ("Business Analyst", "Analyzes business needs.", "Requirements Gathering,SQL,Excel,Process Modeling", "Requirements Gathering", "Visio", "Analytical Thinking", "Business", "Excel,Jira", "CBAP", "Analyze requirements", "Business", True, False, ""),
        ("Business Consultant", "Advises businesses.", "Consulting,Strategy,Data Analysis", "Consulting", "Change Management", "Problem Solving", "Business", "PowerPoint", "Consulting Cert", "Advise clients", "Business", True, False, ""),
        ("Management Consultant", "Improves organizational performance.", "Strategy,Operations,Financial Modeling", "Strategy", "Presentations", "Analytical Thinking", "MBA", "Excel,PowerPoint", "Consulting Cert", "Improve performance", "Business", False, False, ""),
        ("Operations Manager", "Manages operations.", "Process Improvement,Supply Chain,Leadership", "Process Improvement", "Logistics", "Leadership", "Business", "ERP Software", "Six Sigma", "Manage operations", "Business", False, False, ""),
        ("Operations Analyst", "Analyzes operations.", "Data Analysis,Process Mapping,Excel", "Data Analysis", "SQL", "Detail Oriented", "Business", "Excel", "Operations Cert", "Analyze processes", "Business", True, False, ""),
        ("Strategy Analyst", "Analyzes strategic plans.", "Market Research,Financial Modeling,Strategy", "Market Research", "Data Analysis", "Analytical Thinking", "Business", "Excel", "Strategy Cert", "Analyze markets", "Business", True, False, ""),
        ("Sales Manager", "Leads sales teams.", "Sales Strategy,Leadership,CRM,Negotiation", "Sales Strategy", "Account Management", "Leadership", "Business", "Salesforce", "Sales Cert", "Lead sales", "Business", False, False, ""),
        ("Account Manager", "Manages client accounts.", "Client Relations,Sales,Communication", "Client Relations", "CRM", "Communication", "Business", "Salesforce", "Account Management Cert", "Manage clients", "Business", True, False, ""),
        ("Customer Success Manager", "Ensures customer satisfaction.", "Customer Relations,Onboarding,Retention", "Customer Relations", "Zendesk", "Empathy", "Business", "Zendesk", "CSM Cert", "Support customers", "Business", True, False, ""),
        ("Business Development Executive", "Grows business.", "B2B Sales,Networking,Lead Generation", "B2B Sales", "CRM", "Communication", "Business", "LinkedIn Sales Navigator", "Sales Cert", "Generate leads", "Business", True, False, ""),
        ("Entrepreneur", "Starts businesses.", "Leadership,Strategy,Finance,Marketing", "Leadership,Strategy", "Risk Management", "Resilience", "Business", "Various", "None", "Build business", "Business", True, False, ""),
        ("Startup Founder", "Founds startups.", "Vision,Leadership,Fundraising,Product", "Vision,Leadership", "Networking", "Resilience", "Business", "Various", "None", "Found startup", "Business", True, False, "")
    ],
    "Marketing & Media": [
        ("Digital Marketing Specialist", "Executes digital marketing campaigns.", "SEO,SEM,Social Media,Content Marketing", "SEO,SEM", "Email Marketing", "Creativity", "Marketing", "Google Analytics", "Google Digital Garage", "Run campaigns", "Marketing", True, False, ""),
        ("SEO Specialist", "Optimizes search engine rankings.", "SEO,Keyword Research,Google Analytics,On-page SEO", "SEO", "Link Building", "Analytical Thinking", "Marketing", "Ahrefs", "SEO Cert", "Optimize sites", "Marketing", True, False, ""),
        ("SEM Specialist", "Manages search ads.", "Google Ads,PPC,Data Analysis", "Google Ads,PPC", "Bing Ads", "Analytical Thinking", "Marketing", "Google Ads", "Google Ads Cert", "Manage ads", "Marketing", True, False, ""),
        ("Social Media Manager", "Manages social profiles.", "Social Media Strategy,Content Creation,Community Management", "Social Media Strategy", "Copywriting", "Creativity", "Marketing", "Hootsuite", "Social Media Cert", "Manage socials", "Marketing", True, False, ""),
        ("Content Strategist", "Plans content strategy.", "Content Strategy,SEO,Copywriting", "Content Strategy", "Analytics", "Creativity", "Marketing", "WordPress", "Content Cert", "Plan content", "Marketing", False, False, ""),
        ("Content Writer", "Writes content.", "Copywriting,SEO,Research", "Copywriting", "Editing", "Creativity", "English/Marketing", "Google Docs", "Writing Cert", "Write articles", "Marketing", True, False, ""),
        ("Copywriter", "Writes persuasive text.", "Copywriting,Persuasion,Marketing", "Copywriting", "SEO", "Creativity", "Marketing", "Google Docs", "Copywriting Cert", "Write copy", "Marketing", True, False, ""),
        ("Brand Manager", "Manages brand image.", "Brand Strategy,Marketing,Leadership", "Brand Strategy", "Market Research", "Leadership", "Marketing", "Various", "Brand Management Cert", "Manage brand", "Marketing", False, False, ""),
        ("Marketing Analyst", "Analyzes marketing data.", "Data Analysis,SQL,Google Analytics,Excel", "Data Analysis", "Tableau", "Analytical Thinking", "Marketing", "Google Analytics", "Analytics Cert", "Analyze campaigns", "Marketing", True, False, ""),
        ("Growth Marketer", "Drives user growth.", "Growth Hacking,Data Analysis,A/B Testing", "Growth Hacking", "SEO", "Analytical Thinking", "Marketing", "Mixpanel", "Growth Cert", "Drive growth", "Marketing", True, False, ""),
        ("Email Marketing Specialist", "Manages email campaigns.", "Email Marketing,Copywriting,Automation", "Email Marketing", "A/B Testing", "Attention to Detail", "Marketing", "Mailchimp", "Email Marketing Cert", "Send emails", "Marketing", True, False, ""),
        ("Public Relations Specialist", "Manages public image.", "PR,Media Relations,Communication", "PR", "Press Releases", "Communication", "PR", "Muck Rack", "PR Cert", "Manage PR", "Marketing", True, False, ""),
        ("Media Planner", "Plans media buying.", "Media Planning,Budgeting,Data Analysis", "Media Planning", "Negotiation", "Analytical Thinking", "Marketing", "Excel", "Media Cert", "Plan media", "Marketing", True, False, "")
    ],
    "Finance & Accounting": [
        ("Financial Analyst", "Analyzes financial data.", "Financial Modeling,Excel,Valuation,Accounting", "Financial Modeling", "PowerBI", "Analytical Thinking", "Finance", "Excel", "CFA", "Analyze finances", "Finance", True, False, ""),
        ("Investment Analyst", "Analyzes investments.", "Investment Strategy,Financial Modeling,Research", "Investment Strategy", "Valuation", "Analytical Thinking", "Finance", "Bloomberg", "CFA", "Analyze investments", "Finance", True, False, ""),
        ("Equity Research Analyst", "Researches equities.", "Equity Research,Financial Modeling,Valuation", "Equity Research", "Accounting", "Analytical Thinking", "Finance", "Bloomberg", "CFA", "Research stocks", "Finance", True, False, ""),
        ("Risk Analyst", "Analyzes financial risks.", "Risk Management,Data Analysis,Statistics", "Risk Management", "SQL", "Analytical Thinking", "Finance", "Excel", "FRM", "Assess risks", "Finance", True, False, ""),
        ("Credit Analyst", "Analyzes creditworthiness.", "Credit Analysis,Accounting,Financial Modeling", "Credit Analysis", "Excel", "Detail Oriented", "Finance", "Excel", "Credit Cert", "Assess credit", "Finance", True, False, ""),
        ("Financial Planner", "Plans personal finances.", "Financial Planning,Wealth Management,Tax Planning", "Financial Planning", "Insurance", "Communication", "Finance", "Financial Software", "CFP", "Plan finances", "Finance", True, False, ""),
        ("Accountant", "Manages accounting.", "Accounting,Excel,Tax,Bookkeeping", "Accounting", "QuickBooks", "Detail Oriented", "Accounting", "QuickBooks", "CPA", "Manage accounts", "Finance", True, False, ""),
        ("Auditor", "Audits financial records.", "Auditing,Accounting,Compliance", "Auditing", "Tax", "Detail Oriented", "Accounting", "Excel", "CIA", "Audit records", "Finance", True, False, ""),
        ("Tax Consultant", "Advises on taxes.", "Tax Law,Accounting,Compliance", "Tax Law", "Auditing", "Detail Oriented", "Accounting", "Tax Software", "CPA", "Consult on taxes", "Finance", True, False, ""),
        ("Investment Banker", "Manages capital raising.", "Financial Modeling,Valuation,M&A,Pitching", "Financial Modeling,M&A", "Accounting", "Work Ethic", "Finance", "Excel,PowerPoint", "Series 79", "Raise capital", "Finance", True, False, ""),
        ("Actuary", "Analyzes statistical risk.", "Mathematics,Statistics,Actuarial Science,Risk Management", "Mathematics,Statistics", "Excel", "Analytical Thinking", "Mathematics", "Excel", "Actuarial Exams", "Analyze risk", "Finance", True, False, ""),
        ("FinTech Analyst", "Analyzes FinTech trends.", "Finance,Technology,Data Analysis,Blockchain", "Finance,Technology", "SQL", "Analytical Thinking", "Finance", "Excel", "FinTech Cert", "Analyze fintech", "Finance", True, False, ""),
        ("Corporate Finance Analyst", "Analyzes corporate finances.", "Corporate Finance,Financial Modeling,Budgeting", "Corporate Finance", "Accounting", "Analytical Thinking", "Finance", "Excel", "CFA", "Analyze corporate finances", "Finance", True, False, "")
    ],
    "Healthcare & Life Sciences": [
        ("Doctor", "Diagnoses and treats patients.", "Medicine,Patient Care,Diagnosis,Anatomy", "Medicine", "Surgery", "Empathy", "Medical Degree", "EHR Systems", "Medical License", "Treat patients", "Healthcare", True, True, "Requires Medical License"),
        ("Nurse", "Cares for patients.", "Patient Care,Nursing,Vital Signs,Medication Administration", "Patient Care", "BLS", "Empathy", "Nursing", "EHR Systems", "Nursing License", "Care for patients", "Healthcare", True, True, "Requires Nursing License"),
        ("Pharmacist", "Dispenses medications.", "Pharmacology,Patient Care,Medication Dispensing", "Pharmacology", "Chemistry", "Detail Oriented", "Pharmacy", "Pharmacy Systems", "Pharmacist License", "Dispense meds", "Healthcare", True, True, "Requires Pharmacist License"),
        ("Physiotherapist", "Treats physical injuries.", "Physiotherapy,Anatomy,Rehabilitation", "Physiotherapy", "Exercise Science", "Empathy", "Physiotherapy", "Therapy Equipment", "Physiotherapist License", "Treat injuries", "Healthcare", True, True, "Requires Physiotherapist License"),
        ("Medical Laboratory Scientist", "Analyzes medical samples.", "Laboratory Skills,Biology,Chemistry", "Laboratory Skills", "Data Analysis", "Detail Oriented", "Medical Science", "Lab Equipment", "MLS Cert", "Analyze samples", "Healthcare", True, True, "Requires MLS Certification"),
        ("Clinical Researcher", "Conducts clinical trials.", "Clinical Research,GCP,Data Collection", "Clinical Research", "Statistics", "Detail Oriented", "Life Sciences", "EDC Systems", "Clinical Research Cert", "Conduct trials", "Healthcare", True, True, "Requires GCP/Clinical Certs"),
        ("Clinical Data Analyst", "Analyzes clinical data.", "Data Analysis,SAS,SQL,Clinical Trials", "Data Analysis", "R", "Analytical Thinking", "Life Sciences", "SAS", "Data Cert", "Analyze clinical data", "Healthcare", True, False, ""),
        ("Biotechnology Researcher", "Researches biotech.", "Biotechnology,Molecular Biology,Research", "Biotechnology", "Genetics", "Analytical Thinking", "Biotechnology", "Lab Equipment", "Biotech Cert", "Research biotech", "Science", True, False, ""),
        ("Bioinformatics Analyst", "Analyzes biological data.", "Bioinformatics,Python,Genomics,R", "Bioinformatics", "Data Analysis", "Analytical Thinking", "Bioinformatics", "R", "Bioinformatics Cert", "Analyze genomics", "Science", True, False, ""),
        ("Biomedical Engineer", "Engineers medical devices.", "Biomedical Engineering,Medical Devices,CAD", "Biomedical Engineering", "Sensors", "Problem Solving", "Engineering", "CAD", "Engineering Cert", "Design medical devices", "Healthcare", True, True, "Requires Engineering License"),
        ("Public Health Analyst", "Analyzes public health.", "Public Health,Epidemiology,Data Analysis", "Public Health", "Statistics", "Analytical Thinking", "Public Health", "Statistical Software", "Public Health Cert", "Analyze health trends", "Healthcare", True, False, ""),
        ("Healthcare Administrator", "Manages healthcare facilities.", "Healthcare Management,Leadership,Operations", "Healthcare Management", "Budgeting", "Leadership", "Healthcare Administration", "EHR Systems", "Healthcare Admin Cert", "Manage facilities", "Healthcare", False, False, ""),
        ("Nutritionist", "Advises on nutrition.", "Nutrition,Dietetics,Health Coaching", "Nutrition", "Biology", "Empathy", "Nutrition", "Diet Software", "Registered Dietitian", "Advise on diet", "Healthcare", True, True, "Requires RD License")
    ],
    "Education & Research": [
        ("Teacher", "Educates students.", "Teaching,Curriculum Design,Classroom Management", "Teaching", "Subject Knowledge", "Communication", "Education", "LMS", "Teaching License", "Teach students", "Education", True, True, "Requires Teaching License"),
        ("Lecturer", "Lectures at university.", "Teaching,Subject Matter Expertise,Public Speaking", "Teaching", "Research", "Communication", "Subject Domain", "Presentation Software", "Advanced Degree", "Give lectures", "Education", True, False, ""),
        ("Professor", "Teaches and researches at university.", "Research,Teaching,Academic Writing", "Research,Teaching", "Mentorship", "Leadership", "Subject Domain", "Research Tools", "PhD", "Teach and research", "Education", False, False, ""),
        ("Academic Researcher", "Conducts academic research.", "Research,Data Analysis,Academic Writing", "Research", "Statistics", "Analytical Thinking", "Subject Domain", "Research Tools", "Advanced Degree", "Conduct research", "Education", True, False, ""),
        ("Research Scientist", "Conducts scientific research.", "Scientific Research,Data Analysis,Experimentation", "Scientific Research", "Writing", "Analytical Thinking", "Science", "Lab Equipment", "PhD", "Conduct experiments", "Science", True, False, ""),
        ("Educational Consultant", "Advises on education.", "Education Strategy,Consulting,Curriculum Design", "Education Strategy", "Teaching", "Communication", "Education", "Consulting Tools", "Consulting Cert", "Advise educators", "Education", True, False, ""),
        ("Instructional Designer", "Designs educational content.", "Instructional Design,E-learning,Curriculum Development", "Instructional Design", "Multimedia", "Creativity", "Education", "Articulate Storyline", "ID Cert", "Design courses", "Education", True, False, ""),
        ("Curriculum Developer", "Develops curricula.", "Curriculum Design,Education Standards,Writing", "Curriculum Design", "Teaching", "Detail Oriented", "Education", "Word Processors", "Curriculum Cert", "Develop curriculum", "Education", True, False, ""),
        ("Academic Coordinator", "Coordinates academic programs.", "Administration,Leadership,Education Management", "Administration", "Planning", "Leadership", "Education", "School Management System", "Education Cert", "Coordinate programs", "Education", False, False, ""),
        ("Education Technology Specialist", "Implements ed-tech.", "EdTech,IT,Training", "EdTech", "LMS Admin", "Problem Solving", "Education", "LMS", "EdTech Cert", "Manage edtech", "Education", True, False, "")
    ],
    "Engineering": [
        ("Mechanical Engineer", "Designs mechanical systems.", "CAD,SolidWorks,Thermodynamics,Mechanics", "CAD,SolidWorks", "Manufacturing", "Problem Solving", "Mechanical Engineering", "SolidWorks", "PE License", "Design machines", "Engineering", True, True, "May require PE License"),
        ("Civil Engineer", "Designs infrastructure.", "AutoCAD,Structural Analysis,Construction Management", "AutoCAD", "Surveying", "Problem Solving", "Civil Engineering", "AutoCAD", "PE License", "Design structures", "Engineering", True, True, "May require PE License"),
        ("Electrical Engineer", "Designs electrical systems.", "Circuit Design,Electronics,Power Systems", "Circuit Design", "PCB Design", "Problem Solving", "Electrical Engineering", "AutoCAD Electrical", "PE License", "Design circuits", "Engineering", True, True, "May require PE License"),
        ("Electronics Engineer", "Designs electronics.", "Electronics,PCB Design,Microcontrollers", "PCB Design", "Circuit Design", "Problem Solving", "Electronics Engineering", "Altium", "Engineering Cert", "Design electronics", "Engineering", True, False, ""),
        ("Chemical Engineer", "Designs chemical processes.", "Chemical Engineering,Process Design,Thermodynamics", "Chemical Engineering", "Safety", "Problem Solving", "Chemical Engineering", "Simulation Software", "PE License", "Design processes", "Engineering", True, True, "May require PE License"),
        ("Aerospace Engineer", "Designs aircraft and spacecraft.", "Aerospace Engineering,Aerodynamics,CAD", "Aerospace Engineering", "Propulsion", "Problem Solving", "Aerospace Engineering", "CAD", "Engineering Cert", "Design aircraft", "Engineering", True, False, ""),
        ("Automotive Engineer", "Designs vehicles.", "Automotive Engineering,CAD,Mechanics", "Automotive Engineering", "Manufacturing", "Problem Solving", "Automotive Engineering", "CAD", "Engineering Cert", "Design vehicles", "Engineering", True, False, ""),
        ("Robotics Engineer", "Designs robots.", "Robotics,C++,ROS,Mechanics", "Robotics,ROS", "Computer Vision", "Problem Solving", "Robotics", "ROS", "Robotics Cert", "Build robots", "Engineering", True, False, ""),
        ("Mechatronics Engineer", "Combines mechanics and electronics.", "Mechatronics,Control Systems,Robotics", "Mechatronics", "PLC", "Problem Solving", "Mechatronics Engineering", "CAD", "Engineering Cert", "Design mechatronics", "Engineering", True, False, ""),
        ("Environmental Engineer", "Solves environmental problems.", "Environmental Engineering,Water Treatment,Sustainability", "Environmental Engineering", "Compliance", "Problem Solving", "Environmental Engineering", "GIS", "PE License", "Design eco-solutions", "Engineering", True, True, "May require PE License"),
        ("Industrial Engineer", "Optimizes complex systems.", "Industrial Engineering,Process Optimization,Lean Six Sigma", "Industrial Engineering", "Supply Chain", "Problem Solving", "Industrial Engineering", "Minitab", "Six Sigma", "Optimize processes", "Engineering", True, False, ""),
        ("Manufacturing Engineer", "Designs manufacturing processes.", "Manufacturing,CAD,Process Improvement", "Manufacturing", "Lean", "Problem Solving", "Manufacturing Engineering", "CAD", "Manufacturing Cert", "Design manufacturing", "Engineering", True, False, ""),
        ("Structural Engineer", "Designs structural frameworks.", "Structural Analysis,AutoCAD,Construction", "Structural Analysis", "Materials Science", "Problem Solving", "Civil Engineering", "STAAD.Pro", "PE License", "Analyze structures", "Engineering", True, True, "May require PE License"),
        ("Renewable Energy Engineer", "Designs renewable energy systems.", "Renewable Energy,Solar Power,Wind Power", "Renewable Energy", "Electrical Engineering", "Problem Solving", "Energy Engineering", "Simulation Software", "Energy Cert", "Design energy systems", "Engineering", True, False, "")
    ],
    "Government & Public Sector": [
        ("Civil Services Officer", "Administers government policies.", "Public Administration,Leadership,Policy Analysis", "Public Administration", "Law", "Leadership", "Any", "Government Systems", "Civil Services Exam", "Administer policy", "Government", True, True, "Requires Civil Services Exam"),
        ("Administrative Services Officer", "Manages government administration.", "Administration,Management,Public Policy", "Administration", "Budgeting", "Organization", "Public Administration", "Gov Systems", "Admin Exam", "Manage administration", "Government", True, True, "Requires Govt Exam"),
        ("Government Analyst", "Analyzes government data/policies.", "Policy Analysis,Data Analysis,Research", "Policy Analysis", "Economics", "Analytical Thinking", "Public Policy", "Excel", "Gov Analyst Exam", "Analyze policy", "Government", True, True, "Requires Govt Exam"),
        ("Public Policy Analyst", "Analyzes public policies.", "Public Policy,Research,Data Analysis", "Public Policy", "Writing", "Analytical Thinking", "Public Policy", "Statistical Software", "Policy Cert", "Analyze public policy", "Government", True, True, "Requires Govt Exam"),
        ("Government Accountant", "Manages government finances.", "Accounting,Public Finance,Auditing", "Public Finance", "Tax Law", "Detail Oriented", "Accounting", "Accounting Software", "CPA/Gov Exam", "Manage gov finances", "Government", True, True, "Requires Govt Exam"),
        ("Public Sector Banking Officer", "Manages public banking.", "Banking,Finance,Customer Service", "Banking", "Accounting", "Detail Oriented", "Finance", "Banking Software", "Bank PO Exam", "Manage banking", "Government", True, True, "Requires Banking Exam"),
        ("Government IT Specialist", "Manages government IT.", "IT,Networking,Cybersecurity", "IT", "SysAdmin", "Problem Solving", "IT", "IT Systems", "Gov IT Exam", "Manage gov IT", "Government", True, True, "Requires Govt Exam"),
        ("Research Officer", "Conducts government research.", "Research,Data Analysis,Report Writing", "Research", "Statistics", "Analytical Thinking", "Any", "Research Tools", "Gov Research Exam", "Conduct gov research", "Government", True, True, "Requires Govt Exam"),
        ("Public Administration Officer", "Administers public programs.", "Public Administration,Management,Policy Implementation", "Public Administration", "Leadership", "Organization", "Public Administration", "Gov Systems", "Public Admin Exam", "Administer programs", "Government", True, True, "Requires Govt Exam")
    ],
    "Law & Professional Services": [
        ("Lawyer", "Practices law.", "Legal Research,Litigation,Contract Law", "Legal Research", "Negotiation", "Critical Thinking", "Law Degree", "Legal Databases", "Bar Exam", "Practice law", "Law", True, True, "Requires passing the Bar Exam"),
        ("Legal Analyst", "Analyzes legal issues.", "Legal Research,Document Review,Analysis", "Legal Research", "Writing", "Analytical Thinking", "Law", "Westlaw", "Legal Cert", "Analyze legal issues", "Law", True, False, ""),
        ("Legal Consultant", "Advises on legal matters.", "Legal Consulting,Corporate Law,Compliance", "Legal Consulting", "Risk Management", "Problem Solving", "Law", "Legal Tools", "Law Degree", "Consult on law", "Law", True, True, "Requires Law Degree"),
        ("Compliance Analyst", "Ensures regulatory compliance.", "Compliance,Risk Management,Regulatory Affairs", "Compliance", "Auditing", "Detail Oriented", "Law/Business", "Compliance Software", "Compliance Cert", "Ensure compliance", "Law", True, False, ""),
        ("Corporate Legal Professional", "Manages corporate legal matters.", "Corporate Law,Contracts,Compliance", "Corporate Law", "Negotiation", "Critical Thinking", "Law", "Legal Tech", "Bar Exam", "Manage corporate law", "Law", True, True, "Requires Law Degree"),
        ("Paralegal", "Assists lawyers.", "Legal Research,Document Preparation,Administration", "Legal Research", "Filing", "Detail Oriented", "Paralegal Studies", "LexisNexis", "Paralegal Cert", "Assist lawyers", "Law", True, False, ""),
        ("Policy Analyst", "Analyzes legal and public policies.", "Policy Analysis,Research,Writing", "Policy Analysis", "Data Analysis", "Analytical Thinking", "Public Policy", "Research Tools", "Policy Cert", "Analyze policies", "Law", True, False, "")
    ]
}

CAREER_DATABASE = []

for category, careers in _CAREERS_RAW.items():
    for career in careers:
        (name, desc, req_sk, imp_sk, sup_sk, soft_sk, edu, tools, cert, resp, ind, entry, reg, reg_note) = career
        
        slug = name.lower().replace(" / ", "-").replace("/", "-").replace(" ", "-")
        
        req_skills = req_sk.split(",")
        imp_skills = imp_sk.split(",")
        sup_skills = sup_sk.split(",")
        all_tools = tools.split(",")
        certs_list = [cert] if cert else []

        # Build real skill-based roadmaps
        beginner_items = []
        for s in imp_skills[:2]:
            beginner_items.append(f"{s.strip()} Fundamentals")
        beginner_items.append(f"Introduction to {all_tools[0].strip()}")
        beginner_items.append(f"Basic {soft_sk.split(',')[0].strip()} skills")

        intermediate_items = []
        for s in imp_skills:
            intermediate_items.append(f"Advanced {s.strip()}")
        for t in all_tools[1:3]:
            intermediate_items.append(f"Hands-on with {t.strip()}")
        for s in sup_skills[:2]:
            intermediate_items.append(f"Learning {s.strip()}")

        advanced_items = []
        for s in req_skills[2:5]:
            advanced_items.append(f"Mastering {s.strip()}")
        advanced_items.append(f"Real-world {name} projects")
        advanced_items.append("Interview preparation & portfolio building")
        if certs_list and certs_list[0]:
            advanced_items.append(f"Preparing for {certs_list[0]}")

        career_dict = {
            "name": name,
            "slug": slug,
            "category": category,
            "description": desc,
            "required_skills": req_skills,
            "important_skills": imp_skills,
            "supporting_skills": sup_skills,
            "soft_skills": soft_sk.split(","),
            "education": [edu],
            "tools": all_tools,
            "certifications": certs_list,
            "typical_responsibilities": resp.split(","),
            "industries": [ind],
            "entry_level": entry,
            "regulated": reg,
            "regulated_note": reg_note,
            "beginner_roadmap": beginner_items,
            "intermediate_roadmap": intermediate_items,
            "advanced_roadmap": advanced_items
        }
        CAREER_DATABASE.append(career_dict)

def get_all_careers():
    return CAREER_DATABASE

def get_career_by_slug(slug: str):
    for c in CAREER_DATABASE:
        if c["slug"] == slug:
            return c
    return None

def get_careers_by_category(category: str):
    return [c for c in CAREER_DATABASE if c["category"] == category]

def search_careers(query: str):
    q = query.lower()
    results = []
    for c in CAREER_DATABASE:
        if q in c["name"].lower() or q in c["description"].lower() or any(q in s.lower() for s in c["required_skills"]):
            results.append(c)
    return results

def get_all_categories():
    return CATEGORIES
