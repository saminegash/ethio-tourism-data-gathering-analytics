import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { spawn } from "child_process";
import path from "path";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "your-supabase-url";
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || "your-supabase-service-role-key";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  try {
    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.name.endsWith(".csv")) {
      return NextResponse.json(
        { error: "Only CSV files are allowed" },
        { status: 400 }
      );
    }

    // Convert file to text
    const csvText = await file.text();

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `uploads/${timestamp}-${file.name}`;

    // Upload to Supabase Storage
    const { data: storageData, error: storageError } = await supabase.storage
      .from("tourism-data")
      .upload(filename, csvText, {
        contentType: "text/csv",
        upsert: false,
      });
    console.log("storageData", storageData);

    if (storageError) {
      console.error("Storage error:", storageError);
      return NextResponse.json(
        { error: "Failed to upload file to storage" },
        { status: 500 }
      );
    }

    // Process with Python analyzer
    const analysisResult = await processWithPythonAnalyzer(csvText);

    // Store analysis results in database (optional)
    const { data: dbData, error: dbError } = await supabase
      .from("analysis_results")
      .insert({
        filename: file.name,
        storage_path: filename,
        analysis_type: "general",
        results: analysisResult,
        created_at: new Date().toISOString(),
      });

    console.log("dbData", dbData);
    if (dbError) {
      console.warn("Database insert warning:", dbError);
      // Don't fail the request if DB insert fails
    }

    return NextResponse.json({
      success: true,
      filename: file.name,
      storage_path: filename,
      analysis: analysisResult,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

async function processWithPythonAnalyzer(csvText: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(
      process.cwd(),
      "functions",
      "data_analyzer.py"
    );
    const python = spawn("python3", [pythonScript]);

    let outputData = "";
    let errorData = "";

    // Create event object for the Python handler
    const event = {
      body: csvText,
      queryStringParameters: {
        analysis_type: "arrivals_analysis",
        format: "csv",
        insights: "true",
      },
    };

    // Send event data to Python script
    python.stdin.write(JSON.stringify(event));
    python.stdin.end();

    python.stdout.on("data", (data) => {
      outputData += data.toString();
    });

    python.stderr.on("data", (data) => {
      errorData += data.toString();
    });

    python.on("close", (code) => {
      if (code !== 0) {
        console.error("Python script error:", errorData);
        reject(
          new Error(`Python script failed with code ${code}: ${errorData}`)
        );
        return;
      }

      try {
        // Parse the JSON response from Python
        const result = JSON.parse(outputData);
        if (result.statusCode === 200) {
          resolve(JSON.parse(result.body));
        } else {
          reject(new Error(`Python handler error: ${result.body}`));
        }
      } catch (parseError) {
        console.error("Failed to parse Python output:", outputData, parseError);
        reject(new Error("Failed to parse analysis results"));
      }
    });

    python.on("error", (error) => {
      reject(new Error(`Failed to start Python process: ${error.message}`));
    });
  });
}
