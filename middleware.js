export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard(.*)",
    "/code-snippets(.*)",
    "/api-tester(.*)",
    "/json-tools(.*)",
    "/unit-converter(.*)",
    "/regex-tester(.*)",
  ],
};
