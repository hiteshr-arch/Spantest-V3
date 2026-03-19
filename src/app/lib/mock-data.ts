export interface Project {
  id: string;
  name: string;
  status: "active" | "archived";
  lastActive: string;
  testCases: number;
  scriptsGenerated: number;
  frameworks: string[];
  createdAt: string;
  createdBy: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: string;
}

export const currentUser: UserProfile = {
  id: "u1",
  name: "John Doe",
  email: "john.doe@spantest.io",
  initials: "JD",
  role: "QA Lead",
};

export const projects: Project[] = [
  {
    id: "p1",
    name: "E-Commerce App",
    status: "active",
    lastActive: "2h ago",
    testCases: 54,
    scriptsGenerated: 32,
    frameworks: ["Python"],
    createdAt: "2026-01-15",
    createdBy: "John Doe",
  },
  {
    id: "p2",
    name: "Auth Service",
    status: "active",
    lastActive: "2h ago",
    testCases: 54,
    scriptsGenerated: 28,
    frameworks: ["Python"],
    createdAt: "2026-02-10",
    createdBy: "Jane Smith",
  },
  {
    id: "p3",
    name: "Mobile API",
    status: "active",
    lastActive: "2h ago",
    testCases: 34,
    scriptsGenerated: 29,
    frameworks: ["Python"],
    createdAt: "2026-03-01",
    createdBy: "Alex Johnson",
  },
];

export const tokensRemaining = 240;

// Generator types
export type TestType = "ui" | "api";
export type GenerateMode = "scenario-testcase" | "scenario-only";

export interface TestStep {
  id: string;
  precondition: string;
  step: string;
  testData: string;
  expectedResult: string;
}

export interface ApiTestStep {
  id: string;
  url: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  authentication: string;
  header: string;
  params: string;
  payload: string;
  outputStatusCode: string;
  expectedResponse: string;
}

export interface Scenario {
  id: string;
  scenarioId: string;
  title: string;
  type: TestType;
  priority: "High" | "Medium" | "Low";
  category: "Positive" | "Negative" | "Edge Case";
  steps: TestStep[];
  apiSteps: ApiTestStep[];
}

export interface GeneratorMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  testType?: TestType;
  mode?: GenerateMode;
  attachments?: { name: string; size: string }[];
  scenarios?: Scenario[];
  timestamp: string;
  savedToRepo?: boolean;
}

// Mock generated scenarios for demo
export const mockGeneratedScenarios: Scenario[] = [
  {
    id: "sc1",
    scenarioId: "s1",
    title: "Verify successful user login with valid credentials",
    type: "ui",
    priority: "High",
    category: "Positive",
    steps: [
      { id: "st1", precondition: "Login page is accessible", step: "Navigate to the login page", testData: "URL: /login", expectedResult: "Login page is displayed with email and password fields" },
      { id: "st2", precondition: "Login page is loaded", step: "Enter valid email address", testData: "Email: john@example.com", expectedResult: "Email field accepts input without error" },
      { id: "st3", precondition: "Email is entered", step: "Enter valid password", testData: "Password: Test@1234", expectedResult: "Password field accepts input and masks characters" },
      { id: "st4", precondition: "Credentials are filled", step: "Click the Login button", testData: "—", expectedResult: "User is redirected to the dashboard" },
    ],
    apiSteps: [],
  },
  {
    id: "sc2",
    scenarioId: "s2",
    title: "Verify error message for invalid credentials",
    type: "ui",
    priority: "High",
    category: "Negative",
    steps: [
      { id: "st5", precondition: "Login page is accessible", step: "Navigate to the login page", testData: "URL: /login", expectedResult: "Login page is displayed" },
      { id: "st6", precondition: "Login page is loaded", step: "Enter invalid email address", testData: "Email: invalid@test", expectedResult: "Email field accepts input" },
      { id: "st7", precondition: "Invalid email entered", step: "Enter incorrect password", testData: "Password: wrong123", expectedResult: "Password field accepts input" },
      { id: "st8", precondition: "Invalid credentials filled", step: "Click the Login button", testData: "—", expectedResult: "Error message 'Invalid credentials' is displayed" },
    ],
    apiSteps: [],
  },
  {
    id: "sc3",
    scenarioId: "s3",
    title: "Verify password field validation",
    type: "ui",
    priority: "Medium",
    category: "Negative",
    steps: [
      { id: "st9", precondition: "Login page is accessible", step: "Navigate to the login page", testData: "URL: /login", expectedResult: "Login page is displayed" },
      { id: "st10", precondition: "Login page is loaded", step: "Leave password field empty and click Login", testData: "Password: (empty)", expectedResult: "Validation error 'Password is required' is shown" },
      { id: "st11", precondition: "Login page is loaded", step: "Enter password less than 8 characters", testData: "Password: abc12", expectedResult: "Validation error 'Password must be at least 8 characters' is shown" },
    ],
    apiSteps: [],
  },
  {
    id: "sc4",
    scenarioId: "s4",
    title: "Verify 'Forgot Password' flow",
    type: "ui",
    priority: "Medium",
    category: "Positive",
    steps: [
      { id: "st12", precondition: "Login page is loaded", step: "Click 'Forgot Password?' link on login page", testData: "—", expectedResult: "Forgot password page is displayed" },
      { id: "st13", precondition: "Forgot password page is loaded", step: "Enter registered email and submit", testData: "Email: john@example.com", expectedResult: "Success message 'Reset link sent' is displayed" },
      { id: "st14", precondition: "Forgot password page is loaded", step: "Enter unregistered email and submit", testData: "Email: nobody@test.com", expectedResult: "Error message 'Email not found' is displayed" },
    ],
    apiSteps: [],
  },
  {
    id: "sc5",
    scenarioId: "s5",
    title: "Verify session timeout and re-authentication",
    type: "ui",
    priority: "Low",
    category: "Edge Case",
    steps: [
      { id: "st15", precondition: "User is logged in", step: "Login successfully and remain idle for session timeout duration", testData: "Idle time: 30 min", expectedResult: "User is redirected to login page with session expired message" },
      { id: "st16", precondition: "Session has expired", step: "Re-enter valid credentials after timeout", testData: "Email: john@example.com, Password: Test@1234", expectedResult: "User is logged in successfully" },
    ],
    apiSteps: [],
  },
];

