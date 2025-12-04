/**
 * Diagnostic endpoint to check environment variables
 * Visit: http://localhost:3000/api/check-env
 */

import { NextResponse } from "next/server";

export async function GET() {
  const openaiKey = process.env.OPENAI_API_KEY;
  const publicKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  
  const allOpenaiVars = Object.keys(process.env)
    .filter(key => key.includes("OPENAI"))
    .reduce((acc, key) => {
      const value = process.env[key];
      acc[key] = value 
        ? `${value.substring(0, 10)}...${value.substring(value.length - 4)} (${value.length} chars)`
        : "NOT SET";
      return acc;
    }, {});

  return NextResponse.json({
    status: "Environment Check",
    nodeEnv: process.env.NODE_ENV,
    openaiApiKey: {
      exists: !!openaiKey,
      isPlaceholder: openaiKey === "your_openai_api_key_here",
      isEmpty: !openaiKey || openaiKey.trim() === "",
      startsWithSk: openaiKey?.startsWith("sk-") || false,
      length: openaiKey?.length || 0
    },
    nextPublicOpenaiApiKey: {
      exists: !!publicKey,
      isPlaceholder: publicKey === "your_openai_api_key_here",
      isEmpty: !publicKey || publicKey.trim() === "",
      startsWithSk: publicKey?.startsWith("sk-") || false,
      length: publicKey?.length || 0
    },
    allOpenaiVariables: allOpenaiVars,
    recommendation: !openaiKey && !publicKey
      ? "❌ No API key found. Create .env.local in project root with: OPENAI_API_KEY=sk-your-key"
      : (openaiKey && !openaiKey.startsWith("sk-"))
      ? "⚠️ API key exists but doesn't start with 'sk-'. Check if it's valid."
      : (openaiKey === "your_openai_api_key_here" || publicKey === "your_openai_api_key_here")
      ? "⚠️ API key is still the placeholder. Replace with your actual key."
      : "✅ API key appears to be configured correctly"
  }, {
    headers: {
      "Content-Type": "application/json"
    }
  });
}


