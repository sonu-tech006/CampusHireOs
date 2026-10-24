import { StudentProfile, EligibilityRules, EligibilityResult } from '../types';

/**
 * CampusHire OS Deterministic Eligibility Rules Engine
 * Evaluates student academic profile against job posting criteria.
 * Reusable for student UI badges, application submission guards, and admin reporting.
 */
export function evaluateEligibility(
  student: StudentProfile,
  rules: EligibilityRules
): EligibilityResult {
  const passedConditions: string[] = [];
  const failedConditions: string[] = [];
  const missingInformation: string[] = [];

  const records = student.academicRecords;

  // 1. Course Check
  if (rules.eligibleCourses && rules.eligibleCourses.length > 0) {
    if (!student.course) {
      missingInformation.push('Degree / Course not specified in profile');
    } else if (rules.eligibleCourses.includes(student.course)) {
      passedConditions.push(`Course match: ${student.course}`);
    } else {
      failedConditions.push(
        `Course required: [${rules.eligibleCourses.join(', ')}]. Your course is ${student.course}.`
      );
    }
  }

  // 2. Branch / Department Check
  if (rules.eligibleBranches && rules.eligibleBranches.length > 0) {
    if (!student.department) {
      missingInformation.push('Department / Branch not specified');
    } else if (
      rules.eligibleBranches.includes('All') ||
      rules.eligibleBranches.includes(student.department) ||
      rules.eligibleBranches.some((b) => student.department.toLowerCase().includes(b.toLowerCase()))
    ) {
      passedConditions.push(`Branch eligible: ${student.department}`);
    } else {
      failedConditions.push(
        `Eligible branches: ${rules.eligibleBranches.join(', ')}. Your branch is ${student.department}.`
      );
    }
  }

  // 3. Graduation Year Check
  if (rules.eligibleGraduationYears && rules.eligibleGraduationYears.length > 0) {
    if (!student.graduationYear) {
      missingInformation.push('Graduation year missing');
    } else if (rules.eligibleGraduationYears.includes(student.graduationYear)) {
      passedConditions.push(`Graduation year match: ${student.graduationYear}`);
    } else {
      failedConditions.push(
        `Graduation year required: [${rules.eligibleGraduationYears.join(', ')}]. Your batch is ${student.graduationYear}.`
      );
    }
  }

  // 4. CGPA Requirement
  if (rules.minCgpa > 0) {
    if (records.currentCgpa === undefined || records.currentCgpa === null) {
      missingInformation.push('Current CGPA is not recorded');
    } else if (records.currentCgpa >= rules.minCgpa) {
      passedConditions.push(
        `CGPA criterion satisfied: ${records.currentCgpa.toFixed(2)} (Min required: ${rules.minCgpa.toFixed(2)})`
      );
    } else {
      failedConditions.push(
        `Minimum CGPA required: ${rules.minCgpa.toFixed(2)}; your recorded CGPA: ${records.currentCgpa.toFixed(2)}.`
      );
    }
  }

  // 5. 10th Percentage Check
  if (rules.minTenthPercentage > 0) {
    if (records.tenthPercentage === undefined || records.tenthPercentage === null) {
      missingInformation.push('10th percentage is not recorded');
    } else if (records.tenthPercentage >= rules.minTenthPercentage) {
      passedConditions.push(
        `10th marks satisfied: ${records.tenthPercentage}% (Min required: ${rules.minTenthPercentage}%)`
      );
    } else {
      failedConditions.push(
        `Minimum 10th percentage required: ${rules.minTenthPercentage}%; your score: ${records.tenthPercentage}%.`
      );
    }
  }

  // 6. 12th or Diploma Percentage Check
  if (rules.minTwelfthPercentage > 0) {
    if (records.isDiplomaStudent) {
      if (!records.diplomaPercentage) {
        missingInformation.push('Diploma percentage missing');
      } else if (records.diplomaPercentage >= rules.minTwelfthPercentage) {
        passedConditions.push(
          `Diploma percentage satisfied: ${records.diplomaPercentage}% (Equivalent to 12th criterion ${rules.minTwelfthPercentage}%)`
        );
      } else {
        failedConditions.push(
          `Minimum Diploma percentage required: ${rules.minTwelfthPercentage}%; your score: ${records.diplomaPercentage}%.`
        );
      }
    } else {
      if (records.twelfthPercentage === undefined || records.twelfthPercentage === null) {
        missingInformation.push('12th percentage is not recorded');
      } else if (records.twelfthPercentage >= rules.minTwelfthPercentage) {
        passedConditions.push(
          `12th marks satisfied: ${records.twelfthPercentage}% (Min required: ${rules.minTwelfthPercentage}%)`
        );
      } else {
        failedConditions.push(
          `Minimum 12th percentage required: ${rules.minTwelfthPercentage}%; your score: ${records.twelfthPercentage}%.`
        );
      }
    }
  }

  // 7. Active Backlogs Check
  if (!rules.allowActiveBacklogs) {
    if (records.activeBacklogs > 0) {
      failedConditions.push(
        `Active backlogs not permitted: Company allows 0 active backlogs; you currently have ${records.activeBacklogs}.`
      );
    } else {
      passedConditions.push('Zero active backlogs requirement met');
    }
  } else if (rules.maxActiveBacklogsAllowed !== undefined && rules.maxActiveBacklogsAllowed >= 0) {
    if (records.activeBacklogs > rules.maxActiveBacklogsAllowed) {
      failedConditions.push(
        `Maximum allowed active backlogs: ${rules.maxActiveBacklogsAllowed}; you have ${records.activeBacklogs}.`
      );
    } else {
      passedConditions.push(
        `Active backlogs within limit (${records.activeBacklogs} <= ${rules.maxActiveBacklogsAllowed})`
      );
    }
  }

  // 8. Historical Backlogs Check
  if (!rules.allowHistoricalBacklogs && records.historicalBacklogs > 0) {
    failedConditions.push(
      `Company strictly requires clean academic history with no past backlogs; ${records.historicalBacklogs} historical backlogs recorded.`
    );
  } else if (rules.allowHistoricalBacklogs) {
    passedConditions.push('Historical backlogs policy met');
  }

  // Determine overall status
  if (missingInformation.length > 0) {
    return {
      isEligible: false,
      status: 'Review Required',
      passedConditions,
      failedConditions,
      missingInformation,
      summary: `Action required: ${missingInformation.join('; ')}. Complete your profile to verify full eligibility.`,
    };
  }

  if (failedConditions.length > 0) {
    return {
      isEligible: false,
      status: 'Not Eligible',
      passedConditions,
      failedConditions,
      missingInformation,
      summary: failedConditions.join(' '),
    };
  }

  return {
    isEligible: true,
    status: 'Eligible',
    passedConditions,
    failedConditions,
    missingInformation,
    summary: 'You satisfy all academic criteria and guidelines for this opportunity.',
  };
}
