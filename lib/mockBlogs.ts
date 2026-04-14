export interface Blog {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  date: string;
  category: "Technology" | "Business" | "Case Study" | "Engineering" | "Leadership";
  author: string;
  featured_image?: string;
  readTime?: number;
}

export const mockBlogs: Blog[] = [
  {
    id: 1,
    slug: "building-scalable-erp-systems-africa",
    title: "Building Scalable ERP Systems for African Enterprises",
    excerpt: "Discover how to design enterprise resource planning systems that handle Africa's unique operational complexity.",
    date: "2025-04-10",
    category: "Engineering",
    author: "Alex Muringo",
    featured_image: "/graben-academy-website-by-sybella.png",
    readTime: 8
  },
  {
    id: 2,
    slug: "digital-transformation-journey",
    title: "The Digital Transformation Journey: Lessons from African Leaders",
    excerpt: "Real stories from companies that successfully transformed their operations using custom software solutions.",
    date: "2025-04-05",
    category: "Case Study",
    author: "Priya Sharma",
    featured_image: "/developer-reviewing-code.png",
    readTime: 6
  },
  {
    id: 3,
    slug: "future-of-african-saas",
    title: "The Future of SaaS in Africa: Opportunities & Challenges",
    excerpt: "Exploring how SaaS platforms are reshaping business operations across the continent.",
    date: "2025-03-28",
    category: "Technology",
    author: "David Kimani",
    readTime: 7
  },
  {
    id: 4,
    slug: "best-practices-api-design",
    title: "API Design Best Practices for High-Performance Systems",
    excerpt: "Learn how to design APIs that scale, perform, and maintain compatibility across evolving systems.",
    date: "2025-03-20",
    category: "Engineering",
    author: "Sophia Chen",
    readTime: 10
  },
  {
    id: 5,
    slug: "payment-integration-challenges",
    title: "Navigating Payment Integration Challenges in Emerging Markets",
    excerpt: "Technical and strategic insights on integrating multiple payment systems in African e-commerce platforms.",
    date: "2025-03-15",
    category: "Technology",
    author: "James Okonkwo",
    readTime: 9
  },
  {
    id: 6,
    slug: "thought-leadership-innovation",
    title: "Thought Leadership in Tech: Building Trust Through Innovation",
    excerpt: "Why positioning your company as an industry leader matters and how to achieve it.",
    date: "2025-03-10",
    category: "Leadership",
    author: "Maya Patel",
    readTime: 5
  },
  {
    id: 7,
    slug: "infrastructure-optimization",
    title: "Infrastructure Optimization: Reducing Costs While Scaling Performance",
    excerpt: "Proven strategies for optimizing cloud infrastructure and reducing operational expenses.",
    date: "2025-03-05",
    category: "Business",
    author: "Emmanuel Okafor",
    readTime: 11
  },
  {
    id: 8,
    slug: "mobile-first-development",
    title: "Mobile-First Development Strategy for African Markets",
    excerpt: "Why mobile-first isn't just a trend—it's essential for reaching African users effectively.",
    date: "2025-02-28",
    category: "Engineering",
    author: "Zara Hassan",
    readTime: 7
  },
  {
    id: 9,
    slug: "data-security-compliance",
    title: "Data Security & Compliance in African SaaS",
    excerpt: "Understanding regulatory requirements and implementing security best practices across Africa.",
    date: "2025-02-20",
    category: "Technology",
    author: "Christopher Mwangi",
    readTime: 12
  },
  {
    id: 10,
    slug: "team-scaling-success",
    title: "Scaling Your Engineering Team: Lessons from Building Sybella",
    excerpt: "How to build and scale high-performing teams in the African tech ecosystem.",
    date: "2025-02-15",
    category: "Leadership",
    author: "Oluwatoyin Adeyemi",
    readTime: 8
  }
];