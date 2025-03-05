export const config = {
  postingIntervals: {
    min: 2 * 60 * 60 * 1000, // 2 hours
    max: 5 * 60 * 60 * 1000  // 5 hours
  },
  maxDailyPosts: 25,
  tags: {
    required: ['@Boithebear'],
    optional: ['$BOI']
  },
  characterLimit: 180
};

export const topics = [
  'Boithebear points strategy',
  'How to earn Boithebear points',
  'Boithebear community growth',
  'Crypto points rewards',
  'Boithebear platform features',
  'Earning crypto rewards',
  'Community engagement tips',
  'Crypto points milestones',
  'Boithebear ecosystem',
  'Point accumulation strategies'
];

export const geminiPrompt = `
Create a very concise tweet about {topic}. CRITICAL REQUIREMENTS:
- MUST be under 140 characters (strict limit, excluding tags)
- Be engaging and informative about Boithebear points
- Focus on community and point earning
- Use exciting, motivational language
- DO NOT include any hashtags or @mentions
- Keep it simple and direct

Example format and length:
"Want to level up your Boithebear game? Hit 50K points and join the elite crypto community!"
`;
