
import { chromium, Browser, Page } from 'playwright';

async function runTest() {
  console.log('🚀 Starting post feature integration test...');
  
  const browser: Browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page: Page = await context.newPage();
  
  try {
    // 1. Register a new user
    const email = `test-user-${Date.now()}@example.com`;
    const password = 'Password@123!';
    
    console.log(`👤 Registering new user: ${email}`);
    await page.goto('http://localhost:3000/register', { timeout: 60000 });
    
    // Fill registration form (adjust selectors based on actual UI)
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.fill('input[name="confirmPassword"]', password); // Assuming confirm password field
    
    // Submit registration
    // If button has specific text or ID, use it. Trying generic submit first.
    await page.click('button[type="submit"]');
    
    // Wait for navigation to dashboard or home (timeout 10s)
    await page.waitForURL('**/dashboard**', { timeout: 10000 }).catch(() => {
        console.log('⚠️ Navigation to dashboard timed out. Checking current URL...');
    });
    
    console.log(`📍 Current URL: ${page.url()}`);
    
    // If still on register page, maybe verification needed or error.
    if (page.url().includes('register')) {
        const error = await page.textContent('.text-red-500').catch(() => null);
        throw new Error(`Registration failed. Error visible: ${error}`);
    }

    // 2. Navigate to Posts
    console.log('📝 Navigating to Posts page...');
    await page.goto('http://localhost:3000/posts');
    
    // 3. Create New Post
    console.log('➕ Creating new post...');
    await page.click('text="New Post"');
    
    // Wait for dialog
    await page.waitForSelector('text="Create New Article"');
    
    // Fill Title
    await page.fill('input#postTitle', 'Automated Test Post');
    
    // Verify Slug auto-gen
    const slugValue = await page.inputValue('input#postSlug');
    if (slugValue !== 'automated-test-post') {
        throw new Error(`Slug generation failed. Expected "automated-test-post", got "${slugValue}"`);
    }
    console.log('✅ Slug auto-generated correctly.');

    // Fill other fields
    await page.fill('textarea#postExcerpt', 'This post was created by an automated test script.');
    await page.fill('input[placeholder*="http"]', 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74'); // Image
    
    // Select Category (assuming tech category exists and text is discernible)
    // Actually category selector might be complex. Checking if we can just click "Technology".
    // If not, skip category for now or try generic selector.
    try {
        await page.click('button:has-text("Technology")');
    } catch (e) {
        console.log('⚠️ Could not select category "Technology". Skipping.');
    }

    // Fill Editor Content
    // Tiptap editor is contenteditable.
    await page.locator('.ProseMirror').fill('This is the content of the automated test post.');
    
    // Submit
    await page.click('button:has-text("Create Post")');
    
    // Wait for success toast or dialog verify
    await page.waitForSelector('text="Post created!"', { timeout: 5000 }).catch(() => console.log('⚠️ Success toast not detected (might be fast).'));
    
    // Wait for dialog create to disappear
    await page.waitForSelector('text="Create New Article"', { state: 'hidden' });
    
    // 4. Verify Post in List
    console.log('🔍 Verifying post in list...');
    await page.reload();
    await page.waitForSelector('text="Automated Test Post"');
    console.log('✅ Post found in list.');
    
    // 5. Edit Post
    console.log('✏️ Editing post...');
    // Find the row with title and click edit button (eye icon)
    // Assuming table structure.
    const row = page.locator('tr', { hasText: 'Automated Test Post' });
    const editButton = row.locator('a[href*="/posts/"]'); // Eye icon usually link or button
    // But in the code it was `Link` component wrapping the eye icon?
    // Let's check `posts/page.tsx` again?
    // It was: <Button variant="ghost" size="icon" asChild><Link href={`/posts/${post.id}`}><Eye .../></Link></Button>
    
    if (await editButton.count() > 0) {
        await editButton.click();
    } else {
        // Fallback: click the eye icon directly if not an anchor logic
        await row.locator('svg.lucide-eye').click();
    }
    
    // Wait for Edit Page
    await page.waitForSelector('text="Edit Post"');
    
    // Verify Fields
    const editSlug = await page.inputValue('input#editSlug');
    if (editSlug !== 'automated-test-post') {
        throw new Error(`Edit page slug mismatch. Expected "automated-test-post", got "${editSlug}"`);
    }
    console.log('✅ Edit page loaded with correct slug.');
    
    // Update Title
    await page.fill('input#editTitle', 'Updated Test Post');
    
    // Verify Slug does NOT change
    const newSlug = await page.inputValue('input#editSlug');
    if (newSlug !== 'automated-test-post') {
        throw new Error(`Slug changed automatically on edit! Expected "automated-test-post", got "${newSlug}"`);
    }
    console.log('✅ Slug remained stable during title edit.');
    
    // Save
    await page.click('button:has-text("Save Changes")'); // Or button with Save icon
    // Code says: <Button type="submit"> ... Save Changes </Button> ?
    // Let's check `posts/[id]/page.tsx`.
    // It has a submit button. Text might be "Save Changes" or similar.
    // I'll assume "Save Changes" or look for type="submit".
    
    await page.locator('button[type="submit"]').click();
    
    await page.waitForSelector('text="Post updated!"', { timeout: 5000 });
    console.log('✅ Post update success.');

    console.log('🎉 Integration test passed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runTest();
