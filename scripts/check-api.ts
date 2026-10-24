import "dotenv/config";
import { handleApi } from "../server/router.ts";

const projects = await handleApi({
  method: "GET",
  pathname: "/api/projects",
  cookieHeader: null,
  body: null,
  secureCookie: false,
});

const titles = Array.isArray(projects.body)
  ? projects.body.map((project) => {
      if (project && typeof project === "object" && "title" in project) {
        return String(project.title);
      }
      return "?";
    })
  : projects.body;
console.log("projects", projects.status, titles);

const gallery = await handleApi({
  method: "GET",
  pathname: "/api/gallery",
  cookieHeader: null,
  body: null,
  secureCookie: false,
});
console.log("gallery", gallery.status, Array.isArray(gallery.body) ? gallery.body.length : gallery.body);

const bad = await handleApi({
  method: "POST",
  pathname: "/api/auth/login",
  cookieHeader: null,
  body: { email: "nope@example.com", password: "nope" },
  secureCookie: false,
});
console.log("bad login", bad.status);

const good = await handleApi({
  method: "POST",
  pathname: "/api/auth/login",
  cookieHeader: null,
  body: { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD },
  secureCookie: false,
});
console.log("good login", good.status, good.body);

const cookie = good.cookies?.[0]?.split(";")[0] ?? "";
const session = await handleApi({
  method: "GET",
  pathname: "/api/auth/session",
  cookieHeader: cookie,
  body: null,
  secureCookie: false,
});
console.log("session", session.status, session.body);

const denied = await handleApi({
  method: "POST",
  pathname: "/api/projects",
  cookieHeader: null,
  body: { title: "x" },
  secureCookie: false,
});
console.log("unauth create", denied.status);
