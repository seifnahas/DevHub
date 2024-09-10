// import { getSession } from "@auth0/nextjs-auth0";
// import { createOrUpdateUser } from "@/lib/mongodb";

// export async function POST(req) {
//   try {
//     const session = await getSession();

//     if (!session || !session.user) {
//       return new Response(JSON.stringify({ error: "Not authenticated" }), {
//         status: 401,
//         headers: { "Content-Type": "application/json" },
//       });
//     }

//     const { sub, name, nickname, picture, updated_at } = session.user;

//     const userData = {
//       auth0_id: sub,
//       name,
//       nickname,
//       picture,
//       last_updated: updated_at,
//     };

//     const result = await createOrUpdateUser(userData);

//     return new Response(JSON.stringify(result), {
//       status: 200,
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (error) {
//     console.error("Error processing user data:", error);
//     return new Response(JSON.stringify({ error: "Internal Server Error" }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" },
//     });
//   }
// }
