/**
 * Next.js API Route for AI Insights
 * This handles OpenAI API calls server-side to avoid CORS and keep API key secure
 */

import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { qualityMetrics, sampleData } = body;

    // Validate input
    if (!qualityMetrics) {
      return NextResponse.json(
        { error: "Quality metrics are required" },
        { status: 400 }
      );
    }

    // Get API key from server-side environment variable
    let apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    
    // Clean up the API key (remove any whitespace, quotes, etc.)
    if (apiKey) {
      apiKey = apiKey.trim().replace(/^["']|["']$/g, ''); // Remove surrounding quotes
    }

    // Debug logging (always in development)
    console.log("🔍 [SERVER] Environment check:");
    console.log("  - NODE_ENV:", process.env.NODE_ENV);
    console.log("  - OPENAI_API_KEY exists:", !!process.env.OPENAI_API_KEY);
    console.log("  - NEXT_PUBLIC_OPENAI_API_KEY exists:", !!process.env.NEXT_PUBLIC_OPENAI_API_KEY);
    console.log("  - API key value (first 10 chars):", apiKey ? `${apiKey.substring(0, 10)}...` : "NOT SET");
    console.log("  - All env vars starting with OPENAI:", Object.keys(process.env).filter(k => k.includes("OPENAI")));

    if (!apiKey || apiKey === "your_openai_api_key_here" || apiKey.trim() === "") {
      const errorMsg = `⚠️ OpenAI API key not configured on server.
      
To fix this:
1. Create/update .env.local file in the project root (cleansightx folder)
2. Add: OPENAI_API_KEY=sk-your-actual-key-here
3. Restart your dev server (npm run dev)

Current status:
- OPENAI_API_KEY: ${process.env.OPENAI_API_KEY ? "SET (but invalid)" : "NOT SET"}
- NEXT_PUBLIC_OPENAI_API_KEY: ${process.env.NEXT_PUBLIC_OPENAI_API_KEY ? "SET (but invalid)" : "NOT SET"}`;
      
      console.error(errorMsg);
      return NextResponse.json(
        { 
          error: "OpenAI API key not configured",
          message: "Please add OPENAI_API_KEY to your .env.local file and restart the server",
          fallback: true 
        },
        { status: 503 }
      );
    }

    // Import OpenAI dynamically
    const { OpenAI } = await import("openai");
    const openai = new OpenAI({
      apiKey: apiKey,
    });

    // Build prompt
    const prompt = buildPrompt(qualityMetrics, sampleData || []);

    console.log("🤖 Calling OpenAI API from server...");

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a data quality expert. Provide clear, actionable insights about data quality issues in plain language that non-technical users can understand. Format your response as a bulleted list of recommendations, with each recommendation on a new line starting with '- '. Be specific and actionable.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 600,
      temperature: 0.8,
    });

    const aiResponse = response.choices[0].message.content;
    console.log("✅ AI insights generated successfully on server");

    return NextResponse.json({ insights: aiResponse });
  } catch (error) {
    console.error("❌ OpenAI API error on server:", error);
    
    // Handle specific error types
    let errorMessage = error.message || "Failed to generate AI insights";
    let userFriendlyMessage = errorMessage;
    
    if (error.status === 401) {
      userFriendlyMessage = `Invalid API key. Please check:
1. Your API key is complete (not cut off)
2. No extra spaces or quotes around the key
3. The key is active at https://platform.openai.com/account/api-keys
4. Your OpenAI account has billing set up`;
      console.error("💡 API Key Troubleshooting:");
      console.error("   - Key starts with:", apiKey?.substring(0, 10));
      console.error("   - Key length:", apiKey?.length);
      console.error("   - Key ends with:", apiKey?.substring(apiKey.length - 4));
    } else if (error.status === 429) {
      userFriendlyMessage = "Rate limit exceeded. Please try again in a moment.";
    } else if (error.status === 500 || error.status === 503) {
      userFriendlyMessage = "OpenAI service temporarily unavailable. Please try again later.";
    }
    
    // Return error details
    return NextResponse.json(
      {
        error: userFriendlyMessage,
        originalError: errorMessage,
        status: error.status || 500,
      },
      { status: error.status || 500 }
    );
  }
}

/**
 * Builds a prompt for the AI based on quality metrics
 */
function buildPrompt(qualityMetrics, sampleData) {
  const issues = [];

  if (qualityMetrics.missing > 5) {
    issues.push(`${qualityMetrics.missing}% of data cells are missing values.`);
  }

  if (qualityMetrics.duplicates > 0) {
    issues.push(`${qualityMetrics.duplicates}% of rows are duplicates.`);
  }

  if (qualityMetrics.outliers > 0) {
    issues.push(`Outliers detected in ${qualityMetrics.outliers}% of numeric data.`);
  }

  if (qualityMetrics.inconsistent > 0) {
    issues.push(`${qualityMetrics.inconsistent}% of columns have inconsistent data types.`);
  }

  const columnIssues = qualityMetrics.columns
    ? qualityMetrics.columns
        .filter((col) => col.missingPercent > 10 || col.hasInconsistencies)
        .map((col) => {
          const problems = [];
          if (col.missingPercent > 10) {
            problems.push(`${col.missingPercent}% missing values`);
          }
          if (col.hasInconsistencies) {
            problems.push("inconsistent data types");
          }
          return `- ${col.name}: ${problems.join(", ")}`;
        })
        .join("\n")
    : "";

  // Include sample data for context (first 3 rows, limited columns)
  let dataSummary = "";
  if (sampleData && sampleData.length > 0) {
    const sample = sampleData.slice(0, 3).map((row) => {
      const limited = {};
      const columns = Object.keys(row).slice(0, 5);
      columns.forEach((col) => {
        limited[col] = row[col];
      });
      return limited;
    });
    dataSummary = JSON.stringify(sample, null, 2);
  }

  return `You are analyzing a dataset quality report. Provide specific, actionable recommendations.

DATASET OVERVIEW:
- Total Rows: ${qualityMetrics.totalRows || 0}
- Total Columns: ${qualityMetrics.totalColumns || 0}
- Overall Quality Score: ${qualityMetrics.overall}%

QUALITY METRICS:
- Completeness: ${qualityMetrics.completeness}% (higher is better)
- Consistency: ${qualityMetrics.consistency}% (higher is better)
- Accuracy: ${qualityMetrics.accuracy}% (higher is better)
- Validity: ${qualityMetrics.validity}% (higher is better)

ISSUES DETECTED:
${issues.length > 0 ? issues.map((issue) => `- ${issue}`).join("\n") : "- No major issues detected"}

COLUMN-SPECIFIC ISSUES:
${columnIssues || "No major column-specific issues detected."}

${dataSummary ? `SAMPLE DATA (first 3 rows):\n\`\`\`json\n${dataSummary}\n\`\`\`` : ""}

INSTRUCTIONS:
1. Analyze the quality score and metrics above
2. Identify the most critical issues affecting data quality
3. Provide 4-6 specific, actionable recommendations
4. Format each recommendation as a bullet point starting with "- "
5. Be specific about which columns or data patterns need attention
6. Use simple, non-technical language
7. Make recommendations practical and implementable

Your response should be ONLY the bulleted list of recommendations, nothing else.`;
}

