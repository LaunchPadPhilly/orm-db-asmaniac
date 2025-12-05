import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { GET as getProjects, POST as createProject } from '../app/api/projects/route.js';
import { GET as getProject, PUT as updateProject, DELETE as deleteProject } from '../app/api/projects/[id]/route.js';

const prisma = new PrismaClient();

// Helper to create a mock Request
function createMockRequest(method, body = null, params = {}) {
  return {
    method,
    json: async () => body,
    headers: new Headers(),
    ...params
  };
}

// Helper to extract JSON from NextResponse
async function getResponseData(response) {
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

// Test data
const testProject = {
  title: "Test Portfolio Website",
  description: "A test portfolio website built with Next.js",
  imageUrl: "/test-project.jpg",
  projectUrl: "https://test-portfolio.vercel.app",
  githubUrl: "https://github.com/testuser/portfolio",
  technologies: ["Next.js", "Tailwind CSS", "React"]
};

describe('API Routes - Projects', () => {
  // Clean up test data before and after each test
  // Use specific prefixes to avoid interfering with other tests
  beforeEach(async () => {
    // Clean up any existing API test data (but not "Test DB" which is for db.test.js)
    await prisma.project.deleteMany({
      where: {
        OR: [
          { title: { contains: "Test Portfolio Website" } },
          { title: { contains: "Test Minimal Project" } },
          { title: { contains: "Updated Test Project" } },
          { title: { contains: "Test Project 1" } },
          { title: { contains: "Test Project 2" } }
        ]
      }
    });
  });

  afterEach(async () => {
    // Clean up test data after each test
    await prisma.project.deleteMany({
      where: {
        OR: [
          { title: { contains: "Test Portfolio Website" } },
          { title: { contains: "Test Minimal Project" } },
          { title: { contains: "Updated Test Project" } },
          { title: { contains: "Test Project 1" } },
          { title: { contains: "Test Project 2" } }
        ]
      }
    });
  });

  describe('GET /api/projects', () => {
    it('should return an empty array when no projects exist', async () => {
      // Clean up all API test projects first
      await prisma.project.deleteMany({
        where: {
          OR: [
            { title: { contains: "Test Portfolio Website" } },
            { title: { contains: "Test Minimal Project" } },
            { title: { contains: "Updated Test Project" } },
            { title: { contains: "Test Project 1" } },
            { title: { contains: "Test Project 2" } }
          ]
        }
      });

      const request = createMockRequest('GET');
      const response = await getProjects(request);
      
      expect(response.status).toBe(200);
      
      const data = await getResponseData(response);
      expect(Array.isArray(data)).toBe(true);
      // Check that API test projects are not in the response
      const apiTestProjects = data.filter(p => 
        p.title && (
          p.title.includes("Test Portfolio Website") ||
          p.title.includes("Test Minimal Project") ||
          p.title.includes("Updated Test Project") ||
          p.title.includes("Test Project 1") ||
          p.title.includes("Test Project 2")
        )
      );
      expect(apiTestProjects.length).toBe(0);
    });

    it('should return all projects when projects exist', async () => {
      // First create a test project
      const createdProject = await prisma.project.create({
        data: testProject
      });

      const request = createMockRequest('GET');
      const response = await getProjects(request);
      expect(response.status).toBe(200);
      
      const data = await getResponseData(response);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThanOrEqual(1);
      
      const foundProject = data.find(p => p.id === createdProject.id);
      expect(foundProject).toBeDefined();
      expect(foundProject.title).toBe(testProject.title);
      expect(foundProject.description).toBe(testProject.description);
    });

    it('should return projects in descending order by creation date', async () => {
      // Create multiple test projects
      const project1 = await prisma.project.create({
        data: { ...testProject, title: "Test Project 1" }
      });
      
      // Wait a bit to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 10));
      
      const project2 = await prisma.project.create({
        data: { ...testProject, title: "Test Project 2" }
      });

      const request = createMockRequest('GET');
      const response = await getProjects(request);
      const data = await getResponseData(response);
      
      const testProjects = data.filter(p => p.title.includes("Test Project"));
      expect(testProjects.length).toBe(2);
      
      // Should be in descending order (newest first)
      expect(new Date(testProjects[0].createdAt).getTime()).toBeGreaterThanOrEqual(
        new Date(testProjects[1].createdAt).getTime()
      );
    });
  });

  describe('POST /api/projects', () => {
    it('should create a new project with valid data', async () => {
      const request = createMockRequest('POST', testProject);
      const response = await createProject(request);

      expect(response.status).toBe(201);
      
      const data = await getResponseData(response);
      expect(data.title).toBe(testProject.title);
      expect(data.description).toBe(testProject.description);
      expect(data.imageUrl).toBe(testProject.imageUrl);
      expect(data.projectUrl).toBe(testProject.projectUrl);
      expect(data.githubUrl).toBe(testProject.githubUrl);
      expect(Array.isArray(data.technologies)).toBe(true);
      expect(data.technologies).toEqual(testProject.technologies);
      expect(data.id).toBeDefined();
      expect(data.createdAt).toBeDefined();
      expect(data.updatedAt).toBeDefined();
    });

    it('should handle missing optional fields', async () => {
      const minimalProject = {
        title: "Test Minimal Project",
        description: "A minimal test project",
        technologies: ["JavaScript"]
      };

      const request = createMockRequest('POST', minimalProject);
      const response = await createProject(request);

      expect(response.status).toBe(201);
      
      const data = await getResponseData(response);
      expect(data.title).toBe(minimalProject.title);
      expect(data.description).toBe(minimalProject.description);
      expect(data.imageUrl).toBeNull();
      expect(data.projectUrl).toBeNull();
      expect(data.githubUrl).toBeNull();
    });

    it('should return 400 for missing required fields', async () => {
      const invalidProject = {
        description: "Missing title"
      };

      const request = createMockRequest('POST', invalidProject);
      const response = await createProject(request);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/projects/[id]', () => {
    it('should return a specific project by ID', async () => {
      const createdProject = await prisma.project.create({
        data: testProject
      });

      const request = createMockRequest('GET');
      const response = await getProject(request, { params: { id: createdProject.id.toString() } });
      expect(response.status).toBe(200);
      
      const data = await getResponseData(response);
      expect(data.id).toBe(createdProject.id);
      expect(data.title).toBe(testProject.title);
      expect(data.description).toBe(testProject.description);
    });

    it('should return 404 for non-existent project', async () => {
      const request = createMockRequest('GET');
      const response = await getProject(request, { params: { id: '99999' } });
      expect(response.status).toBe(404);
      
      const data = await getResponseData(response);
      expect(data.error).toBe('Project not found');
    });

    it('should return 400 for invalid ID', async () => {
      const request = createMockRequest('GET');
      const response = await getProject(request, { params: { id: 'invalid-id' } });
      expect(response.status).toBe(400);
      
      const data = await getResponseData(response);
      expect(data.error).toBe('Invalid project ID');
    });
  });

  describe('PUT /api/projects/[id]', () => {
    it('should update an existing project', async () => {
      const createdProject = await prisma.project.create({
        data: testProject
      });

      const updatedData = {
        title: "Updated Test Project",
        description: "Updated description",
        technologies: ["Next.js", "TypeScript"]
      };

      const request = createMockRequest('PUT', updatedData);
      const response = await updateProject(request, { params: { id: createdProject.id.toString() } });

      expect(response.status).toBe(200);
      
      const data = await getResponseData(response);
      expect(data.title).toBe(updatedData.title);
      expect(data.description).toBe(updatedData.description);
      expect(data.technologies).toEqual(updatedData.technologies);
      expect(data.id).toBe(createdProject.id);
    });

    it('should return 404 for updating non-existent project', async () => {
      const updatedData = { title: "Updated Title" };

      const request = createMockRequest('PUT', updatedData);
      const response = await updateProject(request, { params: { id: '99999' } });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/projects/[id]', () => {
    it('should delete an existing project', async () => {
      const createdProject = await prisma.project.create({
        data: testProject
      });

      const request = createMockRequest('DELETE');
      const response = await deleteProject(request, { params: { id: createdProject.id.toString() } });

      expect(response.status).toBe(200);
      
      const data = await getResponseData(response);
      expect(data.message).toBe('Project deleted successfully');

      // Verify project is actually deleted
      const deletedProject = await prisma.project.findUnique({
        where: { id: createdProject.id }
      });
      expect(deletedProject).toBeNull();
    });

    it('should return 404 for deleting non-existent project', async () => {
      const request = createMockRequest('DELETE');
      const response = await deleteProject(request, { params: { id: '99999' } });

      expect(response.status).toBe(404);
    });
  });
});
