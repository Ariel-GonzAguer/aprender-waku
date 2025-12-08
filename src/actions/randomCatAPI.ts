export async function fetchRandomCat(): Promise<string | null> {
  "use server";
  try {
    const response = await fetch("https://api.thecatapi.com/v1/images/search");
    const data = await response.json();
    console.log("Random cat data:", data);
    return data[0].url;
  } catch (error) {
    console.error("Error fetching random cat:", error);
    return null;
  }
}
