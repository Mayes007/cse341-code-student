const connectDB = require("./db");

async function setup() {
  const db = await connectDB();

  // Collections
  const users = db.collection("users");
  const sheets = db.collection("sheets");
  const slots = db.collection("slots");
  const claims = db.collection("claims");

  // 🟢 USERS
  const userResult = await users.insertOne({
    name: "John Doe",
    email: "john@example.com",
    phoneNumber: "555-0199",
    role: "Organizer"
  });

  // 🟢 SHEETS
  const sheetResult = await sheets.insertOne({
    title: "Ward Potluck",
    description: "Bring food to share",
    date: new Date(),
    location: "Church Building",
    createdBy: userResult.insertedId,
    createdAt: new Date()
  });

  // 🟢 SLOTS
  const slotResult = await slots.insertOne({
    sheetId: sheetResult.insertedId,
    label: "Main Dish",
    details: "Feeds 6 people",
    quantityNeeded: 3,
    createdAt: new Date()
  });

  // 🟢 CLAIMS
  await claims.insertOne({
    slotId: slotResult.insertedId,
    userId: userResult.insertedId,
    quantityClaimed: 1,
    claimedAt: new Date()
  });

  console.log("✅ Database setup complete!");
}

setup();