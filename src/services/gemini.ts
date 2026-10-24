import { GoogleGenAI } from '@google/genai';
import { EligibilityRules, JobOpportunity, StudentProfile } from '../types';

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (aiClient) return aiClient;
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : '');
  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
    aiClient = new GoogleGenAI({ apiKey });
    return aiClient;
  }
  return null;
}

/**
 * Parses unstructured job description text into structured eligibility rules & criteria.
 * Admin can review and refine before saving.
 */
export async function parseJobDescriptionWithAi(rawText: string): Promise<{
  title: string;
  category: string;
  eligibilityRules: EligibilityRules;
  requiredSkills: string[];
  suggestedRounds: { name: string; type: string; description: string }[];
}> {
  const client = getAiClient();
  if (!client) {
    // Smart heuristic fallback if Gemini key is not provided in client
    return fallbackParseJobDescription(rawText);
  }

  try {
    const prompt = `
Extract structured recruitment criteria from this job posting. Return ONLY valid JSON matching this schema:
{
  "title": string,
  "category": string,
  "eligibilityRules": {
    "eligibleCourses": string[], // e.g. ["B.Tech", "MCA"]
    "eligibleBranches": string[], // e.g. ["Computer Science & Engineering", "Information Technology"] or ["All"]
    "eligibleGraduationYears": number[], // e.g. [2026]
    "minTenthPercentage": number,
    "minTwelfthPercentage": number,
    "minCgpa": number,
    "allowActiveBacklogs": boolean,
    "maxActiveBacklogsAllowed": number,
    "allowHistoricalBacklogs": boolean,
    "additionalConditions": string
  },
  "requiredSkills": string[],
  "suggestedRounds": [
    { "name": string, "type": "Aptitude"|"Coding"|"Technical Interview"|"HR Interview"|"Group Discussion", "description": string }
  ]
}

Job Description Text:
"""${rawText}"""
`;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return {
      title: parsed.title || 'Software Development Engineer',
      category: parsed.category || 'Software Engineering',
      eligibilityRules: {
        eligibleCourses: parsed.eligibilityRules?.eligibleCourses || ['B.Tech'],
        eligibleBranches: parsed.eligibilityRules?.eligibleBranches || ['All'],
        eligibleGraduationYears: parsed.eligibilityRules?.eligibleGraduationYears || [2026],
        minTenthPercentage: parsed.eligibilityRules?.minTenthPercentage || 60,
        minTwelfthPercentage: parsed.eligibilityRules?.minTwelfthPercentage || 60,
        minCgpa: parsed.eligibilityRules?.minCgpa || 7.0,
        allowActiveBacklogs: parsed.eligibilityRules?.allowActiveBacklogs ?? false,
        maxActiveBacklogsAllowed: parsed.eligibilityRules?.maxActiveBacklogsAllowed || 0,
        allowHistoricalBacklogs: parsed.eligibilityRules?.allowHistoricalBacklogs ?? true,
        additionalConditions: parsed.eligibilityRules?.additionalConditions || '',
      },
      requiredSkills: parsed.requiredSkills || ['Problem Solving', 'Data Structures', 'Git'],
      suggestedRounds: parsed.suggestedRounds || [
        { name: 'Online Coding Assessment', type: 'Coding', description: 'Algorithmic assessment' },
        { name: 'Technical Interview', type: 'Technical Interview', description: 'System design and fundamentals' },
      ],
    };
  } catch (err) {
    console.warn('Gemini API call failed, using intelligent fallback parser:', err);
    return fallbackParseJobDescription(rawText);
  }
}

function fallbackParseJobDescription(text: string) {
  const lower = text.toLowerCase();
  const cgpaMatch = text.match(/cgpa.*?([0-9]\.[0-9]+|[0-9])/i);
  const minCgpa = cgpaMatch ? parseFloat(cgpaMatch[1]) : 7.0;

  const branches: string[] = [];
  if (lower.includes('cse') || lower.includes('computer science')) branches.push('Computer Science & Engineering');
  if (lower.includes('it') || lower.includes('information tech')) branches.push('Information Technology');
  if (lower.includes('ece') || lower.includes('electronics')) branches.push('Electronics & Communication');
  if (branches.length === 0) branches.push('All');

  const backlogsAllowed = lower.includes('backlog allowed') || lower.includes('1 active backlog');

  return {
    title: text.split('\n')[0]?.substring(0, 50) || 'Campus Hire Engineer',
    category: 'Software Engineering',
    eligibilityRules: {
      eligibleCourses: ['B.Tech', 'M.Tech', 'MCA'],
      eligibleBranches: branches,
      eligibleGraduationYears: [2026],
      minTenthPercentage: 65,
      minTwelfthPercentage: 65,
      minCgpa,
      allowActiveBacklogs: backlogsAllowed,
      maxActiveBacklogsAllowed: backlogsAllowed ? 1 : 0,
      allowHistoricalBacklogs: true,
      additionalConditions: 'Extracted automatically from placement specification document.',
    },
    requiredSkills: ['Data Structures', 'Algorithms', 'Java / Python / C++', 'SQL', 'Git'],
    suggestedRounds: [
      { name: 'Online Technical Qualifier', type: 'Coding', description: 'Core problem solving & algorithms' },
      { name: 'Technical Interview Round', type: 'Technical Interview', description: 'Architecture & project review' },
      { name: 'HR / Culture Fitment', type: 'HR Interview', description: 'Behavioral and compensation discussion' },
    ],
  };
}

/**
 * Generates tailor-made interview prep advice for a student for a specific job opening.
 */
export async function generateStudentInterviewPrep(
  job: JobOpportunity,
  student: StudentProfile
): Promise<string> {
  const client = getAiClient();
  if (!client) {
    return `### Personalized Preparation Roadmap for ${job.title}
1. **Focus on Core Fundamentals**: Focus heavily on ${job.requiredSkills.slice(0, 3).join(', ')}.
2. **Review Your Highlighted Projects**: Prepare to speak in depth about your projects: "${student.projects[0]?.title || 'System Engineering'}".
3. **Recruitment Process Strategy**: Prepare for ${job.recruitmentRounds.length} stages starting with ${job.recruitmentRounds[0]?.name || 'Assessment'}. Review time complexities and edge cases.
4. **Behavioral Alignment**: Research recent product releases and culture principles of the recruiting firm.`;
  }

  try {
    const prompt = `You are a Senior Campus Placement Mentor. Provide concise, bulleted, highly actionable interview preparation advice for student "${student.name}" (Branch: ${student.department}, CGPA: ${student.academicRecords.currentCgpa}, Top Skills: ${student.skills.join(', ')}) who is applying for "${job.title}". Job requirements: ${job.requiredSkills.join(', ')}. Keep response under 180 words, formatted in clean Markdown.`;
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || 'Prepare algorithmic topics and review your resume projects thoroughly.';
  } catch (err) {
    return 'Review key algorithms, practice live coding on LeetCode, and articulate your project contributions clearly.';
  }
}