export const mockApiScenarios: Scenario[] = [
  {
    id: "asc1",
    scenarioId: "as1",
    title: "Verify successful login via API with valid credentials",
    type: "api",
    priority: "High",
    category: "Positive",
    steps: [],
    apiSteps: [
      {
        id: "ast1",
        url: "https://api.spantest.io",
        endpoint: "/v1/auth/login",
        method: "POST",
        authentication: "None",
        header: "Content-Type: application/json",
        params: "—",
        payload: '{ "email": "john@example.com", "password": "Test@1234" }',
        outputStatusCode: "200",
        expectedResponse: '{ "token": "eyJhbGciOi...", "user": { "id": "u1" } }',
      },
    ],
  },
  {
    id: "asc2",
    scenarioId: "as2",
    title: "Verify login fails with invalid credentials",
    type: "api",
    priority: "High",
    category: "Negative",
    steps: [],
    apiSteps: [
      {
        id: "ast2",
        url: "https://api.spantest.io",
        endpoint: "/v1/auth/login",
        method: "POST",
        authentication: "None",
        header: "Content-Type: application/json",
        params: "—",
        payload: '{ "email": "wrong@test.com", "password": "bad123" }',
        outputStatusCode: "401",
        expectedResponse: '{ "error": "Invalid credentials" }',
      },
    ],
  },
  {
    id: "asc3",
    scenarioId: "as3",
    title: "Verify fetching user profile with valid token",
    type: "api",
    priority: "Medium",
    category: "Positive",
    steps: [],
    apiSteps: [
      {
        id: "ast3",
        url: "https://api.spantest.io",
        endpoint: "/v1/users/me",
        method: "GET",
        authentication: "Bearer <token>",
        header: "Authorization: Bearer eyJhbGciOi...",
        params: "—",
        payload: "—",
        outputStatusCode: "200",
        expectedResponse: '{ "id": "u1", "name": "John Doe", "email": "john@example.com" }',
      },
    ],
  },
  {
    id: "asc4",
    scenarioId: "as4",
    title: "Verify creating a new project via API",
    type: "api",
    priority: "Medium",
    category: "Positive",
    steps: [],
    apiSteps: [
      {
        id: "ast4",
        url: "https://api.spantest.io",
        endpoint: "/v1/projects",
        method: "POST",
        authentication: "Bearer <token>",
        header: "Content-Type: application/json; Authorization: Bearer eyJhbGciOi...",
        params: "—",
        payload: '{ "name": "New Project", "framework": "Python" }',
        outputStatusCode: "201",
        expectedResponse: '{ "id": "p4", "name": "New Project", "status": "active" }',
      },
    ],
  },
  {
    id: "asc5",
    scenarioId: "as5",
    title: "Verify API rate limiting on excessive requests",
    type: "api",
    priority: "Low",
    category: "Edge Case",
    steps: [],
    apiSteps: [
      {
        id: "ast5",
        url: "https://api.spantest.io",
        endpoint: "/v1/auth/login",
        method: "POST",
        authentication: "None",
        header: "Content-Type: application/json",
        params: "—",
        payload: '{ "email": "john@example.com", "password": "Test@1234" }',
        outputStatusCode: "429",
        expectedResponse: '{ "error": "Too many requests", "retryAfter": 60 }',
      },
    ],
  },
];

export const getDashboardStats = (filteredProjects: Project[]) => {
  const totalProjects = filteredProjects.length;
  const totalTestCases = filteredProjects.reduce((sum, p) => sum + p.testCases, 0);
  const totalScripts = filteredProjects.reduce((sum, p) => sum + p.scriptsGenerated, 0);
  return { totalProjects, totalTestCases, totalScripts };
};

// ─── Repository types & mock data ───────────────────────────────────────────

export interface RepoFolder {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
}

export interface RepoItem {
  id: string;
  name: string;
  type: "scenario" | "testcase" | "script";
  testType: TestType;
  priority: "High" | "Medium" | "Low";
  category: "Positive" | "Negative" | "Edge Case";
  folderId: string;
  savedAt: string;
  savedBy: string;
  stepsCount: number;
  scenario: Scenario;
  scriptFramework?: ScriptFramework;
  sourceStory?: string;
  linkedStoryId?: string;
}

export const mockRepoFolders: RepoFolder[] = [
  { id: "rf1", name: "Login Module", parentId: null, createdAt: "2026-02-10" },
  { id: "rf2", name: "UI Tests", parentId: "rf1", createdAt: "2026-02-11" },
  { id: "rf3", name: "Functional Tests", parentId: "rf2", createdAt: "2026-02-12" },
  { id: "rf4", name: "Regression", parentId: "rf2", createdAt: "2026-02-13" },
  { id: "rf5", name: "API Tests", parentId: "rf1", createdAt: "2026-02-14" },
  { id: "rf6", name: "Auth Endpoints", parentId: "rf5", createdAt: "2026-02-15" },
  { id: "rf7", name: "User Management", parentId: null, createdAt: "2026-03-01" },
  { id: "rf8", name: "Profile Tests", parentId: "rf7", createdAt: "2026-03-02" },
  { id: "rf9", name: "Permissions", parentId: "rf7", createdAt: "2026-03-03" },
  { id: "rf10", name: "Checkout Flow", parentId: null, createdAt: "2026-03-05" },
  { id: "rf11", name: "Payment Gateway", parentId: "rf10", createdAt: "2026-03-06" },
  { id: "rf12", name: "Cart Operations", parentId: "rf10", createdAt: "2026-03-07" },
];

