import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed for CivicSolve / Sankalp Setu...');

  // Clean existing tables
  await prisma.progressEvent.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.savedItem.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.industryEngagement.deleteMany();
  await prisma.solution.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.team.deleteMany();
  await prisma.aiClassification.deleteMany();
  await prisma.challengeSupporter.deleteMany();
  await prisma.challenge.deleteMany();
  await prisma.industryPartner.deleteMany();
  await prisma.university.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Seed Users (Covering all 5 platform roles)
  const student = await prisma.user.create({
    data: {
      email: 'harshitgadre706@gmail.com',
      password: passwordHash,
      name: 'Harshit Gadre',
      role: 'STUDENT',
      organization: 'BIT Sindri',
      location: 'Ranchi, Jharkhand',
      phone: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
      skills: JSON.stringify(['Python', 'IoT', 'C++', 'React', 'GIS', 'Agronomy', 'AI/ML'])
    }
  });

  const citizen = await prisma.user.create({
    data: {
      email: 'citizen.jharkhand@gov.in',
      password: passwordHash,
      name: 'Manoj Soren',
      role: 'CITIZEN',
      location: 'Ranchi, Jharkhand',
      phone: '+91 98351 12345',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
      skills: JSON.stringify(['Civic Action', 'Community Mobilization'])
    }
  });

  const uniAdmin = await prisma.user.create({
    data: {
      email: 'admin@bitsindri.ac.in',
      password: passwordHash,
      name: 'Prof. R. K. Sharma',
      role: 'UNIVERSITY_ADMIN',
      organization: 'BIT Sindri',
      location: 'Dhanbad, Jharkhand',
      phone: '+91 94311 22334',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
      skills: JSON.stringify(['Robotics', 'Embedded Systems', 'IoT'])
    }
  });

  const industryUser = await prisma.user.create({
    data: {
      email: 'priya.nair@tatasteel.com',
      password: passwordHash,
      name: 'Priya Nair',
      role: 'INDUSTRY_PARTNER',
      organization: 'Tata Steel CSR Foundation',
      location: 'Jamshedpur, Jharkhand',
      phone: '+91 98351 99887',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
      skills: JSON.stringify(['CSR Strategy', 'Grant Allocation', 'Industrial IoT'])
    }
  });

  const govUser = await prisma.user.create({
    data: {
      email: 'director.planning@jharkhand.gov.in',
      password: passwordHash,
      name: 'Dr. Amit Verma, IAS',
      role: 'GOVERNMENT',
      organization: 'Department of Higher & Technical Education, GoJ',
      location: 'Ranchi, Jharkhand',
      phone: '+91 651 2400123',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
      skills: JSON.stringify(['Policy Formulation', 'District Analytics', 'Public Administration'])
    }
  });

  console.log('✅ Seeded 5 Users covering all platform roles');

  // 2. Seed Universities
  const universitiesData = [
    {
      name: 'Birsa Institute of Technology (BIT) Sindri',
      shortName: 'BIT Sindri',
      location: 'Dhanbad, Jharkhand',
      district: 'Dhanbad',
      nirfRank: 'State Rank #1',
      logoUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=200&q=80',
      departments: JSON.stringify(['CSE', 'AI/ML', 'Mining', 'Mechanical', 'Chemical']),
      expertiseTags: JSON.stringify(['IoT', 'Mining Safety', 'Robotics', 'Environmental Tech']),
      activeProjectsCount: 24,
      description: 'Premier government engineering college of Jharkhand with dedicated incubation labs.',
      website: 'https://www.bitsindri.ac.in',
      contactEmail: 'incubation@bitsindri.ac.in'
    },
    {
      name: 'Indian Institute of Technology (ISM) Dhanbad',
      shortName: 'IIT ISM',
      location: 'Dhanbad, Jharkhand',
      district: 'Dhanbad',
      nirfRank: 'NIRF Top 15',
      logoUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=200&q=80',
      departments: JSON.stringify(['Data Science', 'Robotics', 'EEE', 'Applied Geophysics']),
      expertiseTags: JSON.stringify(['Data Science', 'Robotics', 'AI', 'Earth Sciences']),
      activeProjectsCount: 18,
      description: 'Institute of National Importance pioneering deep-tech and resource sustainability.',
      website: 'https://www.iitism.ac.in',
      contactEmail: 'dean_rnd@iitism.ac.in'
    },
    {
      name: 'National Institute of Technology (NIT) Jamshedpur',
      shortName: 'NIT Jamshedpur',
      location: 'Jamshedpur, Jharkhand',
      district: 'East Singhbhum',
      nirfRank: 'NIRF Top 70',
      logoUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=200&q=80',
      departments: JSON.stringify(['Mechanical', 'ECE', 'Civil', 'Computer Applications']),
      expertiseTags: JSON.stringify(['Smart Manufacturing', 'Sensors', 'Civil Structures']),
      activeProjectsCount: 12,
      description: 'Excellence in manufacturing automation, material sciences, and rural tech translation.',
      website: 'https://www.nitjsr.ac.in',
      contactEmail: 'innovate@nitjsr.ac.in'
    },
    {
      name: 'Birsa Agricultural University (BAU)',
      shortName: 'BAU Ranchi',
      location: 'Ranchi, Jharkhand',
      district: 'Ranchi',
      nirfRank: 'ICAR Top 25',
      logoUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=200&q=80',
      departments: JSON.stringify(['Agronomy', 'Soil Science', 'Horticulture', 'Agri-Engineering']),
      expertiseTags: JSON.stringify(['Agritech', 'Soil Health', 'Crop Pathology', 'Drip Irrigation']),
      activeProjectsCount: 15,
      description: 'Leading agricultural university focusing on plateau crops and tribal farm productivity.',
      website: 'https://www.bauranchi.org',
      contactEmail: 'research@bauranchi.org'
    },
    {
      name: 'Ranchi University & Center for Tribal Studies',
      shortName: 'Ranchi University',
      location: 'Ranchi, Jharkhand',
      district: 'Ranchi',
      nirfRank: 'State University',
      logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200&q=80',
      departments: JSON.stringify(['Biotechnology', 'Environmental Sciences', 'Social Work']),
      expertiseTags: JSON.stringify(['Water Testing', 'Tribal Livelihoods', 'Biodiversity']),
      activeProjectsCount: 11,
      description: 'Extensive field research network across Chota Nagpur tribal belts.',
      website: 'https://www.ranchiuniversity.ac.in',
      contactEmail: 'contact@ranchiuniversity.ac.in'
    },
    {
      name: 'IIT Delhi',
      shortName: 'IIT Delhi',
      location: 'Delhi',
      district: 'National Partner',
      nirfRank: 'Top 5',
      logoUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=200&q=80',
      departments: JSON.stringify(['Data Science', 'Robotics', 'EEE']),
      expertiseTags: JSON.stringify(['AI/ML', 'IoT', 'Hardware', 'Clean Energy']),
      activeProjectsCount: 24,
      description: 'Collaborating mentor institution under SIH inter-state knowledge exchange.',
      website: 'https://home.iitd.ac.in',
      contactEmail: 'sih@iitd.ac.in'
    },
    {
      name: 'IISc Bangalore',
      shortName: 'IISc',
      location: 'Karnataka',
      district: 'National Partner',
      nirfRank: 'Top 10',
      logoUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=200&q=80',
      departments: JSON.stringify(['Research', 'AI', 'BioTech']),
      expertiseTags: JSON.stringify(['Deep Learning', 'Sensors', 'Synthetic Biology']),
      activeProjectsCount: 16,
      description: 'Premier basic science and engineering research institute.',
      website: 'https://iisc.ac.in',
      contactEmail: 'office@iisc.ac.in'
    }
  ];

  for (const u of universitiesData) {
    await prisma.university.create({ data: u });
  }
  console.log(`✅ Seeded ${universitiesData.length} Universities`);

  // 3. Seed Industry Partners
  const industryData = [
    {
      name: 'Tata Steel CSR & Foundation',
      sector: 'Manufacturing',
      engagementTypes: JSON.stringify(['Mentorship', 'Funding', 'Hardware', 'Field Access']),
      logoUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&q=80',
      location: 'Jamshedpur & Dhanbad',
      description: 'Committed to grassroots community transformation, rural healthcare, and livelihood incubation in tribal Jharkhand.',
      website: 'https://www.tatasteel.com/sustainability/csr',
      activeProjectsCount: 14
    },
    {
      name: 'TCS Foundation',
      sector: 'Technology',
      engagementTypes: JSON.stringify(['Mentorship', 'Funding', 'Cloud', 'Internships']),
      logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&q=80',
      location: 'Pan-India',
      description: 'Digital education grants, AI compute infrastructure, and software mentoring for collegiate teams.',
      website: 'https://www.tcs.com/who-we-are/corporate-social-responsibility',
      activeProjectsCount: 12
    },
    {
      name: 'Infosys Springboard',
      sector: 'Technology',
      engagementTypes: JSON.stringify(['Data', 'AI', 'Internships', 'Cloud']),
      logoUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&q=80',
      location: 'Pan-India',
      description: 'Technical curriculum enablement, cloud sandboxes, and startup mentoring.',
      website: 'https://springboard.infosys.com',
      activeProjectsCount: 8
    },
    {
      name: 'Reliance Industries (Jio Foundation)',
      sector: 'Energy',
      engagementTypes: JSON.stringify(['Funding', 'Hardware', 'R&D', 'Connectivity']),
      logoUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&q=80',
      location: 'Pan-India',
      description: 'Solar microgrid equipment, 5G IoT mesh nodes, and digital agriculture subsidies.',
      website: 'https://www.reliancefoundation.org',
      activeProjectsCount: 6
    },
    {
      name: 'HDFC Bank Parivartan',
      sector: 'Finance',
      engagementTypes: JSON.stringify(['Funding', 'Mentorship', 'Data']),
      logoUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=200&q=80',
      location: 'Ranchi, Jharkhand',
      description: 'Holistic rural development program providing direct seed capital to student-led societal prototypes.',
      website: 'https://www.hdfcbank.com/csr',
      activeProjectsCount: 4
    },
    {
      name: 'Tata Motors',
      sector: 'Manufacturing',
      engagementTypes: JSON.stringify(['R&D', 'Hardware', 'Field Access']),
      logoUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=200&q=80',
      location: 'Jamshedpur, Jharkhand',
      description: 'Mobility solutions, EV conversions for rural healthcare dispatch, and mechanical lab sponsorships.',
      website: 'https://www.tatamotors.com',
      activeProjectsCount: 5
    },
    {
      name: 'Wipro Cares',
      sector: 'Technology',
      engagementTypes: JSON.stringify(['Cloud', 'AI', 'Internships']),
      logoUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=200&q=80',
      location: 'Pan-India',
      description: 'Urban ecology, civic tech software platforms, and youth digital skilling.',
      website: 'https://www.wipro.com/sustainability',
      activeProjectsCount: 7
    }
  ];

  for (const i of industryData) {
    await prisma.industryPartner.create({ data: i });
  }
  console.log(`✅ Seeded ${industryData.length} Industry Partners`);

  // 4. Seed Challenges
  const challengesData = [
    {
      title: 'Water shortage in rural areas',
      description: 'The village is facing severe water shortage due to irregular rainfall and poor water storage facilities. This has affected drinking water supply and agriculture in the region. Groundwater levels have plummeted past 180 feet during summer months.',
      category: 'Environment',
      location: 'Ranchi, Jharkhand',
      district: 'Ranchi',
      lat: 23.3441,
      lng: 85.3096,
      priority: 'HIGH',
      status: 'OPEN',
      daysLeft: 12,
      supportersCount: 1248,
      viewsCount: 4200,
      affectedPeople: 2500,
      requiredSkills: JSON.stringify(['IoT', 'Data Analytics', 'Environmental Science', 'Python', 'Sensors']),
      mediaUrls: JSON.stringify(['https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80']),
      createdById: citizen.id,
      aiClassification: {
        detectedCategory: 'Environment',
        confidence: 0.94,
        detectedSkills: JSON.stringify(['IoT', 'Data Analytics', 'Environmental Science', 'Python']),
        reasoning: 'High priority water sustainability challenge. Recommended sensor-assisted groundwater monitoring and community rainwater harvesting.'
      }
    },
    {
      title: 'Limited access to healthcare in remote villages',
      description: 'Primary health sub-centers in rural blocks lack continuous doctor attendance and basic diagnostic facilities. Patients must travel over 45km to Dhanbad district hospital for routine blood sugar and ECG diagnostics.',
      category: 'Healthcare',
      location: 'Dhanbad, Jharkhand',
      district: 'Dhanbad',
      lat: 23.7957,
      lng: 86.4304,
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      daysLeft: 18,
      supportersCount: 854,
      viewsCount: 3100,
      affectedPeople: 4100,
      requiredSkills: JSON.stringify(['Biomedical Tech', 'Mobile App Development', 'AI / Machine Learning', 'React']),
      mediaUrls: JSON.stringify(['https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&q=80']),
      createdById: citizen.id,
      aiClassification: {
        detectedCategory: 'Healthcare',
        confidence: 0.96,
        detectedSkills: JSON.stringify(['Biomedical Tech', 'Mobile App Development', 'AI / Machine Learning']),
        reasoning: 'Tele-triage mobile kit with AI-powered diagnostic indicators suited for ANM healthcare workers.'
      }
    },
    {
      title: 'Lack of digital education infrastructure',
      description: 'Government secondary schools lack functional computers, broadband internet, and vernacular digital learning material. Over 1,200 students are unable to access national coding and STEM literacy curriculums.',
      category: 'Education',
      location: 'Bokaro, Jharkhand',
      district: 'Bokaro',
      lat: 23.6693,
      lng: 86.1511,
      priority: 'MEDIUM',
      status: 'OPEN',
      daysLeft: 22,
      supportersCount: 642,
      viewsCount: 2200,
      affectedPeople: 1800,
      requiredSkills: JSON.stringify(['Mobile App Development', 'Web Tech', 'Offline Caching', 'Python']),
      mediaUrls: JSON.stringify(['https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80']),
      createdById: citizen.id,
      aiClassification: {
        detectedCategory: 'Education',
        confidence: 0.91,
        detectedSkills: JSON.stringify(['Mobile App Development', 'Web Tech', 'Offline Caching']),
        reasoning: 'Offline-first tablet learning ecosystem with solar charging dock for uninterrupted village schooling.'
      }
    },
    {
      title: 'Crop disease in paddy fields',
      description: 'Late blight and bacterial leaf streak fungal infections are spreading rapidly in kharif paddy crops around Kanke block. Smallholder farmers lack instant identification tools to select targeted bio-pesticides.',
      category: 'Agriculture',
      location: 'Ranchi, Jharkhand',
      district: 'Ranchi',
      lat: 23.4123,
      lng: 85.3214,
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      daysLeft: 25,
      supportersCount: 521,
      viewsCount: 1850,
      affectedPeople: 3200,
      requiredSkills: JSON.stringify(['AI / Machine Learning', 'Agronomy & Soil Science', 'Mobile App Development', 'Python']),
      mediaUrls: JSON.stringify(['https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&q=80']),
      createdById: citizen.id,
      aiClassification: {
        detectedCategory: 'Agriculture',
        confidence: 0.95,
        detectedSkills: JSON.stringify(['AI / Machine Learning', 'Agronomy & Soil Science', 'Mobile App Development']),
        reasoning: 'Computer vision leaf lesion classifier with vernacular voice advisory for Santhali and Hindi speaking farmers.'
      }
    },
    {
      title: 'Poor road connectivity and bridge culvert erosion',
      description: 'Monsoon flash floods have washed away the culvert approach road linking 6 tribal hamlets to the main highway. Ambulances and produce pickup trucks are unable to reach during emergencies.',
      category: 'Infrastructure',
      location: 'Hazaribagh, Jharkhand',
      district: 'Hazaribagh',
      lat: 23.9961,
      lng: 85.3622,
      priority: 'LOW',
      status: 'OPEN',
      daysLeft: 30,
      supportersCount: 310,
      viewsCount: 1400,
      affectedPeople: 5000,
      requiredSkills: JSON.stringify(['Civil Engineering', 'GIS & Satellite Mapping', 'Sensors']),
      mediaUrls: JSON.stringify(['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80']),
      createdById: citizen.id,
      aiClassification: {
        detectedCategory: 'Infrastructure',
        confidence: 0.89,
        detectedSkills: JSON.stringify(['Civil Engineering', 'GIS & Satellite Mapping', 'Structural Sensor']),
        reasoning: 'Prefabricated modular culvert design and soil stabilization geo-textile approach.'
      }
    },
    {
      title: 'Air pollution and coal dust emissions in mining belt',
      description: 'Open-cast coal transport and unpaved haul roads generate severe particulate matter (PM2.5 / PM10) concentrations exceeding 380 ug/m3 in resident colonies near Jharia and Dhanbad.',
      category: 'Environment',
      location: 'Dhanbad, Jharkhand',
      district: 'Dhanbad',
      lat: 23.7431,
      lng: 86.4128,
      priority: 'HIGH',
      status: 'OPEN',
      daysLeft: 16,
      supportersCount: 789,
      viewsCount: 2900,
      affectedPeople: 8500,
      requiredSkills: JSON.stringify(['IoT', 'Data Analytics', 'Environmental Science', 'Embedded Systems']),
      mediaUrls: JSON.stringify(['https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&q=80']),
      createdById: citizen.id,
      aiClassification: {
        detectedCategory: 'Environment',
        confidence: 0.97,
        detectedSkills: JSON.stringify(['IoT', 'Data Analytics', 'Environmental Science', 'Embedded Systems']),
        reasoning: 'Low-cost optical dust sensor network paired with automated misting cannons.'
      }
    }
  ];

  const createdChallenges = [];
  for (const c of challengesData) {
    const { aiClassification, ...challengeData } = c;
    const ch = await prisma.challenge.create({
      data: {
        ...challengeData,
        aiClassification: {
          create: aiClassification
        }
      }
    });
    createdChallenges.push(ch);
  }
  console.log(`✅ Seeded ${createdChallenges.length} Challenges with AI Classifications and Required Skills`);

  // 5. Seed Teams
  const teamGreen = await prisma.team.create({
    data: {
      name: 'Green Innovators',
      challengeId: createdChallenges[0].id,
      status: 'IN_PROGRESS',
      leadName: 'Harshit Gadre',
      leadEmail: 'harshitgadre706@gmail.com',
      memberCount: 12,
      skills: JSON.stringify(['Python', 'IoT', 'Data Science', 'React', 'Agronomy']),
      avatarUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&q=80',
      members: {
        create: [
          { name: 'Harshit Gadre', role: 'Team Lead & IoT Architect', institution: 'BIT Sindri' },
          { name: 'Ananya Sen', role: 'ML Engineer', institution: 'BIT Sindri' },
          { name: 'Rohit Kumar', role: 'Hardware & Sensor Specialist', institution: 'BIT Sindri' },
          { name: 'Dr. S. K. Singh', role: 'Faculty Mentor', institution: 'BIT Sindri' }
        ]
      }
    }
  });

  const teamHealth = await prisma.team.create({
    data: {
      name: 'HealthTech',
      challengeId: createdChallenges[1].id,
      status: 'TESTING',
      leadName: 'Dr. Arpita Mukherjee',
      leadEmail: 'arpita.m@iitism.ac.in',
      memberCount: 8,
      skills: JSON.stringify(['AI', 'Data Science', 'Biomedical Tech']),
      avatarUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200&q=80',
      members: {
        create: [
          { name: 'Dr. Arpita Mukherjee', role: 'Lead Researcher', institution: 'IIT ISM Dhanbad' },
          { name: 'Vivek Ranjan', role: 'Mobile App Developer', institution: 'IIT ISM Dhanbad' },
          { name: 'Pooja Soren', role: 'Clinical Validation Intern', institution: 'AIIMS Deoghar' }
        ]
      }
    }
  });

  const teamEco = await prisma.team.create({
    data: {
      name: 'Eco Warriors',
      challengeId: createdChallenges[5].id,
      status: 'DEPLOYED',
      leadName: 'Rahul Murmu',
      leadEmail: 'rahul.m@nitjsr.ac.in',
      memberCount: 10,
      skills: JSON.stringify(['React', 'Node.js', 'IoT', 'GIS']),
      avatarUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=200&q=80',
      members: {
        create: [
          { name: 'Rahul Murmu', role: 'Project Coordinator', institution: 'NIT Jamshedpur' },
          { name: 'Kavita Singh', role: 'GIS & Mapping Lead', institution: 'NIT Jamshedpur' },
          { name: 'Deepak Roy', role: 'Firmware Engineer', institution: 'NIT Jamshedpur' }
        ]
      }
    }
  });

  console.log('✅ Seeded 3 Teams with full member rosters');

  // 6. Seed Solutions with ProgressEvent loops (Covering PENDING_REVIEW, APPROVED, IN_DEPLOYMENT, DEPLOYED)
  const sol1 = await prisma.solution.create({
    data: {
      title: 'Smart Irrigation System',
      description: 'IoT-enabled automated drip irrigation network using soil moisture tension sensors, weather forecasting API, and solar powered control valves to cut water consumption by 42%.',
      category: 'Agriculture',
      challengeId: createdChallenges[0].id,
      teamId: teamGreen.id,
      status: 'APPROVED',
      progressPct: 65,
      viewsCount: 3200,
      impactReach: 450,
      reviewerId: govUser.id,
      reviewerComment: 'Approved for district pilot testing in Tamar block. Field funding allocated under Jal Jeevan Mission.',
      reviewedAt: new Date(Date.now() - 7 * 86400000),
      demoUrl: 'https://smart-irrigation-jharkhand.gov.in',
      mediaUrls: JSON.stringify(['https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&q=80']),
      progressEvents: {
        create: [
          { stage: 'SUBMITTED', title: 'Solution Submitted', description: 'Initial engineering architecture submitted by Team Green Innovators', actorName: 'Harshit Gadre', timestamp: new Date(Date.now() - 14 * 86400000) },
          { stage: 'UNDER_REVIEW', title: 'Under Review', description: 'Queued for technical validation with Dept of Agriculture & Water Resources', actorName: 'System Router', timestamp: new Date(Date.now() - 10 * 86400000) },
          { stage: 'APPROVED', title: 'Approved by Government', description: 'Dr. Amit Verma, IAS approved prototype pilot deployment grant', actorName: 'Dr. Amit Verma, IAS', timestamp: new Date(Date.now() - 7 * 86400000) },
          { stage: 'IN_DEPLOYMENT', title: 'In Deployment', description: '50 Soil moisture telemetry nodes dispatched and active in Tamar fields', actorName: 'Team Green Innovators', timestamp: new Date(Date.now() - 2 * 86400000) }
        ]
      }
    }
  });

  const sol2 = await prisma.solution.create({
    data: {
      title: 'AI Health Assistant & Tele-Diagnostic Kit',
      description: 'Portable solar-powered tele-diagnostic kit equipped with digital stethoscope, glucometer, and multi-lingual voice guided triage for Accredited Social Health Activists (ASHA).',
      category: 'Healthcare',
      challengeId: createdChallenges[1].id,
      teamId: teamHealth.id,
      status: 'PENDING_REVIEW', // In Government review queue!
      progressPct: 35,
      viewsCount: 2100,
      impactReach: 1200,
      demoUrl: 'https://health-assistant-jharkhand.gov.in',
      mediaUrls: JSON.stringify(['https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80']),
      progressEvents: {
        create: [
          { stage: 'SUBMITTED', title: 'Solution Submitted', description: 'Hardware bill of materials and firmware code uploaded by IIT ISM team', actorName: 'Dr. Arpita Mukherjee', timestamp: new Date(Date.now() - 2 * 86400000) },
          { stage: 'UNDER_REVIEW', title: 'Under Government Review', description: 'Awaiting clinical feasibility sign-off from Health Department reviewer', actorName: 'Gov Portal Queue', timestamp: new Date(Date.now() - 1 * 86400000) }
        ]
      }
    }
  });

  const sol3 = await prisma.solution.create({
    data: {
      title: 'Waste Segregation & Recycling App',
      description: 'Computer-vision enabled municipal smart bin monitoring and citizen rewards platform connecting urban wards directly to informal waste-pickers and recyclers.',
      category: 'Environment',
      challengeId: createdChallenges[5].id,
      teamId: teamEco.id,
      status: 'DEPLOYED',
      progressPct: 100,
      viewsCount: 4800,
      impactReach: 18500,
      reviewerId: govUser.id,
      reviewerComment: 'Fully certified and deployed across Bokaro municipal wards.',
      reviewedAt: new Date(Date.now() - 30 * 86400000),
      demoUrl: 'https://eco-jharkhand-clean.org',
      mediaUrls: JSON.stringify(['https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80']),
      progressEvents: {
        create: [
          { stage: 'SUBMITTED', title: 'Solution Submitted', description: 'Mobile app and classification model submitted', actorName: 'Rahul Murmu', timestamp: new Date(Date.now() - 45 * 86400000) },
          { stage: 'APPROVED', title: 'Approved by Municipal Corp', description: 'Approved for deployment across 12 urban wards', actorName: 'Dr. Amit Verma, IAS', timestamp: new Date(Date.now() - 30 * 86400000) },
          { stage: 'DEPLOYED', title: 'Deployed & Operational', description: '100% operational with 18,500 active citizen users', actorName: 'Urban Development GoJ', timestamp: new Date(Date.now() - 5 * 86400000) }
        ]
      }
    }
  });

  const sol4 = await prisma.solution.create({
    data: {
      title: 'Solar Groundwater Fluoride Filtration Unit',
      description: 'Zero-waste activated alumina electrochemical defluoridation filter run on photovoltaic power for tribal primary schools in Palamu.',
      category: 'Water & Sanitation',
      challengeId: createdChallenges[0].id,
      teamId: teamGreen.id,
      status: 'PENDING_REVIEW', // In Government review queue!
      progressPct: 25,
      viewsCount: 940,
      impactReach: 320,
      mediaUrls: JSON.stringify(['https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&q=80']),
      progressEvents: {
        create: [
          { stage: 'SUBMITTED', title: 'Solution Submitted', description: 'Field prototype results and water purity lab certificates submitted', actorName: 'Harshit Gadre', timestamp: new Date(Date.now() - 1 * 86400000) },
          { stage: 'UNDER_REVIEW', title: 'Under Government Review', description: 'Pending clearance from Drinking Water & Sanitation Dept reviewer', actorName: 'Gov Review System', timestamp: new Date(Date.now() - 12 * 3600000) }
        ]
      }
    }
  });

  console.log('✅ Seeded 4 Solutions with Progress Events (including 2 in PENDING_REVIEW for Gov Panel)');

  // 7. Seed Comments & Notifications
  await prisma.comment.create({
    data: {
      challengeId: createdChallenges[0].id,
      userId: uniAdmin.id,
      authorName: 'Prof. R. K. Sharma',
      authorRole: 'University Mentor',
      authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
      content: 'BIT Sindri Environmental Lab has already initiated groundwater test-boring samples across 4 village panchayats. We have 12 student researchers ready to deploy sensors.'
    }
  });

  await prisma.comment.create({
    data: {
      challengeId: createdChallenges[0].id,
      userId: industryUser.id,
      authorName: 'Priya Nair',
      authorRole: 'Industry Partner',
      authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
      content: 'Tata Steel CSR can sponsor the solar pumps and 50 IoT telemetry nodes under our Gram Vikas water security mission. Lets connect with the student team lead.'
    }
  });

  const notifications = [
    {
      userId: student.id,
      title: 'Solution Approved by Government',
      message: 'Your Smart Irrigation System was APPROVED by Dr. Amit Verma, IAS for pilot deployment.',
      type: 'SOLUTION',
      link: '/solutions'
    },
    {
      userId: student.id,
      title: 'Your team has been approved',
      message: 'Green Innovators team roster has been confirmed by University Mentor.',
      type: 'TEAM',
      link: '/teams'
    },
    {
      userId: student.id,
      title: 'New comment on your challenge',
      message: 'Tata Steel CSR commented on "Water shortage in rural areas"',
      type: 'CHALLENGE',
      link: `/challenges/${createdChallenges[0].id}`
    },
    {
      userId: student.id,
      title: 'TCS is interested in your solution',
      message: 'TCS Foundation reviewed "Smart Irrigation System" for cloud grant matching.',
      type: 'SOLUTION',
      link: '/solutions'
    },
    {
      userId: student.id,
      title: 'Your solution has been deployed',
      message: 'Waste Segregation App reached 100% completion and was marked Live in Bokaro.',
      type: 'SOLUTION',
      link: '/solutions'
    }
  ];

  for (const n of notifications) {
    await prisma.notification.create({ data: n });
  }
  console.log('✅ Seeded Comments and Notifications');

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
