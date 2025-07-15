// Test script to verify SEO implementation
// Run with: node test-seo.js

const fetch = require('node-fetch');

async function testPostSEO() {
  const NEXT_PUBLIC_NEXUS = process.env.NEXT_PUBLIC_NEXUS || 'https://nexus.pubky.app';
  const BASE_URL = `${NEXT_PUBLIC_NEXUS}`;
  
  // Test with a sample post (you'll need to replace with actual pubky and postId)
  const testPubky = 'your-test-pubky';
  const testPostId = 'your-test-post-id';
  
  try {
    console.log('🧪 Testing SEO metadata generation...\n');
    
    // Test 1: Fetch post data
    console.log('1. Fetching post data...');
    const response = await fetch(`${BASE_URL}/v0/post/${testPubky}/${testPostId}`);
    
    if (!response.ok) {
      console.log('❌ Failed to fetch post data');
      return;
    }
    
    const post = await response.json();
    console.log('✅ Post data fetched successfully');
    console.log(`   Post kind: ${post?.details?.kind}`);
    console.log(`   Content length: ${post?.details?.content?.length || 0} characters\n`);
    
    // Test 2: Generate SEO metadata
    console.log('2. Generating SEO metadata...');
    
    let title = 'Default Title';
    let description = 'Default description';
    
    if (post?.details?.content) {
      const profileName = post?.details?.author || 'Unknown User';
      title = `${profileName} on Pubky`;
      description = post.details.content.substring(0, 100) + (post.details.content.length > 100 ? '...' : '');
    }
    
    console.log('✅ SEO metadata generated:');
    console.log(`   Title: ${title}`);
    console.log(`   Description: ${description}\n`);
    
    // Test 3: Check for attachments
    console.log('3. Checking for attachments...');
    if (post?.details?.attachments?.length > 0) {
      console.log(`✅ Found ${post.details.attachments.length} attachment(s)`);
      console.log(`   First attachment: ${post.details.attachments[0]}`);
    } else {
      console.log('ℹ️  No attachments found');
    }
    
    console.log('\n🎉 SEO test completed successfully!');
    console.log('\nTo verify in browser:');
    console.log('1. Visit a post URL in your app');
    console.log('2. Right-click → View Page Source');
    console.log('3. Look for <title> and <meta> tags in the <head> section');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testPostSEO(); 