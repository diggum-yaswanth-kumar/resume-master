const keywordGroups = [
  {
    matches: ['ats', 'keyword', 'resume score', 'screening'],
    reply:
      'To improve ATS performance, mirror the job description language, keep a focused skills section, and add measurable achievements under each role. Prioritize exact matches for tools, frameworks, and job-title keywords.',
  },
  {
    matches: ['resume', 'cv', 'fresher', 'experience'],
    reply:
      'A strong resume should clearly show your target role, top skills, projects, and measurable outcomes. If you are early in your career, lead with projects, internships, certifications, and job-specific skills.',
  },
  {
    matches: ['interview', 'hr round', 'technical round'],
    reply:
      'For interview prep, review the company, pick 3 to 5 experiences you can explain well, and practice answering with situation, action, and result. Keep a short self-introduction ready too.',
  },
  {
    matches: ['job', 'apply', 'application', 'career'],
    reply:
      'For job applications, tailor your resume to each role, keep LinkedIn aligned with the same story, and focus on roles where your skills match the core requirements. Strong targeted applications usually perform better than generic mass applications.',
  },
];

export const buildLocalChatbotFallback = (message) => {
  const normalized = message.toLowerCase();
  const match = keywordGroups.find(({ matches }) =>
    matches.some((word) => normalized.includes(word))
  );

  return (
    match?.reply ||
    'I can still help with resume improvement, ATS optimization, interview preparation, and job applications. Try asking about missing resume sections, ATS keywords, or how to tailor your resume to a role.'
  );
};
