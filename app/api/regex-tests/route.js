import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import User from "@/models/User";
import RegexTest from "@/models/RegexTest";
import dbConnect from "@/lib/mongoose";

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  await dbConnect();

  const user = await User.findOne({ email: session.user.email });

  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const recentTests = await RegexTest.find({
    _id: { $in: user.recentRegexTests },
  })
    .sort({ timestamp: -1 })
    .limit(5);

  return new Response(JSON.stringify(recentTests), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  await dbConnect();

  const user = await User.findOne({ email: session.user.email });

  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { regex, testString } = await req.json();

  const newTest = new RegexTest({
    regex,
    testString,
    user: user._id,
  });

  await newTest.save();

  user.recentRegexTests.unshift(newTest._id);
  if (user.recentRegexTests.length > 5) {
    user.recentRegexTests.pop();
  }
  await user.save();

  return new Response(JSON.stringify({ message: "Test saved successfully" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  await dbConnect();

  const user = await User.findOne({ email: session.user.email });

  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const url = new URL(req.url);
  const testId = url.searchParams.get("testId");

  await RegexTest.findByIdAndDelete(testId);
  user.recentRegexTests = user.recentRegexTests.filter(
    (id) => id.toString() !== testId
  );
  await user.save();

  return new Response(
    JSON.stringify({ message: "Test deleted successfully" }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
