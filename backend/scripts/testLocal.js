import { initLocalStore, saveLocalMessage, getLocalMessages, getLocalProjects, incrementLocalStat, getLocalStats } from "../data/localStore.js";

async function testBackend() {
  console.log("1. Initializing local store...");
  await initLocalStore();
  console.log("✓ Local store initialized.");

  console.log("2. Testing Project Fetch...");
  const projects = await getLocalProjects();
  console.log(`✓ Fetched ${projects.length} projects.`);

  console.log("3. Testing Contact Message Save...");
  const msg = await saveLocalMessage({
    name: "Aman Sharma",
    email: "aman@example.com",
    subject: "Hiring for Full Stack Role",
    message: "Hi Lucky, we loved your portfolio and would like to interview you.",
  });
  console.log(`✓ Saved message ID: ${msg._id}`);

  console.log("4. Testing Contact Messages Retrieval...");
  const messages = await getLocalMessages();
  console.log(`✓ Total messages now: ${messages.length}`);

  console.log("5. Testing Stats Increment...");
  await incrementLocalStat("visits");
  await incrementLocalStat("resumeDownloads");
  const stats = await getLocalStats();
  console.log(`✓ Stats: Visits=${stats.visits}, ResumeDownloads=${stats.resumeDownloads}`);

  console.log("\nALL BACKEND STORAGE & LOGIC TESTS PASSED SUCCESSFULLY!");
}

testBackend().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});