export const mockRepoItems: RepoItem[] = [
  {
    id: "ri10", name: "Verify API rate limiting on excessive requests", type: "scenario", testType: "api",
    priority: "Low", category: "Edge Case", folderId: "rf5", savedAt: "2026-03-05", savedBy: "Alex Johnson", stepsCount: 1,
    scenario: mockApiScenarios[4], sourceStory: "User login via API",
  },
  {
    id: "ri11", name: "Verify successful user login with valid credentials", type: "script", testType: "ui",
    priority: "High", category: "Positive", folderId: "rf3", savedAt: "2026-03-08", savedBy: "John Doe", stepsCount: 4,
    scenario: mockGeneratedScenarios[0], scriptFramework: "python", sourceStory: "User login functionality",
  },
  {
    id: "ri12", name: "Verify error message for invalid credentials", type: "script", testType: "ui",
    priority: "High", category: "Negative", folderId: "rf3", savedAt: "2026-03-08", savedBy: "John Doe", stepsCount: 4,
    scenario: mockGeneratedScenarios[1], scriptFramework: "python", sourceStory: "User login functionality",
  },
  {
    id: "ri14", name: "Verify password field validation", type: "testcase", testType: "ui",
    priority: "Medium", category: "Negative", folderId: "rf3", savedAt: "2026-03-08", savedBy: "John Doe", stepsCount: 3,
    scenario: mockGeneratedScenarios[2], sourceStory: "User login functionality",
  },
  {
    id: "ri15", name: "Verify 'Forgot Password' flow", type: "testcase", testType: "ui",
    priority: "Medium", category: "Positive", folderId: "rf3", savedAt: "2026-03-08", savedBy: "John Doe", stepsCount: 3,
    scenario: mockGeneratedScenarios[3], sourceStory: "User login functionality",
  },
  {
    id: "ri16", name: "Verify session timeout and re-authentication", type: "testcase", testType: "ui",
    priority: "Low", category: "Edge Case", folderId: "rf4", savedAt: "2026-03-08", savedBy: "John Doe", stepsCount: 2,
    scenario: mockGeneratedScenarios[4], sourceStory: "User login functionality",
  },
  {
    id: "ri13", name: "Verify successful login via API with valid credentials", type: "script", testType: "api",
    priority: "High", category: "Positive", folderId: "rf6", savedAt: "2026-03-09", savedBy: "Alex Johnson", stepsCount: 1,
    scenario: mockApiScenarios[0], scriptFramework: "python", sourceStory: "User login via API",
  },
];

// ─── Script generation types & mock data ──────────────────────────────────────

export type ScriptFramework = "python";

export interface GeneratedScript {
  id: string;
  scenarioId: string;
  scenarioTitle: string;
  framework: ScriptFramework;
  language: string;
  code: string;
}

export function generateMockScript(scenario: Scenario, framework: ScriptFramework): GeneratedScript {
  // Legacy single-scenario script — kept for compatibility
  return generateCombinedPythonScript([scenario]);
}

export function generateCombinedPythonScript(scenarios: Scenario[]): GeneratedScript {
  const hasApi = scenarios.some((sc) => sc.type === "api" && sc.apiSteps.length > 0);
  const hasUi = scenarios.some((sc) => sc.type === "ui" || sc.steps.length > 0);

  const imports: string[] = ["import pytest"];
  if (hasUi) imports.push("from selenium import webdriver", "from selenium.webdriver.common.by import By", "from selenium.webdriver.support.ui import WebDriverWait", "from selenium.webdriver.support import expected_conditions as EC");
  if (hasApi) imports.push("import requests");

  const classSlug = scenarios[0]?.title.replace(/[^a-zA-Z0-9]/g, "").slice(0, 30) || "Generated";

  const methods = scenarios.map((sc, idx) => {
    const methodName = `test_${sc.title.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase().slice(0, 60)}`;
    const isApi = sc.type === "api" && sc.apiSteps.length > 0;

    if (isApi) {
      const s = sc.apiSteps[0];
      const headers: string[] = [];
      if (s.authentication !== "None") headers.push(`"Authorization": "${s.authentication}"`);
      s.header.split(";").forEach((h) => {
        const [k, v] = h.split(":").map((x) => x.trim());
        if (k && v && !k.includes("Authorization")) headers.push(`"${k}": "${v}"`);
      });
      return `    @pytest.mark.parametrize("priority", ["${sc.priority}"])
    def ${methodName}(self, priority):
        """${sc.title} [${sc.category}]"""
        url = "${s.url}${s.endpoint}"
        headers = {${headers.map((h) => `\n            ${h}`).join(",")}\n        }${s.payload !== "—" ? `\n        payload = ${s.payload}` : ""}
        response = requests.${s.method.toLowerCase()}(url, headers=headers${s.payload !== "—" ? ", json=payload" : ""})
        assert response.status_code == ${s.outputStatusCode}
        data = response.json()
        assert data is not None`;
    }

    // UI test
    const stepsCode = sc.steps.map((s, i) => {
      const lines: string[] = [`        # Step ${i + 1}: ${s.step}`];
      if (s.step.toLowerCase().includes("navigate")) {
        const urlMatch = s.testData.match(/URL:\s*(\S+)/);
        lines.push(`        self.driver.get(self.base_url + "${urlMatch ? urlMatch[1] : "/"}")`);
      } else if (s.step.toLowerCase().includes("enter") && s.step.toLowerCase().includes("email")) {
        const emailMatch = s.testData.match(/Email:\s*(\S+)/);
        lines.push(`        email_field = WebDriverWait(self.driver, 10).until(`);
        lines.push(`            EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="email-input"]'))`);
        lines.push(`        )`);
        lines.push(`        email_field.clear()`);
        lines.push(`        email_field.send_keys("${emailMatch ? emailMatch[1] : "user@test.com"}")`);
      } else if (s.step.toLowerCase().includes("enter") && s.step.toLowerCase().includes("password")) {
        const pwMatch = s.testData.match(/Password:\s*(\S+)/);
        lines.push(`        pw_field = self.driver.find_element(By.CSS_SELECTOR, '[data-testid="password-input"]')`);
        lines.push(`        pw_field.clear()`);
        lines.push(`        pw_field.send_keys("${pwMatch ? pwMatch[1] : "Test@1234"}")`);
      } else if (s.step.toLowerCase().includes("click")) {
        lines.push(`        submit_btn = self.driver.find_element(By.CSS_SELECTOR, '[data-testid="submit-btn"]')`);
        lines.push(`        submit_btn.click()`);
      } else {
        lines.push(`        # TODO: Implement — ${s.step}`);
        lines.push(`        pass`);
      }
      // assertions
      if (s.expectedResult.toLowerCase().includes("redirect")) {
        lines.push(`        WebDriverWait(self.driver, 10).until(EC.url_contains("/dashboard"))`);
        lines.push(`        assert "/dashboard" in self.driver.current_url`);
      } else if (s.expectedResult.toLowerCase().includes("error")) {
        lines.push(`        error_el = WebDriverWait(self.driver, 10).until(`);
        lines.push(`            EC.visibility_of_element_located((By.CSS_SELECTOR, '[data-testid="error-message"]'))`);
        lines.push(`        )`);
        lines.push(`        assert error_el.is_displayed()`);
      } else if (s.expectedResult.toLowerCase().includes("displayed") || s.expectedResult.toLowerCase().includes("shown")) {
        lines.push(`        element = WebDriverWait(self.driver, 10).until(`);
        lines.push(`            EC.visibility_of_element_located((By.CSS_SELECTOR, '[data-testid="target-element"]'))`);
        lines.push(`        )`);
        lines.push(`        assert element.is_displayed()`);
      }
      return lines.join("\n");
    }).join("\n\n");

    return `    @pytest.mark.parametrize("priority", ["${sc.priority}"])
    def ${methodName}(self, priority):
        """${sc.title} [${sc.category}]"""
${stepsCode}`;
  }).join("\n\n");

  const setupTeardown = hasUi
    ? `\n    @pytest.fixture(autouse=True)
    def setup(self):
        self.base_url = "https://app.spantest.io"
        self.driver = webdriver.Chrome()
        self.driver.implicitly_wait(10)
        yield
        self.driver.quit()\n`
    : "";

  const code = `${imports.join("\n")}


class Test${classSlug}:
    """Auto-generated test suite — ${scenarios.length} test case(s)"""
${setupTeardown}
${methods}
`;

  return {
    id: `script-combined-${Date.now()}`,
    scenarioId: scenarios.map((s) => s.id).join(","),
    scenarioTitle: scenarios.length === 1 ? scenarios[0].title : `Combined Script (${scenarios.length} test cases)`,
    framework: "python",
    language: "Python",
    code,
  };
}

