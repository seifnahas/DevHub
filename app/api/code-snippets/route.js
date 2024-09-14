import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import User from "@/models/User";
import CodeSnippet from "@/models/CodeSnippet";
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

  const codeSnippets = await CodeSnippet.find({ user: user._id }).sort({
    createdAt: -1,
  });

  return new Response(JSON.stringify(codeSnippets), {
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

  const { title, code, language, description } = await req.json();

  const newSnippet = new CodeSnippet({
    title,
    code,
    language,
    description,
    user: user._id,
  });

  await newSnippet.save();

  user.codeSnippets.push(newSnippet._id);
  await user.save();

  return new Response(JSON.stringify(newSnippet), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}

export async function PUT(req) {
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

  const { _id, title, code, language, description } = await req.json();

  if (!_id) {
    return new Response(JSON.stringify({ error: "Snippet ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const updatedSnippet = await CodeSnippet.findOneAndUpdate(
    { _id: _id, user: user._id },
    { title, code, language, description },
    { new: true }
  );

  if (!updatedSnippet) {
    return new Response(JSON.stringify({ error: "Snippet not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(updatedSnippet), {
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
  const snippetId = url.searchParams.get("_id") || url.searchParams.get("id");

  if (!snippetId) {
    return new Response(JSON.stringify({ error: "Snippet ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const deletedSnippet = await CodeSnippet.findOneAndDelete({
    _id: snippetId,
    user: user._id,
  });

  if (!deletedSnippet) {
    return new Response(JSON.stringify({ error: "Snippet not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  user.codeSnippets = user.codeSnippets.filter(
    (id) => id.toString() !== snippetId
  );
  await user.save();

  return new Response(
    JSON.stringify({ message: "Snippet deleted successfully" }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
