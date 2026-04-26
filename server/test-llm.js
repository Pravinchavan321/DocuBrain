const apiKey = 'AIzaSyB4servSh64N9-R27zWCvni-PXpUToiE5g';
const url = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;

async function testList() {
  try {
    console.log(`Listing models via fetch: ${url}`);
    const response = await fetch(url);
    const data = await response.json();
    if (response.ok) {
      console.log("Success:", JSON.stringify(data, null, 2));
    } else {
      console.error("Error:", JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error("Fetch failed:", error.message);
  }
}

testList();