// ─── Jira Import types & mock data ──────────────────────────────────────────

export interface JiraConnection {
  id: string;
  instanceUrl: string;
  email: string;
  status: "connected" | "disconnected" | "error";
  connectedAt: string;
}

export interface JiraProject {
  id: string;
  key: string;
  name: string;
  avatarColor: string;
  issueCount: number;
}

export interface JiraSprint {
  id: string;
  projectId: string;
  name: string;
  status: "active" | "closed" | "future";
  startDate: string;
  endDate: string;
}

export type JiraIssueType = "story" | "bug" | "task" | "epic" | "test-case";
export type JiraIssueStatus = "To Do" | "In Progress" | "In Review" | "Done";
export type JiraIssuePriority = "Highest" | "High" | "Medium" | "Low" | "Lowest";

export interface JiraIssue {
  id: string;
  key: string;
  summary: string;
  type: JiraIssueType;
  status: JiraIssueStatus;
  priority: JiraIssuePriority;
  assignee: string;
  reporter: string;
  projectId: string;
  sprintId: string | null;
  labels: string[];
  storyPoints: number | null;
  createdAt: string;
  updatedAt: string;
  description: string;
  acceptanceCriteria: string[];
}

export const mockJiraConnection: JiraConnection = {
  id: "jc1",
  instanceUrl: "https://spantest-team.atlassian.net",
  email: "john.doe@spantest.io",
  status: "connected",
  connectedAt: "2026-03-10",
};

export const mockJiraProjects: JiraProject[] = [
  { id: "jp1", key: "ECOM", name: "E-Commerce Platform", avatarColor: "#1677ff", issueCount: 48 },
  { id: "jp2", key: "AUTH", name: "Authentication Service", avatarColor: "#7c3aed", issueCount: 23 },
  { id: "jp3", key: "MAPI", name: "Mobile API", avatarColor: "#d46b08", issueCount: 31 },
  { id: "jp4", key: "DASH", name: "Admin Dashboard", avatarColor: "#15803d", issueCount: 17 },
];

export const mockJiraSprints: JiraSprint[] = [
  { id: "js1", projectId: "jp1", name: "Sprint 14 — Checkout Revamp", status: "active", startDate: "2026-03-04", endDate: "2026-03-18" },
  { id: "js2", projectId: "jp1", name: "Sprint 13 — Cart Improvements", status: "closed", startDate: "2026-02-18", endDate: "2026-03-03" },
  { id: "js3", projectId: "jp1", name: "Sprint 15 — Payment Integration", status: "future", startDate: "2026-03-19", endDate: "2026-04-01" },
  { id: "js4", projectId: "jp2", name: "Sprint 8 — OAuth2 Flow", status: "active", startDate: "2026-03-04", endDate: "2026-03-18" },
  { id: "js5", projectId: "jp2", name: "Sprint 7 — Session Management", status: "closed", startDate: "2026-02-18", endDate: "2026-03-03" },
  { id: "js6", projectId: "jp3", name: "Sprint 6 — User Endpoints", status: "active", startDate: "2026-03-04", endDate: "2026-03-18" },
  { id: "js7", projectId: "jp4", name: "Sprint 3 — Role Management", status: "active", startDate: "2026-03-04", endDate: "2026-03-18" },
];

