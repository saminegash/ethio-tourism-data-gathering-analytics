import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const { time_range, department } = await request.json();

    // Path to the Python analytics orchestrator
    const pythonScript = path.join(
      process.cwd(),
      "functions",
      "tourism_analytics_orchestrator.py"
    );

    // Build command arguments
    const args = ["run-pipeline"];
    if (department && department !== "all") {
      args.push("--department", department);
    }

    // Execute Python script
    const result = await executeAnalytics(pythonScript, args);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { error: "Failed to generate analytics insights" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get status of analytics system
    const pythonScript = path.join(
      process.cwd(),
      "functions",
      "tourism_analytics_orchestrator.py"
    );
    const result = await executeAnalytics(pythonScript, ["status"]);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Analytics status API error:", error);
    return NextResponse.json(
      { error: "Failed to get analytics status" },
      { status: 500 }
    );
  }
}

function executeAnalytics(scriptPath: string, args: string[]): Promise<any> {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn("python3", [scriptPath, ...args], {
      cwd: path.join(process.cwd(), "functions"),
      env: {
        ...process.env,
        PYTHONPATH: path.join(process.cwd(), "functions"),
      },
    });

    let stdout = "";
    let stderr = "";

    pythonProcess.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    pythonProcess.on("close", (code) => {
      if (code === 0) {
        try {
          // Try to parse JSON output
          const result = JSON.parse(stdout);
          resolve(result);
        } catch (parseError) {
          // If JSON parsing fails, return raw output
          resolve({ raw_output: stdout, success: true });
        }
      } else {
        reject(new Error(`Python process exited with code ${code}: ${stderr}`));
      }
    });

    pythonProcess.on("error", (error) => {
      reject(error);
    });

    // Set timeout for long-running analytics
    setTimeout(() => {
      pythonProcess.kill();
      reject(new Error("Analytics process timed out"));
    }, 300000); // 5 minute timeout
  });
}
