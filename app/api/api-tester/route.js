import { NextResponse } from "next/server";

export async function POST(request) {
  const { method, url, headers, body } = await request.json();

  const startTime = Date.now();

  try {
    const response = await fetch(url, {
      method,
      headers: {
        ...headers,
        "User-Agent": "DevHub API Tester",
      },
      body: method === "POST" || method === "PUT" ? body : undefined,
    });

    const responseTime = Date.now() - startTime;

    const responseData = await response.text();
    let parsedData;

    try {
      parsedData = JSON.parse(responseData);
    } catch {
      parsedData = responseData;
    }

    return NextResponse.json({
      status: response.status,
      time: responseTime,
      data: parsedData,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while making the request." },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request) {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    }
  );
}