export const mockJiraIssues: JiraIssue[] = [
  {
    id: "ji1", key: "ECOM-142", summary: "As a user, I want to add items to cart so I can purchase them later",
    type: "story", status: "In Progress", priority: "High", assignee: "Jane Smith", reporter: "Alex Johnson",
    projectId: "jp1", sprintId: "js1", labels: ["checkout", "cart"], storyPoints: 5, createdAt: "2026-03-05", updatedAt: "2026-03-14",
    description: "Users should be able to add products to their shopping cart from the product detail page and category listing page. The cart icon in the header should update with the item count.",
    acceptanceCriteria: [
      "User can click 'Add to Cart' on product detail page",
      "Cart icon shows updated item count",
      "User sees confirmation toast after adding item",
      "Duplicate items increment quantity instead of adding new row",
    ],
  },
  {
    id: "ji2", key: "ECOM-143", summary: "As a user, I want to apply discount codes at checkout",
    type: "story", status: "To Do", priority: "Medium", assignee: "John Doe", reporter: "Alex Johnson",
    projectId: "jp1", sprintId: "js1", labels: ["checkout", "promo"], storyPoints: 3, createdAt: "2026-03-06", updatedAt: "2026-03-12",
    description: "At the checkout page, users should be able to enter a promo/discount code. The system should validate the code and apply the discount to the order total in real-time.",
    acceptanceCriteria: [
      "Discount code input field is visible on checkout page",
      "Valid code shows green success message with discount amount",
      "Invalid code shows red error message",
      "Order total updates immediately after applying code",
      "Only one discount code can be applied at a time",
    ],
  },
  {
    id: "ji3", key: "ECOM-144", summary: "Cart total miscalculated when quantity exceeds 99",
    type: "bug", status: "To Do", priority: "Highest", assignee: "Jane Smith", reporter: "John Doe",
    projectId: "jp1", sprintId: "js1", labels: ["cart", "critical"], storyPoints: 2, createdAt: "2026-03-07", updatedAt: "2026-03-13",
    description: "When a user sets the quantity of an item to 100 or more, the cart total displays $0.00. This seems to be an integer overflow issue in the price calculation.",
    acceptanceCriteria: [
      "Cart correctly calculates totals for quantities up to 9999",
      "Quantities above max display appropriate error message",
    ],
  },
  {
    id: "ji4", key: "ECOM-145", summary: "Implement payment gateway webhook handler",
    type: "task", status: "In Progress", priority: "High", assignee: "Alex Johnson", reporter: "Alex Johnson",
    projectId: "jp1", sprintId: "js1", labels: ["payment", "backend"], storyPoints: 8, createdAt: "2026-03-05", updatedAt: "2026-03-15",
    description: "Build the webhook endpoint to handle payment gateway callbacks for successful, failed, and refunded transactions.",
    acceptanceCriteria: [
      "Webhook receives and validates payment gateway signature",
      "Successful payment updates order status to 'Paid'",
      "Failed payment triggers retry notification to user",
      "Refund callback updates order status to 'Refunded'",
    ],
  },
  {
    id: "ji5", key: "ECOM-138", summary: "Checkout Flow — End-to-End",
    type: "epic", status: "In Progress", priority: "High", assignee: "Alex Johnson", reporter: "Alex Johnson",
    projectId: "jp1", sprintId: null, labels: ["checkout"], storyPoints: null, createdAt: "2026-02-20", updatedAt: "2026-03-14",
    description: "Epic covering the complete checkout flow from cart review to order confirmation, including address entry, payment, and receipt.",
    acceptanceCriteria: [],
  },
  {
    id: "ji6", key: "ECOM-146", summary: "Verify cart persistence across browser sessions",
    type: "test-case", status: "Done", priority: "Medium", assignee: "John Doe", reporter: "Jane Smith",
    projectId: "jp1", sprintId: "js2", labels: ["cart", "qa"], storyPoints: 2, createdAt: "2026-02-22", updatedAt: "2026-03-01",
    description: "Pre-existing test case: Validate that items added to cart persist when user closes and reopens the browser within 24 hours.",
    acceptanceCriteria: [
      "Add 3 items to cart and close browser",
      "Reopen browser within 24 hours and navigate to cart",
      "All 3 items should be present with correct quantities",
      "Cart total should match the previous session",
    ],
  },
  {
    id: "ji7", key: "AUTH-089", summary: "As a user, I want to login using Google OAuth so I can access my account quickly",
    type: "story", status: "In Progress", priority: "High", assignee: "John Doe", reporter: "Jane Smith",
    projectId: "jp2", sprintId: "js4", labels: ["oauth", "login"], storyPoints: 5, createdAt: "2026-03-05", updatedAt: "2026-03-16",
    description: "Users should see a 'Continue with Google' button on the login page. Clicking it should redirect to Google OAuth consent screen and upon approval, create or link the user account.",
    acceptanceCriteria: [
      "'Continue with Google' button is visible on login page",
      "Clicking redirects to Google OAuth consent screen",
      "New users get account created automatically",
      "Existing users get account linked to Google",
      "User is redirected to dashboard after successful auth",
    ],
  },
  {
    id: "ji8", key: "AUTH-090", summary: "As a user, I want to enable 2FA so my account is more secure",
    type: "story", status: "To Do", priority: "Medium", assignee: "Jane Smith", reporter: "Alex Johnson",
    projectId: "jp2", sprintId: "js4", labels: ["security", "2fa"], storyPoints: 8, createdAt: "2026-03-06", updatedAt: "2026-03-11",
    description: "Users should be able to enable two-factor authentication from their security settings. Support TOTP-based authenticator apps (Google Authenticator, Authy).",
    acceptanceCriteria: [
      "2FA toggle is available in security settings",
      "QR code is displayed for authenticator app scanning",
      "User must enter verification code to confirm setup",
      "Backup recovery codes are generated and shown once",
      "Subsequent logins require 2FA code after password",
    ],
  },
  {
    id: "ji9", key: "AUTH-091", summary: "Verify session token refresh flow",
    type: "test-case", status: "Done", priority: "High", assignee: "Alex Johnson", reporter: "John Doe",
    projectId: "jp2", sprintId: "js5", labels: ["session", "qa"], storyPoints: 3, createdAt: "2026-02-20", updatedAt: "2026-02-28",
    description: "Pre-existing test case: Validate that expired access tokens are silently refreshed using the refresh token without interrupting user experience.",
    acceptanceCriteria: [
      "Login and wait for access token to expire (15 min)",
      "Make an API call that requires authentication",
      "System should automatically use refresh token to get new access token",
      "API call should succeed without user seeing any error",
      "If refresh token is also expired, redirect to login",
    ],
  },
  {
    id: "ji10", key: "MAPI-056", summary: "As a mobile user, I want to view my order history",
    type: "story", status: "To Do", priority: "Medium", assignee: "Jane Smith", reporter: "Alex Johnson",
    projectId: "jp3", sprintId: "js6", labels: ["orders", "mobile"], storyPoints: 5, createdAt: "2026-03-07", updatedAt: "2026-03-13",
    description: "Mobile app users should be able to access their complete order history, with filters for date range and order status. Each order should be expandable to show line items.",
    acceptanceCriteria: [
      "Order history page shows list of all past orders",
      "Each order shows date, total, status, and item count",
      "User can filter by date range and status",
      "Tapping an order expands to show line item details",
      "Pull-to-refresh loads latest orders",
    ],
  },
  {
    id: "ji11", key: "MAPI-057", summary: "Push notification not received for order status update",
    type: "bug", status: "In Progress", priority: "High", assignee: "Alex Johnson", reporter: "Jane Smith",
    projectId: "jp3", sprintId: "js6", labels: ["notifications", "critical"], storyPoints: 3, createdAt: "2026-03-09", updatedAt: "2026-03-16",
    description: "Users report not receiving push notifications when their order status changes from 'Processing' to 'Shipped'. This works for other status transitions.",
    acceptanceCriteria: [
      "Push notification fires for Processing → Shipped transition",
      "Notification contains order ID and tracking link",
      "Works on both iOS and Android",
    ],
  },
  {
    id: "ji12", key: "DASH-034", summary: "As an admin, I want to manage user roles and permissions",
    type: "story", status: "In Progress", priority: "High", assignee: "John Doe", reporter: "Alex Johnson",
    projectId: "jp4", sprintId: "js7", labels: ["rbac", "admin"], storyPoints: 8, createdAt: "2026-03-05", updatedAt: "2026-03-17",
    description: "Admin users should be able to view all users, assign roles (Admin, Editor, Viewer), and configure granular permissions for each role.",
    acceptanceCriteria: [
      "Admin can view complete user list with current roles",
      "Admin can change user role via dropdown",
      "Role changes take effect immediately",
      "Permission matrix is editable per role",
      "Users receive email notification when role changes",
    ],
  },
];

