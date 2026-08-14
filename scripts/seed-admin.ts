/**
 * Seed script to create the first admin user
 * Run with: npm run seed
 *
 * Make sure you have MONGODB_URI in your .env.local file
 */

import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

// Default admin credentials
const DEFAULT_ADMIN = {
  id: uuidv4(),
  names: "System Administrator",
  email: "admin@sybellasystems.com",
  password: "Admin123!", // Change this after first login!
  role: "superadmin",
  isActive: true,
  permissions: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

async function seedAdmin() {
  if (!process.env.MONGODB_URI) {
    console.error("❌ Error: MONGODB_URI environment variable is not set");
    console.log("Please add MONGODB_URI to your .env.local file");
    process.exit(1);
  }

  const client = new MongoClient(process.env.MONGODB_URI, {
    tls: true,
    tlsAllowInvalidCertificates: false,
  });

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db();
    const collection = db.collection("staff_members");

    // Check if admin already exists
    const existingAdmin = await collection.findOne({
      email: DEFAULT_ADMIN.email,
    });
    if (existingAdmin) {
      console.log("⚠️  Admin user already exists!");
      console.log(`   Email: ${DEFAULT_ADMIN.email}`);
      console.log("\n📝 If you forgot your password, you can:");
      console.log("   1. Reset it through the database");
      console.log(
        "   2. Or delete the existing admin and run this script again",
      );
      await client.close();
      return;
    }

    // Check if any staff members exist
    const staffCount = await collection.countDocuments();
    if (staffCount > 0) {
      console.log(
        `⚠️  Warning: ${staffCount} staff member(s) already exist in the database.`,
      );
      console.log("   This script will still create the default admin user.");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.password, 10);

    // Insert the admin user
    const result = await collection.insertOne({
      ...DEFAULT_ADMIN,
      password: hashedPassword,
    });

    if (result.acknowledged) {
      console.log("\n✅ Admin user created successfully!");
      console.log("\n📋 Login Credentials:");
      console.log(`   Email: ${DEFAULT_ADMIN.email}`);
      console.log(`   Password: ${DEFAULT_ADMIN.password}`);
      console.log(
        "\n⚠️  IMPORTANT: Please change the password after your first login!",
      );
      console.log("\n🔗 Login URL: http://localhost:3000/signin");
    } else {
      console.error("❌ Failed to create admin user");
    }
  } catch (error: any) {
    console.error("❌ Error seeding admin user:", error.message);
    if (error.message.includes("authentication")) {
      console.log(
        "\n💡 Tip: Check your MongoDB connection string and credentials",
      );
    }
    process.exit(1);
  } finally {
    await client.close();
    console.log("\n✅ Database connection closed");
  }
}

// Run the seed function
seedAdmin();
