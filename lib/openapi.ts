const json = (schema: Record<string, unknown>, description: string) => ({
  description,
  content: {
    "application/json": { schema },
  },
});

const errorSchema = { $ref: "#/components/schemas/Error" };
const messageSchema = { $ref: "#/components/schemas/Message" };

const errorResponse = (description: string, statusDescription = description) =>
  json(errorSchema, statusDescription);

const idParameter = {
  name: "id",
  in: "path",
  required: true,
  schema: { type: "string" },
};

const sessionSecurity = [{ session: [] }];

export const openApiDocument = {
  openapi: "3.1.0",
  info: {
    title: "Portfolio API",
    version: "1.0.0",
    description:
      "HTTP API for the portfolio site. Admin routes require the Better Auth session cookie. Contact and GitHub routes are public.",
  },
  servers: [{ url: "/" }],
  tags: [
    { name: "Auth", description: "Email sign-in, the current session, and sign-out." },
    { name: "Contact", description: "Public contact form." },
    { name: "GitHub", description: "Public pinned and recent repositories." },
    { name: "Posts", description: "Admin blog posts." },
    { name: "Projects", description: "Admin projects." },
    { name: "Skills", description: "Admin skills and skill categories." },
    { name: "Experiences", description: "Admin work history." },
  ],
  components: {
    securitySchemes: {
      session: {
        type: "apiKey",
        in: "cookie",
        name: "better-auth.session_token",
        description: "Session cookie issued by POST /api/auth/sign-in/email.",
      },
    },
    schemas: {
      Error: {
        type: "object",
        properties: {
          error: { type: "string" },
        },
        required: ["error"],
      },
      Message: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
        required: ["message"],
      },
      ContactResult: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          message: { type: "string" },
          error: { type: "string" },
          configured: { type: "boolean" },
        },
        required: ["success"],
      },
      AuthUser: {
        type: "object",
        properties: {
          id: { type: "string" },
          email: { type: "string", format: "email" },
          name: { type: "string" },
          emailVerified: { type: "boolean" },
          image: { type: "string", nullable: true },
        },
      },
      SignInResult: {
        type: "object",
        properties: {
          token: { type: "string", nullable: true },
          user: { $ref: "#/components/schemas/AuthUser" },
        },
      },
      SessionResult: {
        type: "object",
        nullable: true,
        properties: {
          session: { type: "object", additionalProperties: true },
          user: { $ref: "#/components/schemas/AuthUser" },
        },
      },
      Post: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          slug: { type: "string" },
          category: { type: "string", nullable: true },
          excerpt: { type: "string", nullable: true },
          content: { type: "string" },
          thumbnail: { type: "string" },
          tags: { type: "string", nullable: true },
          views: { type: "integer" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
        required: ["title", "slug", "content", "thumbnail"],
      },
      PostInput: {
        type: "object",
        properties: {
          title: { type: "string" },
          slug: { type: "string" },
          category: { type: "string" },
          excerpt: { type: "string" },
          content: { type: "string" },
          thumbnail: { type: "string", format: "uri" },
          tags: { type: "string", description: "Comma-separated tags." },
        },
        required: ["title", "slug", "content", "thumbnail"],
      },
      Project: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          slug: { type: "string" },
          featured: { type: "boolean" },
          stacks: { type: "string" },
          thumbnail: { type: "string" },
          excerpt: { type: "string" },
          links: { type: "object", additionalProperties: true },
          githubUrl: { type: "string", nullable: true },
          clientLive: { type: "string", nullable: true },
          apiLive: { type: "string", nullable: true },
          challenge: { type: "string", nullable: true },
          solution: { type: "string", nullable: true },
          impact: { type: "string", nullable: true },
          metrics: { type: "array", items: { type: "object", additionalProperties: true } },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      ProjectInput: {
        type: "object",
        properties: {
          title: { type: "string" },
          slug: { type: "string" },
          featured: { type: "boolean" },
          stacks: { type: "string", description: "Comma-separated stack names." },
          thumbnail: { type: "string", format: "uri" },
          excerpt: { type: "string" },
          links: { type: "object", additionalProperties: true },
          githubUrl: { type: "string" },
          clientLive: { type: "string" },
          apiLive: { type: "string" },
          challenge: { type: "string" },
          solution: { type: "string" },
          impact: { type: "string" },
          metrics: {
            type: "array",
            items: {
              type: "object",
              properties: {
                label: { type: "string" },
                value: { type: "string" },
              },
            },
          },
        },
        required: ["title", "slug", "stacks", "thumbnail", "excerpt"],
      },
      SkillCategory: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string", nullable: true },
          slug: { type: "string", nullable: true },
        },
      },
      SkillCategoryInput: {
        type: "object",
        properties: {
          name: { type: "string" },
          slug: { type: "string" },
        },
        required: ["name", "slug"],
      },
      Skill: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          level: { type: "integer", minimum: 0, maximum: 100 },
          categoryId: { type: "string" },
          category: { $ref: "#/components/schemas/SkillCategory" },
        },
      },
      SkillInput: {
        type: "object",
        properties: {
          name: { type: "string" },
          level: { type: "integer", minimum: 0, maximum: 100 },
          categoryId: { type: "string" },
        },
        required: ["name", "level", "categoryId"],
      },
      Experience: {
        type: "object",
        properties: {
          id: { type: "string" },
          company: { type: "string", nullable: true },
          role: { type: "string", nullable: true },
          period: { type: "string", nullable: true },
          duration: { type: "string", nullable: true },
          location: { type: "string", nullable: true },
          highlights: { type: "array", items: { type: "object", additionalProperties: true } },
          dotX: { type: "integer", nullable: true },
          dotY: { type: "integer", nullable: true },
          cardX: { type: "integer", nullable: true },
          cardY: { type: "integer", nullable: true },
          yearLabel: { type: "string", nullable: true },
          color: { type: "string", nullable: true },
          isCurrent: { type: "boolean" },
        },
      },
      ExperienceInput: {
        type: "object",
        properties: {
          company: { type: "string" },
          role: { type: "string" },
          period: { type: "string" },
          duration: { type: "string" },
          location: { type: "string" },
          highlights: { type: "array", items: { type: "object", additionalProperties: true } },
          dotX: { type: "integer" },
          dotY: { type: "integer" },
          cardX: { type: "integer" },
          cardY: { type: "integer" },
          yearLabel: { type: "string" },
          color: { type: "string" },
          isCurrent: { type: "boolean" },
        },
      },
      Repository: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          url: { type: "string" },
          description: { type: "string", nullable: true },
          updatedAt: { type: "string", format: "date-time" },
          stars: { type: "integer" },
          forks: { type: "integer" },
          topics: { type: "array", items: { type: "string" } },
          languages: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                color: { type: "string", nullable: true },
              },
            },
          },
          isPinned: { type: "boolean" },
        },
      },
    },
  },
  paths: {
    "/api/auth/sign-in/email": {
      post: {
        tags: ["Auth"],
        operationId: "signInEmail",
        summary: "Sign in with email and password",
        security: [],
        requestBody: json(
          {
            type: "object",
            properties: {
              email: { type: "string", format: "email" },
              password: { type: "string" },
            },
            required: ["email", "password"],
          },
          "Credentials",
        ),
        responses: {
          "200": json({ $ref: "#/components/schemas/SignInResult" }, "Session created."),
          "401": errorResponse("Invalid credentials."),
        },
      },
    },
    "/api/auth/get-session": {
      get: {
        tags: ["Auth"],
        operationId: "getSession",
        summary: "Read the current session",
        security: sessionSecurity,
        responses: {
          "200": json({ $ref: "#/components/schemas/SessionResult" }, "Current session, or null."),
        },
      },
    },
    "/api/auth/sign-out": {
      post: {
        tags: ["Auth"],
        operationId: "signOut",
        summary: "Sign out",
        security: sessionSecurity,
        responses: {
          "200": json(
            {
              type: "object",
              properties: { success: { type: "boolean" } },
            },
            "Session cleared.",
          ),
        },
      },
    },
    "/api/contact": {
      post: {
        tags: ["Contact"],
        operationId: "sendContactMessage",
        summary: "Send a contact message",
        security: [],
        requestBody: json(
          {
            type: "object",
            properties: {
              name: { type: "string" },
              email: { type: "string", format: "email" },
              subject: { type: "string" },
              message: { type: "string" },
            },
            required: ["name", "email", "message"],
          },
          "Contact form",
        ),
        responses: {
          "200": json({ $ref: "#/components/schemas/ContactResult" }, "Message accepted by EmailJS."),
          "400": json({ $ref: "#/components/schemas/ContactResult" }, "Invalid payload."),
          "503": json({ $ref: "#/components/schemas/ContactResult" }, "EmailJS is not configured."),
          "504": json({ $ref: "#/components/schemas/ContactResult" }, "EmailJS did not respond in time."),
        },
      },
    },
    "/api/github/repositories": {
      get: {
        tags: ["GitHub"],
        operationId: "listGithubRepositories",
        summary: "List pinned and recent public repositories",
        security: [],
        responses: {
          "200": json(
            {
              type: "object",
              properties: {
                repositories: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Repository" },
                },
              },
              required: ["repositories"],
            },
            "Up to six repositories.",
          ),
          "502": errorResponse("GitHub request failed."),
          "503": errorResponse("GITHUB_TOKEN is not configured."),
        },
      },
    },
    "/api/admin/posts": {
      get: {
        tags: ["Posts"],
        operationId: "listPosts",
        summary: "List posts",
        security: sessionSecurity,
        responses: {
          "200": json(
            {
              type: "object",
              properties: { posts: { type: "array", items: { $ref: "#/components/schemas/Post" } } },
              required: ["posts"],
            },
            "Posts, newest first.",
          ),
          "401": errorResponse("Missing session."),
          "500": errorResponse("Failed to fetch posts."),
        },
      },
      post: {
        tags: ["Posts"],
        operationId: "createPost",
        summary: "Create a post",
        security: sessionSecurity,
        requestBody: json({ $ref: "#/components/schemas/PostInput" }, "Post"),
        responses: {
          "201": json(
            { type: "object", properties: { post: { $ref: "#/components/schemas/Post" } }, required: ["post"] },
            "Created post.",
          ),
          "400": errorResponse("Missing required fields."),
          "401": errorResponse("Missing session."),
          "500": errorResponse("Failed to create post."),
        },
      },
    },
    "/api/admin/posts/{id}": {
      parameters: [idParameter],
      get: {
        tags: ["Posts"],
        operationId: "getPost",
        summary: "Get a post",
        security: sessionSecurity,
        responses: {
          "200": json(
            { type: "object", properties: { post: { $ref: "#/components/schemas/Post" } }, required: ["post"] },
            "Post.",
          ),
          "401": errorResponse("Missing session."),
          "404": errorResponse("Post not found."),
        },
      },
      put: {
        tags: ["Posts"],
        operationId: "updatePost",
        summary: "Update a post",
        security: sessionSecurity,
        requestBody: json({ $ref: "#/components/schemas/PostInput" }, "Post fields to replace."),
        responses: {
          "200": json(
            { type: "object", properties: { post: { $ref: "#/components/schemas/Post" } }, required: ["post"] },
            "Updated post.",
          ),
          "401": errorResponse("Missing session."),
          "500": errorResponse("Failed to update post."),
        },
      },
      delete: {
        tags: ["Posts"],
        operationId: "deletePost",
        summary: "Delete a post",
        security: sessionSecurity,
        responses: {
          "200": json(messageSchema, "Post deleted."),
          "401": errorResponse("Missing session."),
          "500": errorResponse("Failed to delete post."),
        },
      },
    },
    "/api/admin/projects": {
      get: {
        tags: ["Projects"],
        operationId: "listProjects",
        summary: "List projects",
        security: sessionSecurity,
        responses: {
          "200": json(
            {
              type: "object",
              properties: { projects: { type: "array", items: { $ref: "#/components/schemas/Project" } } },
              required: ["projects"],
            },
            "Projects, newest first.",
          ),
          "401": errorResponse("Missing session."),
        },
      },
      post: {
        tags: ["Projects"],
        operationId: "createProject",
        summary: "Create a project",
        security: sessionSecurity,
        requestBody: json({ $ref: "#/components/schemas/ProjectInput" }, "Project"),
        responses: {
          "201": json(
            { type: "object", properties: { project: { $ref: "#/components/schemas/Project" } }, required: ["project"] },
            "Created project.",
          ),
          "400": errorResponse("Missing required fields."),
          "401": errorResponse("Missing session."),
        },
      },
    },
    "/api/admin/projects/{id}": {
      parameters: [idParameter],
      get: {
        tags: ["Projects"],
        operationId: "getProject",
        summary: "Get a project",
        security: sessionSecurity,
        responses: {
          "200": json(
            { type: "object", properties: { project: { $ref: "#/components/schemas/Project" } }, required: ["project"] },
            "Project.",
          ),
          "401": errorResponse("Missing session."),
          "404": errorResponse("Project not found."),
        },
      },
      put: {
        tags: ["Projects"],
        operationId: "updateProject",
        summary: "Update a project",
        security: sessionSecurity,
        requestBody: json({ $ref: "#/components/schemas/ProjectInput" }, "Project fields to replace."),
        responses: {
          "200": json(
            { type: "object", properties: { project: { $ref: "#/components/schemas/Project" } }, required: ["project"] },
            "Updated project.",
          ),
          "401": errorResponse("Missing session."),
        },
      },
      delete: {
        tags: ["Projects"],
        operationId: "deleteProject",
        summary: "Delete a project",
        security: sessionSecurity,
        responses: {
          "200": json(messageSchema, "Project deleted."),
          "401": errorResponse("Missing session."),
        },
      },
    },
    "/api/admin/skill-categories": {
      get: {
        tags: ["Skills"],
        operationId: "listSkillCategories",
        summary: "List skill categories",
        security: sessionSecurity,
        responses: {
          "200": json(
            {
              type: "object",
              properties: {
                categories: { type: "array", items: { $ref: "#/components/schemas/SkillCategory" } },
              },
              required: ["categories"],
            },
            "Categories, newest first.",
          ),
          "401": errorResponse("Missing session."),
        },
      },
      post: {
        tags: ["Skills"],
        operationId: "createSkillCategory",
        summary: "Create a skill category",
        security: sessionSecurity,
        requestBody: json({ $ref: "#/components/schemas/SkillCategoryInput" }, "Category"),
        responses: {
          "201": json(
            {
              type: "object",
              properties: { category: { $ref: "#/components/schemas/SkillCategory" } },
              required: ["category"],
            },
            "Created category.",
          ),
          "400": errorResponse("Missing required fields."),
          "401": errorResponse("Missing session."),
        },
      },
    },
    "/api/admin/skills": {
      get: {
        tags: ["Skills"],
        operationId: "listSkills",
        summary: "List skills",
        security: sessionSecurity,
        responses: {
          "200": json(
            {
              type: "object",
              properties: { skills: { type: "array", items: { $ref: "#/components/schemas/Skill" } } },
              required: ["skills"],
            },
            "Skills with their categories.",
          ),
          "401": errorResponse("Missing session."),
        },
      },
      post: {
        tags: ["Skills"],
        operationId: "createSkill",
        summary: "Create a skill",
        security: sessionSecurity,
        requestBody: json({ $ref: "#/components/schemas/SkillInput" }, "Skill"),
        responses: {
          "201": json(
            { type: "object", properties: { skill: { $ref: "#/components/schemas/Skill" } }, required: ["skill"] },
            "Created skill.",
          ),
          "400": errorResponse("Missing required fields."),
          "401": errorResponse("Missing session."),
        },
      },
    },
    "/api/admin/skills/{id}": {
      parameters: [idParameter],
      get: {
        tags: ["Skills"],
        operationId: "getSkill",
        summary: "Get a skill",
        security: sessionSecurity,
        responses: {
          "200": json(
            { type: "object", properties: { skill: { $ref: "#/components/schemas/Skill" } }, required: ["skill"] },
            "Skill.",
          ),
          "401": errorResponse("Missing session."),
          "404": errorResponse("Skill not found."),
        },
      },
      put: {
        tags: ["Skills"],
        operationId: "updateSkill",
        summary: "Update a skill",
        security: sessionSecurity,
        requestBody: json({ $ref: "#/components/schemas/SkillInput" }, "Skill fields to replace."),
        responses: {
          "200": json(
            { type: "object", properties: { skill: { $ref: "#/components/schemas/Skill" } }, required: ["skill"] },
            "Updated skill.",
          ),
          "401": errorResponse("Missing session."),
        },
      },
      delete: {
        tags: ["Skills"],
        operationId: "deleteSkill",
        summary: "Delete a skill",
        security: sessionSecurity,
        responses: {
          "200": json(messageSchema, "Skill deleted."),
          "401": errorResponse("Missing session."),
        },
      },
    },
    "/api/admin/experiences": {
      get: {
        tags: ["Experiences"],
        operationId: "listExperiences",
        summary: "List experiences",
        security: sessionSecurity,
        responses: {
          "200": json(
            {
              type: "object",
              properties: {
                experiences: { type: "array", items: { $ref: "#/components/schemas/Experience" } },
              },
              required: ["experiences"],
            },
            "Experiences, newest first.",
          ),
          "401": errorResponse("Missing session."),
        },
      },
      post: {
        tags: ["Experiences"],
        operationId: "createExperience",
        summary: "Create an experience",
        security: sessionSecurity,
        requestBody: json({ $ref: "#/components/schemas/ExperienceInput" }, "Experience"),
        responses: {
          "201": json(
            {
              type: "object",
              properties: { experience: { $ref: "#/components/schemas/Experience" } },
              required: ["experience"],
            },
            "Created experience.",
          ),
          "401": errorResponse("Missing session."),
        },
      },
    },
    "/api/admin/experiences/{id}": {
      parameters: [idParameter],
      get: {
        tags: ["Experiences"],
        operationId: "getExperience",
        summary: "Get an experience",
        security: sessionSecurity,
        responses: {
          "200": json(
            {
              type: "object",
              properties: { experience: { $ref: "#/components/schemas/Experience" } },
              required: ["experience"],
            },
            "Experience.",
          ),
          "401": errorResponse("Missing session."),
          "404": errorResponse("Experience not found."),
        },
      },
      put: {
        tags: ["Experiences"],
        operationId: "updateExperience",
        summary: "Update an experience",
        security: sessionSecurity,
        requestBody: json({ $ref: "#/components/schemas/ExperienceInput" }, "Experience fields to replace."),
        responses: {
          "200": json(
            {
              type: "object",
              properties: { experience: { $ref: "#/components/schemas/Experience" } },
              required: ["experience"],
            },
            "Updated experience.",
          ),
          "401": errorResponse("Missing session."),
        },
      },
      delete: {
        tags: ["Experiences"],
        operationId: "deleteExperience",
        summary: "Delete an experience",
        security: sessionSecurity,
        responses: {
          "200": json(messageSchema, "Experience deleted."),
          "401": errorResponse("Missing session."),
        },
      },
    },
  },
};