export type JiraImportAs = "scenario" | "testcase";

export interface JiraImportMapping {
  issueId: string;
  importAs: JiraImportAs;
  targetTestType: TestType;
}

// ─── Jira Epic / Story types & mock data ────────────────────────────────────

export interface JiraEpic {
  id: string;
  key: string;
  name: string;
  createdAt: string;
}

export interface JiraStory {
  id: string;
  key: string;
  summary: string;
  epicId?: string;
}

export const mockJiraEpics: Record<string, JiraEpic[]> = {
  p1: [
    { id: "je1", key: "ECOM-138", name: "Checkout Flow — End-to-End", createdAt: "2026-02-20" },
    { id: "je2", key: "ECOM-100", name: "Cart Operations", createdAt: "2026-01-15" },
    { id: "je3", key: "ECOM-120", name: "Payment Integration", createdAt: "2026-02-01" },
  ],
  p2: [
    { id: "je4", key: "AUTH-050", name: "OAuth2 Flows", createdAt: "2026-02-10" },
    { id: "je5", key: "AUTH-070", name: "Security & 2FA", createdAt: "2026-02-15" },
  ],
  p3: [],
};

export const mockJiraStories: Record<string, JiraStory[]> = {
  p1: [
    { id: "js-p1-1", key: "ECOM-142", summary: "As a user, I want to add items to cart so I can purchase them later", epicId: "je2" },
    { id: "js-p1-2", key: "ECOM-143", summary: "As a user, I want to apply discount codes at checkout", epicId: "je1" },
    { id: "js-p1-3", key: "ECOM-144", summary: "Cart total miscalculated when quantity exceeds 99", epicId: "je2" },
    { id: "js-p1-4", key: "ECOM-145", summary: "Implement payment gateway webhook handler", epicId: "je3" },
    { id: "js-p1-5", key: "ECOM-146", summary: "Verify cart persistence across browser sessions", epicId: "je2" },
    { id: "js-p1-6", key: "ECOM-150", summary: "As a user, I want to review my order before confirming", epicId: "je1" },
    { id: "js-p1-7", key: "ECOM-151", summary: "As a user, I want to select a shipping method at checkout", epicId: "je1" },
    { id: "js-p1-8", key: "ECOM-160", summary: "Validate product search returns correct results" },
    { id: "js-p1-9", key: "ECOM-161", summary: "Ensure guest users can complete purchase without registration" },
  ],
  p2: [
    { id: "js-p2-1", key: "AUTH-089", summary: "As a user, I want to login using Google OAuth so I can access my account quickly", epicId: "je4" },
    { id: "js-p2-2", key: "AUTH-090", summary: "As a user, I want to enable 2FA so my account is more secure", epicId: "je5" },
    { id: "js-p2-3", key: "AUTH-091", summary: "Verify session token refresh flow", epicId: "je4" },
    { id: "js-p2-4", key: "AUTH-092", summary: "As a user, I want to login using GitHub OAuth", epicId: "je4" },
    { id: "js-p2-5", key: "AUTH-095", summary: "Test password reset email delivery and link expiry" },
  ],
  p3: [],
};

// ─── Config / Project Details types & mock data ─────────────────────────────

export interface ProjectConfig {
  id: string;
  name: string;
  description: string;
  status: "active" | "archived";
  createdAt: string;
  createdBy: string;
  frameworks: string[];
  defaultTestType: TestType;
  defaultMode: GenerateMode;
  jiraConnected: boolean;
  jiraInstanceUrl: string;
  jiraProjectKey: string;
  attachments: ProjectAttachment[];
  stats: ProjectStats;
  activityLog: ActivityLogEntry[];
  members: ProjectMember[];
}

export interface ProjectAttachment {
  id: string;
  name: string;
  size: string;
  type: "pdf" | "doc" | "xlsx" | "png" | "txt" | "csv";
  uploadedAt: string;
  uploadedBy: string;
}

export interface ProjectStats {
  totalScenarios: number;
  totalTestCases: number;
  totalScripts: number;
  scenariosByCategory: { positive: number; negative: number; edgeCase: number };
  scriptsByFramework: { python: number };
  testsByType: { ui: number; api: number };
  weeklyActivity: { week: string; scenarios: number; testCases: number; scripts: number }[];
}

export interface ActivityLogEntry {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  detail: string;
}

export interface ProjectMember {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: "Owner" | "Editor" | "Viewer";
  joinedAt: string;
}

export const mockProjectConfigs: Record<string, ProjectConfig> = {
  p1: {
    id: "p1",
    name: "E-Commerce App",
    description: "End-to-end testing suite for the e-commerce platform covering checkout flow, cart operations, user authentication, and payment gateway integrations. Includes both UI and API test coverage with Python-based automation scripts.",
    status: "active",
    createdAt: "2026-01-15",
    createdBy: "John Doe",
    frameworks: ["Python"],
    defaultTestType: "ui",
    defaultMode: "scenario-testcase",
    jiraConnected: true,
    jiraInstanceUrl: "https://spantest-team.atlassian.net",
    jiraProjectKey: "ECOM",
    attachments: [
      { id: "att1", name: "PRD - Checkout Flow v2.pdf", size: "2.4 MB", type: "pdf", uploadedAt: "2026-02-15", uploadedBy: "John Doe" },
      { id: "att2", name: "API Specification.xlsx", size: "840 KB", type: "xlsx", uploadedAt: "2026-02-20", uploadedBy: "Alex Johnson" },
      { id: "att3", name: "User Stories - Sprint 14.doc", size: "1.1 MB", type: "doc", uploadedAt: "2026-03-05", uploadedBy: "Jane Smith" },
      { id: "att4", name: "Wireframes - Payment Page.png", size: "3.2 MB", type: "png", uploadedAt: "2026-03-08", uploadedBy: "John Doe" },
    ],
    stats: {
      totalScenarios: 38,
      totalTestCases: 54,
      totalScripts: 32,
      scenariosByCategory: { positive: 18, negative: 14, edgeCase: 6 },
      scriptsByFramework: { python: 32 },
      testsByType: { ui: 36, api: 18 },
      weeklyActivity: [
        { week: "Feb 3", scenarios: 4, testCases: 6, scripts: 2 },
        { week: "Feb 10", scenarios: 6, testCases: 8, scripts: 4 },
        { week: "Feb 17", scenarios: 3, testCases: 5, scripts: 3 },
        { week: "Feb 24", scenarios: 5, testCases: 7, scripts: 5 },
        { week: "Mar 3", scenarios: 8, testCases: 12, scripts: 6 },
        { week: "Mar 10", scenarios: 7, testCases: 9, scripts: 7 },
        { week: "Mar 17", scenarios: 5, testCases: 7, scripts: 5 },
      ],
    },
    activityLog: [
      { id: "al1", action: "Generated Scripts", user: "John Doe", timestamp: "2026-03-17 14:32", detail: "5 Python scripts from Login Module scenarios" },
      { id: "al2", action: "Saved to Repository", user: "Jane Smith", timestamp: "2026-03-17 11:15", detail: "3 test cases saved to Checkout Flow / Payment Gateway" },
      { id: "al3", action: "Imported from Jira", user: "Alex Johnson", timestamp: "2026-03-16 16:48", detail: "4 stories imported from ECOM Sprint 14" },
      { id: "al4", action: "Generated Scenarios", user: "John Doe", timestamp: "2026-03-16 10:22", detail: "8 scenarios generated for cart operations user story" },
      { id: "al5", action: "Updated Project", user: "John Doe", timestamp: "2026-03-15 09:00", detail: "Updated project test configuration settings" },
      { id: "al6", action: "Generated Test Cases", user: "Jane Smith", timestamp: "2026-03-14 15:30", detail: "12 test cases generated across 5 scenarios" },
      { id: "al7", action: "Uploaded Attachment", user: "John Doe", timestamp: "2026-03-08 13:45", detail: "Wireframes - Payment Page.png uploaded" },
    ],
    members: [
      { id: "m1", name: "John Doe", email: "john.doe@spantest.io", initials: "JD", role: "Owner", joinedAt: "2026-01-15" },
      { id: "m2", name: "Jane Smith", email: "jane.smith@spantest.io", initials: "JS", role: "Editor", joinedAt: "2026-01-20" },
      { id: "m3", name: "Alex Johnson", email: "alex.j@spantest.io", initials: "AJ", role: "Editor", joinedAt: "2026-02-01" },
    ],
  },
  p2: {
    id: "p2",
    name: "Auth Service",
    description: "Comprehensive test coverage for the authentication microservice including OAuth2 flows, session management, 2FA, and API security endpoints.",
    status: "active",
    createdAt: "2026-02-10",
    createdBy: "Jane Smith",
    frameworks: ["Python"],
    defaultTestType: "api",
    defaultMode: "scenario-testcase",
    jiraConnected: true,
    jiraInstanceUrl: "https://spantest-team.atlassian.net",
    jiraProjectKey: "AUTH",
    attachments: [
      { id: "att5", name: "OAuth2 Flow Diagram.pdf", size: "1.8 MB", type: "pdf", uploadedAt: "2026-02-12", uploadedBy: "Jane Smith" },
      { id: "att6", name: "Security Requirements.doc", size: "920 KB", type: "doc", uploadedAt: "2026-02-18", uploadedBy: "Alex Johnson" },
    ],
    stats: {
      totalScenarios: 28,
      totalTestCases: 54,
      totalScripts: 28,
      scenariosByCategory: { positive: 12, negative: 10, edgeCase: 6 },
      scriptsByFramework: { python: 28 },
      testsByType: { ui: 18, api: 36 },
      weeklyActivity: [
        { week: "Feb 10", scenarios: 5, testCases: 8, scripts: 3 },
        { week: "Feb 17", scenarios: 4, testCases: 7, scripts: 4 },
        { week: "Feb 24", scenarios: 6, testCases: 10, scripts: 5 },
        { week: "Mar 3", scenarios: 5, testCases: 12, scripts: 6 },
        { week: "Mar 10", scenarios: 4, testCases: 9, scripts: 5 },
        { week: "Mar 17", scenarios: 4, testCases: 8, scripts: 5 },
      ],
    },
    activityLog: [
      { id: "al8", action: "Generated Scripts", user: "Jane Smith", timestamp: "2026-03-17 10:00", detail: "4 Python scripts for OAuth2 flow" },
      { id: "al9", action: "Imported from Jira", user: "Alex Johnson", timestamp: "2026-03-16 14:20", detail: "2 stories imported from AUTH Sprint 8" },
    ],
    members: [
      { id: "m4", name: "Jane Smith", email: "jane.smith@spantest.io", initials: "JS", role: "Owner", joinedAt: "2026-02-10" },
      { id: "m5", name: "John Doe", email: "john.doe@spantest.io", initials: "JD", role: "Editor", joinedAt: "2026-02-12" },
      { id: "m6", name: "Alex Johnson", email: "alex.j@spantest.io", initials: "AJ", role: "Viewer", joinedAt: "2026-02-15" },
    ],
  },
  p3: {
    id: "p3",
    name: "Mobile API",
    description: "API testing project for the mobile application backend covering user endpoints, order management, push notifications, and real-time sync features.",
    status: "active",
    createdAt: "2026-03-01",
    createdBy: "Alex Johnson",
    frameworks: ["Python"],
    defaultTestType: "api",
    defaultMode: "scenario-only",
    jiraConnected: false,
    jiraInstanceUrl: "",
    jiraProjectKey: "",
    attachments: [
      { id: "att7", name: "API Endpoints List.csv", size: "120 KB", type: "csv", uploadedAt: "2026-03-02", uploadedBy: "Alex Johnson" },
    ],
    stats: {
      totalScenarios: 22,
      totalTestCases: 34,
      totalScripts: 29,
      scenariosByCategory: { positive: 10, negative: 8, edgeCase: 4 },
      scriptsByFramework: { python: 29 },
      testsByType: { ui: 8, api: 26 },
      weeklyActivity: [
        { week: "Mar 3", scenarios: 8, testCases: 12, scripts: 10 },
        { week: "Mar 10", scenarios: 7, testCases: 11, scripts: 10 },
        { week: "Mar 17", scenarios: 7, testCases: 11, scripts: 9 },
      ],
    },
    activityLog: [
      { id: "al10", action: "Generated Scenarios", user: "Alex Johnson", timestamp: "2026-03-17 09:15", detail: "6 scenarios for push notification user story" },
    ],
    members: [
      { id: "m7", name: "Alex Johnson", email: "alex.j@spantest.io", initials: "AJ", role: "Owner", joinedAt: "2026-03-01" },
      { id: "m8", name: "Jane Smith", email: "jane.smith@spantest.io", initials: "JS", role: "Editor", joinedAt: "2026-03-03" },
    ],
  },
};

export const FILE_TYPE_ICONS: Record<string, { color: string; bg: string }> = {
  pdf: { color: "#cf1322", bg: "#fff1f0" },
  doc: { color: "#1677ff", bg: "#e8f4fd" },
  xlsx: { color: "#15803d", bg: "#f0fdf4" },
  png: { color: "#d46b08", bg: "#fff7e6" },
  txt: { color: "#8b87a0", bg: "#f5f4f8" },
  csv: { color: "#15803d", bg: "#f0fdf4" },
};

// ─── Per-project Repository data ────────────────────────────────────────────

export const projectRepoFolders: Record<string, RepoFolder[]> = {
  p1: mockRepoFolders,
  p2: [
    { id: "rf-p2-1", name: "OAuth2 Tests", parentId: null, createdAt: "2026-02-12" },
    { id: "rf-p2-2", name: "Session Tests", parentId: null, createdAt: "2026-02-18" },
  ],
  p3: [],
};

export const projectRepoItems: Record<string, RepoItem[]> = {
  p1: mockRepoItems,
  p2: [
    {
      id: "ri-p2-1", name: "Verify Google OAuth login redirects correctly", type: "scenario", testType: "ui",
      priority: "High", category: "Positive", folderId: "rf-p2-1", savedAt: "2026-03-10", savedBy: "Jane Smith", stepsCount: 3,
      scenario: mockGeneratedScenarios[0],
    },
    {
      id: "ri-p2-2", name: "Verify session token refresh flow", type: "testcase", testType: "api",
      priority: "High", category: "Positive", folderId: "rf-p2-2", savedAt: "2026-03-12", savedBy: "Alex Johnson", stepsCount: 1,
      scenario: mockApiScenarios[0],
    },
  ],
  p3: [],
};

// ─── Per-project Jira connection & data ─────────────────────────────────────

export interface ProjectJiraConfig {
  connected: boolean;
  connection: JiraConnection | null;
  projects: JiraProject[];
  sprints: JiraSprint[];
  issues: JiraIssue[];
}

export const projectJiraData: Record<string, ProjectJiraConfig> = {
  p1: {
    connected: true,
    connection: mockJiraConnection,
    projects: mockJiraProjects.filter((p) => p.key === "ECOM"),
    sprints: mockJiraSprints.filter((s) => ["jp1"].includes(s.projectId)),
    issues: mockJiraIssues.filter((i) => i.projectId === "jp1"),
  },
  p2: {
    connected: true,
    connection: { ...mockJiraConnection, id: "jc2", connectedAt: "2026-03-12" },
    projects: mockJiraProjects.filter((p) => p.key === "AUTH"),
    sprints: mockJiraSprints.filter((s) => ["jp2"].includes(s.projectId)),
    issues: mockJiraIssues.filter((i) => i.projectId === "jp2"),
  },
  p3: {
    connected: false,
    connection: null,
    projects: [],
    sprints: [],
    issues: [],
  },
};